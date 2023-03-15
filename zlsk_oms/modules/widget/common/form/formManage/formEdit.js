var $;
var form;
var objTree;
var okLayer;
var laydate;
var okUtils;
var xmSelect;
var constantUrl;

var formData;//表单数据
var formType;//表单分类
var itemIndex;//增长的角标
var currentIndex; //被选中的空间角标
var selectItemIndex;//单选和多选角标
var formItems = {};//所有控件信息
var formAttr = {};//所有属性信息
var flagSelect = {};//customize 自定义  dic 字典 person 选择人员
var itemSelectObj;

const textType = 'text' ;
const singleSelectType = 'singleSelect' ;
const mulSelectType = 'mulSelect' ;
const drawSelectType = 'drawSelect' ;
const timeSelectType = 'timeSelect' ;
const textareaType = 'textarea' ;

// {
//     'fdoptions':{
//         'title':'',//label标题
//         'selectCheckBox':[{'name':'','value':'','id':''}]//单项选择或多项选择的选项
//             ,'dic':''//字典字段
//             ,'rtype':''//人员选择类型
//     },
//     'fdtype':'',//控件类型
//     'name':'',
//     'code':''
// }

// rtype 1 部门   2 岗位    3 角色

function initForm(data) {
    let dataString = JSON.stringify(data);
    formData = JSON.parse(dataString);

    layui.use(['element', 'form', 'okUtils', "okLayer", 'constantUrl', 'zTable', 'xmSelect', 'tree', 'laydate', 'xmSelect'], function () {
        $ = layui.jquery;
        form = layui.form;
        objTree = layui.tree;
        okUtils = layui.okUtils;
        okLayer = layui.okLayer;
        laydate = layui.laydate;
        xmSelect = layui.xmSelect;
        constantUrl = layui.constantUrl;

        getType()
    });
}

var getType = function () {
    okUtils.getDic('form_type',function (data,map) {
        formType = data;

        initFun();
    })
};

var initFun = function () {
    itemIndex = 0;
    currentIndex = -1;
    selectItemIndex = -1;
    bindClick();
    generateObjTree();
    initTypeSelect();
    initEditForm();
    initFormItem();
    changeObjOrParam('param');
    changeObjOrParam('editField');
    changeObjOrParam('customize');
};

var initFormItem = function () {
    okUtils.ajax({
        "url": constantUrl.stForm.selectFormItem,
        'param': {'fmid': formData.gid}
    }).done(function (data1) {
        if (data1.meow === 0){
            let formCacheData = data1.data.fd;
            if (formCacheData && formCacheData.length > 0) {
                for (let index = 0; index < formCacheData.length; index++) {
                    let data = formCacheData[index];
                    data.fdoptions = JSON.parse(formCacheData[index].fdoptions);
                    switch (data.fdtype) {
                        case "text":
                            inputItem(data);
                            break;
                        case "singleSelect":
                            singleSelectItem(data);
                            break;
                        case "mulSelect":
                            mulSelectItem(data);
                            break;
                        case "drawSelect":
                            drawSelect(data);
                            break;
                        case "timeSelect":
                            timeSelect(data);
                            break;
                    }
                }
            }
        }else {
            layui.layer.alert('警告 ' + data1.msg);
        }
    });
    itemSelectObj = xmSelect.render({
        el: '#itemSelect',
        tips: '请选表单分类',
        name: 'value',
        data: [{name:'自定义',value:'customize'},{name:'字典',value:'dic'},{name:'人员',value:'person'}],
        filterable: false,
        repeat: true,
        radio: true,
        clickClose: true,
        theme: {color: '#333333',},
        model: {
            label: {
                type: 'block',
                block: {
                    showCount: 0,
                    showIcon: false,//是否显示删除图标
                }
            }
        }
        ,on:function (data) {
            let arr = data.arr;
            if (arr && arr.length > 0){
                changeObjOrParam(arr[0].value);
            }
        }
    })
};

var initEditForm = function () {
    $('#editFormTitle').attr("value", formData.name);
    $('#editFormKey').attr("value", formData.code);
    $('#editFormDes').attr("value", formData.des);

    okUtils.ajax({
        'url':constantUrl.stAuth.selectDicByParentKey,
        'param':{'keyStr':'template_field_select_option'}
    }).done(function (data1) {
        if (data1.meow === 0){
            okUtils.adapterSelect("#selectDicItem", '', "key", "value", data1.data.template_field_select_option);
        }
    });
};

