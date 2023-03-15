var $;
var bo_data;
var bo_att_table_data;
var bo_att_table;
var form_data_type_map;

function initData(data){
    bo_data = JSON.parse(data);
}

layui.use(['element', 'form', 'okUtils', "okLayer", 'constantUrl','zTable','xmSelect'],function () {
    $ = layui.jquery;
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easySelectWithOutLike,
        data:{
            table:layui.constantUrl.stTable.table_bo_attr,
            mapStr:JSON.stringify({
                boid:bo_data.gid
            })
        }
    }).done(function (data) {
        bo_att_table_data = data.data;
        getDic();
    });
});

function getDic() {
    layui.okUtils.getDic('form_data_type',function (array,map) {
        form_data_type_map = map;
        renderTable();
    })
}

function renderTable() {
    var zTable = layui.zTable({
        elem: '#bo_att_table',
        page:true,
        size:'lg',
        data:bo_att_table_data,
        height: 'full',
        toolbar:'#toolbar',
        cols: [[
            {field: 'name', title: '属性名称'},
            {field: 'code', title: '字段编码'},
            {field: 'dtype', title: '属性类型',templet:function (d) {
                    return form_data_type_map[d.dtype];
                }},
            {field: 'operate', title: '操作',align:'center',templet:function (d) {
                    let div = '';
                    div += '<a class="layui-btn layui-btn-sm" lay-event="edit">编辑</a>';
                    div += '<a class="layui-btn layui-btn-danger layui-btn-sm" lay-event="del">删除</a>';
                    return div;
                }}
        ]]
    });
    bo_att_table = zTable.getTable();
    zTable.getLayuiTable().on('tool(bo_att_table)', function(obj) {
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        if(layEvent === 'del'){
            deleteBoAttr(obj);
        }else if(layEvent === 'edit'){
            openAttrDetail(obj.data);
        }
    });
}

function deleteBoAttr(obj) {
    layer.confirm('确定要删除该条属性吗?', function(index){
        layui.okUtils.ajax({
            url:layui.constantUrl.stForm.deleteField,
            data:{
                boid:bo_data.gid,
                attrid:obj.data.gid
            }
        }).done(function (result) {
            if(result.meow === 0){
                layui.okLayer.msg.greenTick('删除成功',function () {
                    bo_att_table_data.forEach(function (item,index) {
                        if(item.code === obj.data.code){
                            bo_att_table_data.splice(index,1);
                        }
                    });
                    obj.del();
                    layer.close(index);
                });
            }
        });
    });
}

function openAttrDetail(attr) {
    layui.okLayer.open("表单对象属性添加", "./addBoAttr.html", "65%", "70%",function (dom,index) {
        var iframeWin = window[dom.find("iframe")[0]["name"]];
        iframeWin.initData(bo_data.gid,JSON.stringify(attr),function (code) {
            var isExist = false;
            bo_att_table_data.forEach(function (item) {
                if(item.code === code){
                    isExist = true;
                }
            });
            return isExist;
        });
    },function () {
        if(sessionStorage.getItem('callback')){
            var data = JSON.parse(sessionStorage.getItem('callback'))
            var isEdit = sessionStorage.getItem("isEdit");
            if(isEdit){
                for (var index = 0;index < bo_att_table_data.length;index ++){
                    if(bo_att_table_data[index].gid === data.gid){
                        bo_att_table_data[index] = data;
                    }
                }
                sessionStorage.removeItem('isEdit');
            }else {
                bo_att_table_data.push(data);
            }
            bo_att_table.reload({data:bo_att_table_data});
            sessionStorage.removeItem('callback');
        }
    });
}
