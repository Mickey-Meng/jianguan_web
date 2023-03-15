/**
 * 标注创建对象
 */
var lineArr = earthCtx.lineArr = [];
var AngleH = 0;
var textStr = "";
var MarkedCreator = earthCtx.MarkedCreator = {
    markedDoc: null, //标注信息XML文档对象
    markedIconList: null, //所有标注对象数组
    datumConfigLink: null, //字段映射文件的地址
    datum: null, //空间坐标转换对象
    codeDoc: null, //管线字段映射文件对象

    /**
     * 功能：初始化空间坐标转换对象
     * 参数：无
     * 返回：无
     */
    initDatum: function(layerId) {
        var layerArr = layerId.split("_");
        layerId = layerArr[0];
        var layer = earth.LayerManager.GetLayerByGUID(layerId);
        var projectSetting = layer.ProjectSetting;
        var layerLink = projectSetting.SpatialRefFile;
        if ((this.datumConfigLink == layerLink) && (this.datum != null)) {
            return;
        }
        this.datumConfigLink = layerLink;
        // var spatialUrl = "http://" + layerLink.substr(2).replace("/", "/sde?") + "_sde";
        // spatialUrl = spatialUrl.replace("http:", "").replace("/sde?", "");
        // spatialUrl = spatialUrl.substr(0, spatialUrl.length - 4);
        //   this.datumConfigLink=spatialUrl;
        // while (spatialUrl.indexOf("/")>-1) {
        //     spatialUrl = spatialUrl.replace("/", "\\");
        // }
        this.datum = CoordinateTransform.createDatum(layerLink, false);
    },

    /**
     * 功能：初始化管线字段映射文件对象
     * 参数：无
     * 返回：无
     */
    initCodeDoc: function(layerId) {
        /*if(layerId.indexOf("_")>0){
            layerId=layerId.split("_")[0];
        }
        if(layerId.indexOf("=")>0){
            layerId=layerId.split("=")[1];
        }
        var layer = earth.LayerManager.GetLayerByGUID(layerId);
        var projectSetting = layer.ProjectSetting;
        var layerLink = projectSetting.SpatialRefFile;
        if((this.datumConfigLink == layerLink)&&(this.codeDoc != null)){
            return;
        }*/
        this.datumConfigLink = SYSTEMPARAMS.pipeConfigLink; //layerLink;
        //var configUrl = "http://" + projectSetting.PipeConfigFile.substr(2).replace("/", "/sde?") + "_sde";
        this.codeDoc = SYSTEMPARAMS.pipeConfigDoc; //loadXMLFile(configUrl); //初始化编码映射文件对象
    },

    /**
     * 功能：根据编码，获取编码对应的详细值
     * 参数：type-编码类型；codeId - 编码ID
     * 返回：编码对应的详细值
     */
    getFieldValueByCode: function(type, codeId) {
        var value = "";
        var nodes = this.codeDoc.getElementsByTagName(type);
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            var codeNode = node.selectSingleNode("Code");
            if (parseFloat(codeNode.text) == parseFloat(codeId)) {
                value = node.selectSingleNode("Name").text;
                break;
            }
        }
        return value;
    },
    getMarkedFileByTag: function(tag, b) {
        if (!b) {
            var nodes = this.getMarkedFile().getElementsByTagName("ElementMarked");
            for (var i = 0; i < nodes.length; i++) {
                var codeNode = nodes[i];
                if (codeNode) {
                    var nid = codeNode.getAttribute("tag");
                    var nname = codeNode.getAttribute("name");
                    if (nid == tag) {
                        alert("标注已经创建，名称是'" + nname + "'");
                        return true;
                    }
                }
            }
        }
        return false;
    },
    /**
     * 功能：保存标注文档信息
     * 参数：markedXml-要保存的标注文档信息
     * 返回：无
     */
    saveMarkedFile: function(markedXml) {
        var savePath = earth.Environment.RootPath + "temp\\marked";
        if (markedXml == null) {
            markedXml = this.markedDoc.xml;
        }
        earth.UserDocument.SaveXmlFile(savePath, markedXml);
    },

    /**
     * 功能：创建标注文档
     * 参数：无
     * 返回：新建创建的文档内容
     */
    createMarkedFile: function() {
        var id = earth.Factory.CreateGuid();
        var xmlStr = '<xml><MarkedDocument id="' + id + '" name="标注数据" checked="true" open="true"/></xml>';
        this.saveMarkedFile(xmlStr);
        return xmlStr;
    },

    /**
     * 功能：获取标注文档对象
     * 参数：无
     * 返回：标注文档对象
     */
    getMarkedFile: function() {
        var loadPath = earth.Environment.RootPath + "temp\\marked.xml";
        var markedXml = earth.UserDocument.LoadXmlFile(loadPath);
        if ((markedXml == null) || (markedXml == "")) {
            markedXml = this.createMarkedFile();
        }
        var markedDoc = loadXMLStr(markedXml);
        return markedDoc;
    },

    /**
     * 功能：初始化markedDoc对象
     * 参数：无
     * 返回：无
     */
    initMarkedDoc: function() {
        if (this.markedDoc == null) {
            this.markedDoc = this.getMarkedFile();
        }
    },

    /**
     * 功能：添加OnPickObjectEx监听事件，选取一条管线
     * 参数：queryTableType-表查询类型（1为线表查询，0为点表查询）；callback - 事件的回调函数
     * 返回：无
     */
    onMarkedCreate: function(queryTableType, callback) {
        earth.Event.OnPickObjectEx = function(obj) {
              obj.Underground = true;
        var key = obj.GetKey();
        var objGuid = obj.guid;
        var parentLayerNameTemp = obj.GetParentLayerName();
        var parentLayerName = parentLayerNameTemp.split("=")[1];
        var PObjGUID = parentLayerName.split("_")[0];
        var newLayerID = earth.LayerManager.GetLayerByGUID(PObjGUID).Guid;
        var layer = earth.LayerManager.GetLayerByGuid(newLayerID);
        var parentLayerId = obj.GetParentLayerName();
        var parentLayerArr = parentLayerId.split("_");
        var searchLayerId = parentLayerArr[0];
        var layerName = layer.Name;
        SFM.queryHelper.getLayerList().then(function(data){
        var la = SFM.queryHelper.getLayerKey(layerName,'line');
        SFM.queryHelper.queryByKey(la.join(','),key).then(function(data){
            var d = data.getMe;
            var resultData = d[0];
            obj.ShowHighLight();
            callback(resultData,key,newLayerID,searchLayerId,objGuid);
          });
        });
           earth.Query.FinishPick();
        };
         earth.Query.PickObjectEx(24); // SEPickObjectType.PickAllObject
    },
    onMarkedCreate1: function(queryTableType, callback) {
        earth.Event.OnPickObjectEx = function(obj) {
              obj.Underground = true;
        var key = obj.GetKey();
        var objGuid = obj.guid;
        var parentLayerNameTemp = obj.GetParentLayerName();
        var parentLayerName = parentLayerNameTemp.split("=")[1];
        var PObjGUID = parentLayerName.split("_")[0];
        var newLayerID = earth.LayerManager.GetLayerByGUID(PObjGUID).Guid;
        var layer = earth.LayerManager.GetLayerByGuid(newLayerID);
        var parentLayerId = obj.GetParentLayerName();
        var parentLayerArr = parentLayerId.split("_");
        var searchLayerId = parentLayerArr[0];
        var layerName = layer.Name;
        SFM.queryHelper.getLayerList().then(function(data){
        var la = SFM.queryHelper.getLayerKey(layerName,'point');
        SFM.queryHelper.queryByKey(la.join(','),key).then(function(data){
            var d = data.getMe;
            var resultData = d[0];
            obj.ShowHighLight();
            callback(resultData,key,newLayerID,searchLayerId,objGuid);
          });
        });
           earth.Query.FinishPick();
        };
         earth.Query.PickObjectEx(24); // SEPickObjectType.PickAllObject
    },

    /**
     * 功能：根据数据节点，获取坐标信息
     * 参数：dataNode - 数据节点
     * 返回：坐标信息数组
     */
    getCoordsByNode: function(dataNode) {
        var shapeNode = dataNode.selectSingleNode("SHAPE");
        var shapeXml = shapeNode.xml;
        var coordBeginIndex = shapeXml.indexOf("<Coordinates>");
        if (coordBeginIndex == -1) {
            alert("无法获取经纬度坐标.");
            return;
        }

        coordBeginIndex = coordBeginIndex + "<Coordinates>".length;
        var coordEndIndex = shapeXml.indexOf("</Coordinates>");
        var coordStr = shapeXml.substr(coordBeginIndex, coordEndIndex - coordBeginIndex);
        var coordArr = coordStr.split(",");
        var coordList = [];
        for (var i = 0; i < coordArr.length; i = i + 3) {
            var coordPoint = {};
            coordPoint.lon = parseFloat(coordArr[i]);
            coordPoint.lat = parseFloat(coordArr[i + 1]);
            coordPoint.alt = parseFloat(coordArr[i + 2]);
            coordList.push(coordPoint);
        }
        return coordList;
    },

    /**
     * 功能：创建标注对象
     * 参数：dataParam - 创建标注对象所需的参数
     * 返回：标注对象
     */
    createElementIcon: function(dataParam) {
        var id = dataParam.id; //标注的ID编号
        if (id == null) {
            id = earth.Factory.CreateGuid();
        }
        var name = dataParam.name; //标注的名称
        var lon = dataParam.location.x; //标注的经度坐标
        var lat = dataParam.location.y; // 标注的纬度坐标
        var alt = dataParam.location.z; //标注的高程
        var text = dataParam.text; //标注显示的信息
        var visibility = dataParam.visibility; //标注是否可见
        var showHandle = dataParam.showHandle;
        var handleHeight = dataParam.handleHeight;

        var markedIcon = earth.Factory.CreateElementIcon(id, name);
        markedIcon.Create(lon, lat, alt, "", "", text);
        markedIcon.Visibility = visibility;
        markedIcon.ShowHandle = showHandle;
        markedIcon.HandleHeight = handleHeight;
        markedIcon.TextFormat = 256;
        //markedIcon.TextFormat = 8|1|256; //SETextFormat.TextFormatBOTTOM | SETextFormat.TextFormatCENTER | SETextFormat.TextFormatNOCLIP;
        earth.AttachObject(markedIcon);
        this.markedIconList.push(markedIcon); //把标注对象添加到数组中
        return markedIcon;
    },

    /**
     * 功能：创建标注对象,并把标注对象添加到数组中和地球上
     * 参数：dataParam - 创建标注对象所需的参数
     * 返回：无
     */
    createMarkedIcon: function(dataParam, b) {
        //        var markedIcon = this.createElementIcon(dataParam);
        var id = dataParam.id; //标注的ID编号
        if (id == null) {
            id = earth.Factory.CreateGuid();
        }
        var name = dataParam.name; //标注的名称
        var lon = dataParam.location.x; //标注的经度坐标
        var lat = dataParam.location.y; // 标注的纬度坐标
        var alt = dataParam.location.z; //标注的高程
        //检查此标注是否已经创建过
        if (this.getMarkedFileByTag(dataParam.tag, b)) {
            return;
        }
        // var alt = earth.Measure.MeasureTerrainAltitude(lon, lat);
        var text = dataParam.text; //标注显示的信息
        var visibility = dataParam.visibility; //标注是否可见
        var showHandle = dataParam.showHandle;
        var handleHeight = dataParam.handleHeight;

        var markedIcon = earth.Factory.CreateElementIcon(id, name);
        markedIcon.TextFormat = 8 | 4 | 256; //markedIcon.TextFormat = 8|4|256
        //SETextFormat.TextFormatBOTTOM | SETextFormat.TextFormatLEFT | SETextFormat.TextFormatNOCLIP
        markedIcon.Create(lon, lat, alt, "", "", text); //这里的text包含中文 因此牵引线高度与字母的不一致...
        markedIcon.Visibility = visibility;
        markedIcon.ShowHandle = showHandle;
        markedIcon.HandleHeight = Number(handleHeight);
        markedIcon.minVisibleRange = 0;
        markedIcon.maxVisibleRange = 100;
        //markedIcon.TextFormat = 8|1|256; //SETextFormat.TextFormatBOTTOM | SETextFormat.TextFormatCENTER | SETextFormat.TextFormatNOCLIP;
        earth.AttachObject(markedIcon);
        // alert(alt + " " + handleHeight);
        // var myicon = earth.Factory.CreateElementIcon(id, "point");
        // myicon.Create(lon, lat, alt, "", "", text);
        // myicon.Visibility = true;
        // myicon.textFormat = 256;
        // myicon.textHorizontalScale = 1;
        // myicon.textVerticalScale  = 1;
        // myicon.showHandle = true;
        // myicon.handleHeight = handleHeight;
        // myicon.minVisibleRange = 0;
        // myicon.maxVisibleRange = 1000;
        // myicon.selectable = true;
        // myicon.editable = true;
        // earth.AttachObject(myicon);
        this.markedIconList.push(markedIcon); //把标注对象添加到数组中
        return true;
    },

    /**
     * 功能：创建标注线
     * 参数：dataParam - 创建标注线所需的参数
     * 返回：标注线对象
     */
    createElementLine: function(dataParam) {
        var id = dataParam.id; //标注的ID编号
        if (id == null) {
            id = earth.Factory.CreateGuid();
        }
        var name = dataParam.name; //标注的名称
        var visibility = dataParam.visibility; //线的可见性
        var linePoints = dataParam.linePoints; //线的点集合

        var markedLine = earth.Factory.CreateElementLine(id, name);
        markedLine.BeginUpdate();
        markedLine.SetPointArray(linePoints);
        markedLine.LineStyle.LineColor = parseInt(0xffffff00); //线颜色为黄色
        markedLine.LineStyle.LineWidth = 1; //线宽为1
        markedLine.Visibility = visibility;
        markedLine.AltitudeType = 0;
        markedLine.EndUpdate();
        return markedLine;
    },

    /**
     * 功能：创建标注节点
     * 参数：dataParam - 创建标注节点所需的参数
     * 返回：标注节点
     */
    createMarkedNode: function(dataParam) {
        var id = dataParam.id; //标注的ID编号
        var name = dataParam.name; //标注的名称
        var visibility = dataParam.visibility.toString(); //标注是否可见
        var showHandle = dataParam.showHandle.toString();
        var lon = dataParam.location.x; //标注的经度坐标
        var lat = dataParam.location.y; // 标注的纬度坐标
        var alt = dataParam.location.z; //标注的高程
        var location = lon + "," + lat + "," + alt;
        var text = dataParam.text; //标注显示的信息
        text = text.replace(/\n/g, '\EN'); //将所有回车符转换为\EN保存
        var handleHeight = dataParam.handleHeight;
        var layerId = dataParam.layerId;
        var stKey = dataParam.stKey;
        var lineCoordinate = dataParam.lineCoordinate;

        var attrArr = [{
            name: "id",
            value: id
        }, {
            name: "name",
            value: name
        }, {
            name: "tag",
            value: dataParam.tag
        }, {
            name: "checked",
            value: visibility
        }];
        var markedNode = createElementNode("ElementMarked", attrArr, this.markedDoc);
        markedNode.appendChild(createElementText("ShowHandle", showHandle, this.markedDoc));
        markedNode.appendChild(createElementText("Location", location, this.markedDoc));
        markedNode.appendChild(createElementText("Text", text, this.markedDoc));
        markedNode.appendChild(createElementText("HandleHeight", handleHeight, this.markedDoc));
        if (layerId != null) {
            markedNode.appendChild(createElementText("LayerId", layerId.split("=")[1].split("_")[0], this.markedDoc));
        }
        if (stKey != null) {
            markedNode.appendChild(createElementText("STKey", stKey, this.markedDoc));
        }
        if (lineCoordinate != null) {
            markedNode.appendChild(createElementText("LineCoordinate", lineCoordinate, this.markedDoc));
        }
        return markedNode;
    },

    /**
     * 功能：创建系统目录节点
     * 参数：tagName-系统目录标签名称；name-系统目录名称
     * 返回：系统目录节点
     */
    createSystemNode: function(tagName, name) {
        var id = earth.Factory.CreateGuid();
        var attrArr = [{
            name: "id",
            value: id
        }, {
            name: "name",
            value: name
        }, {
            name: "checked",
            value: "true"
        }, {
            name: "open",
            value: "true"
        }];
        var elemNode = createElementNode(tagName, attrArr, this.markedDoc);
        return elemNode;
    },

    /**
     * 功能：将节点elemNode作为子节点添加到指定的系统标签节点中
     * 参数：tagName-指定的系统标签名，即父目录标签名称；name-系统标签名称；elemNode-要添加的子节点
     * 返回：无
     */
    appendSystemNode: function(tagName, name, elemNode) {
        var dataRoot = this.markedDoc.documentElement.firstChild;
        var parentNode = dataRoot.selectSingleNode(tagName);
        if (parentNode == null) {
            parentNode = this.createSystemNode(tagName, name);
            dataRoot.appendChild(parentNode);
        }
        parentNode.setAttribute("open", "true");
        if (elemNode) {
            parentNode.appendChild(elemNode);
        }
    },
    /**
     * 功能：初始化所有标注，即创建标注对象并将对象添加到地球上
     * 参数：无
     * 返回：无
     */
    initMarkedIconList: function() {
        if (this.markedIconList != null) { //如果标注数组不为null，说明已经初始化过，因此不再初始化
            return;
        }

        this.markedIconList = []; //初始化标注数组
        var dataRoot = this.markedDoc.documentElement.firstChild;
        var elemMarkedList = dataRoot.getElementsByTagName("ElementMarked");
        for (var i = 0; i < elemMarkedList.length; i++) {
            var elemMarked = elemMarkedList[i];
            //构建创建标注所需的参数对象
            var dataParam = {};
            dataParam.id = elemMarked.getAttribute("id");
            dataParam.name = elemMarked.getAttribute("name");
            dataParam.visibility = elemMarked.getAttribute("checked") == "true" ? true : false;

            var lineCoordNode = elemMarked.selectSingleNode("LineCoordinate");
            if (lineCoordNode != null) { //判断标注节点是否为距离标注节点，如果是距离标注节点，则创建距离标注
                var lineCoord = lineCoordNode.text;
                var lineCoordArr = lineCoord.split(" ");
                var point1Arr = lineCoordArr[0].split(",");
                var point2Arr = lineCoordArr[1].split(",");
                var p1 = {
                    Longitude: point1Arr[0],
                    Latitude: point1Arr[1],
                    Altitude: point1Arr[2]
                };
                var p2 = {
                    Longitude: point2Arr[0],
                    Latitude: point2Arr[1],
                    Altitude: point2Arr[2]
                };
                dataParam.p1 = p1;
                dataParam.p2 = p2;
                if (elemMarked.parentNode.tagName == "MarkedDistance") { //判断是否为距离标注
                    this.createMarkedDistance(dataParam); //创建距离标注
                } else if (elemMarked.parentNode.tagName == "MarkedComplex") { //判断是否为扯旗标注
                    var text = elemMarked.selectSingleNode("Text").text;
                    text = text.replace(/\EN/g, '\n'); //将所有\EN转换为回车符
                    dataParam.text = text;
                    this.createMarkedComplex(dataParam, false); //创建扯旗标注
                } else if (elemMarked.parentNode.tagName == "ElemenAngAndLenhtMarked") {
                    this.createMarkedLine(dataParam); //创建栓点标注
                    var text = elemMarked.selectSingleNode("Text").text;
                    text = text.replace(/\EN/g, '\n'); //将所有\EN转换为回车符
                    dataParam.text = text;
                    var locationText = elemMarked.selectSingleNode("Location").text;
                    var locationArr = locationText.split(",");
                    var location = {};
                    location.x = parseFloat(locationArr[0]);
                    location.y = parseFloat(locationArr[1]);
                    location.z = parseFloat(locationArr[2]);
                    dataParam.location = location;
                    dataParam.showHandle = elemMarked.selectSingleNode("ShowHandle").text == "true" ? true : false;
                    dataParam.handleHeight = elemMarked.selectSingleNode("HandleHeight").text;
                    this.createMarkedIcon(dataParam, true); //创建标注对象
                }
            } else { //否则创建其它标注
                var text = elemMarked.selectSingleNode("Text").text;
                text = text.replace(/\EN/g, '\n'); //将所有\EN转换为回车符
                dataParam.text = text;
                var locationText = elemMarked.selectSingleNode("Location").text;
                var locationArr = locationText.split(",");
                var location = {};
                location.x = parseFloat(locationArr[0]);
                location.y = parseFloat(locationArr[1]);
                location.z = parseFloat(locationArr[2]);
                dataParam.location = location;
                dataParam.showHandle = elemMarked.selectSingleNode("ShowHandle").text == "true" ? true : false;
                dataParam.handleHeight = elemMarked.selectSingleNode("HandleHeight").text;
                this.createMarkedIcon(dataParam, true); //创建标注对象
            }
        }
    },

    /**
     * 功能：根据ID获取标注对象
     * 参数：id - 标注对象的ID编号
     * 返回：标注对象
     */
    getMarkedIconById: function(id) {
        var markedIcon = null;
        for (var i = 0; i < this.markedIconList.length; i++) {
            if (this.markedIconList[i].Guid == id) {
                markedIcon = this.markedIconList[i];
                break;
            }
        }
        return markedIcon;
    },

    /**
     * 功能：根据ID获取标注对象
     * 参数：id - 标注对象的ID编号
     * 返回：标注对象
     */
    removeMarkedIconById: function(id) {
        for (var i = 0; i < this.markedIconList.length; i++) {
            if (this.markedIconList[i].Guid == id) {
                var childMarkeds = this.markedIconList[i].ChildMarkeds;
                if (childMarkeds != null) { //判断标注是否为距离标注和扯旗标注
                    for (var customAttr in childMarkeds) {
                        earth.DetachObject(childMarkeds[customAttr]);
                    }
                } else {
                    var marckObj = this.markedIconList[i];
                    if (marckObj) {
                        earth.DetachObject(this.markedIconList[i]);
                    }

                }
                this.markedIconList.splice(i, 1);
                return;
            }
        }
    },

    /**
     * 功能：获取直线的长度
     * 参数：vector3s - 直线的点集合
     * 返回：直线的长度
     */
    getLineLength: function(vector3s) {
        var geoPoints = earth.Factory.CreateGeoPoints();
        var count = vector3s.Count;
        for (var i = 0; i < count; i++) {
            var vector3 = vector3s.Items(i);
            geoPoints.Add(vector3.X, vector3.Y, vector3.Z);
        }
        var length = earth.GeometryAlgorithm.CalculatePolylineLength(geoPoints);
        length = length.toFixed(3);
        return length;
    },

    /**
     * 功能：获取直线的中心点
     * 参数：vecPoint1 - 直线端点1；vecPoint2 - 直线端点2
     * 返回：直线的中心点
     */
    getCenterVector3: function(vecPoint1, vecPoint2) {
        var center = {};
        center.x = (vecPoint1.X + vecPoint2.X) * 0.5;
        center.y = (vecPoint1.Y + vecPoint2.Y) * 0.5;
        center.z = (vecPoint1.Z + vecPoint2.Z) * 0.5;
        return center;
    },

    /**
     * 功能：根据直线的两个端点创建距离标注
     * 参数：dataParam - 距离标注创建参数
     * 返回：距离标注对象
     */
    createMarkedDistance: function(dataParam) {
        var p1 = dataParam.p1;
        var p2 = dataParam.p2;
        var visibility = dataParam.visibility;
        var horLinePoints = earth.Factory.CreateVector3s(); //创建水平线点集合
        var verLinePoints = earth.Factory.CreateVector3s(); //创建垂直线点集合
        var spaLinePoints = earth.Factory.CreateVector3s(); //创建直线点集合
        spaLinePoints.Add(p1.Longitude, p1.Latitude, p1.Altitude);
        spaLinePoints.Add(p2.Longitude, p2.Latitude, p2.Altitude);

        if (p1.Altitude > p2.Altitude) {
            //垂直线点集合
            verLinePoints.Add(p2.Longitude, p2.Latitude, p2.Altitude);
            verLinePoints.Add(p2.Longitude, p2.Latitude, p1.Altitude);
            //水平线点集合
            horLinePoints.Add(p2.Longitude, p2.Latitude, p1.Altitude);
            horLinePoints.Add(p1.Longitude, p1.Latitude, p1.Altitude);
        } else {
            //垂直线点集合
            verLinePoints.Add(p1.Longitude, p1.Latitude, p1.Altitude);
            verLinePoints.Add(p1.Longitude, p1.Latitude, p2.Altitude);
            //水平线点集合
            horLinePoints.Add(p1.Longitude, p1.Latitude, p2.Altitude);
            horLinePoints.Add(p2.Longitude, p2.Latitude, p2.Altitude);
        }

        var horLineParam = {
            id: null,
            name: "horLine",
            visibility: visibility,
            linePoints: horLinePoints
        };
        var horLineObj = this.createElementLine(horLineParam); //创建水平线
        earth.AttachObject(horLineObj);

        var verLineParam = {
            id: null,
            name: "verLine",
            visibility: visibility,
            linePoints: verLinePoints
        };
        var verLineObj = this.createElementLine(verLineParam); //创建垂直线
        earth.AttachObject(verLineObj);

        var spaLineParam = {
            id: null,
            name: "spaLine",
            visibility: visibility,
            linePoints: spaLinePoints
        };
        var spaLineObj = this.createElementLine(spaLineParam); //创建直线
        earth.AttachObject(spaLineObj);

        var horMarkedParam = {
            id: null,
            name: "horMarked",
            text: "水平距离: " + this.getLineLength(horLinePoints),
            location: this.getCenterVector3(horLinePoints.Items(0), horLinePoints.Items(1)),
            visibility: visibility,
            showHandle: false,
            handleHeight: 0
        };
        var horMarkedIcon = this.createElementIcon(horMarkedParam); //创建水平标注
        earth.AttachObject(horMarkedIcon);

        var verMarkedParam = {
            id: null,
            name: "verMarked",
            text: "垂直距离: " + this.getLineLength(verLinePoints),
            location: this.getCenterVector3(verLinePoints.Items(0), verLinePoints.Items(1)),
            visibility: visibility,
            showHandle: false,
            handleHeight: 0
        };
        var verMarkedIcon = this.createElementIcon(verMarkedParam); //创建垂直标注
        earth.AttachObject(verMarkedIcon);

        var center = this.getCenterVector3(spaLinePoints.Items(0), spaLinePoints.Items(1));
        var spaMarkedParam = {
            id: null,
            name: "spaMarked",
            text: "直线距离: " + this.getLineLength(spaLinePoints),
            location: center,
            visibility: visibility,
            showHandle: false,
            handleHeight: 0
        };
        var spaMarkedIcon = this.createElementIcon(spaMarkedParam); //创建直线标注
        earth.AttachObject(spaMarkedIcon);

        var id = dataParam.id;
        if (id == null) {
            id = earth.Factory.CreateGuid();
        }
        var markedDistance = {
            Guid: id,
            Name: dataParam.name,
            Location: center,
            Visibility: visibility,
            ChildMarkeds: {
                horLine: horLineObj,
                verLine: verLineObj,
                spaLine: spaLineObj,
                horMarkedIcon: horMarkedIcon,
                verMarkedIcon: verMarkedIcon,
                spaMarkedIcon: spaMarkedIcon
            }
        };
        this.markedIconList.push(markedDistance);
        return markedDistance;
    },
    /**
     * 功能：根据直线的两个端点创建扯旗标注
     * 参数：dataParam - 扯旗标注创建参数
     * 返回：扯旗标注对象
     */
    createMarkedComplex: function(dataParam, w, p1, p2, divObj, markedName,layer) {
        var p1 = dataParam.p1;
        var p2 = dataParam.p2;
        var visibility = dataParam.visibility;
        var complexPoints = earth.Factory.CreateVector3s(); //创建直线点集合
        complexPoints.Add(p1.Longitude, p1.Latitude, p1.Altitude);
        complexPoints.Add(p2.Longitude, p2.Latitude, p2.Altitude);

        var complexLineParam = {
            id: null,
            name: "complexLine",
            visibility: visibility,
            linePoints: complexPoints
        };
        var complexLineObj = this.createElementLine(complexLineParam); //创建直线
        earth.AttachObject(complexLineObj);

        var markText = dataParam.text;
        //if(text == null){ //如果text为null说明是创建扯旗标注，则要查询所有的管线获取text信息；如果text不为null说明是还原扯旗标注，则不用再进行查询
        //查询与直线相交的管线
        //text = this.getMarkedComplexText(spatial);
        if (markText == null) {
        textStr = "管线名称, 管径, 材质类型, 起点埋深, 终点埋深";
        var datum = SYSTEMPARAMS.pipeDatum;
        var point1 = {x:p1.Longitude,y:p1.Latitude,z:p1.Altitude};
        var point2 = {x:p2.Longitude,y:p2.Latitude,z:p2.Altitude};
        var hp1 =  SFM.queryHelper.blh2xy(datum,point1);
        var hp2 =  SFM.queryHelper.blh2xy(datum,point2);
        var sc = 'polyline;'+hp1.X+' '+hp1.Y+','+hp2.X+' '+hp2.Y+';';
        SFM.queryHelper.getLayerList().then(function(data){
            var d= data.length;
            var d1= data.length;
            if(d1 == 0){
            return ;
           }
            var layer = '';
           for (var i = 0; i < d1; i++) {
               var type =  data[i].type;
              if(type == 'line'){

             layer += data[i].key + ',';
            }
         }
           layer = layer.substring(0,layer.length-1);
        SFM.queryHelper.query({layers:layer,sc:sc}).then(function(data){
            var d= data.getMe;
            MarkedCreator.sendMarkService(d, markText, complexPoints, visibility, dataParam, complexLineObj, w, p1, p2, divObj, markedName);
           });
         });
        } else {
            textStr = markText;
            MarkedCreator.addMarkedComplex(complexPoints, visibility, dataParam, complexLineObj, w, p1, p2, divObj, markedName);
        }
    },
    sendMarkService: function(res, markText, complexPoints, visibility, dataParam, complexLineObj, w, p1, p2, divObj, markedName) {
        if (markText == null) { //如果text为null说明是创建扯旗标注，则要查询所有的管线获取text信息；如果text不为null说明是还原扯旗标注，则不用再进行查询
              if(res.length != 0){
                for (var i = 0; i < res.length; i++) {
                    var diameter = res[i].attributes.ST_SIZE;
                    var material = res[i].attributes.ST_PMATER;
                    var startDeep = res[i].attributes.ST_SDEEP;
                    var endDeep = res[i].attributes.ST_EDEEP;
                    textStr = textStr + "\n" + res[i].layerName + ", " + diameter + "mm, " + material + ", " + startDeep.toFixed(3) + "m, " + endDeep.toFixed(3) + "m";
                }
                 MarkedCreator.addMarkedComplex(complexPoints, visibility, dataParam, complexLineObj, w, p1, p2, divObj, markedName);
            }
            }
        if (markText != null) {
            this.addMarkedComplex(complexPoints, visibility, dataParam, complexLineObj, w, p1, p2, divObj, markedName);
        }
    },
    addMarkedComplex: function(complexPoints, visibility, dataParam, complexLineObj, w, p1, p2, divObj, markedName) {
        var center = {
            x: complexPoints.Items(1).x,
            y: complexPoints.Items(1).y,
            z: complexPoints.Items(1).z
        }; //this.getCenterVector3(complexPoints.Items(0), complexPoints.Items(1));
        var complexIconParam = {
            id: null,
            name: "complexIcon",
            text: textStr,
            location: center,
            visibility: visibility,
            showHandle: true,
            handleHeight: 6
        };
        var complexIconObj = this.createElementIcon(complexIconParam); //创建直线标注
        earth.AttachObject(complexIconObj);

        var id = dataParam.id;
        if (id == null) {
            id = earth.Factory.CreateGuid();
        }
        var markedComplex = {
            Guid: id,
            Name: dataParam.name,
            Location: center,
            Visibility: visibility,
            ChildMarkeds: {
                complexLine: complexLineObj,
                complexIcon: complexIconObj
            }
        };
        this.markedIconList.push(markedComplex);

        if (w) { //创建扯旗是为true ，加载时为false，为了处理跨域时增加的处理变量
            //创建扯旗标注节点，准备距离标注参数
            var lineCoordinate = p1.Longitude + "," + p1.Latitude + "," + p1.Altitude + " ";
            lineCoordinate = lineCoordinate + p2.Longitude + "," + p2.Latitude + "," + p2.Altitude;
            var markedParam = {
                id: markedComplex.Guid,
                name: markedName,
                tag: markedComplex.Guid,
                text: markedComplex.ChildMarkeds.complexIcon.Text,
                location: markedComplex.Location,
                visibility: true,
                showHandle: true,
                handleHeight: 6,
                lineCoordinate: lineCoordinate
            };
            var complexNode = MarkedCreator.createMarkedNode(markedParam);
            MarkedCreator.appendSystemNode("MarkedComplex", "扯旗标注", complexNode);
            MarkedCreator.saveMarkedFile();
            if (divObj) {
                try {
                    divObj.src = "../markedManagement/markedManagement.html";
                } catch (e) {}
            }
            //更新标注树
            var initMarkedTree = earthMgr.doAction('updateMarkedTree');
            if (initMarkedTree != null) { //如果标注管理图层打开的话
                initMarkedTree(MarkedCreator.markedDoc); //更新标注树
            }
        }
    },
    createMarkedLine: function(dataParam) {
        var p1 = dataParam.p1;
        var p2 = dataParam.p2;
        var visibility = dataParam.visibility;
        var complexPoints = earth.Factory.CreateVector3s(); //创建直线点集合
        complexPoints.Add(p1.Longitude, p1.Latitude, p1.Altitude);
        complexPoints.Add(p2.Longitude, p2.Latitude, p2.Altitude);
        //创建线
        var guid = earth.Factory.CreateGUID();
        var lineObj = earth.Factory.CreateElementLine(dataParam.id, "line");
        lineObj.BeginUpdate();
        lineObj.SetPointArray(complexPoints);
        lineObj.Visibility = visibility;
        var Linestyle = lineObj.LineStyle;
        Linestyle.LineWidth = 1;
        Linestyle.LineColor = parseInt(0xccff0000);
        lineObj.AltitudeType = 0;
        lineObj.EndUpdate();
        earth.AttachObject(lineObj);
        lineArr.push(lineObj);
    }
};