var bindClick = function () {
    $("#save").click(function () {
        let formCacheData = {'gid':formData.gid,'name':$('#editFormTitle').val(),'code':$('#editFormKey').val(),'des':$('#editFormDes').val(),'gpid':$("#obObject").val()};
        let status = checkValueStatus();
        if (status !== 0){
            switch (status) {
                case -1:
                    layui.layer.alert('警告 存在选项值或选项名为空' );
                    break;
                case -2:
                    layui.layer.alert('警告 存在选项值或选项名重复' );
                    break;
                case -3:
                    layui.layer.alert('警告 存在绑定对象重复' );
                    break;
            }
            return;
        }
        let cache = [];
        for (let index in formItems){
            let cacheFrom = formItems[index];
            cacheFrom.fmid = formData.gid;
            cacheFrom.ststate = 1;
            cache.push(cacheFrom);
        }
        okUtils.ajax({
            "url": constantUrl.stForm.uploadFormItem,
            'param': {'formInfoString': JSON.stringify(formCacheData),'formDataString':JSON.stringify(cache),'formBtnString':JSON.stringify([])}
        }).done(function (data1) {
            if (data1.meow === 0){
                parent.parentFlag = 0;
                parent.layer.close(parent.layer.getFrameIndex(window.name));
            }else {
                layui.layer.alert('警告 ' + data1.msg);
            }
        })
    });
    $("#preview").click(function () {
        okLayer.open("编辑预览", "formPreview.html?previewType=formEdit", "100%", "100%", function (layero) {
            var iframeWin = window[layero.find("iframe")[0]["name"]];
            iframeWin.initForm(formItems);
        }, function () {

        });
    });
    $("#close").click(function () {
        parent.layer.close(parent.layer.getFrameIndex(window.name));
    });
    $("#btnAddInput").click(function () {
        inputItem();
    });
    $("#btnAddSingleSelect").click(function () {
        singleSelectItem()
    });
    $("#btnAddMulSelect").click(function () {
        mulSelectItem()
    });
    $("#drawSelect").click(function () {
        drawSelect()
    });
    $("#timeSelect").click(function () {
        timeSelect()
    });
    $("#textareaInput").click(function () {
        textareaInput()
    });

    form.on('select(formObjName)', function (data) { //标题同步对象名称选择
        let nameTitle = data.value;
        $('#formTitle').attr('value', nameTitle);
        setFormItemNameCodeTitle(nameTitle)
    });

    form.on('select(selectDicItem)', function (data) {
        formItems[currentIndex].fdoptions.dic = data.value;
    });

    form.on('select(selectUserItem)', function (data) {
        formItems[currentIndex].fdoptions.rtype = data.value;
    });

};

var setFormItemNameCodeTitle = function (data) {
    if (currentIndex !== -1) {
        $("#label" + currentIndex).text(data);
        formItems[currentIndex].name = data;
        formItems[currentIndex].code = formAttr[data].code;
        formItems[currentIndex].fdoptions.title = data;
    }
};

var initTypeSelect = function () {
    let showText;
    for (let index = 0; index < formType.length; index++) {
        if (formType[index].id === formData.gpid) {
            showText = formType[index].name;
            break;
        }
    }
    //todo adapterSelect 添加 default value
    okUtils.adapterSelect("#obObject", showText, "id", "value", formType, '', formData.gpid);
};

var generateObjTree = function () {
    if (!formData) {
        layer.alert("警告 未获取到业务对象");
    } else {
        okUtils.ajax({
            "url": constantUrl.stForm.selectBoAndAttr,
            'param': {'fmid': formData.gid}
        }).done(function (data1) {
            if (data1.meow !== 0) {
                layer.alert("警告 " + data1.msg);
            } else {
                let attr = data1.data.attr;
                let treeData = generateTree({"data": attr}, data1.data.bo);
                objTree.render({
                    elem: '#objTree'
                    , data: treeData
                    , id: 'treeId'
                    , spread: true
                    , onlyIconControl: true
                    , showLine: false
                    , click: function (obj) {
                        let data = obj.data;
                        $('#formTitle').attr('value', data.name);
                        $("#formObjName").val(data.name);
                        form.render();

                        setFormItemNameCodeTitle(data.name);
                    }
                });
                for (let index = 0; index < attr.length; index++) {
                    formAttr[attr[index].name] = attr[index];
                }

                okUtils.adapterSelect("#formObjName", "", "name", "name", data1.data.attr);
            }
        });
    }
};

