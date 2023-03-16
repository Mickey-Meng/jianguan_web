///**
// * 功能：“地下浏览”(开始菜单)菜单点击事件
// * 参数：无
// * 返回：无
// */
//var undergroundViewClick = function(){
//	var eventObj = $("div[tag='DefUndergroundView']");
//	if(eventObj.hasClass("selected") === false){
//		eventObj.addClass("selected");
//		undergroundModeCtrl();
//	}else{
//		eventObj.removeClass("selected");
//		undergroundModeCancel();
//	}
//};

/**
 * 功能：“地下浏览”(浏览菜单)菜单点击事件
 * 参数：无
 * 返回：无
 */
var undergroundModeClick = function(){
    var eventObj = $("div[tag='ViewUndergroundMode']");
    if(eventObj.hasClass("selected") === false){
        eventObj.addClass("selected");
        undergroundModeCtrl();
    }else{
        eventObj.removeClass("selected");
        undergroundModeCancel();
    }
};
/**
 * 功能：“数据隐藏”菜单点击事件
 * 参数：无
 * 返回：无
 */

function hiddenLayer(eventObj){
    var loadPath = earth.Environment.RootPath + "temp\\PipeData.xml";
    var PipeDataXml = earth.UserDocument.LoadXmlFile(loadPath);
    var PipeLineDataDoc =loadXMLStr(PipeDataXml);
    var pipeLIneNodes=PipeLineDataDoc.getElementsByTagName("PipeLineId");

    if(pipeLIneNodes==null||pipeLIneNodes.length==0){
        alert("请先导入数据");
        eventObj.removeClass("selected");
        return;
    }else{
        var pipeLineGuid=pipeLIneNodes[0].text;
        var pipeId=pipeLineGuid;
        var layer=earth.LayerManager.LayerList;
        layer.Visibility=false;
        var layerObj = earth.LayerManager.GetLayerByGUID(pipeId);
        layerObj.Visibility=true;
    }
}
function showLayer(){
    var tree = $.fn.zTree.getZTreeObj("pipelineLayerTree") ;
    var nodes = tree.getNodes();
    if(nodes.length>0){
        if(nodes[0].check_Child_State === -1){
            var layer=earth.LayerManager.GetLayerByGUID(nodes[0].id);
            layer.Visibility=true;
        }  else{
            for(var i=0;i<nodes[0].children.length;i++){
                var layer=earth.LayerManager.GetLayerByGUID(nodes[0].children[i].id);
                layer.Visibility=true;
            }
        }
    }
}
var dataHiddenClick = function(){
    var eventObj = $("div[tag='dataHidden']");
    if(eventObj.hasClass("selected") === false){
        eventObj.addClass("selected");
        hiddenLayer(eventObj);
    }else{
        eventObj.removeClass("selected");
        showLayer();
    }
}
/**
 * 功能：地下浏览模式
 * 参数：无
 * 返回：无
 */
var undergroundModeCtrl = function(){
    earth.GlobeObserver.UndergroundMode = true;
};

/**
 * 功能：取消地下浏览模式
 * 参数：无
 * 返回：无
 */
var undergroundModeCancel = function(){
    earth.GlobeObserver.UndergroundMode = false;
    earth.Event.OnObserverChanged = function(){	};
};

//-----------------------------------------------------------------------------------------

/**
 * 功能：“开启碰撞”菜单点击事件
 * 参数：无
 * 返回：无
 */
var openCollisionClick = earthCtx.openCollisionClick = function(){
    var eventObj = $("div[tag='ViewOpenCollision']");
    if(eventObj.hasClass("selected") === false){
        eventObj.addClass("selected");
        openCollisionCtrl();
    }else{
        eventObj.removeClass("selected");
        openCollisionCancel();
    }
};

/**
 * 功能：开启碰撞模式
 * 参数：无
 * 返回：无
 */
var openCollisionCtrl = function(){
    earth.GlobeObserver.IntersectModel = true;
};

/**
 * 功能：关闭碰撞模式
 * 参数：无
 * 返回：无
 */
