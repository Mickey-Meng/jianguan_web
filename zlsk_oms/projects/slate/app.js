((function(factory, ctx, undefined){
	if ((typeof module) !== 'undefined' && module.exports) {
		var $ = require('jquery');
		var _  = require('underscore');
		var SfmAppBase = require('SfmAppBase');
        module.exports = factory($, _, SfmAppBase);
    } else if ((typeof define) === 'function' && define.amd) {
        define(['jquery', 'underscore', 'sfmModuleBase'], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.SfmApp = factory($, _, ctx.SFM.SfmAppBase);
    }
})(function($, _, SfmAppBase){

	var SfmApp = SfmAppBase.extend({
		constructor: function(options){
			this.base(options);
		},
		start: function(){
			var me = this;
			return this;
		},

		__className__: 'SfmApp'
	});

	return SfmApp;
}, window));
