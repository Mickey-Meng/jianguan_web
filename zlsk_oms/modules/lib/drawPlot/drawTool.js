var DrawTool = function(obj) {
	this.Cesium = obj.Cesium;
	this.viewer = obj.viewer;
	this.hasEdit = obj.hasEdit;
	this.toolArr = [];
	this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.show = obj.show;
}
DrawTool.prototype = {
	startDraw: function(opt) {
		var that = this;
		if (this.hasEdit) {
			this.bindEdit();
		}
		if(opt.type == "model"){
			var model = new CreateModel(this.Cesium,this.viewer,opt.style);
			model.start(function (evt) {
				if (that.hasEdit) model.startModify(opt.modifySuccess);
				if (opt.success) opt.success(evt);
				if (that.show == false) model.setVisible(false);
			});
			this.toolArr.push(model);
		}
		if (opt.type == "polyline") {
			var polyline = new CreatePolyline(this.Cesium,this.viewer, opt.style);
			polyline.start(function(evt) {
				if (that.hasEdit) polyline.startModify(opt.modifySuccess);
				if (opt.success) opt.success(evt);
				if (that.show == false) polyline.setVisible(false);
			});
			this.toolArr.push(polyline);
		}
		if (opt.type == "polygon") {
			var polygon = new CreatePolygon(this.Cesium,this.viewer, opt.style);
			polygon.start(function() {
				if (that.hasEdit) polygon.startModify();
				if (opt.success) opt.success(polygon);
				if (that.show == false) polygon.setVisible(false);
			}); //绘制完成之后的回调
			this.toolArr.push(polygon);
		}
		// 		if (opt.type == "singleline") {
		// 			var singleline = new CreateSingleline(this.viewer, opt.style);
		// 			singleline.start(opt.success); //绘制完成之后的回调
		// 			this.toolArr.push(singleline);
		// 		}
		if (opt.type == "billboard") {
			var billboard = new CreateBillboard(this.Cesium, this.viewer, opt.style);
			billboard.start(function() {
				if (that.hasEdit) billboard.startModify();
				if (opt.success) opt.success(billboard);
				if (that.show == false) billboard.setVisible(false);
			});
			this.toolArr.push(billboard);
		}
		if (opt.type == "point") {
			var point = new CreatePoint(this.Cesium, this.viewer, opt.style);
			point.start(function() {
				if (that.hasEdit) point.startModify();
				if (opt.success) opt.success(point);
				if (that.show == false) point.setVisible(false);
			});
			this.toolArr.push(point);
		}
		if (opt.type == "rectangle") {
			var rectangle = new CreateRectangle(this.Cesium, this.viewer, opt.style);
			rectangle.start(function() {
				if (that.hasEdit) rectangle.startModify();
				if (opt.success) opt.success(rectangle);
				if (that.show == false) rectangle.setVisible(false);
			});
			this.toolArr.push(rectangle);
		}
		if (opt.type == "circle") {
			var circle = new CreateCircle(this.Cesium, this.viewer, opt.style);
			circle.start(function() {
				if (that.hasEdit) circle.startModify();
				if (opt.success) opt.success(circle);
				if (that.show == false) circle.setVisible(false);
			});
			this.toolArr.push(circle);
		}
		if (opt.type == "label") {
			var label = new CreateLabel(this.Cesium, this.viewer, opt.style);
			label.start(function() {
				if (that.hasEdit) label.startModify();
				if (opt.success) opt.success(label);
				if (that.show == false) label.setVisible(false);
			});
			this.toolArr.push(label);
		}
		if (opt.type == "corridor") {
			var corridor = new CreateCorridor(this.Cesium, this.viewer, opt.style);
			corridor.start(function() {
				if (that.hasEdit) corridor.startModify();
				if (opt.success) opt.success(corridor);
				if (that.show == false) corridor.setVisible(false);
			});
			this.toolArr.push(corridor);
		}
		if (opt.type == "cylinder") {
			var cylinder = new CreateCylinder(this.Cesium, this.viewer, opt.style);
			cylinder.start(function() {
				if (that.hasEdit) cylinder.startModify();
				if (opt.success) opt.success(cylinder);
				if (that.show == false) cylinder.setVisible(false);
			});
			this.toolArr.push(cylinder);
		}
		if (opt.type == "imgRectangle") { //图片矩形
			var imgRectangle = new CreateImgRectangle(this.Cesium, this.viewer, opt.style);
			imgRectangle.start(function() {
				if (that.hasEdit) imgRectangle.startModify();
				if (opt.success) opt.success(imgRectangle);
				if (that.show == false) imgRectangle.setVisible(false);
			});
			this.toolArr.push(imgRectangle);
		}
		//重写材质
		if (opt.type == "flowPolyline") {
			var style = opt.style;
			var polyline = new CreatePolyline(this.viewer, opt.style);
			polyline.start(function() {
				if (that.hasEdit) polyline.startModify();
				if (opt.success) opt.success(polyline);
			});
			this.toolArr.push(polyline);
		}

	},
	drawByPositions: function(opt) {
		if (this.hasEdit) {
			this.bindEdit();
		}
		if (!opt) opt = {};
		if (opt.type == "polyline") {
			var polyline = new CreatePolyline(this.viewer, opt.style);
			polyline.createByPositions(opt.positions, opt.success);
			this.toolArr.push(polyline);
		}
		if (opt.type == "polygon") {
			var polygon = new CreatePolygon(this.viewer, opt.style);
			polygon.createByPositions(opt.positions, opt.success);
			this.toolArr.push(polygon);
		}
		if (opt.type == "point") {
			var point = new CreatePoint(this.Cesium, this.viewer, opt.style,opt.objId);
			point.createByPositions(opt.positions, opt.success);
			this.toolArr.push(point);
			// this.toolArray[point.objId] = point;
		}
	},
	destroy: function() {
		for (var i = 0; i < this.toolArr.length; i++) {
			var obj = this.toolArr[i];
			obj.destroy();
		}
	},
	lastSelectEntity: null,
	bindEdit: function() {
		var $this = this;
		this.handler.setInputAction(function(evt) { //单机开始绘制
			var pick = $this.viewer.scene.pick(evt.position);
			if ($this.Cesium.defined(pick) && pick.id) {
				for (var i = 0; i < $this.toolArr.length; i++) {
					if (pick.id.objId == $this.toolArr[i].objId && $this.toolArr[i].state == 1) {
						$this.lastSelectEntity = $this.toolArr[i];
						$this.toolArr[i].startModify();
						break;
					}
				}
			}
		}, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
	}
}
