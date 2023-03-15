(function(factory, context) {
    if (typeof module != 'undefined' && module.exports) {
        require('openLayers2');
        require('plottingSymbols');
        module.exports = factory();
    } else if(typeof define == 'function' && define.amd) {
        define(['openLayers2', 'plottingSymbols'], function() {
            return factory();
        });
    } else {
        if(context.SFM == undefined){
            context.SFM = {};
        }
        var oldRef = context.SFM.OL2Helper;
        context.SFM.OL2Helper = factory(oldRef, context);
    }
})(function(oldRef, context) {
    var Ol2 = OpenLayers;
    var wkt = null;

    var fguid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    var OL2Helper = function(map, win) {
        if(!(this instanceof OL2Helper)) return new OL2Helper(map);
        this.__win__ = win || window;
        Ol2 = this.__win__.OpenLayers || window.OpenLayers;
        if(!(map instanceof Ol2.Map)) throw 'TYPE ERROR:map is supposed to be OpenLayers.Map instance!';
        this.__map__ = map;
        wkt = new Ol2.Format.WKT();
        this.initialize();
    };

    OL2Helper.prototype.initialize = function() {
        var me = this;
        this.initDrawControl();
        this.initMeasureControl();
        this.initHightlightLayer();
        this.initVectorLayer();
        this.initTempLayers();
        this._bindEsc = function(e) {
            if(e.keyCode == 27) {
                me.stopAll();
            }
        };
        $(this.__win__.document).on('keyup', this._bindEsc)
    };

    OL2Helper.prototype.noConflict = function() {
        if(context) context.SFM.OL2Helper = oldRef;
        return this;
    };

    OL2Helper.prototype.getMap = function() {
        return this.__map__;
    };

    OL2Helper.prototype.stopEvent = function(){
        return Ol2.Event.stop.call(this, arguments);
    };
    OL2Helper.prototype.preventDefaultEvent = function(){
        return Ol2.Event.preventDefault.call(this, arguments);
    };

    OL2Helper.prototype.stopAll = function() {
        this.stopDraw();
        this.stopMeasure();
        this.stopSelect();
        this.stopIdentify();
        return this;
    };

    OL2Helper.prototype.quit = function() {
        var map = this.getMap();
        this.stopAll();
        if(map.getLayer(this.drawLayer.id)) map.removeLayer(this.drawLayer);
        if(map.getLayer(this.highlightLayer.id)) map.removeLayer(this.highlightLayer);
        if(map.getLayer(this.vectorLayer.id)) map.removeLayer(this.vectorLayer);
        this.removeAllTempLayer();
        this.clearPopup();
        for(key in this.drawControl) {
            map.removeControl(this.drawControl[key]);
        }
        for(key in this.measureControl) {
            map.removeControl(this.measureControl[key]);
        }
        $(this.__win__.document).off('keyup', this._bindEsc)
    };

    /*===========================
    =            wkt            =
    ===========================*/
    OL2Helper.prototype.readWkt = function(coords) {
        return wkt.read(toSWkt(coords));
    };

    OL2Helper.prototype.writeWkt = function(feature) {
        return wkt.write(feature);
    };
    var isSWkt = function(str){
        return checkSWkt(str) != null;
    };
    var checkSWkt = function(str){
        var si = str.indexOf('(');
        var t = null;
        var s = str.toUpperCase();
        if(s.indexOf('MULTIPOINT') == 0){
            t = 'MULTIPOINT';
        }else if(s.indexOf('MULTILINESTRING') == 0){
            t = 'MULTILINESTRING';
        }else if(s.indexOf('MULTIPOLYGON') == 0){
            t = 'MULTIPOLYGON';
        }else if(s.indexOf('POINT') == 0){
            t = 'POINT';
        }else if(s.indexOf('LINESTRING') == 0){
            t = 'LINESTRING';
        }else if(s.indexOf('POLYGON') == 0){
            t = 'POLYGON';
        }else if(s.indexOf('GEOMETRYCOLLECTION') == 0){
            t = 'GEOMETRYCOLLECTION';
        }else{
            return null;
        }
        if(t.length == si){
            return t;
        }
        return null;
    };
    var toOgcGt = function(str){
        var s = str.toUpperCase();
        var t = null;
        if(s.indexOf('MULTIPOINT') == 0){
            t = 'MULTIPOINT';
        }else if(s.indexOf('MULTILINESTRING') == 0){
            t = 'MULTILINESTRING';
        }else if(s.indexOf('MULTIPOLYGON') == 0){
            t = 'MULTIPOLYGON';
        }else if(s.indexOf('POINT') == 0){
            t = 'POINT';
        }else if(s.indexOf('LINESTRING') == 0){
            t = 'LINESTRING';
        }else if(s.indexOf('POLYGON') == 0){
            t = 'POLYGON';
        }else if(s.indexOf('GEOMETRYCOLLECTION') == 0){
            t = 'GEOMETRYCOLLECTION';
        }
        return t;
    };
    var toSWkt = function(str){
        if(isSWkt(str)) return str;
        var si = str.indexOf('(');
        var t = toOgcGt(str);
        var s = str.substr(si);
        return t + reduceDimension(s, '(', ')', ',', ' ', 2);
    };
    var reduceDimension = function(str, cs, ce, es, ds, dn){
        if(!str){
            return str;
        }
        var a = [];
        var c = 0;
        dn == null && (dn = 2);
        for(var i = 0;i < str.length;i++){
            var si = str[i];
            if(si == cs || si == ce || si == es){
                a.push(si);
                c = 0;
            }else{
                si == ds && c++;
                if(c < dn){
                    a.push(si);
                }else{
                    continue;
                }
            }
        }
        return a.join('');
    };
    /*=====  End of wkt  ======*/



    /*============================
    =            draw            =
    ============================*/
    DRAW_TYPE_MAP = {
        "point": {
            "code": "ST1001",
            "handler": "Point",
            "geometry": "Point"
        },
        "line": {
            "code": "ST1002",
            "handler": "Path",
            "geometry": "LineString",
            "options": {
                handlerOptions: {
                    maxVertices: 2
                }
            }
        },
        "path": {
            "code": "ST1003",
            "handler": "Path",
            "geometry": "LineString"
        },
        "polyline": {
            "code": "ST1004",
            "handler": "Path",
            "geometry": "LineString"
        },
        "polygon": {
            "code": "ST1005",
            "handler": "Polygon",
            "geometry": "Polygon"
        },
        "box": {
            "code": "ST1006",
            "handler": "RegularPolygon",
            "geometry": "Polygon",
            "options": {
                handlerOptions: {
                    sides: 4,
                    irregular: true
                }
            }
        },
        "circle": {
            "code": "ST1007",
            "handler": "RegularPolygon",
            "geometry": "Polygon",
            "options": {
                handlerOptions: {
                    sides: 48,
                    irregular: false
                }
            }
        },


        "geoPoint": {
            "code": "ST2001",
            "handler": "PointEx",
            "geometry": "GeoPoint",
            "options": {
                style: {
                    fillColor: "#323232",
                    fillOpacity: 0.4,
                    strokeColor: "#323232",
                    strokeOpacity: 0.8,
                    strokeWidth: 15,
                    strokeDashstyle: "dash"
                }
            }
        },
        "geoMultiPoint": {
            "code": "ST2002",
            "handler": "MultiPointEx",
            "geometry": "GeoMultiPoint",
            "options": {
                style: {
                    fillColor: "#323232",
                    fillOpacity: 1,
                    strokeColor: "#323232",
                    strokeOpacity: 1,
                    strokeWidth: 1,
                    pointRadius: 8
                }
            }
        },

        "geoPolyline": {
            "code": "ST2003",
            "handler": "PolyLineEx",
            "geometry": "GeoPolyline"
        },
        // 圆弧
        "geoArc": {
            "code": "ST2004",
            "handler": "ArcEx",
            "geometry": "GeoArc"
        },
        // 自由线
        "geoFreeLine": {
            "code": "ST2005",
            "handler": "FreelineEx",
            "geometry": "GeoFreeline"
        },
        "geoBizer2": {
            "code": "ST2006",
            "handler": "BezierCurve2Ex",
            "geometry": "GeoBezierCurve2"
        },
        "geoBizer3": {
            "code": "ST2007",
            "handler": "BezierCurve3Ex",
            "geometry": "GeoBezierCurve3"
        },
        "geoBizerN": {
            "code": "ST2008",
            "handler": "BezierCurveNEx",
            "geometry": "GeoBezierCurveN"
        },
        // cardinal曲线
        "geoCardinalCurve": {
            "code": "ST2009",
            "handler": "CardinalCurveEx",
            "geometry": "GeoCardinalCurve"
        },

        "geoCircle": {
            "code": "ST3001",
            "handler": "CircleEx",
            "geometry": "GeoCircle"
        },
        "geoEllipse": {
            "code": "ST3002",
            "handler": "EllipseEx",
            "geometry": "GeoEllipse"
        },
        "geoSector": {
            "code": "ST3003",
            "handler": "Sector",
            "geometry": "GeoSector"
        },
        // 弓形
        "geoLune": {
            "code": "ST3004",
            "handler": "Lune",
            "geometry": "GeoLune"
        },
        "geoRectangle": {
            "code": "ST3005",
            "handler": "Rectangle",
            "geometry": "GeoRectangle"
        },
        "geoPolygon": {
            "code": "ST3006",
            "handler": "PolygonEx",
            "geometry": "GeoPolygonEx"
        },
        // 自由面
        "geoFreePolygon": {
            "code": "ST3007",
            "handler": "FreePolygon",
            "geometry": "GeoFreePolygon"
        },
        // 聚集区
        "geoGatheringPlace": {
            "code": "ST3008",
            "handler": "GatheringPlace",
            "geometry": "GeoGatheringPlace"
        },
        // 圆角矩形
        "geoRoundedRect": {
            "code": "ST3009",
            "handler": "RoundedRect",
            "geometry": "GeoRoundedRect"
        },
        // 闭合曲线
        "geoCloseCurve": {
            "code": "ST3010",
            "handler": "CloseCurve",
            "geometry": "GeoCloseCurve"
        },

        // 曲线旗标
        "geoCurveFlag": {
            "code": "ST4001",
            "handler": "CurveFlag",
            "geometry": "GeoCurveFlag",
            "options": {
                style: {
                    fillColor: "#EA2D1B",
                    fillOpacity: 1,
                    strokeColor: "#EA2D1B",
                    strokeOpacity: 1,
                    strokeWidth: 2
                }
            }
        },
        // 直角旗标
        "geoRectFlag": {
            "code": "ST4002",
            "handler": "RectFlag",
            "geometry": "GeoRectFlag",
            "options": {
                style: {
                    fillColor: "#EA2D1B",
                    fillOpacity: 1,
                    strokeColor: "#EA2D1B",
                    strokeOpacity: 1,
                    strokeWidth: 2
                }
            }
        },
        // 三角旗标
        "geoTriangleFlag": {
            "code": "ST4003",
            "handler": "TriangleFlag",
            "geometry": "GeoTriangleFlag",
            "options": {
                style: {
                    fillColor: "#EA2D1B",
                    fillOpacity: 1,
                    strokeColor: "#EA2D1B",
                    strokeOpacity: 1,
                    strokeWidth: 2
                }
            }
        },

        // 直箭头
        "geoStraightArrow": {
            "code": "ST5001",
            "handler": "StraightArrow",
            "geometry": "GeoStraightArrow"
        },
        // 斜箭头
        "geoDiagonalArrow": {
            "code": "ST5002",
            "handler": "DiagonalArrow",
            "geometry": "GeoDiagonalArrow"
        },
        // 双箭头
        "geoDoubleArrow": {
            "code": "ST5003",
            "handler": "DoubleArrow",
            "geometry": "GeoDoubleArrow"
        },
        // 燕尾直箭头
        "geoDoveTailStraightArrow": {
            "code": "ST5004",
            "handler": "DoveTailStraightArrow",
            "geometry": "GeoDoveTailStraightArrow"
        },
        // 燕尾斜箭头
        "geoDoveTailDiagonalArrow": {
            "code": "ST5005",
            "handler": "DoveTailDiagonalArrow",
            "geometry": "GeoDoveTailDiagonalArrow"
        },

        "geoPolylineArrow": {
            "code": "ST6001",
            "handler": "PolylineArrow",
            "geometry": "GeoPolylineArrow"
        },
        // 平行搜寻区
        "geoParallelSearch": {
            "code": "ST6002",
            "handler": "ParallelSearch",
            "geometry": "GeoParallelSearch"
        },
        // 扇形搜寻区
        "geoSectorSearch": {
            "code": "ST6003",
            "handler": "SectorSearch",
            "geometry": "GeoSectorSearch"
        },
        "geoBezierCurveArrow": {
            "code": "ST6004",
            "handler": "BezierCurveArrow",
            "geometry": "GeoBezierCurveArrow"
        },
        "geoCardinalCurveArrow": {
            "code": "ST6005",
            "handler": "CardinalCurveArrow",
            "geometry": "GeoCardinalCurveArrow"
        }
    };

    var _getDrawControl = function(type, options, ctx){
        var c = ctx.drawControl[type] || null;
        if(c){
            return c;
        }
        if(!(c = DRAW_TYPE_MAP[type])){
            return null;
        }
        var h = Ol2.Handler[c.handler];
        var o = Ol2.Util.extend({}, c.options);
        o = Ol2.Util.extend(o, options);
        c = new Ol2.Control.DrawFeature(ctx.drawLayer, h, o);
        c.featureAdded = function(feature){
            ctx.onDraw.call(ctx, feature, type);
        };
        ctx.getMap().addControl(c);
        return (ctx.drawControl[type] = c);
    };

    var _getDrawTypeByCode = function(code){
        for(var i in DRAW_TYPE_MAP){
            if(DRAW_TYPE_MAP[i].code == code){
                return i;
            }
        }
    };

    OL2Helper.prototype.getDefaultVectorStyle = function(){
        return {
            fillColor: "#66cccc",
            fillOpacity: 0.4,
            strokeColor: "#66cccc",
            strokeOpacity: 1,
            strokeWidth: 3,
            pointRadius: 6
        };
    };

    OL2Helper.prototype.initDrawControl = function() {
        var drawLayer = this.drawLayer = new Ol2.Layer.Vector("Draw Layer");
        drawLayer.style = {
            fillColor: "#66cccc",
            fillOpacity: 0.4,
            strokeColor: "#66cccc",
            strokeOpacity: 1,
            strokeWidth: 3,
            pointRadius: 6
        };
        this.drawControl = {};
        this.getMap().addLayer(this.drawLayer)
        return this;
    };

    OL2Helper.prototype.onDraw = function() {};

    OL2Helper.prototype.stopDraw = function() {
        if(this.curDrawControl) this.curDrawControl.deactivate();
        return this;
    };

    OL2Helper.prototype.draw = function(type, callback, options) {
        if(typeof type != 'string') return;
        var me = this;
        this.stopDraw();
        var control = this.curDrawControl = _getDrawControl(type, options, this);
        if(control) {
            control.activate();
            if(typeof callback == 'function') {
                control.featureAdded = function(feature) {
                    if(options && options.style != undefined){
                        // feature.style = options.style;
                        feature.style = Ol2.Util.extend(Ol2.Util.extend({}, me.drawLayer.style), options.style);
                        me.drawLayer.redraw();
                    }
                    me.onDraw.call(me, feature, type);
                    callback.call(me, feature, type);
                }
            }
        }
    };

    OL2Helper.prototype.clearDraw = function() {
        this.drawLayer.removeAllFeatures();
        return this;
    };

    OL2Helper.prototype.geoFromJson = function(type, jsonStr){
        if(type == 'point' || type == 'line' || type == 'path' || type == 'polyline' ||
            type == 'polygon' || type == 'box' || type == 'circle'){
            return null;
        }
        var t = DRAW_TYPE_MAP[type];
        if(!t || !t.geometry){
            return null;
        }
        var g = Ol2.Geometry[t.geometry].fromJSON(jsonStr);
        g.calculateParts();
        return g;
    };

    OL2Helper.prototype.geoByType = function(type, options){
        if(!options){
            return null;
        }
        if(type == 'point'){
            return new Ol2.Geometry.Point(options.x, options.y);
        }else if(type == 'line' || type == 'path' || type == 'polyline'){
            return new Ol2.Geometry.LineString(options.points);
        }else if(type == 'linearring'){
            return new Ol2.Geometry.LinearRing(options.points);
        }else if(type == 'polygon'){
            return new Ol2.Geometry.Polygon(options.polylines);
        }else if(type == 'box'){
            return Ol2.Geometry.Polygon.createRegularPolygon(options.center, options.radius, 4, 0);
        }else if(type == 'circle'){
            return Ol2.Geometry.Polygon.createRegularPolygon(options.center, options.radius, options.sides || 48, 0);
        }else{
            return this.geoFromJson(type, options.jsonStr);
        }
    };

    OL2Helper.prototype.geoByType2 = function(type, options){
        if(!options){
            return null;
        }
        if(type == 'point'){
            return new Ol2.Geometry.Point(options.x, options.y);
        }else if(type == 'line' || type == 'path' || type == 'polyline'){
            var ps = options.points;
            for(var i = 0;i < ps.length;i++){

            }
            return new Ol2.Geometry.LineString(options.points);
        }else if(type == 'linearring'){
            return new Ol2.Geometry.LinearRing(options.points);
        }else if(type == 'polygon'){
            return new Ol2.Geometry.Polygon(options.polylines);
        }else if(type == 'box'){
            return Ol2.Geometry.Polygon.createRegularPolygon(options.center, options.radius, 4, 0);
        }else if(type == 'circle'){
            return Ol2.Geometry.Polygon.createRegularPolygon(options.center, options.radius, options.sides || 48, 0);
        }else{
            return this.geoFromJson(type, options.jsonStr);
        }
    };

    OL2Helper.prototype.geoByCode = function(code, options){
        var t = this._getDrawTypeByCode(code);
        return this.geoByType(t, options);
    };

    OL2Helper.prototype.geoFromString = function(code, type , str){
        if(!str){
            return null;
        }
        if(code){
            type = this._getDrawTypeByCode(code);
        }
        var o = null;
        if(type == 'point' || type == 'line' || type == 'path' || type == 'polyline' ||
            type == 'polygon' || type == 'box' || type == 'circle'){
            return Ol2.Geometry.fromWKT(str);
        }else{
            o = {jsonStr: str};
        }
        return this.geoByType(type, o);
    };

    OL2Helper.prototype.geoToString = function(type, geometry){
        try{
            if(type == 'point' || type == 'line' || type == 'path' || type == 'polyline' ||
                type == 'polygon' || type == 'box' || type == 'circle'){
                return geometry.toString();
            }else{
                return geometry.toJSON();
            }
        }catch(e){
            return null;
        }
    };
    OL2Helper.prototype.createGeoPointFromJson = function(options){
        if(!options) return;
        return new Ol2.Geometry.Point(options.x, options.y);
    };
    OL2Helper.prototype.createGeoPointFromArray = function(coors){
        if(!coors) return;
        return new Ol2.Geometry.Point(coors[0], coors[1]);
    };
    OL2Helper.prototype.createGeoPolylineFromJson = function(options){
        if(!options) return;
        var ps = options.points;
        var a = [];
        for(var i = 0;i < ps.length;i++){
            a.push(new Ol2.Geometry.Point(ps[i].x, ps[i].y));
        }
        return new Ol2.Geometry.LineString(a);
    };
    OL2Helper.prototype.createGeoPolylineFromArray = function(coors){
        if(!coors) return;
        var a = [];
        for(var i = 0;i < coors.length;i += 2){
            a.push(new Ol2.Geometry.Point(coors[i], coors[i + 1]));
        }
        return new Ol2.Geometry.LineString(a);
    };
    OL2Helper.prototype.createGeoLinearRingFromJson = function(options){
        if(!options) return;
        var ps = options.points;
        var a = [];
        for(var i = 0;i < ps.length;i++){
            a.push(new Ol2.Geometry.Point(ps[i].x, ps[i].y));
        }
        return new Ol2.Geometry.LinearRing(a);
    };
    OL2Helper.prototype.createGeoLinearRingFromArray = function(coors){
        if(!coors) return;
        var a = [];
        for(var i = 0;i < coors.length;i += 2){
            a.push(new Ol2.Geometry.Point(coors[i], coors[i + 1]));
        }
        return new Ol2.Geometry.LinearRing(a);
    };
    OL2Helper.prototype.createGeoPolygonFromJson = function(options){
        if(!options) return;
        var a = [];
        var ls = options.lines;
        for(var i = 0;i < ls.length;i++){
            a.push(this.createGeoLinearRingFromJson(ls[i]));
        }
        return new Ol2.Geometry.Polygon(a);
    };
    OL2Helper.prototype.createGeoPolygonFromArray = function(coors){
        if(!coors) return;
        var a = [];
        for(var i = 0;i < coors.length;i++){
            a.push(this.createGeoLinearRingFromArray(coors[i]));
        }
        return new Ol2.Geometry.Polygon(a);
    };
    OL2Helper.prototype.feature = function(geometry, attributes, style){
        return new Ol2.Feature.Vector(geometry, attributes, style);
    };
    OL2Helper.prototype.createPoint = function(point, attributes, style){
        var g = this.geoByType('point', point);
        return this.feature(g, attributes, style);
    };
    OL2Helper.prototype.createPolyline = function(points, attributes, style){
        var pl = [];
        for(var i = 0;i < points.length;i++){
            pl.push(this.geoByType('point', points[i]));
        }
        return this.feature(this.geoByType('polyline', {points: pl}), attributes, style);
    };
    OL2Helper.prototype.createPolygon = function(polylines, attributes, style){
        var a = [];
        for(var i = 0;i < polylines.length;i++){
            var a2 = [];
            for (var j = 0; j < polylines[i].length; j++) {
                a2.push(this.geoByType('point', polylines[i][j]));
            }
            a.push(this.geoByType('linearring', {points: a2}));
        }
        return this.feature(this.geoByType('polygon', {polylines: a}), attributes, style);
    };
    /*=====  End of draw  ======*/



    /*==============================
    =            select            =
    ==============================*/
    OL2Helper.prototype.initSelectControl = function(layer, options) {
        if(this.selectControl) this.getMap().removeControl(this.selectControl);
        var control = this.selectControl = new Ol2.Control.SelectFeature(layer, options);
        this.getMap().addControl(control);
        this.selectLayer = layer;
    };

    OL2Helper.prototype.select = function(options, callback1, callback2) {
        if(!options) return;
        var layers = options.layers;
        if(layers != this.selectLayer) this.initSelectControl(layers, options);
        this.selectControl.activate();
        // if(!(layers instanceof Array)) layers = [layers];
        if(callback1 != this.selectControlCB1 || callback2 != this.selectControlCB2) {
            for(var i = 0; i < layers.length; i++) {
                if(callback1 != this.selectControlCB1) {
                    layers[i].events.un({'featureselected': this.selectControlCB1});
                    if(typeof callback1 == 'function') layers[i].events.on({'featureselected': callback1});
                    this.selectControlCB1 = callback1;
                }
                if(callback2 != this.selectControlCB2) {
                    layers[i].events.un({'featureunselected': this.selectControlCB2});
                    if(typeof callback2 == 'function') layers[i].events.on({'featureunselected': callback2});
                    this.selectControlCB2 = callback2;
                }
            }
        }
    };

    OL2Helper.prototype.stopSelect = function() {
        if(this.selectControl) {
            this.selectControl.deactivate();
            this.selectControl.unselectAll();
        }
    };
    /*=====  End of select  ======*/



    /*================================
    =            identify            =
    ================================*/
    OL2Helper.prototype.initIdentifyControl = function(options) {
        if(this.identifyControl) this.getMap().removeControl(this.identifyControl);
        var control = this.identifyControl = new Ol2.Control.WMSGetFeatureInfo(options);
        this.getMap().addControl(control);
        var identifyLayer = this.identifyLayer = new Ol2.Layer.Vector("Identify Layer");
        this.getMap().addLayer(identifyLayer);
    };

    OL2Helper.prototype.identify = function(options, callback) {
        if(!options) return;
        var url = options.url;
        if(url != this.identifyUrl) this.initIdentifyControl(options);
        if(callback != this.identifyCB) {
            this.identifyControl.events.un({'getfeatureinfo': this.identifyCB});
            if(typeof callback == 'function') this.identifyControl.events.on({'getfeatureinfo': callback});
            this.identifyCB = callback;
        }
        this.identifyControl.activate();
    };

    OL2Helper.prototype.stopIdentify = function() {
        if(this.identifyControl) {
            this.identifyControl.deactivate();
        }
    };
    /*=====  End of identify  ======*/



    /*===============================
    =            measure            =
    ===============================*/
    OL2Helper.prototype.calcLength = function(points){
        if(!points || points.length < 2){
            return 0;
        }
        var d = 0;
        for(var i = 0;i < points.length - 1;i++){
            var sp = points[i];
            var ep = points[i + 1];
            d += Math.sqrt(Math.pow(ep.x - sp.x, 2) + Math.pow(ep.y - sp.y, 2));
        }
        return d;
    };
    OL2Helper.prototype.calcArea = function(points){
        if(!points || points.length < 3){
            return 0;
        }
        var d = 0;
        var p0 = points[0];
        for(var i = 1;i < points.length - 1;i++){
            var p1 = points[i];
            var p2 = points[i + 1];
            d += Math.abs((p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y));
        }
        return (d / 2);
    };
    OL2Helper.prototype.calcMeasure = function(points, type){
        var o = {};
        if(type == 'line'){
            o.stmeasure = this.calcLength(points);
            if(o.stmeasure >= 1000){
                o.stmeasure /= 1000;
                o.stunits = 'km';
            }else{
                o.stunits = 'm';
            }
        }else if(type == 'polygon'){
            o.stmeasure = this.calcArea(points);
            if(o.stmeasure >= 1000000){
                o.stmeasure /= 1000000;
                o.stunits = 'km';
            }else{
                o.stunits = 'm';
            }
        }
        return o;
    };

    OL2Helper.prototype.initMeasureControl = function(options) {
        var me = this;
        // var styleMap = new Ol2.StyleMap();
        this.measureControl = {
            line: new Ol2.Control.Measure(Ol2.Handler.Path, {
                persist: true,
                geodesic: true
            }),
            polygon: new Ol2.Control.Measure(Ol2.Handler.Polygon, {
                persist: true,
                geodesic: true
            })
        };
        for(key in this.measureControl) {
            var control = this.measureControl[key];
            control.events.on({
                'measure': (function(type) {
                    return function(event) {
                        var o = me.calcMeasure(event.geometry.getVertices(), type);
                        for(var k in o){
                            event[k] = o[k];
                        }
                        me.onMeasure.call(me, event, type);
                    }
                })(key),
                'measurepartial': (function(type) {
                    return function(event) {
                        var o = me.calcMeasure(event.geometry.getVertices(), type);
                        for(var k in o){
                            event[k] = o[k];
                        }
                        me.onMeasurePartial.call(me, event, type);
                    }
                })(key)
            });
            this.getMap().addControl(control);
        }
    };

    OL2Helper.prototype.onMeasure = function() {};

    OL2Helper.prototype.onMeasurePartial = function() {};

    OL2Helper.prototype.measure = function(type, options, onMeasure, onMeasurePartial) {
        if(typeof type != 'string') return;
        this.stopMeasure();
        var control = this.curMeasureControl = this.measureControl[type];
        if(options != undefined){
            var im = options.immediate;
            if(im == undefined){
                im = false;
            }
            control.setImmediate(im);
        }
        if(control) {
            control.activate();
        }
        if(typeof onMeasure == 'function'){
            this.onMeasure = onMeasure;
        }
        if(typeof onMeasurePartial == 'function'){
            this.onMeasurePartial = onMeasurePartial;
        }
    };

    OL2Helper.prototype.stopMeasure = function() {
        if(this.curMeasureControl) this.curMeasureControl.deactivate();
        return this;
    };

    OL2Helper.prototype.clearMeasure = function() {
        if(this.curMeasureControl) this.curMeasureControl.cancel();
        return this;
    };
    /*=====  End of measure  ======*/



    /*=================================
    =            highlight            =
    =================================*/
    OL2Helper.prototype.initHightlightLayer = function() {
        var layer = this.highlightLayer = new Ol2.Layer.Vector("Highlight Layer", {
            style: {
                fill: true,
                fillColor: '#ff0000',
                fillOpacity: 0.4,
                strokeColor: '#ff0000',
                strokeWidth: 3,
                pointRadius: 3
            }
        });
        this.getMap().addLayer(layer);
    };

    OL2Helper.prototype.highlight = function(feature) {
        if(!this.getMap().getLayer(this.highlightLayer.id)) this.getMap().addLayer(this.highlightLayer);
        // if(!(feature instanceof Array)) feature = [feature];
        feature && this.highlightLayer.addFeatures(feature);
    };

    OL2Helper.prototype.clearHighlight = function(feature) {
        // if(!(feature instanceof Array)) feature = [feature];
        feature && this.highlightLayer.removeFeatures(feature);
        return this;
    };

    OL2Helper.prototype.clearAllHighlight = function(){
        var me = this;
        if(me.highlightLayer){
            me.highlightLayer.removeAllFeatures();
        }
        return me;
    };
    /*=====  End of highlight  ======*/



    /*=============================
    =            layer            =
    =============================*/
    OL2Helper.prototype.initVectorLayer = function() {
        var layer = this.vectorLayer = new Ol2.Layer.Vector("Vector Layer")
        this.getMap().addLayer(layer);
    };

    OL2Helper.prototype.getVectorLayer = function(){
        return this.vectorLayer;
    };

    OL2Helper.prototype.add = function(feature) {
        if(!this.getMap().getLayer(this.vectorLayer.id)) this.getMap().addLayer(this.vectorLayer);
        // if(!(feature instanceof Array)) feature = [feature];
        this.vectorLayer.addFeatures(feature);
    };

    OL2Helper.prototype.clearVector = function(feature) {
        // if(!(feature instanceof Array)) feature = [feature];
        this.vectorLayer.removeFeatures(feature);
        return this;
    };


    OL2Helper.prototype.initTempLayers = function(){
        this.tempLayers = [];
    };

    OL2Helper.prototype.addTempLayer = function(name, type, options){
        var me = this;
        var l = null;
        var cs = null;
        if(type == 'markers'){
            l = new Ol2.Layer.Markers(name);
            this.getMap().addLayer(l);
        }else{
            type = 'vector';
            l = new Ol2.Layer.Vector(name);
            this.getMap().addLayer(l);
            if(options){
                if(options.listenClick){
                    l.events.on({
                        featureclick: function(e){
                            if(l.features.length > 0){
                                for(var i = 0;i < l.features.length;i++){
                                    var fi = l.features[i];
                                    if(fi == e.feature){
                                        var cb = fi.attributes && fi.attributes.onClick;
                                        if(typeof cb == 'function'){
                                            cb.apply(fi, [e]);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                if(options.listenMouseMove){
                    var op = Ol2.Util.extend({multiple: false, hover: true}, options.selectFeatureOptions);
                    var sf = new Ol2.Control.SelectFeature(l, op);
                    me.getMap().addControl(sf);
                    sf.activate();
                    if(!cs){
                        cs = [];
                    }
                    cs.push(sf);
                    l.events.on({
                        featureselected: function(e){
                            if(l.features.length > 0){
                                for(var i = 0;i < l.features.length;i++){
                                    var fi = l.features[i];
                                    if(fi == e.feature){
                                        var cb = fi.attributes && fi.attributes.onMouseOver;
                                        if(typeof cb == 'function'){
                                            cb.apply(fi, [e]);
                                        }
                                    }
                                }
                            }
                        },
                        featureunselected: function(e){
                            if(l.features.length > 0){
                                for(var i = 0;i < l.features.length;i++){
                                    var fi = l.features[i];
                                    if(fi == e.feature){
                                        var cb = fi.attributes && fi.attributes.onMouseOut;
                                        if(typeof cb == 'function'){
                                            cb.apply(fi, [e]);
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
        this.tempLayers.push({
            name: name,
            type: type,
            layer: l,
            controls: cs
        });
        return l;
    };

    OL2Helper.prototype.removeTempLayer = function(name){
        var ls = this.tempLayers;
        var l = null;
        for(var i = ls.length - 1;i >= 0; i--){
            if(ls[i].name == name){
                l = ls.splice(i)[0];
                if(l.controls){
                    while(l.controls.length > 0){
                        var ci = l.controls.pop();
                        this.getMap().removeControl(ci);
                    }
                }
                this.getMap().removeLayer(l.layer);
            }
        }
        return l;
    };

    OL2Helper.prototype.removeAllTempLayer = function(){
        var ls = this.tempLayers;
        while(ls.length > 0){
            var l = ls.pop();
            if(l.controls){
                while(l.controls.length > 0){
                    var ci = l.pop();
                    this.getMap().removeControl(ci);
                }
            }
            this.getMap().removeLayer(l.layer);
        }
        return this;
    };

    OL2Helper.prototype.getTempLayer = function(name){
        var ls = this.tempLayers;
        for(var i = 0;i < ls.length;i++){
            if(ls[i].name == name){
                return ls[i].layer;
            }
        }
        return null;
    };

    OL2Helper.prototype.addFeatures = function(name, features){
        var l = this.getTempLayer(name);
        if(l){
            // if(!(features instanceof Array)){
            //     features = [features];
            // }
            l.addFeatures(features)
        }
        return this;
    };

    OL2Helper.prototype.removeFeatures = function(name, features){
        var l = this.getTempLayer(name);
        if(l){
            // if(!(features instanceof Array)){
            //     features = [features];
            // }
            l.removeFeatures(features);
        }
        return this;
    };

    OL2Helper.prototype.removeAllFeatures = function(name){
        var l = this.getTempLayer(name);
        if(l){
            l.removeAllFeatures();
        }
        return this;
    };
    /*=====  End of layer  ======*/



    /*=============================
    =            popup            =
    =============================*/
    OL2Helper.prototype.popup = function(id, type, lonlat, contentSize, content, anchor, closable, onClose){
        var C = Ol2.Popup[type] || Ol2.Popup.FramedCloud;
        if(lonlat.CLASS_NAME != 'OpenLayers.LonLat'){
            lonlat = new Ol2.LonLat(lonlat.lon, lonlat.lat);
        }
        var cs = null;
        if(contentSize){
            cs = new Ol2.Size(contentSize.width, contentSize.height);
        }
        return new C(id || fguid(), lonlat, cs, content, anchor, closable, onClose);
    },
    OL2Helper.prototype.addPopup = function(popup, exclusive){
        var me = this;
        if(!me.popups){
            me.popups = [];
        }
        if(exclusive){
            me.clearPopup();
        }
        me.getMap().addPopup(popup, false);
        me.popups.push(popup);
        return me;
    };
    OL2Helper.prototype.removePopup = function(popup){
        var me = this;
        if(popup && me.popups){
            for(var i = 0;i < me.popups.length;i++){
                if(me.popups[i].id == popup.id){
                    var p = me.popups.splice(i, 1);
                    i--;
                    me.getMap().removePopup(popup);
                    return me;
                }
            }
        }
        return me;
    };
    OL2Helper.prototype.clearPopup = function(){
        var me = this;
        if(me.popups){
            while(me.popups.length > 0){
                var p = me.popups.pop();
                if(p){
                    me.getMap().removePopup(p);
                }
            }
        }
        return me;
    };
    /*=====  End of popup  ======*/

    /*============================================
    =            coordinate transform            =
    ============================================*/
    /* take care: need proj4 */
    var PROJECTION_NAME_WGS84 = 'EPSG:4326';
    var PROJECTION_NAMES_WGS84 = ['EPSG:4326', 'WGS84'];
    var PROJECTION_NAMES_WEBMERCATOR = ['EPSG:3857', 'EPSG:3785', 'EPSG:900913', 'EPSG:102113', 'EPSG:102100', 'GOOGLE'];

    SFM.proj4 && (SFM.proj4.defs('EPSG:102100', SFM.proj4.defs('EPSG:3857')));
    Proj4js.defs && (
        Proj4js.defs['WGS84'] = Proj4js.defs['EPSG:4326'],
        Proj4js.defs['3785'] = Proj4js.defs['GOOGLE'] = Proj4js.defs['EPSG:3857']
    );

    var getProjNameWgs84 = OL2Helper.getProjNameWgs84 = function(){
        return PROJECTION_NAME_WGS84;
    };
    var isWgs84 = OL2Helper.isWgs84 = function(proj){
        for(var i = 0;i < PROJECTION_NAMES_WGS84.length;i++){
            if(proj == PROJECTION_NAMES_WGS84[i]){
                return true;
            }
        }
        return false;
    };
    var isWebMercator = OL2Helper.isWebMercator = function(proj){
        for(var i = 0;i < PROJECTION_NAMES_WEBMERCATOR.length;i++){
            if(proj == PROJECTION_NAMES_WEBMERCATOR[i]){
                return true;
            }
        }
        return false;
    };
    OL2Helper.prototype.currentIsWgs84 = function () {
        return isWgs84(this.curProj);
    };
    /**
     * transform point
     * @param  {[type]} fromProj
     * @param  {[type]} toProj
     * @param  {Array<number>} point
     * @return {Array<number>}
     */
    OL2Helper.prototype.transformPoint = OL2Helper.transformPoint = function (fromProj, toProj, point) {
        if(fromProj == toProj){
            return point;
        }
        return SFM.proj4(fromProj, toProj, point);
    };
    OL2Helper.prototype.transformPoints = OL2Helper.transformPoints = function (fromProj, toProj, points) {
        if(fromProj == toProj){
            return points;
        }
        if(!points || (points.length % 2) != 0){
            return points;
        }
        var t = this.getProjTransformer(fromProj, toProj);
        var p = [];
        for(var i = 0;i < points.length;i += 2){
            var pi = t.forward([points[i], points[i + 1]]);
            p.push(pi[0], pi[1]);
        }
        return p;
    };
    OL2Helper.prototype.pointsWgs84ToCurrent = function (points) {
        return this.transformPoints(PROJECTION_NAME_WGS84, this.curProj, points);
    };
    OL2Helper.prototype.pointsCurrentToWgs84 = function (points) {
        return this.transformPoints(this.curProj, PROJECTION_NAME_WGS84, points);
    };
    /**
     * get an object with 2 functions (forward(<Array<number>> point) & inverse(<Array<number>> point))
     * forward: from -> to
     * inverse: to -> from
     * @return {object}
     * {
     *     forward: <Array<number>> function(<Array<number>> point){ from -> to },
     *     inverse: <Array<number>> function(<Array<number>> point){ to -> from }
     * }
     */
    OL2Helper.prototype.getProjTransformer = OL2Helper.getProjTransformer = function (fromProj, toProj) {
        return SFM.proj4(fromProj, toProj);
    };
    OL2Helper.prototype.getCurrentProjTransformer = function () {
        return this.getProjTransformer(PROJECTION_NAME_WGS84, this.curProj);
    }
    OL2Helper.prototype.defineProj = OL2Helper.defineProj = function () {
        return SFM.proj4.defs.apply(null, arguments);
    };
    OL2Helper.prototype.getCurrentProj = function () {
        return this.curProj;
    }
    OL2Helper.prototype.setCurrentProj = function (proj) {
        this.curProj = proj;
    };
    OL2Helper.prototype.wgs84ToCurrent = function (point) {
        return this.transformPoint(PROJECTION_NAME_WGS84, this.curProj, point);
    };
    OL2Helper.prototype.currentToWgs84 = function (point) {
        return this.transformPoint(this.curProj, PROJECTION_NAME_WGS84, point);
    };
    /*=====  End of coordinate transform  ======*/

    OL2Helper.prototype.wgs84_to_current = function(point){
        var me = this;
        if (!point) {
            return point;
        }
        point = new OpenLayers.LonLat(point.lon, point.lat);
        var wgs84 = new OpenLayers.Projection("EPSG:4326");
        return point.transform(wgs84, me.__map__.getProjectionObject());
    };
    OL2Helper.prototype.current_to_wgs84 = function(point){
        var me = this;
        if (!point) {
            return point;
        }
        point = new OpenLayers.LonLat(point.x, point.y);
        var wgs84 = new OpenLayers.Projection("EPSG:4326");
        return point.transform(me.__map__.getProjectionObject(), wgs84);
    };

    return OL2Helper;
}, this);
