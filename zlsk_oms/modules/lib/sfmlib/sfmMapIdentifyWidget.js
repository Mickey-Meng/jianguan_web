((function(factory, ctx, undefined){
	if ((typeof module) !== 'undefined' && module.exports) {
		var $ = require('jquery');
		var _  = require('underscore');
		var SfmWidgetBase = require('sfmWidgetBase');
        module.exports = factory($, _, SfmWidgetBase);
    } else if ((typeof define) === 'function' && define.amd) {
        define(['jquery', 'underscore', 'sfmWidgetBase'], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.SfmMapIdentifyWidget = factory(ctx.$, ctx._, ctx.SFM.SfmWidgetBase);
    }
})(function($, _, SfmWidgetBase){
	var SfmMapIdentifyWidget = SfmWidgetBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.data.ol2Helper = null;
            me.data.queryUrl = me.getSfmModuleMgr().getServiceUrl('stQuery');
            me.data.layerManager = options.layerManager;
            me.data.url = me.data.queryUrl + 'identify';
            me.data._bindedOnMapClick = _.bind(me._onMapClick, me);
            me.data.isBusy = false;
            me.data.minr = options && options.minr != undefined ? options.minr : 0.3;
            me.data.rs = options && options.rs != undefined ? options.rs : 2;
        },
        destroy: function() {
            if(this.data.map){
                this.data.map.events.unregister('click', this.map, this.data._bindedOnMapClick);
            }
            if(this.data.ol2Helper){
                this.data.ol2Helper.quit();
            }
            this.base();
        },
        render: function(){
            var me = this;
            var mctx = me.data.mctx = me.doAction('getMapContext');
            if(!mctx){
                return me;
            }
            var map = me.data.map = mctx.map;
            map.events.register('click', map, me.data._bindedOnMapClick);
            return me;
        },
        stopPick: function(){
            this.data.map && this.data.map.events.unregister('click', this.map, this.data._bindedOnMapClick);
            return this;
        },
        showPopup: function(data, lonlat, feature) {
            var me = this;
            var h;
            if(!data || !data.attributes) {
                h = '无属性信息';
                return;
            } else {
                h = '<table class="table table-striped table-bordered" style="margin-bottom:0;">' +
                _.map(data.fields, function(field) {
                    if(data.attributes[field.key] == undefined){
                        return '';
                    }
                    return '<tr><td>' + field.name + ': </td><td>' + data.attributes[field.key] + '</td></tr>';
                }).join('');
                if(data.layerType == 'line' && data.attributes.GEOM_LENGTH != undefined){
                    h += '<tr><td>长度: </td><td>' + (Number(data.attributes.GEOM_LENGTH)).toFixed(2) +
                        '</td></tr>';
                }
                h += '</table>';
            }
            var popup = me.data.ol2Helper.popup(null, 'FramedCloud', lonlat, null, h, null, true, function(e) {
                me.clearHighlight(feature);
                popup.destroy();
                me.data.ol2Helper.stopEvent(e);
            });
            // popup.isAlphaImage = true;
            me.data.ol2Helper.addPopup(popup);
        },
        clearHighlight: function(feature) {
            feature && this.data.ol2Helper && this.data.ol2Helper.clearHighlight(feature);
            return this;
        },
        clearAllHighlight: function(){
            this.data.ol2Helper && this.data.ol2Helper.clearAllHighlight();
            return this;
        },
        showHighlight: function(data) {
            var me = this;
            var ol2Helper = me.data.ol2Helper || (me.data.ol2Helper = new me.data.mctx.OL2Helper(me.data.map));
            me.clearAllHighlight();
            ol2Helper.clearPopup();
            for(var i = 0;i < data.length;i++){
                var di = data[i];
                var f = ol2Helper.readWkt(di.geometry.geometryText);
                ol2Helper.highlight(f);
                if(me.options.showPopup !== false){
                    me.showPopup(di, f.geometry.getBounds().getCenterLonLat(), f);
                }
            }
            return me;
        },
        getVisibleLayerKeys: function(){
            var me = this;
            var lyrMgr = me.data.layerManager;
            var gl = lyrMgr.getGroupInfoByVisible(true);
            var ks = [];
            if(gl){
                for(var i = 0;i < gl.length;i++){
                    var gi = gl[i];
                    for(var j = 0;j < gi.layers.length;j++){
                        var gj = gi.layers[j].layerInfo;
                        if(gj.stLayerKeys){
                            for(var j = 0;j < gj.stLayerKeys.length;j++){
                                var k = gj.stLayerKeys[j];
                                if($.inArray(k, ks) < 0){
                                    ks.push(k);
                                }
                            }
                        }
                    }
                }
            }
            return ks.length > 0 ? ks.join(',') : '';
        },

        _onMapClick: function(e) {
            var me = this;
            if(me.data.isBusy) return me;
            me.data.isBusy = true;
            var lonlat = me.data.map.getLonLatFromViewPortPx(e.xy);
            var r = me.data.map.getResolution() * me.data.rs;
            var mr = me.data.minr;
            r < mr && (r = mr);
            me.ajax({
                url: me.data.url,
                data: {
                    layers: me.getVisibleLayerKeys(),
                    x: lonlat.lon,
                    y: lonlat.lat,
                    count: 1,
                    radius: r
                },
                dataType: 'json',
                success: function(data) {
                    if(!me.data){
                        return;
                    }
                    me.data.isBusy = false;
                    if(data.success) {
                        // me.showPopup(data.data, lonlat);
                        if(typeof me.options.onQueryResult == 'function'){
                            me.options.onQueryResult.call(this, data.data.getMe);
                        }
                        if(me.options.showHighlight !== false){
                            me.showHighlight(data.data.getMe);
                        }
                    } else {
                        if(typeof me.options.onQueryResult == 'function'){
                            me.options.onQueryResult.call(this, data.data.getMe);
                        }else{
                            me.showMsg('获取属性信息失败')
                        }
                    }
                },
                error: function() {
                    if(!me.data){
                        return;
                    }
                    me.data.isBusy = false;
                    if(typeof me.options.onQueryResult == 'function'){
                        me.options.onQueryResult.call(this, data.data.getMe);
                    }else{
                        me.showMsg('获取属性信息失败，可能是网络原因')
                    }
                }
            });
            return me;
        },

        __className__: 'SfmMapIdentifyWidget'
    });

    return SfmMapIdentifyWidget;
}, window));