var openCollisionCancel = function(){
    earth.GlobeObserver.IntersectModel = false;
};

//-----------------------------------------------------------------------------------------

/**
 * 功能：“坐标定位”菜单点击事件
 * 参数：无
 * 返回：无
 */
var coordLocationClick = function(){
    var htmlBalloonMoveHidden = false;
    var params = {
        earth: earth  ,
        project:SYSTEMPARAMS.project
    };
    //openDialog("html/view/coordLocation.html", params, 320, 200);

    var htmlBalloonMove = null;
    earth.Event.OnHtmlNavigateCompleted = function () { };
    var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
    var url = "";
    var width = 280, height = 220;
    url = loaclUrl + "/html/view/coordLocation.html";
    if (url === ""){
        return;
    }
    if (picturesBalloons != null) {
        picturesBalloons.DestroyObject();
        picturesBalloonsHidden = false;
        picturesBalloons = null;
    }
    if (transparencyBalloons != null) {
        transparencyBalloons.DestroyObject();
        transparencyBalloonsHidden = false;
        transparencyBalloons = null;
        $("div[tag='ViewTranSetting']").removeClass("selected");
        $("div[tag='EffectFog']").removeClass("selected");
        $("div[tag='EffectSnow']").removeClass("selected");
        $("div[tag='EffectRain']").removeClass("selected");
    }
    if (htmlBalloonXY != null) {
        htmlBalloonXY.DestroyObject();
        htmlBalloonXYHidden = false;
        htmlBalloonXY = null;
    }
    if (htmlBalloonMove != null) {
        htmlBalloonMove.DestroyObject();
        htmlBalloonMoveHidden = false;
        htmlBalloonMove = null;
    }
    htmlBalloonMove = earth.Factory.CreateHtmlBalloon(earth.Factory.CreateGuid(), "屏幕坐标窗体");
    htmlBalloonMove.SetScreenLocation(0, 0);//earth.offsetHeight
    htmlBalloonMove.SetRectSize(width, height);
    htmlBalloonMove.SetIsAddBackgroundImage(false);
    htmlBalloonMove.ShowNavigate(url);
    earth.Event.OnDocumentReadyCompleted = function (guid) {
        earth.htmlBallon = htmlBalloonMove;
      //  earth.params = params;
        earth.ifEarth = window.frames.ifEarth;
        earth.userdataTemp = userdataTemp;
     //   earth.spatial = STAMP_config.spatial;
        earth.userdataTree = $.fn.zTree.getZTreeObj("userdataTree");
        //htmlBalloonMove.InvokeScript("getEarth", earth);
        //earth.Event.OnHtmlNavigateCompleted = function (){};
        if (htmlBalloonMove === null) {
            return;
        }
        if (htmlBalloonMove.Guid == guid) {
            htmlBalloonMove.InvokeScript("getEarth", earth);
            //htmlBalloonMove.InvokeScript("getAnalysis", STAMP.Analysis(earth));
        }
    };
    //deleted by zhangd-2015-03-12-13:53--所有气泡关闭事件均修改为下面的回调方式
    // earth.Event.OnHtmlBalloonFinished = function (id) {
    //     if (htmlBalloonMoveHidden == false && htmlBalloonMove != null && id === htmlBalloonMove.Guid) {
    //         htmlBalloonMove.DestroyObject();
    //         htmlBalloonMove = null;
    //         earth.Event.OnHtmlBalloonFinished = function () { };
    //     }
    // };
    OnHtmlBalloonFinishedFunc(htmlBalloonMove.Guid, function(id){
        if (htmlBalloonMoveHidden == false && htmlBalloonMove != null && id === htmlBalloonMove.Guid) {
            htmlBalloonMove.DestroyObject();
            htmlBalloonMove = null;
            // earth.Event.OnHtmlBalloonFinished = function () { };
        }
    });
};

//----------------------------------------------------------------

/**
 * 功能：加载人行浏览/车行浏览对象
 * 参数：objectId-浏览对象的ID编号;
 * 返回值：无
 */
