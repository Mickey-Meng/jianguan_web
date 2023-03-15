var $;
var tableName = 'zlsk_oms_bo_attr';
var bo_att_table;
var bo_att_table_data = [];
var form_data_type_map;
var gpid;
var boData;

function initData(data,_boData){
    gpid = data;
    boData =_boData ? JSON.parse(_boData) : {};
    bo_att_table_data = _boData ? boData.boAttr : [];
}

layui.use(['element', 'form', 'okUtils', "okLayer", 'constantUrl','zTable','xmSelect'],function () {
    $ = layui.jquery;
    layui.form.val('form_bo_base',boData.bo || {});
    getDic();
});

function getDic() {
    layui.okUtils.getDic('form_data_type',function (array,map) {
        form_data_type_map = map;
        renderTable();
        renderSelect();
        bindEvent();
    })
}

function bindEvent() {
    $('#btn_save').off('click').on('click',function () {
        var verify = layui.form.zVerify('form_bo_base');
        if(verify){
            return false;
        }
        var bo_base = layui.form.getValue('form_bo_base');
        bo_base.gpid = gpid;
        if(boData && boData.bo){
            updateBpByAjax(bo_base);
        }else {
            addBoByAjax(bo_base);
        }
        return false;
    });
}

function updateBpByAjax(bo_base) {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.updateBo,
        data:{
            boId:boData.bo.gid,
            bo:JSON.stringify(bo_base),
            boAttrs:JSON.stringify(bo_att_table_data)
        }
    }).done(function (data) {
        if(data.meow === 0){
            parent.layer.close(parent.layer.getFrameIndex(window.name));
        }
    });
}

function addBoByAjax(bo_base) {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.addBo,
        data:{
            bo:JSON.stringify(bo_base),
            boAttrs:JSON.stringify(bo_att_table_data)
        }
    }).done(function (data) {
        if(data.meow === 0){
            parent.layer.close(parent.layer.getFrameIndex(window.name));
        }
    });
}

function on_btn_attr_add_click() {
    layui.okLayer.open("表单对象属性添加", "./addBoAttr.html", "65%", "70%",function (dom,index) {
        var iframeWin = window[dom.find("iframe")[0]["name"]];
        iframeWin.initData(function (code) {
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
            var data = JSON.parse(sessionStorage.getItem('callback'));
            bo_att_table_data.push(data);
            bo_att_table.reload({data:bo_att_table_data});
            sessionStorage.removeItem('callback');
        }
    });
}

function renderTable() {
    var zTable = layui.zTable({
        elem: '#bo_att_table',
        page:false,
        size:'lg',
        data:boData && boData.boAttr ? boData.boAttr : [],
        toolbar:'#toolbar',
        height: 'full-65',
        cols: [[
            {field: 'name', title: '属性名称'},
            {field: 'code', title: '字段编码'},
            {field: 'dtype', title: '属性类型',templet:function (d) {
                    return form_data_type_map[d.dtype];
                }},
            {field: 'operate', title: '操作',align:'center',templet:function (d) {
                    let div = '';
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
            layer.confirm('真的删除行么', function(index){
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
}

/**
 * 业务对象其他属性暂时不要
 */
function renderSelect() {
    var select = layui.xmSelect.render({
        el: '#show_type_select',
        tips:'请选择资源展示类型',
        filterable: true,
        name: 'zyTypes',
        repeat: true,
        radio: true,
        clickClose: true,
        data: [
            {name: '列表', value: 'list'},
            {name: '树形', value: 'tree'}
        ],
        theme: {
            color: '#333333',
        },
        model: {
            label: {
                type: 'block',
                block: {
                    showCount: 0,
                    showIcon: false,//是否显示删除图标
                }
            }
        }
    });
}
