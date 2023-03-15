var $;
var tempLateId;
var template;
var templateField = [];
var templateFieldMap = {};
var selectIds = [];
var tableName;
var parentFlag ;
var colorArray = ['#FF3333','#FFCC22','#99FF33','#33FFDD','#5599FF','#B94FFF'];

var table;
layui.use(['tree', 'form', 'table', 'okUtils', "okLayer", 'constantUrl', 'zTable','xmSelect'],function () {
    $ = layui.jquery;

    tempLateId = layui.okUtils.getUrlParameter('templateId');
    getTableName();
});

function getTableName() {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easySelect,
        data:{
            table:layui.constantUrl.stTable.table_data_template,
            mapStr:JSON.stringify({gid:tempLateId})
        }
    }).done(function (result) {
        if(result.meow === 0){
            var dsid = result.data[0].dsid;
            layui.okUtils.ajax({
                url:layui.constantUrl.stForm.easySelect,
                data:{
                    table:layui.constantUrl.stTable.table_data_set,
                    mapStr:JSON.stringify({gid:dsid})
                }
            }).done(function (result) {
                if(result.meow === 0){
                    tableName = result.data[0].tableName;
                    getTemplateInfo();
                }
            });
        }
    });
}

function getTemplateInfo() {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easySelect,
        data:{
            table:layui.constantUrl.stTable.table_data_template_design,
            mapStr:JSON.stringify({dtid:tempLateId})
        }
    }).done(function (result) {
        if(result.meow === 0){
            template = result.data[0];
            getTemplateField();
        }
    });
}

function getTemplateField(templateId) {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easySelect,
        data:{
            table:layui.constantUrl.stTable.table_data_template_field,
            mapStr:JSON.stringify({dtid:tempLateId})
        }
    }).done(function (result) {
        if(result.meow === 0){
            templateField = result.data;
            requestDic();
        }
    });
}

function checkIsDicCallbackSuccess() {

}

function requestDic() {
    var dics = '';
    templateField.forEach(function (item,index) {
        if(item.ftype === 'singleSelect'){
            dics += item.dic;
            if(index < templateField.length - 1){
                dics += ',';
            }
            item.dicKey = item.dic;
        }
        templateFieldMap[item.code] = item;
    });
    if ($.isEmptyObject(templateFieldMap)){
        layui.okLayer.confirm('警告 未查询到字段',function () {
            parent.layer.close(parent.layer.getFrameIndex(window.name));
        });
        return
    }
    if(!dics || dics === ''){
        renderQueryUi();
        renderTable();
    }else {
        layui.okUtils.ajax({
            url:layui.constantUrl.stAuth.selectDicByParentKey,
            param:{keyStr:dics}
        }).done(function (data) {
            var allDic = data.data;
            for (var key in templateFieldMap) {
                var item = templateFieldMap[key];
                if (item.dicKey) {
                    item.dicArray = allDic[item.dicKey];
                    var dicMap = [];
                    item.dicArray.forEach(function (dicItem) {
                        dicMap[dicItem.key] = dicItem.value;
                    });
                    item.dicMap = dicMap;
                }
            }
            var quickQueryField = JSON.parse(template.quickqueryfield);
            renderQueryUi();
            quickQueryHtml(quickQueryField);
            let count = quickQueryField ? quickQueryField.length : 0;
            renderTable(count);
        });
    }
}

function renderPage() {
    var queryField = JSON.parse(template.queryfield);
    var quickQueryField = JSON.parse(template.quickqueryfield);
    var sortField = JSON.parse(template.sortfield);
    var actBtn = JSON.parse(template.actbtn);
    var showField = JSON.parse(template.showfield);
    var pageSize = template.pagesize;
    var paged = template.paged;
    renderQueryUi(queryField);
}

function getSelectId(name) {
    return 'select_' + name;
}

function renderQueryUi() {
    var queryField = JSON.parse(template.queryfield);

    var queryDom = $('#toolbar');
    queryDom.attr('height','58px');
    var form = '<form class="layui-form layui-col-md12" id="search-form" >';
    queryField.forEach(function (item) {
        var attrField = templateFieldMap[item.field];
        var type = attrField.ftype;
        var label = item.label;
        var name = attrField.code;
        if(type === 'text'){
            form += '<div class="layui-input-inline ok-search">\n' +
                '            <input class="layui-input" placeholder="'+ label +'" autocomplete="off" name="'+ name +'" >\n' +
                '        </div>';
        }else if(type === 'singleSelect'){
            var selectId = getSelectId(name);
            selectIds.push(selectId);
            form += ' <div class="layui-input-inline" style="width: 200px;">\n' +
                '            <div data-name="' + name + '" id="'+ selectId +'"></div>\n' +
                '        </div>';
        }
    });
    form += ' <button id="btn_search" style="margin-left: 10px" class="layui-btn" lay-submit="" lay-filter="search" title="条件查询">\n' +
        '            <i class="layui-icon">&#58901;</i>\n' +
        '        </button>\n' +
        '        <button type="reset" class="layui-btn" id="btn_reset" title="重置刷新">\n' +
        '            <i class="layui-icon">&#58982;</i>\n' +
        '        </button>\n' +
        '        <button class="layui-btn" id="btn_add" title="添加">\n' +
        '            <i class="layui-icon">&#58964;</i>\n' +
        '        </button>';

    queryDom.append(form);
}

function quickQueryHtml(quickQueryField) {
    let dom = $('#quickQuery');
    $.each(quickQueryField,function (index,value) {
        let tr = '';
        let map = templateFieldMap[value.field].dicMap;
        let count = 0;
        if(map){
            for (let key in map){
                if (key === 'remove')continue;
                let color = colorArray[count % 6];
                tr += "<button  class=\"layui-btn layui-btn-sm \" onclick='quickQuery(\"" + key + "\"" + ",\"" + value.field + "\")' style='color: white;background:" + color + "'>" + map[key] + "</button>";
                count ++;
            }
        }
        dom.append('<div>').append(tr).append('</div>');
    })
}