var loadLookObject = function(objectId){
    earth.Event.OnCreateGeometry = function(position){
        if(position == null){
            return;
        }

        viewModeCtrl(true); //控制“飞行浏览”、“人行浏览”、“车行浏览”菜单不可用
        //加载浏览对象
        earth.Event.OnDocumentChanged = function(){
            var lookatObj = earth.DynamicSystem.GetSphericalObject(objectId);
            if(lookatObj == null){
                return;
            }
            var lon = position.Longitude;
            var lat = position.Latitude;
            var alt = position.Altitude;
            var heading = earth.GlobeObserver.Pose.Heading;
            lookatObj.SphericalTransform.SetPose(lon, lat, alt, heading, 0, 0);
            earth.GlobeObserver.StartTracking(objectId, 2);
            earth.Event.OnDocumentChanged = function(){};
        };
        earth.DynamicSystem.LoadDynamicObject(objectId);

        //添加右键事件-鼠标右键单击时卸载浏览对象
        earth.Event.OnRBDown = function(point){
            var lookatObj = earth.DynamicSystem.GetSphericalObject(objectId);
            if(lookatObj == null){
                return;
            }
            earth.GlobeObserver.StopTracking();
            earth.GlobeObserver.Stop();
            earth.DynamicSystem.UnLoadDynamicObject(objectId);
            viewModeCtrl(false); //恢复“飞行浏览”、“人行浏览”、“车行浏览”菜单可用
            earth.Event.OnRBDown = function(){};
        };
        earth.Event.OnCreateGeometry = function(){};
    };
    earth.ShapeCreator.CreatePoint();
};

/**
 * 功能：控制“飞行浏览”、“人行浏览”和“车行浏览”是否可用
 * 参数：isDisabled - 是否不可用（true表示不可用， false表示可用）
 * 返回：无
 */
var viewModeCtrl = function(isDisabled){
    if(SYSTEMPARAMS.flyObject != ""){
        $("div.toolbar-item[tag='ViewFlyMode']").customAttr("disabled", isDisabled);
    }
    if(SYSTEMPARAMS.peopleObject != ""){
        $("div.toolbar-item[tag='ViewPersonMode']").customAttr("disabled", isDisabled);
    }
    if(SYSTEMPARAMS.dynamicObject != ""){
        $("div.toolbar-item[tag='ViewCarMode']").customAttr("disabled", isDisabled);
    }
};

/**
 * 功能：“人行浏览”菜单点击事件
 * 参数：无
 * 返回：无
 */
var personModeClick = function(){
    var systemConfig = SYSTEMPARAMS;
    var peopleOjb = systemConfig.peopleObject;
    if((peopleOjb === null)||(peopleOjb === "")){
        alert("请先设置人行对象");
        return;
    }
    loadLookObject(peopleOjb);
};

/**
 * 功能：“车行浏览”菜单点击事件
 * 参数：无
 * 返回：无
 */
function carModeClick(){
    var systemConfig = SYSTEMPARAMS;
    var carObj = systemConfig.dynamicObject;
    if((carObj === null)||(carObj === "")){
        alert("请先设置车行对象");
        return;
    }
    loadLookObject(carObj);
};

//----------------------------------------------------------------
/**
 * 功能：初始化球体对象
 * 参数：newEarth-球体对象
 * 返回值：无
 */
var initNewEarth = function (newEarth){
    newEarth.Event.OnCreateEarth = function(pval){
        var serverIp = window.ifEarth.params.ip;
        var fileIndex = window.ifEarth.params.screen;
        newEarth.Load(serverIp, fileIndex);
        linkPose(earth,newEarth);
    };
};

/**
 * 功能：创建球体对象
 * 参数：name-球体Id编号
 * 返回值：球体对象
 */
var createEarthObj = function(name){
    var objStr = '';
    objStr = objStr + '<OBJECT id="' + name + '"';
    objStr = objStr + '	data=data:application/x-oleobject;base64,Xy0TLBTXH0q8GKFyFzl3vgAIAADYEwAA2BMAAA== ';
    objStr = objStr + '	classid="clsid:EA3EA17C-5724-4104-94D8-4EECBD352964" ';
    objStr = objStr + '	codebase="UniBrowser_2.8.9_new/testearth.CAB" ';
    objStr = objStr + '	VIEWASTEXT width="100%" height="100%"> ';
    objStr = objStr + '</OBJECT>';
    return objStr;
};

