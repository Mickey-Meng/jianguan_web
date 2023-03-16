((function(factory, ctx, undefined){
    if ((typeof module) !== 'undefined' && module.exports) {
        var $ = require('jquery');
        var _  = require('underscore');
        var SfmToggleModuleWidgetBase = require('sfmToggleModuleWidgetBase');
        module.exports = factory($, _, SfmToggleModuleWidgetBase);
    } else if ((typeof define) === 'function' && define.amd) {
        define(['jquery', 'underscore', 'sfmToggleModuleWidgetBase'], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.SfmSingleBtnToggleModuleWidgetBase = factory(ctx.$, ctx._, ctx.SFM.SfmToggleModuleWidgetBase);
    }
})(function($, _, SfmToggleModuleWidgetBase){

    var SfmSingleBtnToggleModuleWidgetBase = SfmToggleModuleWidgetBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
        },
        render: function(options) {
            var me = this;
            var h = me.__getContentHtml__();
            me._el.html(h);
            me.base();
            return me;
        },

        showModule: function(visible){
            this.base(visible);
            this.__setBtnType__();
            return this;
        },

        __getContentHtml__: function(){
            var cfg = this.getConfig(true, true);
            var u = this.data.curState == 1 ? cfg.btnImgShow : cfg.btnImgHide;
            var h = '<div id="sbtmw_btn" style="width:100%;height: 100%;cursor: pointer;">' +
                '<img src="' + u + '" style="width:100%;height: 100%;" /></div>';
            return h;
        },
        __getToggleBtn__: function(){
            return this._el.find('#sbtmw_btn');
        },
        __desModuleVisibleChange__: function(visible){
            this.__setBtnType__();
            return this;
        },
        __setBtnType__: function(){
            var cfg = this.getConfig(true, true);
            var u = this.data.curState == 1 ? cfg.btnImgShow : cfg.btnImgHide;
            this.__getToggleBtn__().find('img')[0].src = u;
            return this;
        },

        __className__: 'SfmSingleBtnToggleModuleWidgetBase'
    });

    return SfmSingleBtnToggleModuleWidgetBase;
}, window));
