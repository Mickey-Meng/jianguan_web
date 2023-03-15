((function(factory, ctx, undefined){
	if ((typeof module) !== 'undefined' && module.exports) {
		var $ = require('jquery');
		var _  = require('underscore');
		var SfmWidgetBase = require('sfmWidgetBase');
        var OL2Helper = require('ol2Helper');
        require('openLayers2');
        module.exports = factory($, _, SfmWidgetBase, OL2Helper);
    } else if ((typeof define) === 'function' && define.amd) {
        define(['jquery', 'underscore', 'sfmWidgetBase', 'ol2Helper', 'openLayers2'], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.SfmMapIdentifyWidget = factory(ctx.$, ctx._, ctx.SFM.SfmWidgetBase, ctx.SFM.OL2Helper);
    }
})(function($, _, SfmWidgetBase, OL2Helper){
    var wkt = new OpenLayers.Format.WKT();

	var SfmMapIdentifyWidget = SfmWidgetBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            me.map = me.doAction('getMap');
            me.ol2Helper = new OL2Helper(me.map);
            me.data.queryUrl = me.getSfmModuleMgr().getServiceUrl('stQuery');
            me.url = me.data.queryUrl + 'identify';
            me._bindedOnMapClick = _.bind(me._onMapClick, me);
            me.isBusy = false;
            me.map.events.register('click', me.map, me._bindedOnMapClick);
        },
        destroy: function() {
            this.map.events.unregister('click', this.map, this._bindedOnMapClick)
            this.ol2Helper.quit();
        },
        showPopup: function(data, lonlat) {
            var me = this;
            var h;
            if(data.getMe.length == 0) {
                h = '无属性信息';
                return;
            } else {
                var res = data.getMe[0];
                h = '<table class="table table-striped table-bordered" style="margin-bottom:0;">' + _.map(res.fields, function(field) {
                    if(res.attributes[field.key] == undefined){
                        return '';
                    }
                    return '<tr><td>' + field.name + ': </td><td>' + res.attributes[field.key] + '</td></tr>';
                }).join('') + '</table>';
            }
            var popup = new OpenLayers.Popup.FramedCloud('popup', lonlat, null, h, null, true, function(e) {
                me.clearHighlight();
                popup.destroy();
                OpenLayers.Event.stop(e);
            });
            // popup.isAlphaImage = true;
            this.map.addPopup(popup, true);
        },
        clearHighlight: function() {
            this.curFeature && this.ol2Helper.clearHighlight(this.curFeature);
            return this;
        },
        showHighlight: function(data) {
            var me = this;
            if(data.getMe.length > 0) {
                this.clearHighlight();
                var res = data.getMe[0];
                var feature = this.curFeature = wkt.read(res.geometry.geometryText);
                this.ol2Helper.highlight(feature);
                this.showPopup(data, feature.geometry.getBounds().getCenterLonLat());
            }
        },

        _onMapClick: function(e) {
            var me = this;
            if(me.isBusy) return;
            me.isBusy = true;
            var lonlat = this.map.getLonLatFromViewPortPx(e.xy);
            me.ajax({
                url: me.url,
                data: {
                    x: lonlat.lon,
                    y: lonlat.lat,
                    count: 1,
                    radius: me.map.getResolution() * 2
                },
                dataType: 'json',
                success: function(data) {
                    me.isBusy = false;
                    if(data.success) {
                        // me.showPopup(data.data, lonlat);
                        me.showHighlight(data.data);
                    } else {
                        me.showMsg('获取属性信息失败')
                    }
                },
                error: function() {
                    me.isBusy = false;
                    me.showMsg('获取属性信息失败，可能是网络原因')
                }
            });
            return me;
        },

        __className__: 'SfmMapIdentifyWidget'
    });

    return SfmMapIdentifyWidget;
}, window));