/**
 * 功能：双屏显示
 * 参数：无
 * 返回：无
 */
var doubleScreenCtrl = function(){
    var ifEarthDoc = window.ifEarth.document;
    $("#usearthDiv",ifEarthDoc).css("width","50%");

    $("#usearthDiv1",ifEarthDoc).show();
    var earthStr = createEarthObj("usearth1");
    $("#usearthDiv1",ifEarthDoc).css("width","50%");
    $("#usearthDiv1",ifEarthDoc).html(earthStr);
    var newEarth = ifEarthDoc.getElementById("usearth1");
    initNewEarth(newEarth);
};

/**
 * 功能：取消双屏显示，恢复单屏
 * 参数：无
 * 返回：无
 */
var doubleScreenCancel = function(){
    screenLinkCancel();
    var ifEarthDoc = window.ifEarth.document;
    var newEarth = ifEarthDoc.getElementById("usearth1");
    newEarth.Suicide(); //销毁球体

    $("#usearthDiv1",ifEarthDoc).empty();
    $("#usearthDiv1",ifEarthDoc).addClass("hide");
    $("#usearthDiv",ifEarthDoc).css("width","100%");
};

/**
 * 功能：“双屏对比”菜单点击事件
 * 参数：无
 * 返回：无
 */
var doubleScreenClick = function(){
    var eventObj = $("div[tag='ViewDoubleScreen']");
    if(eventObj.hasClass("selected") === false){
        eventObj.addClass("selected");
        doubleScreenCtrl();
        $("div[tag='ViewScreenLink']").customAttr("disabled",false);
        $("div[tag='ViewScreenSetting']").customAttr("disabled",false);
    }else{
        eventObj.removeClass("selected");
        $("div[tag='ViewScreenLink']").removeClass("selected");
        doubleScreenCancel();
        $("div[tag='ViewScreenLink']").customAttr("disabled",true);
        $("div[tag='ViewScreenSetting']").customAttr("disabled",true);
    }
};
//----------------
/**
 * 功能：联动定位
 * 参数：earthIndex-主动球体索引；count-球体个数
 * 返回值：无
 */
var linkPose = function(earthObj,earthObj1){
    var earthPose = earthObj.GlobeObserver.Pose;
    var lon = earthPose.Longitude;
    var lat = earthPose.Latitude;
    var alt = earthPose.Altitude;
    var tilt = earthPose.Tilt;
    var heading = earthPose.Heading;
    var roll = earthPose.Roll;
    earthObj1.GlobeObserver.GotoLookat(lon, lat, alt, heading, tilt, roll, 0);
};

/**
 * 功能：通过事件绑定使球体联动
 * 参数：球体列表
 * 返回值：无
 */
var link = function(earthObj,earthObj1){
    earthObj.Event.OnObserverChanged = function(){
        linkPose(earthObj,earthObj1);
    };

    earthObj1.Event.OnObserverChanged = function(){};
    earthObj1.Event.OnLBDown = function(){
        link(earthObj1,earthObj);
    };
};

/**
 * 功能：联动控制
 * 参数：无
 * 返回值：无
 */
var screenLinkCtrl = function(){
    var ifEarthDoc = window.ifEarth.document;
    var earth1 = ifEarthDoc.getElementById("usearth1");

    earth.Event.OnLBDown = function(){
        link(earth,earth1);
    };

    earth1.Event.OnLBDown = function(){
        link(earth1,earth);
    };
    linkPose(earth,earth1);
};

/**
 * 功能：取消联动控制
 * 参数：无
 * 返回值：无
 */
var screenLinkCancel = function(){
    var ifEarthDoc = window.ifEarth.document;
    var earth1 = ifEarthDoc.getElementById("usearth1");
    earth.Event.OnLBDown = function(){};
    earth.Event.OnObserverChanged = function(){};

    earth1.Event.OnLBDown = function(){};
    earth1.Event.OnObserverChanged = function(){};
};

