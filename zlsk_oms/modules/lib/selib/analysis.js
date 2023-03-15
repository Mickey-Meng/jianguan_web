//横截面
var groundAltList = [];
var pipeLineAltList = [];
/*var pipeTranSectionAnalysisClick = earthCtx.pipeTranSectionAnalysisClick = function() {
    earth.ToolManager.SphericalObjectEditTool.Browse();
    earth.ShapeCreator.Clear();
    earth.Event.OnCreateGeometry = OnCreateHorizonSectionLine;
    earth.ShapeCreator.CreateLine();
};*/
// 创建线回调函数
/*var OnCreateHorizonSectionLine = function(pObj) {
    earth.Event.OnCreateGeometry = function() {};
    //var pipeLineLayers = top.PIPELINELAYERS;
    var projectId = (SYSTEMPARAMS == undefined ? SYSTEMPARAMS.project : SYSTEMPARAMS.project);
    var layer = earth.LayerManager.GetLayerByGUID(projectId);
   //var pipeLineLayers = StatisticsMgr.getPipeListByLayerChecked(layer)
    var p1 = pObj.GetPointAt(0);
    var p2 = pObj.GetPointAt(1);
    var datum = SYSTEMPARAMS.pipeDatum;
    var point1 = {x:p1.Longitude,y:p1.Latitude,z:p1.Altitude};
    var point2 = {x:p2.Longitude,y:p2.Latitude,z:p2.Altitude};
    var hp1 =  SFM.queryHelper.blh2xy(datum,point1);
    var hp2 =  SFM.queryHelper.blh2xy(datum,point2);
    var sc = 'polyline;'+hp1.X+' '+hp1.Y+','+hp2.X+' '+hp2.Y+';';
    var  customColor = earth.layerManager.GetLayerByGUID(projectId).CustomColor;
    clear();
    sendService(pObj,hp1,hp2,customColor);

    //earth.ToolManager.SphericalObjectEditTool.Browse();
};*/
/**
 * 清空数组中内容
 */
function clear() {
    if (groundAltList.length > 0 || pipeLineAltList.length > 0) {
        groundAltList.splice(0, groundAltList.length);
        pipeLineAltList.splice(0, pipeLineAltList.length);
    }
    minGroundAltitude = 0;
    maxGroundAltitude = 0;
    minLength = 0;
    maxLength = 0;
    minPipeLineAltitude = 0;
    maxPipeLineAltitude = 0;
    flag = true;
}
// 请求数据
var pVectors = [];
var pVectorsNew = {};


var sendService = function(pObj,hp1,hp2,customColor) {
    pVectors = pObj.GetPointAt(0);
   var strPoints = getStrPoints(pObj);
    var line = hp1.X+' '+hp1.Y+','+hp2.X+' '+hp2.Y;
    SFM.queryHelper.getLayerList().then(function(data){
        SFM.queryHelper.transection({line:line}).then(function(data){

             parseResult(data,customColor);
        });
    }, function(msg){});
}
var insertDaily = function(daily) {
    var stOmsIp = 'http://192.168.2.201:8080';
    var u = stOmsIp + '/STOms/dailyinfoAction.do?method=saveDailyinfo';
    var d = {
        username: daily[1],
        daily: daily[2]
    };
    var dfd = $.Deferred();
    ajax = window.ajax;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: u,
        data: d,
        async: true,
        cache: false
    }).then(function(data){
        var dd = data && data.data;
        if(dd){
            if(dd.msg){
                dfd.reject(dd.msg);
            }else{
                dfd.resolve(dd);
            }
        }else{
            dfd.reject('查询数据失败');
        }
    }, function(){
        dfd.reject('查询数据失败,可能是网络原因');
    });
    return dfd.promise();
};
var _getCookie = function(name) {
    var regKey = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
    var arr = document.cookie.match(regKey);
    if (arr) {
        return unescape(arr[2]);
    } else {
        return null;
    }
};
    // 创建横截面图
function createTranSectionChat() {
    var daily = [];
    daily[1] = _getCookie('userName');
    daily[2] = '横断面分析';
    insertDaily(daily);
    var params = {
        gAltList: groundAltList,
        pAltList: pipeLineAltList,
        minL: minLength,
        maxL: maxLength,
        minG: minGroundAltitude,
        maxG: maxGroundAltitude,
        minP: minPipeLineAltitude,
        maxP: maxPipeLineAltitude,
        profileAlt: (SYSTEMPARAMS == undefined ? SYSTEMPARAMS.profileAlt : SYSTEMPARAMS.profileAlt),
        earthObj: earth
    };

    var is_opera = /opera/i.test(navigator.userAgent);
    var is_ie = (/msie/i.test(navigator.userAgent) && !is_opera);
    var is_ie_6 = (is_ie && /msie 6\.0/i.test(navigator.userAgent));
    var is_ie_7 = (is_ie && /msie 7\.0/i.test(navigator.userAgent));
    var is_ie_8 = (is_ie && /msie 8\.0/i.test(navigator.userAgent));

    var u = SFM.sfmUtil.getMainWin().location.href;
    var index = u.lastIndexOf('/');
    u = u.substring(0,index);
    if(is_ie_6 || is_ie_7 || is_ie_8){
        openDialog(u + "/modules/widget/common/analysis/tranSectionResult/tranSectionResult2.html", params, 1060, 700);
    }else{
        openDialog(u + "/modules/widget/common/analysis/tranSectionResult/tranSectionResult.html", params, 1060, 700);
    }

}

