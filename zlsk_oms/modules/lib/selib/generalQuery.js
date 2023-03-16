var GeneralQuery = {};
var twoObj = null;
var currentRoomCenter;
(function() {
    var CUSTOM_ATTR_FILE_NAME = 'cattr';

    var poiLayers = null;
    var onPickObjectEx = function(pObj) {
        if (queryPropertyObj && queryPropertyObj.length) {
            for (var k = 0; k < queryPropertyObj.length; k++) {
                queryPropertyObj[k].StopHighLight();
            }
        }
        if (pObj == null) {
            alert("对象不存在");
            return;
        }
        queryCurrentObj = pObj;
        poiLayers = POILAYERS;
        var ispoi = false;
        var poiLayerId = '';
        for (var i = 0; i < poiLayers.length; i++) {
            if (pObj.ParentGuid == poiLayers[i].name) {
                ispoi = true;
                poiLayerId = poiLayers[i].id;
                break;
            }
        }
        if (!ispoi) {
            pObj.Underground = true;
            pObj.ShowHighLight();
            parentLayerName = pObj.GetParentLayerName();
            if (parentLayerName == "" || parentLayerName == null) {
                alert("获得父层名称失败！");
                return false;
            }

            key = pObj.GetKey();
            showpropertyQuery(earth, parentLayerName, key, pObj);
        } else {
            showpropertyQuery(earth, poiLayerId, 'poi', pObj);
        }

        // earth.Event.OnPickObjectEx = function() {};
        // earth.Event.OnLBDown = function() {};
        // earth.Event.OnLBUp = function() {};
        earth.Query.FinishPick();
        earth.Environment.SetCursorStyle(209);
        _onrbd();
    };
    var onPickObject = function(pObj) {
        var llr = pObj.GetLonLatRect();
        var showObj = {
            'displayFields': ['East', 'MaxHeight', 'MinHeight', 'North', "South", "West"],
            'East': llr.East,
            'MaxHeight': llr.MaxHeight,
            'MinHeight': llr.MinHeight,
            'North': llr.North,
            'South': llr.South,
            'West': llr.West
        };
        // earth.Event.OnPickObject = function() {};
        // earth.Event.OnLBDown = function() {};
        // earth.Event.OnLBUp = function() {};
        earth.Environment.SetCursorStyle(209);
        _onrbd();
        initObjNormal(pObj.GetLonLatRect(), showObj);
    }
    var beginPick = false;
    var _onrbd = function(){
        earthCtx.sfmEventMgr.off('PickObject', onPickObject);
        earthCtx.sfmEventMgr.off('PickObjectEx', onPickObjectEx);
        earthCtx.sfmEventMgr.off('LBDown', _onlbd);
        earthCtx.sfmEventMgr.off('RBDown', _onlbd);
        beginPick = false;
        earth.Environment.SetCursorStyle(209);
    };
    var _onlbd = function(p2){
        if(beginPick){
            earth.Query.PickObject(511, p2.x, p2.y);
        }
    };
    /**
     * 属性查询
     */
    var stopPropertyQuery = earthCtx.stopPropertyQuery = function() {
        // earth.Event.OnLBDown = function() {};
        // earth.Event.OnRBDown = function() {};
        _onrbd();
        earth.Environment.SetCursorStyle(209);
    };
    var propertyQuery = earthCtx.propertyQuery = function(divObj) {

        twoObj = divObj;
        // earth.Event.OnPickObjectEx = onPickObjectEx; //获取的为一般的数据
        // earth.Event.OnPickObject = onPickObject; //用户数据（element）返回
        // //将鼠标设置为箭头状

        // earth.Event.OnLBDown = function(p2) {
        //     function _onlbd(p2) {
        //         earth.Event.OnLBUp = function(p2) {
        //             earth.Event.OnLBDown = function(p2) {
        //                 _onlbd(p2);
        //             };
        //         };
        //         //var p3 = earth.GlobeObserver.Pick(p2.X, p2.Y);
        //         earth.Query.PickObject(511, p2.x, p2.y);
        //         //earth.Environment.SetCursorStyle(209);

        //     }
        //     _onlbd(p2);
        // };
        // earth.Event.OnRBDown = function(p2) {
        //     earth.Event.OnLBDown = function() {};
        //     earth.Event.OnRBDown = function() {};
        //     earth.Environment.SetCursorStyle(209);
        // };
        beginPick = true;
        earthCtx.sfmEventMgr.off('PickObject', onPickObject);
        earthCtx.sfmEventMgr.on('PickObject', onPickObject);
        earthCtx.sfmEventMgr.off('PickObjectEx', onPickObjectEx);
        earthCtx.sfmEventMgr.on('PickObjectEx', onPickObjectEx);
        earthCtx.sfmEventMgr.off('LBDown', _onlbd);
        earthCtx.sfmEventMgr.on('LBDown', _onlbd);
        earthCtx.sfmEventMgr.on('RBDown', _onrbd);
        earth.Environment.SetCursorStyle(32512);
        // earth.Query.PickObjectEx(24);  // SEPickObjectType.PickAllObject
    };
    var queryHtmlBalloonHidden = false;
    var queryHtmlBalloon = null;
    //显示一般的数据气泡
    function initObjNormal(rect, showObj, type) {
        if (queryHtmlBalloonHidden == false && queryHtmlBalloon) {
            queryHtmlBalloon.DestroyObject();
            queryHtmlBalloon = null;
        }
        var displayFields = showObj.displayFields;
        //var rect = pObj.GetLonLatRect();
        if (type == 'point') {
            var centerX = rect.Longitude;
            var centerY = rect.Latitude;
            var centerZ = rect.Altitude;
        } else {
            var north = rect.North;
            var south = rect.South;
            var east = rect.East;
            var west = rect.West;
            var top = rect.MaxHeight;
            var bottom = rect.MinHeight;
            var centerX = (east + west) / 2;
            var centerY = (north + south) / 2;
            var centerZ = (top + bottom) / 2;
        }

        var ba = 0xcc;
        if(SYSTEMPARAMS.balloonAlpha && !isNaN(SYSTEMPARAMS.balloonAlpha)){
            ba = parseInt(SYSTEMPARAMS.balloonAlpha);
        }
        var showLineHtml = '';
        var guid = earth.Factory.CreateGuid();
        queryHtmlBalloon = earth.Factory.CreateHtmlBalloon(guid, "balloon");
         if(ba < 0){
            showLineHtml = '<div style="overflow:auto;width:245px;height:245px;text-align:center;">' +
                '<table border="0" cellpadding="3" cellspacing="1" align="center" width="100%"' +
                ' style="font-size:16px;background-color:#b9d8f3;">';
            for(var i=0; i<displayFields.length; i++){
                showLineHtml += '<tr style="background-color:#f4faff;">';
                showLineHtml += '<td  class="font" >'+ displayFields[i] +':</td>';
                showLineHtml += '<td class="font" >' + showObj[displayFields[i]] + '</td>';
                showLineHtml += '</tr>';
            }
            showLineHtml += '</table></div>';

            queryHtmlBalloon.SetRectSize(330, 340);
            queryHtmlBalloon.SetIsTransparence(false);
        }else{
            showLineHtml = '<div style="word-break:keep-all;white-space:nowrap;overflow:auto;width:300px;height:300px;margin-top:25px;margin-bottom:25px;overflow:auto;">'
                + '<table style="font-size:16px;background-color: #ffffff; color: #fffffe">';
            for(var i=0; i<displayFields.length; i++){
                showLineHtml = showLineHtml + '<tr>';
                showLineHtml = showLineHtml + '<td  class="font" >'+ displayFields[i] +':</td>';
                showLineHtml = showLineHtml + '<td class="font" >' + showObj[displayFields[i]] + '</td>';
                showLineHtml = showLineHtml + '</tr>';
            }
            showLineHtml = showLineHtml + '</table></div>';

            queryHtmlBalloon.SetRectSize(330, 340);
            queryHtmlBalloon.SetIsTransparence(true);
            queryHtmlBalloon.SetBackgroundAlpha(ba);
        }
        queryHtmlBalloon.SetSphericalLocation(centerX, centerY, centerZ);
        queryHtmlBalloon.SetRectSize(330, 340);
        var color = parseInt("0xffffff00"); //0xccc0c0c0
        queryHtmlBalloon.SetTailColor(color);
        queryHtmlBalloon.SetIsAddCloseButton(true);
        queryHtmlBalloon.SetIsAddMargin(true);
        queryHtmlBalloon.SetIsAddBackgroundImage(true);
        /*queryHtmlBalloon.SetIsTransparence(true);
        queryHtmlBalloon.SetBackgroundAlpha(0xcc);*/
        queryHtmlBalloon.ShowHtml(showLineHtml);

        //deleted by zhangd-2015-03-12-13:53--所有气泡关闭事件均修改为下面的回调方式
        // earth.Event.OnHtmlBalloonFinished = function() {
        //     if (queryHtmlBalloonHidden == false && queryHtmlBalloon != null) {
        //         queryHtmlBalloon.DestroyObject();
        //         queryHtmlBalloon = null;
        //         earth.Event.OnHtmlBalloonFinished = function() {};
        //     }
        // }
        OnHtmlBalloonFinishedFunc(guid, function(closeBid) {
            if (queryHtmlBalloonHidden == false && queryHtmlBalloon != null) {
                queryHtmlBalloon.DestroyObject();
                queryHtmlBalloon = null;
                // earth.Event.OnHtmlBalloonFinished = function() {};
            }
        });
    }

    function initModelValue(key, layer, pObj) {
        if (pObj != null) {
            if (queryHtmlBalloon) {
                queryHtmlBalloon.DestroyObject();
                queryHtmlBalloonHidden = false;
                queryHtmlBalloon = null;
            }
            //earth.HtmlBalloon.Hide();
            var rect = pObj.GetLonLatRect();
            var north = rect.North;
            var south = rect.South;
            var east = rect.East;
            var west = rect.West;
            var top = rect.MaxHeight;
            var bottom = rect.MinHeight;

            var attrXml = layer.SearchResultFromLocal.GotoPage(0);
            var attrData = $.xml2json(attrXml);
            if (attrData.SearchResult != null && attrData.SearchResult.total > 0 && attrData.SearchResult.ModelResult != null) {
                attrData = attrData.SearchResult.ModelResult.ModelData;
            } else {
                attrData = null;
            }

            /*var h = getCustomAttrHtml(key);
            var htmlStr = '<div style="word-break:keep-all;white-space:nowrap;overflow:auto;width:300px;height:300px;margin-top:25px;margin-bottom:25px;overflow:auto;">' + '<table style="font-size:16px;background-color: #ffffff; color: #fffffe">';*/
             var ba = 0xcc;
            if(SYSTEMPARAMS.balloonAlpha && !isNaN(SYSTEMPARAMS.balloonAlpha)){
                ba = parseInt(SYSTEMPARAMS.balloonAlpha);
            }

            var htmlStr = '<div style="word-break:keep-all;white-space:nowrap;overflow:auto;width:300px;height:300px;margin-top:25px;margin-bottom:25px;overflow:auto;">' +
                '<table style="font-size:16px;background-color: #ffffff; color: #fffffe">';
            var h2 = '';
            if(ba < 0){
                h2 = ' style="background-color:#f4faff;"';
                htmlStr = '<div style="overflow:auto;width:245px;height:245px;text-align:center;">' +
                    '<table border="0" cellpadding="3" cellspacing="1" align="center" width="100%"' +
                    ' style="font-size:16px;background-color:#b9d8f3;">';
            }
            var h = getCustomAttrHtml(key, h2,attrData['ParentLayer']);
            if (h) {
                htmlStr += h;
                htmlStr += '</table></div>';
            } else if (attrData == null) {
                htmlStr = htmlStr + '<tr' + h2 + '>';
                htmlStr = htmlStr + '<td  class="font" >图层:</td>';
                htmlStr = htmlStr + '<td class="font" >' + layer.Name + '</td>';
                htmlStr = htmlStr + '</tr>';
                 htmlStr = htmlStr + '<tr' + h2 + '>';
                htmlStr = htmlStr + '<td class="font" >名称:</td>';
                htmlStr = htmlStr + '<td class="font" >' + key + '</td>';
                htmlStr = htmlStr + '</tr >';
                // htmlStr += h;
                htmlStr = htmlStr + '</table></div>';
            } else {
                for (var i in attrData) {
                     htmlStr = htmlStr + '<tr' + h2 + '>';
                    htmlStr = htmlStr + '<td class="font" >' + i + '</td>';
                    htmlStr = htmlStr + '<td class="font" >  ' + attrData[i] + '</td>';
                    htmlStr = htmlStr + '</tr>';
                }
                // htmlStr += h;
                htmlStr = htmlStr + '</table></div>';
            }

            var centerX = (east + west) / 2;
            var centerY = (north + south) / 2;
            var centerZ = (top + bottom) / 2;

            var guid = earth.Factory.CreateGuid();
            queryHtmlBalloon = earth.Factory.CreateHtmlBalloon(guid, "balloon");
            queryHtmlBalloon.SetSphericalLocation(centerX, centerY, centerZ);
            queryHtmlBalloon.SetRectSize(330, 340);
            var color = parseInt("0xffffff00"); //0xccc0c0c0
            queryHtmlBalloon.SetTailColor(color);
            queryHtmlBalloon.SetIsAddCloseButton(true);
            queryHtmlBalloon.SetIsAddMargin(true);
            queryHtmlBalloon.SetIsAddBackgroundImage(true);
            /*queryHtmlBalloon.SetIsTransparence(true);
            queryHtmlBalloon.SetBackgroundAlpha(0xcc);*/
            if(ba < 0){
                queryHtmlBalloon.SetIsTransparence(false);
            }else{
                queryHtmlBalloon.SetIsTransparence(true);
                queryHtmlBalloon.SetBackgroundAlpha(ba);
            }
            queryHtmlBalloon.ShowHtml(htmlStr);

            //deleted by zhangd-2015-03-12-13:53--所有气泡关闭事件均修改为下面的回调方式
            // earth.Event.OnHtmlBalloonFinished = function() {
            //     if (queryHtmlBalloonHidden == false && queryHtmlBalloon != null) {
            //         queryHtmlBalloon.DestroyObject();
            //         queryHtmlBalloon = null;
            //         earth.Event.OnHtmlBalloonFinished = function() {};
            //     }
            // }
            OnHtmlBalloonFinishedFunc(guid, function(closeBid) {
                if (queryHtmlBalloonHidden == false && queryHtmlBalloon != null) {
                    queryHtmlBalloon.DestroyObject();
                    queryHtmlBalloon = null;
                    // earth.Event.OnHtmlBalloonFinished = function() {};
                }
            })
        }
    }

    function initObjValue(key, layer, pObj) {
        if (pObj != null) {
            if (queryHtmlBalloon) {
                queryHtmlBalloon.DestroyObject();
                queryHtmlBalloonHidden = false;
                queryHtmlBalloon = null;
            }
            //earth.HtmlBalloon.Hide();
            var rect = pObj.GetLonLatRect();
            var north = rect.North;
            var south = rect.South;
            var east = rect.East;
            var west = rect.West;
            var top = rect.MaxHeight;
            var bottom = rect.MinHeight;
            var htmlStr = '<div style="word-break:keep-all;white-space:nowrap;overflow:auto;width:300px;height:300px;margin-top:25px;margin-bottom:25px;overflow:auto;">' + '<table style="font-size:16px;background-color: #ffffff; color: #fffffe">';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td  class="font" >图层:</td>';
            htmlStr = htmlStr + '<td class="font" >' + layer.Name + '</td>';
            htmlStr = htmlStr + '</tr>';
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td class="font" >名称:</td>';
            htmlStr = htmlStr + '<td class="font" >' + key + '</td>';
            htmlStr = htmlStr + '</tr >';
            htmlStr = htmlStr + '</table></div>';
            var centerX = (east + west) / 2;
            var centerY = (north + south) / 2;
            var centerZ = (top + bottom) / 2;

            var guid = earth.Factory.CreateGuid();
            queryHtmlBalloon = earth.Factory.CreateHtmlBalloon(guid, "balloon");
            queryHtmlBalloon.SetSphericalLocation(centerX, centerY, centerZ);
            queryHtmlBalloon.SetRectSize(330, 340);
            var color = parseInt("0xffffff00"); //0xccc0c0c0
            queryHtmlBalloon.SetTailColor(color);
            queryHtmlBalloon.SetIsAddCloseButton(true);
            queryHtmlBalloon.SetIsAddMargin(true);
            queryHtmlBalloon.SetIsAddBackgroundImage(true);
            queryHtmlBalloon.SetIsTransparence(true);
            queryHtmlBalloon.SetBackgroundAlpha(0xcc);
            queryHtmlBalloon.ShowHtml(htmlStr);

            //deleted by zhangd-2015-03-12-13:53--所有气泡关闭事件均修改为下面的回调方式
            // earth.Event.OnHtmlBalloonFinished = function() {
            //     if (queryHtmlBalloonHidden == false && queryHtmlBalloon != null) {
            //         queryHtmlBalloon.DestroyObject();
            //         queryHtmlBalloon = null;
            //         earth.Event.OnHtmlBalloonFinished = function() {};
            //     }
            // }
            OnHtmlBalloonFinishedFunc(guid, function(closeBid) {
                if (queryHtmlBalloonHidden == false && queryHtmlBalloon != null) {
                    queryHtmlBalloon.DestroyObject();
                    queryHtmlBalloon = null;
                    // earth.Event.OnHtmlBalloonFinished = function() {};
                }
            });
        }
    };

    var getCustomInfo = function() {
        var fn = CUSTOM_ATTR_FILE_NAME + '.xls';
        var u = getRootUrl();
        u += '/files/' + fn;
        earth.UserDocument.SaveFile(u, fn);
        var fp = earth.Environment.RootPath + 'temp\\' + fn;
        var xlsOper = new CpExcelOper();
        var d = xlsOper.readExcelData({
            fileName: fp
        });
        return d;
    };
    var getCustomInfo2 = function(parentLayerName) {
        var cfg = earthMgr.getConfig();
        var fn = cfg.caLayerNames && $.inArray(parentLayerName, cfg.caLayerNames) >= 0 ? parentLayerName : CUSTOM_ATTR_FILE_NAME;
        // if(parentLayerName.indexOf('教学区小品') > -1){
        //     CUSTOM_ATTR_FILE_NAME = 'jiaoxuequxiaopin';
        // }else if(parentLayerName.indexOf('生活区小品') > -1){
        //     CUSTOM_ATTR_FILE_NAME = 'shenghuoquxp';
        // }else{
        //     CUSTOM_ATTR_FILE_NAME = 'cattr';
        // }
        // var fn = CUSTOM_ATTR_FILE_NAME + '.csv';
        var u =earthMgr.getSfmUtil().getHostUrl();
        u += '/data/buildProperty/' + fn + '.csv';
        var d = null;
        $.ajax({
            type: 'GET',
            url: u,
            async: false,
            cache: false
        }).then(function(data) {
            if (data) {
                try {
                    d = [];
                    var a = data.replace(/(\r\n)/ig, '\n');
                    a = a.split('\n');
                    var cs = null;
                    var rs = [];
                    if (a.length > 0) {
                        cs = a[0].replace('"', '').split(',');
                    }
                    for (var i = 1; i < a.length; i++) {
                        var aa = a[i].replace('"', '').split(',');
                        rs.push(aa);
                    }
                    d = {
                        say: '',
                        getMe: {
                            columns: cs,
                            rows: rs
                        }
                    };
                } catch (e) {
                    d = { say: '数据格式有误', getMe: null };
                }
            }
        }, function(err) {});
        return d;
    };
    var getCustomAttrHtml = function(key,rowStyle,parentLayerName) {
        var d = getCustomInfo2(parentLayerName);
        if (d && !d.say && (d = d.getMe)) {
            var cs = d.columns;
            var rs = d.rows;
            for (var i = 0; i < rs.length; i++) {
                var ri = rs[i];
                if (ri[0] == key) {
                    var h = '';
                    for (var j = 0; j < cs.length; j++) {
                        h += '<tr' + rowStyle + '>';
                        h += '<td class="font">' + cs[j] + ':</td>';
                        h += '<td class="font">' + ri[j] + '</td>';
                        h += '</tr>';
                    }
                    return h;
                }
            }
        }
        return '';
    };

    function showpropertyQuery(earth, parentLayerName, key, pObj) {
        function parseLocation() {
            var results = {};
            results[key] = parentLayerName;
            return results;
        };
        $("#dlgResult").dialog({}).dialog("close");
        if (parentLayerName.indexOf('=') > -1) {
            var params = parseLocation();
            //根据图层名称字符串判断是模型图层还是管线数据图层
            var cArr = parentLayerName.split("=");
            var cArr = cArr[1].split("_");
            var layer = earth.LayerManager.GetLayerByGUID(cArr[0]);
            var keyFieldInRealData = "US_KEY";
        }
        if (parentLayerName == 'userLayer') {
            var showObj = {
                guid: pObj.Guid,
                displayFields: ['guid']
            };
            var rect = pObj.GetLonLatRect();
            initObjNormal(pObj.GetLonLatRect(), showObj);
        }
        if (key == 'poi') {
            var poiLayer = earth.LayerManager.GetLayerByGUID(parentLayerName);
            var result = poiLayer.SearchResultFromLocal.GotoPage(0);
            result = $.xml2json(result);
            if (result.SearchResult.total != 1) {
                return;
            }
            var showObj = {
                displayFields: []
            };
            var resultData = result.SearchResult.POIResult.POIData;
            for (var i in resultData) {
                showObj.displayFields.push(i);
                showObj[i] = resultData[i];
            }
            initObjNormal(pObj, showObj, 'point');
        }
        //小品图层或者楼块图层
        else if (layer.LayerType.toLowerCase() == 'billboard' || layer.LayerType.toLowerCase() == 'block') {

            // var result = layer.SearchResultFromLocal.GotoPage(0);
            // var result = $.xml2json(result);
            // if (result != null && result.SearchResult != null && result.SearchResult.ModelResult != null && result.SearchResult.ModelResult.ModelData != null) {
            //     var data = result.SearchResult.ModelResult.ModelData;
            //     var showObj = {
            //         'displayFields': ['图层名', '名称', 'SE_ID', 'LonLatBox'],
            //         '图层名': layer.Name,
            //         '名称': data.SE_NAME,
            //         'SE_ID': data.SE_ID,
            //         'LonLatBox': data.LonLatBox
            //     };
            //     initObjNormal(pObj.GetLonLatRect(), showObj);
            // }
            if (queryHtmlBalloon) {
                queryHtmlBalloon.DestroyObject();
                queryHtmlBalloonHidden = false;
                queryHtmlBalloon = null;
            }
            var ln = layer.Name;
            var pObjs = [];
            var pObjGUID = pObj.Guid;

            var coor = pObj.GetLonLatRect().Center;
            var datum = earthCtx.SYSTEMPARAMS.pipeDatum;
            var point = SFM.queryHelper.blh2xy(datum,coor);
            var pointStr = point.x.toFixed(3) + '(X) ' + point.y.toFixed(3) + '(Y) ';


            pObjs.push(pObj);
            queryPropertyObj = pObjs;
            currentRoomCenter = pObj.GetLonLatRect().Center;
            var parentLayerName = pObj.GetParentLayerName();
            var layer = earth.LayerManager.GetLayerByGUID(parentLayerName.split("_")[0]); //parentLayerName.split("_")[1]
            // var url = SFM.sfmUtil.getMainWin().location.href;
            var u = "/modules/widget/common/query/EarthPropertyQuery/blockproperty.html?guid=" +
                pObjGUID + "&parentLayerName=" + parentLayerName + "&key=" + key + "&objs=" + pObjs + "&coor=" + pointStr;
            SFM.sfmUtil.getMainWin().SFM.sfmModuleMgr.loadModule({
                mk: 'propertityQueryResult_' + SFM.sfmUtil.fguid(),
                name: '属性查询(' + ln + ')',
                url: u,
                type: 'module',
                region: 'west',
                ctype: 'dialog'
            });
        } else if (layer.LayerType.toLowerCase() == 'gisvector' || layer.LayerType.toLowerCase() == 'gispoi') {
            var result = layer.SearchResultFromGISServer.GotoPage(0);
            var resultObj = $.xml2json(result);
            if (resultObj.Result != null && resultObj.Result.Record != null) {
                var record = resultObj.Result.Record;
                var showObj = {};
                showObj.displayFields = ['名称'];
                for (var key in record) {
                    if (key == 'SHAPE')
                        continue;
                    if (key == 'NAME') {
                        showObj['名称'] = record.NAME;
                    } else {
                        showObj[key] = record[key];
                        showObj.displayFields.push(key);
                    }
                }
                var rect = pObj.GetLonLatRect();
                initObjNormal(rect, showObj);
            }
        } else if (layer.LayerType.toLowerCase() == "pipeline") {
            if (queryHtmlBalloon) {
                queryHtmlBalloon.DestroyObject();
                queryHtmlBalloonHidden = false;
                queryHtmlBalloon = null;
            }
            var ln = layer.Name;
            var pObjs = [];
            var pObjGUID = pObj.Guid;

            var coor = pObj.GetLonLatRect().Center;
            var datum = earthCtx.SYSTEMPARAMS.pipeDatum;
            var point = SFM.queryHelper.blh2xy(datum,coor);
            var pointStr = point.x.toFixed(3) + '(X) ' + point.y.toFixed(3) + '(Y) ';


            pObjs.push(pObj);
            queryPropertyObj = pObjs;
            currentRoomCenter = pObj.GetLonLatRect().Center;
            var parentLayerName = pObj.GetParentLayerName();
            var layer = earth.LayerManager.GetLayerByGUID(parentLayerName.split("_")[0]); //parentLayerName.split("_")[1]
            // var url = SFM.sfmUtil.getMainWin().location.href;
            var u = "/modules/widget/common/query/EarthPropertyQuery/propertyQuery2.html?guid=" +
                pObjGUID + "&parentLayerName=" + parentLayerName + "&key=" + key + "&objs=" + pObjs + "&coor=" + pointStr;
            SFM.sfmUtil.getMainWin().SFM.sfmModuleMgr.loadModule({
                mk: 'propertityQueryResult_' + SFM.sfmUtil.fguid(),
                name: '属性查询(' + ln + ')',
                url: u,
                type: 'module',
                region: 'west',
                ctype: 'dialog'
            });

        } else {
            var pObjs = [];
            var pObjGUID = pObj.Guid;
            pObjs.push(pObj);
            queryPropertyObj = pObjs;
            if (cArr.length > 1) {
                var bLine = parentLayerName.indexOf("container") > -1;
                var _type = 0;
                if (bLine) _type = 1;
                if (layer) {
                    //获得关键字段
                    keyFieldInRealData = getName("US_KEY", _type, true);
                }
                //根据关键字段，拼接查询条件
                var strPara = "(and,equal," + keyFieldInRealData + "," + key + ")"; // + "&pg=0,30";
                var param = layer.QueryParameter;
                param.Filter = strPara;
                param.QueryType = 16; // SE_AttributeData
                param.QueryTableType = (bLine ? 1 : 0);
                param.PageRecordCount = 1;
                //进行查询
                var result = layer.SearchFromGISServer();
                //显示查询结果
                query(result.GotoPage(0), layer.Guid, layer.Name, bLine);
            } else {
                //如果是模型图层，没有进行进一步的查询，就把当前获得的基本信息进行了显示
                $("#divPointResult").show();
                $("#divLineResult").hide();
                initModelValue(key, layer, pObj);
            }
        }
    }

    // GeneralQuery.propertyQuery = propertyQuery;
})();
