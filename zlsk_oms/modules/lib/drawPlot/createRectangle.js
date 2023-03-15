var CreateRectangle = function(Cesium,viewer, style) {
	this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
	this.Cesium = Cesium;
	this.viewer = viewer;
	this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.state = 0; //1为新增 2为编辑 0为清除
	this.style = style;
	this.rectangle = null;
	this.coordinates = null;
	this.points = [];
	this.positions = [];
	this.gonPointArr = [];
	this.modifyPoint = null;
	// this.prompt = new MovePrompt({
	// 	viewer: viewer
	// });
	// this.modifyPrompt = new MovePrompt({
	// 	viewer: viewer
	// });
}
CreateRectangle.prototype = {
	start: function(callBack) {
		var that = this;
		this.handler.setInputAction(function(evt) { //单机开始绘制
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer,[that.rectangle]);
			if (that.points.length == 0) {
				that.points.push(that.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian));
				that.coordinates = that.Cesium.Rectangle.fromCartographicArray(that.points);
				that.coordinates.east+=0.000001;
				that.coordinates.north+=0.000001;

				that.rectangle = that.createRectangle();
			}

			that.positions.push(cartesian);
			var point = that.createPoint(cartesian);
			point.wz = that.gonPointArr.length;
			that.gonPointArr.push(point);

			// if (callBack) callBack(that.rectangle);
		}, that.Cesium.ScreenSpaceEventType.LEFT_CLICK);
		this.handler.setInputAction(function(evt) { //单机开始绘制
			// that.prompt.updatePrompt(evt.endPosition, "单击新增");
			if(that.points.length==0){
				return;
			}
			var moveEndPosition = that.getCatesian3FromPX(evt.endPosition, that.viewer,[that.rectangle]);
			//选择的点在球面上
			if(moveEndPosition){
				// pointsArr[1] = moveEndPosition;
				that.points[1]=that.viewer.scene.globe.ellipsoid.cartesianToCartographic(moveEndPosition);
				that.coordinates= that.Cesium.Rectangle.fromCartographicArray(that.points);
				if(that.coordinates.west==that.coordinates.east)
				that.coordinates.east+=0.000001;
				if(that.coordinates.south==that.coordinates.north)
				that.coordinates.north+=0.000001;
				// console.log(that.coordinates);
				// that.rectangle.rectangle.coordinates = that.coordinates;
			}
		}, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.handler.setInputAction(function(evt) {
			if (!that.rectangle) return;
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.rectangle]);
			that.state = 1;
			that.handler.destroy();

			// var point = that.createPoint(cartesian);
			// point.wz = that.gonPointArr.length;
			// that.gonPointArr.push(point);

			callBack(that.rectangle);
		}, that.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	},
	createByPositions: function(lnglatArr, callBack) { //通过传入坐标数组创建面
		if (!lnglatArr) return;
		var position = this.Cesium.Cartesian3.fromDegrees(lnglatArr[0], lnglatArr[1]);
		if (!position) return;
		this.rectangle = this.createRectangle(position);
		callBack(this.rectangle);
		this.state = 1;
	},
	openModify: false,
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
			var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.rectangle, that.modifyPoint]);
			if (cartesian) {

				that.modifyPoint.position.setValue(cartesian);
				that.positions[that.modifyPoint.wz] = cartesian;
				// pointsArr[1] = moveEndPosition;
				that.points[that.modifyPoint.wz]=that.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
				that.coordinates= that.Cesium.Rectangle.fromCartographicArray(that.points);
				if(that.coordinates.west==that.coordinates.east)
				that.coordinates.east+=0.000001;
				if(that.coordinates.south==that.coordinates.north)
				that.coordinates.north+=0.000001;
				// that.rectangle.rectangle.coordinates = that.coordinates;

				//that.modifyPrompt.updatePrompt(evt.endPosition, "鼠标拖动修改");
			}
		}, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.modifyHandler.setInputAction(function(evt) {
			that.forbidDrawWorld(false);
			if (!that.modifyPoint) return;
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.rectangle, that.modifyPoint]);
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
	createRectangle: function() {
		if (!this.coordinates) return;
		var that = this;
		var rectangle = this.viewer.entities.add({
			rectangle : {
				// coordinates : coordinates,
				coordinates : new that.Cesium.CallbackProperty(function() {
					return that.coordinates
				}, false),
				material : that.style.material || that.Cesium.Color.fromCssColorString("#3388ff").withAlpha("0.6"),
				// rotation : Cesium.Math.toRadians(45),
				// extrudedHeight : 300000.0,
				height : that.style.height || 10.0,
				outline : that.style.outline || true, // height must be set for outline to display
				outlineColor : that.style.outlineColor || that.Cesium.Color.WHITE
			}
		})
		rectangle.objId = this.objId;
		return rectangle;
	},
	getPositions: function() {
		return this.rectangle.position;
	},
	setStyle: function(obj) {},
	remove: function() {
		if (this.rectangle) {
			this.state = 0;
			this.viewer.entities.remove(this.rectangle);
			this.rectangle = null;
		}
	},
	setVisible: function(vis) {
		this.rectangle.show = vis;
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
		if (this.rectangle) {
			this.viewer.entities.remove(this.rectangle);
			this.rectangle = null;
		}
		this.style = null;
		// if (this.prompt) {
		// 	that.prompt.destroy();
		// 	this.prompt = null;
		// }
		//if (this.modifyPrompt) this.modifyPrompt.destroy();
	},
	getCatesian3FromPX: function(px, viewer, entitys) {
		var cartesian;
		var ray = viewer.camera.getPickRay(px);
		if (!ray) return;
		cartesian = viewer.scene.globe.pick(ray, viewer.scene);
		return cartesian;
	}
}