var changeObjOrParam = function (string) {
    flagSelect[currentIndex] = string;
    switch (string) {
        case 'param':
            $('#formParam').show();
            $('#obObj').hide();
            setTitleColor('#formParamTitle', '#obObjTitle');
            break;
        case 'obj':
            $('#formParam').hide();
            $('#obObj').show();
            setTitleColor('#obObjTitle', '#formParamTitle');
            break;
        case 'editField':
            $('#editFormAttrDiv').hide();
            $('#editFieldDiv').show();
            setTitleColor('#editField', '#editFormAttr');
            break;
        case 'editFormAttr':
            $('#editFormAttrDiv').show();
            $('#editFieldDiv').hide();
            setTitleColor('#editFormAttr', '#editField');
            break;
        case 'customize':
            // setTitleColor('#customizeSelect','#selectDic');
            if (itemSelectObj){
                itemSelectObj.setValue([{name:'自定义',value:'customize'}])
            }
            $('#customizeDiv').show();
            $('#selectDicDiv').hide();
            $('#selectUserDiv').hide();
            if (currentIndex !== -1){
                formItems[currentIndex].fdoptions.rtype = null; //下拉选择需清空不同类型选项
                formItems[currentIndex].fdoptions.dic = null;
            }
            break;
        case 'dic':
            if (itemSelectObj){
                itemSelectObj.setValue([{name:'字典',value:'dic'}])
            }
            // setTitleColor('#selectDic','#customizeSelect');
            $('#customizeDiv').hide();
            $('#selectUserDiv').hide();
            $('#selectDicDiv').show();
            if (currentIndex !== -1){
                formItems[currentIndex].fdoptions.selectCheckBox = null;
                formItems[currentIndex].fdoptions.rtype = null;
            }
            break;
        case 'person':
            if (itemSelectObj){
                itemSelectObj.setValue([{name:'人员',value:'person'}])
            }
            $('#customizeDiv').hide();
            $('#selectDicDiv').hide();
            $('#selectUserDiv').show();
            if (currentIndex !== -1){
                formItems[currentIndex].fdoptions.selectCheckBox = null;
                formItems[currentIndex].fdoptions.dic = null;
            }
            break;
    }
};

var setTitleColor = function (selected, unselected) {
    $(selected).css('color', '#ffffff');
    $(unselected).css('color', '#000000');
    $(selected).css('backgroundColor', '#009688');
    $(unselected).css('backgroundColor', '#ffffff');
};

var setTitleValue = function (obj) {
    let fdoptions = obj.fdoptions;
    let fdType = obj.fdtype;
    let sort = obj.storder;
    if (!sort)sort = '';
    if (fdoptions) {
        let cacheTitle = fdoptions.title;
        let defaultValue = fdoptions.defaultValue;
        let prompt = fdoptions.promptData;
        if (!prompt)prompt = '';
        if (!cacheTitle)cacheTitle = '';
        if (!defaultValue)defaultValue = '';
        $("#formSort").val(sort);
        $("#formPrompt").val(prompt);
        $("#formDefaultValue").val(defaultValue);
        $('#label' + currentIndex).attr('value', cacheTitle);

        let selectCheckBox = fdoptions.selectCheckBox;
        if ((fdType === singleSelectType || fdType === mulSelectType || fdType === drawSelectType) && selectCheckBox && selectCheckBox.length > 0 ){
            for (let index = 0; index < selectCheckBox.length; index++) {
                addSingleSelectItem(selectCheckBox[index],true);
            }
        }else if (fdoptions.dic){
            $("#selectDicItem option[value=" + fdoptions.dic + "]").prop("selected",true);
        }else if (fdoptions.rtype){
            $("#selectUserItem option[value=" + fdoptions.rtype + "]").prop("selected",true);
        }
    }

    $("#formTitle").attr('value', obj.name);
    $("#formObjName ").val(obj.name);
    form.render();

};

