layui.define(['table','jquery','okUtils'],function (exports) {
    var table = layui.table;
    var $ = layui.jquery;
    var okUtils = layui.okUtils;

    var zTable = function () {
        this.tableConfig = {
            text:{none:'未查询到相关数据```'},
            cellMinWidth: 60,
            // skin:'row',
            even: false,
            size:'sm',//sm/lg
            page: true, //是否显示分页,
            limit: 10, //每页默认显示的数量
            height: 'full-40',
            request:{
                pageName:'pageNumber',
                limitName:'pageSize'
            },
            headers:{
                token:okUtils.getCookie("token")
            },
            parseData: function(res) { //res 即为原始返回的数据
                if(res.meow === 0){
                    return {
                        "code": res.meow, //解析接口状态
                        "msg": res.msg || '', //解析提示文本
                        "count": this.page ? res.data.total : res.data.length, //解析数据长度
                        "data": this.page ? res.data.getMe : res.data//解析数据列表
                    };
                }
            },
        }
    };

    zTable.prototype.init = function(config){
        var _this = this;
        $.extend(true,_this.tableConfig,config);
        return _this;
    };

    zTable.prototype.getLayuiTable = function(){
        return table;
    }

    zTable.prototype.getTable = function () {
        var tableIns = table.render(this.tableConfig);
        tableIns.resize();
        return tableIns;
    };

    exports("zTable", function (option) {
        return new zTable().init(option);
    });
});