/**
 * 功能：“双屏联动”菜单点击事件
 * 参数：无
 * 返回：无
 */
var screenLinkClick = function(){
    var eventObj = $("div[tag='ViewScreenLink']");
    if(eventObj.hasClass("selected") === false){
        eventObj.addClass("selected");
        screenLinkCtrl();
    }else{
        eventObj.removeClass("selected");
        screenLinkCancel();
    }
};
//--------------

/**
 * 功能：“双屏设置”菜单点击事件
 * 参数：无
 * 返回：无
 */
var screenSettingClick = function(){
    var ifEarthDoc = window.ifEarth.document;
    var newEarth = ifEarthDoc.getElementById("usearth1");
    var params = {
        earth1: earth,//屏幕一地球对象
        earth2: newEarth //屏幕二地球对象
    };
    openDialog("html/view/screenSetting.html",params,500,500);
};
//-----------------------------------------------------------------------------------------
// 二维联动 - 开始
//-----------------------------------------------------------------------------------------
var OnEarthChanged = function(x, y, h){ ////比例尺
    //这里要修改第三个参数是高程 最后的一个参数是range 它才是摄像机到目标的距离
    var altitude = earth.Measure.MeasureTerrainAltitude(x, y);
    earth.GlobeObserver.GotoLookat(x, y, altitude, 0, 90, 0, h);
};

/**
 * 功能：取消三维球体转动事件
 * 参数：无
 * 返回：无
 */
var UnRegisterEarthChanged = function(){
    earth.Event.OnLBDown = function(){};
    earth.Event.OnObserverChanged = function(){};
    document.getElementById('dlgScreen2D').focus();
    registerEarthChaned();
};

/**
 * 功能：设置三维球体转动事件
 * 参数：无
 * 返回：无
 */
var registerEarthChaned = function(){
    earth.Event.OnLBDown = function(){
        earth.Event.OnObserverChanged = function(){
            //var datum = CoordinateTransform.getSystemDatum();
            var earthPose = earth.GlobeObserver.TargetPose;
            var lon = earthPose.Longitude;
            var lat = earthPose.Latitude;
            var alt =  earth.GlobeObserver.Pose.Altitude;
            window.ifScreen2D.OnMapChanged(lon, lat, alt);
        };
        if(typeof(window.ifScreen2D.UnRegisterMapChanged) != "undefined"){
             window.ifScreen2D.UnRegisterMapChanged();
        }
    };
};

// /**
//  * 功能：显示二维鹰眼窗体----已废弃
//  * 参数：无
//  * 返回：无
//  */
// var screen2DCtrl = function(){
//       var loaclUrl = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
//         var url = loaclUrl + "/Pipeline2D/index.html"; //ShowNavigate只能用绝对路径
//     //var localUrl = params.link2D;//"http://192.168.10.242:8080/Pipeline2D";//SYSTEMPARAMS.link2D;
//     if(!isHaveScreen2D(url)){
//         alert("找不到二维地址");
//         return;
//     }
//     var earthPose = earth.GlobeObserver.TargetPose;
//     var lon = earthPose.Longitude;
//     var lat = earthPose.Latitude;
//     var alt =  earth.GlobeObserver.Pose.Altitude / 1000;
//     //showLittleDialog(localUrl+"/overview.html?"+lon+","+lat+","+alt, "二维鹰眼");
//     showLittleDialog(url, "二维鹰眼");
//     earth.Event.OnObserverChanged = function(){
//         var earthPose = earth.GlobeObserver.TargetPose;
//         var lon = earthPose.Longitude;
//         var lat = earthPose.Latitude;
//         var alt = earthPose.Altitude;
//         //var alt =  earth.GlobeObserver.Pose.Range / 1000;
//         var xy=CoordinateTransform.getSystemDatum().des_BLH_to_src_xy(lon, lat, alt);;
//         if(window.ifFunc!=null&&window.ifFunc!=undefined){
//             window.ifFunc.overview(xy.x, xy.y);
//             //window.ifFunc.overview(lon,lat,alt);
//         }
//     };
// };

