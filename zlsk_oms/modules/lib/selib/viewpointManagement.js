var viewpointDoc = null; //视点列表dom对象
var viewFlag = null; //视图类型标识(L为列表视图；M为缩略图视图)
var currIndex = null; //当前选择的数据索引

/**
 * 功能：获取xml文件的Doc对象
 * 参数：fileName-文件名(不包含后缀)
 * 返回值：xml文件的dom对象
 */
var getXmlFileDoc = function(fileName){
	var loadPath = earth.Environment.RootPath + "viewpoint\\" + fileName + ".xml";
	var fileXml = earth.UserDocument.LoadXmlFile(loadPath);
	var fileDoc = loadXMLStr(fileXml);
	return fileDoc;
};

/**
 * 功能：保存xml文件的Doc字符串
 * 参数：fileName-文件名(不包含后缀)；fileDocXml-要保存的信息
 * 返回值：无
 */
var saveXmlFileDoc = function(fileName,fileDocXml){
	var savePath = earth.Environment.RootPath + "viewpoint\\" + fileName;
	earth.UserDocument.SaveXmlFile(savePath, fileDocXml);
};

/**
 * 功能：删除文件
 * 参数：filePath-文件绝对路径
 * 返回值：无
 */
var deleteFile = function(filePath){
	earth.UserDocument.DeleteXmlFile(filePath);
};

/**
 * 功能：创建视点列表文件
 * 参数：fileName-文件名(不包含后缀)
 * 返回值：无
 */
var createViewpointFile = function(fileName){
	var id = earth.Factory.CreateGuid();
	var xmlStr = '<xml><ViewpointList id="' + id + '" name="viewpoints"/></xml>';
	saveXmlFileDoc(fileName, xmlStr);
	return xmlStr;
};

/**
 * 功能：获取视点列表文件的dom对象
 * 参数：fileName-文件名(不包含后缀)
 * 返回值：xml文件的dom对象
 */
var getViewpointDoc = function(fileName){
	var xmlDoc = getXmlFileDoc(fileName);
	if((xmlDoc === null)||(xmlDoc.xml === "")){
		var xmlStr = createViewpointFile(fileName);
		xmlDoc = loadXMLStr(xmlStr);
	}
	return xmlDoc;
};

/**
 * 功能：视点列表行单击事件
 * 参数：rowIndex-单击的行索引号；rowData-单击的行数据
 * 返回值：无
 */
var tonClickRow = function(rowIndex,rowData){
	currIndex = rowIndex;
};

/**
 * 功能：视点列表行双击事件
 * 参数：rowIndex-双击的行索引号；rowData-双击的行数据
 * 返回值：无
 */
var tonDblClickRow = function(rowIndex,rowData){
	rowIndex = parseInt(rowIndex);
	currIndex = rowIndex;
	var rowNode = viewpointDoc.documentElement.firstChild.childNodes[rowIndex];
	var lon = rowNode.selectSingleNode("Longitude").text;
	var lat = rowNode.selectSingleNode("Latitude").text;
	var alt = rowNode.selectSingleNode("Altitude").text;
	var heading = rowNode.selectSingleNode("Heading").text;
	var tilt = rowNode.selectSingleNode("Tilt").text;
	var roll = rowNode.selectSingleNode("Roll").text;
	var range = rowNode.selectSingleNode("Range").text;
	earth.GlobeObserver.FlytoLookat(lon, lat, alt, heading, tilt, roll, range,3);
};

/**
 * 功能：视点列表行鼠标右键单击事件
 * 参数：event-js 标准事件；rowIndex-双击的行索引号；rowData-双击的行数据
 * 返回值：无
 */
var tonRowContextMenu = function(event,rowIndex, rowData){
	currIndex = rowIndex;
	$("#viewpointList").datagrid("selectRow", rowIndex);
    if(rowData){
        $('#rigMouMenuDiv1').menu('show', {
            left: event.pageX,
            top: event.pageY
        });
    }
    else{
        $("#rigMouMenuDiv").css({"left":event.clientX, "top":event.clientY, "display":""});
    }
};

/**
 * 功能：隐藏子菜单
 * 参数：无
 * 返回值：无
 */
var hiddenRightMenu = function(){
	$("#rigMouMenuDiv").css({"display":"none"});
};

/**
 * 功能：设置视点列表参数
 * 参数：无
 * 返回值：无
 */