/**
 * 功能：“标高标注”菜单点击事件
 * 参数：无
 * 返回：无
 */

var elevationClick = earthCtx.elevationClick = function() {
    MarkedCreator.initMarkedDoc();
    MarkedCreator.initMarkedIconList();
    //创建标高标注， 线表查询
    MarkedCreator.onMarkedCreate(1, function(resultData,key,layerID,layerId,objGuid) {
        if (resultData == null) {
            return;
        }
        var dataNode = resultData.attributes;
        var us_key = dataNode.ST_KEY;
        var us_size = dataNode.ST_SIZE;
        var us_pmater = dataNode.ST_PMATER;
        var us_sdeep = dataNode.ST_SDEEP;
        var us_edeep = dataNode.ST_EDEEP;
        var us_salt = dataNode.ST_SALT;
        var us_ealt = dataNode.ST_EALT;
        var markedName = "标高(" + key + ")";
        var startAlt = parseFloat(us_salt).toFixed(3);
        var endAlt = parseFloat(us_ealt).toFixed(3);
        var startDeep = parseFloat(us_sdeep).toFixed(3);
        var endDeep = parseFloat(us_edeep).toFixed(3);
        var diam = us_size;
        var diamMiddle = 0;
		diam = diam + '';
        if (diam.indexOf("X") == -1) {
            diamMiddle = diam;
        } else {
            diamMiddle = Number(diam.split("X")[1]);
        }
        var jsonStr = resultData.geometry.geometryJSON ;
        var objJson = JSON.parse(jsonStr);
        var coor = objJson.coordinates;
        var coors = coor[0];
        var coordList = [];
        var datum = SYSTEMPARAMS.pipeDatum;
        for (var i = 0; i < coors.length; i++) {
            var point = {x:coors[i][0],y:coors[i][1]};
            var vx = SFM.queryHelper.xy2blh(datum,point);
            coordList.push(vx);
        }

        if(coordList.length > 1){
            var curLayer = earth.LayerManager.GetLayerByGUID(layerID);
            var pipeType = curLayer.PipeLineType;
            if(pipeType >= 4000 && pipeType <= 4306){
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep + diamMiddle * 0.001;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep + diamMiddle * 0.001;
            }else{
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep;
            }
        }
        //创建起点标注
        var dataParam1 = {
            id: earth.Factory.CreateGuid(),
            tag: objGuid + "_elevationS",
            name: "起点" + markedName,
            text: "起点标高: " + startAlt + "m",
            location: coordList[0],
            visibility: true,
            showHandle: true,
            handleHeight: 1,
            layerId: layerId,
            stKey: key
        };
       if (MarkedCreator.createMarkedIcon(dataParam1)) {
            var startElevationNode = MarkedCreator.createMarkedNode(dataParam1);
            MarkedCreator.appendSystemNode("MarkedElevation", "标高标注", startElevationNode);
        }
        //创建终点标注
        var dataParam2 = {
            id: earth.Factory.CreateGuid(),
            tag: objGuid + "_elevationE",
            name: "终点" + markedName,
            text: "终点标高: " + endAlt + "m",
            location: coordList[1],
            visibility: true,
            showHandle: true,
            handleHeight: 1,
            layerId: layerId,
            stKey: key
        };
        if (MarkedCreator.createMarkedIcon(dataParam2)) {
            var endElevationNode = MarkedCreator.createMarkedNode(dataParam2);
            MarkedCreator.appendSystemNode("MarkedElevation", "标高标注", endElevationNode);
        }
        MarkedCreator.saveMarkedFile();

        //更新标注树
        var initMarkedTree = earthMgr.doAction('updateMarkedTree');
        if (initMarkedTree != null) { //如果标注管理图层打开的话
            initMarkedTree(MarkedCreator.markedDoc); //更新标注树
        }
    });
};

