var template;
var existTemplate;
var pagedSelect;
var pageSizeSelect;
var queryfieldSelect;
var quickQueryFieldSelect;
var sortSelect;
var showFieldSelect;
var buttonSelect;
function initData(data){
    if(data){
        template = JSON.parse(data);
    }
}

layui.use(['element', 'form', 'tree','okUtils', "okLayer", 'constantUrl','zTable','xmSelect'],function () {
    $ = layui.jquery;
    searchExistTemplate();
});

function saveTemplate() {
    var paged = pagedSelect.getValue()[0].value;
    var pageSize = pageSizeSelect.getValue()[0].value;
    var queryFields = queryfieldSelect.getValue();
    var quickQueryFields = quickQueryFieldSelect.getValue();
    var queryField = [];
    queryFields.forEach(function (item) {
        queryField.push({
            field:item.code,
            label:item.name,
            oper:'like'
        });
    });
    var quickQueryField = [];
    quickQueryFields.forEach(function (item) {
        quickQueryField.push({
            field:item.code,
            label:item.name,
            oper:'like'
        });
    });
    var sortSelects = sortSelect.getValue();
    var sorts = [];
    sortSelects.forEach(function (item) {
        sorts.push({
            field:item.code,
            type:'desc'
        });
    });
    var showSelects = showFieldSelect.getValue();
    var showFields = [];
    showSelects.forEach(function (item) {
        showFields.push({
            field:item.code,
        });
    });
    var buttons = buttonSelect.getValue();
    var actbtn = [];
    buttons.forEach(function (item) {
        actbtn.push({
            key:item.value,
        });
    });

    var data = {
        dtid:template.gid,
        queryfield:queryField,
        quickqueryfield:quickQueryField,
        sortfield:sorts,
        actbtn:actbtn,
        showfield:showFields,
        paged:paged,
        pagesize:pageSize
    };

    if(existTemplate){
        layui.okUtils.ajax({
            url:layui.constantUrl.stForm.easyUpdate,
            data:{
                table:layui.constantUrl.stTable.table_data_template_design,
                clause:JSON.stringify({gid:existTemplate.gid}),
                mapStr:JSON.stringify(data)
            }
        }).done(function (result) {
            if(result.meow === 0) {
                layui.okLayer.msg.greenTick('更新成功', function () {
                    parent.layer.close(parent.layer.getFrameIndex(window.name));
                });
            }
        });
    }else {
        layui.okUtils.ajax({
            url:layui.constantUrl.stForm.easyInsert,
            data:{
                table:layui.constantUrl.stTable.table_data_template_design,
                mapStr:JSON.stringify(data)
            }
        }).done(function (result) {
            if(result.meow === 0) {
                layui.okLayer.msg.greenTick('添加成功', function () {
                    parent.layer.close(parent.layer.getFrameIndex(window.name));
                });
            }
        });
    }
}

function searchExistTemplate() {
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.easySelect,
        data:{
            table:layui.constantUrl.stTable.table_data_template_design,
            mapStr:JSON.stringify({
                dtid:template.gid
            })
        }
    }).done(function (result) {
        if(result.meow === 0) {
            if(result.data.length !== 0){
                existTemplate = result.data[0];
            }
            renderSelect();
        }
    });
}

