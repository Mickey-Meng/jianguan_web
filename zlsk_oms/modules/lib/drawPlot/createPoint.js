var CreatePoint = function(Cesium,viewer, style) {
	this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
	this.Cesium = Cesium;
	this.viewer = viewer;
	this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.state = 0; //1为新增 2为编辑 0为清除
	this.style = style;
	this.point = null;
	// this.prompt = new MovePrompt({
	// 	viewer: viewer
	// });
	// this.modifyPrompt = new MovePrompt({
	// 	viewer: viewer
	// });
}
CreatePoint.prototype = {
	start: function(callBack) {
		var that = this;
		this.handler.setInputAction(function(evt) { //单机开始绘制
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer);
			that.point = that.createPoint(cartesian);
			that.state = 1;
			that.handler.destroy();
			// if (that.prompt) {
			// 	that.prompt.destroy();
			// 	that.prompt = null;
			// }
			if (callBack) callBack(that.point);
		}, that.Cesium.ScreenSpaceEventType.LEFT_CLICK);
		this.handler.setInputAction(function(evt) { //单机开始绘制
			// that.prompt.updatePrompt(evt.endPosition, "单击新增");
		}, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	},
	createByPositions: function(lnglatArr, callBack) { //通过传入坐标数组创建面
		if (!lnglatArr) return;
		var position = this.Cesium.Cartesian3.fromDegrees(lnglatArr[0], lnglatArr[1]);
		if (!position) return;
		this.point = this.createPoint(position);
		callBack(this.point);
		this.state = 1;
	},
	openModify: false,
	startModify: function() {
		if (this.state != 2 && this.state != 1) return; //表示还没绘制完成
		if (!this.modifyHandler) this.modifyHandler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
		var that = this;
		this.modifyHandler.setInputAction(function(evt) {

			var pick = that.viewer.scene.pick(evt.position);
			if (that.Cesium.defined(pick) && pick.id) {
				if (!pick.id.objId)
					that.forbidDrawWorld(true);
					that.openModify = true;
					// that.state = 2;
			} else {
				//if(that.modifyPrompt) that.modifyPrompt.destroy();
			}

		}, that.Cesium.ScreenSpaceEventType.LEFT_DOWN);
		this.modifyHandler.setInputAction(function(evt) { //移动时绘制线
			if (!that.point || !that.openModify) return;
			var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer);
			if (that.point) {
				//that.modifyPrompt.updatePrompt(evt.endPosition, "鼠标拖动修改");
				that.point.position.setValue(cartesian);
			}
		}, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);

		this.modifyHandler.setInputAction(function(evt) { //移动时绘制线
			if (!that.point || !that.openModify) return;
			that.openModify = false;
			that.forbidDrawWorld(false);
			if (that.modifyHandler) {
				that.modifyHandler.destroy();
				that.modifyHandler = null;
			}
		}, that.Cesium.ScreenSpaceEventType.LEFT_UP);
	},
	createPoint: function(cartesian) {
		if (!cartesian) return;
		var point = this.viewer.entities.add({
			position: cartesian,
			point: {
				pixelSize:this.style.pixelSize || 10,
				color: this.style.color ? this.style.color.indexOf('#') === 0 ?  this.Cesium.Color.fromCssColorString(this.style.color) : this.style.color : this.Cesium.Color.fromCssColorString("#3388ff"),
				outlineColor:this.style.outlineColor ? this.style.outlineColor.indexOf('#') === 0 ?  this.Cesium.Color.fromCssColorString(this.style.outlineColor) : this.style.color : this.Cesium.Color.fromCssColorString("#ffffff"),
				outlineWidth:this.style.outlineWidth || 2,
				heightReference: this.style.heightReference || this.Cesium.HeightReference.NONE
			}
		})
		point.objId = this.objId;
		return point;
	},
	getPositions: function() {
		return this.point.position;
	},
	setStyle: function(obj) {},
	remove: function() {
		if (this.point) {
			this.state = 0;
			this.viewer.entities.remove(this.point);
			this.point = null;
		}
	},
	setVisible: function(vis) {
		this.point.show = vis;
	},
	forbidDrawWorld: function(isForbid) {
		this.viewer.scene.screenSpaceCameraController.enableRotate = !isForbid;
		this.viewer.scene.screenSpaceCameraController.enableTilt = !isForbid;
		this.viewer.scene.screenSpaceCameraController.enableTranslate = !isForbid;
		this.viewer.scene.screenSpaceCameraController.enableInputs = !isForbid;
	},
	destroy: function() {
		this.openModify = false;
		if (this.handler) {
			this.handler.destroy();
			this.handler = null;
		}
		if (this.modifyHandler) {
			this.modifyHandler.destroy();
			this.modifyHandler = null;
		}
		if (this.point) {
			this.viewer.entities.remove(this.point);
			this.point = null;
		}
		this.style = null;
		// if (this.prompt) {
		// 	that.prompt.destroy();
		// 	this.prompt = null;
		// }
		//if (this.modifyPrompt) this.modifyPrompt.destroy();
	},
	getCatesian3FromPX: function(px, viewer, entitys) {
		viewer.scene.globe.depthTestAgainstTerrain = true;
		var picks = viewer.scene.drillPick(px); //不能和viewer.scene.pickPosition公用 会导致pickPosition获取的是地形高度
		var cartesian;
		var isOn3dtiles = false;
		for (var i = 0; i < picks.length; i++) {
			if ((picks[i] && picks[i].primitive) || picks[i] instanceof this.Cesium.Cesium3DTileFeature) { //模型上拾取
				isOn3dtiles = true;
			}
		}
		if (isOn3dtiles) {
			cartesian = viewer.scene.pickPosition(px);
		} else {
			var ray = viewer.camera.getPickRay(px);
			if (!ray) return null;
			cartesian = viewer.scene.globe.pick(ray, viewer.scene);
		}
		// return viewer.scene.pickPosition(px);
		return cartesian;
	}
}
