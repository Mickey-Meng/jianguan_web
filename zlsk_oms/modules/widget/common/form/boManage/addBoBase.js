var boBase;
function initData(data){
    if(data){
        boBase = JSON.parse(data);
    }
}

layui.use(['element', 'form', 'okUtils', "okLayer", 'constantUrl','zTable','xmSelect'],function () {
    $ = layui.jquery;

    layui.okUtils.getDic('bo_type',function (array,map) {
        array.forEach(function (item,index) {
            item.value = item.id;
            if(boBase){
                if(item.value === boBase.gpid){
                    item.selected = true;
                }
            }else if(index === 0){
                item.selected = true;
            }
        });
        formUtil.renderEasySelect($,{
            el: '#bo_type_select',
            tips:'请选对象类型',
            name: 'gpid',
            data:array
        });

        if(boBase){
            layui.form.val('form_bo_base',boBase);
        }
    });

    layui.form.on('submit(btn_save)', function(data){
        if(boBase){
            update(data)
        }else {
            add(data);
        }
        return false;
    });
});

function update(data) {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easyUpdate,
        data:{
            table:layui.constantUrl.stTable.table_bo_def,
            clause:JSON.stringify({gid:boBase.gid}),
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

function add(data) {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easyInsert,
        data:{
            table:layui.constantUrl.stTable.table_bo_def,
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