// 创建横截面图从气泡点击弹出
function createTranSectionChatByBalloon(elementLine) {
    var params = {
        gAltList: groundAltList,
        pAltList: pipeLineAltList,
        minL: minLength,
        maxL: maxLength,
        minG: minGroundAltitude,
        maxG: maxGroundAltitude,
        minP: minPipeLineAltitude,
        maxP: maxPipeLineAltitude,
        earthObj: earth,
        elementLine: elementLine
    };

    var is_opera = /opera/i.test(navigator.userAgent);
    var is_ie = (/msie/i.test(navigator.userAgent) && !is_opera);
    var is_ie_6 = (is_ie && /msie 6\.0/i.test(navigator.userAgent));
    var is_ie_7 = (is_ie && /msie 7\.0/i.test(navigator.userAgent));
    var is_ie_8 = (is_ie && /msie 8\.0/i.test(navigator.userAgent));

    if(is_ie_6 || is_ie_7 || is_ie_8){
        openDialog("tranSectionResult2.html", params, 1060, 700);
    }else{
        openDialog("tranSectionResult.html", params, 1060, 700);
    }
}
// 获取点字符串
function getStrPoints(pObj) {
    var strPoints = "";
    if (pObj.GetPointAt(0).Longitude < pObj.GetPointAt(pObj.Count - 1).Longitude) {
        for (var j = 0; j < pObj.Count; j++) {
            var point = pObj.GetPointAt(j);
            strPoints = strPoints + "," + point.Longitude + "," + point.Latitude + "," + point.Altitude;
        }
        pVectorsNew.Longitude = pObj.GetPointAt(0).Longitude - 0.00045;
        pVectorsNew.Latitude = pObj.GetPointAt(0).Latitude;
        pVectorsNew.Altitude = pObj.GetPointAt(0).Altitude;
    } else {
        for (var j = pObj.Count - 1; j >= 0; j--) {
            var point = pObj.GetPointAt(j);
            strPoints = strPoints + "," + point.Longitude + "," + point.Latitude + "," + point.Altitude;
        }
        pVectorsNew.Longitude = pObj.GetPointAt(pObj.Count - 1).Longitude - 0.00045;
        pVectorsNew.Latitude = pObj.GetPointAt(pObj.Count - 1).Latitude;
        pVectorsNew.Altitude = pObj.GetPointAt(pObj.Count - 1).Altitude;
    }
    return strPoints;
}
// 解析服务器返回结果
var minGroundAltitude = 0;
var maxGroundAltitude = 0;
var minLength = 0;
var maxLength = 0;
var minPipeLineAltitude = 0;
var maxPipeLineAltitude = 0;
var flag = true;
if(SYSTEMPARAMS){
    var SYSTEMPARAMS = SYSTEMPARAMS;
}
if(parent.params){
    var params = parent.params;
}
/*function parseResult(data,customColor) {

    if (data.length == 0) {
        return;
    }
    for (var i = 0; i < data.length; i++) {
        var ID = data[i].ST_KEY; //ID
        var mater = data[i].ST_PMATER; //材质
        var type = data[i].ST_PIPECODE; //数据类型
        var dataType = ectx.StatisticsMgr.getValueByCode("PipeCode", type);
        if(dataType == undefined){
            dataType = SFM.queryHelper.getLayerName(data[i].ST_LAYER_NAME);
        }
        var color = "000000";
        if(SYSTEMPARAMS){
            var parentDocument = window.parent.document;
        }else{
            var parentDocument = window.document;
        }
        if ($("div[tag=ViewMaterialShowing]", parentDocument).hasClass("selected")) {
            if (params.product == "jiaoda") {
                color = PipelineStandard.getMaterialColorForjiaoda(type)
            }else{
                  color = PipelineStandard.getStandardLineColor(type); // 按材质来
            }
        } else if ($("div[tag=ViewStandardColorShowing]", parentDocument).hasClass("selected")) {
            color = PipelineStandard.standardColor(type); // 按国标来
            color = parseInt(color).toString(16);
            color = color.substring(2);
        } else if ($("div[tag=ViewCustomColorShowing]", parentDocument).hasClass("selected")) {
            color = parseInt(customColor).toString(16); //按自定义颜色来
            color = color.substring(2);
        }
        //var length=color.length;
        var tmp = "000000".substring(color.length, 6);
        color = "#" + color + tmp;
        try{
            var specification = data[i].ST_SIZE; //规格
        }catch(e){
            var specification = data[i].ST_SIZE; //规格
        }
        var intersectPointX = data[i].intersectPointX;
        var intersectPointY = data[i].intersectPointY;
        var datum = SYSTEMPARAMS.pipeDatum;
        var point = {x:intersectPointX,y:intersectPointY};
        var vx = SFM.queryHelper.xy2blh(datum,point);
        var intersectAltitude1 = data[i].intersectPointAlt;//地面高程
        var intersectAltitude = (parseFloat(intersectAltitude1)).toFixed(3);
        //管线高程
       var vAltitude1 = earth.Measure.MeasureTerrainAltitude(vx.X, vx.Y);
        vAltitude = (parseFloat(vAltitude1)).toFixed(3); //算出地形高程
        */
       /* var intersectPointZ = parseFloat(intersectPointArr[2]); // + parseFloat(intersectDeep);//管线高程 横切点的Z值就是管线高程
        intersectPointZ = (parseFloat(intersectPointZ)).toFixed(3);*/
        /*var IntersectDeep = vAltitude - intersectAltitude;
        var  intersectDeep = (parseFloat(IntersectDeep)).toFixed(3);
        var datum;
        if (!SYSTEMPARAMS) {
            datum = earth.datum;
        } else {
            datum = SYSTEMPARAMS.pipeDatum;
        }
        var vecBegin = datum.des_BLH_to_src_xy(pVectors.Longitude,
            pVectors.Latitude, pVectors.Altitude);
         vAltitude1 = pVectorsNew.Altitude;
        var vecEnd = datum.des_BLH_to_src_xy(vx.X, vx.Y,vx.Z);
        var lengthl = Math.sqrt(Math.abs(vecBegin.X - vecEnd.X) * Math.abs(vecBegin.X - vecEnd.X) + Math.abs(vecBegin.Y - vecEnd.Y) * Math.abs(vecBegin.Y - vecEnd.Y)); // 间距
        lengthl = (parseFloat(lengthl)).toFixed(6);
        if (flag) {
            minLength = maxLength = lengthl; //间距
            if (SYSTEMPARAMS.profileAlt == "0") {//数据高程
                minGroundAltitude=maxGroundAltitude=intersectAltitude;
            }
            else{
                minGroundAltitude = maxGroundAltitude = vAltitude;//intersectAltitude; //地形高程
            }

            minPipeLineAltitude = maxPipeLineAltitude = intersectAltitude;//vAltitude; //管线高程
            flag = false;
        }
        if (parseFloat(maxLength) < parseFloat(lengthl)) {
            maxLength = lengthl;
        }
        if (parseFloat(minLength) >= parseFloat(lengthl)) {
            minLength = lengthl;
        }
        // if (parseFloat(maxGroundAltitude) < parseFloat(intersectAltitude)) {
        //     maxGroundAltitude = intersectAltitude;
        // } else if (parseFloat(minGroundAltitude) >= parseFloat(intersectAltitude)) {
        //     minGroundAltitude = intersectAltitude;
        // }
        // if (parseFloat(maxPipeLineAltitude) < parseFloat(vAltitude)) {
        //     maxPipeLineAltitude = vAltitude;
        // } else if (parseFloat(minPipeLineAltitude) >= parseFloat(vAltitude)) {
        //     minPipeLineAltitude = vAltitude;
        // }
        if (parseFloat(maxGroundAltitude) < parseFloat(vAltitude)) {
            maxGroundAltitude = vAltitude;
        } else if (parseFloat(minGroundAltitude) >= parseFloat(vAltitude)) {
            minGroundAltitude = vAltitude;
        }
        if (parseFloat(maxPipeLineAltitude) < parseFloat(intersectAltitude)) {
            maxPipeLineAltitude = intersectAltitude;
        } else if (parseFloat(minPipeLineAltitude) >= parseFloat(intersectAltitude)) {
            minPipeLineAltitude = intersectAltitude;
        }
        if (SYSTEMPARAMS.profileAlt == "0") {
            groundAltList.push(intersectAltitude);//groundAltList.push(vAltitude); //数据高程
        } else {
            groundAltList.push(vAltitude);//groundAltList.push(intersectAltitude); //地形高程
        }
        groundAltList.push(lengthl);

        var pipeLineObj = {};
        pipeLineObj.dataType = dataType;
        pipeLineObj.ID = ID;
        pipeLineObj.mater = mater;
        pipeLineObj.x = intersectAltitude;//vAltitude;
        pipeLineObj.y = lengthl;
        pipeLineObj.coordX = (vecEnd.X).toFixed(3);
        pipeLineObj.coordY = (vecEnd.Y).toFixed(3);
        //pipeLineObj.vAltitude= earth.Measure.MeasureTerrainAltitude(NewpVectors.Longitude,NewpVectors.Latitude);
        pipeLineObj.fillcolor = color;
        pipeLineObj.groundAltitude = vAltitude;//intersectAltitude;
        pipeLineObj.specification = specification;
        pipeLineObj.deep = intersectDeep;
        pipeLineAltList.push(pipeLineObj);
    }
    createTranSectionChat();
};*/
/***********************************************************************************************************************/
/**
 * 文件名：     analysis.js
 * 修改人：     陈伟
 * 日期：    2013-10-23
 * 备注：分析常用功能封装
 */