var quickQuery = function(data,keyData) {
    let param = {};
    param[keyData] = data;
    table.refresh({
        where:{
            table:tableName,
            mapStr:JSON.stringify(param),
        },
        curr: 1
    });
};

function renderTable(count) {
    var showField = JSON.parse(template.showfield);
    var cols = [];
    showField.forEach(function (item) {
        var config = {
            field:item.field,
            title:templateFieldMap[item.field].name,
        };
        if(templateFieldMap[item.field].dicMap){
            config.templet = function (d) {
                return templateFieldMap[item.field].dicMap[d[item.field]];
            }
        }
        cols.push(config);
    });
    var actBtn = JSON.parse(template.actbtn);
    var buttonMap = {
        form_button_type_detail:'<a class="layui-btn layui-btn-sm" lay-event="detail">明细</a>' ,
        form_button_type_edit:'<a class="layui-btn layui-btn-normal layui-btn-sm" lay-event="edit">编辑</a>',
        form_button_type_delete:'<a class="layui-btn layui-btn-danger layui-btn-sm" lay-event="del">删除</a>'
    };
    var operate = '';
    actBtn.forEach(function (item) {
        operate += buttonMap[item.key];
    });
    cols.push({field: 'operate', title: '操作',align:'center',width:320,templet:function (d) {
            return operate;
        }});

    let height = 'full-' + (count*35 + 40);
    var zTable = layui.zTable({
        elem: '#table',
        page:true,
        url:layui.constantUrl.stForm.easySelectWithPagination,
        where:{table:tableName},
        height:height,
        toolbar:'#toolbar',
        size:'lg',
        cols: [cols]
    });
    table = zTable.getTable();
    zTable.getLayuiTable().on('tool(table)', function(obj){
        var data = obj.data;
        var layEvent = obj.event;
        if(layEvent === 'detail'){
            layui.okUtils.ajax({'url':layui.constantUrl.stForm.easySelect,'param':{'table':'zlsk_oms_dt_form_rel','mapStr':JSON.stringify({'dtid':tempLateId})}}).done(function (data1) {
                if (data1.meow === 0 && data1.data && data1.data.length > 0){
                    let fmid = data1.data[0].fmid;
                    layui.okLayer.open("信息查看", "formManage/formPreview.html?fmId=" + fmid + "&templateId=" + tempLateId + "&xxId=" + data.gid + "&previewType=detail", "100%", "100%",function (dom,index) {

                    },function () {

                    });
                }else {
                    layui.layer.alert('警告 获取数据失败')
                }
            });
        } else if(layEvent === 'edit') {
            parentFlag = 0;
            layui.okUtils.ajax({
                'url': layui.constantUrl.stForm.easySelect,
                'param': {'table': 'zlsk_oms_dt_form_rel', 'mapStr': JSON.stringify({'dtid': tempLateId})}
            }).done(function (data1) {
                if (data1.meow === 0 && data1.data && data1.data.length > 0) {
                    let fmid = data1.data[0].fmid;
                    layui.okLayer.open("编辑信息", "formManage/formPreview.html?fmId=" + fmid + "&templateId=" + tempLateId + "&xxId=" + data.gid + "&previewType=edit" , "100%", "100%", function (dom, index) {}, function () {
                        if (parentFlag !== 0){
                            table.refresh()
                        }
                    });
                } else {
                    layui.layer.alert('警告 获取数据失败')
                }
            });
        }else if(layEvent === 'del'){
            layui.okUtils.ajax({
                'url': layui.constantUrl.stForm.easyDelete,
                'param': {'table': tableName, 'mapStr': JSON.stringify({'gid': data.gid})}
            }).done(function (data1) {
                if (data1.meow === 0){
                    table.refresh();
                }else {
                    layui.layer.alert('警告 删除失败');
                }
            })
        }
    });


    var queryDom = $('#toolbar');
    queryDom.html('');
    renderSelect();
    layui.form.on('submit(search)', function(data){
        table.refresh({
            where:{
                table:tableName,
                mapStr:JSON.stringify(data.field),
            },
            curr: 1
        });
        return false;
    });
    $('#btn_add').off('click').on('click',function () {
        parentFlag = 0;
        layui.okUtils.ajax({
            'url': layui.constantUrl.stForm.easySelect,
            'param': {'table': 'zlsk_oms_dt_form_rel', 'mapStr': JSON.stringify({'dtid': tempLateId})}
        }).done(function (data1) {
            if (data1.meow === 0 && data1.data && data1.data.length > 0) {
                let fmid = data1.data[0].fmid;
                layui.okLayer.open("添加信息", "formManage/formPreview.html?fmId=" + fmid + "&templateId=" + tempLateId + "&previewType=add" , "100%", "100%", function (dom, index) {}, function () {
                    if (parentFlag !== 0){
                        table.refresh()
                    }
                });
            } else {
                layui.layer.alert('警告 获取数据失败')
            }
        });
        return false;
    });
    $('#btn_reset').click(function () {
        table.refresh({
            where:{
                table:tableName,
            },
            curr: 1
        });
    });
}

function renderSelect() {
    selectIds.forEach(function (item) {
        var name = $('#' + item)[0].dataset.name;
        var field = templateFieldMap[name];
        field.dicArray.forEach(function (dic) {
            dic.value = dic.key;
        });
        formUtil.renderEasySelect($, {
            el: '#' + item,
            tips: field.name,
            name: field.code,
            data: field.dicArray,
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
