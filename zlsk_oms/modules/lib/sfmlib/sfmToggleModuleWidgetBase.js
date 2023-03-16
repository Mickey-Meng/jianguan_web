((function(factory, ctx, undefined){
	if ((typeof module) !== 'undefined' && module.exports) {
		var $ = require('jquery');
		var _  = require('underscore');
		var SfmResizableWidgetBase = require('sfmResizableWidgetBase');
        module.exports = factory($, _, SfmResizableWidgetBase);
    } else if ((typeof define) === 'function' && define.amd) {
        define(['jquery', 'underscore', 'sfmResizableWidgetBase'], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.SfmToggleModuleWidgetBase = factory(ctx.$, ctx._, ctx.SFM.SfmResizableWidgetBase);
    }
})(function($, _, SfmResizableWidgetBase){

	var SfmToggleModuleWidgetBase = SfmResizableWidgetBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.data.lms = [];
            me.addAction('desModuleVisibleChange', function(mk, visible){
                if(mk == me.data.dmk){
                    me.data.curState = visible ? 1 : 0;
                    me.__onDesModuleClosed__(visible);
                }
            });
        },
        destroy: function() {
            this._unbindEvents();
            this.base();
        },
        render: function(options) {
            var me = this;
            var cfg = me.getConfig();
            me.data.dmk = cfg.dmk;
            me.data.ui = {};
            me.data.ui.$btn = me.__getToggleBtn__();
            me._bindEvents();
            me.data.curState = cfg.curState || 0;
            me.showModule(me.data.curState == 1);
            me.base();
            return me;
        },

        __getToggleBtn__: function(){
            return this._el;
        },
        __desModuleVisibleChange__: function(visible){},

        showModule: function(visible){
            var me = this;
            me.data.curState = visible ? 1 : 0;
            if(visible){
                me.getSfmModuleMgr().loadModuleByKey(me.data.dmk, null, function(module){
                    me.data.lms.push(module);
                });
            }else{
                var d = me.data.lms;
                if(d){
                    for (var i = 0; i < d.length; i++) {
                        me.getSfmModuleMgr().destroyModule({mid: d[i].getId()}, true);
                    }
                }
            }
            return this;
        },

        _bindEvents: function(){
            var me = this;
            me.data.ui.$btn.on('click', function(){
                me.showModule((me.data.curState ^= 1) == 1);
            });
            return me;
        },
        _unbindEvents: function(){
            this.data.ui.$btn.off('click');
            return this;
        },

        __className__: 'SfmToggleModuleWidgetBase'
    });

    return SfmToggleModuleWidgetBase;
}, window));