/**
 * 功能：“管径标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
var diameterClick = earthCtx.diameterClick = function(divObj) {
    MarkedCreator.initMarkedDoc(); //初始化本地xml文件
    MarkedCreator.initMarkedIconList(); //初始化标注对象到球上
    //创建管径标注， 线表查询
    MarkedCreator.onMarkedCreate(1, function(resultData,key,layerID,layerId,objGuid) {
        if (resultData == null) {
            return;
        }
        var dataNode = resultData.attributes;
        var us_key = dataNode.ST_KEY;
        var us_size = dataNode.ST_SIZE;
        var us_pmater = dataNode.ST_PMATER;
        var us_sdeep = dataNode.ST_SDEEP;
        var us_edeep = dataNode.ST_EDEEP;
        var markedName = "管径(" + key + ")";
        var diam = us_size;
        var startDeep = parseFloat(us_sdeep);
        var endDeep = parseFloat(us_edeep);
        var text = "";
        var altMiddle = 0;
		diam = diam + '';
        if (diam.indexOf("X") == -1) {
            text = "圆管管径：" + diam + "mm";
            altMiddle = diam;
        } else {
            text = "方管管径：" + diam + "mm";
            altMiddle = Number(diam.split("X")[1]);
        }
        var jsonStr = resultData.geometry.geometryJSON ;
        var objJson = JSON.parse(jsonStr);
        var coor = objJson.coordinates;
         var coors = coor[0];
        var coordList = [];
        var datum = SYSTEMPARAMS.pipeDatum;
        for (var i = 0; i < coors.length; i++) {
            var point = {x:coors[i][0],y:coors[i][1]};
            var vx = SFM.queryHelper.xy2blh(datum,point);
            coordList.push(vx);
        }
        var centerLon = (coordList[0].x + coordList[1].x) * 0.5;
        var centerLat = (coordList[0].y + coordList[1].y) * 0.5;
        var centerAlt = earth.Measure.MeasureTerrainAltitude(centerLon, centerLat);
        var curLayer = earth.LayerManager.GetLayerByGUID(layerID);
        var pipeType = curLayer.PipeLineType;
        if(pipeType >= 4000 && pipeType <= 4306){
            centerAlt = centerAlt - (startDeep + endDeep) * 0.5 + altMiddle * 0.001;
        }else{
            centerAlt = centerAlt - (startDeep + endDeep) * 0.5;
        }

        var coordPoint = {
            x: centerLon, //取管径两端点的中间经度
            y: centerLat, //取管径两端点的中间纬度
            z: centerAlt //取管径两端点的中间高程
        };

        var handleHeight = (startDeep + endDeep) * 0.5;
        //创建管径标注
        var dataParam = {
            id: earth.Factory.CreateGuid(),
            tag: objGuid + "_diameter",
            name: markedName,
            text: text,
            location: coordPoint,
            visibility: true,
            showHandle: true,
            handleHeight: 1,
            layerId: layerId,
            stKey: key
        };

        if (!MarkedCreator.createMarkedIcon(dataParam)) {
            return;
        }
        var diameterMarkedNode = MarkedCreator.createMarkedNode(dataParam);
        MarkedCreator.appendSystemNode("MarkedDiameter", "管径标注", diameterMarkedNode);
        MarkedCreator.saveMarkedFile();
        if (divObj) {
            try {
                divObj.src = "../markedManagement/markedManagement.html";
            } catch (e) {}
        }
        var initMarkedTree = earthMgr.doAction('updateMarkedTree');
        if (initMarkedTree != null) { //如果标注管理图层打开的话
            initMarkedTree(MarkedCreator.markedDoc); //更新标注树
        }

    });
};

/**
 * 功能：“埋深标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
var coveringDepthClick = earthCtx.coveringDepthClick =function(divObj) {
    MarkedCreator.initMarkedDoc();
    MarkedCreator.initMarkedIconList();
    //创建埋深标注， 线表查询
    MarkedCreator.onMarkedCreate(1, function(resultData,key,layerID,layerId,objGuid) {
        if (resultData == null) {
            return;
        }
        var dataNode = resultData.attributes;
        var us_key = dataNode.ST_KEY;
        var us_size = dataNode.ST_SIZE;
        var us_sdeep = dataNode.ST_SDEEP;
        var us_edeep = dataNode.ST_EDEEP;
        var markedName = "埋深(" + key + ")";
        var startDeep = parseFloat(us_sdeep).toFixed(3);
        var endDeep = parseFloat(us_sdeep).toFixed(3);
        if (startDeep <= endDeep) {
            AngleH = endDeep;
        } else {
            AngleH = startDeep;
        }

        var diam = us_size;
        var diamMiddle = 0;
		diam = diam + '';
        if (diam.indexOf("X") == -1) {
            diamMiddle = diam;
        } else {
            diamMiddle = Number(diam.split("X")[1]);
        }
        var jsonStr = resultData.geometry.geometryJSON ;
        var objJson = JSON.parse(jsonStr);
        var coor = objJson.coordinates;
        var coors = coor[0];
        var coordList = [];
        var datum = SYSTEMPARAMS.pipeDatum;
        for (var i = 0; i < coors.length; i++) {
            var point = {x:coors[i][0],y:coors[i][1]};
            var vx = SFM.queryHelper.xy2blh(datum,point);
            coordList.push(vx);
        }
        if(coordList.length > 1){
            var curLayer = earth.LayerManager.GetLayerByGUID(layerID);
            var pipeType = curLayer.PipeLineType;
            if(pipeType >= 4000 && pipeType <= 4306){
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep + diamMiddle * 0.001;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep + diamMiddle * 0.001;
            }else{
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep;
            }
        }
        //创建起点标注
        var dataParam1 = {
            id: earth.Factory.CreateGuid(),
            tag:objGuid + "_coveringS",
            name: "起点" + markedName,
            text: "起点埋深: " + startDeep + "m", //+"\n"+"\n"+"\n"
            location: coordList[0],
            visibility: true,
            showHandle: true,
            handleHeight: 2,
            layerId: layerId,
            stKey: key
        };

        //起点icon
        if (MarkedCreator.createMarkedIcon(dataParam1)) {
            var startDepthNode = MarkedCreator.createMarkedNode(dataParam1);
            MarkedCreator.appendSystemNode("MarkedDepth", "埋深标注", startDepthNode);
        }

        //创建终点标注
        var dataParam2 = {
            id: earth.Factory.CreateGuid(),
            tag: objGuid + "_coveringE",
            name: "终点" + markedName,
            text: "终点埋深: " + endDeep + "m", //+"\n"+"\n"+"\n"
            location: coordList[1],
            visibility: true,
            showHandle: true,
            handleHeight: 1.5,
            layerId: layerId,
            stKey: key
        };
        //终点icon
        if (MarkedCreator.createMarkedIcon(dataParam2)) {
            var endDepthNode = MarkedCreator.createMarkedNode(dataParam2);
            MarkedCreator.appendSystemNode("MarkedDepth", "埋深标注", endDepthNode);
        }
        MarkedCreator.saveMarkedFile();
        if (divObj) {
            try {
                divObj.src = "../markedManagement/markedManagement.html";
            } catch (e) {}
        }
        //更新标注树
        var initMarkedTree = earthMgr.doAction('updateMarkedTree');
        if (initMarkedTree != null) { //如果标注管理图层打开的话
            initMarkedTree(MarkedCreator.markedDoc); //更新标注树
        }
    });
};

/**
 * 功能：“坐标标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
var coordinatesClick = earthCtx.coordinatesClick =function(divObj) {
    MarkedCreator.initMarkedDoc();
    MarkedCreator.initMarkedIconList();
    //创建坐标标注， 线表查询
    MarkedCreator.onMarkedCreate(1, function(resultData,key,layerID,layerId,objGuid) {
        if (resultData == null) {
            return;
        }
        var dataNode = resultData.attributes;
        var us_key = dataNode.ST_KEY;
        var us_size = dataNode.ST_SIZE;
        var us_sdeep = dataNode.ST_SDEEP;
        var us_edeep = dataNode.ST_EDEEP;
        var markedName = "坐标(" + key + ")";
        var startDeep = parseFloat(us_sdeep);
        var endDeep = parseFloat(us_sdeep);
        if (startDeep <= endDeep) {
            AngleH = endDeep;
        } else {
            AngleH = startDeep;
        }

        var diam = us_size;
        var diamMiddle = 0;
		diam = diam + '';
        if (diam.indexOf("X") == -1) {
            diamMiddle = diam;
        } else {
            diamMiddle = Number(diam.split("X")[1]);
        }
        var jsonStr = resultData.geometry.geometryJSON ;
        var objJson = JSON.parse(jsonStr);
        var coor = objJson.coordinates;
        var coors = coor[0];
        var coordList = [];
        var datum = SYSTEMPARAMS.pipeDatum;
        for (var i = 0; i < coors.length; i++) {
            var point = {x:coors[i][0],y:coors[i][1]};
            var vx = SFM.queryHelper.xy2blh(datum,point);
            coordList.push(vx);
        }
        if(coordList.length > 1){
            var curLayer = earth.LayerManager.GetLayerByGUID(layerID);
            var pipeType = curLayer.PipeLineType;
            if(pipeType >= 4000 && pipeType <= 4306){
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep + diamMiddle * 0.001;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep + diamMiddle * 0.001;
            }else{
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep;
            }
        }

        //坐标转换。开始
        MarkedCreator.initDatum(layerID);
        var startCoord = MarkedCreator.datum.des_BLH_to_src_xy(coordList[0].x, coordList[0].y, coordList[0].z);
        var endCoord = MarkedCreator.datum.des_BLH_to_src_xy(coordList[1].x, coordList[1].y, coordList[1].z);
        //坐标转换。结束

        //创建起点标注
        var dataParam1 = {
            id: earth.Factory.CreateGuid(),
            tag: objGuid + "_coordS",
            name: "起点" + markedName,
            text: "起点坐标: " + startCoord.X.toFixed(3) + ", " + startCoord.Y.toFixed(3) + ", " + startCoord.Z.toFixed(3) + "\n" + "\n",
            location: coordList[0],
            visibility: true,
            showHandle: true,
            handleHeight: 3,
            layerId: layerId,
            stKey: key
        };
        if (MarkedCreator.createMarkedIcon(dataParam1)) {
            var startCoordNode = MarkedCreator.createMarkedNode(dataParam1);
            MarkedCreator.appendSystemNode("MarkedCoordinates", "坐标标注", startCoordNode);
        }

        //创建终点标注
        var dataParam2 = {
            id: earth.Factory.CreateGuid(),
            tag: resultData.objGuid + "_coordE",
            name: "终点" + markedName,
            text: "终点坐标: " + endCoord.X.toFixed(3) + ", " + endCoord.Y.toFixed(3) + ", " + endCoord.Z.toFixed(3) + "\n" + "\n",
            location: coordList[1],
            visibility: true,
            showHandle: true,
            handleHeight: 2,
            layerId: layerId,
            stKey: key
        };

        if (MarkedCreator.createMarkedIcon(dataParam2)) {
            var endCoordNode = MarkedCreator.createMarkedNode(dataParam2);
            MarkedCreator.appendSystemNode("MarkedCoordinates", "坐标标注", endCoordNode);
        }

        MarkedCreator.saveMarkedFile();
        if (divObj) {
            try {
                divObj.src = "../markedManagement/markedManagement.html";
            } catch (e) {}
        }
        //更新标注树
        var initMarkedTree = earthMgr.doAction('updateMarkedTree');
        if (initMarkedTree != null) { //如果标注管理图层打开的话
            initMarkedTree(MarkedCreator.markedDoc); //更新标注树
        }
    });
};

/**
 * 功能：“距离标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
/*var distanceClick = function(divObj){
    MarkedCreator.initMarkedDoc();
    MarkedCreator.initMarkedIconList();
    earth.Event.OnCreateGeometry = function(pval,type){
        var markedName = "距离";
        earth.ShapeCreator.Clear();
        var p1 = pval.GetPointAt(0);
        var p2 = pval.GetPointAt(1);
        var distanceParam = {
            id : null,
            name : markedName,
            visibility : true,
            p1 : p1,
            p2 : p2
        };
        var markedDistance = MarkedCreator.createMarkedDistance(distanceParam);

        //创建距离标注节点，准备距离标注参数
        var lineCoordinate = p1.Longitude + "," + p1.Latitude + "," + p1.Altitude + " ";
        lineCoordinate = lineCoordinate + p2.Longitude + "," + p2.Latitude + "," + p2.Altitude;
        var markedParam = {
            id : markedDistance.Guid,
            name : markedName,
            text : "",
            location : markedDistance.Location,
            visibility : true,
            showHandle : false,
            handleHeight : 0,
            lineCoordinate : lineCoordinate
        };
        var distanceNode = MarkedCreator.createMarkedNode(markedParam);
        MarkedCreator.appendSystemNode("MarkedDistance", "距离标注", distanceNode);
        MarkedCreator.saveMarkedFile();
        if(divObj){
            try{
                divObj.src = "html/marked/markedManagement.html";
            }catch(e){
            }

        }
        //更新标注树
        if(window.ifResult.initMarkedTree != null){ //如果标注管理图层打开的话
            window.ifResult.initMarkedTree(MarkedCreator.markedDoc); //更新标注树
        }
    };
    earth.ShapeCreator.CreateLine();
    measureOperCancel();
};*/