var earth = earth;
var bLine = true;
var bufPolygon = null; //临时buffer图形
var targetPipeLineType = 0; // PipelineStandard.PipelineType.Unknown
var obj = {}; //分析常用属性集合对象
var selobj = null; //选中对象
/**
 * 功能：选取对象
 * 参数：contain-显示标签,btn-按钮 ,bufferDisk-缓冲半径 ,pointCheck--是否分析点,objAnalys-是否解析选取对象
 * 返回值：无
 */
function analysisSelectObj(contain, btn, bufferDisk, pointCheck, objAnalys) {
    earth.Event.OnPickObjectEx = function(pObj) {
        stophighlight();
        pObj.Underground = true; // SEObjectFlagType.ObjectFlagUnderground
        pObj.ShowHighLight();
        earth.Event.OnPickObjectEx = function() {};
        earth.Query.FinishPick();
        var layerGUID = pObj.GetParentLayerName().split("=")[1];
        obj.layerGUID = layerGUID;
        obj.objGUID = pObj.Guid;
        obj.key = pObj.GetKey();
        obj.X = pObj.SphericalTransform.Longitude;
        obj.Y = pObj.SphericalTransform.Latitude;
        obj.Z = pObj.SphericalTransform.Altitude; //earth.Measure.MeasureTerrainAltitude(obj.X, obj.Y);
        var lineChk = true;
        if (objAnalys) { //不需要再次查询所做操作

        } else {
            if(bufferDisk != null){
                lineChk = analysisSearchObj(pObj, bufferDisk, pointCheck);
            }

        }
        if (lineChk) {
            contain.val(pObj.GetKey());
        } else {
            contain.val("");
        }
        btn.removeAttr("disabled");
        selobj = pObj;
    };
    earth.Query.PickObjectEx(24); // SEPickObjectType.PickAllObject
}

function burstAnalysisSelectObj(contain, btn, bufferDisk, pointCheck, objAnalys) {
    earth.Event.OnPickObjectEx = function(pObj) {
        pObj.Underground = true;
        earth.Event.OnPickObjectEx = function() {};
        earth.Query.FinishPick();
        var layerGUID = pObj.GetParentLayerName().split("=")[1];
        obj.layerGUID = layerGUID;
        obj.objGUID = pObj.Guid;
        obj.key = pObj.GetKey();
        // obj.X = pObj.SphericalTransform.Longitude;
        // obj.Y = pObj.SphericalTransform.Latitude;
        // obj.Z = pObj.SphericalTransform.Altitude; //earth.Measure.MeasureTerrainAltitude(obj.X, obj.Y);
        obj.X = pObj.GetLonLatRect().Center.X;
        obj.Y = pObj.GetLonLatRect().Center.Y;
        obj.Z = pObj.GetLonLatRect().Center.Z;
        var layer = earth.LayerManager.GetLayerByGUID(layerGUID.split("_")[0]);

        if (layer == null) {
            return;
        }
        /* if (layer.PipeLineType >= 5000 && layer.PipeLineType < 6000) {  // fire 燃气类管线
            //strRes = imgLocation + "fire.png";
        } else if (layer.PipeLineType >= 3000 && layer.PipeLineType < 4000) { // water 给水
        } else if (layer.PipeLineType >= 6000 && layer.PipeLineType < 6100) { //  //热力/蒸汽
        }else if (layer.PipeLineType >=6100 && layer.PipeLineType < 7000) { // 热水
        }else if (layer.PipeLineType >= 7000&& layer.PipeLineType < 7200) { // 工业类
        }else if(layer.PipeLineType >= 72000&& layer.PipeLineType < 8000){
        }*/
        if ((layer.PipeLineType >= 1000 && layer.PipeLineType < 3000) ||
            (layer.PipeLineType >= 8100 && layer.PipeLineType < 8200)) {
            alert("此类管线不支持爆管分析功能.");
            burstAnalysisSelectObj(contain, btn, bufferDisk, pointCheck, objAnalys);
            return;
        }
        pObj.ShowHighLight();
        var lineChk = true;
        if (objAnalys) { //不需要再次查询所做操作

        } else {
            lineChk = analysisSearchObj(pObj, bufferDisk, pointCheck);
        }
        if (lineChk) {
            contain.val(pObj.GetKey());
        } else {
            contain.val("");
        }
        btn.removeAttr("disabled");
        selobj = pObj;
    };
    earth.Query.PickObjectEx(24); // SEPickObjectType.PickAllObject
}

function stophighlight() {
    if (selobj) {
        selobj.StopHighLight();
    }
}
/**
 * 功能：对选取对象解析
 * 参数：pObj-选择对象
 * 返回值：无
 */