function renderSelect() {
    layui.okUtils.getDic('paged',function (array,map){
        array.forEach(function (item,index) {
            item.value = item.key;
            if(existTemplate){
                if(existTemplate.paged == item.value){
                    item.selected = true;
                }
            }else {
                if(index === 0){
                    item.selected = true;
                }
            }
        });
        pagedSelect = formUtil.renderEasySelect($, {
            el: '#page_use_select',
            tips: '请选类型',
            name: 'paged',
            data: array
        });
    });
    layui.okUtils.getDic('page_size',function (array,map){
        array.forEach(function (item,index) {
            item.value = item.key;
            if(existTemplate){
                if(existTemplate.pagesize == item.value){
                    item.selected = true;
                }
            }else {
                if(index === 0){
                    item.selected = true;
                }
            }
        });
        pageSizeSelect = formUtil.renderEasySelect($, {
            el: '#page_size_select',
            tips: '请选类型',
            name: 'pagesize',
            data: array
        });
    });
    layui.okUtils.getDic('form_button_type',function (array,map){
        var existActionButtonMap;
        if(existTemplate && existTemplate.actbtn){
            existActionButtonMap = [];
            var existActionButton = JSON.parse(existTemplate.actbtn)
            existActionButton.forEach(function (item) {
                existActionButtonMap.push(item.key);
            });
        }
        array.forEach(function (item,index) {
            item.value = item.key;
            if(existActionButtonMap){
                if(existActionButtonMap.indexOf(item.value) !== -1){
                    item.selected = true;
                }
            }else {
                item.selected = true;
            }
        });
        buttonSelect = formUtil.renderEasySelect($, {
            el: '#button_select',
            tips: '请选类型',
            name: 'actbtn',
            radio: false,
            data: array,
            clickClose: false,
            repeat: false,
            model: {
                label: {
                    type: 'block',
                    block: {
                        showCount: 0,
                        showIcon: true
                    }
                }
            }
        });
    });
    layui.okUtils.ajax({
        url:layui.constantUrl.stForm.getTemplateFields,
        data:{
            dsid:template.dsid
        }
    }).done(function (result) {
        if(result.meow === 0){
            var existQueryFieldMap;
            if(existTemplate && existTemplate.queryfield){
                existQueryFieldMap = [];
                var exist = JSON.parse(existTemplate.queryfield);
                exist.forEach(function (item) {
                    existQueryFieldMap.push(item.field);
                });
            }
            var existQuickQueryFieldMap;
            if(existTemplate && existTemplate.quickqueryfield){
                existQuickQueryFieldMap = [];
                var exist = JSON.parse(existTemplate.quickqueryfield);
                exist.forEach(function (item) {
                    existQuickQueryFieldMap.push(item.field);
                });
            }
            var existSortFieldMap;
            if(existTemplate && existTemplate.sortfield){
                existSortFieldMap = [];
                var exist = JSON.parse(existTemplate.sortfield);
                exist.forEach(function (item) {
                    existSortFieldMap.push(item.field);
                });
            }
            var existShowFieldMap;
            if(existTemplate && existTemplate.showfield){
                existShowFieldMap = [];
                var exist = JSON.parse(existTemplate.showfield)
                exist.forEach(function (item) {
                    existShowFieldMap.push(item.field);
                });
            }

            var arrayQuery = [];
            var arrayQuickQuery = [];
            var arraySort = [];
            var arrayShow = [];
            result.data.forEach(function (item,index) {
                let cache = $.extend({},item);
                let cacheQuick = $.extend({},item);
                let cacheSort = $.extend({},item);
                let cacheShow = $.extend({},item);
                cache.value = cache.name;
                if(existQueryFieldMap){
                    if(existQueryFieldMap.indexOf(cache.code) !== -1){
                        cache.selected = true;
                    }
                }else {
                    cache.selected = true;
                }
                arrayQuery.push(cache);

                cacheQuick.value = cacheQuick.name;
                if(existQuickQueryFieldMap){
                    if(existQuickQueryFieldMap.indexOf(cacheQuick.code) !== -1){
                        cacheQuick.selected = true;
                    }
                }else {
                    cacheQuick.selected = true;
                }
                arrayQuickQuery.push(cacheQuick);

                cacheSort.value = cacheSort.name;
                if(existSortFieldMap){
                    if(existSortFieldMap.indexOf(cacheSort.code) !== -1){
                        cacheSort.selected = true;
                    }
                }else {
                    cacheSort.selected = true;
                }
                arraySort.push(cacheSort);

                cacheShow.value = cacheShow.name;
                if(existShowFieldMap){
                    if(existShowFieldMap.indexOf(cacheShow.code) !== -1){
                        cacheShow.selected = true;
                    }
                }else {
                    cacheShow.selected = true;
                }
                arrayShow.push(cacheShow)
            });
            queryfieldSelect = formUtil.renderEasySelect($, {
                el: '#search_field_select',
                tips: '请选字段',
                name: 'queryfield',
                radio: false,
                data: arrayQuery,
                clickClose: false,
                repeat: false,
                model: {
                    label: {
                        type: 'block',
                        block: {
                            showCount: 0,
                            showIcon: true
                        }
                    }
                }
            });

            quickQueryFieldSelect = formUtil.renderEasySelect($, {
                el: '#quick_search_field_select',
                tips: '请选字段',
                name: 'quickqueryfield',
                radio: false,
                data: arrayQuickQuery,
                clickClose: false,
                repeat: false,
                model: {
                    label: {
                        type: 'block',
                        block: {
                            showCount: 0,
                            showIcon: true
                        }
                    }
                }
            });

            sortSelect = formUtil.renderEasySelect($, {
                el: '#sort_field_select',
                tips: '请选字段',
                name: 'sortfield',
                radio: false,
                data: arraySort,
                clickClose: false,
                repeat: false,
                model: {
                    label: {
                        type: 'block',
                        block: {
                            showCount: 0,
                            showIcon: true
                        }
                    }
                }
            });

            showFieldSelect = formUtil.renderEasySelect($, {
                el: '#show_field_select',
                tips: '请选字段',
                name: 'showfield',
                radio: false,
                data: arrayShow,
                clickClose: false,
                repeat: false,
                model: {
                    label: {
                        type: 'block',
                        block: {
                            showCount: 0,
                            showIcon: true
                        }
                    }
                }
            });
        }
    });
}
