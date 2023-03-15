(function(ctx, $, opt) {
    var TYPE_LINE = 'line';
    var TYPE_POINT = 'point';
    var TYPE_POLYGON = 'polygon';

    var EARTH_RADIUS = 6378137;

    var OT_FEATURE = 33;
    var OT_FEATURE_LAYER = 36;
    var OT_3D_MESH_LAYER = 38;
    var OT_3DML_FEATURE_LAYER = 39;

    var GEOMETRY_TYPE_POINT = 0;

    var DEFAULT_PICK_TYPE = 8193;
    var DEFAULT_HIGHLIGHT_COLOR = 0xFFFF0000;// 0xFF0000FF;
    var DEFAULT_FLASH_TIMES = 5;

    // [r, g, b, a]
    var SHAPETOOL_DEFAULT_LINE_COLOR = [255, 255, 0, 0xcc];
    var SHAPETOOL_DEFAULT_FILL_COLOR = [0, 0x99, 0, 0x44];
    var SHAPETOOL_DEFAULT_ALTITUDE_TYPE = 0;
    var SHAPETOOL_DEFAULT_LINE_WIDTH = 1;

    var DEFAULT_SEARCH_BUFFER_RADIUS = 1;

    var DEFAULT_POPUP_X = 0;
    var DEFAULT_POPUP_Y = 0;
    var DEFAULT_POPUP_WIDTH = 300;
    var DEFAULT_POPUP_HEIGHT = 400;

    var CS_WKT_WGS84 = 'GEOGCS["WGS 84",' +
        'DATUM["WGS_1984",' +
        'SPHEROID["WGS 84",6378137,298.257223563,' +
        'AUTHORITY["EPSG","7030"]],' +
        'AUTHORITY["EPSG","6326"]],' +
        'PRIMEM["Greenwich",0,' +
        'AUTHORITY["EPSG","8901"]],' +
        'UNIT["degree",0.0174532925199433,' +
        'AUTHORITY["EPSG","9122"]],' +
        'AUTHORITY["EPSG","4326"]]';

    var ajax = opt && opt.ajax || window.ajax || $.ajax;
    var mw = SFM.sfmUtil.getMainWin();
    var sfmDm = mw.SFM.sfmDataMgr;
    var sfmMm = mw.SFM.sfmModuleMgr;
    var earthCtx = sfmDm.doAction('getEarthContext');

    var _config = {};

    var csWgs84 = null;
    var csSrc = null;
    var csPlane = null;
    var curCsName = null;
    var csMap = {};

    var _world = null;
    var _pickType = -1;
    var _pickOnce = false;
    var _onPickObject = null;
    var _isPickBegin = false;

    var _defaultTintColor = 0;
    var hlc = {};

    var attr = SFM && SFM.sfmUtil.attr || (function(o, k, v) {
        try {
            var ks = k.split('.');
            if (!o) {
                o = {};
            }
            var ot = o;
            var i = 0;
            for (i = 0; i < ks.length - 1; i++) {
                if (!ot[ks[i]]) {
                    ot[ks[i]] = {};
                }
                ot = ot[ks[i]];
            }
            if (typeof v != 'undefined') {
                ot[ks[i]] = v;
            }
            return ot[ks[i]];
        } catch (e) {

        }

        return undefined;
    });
    var valueOrDefault = SFM && SFM.sfmUtil.valueOrDefault || (function(obj, property, defaultValue) {
        try {
            if (!obj) {
                return defaultValue;
            }
            var val = attr(obj, property);
            if (typeof val == 'undefined') {
                return defaultValue;
            }
            return val;
        } catch (e) {
            return defaultValue;
        }
    });

    var getString = function(str){
        if(str == 'Attributes not found'){
            return '模型缺少必要的属性';
        }else{
            return str;
        }
    };

    var setConfig = function(options) {
        $.extend(true, _config, options);
        if(_config.csWktPlane && _config.csWktPlane.length > 0){
            curCsName = _config.csWktPlane[0].name;
        }
    };

    var createSGObj = function() {
        var obj = window.document.getElementById('sgworld66');
        if (obj == null) {
            obj = document.createElement('object');
            document.body.appendChild(obj);
            obj.name = 'sgworld66';
            obj.id = 'sgworld66';
            obj.classid = "CLSID:3a4f9199-65a8-11d5-85c1-0001023952c1";
        }
        return obj;
    };
    var getDataPath = function(world){
        return world.Application.DataPath;
    };

    var setLayerStreaming = function(world, layer, isStreaming, onLayerStreaming){
        if(!world || !layer) return null;
        if(layer.Streaming == isStreaming){
            if(typeof onLayerStreaming == 'function'){
                onLayerStreaming(layer.ID, layer.Streaming)
            }
            return null;
        }
        var cb = null;
        if(typeof onLayerStreaming == 'function'){
            cb = function(layerId, isStreaming){
                if(layer.ID == layerId){
                    onLayerStreaming(layerId, isStreaming);
                }
            };
            world.AttachEvent('OnLayerStreaming', cb);
        }
        layer.Streaming = isStreaming;
        layer.Refresh();
        return {
            off: function(){
                if(cb){
                    world.DetachEvent('OnLayerStreaming', cb);
                }
            }
        };
    };
    var setLayersStreaming = function(world, layers, isStreaming, onOneLayerStreaming, onAllLayersStreaing){
        if(!world || !layers) return null;
        var cb = null;
        var c = 0;
        var t = layers.length;
        cb = function(layerId, isStreaming){
            c++;
            if(typeof onOneLayerStreaming == 'function'){
                onOneLayerStreaming(layerId, isStreaming);
            }
            if(c == t){
                if(typeof onAllLayersStreaing == 'function'){
                    onAllLayersStreaing();
                }
                world.DetachEvent('onLayerStreaming', cb);
                cb = null;
            }
        };
        world.AttachEvent('OnLayerStreaming', cb);
        for(var i = 0;i < layers.length;i++){
            var li = layers[i];
            li.Streaming = typeof isStreaming == 'boolean' ? isStreaming : isStreaming[i];
            li.Refresh();
        }
        return {
            off: function(){
                if(cb){
                    world.DetachEvent('onLayerStreaming', cb);
                }
            }
        };
    };
    var setAllPipelineLayerStreaming = function(world, isStreaming, onOneLayerStreaming, onAllLayersStreaing){
        var fs = getPipeLayerFolder();
        (typeof fs == 'string') && (fs = [fs]);
        var a = [];
        var lm = new LayerManager({world: world});
        for(var i = 0;i < fs.length;i++){
            var p = fs[i];
            p = p.substr(0, p.length - 1);
            var fl = world.ProjectTree.FindItem(p);
            if(fl){
                var n = [];
                lm.getChildren(fl, n);
                if(n){
                    for(var j = 0;j < n.length;j++){
                        l = world.ProjectTree.GetObject(n[j].id);
                        if(l && (l.ObjectType == OT_FEATURE_LAYER)){
                            a.push(l);
                        }
                    }
                }
            }
        }
        if(a.length > 0){
            return setLayersStreaming(world, a, isStreaming, onOneLayerStreaming, onAllLayersStreaing);
        }
    };


    var findCsName = function(obj, func1, func2){
        if(!obj){
            return null;
        }
        var n = typeof func1 == 'function' ? func1(obj) : obj[func1];
        for(var i = 0;i < _config.csWktPlane.length;i++){
            var ci = _config.csWktPlane[i];
            if(ci.name == n){
                return ci.name;
            }
        }
        var a = [];
        for(var i = 3;i < arguments.length;i++){
            a.push(arguments[i]);
        }
        var o = func2.apply(obj, a);
        if(o === obj){
            return null;
        }
        return findCsName(o, func1, func2);
    };
    var setCurrentCsName = function(csName){
        if(csName == null) return;
        curCsName = csName;
    };
    var getCurrentCsName = function(){
        return curCsName;
    };

    var initCs = function(world) {
        if (!_config.csWktPlane) {
            return false;
        }
        if (!csSrc) {
            csSrc = world.CoordServices.SourceCoordinateSystem;
        }
        // if (!csPlane) {
        //    csPlane = world.CoordServices.CreateCoordinateSystem(_config.csWktPlane);
        // }
        if(!curCsName){
            return false;
        }
        if(!csMap[curCsName]){
            var csw = _config.csWktPlane;
            var s = null;
            for (var i = 0; i < csw.length; i++) {
                if (csw[i].name == curCsName) {
                    s = csw[i].csw;
                    break;
                }
            }
            if(!s) return false;
            csPlane = world.CoordServices.CreateCoordinateSystem(s);
            csMap[curCsName] = csPlane;
        }else{
            csPlane = csMap[curCsName];
        }
        return true;
    };

    var getCsWgs84 = function(world){
        return csWgs84 || (csWgs84 = world.CoordServices.CreateCoordinateSystem(CS_WKT_WGS84));
    };
    var getWorldSrcCs = function(world){
        return world.CoordServices.SourceCoordinateSystem;
    };
    var srcCsIsWgs84 = function(world){
        return world.CoordServices.SourceCoordinateSystem.IsSame(getCsWgs84(world));
    };
    var curIsWgs84 = function(world){
        if(!initCs(world)){
            return false;
        }
        return csMap[curCsName].IsSame(getCsWgs84(world));
    };
    var curIsSameToSrc = function(world){
        if(!initCs(world)){
            return false;
        }
        return world.CoordServices.SourceCoordinateSystem.IsSame(csMap[curCsName]);
    };

    var toSrcCs = function(world, point, isWgs84, csName){
        var cs = csName || getCurrentCsName();
        var b = srcCsIsWgs84(world);
        var wgs84 = getCsWgs84(world);
        var scs = getWorldSrcCs(world);
        if(isWgs84){
            if(b){
                return point;
            }else{
                return reproject(world, getCsWgs84(world), scs, point);
            }
        }else{
            if(!initCs(world)){
                return point;
            }
            var c = csMap[cs];
            return reproject(world, c, scs, point);
        }
    };

    var reproject = function(world, csFrom, csTo, point){
        var p = world.CoordServices.Reproject(csFrom, csTo, point.x, point.y);
        return { x: p.X, y: p.Y };
    };
    var xy2blh = function(world, point) {
        if (!initCs(world)) {
            return point;
        }
        if (world) {
            var p = world.CoordServices.Reproject(csPlane, csSrc, point.x, point.y);
            return { x: p.X, y: p.Y };
        }
        return point;
    };
    var blh2xy = function(world, point) {
        if (!initCs(world)) {
            return point;
        }
        if (world) {
            var p = world.CoordServices.Reproject(csSrc, csPlane, point.x, point.y);
            return { x: p.X, y: p.Y };
        }
        return point;
    };
    var xyWkt2blhWkt = function(world, wkt, csName) {
        csName != undefined && (curCsName = csName);
        if (!initCs(world)) {
            return wkt;
        }
        var s = '';
        var x = '';
        var y = '';
        var c = 0;
        var n = 2;
        var tc = [];
        var fNum = false;
        for (var i = 0; i < wkt.length; i++) {
            var ci = wkt[i];
            if (ci == '.' || isNumberStr(ci)) {
                if (c == 0) {
                    fNum = true;
                    x += ci;
                } else if (c == 1) {
                    y += ci;
                } else {
                    s += ci;
                }
            } else {
                if (ci == ' ' || ci == ',' || ci == ')') {
                    if (!fNum || c > 1) {
                        s += ci;
                    } else {
                        tc.push(ci);
                        c++;

                        if (c == 2) {
                            var p = xy2blh(world, { x: Number(x), y: Number(y) });
                            var cc = tc.shift();
                            s += p.x + cc;
                            cc = tc.shift();
                            s += p.y + cc;
                        }
                        if (ci == ',' || ci == ')') {
                            c = 0;
                            x = y = '';
                            fNum = false;
                        }
                    }
                } else {
                    s += ci;
                }
            }
        }
        return s;
    };
    var blhWkt2xyWkt = function(world, wkt, csName) {
        csName != undefined && (curCsName = csName);
        if (!initCs(world)) {
            return wkt;
        }
        var s = '';
        var x = '';
        var y = '';
        var c = 0;
        var n = 2;
        var tc = [];
        var fNum = false;
        for (var i = 0; i < wkt.length; i++) {
            var ci = wkt[i];
            if (ci == '.' || isNumberStr(ci)) {
                if (c == 0) {
                    fNum = true;
                    x += ci;
                } else if (c == 1) {
                    y += ci;
                } else {
                    s += ci;
                }
            } else {
                if (ci == ' ' || ci == ',' || ci == ')') {
                    if (!fNum || c > 1) {
                        s += ci;
                    } else {
                        tc.push(ci);
                        c++;

                        if (c == 2) {
                            var p = blh2xy(world, { x: Number(x), y: Number(y) });
                            var cc = tc.shift();
                            s += p.x + cc;
                            cc = tc.shift();
                            s += p.y + cc;
                        }
                        if (ci == ',' || ci == ')') {
                            c = 0;
                            x = y = '';
                            fNum = false;
                        }
                    }
                } else {
                    s += ci;
                }
            }
        }
        return s;
    };

    var isNumberStr = function(c) {
        var n = c.charCodeAt();
        return (n > 47 && n < 58);
    };

    var positions2vertices = function(positions) {
        var v = [];
        for (var i = 0; i < positions.length; i++) {
            var pi = positions[i];
            v.push(pi.X, pi.Y, pi.Z);
        }
        return v;
    };
    var array2position = function(world, arr) {
        var x = arr[0];
        var y = arr[1];
        var z = arr[2];
        var at = arr.length > 3 ? arr[3] : 0;
        var yaw = arr.length > 4 ? arr[4] : 0;
        var pitch = arr.length > 5 ? arr[5] : -90;
        var roll = arr.length > 6 ? arr[6] : 0;
        var d = arr.length > 7 ? arr[7] : 100;
        var p = world.Creator.CreatePosition(x, y, z, at, yaw, pitch, roll, d);
        return p;
    };

    var polygon2xypoints = function(world, polygon) {
        var p = polygon.ExteriorRing.Points;
        var pa = [];
        for (var i = 0; i < p.Count; i++) {
            var pi = p.Item(i);
            var pt = blh2xy(world, { x: pi.X, y: pi.Y });
            pa.push(pt);
        }
        return pa;
    };
    var polygon2xystr = function(world, polygon) {
        var p = polygon.ExteriorRing.Points;
        var s = '';
        for (var i = 0; i < p.Count; i++) {
            var pi = p.Item(i);
            var pt = blh2xy(world, { x: pi.X, y: pi.Y });
            s += pt.x + ' ' + pt.y + ',';
        }
        s && (s = s.substr(0, s.length - 1));
        return s;
    };

    var getPosition = function(world, options) {
        var x = options.x;
        var y = options.y;
        var z = options.z == undefined || isNaN(options.z) ? 0 : options.z;
        var at = options.altitudeType == undefined ? 0 : options.altitudeType;
        var yaw = options.yaw == undefined ? 0 : options.yaw;
        var pitch = options.pitch == undefined ? -89 : options.pitch;
        var roll = options.roll == undefined ? 0 : options.roll;
        var d = options.distance == undefined ? 100 : options.distance;
        var p = world.Creator.CreatePosition(x, y, z, at, yaw, pitch, roll, d);
        return p;
    };
    var getPositionByWkt = function(world, wkt, csName){
        var wkt2 = xyWkt2blhWkt(world, wkt, csName);
        var g = createGeometry(world, wkt2);
        var gt = g.GeometryType;
        if(gt == 5 || gt == 6){
            if(g.Count == 0){
                return null;
            }
            g = g.Item(0);
            gt = g.GeometryType;
        }
        if(gt == 0){
            return getPosition(world, {x: g.X, y: g.Y, z: g.Z, pitch: -89, distance: 80});
        } else if (gt == 1) {
            var x = 0;
            var y = 0;
            var z = 0;
            var l = g.Points.Count;
            for(var i = 0;i < l;i++){
                var pi = g.Points.Item(i);
                x += pi.X;
                y += pi.Y;
                z += isNaN(pi.Z) ? 0 : pi.Z;
            }
            x /= l;
            y /= l;
            z /= l;
            return getPosition(world, {x: x, y: y, z: z, pitch: -89, distance: 80});
        } else if(gt == 2 || gt == 3){
            var cp = g.Centroid;
            return getPosition(world, {x: cp.X, y: cp.Y, z: cp.Z, pitch: -89, distance: 80});
        }
    };
    var getCameraPose = function(world, altitudeType) {
        var at = altitudeType == undefined ? 0 : altitudeType;
        var p = world.Navigate.GetPosition(at);
        return {
            x: p.X,
            y: p.Y,
            z: p.Altitude,
            altitudeType: p.AltitudeType,
            yaw: p.Yaw,
            pitch: p.Pitch,
            roll: p.Roll,
            distance: p.Altitude - world.Window.CenterPixelToWorld(0).Position.Altitude // p.Distance
        };
    };
    var flyToPosition = function(world, options) {
        if (!world || !options) {
            return;
        }
        var p = getPosition(world, options);
        world.Navigate.FlyTo(p);
    };
    var jumpToPosition = function(world, options) {
        if (!world || !options) {
            return;
        }
        var p = getPosition(world, options);
        world.Navigate.JumpTo(p);
    };
    var locateByWkt = function(world, wkt, csName){
        var p = getPositionByWkt(world, wkt, csName);
        if(p){
            world.Navigate.FlyTo(p);
        }
    };
    var flyTo = function(world, target) {
        world.Navigate.FlyTo(target);
    };
    var jumpTo = function(world, target) {
        world.Navigate.JumpTo(target);
    };

    var showMessage = function(world, msg, align, timeout) {
        var a = align == undefined ? 0 : align;
        var t = timeout == undefined ? 5000 : timeout;
        world.Window.ShowMessageBarText(msg, a, t);
    };

    var _setCursor = function(world, inputMode, url, allowDrag) {
        world.Window.SetInputMode(inputMode, url, allowDrag !== false);
    };

    var _getQueryKey = function(queryKey) {
        var n = queryKey.lastIndexOf('_');
        var gid = queryKey.substr(n + 1);
        var n2 = queryKey.substring(0, n).lastIndexOf('_');
        var tn = queryKey.substr(0, n2);
        return {
            tableKey: tn,
            key: gid
        };
    };
    var getModelQueryKey = function(teObject) {
        if (teObject && teObject.ObjectType == 33) {
            var fas = teObject.FeatureAttributes;
            try {
                var tk = fas.GetFeatureAttribute(_config.modelTblField).Value;
                var qk = fas.GetFeatureAttribute(_config.modelFkField).Value;
                // return _getQueryKey(qk);
                return { tableKey: tk, key: qk };
            } catch (e) {
                setTimeout(function(){
                    alert(getString(e.description));
                }, 20);
            }
        }
    };
    var getFeatureAttrs = function(teObject) {
        if (teObject && teObject.ObjectType == 33) {
            var fas = teObject.FeatureAttributes;
            var a = [];
            for (var i = 0; i < fas.Count; i++) {
                var fa = fas.Item(i);
                a.push({
                    name: fa.Name,
                    value: fa.Value
                });
            }
            return a;
        }
    };

    var onLBDown = function(flag, x, y) {
        var wpi = _world.Window.PixelToWorld(x, y, _pickType);
        var teo = null;
        if (wpi && wpi.ObjectID) {
            teo = _world.Creator.GetObject(wpi.ObjectID);
        }
        if (typeof _onPickObject == 'function') {
            _onPickObject(wpi, teo);
        }
        if (_pickOnce) {
            endPickObject(_world);
        }
    }
    var onRBDown = function(flag, x, y) {
        endPickObject(_world);
        return true;
    };
    var pixelFromWorld = function(world, x, y){
        var p = getPosition(world, {x: x, y: y});
        var spi = world.Window.PixelFromWorld(p, 0);
        return {x: spi.X, y: spi.Y};
    };
    var beginPickObject = function(world, pickType, once, onPickObject) {
        if (_isPickBegin) {
            endPickObject(world);
        }
        _world = world;
        _pickType = pickType;
        (_pickType == null) && (_pickType = DEFAULT_PICK_TYPE);
        _pickOnce = once == true;
        _onPickObject = onPickObject;
        world.AttachEvent('OnLButtonDown', onLBDown);
        world.AttachEvent('OnRButtonDown', onRBDown);
        _setCursor(world, 1);
        _isPickBegin = true;
    };
    var endPickObject = function(world) {
        if (world) {
            world.DetachEvent('OnLButtonDown', onLBDown);
            world.DetachEvent('OnRButtonDown', onRBDown);
            _setCursor(world, 0);
        }
        _isPickBegin = false;
    };

    var findPipeLayerFolderPath = function(name){
        var a = _config.pipeLayerFolder || '';
        a = typeof a == 'string' ? [a] : a;
        for(var i = 0;i < a.length;i++){
            var ai = a[i];
            if(new RegExp('^(\\S+\\\\)*'+name+'\\\\').test(ai)){
                return ai;
            }
            // if(ai.substring(ai.length - name.length - 2) == '\\' + name + '\\'){
            //     return ai;
            // }
        }
        return null;
    };
    var findPipeLayerFolder = function(obj, func1, func2){
        if(!obj){
            return null;
        }
        var n = typeof func1 == 'function' ? func1(obj) : obj[func1];
        n = findPipeLayerFolderPath(n);
        if(n){
            return n;
        }
        var a = [];
        for(var i = 3;i < arguments.length;i++){
            a.push(arguments[i]);
        }
        var o = func2.apply(obj, a);
        if(o === obj){
            return null;
        }
        return findPipeLayerFolder(o, func1, func2);
    };

    var getPipeLayerPath = function(name) {
        var p = (_config.pipeLayerFolder || '') + name;
        return p;
    };
    var getPipeLayerFolder = function(name) {
        return _config.pipeLayerFolder;
    };
    var getPipeLayerByKey = function(world, layerKey){
        SFM.reqHelper.getLayerList({ async: false });
        var ln = SFM.reqHelper.getLayerGroup(layerKey);
        if (ln) {
            return getPipeLayerByName(world, ln);
        }
        return null;
    };
    var getPipeLayerByName = function(world, name) {
        return getPipeLayerByName2(world, name);
        // 4 test
        // name = '[KQJS#txt]';
        var p = getPipeLayerPath(name);
        return getFeatureLayer(world, p);
    };
    var getPipeLayerByName2 = function(world, name) {
        var p = _config.pipeLayerFolder || '';
        if (typeof p == 'string') {
            return getFeatureLayer(world, p + name);
        }
        for (var i = 0; i < p.length; i++) {
            var pi = p[i] + name;
            var l = getFeatureLayer(world, pi);
            if (l) return l;
        }
        return null;
    };
    var getFeatureLayer = function(world, path) {
        var id = world.ProjectTree.FindItem(path);
        if (id) {
            var l = world.ProjectTree.GetObject(id);
            if (l) {
                if(l.ObjectType == OT_FEATURE_LAYER){
                    return l;
                }else if(l.ObjectType == OT_3D_MESH_LAYER){
                    if(l.FeatureLayers.Count > 0){
                        return l.FeatureLayers.Item(0);
                    }
                }else if(l.ObjectType == OT_3DML_FEATURE_LAYER){
                    return l;
                }
            }
        }
        return null;
    };

    var createGeometry = function(world, wkt) {
        return world.Creator.GeometryCreator.CreateGeometryFromWKT(wkt);
    };
    var getBufferGeometry = function(geometry, radius) {
        return geometry.SpatialOperator.buffer(radius || 0);
    };
    var exeSpatialQuery = function(world, layer, sfilter) {
        if (!world || !layer || !sfilter) {
            return null;
        }
        var g = sfilter.geometry || (sfilter.wkt && world.Creator.GeometryCreator.CreateGeometryFromWKT(sfilter.wkt));
        if (!g) {
            return null;
        }
        var fs = layer.ExecuteSpatialQuery(g);
        return fs;
    };
    var queryFeatureLayer = function(world, layer, pfilter, sfilter, num){
        if (!world || !layer || !pfilter) {
            return null;
        }
        num == undefined && (num = -1);
        var g = sfilter ?
            sfilter.geometry || (sfilter.wkt && world.Creator.GeometryCreator.CreateGeometryFromWKT(sfilter.wkt)) :
            world.Creator.GeometryCreator.CreatePolygonGeometry(null);
        var fs = layer.ExecuteQuery(pfilter, num, "", g);
        return fs;
    };
    var findFeatures = function(world, layer, sfilter, value, key) {
        var fs = exeSpatialQuery(world, layer, sfilter);
        if (!fs) {
            return null;
        }
        var k = key || _config.modelFkField;
        var fa = [];
        for (var i = 0; i < fs.Count; i++) {
            var fi = fs.Item(i);
            try {
                var a = fi.FeatureAttributes.GetFeatureAttribute(k);
                if (a.Value == value) {
                    fa.push(fi);
                }
            } catch (e) {
                continue;
            }
        }
        return fa;
    };
    var findFeaturesWithKey = function(world, layer, sfilter, valueList, key) {
        var fs = exeSpatialQuery(world, layer, sfilter);
        if (!fs) {
            return null;
        }
        var k = key || _config.modelFkField;
        var fa = [];
        for (var i = 0; i < fs.Count; i++) {
            var fi = fs.Item(i);
            try {
                var a = fi.FeatureAttributes.GetFeatureAttribute(k);
                if ($.inArray(a.Value, valueList) >= 0) {
                    fa.push(fi);
                }
            } catch (e) {
                continue;
            }
        }
        return fa;
    };
    var getPipeFeature = function(world, layer, wkt, value) {
        var g = createGeometry(world, wkt);
        if (!g) {
            return null;
        }
        if (g.GeometryType == 0) {
            g = g.SpatialOperator.buffer(DEFAULT_SEARCH_BUFFER_RADIUS);
        } else {
            g = g.Envelope;
        }
        var fa = findFeatures(world, layer, { geometry: g }, value);
        return fa;
    };
    var getPipeFeaturesFromLayer = function(world, layerKey, wkt, value, csName) {
        return getPipeFeaturesFromLayer3(world, layerKey, wkt, value, csName);
        SFM.reqHelper.getLayerList({ async: false });
        var ln = SFM.reqHelper.getLayerGroup(layerKey);
        if (ln) {
            var lyr = getPipeLayerByName(world, ln);
            if (lyr) {
                var wkt2 = xyWkt2blhWkt(world, wkt, csName);
                // 4 test
                // value = 'KQJS_lin_2_' + value;
                var fa = getPipeFeature(world, lyr, wkt2, value);
                return fa;
            }
        }
        return null;
    };
    var getPipeFeaturesFromLayer2 = function(world, layerKey, wkt, value, csName) {
        SFM.reqHelper.getLayerList({ async: false });
        var ln = SFM.reqHelper.getLayerGroup(layerKey);
        if (ln) {
            var lyr = getPipeLayerByName(world, ln);
            if (lyr) {
                var wkt2 = xyWkt2blhWkt(world, wkt, csName);
                var fa = getPipeFeature(world, lyr, wkt2, value);
                if(true || !fa || fa.length == 0){
                    var f = [[{
                        key: _config.modelFkField,
                        value: value
                    }, {
                        key: _config.modelTblField,
                        value: layerKey
                    }]];
                    var fr = setLayerStreaming(world, lyr, false);
                    fa = searchFeaturesFromLayer(world, lyr, f, true);
                }
                return fa;
            }
        }
        return null;
    };
    var getPipeFeaturesFromLayer3 = function(world, layerKey, wkt, value, csName){
        SFM.reqHelper.getLayerList({ async: false });
        var ln = SFM.reqHelper.getLayerGroup(layerKey);
        if (ln) {
            var lyr = getPipeLayerByName(world, ln);
            if (lyr) {
                // var p = _config.modelFkField + '=\'' + value + '\' and ' + _config.modelTblField + '=\'' + layerKey + '\'';
                // var v = isNaN(value) ? '\'' + value + '\'' : value;
                // var p = _config.modelTblField + '=\'' + layerKey + '\' and ' + _config.modelFkField + '=' + v;
                var p = _config.modelTblField + '=\'' + layerKey + '\' and ';
                var v = '\'' + value + '\'';
                if(isNaN(value)){
                    p += _config.modelFkField + '=' + v;
                }else{
                    p += '(' + _config.modelFkField + '=' + v + ' or ' + _config.modelFkField + '=' + value + ')';
                }
                var fs = queryFeatureLayer(world, lyr, p, null);
                var fa = [];
                for(var i = 0;i < fs.Count;i++){
                    fa.push(fs.Item(i));
                }
                return fa;
            }
        }
        return null;
    };
    var getPipeFeaturesFromLayerByKeys = function(world, layerKey, valueList){
        var lyr = getPipeLayerByKey(world, layerKey);
        if(!lyr){
            return null;
        }
        var p = '';
        var pi = _config.modelTblField + '=\'' + layerKey + '\' and ';
        for(var i = 0;i < valueList.length;i++){
            var vi = valueList[i];
            if(isNaN(vi)){
                vi = _config.modelFkField + '=' + '\'' + vi + '\'';
            }else{
                vi = '(' + _config.modelFkField + '=' + '\'' + vi + '\'' + ' or ' + _config.modelFkField + '=' + vi + ')';
            }
            p += '(' + pi + vi + ') or ';
        }
        if(p.length > 0){
            p = p.substr(0, p.length - 4);
        }
        var fs = queryFeatureLayer(world, lyr, p, null);
        var fa = [];
        for(var i = 0;i < fs.Count;i++){
            fa.push(fs.Item(i));
        }
        return fa;
    };
    var getPipeFeaturesFromLayerByFilters = function(world, layer, filters){
        var p = '';
        for(var i = 0;i < filters.length;i++){
            var fi = filters[i];
            var lk = fi.layerKey;
            var k = fi.key;
            if(isNaN(k)){
                k = _config.modelFkField + '=' + '\'' + k + '\'';
            }else{
                k = '(' + _config.modelFkField + '=' + '\'' + k + '\'' + ' or ' + _config.modelFkField + '=' + k + ')';
            }
            p += '(' + _config.modelTblField + '=\'' + layerKey + '\' and ' + k + ') or ';
        }
        if(p.length > 0){
            p = p.substr(0, p.length - 4);
        }
        var fs = queryFeatureLayer(world, layer, p, null);
        var fa = [];
        for(var i = 0;i < fs.Count;i++){
            fa.push(fs.Item(i));
        }
        return fa;
    };

    var getPipeFeaturesFromLayerByFilters2 = function(world, layer, filters, num){
        num != undefined || (num = 20);
        var fa = [];
        for(var i = 0;i < filters.length;){
            var p = '';
            for(var j = 0;j < num && i < filters.length;j++,i++){
                p += '(' + getFilterSql(filters[i]) + ') or ';
            }
            if(p.length > 0){
                p = p.substr(0, p.length - 4);
            }
            var fs = queryFeatureLayer(world, layer, p, null);
            for(var j = 0;j < fs.Count;j++){
                fa.push(fs.Item(j));
            }
        }
        return fa;
    };
    var getFilterSql = function(filter){
        if(!filter){
            return null;
        }
        var lk = filter.layerKey;
        var k = filter.key;
        if(isNaN(k)){
            k = _config.modelFkField + '=' + '\'' + k + '\'';
        }else{
            k = '(' + _config.modelFkField + '=' + '\'' + k + '\'' + ' or ' + _config.modelFkField + '=' + k + ')';
        }
        return _config.modelTblField + '=\'' + lk + '\' and ' + k;
    };
    var searchFeaturesByLayerKey = function(world, layerKey, sfilter, valueList, key) {
        SFM.reqHelper.getLayerList({ async: false });
        var ln = SFM.reqHelper.getLayerGroup(layerKey);
        if (ln) {
            var lyr = getPipeLayerByName(world, ln);
            if (lyr) {
                var fs = exeSpatialQuery(world, lyr, sfilter);
                if (!fs) {
                    return null;
                }
                var k = key || _config.modelFkField;
                var fa = [];
                for (var i = 0; i < fs.Count; i++) {
                    var fi = fs.Item(i);
                    try {
                        var a = fi.FeatureAttributes.GetFeatureAttribute(k);
                        if ($.inArray(a.Value, valueList) >= 0) {
                            fa.push(fi);
                        }
                    } catch (e) {
                        continue;
                    }
                }
                return fa;
            }
        }
        return null;
    };

    var searchFeaturesFromLayer = function(world, layer, pfilters, ignoreCase){
        if(!world || !layer || (layer.ObjectType != OT_FEATURE_LAYER)) {
            return null;
        }
        var fa = [];
        var fgs = layer.FeatureGroups;
        for(var i = 0;i < fgs.Count;i++){
            var fs = fgs.Item(i).GetCurrentFeatures();
            for(var j = 0;j < fs.Count;j++){
                var f = fs.Item(j);
                var fas = f.FeatureAttributes;
                if(checkFilters(fas, pfilters, ignoreCase)){
                    fa.push(f);
                }
            }
        }
        return fa;
    };
    var searchFeatureByKeyFromLayer = function(world, layer, key, layerKey, ignoreCase){
        var f = [{
            key: _config.modelFkField,
            value: key
        }, {
            key: _config.modelTblField,
            value: layerKey
        }];
        return searchFeatureFromLayer(world, layer, f, ignoreCase);
    };
    var searchFeatureFromLayer = function(world, layer, pfilter, ignoreCase){
        if(!world || !layer || (layer.ObjectType != OT_FEATURE_LAYER)) return null;
        var fgs = layer.FeatureGroups;
        for(var i = 0;i < fgs.Count;i++){
            var fs = fgs.Item(i).GetCurrentFeatures();
            for(var j = 0;j < fs.Count;j++){
                var f = fs.Item(j);
                var fas = f.FeatureAttributes;
                if(checkFilter(fas, pfilter, ignoreCase)){
                    return f;
                }
            }
        }
        return null;
    };

    var checkFilters = function(fas, filters, ignoreCase){
        if(!filters) return false;
        for (var i = 0; i < filters.length; i++) {
            var fi = filters[i];
            if(checkFilter(fas, fi, ignoreCase)){
                return true;
            }
        }
        return false;
    };
    var checkFilter = function(fas, filter, ignoreCase){
        if(!filter) return true;
        for(var i = 0;i < filter.length;i++){
            var fi = filter[i];
            if(fas.GetFeatureAttribute(fi.key).Value != fi.value ||
                (ignoreCase && fas.GetFeatureAttribute(fi.key).Value.toLowerCase() != fi.value.toLowerCase())){
                return false;
            }
        }
        return true;
    };

    var pointRotate = function(p, p0, rad) {
        var x = (p.x - p0.x) * Math.cos(rad) - (p.y - p0.y) * Math.sin(rad) + p0.x;
        var y = (p.x - p0.x) * Math.sin(rad) + (p.y - p0.y) * Math.cos(rad) + p0.y;
        return {
            x: x,
            y: y
        };
    };
    var pointScale = function(p, p0, r) {
        if (r == 0) {
            return { x: p0.x, y: p0.y };
        }
        x = (p.x - p0.x) * r + p0.x;
        y = (p.y - p0.y) * r + p0.y;
        return {
            x: x,
            y: y
        };
    };
    var pointScaleToLen = function(p, p0, length) {
        var x = Math.pow(p.x - p0.x, 2);
        var y = Math.pow(p.y - p0.y, 2);
        var r = Math.pow(x + y, 0.5);
        if (r == 0) {
            return { x: p0.x, y: p0.y };
        }
        r = length / r;
        x = (p.x - p0.x) * r + p0.x;
        y = (p.y - p0.y) * r + p0.y;
        return {
            x: x,
            y: y
        };
    };

    var getHeight = function(world, x, y, pickType){
        var p = pixelFromWorld(world, x, y);
        p = world.Window.PixelToWorld(p.x, p.y, pickType == undefined ? -1 : pickType);
        return p.Position.Altitude;
    };
    var getAltitude = function(world, x, y, accuracyLevel, includeGroundObject){
        var al = accuracyLevel == undefined ? 0 : accuracyLevel;
        var b = !!includeGroundObject;
        var wpi = world.Terrain.GetGroundHeightInfo(x, y, al, b);
        return wpi.Position.Altitude;
    };
    var calcVolumeFromTerrain = function(world, options){
        if(!world || !options){
            return 0;
        }
        var xmin = Number(options.xmin);
        var ymin = Number(options.ymin);
        var xmax = Number(options.xmax);
        var ymax = Number(options.ymax);
        if(isNaN(xmin) || isNaN(ymin) || isNaN(xmax) || isNaN(ymax)){
            return 0;
        }
        var x1 = Math.min(xmin, xmax);
        var x2 = Math.max(xmin, xmax);
        var y1 = Math.min(ymin, ymax);
        var y2 = Math.max(ymin, ymax);
        xmin = x1;
        ymin = y1;
        xmax = x2;
        ymax = y2;
        var dx = options.dx || 0.5;
        var dy = options.dy || 0.5;
        var da0 = options.altThreshold || 1;
        var ga = options.groundAlt || 0;
        var ta = options.topAlt;
        // var b = options.isWgs84 !== false;
        // if(srcCsIsWgs84(world)){
        //     dx = dx / EARTH_RADIUS * 180 * Math.PI;
        //     dy = dy / EARTH_RADIUS * 180 * Math.PI;
        //     if(!b){
        //         var p = xy2blh(world, {x: xmin, y: ymin});
        //         xmin = p.x;
        //         ymin = p.y;
        //         p = xy2blh(world, {x: xmax, y: ymax});
        //         xmax = p.x;
        //         ymax = p.y;
        //     }
        // }else{
        //     if(b){
        //         var p = blh2xy(world, {x: xmin, y: ymin});
        //         xmin = p.x;
        //         ymin = p.y;
        //         p = blh2xy(world, {x: xmax, y: ymax});
        //         xmax = p.x;
        //         ymax = p.y;
        //     }
        // }
        var cc = Math.ceil((xmax - xmin) / dx);
        var rc = Math.ceil((ymax - ymin) / dy);
        var vt = 0;
        for(var i = 0;i < cc - 1;i++){
            x1 = xmin + dx * i;
            x2 = xmin + dx * (i + 1);
            for(var j = 0;j < rc - 1;j++){
                y1 = ymin + dy * j;
                y2 = ymax + dy * (j + 1);

                var a11 = getAltitude(world, x1, y1, 0, true);
                if(a11 - ta > da0 * 10){
                    continue;
                }
                var a12 = getAltitude(world, x1, y2, 0, true);
                if(a12 - ta > da0 * 10){
                    continue;
                }
                var a22 = getAltitude(world, x2, y2, 0, true);
                if(a22 - ta > da0 * 10){
                    continue;
                }
                var a21 = getAltitude(world, x2, y1, 0, true);
                if(a21 - ta > da0 * 10){
                    continue;
                }
                var da11 = a11 - ga;
                var da12 = a12 - ga;
                var da22 = a22 - ga;
                var da21 = a21 - ga;
                if(da11 <= da0 && da12 <= da0 && da22 <= da0 && da21 <= da0){
                    continue;
                }
                var v = (da11 + da12 + da22 + da21) / 4 * dx * dy;
                vt += v;
            }
        }
        return vt;
    };

    var linkWorld = function(world, world2, options){
        if(!world || !world2){
            return;
        }
        var fp = valueOrDefault(options, 'projectUrl', world.Project.Name);
        world2.Project.Open(fp);
        var mw = world.Application.Multiple3DWindows;
        var x = valueOrDefault(options, 'x', 0);
        var y = valueOrDefault(options, 'y', 0);
        var z = valueOrDefault(options, 'z', 0);
        var yaw = valueOrDefault(options, 'yaw', 0);
        var pitch = valueOrDefault(options, 'pitch', 0);
        var f = valueOrDefault(options, 'flag', 0);
        mw.LinkPosition(world2, x, y, z, yaw, pitch, f);
        if(valueOrDefault(options, 'srcLeader', true)){
            mw.SetAsLeader();
        }
    };
    var unlinkWorld = function(world){
        var mw = world.Application.Multiple3DWindows;
        mw.UnlinkPosition();
    };

    var getDefaultGroupId = function(world){
        return world.ProjectTree.NotInTreeID;
    };

    var LayerManager = function(options) {
        if (!(this instanceof LayerManager)) {
            return new LayerManager(options);
        }

        this.initialize(options);
    };
    LayerManager.prototype = {
        initialize: function(options) {
            var me = this;
            me.data = {};
            me.data.world = options.world;
            me.data.options = options.options;
            me.data.prjTree = me.data.world.ProjectTree;
            me.data.layerTreeData = null;
        },
        getTeRootID: function() {
            return this.data.prjTree.RootID;
        },
        getNotInTreeID: function() {
            return this.data.prjTree.NotInTreeID;
        },
        getHiddenGroupID: function() {
            return this.data.prjTree.HiddenGroupID;
        },
        getHiddenGroupName: function() {
            return this.data.prjTree.HiddenGroupName;
        },
        getItemName: function(id) {
            return this.data.prjTree.GetItemName(id);
        },
        selectItem: function(id, flags, reserved) {
            var f = flags == undefined ? 0 : flags;
            var r = reserved == undefined ? 0 : reserved;
            this.data.prjTree.SelectItem(id, f, r);
            return this;
        },
        setLayerVisible: function(id, visible) {
            this.data.prjTree.SetVisibility(id, visible);
            return this;
        },
        flyToLayer: function(id, pattern) {
            this.data.world.Application.Multiple3DWindows.SetAsLeader();
            this.data.world.Navigate.FlyTo(id, pattern);
            return this;
        },
        jumpToLayer: function(id) {
            this.data.world.Navigate.JumpTo(id);
            return this;
        },

        getLayerTreeData: function(refresh) {
            var me = this;
            if (me.data.layerTreeData && !refresh) {
                return me.data.layerTreeData;
            }
            me.data.layerTreeData = [];
            var rid = me.data.prjTree.GetNextItem(me.data.prjTree.RootID, 18);
            if (me.getItemName(rid) == me.getHiddenGroupName()) {
                rid = me.data.prjTree.GetNextItem(rid, 13);
            }
            me._getTreeNode(rid, me.data.layerTreeData);
            return me.data.layerTreeData;
        },

        getChildren: function(itemId, children){
            if(!children){
                return;
            }
            if (this.data.prjTree.IsGroup(itemId)){
                var ci = this.data.prjTree.GetNextItem(itemId, 11);
                if(ci){
                    var n = {
                        id: ci,
                        name: this.data.prjTree.GetItemName(ci),
                        checked: this.data.prjTree.GetVisibility(ci)
                    };
                    children.push(n);
                    while(ci = this.data.prjTree.GetNextItem(ci, 13)){
                        var n = {
                            id: ci,
                            name: this.data.prjTree.GetItemName(ci),
                            checked: this.data.prjTree.GetVisibility(ci)
                        };
                        children.push(n);
                    }
                }
            }
        },

        _getTreeNode: function(curItemId, nodes) {
            var n = {
                id: curItemId,
                name: this.data.prjTree.GetItemName(curItemId),
                checked: this.data.prjTree.GetVisibility(curItemId)
            };
            if(this.data.options && this.data.options.layerVisible !== undefined){
                n.checked = this.data.options.layerVisible;
                this.data.prjTree.SetVisibility(ci, n.checked);
            }
            nodes.push(n);
            if (this.data.prjTree.IsGroup(curItemId)) {
                n.children = [];
                var ci = this.data.prjTree.GetNextItem(curItemId, 11);
                if (ci) {
                    this._getTreeNode(ci, n.children);
                }
            }
            var nn = this.data.prjTree.GetNextItem(curItemId, 13);
            if (nn) {
                this._getTreeNode(nn, nodes);
            }
        },
        destroy: function() {}
    };

    var HighlightManager = function(options) {
        if (!(this instanceof HighlightManager)) {
            return new HighlightManager(options);
        }

        this.initialize(options);
    };
    HighlightManager.prototype = {
        initialize: function(options) {
            var me = this;
            me.data = {};
            me.data.world = options.world;
            me.data.hlObj = [];
        },
        getModelLocObj: function(model){
            var me = this;
            var world = me.data.world;
            if(model.ObjectType == 33){
                var g = model.Geometry;
                var gt = g.GeometryType;
                if(gt == 0){
                    return getPosition(world, {x: g.X, y: g.Y, z: g.Z, pitch: -89, distance: 80});
                } else if (gt == 1) {
                    var x = 0;
                    var y = 0;
                    var z = 0;
                    var l = g.Points.Count;
                    for(var i = 0;i < l;i++){
                        var pi = g.Points.Item(i);
                        x += pi.X;
                        y += pi.Y;
                        z += isNaN(pi.Z) ? 0 : pi.Z;
                    }
                    x /= l;
                    y /= l;
                    z /= l;
                    return getPosition(world, {x: x, y: y, z: z, pitch: -89, distance: 80});
                } else if(gt == 2 || gt == 3){
                    var cp = g.Centroid;
                    return getPosition(world, {x: cp.X, y: cp.Y, z: cp.Z, pitch: -89, distance: 80});
                }
            }
            return model;
        },
        locateModel: function(model, options){
            var me = this;
            var m = this.getModelLocObj(model);
            options && options.jump ?
                this.data.world.Navigate.JumpTo(m) :
                this.data.world.Navigate.FlyTo(m);
        },
        showHighlight: function(model, flash, locate, options, onFlashOver) {
            var me = this;
            if (model) {
                var hlColor = options && options.highlightColor != undefined ? options.highlightColor : DEFAULT_HIGHLIGHT_COLOR;
                var ft = options && options.flashTimes != undefined ? options.flashTimes : DEFAULT_FLASH_TIMES;
                // model.Tint.abgrColor = hlColor;
                model.Tint.FromARGBColor(hlColor);
                var mo = { model: model };
                hlc[model.ID] || (hlc[model.ID] = 0);
                hlc[model.ID]++;
                if (flash) {
                    var c = 1;
                    mo.timer = setInterval(function() {
                        // model.Tint.abgrColor = c % 2 == 1 ? _defaultTintColor : hlColor;
                        model.Tint.FromARGBColor(c % 2 == 1 ? _defaultTintColor : hlColor);
                        c++;
                        if (c > ft * 2 - 1) {
                            if (options && options.highlightWhenFlashOver) {
                                clearInterval(mo.timer);
                                delete mo.timer;
                                // model.Tint.abgrColor = hlColor;
                                model.Tint.FromARGBColor(hlColor);
                            } else {
                                me.stopHighlight(model);
                            }
                            if (typeof onFlashOver == 'function') {
                                onFlashOver(model);
                            }
                        }
                    }, 500);
                }
                me.data.hlObj.push(mo);
                if (locate) {
                    this.locateModel(model, options);
                    // if (options && options.jump) {
                    //     this.data.world.Navigate.JumpTo(model);
                    // } else {
                    //     this.data.world.Navigate.FlyTo(model);
                    // }
                }
            }
            return this;
        },
        stopHighlight: function(model) {
            var hl = this.data.hlObj;
            for (var i = 0; i < hl.length; i++) {
                var mi = hl[i];
                if (mi.model.ID == model.ID) {
                    hlc[mi.model.ID] && hlc[model.ID]--;
                    if (hlc[model.ID] <= 0) {
                        // mi.model.Tint.abgrColor = _defaultTintColor;
                        mi.model.Tint.FromARGBColor(_defaultTintColor);
                    }
                    if (mi.timer >= 0) {
                        clearInterval(mi.timer);
                    }
                    hl.splice(i, 1);
                    i--;
                }
            }
            return this;
        },
        clearHighlight: function() {
            var hl = this.data.hlObj;
            while (hl.length > 0) {
                var m = hl.pop();
                if (m) {
                    if (m.model) {
                        hlc[m.model.ID] && hlc[m.model.ID]--;
                        if (hlc[m.model.ID] <= 0) {
                            // m.model.Tint.abgrColor = _defaultTintColor;
                            m.model.Tint.FromARGBColor(_defaultTintColor);
                        }
                    }
                    if (m.timer >= 0) {
                        clearInterval(m.timer);
                    }
                }
            }
            return this;
        },
        destroy: function() {
            this.clearHighlight();
        }
    };

    var ShapeTool = function(options) {
        if (!(this instanceof ShapeTool)) {
            return new ShapeTool(options);
        }

        this.initialize(options);
    };
    ShapeTool.prototype = {
        initialize: function(options) {
            var me = this;
            me.data = {};
            me.data.world = options.world;
            me.data.cb = {};
            me.data.drawnShape = [];
            me.data.drawType = -1;
            me.data.cb.onLBClicked = $.proxy(me._onLBClicked, me);
            me.data.cb.onRBDown = $.proxy(me._onRBDown, me);
            me.data.cb.onFrame = $.proxy(me._onFrame, me);
        },
        clearDraw: function() {
            var me = this;
            var world = me.data.world;
            while (me.data.drawnShape.length > 0) {
                var e = me.data.drawnShape.pop();
                if (me.data.isBeginEdit && (e.ObjectType == 1 || e.ObjectType == 2)) {
                    e.Geometry.EndEdit();
                }
                world.Creator.DeleteObject(e.ID);
            }
            return me;
        },
        exitDraw: function(isOver) {
            if (this.data.drawing) {
                this.data.drawing = false;
                this.data.world.DetachEvent('OnLButtonClicked', this.data.cb.onLBClicked);
                this.data.world.DetachEvent('OnRButtonDown', this.data.cb.onRBDown);
                this.data.world.DetachEvent('OnFrame', this.data.cb.onFrame);
                _setCursor(this.data.world, 0);
            }
            var tt = this.data.drawType;
            var ops = this.data.drawOptions;
            this.data.drawType = -1;
            var onDrawn = this.data.cb.onDrawn;
            if (isOver && typeof onDrawn == 'function') {
                var a = [this.data.drawnShape];
                if (tt == 1) {
                    // polyline
                    var e = this._getLastDrawnShp();
                    if (e) {
                        var ps = e.Geometry.Points;
                        a.push(ps);
                        if (ops && ops.cvtCoor) {
                            var cs = [];
                            for (var i = 0; i < ps.Count; i++) {
                                var pi = ps.Item(i);
                                var p = blh2xy(this.data.world, { x: pi.X, y: pi.Y });
                                p.z = pi.Z;
                                cs.push(p);
                            }
                            a.push(cs);
                        }else{
                            a.push([]);
                        }
                        if(ops && ops.toJson){
                            var cs = [];
                            for (var i = 0; i < ps.Count; i++) {
                                var pi = ps.Item(i);
                                var p = {x: pi.X, y: pi.Y, z: pi.Z};
                                cs.push(p);
                            }
                            a.push(cs);
                        }
                    }
                } else if (tt == 2) {
                    // polygon
                    var e = this._getLastDrawnShp();
                    if (e) {
                        var ps = e.Geometry.Rings(0).Points;
                        a.push(ps);
                        if (ops && ops.cvtCoor) {
                            var cs = [];
                            for (var i = 0; i < ps.Count; i++) {
                                var pi = ps.Item(i);
                                var p = blh2xy(this.data.world, { x: pi.X, y: pi.Y });
                                p.z = pi.Z;
                                cs.push(p);
                            }
                            a.push(cs);
                        }else{
                            a.push([]);
                        }
                        if(ops && ops.toJson){
                            var cs = [];
                            for (var i = 0; i < ps.Count; i++) {
                                var pi = ps.Item(i);
                                var p = {x: pi.X, y: pi.Y, z: pi.Z};
                                cs.push(p);
                            }
                            a.push(cs);
                        }
                    }
                } else if (tt == 5) {
                    // circle
                    var e = this._getLastDrawnShp();
                    if (e) {
                        var cp = e.Position;
                        a.push({ position: cp, radius: e.Radius });
                        if (ops && ops.cvtCoor) {
                            var p = blh2xy(this.data.world, { x: cp.X, y: cp.Y });
                            p.z = cp.Altitude;
                            a.push({ position: p, radius: e.Radius });
                        }
                    }
                }
                onDrawn.apply(this, a);
                delete this.data.cb.onDrawn;
            }
            return this;
        },
        drawPolyline: function(options, csName, onDrawn) {
            var me = this;
            csName != null && (curCsName = csName);
            me.exitDraw(false);
            me._beginDraw(1, options, onDrawn);
            return me;
        },
        drawPolygon: function(options, csName, onDrawn) {
            var me = this;
            csName != null && (curCsName = csName);
            me.exitDraw(false);
            me._beginDraw(2, options, onDrawn);
            return me;
        },
        drawCircle: function(options, csName, onDrawn) {
            var me = this;
            csName != null && (curCsName = csName);
            me.exitDraw(false);
            me._beginDraw(5, options, onDrawn);
            return me;
        },

        getElementStyle: function(options) {
            var lc = valueOrDefault(options, 'lineColor', SHAPETOOL_DEFAULT_LINE_COLOR);
            var lw = valueOrDefault(options, 'lineWidth', SHAPETOOL_DEFAULT_LINE_WIDTH);
            var fc = valueOrDefault(options, 'fillColor', SHAPETOOL_DEFAULT_FILL_COLOR);
            var at = valueOrDefault(options, 'altitudeType', SHAPETOOL_DEFAULT_ALTITUDE_TYPE);
            var gpid = valueOrDefault(options, 'groupId', this.data.world.ProjectTree.NotInTreeID);
            var desc = valueOrDefault(options, 'desc', '');
            lc = this.createColor(lc);
            fc = this.createColor(fc);
            return { lineColor: lc, lineWidth: lw, fillColor: fc, altType: at, groupId: gpid, desc: desc };
        },
        setElementAttr: function(el, options) {
            el.LineStyle.Width = valueOrDefault(options, 'lineWidth', SHAPETOOL_DEFAULT_LINE_WIDTH);
            el.Terrain.DrawOrder = valueOrDefault(options, 'drawOrder', 0);
            el.Terrain.GroundObject = valueOrDefault(options, 'isGroundObject', false);
            return el;
        },
        createPolyline: function(data, options) {
            var geom = data && data.geometry || this.createLineStringGeometry(data);
            if (!geom) {
                return null;
            }
            var s = this.getElementStyle(options);
            var e = this.data.world.Creator.CreatePolyline(geom, s.lineColor, s.altType, s.groupId, s.desc);
            this.setElementAttr(e, options);
            return e;
        },
        createPolygon: function(data, options) {
            var geom = data && data.geometry || this.createPolygonGeometry(data);
            if (!geom) {
                return null;
            }
            var s = this.getElementStyle(options);
            var e = this.data.world.Creator.CreatePolygon(geom, s.lineColor, s.fillColor, s.altType, s.groupId, s.desc);
            this.setElementAttr(e, options);
            return e;
        },
        createCircle: function(data, options) {
            var cp = data && data.position || (data.vertice && array2position(data.vertice));
            if (!cp) {
                return null;
            }
            var r = data.radius;
            var s = this.getElementStyle(options);
            var e = this.data.world.Creator.CreateCircle(cp, r, s.lineColor, s.fillColor, s.groupId, s.desc);
            this.setElementAttr(e, options);
            e.NumberOfSegments = valueOrDefault(options, 'segments', 24);
            return e;
        },
        createPath: function(data, options) {
            var me = this;
            var ps = data.points;
            if (!ps || ps.length < 2) {
                return null;
            }
            var els = [];
            var pl = [];
            var ao = valueOrDefault(options, 'altOffset', 0);
            for (var i = 0; i < ps.length; i++) {
                var pi = xy2blh(me.data.world, ps[i]);
                var alt = 0;
                if (valueOrDefault(options, 'altitudeType', SHAPETOOL_DEFAULT_ALTITUDE_TYPE) == 3) {
                    alt = me.data.world.Terrain.GetGroundHeightInfo(pi.x, pi.y, 0, false) + ao;
                }
                pl.push(pi.x, pi.y, alt);
            }
            var e = me.createPolyline({ vertices: pl }, options);
            if (!e) {
                return null;
            }
            els.push(e);
            var at = valueOrDefault(options, 'arrow.type', 0);
            if (at > 0) {
                var ad = valueOrDefault(options, 'arrow.direction', 1);
                var al = valueOrDefault(options, 'arrow.length', 10);
                var aa = valueOrDefault(options, 'arrow.angle', 30);
                var ap = valueOrDefault(options, 'arrow.position', 1);
                var si = ps.length - 2;
                var ei = ps.length - 1;
                var r = aa * Math.PI / 180;
                if ((ad & 1) == 1) {
                    ei = ps.length - 1;
                    if (valueOrDefault(options, 'arrow.num', 1) == 1) {
                        si = ps.length - 2;
                    } else {
                        si = 0;
                    }
                    for (var i = si; i < ei; i++) {
                        var p1 = ps[i];
                        var p2 = ps[i + 1];
                        var p5 = p2;
                        if (ap == 0) {
                            p5 = p1;
                        } else if (ap == 1) {
                            p5 = p2;
                        } else {
                            p5 = pointScale(p1, p2, ap);
                        }
                        var p3 = pointRotate(p1, p5, r);
                        var p4 = pointRotate(p1, p5, -r);
                        p3 = pointScaleToLen(p3, p5, al);
                        p4 = pointScaleToLen(p4, p5, al);
                        p3 = xy2blh(me.data.world, p3);
                        p4 = xy2blh(me.data.world, p4);
                        p5 = xy2blh(me.data.world, p5);
                        var a3 = 0;
                        var a4 = 0;
                        var a5 = 0;
                        if (valueOrDefault(options, 'altitudeType', SHAPETOOL_DEFAULT_ALTITUDE_TYPE) == 3) {
                            a3 = me.data.world.Terrain.GetGroundHeightInfo(p3.x, p3.y, 0, false) + ao;
                            a4 = me.data.world.Terrain.GetGroundHeightInfo(p4.x, p4.y, 0, false) + ao;
                            a5 = me.data.world.Terrain.GetGroundHeightInfo(p5.x, p5.y, 0, false) + ao;
                        }
                        var a = [p3.x, p3.y, a3, p5.x, p5.y, a5, p4.x, p4.y, a4];
                        e = me.createPolyline({ vertices: a }, options);
                        if (!e) {
                            return null;
                        }
                        els.push(e);
                    }
                }
                if ((ad & 2) == 2) {
                    ei = 0;
                    if (valueOrDefault(options, 'arrow.num', 1) == 1) {
                        si = 1;
                    } else {
                        si = 0;
                    }
                    for (var i = si; i > ei; i--) {
                        var p1 = ps[i];
                        var p2 = ps[i - 1];
                        if (ap == 0) {
                            p5 = p1;
                        } else if (ap == 1) {
                            p5 = p2;
                        } else {
                            p5 = pointScale(p1, p2, ap);
                        }
                        var p3 = pointRotate(p1, p5, r);
                        var p4 = pointRotate(p1, p5, -r);
                        p3 = pointScaleToLen(p3, p5, al);
                        p4 = pointScaleToLen(p4, p5, al);
                        p3 = xy2blh(me.data.world, p3);
                        p4 = xy2blh(me.data.world, p4);
                        p5 = xy2blh(me.data.world, p5);
                        var a3 = 0;
                        var a4 = 0;
                        var a5 = 0;
                        if (valueOrDefault(options, 'altitudeType', SHAPETOOL_DEFAULT_ALTITUDE_TYPE) == 3) {
                            a3 = me.data.world.Terrain.GetGroundHeightInfo(p3.x, p3.y, 0, false) + ao;
                            a4 = me.data.world.Terrain.GetGroundHeightInfo(p4.x, p4.y, 0, false) + ao;
                            a5 = me.data.world.Terrain.GetGroundHeightInfo(p5.x, p5.y, 0, false) + ao;
                        }
                        var a = [p3.x, p3.y, a3, p5.x, p5.y, a5, p4.x, p4.y, a4];
                        e = me.createPolyline({ vertices: a }, options);
                        if (!e) {
                            return null;
                        }
                        els.push(e);
                    }
                }
            }
            return els;
        },

        createPointGeometry: function(options) {
            if (!options) {
                return null;
            }
            var v = options.wkb || options.wkt || options.vertices;
            if (v) {
                return this.data.world.Creator.GeometryCreator.CreatePointGeometry(v);
            }
            return null;
        },
        createLineStringGeometry: function(options) {
            if (!options) {
                return null;
            }
            var v = options.wkb || options.wkt || options.vertices || options.positions;
            if (v) {
                return this.data.world.Creator.GeometryCreator.CreateLineStringGeometry(v);
            }
            return null;
        },
        createLinearRingGeometry: function(options) {
            if (!options) {
                return null;
            }
            if (options.wkt) {
                return this.data.world.Creator.GeometryCreator.CreateLinearRingGeometry(options.wkt);
            }
            if (options.vertices && options.vertices.length > 8) {
                var a = options.vertices;
                var x0 = a[0];
                var y0 = a[1];
                var z0 = a[2];
                var l = a.length;
                var x_1 = a[l - 3];
                var y_1 = a[l - 2];
                var z_1 = a[l - 1];
                if (x0 != x_1 || y0 != y_1 || z0 != z_1) {
                    a = a.concat([x0, y0, z0]);
                } else if (a.length < 12) {
                    return null;
                }
                return this.data.world.Creator.GeometryCreator.CreateLinearRingGeometry(a);
            }
            if (options.positions) {
                return this.data.world.Creator.GeometryCreator.CreateLinearRingGeometry(options.positions);
            }
            return null;
        },
        createPolygonGeometry: function(exteriorRing, interiorRingList) {
            if (!exteriorRing) {
                return null;
            }
            var er = exteriorRing.linearRing || exteriorRing.wkt || exteriorRing.vertices;
            if (!er) {
                return null;
            }
            var irl = null;
            if (interiorRingList && interiorRingList.length > 0) {
                irl = [];
                for (var i = 0; i < interiorRingList.length; i++) {
                    var iri = interiorRingList[i];
                    var p = iri.linearRing || iri.wkt || iri.vertices || iri.positions;
                    irl.push(p);
                }
            }
            return this.data.world.Creator.GeometryCreator.CreatePolygonGeometry(er, irl);
        },
        createGeometry: function(options) {
            if (!options) {
                return null;
            }
            if (options.wkb) {
                return this.data.world.Creator.GeometryCreator.CreateGeometryFromWKB(options.wkb);
            }
            if (options.wkt) {
                return this.data.world.Creator.GeometryCreator.CreateGeometryFromWKT(options.wkt);
            }
            return null;
        },

        createColor: function(rgba) {
            var ca = [0, 0, 0, 0.6];
            for (var i = 0; i < rgba.length && i < ca.length; i++) {
                ca[i] = rgba[i];
            }
            return this.data.world.Creator.CreateColor(ca[0], ca[1], ca[2], ca[3]);
        },

        createImageLabel: function(options){
            var world = this.data.world;
            var x = options.x;
            var y = options.y;
            if(x == undefined || y == undefined || isNaN(x) || isNaN(y)){
                return null;
            }
            var p = getPosition(world, options);
            var ls = world.Creator.CreateLabelStyle(0);
            var gid = getDefaultGroupId(world);
            var desc = valueOrDefault(options, 'desc', '');
            var e = world.Creator.CreateImageLabel(p, options.url, ls, gid, desc);
            return e;
        },
        createLabel: function(options){
            var world = this.data.world;
            var x = options.x;
            var y = options.y;
            if(x == undefined || y == undefined || isNaN(x) || isNaN(y)){
                return null;
            }
            var p = getPosition(world, options);
            var ls = this.getLabelStyle(options.style);
            var gid = getDefaultGroupId(world);
            var desc = valueOrDefault(options, 'desc', '');
            var e = world.Creator.CreateLabel(p, options.text || '', options.url, ls, gid, desc);
            return e;
        },
        getLabelStyle: function(options){
            var world = this.data.world;
            var e = world.Creator.CreateLabelStyle(valueOrDefault(options, 'type', 0));

            e.Bold = valueOrDefault(options, 'bold', false);
            e.Italic = valueOrDefault(options, 'italic', false);
            e.Underline = valueOrDefault(options, 'underline', false);
            var fn = valueOrDefault(options, 'fontName', null);
            fn && (e.FontName = fn);
            e.FontSize = valueOrDefault(options, 'fontSize', 12);
            e.MultilineJustification = valueOrDefault(options, 'align', 'Center');
            e.PivotAlignment = valueOrDefault(options, 'pivotAlign', 'Bottom,Center');
            e.TextAlignment = valueOrDefault(options, 'textAlign', 'Bottom');

            var c = valueOrDefault(options, 'color', null);
            if(c != null){
                e.TextColor.FromARGBColor(c);
            }
            var bgc = valueOrDefault(options, 'bgColor', null);
            if(bgc != null){
                e.BackgroundColor.FromARGBColor(bgc);
            }
            var ic = valueOrDefault(options, 'iconColor', null);
            if(ic != null){
                e.IconColor.FromARGBColor(ic);
            }
            var lc = valueOrDefault(options, 'lineColor', null);
            if(lc != null){
                e.LineColor.FromARGBColor(lc);
            }
            e.LineToGroundType = valueOrDefault(options, 'lineToGroundType', 0);
            e.LineToGroundLength = valueOrDefault(options, 'lineToGroundLength', 0);
            e.LockMode = valueOrDefault(options, 'lockMode', 0);
            var mis = valueOrDefault(options, 'maxImageSize', null);
            if(mis != null){
                e.MaxImageSize = mis;
            }

            e.TextOnImage = valueOrDefault(options, 'textOnImage', false);
            e.Scale = valueOrDefault(options, 'scale', 1);
            var ffn = valueOrDefault(options, 'frameFileName', null);
            ffn && (e.FrameFileName = ffn);
            e.LimitScreenSize = valueOrDefault(options, 'limitScreenSize', true);
            var maxvh = valueOrDefault(options, 'maxViewingHeight', null);
            if(maxvh != null){
                e.MaxViewingHeight = maxvh;
            }
            var minvh = valueOrDefault(options, 'minViewingHeight', null);
            if(minvh != null){
                e.MinViewingHeight = minvh;
            }
            e.ShowTextBehavior = valueOrDefault(options, 'showTextBehavior', 0);
            // e.SmallestVisibleSize = valueOrDefault(options, 'smallestVisibleSize', 7);
            return e;
        },
        createModel: function(options){
            var world = this.data.world;
            var x = options.x;
            var y = options.y;
            if(x == undefined || y == undefined || isNaN(x) || isNaN(y)){
                return null;
            }
            var p = getPosition(world, options);
            var s = valueOrDefault(options, 'scale', 1);
            var mt = valueOrDefault(options, 'modelType', 0);
            var gid = getDefaultGroupId(world);
            var desc = valueOrDefault(options, 'desc', '');
            var e = world.Creator.CreateModel(p, options.url, s, mt, gid, desc);
            return e;
        },

        _onLBClicked: function(flags, x, y) {
            var me = this;
            var world = me.data.world;
            var wpi = world.Window.PixelToWorld(x, y, -1);
            if (!wpi) {
                return false;
            }
            var p = wpi.Position;
            var x = p.X;
            var y = p.Y;
            var z = p.Altitude;
            var f = valueOrDefault(me.data.drawOptions, 'onPickOnePoint', null);
            var b = typeof f == 'function';
            var cvt = valueOrDefault(me.data.drawOptions, 'cvtCoor', false);
            if (me.data.drawType == 1) {
                // polyline
                var e = me._getLastDrawnShp();
                if (!e) {
                    var va = [x, y, z, x, y, z];
                    e = me.createPolyline({ vertices: va }, me.data.drawOptions);
                    me.data.drawnShape.push(e);
                    e.Geometry.StartEdit();
                    me.data.isBeginEdit = true;

                    if(b){
                        var a = [e, {x: x, y: y, z: z}];
                        var co = null;
                        if(cvt){
                            co = blh2xy(this.data.world, { x: x, y: y });
                            co.z = z;
                        }
                        a.push(co);
                        f.apply(this, a);
                    }
                } else {
                    var c = e.Geometry.Points.Count;
                    var lp = e.Geometry.Points.Item(c - 1);
                    lp.X = x;
                    lp.Y = y;
                    lp.Z = z;
                    e.Geometry.Points.AddPoint(x, y, z);

                    if(b){
                        var a = [e, {x: x, y: y, z: z}];
                        var co = null;
                        if(cvt){
                            co = blh2xy(this.data.world, { x: x, y: y });
                            co.z = z;
                        }
                        a.push(co);
                        f.apply(this, a);
                    }

                    var vn = valueOrDefault(me.data.drawOptions, 'verticeNum', -1);
                    if(vn > 0 && e.Geometry.Points.Count > vn){
                        me._onRBDown(2, x, y);
                    }
                }
            } else if (me.data.drawType == 2) {
                // polygon
                var e = me._getLastDrawnShp();
                if (!e) {
                    var va = [x, y, z, x, y, z];
                    e = me.createPolyline({ vertices: va }, me.data.drawOptions);
                    me.data.drawnShape.push(e);
                    e.Geometry.StartEdit();
                    me.data.isBeginEdit = true;

                    if(b){
                        var a = [e, {x: x, y: y, z: z}];
                        var co = null;
                        if(cvt){
                            co = blh2xy(this.data.world, { x: x, y: y });
                            co.z = z;
                        }
                        a.push(co);
                        f.apply(this, a);
                    }
                } else {
                    if (e.ObjectType == 1) {
                        // polyline, the second point
                        var p1 = e.Geometry.Points.Item(0);
                        var x0 = p1.X;
                        var y0 = p1.Y;
                        var z0 = p1.Z;
                        me.data.drawnShape.pop();
                        world.Creator.DeleteObject(e.ID);
                        var va = [x0, y0, z0, x, y, z, x, y, z];
                        e = me.createPolygon({ vertices: va }, me.data.drawOptions);
                        me.data.drawnShape.push(e);
                        e.Geometry.StartEdit();

                        if(b){
                            var a = [e, {x: x, y: y, z: z}];
                            var co = null;
                            if(cvt){
                                co = blh2xy(this.data.world, { x: x, y: y });
                                co.z = z;
                            }
                            a.push(co);
                            f.apply(this, a);
                        }
                    } else {
                        var c = e.Geometry.Rings(0).Points.Count;
                        var lp = e.Geometry.Rings(0).Points.Item(c - 1);
                        lp.X = x;
                        lp.Y = y;
                        lp.Z = z;
                        e.Geometry.Rings(0).Points.AddPoint(x, y, z);

                        if(b){
                            var a = [e, {x: x, y: y, z: z}];
                            var co = null;
                            if(cvt){
                                co = blh2xy(this.data.world, { x: x, y: y });
                                co.z = z;
                            }
                            a.push(co);
                            f.apply(this, a);
                        }

                        var vn = valueOrDefault(me.data.drawOptions, 'verticeNum', -1);
                        if(vn > 0 && e.Geometry.ExteriorRing.Points.Count > vn){
                            me._onRBDown(2, x, y);
                        }
                    }
                }
            }else if( me.data.drawType == 3){
                // rectangle
            } else if (me.data.drawType == 5) {
                // circle
                var e = me._getLastDrawnShp();
                if (!e) {
                    e = me.createCircle({ position: p, radius: 0 }, me.data.drawOptions);
                    me.data.drawnShape.push(e);
                    var va = [x, y, z, x, y, z];
                    var e2 = me.createPolyline({ vertices: va }, me.data.drawOptions);
                    e2.LineStyle.Width = SHAPETOOL_DEFAULT_LINE_WIDTH;
                    me.data.drawnShape.push(e2);
                    e2.Geometry.StartEdit();
                    me.data.isBeginEdit = true;
                    var e3 = me.createLabel({x: x, y: y, z: z, text: '0米'});
                    e3.Style.FontSize = 16;
                    me.data.drawnShape.push(e3);
                } else {
                    var cp = e.Position;
                    var d = world.CoordServices.GetDistance(cp.X, cp.Y, p.X, p.Y);
                    e.Radius = d;
                    var e2 = me.data.drawnShape[1];
                    var p = e2.Geometry.Points.Item(e2.Geometry.Points.Count - 1);
                    p.X = x;
                    p.Y = y;
                    p.Z = z;
                    e2.Geometry.EndEdit();
                    var e3 = me.data.drawnShape[2];
                    e3.Position.X = (cp.X + x) / 2;
                    e3.Position.Y = (cp.Y + y) / 2;
                    e3.Position.Altitude = (cp.Altitude + z) / 2;
                    e3.Text = d >= 1000 ? (d / 1000).toFixed(3) + '千米' : d.toFixed(3) + '米';
                    me.data.isBeginEdit = false;
                    me.exitDraw(true);
                }
            } else if (me.data.drawType == 13){
                // arc
            }
        },
        _onRBDown: function(flags, x, y) {
            var me = this;
            var e = me._getLastDrawnShp();
            if (!e) {
                me.exitDraw(false);
                return true;
            }
            var world = me.data.world;
            var wpi = world.Window.pixelToWorld(x, y, 0);
            if (!wpi) {
                return true;
            }
            var p = wpi.Position;
            var x = p.X;
            var y = p.Y;
            var z = p.Altitude;
            if (me.data.drawType == 1) {
                // polyline
                var c = e.Geometry.Points.Count;
                if (c <= 2) {
                    me.exitDraw(false);
                    me.clearDraw();
                    return true;
                }
                e.Geometry.Points.DeletePoint(c - 1);
                e.Geometry.EndEdit();
                me.data.isBeginEdit = false;
            } else if (me.data.drawType == 2) {
                // polygon
                var c = e.Geometry.Rings(0).Points.Count;
                if (c <= 3) {
                    me.exitDraw(false);
                    me.clearDraw();
                    return true;
                }
                e.Geometry.Rings(0).Points.DeletePoint(c - 1);
                e.Geometry.EndEdit();
                me.data.isBeginEdit = false;
            } else if (me.data.drawType == 5) {
                // circle
                var cp = e.Position;
                var d = world.CoordServices.GetDistance(cp.X, cp.Y, p.X, p.Y);
                e.Radius = d;
                var e2 = me.data.drawnShape[1];
                var p = e2.Geometry.Points.Item(e2.Geometry.Points.Count - 1);
                p.X = x;
                p.Y = y;
                p.Z = z;
                e2.Geometry.EndEdit();
                var e3 = me.data.drawnShape[2];
                e3.Position.X = (cp.X + x) / 2;
                e3.Position.Y = (cp.Y + y) / 2;
                e3.Position.Altitude = (cp.Altitude + z) / 2;
                e3.Text = d >= 1000 ? (d / 1000).toFixed(3) + '千米' : d.toFixed(3) + '米';
                me.data.isBeginEdit = false;
            }
            me.exitDraw(true);
            return true;
        },
        _onFrame: function() {
            var me = this;
            var world = me.data.world;
            var e = me._getLastDrawnShp();
            if (!e) {
                return;
            }
            var mi = world.Window.GetMouseInfo();
            var wpi = world.Window.PixelToWorld(mi.X, mi.Y, -1);
            if (!wpi) {
                return;
            }
            var x = wpi.Position.X;
            var y = wpi.Position.Y;
            var z = wpi.Position.Altitude;
            if (me.data.drawType == 1) {
                // polyline
                var c = e.Geometry.Points.Count;
                var p = e.Geometry.Points.Item(c - 1);
                p.X = x;
                p.Y = y;
                p.Z = z;
            } else if (me.data.drawType == 2) {
                // polygon
                if (e.ObjectType == 1) {
                    // polyline, the second point
                    var c = e.Geometry.Points.Count;
                    var p = e.Geometry.Points.Item(c - 1);
                    p.X = x;
                    p.Y = y;
                    p.Z = z;
                } else {
                    var c = e.Geometry.Rings(0).Points.Count;
                    var p = e.Geometry.Rings(0).Points.Item(c - 1);
                    p.X = x;
                    p.Y = y;
                    p.Z = z;
                }
            } else if (me.data.drawType == 5) {
                // circle
                var cp = e.Position;
                var d = world.CoordServices.GetDistance(cp.X, cp.Y, x, y);
                e.Radius = d;
                var e2 = me.data.drawnShape[1];
                var p = e2.Geometry.Points.Item(e2.Geometry.Points.Count - 1);
                p.X = x;
                p.Y = y;
                p.Z = z;
                var e3 = me.data.drawnShape[2];
                e3.Position.X = (cp.X + x) / 2;
                e3.Position.Y = (cp.Y + y) / 2;
                e3.Position.Altitude = (cp.Altitude + z) / 2;
                e3.Text = d >= 1000 ? (d / 1000).toFixed(3) + '千米' : d.toFixed(3) + '米';
            }
        },

        _beginDraw: function(drawType, options, onDrawn) {
            this.data.drawType = drawType;
            this.data.drawOptions = options;
            this.data.cb.onDrawn = onDrawn;
            this.data.world.AttachEvent('OnLButtonClicked', this.data.cb.onLBClicked);
            this.data.world.AttachEvent('OnRButtonDown', this.data.cb.onRBDown);
            this.data.world.AttachEvent('OnFrame', this.data.cb.onFrame);
            _setCursor(this.data.world, 1);
            this.data.drawing = true;
            return this;
        },

        _getLastDrawnShp: function() {
            if (this.data.drawnShape.length > 0) {
                // return this.data.drawnShape[this.data.drawnShape.length - 1];
                return this.data.drawnShape[0];
            }
            return null;
        },

        destroy: function() {}
    };

    var TOManager = function(options){
        if (!(this instanceof TOManager)) {
            return new TOManager(options);
        }

        this.initialize(options);
    };
    TOManager.prototype = {
        initialize: function(options){
            var me = this;
            me.data = {};
            me.data.world = options.world;
            me.data.els = {};
        },
        addEl: function(key, el){
            var me = this;
            var els = me.data.els[key] || (me.data.els[key] = []);
            els.push({id: el.ID, el: el});
            return me;
        },
        removeEl: function(key, id){
            var me = this;
            var els = me.data.els[key] || (me.data.els[key] = []);
            for(var i = 0;i < els.length;i++){
                var ei = els[i];
                if(ei.id == id){
                    ei.el && me.data.world.Creator.DeleteObject(ei.el.ID);
                    els.splice(i, 1);
                }
            }
            return me;
        },
        removeAllByKey: function(key){
            var me = this;
            var els = me.data.els[key];
            if(els){
                while(els.length > 0){
                    var el = els.pop();
                    el && el.el && me.data.world.Creator.DeleteObject(el.el.ID);
                }
            }
            return me;
        },
        removeAll: function(){
            var me = this;
            for(var k in me.data.els){
                me.removeAllByKey(k);
            }
            return me;
        }
    };

    var PopupManager = function(options) {
        if (!(this instanceof PopupManager)) {
            return new PopupManager(options);
        }

        this.initialize(options);
    };
    PopupManager.prototype = {
        initialize: function(options) {
            var me = this;
            me.data = {};
            me.data.world = options.world;
            me.data.popups = [];
            me.data.world.AttachEvent('OnFileClosing', function(){
                me.clearPopups();
            });
        },
        createPopup: function(options) {
            var me = this;
            var world = me.data.world;
            var cap = valueOrDefault(options, 'title', '');
            var src = valueOrDefault(options, 'url', '');
            var x = valueOrDefault(options, 'x', DEFAULT_POPUP_X);
            var y = valueOrDefault(options, 'y', DEFAULT_POPUP_Y);
            var w = valueOrDefault(options, 'width', DEFAULT_POPUP_WIDTH);
            var h = valueOrDefault(options, 'height', DEFAULT_POPUP_HEIGHT);
            var ti = valueOrDefault(options, 'timeout', -1);
            var right = valueOrDefault(options, 'right', null);
            var bottom = valueOrDefault(options, 'bottom', null);
            if(right != null){
                x = world.Window.Rect.Width - w - right;            // $(world).parent('body').width() - w - right;
            }
            if(bottom != null){
                y = world.Window.Rect.Height - h - bottom;          // $(world).parent('body').height() - h - bottom;
            }
            var p = world.Creator.CreatePopupMessage(cap, src, x, y, w, h, ti);
            var a = valueOrDefault(options, 'align', null);
            if (a != null) {
                p.Align = a;
            }
            p.AllowDrag = valueOrDefault(options, 'draggable', true);
            p.AllowResize = valueOrDefault(options, 'resizable', false);
            p.AnchorToView = valueOrDefault(options, 'anchorToView', true);
            p.ShowCaption = valueOrDefault(options, 'showTitle', true);
            var text = valueOrDefault(options, 'text', null);
            if (text != null) {
                p.innerText = text;
            }
            var html = valueOrDefault(options, 'html', null);
            if (html != null) {
                p.innerHtml = html;
            }
            var f = valueOrDefault(options, 'flags', null);
            if(f != null){
                p.Flags = f;
            }
            me.data.popups.push({ popup: p });
            if (valueOrDefault(options, 'show', true)) {
                world.Window.ShowPopup(p);
            }
            return p;
        },
        removePopup: function(id) {
            var me = this;
            var world = me.data.world;
            for (var i = 0; i < me.data.popups.length; i++) {
                var oi = me.data.popups[i];
                if (oi && oi.popup && oi.popup.ID == id) {
                    world.Window.RemovePopup(oi.popup);
                    world.Creator.DeleteObject(id);
                    break;
                }
            }
            return me;
        },
        removePopupByTitle: function(title) {
            var me = this;
            var world = me.data.world;
            for (var i = 0; i < me.data.popups.length; i++) {
                var oi = me.data.popups[i];
                if (oi && oi.popup && oi.popup.Caption == title) {
                    world.Window.RemovePopup(oi.popup);
                    world.Creator.DeleteObject(id);
                    i--;
                }
            }
            return me;
        },
        clearPopups: function() {
            var me = this;
            var world = me.data.world;
            while (me.data.popups.length > 0) {
                var o = me.data.popups.pop();
                var p = o && o.popup;
                if (p) {
                    world.Window.RemovePopup(p);
                    world.Creator.DeleteObject(p.ID);
                }
            }
            return me;
        },
        showPopup: function(id) {
            var me = this;
            var world = me.data.world;
            for (var i = 0; i < me.data.popups.length; i++) {
                var oi = me.data.popups[i];
                if (oi && oi.popup && oi.popup.ID == id) {
                    world.Window.ShowPopup(oi.popup);
                    break;
                }
            }
            return me;
        },
        hidePopup: function(id) {
            var me = this;
            var world = me.data.world;
            for (var i = 0; i < me.data.popups.length; i++) {
                var oi = me.data.popups[i];
                if (oi && oi.popup && oi.popup.ID == id) {
                    world.Window.RemovePopup(oi.popup);
                    break;
                }
            }
            return me;
        },
        hideAllPopups: function() {
            var me = this;
            var world = me.data.world;
            for (var i = 0; i < me.data.popups.length; i++) {
                var oi = me.data.popups[i];
                if (oi && oi.popup) {
                    world.Window.RemovePopup(oi.popup);
                }
            }
            return me;
        },
        destroy: function() {
            this.clearPopups();
        }
    };

    // 7.0.1版本的waypoints起止顺序反了，这里先用6.6版本
    var DynamicObjectManager = function(options){
        if(!this instanceof DynamicObjectManager){
            return new DynamicObjectManager(options);
        }
        this.initialize(options);
    };
    DynamicObjectManager.prototype = {
        initialize: function(options){
            var me = this;
            me.data = {};
            me.data.world = options.world;
            me.data.dos = [];
        },
        clearAll: function(){
            var world = this.data.world;
            while(this.data.dos.length > 0){
                var o = this.data.dos.pop();
                o && o.dobj && world.Creator.DeleteObject(o.dobj.ID);
            }
            return this;
        },
        removeDynamicObject: function(id){
            var me = this;
            if(!id){
                return me;
            }
            var dos = me.data.dos;
            for(var i = 0;i < dos.length;i++){
                if(dos[i].id == id){
                    me.data.world.Creator.DeleteObject(dos[i].dobj.ID);
                    dos.splice(i, 1);
                }
            }
            return me;
        },
        createDynamicObject: function(options){
            if(!options){
                return null;
            }
            var me = this;
            var world = me.data.world;
            var ms = valueOrDefault(options, 'motionStyle', 1);
            var dt = valueOrDefault(options, 'dynamicType', 3);
            var n = valueOrDefault(options, 'label', '');
            var u = valueOrDefault(options, 'url', '');
            var s = valueOrDefault(options, 'scale', 1);
            var at = valueOrDefault(options, 'altitudeType', 0);
            var g = valueOrDefault(options, 'groupId', world.ProjectTree.NotInTreeID);
            var desc = valueOrDefault(options, 'desc', '');
            var not = dt == 1 ? n : u;
            var dobj = world.Creator.CreateDynamicObject(0, ms, dt, not, s, at, g, desc);
            dobj.CircularRoute = valueOrDefault(options, 'circularRoute', 0);
            dobj.Action.Code = valueOrDefault(options, 'action', 10);
            dobj.TurnSpeed = valueOrDefault(options, 'turnSpeed', 100);
            options.fontSize != null && (dobj.FontSize = options.fontSize);
            options.fontName != null && (dobj.FontName = options.fontName);
            options.fontStyle != null && (dobj.FontStyle = options.fontStyle);
            options.textColor != null && (dobj.TextColor.FromARGBColor(options.textColor));
            options.bgColor != null && (dobj.BackgroundColor.FromARGBColor(options.bgColor));
            var o = {
                id: dobj.ID,
                dobj: dobj
            };
            var ps = valueOrDefault(options, 'points', null);
            if(ps){
                var pa = [];
                for(var i = 0;i < ps.length;i++){
                    var pi = ps[i];
                    var wp = me.createWayPoint(pi);
                    if(wp != null){
                        pa.push(wp);
                        // dobj.Waypoints.AddWaypoint(wp);
                    }
                }
                dobj.Waypoints.FromArray(pa);
            }
            me.data.dos.push(o);
            return o;
        },
        createWayPoint: function(options){
            if(!options || options.x == null || options.y == null){
                return null;
            }
            var me = this;
            var world = me.data.world;
            var x = Number(options.x);
            var y = Number(options.y);
            if(isNaN(x) || isNaN(y)){
                return null;
            }
            var alt = valueOrDefault(options, 'alt', 3.5);
            var s = valueOrDefault(options, 'speed', 300);
            var yaw = valueOrDefault(options, 'yaw', 0);
            var pitch = valueOrDefault(options, 'pitch', 0);
            var roll = valueOrDefault(options, 'roll', 0);
            var cdy = valueOrDefault(options, 'cameraDeltaYaw', 0);
            var cdp = valueOrDefault(options, 'cameraDeltaPitch', 0);
            var mid = valueOrDefault(options, 'msgId', '');
            var wp = world.Creator.CreateRouteWaypoint(x, y, alt, s, yaw, pitch, roll, cdy, cdp, mid);
            // var wp = world.Creator.CreateRouteWaypoint(x, y, alt, s, yaw, pitch, roll, mid);
            return wp;
        },
        addWaypoint: function(id, options){
            var o = this.getDynamicObject(id);
            if(!o) return this;
            var wp = this.createWayPoint(options);
            if(!wp) return this;
            o.dobj.Waypoints.AddWaypoint(wp);
        },
        insertWaypoint: function(id, ind, options){
            var o = this.getDynamicObject(id);
            if(!o) return this;
            var wp = this.createWayPoint(options);
            if(!wp) return this;
            o.dobj.Waypoints.InsertWaypoint(ind, wp);
            return this;
        },
        deleteWaypoint: function(id, ind){
            var o = this.getDynamicObject(id);
            if(!o) return this;
            o.dobj.Waypoints.DeleteWaypoint(ind);
            return this;
        },
        modifyWaypoint: function(id, ind, options){
            var o = this.getDynamicObject(id);
            if(!o) return this;
            var wp = this.createWayPoint(options);
            if(!wp) return this;
            o.dobj.Waypoints.ModifyWaypoint(ind, wp);
            return this;
        },
        getDynamicObject: function(id){
            var me = this;
            if(!id){
                return null;
            }
            var dos = me.data.dos;
            for(var i = 0;i < dos.length;i++){
                if(dos[i].id == id){
                    return dos[i];
                }
            }
            return null;
        },
        play: function(id, ind){
            var o = this.getDynamicObject(id);
            if(!o){
                return this;
            }
            ind == null && (ind = o.dobj.Waypoints.Current);
            o.dobj.RestartRoute(ind);
            return this;
        },
        pause: function(id, isPause){
            var o = this.getDynamicObject(id);
            if(!o) return this;
            o.dobj.Pause = isPause;
            return this;
        },
        updateSpeed: function(id, speed){
            var o = this.getDynamicObject(id);
            if(!o) return this;
            var wps = o.dobj && o.dobj.Waypoints;
            if(wps){
                for(var i = 0;i < wps.Count;i++){
                    wps.Item(i).Speed = speed;
                }
            }
            return this;
        },
        updateDistance: function(id, distance){
            var o = this.getDynamicObject(id);
            if(!o) return this;
            o.dobj && (o.dobj.Position.Distance = distance);
            return this;
        },
        getState: function(id){
            var o = this.getDynamicObject(id);
            if(!o) return -1;
            return o.dobj.Pause ? 0 : 1;
        },
        flyTo: function(id, pattern){
            var o = this.getDynamicObject(id);
            if(!o) return null;
            var p = pattern == undefined ? 10 : pattern
            this.data.world.Navigate.FlyTo(o.dobj.ID, p);
            return this;
        }
    };

    var ExcavationHelper = function(options) {
        if (!(this instanceof ExcavationHelper)) {
            return new ExcavationHelper(options);
        }

        this.initialize(options);
    };
    ExcavationHelper.prototype = {
        initialize: function(options) {
            var me = this;
            me.data = {};
            me.data.world = options.world;
            me.data.tms = [];
        },
        createTerrainModifier: function(geometry, bottomAlt, options) {
            var me = this;
            if (!geometry) {
                return null;
            }
            var m = valueOrDefault(options, 'mode', 0);
            var flat = valueOrDefault(options, 'flat', true);
            var feather = valueOrDefault(options, 'feather', 0);
            var gpid = valueOrDefault(options, 'groupId', me.data.world.ProjectTree.NotInTreeID);
            var desc = valueOrDefault(options, 'desc', '');
            var tm = me.data.world.Creator.CreateTerrainModifier(geometry, m, flat, feather, gpid, desc);
            tm.Position.Altitude = bottomAlt;
            me.data.tms.push({ tm: tm });
            return tm;
        },
        deleteTerrainModifier: function(id) {
            var me = this;
            for (var i = 0; i < me.data.tms.length; i++) {
                var tmi = me.data.tms[i];
                if (tmi && tmi.tm && tmi.tm.ID == id) {
                    me.data.world.Creator.DeleteObject(id);
                    i--;
                }
            }
            return me;
        },
        clearTerrainModifier: function() {
            var me = this;
            while (me.data.tms.length > 0) {
                var o = me.data.tms.pop();
                o && o.tm && me.data.world.Creator.DeleteObject(o.tm.ID);
            }
            return me;
        },
        calcVolume: function(id, options) {
            var o = this.data.world.Creator.GetObject(id);
            if (o) {
                var si = valueOrDefault(options, 'sampleInterval', 0.5);
                var r = this.data.world.Analysis.CalculateVolume([id], si);
                if (r) {
                    return { added: r.AddedCubicMeters, removed: r.RemovedCubicMeters };
                }
            }
            return null;
        },
        calcTotalVolume: function(options) {
            var si = valueOrDefault(options, 'sampleInterval', 0.5);
            var a = [];
            for (var i = 0; i < this.data.tms.length; i++) {
                var tmi = this.data.tms[i];
                tmi && tmi.tm && a.push(tmi.tm.ID);
            }
            var r = this.data.world.Analysis.CalculateVolume(a, si);
            if (r) {
                return { added: r.AddedCubicMeters, removed: r.RemovedCubicMeters };
            }
            return null;
        },
        destroy: function() {
            this.clearTerrainModifier();
        }
    };


    if (!ctx.SFM) {
        ctx.SFM = {};
    }
    ctx.SFM.teHelper = {
        TYPE_LINE: TYPE_LINE,
        TYPE_POINT: TYPE_POINT,
        TYPE_POLYGON: TYPE_POLYGON,

        pickType: {
            WPT_3DML: 8192,
            PT_MODEL: 8193
        },

        objectType: {
            OT_FEATURE: 33,
            OT_FEATURE_LAYER: 36,
            OT_3D_MESH_LAYER: 38,
            OT_3DML_FEATURE_LAYER: 39
        },

        setConfig: setConfig,

        createSGObj: createSGObj,
        getDataPath: getDataPath,

        setLayerStreaming: setLayerStreaming,
        setLayersStreaming: setLayersStreaming,
        setAllPipelineLayerStreaming: setAllPipelineLayerStreaming,

        findCsName: findCsName,
        setCurrentCsName: setCurrentCsName,
        getCurrentCsName: getCurrentCsName,

        getCsWgs84: getCsWgs84,
        getWorldSrcCs: getWorldSrcCs,
        srcCsIsWgs84: srcCsIsWgs84,
        curIsWgs84: curIsWgs84,
        curIsSameToSrc: curIsSameToSrc,
        toSrcCs: toSrcCs,

        reproject: reproject,
        xy2blh: xy2blh,
        blh2xy: blh2xy,
        xyWkt2blhWkt: xyWkt2blhWkt,
        blhWkt2xyWkt: blhWkt2xyWkt,

        positions2vertices: positions2vertices,
        array2position: array2position,
        polygon2xypoints: polygon2xypoints,
        polygon2xystr: polygon2xystr,

        getPosition: getPosition,
        getCameraPose: getCameraPose,
        flyToPosition: flyToPosition,
        jumpToPosition: jumpToPosition,
        flyTo: flyTo,
        jumpTo: jumpTo,
        showMessage: showMessage,

        getModelQueryKey: getModelQueryKey,

        pixelFromWorld: pixelFromWorld,
        beginPickObject: beginPickObject,
        endPickObject: endPickObject,

        findPipeLayerFolder: findPipeLayerFolder,
        getPipeLayerPath: getPipeLayerPath,
        getPipeLayerFolder: getPipeLayerFolder,
        getPipeLayerByKey: getPipeLayerByKey,
        getPipeLayerByName: getPipeLayerByName,
        getFeatureLayer: getFeatureLayer,
        createGeometry: createGeometry,
        getBufferGeometry: getBufferGeometry,
        exeSpatialQuery: exeSpatialQuery,
        getFilterSql: getFilterSql,
        queryFeatureLayer: queryFeatureLayer,
        findFeatures: findFeatures,
        findFeaturesWithKey: findFeaturesWithKey,
        getPipeFeature: getPipeFeature,
        getPipeFeaturesFromLayer: getPipeFeaturesFromLayer,
        getPipeFeaturesFromLayerByKeys: getPipeFeaturesFromLayerByKeys,
        getPipeFeaturesFromLayerByFilters: getPipeFeaturesFromLayerByFilters,
        getPipeFeaturesFromLayerByFilters2: getPipeFeaturesFromLayerByFilters2,
        searchFeaturesByLayerKey: searchFeaturesByLayerKey,
        searchFeaturesFromLayer: searchFeaturesFromLayer,
        searchFeatureByKeyFromLayer: searchFeatureByKeyFromLayer,
        searchFeatureFromLayer: searchFeatureFromLayer,

        getHeight: getHeight,
        getAltitude: getAltitude,
        calcVolumeFromTerrain: calcVolumeFromTerrain,

        linkWorld: linkWorld,
        unlinkWorld: unlinkWorld,

        LayerManager: LayerManager,
        HighlightManager: HighlightManager,
        ShapeTool: ShapeTool,
        TOManager: TOManager,
        PopupManager: PopupManager,
        DynamicObjectManager: DynamicObjectManager,
        ExcavationHelper: ExcavationHelper
    };
})(window, jQuery, window.opt);
