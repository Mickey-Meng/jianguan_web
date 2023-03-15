(function(context) {
    context.SFM || (context.SFM = {});

    var DEFAULT_PIPE_TYPE_CODE = [{
    	code: 1000,
    	name: '电力'
    }, {
    	code: 2000,
    	name: '电信'
    }, {
    	code: 3000,
    	name: '给水'
    }, {
    	code: 4000,
    	name: '排水'
    }, {
    	code: 5000,
    	name: '燃气'
    }, {
    	code: 6000,
    	name: '热力'
    }, {
    	code: 7000,
    	name: '工业'
    }, {
    	code: 8000,
    	name: '其他'
    }];

    var reqHelper = null;

    var fromRgb = function(r, g, b){
    	var s = '0x' + toHex(r) + toHex(g) + toHex(b);
        return  parseInt(s);
    };
    var fromRgba = function(r, g, b, a){
        // red: 'ffff0000'
        var s = '0x' + toHex(a) + toHex(r) + toHex(g) + toHex(b);
        return  parseInt(s);
    };
    var colorFromRgb = function(r, g, b){
    	return '#' + toHex(r) + toHex(g) + toHex(b);
    };
    var colorFromRgba = function(r, g, b, a){
        return '#' + toHex(a) + toHex(r) + toHex(g) + toHex(b);
    };
    var toHex = function(num){
    	var s = num.toString(16);
    	return s.length == 1 ? '0' + s : s;
    };
    var rgbsToHex = function(rgbArgument) {
        var result = rgbArgument.split(",");
        var R = result[0];
        var G = result[1];
        var B = result[2];
        var n = Math.round(B);
        n += Math.round(G) << 8;
        n += Math.round(R) << 16;
        var i = 0; var j = 20;
        var str = "";
        while(j >= 0) {
            i = (n >> j)%16;
            if(i >= 10) {
                if(i == 10) str += "A";
                else if(i == 11) str += "B";
                else if(i == 12) str += "C";
                else if(i == 13) str += "D";
                else if(i == 14) str += "E";
                else str += "F";
            }else{
                str += i;
            }
            j -= 4;
        }
        return str;
    };

    //国标
    var getStandardColor = function(plType, withAlpha, isColorStr) {
    	var f = fromRgba;
    	if(isColorStr){
    		f = withAlpha !== false ? colorFromRgba : colorFromRgb;
    	}else{
    		f = withAlpha !== false ? fromRgba : fromRgb;
    	}
        var color;
       	if (plType >= 1000 && plType < 2000) {
            color = f(255, 0, 0, 255);					//电力
        } else if (plType >= 2000 && plType < 3000) {
            color = f(0, 255, 0, 255);					//电信
        } else if (plType >= 3000 && plType < 4000) {
            color = f(0, 255, 255, 255);				//给水
        } else if (plType >= 4000 && plType < 5000) {
            color = f(127, 0, 0, 255);					//排水
        } else if (plType >= 5000 && plType < 6000) {
            color = f(255, 0, 255, 255);				//燃气
        } else if (plType >= 6000 && plType < 7000) {
            color = f(255, 102, 0, 255);				//热力
        } else if (plType >= 7000 && plType < 8000) {
            color = f(0, 0, 0, 255);					//工业
        } else if (plType >= 8000 ) {
            color = f(0, 127, 127, 255);				//其他
        }
        return color;
    };

    var getPipeTypeByCode = function(code, typeConfig){
    	if(code == null){
    		return '未知';
    	}
    	var tc = typeConfig || DEFAULT_PIPE_TYPE_CODE;
    	for(var i = 0;i < tc.length;i++){
    		if(code == tc[i].code){
    			return tc[i].name;
    		}
    	}
    	return '未知';
    };

    var inArray = function(item, arr) {
        if (!arr) {
            return -1;
        }
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == item) {
                return i;
            }
        }
        return -1;
    };

    var openDialog = function(url, params, width, height) {
        var is_opera = /opera/i.test(navigator.userAgent);
        var is_ie = (/msie/i.test(navigator.userAgent) && !is_opera);
        var is_ie_6 = (is_ie && /msie 6\.0/i.test(navigator.userAgent));

        var value = "";
        if (is_ie_6) {
            height = height + 50;
            value = window.showModalDialog(url, params, "menubar:no;dialogWidth:" + width + "px;status:yes;title:no;help:no;resizable:no;scroll:yes;location:no;toolbar:no;dialogHeight:" + height + "px");
        } else {
            value = window.showModalDialog(url, params, "menubar:no;dialogWidth:" + width + "px;status:yes;title:no;help:no;resizable:no;scroll:yes;location:no;toolbar:no;dialogHeight:" + height + "px");
        }
        return value;
    };

    context.SFM.sectionHelper = {
        init: function(helper, sfmModule, typeConfig) {
            reqHelper = this.reqHelper = helper;
            this.sfmm = sfmModule;
            this.typeConfig = typeConfig;
            return this;
        },

        getPipeTypeByCode: function(code, layerInfos){
            var me = this;
            for(var i = 0;i < layerInfos.length;i++){
                var li = layerInfos[i];
                if(li.pipeCode == code){
                    return li.group;
                }
            }
            return getPipeTypeByCode(code, me.typeConfig);
        },

        crossSection: function(line, byData, showAlert, callback) {
        	var me = this;
        	var x1 = line.x1;
        	var y1 = line.y1;
        	var x2 = line.x2;
        	var y2 = line.y2;
            me.reqHelper.getLayerList().then(function(data) {
                var l = data.length;
                if (l == 0) {
                    showAlert && alert('未获取到图层列表');
                    callback && callback();
                    return;
                }
                var layer = '';
                for (var i = 0; i < l; i++) {
                    if (data[i].type == 'line') {
                        layer += data[i].key + ',';
                    }
                }
                layer.length > 0 && (layer = layer.substring(0, layer.length - 1));
                me.reqHelper.transection({ line: x1 + ' ' + y1 + ',' + x2 + ' ' + y2 }).then(function(data) {
                    d = data;
                    var groundAltList = [];
                    var pipeLineAltList = [];
                    var minGroundAltitude = 0;
                    var maxGroundAltitude = 0;
                    var minLength = 0;
                    var maxLength = 0;
                    var minPipeLineAltitude = 0;
                    var maxPipeLineAltitude = 0;
                    var flag = true;
                    var b = false; // ectx.SYSTEMPARAMS.profileAlt == "0"

                    var parseResult = function(data) {
                        if (data.length == 0) {
                        	showAlert && alert('未查询到管线');
                        	callback && callback();
                            return;
                        }
                        var st_x1 = '';
                        var st_y1 = '';
                        var st_x2 = '';
                        var st_y2 = '';
                        for (var i = 0; i < data.length; i++) {
                            var ID = data[i].ST_KEY; //ID
                            var mater = data[i].ST_PMATER; //材质
                            var pipeCode = data[i].ST_PIPECODE; //数据类型
                            var key = data[i].ST_LAYER_NAME; //key
                            var sName = me.reqHelper.getLayerName(key);
                            var dataType = getPipeTypeByCode(pipeCode, this.typeConfig);
                            dataType = me.reqHelper.getLayerGroup(key);

                            var color = getStandardColor(pipeCode, false, true);
                            var specification = data[i].ST_SIZE;	// 管径/规格
                            var intersectPointX = data[i].intersectPointX;
                            var intersectPointY = data[i].intersectPointY;
                            var intersectAltitude1 = data[i].intersectPointAlt; //地面高程
                            var intersectAltitude = (parseFloat(intersectAltitude1)).toFixed(3);
                            // 计算地面高程和埋深
                            var vAltitude1 = intersectAltitude1;	// 地面高程
                            var IntersectDeep = 0;					// 埋深
                            if(byData !== false){
                            	IntersectDeep = data[i].intersectPointDeep;
                            	vAltitude1 = intersectAltitude1 + IntersectDeep;
                            }else{
                            	vAltitude1 = me.sfmm.doAction('measureTerrainAltitude', null, {
                            		x: intersectPointX,
                            		y: intersectPointY,
                            		isWgs84: false
                            	});
                            	IntersectDeep = vAltitude1 - intersectAltitude1;
                            }
                            //管线高程
                            vAltitude = (parseFloat(vAltitude1)).toFixed(3); //算出地形高程
                            var intersectDeep = (parseFloat(IntersectDeep)).toFixed(3);
                            st_x1 = x1;
                            st_y1 = y1;
                            st_x2 = data[i].intersectPointX;
                            st_y2 = data[i].intersectPointY;

                            var lengthl = Math.sqrt(Math.abs(st_x1 - st_x2) * Math.abs(st_x1 - st_x2) + Math.abs(st_y1 - st_y2) * Math.abs(st_y1 - st_y2)); // 间距
                            lengthl = (parseFloat(lengthl)).toFixed(6);
                            if (flag) {
                                minLength = maxLength = lengthl; //间距
                                if (b) { //数据高程
                                    minGroundAltitude = maxGroundAltitude = intersectAltitude;
                                } else {
                                    minGroundAltitude = maxGroundAltitude = vAltitude; //intersectAltitude; //地形高程
                                }

                                minPipeLineAltitude = maxPipeLineAltitude = intersectAltitude; //vAltitude; //管线高程
                                flag = false;
                            }
                            if (parseFloat(maxLength) < parseFloat(lengthl)) {
                                maxLength = lengthl;
                            }
                            if (parseFloat(minLength) >= parseFloat(lengthl)) {
                                minLength = lengthl;
                            }
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
                            if (b) {
                                groundAltList.push(intersectAltitude); //groundAltList.push(vAltitude); //数据高程
                            } else {
                                groundAltList.push(vAltitude); //groundAltList.push(intersectAltitude); //地形高程
                            }
                            groundAltList.push(lengthl);

                            var pipeLineObj = {};
                            pipeLineObj.dataType = dataType;
                            pipeLineObj.ID = ID;
                            pipeLineObj.mater = mater;
                            pipeLineObj.x = intersectAltitude; //vAltitude;
                            pipeLineObj.y = lengthl;
                            pipeLineObj.coordX = (st_x2).toFixed(3);
                            pipeLineObj.coordY = (st_y2).toFixed(3);
                            //pipeLineObj.vAltitude= earth.Measure.MeasureTerrainAltitude(NewpVectors.Longitude,NewpVectors.Latitude);
                            pipeLineObj.fillcolor = color;
                            pipeLineObj.groundAltitude = vAltitude; //intersectAltitude;
                            pipeLineObj.specification = specification;
                            pipeLineObj.deep = intersectDeep;
                            pipeLineAltList.push(pipeLineObj);
                        }

                        createTranSectionChat();
                    };

                    var createTranSectionChat = function() {
                        var params = {
                            gAltList: groundAltList,
                            pAltList: pipeLineAltList,
                            minL: minLength,
                            maxL: maxLength,
                            minG: minGroundAltitude,
                            maxG: maxGroundAltitude,
                            minP: minPipeLineAltitude,
                            maxP: maxPipeLineAltitude,
                            profileAlt: b ? '0' : '1'
                        };

                        var is_opera = /opera/i.test(navigator.userAgent);
                        var is_ie = (/msie/i.test(navigator.userAgent) && !is_opera);
                        var is_ie_6 = (is_ie && /msie 6\.0/i.test(navigator.userAgent));
                        var is_ie_7 = (is_ie && /msie 7\.0/i.test(navigator.userAgent));
                        var is_ie_8 = (is_ie && /msie 8\.0/i.test(navigator.userAgent));

                        var u = context.SFM.sfmUtil.getHostUrl();
                        u += '/modules/widget/common/analysis/crossSectionResult/';
                        if (is_ie_6 || is_ie_7 || is_ie_8) {
                            openDialog(u + "crossSectionResult2.html", params, 1060, 700);
                        } else {
                            openDialog(u + "crossSectionResult.html", params, 1060, 700);
                        }
                        callback && callback();
                    };
                    parseResult(data);
                }, function(msg) {
                    showAlert && alert(msg);
                    callback && callback();
                });
            }, function(msg) {
                showAlert && alert(msg);
                callback && callback();
            });
			return me;
        },
        verticalSection: function(options, showAlert, callback){
        	var me = this;
        	var op = {layer: options.layer.key, keys: options.pipeKeys};
        	me.reqHelper.verticalSec(op).then(function(data){
        		var minGroundAltitude = 0;
		        var maxGroundAltitude = 0;
		        var minPipeLineAltitude = 0;
		        var maxPipeLineAltitude = 0;
		        var groundAltitudeList = [];
		        var pipeLineAltitudeList = [];
		        var pipeLineObjectsList = [];
		        var flag = true;
		        var width = 0;
		        var flow = true;
		        var strGuidList = [];
		        var b = false; // ectx.SYSTEMPARAMS.profileAlt == "0"

		        var parseResult = function(d, pipeCode) {
		            var len = d.length
		            for (var i = 0; i < len; i++) {
		            	var di = d[i];
		                //除去重复数据
		                var guid = di.ST_KEY;
		                if (inArray(guid, strGuidList) >= 0) {
		                    continue;
		                }
		                strGuidList.push(guid);
		                var ID = di.ST_KEY;				//管线ID
		                var mater = di.ST_PMATER;		//材质
		                var dataType = getPipeTypeByCode(pipeCode, this.typeConfig);	// 管线类型
                        dataType = me.reqHelper.getLayerGroup(di.ST_LAYER_NAME);
		                var startDeep = di.ST_SDEEP; //开始埋深
		                startDeep = (parseFloat(startDeep)).toFixed(3);
		                var endDeep = di.ST_EDEEP; //结束埋深
		                endDeep = (parseFloat(endDeep)).toFixed(3);
		                var specification = di.ST_SIZE; //规格
		                var startID = di.ST_SPT_KEY; //管线开始端点ID
		                var endID = di.ST_EPT_KEY; //管线结束端点ID
		                var pipeLineStartAlt = di.ST_SALT;
		                var pipeLineEndAlt = di.ST_EALT;

		                var jsonStr = di.__GEOMJSON__;
		                var objJson = JSON.parse(jsonStr);
		                var coor = objJson.coordinates;
		                var coors = coor[0];
		                var x1 = coors[0][0];
		                var y1 = coors[0][1];
		                var x2 = coors[1][0];
		                var y2 = coors[1][1];

		                groundStartAlt = parseFloat(pipeLineStartAlt) + parseFloat(startDeep); //地面开始高程
		                groundStartAlt = (parseFloat(groundStartAlt)).toFixed(3);
		                groundEndAlt = parseFloat(pipeLineEndAlt) + parseFloat(endDeep); //地面结束高程
		                groundEndAlt = (parseFloat(groundEndAlt)).toFixed(3);
		                pipeLineStartAlt = parseFloat(pipeLineStartAlt);
		                pipeLineEndAlt = parseFloat(pipeLineEndAlt);

		                var color = getStandardColor(pipeCode, false, true);

		                var length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)); //间距
		                length = parseFloat(length.toFixed(5)); //截取3位小数位
		                tempMinGroundAltitude = Math.min(groundStartAlt, groundEndAlt);
		                tempMaxGroundAltitude = Math.max(groundStartAlt, groundEndAlt);
		                tempMinPipeLineAltitude = Math.min(pipeLineStartAlt, pipeLineEndAlt);
		                tempMaxPipeLineAltitude = Math.max(pipeLineStartAlt, pipeLineEndAlt);
		                if (flag) {
		                    minGroundAltitude = tempMinGroundAltitude;
		                    maxGroundAltitude = tempMaxGroundAltitude;
		                    minPipeLineAltitude = tempMinPipeLineAltitude;
		                    maxPipeLineAltitude = tempMaxPipeLineAltitude;
		                    flag = false;
		                }
		                if (minGroundAltitude >= tempMinGroundAltitude) {
		                    minGroundAltitude = tempMinGroundAltitude;
		                }
		                if (maxGroundAltitude < tempMaxGroundAltitude) {
		                    minGroundAltitude = tempMinGroundAltitude;
		                }
		                if (minPipeLineAltitude >= tempMinPipeLineAltitude) {
		                    minPipeLineAltitude = tempMinPipeLineAltitude;
		                }
		                if (maxPipeLineAltitude < tempMaxPipeLineAltitude) {
		                    maxPipeLineAltitude = tempMaxPipeLineAltitude;
		                }
		                var pipeLineObj = {};
		                pipeLineObj.dataType = dataType;
		                pipeLineObj.ID = ID;
		                pipeLineObj.startID = startID;
		                pipeLineObj.endID = endID;
		                pipeLineObj.mater = mater;
		                pipeLineObj.width = width;
		                pipeLineObj.length = length;
		                pipeLineObj.flow = flow;
		                pipeLineObj.startCoordX = (x1).toFixed(3);
		                pipeLineObj.startCoordY = (y1).toFixed(3);
		                pipeLineObj.endCoordX = (x2).toFixed(3);
		                pipeLineObj.endCoordY = (y2).toFixed(3);
		                pipeLineObj.fillcolor = color;
		                pipeLineObj.pipeLineStartAlt = pipeLineStartAlt;
		                pipeLineObj.pipeLineEndAlt = pipeLineEndAlt;
		                pipeLineObj.groundStartAlt = groundStartAlt;
		                pipeLineObj.groundEndAlt = groundEndAlt;
		                pipeLineObj.specification = specification;
		                pipeLineObj.startDeep = startDeep;
		                pipeLineObj.endDeep = endDeep;
		                pipeLineObjectsList.push(pipeLineObj);
		            }

		            verSectionPipeLine(pipeLineObjectsList);
		            getCoordData(pipeLineList);
		            if (!IsConnect) {
		                var cfm = window.confirm("所选管线不连续，是否继续？");
		                if (!cfm) {
		                	callback && callback();
		                    return false;
		                }
		            }
		            createVerSectionChat();
		        };

		        var pipeLineList = [];
		        var IsConnect = true;
		        var verSectionPipeLine = function(listPipeline) {
		            var ttmpArr = [];
		            var startArr = [];
		            var endArr = [];
		            for (var i = 0; i < listPipeline.length; i++) {
		                pipeLineList.push(listPipeline[i]);
		                if (i > 0) {
		                    IsConnect = false;
		                    for (var j = 0; j < startArr.length; j++) {
		                        if (startArr[j] == listPipeline[i].endID) { //坐标全反过来
		                            IsConnect = true;
		                            listPipeline[j].flow = false;
		                            listPipeline[i].flow = false;
		                        } else if (startArr[j] == listPipeline[i].startID) { //第一个反过来
		                            IsConnect = true;
		                            listPipeline[j].flow = false;
		                            listPipeline[i].flow = true;
		                        } else if (endArr[j] == listPipeline[i].startID) { //不用反
		                            IsConnect = true;
		                            listPipeline[j].flow = true;
		                            listPipeline[i].flow = true;
		                        } else if (endArr[j] == listPipeline[i].endID) { //第二个反过来
		                            IsConnect = true;
		                            listPipeline[j].flow = true;
		                            listPipeline[i].flow = false;
		                        }
		                    }
		                }
		                var sStart = listPipeline[i].startID;
		                var sEnd = listPipeline[i].endID;
		                startArr.push(sStart);
		                endArr.push(sEnd);
		            }
		        };
		        //获取地面坐标列表 和 管线坐标列表
		        var getCoordData = function(pipeLineList) {
		            for (var i = 0; i < pipeLineList.length; i++) {
		                var pipeLineObject = pipeLineList[i];
		                pipeLineObject.width = width;
		                var flow = pipeLineObject.flow;
		                var specification = 0;
		                if ("" != pipeLineObject.specification && pipeLineObject.specification.toString().indexOf("X") < 0) {
		                    specification = pipeLineObject.specification / 1000; //管径
		                }
		                if (flow) {
		                    groundAltitudeList.push(pipeLineObject.groundStartAlt); //地面高程起始点x轴坐标
		                    groundAltitudeList.push(pipeLineObject.width); //地面高程起始点Y轴坐标
		                    if (pipeLineObject.dataType != null && (pipeLineObject.dataType.indexOf("排水") >= 0 || pipeLineObject.dataType.indexOf("管沟") >= 0)) {
		                        pipeLineAltitudeList.push(pipeLineObject.groundStartAlt - pipeLineObject.startDeep + specification); //管线高程起始点x轴坐标
		                    } else {
		                        pipeLineAltitudeList.push(pipeLineObject.groundStartAlt - pipeLineObject.startDeep); //管线高程起始点x轴坐标
		                    }
		                    pipeLineAltitudeList.push(pipeLineObject.width); //管线高程起始点Y轴坐标
		                    width = pipeLineObject.width + pipeLineObject.length;
		                    groundAltitudeList.push(pipeLineObject.groundEndAlt); //地面高程结束点x轴坐标
		                    groundAltitudeList.push(width); //地面高程结束点Y轴坐标
		                    if (pipeLineObject.dataType != null && (pipeLineObject.dataType.indexOf("排水") >= 0 || pipeLineObject.dataType.indexOf("管沟") >= 0)) {
		                        pipeLineAltitudeList.push(pipeLineObject.groundEndAlt - pipeLineObject.endDeep + specification); //管线高程结束点x轴坐标
		                    } else {
		                        pipeLineAltitudeList.push(pipeLineObject.groundEndAlt - pipeLineObject.endDeep); //管线高程结束点x轴坐标
		                    }
		                    pipeLineAltitudeList.push(width); //管线高程结束点Y轴坐标
		                } else {
		                    groundAltitudeList.push(pipeLineObject.groundEndAlt); //地面高程起始点x轴坐标
		                    groundAltitudeList.push(pipeLineObject.width); //地面高程起始点Y轴坐标
		                    if (pipeLineObject.dataType != null && (pipeLineObject.dataType.indexOf("排水") >= 0 || pipeLineObject.dataType.indexOf("管沟") >= 0)) {
		                        pipeLineAltitudeList.push(pipeLineObject.groundEndAlt - pipeLineObject.endDeep + specification); //管线高程起始点x轴坐标
		                    } else {
		                        pipeLineAltitudeList.push(pipeLineObject.groundEndAlt - pipeLineObject.endDeep); //管线高程起始点x轴坐标
		                    }
		                    pipeLineAltitudeList.push(pipeLineObject.width); //管线高程起始点Y轴坐标
		                    width = pipeLineObject.width + pipeLineObject.length;
		                    groundAltitudeList.push(pipeLineObject.groundStartAlt); //地面高程结束点x轴坐标
		                    groundAltitudeList.push(width); //地面高程结束点Y轴坐标
		                    if (pipeLineObject.dataType != null && (pipeLineObject.dataType.indexOf("排水") >= 0 || pipeLineObject.dataType.indexOf("管沟") >= 0)) {
		                        pipeLineAltitudeList.push(pipeLineObject.groundStartAlt - pipeLineObject.startDeep + specification); //管线高程起始点x轴坐标
		                    } else {
		                        pipeLineAltitudeList.push(pipeLineObject.groundStartAlt - pipeLineObject.startDeep); //管线高程结束点x轴坐标
		                    }
		                    pipeLineAltitudeList.push(width); //管线高程结束点Y轴坐标
		                }
		            }
		        };
		        var createVerSectionChat = function() {
		            var params = {
		                pipeLineObjList: pipeLineList,
		                gAltList: groundAltitudeList,
		                pAltList: pipeLineAltitudeList,
		                minG: minGroundAltitude,
		                maxG: maxGroundAltitude,
		                minP: minPipeLineAltitude,
		                maxP: maxPipeLineAltitude,
		                profileAlt: b ? '0' : '1'
		            };

		            var is_opera = /opera/i.test(navigator.userAgent);
		            var is_ie = (/msie/i.test(navigator.userAgent) && !is_opera);
		            var is_ie_6 = (is_ie && /msie 6\.0/i.test(navigator.userAgent));
		            var is_ie_7 = (is_ie && /msie 7\.0/i.test(navigator.userAgent));
		            var is_ie_8 = (is_ie && /msie 8\.0/i.test(navigator.userAgent));

		            var u = context.SFM.sfmUtil.getHostUrl();
                    u += '/modules/widget/common/analysis/verticalSectionResult/';
		            if (is_ie_6 || is_ie_7 || is_ie_8) {
		                openDialog(u + "verSectionResult2.html", params, 1060, 700);
		            } else {
		                openDialog(u + "verSectionResult.html", params, 1060, 700);
		            }
		        };

		        parseResult(data, options.layer.pipeCode);
        	}, function(msg){
        		showAlert && alert(msg);
        		callback && callback();
        	});
        	return me;
        }
    };
})(window);
