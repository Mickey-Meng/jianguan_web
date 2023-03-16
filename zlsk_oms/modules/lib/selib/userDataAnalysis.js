var UserDataAnalysis={};
var mContainer=[];
var pipeLineData=[];
var pipeLineDataTemp=[];
var pipelineList=[];
var pipelineDoc = null;
$(function(){
	var name=null;
	var imgLocation = "http://" + getRootPath() + "/images/PipeMaterial/Standard/",
    sideTexturePath = imgLocation + "white.jpg";
	var pipelineTypes=ectx.PipelineStandard.PipelineType;
	var createPipeLine=function(vec3s,specification,pipeLineName,type,pipelineId){
		name=pipeLineName;
		var pipeLineTypeValue=pipelineTypes[type];
		sideTexturePath = imgLocation + pipeLineTypeValue+".jpg";
		createNewLayer();
		return createModel(vec3s,specification,type,pipelineId);
	};
    var createNewLayer = function () {
        var tempDemPath = earth.Environment.RootPath + "\\temp\\terrain\\";
        var rect = earth.TerrainManager.GetTempLayerRect();
        var levelMin = earth.TerrainManager.GetTempLayerMinLevel();
        var levelMax = earth.TerrainManager.GetTempLayerMaxLevel();

        var guid = earth.Factory.CreateGUID();
        tempLayer = earth.Factory.CreateDemLayer(guid, "TempTerrainLayer", tempDemPath,
            rect, levelMin, levelMax, 1000);
        earth.AttachObject(tempLayer);
    };
    var createModel = function (args,specification,type,modelGuid) {
    	 // 生成边缘模型
        var terrain = earth.TerrainManager;
        if(modelGuid == null){
            modelGuid=earth.Factory.CreateGUID();
        }
        var obj={
        	vec3s:args,
        	specification:specification,
        	type:type
        };
        insertPipelineData(modelGuid);
        mContainer[modelGuid]=obj;
        if(specification.indexOf("X")==-1){
        	var radius=0.0005*parseFloat(specification);
        	mModelObj = terrain.GenerateRoundTunnel(modelGuid,name, args,radius, 24, sideTexturePath);
        }else if(specification.indexOf("X")>-1){
        	var width=specification.split("X")[0];
        	width=0.001 * parseFloat(width);
        	var height=specification.split("X")[1];
        	height=0.001 * parseFloat(height);
        	mModelObj = terrain.GenerateTunnel(modelGuid,name, args, width,height,sideTexturePath);
        }
        pipelineList[modelGuid]=mModelObj;
        mModelObj.SetKey(name);
    	earth.AttachObject(mModelObj);
    	return mModelObj;
    };
    function getRootPath(){
    	var pathName=window.document.location.pathname;
    	var localhost=window.location.host;
    	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    	return(localhost+projectName);
    }
    var getPipeLineInfoByGuid = function(guid){
    	for ( var key in mContainer) {
			if(key==guid){
				return mContainer[key];
			}
		}
    };
    var insertPipelineData=function(modelGuid){
    	var data = {};
		data.id = modelGuid;
		data.name = name;
		data.checked = true;
        pipeLineData.push(data);
    };
    var getPipelineData=function(){
    	pipeLineDataTemp.splice(0,pipeLineDataTemp.length);
    	var obj = {
		    id: 'userData',
		    name: '用户数据',
		    checked : true,
		    open:true,
		    isParent:true,
		    children:pipeLineData
		};
    	pipeLineDataTemp.push(obj);
    	return pipeLineDataTemp;
    };
    var getPipelineList=function(){
    	return pipelineList;
    };
    var deletePipelineById=function(guid){
    	for(var i=0;i<pipeLineData.length;i++){
    		var pObj=pipeLineData[i];
    		if(pObj.id==guid){
    			pipeLineData.splice(i,1);
    		}
    	}
    };
    /**
	 * 功能：保存自定义管线信息
	 * 参数：docXml-要保存的自定义管线信息
	 * 返回：无
	 */
	var savePilelineFile = function(docXml){
		var savePath = earth.Environment.RootPath + "temp\\pipeline";
		earth.UserDocument.SaveXmlFile(savePath, docXml);
	};

	/**
	 * 功能：创建自定义管线文档
	 * 参数：无
	 * 返回：新建创建的文档内容
	 */
	var createPilelineFile = function(){
		var xmlStr = '<xml></xml>';
		savePilelineFile(xmlStr);
		return xmlStr;
	};

	/**
	 * 功能：获取自定义管线文档对象
	 * 参数：无
	 * 返回：自定义管线文档对象
	 */
	var getPilelineFile = function(){
		var loadPath = earth.Environment.RootPath + "temp\\pipeline.xml";
		var markedXml = earth.UserDocument.LoadXmlFile(loadPath);
		if((markedXml == null) || (markedXml == "")){
			markedXml = createPilelineFile();
		}
		var markedDoc = loadXMLStr(markedXml);
		return markedDoc;
	};

	/**
	 * 功能：创建管线对象节点
	 * 参数：ipipeLineId-管线的ID编号；vec3s-管线对象的线集合；specification-管线的规格；pipeLineName-管线的名称；type-管线的类型
	 * 返回：管线对象节点
	 */
	var createPipeLineNode = function(ipipeLineId,vec3s,specification,pipeLineName,type){
		var attrArr = [
			{name: "id", value: ipipeLineId},
			{name: "name", value: pipeLineName}
		];
		var lineCoordinate = "";
        for (var i = 0; i < vec3s.Count; i++) {
            var pt = vec3s.Items(i);
            if(lineCoordinate == ""){
                lineCoordinate = pt.X + "," + pt.Y + "," + pt.Z ;
            }else{
            	lineCoordinate = lineCoordinate + "," + pt.X + "," + pt.Y + "," + pt.Z ;
            }
        }
		var pipelineNode = createElementNode("Pipeline",attrArr,pipelineDoc);
		pipelineNode.appendChild(createElementText("LineCoordinate", lineCoordinate, pipelineDoc));
		pipelineNode.appendChild(createElementText("Specification", specification, pipelineDoc));
		pipelineNode.appendChild(createElementText("PipeType", type, pipelineDoc));
		pipelineDoc.documentElement.appendChild(pipelineNode);
		savePilelineFile(pipelineDoc.xml);
		return pipelineNode;
	};

	/**
	 * 功能：删除管线对象节点
	 * 参数：ipipeLineId-管线的ID编号
	 * 返回：无
	 */
	var deletePipeLineNode = function(pipeLineId){
		var pipeLineNode = lookupNodeById(pipelineDoc, pipeLineId);
		pipeLineNode.parentNode.removeChild(pipeLineNode);
		savePilelineFile(pipelineDoc.xml);
	};

	/**
	 * 功能：初始化管线列表，从管线文档中读取信息并将信息转化成管线对象
	 * 参数：pipelineDoc-管线文档对象
	 * 返回：无
	 */
	var initPipeLineObj = function(pipelineDoc){
		var pipelineRoot = pipelineDoc.documentElement;
		for(var i=0; i<pipelineRoot.childNodes.length; i++){
			var pipelineNode = pipelineRoot.childNodes[i];
			var pipelineId = pipelineNode.getAttribute("id");
			var pipelineName = pipelineNode.getAttribute("name");
			var lineCoordinate = pipelineNode.selectSingleNode("LineCoordinate").text;
			var specification = pipelineNode.selectSingleNode("Specification").text;
			var type = pipelineNode.selectSingleNode("PipeType").text;
			var vec3s = earth.Factory.CreateVector3s();
			var lineCoordArr = lineCoordinate.split(",");
			for(var k=0; k<lineCoordArr.length; k=k+3){
				vec3s.Add(lineCoordArr[k], lineCoordArr[k+1], lineCoordArr[k+2]);
			}
			createPipeLine(vec3s,specification,pipelineName,type,pipelineId);
		}
	};

    UserDataAnalysis.deletePipelineById=deletePipelineById;
    UserDataAnalysis.getPipelineList=getPipelineList;
    UserDataAnalysis.getPipelineData=getPipelineData;
    UserDataAnalysis.createPipeLine=createPipeLine;
    UserDataAnalysis.getPipeLineInfoByGuid=getPipeLineInfoByGuid;
    //added by yamin
    UserDataAnalysis.getPilelineFile=getPilelineFile;
    UserDataAnalysis.savePilelineFile=savePilelineFile;
    UserDataAnalysis.createPipeLineNode=createPipeLineNode;
    UserDataAnalysis.deletePipeLineNode=deletePipeLineNode;
    UserDataAnalysis.initPipeLineObj=initPipeLineObj;
});
