var fmid;
var dataId;
var templateId;
var tableName;
var boCodeName = {};
var dicMap;
var disabled = '';
var previewType; //preview (表单列表预览) formEdit(表单编辑) add(数据添加) edit（数据编辑） detail（数据详情）
var formData;

const formDicCode = ['singleSelect', 'mulSelect', 'drawSelect'];

var $;
var form;
var okUtils;
var laydate;
var constantUrl;

var viewer;
var scene;
var handler;

var usersList = [];
var rolesList = [];
var positionsList = [];
var groupsList = [];
var roleUserData = [];

function initForm(data) {
    let dataString = JSON.stringify(data);
    if (dataString) {
        formData = JSON.parse(dataString);
    }
}

layui.use(['element', 'form', 'okUtils', "okLayer", "layer", 'constantUrl', 'laydate'], function () {
    $ = layui.jquery;
    form = layui.form;
    okUtils = layui.okUtils;
    laydate = layui.laydate;
    constantUrl = layui.constantUrl;

    fmid = layui.okUtils.getUrlParameter('fmId');
    dataId = layui.okUtils.getUrlParameter('xxId');
    templateId = layui.okUtils.getUrlParameter('templateId');
    previewType = layui.okUtils.getUrlParameter('previewType');

    getUserSelect();
    if (previewType === 'formEdit') {
        getDicKey(formData);
    }else if (previewType === 'preview'){
        getDataByWeb()
    }else {
        initData();
    }
    // initMap();
});

var initMap = function () {
    $('#cesiumContainer').show();
    var point = {longitude:106.596437,latitude:26.459918,height:10000};
    viewer = zUtil.initCesium($,'cesiumContainer',{},point);
    locationUtil.initLocation(Cesium,viewer);
    datasource = zUtil.getDataSourceByName(Cesium,viewer,'mark');
};

var getDataByWeb = function () {
    okUtils.ajax({
        "url": constantUrl.stForm.easySelectByOrder,
        'param': {'table': 'zlsk_oms_form_fd', 'mapStr': JSON.stringify({'fmid': fmid}), 'order': 'asc'}
    }).done(function (data1) {
        if (data1.meow === 0) {
            getDicKey(data1.data)
        } else {
            layui.layer.alert('查询数据失败')
        }
    });
};

var getDicKey = function (formData) {
    let dics = '';
    if (previewType === 'formEdit'){
        for (let index in formData) {
            let option = formData[index].fdoptions;
            if (option.dic) {
                dics += option.dic + ",";
            }
        }
    }else {
        for (let index = 0; index < formData.length; index++) {
            let option = JSON.parse(formData[index].fdoptions);
            formData[index].fdoptions = option;
            if (option.dic) {
                dics += option.dic + ",";
            }
        }
    }
    dics = dics.substring(0, dics.length - 1);
    if (dics === '') {
        dicMap = [];
        initFormData(formData);
    } else {
        layui.okUtils.ajax({
            url: layui.constantUrl.stAuth.selectDicByParentKey,
            param: {keyStr: dics}
        }).done(function (data) {
            dicMap = data.data;
            initFormData(formData);
        });
    }
};

var initFormData = function (arrayData) {
    if (arrayData) {
        let obj = $('#previewForm');
        if (previewType === 'detail') disabled = 'disabled=""'; //查看时不能编辑
        if (previewType === 'formEdit'){
            for (let index in arrayData) {
                getItemData(arrayData,index,obj)
            }
        }else {
            for (let index = 0; index < arrayData.length; index++) {
                getItemData(arrayData,index,obj)
            }
        }

        getUserSelect(arrayData);

        if (previewType === 'add' || previewType === 'edit' ) {
            obj.append(
                '<div class="layui-form-item">\n' +
                '    <div class="layui-input-block">\n' +
                '        <button class="layui-btn" lay-submit lay-filter=' + previewType + '>立即提交</button>\n' +
                '    </div>\n' +
                '</div>');
        }
        form.render();
        form.val("previewForm", formData);

        form.on('submit(add)', function (data) {
            okUtils.ajax({
                'url': constantUrl.stForm.easyInsert,
                'param': {'table': tableName, 'mapStr': JSON.stringify(data.field)}
            }).done(function (data1) {
                if (data1.meow === 0) {
                    parent.parentFlag = JSON.stringify(data1.data);
                    parent.layer.close(parent.layer.getFrameIndex(window.name));
                } else {
                    layui.layer('警告 添加信息失败');
                }
            });
            return false;
        });

        form.on('submit(edit)', function (data) {
            okUtils.ajax({
                'url': constantUrl.stForm.easyUpdate,
                'param': {'clause':JSON.stringify({'gid':dataId}),'table': tableName, 'mapStr': JSON.stringify(data.field)}
            }).done(function (data1) {
                if (data1.meow === 0) {
                    parent.parentFlag = 1;
                    parent.layer.close(parent.layer.getFrameIndex(window.name));
                } else {
                    layui.layer('警告 添加信息失败');
                }
            });
            return false;
        });
    }
};

