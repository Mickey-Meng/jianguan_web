var CreateCylinder = function(Cesium,viewer, style) {
	this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
	this.viewer = viewer;
	this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.cylinder = null;
	this.polyline = null;
	this.positions = [];
	this.style = style;
	this.state = 0; //1为新增 2为编辑 0为清除
	this.gonPointArr = [];
	this.modifyPoint = null;
	this.Cesium = Cesium;
	this.radius = null;
	this.CenterPoint = null;
	this.movePointType = null;
	this.length = 2000;
	//初始化鼠标提示框
	// this.prompt = new MovePrompt({
	// 	viewer: viewer
	// });
	// this.modifyPrompt = new MovePrompt({
	// 	viewer: viewer
	// });
}
CreateCylinder.prototype = {
	start: function(callBack) {
		var that = this;
		this.handler.setInputAction(function(evt) { //单机开始绘制
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polygon]);
			if (that.positions.length == 0) {
				that.positions.push(cartesian.clone());
				that.CenterPoint = cartesian; //原点
			}
			that.positions.push(cartesian);
			var point = that.createPoint(cartesian);
			point.wz = that.gonPointArr.length;
			if (that.gonPointArr.length == 0) {
				point.type = "yd"; //原点
				that.gonPointArr.push(point);
			}else if(that.gonPointArr.length == 1){
				point.type = "rd";
				that.gonPointArr.push(point);

				cartesian.z+=2000;
				var point1 = that.createPoint(cartesian);
				point1.wz = 2;
				point1.type = "hd";
				that.gonPointArr.push(point1);
			}
			console.log(that.gonPointArr.length);

		}, that.Cesium.ScreenSpaceEventType.LEFT_CLICK);
		this.handler.setInputAction(function(evt) { //移动时绘制面
			if (that.positions.length < 1) {
				// that.prompt.updatePrompt(evt.endPosition, "单击开始绘制");
				return;
			}
			// that.prompt.updatePrompt(evt.endPosition, "单击新增，右键结束");
			var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer);
			if (that.positions.length == 2) {
				if (!that.Cesium.defined(that.cylinder)) {
					that.cylinder = that.createCylinder(that.style);
					that.cylinder.isFilter = true;
					that.cylinder.objId = that.objId;
					// if (that.polyline) that.viewer.entities.remove(that.polyline);
				}
				var loc1 = that.Cartesian3_to_WGS84(that.CenterPoint);
				var loc2 = that.Cartesian3_to_WGS84(cartesian);
				that.radius = that.getFlatternDistance(loc1.lat,loc1.lng,loc2.lat,loc2.lng);
			}
			that.positions.pop();
			that.positions.push(cartesian);

		}, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.handler.setInputAction(function(evt) {
			if (!that.cylinder) return;
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer);
			that.state = 1;
			that.handler.destroy();

			that.positions.pop();
			that.positions.push(cartesian);
			// var point = that.createPoint(cartesian);
			// point.wz = that.gonPointArr.length;
			// that.gonPointArr.push(point);
			callBack(that.cylinder);
		}, that.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	},
	createByPositions: function(lnglatArr, callBack) { //通过传入坐标数组创建面
		if (!lnglatArr) return;
		var positions = that.getCatesian3FromPX.lnglatArrToCartesianArr(lnglatArr);
		if (!positions) return;
		this.polygon = this.createPolygon();
		this.positions = positions;
		callBack(this.polygon);
		for (var i = 0; i < positions.length; i++) {
			var point = this.createPoint(positions[i]);
			point.isFilter = true;
			point.wz = this.gonPointArr.length;
			this.gonPointArr.push(point);
		}
		this.state = 1;
		this.polygon.objId = this.objId;
	},

	startModify: function() {
		if (this.state != 1 && this.state != 2) return; //表示还没绘制完成
		if (!this.modifyHandler) this.modifyHandler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
		var that = this;
		for (var i = 0; i < that.gonPointArr.length; i++) {
			var point = that.gonPointArr[i];
			if (point) point.show = true;
		}
		this.modifyHandler.setInputAction(function(evt) {
			var pick = that.viewer.scene.pick(evt.position);
			if (that.Cesium.defined(pick) && pick.id) {
				if (!pick.id.objId)
					that.modifyPoint = pick.id;
					if (that.modifyPoint) {
						that.movePointType = that.modifyPoint.type;
						console.log(that.movePointType);
						// debugger;
					}
					that.forbidDrawWorld(true);
			} else {
				for (var i = 0; i < that.gonPointArr.length; i++) {
					var point = that.gonPointArr[i];
					if (point) point.show = false;
				}
				if (that.modifyHandler) {
					that.modifyHandler.destroy();
					that.modifyHandler = null;
					//that.modifyPrompt.destroy();
				}
			}
			//that.state = 2;
		}, that.Cesium.ScreenSpaceEventType.LEFT_DOWN);
		this.modifyHandler.setInputAction(function(evt) { //移动时绘制面
			if (that.positions.length < 1 || !that.modifyPoint) return;
			var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer);
			if (cartesian) {
				that.modifyPoint.position.setValue(cartesian);
				that.positions[that.modifyPoint.wz] = cartesian;
				//that.modifyPrompt.updatePrompt(evt.endPosition, "鼠标拖动修改");
				if (that.movePointType =="yd") {
					that.CenterPoint = cartesian;
					var cartesian2= evt.endPosition; //原点平面坐标

					// var position = new Cesium.Cartesian2();
					// Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian,position);
					var otherPoint = null;
					for (let n = 0; n < that.gonPointArr.length; n++) {
						if (that.gonPointArr[n].type == "rd") {
							otherPoint = that.gonPointArr[n];
						}
					}
					var p1Cartesian2 = that.Cesium.SceneTransforms.wgs84ToWindowCoordinates(that.viewer.scene,that.positions[otherPoint.wz]);
					console.log(that.radius);
					var p = that.scalePointToLen(cartesian2,p1Cartesian2,that.radius);
					var newC2 = null
					newC2 = that.Cesium.Cartesian2.fromElements(p.x,p.y,newC2);
					console.log(newC2);
					var cartesian3= that.viewer.scene.camera.pickEllipsoid(newC2);
					// var cartesian3 = that.getCatesian3FromPX(newC2, that.viewer);;
					console.log(cartesian3);
					console.log("------------------------------------------------------");
					otherPoint.position.setValue(cartesian3);
					that.positions[otherPoint.wz] = cartesian3;

				}else if(that.movePointType == "rd"){
					var loc1 = that.Cartesian3_to_WGS84(that.CenterPoint);
					var loc2 = that.Cartesian3_to_WGS84(cartesian);
					that.radius = that.getFlatternDistance(loc1.lat,loc1.lng,loc2.lat,loc2.lng);
				}else if (that.movePointType == "hd") {
					var rPointCartesian = null;
					var hPoint = null; //当前点
					var height = null;
					for (let j = 0; j < that.gonPointArr.length; j++) {
						if (that.gonPointArr[j].type == "rd") {
							rPointCartesian = that.positions[that.gonPointArr[j].wz];
						}
						if (that.gonPointArr[j].type == "hd") {
							hPoint = that.gonPointArr[j];
						}
					}
					hPoint.position.setValue(cartesian);
					// height =that.Cartesian3_to_WGS84(cartesian).alt - that.Cartesian3_to_WGS84(rPointCartesian).alt;
					height = cartesian.z - rPointCartesian.z;
					that.length = height;
					console.log(height);
				}
			}
		}, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.modifyHandler.setInputAction(function(evt) {
			that.forbidDrawWorld(false);
			if (!that.modifyPoint) return;
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polygon, that.modifyPoint]);
			that.modifyPoint.position.setValue(cartesian);
			that.positions[that.modifyPoint.wz] = cartesian;
			that.modifyPoint = null;
			that.forbidDrawWorld(false);
		}, that.Cesium.ScreenSpaceEventType.LEFT_UP);
	},
	createPoint: function(position) {
		if (!position) return;
		return this.viewer.entities.add({
			position: position,
			point: {
				pixelSize: 5,
				color: this.Cesium.Color.YELLOW,
				outlineWidth: 2,
				outlineColor: this.Cesium.Color.DARKRED,
				heightReference: this.Cesium.HeightReference.CLAMP_TO_GROUND,
				disableDepthTestDistance: Number.POSITIVE_INFINITY
			},
			show: false
		});
	},
	createCylinder: function() {
		var that = this;
		return this.viewer.entities.add({
			position: new that.Cesium.CallbackProperty(function() {
				return that.CenterPoint;
			}, false),
			cylinder : {
				length : new that.Cesium.CallbackProperty(function() {
					return that.length;
				}, false),
				topRadius :new that.Cesium.CallbackProperty(function(){
					return that.radius;
				}),
				bottomRadius : new that.Cesium.CallbackProperty(function(){
					return that.radius;
				}),
				material : that.Cesium.Color.fromCssColorString("#00ff00").withAlpha(0.6),
				outline : true,
				outlineColor : that.Cesium.Color.WHITE
			}

		});
	},
	createPolyline: function() {
		var that = this;
		return this.viewer.entities.add({
			polyline: {
				positions: new this.Cesium.CallbackProperty(function() {
					return that.positions
				}, false),
				clampToGround: this.style.clampToGround == undefined ? false : true,
				material: that.Cesium.Color.RED,
				width: 3
			}
		});
	},
	getPositions: function() {
		return this.positions;
	},
	getLnglats: function() {
		return cCesium.caratesianArrToLnglatArr(this.positions);
	},
	getAttr: function() {
		if (!this.polygon) return;
		var obj = {};
		var polygon = this.polygon.polygon;
		obj.fill = polygon.fill._value;
		obj.outline = polygon.outline._value;
		obj.outlineWidth = polygon.outlineWidth._value;
		obj.outlineColor = polygon.outlineColor._value;
		obj.clampToGround = line.clampToGround._value;
		obj.color = line.material.color._value;
		return obj;
	},
	setStyle: function(obj) {},
	remove: function() {
		if (this.polygon) {
			this.state = 0;
			this.viewer.entities.remove(this.polygon);
			this.polygon = null;
		}
	},
	setVisible: function(vis) {
		this.polygon.show = vis;
	},
	forbidDrawWorld: function(isForbid) {
		this.viewer.scene.screenSpaceCameraController.enableRotate = !isForbid;
		this.viewer.scene.screenSpaceCameraController.enableTilt = !isForbid;
		this.viewer.scene.screenSpaceCameraController.enableTranslate = !isForbid;
		this.viewer.scene.screenSpaceCameraController.enableInputs = !isForbid;
	},
	destroy: function() {
		if (this.handler) {
			this.handler.destroy();
			this.handler = null;
		}
		if (this.modifyHandler) {
			this.modifyHandler.destroy();
			this.modifyHandler = null;
		}
		if (this.polygon) {
			this.viewer.entities.remove(this.polygon);
			this.polygon = null;
		}
		if (this.polyline) {
			this.viewer.entities.remove(this.polyline);
			this.polyline = null;
		}
		this.positions = [];
		this.style = null;
		if (this.modifyPoint) {
			this.viewer.entities.remove(this.modifyPoint);
			this.modifyPoint = null;
		}
		for (var i = 0; i < this.gonPointArr.length; i++) {
			var point = this.gonPointArr[i];
			this.viewer.entities.remove(point);
		}
		this.gonPointArr = [];
		this.state = 0;
		// if (this.prompt) this.prompt.destroy();
		if (this.polyline) {
			this.polyline = null;
			this.viewer.entities.remove(this.polyline);
		}
	},
	getCatesian3FromPX: function(px, viewer, entitys) {
		var cartesian;
		// 		var drillPick = viewer.scene.drillPick(px);
		// 		var truePick = null;
		// 		if (entitys) {
		// 			for (var i = 0; i < drillPick.length; i++) {
		// 				if (drillPick[i].id && drillPick[i].id.isFilter) {
		// 					continue;
		// 				} else {
		// 					truePick = viewer.scene.pick(px);
		// 				}
		// 			}
		// 		}
		// 		if (viewer.scene.pickPositionSupported && truePick && Cesium.defined(truePick)) {
		// 			cartesian = viewer.scene.pickPosition(px);
		// 		} else {
		// 			var ray = viewer.camera.getPickRay(px);
		// 			if (!ray) return;
		// 			cartesian = viewer.scene.globe.pick(ray, viewer.scene);
		// 		}
		var ray = viewer.camera.getPickRay(px);
		if (!ray) return;
		cartesian = viewer.scene.globe.pick(ray, viewer.scene);
		return cartesian;
	},
	//笛卡尔坐标系转WGS84坐标系
	Cartesian3_to_WGS84: function (point) {
		var cartesian33 = new this.Cesium.Cartesian3(point.x, point.y, point.z);
		var cartographic = this.Cesium.Cartographic.fromCartesian(cartesian33);
		var lat = this.Cesium.Math.toDegrees(cartographic.latitude);
		var lng = this.Cesium.Math.toDegrees(cartographic.longitude);
		var alt = cartographic.height;
		return {lat: lat, lng: lng, alt: alt};
	},
	//计算两点间距离
	getFlatternDistance:function(lat1, lng1, lat2, lng2) {
		var EARTH_RADIUS = 6378137.0;    //单位M
		var PI = Math.PI;

		function getRad(d) {
			return d * PI / 180.0;
		}
		var f = getRad((lat1 + lat2) / 2);
		var g = getRad((lat1 - lat2) / 2);
		var l = getRad((lng1 - lng2) / 2);

		var sg = Math.sin(g);
		var sl = Math.sin(l);
		var sf = Math.sin(f);

		var s, c, w, r, d, h1, h2;
		var a = EARTH_RADIUS;
		var fl = 1 / 298.257;

		sg = sg * sg;
		sl = sl * sl;
		sf = sf * sf;

		s = sg * (1 - sl) + (1 - sf) * sl;
		c = (1 - sg) * (1 - sl) + sf * sl;

		w = Math.atan(Math.sqrt(s / c));
		r = Math.sqrt(s * c) / w;
		d = 2 * w * a;
		h1 = (3 * r - 1) / 2 / c;
		h2 = (3 * r + 1) / 2 / s;

		return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
	},
	/**
     *
     * p(point): { x: <number>, y: <number> }, 须为平面坐标，函数不处理坐标系
     *
     */
    /**
     * 返回 点p(向量终点) 沿 p0 -> p 方向延伸到距离 p0(向量起点) 的长度为length后得到的新点，不修改 点p
     * @param  {<point>} 	p0     	向量起点
     * @param  {<point>} 	p      	向量终点
     * @param  {<number>} 	length 	延伸后距离 p0(向量起点) 的长度
     * @return {<point>}        	新的终点
     */
    scalePointToLen:function(p0, p, length) {
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
	},
	//平面坐标转经纬度坐标
	MillierConvertion1:function(x,y)
	{
		var PI = Math.PI;
	    var L = 6381372 * PI * 2;     // 地球周长
		W = L; // 平面展开后，x轴等于周长
		H = L / 2;// y轴约等于周长一半
		mill = 2.3; // 米勒投影中的一个常数，范围大约在正负2.3之间
		var lat;
		lat = ((H / 2 - y) * 2 * mill) / (1.25 * H);
		lat = ((Math.atan(Math.exp(lat)) - 0.25 * PI) * 180) / (0.4 * PI);
		var lon;
		lon = (x - W / 2) * 360 / W;
		var result = [];
		result[0] = lon;
		result[1] = lat;
		return result;
	},
	//经纬度坐标转平面坐标
    millerXY:function(lon, lat){
        var L = 6381372 * Math.PI * 2,     // 地球周长
            W = L, // 平面展开后，x轴等于周长
            H = L / 2, // y轴约等于周长一半
            mill = 2.3, // 米勒投影中的一个常数，范围大约在正负2.3之间
            x = lon * Math.PI / 180, // 将经度从度数转换为弧度
            y = lat * Math.PI / 180; // 将纬度从度数转换为弧度
        // 这里是米勒投影的转换
        y = 1.25 * Math.log( Math.tan( 0.25 * Math.PI + 0.4 * y ) );
        // 这里将弧度转为实际距离
        x = ( W / 2 ) + ( W / (2 * Math.PI) ) * x;
        y = ( H / 2 ) - ( H / ( 2 * mill ) ) * y;
        // 转换结果的单位是公里
        // 可以根据此结果，算出在某个尺寸的画布上，各个点的坐标
        return {
            x : x,
            y : y
        };
    }
}