var setViewpointListOption = function(){
	$("#viewpointList").datagrid({
		singleSelect: true, //单行选择模式
		onClickRow: tonClickRow,
		onDblClickRow: tonDblClickRow,
		onRowContextMenu: tonRowContextMenu
	});
};

/**
 * 功能：初始化列表视图
 * 参数：无
 * 返回值：无
 */
var initViewpointList = function(){
	     var listDivWidth = document.body.clientWidth;
        $("#viewpointListDiv").width(listDivWidth);
        $("#viewpointImgList").width(listDivWidth);
          var listDivHeight = document.body.clientHeight - 80;
        $("#viewpointListDiv").height(listDivHeight);
        $("#viewpointImgList").height(listDivHeight);
	var rootNode = viewpointDoc.documentElement.firstChild;
	var count = rootNode.childNodes.length;
	var data = {
		total: count,
		rows: []
	};
	for(var i=0; i<count; i++){
		var childNode = rootNode.childNodes[i];
		var name = childNode.getAttribute("name");
		var desp = childNode.selectSingleNode("Description").text;
		var row = {"name":name,"desp":desp };
		data.rows.push(row);
	}
    if(data.rows.length>0){
        $("#listImg").attr("disabled", false);
        $("#exportImg").attr("disabled", false);
        $("#export").attr("disabled", false);
        $("#imageImg").attr("disabled", false);
        $("#listView").attr("disabled", false);
        $("#imageView").attr("disabled", false);
    }
    else{
        $("#listImg").attr("disabled", true);
        $("#exportImg").attr("disabled", true);
        $("#export").attr("disabled", true);
        $("#imageImg").attr("disabled", true);
        $("#listView").attr("disabled", true);
        $("#imageView").attr("disabled", true);
    }
	$("#viewpointList").datagrid("loadData",data);

	viewFlag = "L"; //列表视图
};

/**
 * 功能：初始化页面
 * 参数：无
 * 返回值：无
 */
var init = function(){
	viewpointDoc = getViewpointDoc("viewpoint");
	setViewpointListOption();
	if(viewFlag === "M")
	{
		initViewpointImgList();
	}
	else{
		initViewpointList();
	}
};

/**
 * 功能：根据节点数据源，添加一个视点缩略图
 * 参数：index-视点索引; node-数据源节点
 * 返回值：无
 */
    var lengthArr = [];
var appendImgByNode = function(index,node){
	var id = node.getAttribute("id");
	var name = node.getAttribute("name");
	var desp = node.selectSingleNode("Description").text;
	var imgPath = earth.Environment.RootPath + "viewpoint\\" + id +".jpg";
    var htmlStr = "";
    htmlStr = htmlStr + '<DIV style="float:left;top:1px;left:5px;word-break:break-all;WIDTH: 95px;height:100px;overflow:auto">';
    htmlStr = htmlStr + '<DIV style=" FILTER: progid:DXImageTransform.Microsoft.AlphaImageLoader(src=' + imgPath + ', sizingMethod=scale); WIDTH: 90px; HEIGHT: 60px" ';
    htmlStr = htmlStr + ' id="img' + index + '" ';
    htmlStr = htmlStr + ' onmouseover="this.className=\'divBorder\'" ';
    htmlStr = htmlStr + ' onmouseout="this.className=\'divNonBorder\'" ';
    htmlStr = htmlStr + ' oncontextmenu="tonRowContextMenu(event,' + index + ', null)" ';
    htmlStr = htmlStr + ' ondblclick="tonDblClickRow(' + index + ', null)" ';
    htmlStr = htmlStr + ' onclick="tonClickRow(1, null)" >';
    htmlStr = htmlStr + '</DIV>';
    var str =  name + ' - ' + desp;
    var len = GetLength(str);
    lengthArr.push(len);
    if(lengthArr.length>1){
         if(lengthArr[lengthArr.length-1]>lengthArr[lengthArr.length-2]){
         } else {
             lengthArr[lengthArr.length-1]=lengthArr[lengthArr.length-2] ;
             lengthArr[lengthArr.length-2]=lengthArr[lengthArr.length-1] ;
         }
        var jianLen = lengthArr[lengthArr.length-1]-lengthArr[lengthArr.length-2] ;
        var Divtext = $("#descId").text();
        for(var s=0;s<jianLen;s++){
            Divtext+=" ";
        }
        $("#descId").text(Divtext);
    }
    htmlStr = htmlStr + '<DIV id="descId" style="padding-bottom:5px;font-size:12px;word-break:break-all;width:95px;">' + name +'</DIV>';
    htmlStr = htmlStr + '</DIV>';
	$("#viewpointImgList").append(htmlStr);
};
var GetLength = function(str) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};
/**
 * 功能：根据节点数据源，更新一个视点缩略图
 * 参数：index-视点索引; node-数据源节点
 * 返回值：无
 */