var changeSelectItem = function (idx, type) {
    if (type === singleSelectType || type === mulSelectType || type === drawSelectType ) {
        $('#addSelectItemDiv').show();
    } else {
        $('#addSelectItemDiv').hide();
    }
    for (let index = 1; index <= itemIndex; index++) {
        let objItem = $('#item' + index);
        let obj = $('#label' + index);
        if (obj && obj.length > 0) {
            let checkObj = $('#itemSelected' + index)[0];
            if (index === idx) {
                if (!checkObj.checked){
                    selectItemIndex = 0; //切换控件时重置选择角标，并检查控件类型，更新控件数据
                    $('#selectItems').children().remove();
                }else {
                    return; // 若已被选中则不渲染
                }
                obj.css('backgroundColor', '#009688');
                checkObj.checked = true;
                currentIndex = index;
                if (type === singleSelectType || type === mulSelectType || type === drawSelectType){
                    let options = formItems[index].fdoptions;
                    if (options){
                        if (options.dic){
                            changeObjOrParam('dic');
                        }else if (options.rtype){
                            changeObjOrParam('person');
                        }else {
                            changeObjOrParam('customize');
                        }
                    }
                }
                if (formItems[currentIndex]) {
                    setTitleValue(formItems[currentIndex])
                } else {
                    setTitleValue({});
                }
            } else {
                obj.css('backgroundColor', '#ffffff');
                checkObj.checked = false;
            }
        }
    }
};

var changeItemTitle = function (obj) {
    let cacheText = $(obj).val();
    $("#label" + currentIndex).text(cacheText);
    checkFormObj(currentIndex);
    formItems[currentIndex].fdoptions.title = cacheText;
    formItems[currentIndex].name = cacheText;
};

var changeItemDefaultValue = function (obj) {
    formItems[currentIndex].fdoptions.defaultValue = $(obj).val();
};

var changeItemPrompt = function (obj) {
    //todo check defaultValue and prompt
    let data = $(obj).val();
    let type = formItems[currentIndex].fdtype;
    formItems[currentIndex].fdoptions.promptData = $(obj).val();
    if (type !== singleSelectType && type !== mulSelectType && type !== drawSelectType){
        $("#" + type + currentIndex).attr("placeholder",data)
    }
};

var changeItemSort = function (obj) {
    formItems[currentIndex].storder = $(obj).val();
};

var addSelectValueByWeb = function (obj) {
    if (obj){
        formItems[itemIndex] = obj;
        if (obj.fdoptions && obj.fdoptions.selectCheckBox){
            for (let index = 1; index < obj.fdoptions.selectCheckBox.length + 1; index++) {
                setSelectValue(index,true)
            }
        }
    }
};

var inputItem = function (obj) {
    itemIndex++;
    let cacheIndex = itemIndex;
    let title = obj ?  obj.fdoptions.title : '输入框';
    $("#formBody").append(
        "            <div class='layui-form-item' id='item" + cacheIndex + "' onclick='changeSelectItem(" + cacheIndex + ", \"text\" )'>" +
        "                <input id='itemSelected" + cacheIndex + "' type='checkbox' style='display: none'>" +
        "                <label class='layui-form-label' id='label" + cacheIndex + "'> " + title + " </label>" +
        "                <div class=\"layui-input-block\">\n" +
        "                    <span class=\"spanInput\">\n" +
        "                        <input type=\"text\" name=\"name\" id='"+ textType + '' + cacheIndex + "' autocomplete=\"off\" class=\"layui-input\" lay-verify=\"required\">\n" +
        "                    </span>\n" +
        "                    <button class=\"layui-btn  layui-btn-sm deleteBtn\" onclick='deleteItem(this," + cacheIndex + ")' title=\"删除\">\n" +
        "                        <i class=\"layui-icon\">&#xe640;</i>\n" +
        "                    </button>\n" +
        "                </div>" +
        "            </div>");
    checkFormObj(itemIndex);
    formItems[itemIndex].fdtype = textType;
    addSelectValueByWeb(obj)
};

var singleSelectItem = function (obj) {
    itemIndex++;
    let cacheIndex = itemIndex;
    let title = '单项选择';
    checkFormObj(itemIndex);
    formItems[itemIndex].fdtype = singleSelectType;
    if (obj){
        title = obj.fdoptions.title;
    }
    $("#formBody").append(
        "            <div class='layui-form-item' id='item" + cacheIndex + "' onclick='changeSelectItem(" + cacheIndex + ", \"singleSelect\")'>" +
        "                <input id='itemSelected" + cacheIndex + "' type='checkbox' style='display: none'>" +
        "                <label class='layui-form-label' id='label" + cacheIndex + "'>" + title + " </label>" +
        "                <div class=\"layui-input-block\">\n" +
        "                    <span class=\"spanInput\">\n" +
        "                        <div id='" +singleSelectType + "" + cacheIndex + "'></div>" +
        "                    </span>\n" +
        "                    <button class=\"layui-btn  layui-btn-sm deleteBtn\" onclick='deleteItem(this," + cacheIndex + ")' title=\"删除\">\n" +
        "                        <i class=\"layui-icon\">&#xe640;</i>\n" +
        "                    </button>\n" +
        "                </div>" +
        "            </div>");
    addSelectValueByWeb(obj);
};