function analysisSearchObj(pObj, bufferDisk, pointCheck) {
    var lineChk = false;
    var selectedObj = null; // SEGeoPoints类型
    var selectedObjStr = ""; // selectedObj的字符串表示：x1,y1,z1,x2,y2,z2
    var pdiam = 0;
    var ppressure = "";
    var plttype = "";
    var ppsvalue = "";
    var targetPipeLineType = 0;
    var parentLayerNameTemp = pObj.GetParentLayerName();
    var parentLayerName = parentLayerNameTemp.split("=")[1];
    var str = parentLayerNameTemp.split("=")[1].split("_");
    var PObjGUID = parentLayerNameTemp.split("=")[1].split("_")[0];
    var layer = earth.LayerManager.GetLayerByGUID(PObjGUID);
    targetPipeLineType = earth.LayerManager.GetLayerByGUID(parentLayerName.split("_")[0]).PipeLineType;
    obj.pipetype = targetPipeLineType;
    var subLayer = null;
    for (var x = 0; x < layer.GetChildCount(); x++) {
        subLayer = layer.GetChildAt(x);
        if (subLayer.Name === str[1]) {
            break;
        }
    }
    if (subLayer === null) {
        return;
    }
    var param = subLayer.QueryParameter;
    param.ClearSpatialFilter();
    param.ClearRanges();
    param.ClearCompoundCondition();
    var result = null,
    json = null;
    //var US_KEY = getName("US_KEY", 1, true);
   // param.Filter = "(and,equal," + US_KEY + "," + pObj.GetKey() + ")";
    //param.QueryType = 17; // SE_SpatialData
 if (parentLayerName.indexOf("container") > -1) { // line  RecordCount = 0
        lineChk = true;
        bLine = true;
        param.QueryTableType = 1;
        var layerName = layer.Name;
        var key = pObj.GetKey();
        SFM.queryHelper.getLayerList().then(function(data) {
        var la =SFM.queryHelper.getLayerKey(layerName,'line');
         if (la == null) {
             alert("选择对象为非管段，请重新选择!");
            return false;
         }
        SFM.queryHelper.queryByKey(la.join(','),key).then(function(data){
            var d=data.getMe;
            if(d.length == 0){
            alert("查询结果不存在");
            return false;
            }
            var res = d[0].attributes;
            var US_SALT = res.ST_SALT;
            var US_EALT = res.ST_EALT;
            pdiam =res.ST_SIZE;
            ppressure = res.ST_PRESSUR;
            plttype = res.ST_LTTYPE;
            ppsvalue = res.ST_PSVALUE;
            var jsonStr = d[0].geometry.geometryJSON ;
            var objJson = JSON.parse(jsonStr);
            var coor = objJson.coordinates;
            var coors = coor[0];
            selectedObj = earth.Factory.CreateGeoPoints();
           var datum = SYSTEMPARAMS.pipeDatum;
        for (var i = 0; i < coors.length; i++) {
            var point = {x:coors[i][0],y:coors[i][1]};
            var vx = SFM.queryHelper.xy2blh(datum,point);
             selectedObj.Add(vx.x, vx.y, vx.z);
            }
    AnalysisCreateBufferFromLine(selectedObj, bufferDisk);
    obj.targetPipeLineType = targetPipeLineType;
    obj.selectedObjStr = selectedObjStr;
    obj.selectedObj = selectedObj;
    obj.pdiam = pdiam;

    //---水平净距、垂直净距、碰撞分析中要用到压力和埋设方式字段 START---//
    obj.ppressure = ppressure;
    obj.plttype = plttype;
    obj.ppsvalue = ppsvalue;
    if(obj.ppressure == "低压"){
        obj.ppressure = 0;
    }else if(obj.ppressure == "中压"){
        obj.ppressure = 1;
    }else if(obj.ppressure == "高压"){
        obj.ppressure = 2;
    }else{
        obj.ppressure = -1;
    }
    if(obj.plttype == undefined || obj.plttype == ""){
        obj.plttype = -1;
    }
    if(obj.ppsvalue == undefined || obj.ppsvalue == ""){
        obj.ppsvalue = -1;
    }

    //---水平净距、垂直净距、碰撞分析中要用到压力和埋设方式字段 END---//
    })
 });
 }
    return lineChk;
}
/**
 * 功能：清除生成的缓冲区对象
 * 参数：无
 * 返回值：无
 */
function analysisClearBuffer() {
    if (bufPolygon != null) {
        earth.DetachObject(bufPolygon);
        bufPolygon = null;
    }
};
/**
 * 功能：生成缓冲区对象
 * 参数：selectedObj-所选对象点集，
 * 返回值：无
 */
function AnalysisCreateBufferFromLine(selectedObj, disk) {
    if (selectedObj == null) {
        return;
    }
    if (disk === "") {
        disk = 0;
    }
    var vec3s = earth.Factory.CreateVector3s();
    var pt = null;
    var bufGeoPoints = earth.GeometryAlgorithm.CreatePolygonFromPolylineAndWidthWithHead(selectedObj,
        disk, disk);

    for (var i = 0; i < bufGeoPoints.Count; i++) {
        pt = bufGeoPoints.GetPointAt(i);
        vec3s.Add(pt.Longitude, pt.Latitude, pt.Altitude);
    }
    analysisClearBuffer();
    bufPolygon = earth.Factory.CreateElementPolygon(earth.Factory.CreateGUID(), "");
    bufPolygon.BeginUpdate();
    bufPolygon.SetExteriorRing(vec3s); // SECoordinateUnit.Degree
    bufPolygon.LineStyle.LineWidth = 1;
    bufPolygon.LineStyle.LineColor = parseInt("0xFFFF0000");
    bufPolygon.FillStyle.FillColor = parseInt("0x2500FF00");
    bufPolygon.AltitudeType = 1; // SEAltitudeType.ClampToTerrain
    bufPolygon.EndUpdate();
    earth.AttachObject(bufPolygon);
    obj.bufGeoPoints = bufGeoPoints;
};
/**
 * 功能：通过buffer搜索
 * 参数：bufferDist-缓冲区半径
 * 返回值：无
 */
/*function searchBybuffer(bufferDist){
 var searchResult = [];
 var projectId = SYSTEMPARAMS.project;
 var layer = earth.LayerManager.GetLayerByGUID(projectId);
 var pipeLineLayers = StatisticsMgr.getPipeListByLayer(layer);
 $.each(pipeLineLayers, function (i,v){
 var guid = v.id;
 var server = v.server;
 var name = v.name;
 var strConn = server + "pipeline?rt=collision&service=" + guid;
 strConn += "&aparam=0,";
 strConn += obj.selectedObjStr + ",";
 strConn += obj.pdiam + ",";
 strConn +=bufferDist;
 var xmlDoc=loadXMLStr(strConn);
 searchResult.push(
 {
 xmlDoc:xmlDoc,
 guid:guid,
 name:name,
 server:server
 }
 );
 //parseResult(xmlDoc,guid, name,server);
 });
 return  searchResult;
 };*/
/**
 * 功能：生成缓冲区对象
 * 参数：searchResult-SearchFromLocal搜索数据，key-关键字
 * 返回值：匹配的对象/null
 */
