var template;
var allFormIds = [];
var allTypeSelectIds = [];
var allDicSelectIds = [];
var arrayMap = [];
var existFieldMap = [];
var allTypeSelectDom = [];
var allDicSelectDom = [];
function initData(data){
    if(data){
        template = JSON.parse(data);
    }
}

layui.use(['element', 'form', 'tree','okUtils', "okLayer", 'constantUrl','zTable','xmSelect'],function () {
    $ = layui.jquery;
    getDatasetFields();
});

function getDatasetFields() {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.getTemplateFields,
        data:{
            dsid:template.dsid
        }
    }).done(function (result) {
        if(result.meow === 0){
            var array = result.data;
            renderFiledTree(array);
            constructForm(array);
            assignmentFrom(array);
            if(array.length !== 0){
                switchForm(0);
            }
        }
    });
}

function renderFiledTree(array) {
    array.forEach(function (item,index) {
        item.title = item.name;
        item.index = index;
        arrayMap[item.name] = item;
    });
    layui.tree.render({
        elem: '#filed_tree',
        data: [{
            id:1,
            title:template.dsname,
            children:array,
            spread:true
        }],
        id: 'id',
        spread: true,
        onlyIconControl: true,
        click: function (obj) {
            switchForm(obj.data.index);
            var field = existFieldMap[obj.data.name];
            if(field){
                allTypeSelectDom[obj.data.index].setValue([field.ftype]);
                var dicContainerId = getDicContainerId(obj.data.index);
                var dicDom = $('#' + dicContainerId);
                if(field.ftype === 'singleSelect'){
                    allDicSelectDom[obj.data.index].setValue([field.dic]);
                    dicDom.show();
                }else {
                    dicDom.hide();
                }
            }
        }
    })
}

function switchForm(clickIndex) {
    allFormIds.forEach(function (item,index) {
        var dom = $('#' + item);
        if(clickIndex === index){
            dom.show();
        }else {
            dom.hide();
        }
    });
}

function getFormFilter(index) {
    return 'form_field_' + index;
}

function getTypeSelectId(index) {
    return 'typeSelect_' + index;
}

function getDicSelectId(index){
    return 'dicSelect_' + index;
}

function getDicContainerId(index){
    return 'dicContainer_' + index;
}

function constructForm(array) {
    var form_container = $('#form_container');
    array.forEach(function (item,index) {
        var form_filter = getFormFilter(index);
        allFormIds.push(form_filter);
        var typeSelectId = getTypeSelectId(index);
        allTypeSelectIds.push(typeSelectId);
        var dicSelectId = getDicSelectId(index);
        allDicSelectIds.push(dicSelectId);
        var dicContainerId = getDicContainerId(index);
        var html = '<form id="'+ form_filter +'" class="layui-form" action="" lay-filter="'+ form_filter +'" style="margin-top: 10px;padding-right: 20px;display: none">';
        html += '<div class="layui-form-item">\n' +
            '                <label class="layui-form-label">名称<label style="color: red;">*</label></label>\n' +
            '                <div class="layui-input-block">\n' +
            '                    <input value="'+ item.name + '" type="text" name="name" lay-verify="required" autocomplete="off" placeholder="请输入数据名称" class="layui-input">\n' +
            '                </div>\n' +
            '            </div>\n' +
            '            <div class="layui-form-item">\n' +
            '                <label class="layui-form-label">类型<label style="color: red;">*</label></label>\n' +
            '                <div class="layui-input-block">\n' +
            '                    <div id="'+ typeSelectId +'"></div>\n' +
            '                </div>\n' +
            '            </div>' +
            '            <div id="'+ dicContainerId +'" class="layui-form-item" style="display: none">\n' +
            '                <label class="layui-form-label">字典<label style="color: red;">*</label></label>\n' +
            '                <div class="layui-input-block">\n' +
            '                    <div id="'+ dicSelectId +'"></div>\n' +
            '                </div>\n' +
            '            </div>' +
            '            <input name="gid" style="display: none"> ' +
            '            <input value="'+ item.code +'" name="code" style="display: none"> ';
        html += '</form>';
        form_container.append(html);
    });
    renderTypeSelect();
}

function assignmentFrom() {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easySelect,
        data:{
            table:layui.constantUrl.stTable.table_data_template_field,
            mapStr:JSON.stringify({dtid:template.gid})
        }
    }).done(function (result) {
        if(result.meow === 0) {
            result.data.forEach(function (field,index) {
                existFieldMap[field.name] = field;
                var formFilter = getFormFilter(arrayMap[field.name].index);
                layui.form.val(formFilter,field);
            });
        }
    });
}

function renderDicSelect() {
    layui.okUtils.getDic('template_field_select_option',function (array,map) {
        array.forEach(function (item) {
            item.value = item.key;
        });
        allDicSelectIds.forEach(function (item,index) {
            var select = formUtil.renderEasySelect($, {
                el: '#' + item,
                tips: '请选类型',
                name: 'dic',
                data: array
            });
            allDicSelectDom[index] = select;
        });
    });
}

function renderTypeSelect() {
    layui.okUtils.getDic('template_field_type',function (array,map) {
        allTypeSelectIds.forEach(function (item,index) {
            array.forEach(function (item) {
                item.value = item.key;
                item.index = index;
                if(index === 0){
                    item.selected = true;
                }
            });
            var select = formUtil.renderEasySelect($, {
                el: '#' + item,
                tips: '请选类型',
                name: 'ftype',
                data: array,
                on:function (data) {
                    if(data.arr && data.arr.length !== 0){
                        var exist = select.getValue('valueStr');
                        if(!exist || exist === '' || exist !== data.arr[0].value){
                            var selectItem = data.arr[0];
                            var dicContainerId = getDicContainerId(selectItem.index);
                            var dicDom = $('#' + dicContainerId);
                            if(selectItem.value === 'singleSelect'){
                                dicDom.show();
                            }else {
                                dicDom.hide();
                            }
                        }
                    }
                }
            });
            allTypeSelectDom[index] = select;
        });
        renderDicSelect();
    });
}

function submitField() {
    var allFields = [];
    allFormIds.forEach(function (item,index) {
        var field = layui.form.getValue(item);
        field.dtid = template.gid;
        allFields.push(field);
    });
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.uploadTemplateFields,
        data:{
            fields:JSON.stringify(allFields)
        }
    }).done(function (result) {
        if(result.meow === 0) {
            layui.okLayer.msg.greenTick('提交成功', function () {
                parent.layer.close(parent.layer.getFrameIndex(window.name));
            });
        }
    });
    return false;
}