/**
 * 功能：“自定义标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
var customPartClick = earthCtx.customPartClick = function(divObj) {
    MarkedCreator.initMarkedDoc();
    MarkedCreator.initMarkedIconList();
    //创建局部标注， 线表查询
    MarkedCreator.onMarkedCreate(1, function(resultData,key,layerID,layerId,objGuid) {
        if (resultData == null) {
            return;
        }
        var dataNode = resultData.attributes;
        //用户编码
        var us_key = dataNode.ST_KEY;
        //起点编号
        var us_spt = dataNode.ST_SPT_KEY;
        //终点编号
        var us_ept = dataNode.ST_EPT_KEY;
        //起点埋深
        var us_sdeep = dataNode.ST_SDEEP;
        //终点埋深
        var us_edeep = dataNode.ST_EDEEP;
        //起点地面高程
        var us_salt = dataNode.ST_SALT;
        //终点地面高程
        var us_ealt = dataNode.ST_EALT;
        //管内流向
        var us_flowdir = dataNode.ST_FLOWDIR;
        //材质
        var us_pmater = dataNode.ST_PMATER;
        //管径
        var us_size = dataNode.ST_SIZE;
        var param = {
                us_key: us_key,
                us_spt: us_spt,
                us_ept: us_ept,
                us_sdeep: us_sdeep,
                us_edeep: us_edeep,
                us_salt: us_salt,
                us_ealt: us_ealt,
                us_flowdir: us_flowdir,
                us_pmater: us_pmater,
                us_size: us_size
            }
            //打开标注属性选择列表对话框
        // var localUrl = SFM.sfmUtil.getMainWin().location.href + 'modules/widget';
        var mw = SFM.sfmUtil.getMainWin();
        var localUrl = SFM.sfmUtil.getHostUrl(mw) + '/modules/widget';
        var markedList = openDialog(localUrl+"/common/marked/earthMarkedCustomPart/customMarkedListDialog.html", param, 350, 350);
        if (markedList == null) {
            return;
        }

        var markedName = "自定义(" + key + ")";
        var text = "";
        for (var i = 0; i < markedList.length; i++) {
            var markedAttr = markedList[i];
            var value = markedAttr.attrName;
            if (markedAttr.attrText == us_flowdir) { //管内流向
                if (value == "1") {
                    value = "起点到终点";
                } else if (value == "2") {
                    value = "终点到起点";
                } else if (value == "3") {
                    value = "双向";
                } else {
                    value = "未知";
                }
                text = text + markedAttr.attrText + ": " + value + "\n";
            } else if (markedAttr.attrName == us_sdeep || markedAttr.attrName == us_edeep ||
                markedAttr.attrName == us_salt || markedAttr.attrName == us_ealt) {
                value = parseFloat(value).toFixed(3); //小数点取三位
                text = text + markedAttr.attrText + ": " + value + "m\n";
            } else if (markedAttr.attrName == us_size) {
                text = text + markedAttr.attrText + ": " + value + "mm\n";
            }else{
                text = text + markedAttr.attrText + ": " + value + "\n";
            }
        }
        var startDeep = parseFloat(us_sdeep);
        var endDeep = parseFloat(us_edeep);
        var jsonStr = resultData.geometry.geometryJSON ;
        var objJson = JSON.parse(jsonStr);
        var coor = objJson.coordinates;
        var coors = coor[0];
        var coordList = [];
        var datum = SYSTEMPARAMS.pipeDatum;
        for (var j = 0; j < coors.length; j++) {
            var point = {x:coors[j][0],y:coors[j][1]};
            var vx = SFM.queryHelper.xy2blh(datum,point);
            coordList.push(vx);
        }

        var diam = us_size;
        var diamMiddle = 0;
		diam = diam + '';
        if (diam.indexOf("X") == -1) {
            diamMiddle = diam;
        } else {
            diamMiddle = Number(diam.split("X")[1]);
        }

        if(coordList.length > 1){
            var curLayer = earth.LayerManager.GetLayerByGUID(layerID);
            var pipeType = curLayer.PipeLineType;
            if(pipeType >= 4000 && pipeType <= 4306){
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep + diamMiddle * 0.001;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep + diamMiddle * 0.001;
            }else{
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep;
            }
        }

        var coordPoint = {
            x: (coordList[0].x + coordList[1].x) * 0.5, //取管径两端点的中间经度
            y: (coordList[0].y + coordList[1].y) * 0.5, //取管径两端点的中间纬度
            z: (coordList[0].z + coordList[1].z) * 0.5 //取管径两端点的中间高程
        };

        //创建局部标注
        var dataParam = {
            id: earth.Factory.CreateGuid(),
            tag: objGuid + "_custom",
            name: markedName,
            text: text + "\n",
            location: coordPoint,
            visibility: true,
            showHandle: true,
            handleHeight: 2,
            layerId: layerId,
            stKey: key
        };
        if (MarkedCreator.createMarkedIcon(dataParam)) {
            var partMarkedNode = MarkedCreator.createMarkedNode(dataParam);
            MarkedCreator.appendSystemNode("MarkedPart", "自定义标注", partMarkedNode);
            MarkedCreator.saveMarkedFile();
            if (divObj) {
                try {
                    divObj.src = "../markedManagement/markedManagement.html";
                } catch (e) {}

            }
            //更新标注树
            var initMarkedTree = earthMgr.doAction('updateMarkedTree');
            if (initMarkedTree != null) { //如果标注管理图层打开的话
                initMarkedTree(MarkedCreator.markedDoc); //更新标注树
            }
        }
    });
};
/**
 * 功能：“坡度标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
var slopeClick = earthCtx.slopeClick =function(divObj) {
    MarkedCreator.initMarkedDoc();
    MarkedCreator.initMarkedIconList();
    //创建坡度标注， 线表查询
    MarkedCreator.onMarkedCreate(1, function(resultData,key,layerID,layerId,objGuid) {
        if (resultData == null) {
            return;
        }
         var dataNode = resultData.attributes;
        var us_key = dataNode.ST_KEY;
        var us_size = dataNode.ST_SIZE;
        var us_sdeep = dataNode.ST_SDEEP;
        var us_edeep = dataNode.ST_EDEEP;
         var us_salt = dataNode.ST_SALT;
        var us_ealt = dataNode.ST_EALT;
        var markedName = "坡度(" + key + ")";
        var startDeep = parseFloat(us_salt);
        var endDeep = parseFloat(us_ealt);
        var startDeep2 = parseFloat(us_sdeep);
        var endDeep2 = parseFloat(us_sdeep);
       var jsonStr = resultData.geometry.geometryJSON ;
        var objJson = JSON.parse(jsonStr);
        var coor = objJson.coordinates;
        var coors = coor[0];
        var coordList = [];
        var datum = SYSTEMPARAMS.pipeDatum;
        for (var i = 0; i < coors.length; i++) {
            var point = {x:coors[i][0],y:coors[i][1]};
            var vx = SFM.queryHelper.xy2blh(datum,point);
            coordList.push(vx);
        }
        var diam = us_size;
        var diamMiddle = 0;
		diam = diam + '';
        if (diam.indexOf("X") == -1) {
            diamMiddle = diam;
        } else {
            diamMiddle = Number(diam.split("X")[1]);
        }

        if(coordList.length > 1){
            var curLayer = earth.LayerManager.GetLayerByGUID(layerID);
            var pipeType = curLayer.PipeLineType;
            if(pipeType >= 4000 && pipeType <= 4306){
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep2 + diamMiddle * 0.001;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep2 + diamMiddle * 0.001;
            }else{
                coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - startDeep2;
                coordList[1].z = earth.Measure.MeasureTerrainAltitude(coordList[1].x, coordList[1].y) - endDeep2;
            }
        }

        var coordPoint = {
            x: (coordList[0].x + coordList[1].x) * 0.5, //取管径两端点的中间经度
            y: (coordList[0].y + coordList[1].y) * 0.5, //取管径两端点的中间纬度
            z: (coordList[0].z + coordList[1].z) * 0.5 //取管径两端点的中间高程
        };
        //坐标转换。开始
        //
        MarkedCreator.initDatum(layerId.split("=")[1].split("_")[0]);
        var datumPoint1 = MarkedCreator.datum.des_BLH_to_src_xy(coordList[0].x, coordList[0].y, coordList[0].z);
        var datumPoint2 = MarkedCreator.datum.des_BLH_to_src_xy(coordList[1].x, coordList[1].y, coordList[1].z);
        //坐标转换。结束
        //坡度表示地面与水平面的夹角的正切值，在这里用角度表示
        var x = Math.pow(Math.abs(datumPoint1.X - datumPoint2.X), 2);
        var y = Math.pow(Math.abs(datumPoint1.Y - datumPoint2.Y), 2);
        var z = Math.pow(Math.abs(startDeep - endDeep), 2);
        var spaceDis = Math.sqrt(x + y + z);
        //        var spaceDis = PipelineMeasureAlgorithm.VectorSub(datumPoint1, datumPoint2).Length;
        var verDis = Math.abs(endDeep - startDeep); //Math.abs(datumPoint1.Z - datumPoint2.Z);
        var slope = (180 * Math.asin(verDis / spaceDis) / Math.PI).toFixed(3); //求得其反正弦值，即坡度(保留3位小数)
        var handleHeight = (startDeep + endDeep) * 0.5;

        //创建坡度标注
        var dataParam = {
            id: earth.Factory.CreateGuid(),
            tag: objGuid + "_slope",
            name: markedName,
            text: "坡度: " + slope + "°\n" + "\n",
            location: coordPoint,
            visibility: true,
            showHandle: true,
            handleHeight: 1.5,
            layerId: layerId,
            stKey: key
        };
        if (MarkedCreator.createMarkedIcon(dataParam)) {
            var slopeMarkedNode = MarkedCreator.createMarkedNode(dataParam);
            MarkedCreator.appendSystemNode("MarkedSlope", "坡度标注", slopeMarkedNode);
            MarkedCreator.saveMarkedFile();
            if (divObj) {
                try {
                    divObj.src = "../markedManagement/markedManagement.html";
                } catch (e) {}

            }
            //更新标注树
            var initMarkedTree = earthMgr.doAction('updateMarkedTree');
            if (initMarkedTree != null) { //如果标注管理图层打开的话
                initMarkedTree(MarkedCreator.markedDoc); //更新标注树
            }
        }
    });
};

/**
 * 功能：“弯头角度标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
var curvedAngleClick = earthCtx.curvedAngleClick = function(divObj) {
    MarkedCreator.initMarkedDoc();
    MarkedCreator.initMarkedIconList();
    //创建弯头角度标注， 点表查询
    MarkedCreator.onMarkedCreate1(0, function(resultData,key,layerID,layerId,objGuid) {
        if (resultData == null) {
            alert("请选择弯头");
            return;
        }
        var ptt = resultData.attributes && resultData.attributes.ST_PT_TYPE;
        if(ptt != '弯头'){
            alert('请选择弯头');
            return;
        }
        var dataNode = resultData.attributes;
        var us_key = dataNode.ST_KEY;
        var us_ptalt = dataNode.ST_PT_ALT;
        var markedName = "角度(" + key + ")";
        var layerAry = layerId.split("_")[0];
        var layerGuid = layerAry.split("=")[1];
        var pointAlt = parseFloat(us_ptalt).toFixed(3);
        var lyr = resultData.layer;
        var ln = SFM.queryHelper.getLayerName(lyr);
        if(!ln){
            alert('未找到目标图层,可能是配置有误');
            return;
        }
        lyr = SFM.queryHelper.getLayerKey(ln, 'line').join(',');
        // lyr = lyr.substring(0,lyr.indexOf("point")) + 'line';
        SFM.queryHelper.queryWantouAngle(lyr,key).then(function(data){
            var d = data && data[0];
            var angle = d.angle.toFixed(1);
            if(!angle){
                alert("暂无数据");
                return;
            }
            var jsonStr = resultData.geometry.geometryJSON ;
            var objJson = JSON.parse(jsonStr);
            var coor = objJson.coordinates;
            var coordList = [];
            var datum = SYSTEMPARAMS.pipeDatum;
            var point = {x:coor[0],y:coor[1]};
            var vx = SFM.queryHelper.xy2blh(datum,point);
            var deep = GetCurvedAngleDeep(layerGuid,key);
            coordList.push(vx);
             if(coordList.length > 0){
            coordList[0].z = earth.Measure.MeasureTerrainAltitude(coordList[0].x, coordList[0].y) - deep;

                }
            if (AngleH <= 0) {
                        AngleH = 5.5;
                    }

            //创建弯头角度标注
            var dataParam = {
                        id: earth.Factory.CreateGuid(),
                        tag: objGuid + "_angle",
                        name: markedName,
                        text: "弯管角度: " + angle + "°\n",
                        location: coordList[0],
                        visibility: true,
                        showHandle: true,
                        handleHeight: 4,
                        layerId: layerId,
                        stKey: key
            };
            if (MarkedCreator.createMarkedIcon(dataParam)) {
                var angleMarkedNode = MarkedCreator.createMarkedNode(dataParam);
                MarkedCreator.appendSystemNode("MarkedAngle", "角度标注", angleMarkedNode);
                MarkedCreator.saveMarkedFile();
                if (divObj) {
                    try {
                        divObj.src = "../markedManagement/markedManagement.html";
                    } catch (e) {}
                }
                //更新标注树
                var initMarkedTree = earthMgr.doAction('updateMarkedTree');
                if (initMarkedTree != null) { //如果标注管理图层打开的话
                    initMarkedTree(MarkedCreator.markedDoc); //更新标注树
                }
            }
        })

    });
};

/**
 * 功能：“扯旗标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
var complexClick = earthCtx.complexClick = function(divObj) {
    MarkedCreator.initMarkedDoc();
    MarkedCreator.initMarkedIconList();
    earth.Event.OnCreateGeometry = function(pval, type) {
        var markedName = "扯旗";
        earth.ShapeCreator.Clear();
        var p1 = pval.GetPointAt(0);
        var p2 = pval.GetPointAt(1);
        var complexParam = {
            id: null,
            name: markedName,
            visibility: true,
            p1: p1,
            p2: p2,
            text: null
        };
        MarkedCreator.createMarkedComplex(complexParam, true, p1, p2, divObj, markedName);
    };
    earth.ShapeCreator.CreateLine();
    measureOperCancel();

    //var markedName = "扯旗";
    //earth.ShapeCreator.Clear();
    //var p1 = {Altitude:31.799960355783696,Latitude:34.25819159242476,Longitude:117.17160457719316}
    //var p2 = { Altitude: 31.79996131802909, Latitude: 34.258269712364246, Longitude: 117.17165960970588 }
    //var complexParam = {
    //    id: null,
    //    name: markedName,
    //    visibility: true,
    //    p1: p1,
    //    p2: p2,
    //    text: null
    //};
    //MarkedCreator.createMarkedComplex(complexParam, true, p1, p2, divObj, markedName);
};
/**
 * 功能：“栓点标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
var v3s;

var AngleAndLengthClick = earthCtx.AngleAndLengthClick = function(divObj, pointTag) {
    MarkedCreator.initMarkedDoc();
    MarkedCreator.initMarkedIconList();
    v3s = earth.Factory.CreateVector3s();
    AngleAndLengthMark(divObj, pointTag);
};
/**
 * 功能：“栓点标注”菜单点击事件
 * 参数：无
 * 返回：无
 */
