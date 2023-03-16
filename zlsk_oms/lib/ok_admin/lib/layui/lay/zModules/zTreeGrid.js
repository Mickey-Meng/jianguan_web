layui.define(['treeGrid','jquery'],function (exports) {
    var treeGrid = layui.treeGrid;
    var $ = layui.jquery;

    var zTreeGrid = function (option) {
        this.config = {
            iconOpen :false
            , height: 'full-40'
            , parseData: function (res) {
                return {
                    "code": res.meow,
                    "msg": res.msg,
                    "data": res.data
                };
            }
            , cellMinWidth: 100
            , page: false
        }
    };

    zTreeGrid.prototype.init = function(config){
        var _this = this;
        $.extend(true,_this.config,config);
        return _this;
    };

    zTreeGrid.prototype.getLayuiTreeGrid = function(){
        return treeGrid;
    };

    zTreeGrid.prototype.getTreeGrid = function () {
        return treeGrid.render(this.config);
    };

    exports("zTreeGrid", function (option) {
        return new zTreeGrid().init(option);
    });
});