var updateImgByNode = function(index,node){
	var name = node.getAttribute("name");
	var desp = node.selectSingleNode("Description").text;
	var divId = "img" + index;
	var imgObj = document.getElementById(divId);
	imgObj.nextSibling.innerHTML = name;
};

 /**
 * 功能：初始化缩略图视图
 * 参数：无
 * 返回值：无
 */
var initViewpointImgList = function(){
	$("#viewpointImgList").html("");
	var rootNode = viewpointDoc.documentElement.firstChild;
	var count = rootNode.childNodes.length;
	for(var i=0; i<count; i++){
		var childNode = rootNode.childNodes[i];
		appendImgByNode(i,childNode);
	}
	if(count>0){
        $("#listImg").attr("disabled", false);
        $("#listView").attr("disabled", false);
        $("#exportImg").attr("disabled", false);
        $("#export").attr("disabled", false);
        $("#imageImg").attr("disabled", false);
        $("#imageView").attr("disabled", false);
    }
    else{
        $("#listImg").attr("disabled", true);
        $("#listView").attr("disabled", true);
        $("#exportImg").attr("disabled", true);
        $("#export").attr("disabled", true);
        $("#imageImg").attr("disabled", true);
        $("#imageView").attr("disabled", true);
    }
	viewFlag = "M"; //缩略图视图
};

/**
 * 功能：显示列表视图
 * 参数：无
 * 返回值：无
 */
var showViewpointList = function(){
	$("#viewpointListPanel").css("display","");
	$("#viewpointImgListPanel").css("display","none");
	initViewpointList();
};

/**
 * 功能：显示缩略图视图
 * 参数：无
 * 返回值：无
 */
var showViewpointImgList = function(){
	$("#viewpointListPanel").css("display","none");
	$("#viewpointImgListPanel").css("display","");
	initViewpointImgList();
};

//------------------------------------------------------------------------

/**
 * 功能：向视点列表中添加一条记录
 * 参数：node-数据源节点
 * 返回值：无
 */
var appendRowByNode = function(node){
	var name = node.getAttribute("name");
	var desp = node.selectSingleNode("Description").text;
	var row = {"name":name,"desp":desp };
	$("#viewpointList").datagrid("appendRow", row);
};

/**
 * 功能：更新视点指定行的信息
 * 参数：index-要更新的行号；node-更新数据源
 * 返回值：无
 */
var updateRowByNode = function(index,node){
	var name = node.getAttribute("name");
	var desp = node.selectSingleNode("Description").text;
	var param = {
		index: index,
		row: {"name":name, "desp":desp}
	};
	$("#viewpointList").datagrid("updateRow",param);
};

/**
 * 功能：删除指定索引行的视点
 * 参数：index-要删除的行号；
 * 返回值：无
 */
//var deleteRowByIndex = function(index){
//	$("#viewpointList").datagrid("deleteRow",index);
//};

/**
 * 功能：创建视点节点
 * 参数：dataObj-视点创建参数
 * 返回值：视点节点
 */
var createElementViewpoint = function(dataObj,viewpointDoc){
	var id = earth.Factory.CreateGuid();
	var name = dataObj.pointName;
	var desp = dataObj.description;
	var currPose = earth.GlobeObserver.Pose;
	var targetPose = earth.GlobeObserver.TargetPose;
	var lon = targetPose.Longitude;
	var lat = targetPose.Latitude;
	var alt = targetPose.Altitude;
	var heading = currPose.Heading;
	var tilt = currPose.Tilt;
	var roll = currPose.Roll;
	var range = currPose.Range;

	var attrArr = [
		{name:"id", value:id},
		{name:"name", value:name}
	];
	var viewpointNode = createElementNode("Viewpoint",attrArr,viewpointDoc);
	viewpointNode.appendChild(new createElementText("Longitude",lon,viewpointDoc));
	viewpointNode.appendChild(new createElementText("Latitude",lat,viewpointDoc));
	viewpointNode.appendChild(new createElementText("Altitude",alt,viewpointDoc));
	viewpointNode.appendChild(new createElementText("Heading",heading,viewpointDoc));
	viewpointNode.appendChild(new createElementText("Tilt",tilt,viewpointDoc));
	viewpointNode.appendChild(new createElementText("Roll",roll,viewpointDoc));
	viewpointNode.appendChild(new createElementText("Range",range,viewpointDoc));
	viewpointNode.appendChild(new createElementText("Description",desp,viewpointDoc));
	return viewpointNode;
};