function filterByKey(searchResult, key) {
    var obj = null;
    if (searchResult.RecordCount === 0) {
        return null;
    }
    searchResult.GotoPage(0);
    for (var i = 0; i < searchResult.RecordCount; i++) {
        obj = searchResult.GetLocalObject(i);
        if (null == obj) continue;
        if (obj.GetKey() == key) {
            obj.Underground = true; // SEObjectFlagType.ObjectFlagUnderground
            return obj;
        }
    }
    return null;
};

/**
 * 功能：高亮闪烁显示
 * 参数：layerID-图层ID，type-对象类型：point / line， guid-对象的GUID，key-- 对象的US_KEY值
 * 返回值：无
 */
var northArr = [];
var southArr = [];
var eastArr = [];
var westArr = [];
var hidenArr = [];
var chkArr = []; //是否
var chkFlag = "false";
var showTag = false;
var dbClickHighLight = [];
var bShow = false;//显示详情
var recordResults = [];
var isShowResult = false; //是否是点击显示结果按钮


var showPopup = function(content, lonlat) {
    if(!ol2Helper){
        return;
    }
    var popup = ol2Helper.popup(null, 'FramedCloud', lonlat, null, content || '', null, true, function(e) {
        ol2Helper && ol2Helper.clearAllHighlight();
        popup.destroy();
    });
    ol2Helper.addPopup(popup);
};
function analysisHighlightObject(layerID, type, guid, key, Layer, flag) {//必要参数 layerID type key
    ol2Helper && ol2Helper.clearAllHighlight().clearPopup();
    var k = key;
    var r = null;
    var lt = type;
    var la = SFM.queryHelper.getLayerKey(Layer, lt);
    if (la && la.length > 0){
        SFM.queryHelper.queryByKey(la.join(','), k).then(function(data){
            var d = data.getMe && data.getMe[0];
            if(!d){
                return;
            }
            var f = ol2Helper.readWkt(d.geometry.geometryText);
            ol2Helper.highlight(f);
            if(lt == SFM.queryHelper.TYPE_POINT){
                mctx && mctx.map.setCenter([f.geometry.x, f.geometry.y], 16);
            }else{
                mctx && mctx.map.zoomToExtent(f.geometry.getBounds());
            }
            if ($('#detailData').prop("checked")){
                var h = SFM.queryHelper.getAttrHtml2(d.fields, d.attributes);
                showPopup(h, f.geometry.getBounds().getCenterLonLat());
            }
        });
    }
    var layer = earth.LayerManager.GetLayerByGUID(layerID);
    var i = 0;
    var subLayer = null;
    var searchResult = null;
    var obj = null;
    for (i = 0; i < layer.GetChildCount(); i++) {
        subLayer = layer.GetChildAt(i);
        if (type === "point" || type === "管点") {
            if (subLayer.LayerType === "Container" || subLayer.LayerType === "Vector" || subLayer.LayerType === "Model_container") continue;
        } else if (type === "line" || type === "管线") {
            if ((subLayer.LayerType !== "Container" && subLayer.LayerType !== "Container_Og" && subLayer.LayerType !== "Model_container") || subLayer.LayerType === "Vector") continue;
        }
        var dt = subLayer.LocalSearchParameter.ReturnDataType;
        // subLayer.LocalSearchParameter.ReturnDataType = 0; //0 返回所有数据，1 返回xml数据，2 返回渲染数据
        subLayer.LocalSearchParameter.ReturnDataType = ectx.localSearchDataType.xml;
        subLayer.LocalSearchParameter.PageRecordCount = 100;
        subLayer.LocalSearchParameter.SetFilter(key, "");
        subLayer.LocalSearchParameter.ClearSpatialFilter();
        subLayer.LocalSearchParameter.HasDetail = false;
        subLayer.LocalSearchParameter.HasMesh = false;
        searchResult = subLayer.SearchFromLocal();
        subLayer.LocalSearchParameter.ReturnDataType = dt;
        if (searchResult.RecordCount < 1) continue;

        subLayer.LocalSearchParameter.ReturnDataType = ectx.localSearchDataType.xml;
        obj = filterByKey(searchResult, key);
        subLayer.LocalSearchParameter.ReturnDataType = dt;
        if (obj != null) {
            var vecCenter = obj.SphericalTransform;
            northArr.push(obj.GetLonLatRect().North);
            southArr.push(obj.GetLonLatRect().South);
            eastArr.push(obj.GetLonLatRect().East);
            westArr.push(obj.GetLonLatRect().West);
            /*if (type === "line") {
                earth.GlobeObserver.GotoLookat(vecCenter.X, vecCenter.Y, vecCenter.Z + 50, 0.0, 89.0, 0, 4);
            } else {
                earth.GlobeObserver.GotoLookat(vecCenter.X, vecCenter.Y, vecCenter.Z, 50.0, 45.3, 0, 5);
            }*/
            if (type === "line") {
                earth.GlobeObserver.GotoLookat(vecCenter.Longitude,vecCenter.Latitude,vecCenter.Altitude + 50, 0.0, 89.0, 0, 4);
            } else {
                earth.GlobeObserver.GotoLookat(vecCenter.Longitude,vecCenter.Latitude,vecCenter.Altitude, 50.0, 45.3, 0, 5);
            }
            // earth.GlobeObserver.GotoLookat(obj.SphericalTransform.Longitude, obj.SphericalTransform.Latitude, obj.SphericalTransform.Altitude, 50.0, 45.3, 0, 20);
            if (chkFlag === "true") {
                if (flag === "true") {
                    obj.HightLightIsFlash(false);
                    obj.ShowHighLight();
                } else {
                    if (chkArr && chkArr.length > 0) {
                        var ck = true;
                        for (var j = 0; j < chkArr.length; j++) {
                            if (chkArr[j].key === obj.GetKey()) {
                                ck = false;
                                obj.HightLightIsFlash(true);
                                setTimeout(function() {
                                    obj.HightLightIsFlash(false);
                                    obj.ShowHighLight();
                                }, 100);
                            }
                        }
                        if (ck) {
                            obj.HightLightIsFlash(true);
                            obj.ShowHighLight();
                        }
                    } else {
                        obj.HightLightIsFlash(true);
                        obj.ShowHighLight();
                    }
                    //obj.ShowHighLight();
                }
            } else {
                clearHighLight();
                obj.HightLightIsFlash(true);
                obj.ShowHighLight();
                dbClickHighLight.splice(0, 1);
                dbClickHighLight.push(obj);
            }
            if (showTag) {
                showTag = false;
                northArr.sort();
                southArr.sort();
                eastArr.sort();
                westArr.sort();
                var TO_RADIAN = 0.017453292519943295769236907684886;
                var SemiMajor = 6378.137;
                var width = Math.abs(eastArr[0] - westArr[westArr.length - 1]);
                var height = Math.abs(northArr[0] - southArr[southArr.length - 1]);
                var x = Math.abs((eastArr[0] + westArr[westArr.length - 1]) / 2);
                var y = Math.abs((northArr[0] + southArr[southArr.length - 1]) / 2);
                var vAltitude = earth.Measure.MeasureTerrainAltitude(x, y);
                var vAspect1 = width / height;
                var vAspect = earth.offsetWidth / earth.offsetHeight;
                var vRange = 100;
                if (vAspect1 > vAspect) {
                    vRange = width * TO_RADIAN * SemiMajor * 1000 / Math.tan(22.5 * vAspect * TO_RADIAN); //* vAspect * TO_RADIAN
                    //y=y+0.0012;
                } else {
                    vRange = height * TO_RADIAN * SemiMajor * 1000 / Math.tan(22.5 * TO_RADIAN); //* TO_RADIAN
                }
                //(northArr[northArr.length-1]+southArr[southArr.length-1])/2
                //var point = earth.GlobeObserver.PickTerrain((eastArr[eastArr.length-1]+westArr[westArr.length-1])/2,(northArr[northArr.length-1]+southArr[southArr.length-1])/2);
                earth.GlobeObserver.GotoLookat(x, y, vAltitude, 0, 89.0, 0, vRange);
            }
            if(!isShowResult && bShow){
                var parentLayerName = obj.GetParentLayerName();
                var cArr=parentLayerName.split("=");
                var cArr = cArr[1].split("_");
                var layer2 = earth.LayerManager.GetLayerByGUID(cArr[0]);
                if(cArr.length>1){
                        var bLine = parentLayerName.indexOf("container") > -1 ? 1:0;
                        var filed = ectx.getName("US_KEY", bLine, true);
                                    var strPara2 = "(and,equal," + filed + "," + key + ")"; // + "&pg=0,30";
                    var param = layer2.QueryParameter;
                    param.Filter = strPara2;
                    param.QueryType = 16;   // SE_AttributeData
                    param.QueryTableType = bLine;
                    param.PageRecordCount = 1;
                    var layerName = layer.Name;
                     SFM.queryHelper.getLayerList().then(function(data){
                        var lk = SFM.queryHelper.getLayerKey(layerName,type);
                      SFM.queryHelper.queryByKey(lk.join(','), key).then(function(data){
                          var d = data.getMe;
                          if(d != null){
                             d = d[0];
                            var h = SFM.queryHelper.getAttrHtml(d.fields, d.attributes);
                            var st = obj.SphericalTransform;
                            SFM.queryHelper.showHtmlBalloon(st.Longitude, st.Latitude, st.Altitude, h);
                        }
                    }, function(msg){
                        alert(msg);
                          });
                     })
                }
            }

            hidenArr.push(obj);
            return;
        }
    }
    if (obj == null && type === "point") {
        if (subLayer.LocalSearchParameter) {
            clearHighLight();
            earthCtx.StatisticsMgr.sphereGotoLookat(key, subLayer, layerID, key, bShow, null, null);
        }
    }
};

