((function(factory, ctx, undefined) {
    if ((typeof module) !== 'undefined' && module.exports) {
        var $ = require('jquery');
        var _ = require('underscore');
        var sfmUtil = require('sfmUtil');
        require('openLayers2');
        module.exports = factory($, _, sfmUtil);
    } else if ((typeof define) === 'function' && define.amd) {
        define(['jquery', 'underscore', 'sfmUtil', 'openLayers2'], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.OlLayerManager = factory(ctx.$, ctx._, ctx.SFM.sfmUtil);
    }
})(function($, _, sfmUtil) {
    var VERSION = '0.0.1';

    var LAYER_TYPE_FOLDER = 'folder';

    var findByKey = function(list, key, value){
        if(!list){
            return null;
        }
        for(var i = 0;i < list.length;i++){
            if(list[i][key] == value){
                return list[i];
            }
        }
        return null;
    };

    var OlLayerManager = function(options) {
        if (!(this instanceof OlLayerManager)) {
            return new OlLayerManager(options);
        }

        this.initialize.apply(this, arguments);
    };

    OlLayerManager.prototype = {
        layerType: {
            LAYER_TYPE_FOLDER: LAYER_TYPE_FOLDER
        },

        initialize: function(options) {
            var me = this;
            me.data = {};
            me.options = options;
            me.config = options.config;
            me.data._map = options.map;

            me.data.layerTreeData = [];
            me.data.layerTreeArr = [];
            me.data.baseLayerArr = [];
            me.data.layerArr = [];
            me.data.baseStGroup = [];
            return me;
        },

        render: function() {
            var me = this;
            return me;
        },

        addLayerByConfig: function(layerConfig) {
            var me = this;
            if (!layerConfig || layerConfig.length == 0) {
                return me;
            }
            for (var i = 0; i < layerConfig.length; i++) {
                var lci = layerConfig[i];
                var l = me.addLayer(lci);
                var gn = lci.stGroup;
                var gl = lci.stGroupLabel || gn;
                if(lci.isBaseStGroup && gn){
                    me._addToBaseGroup({name: gn, label: gl, thumbnail: lci.thumbnail || ''});
                }
                if(!lci.isBaseLayer && !(lci.options && lci.options.isBaseLayer)){
                    me.data.layerTreeData.push(l);
                }
            }
            return me;
        },

        addLayer: function(layerInfo) {
            var me = this;
            if (!layerInfo) {
                return null;
            }
            var ln = layerInfo.name;
            var url = layerInfo.url;
            var t = layerInfo.nodeType;
            var tn = {
                id: layerInfo.id,
                name: layerInfo.label,
                checked: layerInfo.visible,
                layerInfo: layerInfo
            };
            if (t != LAYER_TYPE_FOLDER) {
                var lt = layerInfo.type || '';
                var l = null;
                var ts = layerInfo.options && layerInfo.options.tileSize;
                if (ts) {
                    if(typeof ts == 'string'){
                        var tsa = ts.split(',');
                        ts = new OpenLayers.Size(Number(tsa[0], Number(tsa[1])));
                    }
                }
                var to = layerInfo.options && layerInfo.options.tileOrigin;
                if (to) {
                    if(typeof to == 'string'){
                        var toa = to.split(',');
                        to = new OpenLayers.LonLat(Number(toa[0]), Number(toa[1]));
                    }
                }
                var prj = layerInfo.options && layerInfo.options.projection;
                if(prj){
                    layerInfo.options.projection = new OpenLayers.Projection(prj);
                }
                switch (lt.toUpperCase()) {
                    case 'WMS':
                        var p = OpenLayers.Util.extend({
                            layers: layerInfo.layers,
                            transparent: true
                        }, layerInfo.params);
                        var o = OpenLayers.Util.extend({
                            singleTile: true,
                            isBaseLayer: layerInfo.isBaseLayer,
                            opacity: layerInfo.opacity,
                            getURL: function(bounds) {
                                me._setWMSParamLayers(this);
                                return OpenLayers.Layer.WMS.prototype.getURL.apply(this, [bounds]);
                            }
                        }, layerInfo.options);
                        ts && (o.tileSize = ts);
                        to && (o.tileOrigin = to);
                        l = new OpenLayers.Layer.WMS(ln, url, p, o);

                        break;
                    case 'WMTS':
                        var mids = layerInfo.matrixIds;
                        if (mids && mids.length > 0 && typeof mids[0] == 'object') {
                            var tla = null;
                            for (var i = 0; i < mids.length; i++) {
                                tla = mids[i].topLeft;
                                if (tla) {
                                    tla = tla.split(',');
                                    mids[i].topLeftCorner = new OpenLayers.LonLat(Number(tla[0]), Number(tla[1]));
                                }
                            }
                        }
                        var p = OpenLayers.Util.extend({
                            name: ln,
                            url: url,
                            layer: layerInfo.layer,
                            style: layerInfo.style,
                            matrixSet: layerInfo.matrixSet,
                            matrixIds: layerInfo.matrixIds,
                            opacity: layerInfo.opacity,
                            isBaseLayer: layerInfo.isBaseLayer
                        }, layerInfo.options);
                        ts && (p.tileSize = ts);
                        to && (p.tileOrigin = to);
                        if(layerInfo.tileFullExtent){
                            p.tileFullExtent = new OpenLayers.Bounds(layerInfo.tileFullExtent);
                        }
                        l = new OpenLayers.Layer.WMTS(p);
                        break;
                    case 'XYZ':
                        l = new OpenLayers.Layer.XYZ(ln, url, layerInfo.options);
                        break;
                    case 'BAIDUTILE':
                        var p = OpenLayers.Util.extend({
                            isBaseLayer: layerInfo.isBaseLayer
                        }, layerInfo.options);
                        var l = new OpenLayers.Layer.BaiduTile(layerInfo.name, p);
                        break;
                    default:
                        break;
                }
                if (l != null) {
                    l.visibility = layerInfo.visible;
                    //layerInfo.initVisible != undefined && (l.visibility = layerInfo.initVisible);
                    /*if(layerInfo.maxRes != undefined && layerInfo.minRes != undefined){
                        l.calculateInRange = function(){
                            var lio = me._findLayerInfoObj(this);
                            var f = true;
                            lio && (f = me._checkVisible(lio.layer, lio));
                            return f;
                        };
                    }*/
                    me.data._map.addLayer(l);
                    tn.layerId = l.id;
                    tn.id || (tn.id = l.id);
                    // tn.layer = l;
                    (layerInfo.isBaseLayer || (layerInfo.options && layerInfo.options.isBaseLayer) ? me.data.baseLayerArr : me.data.layerTreeArr).push(tn);
                    me.data.layerArr.push({
                        id: tn.id,
                        layerId: l.id,
                        name: tn.name,
                        layer: l,
                        visible: layerInfo.visible,
                        layerInfo: layerInfo
                    });
                }
            }
            if(layerInfo.children && layerInfo.children.length > 0){
                tn.children = [];
                for(var i = 0;i < layerInfo.children.length;i++){
                    var cn = me.addLayer(layerInfo.children[i]);
                    if(!layerInfo.children[i].isBaseLayer){
                        tn.children.push(cn);
                    }
                }
            }
            return tn;
        },
        setLayerVisible: function(id, name, visible, keys){
            var me = this;
            var lo = null;
            var lo2 = null;
            if(id){
                lo = _.findWhere(me.data.layerTreeArr, {id: id});
                lo2 = _.findWhere(me.data.layerArr, {id: id});
            }else if(name){
                lo = _.findWhere(me.data.layerTreeArr, {name: name});
                lo2 = _.findWhere(me.data.layerArr, {name: name});
            }
            if(!lo || !lo2){
                return me;
            }
            if(lo2.layer){
                // lo2.layer.visibility = visible;
                lo2.layer.setVisibility(visible);
                lo2.visible = visible;
                if(visible && keys != null){
                    if(lo.layerInfo.layers){
                        _.each(lo.layerInfo.layers, function(layer){
                            layer.visible = (',' + keys + ',').indexOf(',' + layer.key + ',') >= 0;
                        });
                        lo2.layer.redraw(true);
                    }
                }
            }
            return me;
        },
        setLayerVisibleByGroup: function(group, visible){
            var me = this;
            for(var i = 0;i < me.data.layerArr.length;i++){
                var li = me.data.layerArr[i];
                if(li.layerInfo.stGroup == group){
                    if(li.layer){
                        li.visible = visible;
                        var b = me._checkVisible(li.layer, li);
                        if(li.layer.getVisibility() != b){
                            li.layer.setVisibility(b);
                        }
                    }
                }
            }
            return me;
        },
        getGroupInfoByVisible: function(visible){
            var me = this;
            var gl = [];
            for(var i = 0;i < me.data.layerArr.length;i++){
                var li = me.data.layerArr[i];
                var g = li.layerInfo.stGroup;
                if(g == undefined){
                    continue;
                }
                var b = me._checkVisible(li.layer, li);
                var gi = findByKey(gl, 'group', g);
                if(!gi){
                    gi = {
                        group: g,
                        layers: [],
                        visible: b
                    };
                    gl.push(gi);
                }
                gi.layers.push({layerInfo: li.layerInfo, visible: b});
                gi.visible = gi.visible || b;
            }
            var l = [];
            for(var i = 0;i < gl.length;i++){
                if(gl[i].visible === visible){
                    l.push(gl[i]);
                }
            }
            return l;
        },
        getLayerTreeData: function(){
            return this.data.layerTreeData;
        },
        getLayerListByType: function(types){
            var me = this;
            var ll = [];
            for(var i = 0;i < me.data.layerTreeArr.length;i++){
                var li = me.data.layerTreeArr[i];
                if($.inArray(li.layerInfo.type, types) >= 0){
                    ll.push(li);
                }
            }
            return ll;
        },
        getLayerListByNodeType: function(types){
            var me = this;
            var ll = [];
            for(var i = 0;i < me.data.layerTreeArr.length;i++){
                var li = me.data.layerTreeArr[i];
                if($.inArray(li.layerInfo.nodeType, types) >= 0){
                    ll.push(li);
                }
            }
            return ll;
        },
        getLayerById: function(id){
            return _.findWhere(this.data.layerArr, {layerId: id});
        },
        getBaseLayer: function() {
            return this.data.baseLayerArr;
        },
        setBaseLayer: function(id) {
            var obj = _.findWhere(this.data.baseLayerArr, { id: id });
            if (obj) this.data._map.setBaseLayer(obj.layer);
        },
        getBaseGroups: function(){
            return $.extend(true, [], this.data.baseStGroup);
        },
        refreshLayerVisible: function(){
            for(var k in this.data.layerArr){
                var li = this.data.layerArr[k];
                var v = this._checkVisible(li.layer, li);
                li.layer && (li.layer.setVisibility(v));
            }
        },

        _setWMSParamLayers: function(ctx) {
            var me = this;
            var layerObj = _.findWhere(me.data.layerTreeArr, { id: ctx.id }) || _.findWhere(me.data.baseLayerArr, { id: ctx.id });
            if (layerObj) {
                var layers = _.pluck(_.filter(layerObj.layerInfo.layers, function(lyr){
                    return lyr.visible
                }), 'key').join(',');
                ctx.params.LAYERS = layers;
            }
        },
        _findLayerInfoObj: function(layer){
            var me = this;
            for(var i = 0;i < me.data.layerArr.length;i++){
                var li = me.data.layerArr[i];
                if(li.layer == layer){
                    return li;
                }
            }
            return null;
        },
        _checkVisible: function(layer, options){
            if(!layer){
                return true;
            }
            var me = this;
            var li = options.layerInfo;
            var map = layer.map;
            // check by visible
            var f = options.visible;
            if(!f){
                return f;
            }
            // check by resolution
            if(li.maxRes != undefined && li.minRes != undefined){
                var res = map.getResolution();
                f = ( (res >= li.minRes) && (res <= li.maxRes) );
                if(!f){
                    return f;
                }
            }
            return f;
        },
        _addToBaseGroup: function(options){
            var gns = this.data.baseStGroup;
            for(var i = 0;i < gns.length;i++){
                var gi = gns[i];
                if(gi.name == options.name){
                    return;
                }
            }
            this.data.baseStGroup.push(options);
            return this;
        },

        __className__: 'OlLayerManager',
        version: VERSION
    }
    return OlLayerManager;
}, window));