function isHaveScreen2D(fileURL) {

var xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
xmlhttp.open("GET",fileURL,false);
xmlhttp.send();
if(xmlhttp.readyState==4){
if(xmlhttp.status==200) return true; //存在
else if(xmlhttp.status==404)  return false; //不存在
else false //报错
//其他状态
}
}
// /**
//  * 功能：取消二维鹰眼窗体 ---已废弃
//  * 参数：无
//  * 返回：无
//  */
// var screen2DCancel = function(){
//     // 对话框窗口关闭时清除地球的事件
//     earth.Event.OnObserverChanged = function(){};
//     showLittleDialog("", "");
//     hideLittleDialog();
// };

/**
 * 功能：“二维鹰眼”菜单点击事件
 * 参数：无
 * 返回：无
 */
var screen2DClick = function(){
    var eventObj = $("div.toolbar-item[tag='Hawkeye2D']");
    if(eventObj.hasClass("selected") === false){
        eventObj.addClass("selected");
        // screen2DCtrl();
        earth.Environment.Thumbnail = true;//二维鹰眼开关
    }else{
        eventObj.removeClass("selected");
        // screen2DCancel();
        earth.Environment.Thumbnail = false;
    }
};

/**
 * 功能：显示二维窗体
 * 参数：src-二维窗体的url地址；width-窗体宽度；height-窗体高度；left-窗体左边位置；top-窗体上端位置
 * 返回：无
 */
var show2DEarth = function(src, width, height, left, top){
    var earthPose = earth.GlobeObserver.TargetPose;
    var lon = earthPose.Longitude;
    var lat = earthPose.Latitude;
    var alt =  earth.GlobeObserver.Pose.Altitude;
    src = src+"?"+lon+","+lat+","+alt;
    if($("#dlgScreen2D").panel("options").closed){
        $("#dlgScreen2D").dialog({
            shadow:false,
            draggable:false,
            title:"",
            onClose:close2DEarth
        }).panel({width:width, height:height})
            .panel("move", {top:top+"px", left:left + "px"});
        $("#ifScreen2D").customAttr("src", src);
        registerEarthChaned();
    }else{
        $("#dlgScreen2D").panel("resize", {width:width,height:height})
            .panel("move", {top:top+"px", left:left + "px"});
    }
};

var close2DEarth = function(){
    // 对话框窗口关闭时清除地球的事件
    earth.Event.OnLBDown = function(){};
    earth.Event.OnObserverChanged = function(){};

    //判断“二维联动”按钮是否处于选中状态，如果处于选中状态，则恢复非选中状态
    var eventObj = $("div.toolbar-item[tag='ViewScreen2DLink']");
    if(eventObj.hasClass("selected") === true){
        screen2DLinkCancel();
    }

    //判断“二维全屏”按钮是否处于选中状态，如果处于选中状态，则恢复非选中状态
    var eventObj = $("div.toolbar-item[tag='ViewFullScreen2D']");
    if(eventObj.hasClass("selected") === true){
        fullScreen2DCancel();
    }
    $("#ifScreen2D").customAttr("src", "");
};

/**
 * 功能：显示二维联动窗体
 * 参数：无
 * 返回：无
 */
var screen2DLinkCtrl = function(){
    var localUrl = SYSTEMPARAMS.link2D;
    if((localUrl === null)||(localUrl === "")){
        alert("请先设置二维地址");
        return;
    }

    //判断“二维全屏”按钮是否处于选中状态，如果处于选中状态，则恢复非选中状态
    var eventObj = $("div.toolbar-item[tag='ViewFullScreen2D']");
    if(eventObj.hasClass("selected") === true){
        fullScreen2DCancel();
    }

    var ifEarthDoc = window.ifEarth.document;
    $("#usearthDiv",ifEarthDoc).css("width","50%");
    var earthWidth = ifEarthDoc.body.clientWidth/2;
    var earthHeight = ifEarthDoc.body.clientHeight + 1;
    show2DEarth(localUrl,earthWidth,earthHeight,250 + earthWidth,113);
};