///////////////////////////////////////////////////////////
//  双击获取属性
//////////////////////////////////////////////////////////
function getPlaneCoordinates(layerID,data,usKey){
    var Record=null;
    var jsonData = $.xml2json(data);
    var us_key =getName("US_KEY", 0, true);
    if(jsonData==null||!jsonData.Result||jsonData.Result.num==0){
        return;
    } else if(jsonData.Result.num==1){
        Record =jsonData.Result.Record;
        if(jsonData.Result.Record[us_key]!=usKey){
            return false;
        }
    }else if(jsonData.Result.num>1){
        for(var i=0;i<jsonData.Result.num;i++){
            if(jsonData.Result.Record[i][us_key]!=usKey){
                continue;
            }else{
                Record =jsonData.Result.Record[i];
            }
        }
    }
    var Coordinates=Record.SHAPE.Point.Coordinates;
    var coord=Coordinates.split(" ");
    var coordinate1=coord[0].split(",");
    var Coordinate=transformToPlaneCoordinates(layerID,coordinate1);
    return Coordinate;
}

function  transformToPlaneCoordinates(layerId,coord){
    var datum =  SYSTEMPARAMS.pipeDatum;
    /*  var datum = CoordinateTransform.createDatum(); */
    var v3s1 = datum.des_BLH_to_src_xy(coord[0],coord[1],coord[2]);//经纬度转平面坐标
    return {datumCoord:v3s1,originCoord:coord};
}

