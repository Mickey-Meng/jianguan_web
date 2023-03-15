var $;
var table;
var dataset_type = [];
var dataset_types;
var form_bo_state;
layui.use(['tree', 'form', 'table', 'okUtils', "okLayer", 'constantUrl', 'zTable','xmSelect'],function () {
    $ = layui.jquery;
    getDic();
});

function getDic() {
    layui.okUtils.getDic('form_bo_state',function (array,map){
        form_bo_state = map;
        layui.okUtils.getDic('dataset_type',function (__array,__map) {
            __array.forEach(function (item) {
                item.value = item.id;
                dataset_type[item.value] = item.name;
            });
            dataset_types = __array;
            renderTable();
            formUtil.renderEasySelect($,{
                el: '#dataset_type_select',
                tips:'请选数据集类型',
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
        elem: '#dataset_table',
        page:true,
        url:layui.constantUrl.stForm.easySelectWithPagination,
        where:{table:layui.constantUrl.stTable.table_data_set},
        toolbar:'#toolbar',
        size:'lg',
        cols: [[
            {field: 'name', title: '名称'},
            {field: 'code', title: '编码'},
            {field: 'gpid', title: '类型',templet:function (d) {
                    return dataset_type[d.gpid];
                }},
            {field: 'tableName', title: '物理表'},
            {field: 'des', title: '描述'},
            {field: 'ststate', title: '状态',templet:function (d) {
                    return form_bo_state[d.ststate];
                }},
            {field: 'sttime', title: '添加时间'},
            {field: 'operate', title: '操作',align:'center',templet:function (d) {
                    let div = '';
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
    zTable.getLayuiTable().on('tool(dataset_table)', function(obj){
        var data = obj.data;
        var layEvent = obj.event;
       if(layEvent === 'edit'){
           showAddDatasetDialog(obj.data);
        }else if(layEvent === "del") {
           layui.okUtils.ajax({
               url:layui.constantUrl.stForm.easyUpdate,
               data:{
                   clause:JSON.stringify({gid:data.gid}),
                   mapStr:JSON.stringify({ststate:-1}),
                   table:layui.constantUrl.stTable.table_data_set
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
                   table:layui.constantUrl.stTable.table_data_set
               }
           }).done(function () {
               $('#btn_reset').click();
           });
       }
    });
    layui.form.on('submit(search)', function(data){
        table.refresh({
            where:{
                table:layui.constantUrl.stTable.table_data_set,
                mapStr:JSON.stringify(data.field),
            },
            curr: 1
        });
        return false;
    });
    $('#btn_add').off('click').on('click',function () {
        showAddDatasetDialog();
        return false;
    });
    $('#btn_reset').click(function () {
        table.refresh({
            where:{
                table:layui.constantUrl.stTable.table_data_set,
            },
            curr: 1
        });
    });

}

function showAddDatasetDialog(base) {
    layui.okLayer.open("数据集", "./addDataset.html", "50%", "55%",function (dom,index) {
        var iframeWin = window[dom.find("iframe")[0]["name"]];
        iframeWin.initData(JSON.stringify(base));
    },function () {
        $('#btn_search').click();
    });
}