/**
 * 功能：创建视点节点
 * 参数：viewpointNode-要修改的节点；dataObj-视点修改参数
 * 返回值：无
 */
var editElementViewpoint = function(viewpointNode, dataObj){
	var name = dataObj.pointName;
	var desp = dataObj.description;
	viewpointNode.setAttribute("name", name);
	viewpointNode.selectSingleNode("Description").text = desp;
};

/**
 * 功能：创建视点
 * 参数：无
 * 返回值：无
 */
var createViewPointClick = function(){
	var params = {
	    titleText: "新建视点"
	};
	var data = openDialog("viewpointManagerWidgetDialog.html",params,300,190);
	if(data == null){
		return;
	}
	var checkedNode = lookupNodeByName(viewpointDoc, data.pointName);
	if(checkedNode != null){
		alert("已经存在同名视点，请重新命名");
		return;
	}
	var viewpointNode = createElementViewpoint(data,viewpointDoc);
	viewpointDoc.documentElement.firstChild.appendChild(viewpointNode);
	saveXmlFileDoc("viewpoint",viewpointDoc.xml);

	var id = viewpointNode.getAttribute("id");
	var savePath = earth.Environment.RootPath + "viewpoint\\" + id +".jpg";
    earth.ScreenShot(savePath,512,512,1,true);
    $("#listImg").attr("disabled", false);
    $("#listView").attr("disabled", false);
    $("#exportImg").attr("disabled", false);
    $("#export").attr("disabled", false);
	if(viewFlag === "L"){
		appendRowByNode(viewpointNode);
	}else{
		var rowIndex = viewpointDoc.documentElement.firstChild.childNodes.length - 1;
		appendImgByNode(rowIndex,viewpointNode);
	}
};

/**
 * 功能：编辑视点
 * 参数：无
 * 返回值：无
 */
var editViewpointClick = function(){
	hiddenRightMenu();//currIndex
	var rootNode = viewpointDoc.documentElement.firstChild;
	var editViewpointNode = rootNode.childNodes[currIndex];
	var params = {
	    titleText: "编辑视点",
	    data: editViewpointNode
	};
	//var data = openDialog("viewpointManagementDialog.html",params,300,190);
	var data = openDialog("viewpointManagerWidgetDialog.html",params,300,190);
	if(data == null){
		return;
	}
	for(var i = 0; i < rootNode.childNodes.length; i++){
		if(i != currIndex && data.pointName === rootNode.childNodes[i].getAttribute("name")){
			alert("已经存在同名视点，请重新命名");
			return;
		}
	}

	editElementViewpoint(editViewpointNode,data);
	saveXmlFileDoc("viewpoint",viewpointDoc.xml);

	if(viewFlag === "L"){
		updateRowByNode(currIndex, editViewpointNode);
	}else{
		updateImgByNode(currIndex, editViewpointNode);
	}
};

/**
 * 功能：删除视点
 * 参数：无
 * 返回值：无
 */
var deleteViewpointClick = function(){
	hiddenRightMenu();
	var flag = confirm("确实要删除吗？");
	if(flag == false){
		return;
	}

	var rootNode = viewpointDoc.documentElement.firstChild;
	var deletedNode = rootNode.childNodes[currIndex];
	deletedNode.parentNode.removeChild(deletedNode);
	saveXmlFileDoc("viewpoint",viewpointDoc.xml);

	var id = deletedNode.getAttribute("id");
	var deletePath = earth.Environment.RootPath + "viewpoint\\" + id +".jpg";
	deleteFile(deletePath);

	if(viewFlag === "L"){
		initViewpointList();
	}else{
		initViewpointImgList();
	}
};