var mulSelectItem = function (obj) {
    itemIndex++;
    let cacheIndex = itemIndex;
    let title = '多项选择';
    checkFormObj(itemIndex);
    formItems[itemIndex].fdtype = mulSelectType;
    if (obj){
        title = obj.fdoptions.title;
    }
    $("#formBody").append(
        "            <div class='layui-form-item' id='item" + cacheIndex + "' onclick='changeSelectItem(" + cacheIndex + ", \"mulSelect\")'>" +
        "                <input id='itemSelected" + cacheIndex + "' type='checkbox' style='display: none'>" +
        "                <label class='layui-form-label' id='label" + cacheIndex + "'>" + title + "</label>" +
        "                <div class=\"layui-input-block\">\n" +
        "                    <span class=\"spanInput\">\n" +
        "                        <div id='" + mulSelectType + '' + cacheIndex + "'></div>" +
        "                    </span>\n" +
        "                    <button class=\"layui-btn  layui-btn-sm deleteBtn\" onclick='deleteItem(this," + cacheIndex + ")' title=\"删除\">\n" +
        "                        <i class=\"layui-icon\">&#xe640;</i>\n" +
        "                    </button>\n" +
        "                </div>" +
        "            </div>");
    addSelectValueByWeb(obj);
};

var drawSelect = function (obj) {
    itemIndex++;
    let cacheIndex = itemIndex;
    let title = '下拉选择';
    checkFormObj(itemIndex);
    formItems[itemIndex].fdtype = drawSelectType;
    if (obj){
        title = obj.fdoptions.title;
    }
    $("#formBody").append(
        "            <div class='layui-form-item' id='item" + cacheIndex + "' onclick='changeSelectItem(" + cacheIndex + ", \"drawSelect\")'>" +
        "                <input id='itemSelected" + cacheIndex + "' type='checkbox' style='display: none'>" +
        "                <label class='layui-form-label' id='label" + cacheIndex + "'>" + title + "</label>" +
        "                <div class=\"layui-input-block\">\n" +
        "                    <span class=\"spanInput\">\n" +
        "                        <select id='" + drawSelectType + '' + cacheIndex + "' name='" + drawSelectType + '' + cacheIndex + "' lay-filter='" + drawSelectType + '' + cacheIndex + "' " +
        "                              style='height: 38px'></select>" +
        "                    </span>\n" +
        "                    <button class=\"layui-btn  layui-btn-sm deleteBtn\" onclick='deleteItem(this," + cacheIndex + ")' title=\"删除\">\n" +
        "                        <i class=\"layui-icon\">&#xe640;</i>\n" +
        "                    </button>\n" +
        "                </div>" +
        "            </div>");
    addSelectValueByWeb(obj);
};

var timeSelect = function (obj) {
    itemIndex++;
    let cacheIndex = itemIndex;
    let title = obj ?  obj.fdoptions.title :  '时间选择';
    $("#formBody").append(
        "    <div class=\"layui-form-item\" id='item" + cacheIndex + "' onclick='changeSelectItem(" + cacheIndex + ", \"timeSelect\")'>" +
        "      <input id='itemSelected" + cacheIndex + "' type='checkbox' style='display: none'>" +
        "      <label class=\"layui-form-label\" id='label" + cacheIndex + "'>" + title + "</label>\n" +
        "      <div class=\"layui-input-block\">\n" +
        "        <span class=\"spanInput\">\n" +
        "           <input type=\"text\" id='" + timeSelectType + '' + cacheIndex + "' name='" + timeSelectType + '' + cacheIndex + "'" +
        "            lay-verify='" + timeSelectType + '' + cacheIndex + "' placeholder=\"yyyy-MM-dd HH:mm:ss\" autocomplete=\"off\" class=\"layui-input\">\n" +
        "       </span>\n" +
        "      <button class=\"layui-btn  layui-btn-sm deleteBtn\" onclick='deleteItem(this," + cacheIndex + ")' title=\"删除\">\n" +
        "          <i class=\"layui-icon\">&#xe640;</i>\n" +
        "      </button>\n" +
        "      </div>" +
        "    </div>"
    );
    checkFormObj(itemIndex);
    formItems[itemIndex].fdtype = timeSelectType ;
    addSelectValueByWeb(obj);
    laydate.render({
        elem: '#' + timeSelectType + '' + cacheIndex
    });
};