var initNotLineValue = function (layerID, record, obj){
    var strKey=record[getName("US_KEY",0,true)];
    var road=record[getName("US_ROAD",0,true)];
    var isScra=record[getName("US_IS_SCRA",0,true)];
    var bdTime=record[getName("US_BD_TIME",0,true)];
    var fxYear=record[getName("US_FX_YEAR",0,true)];
    var owner=record[getName("US_OWNER",0,true)];
    var state=record[getName("US_UPDATE",0,true)];
    var update=record[getName("US_UPDATE",0,true)];
    var altitude=(parseFloat(record[getName("US_PT_ALT",0,true)])).toFixed(3);
    var attachment = record[getName("US_ATTACHMENT",0,true)];
    var pointType = record[getName("US_PT_TYPE",0,true)];

    var str_caption=getNameNoIgnoreCase("US_KEY",0,false);
    var road_caption=getNameNoIgnoreCase("US_ROAD",0,false);
    var isScra_caption=getNameNoIgnoreCase("US_IS_SCRA",0,false);
    var bdTime_caption=getNameNoIgnoreCase("US_BD_TIME",0,false);
    var fxYear_caption=getNameNoIgnoreCase("US_FX_YEAR",0,false);
    var owner_caption=getNameNoIgnoreCase("US_OWNER",0,false);
    var state_caption=getNameNoIgnoreCase("US_UPDATE",0,false);
    var update_caption=getNameNoIgnoreCase("US_UPDATE",0,false);
    var altitude_caption=getNameNoIgnoreCase("US_PT_ALT",0,false);
    var attachment_caption =getNameNoIgnoreCase("US_ATTACHMENT",0,false);
    var pointType_caption =getNameNoIgnoreCase("US_PT_TYPE",0,false);

    //井类型 井直径 井脖深 井底深 井盖类型  井盖规格 井盖材质  井材质  旋转角度  偏心井点号
    var us_well=record[getName("US_WELL",0,true)];
    var us_wdia=record[getName("US_WDIA",0,true)];
    var us_ndeep=(parseFloat(record[getName("US_NDEEP",0,true)])).toFixed(3);
    var us_wdeep=(parseFloat(record[getName("US_WDEEP",0,true)])).toFixed(3);
    var us_plate=record[getName("US_PLATE",0,true)];
    var us_psize=(parseFloat(record[getName("US_PSIZE",0,true)])).toFixed(3);
    var us_pmater=record[getName("US_PMATER",0,true)];
    var us_wmater=record[getName("US_WMATER",0,true)];
    var us_angle=record[getName("US_ANGLE",0,true)];
    var us_offset=record[getName("US_OFFSET",0,true)];

    var us_well_caption=getNameNoIgnoreCase("US_WELL",0,false);
    var us_wdia_caption=getNameNoIgnoreCase("US_WDIA",0,false);
    var us_ndeep_caption=getNameNoIgnoreCase("US_NDEEP",0,false);
    var us_wdeep_caption=getNameNoIgnoreCase("US_WDEEP",0,false);
    var us_plate_caption=getNameNoIgnoreCase("US_PLATE",0,false);
    var us_psize_caption=getNameNoIgnoreCase("US_PSIZE",0,false);
    var us_pmater_caption=getNameNoIgnoreCase("US_PMATER",0,false);
    var us_wmater_caption=getNameNoIgnoreCase("US_WMATER",0,false);
    var us_angle_caption=getNameNoIgnoreCase("US_ANGLE",0,false);
    var us_offset_caption=getNameNoIgnoreCase("US_OFFSET",0,false);

    if(road==undefined){
        road="";
    }
    if(isScra==undefined){
        isScra="";
    }
    if(bdTime==undefined){
        bdTime="";
    }
    if(fxYear==undefined){
        fxYear="";
    }
    if(owner==undefined){
        owner="";
    }
    if(state==undefined){
        state="";
    }
    if(update==undefined){
        update="";
    }
    var v3s=null;
    var us_key = getName("US_KEY",0,true);
    var strPara = "(and,equal," +us_key+",";
    strPara += strKey;
    strPara += ")";
    var layer = earth.LayerManager.GetLayerByGUID(layerID);
    var strConn=layer.GISServer + "dataquery?service=" + layerID + "&qt=17&dt=point&pc="+strPara+"&pg=0,100";
    earth.Event.OnEditDatabaseFinished = function(pRes, pFeature){
        if (pRes.ExcuteType == parent.excuteType){
            var xmlStr = pRes.AttributeName;
            var xmlDoc=loadXMLStr(xmlStr);
            v3s=getPlaneCoordinates(layerID,xmlDoc,strKey);
            var tv3s = v3s["datumCoord"];
            originCoord = v3s["originCoord"];
            var X="";
            var Y="";
            if(tv3s){
                X=(parseFloat(tv3s.X)).toFixed(3);
                Y=(parseFloat(tv3s.Y)).toFixed(3);
            }
            var str = "";
            str += '<tr><td style="word-wrap:break-word;" width="100">&nbsp;&nbsp;&nbsp;&nbsp;'+str_caption+'</td><td style="word-wrap:break-word;" width="150">&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +record[getName("US_KEY",0,true)]+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;X坐标</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +X+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;Y坐标</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +Y+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+altitude_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+altitude+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+pointType_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(pointType==undefined?"":pointType)+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+attachment_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+(attachment==undefined?"":attachment)+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+road_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+road+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+owner_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+owner+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+bdTime_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+bdTime+'</td></tr>';
            str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+state_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+state+'</td></tr>';
            //alert("大概");
            //井相关字段处理
            if(us_well){
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_well_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_well+'</td></tr>';
            }
            if(us_wdia && Number(us_wdia)){
                us_wdia = Number(us_wdia).toFixed(3);
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_wdia_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_wdia+'</td></tr>';
            }
            if(us_ndeep && Number(us_ndeep)){
                us_ndeep = Number(us_ndeep).toFixed(3);
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_ndeep_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_ndeep+'</td></tr>';
            }
            if(us_wdeep && Number(us_wdeep)){
                us_wdeep = Number(us_wdeep).toFixed(3);
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_wdeep_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_wdeep+'</td></tr>';
            }
            if(us_plate){
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_plate_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_plate+'</td></tr>';
            }
            if(us_psize){
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_psize_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_psize+'</td></tr>';
            }
            if(us_pmater){
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_pmater_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_pmater+'</td></tr>';
            }
            if(us_wmater){
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_wmater_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_wmater+'</td></tr>';
            }
            if(us_angle && Number(us_angle)){
                us_angle = Number(us_angle).toFixed(3);
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_angle_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_angle+'</td></tr>';
            }
            if(us_offset){
                str += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;'+us_offset_caption+'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+ "   " +us_offset+'</td></tr>';
            }
            htmlStr = htmlStr + str + '</table></div>';
            if(obj != null){
                var vecCenter = obj.SphericalTransform;
                parent.showHtmlBalloon(vecCenter.Longitude, vecCenter.Latitude, vecCenter.Altitude, htmlStr);
            }
        }
    }
    earth.DatabaseManager.GetXml(strConn);
}