var markedNode = "";

function AngleAndLengthMark(divObj, pointTag) {
    var elementPointArr = [{
        name: "id",
        value: earth.Factory.CreateGUID()
    }, {
        name: "name",
        value: "栓点"
    }, {
        name: "checked",
        value: "true"
    }];
    if (pointTag) {
        markedNode = createElementNode("ElemenAngAndLenhtMarked", elementPointArr, MarkedCreator.markedDoc);
    }
    earth.Event.OnCreateGeometry = function(p, t) {
        if (p === null) { //baocun
            MarkedCreator.saveMarkedFile();
            markedNode.setAttribute("open", "true");
            var initMarkedTree = earthMgr.doAction('updateMarkedTree');
            if (initMarkedTree != null) { //如果标注管理图层打开的话
                initMarkedTree(MarkedCreator.markedDoc); //更新标注树
            }
            return;
        }
        earth.Event.OnCreateGeometry = function() {};
        earth.Event.OnRBDown = function() {};
        v3s.add(p.Longitude, p.Latitude, p.Altitude);
        if (v3s.Count === 2) {
            //创建线
            var guid = earth.Factory.CreateGUID();
            var lineObj = earth.Factory.CreateElementLine(guid, "line");
            lineObj.BeginUpdate();
            lineObj.SetPointArray(v3s);
            lineObj.Visibility = true;
            var Linestyle = lineObj.LineStyle;
            Linestyle.LineWidth = 1;
            Linestyle.LineColor = parseInt(0xccff0000);
            lineObj.AltitudeType = 5;
            lineObj.EndUpdate();
            earth.AttachObject(lineObj);
            lineArr.push(lineObj);
            //计算长度和角度
            var c = MarkedCreator.getLineLength(v3s);
            var vector3s = earth.Factory.CreateVector3s();
            vector3s.add(v3s.Items(0).X, v3s.Items(0).Y, v3s.Items(0).Z);
            vector3s.add(v3s.Items(0).X, v3s.Items(0).Y, v3s.Items(1).Z);
            var vector3s1 = earth.Factory.CreateVector3s();
            vector3s1.add(v3s.Items(0).X, v3s.Items(0).Y, v3s.Items(1).Z);
            vector3s1.add(v3s.Items(1).X, v3s.Items(1).Y, v3s.Items(1).Z);
            var a = MarkedCreator.getLineLength(vector3s1);
            var b = MarkedCreator.getLineLength(vector3s);
            var pai = 2 * Math.asin(1);
            var angle = (180 * Math.asin(b / c) / pai).toFixed(3);
            //显示
            var lineCoordinate = v3s.Items(0).X + "," + v3s.Items(0).Y + "," + v3s.Items(0).Z + " " + v3s.Items(1).X + "," + v3s.Items(1).Y + "," + v3s.Items(1).Z;
            var dataParam = {
                id: guid,
                name: "Marked",
                tag: guid,
                //text : c+"米 " +","+ angle+"度",
                text: "长度:" + c + "m," + "坡度:" + angle+"°",
                location: {
                    x: v3s.Items(1).X,
                    y: v3s.Items(1).Y,
                    z: v3s.Items(1).Z
                },
                visibility: true,
                showHandle: false,
                handleHeight: 0,
                lineCoordinate: lineCoordinate
            };
            MarkedCreator.createElementIcon(dataParam); //调用创建icon方法
            var angleMarkedNode = MarkedCreator.createMarkedNode(dataParam);
            markedNode.appendChild(angleMarkedNode);
            MarkedCreator.appendSystemNode("MarkedAngleAndLength", "栓点标注", markedNode);
            //MarkedCreator.saveMarkedFile();
            //更新标注树
            if (divObj) {
                try {
                    divObj.src = "../markedManagement/markedManagement.html";
                } catch (e) {}

            }
            var initMarkedTree = earthMgr.doAction('updateMarkedTree');
            if (initMarkedTree != null) { //如果标注管理图层打开的话
                initMarkedTree(MarkedCreator.markedDoc); //更新标注树
            }
            //earth.GlobeObserver.FlytoLookat(dataParam.location.lon, dataParam.location.lat, dataParam.location.alt, 0, 90, 45, 45, 3);
            v3s.Remove(1);
        }
        pointTag = false;
        this.AngleAndLengthMark("",pointTag);

    };
    earth.ShapeCreator.CreatePoint();
}

function GetCurvedAngleDeep(layerID, pointKey) {
    var deep = 0; //管点埋深
    var layer = earth.LayerManager.GetLayerByGuid(layerID);
    var fields = 'ST_SPT_KEY,ST_SDEEP,ST_EDEEP,ST_EPT_KEY';
    var lk = getLayerKey(layer.Name,'line');
    SFM.queryHelper.query({
        layers:lk.join(','),
        fields:fields,
        returnGeomJson:0
     }).then(function(data){
        var d1 = data.getMe;
     for (var i = 0; i < d1.length; i++) {
        var ST_SPT_KEY  = d1[i].attributes.ST_SPT_KEY;
        var ST_EPT_KEY = d1[i].attributes.ST_EPT_KEY;
         if(ST_SPT_KEY == pointKey){
             deep = d1[i].attributes.ST_SDEEP;
               break;
            }else if(ST_EPT_KEY == pointKey){
               deep = d1[i].attributes.ST_EDEEP;
                break;
            }
          }
     });
     return deep;
    }
