var $;
var form_bo_state;
var templateType = [];
var templateTypes;
var parentFlag;
layui.use(['tree', 'form', 'table', 'okUtils', "okLayer", 'constantUrl', 'zTable','xmSelect'],function () {
    $ = layui.jquery;
    getDic();
});

function getDic() {
    layui.okUtils.getDic('form_bo_state',function (array,map){
        form_bo_state = map;
        layui.okUtils.getDic('template_type',function (__array,__map) {
            __array.forEach(function (item) {
                item.value = item.id;
                templateType[item.value] = item.name;
            });
            templateTypes = __array;
            renderTable();
            formUtil.renderEasySelect($,{
                el: '#template_type_select',
                tips:'请选模板类型',
                name: 'gpid',
                data:__array,
                model: {
                    label: {
                        type: 'block',
                        block: {
                            showCount: 0,
                            showIcon: true,//是否显示删除图标
                        }
                    }
                }
            });
        });
    });
}

function renderTable() {
    var zTable = layui.zTable({
        elem: '#template_table',
        page:true,
        url:layui.constantUrl.stForm.easySelectWithPagination,
        where:{table:layui.constantUrl.stTable.table_data_template},
        toolbar:'#toolbar',
        size:'lg',
        cols: [[
            {field: 'name', title: '名称'},
            {field: 'code', title: '编码'},
            {field: 'gpid', title: '类型',templet:function (d) {
                    return templateType[d.gpid];
                }},
            {field: 'dsname', title: '数据集'},
            {field: 'des', title: '描述'},
            {field: 'ststate', title: '状态',templet:function (d) {
                    return form_bo_state[d.ststate];
                }},
            {field: 'sttime', title: '添加时间'},
            {field: 'operate', title: '操作',align:'center',width:350,templet:function (d) {
                    let div = '';
                    div += '<a class="layui-btn layui-btn-sm" lay-event="publish">发布</a>';
                    div += '<a class="layui-btn layui-btn-sm" lay-event="preview">预览</a>';
                    div += '<a class="layui-btn layui-btn-sm" lay-event="field">字段</a>';
                    div += '<a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="form">表单</a>';
                    div += '<a class="layui-btn layui-btn-warm layui-btn-sm" lay-event="template">模板</a>';
                    div += '<a class="layui-btn layui-btn-normal layui-btn-sm" lay-event="edit">编辑</a>';
                    if(d.ststate !== -1){
                        div += '<a class="layui-btn layui-btn-danger layui-btn-sm" lay-event="del">删除</a>';
                    }else{
                        div += '<a class="layui-btn layui-btn-danger layui-btn-sm" lay-event="reDel">恢复</a>';
                    }
                    return div;
                }}
        ]]
    });
    table = zTable.getTable();
    zTable.getLayuiTable().on('tool(template_table)', function(obj){
        var data = obj.data;
        var layEvent = obj.event;
        if(layEvent === 'publish'){
            var url = '/modules/widget/common/form/commonPage.html?templateId=' + data.gid;
            var oInput = document.createElement('input');
            oInput.value = url;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display='none';
            layui.okLayer.msg.greenTick('模块地址已复制,请到菜单配置处配置');
        } else if(layEvent === 'preview'){
            showPreviewDialog(obj.data);
        } else if(layEvent === 'form'){
            showFormSelectDialog(obj.data);
        } else if(layEvent === 'field'){
            showTemplateFieldDialog(obj.data);
        }else if(layEvent === 'template'){
            showTemplateDesignDialog(obj.data);
        }else if(layEvent === 'edit'){
            showAddTemplateDialog(obj.data);
        }else if(layEvent === "del") {
            layui.okUtils.ajax({
                url:layui.constantUrl.stForm.easyUpdate,
                data:{
                    clause:JSON.stringify({gid:data.gid}),
                    mapStr:JSON.stringify({ststate:-1}),
                    table:layui.constantUrl.stTable.table_data_template
                }
            }).done(function () {
                $('#btn_reset').click();
            });
        } else if(layEvent === "reDel"){
            layui.okUtils.ajax({
                url:layui.constantUrl.stForm.easyUpdate,
                data:{
                    clause:JSON.stringify({gid:data.gid}),
                    mapStr:JSON.stringify({ststate:1}),
                    table:layui.constantUrl.stTable.table_data_template
                }
            }).done(function () {
                $('#btn_reset').click();
            });
        }
    });
    layui.form.on('submit(search)', function(data){
        table.refresh({
            where:{
                table:layui.constantUrl.stTable.table_data_template,
                mapStr:JSON.stringify(data.field),
            },
            curr: 1
        });
        return false;
    });
    $('#btn_add').off('click').on('click',function () {
        showAddTemplateDialog();
        return false;
    });
    $('#btn_reset').click(function () {
        table.refresh({
            where:{
                table:layui.constantUrl.stTable.table_data_template,
            },
            curr: 1
        });
    });
}

function showAddTemplateDialog(base) {
    layui.okLayer.open("数据模板", "./addTemplate.html", "50%", "55%",function (dom,index) {
        var iframeWin = window[dom.find("iframe")[0]["name"]];
        iframeWin.initData(JSON.stringify(base));
    },function () {
        $('#btn_search').click();
    });
}

function showTemplateFieldDialog(base) {
    layui.okLayer.open("数据模板字段信息设置", "./templateField.html", "60%", "60%",function (dom,index) {
        var iframeWin = window[dom.find("iframe")[0]["name"]];
        iframeWin.initData(JSON.stringify(base));
    },function () {
        $('#btn_search').click();
    });
}

function showTemplateDesignDialog(base) {
    layui.okLayer.open("数据模板样式设计", "./design.html", "60%", "60%",function (dom,index) {
        var iframeWin = window[dom.find("iframe")[0]["name"]];
        iframeWin.initData(JSON.stringify(base));
    },function () {
        $('#btn_search').click();
    });
}

function showPreviewDialog(base) {
    layui.okLayer.open("模板预览", "../commonPage.html?templateId=" + base.gid, "60%", "60%",function (dom,index) {

    },function () {
        $('#btn_search').click();
    });
}

/**
 * 将表单与模板关联
 */
function showFormSelectDialog(base) {
    parentFlag = 0;
    layui.okLayer.open("关联表单", "relatedForm.html?templateId=" + base.gid, "60%", "60%",function (dom,index) {

    },function () {
        if (parentFlag === 1){
            table.refresh()
        }
    });
}