/**
 * 功能：取消二维联动窗体，恢复二维鹰眼状态
 * 参数：无
 * 返回：无
 */
var screen2DLinkCancel = function(){
    $("div.toolbar-item[tag='ViewScreen2DLink']").removeClass("selected");
    var ifEarthDoc = window.ifEarth.document;
    $("#usearthDiv",ifEarthDoc).css("width","100%");
};

/**
 * 功能：“二维联动”菜单点击事件
 * 参数：无
 * 返回：无
 */
var screen2DLinkClick = function(){
    //“二维联动”菜单点击事件
    var eventObj = $("div.toolbar-item[tag='ViewScreen2DLink']");
    if(eventObj.hasClass("selected") === false){
        eventObj.addClass("selected");
        screen2DLinkCtrl();
    }else{
        $("#dlgScreen2D").dialog({}).dialog("close");
    }
};

/**
 * 功能：全屏显示二维窗体
 * 参数：无
 * 返回：无
 */
var fullScreen2DCtrl = function(){
    var localUrl = SYSTEMPARAMS.link2D;
    if((localUrl === null)||(localUrl === "")){
        alert("请先设置二维地址");
        return;
    }

    //判断“二维联动”按钮是否处于选中状态，如果处于选中状态，则恢复非选中状态
    var eventObj = $("div.toolbar-item[tag='ViewScreen2DLink']");
    if(eventObj.hasClass("selected") === true){
        screen2DLinkCancel();
    }

    var ifEarthDoc = window.ifEarth.document;
    $("#usearthDiv",ifEarthDoc).css("display","none");
    var earthWidth = ifEarthDoc.body.clientWidth;
    var earthHeight = ifEarthDoc.body.clientHeight + 1;
    show2DEarth(localUrl,earthWidth,earthHeight,250,113);
};

/**
 * 功能：取消二维全屏窗体，恢复二维鹰眼状态
 * 参数：无
 * 返回：无   116.82302375  39.95076453
 */
var fullScreen2DCancel = function(){
    $("div.toolbar-item[tag='ViewFullScreen2D']").removeClass("selected");
    var ifEarthDoc = window.ifEarth.document;
    $("#usearthDiv",ifEarthDoc).css("display","");
};

/**
 * 功能：“二维全屏”菜单点击事件
 * 参数：无
 * 返回：无
 */
var fullScreen2DClick = function(){
    var eventObj = $("div.toolbar-item[tag='ViewScreen2DLink']");
    var eventObj2DGroup = $("div.toolbar-item[tag='ViewScreen2D']");
    var eventObjClick = $("div.toolbar-item[tag='ViewFullScreen2D']");
    if(eventObjClick.hasClass("selected") === false){
        eventObjClick.addClass("selected");
        eventObj.removeClass("selected");
        eventObj2DGroup.removeClass("selected");
        earth.Environment.Mode2DEnable = true;
        ifEarth.setScreen(1,"",false);
        ifEarth.setSync(false);
        isShowMap(true,earth);
    }else{
        eventObjClick.removeClass("selected");
        ifEarth.setScreen(1,"",false);
        ifEarth.setSync(false);
        earth.Environment.Mode2DEnable = false;
        isShowMap(false,earth);
    }
};

/**
 * 功能：全屏显示二三维组合数据
 * 参数：无
 * 返回：无
 */
var fullScreen2DGroup = function(){
    var eventObj = $("div.toolbar-item[tag='ViewScreen2DLink']");
    var eventObj2DGroup = $("div.toolbar-item[tag='ViewScreen2D']");
    var eventObjClick = $("div.toolbar-item[tag='ViewFullScreen2D']");
    earth.Environment.Mode2DEnable = false;
    if(eventObj2DGroup.hasClass("selected") === false){
        eventObj2DGroup.addClass("selected");
        eventObjClick.removeClass("selected");
        eventObj.removeClass("selected");
        ifEarth.setScreen(1,"",false);
        ifEarth.setSync(false);
        isShowMap(true,earth);
    }else{
        eventObj2DGroup.removeClass("selected");
        ifEarth.setScreen(1,"",false);
        ifEarth.setSync(false);
        earth.Environment.Mode2DEnable = false;
        isShowMap(false,earth);
    }
};