function getUserSelect(array) {
    getGroupData(function (group) {
        groupsList = group;
        getPositionData(function (position) {
            positionsList = position;
            getUsers(function () {
                if (array && array.length){
                    for (let index = 0; index < array.length; index++) {
                        let type = array[index].fdtype;
                        let options = array[index].fdoptions;
                        let data = [];
                        let text;
                        let value;
                        if (type && options && options.rtype){
                            switch (options.rtype) {
                                case '1':
                                    data = groupsList;
                                    text = 'NAME';
                                    value = 'ID';
                                    break;
                                case '2':
                                    data = positionsList;
                                    text = 'positionName';
                                    value = 'positionName';
                                    break;
                                case '3':
                                    data = rolesList;
                                    text = 'NAME';
                                    value = 'ID';
                                    break;
                            }
                            okUtils.adapterSelect('#selectLinkParent' + index,'',text,value,data,data,'');
                        }
                        $("#selectLinkParent" + index).on('click', 'select',function(){// todo 未解决：点击事件无效
                            let data = $('#selectLinkParent' + index).val();
                            let dataList = [];
                            if (data ){
                                switch (type) {
                                    case '1':
                                        dataList = getSelectedRole(usersList,'positionName',data);
                                        break;
                                    case '2':
                                        dataList = getSelectedRole(usersList,'positionName',data);
                                        break;
                                    case '3':
                                        if (roleUserData){
                                            for (let index = 0; index < roleUserData.length; index++) {
                                                if (roleUserData[index] && roleUserData.length > 0 && roleUserData[index][0].ID === data){
                                                    dataList = roleUserData[index];
                                                }
                                            }
                                        }
                                        break
                                }
                            }
                            okUtils.adapterSelect('#selectLinkChild' + index,'','NAME','NAME',dataList,dataList,'');
                        });
                    }
                }
            })
        })
    })
}

function getSelectedRole(dataList,name,data) {
    let result = [];
    for (let index = 0; index < data.length; index++) {
        if (dataList[index][name] === data){
            result.push(dataList[index]);
        }
    }
    return result;
}

var getItemData = function (arrayData,index,obj) {
    let cacheData;
    let type = arrayData[index].fdtype;
    let options = arrayData[index].fdoptions;
    let selectData;
    let defaultValue = options.defaultValue;
    let linkSelect = false;
    let childTitle = '';
    if (formDicCode.indexOf(type) !== -1) {
        if (options.selectCheckBox) {
            selectData = options.selectCheckBox;//默认值
        } else if (options.dic) {
            selectData = dicMap[options.dic];
            if (selectData && formData) {
                for (let idx = 0; idx < selectData.length; idx++) {
                    if (selectData[idx].key === formData[arrayData[index].code]) {
                        defaultValue = selectData[idx].value; //获取信息表填充数据
                    }
                }
            }
        } else if (options.rtype){
            linkSelect = true;
            childTitle = '用户';
        }
    }
    cacheData = {
        title: options.title,
        titleChild: childTitle,
        name: arrayData[index].code,
        select: selectData,
        index: index,
        defaultValue: defaultValue
    };
    switch (type) {
        case "text":
            generateTextHtml(cacheData, obj);
            break;
        case "singleSelect":
            generateSingleSelectHtml(cacheData, obj);
            break;
        case "mulSelect":
            generateMulSelect(cacheData, obj);
            break;
        case "drawSelect":
            if (linkSelect){
                generateLinkSelect(cacheData, obj);
            }else {
                generateDrawSelect(cacheData, obj);
            }
            break;
        case "timeSelect":
            generateTimeHtml(cacheData, obj);
            break;
        case "textarea":
            obj.append(
                "  <div class=\"layui-form-item layui-form-text\">\n" +
                "    <label class=\"layui-form-label\">" + title + "</label>\n" +
                "    <div class=\"layui-input-block\">\n" +
                "      <textarea placeholder=\"请输入内容\" class=\"layui-textarea\" name='" + name + "' id='textarea" + index + "' lay-verify='textarea" + index + "'></textarea>\n" +
                "    </div>\n" +
                "  </div>"
            );
            break;
    }
};

