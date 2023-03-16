/**
 * 统计功能对象
 */
var elementSphere = null;
var htmlBalloons = null;
var bFlagIndex = 0;
var id_timeout;
//var earthCtx = sfDss.doAction('getEarthContext');
var StatisticsMgr =  {
    //    pipeLineLayers : null, //管线图层列表
    projectList: null,
    pipeConfigLink: null, //字段映射文件的地址
    pipeConfigDoc: null, //字段映射文件的dom对象
    pipeDatum: null, //空间坐标转换对象
    /**
     * 功能：获取管线图层列表
     * 参数：无
     * 返回：无
     */
    //    getPipelineLayers : function(){
    //      if(this.pipeLineLayers == null){
    //          this.pipeLineLayers = parent.PIPELINELAYERS;
    //      }
    //    },
    /**
     * 功能：初始化导入项目列表
     * 参数：container-显示项目列表的jquery容器对象;
     * 返回：无
     */
    initPipelineListimport : function(container, guihuaArr){
        var projectIdArr=[];
        container.empty();
        if(!container){
            return;
        }
        for(var i = 0; i <guihuaArr.length; i++){
            var projectId = guihuaArr[i].id;
            var projectName = guihuaArr[i].name;
            /*if(projectName==="规划管线"){//规划管线
                container.append('<option value="' + projectId + '"'  + '>' + projectName + '</option>');
            }
            if(projectName==="设计管线"){
                container.append('<option value="' + projectId + '"' + '>' + projectName + '</option>');
            }
            if(projectName==="竣工管线"){
                container.append('<option value="' + projectId + '"' + '>' + projectName + '</option>');
            }*/
            container.append('<option value="' + projectId + '"'  + '>' + projectName + '</option>');
            projectIdArr.push(projectId);
        }
        var loadPath1 = earth.Environment.RootPath + "temp\\PipeData.xml";
        var PipeDataXml1 = earth.UserDocument.LoadXmlFile(loadPath1);
        var PipeDataDoc1 = loadXMLStr(PipeDataXml1);
        var polygonNodes = PipeDataDoc1.getElementsByTagName("PipePolygonElement");
        if(polygonNodes.length!=0){
            //parent.document.getElementById("AcceptWellCompare").disabled=false;
        }else{
            //parent.document.getElementById("AcceptWellCompare").disabled=true;
        }
        return projectIdArr;
    },
    /**
     * 功能：初始化导入项目列表,判断比对阶段
     * 参数：比对图层guid;
     * 返回：无
     */
    approveOrAccept: function(guid) {
        //this.getProjectList();
        for (var i = 0; i < parent.guihuaArr.length; i++) {
            var projectId = parent.guihuaArr[i].id;
            var projectName = parent.guihuaArr[i].name;
            var loadPath = earth.Environment.RootPath + "temp\\PipeData.xml";
            var PipeDataXml = earth.UserDocument.LoadXmlFile(loadPath);
            var PipeLineDataDoc = loadXMLStr(PipeDataXml);
            var pipeLIneNodes = PipeLineDataDoc.getElementsByTagName("PipeLineId");
            /*if(pipeLIneNodes == null || pipeLIneNodes.length == 0){
                parent.document.getElementById("Approval2DCompare").disabled=true;
                parent.document.getElementById("ApprovalCollisionAnalysis").disabled=true;
                parent.document.getElementById("ApprovalDisionAnalysis").disabled=true;
                parent.document.getElementById("AcceptCompare").disabled=true;
            }else
            if(projectName==="pipeline" && guid===projectId){
                parent.document.getElementById("Approval2DCompare").disabled=false;
                parent.document.getElementById("ApprovalCollisionAnalysis").disabled=false;
                parent.document.getElementById("ApprovalDisionAnalysis").disabled=false;
                parent.document.getElementById("AcceptCompare").disabled=true;
                //parent.document.getElementById("AcceptWellCompare").disabled=true;*/
            /*
                //$("div[tag='Accept3DCompare']").attr("disabled",true);
            }else
            if(projectName==="设计管线" && guid===projectId){
                parent.document.getElementById("Approval2DCompare").disabled=true;
                parent.document.getElementById("ApprovalCollisionAnalysis").disabled=true;
                parent.document.getElementById("ApprovalDisionAnalysis").disabled=true;
                parent.document.getElementById("AcceptCompare").disabled=false;
                //parent.document.getElementById("AcceptWellCompare").disabled=true;*/
            /*
                //$("div[tag='Accept3DCompare']").attr("disabled",true);
            }*/
        }
    },
    /**
     * 功能：初始化项目列表
     * 参数：container-显示项目列表的jquery容器对象;
     * 返回：无
     */
    initProjectList: function(container) {
        this.projectList = [];
        var rootLayerList = earth.LayerManager.LayerList;
        var projectCount = rootLayerList.GetChildCount();
        for (var i = 0; i < projectCount; i++) {
            var childLayer = rootLayerList.GetChildAt(i);
            var layerType = childLayer.LayerType;
            if (layerType === "Project") {
                var projectId = childLayer.Guid;
                var projectName = childLayer.Name;
                var pipeList = this.getPipeListByLayer(childLayer);
                if (pipeList.length > 0) {
                    this.projectList.push({
                        projectId: projectId,
                        projectName: projectName,
                        pipeList: pipeList
                    });
                    //container.append('<option value="' + projectId + '">' + projectName + '</option>');
                }
            }
        }
    },

    /**
     * 显示气泡
     * @param  {[type]} vecCenter.X [description]
     * @param  {[type]} vecCenter.Y [description]
     * @param  {[type]} vecCenter.Z [description]
     * @param  {[type]} htmlStr     [description]
     * @return {[type]}             [description]
     */
    showHtmlBalloon: function(vecCenterX, vecCenterY, vecCenterZ, htmlStr) {
        if (htmlBalloons) {
            htmlBalloons.DestroyObject();
            htmlBalloons = null;
        }
        var guid = earth.Factory.CreateGuid();
        htmlBalloons = earth.Factory.CreateHtmlBalloon(guid, "balloon");
        htmlBalloons.SetSphericalLocation(vecCenterX, vecCenterY, vecCenterZ);
        htmlBalloons.SetRectSize(250, 280);
        var color = parseInt("0xffffff00");
        htmlBalloons.SetTailColor(color);
        htmlBalloons.SetIsAddCloseButton(true);
        htmlBalloons.SetIsAddMargin(true);
        htmlBalloons.SetIsAddBackgroundImage(true);
        htmlBalloons.SetIsTransparence(true);
        htmlBalloons.SetBackgroundAlpha(0xcc);
        htmlBalloons.ShowHtml(htmlStr);

        //deleted by zhangd-2015-03-12-13:53--所有气泡关闭事件均修改为下面的回调方式
        // earth.Event.OnHtmlBalloonFinished = function() {
        //     if (htmlBalloons != null) {
        //         htmlBalloons.DestroyObject();
        //         htmlBalloons = null;
        //     }
        //     earth.Event.OnHtmlBalloonFinished = function() {};
        // }
        OnHtmlBalloonFinishedFunc(guid,function(closeBid){
            if (htmlBalloons != null) {
                htmlBalloons.DestroyObject();
                htmlBalloons = null;
            }
            //earth.Event.OnHtmlBalloonFinished = function() {};
        });
    },

    clearHtmlBalloons: function() {
        if (htmlBalloons != null) {
            // alert("clearHtmlBalloons");
            htmlBalloons.DestroyObject();
            htmlBalloons = null;
        }
    },

    /**
     * 功能：获取指定图层下的所有管线图层列表
     * 参数：layer-指定图层
     * 返回：指定图层下的所有管线图层列表
     */
    getPipeListByLayer: function(layer) {
        if (layer == null) return;
        var pipelineArr = [];
        var count = layer.GetChildCount();
        for (var i = 0; i < count; i++) {
            var childLayer = layer.GetChildAt(i);
            var layerTypeC = childLayer.LayerType;
            if (layerTypeC === "Pipeline") {
                var pipelineId = childLayer.Guid;
                var pipelineName = childLayer.Name;
                var pipelineServer = childLayer.GISServer;
                var layerType = childLayer.PipeLineType;
                pipelineArr.push({
                    id: pipelineId,
                    name: pipelineName,
                    server: pipelineServer,
                    LayerType: layerType
                });
            } else {
                var childCount = childLayer.GetChildCount();
                if (childCount > 0) {
                    var childPipelineArr = this.getPipeListByLayer(childLayer);
                    for (var k = 0; k < childPipelineArr.length; k++) {
                        pipelineArr.push(childPipelineArr[k]);
                    }
                }
            }
        }
        return pipelineArr;
    },
    /**
     * 功能：获取指定图层下的所有管线图层列表
     * 参数：layer-指定图层
     * 返回：指定图层下的所有管线图层列表
     */
    getAreaListByLayer: function(layer) {
        if (layer == null) return;
        var areaArr = [];
        var count = layer.GetChildCount();
        for (var i = 0; i < count; i++) {
            var childLayer = layer.GetChildAt(i);
            var layerTypeC = childLayer.LayerType;
            if (layerTypeC === "Vector") {
                var pipelineId = childLayer.Guid;
                var pipelineName = childLayer.Name;
                var pipelineServer = childLayer.GISServer;
                var layerType = childLayer.PipeLineType;
                areaArr.push({
                    id: pipelineId,
                    name: pipelineName,
                    server: pipelineServer,
                    LayerType: layerType
                });
            } else {
                var childCount = childLayer.GetChildCount();
                if (childCount > 0) {
                    var childAreaArr = this.getAreaListByLayer(childLayer);
                    for (var k = 0; k < childAreaArr.length; k++) {
                        areaArr.push(childAreaArr[k]);
                    }
                }
            }
        }
        return areaArr;
    },
    /**
     * 功能：获取指定图层下的所有勾选选中的管线图层列表
     * 参数：layer-指定图层
     * 返回：指定图层下的所有管线图层列表
     */
    getPipeListByLayerChecked: function(layer) {
        var pipelineArr = [];
        var count = layer.GetChildCount();
        var pipelineLayerzTree = $.fn.zTree.getZTreeObj("pipelineLayerTree");
        var checkCount = pipelineLayerzTree.getCheckedNodes(true);
        if (checkCount) {
            for (var j = 0; j < checkCount.length; j++) {
                var node = checkCount[j];
                for (var i = 0; i < count; i++) {
                    var childLayer = layer.GetChildAt(i);
                    var layerTypeC = childLayer.LayerType;
                    if (node.id === childLayer.Guid) {
                        if (layerTypeC === "Pipeline") {
                            var pipelineId = childLayer.Guid;
                            var pipelineName = childLayer.Name;
                            var pipelineServer = childLayer.GISServer;
                            var layerType = childLayer.PipeLineType;
                            pipelineArr.push({
                                id: pipelineId,
                                name: pipelineName,
                                server: pipelineServer,
                                LayerType: layerType
                            });
                        } else {
                            var childCount = childLayer.GetChildCount();
                            if (childCount > 0) {
                                var childPipelineArr = this.getPipeListByLayerChecked(childLayer);
                                for (var k = 0; k < childPipelineArr.length; k++) {
                                    pipelineArr.push(childPipelineArr[k]);
                                }
                            }
                        }
                    }
                }
            }
        }

        return pipelineArr;
    },
    //获得所有管线共层
    initPipePjoList: function() {
        var pipeProjectList = [];
        var rootLayerList = earth.LayerManager.LayerList;
        var projectCount = rootLayerList.GetChildCount();
        for (var i = 0; i < projectCount; i++) {
            var childLayer = rootLayerList.GetChildAt(i);
            var layerType = childLayer.LayerType;
            if (layerType === "Project") { //17
                var projectId = childLayer.Guid;
                var projectName = childLayer.Name;
                var chlildrenCount = childLayer.GetChildCount();
                var pipeTag = false;
                for (var x = 0; x < chlildrenCount; x++) {
                    var pipechildLayer = childLayer.GetChildAt(x);
                    var pipelayerType = pipechildLayer.LayerType;
                    if (pipelayerType === "Pipeline") {
                        pipeTag = true;
                    }
                    if (pipelayerType === "Folder") {
                        var threeLayerCount = pipechildLayer.GetChildCount();
                        for (var s = 0; s < threeLayerCount; s++) {
                            var threechildLayer = pipechildLayer.GetChildAt(s);
                            var threepipelayerType = threechildLayer.LayerType;
                            if (threepipelayerType === "Pipeline") {
                                pipeTag = true;
                            }
                        }
                    }
                }
                if (pipeTag) {
                    pipeProjectList.push({
                        id: projectId,
                        name: projectName
                    });
                }
            }
        }
        return pipeProjectList;
    },
    getPipelineProjectList: function() {
        var pipeProjectList = [];
        var rootLayerList = earth.LayerManager.LayerList;
        var projectCount = rootLayerList.GetChildCount();
        for (var i = 0; i < projectCount; i++) {
            var childLayer = rootLayerList.GetChildAt(i);
            var layerType = childLayer.LayerType;
            var pipeTag = false;
            if (layerType === "Project" && !pipeTag) { //17
                var projectId = childLayer.Guid;
                var projectName = childLayer.Name;
                var chlildrenCount = childLayer.GetChildCount();

                for (var x = 0; x < chlildrenCount; x++) {
                    var pipechildLayer = childLayer.GetChildAt(x);
                    var pipelayerType = pipechildLayer.LayerType;
                    if (pipelayerType === "Pipeline") {
                        pipeTag = true;
                        break;
                    }
                    if (pipelayerType === "Folder") {
                        var threeLayerCount = pipechildLayer.GetChildCount();
                        for (var s = 0; s < threeLayerCount; s++) {
                            var threechildLayer = pipechildLayer.GetChildAt(s);
                            var threepipelayerType = threechildLayer.LayerType;
                            if (threepipelayerType === "Pipeline") {
                                pipeTag = true;
                                break;
                            }
                        }
                    }
                }
                if (pipeTag) {
                    pipeProjectList.push({
                        id: projectId,
                        name: projectName
                    });
                }
            }
        }
        return pipeProjectList;
    },
    /**
     * 功能：初始化管线图层列表
     * 参数：projectId-指定项目的id编号; container-显示管线图层列表的jquery容器对象; callback-管线初始化完成之后的回调函数
     * 返回：无
     */
    initPipelinePointLineList: function(projectId, container, callback) {
        container.html("");

        var pipelineList = null;
        if (this.projectList == null) {
            this.initProjectList();
        }
        for (var k = 0; k < this.projectList.length; k++) {
            if (this.projectList[k].projectId === projectId) {
                pipelineList = this.projectList[k].pipeList;
                break;
            }
        }
        if (pipelineList == null) {
            return;
        }

        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            container.append('<option value="' +
                pipeLineLayer.id + '" server="' + pipeLineLayer.server + '" title="' + pipeLineLayer.name + '">' +
                pipeLineLayer.name + '线</option>');
            container.append('<option value="' +
                pipeLineLayer.id + '" server="' + pipeLineLayer.server + '" title="' + pipeLineLayer.name + '">' +
                pipeLineLayer.name + '点</option>');
        }

        if (callback != null) {
            callback();
        }
    },
    /**
     * 功能：初始化管线图层列表
     * 参数：projectId-指定项目的id编号; container-显示管线图层列表的jquery容器对象; callback-管线初始化完成之后的回调函数
     * 返回：无
     */
    initPipelineSelectList: function(projectId, container, callback) {
        container.html("");
        if (projectId == null) return;
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);

        if (pipelineList == null) {
            return;
        }

        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            container.append('<option value="' +
                pipeLineLayer.id + '" server="' + pipeLineLayer.server + '" title="' + pipeLineLayer.name + '">' +
                pipeLineLayer.name + '</option>');
        }

        if (callback != null) {
            callback();
        }
    },

    /***********************广州项目-规划审批功能需要********************************/
    /**
     * @param container
     * @param callback
     */
    initImportPipelineList:function(container,callback){
        var importPipeline=parent.importPipelineElement;
        if(importPipeline!=null&&importPipeline.length>0){
            for(var i=0;i<importPipeline.length;i++){
                var p = importPipeline[i];
                container.append('<option type='+ p.type+' value='+ p.coordinates+'>' + p.name + '</option>');
            }
        }
        if(callback!=null){
            callback();
        }
    },
    /**
     * 通过guid拿到导入管线的详细信息
     * @param guid
     * @returns {*}
     */
    getImportPipelineInfoByGuid:function(guid){
        var importPipeline=parent.importPipelineElement;
        if(importPipeline!=null&&importPipeline.length>0){
            for(var i=0;i<importPipeline.length;i++){
                var p = importPipeline[i];
                if(p.guid==guid){
                    return p;
                }
            }
        }
    },
    /*******************************************************/

    /**
     * 功能：初始化管线图层列表
     * 参数：projectId-指定项目的id编号; container-显示管线图层列表的jquery容器对象; callback-管线初始化完成之后的回调函数
     * 返回：无
     */
    initAreaSelectList: function(projectId, container, callback) {
        container.html("");
        if (projectId == null) return;
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var areaList = this.getAreaListByLayer(layer);

        if (areaList == null) {
            return;
        }

        for (var i = 0; i < areaList.length; i++) {
            var areaLayer = areaList[i];
            container.append('<option value="' +
                areaLayer.id + '" server="' + areaLayer.server + '" title="' + areaLayer.name + '">' +
                areaLayer.name + '</option>');
        }

        if (callback != null) {
            callback();
        }
    },
    /**
     * 功能：初始化管线图层列表
     * 参数：projectId-指定项目的id编号; container-显示管线图层列表的jquery容器对象; callback-管线初始化完成之后的回调函数
     * 返回：无
     */
    initPipelineList: function(projectId, container, callback) {
        container.html("");
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        /*var pipelineList = null;
         for(var k = 0; k < this.projectList.length; k++){
         if(this.projectList[k].projectId === projectId){
         pipelineList = this.projectList[k].pipeList;
         break;
         }
         }*/
        if (pipelineList == null) {
            return;
        }
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            container.append('<div style="width:100px;overflow: auto;">' +
                '<input type="checkbox" server="' + pipeLineLayer.server + '" id="' + pipeLineLayer.id + '" value="' + pipeLineLayer.id + '" name="' + pipeLineLayer.name + '" />' +
                '<label for="' + pipeLineLayer.id + '">' + pipeLineLayer.name + '</label>' +
                '</div>');
        }

        if (callback != null) {
            callback();
        }
    },
    unique: function(data) {
        data = data || [];
        var a = {};
        for (var i = 0; i < data.length; i++) {
            var v = data[i];
            if (typeof(a[v]) == 'undefined') {
                a[v] = 1;
            }
        };
        data.length = 0;
        for (var i in a) {
            data[data.length] = i;
        }
        return data;
    },
    getSmallPipelineListByCode: function(childPipelineCode) {
        var smallPipelineObj = [];
        childPipelineCode = childPipelineCode.toString();
        var childPipelineCode0 = childPipelineCode.charAt(0);
        var childPipelineCode1 = childPipelineCode.charAt(1);
        var childPipelineCode2 = childPipelineCode.charAt(2);
        var childPipelineCode3 = childPipelineCode.charAt(3);
        if (childPipelineCode0 != "0" && childPipelineCode1 == "0" && childPipelineCode2 == "0" && childPipelineCode3 != "0") {
            return;
        }
        var projectId = SYSTEMPARAMS.project;
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        var pipeConfig = SYSTEMPARAMS.pipeConfigDoc;
        if (pipeConfig == null) {
            return;
        }
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            var code0 = pipeCode.charAt(0); //1200-2
            var code1 = pipeCode.charAt(1); //1200-2
            var code2 = pipeCode.charAt(2); //4120-2
            var code3 = pipeCode.charAt(3); //6001-1
            var nodes = pipeConfig.getElementsByTagName("PipeCode");
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                var configCode = node.selectSingleNode("Code").text;
                var name = node.selectSingleNode("Name").text;
                //                if ((configCode == pipeCode && childPipelineCode0 == code0 && childPipelineCode1 == code1 && code2 != "0")||(configCode == pipeCode && childPipelineCode0 == code0 && childPipelineCode1 == code1 && code3 != "0")) {
                if (configCode == pipeCode && childPipelineCode0 == code0 && childPipelineCode1 == code1) {
                    smallPipelineObj.push({
                        name: pipeLineLayer.name,
                        id: pipeLineLayer.id,
                        configName: name,
                        code: configCode
                    });
                    break;
                }
            }
        }
        return smallPipelineObj;
    },
    getChildPipelineListByCode: function(lagerPipelineCode) {
        var childPipelineObj = [];
        var projectId = SYSTEMPARAMS.project;
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        var pipeConfig = SYSTEMPARAMS.pipeConfigDoc;
        if (pipeConfig == null) {
            return;
        }
        var lager = lagerPipelineCode.charAt(0);
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            var code0 = pipeCode.charAt(0); //1200-2
            var code1 = pipeCode.charAt(1); //1200-2
            var code2 = pipeCode.charAt(2); //4120-2
            var code3 = pipeCode.charAt(3); //6001-1
            var nodes = pipeConfig.getElementsByTagName("PipeCode");
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                var configCode = node.selectSingleNode("Code").text;
                var name = node.selectSingleNode("Name").text;
                if (configCode == pipeCode && lager == code0 && code2 == "0" && code3 == "0") {
                    childPipelineObj.push({
                        name: pipeLineLayer.name,
                        id: pipeLineLayer.id,
                        code: pipeCode,
                        configName: name
                    });
                    break;
                }
            }
        }
        return childPipelineObj;
    },
    getPipelineByCode: function(code) {
        var pipelineObj = {};
        var projectId = SYSTEMPARAMS.project;
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            if (pipeCode == code) {
                pipelineObj = {
                    id: pipeLineLayer.id,
                    name: pipeLineLayer.name
                };
                break;
            }
        }
        return pipelineObj;
    },
    getPipelineConfigNameByCode: function(code) {
        var name = null;
        var pipeConfig = SYSTEMPARAMS.pipeConfigDoc;
        if (pipeConfig == null) {
            return;
        }
        var nodes = pipeConfig.getElementsByTagName("PipeCode");
        for (var j = 0; j < nodes.length; j++) {
            var node = nodes[j];
            var configCode = node.selectSingleNode("Code").text;
            var configName = node.selectSingleNode("Name").text;
            if (configCode == code) {
                name = configName;
                break;
            }
        }
        return name;
    },
    lagerPipelineList: function(projectId, container, callback) {
        container.html("");
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        var code0Arr = [];
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            var code0 = pipeCode.charAt(0); //1200-2
            code0Arr.push(code0);
        }
        var names = StatisticsMgr.unique(code0Arr);
        for (var i = 0; i < names.length; i++) {
            var code = names[i] + "000";
            var name = StatisticsMgr.getPipelineConfigNameByCode(code);
            container.append('<option value="' + code + '" title="' + name + '">' + name + '</option>');
        }
        if (callback != null) {
            callback();
        }
    },
    sunPipelineList: function(projectId, lagerPipeline, container, callback) {
        var sunPipelineObj = [];
        var lager = lagerPipeline.charAt(0);
        var lager1 = lagerPipeline.charAt(1);
        var lager2 = lagerPipeline.charAt(2);
        var lager3 = lagerPipeline.charAt(3);
        container.html("");
        container.append('<option value="" code="">请选择</option>');
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        var pipeConfig = SYSTEMPARAMS.pipeConfigDoc;
        if (pipeConfig == null) {
            return;
        }

        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            var code0 = pipeCode.charAt(0); //1200-2
            var code1 = pipeCode.charAt(1); //1200-2
            var code2 = pipeCode.charAt(2); //4120-2
            var code3 = pipeCode.charAt(3); //6001-1
            var nodes = pipeConfig.getElementsByTagName("PipeCode");
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                var configCode = node.selectSingleNode("Code").text;
                var name = node.selectSingleNode("Name").text;
                if (configCode == pipeCode && lager == code0 && code2 == "0" && code3 == "0") {
                    container.append('<option value="' +
                        pipeLineLayer.id + '" code="' + pipeCode + '" name="' + pipeLineLayer.name + '" title="' + name + '">' +
                        name + '</option>');
                    sunPipelineObj.push({
                        name: pipeLineLayer.name,
                        id: pipeLineLayer.id
                    });
                    break;
                }
            }
        }
        if (callback != null) {
            callback();
        }
        return sunPipelineObj;
    },
    smallPipelineList: function(projectId, sunPipeline, container, callback) {
        var smallPipelineObj = [];
        var lager = sunPipeline.charAt(0);
        var sun = sunPipeline.charAt(1);
        var sun2 = sunPipeline.charAt(2);
        var sun3 = sunPipeline.charAt(3);
        if (lager != "0" && sun == "0" && sun2 == "0" && sun3 != "0") {
            return;
        }
        container.html("");
        container.append('<option value="" code="">请选择</option>');
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        var pipeConfig = SYSTEMPARAMS.pipeConfigDoc;
        if (pipeConfig == null) {
            return;
        }
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            var code0 = pipeCode.charAt(0); //1200-2
            var code1 = pipeCode.charAt(1); //1200-2
            var code2 = pipeCode.charAt(2); //4120-2
            var code3 = pipeCode.charAt(3); //6001-1
            var nodes = pipeConfig.getElementsByTagName("PipeCode");
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                var configCode = node.selectSingleNode("Code").text;
                var name = node.selectSingleNode("Name").text;
                //if ((configCode == pipeCode && lager == code0 && sun == code1 && code2 != "0")||(configCode == pipeCode && lager == code0 && sun == code1 && code3 != "0")) {
                if (configCode == pipeCode && lager == code0 && sun == code1) {
                    container.append('<option value="' +
                        pipeLineLayer.id + '" server="' + pipeLineLayer.server + '" code="' + pipeCode + '" name="' + pipeLineLayer.name + '" title="' + name + '">' +
                        name + '</option>');
                    smallPipelineObj.push({
                        name: pipeLineLayer.name,
                        id: pipeLineLayer.id
                    });
                    break;
                }
            }
        }
        if (callback != null) {
            callback();
        }
        return smallPipelineObj;
    },
    initClassificationPipelineList: function(projectId, container, callback) {
        container.html("");
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        var pipeConfig = SYSTEMPARAMS.pipeConfigDoc;
        if (pipeConfig == null) {
            return;
        }
        var code0Arr = [];
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            var code0 = pipeCode.charAt(0); //1200-2
            code0Arr.push(code0);
        }
        var names = StatisticsMgr.unique(code0Arr);
        for (var i = 0; i < names.length; i++) {
            var code = names[i] + "000";
            var name = StatisticsMgr.getPipelineConfigNameByCode(code);
            container.append('<div style="width:120px;overflow: auto;">' +
                '<input type="checkbox" id="' + code + '" value="' + code + '" />' +
                '<label for="' + code + '">' + name + '</label>' +
                '</div>');
        }
        if (callback != null) {
            callback();
        }
    },
    /**
     * 功能：为【全选】按钮添加onclick功能事件
     * 参数：btnObj-【全选】按钮的的jquery对象; callback-全选之后的回调函数
     * 返回：无
     */
    addSelectAllEvent: function(btnObj,callback,resBtn) {
        btnObj.click(function() {
            resBtn.prop("checked", true);
            if (callback != null) {
                callback();
            }
        });
    },

    /**
     * 功能：为【反选】按钮添加onclick功能事件
     * 参数：btnObj-【反选】按钮的的jquery对象; callback-反选之后的回调函数
     * 返回：无
     */
    addInvSelectEvent: function(btnObj, callback,resBtn) {
        btnObj.click(function() {
            resBtn.each(function() {
                $(this).prop("checked", !$(this).prop("checked"));
            });

            if (callback != null) {
                callback();
            }
        });
    },

    /**
     * 功能：为【清空】按钮添加onclick功能事件
     * 参数：btnObj-【清空】按钮的的jquery对象; callback-清空之后的回调函数
     * 返回：无
     */
    addClearSelectEvent: function(btnObj, callback,resBtn) {
        btnObj.click(function() {
            resBtn.prop("checked", false);
            if (callback != null) {
                callback();
            }
        });
    },

    /**
     * 功能：从GISServer端获取值域数据。
     * 参数：pipelineId-图层ID；spatial-空间搜索参数；queryType-查询类型；queryTableType-查询表类型；fieldName-值域字段名称
     * 返回：搜索结果
     */
    getValueRangeInfo: function(pipelineId, spatial, queryType, queryTableType, fieldName) {
        var pipeLayer = earth.LayerManager.GetLayerByGUID(pipelineId);
        if (pipeLayer == null) {
            return null;
        }
        var subLayer = null;
        for (var i = 0, len = pipeLayer.GetChildCount(); i < len; i++) {
            subLayer = pipeLayer.GetChildAt(i);
            if (subLayer.Name.toLowerCase() == "container" || subLayer.LayerType === "Model_container") { // 使用具体的_container图层
                break;
            }
        }
        if (subLayer == null) {
            return;
        }

        var params = subLayer.QueryParameter;
        if (params == null) {
            return null;
        }
        params.Filter = "";
        params.ClearSpatialFilter();
        /*if(spatial != null){
         params.SetSpatialFilter(spatial);
         }*/
        params.QueryType = queryType;
        params.QueryTableType = queryTableType; //0为点表搜索；1为线表搜索
        var result = subLayer.SearchValueRangeFromGISServer(fieldName);
        return result;
    },
    /**
     * 功能：从GISServer端获取值域数据。
     * 参数：pipelineId-图层ID；spatial-空间搜索参数；queryType-查询类型；queryTableType-查询表类型；fieldName-值域字段名称
     * 返回：搜索结果
     */
    getValueRangeInfo2: function(pipelineId, spatial, queryType, queryTableType, fieldName) {
        var pipeLayer = earth.LayerManager.GetLayerByGUID(pipelineId);
        if (pipeLayer == null) {
            return null;
        }
        var params = pipeLayer.QueryParameter;
        if (params == null) {
            return null;
        }
        params.Filter = "";
        if (spatial != null) {
            params.SetSpatialFilter(spatial);
        }
        params.QueryType = queryType;
        params.QueryTableType = queryTableType; //0为点表搜索；1为线表搜索
        var result = pipeLayer.SearchValueRangeFromGISServer(fieldName);
        return result;
    },

    /**
     *功能：排序函数
     */
    sortNumber: function(a, b) {
        return a - b;
    },

    /**
     * 功能：根据搜索结果获取值域列表。
     * 参数：result - 搜索结果
     * 返回：值域列表。
     */
    getValueRangeList: function(result) {
        if (result == null || result == "") {
            return null;
        }
        var resultDoc = loadXMLStr(result);
        var resultRoot = resultDoc.documentElement;
        if (resultRoot == null) {
            return null;
        }

        var valueRoot = resultRoot.firstChild;
        var valueRangeNode = valueRoot.selectSingleNode("ValueRange");
        if (valueRangeNode == null || valueRangeNode.childNodes.length == 0) {
            return null;
        }

        var valueRangeList = [];
        for (var i = 0; i < valueRangeNode.childNodes.length; i++) {
            valueRangeList.push(valueRangeNode.childNodes[i].text);
        }
        valueRangeList.sort(this.sortNumber);
        return valueRangeList;
    },

    /**
     * 功能：根据搜索结果获取管线的总长度。
     * 参数：result - 搜索结果
     * 返回：管线的总长度。
     */
    getTotalLength: function(result) {
        if (result == null) {
            return 0;
        }
        var totalLength = 0;
        for (var p = 0; p < result.RecordCount / 100; p++) {
            var resultXml = result.GotoPage(p);
            var resultDoc = loadXMLStr(resultXml);
            var resultRoot = resultDoc.documentElement;
            var recordRoot = resultRoot.firstChild;
            for (var i = 0; i < recordRoot.childNodes.length; i++) {
                var recordNode = recordRoot.childNodes[i];
                var length = this.getLengthByNode(recordNode);
                totalLength = totalLength + length;
            }
        }
        totalLength = parseFloat(totalLength.toFixed(3));
        return totalLength;
    },

    /**
     * 功能：获取单条管线的长度。
     * 参数：recordNode - 管线的节点信息
     * 返回：管线的长度。
     */
    getLengthByNode: function(recordNode) {
        var length = 0;
        var coordList = parent.MarkedCreator.getCoordsByNode(recordNode);
        if (coordList != null & SYSTEMPARAMS.pipeDatum != null) {
            var coordPoint1 = SYSTEMPARAMS.pipeDatum.des_BLH_to_src_xy(coordList[0].lon, coordList[0].lat, coordList[0].alt);
            var coordPoint2 = SYSTEMPARAMS.pipeDatum.des_BLH_to_src_xy(coordList[1].lon, coordList[1].lat, coordList[1].alt);
            length = parent.PipelineMeasureAlgorithm.VectorSub(coordPoint1, coordPoint2).Length;
        }
        length = parseFloat(length.toFixed(3));
        //alert(length);
        return length;
    },

    /**
     * 之前统计显示结果样式
     * 功能：显示统计结果
     * 参数：classResList - 统计结果列表; container-显示统计结果的jquery容器对象; columnNum-表的列数
     * 返回：无
     showClassificationResult: function (classResList, container, columnNum) {
        var htmlStr = '<table style="width: 100%;" cellspacing="0">';
        for (var i = 0; i < classResList.length; i++) {
            var classLayer = classResList[i];
            htmlStr = htmlStr + '<tr>';
            htmlStr = htmlStr + '<td colspan="' + columnNum + '" class="spaceForLeft" style="text-align:left; border-bottom: 1px double #56a2ff; font-weight: bold;">' + classLayer.layerName + '</td>';
            htmlStr = htmlStr + '</tr>';
            for (var k = 0; k < classLayer.dataList.length; k++) {
                var dataObj = classLayer.dataList[k];
                var trStyle = "";
                if (k % 2 == 1) {
                    trStyle = "background-color: #add8e6;"; //偶数行添加背景效果
                }
                htmlStr = htmlStr + '<tr style="' + trStyle + '">';
                for (var attr in dataObj) {
                    htmlStr = htmlStr + '<td align="center" width="' + 100 / columnNum + '%">' + dataObj[attr] + '</td>';
                }
                htmlStr = htmlStr + '</tr>';
            }
            htmlStr = htmlStr + '<tr><td height="10px"></td></tr>'; //空行，用来做图层统计间的分割
        }
        htmlStr = htmlStr + '</table>';
        container.html(htmlStr);
    },
     */
    showClassificationResult2: function(classResList, container, columnNum, ah) {
        var tdCss = "border-right: 1px double #ACA899;border-bottom: 1px double #ACA899;overflow: auto;";
        var htmlStr = '<table id="exportTab" style="width: 100%;" cellspacing="0" >';
        for (var i = 0; i < classResList.length; i++) {
            var classLayer = classResList[i];
            if (classLayer.dataList.length > 1) {
                for (var k = 0; k < classLayer.dataList.length; k++) {
                    var dataObj = classLayer.dataList[k];
                    htmlStr += '<tr>';
                    for (var attr in dataObj) {
                        if (attr != "layerName") {
                            htmlStr = htmlStr + '<td align="center" data-key="' + attr + '" style="' + tdCss + '" width="' + 100 / columnNum + '%">' + dataObj[attr] + '</td>';
                        } else {
                            htmlStr = htmlStr + '<td rowspan="' + classLayer.dataList.length + '" data-key="layerName" style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj[attr] + '</td>';
                        }
                    }
                    htmlStr = htmlStr + '</tr>';
                }
            }
        }
        if(ah){
            htmlStr += ah;
        }
        htmlStr = htmlStr + '</table>';
        container.html(htmlStr);
    },
    showClassificationResult4: function(classResList, container, columnNum, ah) {
        var tdCss = "border-right: 1px double #ACA899;border-bottom: 1px double #ACA899;overflow: auto;";
        var htmlStr = '<table id="exportTab" style="width: 100%;" cellspacing="0" >';
        for (var i = 0; i < classResList.length; i++) {
            var classLayer = classResList[i];
            if (classLayer.dataList.length > 1) {
                for (var k = 0; k < classLayer.dataList.length; k++) {
                    var dataObj = classLayer.dataList[k];
                    htmlStr = htmlStr + '<tr>';
                    if (k == 0 && dataObj["layerName"]) {
                        htmlStr = htmlStr + '<td rowspan="' + (classLayer.dataList.length - 1) + '" data-key="layerName" style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj["layerName"] + '</td>';
                        k++;
                        dataObj = classLayer.dataList[k];
                        if (!dataObj.dataType){
                            dataObj.dataType = '';
                        }
                        for (var attr in dataObj) {
                            htmlStr = htmlStr + '<td style="' + tdCss + '" data-key="' + attr + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj[attr] + '</td>';
                        }
                    } else {
                        if (!dataObj.dataType){
                            dataObj.dataType = '';
                        }
                        for (var attr in dataObj) {

                            htmlStr = htmlStr + '<td style="' + tdCss + '" data-key="' + attr + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj[attr] + '</td>';
                        }
                    }
                    htmlStr = htmlStr + '</tr>';
                }
            }
        }
        if(ah){
            htmlStr += ah;
        }
        htmlStr = htmlStr + '</table>';
        container.html(htmlStr);
    },
    showClassificationResult5: function(classResList, container, columnNum, ah) {
        var tdCss = "border-right: 1px double #ACA899;border-bottom: 1px double #ACA899;overflow: auto;";
        var htmlStr = '<table id="exportTab" style="width: 100%;" cellspacing="0" >';
        for (var i = 0; i < classResList.length; i++) {
            var classLayer = classResList[i];
            if (classLayer.dataList.length > 1) {
                for (var k = 0; k < classLayer.dataList.length; k++) {
                    var dataObj = classLayer.dataList[k];
                    htmlStr = htmlStr + '<tr>';
                    if (k == 0 && dataObj["layerName"]) {
                        htmlStr = htmlStr + '<td rowspan="' + (classLayer.dataList.length - 1) + '" data-key="layerName" style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj["layerName"] + '</td>';
                        k++;
                        dataObj = classLayer.dataList[k];
                        for (var attr in dataObj) {
                            htmlStr = htmlStr + '<td style="' + tdCss + '" data-key="' + attr + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj[attr] + '</td>';
                        }
                    } else {
                        for (var attr in dataObj) {

                            htmlStr = htmlStr + '<td style="' + tdCss + '" data-key="' + attr + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj[attr] + '</td>';
                        }
                    }
                    htmlStr = htmlStr + '</tr>';
                }
            }
        }
        if(ah){
            htmlStr += ah;
        }
        htmlStr = htmlStr + '</table>';
        container.html(htmlStr);
    },

    showClassificationResultForRoad: function(classResList, container, columnNum) {
        var tdCss = "border-right: 1px double #ACA899;border-bottom: 1px double #ACA899;overflow: auto;";
        var htmlStr = '<table id="exportTab" style="width: 100%;" cellspacing="0" >';
        for (var i = 0; i < classResList.length; i++) {
            var classLayer = classResList[i];
            if (classLayer.dataList.length > 1) {
                for (var k = 0; k < classLayer.dataList.length; k++) {
                    var dataObj = classLayer.dataList[k];
                    htmlStr = htmlStr + '<tr>';
                    if (k == 0 && dataObj["layerName"]) {
                        htmlStr = htmlStr + '<td rowspan="' + (classLayer.dataList.length - 1) + '" style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj["layerName"] + '</td>';
                        k++;
                        dataObj = classLayer.dataList[k];
                        for (var attr in dataObj) {
                            htmlStr = htmlStr + '<td style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj[attr] + '</td>';
                        }
                    } else {
                        if (dataObj.dataType == "其他") {
                            htmlStr = htmlStr + '<td style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj.dataType + '</td>';
                            htmlStr = htmlStr + '<td style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj.dataNum + '</td>';
                            htmlStr = htmlStr + '<td style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj.length + '</td>';
                        } else {
                            for (var attr in dataObj) {

                                htmlStr = htmlStr + '<td style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj[attr] + '</td>';
                            }
                        }
                    }
                    htmlStr = htmlStr + '</tr>';
                }
            }
        }
        htmlStr = htmlStr + '</table>';
        container.html(htmlStr);
    },

    showClassificationResult3: function(classResList, container, columnNum) { //分级统计
        var rows = [];
        var tdCss = "border-right: 1px double #ACA899;border-bottom: 1px double #ACA899;";
        var htmlStr = '<table id="resultTab" style="width: 100%;" cellspacing="0" >';
        for (var i = 0; i < classResList.length; i++) {
            var pushRows = false;
            var classLayer = classResList[i];
            var lagerName = classLayer.name;
            var classLayerLength = classLayer.classResList.length;
            for (var a = 0; a < classLayerLength; a++) {
                var layer = classLayer.classResList[a];
                var layerLength = layer.dataList.length;
                if (layerLength > 0) {
                    for (var k = 0; k < layerLength; k++) {
                        var dataObj = layer.dataList[k];
                        htmlStr += '<tr>';
                        //var widthTD="s"
                        htmlStr = htmlStr + '<td align="center" style="' + tdCss + ';width:' + 13 + '%" >' + dataObj.parentName + '</td>';
                        htmlStr = htmlStr + '<td align="center" style="' + tdCss + ';width:' + 13 + '%" >' + dataObj.childName + '</td>';
                        htmlStr = htmlStr + '<td align="center" style="' + tdCss + ';width:' + 13 + '%" >' + dataObj.smallName + '</td>';
                        htmlStr = htmlStr + '<td align="center" style="' + tdCss + ';width:' + 20 + '%" >' + dataObj.dataType + '</td>';
                        htmlStr = htmlStr + '<td align="center" style="' + tdCss + ';width:' + 21 + '%" >' + dataObj.dataNum + '</td>';
                        htmlStr = htmlStr + '<td align="center" style="' + tdCss + ';width:' + 21 + '%" >' + dataObj.length + '</td>';
                        htmlStr = htmlStr + '</tr>';
                        rows.push(dataObj);
                        pushRows = true;
                    }
                }
            }
            if (pushRows) {
                var total = classLayer.total.split(",");
                //htmlStr = htmlStr + '<tr><td style="' + tdCss + '">'+ lagerName+'总计: </td><td style="' + tdCss + '">-</td><td style="' + tdCss + '">-</td><td style="' + tdCss + '">-</td><td style="' + tdCss + '">'+total[0]+'</td><td style="' + tdCss + '">'+total[1]+'</td></tr>'; //空行，用来做图层统计间的分割
                htmlStr = htmlStr + '<tr><td style="' + tdCss + '">' + '<font size=1>总计' + i + '</font>' + ' </td><td style="' + tdCss + '">-</td><td style="' + tdCss + '">-</td><td style="' + tdCss + '">-</td><td style="' + tdCss + '">' + total[0] + '</td><td style="' + tdCss + '">' + total[1] + '</td></tr>'; //空行，用来做图层统计间的分割
                rows.push({
                    "总计": "0"
                });
            }
        }
        htmlStr = htmlStr + '</table>';
        container.html(htmlStr);
        return rows;
    },

    getPipeLayerBylayerId: function(layerId) {
        var layer = earth.LayerManager.GetLayerByGUID(layerId);
        var currPipeCode = layer.PipeLineType.toString();
        var childPipelineLayerIdArr = [];
        var smallPipelineLayerIdArr = [];
        var code0 = currPipeCode.charAt(0);
        var code1 = currPipeCode.charAt(1);
        var projectId = SYSTEMPARAMS.project;
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            var allCode0 = pipeCode.charAt(0); //1200-1
            var allCode1 = pipeCode.charAt(1); //1200-2
            var allCode2 = pipeCode.charAt(2); //4120-2
            var allCode3 = pipeCode.charAt(3); //6001-1
            if (allCode0 == code0 && allCode1 != "0") {
                childPipelineLayerIdArr.push(pipeLineLayer.id);
            } else if (allCode0 == code0 && allCode1 == "0" && allCode2 == "0" && allCode3 != "0") {
                childPipelineLayerIdArr.push(pipeLineLayer.id);
            }
            if (allCode0 == code0 && allCode1 != code1 && allCode2 != "0") {
                smallPipelineLayerIdArr.push(pipeLineLayer.id);
            }
        }
        var pipeLayerIdObj = {
            childPipelineLayerIdArr: childPipelineLayerIdArr,
            smallPipelineLayerIdArr: smallPipelineLayerIdArr
        };
        return pipeLayerIdObj;
    },
    /**
     * 功能：将table导出成Excel文档
     * 参数：tableId - 要导出的表对象; columns - 列标题数组
     * 返回：无
     */
    importExcelByTable: function(tabObj, columns) {
        var xls = null;
        try {
            xls = new ActiveXObject("Excel.Application");
        } catch (e) {
            xls = this.WPSExcelHv();
        }
        try {
            xls.visible = true;
            var xlsBook = xls.Workbooks.Add;
            var xlsSheet = xlsBook.WorkSheets(1);

            for (var k = 0; k < columns.length; k++) {
                xlsSheet.Cells(1, k + 1).Value = columns[k];
            }

            var rowList = tabObj.rows;
            for (var i = 0; i < rowList.length; i++) {
                var cellList = rowList[i].cells;
                for (var j = 0; j < cellList.length; j++) {
                    xlsSheet.Cells(i + 2, j + 1).Value = cellList[j].innerHTML;
                }
            }

            xls.UserControl = true;
        } catch (err) {
            //alert("出现一个异常:" + err.message);
        }
    },
    importExcelByTable2: function(tabObj, columns) {
        var xls = null;
        try {
            xls = new ActiveXObject("Excel.Application");
        } catch (e) {
           xls = this.WPSExcelHv();
        }
        xls.visible = true;
        var xlsBook = xls.Workbooks.Add;
        var xlsSheet = xlsBook.WorkSheets(1);

        for (var k = 0; k < columns.length; k++) {
            xlsSheet.Cells(1, k + 1).Value = columns[k];
        }
        //xlsSheet.Range(startcell+":"+endcell).MergeCells = true;
        //如Range("A2:H8" )即将A列第2格至H列第8格的整个区域合并为一个单元格
        // xlsSheet.Range("A2",xlsSheet.Cells(8,8)).MergeCells = true;
        var rowList = tabObj.rows;
        for (var i = 0; i < rowList.length; i++) {
            var cellList = rowList[i].cells;
            for (var j = 0; j < cellList.length; j++) {
                xlsSheet.Cells(i + 2, j + 1).Value = cellList[j].innerHTML;
            }
        }
        //xlsSheet.Range(xlsSheet.Cells(1,0),xlsSheet.Cells(8,0)).MergeCells = true;
        /* var mergeBegin=0;
        for (var i = 0; i < rowList.length; i++) {
            if(i==0){
                continue;
            }else{
                mergeBegin=
                var a=xlsSheet.Cells(i + 1, 0).Value;//上一个
                var b=xlsSheet.Cells(i + 2, 0).Value;//当前的
                if(a==b){
                    mergeBegin=
                    xlsSheet.Range(xlsSheet.Cells(mergeBegin,0),xlsSheet.Cells(i+2,0)).MergeCells = true;
                }else{

                }
            }
        }*/
        xls.UserControl = true;
    },
     WPSExcelHv:function() {
        var xls = null;
        try {
            xls = new ActiveXObject("KET.Application");
        } catch (e) {
           xls = this.WPSExcelLv();
        }
        return xls;
    },
    WPSExcelLv:function() {
        var xls = null;
        try {
            xls = new ActiveXObject("ET.Application");
        } catch (e) {
           alert("无法启动Excel\n\n如果您确信您的电脑中已经安装了Excel, 那么请调整IE的安全级别\n" +
                "具体的操作：\n" +
                "工具 -> Internet选项 -> 安全 -> 自定义级别 -> 对没有标记为安全的ActiveX进行初始化和脚本运行 -> 启用");
          return;
        }
        return xls;
    },
    /**
     * 功能：将table导出成Excel文档
     * 参数：dataArr - 要导出的一维数组数据; columns - 列标题数组
     * 返回：无
     */
    importExcelByOneArr: function(dataArr, columns) {
        var xls = null;
        try {
            xls = new ActiveXObject("Excel.Application");
        } catch (e) {
            xls = this.WPSExcelHv();
        }
        try {
            xls.visible = true;
            var xlsBook = xls.Workbooks.Add;
            var xlsSheet = xlsBook.WorkSheets(1);

            for (var k = 0; k < columns.length; k++) {
                xlsSheet.Cells(1, k + 1).Value = columns[k];
            }

            for(var i = 0; i < dataArr.length; i++){
                xlsSheet.Cells(i + 2, 1).Value = dataArr[i];
            }

            xls.UserControl = true;
        } catch (err) {
            //alert("出现一个异常:" + err.message);
        }
    },

    /**
     * 功能：将table导出成Excel文档
     * 参数：dataArr - 要导出的二维数组数据; columns - 列标题数组
     * 返回：无
     */
    importExcelByTwoArr: function(dataArr, columns) {
        var xls = null;
        try {
            xls = new ActiveXObject("Excel.Application");
        } catch (e) {
           xls = this.WPSExcelHv();
        }
        try {
            xls.visible = true;
            var xlsBook = xls.Workbooks.Add;
            var xlsSheet = xlsBook.WorkSheets(1);

            for (var k = 0; k < columns.length; k++) {
                xlsSheet.Cells(1, k + 1).Value = columns[k];
            }

            for(var i = 0; i < dataArr.length; i++){
                for(var j = 0; j < dataArr[i].length; j++){
                    xlsSheet.Cells(i + 2, j+1).Value = dataArr[i][j];
                }
            }

            xls.UserControl = true;
        } catch (err) {
            //alert("出现一个异常:" + err.message);
        }
    },

    /**
     * 功能：根据管线图层ID初始化该管线的编码映射文件对象和空间参考对象
     * 参数：layerId - 管线图层ID; isInitDoc-是否初始化管线的编码映射文件对象; isInitDatum-是否初始化管线的空间参考对象
     * 返回：无
     */
    initPipeConfigDoc: function(layerId, isInitDoc, isInitDatum) {
        /*if (layerId.indexOf("_") > 0) {
         layerId = layerId.split("_")[0];
         }
         var layer = earth.LayerManager.GetLayerByGUID(layerId);
         var projectSetting = layer.ProjectSetting;
         var layerLink = projectSetting.PipeConfigFile;
         */
        /*if(this.pipeConfigLink == layerLink){
         return;
         }  */
        /*

         this.pipeConfigLink = layerLink;
         if (isInitDoc == true&&layerLink!="") { //初始化管线编码映射文件对象
         var configUrl = "http://" + layerLink.substr(2).replace("/", "/sde?") + "_sde";
         this.pipeConfigDoc = loadXMLFile(configUrl); //初始化编码映射文件对象
         }

         if (isInitDatum == true) { //初始化管线空间参考对象
         var spatialUrl = "http://" + projectSetting.SpatialRefFile.substr(2).replace("/", "/sde?") + "_sde";
         this.pipeDatum = parent.CoordinateTransform.createDatum(spatialUrl);
         }*/
    },

    /**
     * 功能：根据编码，获取编码对应的详细值
     * 参数：type-编码类型；codeId - 编码ID
     * 返回：编码对应的详细值
     */
    // getValueByCode: function(type, codeId) {
    //     var value = "其他";
    //     if (codeId === "0" || codeId === " " || codeId === "" || codeId === 0 || codeId === undefined) {
    //         value = "";
    //         return;
    //     }
    //     var a;
    //     if(earthCtx.SYSTEMPARAMS){
    //         var SYSTEMPARAMS = earthCtx.SYSTEMPARAMS;
    //     }
    //     if (!SYSTEMPARAMS) {
    //         a = earth.pipeConfigDoc
    //     } else {
    //         a = SYSTEMPARAMS.pipeConfigDoc;
    //     }
    //     if (a == null) {
    //         return;
    //     }
    //     if (type == "") {
    //         return;
    //     }
    //     var nodes = a.getElementsByTagName(type);
    //     for (var i = 0; i < nodes.length; i++) {
    //         var node = nodes[i];
    //         var codeNode = node.selectSingleNode("Code");
    //         if (parseFloat(codeNode.text) == parseFloat(codeId)) {
    //             value = node.selectSingleNode("Name").text;
    //             break;
    //         }
    //     }
    //     return value;
    // },

    //------------------------------------------------------------------------
    //分段统计
    //------------------------------------------------------------------------
    /**
     * 功能：初始化统计范围列表
     * 参数：container-显示统计范围的jquery对象; rangeList-要显示的元素列表
     * 返回：无
     */
    showRangeList: function(container, rangeList) {
        container.html("");
        var htmlStr = '<table style="width:100%;" cellspacing="1">';
        container.append();
        for (var k = 0; k < rangeList.length; k++) {
            htmlStr = htmlStr + '<tr><td style="text-align:left; cursor:default;" onclick="StatisticsMgr.selectSingleRow(this)">' + rangeList[k] + '</td></tr>';
        }
        htmlStr = htmlStr + '</table>';
        container.html(htmlStr);
    },

    /**
     * 功能：在“统计范围”列表中添加一行
     * 参数：downValue-下限值； upValue-上限值; container-统计范围列表的JQuery对象
     */
    appendStatisticsRangeRow: function(downValue, upValue, container) {
        var htmlStr = '<tr>';
        htmlStr = htmlStr + '<td class="downLimitTd" onclick="ectx.StatisticsMgr.selectSingleRow(this)" ondblclick="StatisticsMgr.editSingleCell(this)">' + downValue + '</td>';
        htmlStr = htmlStr + '<td class="upLimitTd" onclick="ectx.StatisticsMgr.selectSingleRow(this)" ondblclick="StatisticsMgr.editSingleCell(this)">' + upValue + '</td>';
        htmlStr = htmlStr + '</tr>';
        container.append(htmlStr);
    },

    /**
     * 功能：单行选择表中的某一行
     * 参数：obj - 选择的表单元格对象
     * 返回：无
     */
    selectSingleRow: function(obj) {
        var trObj = obj.parentNode;
        var tableObj = trObj.parentNode;
        for (var i = 0; i < tableObj.rows.length; i++) {
            tableObj.rows[i].style.color = "#000000";
            tableObj.rows[i].style.backgroundColor = "transparent";
        }
        trObj.style.color = "#ffffff";
        trObj.style.backgroundColor = "#316ac5";
        tableObj.parentNode.selectIndex = trObj.rowIndex;
    },

    /**
     * 功能：使表单元格处于可编辑状态
     * 参数：obj - 选择的表单元格对象
     * 返回：无
     */
    editSingleCell: function(obj) {
        var value = obj.innerHTML;
        if (value.toLowerCase().indexOf("<input") != -1) {
            return;
        }
        obj.innerHTML = '<input style="width:29px;" type="text" value="' + value + '" onfocus="StatisticsMgr.focusSingleCell(this)" onblur="StatisticsMgr.unFocusSingleCell(this)"/>';
        obj.firstChild.focus();
    },

    /**
     * 功能：表单元格编辑框的onfocus事件 - 即编辑框获得焦点的事件
     * 参数：obj - 选择的表单元格对象
     * 返回：无
     */
    focusSingleCell: function(obj) {
        obj.select();
    },

    /**
     * 功能：表单元格编辑框的onblur事件- 即编辑框失去焦点的事件
     * 参数：obj - 选择的表单元格对象
     * 返回：无
     */
    unFocusSingleCell: function(obj) {
        var value = obj.value;
        obj.parentNode.innerHTML = value;
    },
    /*sphereGotoLookat: function(key, subLayer, layerID, pointKey, bShow, originCoord, htmlStr) {
        var deep = 0; //管点埋深
        var pointHeight = 0; //管线半径&高度;
        if (pointKey) {
            // pointKey=key;
        }
        var US_SPT_KEY = getName("US_SPT_KEY", 1, true);
        var filterStartKey = "(and,eq," + US_SPT_KEY + "," + pointKey + ")";

        var US_EPT_KEY = getName("US_EPT_KEY", 1, true);
        var filterEndKey = "(and,eq," + US_EPT_KEY + "," + pointKey + ")";

        var lineResult = this.paramQuery(null, layerID, filterStartKey, 16, 1);
        var lintGotoPage = lineResult.GotoPage(0);
        if (lintGotoPage == "error" || (lineResult!=null && lineResult.RecordCount < 1)) { //用终点key再次查询
            lineResult = this.paramQuery(null, layerID, filterEndKey, 16, 1);
            lintGotoPage = lineResult.GotoPage(0);
        }
        if (lintGotoPage != "error") {
            var lineJson = $.xml2json(lintGotoPage);
            var lineRecords = lineJson.Result.Record;
            if (typeof(lineRecords) == "object") {
                var lineStartKey = lineRecords[getName("US_SPT_KEY", 1, true)];
                var lineEndKey = lineRecords[getName("US_EPT_KEY", 1, true)];
                var startDeep = lineRecords[getName("US_SDEEP", 1, true)];
                var endDeep = lineRecords[getName("US_EDEEP", 1, true)];
                pointHeight = parseInt(lineRecords[getName("US_SIZE", 1, true)]);

                if (lineStartKey == pointKey) {
                    deep = startDeep;
                } else if (lineEndKey == pointKey) {
                    deep = endDeep;
                }
            } else if (lineRecords instanceof Array) {
                for (var l = 0; l < lineRecords.length; l++) {
                    var red = lineRecords[l];
                    var lineStartKey = red[getName("US_SPT_KEY", 1, true)];
                    var lineEndKey = red[getName("US_EPT_KEY", 1, true)];
                    var startDeep = red[getName("US_SDEEP", 1, true)];
                    var endDeep = red[getName("US_EDEEP", 1, true)];
                    pointHeight = parseInt(lineRecords[getName("US_SIZE", 1, true)]);
                    if (lineStartKey == pointKey) {
                        deep = startDeep;
                        break;
                    } else if (lineEndKey == pointKey) {
                        deep = endDeep;
                        break;
                    }
                }
            }
        }

        var uskey = getName("US_KEY", 0, true);
        var strPara = "";

        strPara += "(or,equal," + uskey + "," + pointKey + ")";

        var param = subLayer.QueryParameter;
        param.Filter = strPara;
        param.QueryType = 17; // SE_AttributeData
        // 0：SE_Table_Point，1：SE_Table_Line
        param.QueryTableType = 0;
        var result = subLayer.SearchFromGISServer();
        var PointResult = result.GotoPage(0);
        var object = result.GetLocalObject(0);
        var json = $.xml2json(PointResult);
        var records = json.Result.Record;
        if (records) {
            var pointShape = records.SHAPE.Point.Coordinates;
            var x = null;
            var y = null;
            for (var i = 0; i < pointShape.split(",").length; i += 3) {
                x = pointShape.split(",")[i];
                y = pointShape.split(",")[i + 1];
            }
            var layer = earth.LayerManager.GetLayerByGUID(layerID);
            var intLayerCode = layer.PipeLineType;

            earth.Event.OnGetAltitudeFinished = function(geopoint) {
                if (geopoint) {
                    var h = geopoint.Altitude;
                    pointHeight = (parseFloat(pointHeight) / 1000) / 2; //半径
                    var z = Number(h) - Number(deep) - Number(pointHeight);
                    if (intLayerCode >= 4000 && intLayerCode < 5000) {
                        z = Number(h) - Number(deep) + Number(pointHeight); //排水
                    }
                    if (bShow) {
                        showHtmlBalloon(x, y, z, htmlStr);
                    }
                    StatisticsMgr.createElementSphere(x, y, z); //创建球
                    earth.GlobeObserver.GotoLookat(x, y, z, 0.0, 89.0, 0, 6);
                }
            }
            earth.GlobeObserver.GetAltitudeFromNet(x, y);
        }
    },*/
    sphereGotoLookat: function(key, subLayer, layerID, pointKey, bShow, originCoord, htmlStr) {
        var deep = 0; //管点埋深
        var pointHeight = 0; //管线半径&高度;
        var US_SPT_KEY = getName("US_SPT_KEY", 1, true);
        var filterStartKey = "(and,eq," + US_SPT_KEY + "," + pointKey + ")";

        var US_EPT_KEY = getName("US_EPT_KEY", 1, true);
        var filterEndKey = "(and,eq," + US_EPT_KEY + "," + pointKey + ")";

        var lineResult = this.paramQuery(null, layerID, filterStartKey, 16, 1);
        var lintGotoPage = lineResult.GotoPage(0);
        if (lintGotoPage == "error" || (lineResult!=null && lineResult.RecordCount < 1)) { //用终点key再次查询
            lineResult = this.paramQuery(null, layerID, filterEndKey, 16, 1);
            lintGotoPage = lineResult.GotoPage(0);
        }
        if (lintGotoPage != "error") {
            var lineJson = $.xml2json(lintGotoPage);
            var lineRecords = lineJson.Result.Record;
            if (typeof(lineRecords) == "object") {
                var lineStartKey = lineRecords[getName("US_SPT_KEY", 1, true)];
                var lineEndKey = lineRecords[getName("US_EPT_KEY", 1, true)];
                var startDeep = lineRecords[getName("US_SDEEP", 1, true)];
                var endDeep = lineRecords[getName("US_EDEEP", 1, true)];
                pointHeight = parseInt(lineRecords[getName("US_SIZE", 1, true)]);

                if (lineStartKey == pointKey) {
                    deep = startDeep;
                } else if (lineEndKey == pointKey) {
                    deep = endDeep;
                }
            } else if (lineRecords instanceof Array) {
                for (var l = 0; l < lineRecords.length; l++) {
                    var red = lineRecords[l];
                    var lineStartKey = red[getName("US_SPT_KEY", 1, true)];
                    var lineEndKey = red[getName("US_EPT_KEY", 1, true)];
                    var startDeep = red[getName("US_SDEEP", 1, true)];
                    var endDeep = red[getName("US_EDEEP", 1, true)];
                    pointHeight = parseInt(lineRecords[getName("US_SIZE", 1, true)]);
                    if (lineStartKey == pointKey) {
                        deep = startDeep;
                        break;
                    } else if (lineEndKey == pointKey) {
                        deep = endDeep;
                        break;
                    }
                }
            }
        }

        var uskey = getName("US_KEY", 0, true);
        var strPara = "";

        strPara += "(or,equal," + uskey + "," + pointKey + ")";

        var param = subLayer.QueryParameter;
        param.Filter = strPara;
        param.QueryType = 17; // SE_AttributeData
        // 0：SE_Table_Point，1：SE_Table_Line
        param.QueryTableType = 0;
        var result = subLayer.SearchFromGISServer();
        var PointResult = result.GotoPage(0);
        var object = result.GetLocalObject(0);
        var json = $.xml2json(PointResult);
        var records = json.Result.Record;
        if (records) {
            if(bShow&&htmlStr==null){
                StatisticsMgr.showNotLineSphere(layerID, records, htmlStr, deep, pointHeight, bShow);
            }else{
                StatisticsMgr.showNotLineBalloon(layerID, records, htmlStr, deep, pointHeight, bShow);
            }
        }
    },
    sphereGotoLookat2: function(key, subLayer, layerID, pointKey, bShow, originCoord, htmlStr) {
        var lyr = earth.LayerManager.GetLayerByGUID(layerID);
        if(SFM.queryHelper){
            SFM.queryHelper.getLayerList().then(function(data){
                var lk = SFM.queryHelper.getLayerKey(lyr.Name, SFM.queryHelper.TYPE_POINT);
                if(!lk || lk.length == 0){
                    return;
                }
                SFM.queryHelper.queryByKey(lk[0], key).then(function(data){
                    var d = data && data.getMe;
                    if(d && d.length > 0){
                        d = d[0];
                        try{
                            var c = JSON.parse(d.geometry.geometryJSON).coordinates;
                            var o = null;
                            var datum = (o = window.SYSTEMPARAMS || SYSTEMPARAMS) && o.pipeDatum;
                            var p = SFM.queryHelper.xy2blh(datum, {x: c[0], y: c[1]});
                            earth.GlobeObserver.GotoLookat(p.x, p.y, d.attributes.ST_PT_ALT, 0, 90, 0, 20);
                            if(bShow){
                                var h = SFM.queryHelper.getAttrHtml(d.fields, d.attributes);
                                SFM.queryHelper.showHtmlBalloon(p.x, p.y, d.attributes.ST_PT_ALT, h);
                            }
                        }catch(e){}
                    }
                }, function(msg){
                    alert(msg);
                });
            });
        }
    },
    showNotLineSphere: function(layerID, record, htmlStr, deep, pointHeight, bShow){
        htmlStr = '<div style="word-break:keep-all;white-space:nowrap;overflow:auto;width:265px;height:310px;margin-top:25px;margin-bottom:25px"><table style="font-size:16px;background-color: #ffffff; color: #fffffe">';
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
        var attachment_caption = getNameNoIgnoreCase("US_ATTACHMENT",0,false);
        var pointType_caption = getNameNoIgnoreCase("US_PT_TYPE",0,false);

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
        var strPara2 = "(and,equal," +us_key+",";
        strPara2 += strKey;
        strPara2 += ")";
        var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var strConn=layer.GISServer + "dataquery?service=" + layerID + "&qt=17&dt=point&pc="+strPara2+"&pg=0,100";
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
                StatisticsMgr.showNotLineBalloon(layerID, record, htmlStr, deep, pointHeight, bShow);
            }
        }
        earth.DatabaseManager.GetXml(strConn);
    },
    showNotLineBalloon: function(layerID, record, htmlStr, deep, pointHeight, bShow){
        var pointShape = record.SHAPE.Point.Coordinates;
        var x = null;
        var y = null;
        for (var i = 0; i < pointShape.split(",").length; i += 3) {
            x = pointShape.split(",")[i];
            y = pointShape.split(",")[i + 1];
        }
        var layer = earth.LayerManager.GetLayerByGUID(layerID);
        var intLayerCode = layer.PipeLineType;

        earth.Event.OnGetAltitudeFinished = function(geopoint) {
            if (geopoint) {
                var h = geopoint.Altitude;
                pointHeight = (parseFloat(pointHeight) / 1000) / 2; //半径
                var z = Number(h) - Number(deep) - Number(pointHeight);
                if (intLayerCode >= 4000 && intLayerCode < 5000) {
                    z = Number(h) - Number(deep) + Number(pointHeight); //排水
                }
                if (bShow) {
                    parent.showHtmlBalloon(x, y, z, htmlStr);
                }
                StatisticsMgr.createElementSphere(x, y, z); //创建球
                earth.GlobeObserver.GotoLookat(x, y, z, 0.0, 89.0, 0, 6);
            }
        }
        earth.GlobeObserver.GetAltitudeFromNet(x, y);
    },
    createElementSphere: function(x, y, h) {
        var radius = 0.3;
        h = h - parseFloat(radius);
        if (elementSphere != null) {
            earth.DetachObject(elementSphere);
            elementSphere = null;
        }
        //获取工厂对象
        var factory = earth.Factory;
        //创建GUID
        var sphereGuid = factory.CreateGUID();
        //创建模型对象
        elementSphere = factory.CreateElementSphere(sphereGuid, "sphere");
        elementSphere.BeginUpdate();
        var lon = x;
        var lat = y;
        var alt = h;
        elementSphere.SphericalTransform.SetLocationEx(lon, lat, alt);
        elementSphere.FillColor = parseInt("0x77ff0000");
        elementSphere.Radius = radius;
        elementSphere.Underground = true;
        elementSphere.EndUpdate();
        earth.ShapeCreator.Clear();
        earth.AttachObject(elementSphere);
        elementSphere.ShowHighLight();
        bFlagIndex = true;
        clearTimeout(id_timeout);
        id_timeout = setTimeout(function(){
            if(elementSphere != null){
                earth.DetachObject(elementSphere);
                elementSphere = null;
            }
        },7000);
    },
    detachShere: function() {
        if (elementSphere != null) {
            earth.DetachObject(elementSphere);
            elementSphere = null;
        }
    },
    paramQuery: function(pFeat, guid, filter, queryType, queryTableType) {
        var layer = earth.LayerManager.GetLayerByGUID(guid);
        var subLayer = null;
        for (var i = 0, len = layer.GetChildCount(); i < len; i++) {
            subLayer = layer.GetChildAt(i);
            if (subLayer.LayerType == "Container" || subLayer.LayerType === "Model_container") { // 使用具体的_container图层
                break;
            }
        }
        if (subLayer == null) {
            return;
        }
        var param = subLayer.QueryParameter;
        param.ClearSpatialFilter();
        if (filter != null) {
            param.Filter = filter;
        }
        if (pFeat != null) {
            param.SetSpatialFilter(pFeat);
        }
        if (queryTableType != null) {
            param.QueryTableType = queryTableType; // 0：SE_Table_Point，1：SE_Table_Line
        }
        param.QueryType = queryType; // SE_AttributeData
        param.PageRecordCount = 12;
        var result = subLayer.SearchFromGISServer();
        return result;
    },
    statisticsParamQuery: function(pipelineId, spatial, low, upper, field) {
        var layer = earth.LayerManager.GetLayerByGUID(pipelineId);
        var subLayer = null;
        for (var i = 0, len = layer.GetChildCount(); i < len; i++) {
            subLayer = layer.GetChildAt(i);
            if (subLayer.LayerType == "Container" || subLayer.LayerType === "Model_container") { // 使用具体的_container图层
                break;
            }
        }
        if (subLayer == null) {
            return;
        }
        var params = subLayer.QueryParameter;
        if (params == null) {
            return null;
        }
        params.ClearCompoundCondition();
        params.ClearSpatialFilter();
        params.ClearRanges();
        params.AddRange(low, upper);
        params.SetClassCountField(field);

        if (spatial != null) {
            params.SetSpatialFilter(spatial);
        }
        params.QueryType = 3;
        params.QueryTableType = 1; //0为点表搜索；1为线表搜索
        var result = subLayer.ClassCountRange();
        return result;
    },
    statisticsTypeParamQuery: function(pipelineId, spatial, field, queryTableType, filter, compoundCondition) {
        var layer = earth.LayerManager.GetLayerByGUID(pipelineId);
        var subLayer = null;
        for (var i = 0, len = layer.GetChildCount(); i < len; i++) {
            subLayer = layer.GetChildAt(i);
            if (subLayer.LayerType == "Container" || subLayer.LayerType === "Model_container") { // 使用具体的_container图层
                break;
            }
        }
        if (subLayer == null) {
            return;
        }
        var params = subLayer.QueryParameter;
        if (params == null) {
            return null;
        }
        params.ClearCompoundCondition();
        params.ClearSpatialFilter();
        params.ClearRanges();
        if (compoundCondition != null) {
            var cc = compoundCondition.split(",");
            params.SetCompoundCondition(cc[0], cc[1], parseFloat(cc[2]).toFixed(3));
        }

        if (field != null) {
            params.SetClassCountField(field);
        }

        if (spatial != null) {
            params.SetSpatialFilter(spatial);
        }
        params.Filter = "";
        if (filter != null) {
            params.Filter = filter;
        }
        params.QueryType = 3;
        params.QueryTableType = queryTableType; //0为点表搜索；1为线表搜索
        var result = subLayer.ClassCount();
        return result;
    },

    getChildPipelineList: function(layerId) {
        var childPipelineLayerIdArr = [];
        var layer = earth.LayerManager.GetLayerByGUID(layerId);
        var currPipeCode = layer.PipeLineType.toString();
        var code0 = currPipeCode.charAt(0); //1200-2
        var projectId = SYSTEMPARAMS.project;
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            var allCode0 = pipeCode.charAt(0); //1200-2
            var allCode1 = pipeCode.charAt(1); //1200-2
            var allCode2 = pipeCode.charAt(2); //4120-2
            var allCode3 = pipeCode.charAt(3); //6001-1
            if (allCode0 == code0 && allCode1 != "0") {
                childPipelineLayerIdArr.push(pipeLineLayer.id);
            } else if (allCode0 == code0 && allCode1 == "0" && allCode2 == "0" && allCode3 != "0") {
                childPipelineLayerIdArr.push(pipeLineLayer.id);
            }
        }
        return childPipelineLayerIdArr;
    },
    getSmallPipelineList: function(layerId, cf, spatial, filter, compoundCondition, classLayer) {
        var smallPipelineLayerIdArr = [];
        var layer = earth.LayerManager.GetLayerByGUID(layerId);
        var currPipeCode = layer.PipeLineType.toString();
        var code0 = currPipeCode.charAt(0); //1200-2
        var code1 = currPipeCode.charAt(1); //1200-2
        var projectId = SYSTEMPARAMS.project;
        var layer = earth.LayerManager.GetLayerByGUID(projectId);
        var pipelineList = this.getPipeListByLayer(layer);
        if (pipelineList == null) {
            return;
        }
        for (var i = 0; i < pipelineList.length; i++) {
            var pipeLineLayer = pipelineList[i];
            var pipeCode = pipeLineLayer.LayerType.toString();
            var allCode0 = pipeCode.charAt(0); //1200-2
            var allCode1 = pipeCode.charAt(1); //1200-2
            var allCode2 = pipeCode.charAt(2); //4120-2
            if (allCode0 == code0 && allCode1 != code1 && allCode2 != "0") {
                smallPipelineLayerIdArr.push(pipeLineLayer.id);
            }
        }
        return smallPipelineLayerIdArr;
    },
    arrSortBytwo: function(array_1) {
        var arr1 = [];
        var arr2 = [];
        var arr3 = [];
        for (var i = 0; i < array_1.length; i++) {
            var arr = array_1[i];
            if (arr.dataType) {
                if (arr.dataType.indexOf("X") != -1) {
                    arr1.push(arr)
                } else {
                    arr2.push(arr)
                }
            } else {
                arr3.push({
                    layerName: arr.layerName
                });
            }
        }
        return arr3.concat(arr2, arr1);
    },
    fieldClassification: function(spatial, field, queryTableType, filter, compoundCondition, chartTitle) {
        var classResList = [];
        //要传递到chart统计的数据
        var layers = [];
        var fields;
        if (chartTitle === "特征分类统计图" || chartTitle === "附属物分类统计图") {
            fields = [{
                pointType: "点性质"
            }, {
                pointNum: "点数"
            }];
        } else {
            fields = [{
                dataType: "埋深"
            }, {
                dataNum: "数量"
            }, {
                length: "长度"
            }];
        }
        var chartTitle = chartTitle;

        $(":checkbox:checked").each(function() {
            var layerId = $(this).val();
            var layerName = $(this).next("label").html();
            layers.push(layerName);
            var classLayer = {
                chartTitle: chartTitle,
                layer: layers,
                fields: fields,
                layerName: layerName,
                dataList: [{
                    layerName: layerName
                }]
            };
            var result = StatisticsMgr.statisticsTypeParamQuery(layerId, spatial, field, queryTableType, filter, compoundCondition);
            if (result != "") {
                var json = $.xml2json(result);
                if (json == null || json == "") {
                    return;
                }
                var items = json.Item;
                var len = items.length;
                if (typeof len == "number") {
                    var lengthCount = 0;
                    var numCount = 0;
                    for (var i = 0; i < len; i++) {
                        var item = items[i];
                        var subtotal = StatisticsMgr.getItem(item, classLayer, field);
                        lengthCount = parseFloat(lengthCount) + parseFloat(subtotal.split(",")[0]);
                        numCount = parseFloat(numCount) + parseFloat(subtotal.split(",")[1]);
                    }
                    if (numCount != 0) {
                        classLayer.dataList = StatisticsMgr.arrSortBytwo(classLayer.dataList);
                        classLayer.dataList.push({
                            dataType: "小计",
                            dataNum: numCount,
                            length: parseFloat(lengthCount).toFixed(3)
                        });
                    } else {
                        classLayer.dataList.push({
                            dataType: "小计",
                            length: lengthCount
                        });
                    }
                } else {
                    var item = items;
                    StatisticsMgr.getItem(item, classLayer, field);
                }
            }
            classResList.push(classLayer);
        });
        return classResList;
    },
    fieldClassification2: function(spatial, cf, filter, compoundCondition, chartTitle, obj) { //行政区统计 埋设统计
        var classResList = [];
        //要传递到chart统计的数据
        var layers = [];
        var fields = [{
            dataType: "埋深"
        }, {
            dataNum: "数量"
        }, {
            length: "长度"
        }];
        var chartTitle = chartTitle;
        $(":checkbox:checked").each(function() {
            var layerId = $(this).val();
            var layerName = $(this).next("label").html();
            layers.push(layerName);
            var classLayer = {
                chartTitle: chartTitle,
                layer: layers,
                fields: fields,
                dataList: [{
                    layerName: layerName
                }]
            };
            for (var c = 0; c < cf.length; c++) {
                var field = cf[c];
                var result = "";
                if (field == "US_ATTACHMENT") {
                    /*  if (field == "US_ATTACHM") {*/
                    field = getName("US_ATTACHMENT", 0, true);
                    if (chartTitle === "埋设统计图") {
                        if (obj) {
                            var ptField = getName(obj["field"], 0, true); //管点
                            var bTime = obj["bTime"];
                            var eTime = obj["eTime"];
                            filter = "(and,greaterequal," + ptField + "," + bTime + ")(and,lessequal," + ptField + "," + eTime + ")";
                        }
                    }
                    result = StatisticsMgr.statisticsTypeParamQuery(layerId, spatial, field, 0, filter, compoundCondition);

                } else {
                    field = getName("US_PMATER", 1, true);
                    if (chartTitle === "埋设统计图") {
                        if (obj) {
                            var lineField = getName(obj["field"], 1, true); //管线
                            var bTime = obj["bTime"];
                            var eTime = obj["eTime"];
                            filter = "(and,greaterequal," + lineField + "," + bTime + ")(and,lessequal," + lineField + "," + eTime + ")";
                        }
                    }
                    result = StatisticsMgr.statisticsTypeParamQuery(layerId, spatial, field, 1, filter, compoundCondition);
                }
                if (result != "") {
                    var json = $.xml2json(result);
                    if (json == null || json == "") {
                        continue;
                    }
                    var items = json.Item;
                    var len = items.length;


                    if (typeof len == "number") {

                        var lengthCount = 0;
                        var numCount = 0;
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            var subtotal = StatisticsMgr.getItem(item, classLayer, field, true);
                            lengthCount = parseFloat(lengthCount) + parseFloat(subtotal.split(",")[0]);
                            numCount = parseFloat(numCount) + parseFloat(subtotal.split(",")[1]);
                        }
                        if (numCount != 0) {
                            classLayer.dataList.push({
                                dataType: "小计",
                                dataNum: numCount,
                                length: parseFloat(lengthCount).toFixed(3)
                            });
                        } else {
                            var otherObj = StatisticsMgr.arrSort(classLayer.dataList);
                            if (otherObj) {
                                classLayer.dataList = StatisticsMgr.arr_del(classLayer.dataList, otherObj.index + 1);
                                classLayer.dataList.push({
                                    dataType: "其他",
                                    length: "-",
                                    dataNum: otherObj.dataNum
                                });
                            }
                            classLayer.dataList.push({
                                dataType: "小计",
                                dataNum: lengthCount,
                                length: "-"
                            });
                        }
                    } else {
                        var lengthCount = 0;
                        var numCount = 0;
                        var subtotal = StatisticsMgr.getItem(items, classLayer, field, true);
                        lengthCount = parseFloat(lengthCount) + parseFloat(subtotal.split(",")[0]);
                        numCount = parseFloat(numCount) + parseFloat(subtotal.split(",")[1]);
                        if (numCount != 0) {
                            classLayer.dataList.push({
                                dataType: "小计",
                                dataNum: numCount,
                                length: parseFloat(lengthCount).toFixed(3)
                            });
                        } else {
                            var otherObj = StatisticsMgr.arrSort(classLayer.dataList);
                            if (otherObj) {
                                classLayer.dataList = StatisticsMgr.arr_del(classLayer.dataList, otherObj.index + 1);
                                classLayer.dataList.push({
                                    dataType: "其他",
                                    length: "-",
                                    dataNum: otherObj.dataNum
                                });
                            }
                            classLayer.dataList.push({
                                dataType: "小计",
                                dataNum: lengthCount,
                                length: "-"
                            });
                        }
                    }
                }
            }
            classResList.push(classLayer);
        });
        return classResList;
    },
    arrSort: function(arr) {
        var otherDataObj = null;
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i];
            if (a.dataType == "其他") {
                otherDataObj = {
                    index: i,
                    dataNum: a.dataNum
                };
                break;
            }
        }
        return otherDataObj;
    },
    arr_del: function(arr, d) {
        return arr.slice(0, d - 1).concat(arr.slice(d));
    },
    fieldClassification3: function(spatial, cf, filter, compoundCondition) {
        var classResList = [];
        $(":checkbox:checked").each(function() {
            var layerId = $(this).val();
            var layerName = $(this).next("label").html();
            var classLayer = {
                dataList: [{
                    layerName: layerName
                }]
            };
            for (var c = 0; c < cf.length; c++) {
                var field = cf[c];
                var result = "";
                if (field == "US_PDIAM") {
                    result = StatisticsMgr.statisticsTypeParamQuery(layerId, spatial, field, 1, filter, compoundCondition);
                } else {
                    result = StatisticsMgr.statisticsTypeParamQuery(layerId, spatial, field, 1, filter, compoundCondition);
                }
                if (result != "") {
                    var json = $.xml2json(result);
                    if (json == null || json == "") {
                        continue;
                    }
                    var items = json.Item;
                    var len = items.length;
                    if (typeof len == "number") {
                        var lengthCount = 0;
                        var numCount = 0;
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            var subtotal = StatisticsMgr.getItem(item, classLayer, field);
                            lengthCount = parseFloat(lengthCount) + parseFloat(subtotal.split(",")[0]);
                            numCount = parseFloat(numCount) + parseFloat(subtotal.split(",")[1]);
                        }
                        if (numCount != 0) {
                            classLayer.dataList.push({
                                dataType: "小计",
                                dataNum: numCount,
                                length: parseFloat(lengthCount).toFixed(3)
                            });
                        } else {
                            classLayer.dataList.push({
                                dataType: "小计",
                                length: lengthCount
                            });
                        }
                    } else {
                        StatisticsMgr.getItem(items, classLayer, field);
                        classLayer.dataList.push({
                            dataType: "小计",
                            dataNum: numCount,
                            length: parseFloat(lengthCount).toFixed(3)
                        });
                    }
                }
            }
            classResList.push(classLayer);
        });
        return classResList;
    },
    fieldClassification4: function(spatial, cf, filter, compoundCondition) {
        var classResult = [];
        $(":checkbox:checked").each(function() {
            var classResList = [];
            var layerGuidList = [];
            var tempGuidArr = [];
            var code = $(this).val();
            var layerName = $(this).next("label").html();
            var pipelineObj = StatisticsMgr.getPipelineByCode(code);
            if (pipelineObj.id) { //大类
                tempGuidArr.push(pipelineObj.id);
                layerGuidList.push({
                    id: pipelineObj.id,
                    name: layerName,
                    type: 0,
                    parentId: 0,
                    parentName: layerName,
                    childName: layerName,
                    smallName: layerName
                });
            }
            var childPipelineObj = StatisticsMgr.getChildPipelineListByCode(code);
            if (childPipelineObj && childPipelineObj.length > 0) {
                for (var i = 0; i < childPipelineObj.length; i++) {
                    var childPipeline = childPipelineObj[i];
                    var childObj = {
                        id: childPipeline.id,
                        type: 1,
                        name: childPipeline.configName,
                        parentId: pipelineObj.id,
                        parentName: layerName,
                        childName: childPipeline.configName,
                        smallName: childPipeline.configName
                    };
                    var inArr = $.inArray(childPipeline.id, tempGuidArr);
                    if (inArr == -1) {
                        layerGuidList.push(childObj);
                        tempGuidArr.push(childPipeline.id);
                    }
                    var smallPipelineObj = StatisticsMgr.getSmallPipelineListByCode(childPipeline.code);
                    if (smallPipelineObj && smallPipelineObj.length > 0) {
                        for (var j = 0; j < smallPipelineObj.length; j++) {
                            var smallPipeline = smallPipelineObj[j];
                            var smallPipelineCode = smallPipeline.code.toString();
                            var smallPipelineCode1 = smallPipelineCode.charAt(1);
                            var smallPipelineCode2 = smallPipelineCode.charAt(2);
                            var smallObj;
                            if (smallPipelineCode1 == "0" && smallPipelineCode2 == "0") {
                                smallObj = {
                                    id: smallPipeline.id,
                                    type: 2,
                                    name: smallPipeline.configName,
                                    parentId: childPipeline.id,
                                    parentName: layerName,
                                    childName: smallPipeline.configName,
                                    smallName: smallPipeline.configName
                                };
                            } else {
                                smallObj = {
                                    id: smallPipeline.id,
                                    type: 2,
                                    name: smallPipeline.configName,
                                    parentId: childPipeline.id,
                                    parentName: layerName,
                                    childName: childPipeline.configName,
                                    smallName: smallPipeline.configName
                                };
                            }

                            var inArr = $.inArray(smallPipeline.id, tempGuidArr);
                            if (inArr == -1) {
                                layerGuidList.push(smallObj);
                                tempGuidArr.push(smallPipeline.id);
                            }
                        }
                    }
                }
            }
            for (var l = 0; l < layerGuidList.length; l++) {
                var layer = layerGuidList[l];
                var layerId = layer.id;
                var typeObj = {
                    parentName: layer.parentName,
                    childName: layer.childName,
                    smallName: layer.smallName
                };
                var classLayer = {
                    type: layer.type,
                    layerName: layer.name,
                    parentId: layer.parentId,
                    dataList: []
                };
                StatisticsMgr.getDataList(layerId, cf, spatial, filter, compoundCondition, classLayer, typeObj);
                classResList.push(classLayer);
            }
            if (classResList) {
                var total = StatisticsMgr.getTotal(classResList);
            }
            classResult.push({
                name: layerName,
                classResList: classResList,
                total: total
            });
        });
        return classResult;
    },
    getTotal: function(classResList) {
        var num = 0;
        var length = 0;
        for (var i = 0; i < classResList.length; i++) {
            var res = classResList[i];
            for (var j = 0; j < res.dataList.length; j++) {
                var data = res.dataList[j];
                if (data.dataType != "小计") {
                    var l = data.length;
                    if (isNaN(l)) {
                        l = 0;
                    }
                    num = num + parseFloat(data.dataNum);
                    length = parseFloat(l) + length;
                }
            }
        }
        return num + "," + length.toFixed(3);
    },
    getDataList: function(layerId, cf, spatial, filter, compoundCondition, classLayer, typeObj) {
        for (var c = 0; c < cf.length; c++) {
            var field = cf[c];
            var result = "";
            var attachm = getName("US_ATTACHMENT", 1, true);
            if (field == attachm) {
                result = StatisticsMgr.statisticsTypeParamQuery(layerId, spatial, field, 0, filter, compoundCondition);
            } else {
                result = StatisticsMgr.statisticsTypeParamQuery(layerId, spatial, field, 1, filter, compoundCondition);
            }
            if (result != "" && result != null) {
                var json = $.xml2json(result);
                if (json == null || json == "") {
                    continue;
                }
                var items = json.Item;
                var len = items.length;
                if (typeof len == "number") {
                    var lengthCount = 0;
                    var numCount = 0;
                    var typeObj = {
                        parentName: typeObj.parentName,
                        childName: typeObj.childName,
                        smallName: typeObj.smallName
                    };
                    for (var i = 0; i < len; i++) {
                        var item = items[i];
                        var subtotal = StatisticsMgr.getItem3(item, classLayer, field, typeObj);
                        lengthCount = parseFloat(lengthCount) + parseFloat(subtotal.split(",")[0]);
                        numCount = parseFloat(numCount) + parseFloat(subtotal.split(",")[1]);
                    }
                    if (numCount != 0) {
                        classLayer.dataList.push({
                            parentName: typeObj.parentName,
                            childName: typeObj.childName,
                            smallName: typeObj.smallName,
                            dataType: "小计",
                            dataNum: numCount,
                            length: parseFloat(lengthCount).toFixed(3)
                        });
                    } else {
                        classLayer.dataList.push({
                            parentName: typeObj.parentName,
                            childName: typeObj.childName,
                            smallName: typeObj.smallName,
                            dataType: "小计",
                            dataNum: lengthCount,
                            length: "-"
                        });
                    }
                } else {
                    StatisticsMgr.getItem2(items, classLayer, field, typeObj);

                }
            }
        }
    },
    getItem3: function(item, classLayer, field, typeObj) {
        var usAttachment = getName("US_ATTACHMENT", 1, true);
        var pointTypeValue = item[usAttachment]; //附属物
        if (!pointTypeValue) {
            usAttachment = getName("US_PT_TYPE", 1, true);
            pointTypeValue = item[usAttachment]; //特征
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_SIZE", 1, true);
            pointTypeValue = item[usAttachment]; //管径
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_PWIDTH", 1, true);
            pointTypeValue = item[usAttachment]; //管块
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_PMATER", 1, true);
            pointTypeValue = item[usAttachment]; //材质
        }
        if (!pointTypeValue) {
            // usAttachment = getName("US_ATTACHMENT",0,true);
            // pointTypeValue = item.US_IS_SCRA;//废弃
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_OWNER", 1, true);
            pointTypeValue = item[usAttachment]; //权属单位
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_BD_TIME", 1, true);
            pointTypeValue = item[usAttachment]; //建设年代
        }

        var pointType = pointTypeValue;
        if (!pointType) {
            pointType = "其他";
        }
        var lengthCount = 0;
        var numCount = 0;
        var totalLength = item.length;
        if (totalLength) {
            var dataNum = item.Times;
            totalLength = parseFloat(totalLength / 1000).toFixed(3);
            classLayer.dataList.push({
                parentName: typeObj.parentName,
                childName: typeObj.childName,
                smallName: typeObj.smallName,
                dataType: pointType,
                dataNum: dataNum,
                length: totalLength
            });
            lengthCount = parseFloat(lengthCount) + parseFloat(totalLength);
            numCount = parseFloat(numCount) + parseFloat(dataNum);
        } else {
            totalLength = item.Times;
            classLayer.dataList.push({
                parentName: typeObj.parentName,
                childName: typeObj.childName,
                smallName: typeObj.smallName,
                dataType: pointType,
                dataNum: totalLength,
                length: "-"
            });
            lengthCount = parseFloat(lengthCount) + parseFloat(totalLength);
        }
        return lengthCount + "," + numCount;
    },
    getItem2: function(item, classLayer, field, typeObj) {
        var usAttachment = getName("US_ATTACHMENT", 0, true);
        var pointTypeValue = item[usAttachment]; //附属物
        if (!pointTypeValue) {
            usAttachment = getName("US_PT_TYPE", 0, true);
            pointTypeValue = item[usAttachment]; //特征
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_SIZE", 0, true);
            pointTypeValue = item[usAttachment]; //管径
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_PWIDTH", 0, true);
            pointTypeValue = item[usAttachment]; //管块
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_PMATER", 0, true);
            pointTypeValue = item[usAttachment]; //材质
        }
        if (!pointTypeValue) {
            // usAttachment = getName("US_ATTACHMENT",0,true);
            // pointTypeValue = item.US_IS_SCRA;//废弃
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_OWNER", 0, true);
            pointTypeValue = item[usAttachment]; //权属单位
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_BD_TIME", 0, true);
            pointTypeValue = item[usAttachment]; //建设年代
        }

        var pointType = pointTypeValue;
        // if (field == "US_ATTACHM") {
        //     pointType = StatisticsMgr.getValueByCode("AttachmentCode", pointTypeValue);
        // } else if (field == "US_PT_TYPE") {
        //     pointType = StatisticsMgr.getValueByCode("CPointCodes", pointTypeValue);
        // } else if (field == "US_PMATER") {
        //         pointType = StatisticsMgr.getValueByCode("Materials", pointTypeValue);
        //         pointType = "管线" + "(" + pointType + ")";
        // }
        if (!pointType) {
            pointType = "其他";
        }
        var lengthCount = 0;
        var numCount = 0;
        var totalLength = item.length;
        if (totalLength) {
            var dataNum = item.Times;
            totalLength = parseFloat(totalLength / 1000).toFixed(3);
            classLayer.dataList.push({
                parentName: typeObj.parentName,
                childName: typeObj.childName,
                smallName: typeObj.smallName,
                dataType: pointType,
                dataNum: dataNum,
                length: totalLength
            });
            lengthCount = parseFloat(lengthCount) + parseFloat(totalLength);
            numCount = parseFloat(numCount) + parseFloat(dataNum);
        } else {
            totalLength = item.Times;
            classLayer.dataList.push({
                parentName: typeObj.parentName,
                childName: typeObj.childName,
                smallName: typeObj.smallName,
                dataType: pointType,
                dataNum: totalLength,
                length: "-"
            });
            lengthCount = parseFloat(lengthCount) + parseFloat(totalLength);
        }
        return lengthCount + "," + numCount;
    },
    getItem: function(item, classLayer, field, type) { //todo:这里用管线还是用管点???
        var usAttachment = getName("US_ATTACHMENT", 0, true);
        //var pointTypeValue = item.US_ATTACHM;//附属物
        var pointTypeValue = item[usAttachment]; //附属物
        if (!pointTypeValue) {
            usAttachment = getName("US_PT_TYPE", 0, true);
            pointTypeValue = item[usAttachment]; //特征
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_SIZE", 0, true);
            pointTypeValue = item[usAttachment]; //管径
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_PWIDTH", 0, true);
            pointTypeValue = item[usAttachment]; //管块
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_PMATER", 0, true);
            pointTypeValue = item[usAttachment]; //材质
        }
        if (!pointTypeValue) {
            // usAttachment = getName("US_ATTACHMENT",0,true);
            // pointTypeValue = item.US_IS_SCRA;//废弃
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_OWNER", 0, true);
            pointTypeValue = item[usAttachment]; //权属单位
        }
        if (!pointTypeValue) {
            usAttachment = getName("US_BD_TIME", 0, true);
            pointTypeValue = item[usAttachment]; //建设年代
        }
        if (!pointTypeValue) {
            //usAttachment = getName("US_ATTACHMENT",0,true);
            //pointTypeValue = item.US_PHEIGHT;//方管高度
        }
        if (!pointTypeValue) {
            // usAttachment = getName("US_SIZE",0,true);
            // pointTypeValue=item[usAttachment];//管径统计
        }
        // if (!pointTypeValue) {
        //     return;
        // }
        var pointType = pointTypeValue;
        // if (field == "US_ATTACHM") {
        //     pointType = StatisticsMgr.getValueByCode("AttachmentCode", pointTypeValue);
        // } else if (field == "US_PT_TYPE") {
        //     pointType = StatisticsMgr.getValueByCode("CPointCodes", pointTypeValue);
        // } else if (field == "US_PMATER") {
        //     if (type) {
        //         pointType = StatisticsMgr.getValueByCode("Materials", pointTypeValue);
        //         pointType = "管线" + "(" + pointType + ")";
        //     } else {
        //         pointType = StatisticsMgr.getValueByCode("Materials", pointTypeValue);
        //     }
        // }
        if (!pointType) {
            pointType = item[field];
            if (!pointType) {
                pointType = "其他";
            }
        }
        var lengthCount = 0;
        var numCount = 0;
        var totalLength = item.length;
        if (type) {
            if (totalLength) {
                var dataNum = item.Times;
                totalLength = parseFloat(totalLength / 1000).toFixed(3);
                classLayer.dataList.push({
                    dataType: pointType,
                    dataNum: dataNum,
                    length: totalLength
                });
                lengthCount = parseFloat(lengthCount) + parseFloat(totalLength);
                numCount = parseFloat(numCount) + parseFloat(dataNum);
            } else {
                totalLength = item.Times;
                classLayer.dataList.push({
                    dataType: pointType,
                    dataNum: totalLength,
                    length: "-"
                });
                lengthCount = parseFloat(lengthCount) + parseFloat(totalLength);
            }
        } else {
            if (totalLength) {
                var dataNum = item.Times;
                if (pointType != "其他" && pointType != "0") {
                    totalLength = parseFloat(totalLength / 1000).toFixed(3);
                    classLayer.dataList.push({
                        dataType: pointType,
                        dataNum: dataNum,
                        length: totalLength
                    });
                    lengthCount = parseFloat(lengthCount) + parseFloat(totalLength);
                    numCount = parseFloat(numCount) + parseFloat(dataNum);
                }
            } else {
                totalLength = item.Times;
                if (pointType != "其他") {
                    classLayer.dataList.push({
                        dataType: pointType,
                        dataNum: totalLength
                    });
                    lengthCount = parseFloat(lengthCount) + parseFloat(totalLength);
                }
            }
        }
        return lengthCount + "," + numCount;
    }

};