/**
 * 功能：“二维联动”菜单点击事件
 * 参数：无
 * 返回：无
 */
var screen2D = function(){
    //“二维联动”菜单点击事件
    var eventObj = $("div.toolbar-item[tag='ViewScreen2DLink']");
    var eventObj2DGroup = $("div.toolbar-item[tag='ViewScreen2D']");
    var eventObjClick = $("div.toolbar-item[tag='ViewFullScreen2D']");
    if(eventObj.hasClass("selected") === false){
        eventObj.addClass("selected");
        eventObjClick.removeClass("selected");
        eventObj2DGroup.removeClass("selected");
        ifEarth.setScreen(2,0,true);
    }else{
        eventObj.removeClass("selected");
        ifEarth.setScreen(1,0,false);
        ifEarth.setSync(false);
        earth.Environment.Mode2DEnable = false;
    }
};

//是否显示二位地图
var isShowMap = function(show,earthArr){
    var layerTree = $.fn.zTree.getZTreeObj("layerTree");
    var rootLayerList = earth.LayerManager.LayerList;
    var projectCount = rootLayerList.GetChildCount();
    for(var i = 0; i < projectCount; i++){
        var childLayer = rootLayerList.GetChildAt(i);
        var layerType = childLayer.LayerType;
        if(layerType === "Project"){  //17
            var projectId = childLayer.Guid;
            var projectName = childLayer.Name;
            var chlildrenCount = childLayer.GetChildCount();
            for(var x=0;x<chlildrenCount;x++){
                var mapchildLayer = childLayer.GetChildAt(x);
                var maplayerType = mapchildLayer.LayerType;
                if(maplayerType != "Folder" && maplayerType != null && (maplayerType.toLowerCase() === "map" || maplayerType.toLowerCase() === "wms")){
                    var treeNode = layerTree.getNodeByParam("id",mapchildLayer.Guid);
                    layerTree.checkNode(treeNode, show, null);
                    var layer = earthArr.LayerManager.GetLayerByGUID(mapchildLayer.Guid);
                    layer.Visibility = show;
                    var childWmsLayerCount = mapchildLayer.GetChildCount();
                    if(childWmsLayerCount>0){
                        for(var k=0;k<childWmsLayerCount;k++){
                            var childWmsLayer = mapchildLayer.GetChildAt(k);
                            var wmslayerType = childWmsLayer.LayerType;
                            if(wmslayerType != null && (wmslayerType.toLowerCase() === "map" || wmslayerType.toLowerCase() === "wms")){
                                var treeNodeWms = layerTree.getNodeByParam("id",childWmsLayer.Guid);
                                layerTree.checkNode(treeNodeWms, show, null);
                                var layerWms = earthArr.LayerManager.GetLayerByGUID(childWmsLayer.Guid);
                                if(layerWms){
                                    layerWms.Visibility = show;
                                }
                            }
                        }


                    }
                }
                if(maplayerType === "Folder"){
                    var threeLayerCount = mapchildLayer.GetChildCount();
                    for(var s=0;s<threeLayerCount;s++){
                        var threechildLayer = mapchildLayer.GetChildAt(s);
                        var threemaplayerType = threechildLayer.LayerType;
                        if(threemaplayerType != null && (threemaplayerType.toLowerCase() === "map" || threemaplayerType.toLowerCase() === "wms")){
                            var treeNode = layerTree.getNodeByParam("id",threechildLayer.Guid);
                            //layerTree.checkNode(treeNode, false, false);
                            layerTree.checkNode(treeNode, show, null);
                            //alert(earthArr.LayerManager + " " + threechildLayer.Guid);
                            var layer = earthArr.LayerManager.GetLayerByGUID(threechildLayer.Guid);
                            if(layer)            {
                                layer.Visibility = show;
                            }
                        }
                    }
                }
            }
        }
    }
}

//-----------------------------------------------------------------------------------------
//二维联动 - 结束
//-----------------------------------------------------------------------------------------