var textareaInput = function (obj) {
    itemIndex++;
    let cacheIndex = itemIndex;
    let title = obj ?  obj.title : '长文本';
    $("#formBody").append(
        "  <div class=\"layui-form-item layui-form-text\">\n" +
        "    <input id='itemSelected" + cacheIndex + "' type='checkbox' style='display: none'>" +
        "    <label class=\"layui-form-label\" id='label" + cacheIndex + "'>" + title + "</label>\n" +
        "    <div class=\"layui-input-block\">\n" +
        "      <textarea id='" + textareaType + '' + cacheIndex + "'  name='" + textareaType + '' + cacheIndex + "' lay-verify='" + textareaType + '' + cacheIndex + "'" +
        "           placeholder=\"请输入内容\" class=\"layui-textarea\" ></textarea>\n" +
        "    </div>\n" +
        "  </div>"
    );
    checkFormObj(itemIndex);
    formItems[itemIndex].fdtype = textareaType ;
    addSelectValueByWeb(obj);
};

var deleteItem = function (obj,index) {
    $(obj).parent().parent().remove();
    delete formItems[index];
};

var deleteSingleSelectItem = function (obj,index) {
    $(obj).parent().remove();
    let selects = formItems[currentIndex].fdoptions.selectCheckBox;
    if (selects && selects.length > 0){
        let idx = $.inArray( {'name':$('#selectItemName' + index).val(),'value':$('#selectItemValue' + index).val(),'id':index}, selects );
        formItems[currentIndex].fdoptions.selectCheckBox.splice(idx,1);
    }
    let id = singleSelectType + currentIndex + "-" + index;
    $('#' + id).remove();
    $('#radio' + id).remove();
};

var addSingleSelectItem = function (object,isSwitch) {
    selectItemIndex++;
    let cacheIndex = selectItemIndex;
    let name = '';
    let value = '';
    if (object ){
        if (object.name)name = object.name;
        if (object.value)value = object.value;
    }
    $('#selectItems').append(
        "                   <div id='selectItemDiv" + cacheIndex + "'>" +
        "                    <div style=\"width: 40%;display: inline;margin-left: 2.5%\">\n" +
        "                        <label  style=\"font-size: 10px;width: 80%\">选项名</label>\n" +
        "                        <input type=\"text\" id='selectItemName" + cacheIndex + "' name='selectItemName' value='" + name + "' autocomplete=\"off\"  style=\"width:20%\" onchange='setSelectValue(" + cacheIndex + ")'>\n" +
        "                    </div>\n" +
        "                    <div style=\"width: 40%;display: inline;margin-left: 2.5%;margin-right: 2.5%\">\n" +
        "                        <label  style=\"font-size: 10px;width: 80%\">选项值</label>\n" +
        "                        <input type=\"text\" id='selectItemValue" + cacheIndex + "' name=\"selectItemValue\" value='" + value + "' autocomplete=\"off\"  style=\"width: 20%\" onchange='setSelectValue(" + cacheIndex + ")'>\n" +
        "                    </div>\n" +
        "                    <button class=\"layui-btn layui-btn-xs\" id='selectItemBtn" + cacheIndex + "' onclick='deleteSingleSelectItem(this," + cacheIndex + ")'  style=\"width: auto;margin-right: 2.5%\">删除该项</button>" +
        "                   </div>"
    );
    checkFormObj(currentIndex,true);
    if (!isSwitch){
        formItems[currentIndex].fdoptions.selectCheckBox.push({'name':$('#selectItemName' + cacheIndex).val(),'value':$('#selectItemValue' + cacheIndex).val(),'id':cacheIndex})
    }
    formItems[currentIndex].fdoptions.dic = null;
};

