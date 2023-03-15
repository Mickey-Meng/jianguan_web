(function (window) {
    var formUtil = function () {
    };

    formUtil.prototype.renderBoTree = function (elem,clickCallback) {
        layui.okUtils.getDic('bo_type',function (array) {
            array.forEach(function (item) {
                item.title = item.name;
            });
            var bo_data = [{
                id:1,
                title:'业务对象分类',
                children:array,
                spread:true
            }];

            layui.tree.render({
                elem: elem,
                data: bo_data,
                id: 'id',
                spread: true,
                onlyIconControl: true,
                click: function (obj) {
                    clickCallback(obj);
                }
            })
        });
    };

    formUtil.prototype.renderDatasetTree = function (elem,clickCallback) {
        layui.okUtils.getDic('dataset_type',function (array) {
            array.forEach(function (item) {
                item.title = item.name;
            });
            var bo_data = [{
                id:1,
                title:'数据集分类',
                children:array,
                spread:true
            }];

            layui.tree.render({
                elem: elem,
                data: bo_data,
                id: 'id',
                spread: true,
                onlyIconControl: true,
                click: function (obj) {
                    clickCallback(obj);
                }
            })
        });
    };

    formUtil.prototype.renderEasySelect = function($,option){
        var config = {
            el: '',
            tips:'',
            name: '',
            filterable: true,
            repeat: true,
            radio: true,
            clickClose: true,
            data: [],
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
        };
        $.extend(true,config,option);
        return layui.xmSelect.render(config);
    };

    window.formUtil = new formUtil();

})(window);
