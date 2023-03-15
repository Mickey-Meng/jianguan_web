var CreatePolygon = function(Cesium,viewer, style) {
	this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
	this.viewer = viewer;
	this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.polygon = null;
	this.polyline = null;
	this.positions = [];
	this.style = style;
	this.state = 0; //1为新增 2为编辑 0为清除
	this.gonPointArr = [];
	this.modifyPoint = null;
	this.Cesium = Cesium;
	//初始化鼠标提示框
	// this.prompt = new MovePrompt({
	// 	viewer: viewer
	// });
	// this.modifyPrompt = new MovePrompt({
	// 	viewer: viewer
	// });
}
CreatePolygon.prototype = {
	start: function(callBack) {
		var that = this;
		this.handler.setInputAction(function(evt) { //单机开始绘制
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polygon]);
			// console.log(cartesian);
			// console.log(cartesian.clone());
			if (that.positions.length == 0) {
				that.positions.push(cartesian.clone());
			}
			that.positions.push(cartesian);
			// console.log(that.positions);
			var point = that.createPoint(cartesian);
			point.wz = that.gonPointArr.length;
			that.gonPointArr.push(point);
		}, that.Cesium.ScreenSpaceEventType.LEFT_CLICK);
		this.handler.setInputAction(function(evt) { //移动时绘制面
			if (that.positions.length < 1) {
				// that.prompt.updatePrompt(evt.endPosition, "单击开始绘制");
				return;
			}
			// that.prompt.updatePrompt(evt.endPosition, "单击新增，右键结束");
			var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polygon]);
			if (that.positions.length == 2) {
				if (!that.Cesium.defined(that.polyline)) that.polyline = that.createPolyline();
			} else {
				if (!that.Cesium.defined(that.polygon)) {
					that.polygon = that.createPolygon(that.style);
					that.polygon.isFilter = true;
					that.polygon.objId = that.objId;
					if (that.polyline) that.viewer.entities.remove(that.polyline);
				}
			}
			that.positions.pop();
			that.positions.push(cartesian);

		}, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.handler.setInputAction(function(evt) {
			if (!that.polygon) return;
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polygon]);
			that.state = 1;
			that.handler.destroy();
			if (that.floatPoint) {
				if (that.floatPoint) that.floatPoint.show = false;
				that.floatPoint = null;
			}
			that.positions.pop();
			that.positions.push(cartesian);
			var point = that.createPoint(cartesian);
			point.wz = that.gonPointArr.length;
			that.gonPointArr.push(point);
			// if (that.prompt) {
			// 	that.prompt.destroy();
			// 	that.prompt = null;
			// }
			callBack(that.polygon);
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
			var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polygon, that.modifyPoint]);
			if (cartesian) {
				that.modifyPoint.position.setValue(cartesian);
				that.positions[that.modifyPoint.wz] = cartesian;
				//that.modifyPrompt.updatePrompt(evt.endPosition, "鼠标拖动修改");
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
	createPolygon: function() {
		var that = this;
		var fill = false;
		if(this.style.fill === 'on' || this.style.fill === true){
			fill = true;
		}else {
			fill = false;
		}
		return this.viewer.entities.add({
			polygon: {
				hierarchy: new that.Cesium.CallbackProperty(function() {
					return {positions: that.positions}
					// return that.positions
				}, false),
				clampToGround: this.style.clampToGround == undefined ? true : false,
				show: true,
				fill: fill,
				material: this.style.material ? this.style.material.indexOf('#') === 0 ?  that.Cesium.Color.fromCssColorString(this.style.material).withAlpha(0.5) : this.style.material : this.Cesium.Color.fromCssColorString("#ffffff"),
				outlineColor: this.style.outlineColor ? this.style.outlineColor.indexOf("#") === 0 ? that.Cesium.Color.fromCssColorString(this.style.outlineColor): this.style.outlineColor :  that.Cesium.Color.BLACK,
				outlineWidth: this.style.outlineWidth || 1,
				outline: this.style.outline || true
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
	}
}