var generateTextHtml = function (object, obj) {
    obj.append(
        "  <div class=\"layui-form-item\">\n" +
        "    <label class='layui-form-label'>" + object.title + "</label>\n" +
        "    <div class=\"layui-input-block\">\n" +
        "      <input type=\"text\" name='" + object.name + "' id='input" + object.index + "'  autocomplete=\"off\" class=\"layui-input\" lay-filter='filter" + object.index + "'  " + disabled + ">\n" +
        "    </div>\n" +
        "  </div>"
    );
    if (object.defaultValue) {
        $('#input' + object.index).val(object.defaultValue);
    }
    if (object.promptData) {
        $('#input' + object.index).attr("placeholder", object.promptData)
    }
};

var generateSingleSelectHtml = function (object, obj) {
    obj.append(
        "  <div class=\"layui-form-item\">\n" +
        "    <label class=\"layui-form-label\">" + object.title + "</label>\n" +
        "    <div class=\"layui-input-block\" id='select" + object.index + "' name='" + object.name + "'>\n" +
        "    </div>\n" +
        "  </div>"
    );
    if (object.select) {
        for (let idx = 0; idx < object.select.length; idx++) {
            $('#select' + object.index).append(
                "<input type=\"radio\" name='select" + object.index + "'  value='" + object.select[idx].value + "' title='" + object.select[idx].name + "'  " + disabled + ">"
            )
        }
        if (object.defaultValue) {
            $("input[type=radio][name='select" + object.index + "'][value='" + object.defaultValue + "']").attr("checked", true);
        }
    }
};

var generateMulSelect = function (object, obj) {
    obj.append(
        "  <div class=\"layui-form-item\">\n" +
        "    <label class=\"layui-form-label\">" + object.title + "</label>\n" +
        "    <div class=\"layui-input-block\" id='select" + object.index + "' name='" + object.name + "'>\n" +
        "    </div>\n" +
        "  </div>"
    );
    if (object.select) {
        for (let idx = 0; idx < object.select.length; idx++) {
            let id = 'select" + index + ' - ' + idx + "';
            $('#select' + object.index).append(
                "<input type=\"checkbox\" name='select" + object.index + "' id='" + id + "'  value='" + object.select[idx].value + "' title='" + object.select[idx].name + "'  " + disabled + ">"
            );
            if (object.defaultValue && object.defaultValue === object.select[idx].value()) {
                $("#" + id).prop({"checked": true});
            }
        }
    }
};

var generateDrawSelect = function (object, obj) {
    obj.append(
        "  <div class=\"layui-form-item\">\n" +
        "    <label class=\"layui-form-label\">" + object.title + "</label>\n" +
        "    <div class=\"layui-input-block\" >\n" +
        "       <select name='" + object.name + "'  lay-search=\"\" lay-filter='select" + object.index + "' id='select" + object.index + "'  " + disabled + ">" +
        "    </div>\n" +
        "  </div>"
    );
    if (object.select) {
        for (let idx = 0; idx < object.select.length; idx++) {
            $('#select' + object.index).append(new Option(object.select[idx].name, object.select[idx].key))
        }
    }
    if (object.defaultValue) {
        $("#select" + object.index).val(object.defaultValue);
    }
};

function generateLinkSelect(object, obj) {
    obj.append(
        "  <div class=\"layui-form-item \" style='width: 45%;display: inline-block'>\n" +
        "    <label class=\"layui-form-label\">" + object.title + "</label>\n" +
        "    <div class=\"layui-input-block\" >\n" +
        "       <select name='lp" + object.name + "'  lay-search=\"\" lay-filter='selectLinkParent" + object.index + "' id='selectLinkParent" + object.index + "'  " + disabled + ">" +
        "    </div>\n" +
        "  </div>"
    );

    obj.append(
        "  <div class=\"layui-form-item\" style='width: 45%;display: inline-block'>\n" +
        // "    <label class=\"layui-form-label\">" + object.titleChild + "</label>\n" +
        "    <div class=\"layui-input-block\" >\n" +
        "       <select name='lc" + object.name + "'  lay-search=\"\" lay-filter='selectLinkChild" + object.index + "' id='selectLinkChild" + object.index + "'  " + disabled + ">" +
        "    </div>\n" +
        "  </div>"
    );
}

