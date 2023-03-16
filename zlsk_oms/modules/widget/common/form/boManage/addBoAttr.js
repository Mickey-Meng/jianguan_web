var $;
var checkCode;
var boId;
var existAttr;
function initData(id,attr,data){
    boId = id;
    if(attr){
        existAttr = JSON.parse(attr);
    }
    checkCode = data;
}
layui.use(['element', 'form', 'okUtils', "okLayer", 'constantUrl','zTable','xmSelect'],function () {
    $ = layui.jquery;
    bindEvent();
    renderSelect();
    if(existAttr){
        layui.form.val('form_bo_base',existAttr);
        uiControl(existAttr.dtype);
    }
});

function bindEvent() {
    layui.form.on('submit(btn_submit)', function(data){
        if(existAttr){
            edit(data);
        }else {
            add(data);
        }
        return false;
    });
}

function edit(data) {
    if (!existAttr.gid){
        layui.okLayer.msg.redCross('请刷新对象属性页后重试');
        return
    }
    data.field.nullable = data.field.nullable === 'on' ? 1 : 0;
    data.field.boid = boId;
    data.field.gid = existAttr.gid;
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.updateField,
        data:{
            boid:boId,
            clause:JSON.stringify({gid:existAttr.gid}),
            mapStr:JSON.stringify(data.field)
        }
    }).done(function (result) {
        if(result.meow === 0){
            layui.okLayer.msg.greenTick('编辑成功',function () {
                sessionStorage.setItem("isEdit",'isEdit');
                sessionStorage.setItem("callback",JSON.stringify(data.field));
                parent.layer.close(parent.layer.getFrameIndex(window.name));
            })
        }
    });
}

function add(data) {
    if(checkCode(data.field.code)){
        layui.okLayer.msg.redCross('编码重复');
        return false;
    }
    data.field.nullable = data.field.nullable === 'on' ? 1 : 0;
    data.field.boid = boId;
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.addField,
        data:{
            boid:boId,
            mapStr:JSON.stringify(data.field)
        }
    }).done(function (result) {
        if(result.meow === 0){
            layui.okLayer.msg.greenTick('添加成功',function () {
                sessionStorage.setItem("callback",JSON.stringify(data.field));
                parent.layer.close(parent.layer.getFrameIndex(window.name));
            })
        }
    });
}

function renderSelect() {
    layui.okUtils.getDic('form_data_type',function (array,map) {
        array.forEach(function (item,index) {
            item.value = item.key;
            if(existAttr){
                if(item.value === existAttr.dtype){
                    item.selected = true;
                }
            }else {
                if(index === 0){
                    item.selected = true;
                }
            }
        });
        var select = layui.xmSelect.render({
            el: '#dtype_select',
            tips:'请选数据类型',
            filterable: true,
            name: 'dtype',
            repeat: true,
            radio: true,
            clickClose: true,
            data: array,
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
            },
            on:function(data){
                if(data.arr && data.arr.length !== 0){
                    var exist = select.getValue('valueStr');
                    if(!exist || exist === '' || exist !== data.arr[0].value){
                        var value = data.arr[0].value;
                        uiControl(value);
                    }
                }
            },
        });
    });
}

function uiControl(value) {
    if(value === 'float' || value === 'double'){
        $('.dprec').show();
        $('.dfmt').hide();
    }else if(value === 'datetime' || value === 'date' || value === 'timestamp'){
        $('.dprec').hide();
        $('.dfmt').show();
    }else {
        $('.dprec').hide();
        $('.dfmt').hide();
    }
}
