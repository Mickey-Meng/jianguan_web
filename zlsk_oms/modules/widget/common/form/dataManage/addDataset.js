var dataset;
var allTbl = [];
function initData(data){
    if(data){
        dataset = JSON.parse(data);
    }
}

layui.use(['element', 'form', 'okUtils', "okLayer", 'constantUrl','zTable','xmSelect'],function () {
    $ = layui.jquery;

    layui.okUtils.getDic('dataset_type',function (array,map) {
        renderTypeSelect(array);
        renderTblSelect();
        if(dataset){
            layui.form.val('form_dataset',dataset);
        }
    });

    layui.form.on('submit(btn_save)', function(data){
        data.field.tableName = allTbl[data.field.tblid].name;
        if(dataset){
            update(data)
        }else {
            add(data);
        }
        return false;
    });
});

function renderTypeSelect(array) {
    array.forEach(function (item,index) {
        item.value = item.id;
        if(dataset){
            if(item.value === dataset.gpid){
                item.selected = true;
            }
        }else if(index === 0){
            item.selected = true;
        }
    });
    formUtil.renderEasySelect($,{
        el: '#dataset_type_select',
        tips:'请选对象类型',
        name: 'gpid',
        data:array
    });
}

function renderTblSelect() {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easySelect,
        data:{
            table:layui.constantUrl.stTable.table_bo_tbl
        }
    }).done(function (result) {
        var data = [];
        result.data.forEach(function (item) {
            allTbl[item.gid] = item;
            var selectItem = {
                name:item.name + '【' + item.boname + '】',
                value:item.gid,
            };
            if(dataset){
                if(selectItem.value === dataset.tblid){
                    selectItem.selected = true;
                }
            }
            data.push(selectItem);
        });
        formUtil.renderEasySelect($,{
            el: '#dataset_tbl_select',
            tips:'请选物理表',
            name: 'tblid',
            data:data,
            layVerify: 'required',
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
}

function add(data) {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easyInsert,
        data:{
            table:layui.constantUrl.stTable.table_data_set,
            mapStr:JSON.stringify(data.field)
        }
    }).done(function (result) {
        if(result.meow === 0) {
            layui.okLayer.msg.greenTick('添加成功', function () {
                parent.layer.close(parent.layer.getFrameIndex(window.name));
            });
        }
    });
}

function update(data) {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easyUpdate,
        data:{
            table:layui.constantUrl.stTable.table_data_set,
            clause:JSON.stringify({gid:dataset.gid}),
            mapStr:JSON.stringify(data.field)
        }
    }).done(function (result) {
        if(result.meow === 0) {
            layui.okLayer.msg.greenTick('更新成功', function () {
                parent.layer.close(parent.layer.getFrameIndex(window.name));
            });
        }
    });
}
