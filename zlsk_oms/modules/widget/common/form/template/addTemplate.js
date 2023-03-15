var template;
var allDataset = [];
function initData(data){
    if(data){
        template = JSON.parse(data);
    }
}

layui.use(['element', 'form', 'okUtils', "okLayer", 'constantUrl','zTable','xmSelect'],function () {
    $ = layui.jquery;

    layui.okUtils.getDic('template_type',function (array,map) {
        renderTypeSelect(array);
        renderTblSelect();
        if(template){
            layui.form.val('form_template',template);
        }
    });

    layui.form.on('submit(btn_save)', function(data){
        var dsid = data.field.dsid;
        var dataset = allDataset[dsid];
        data.field.dsname = dataset.name;
        data.field.dskey = dataset.code;
        if(template){
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
        if(template){
            if(item.value === template.gpid){
                item.selected = true;
            }
        }else if(index === 0){
            item.selected = true;
        }
    });
    formUtil.renderEasySelect($,{
        el: '#template_type_select',
        tips:'请选对象类型',
        name: 'gpid',
        data:array
    });
}

function renderTblSelect() {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easySelect,
        data:{
            table:layui.constantUrl.stTable.table_data_set
        }
    }).done(function (result) {
        var data = [];
        result.data.forEach(function (item) {
            allDataset[item.gid] = item;
            var selectItem = {
                name:item.name + '【' + item.gid + '】',
                value:item.gid
            };
            if(template){
                if(selectItem.value === template.dsid){
                    selectItem.selected = true;
                }
            }
            data.push(selectItem);
        });
        formUtil.renderEasySelect($,{
            el: '#dataset_select',
            tips:'请选择数据集',
            name: 'dsid',
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
            table:layui.constantUrl.stTable.table_data_template,
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
            table:layui.constantUrl.stTable.table_data_template,
            clause:JSON.stringify({gid:template.gid}),
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