var generateTimeHtml = function (object, obj) {
    obj.append(
        "  <div class=\"layui-form-item\">\n" +
        "    <label class=\"layui-form-label\">" + object.title + "</label>\n" +
        "    <div class=\"layui-input-block\" >\n" +
        "       <input type=\"text\" name='" + object.name + "' id='dataSelect" + object.index + "' lay-verify='dateSelect" + object.index + "' placeholder=\"yyyy-MM-dd HH:mm:ss\" autocomplete=\"off\" class=\"layui-input\"  " + disabled + ">" +
        "    </div>\n" +
        "  </div>"
    );
    if (object.defaultValue == 0){
        laydate.render({
            elem: '#dataSelect' + object.index,
            format:'yyyy-MM-dd HH:mm:ss',
            value:new Date()
        });
    }else if (object.defaultValue) {
        laydate.render({
            elem: '#dataSelect' + object.index,
            format:'yyyy-MM-dd HH:mm:ss'
        });
        $('#input' + object.index).val(object.defaultValue);
    }else {
        laydate.render({
            elem: '#dataSelect' + object.index,
            format:'yyyy-MM-dd HH:mm:ss'
        });
    }
};

var initData = function () {
    layui.okUtils.ajax({
        url: layui.constantUrl.stForm.easySelect,
        data: {
            table: layui.constantUrl.stTable.table_data_template,
            mapStr: JSON.stringify({gid: templateId})
        }
    }).done(function (result) {
        if (result.meow === 0) {
            var dsid = result.data[0].dsid;
            layui.okUtils.ajax({
                url: layui.constantUrl.stForm.easySelect,
                data: {
                    table: layui.constantUrl.stTable.table_data_set,
                    mapStr: JSON.stringify({gid: dsid})
                }
            }).done(function (result) {
                if (result.meow === 0) {
                    tableName = result.data[0].tableName;
                    if (previewType === 'add') {
                        getDataByWeb();
                    } else {
                        okUtils.ajax({
                            'url': constantUrl.stForm.easySelect,
                            'param': {
                                'table': tableName,
                                'mapStr': JSON.stringify({'gid': dataId})
                            }
                        }).done(function (data1) {
                            if (data1.meow === 0 && data1.data && data1.data.length > 0) {
                                formData = data1.data[0];
                                getDataByWeb();
                            }
                        })
                    }
                }
            });
        }
    });
};

//设置角色部门等选择
var getGroupData = function (callback) {
    let groups = [];
    layui.okUtils.ajax({url:constantUrl.stAuth.selectGroup}).done(function (data1) {
        if (data1.meow === 0 && data1.data){
            groups = data1.data.getMe;
        }
        callback(groups);
    });
};

var getPositionData = function (callback) {
    let roles = [];
    layui.okUtils.ajax({url:constantUrl.stAuth.selectPosition}).done(function (data1) {
        if (data1.meow === 0 && data1.data) {
            roles = data1.data.getMe;
        }
        callback(roles);
    })
};

var getUsers = function (callback) {
    let userData = {};
    okUtils.ajax({url:constantUrl.stAuth.selectRole}).done(function (data1) {
        if (data1.meow ===0 && data1.data){
            let cache = data1.data.getMe;
            if (cache && cache.length > 0){
                $.each(cache,function (index,value) {
                    if (value.PARENTID !== -1){
                        rolesList.push(value);
                        okUtils.ajax({url:constantUrl.stAuth.getUsersByRoleAndGroup,param:{roleCode:value.CODE},returnDataAnyWay:true}).done(function (data2) {
                            if (data2.data && data2.data.length > 0){
                                let cacheList = [];
                                for (let idx = 0; idx < data2.data.length; idx++) {
                                    if (data2.data[idx].children && data2.data[idx].children.length > 0){
                                        for (let index1 = 0; index1 < data2.data[idx].children.length; index1++) {
                                            if (data2.data[idx].children[index1] && data2.data[idx].children[index1].children && data2.data[idx].children[index1].children.length > 0){
                                                for (let i = 0; i < data2.data[idx].children[index1].children.length; i++) {
                                                    let user = data2.data[idx].children[index1].children[i];
                                                    if (!userData[user.ID]){
                                                        userData[user.ID] = user;
                                                        usersList.push(user);
                                                        cacheList.push(user);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                roleUserData.push(cacheList);
                            }
                            if (index === cache.length - 1){
                                callback()
                            }
                        })
                    }
                });
            }
        }else {
            layer.alert('警告 查询角色失败')
        }
    });
};
