var $;
var bo_table;
var form_bo_state;
var form_bo_is_create;
var form_bo_type = [];
var form_bo_types;
layui.use(['tree', 'form', 'table', 'okUtils', "okLayer", 'constantUrl', 'zTable','xmSelect'],function () {
    $ = layui.jquery;
    getDic();
});

function getDic() {
    layui.okUtils.getDic('form_bo_state',function (array,map) {
        form_bo_state = map;
        layui.okUtils.getDic('form_bo_is_create',function (_array,_map) {
            form_bo_is_create = _map;
            layui.okUtils.getDic('bo_type',function (__array,__map) {
                __array.forEach(function (item) {
                    item.value = item.id;
                    form_bo_type[item.value] = item.name;
                });
                form_bo_types = __array;
                renderTable();
                formUtil.renderEasySelect($,{
                    el: '#bo_type_select',
                    tips:'请选对象类型',
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
    })
}

function renderTable() {
    var zTable = layui.zTable({
        elem: '#bo_table',
        page:true,
        url:layui.constantUrl.stForm.easySelectWithPagination,
        where:{table:layui.constantUrl.stTable.table_bo_def},
        toolbar:'#toolbar',
        size:'lg',
        cols: [[
            {field: 'name', title: '名称'},
            {field: 'code', title: '编码'},
            {field: 'gpid', title: '类型',templet:function (d) {
                    return form_bo_type[d.gpid];
                }},
            {field: 'ststate', title: '状态',templet:function (d) {
                    return form_bo_state[d.ststate];
                }},
            {field: 'ftbl', title: '是否建表',templet:function (d) {
                    return form_bo_is_create[d.ftbl];
                }},
            {field: 'sttime', title: '添加时间'},
            {field: 'operate', title: '操作',align:'center',templet:function (d) {
                    let div = '';
                    div += '<a class="layui-btn layui-btn-normal layui-btn-sm" lay-event="attr">属性</a>';
                    div += '<a class="layui-btn layui-btn-sm" lay-event="edit">编辑</a>';
                    if(d.ststate !== -1){
                        div += '<a class="layui-btn layui-btn-danger layui-btn-sm" lay-event="del">删除</a>';
                    }else{
                        div += '<a class="layui-btn layui-btn-danger layui-btn-sm" lay-event="reDel">恢复</a>';
                    }
                    if(d.ftbl === 0){
                        div += '<a class="layui-btn layui-btn-warm layui-btn-sm" lay-event="create">建表</a>';
                    }
                    return div;
                }}
        ]]
    });
    bo_table = zTable.getTable();
    zTable.getLayuiTable().on('tool(bo_table)', function(obj){
        var data = obj.data;
        var layEvent = obj.event;
        if(layEvent === 'edit'){
            showAddBoDialog(obj.data);
        } else if(layEvent === "del") {
            layui.okUtils.ajax({
                url:layui.constantUrl.stForm.easyUpdate,
                data:{
                    clause:JSON.stringify({gid:data.gid}),
                    mapStr:JSON.stringify({ststate:-1}),
                    table:layui.constantUrl.stTable.table_bo_def
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
                    table:layui.constantUrl.stTable.table_bo_def
                }
            }).done(function () {
                $('#btn_reset').click();
            });
        } else if(layEvent === 'create'){
            layui.okUtils.ajax({
                url:layui.constantUrl.stForm.createBoTable,
                data:{
                    gid:obj.data.gid
                }
            }).done(function (data) {
                $('#btn_reset').click();
            });
        } else if(layEvent === 'attr'){
            showAttrDialog(obj.data);
        }
    });
    layui.form.on('submit(search)', function(data){
        bo_table.refresh({
            where:{
                table:layui.constantUrl.stTable.table_bo_def,
                mapStr:JSON.stringify(data.field),
            },
            curr: 1
        });
        return false;
    });
    $('#btn_add').off('click').on('click',function () {
        showAddBoDialog();
        return false;
    });
    $('#btn_reset').click(function () {
        bo_table.refresh({
            where:{
                table:layui.constantUrl.stTable.table_bo_def
            },
            curr: 1
        });
    });
}

function showAddBoDialog(base){
    layui.okLayer.open("表单对象", "./addBoBase.html", "50%", "55%",function (dom,index) {
        var iframeWin = window[dom.find("iframe")[0]["name"]];
        iframeWin.initData(JSON.stringify(base));
    },function () {
        $('#btn_search').click();
    });
}

function showAttrDialog(base) {
    layui.okLayer.open("对象属性", "./boAttr.html", "60%", "80%",function (dom,index) {
        var iframeWin = window[dom.find("iframe")[0]["name"]];
        iframeWin.initData(JSON.stringify(base));
    },function () {
        $('#btn_search').click();
    });
}
