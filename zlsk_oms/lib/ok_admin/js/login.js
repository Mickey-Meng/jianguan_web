let okUtils;
let constantUrl;
var getUserInfo = function() {
    var sysName = sfm.getSfmDataMgr().getData('sysConfig.sysName');
    okUtils.ajax({ url: constantUrl.stAuth.getUserInfo, param: { systemName: sysName } }).done(function(response) {
        var menuCookie = response.data.userAuth.menuCookie;
        var funCookie = response.data.userAuth.funCookie;
        var userInfo = response.data.userInfo;
        var userRole = response.data.roles;

        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        sessionStorage.setItem("userRole", JSON.stringify(userRole));
        sessionStorage.setItem("menus", JSON.stringify(menuCookie));
        sessionStorage.setItem("funs", JSON.stringify(funCookie));
        sessionStorage.setItem("homeFolder", sfm.getSfmDataMgr().getData('sysConfig.rootUrl'));
        var r = "";
        for (var i = 0; i < userRole.length; i++) {
            r += userRole[i].ID + ','
        }
        r = r.substring(0, r.length - 1);
        getMyMap(userInfo.ID, userInfo.GROUPID, r);
    });
};
var qId = "";
var getIds = function(res) {
    if (!res.length) {
        return;
    }
    for (var i = 0; i < res.length; i++) {
        qId += res[i].ID + ",";
        if (res[i].children) {
            getIds(res[i].children);
        }
    }

}
var getMyMap = function(userid, groupId, r) {
    var priority = sfm.getSfmDataMgr().getData('sysConfig.priority');
    okUtils.ajax({ "url": constantUrl.stMap.getMyMap, "param": { type: priority, userid: userid, groupId: groupId, rolesId: r } }).done(function(data1) {
        var d = data1.data.getMe;
        sessionStorage.setItem("mapData", JSON.stringify(d));
        sfm.initConfig();
        sfm.getConfig().onLogin();
    }).fail(function(error) {
        console.log(error)
    });

}



var appendAttr = function(list, key, value, attr) {
    if (!list) {
        return list;
    }
    for (var i = 0; i < list.length; i++) {
        if (list[i][key] == value) {
            var a = JSON.parse(attrbuites);
            for (var key in a) {
                list[i][key] = a[key];
            }
        }
    }
    return list;
}


layui.use(["form", "okGVerify", "okUtils", "constantUrl", "okLayer"], function() {
    let form = layui.form;
    let $ = layui.jquery;
    let okGVerify = layui.okGVerify;
    okUtils = layui.okUtils;
    constantUrl = layui.constantUrl;
    let okLayer = layui.okLayer;

    $(function() {
        var title = sfm.getSfmDataMgr().getData('sysConfig.docTitle');
        $('#login_title').html(title);
        var tk = localStorage.getItem('omstk');
        if (tk) {
            getUserInfo();
        }
    });

    /**
     * 初始化验证码
     */
    // let verifyCode = new okGVerify("#captchaImg");

    /**
     * 数据校验
     */
    form.verify({
        // password: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        // captcha: function (val) {
        //     if (verifyCode.validate(val) != "true") {
        //         return verifyCode.validate(val)
        //     }
        // }
    });

    /**
     * 表单提交
     */
    form.on("submit(login)", function(data) {
        okUtils.ajax({
            url: constantUrl.stAuth.login,
            param: data.field
        }).done(function(response) {
            if(response.token){
                okUtils.setCookie('token', response.token, 7);
                localStorage.setItem('omstk', response.token);
            }
            okLayer.msg.greenTick(response.msg + ",开始获取用户数据", function() {
                getUserInfo();
            })
        });
        return false;
    });

    /**
     * 表单input组件单击时
     */
    $("#login .input-item .layui-input").click(function(e) {
        e.stopPropagation();
        $(this).addClass("layui-input-focus").find(".layui-input").focus();
    });

    /**
     * 表单input组件获取焦点时
     */
    $("#login .layui-form-item .layui-input").focus(function() {
        $(this).parent().addClass("layui-input-focus");
    });

    /**
     * 表单input组件失去焦点时
     */
    $("#login .layui-form-item .layui-input").blur(function() {
        $(this).parent().removeClass("layui-input-focus");
        if ($(this).val() != "") {
            $(this).parent().addClass("layui-input-active");
        } else {
            $(this).parent().removeClass("layui-input-active");
        }
    });
});