var setSelectValue = function (idx,isFromWeb) {
    let cacheIndex;
    let name  ;
    let value ;
    if (currentIndex !== -1){
        cacheIndex = currentIndex;
    }else if (isFromWeb){
        cacheIndex = itemIndex;
    }else {
        return;
    }
    let type = formItems[cacheIndex].fdtype;
    let id = type + cacheIndex + "-" + idx;//单选或多选id name
    let obj = $('#' + id);
    let selects = formItems[cacheIndex].fdoptions.selectCheckBox;

    for (let index = 0; index < selects.length; index++) {
        if (selects[index].id === idx){
            if (isFromWeb){
                name = formItems[cacheIndex].fdoptions.selectCheckBox[index].name  ;
                value = formItems[cacheIndex].fdoptions.selectCheckBox[index].value;
            }else {
                name  = $('#selectItemName' + idx).val();
                value = $('#selectItemValue' + idx).val();
                formItems[cacheIndex].fdoptions.selectCheckBox[index].name = name;
                formItems[cacheIndex].fdoptions.selectCheckBox[index].value = value;
            }
            switch (type) {
                case "singleSelect":
                    if (obj.length > 0){
                        obj.attr('value',value);
                        $('#radio' + id).text(name);
                    }else {
                        $('#' +singleSelectType + '' + cacheIndex).append(
                            "<input class='inputSelect' type='radio' id='" + id + "' value='" + value + "' style=\"vertical-align:middle;text-align:center\">" +
                            "<span class='inputSelect' id='radio" + id + "'>" + name + "</span>"
                        );
                    }
                    break;
                case "mulSelect":
                    if (obj.length > 0){
                        obj.attr('value',value);
                        $('#radio' + id).text(name);
                    }else {
                        $('#' + mulSelectType + '' + cacheIndex).append(
                            "<input class='inputSelect' type='checkbox' id='" + id + "' value='" + value + "' style=\"vertical-align:middle;text-align:center\">" +
                            "<span class='inputSelect' id='radio" + id + "'>" + name + "</span>"
                        );
                    }
                    break;
                case "drawSelect":
                    let object = $('#' + drawSelectType + '' + cacheIndex);
                    if (object.get(0).options.length >= idx){
                        object.get(0).options[idx - 1].value = value;
                        object.get(0).options[idx - 1].text = name;
                    }else {
                        object.append(new Option(name, value));
                    }
                    break;
            }
            break
        }
    }
};

var checkValueStatus = function () {
    let cacheObjName = [];
    for (let index in  formItems) { //
        if (flagSelect[index] === 'dic'){ //检查选项状态
            let cacheData = $('#selectDicItem').val();
            if (!cacheData){
                return -1;
            }else if (!formItems[index].fdoptions.dic){
                formItems[index].fdoptions.dic = cacheData;
            }
        }else if (flagSelect[index] === 'person'){

        }else {
            let selects = formItems[index].fdoptions.selectCheckBox;
            let names = [];
            let values = [];
            if (selects){
                for (let index = 0; index < selects.length; index++) {
                    let name = selects[index].name;
                    let value = selects[index].value;
                    if (name === "" || value === ""){
                        return -1;//选项名或选项值为空
                    }
                    if (names.indexOf(name) !== -1 || values.indexOf(value) !== -1){
                        return -2;//选项名或选项值重复
                    }
                    names.push(name);
                    values.push(value);
                }
            }
        }

        if (cacheObjName.indexOf(formItems[index].name) === -1){
            cacheObjName.push(formItems[index].name)
        }else {
            return -3;//绑定对象重复
        }
        if (!formItems[index].storder){
            formItems[index].storder = 0;
        }
    }
    return 0;
};

var deleteAllSingleSelectItem = function () {
    for (let index = 0; index <= selectItemIndex; index++) {
        let obj = $('#selectItemDiv' + index);
        if (obj && obj.length > 0) {
            obj.remove();
        }
    }
};

var generateTree = function (option, boObj) {
    let checked = option.checked || false;
    let spread = option.spread || false;
    let base = [];
    let parent = {'title': boObj.name, 'id': boObj.gid};
    parent.children = [];
    var data = option.data;
    for (let index = 0; index < data.length; index++) {
        let child = data[index];
        child.title = child.name;
        child.id = child.gid;
        child.checked = checked;
        child.spread = spread;
        parent.children.push(child);
    }
    base.push(parent);
    return base;
};

var checkFormObj = function (index,isCheckSelect) {
    if (!formItems[index]) {
        formItems[index] = {};
        formItems[index].fdoptions = {};
    }
    if (isCheckSelect && !formItems[index].fdoptions.selectCheckBox){
        formItems[index].fdoptions.selectCheckBox = [];
    }
};