var initPointValue = function (layerID, record, layerName, obj){
        var strKey=record[getName("US_KEY",0,true)];
        var v3s=null;
        var us_key = getName("US_KEY",0,true);
        var strPara = "(and,equal," +us_key+",";
        strPara += strKey;
        strPara += ")";
        var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var strConn = layer.GISServer + "dataquery?service=" + layerID + "&qt=17&dt=point&pc="+strPara+"&pg=0,100";
        earth.Event.OnEditDatabaseFinished = function(pRes, pFeature){
            if (pRes.ExcuteType == parent.excuteType){
                var xmlStr = pRes.AttributeName;
                var xmlDoc = loadXMLStr(xmlStr);
                v3s = getPlaneCoordinates(layerID,xmlDoc,strKey);
                var tv3s = v3s["datumCoord"];
                originCoord = v3s["originCoord"];
                var X = "";
                var Y = "";
                if(tv3s){
                    X=(parseFloat(tv3s.X)).toFixed(3);
                    Y=(parseFloat(tv3s.Y)).toFixed(3);
                }

                var us_well=record[getName("US_WELL",0,true)];
                var fieldArr = [];
                // if(us_well){//井类型
                    fieldArr = parent.PS2_config.PointProperty.DEFAULTPOINT;
                // }else{
                //  fieldArr = parent.PS2_config.PointProperty.DEFAULTPOINT;
                // }
                var str = "";
                for(var i = 0 ; i < fieldArr.length; i++){
                    var fieldCaption = getName(fieldArr[i],0,false);    //显示字段
                    var fieldName = getName(fieldArr[i],0,true);//数据库字段
                    var fieldValue = record[fieldName]||"";
                    // if(!fieldValue && (fieldArr[i] == "US_WELL" || fieldArr[i] == "US_NDEEP"
                    //  || fieldArr[i] == "US_WDEEP" || fieldArr[i] == "US_WDIA"  || fieldArr[i] == "US_WDIA"
                    //  || fieldArr[i] == "US_PLATE" || fieldArr[i] == "US_PSIZE" || fieldArr[i] == "US_PMATER"
                    //  || fieldArr[i] == "US_WMATER"|| fieldArr[i] == "US_ANGLE"|| fieldArr[i] == "US_OFFSET")){
                    //  continue;
                    // }
                    if(fieldArr[i] == "X"){
                        fieldCaption = "X坐标";
                        fieldValue = X;
                    }else if(fieldArr[i] == "Y"){
                        fieldCaption = "Y坐标";
                        fieldValue = Y;
                    }
                    if(Number(fieldValue) && (fieldArr[i] == "US_PT_ALT" || fieldArr[i] == "US_NDEEP"
                        || fieldArr[i] == "US_WDEEP" || fieldArr[i] == "US_PSIZE" || fieldArr[i] == "US_WDIA"
                        || fieldArr[i] == "US_ANGLE")){
                        fieldValue = parseFloat(fieldValue).toFixed(3);
                    }
                    str += '<tr><td  width="100">&nbsp;&nbsp;&nbsp;&nbsp;' + fieldCaption +'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+fieldValue||""+'</td></tr>';
                }
                htmlStr = htmlStr + str + '</table></div>';
                //高亮
                // highlightObject(layerID, type, guid, key);
                if(obj != null){
                    var vecCenter = obj.SphericalTransform;
                    parent.showHtmlBalloon(vecCenter.Longitude, vecCenter.Latitude, vecCenter.Altitude, htmlStr);
                }
            }
        }
        earth.DatabaseManager.GetXml(strConn);
    };

    var initLineValue = function (layerID, record, layerName){
        var layer=earth.LayerManager.GetLayerByGUID(layerID);
        var intLayerCode = layer.PipeLineType;
        var fieldArr = [];
        if(intLayerCode >= 1000 && intLayerCode < 2000){//电力管线
            fieldArr = parent.PS2_config.LineProperty.DLLINE;
        }else if(intLayerCode >= 2000 && intLayerCode < 3000){//电信
            fieldArr = parent.PS2_config.LineProperty.DXLINE;
        }else if(intLayerCode >= 3000 && intLayerCode < 4000){//给水
            fieldArr = parent.PS2_config.LineProperty.JSLINE;
        }else if(intLayerCode >= 4000 && intLayerCode < 5000){//排水
            fieldArr = parent.PS2_config.LineProperty.PSLINE;
        }else if(intLayerCode >= 5000 && intLayerCode < 6000){//燃气
            fieldArr = parent.PS2_config.LineProperty.RQLINE;
        }else if(intLayerCode >= 6000 && intLayerCode < 7000){//热力
            fieldArr = parent.PS2_config.LineProperty.RLLINE;
        }else if(intLayerCode >= 7000 && intLayerCode < 8000){//工业
            fieldArr = parent.PS2_config.LineProperty.GYLINE;
        }else{//其他
            fieldArr = parent.PS2_config.LineProperty.DEFAULTLINE;
        }

        var str = "";
        for(var i = 0; i < fieldArr.length; i++){
            var fieldCaption = getName(fieldArr[i],1,false);    //显示字段
            var fieldName = getName(fieldArr[i],1,true);//数据库字段
            var fieldValue = record[fieldName]||"";
            if(fieldArr[i] == "US_SIZE" && fieldValue.indexOf('X') == -1){
                fieldValue = parseFloat(parseFloat(fieldValue).toFixed(2));
            }
            str += '<tr><td  width="100">&nbsp;&nbsp;&nbsp;&nbsp;' + fieldCaption +'</td><td>&nbsp;&nbsp;&nbsp;&nbsp;'+fieldValue||""+'</td></tr>';
        }

        return str;
    };

//清除双击高亮
var clearHighLight = function() {
        if (dbClickHighLight.length > 0 && earth != null) {
            dbClickHighLight[0].StopHighLight();
        }
    }
    /**
     * 功能：显示结果
     * 参数：checkTag-checkbox选中状态 ,highlightObjectList-高亮对象数组
     * 返回值：无
     */

function analysisShowResult(checkTag, highlightObjectList) {
    northArr = [];
    southArr = [];
    eastArr = [];
    westArr = [];
    chkArr = highlightObjectList;
    if (checkTag) {
        chkFlag = "true";
        isShowResult = true;
        for (var i = 0; i < highlightObjectList.length; i++) {
            if (i === highlightObjectList.length - 1) {
                showTag = true;
            }
            analysisHighlightObject(highlightObjectList[i].layerId, highlightObjectList[i].type, highlightObjectList[i].guid, highlightObjectList[i].key, "true");
        }
    } else {
        chkFlag = "false";
        showTag = false;
        for (var i = 0; i < hidenArr.length; i++) {
            if (hidenArr[i]) {
                hidenArr[i].StopHighLight();
            }
        }
        hidenArr = [];
    }
    isShowResult = false;
};

function stopHideArrObj() {
    if (hidenArr && hidenArr.length) {
        for (var i = 0; i < hidenArr.length; i++) {
            if (hidenArr[i]) {
                hidenArr[i].StopHighLight();
            }
        }
    }
}

//计算两个线之间的距离
function lineToline(line1, line2) {
    var line1Arr = line1.split(" ");
    for (var i = 0; i < line1Arr.length; i++) {
        line1Arr[i] = line1Arr[i].split(",");
    }
    var line2Arr = line2.split(",");
    var points1 = earth.Factory.CreateVector3s();
    for (var i = 0; i < line1Arr.length; i++) {
        points1.Add(line1Arr[i][0], line1Arr[i][1], line1Arr[i][2]);
    }
    var points2 = earth.Factory.CreateVector3s();
    for (var i = 0; i < line2Arr.length; i += 3) {
        points2.Add(line2Arr[i], line2Arr[i + 1], line2Arr[i + 2]);
    }
    var result = earth.GeometryAlgorithm.CalculateLineLineDistance(points1, points2);
    if (result === null) {
        return 0;
    } else {
        return result.Length;
    }

}
//点到建筑底面的距离
function lineToPoylon(line, polygon) {
    var lineArr = line.split(" ");
    for (var i = 0; i < lineArr.length; i++) {
        lineArr[i] = lineArr[i].split(",");
    }
    var points = earth.Factory.CreateVector3s();
    for (var i = 0; i < lineArr.length; i++) {
        points.Add(lineArr[i][0], lineArr[i][1], lineArr[i][2]);
    }
    var result = earth.GeometryAlgorithm.CalculateLinePolygonDistance(line, polygon);
    if (result === null) { //面和线相交
        return 0;
    } else {
        return result.Length;
    }
}
/***********************************************************************************************************************/
