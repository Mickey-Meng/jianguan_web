//绘制线
var CreatePolyline = function (Cesium,viewer, style) {
    this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
    this.Cesium = Cesium;
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.polyline = null;
    this.positions = [];
    this.style = style;
    this.floatPoint = null;  //最后一个点
    this.linePointArr = [];
    this.modifyPoint = null;
    this.state = 0;
    //初始化鼠标提示框
    // this.prompt = new MovePrompt({
    //     viewer: viewer
    // });
	// this.modifyPrompt =  new MovePrompt({
    //     viewer: viewer
    // });
}
CreatePolyline.prototype = {
    start: function (callBack) {
        var that = this;
        this.handler.setInputAction(function (evt) { //单机开始绘制
            var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline]);
            if (that.positions.length == 0) {
                that.positions.push(cartesian.clone());
                that.floatPoint = that.createPoint(cartesian.clone());

            }
            console.log(that.floatPoint);
            var ellipsoid = that.viewer.scene.globe.ellipsoid;
            var lnglat = ellipsoid.cartesianToCartographic(cartesian);
            var lat = that.Cesium.Math.toDegrees(lnglat.latitude);
            var lng = that.Cesium.Math.toDegrees(lnglat.longitude);
            var hei = lnglat.height;
            console.log(lng);
            console.log(lat);
            console.log(hei);

            that.positions.push(cartesian);
            var point = that.createPoint(cartesian);
            point.wz = that.linePointArr.length;
            that.linePointArr.push(point);
        }, that.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制线
            if (that.positions.length < 1) {
                // that.prompt.updatePrompt(evt.endPosition, "单击开始绘制");
                return;
            }
            // that.prompt.updatePrompt(evt.endPosition, "单击新增，右键结束");
            var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polyline]);
            if (that.floatPoint) that.floatPoint.position.setValue(cartesian);
            if (that.positions.length == 2) {
                if (!that.Cesium.defined(that.polyline)) {
                    that.polyline = that.createPolyline();
                }
            }
            if (that.polyline) {
                that.positions.pop();
                that.positions.push(cartesian);
            }
        }, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) { //单机开始绘制
            if (!that.polyline) {
                return;
            }
            var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline]);
            that.state = 1;
            that.handler.destroy();
            if (that.floatPoint) {
                if (that.floatPoint) that.floatPoint.show = false;
                that.floatPoint = null;
            }
            that.positions.pop();
            that.positions.push(cartesian);
            var point = that.createPoint(cartesian);
            point.wz = that.linePointArr.length;
            that.linePointArr.push(point);
            // if(this.prompt){
			// 	that.prompt.destroy();
			// 	this.prompt = null;
			// }
            if (callBack) callBack(that.polyline);
        }, that.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    },
    // createByPositions: function (lnglatArr, callBack) { //通过传入坐标数组创建面
    //     if (!lnglatArr) return;
    //     var positions = cCesium.lnglatArrToCartesianArr(lnglatArr);
    //     if (!positions) return;
    //     this.polyline = this.createPolyline(this.style);
    //     this.positions = positions;
    //     callBack(this.polyline);
    //     for (var i = 0; i < positions.length; i++) {
    //         var point = this.createPoint(positions[i]);
    //         point.wz = this.linePointArr.length;
    //         this.linePointArr.push(point);
    //     }
    //     this.state = 1;
    // },

    startModify: function (callback) {
        if (this.state != 2 && this.state != 1) return; //表示还没绘制完成
        if (!this.modifyHandler) this.modifyHandler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        var that = this;
        for (var i = 0; i < that.linePointArr.length; i++) {
            var point = that.linePointArr[i];
            if (point) point.show = true;
        }
        this.modifyHandler.setInputAction(function (evt) {
			if(!that.polyline) return ;
            var pick = that.viewer.scene.pick(evt.position);
            if (that.Cesium.defined(pick) && pick.id) {
                if (!pick.id.objId)
                    that.modifyPoint = pick.id;
                    that.forbidDrawWorld(true);
            } else {
                for (var i = 0; i < that.linePointArr.length; i++) {
                    var point = that.linePointArr[i];
                    if (point) point.show = false;
                }
                if (that.modifyHandler) {
                    that.modifyHandler.destroy();
                    that.modifyHandler = null;
                    //that.modifyPrompt.destroy();
                    console.log(callback);
                    if(callback) callback(that.polyline);
                }
            }
            // that.state = 2;
        }, that.Cesium.ScreenSpaceEventType.LEFT_DOWN);
        this.modifyHandler.setInputAction(function (evt) {
            if (that.positions.length < 1 || !that.modifyPoint) return;
            //that.modifyPrompt.updatePrompt(evt.endPosition, "鼠标拖动修改");
            var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polyline, that.modifyPoint]);
            if (cartesian) {
                that.modifyPoint.position.setValue(cartesian);
                that.positions[that.modifyPoint.wz] = cartesian;
            }
        }, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.modifyHandler.setInputAction(function (evt) {
            if (!that.modifyPoint) return;
            var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline, that.modifyPoint]);
            that.modifyPoint.position.setValue(cartesian);
            that.positions[that.modifyPoint.wz] = cartesian;
            that.modifyPoint = null;
            that.forbidDrawWorld(false);
        }, that.Cesium.ScreenSpaceEventType.LEFT_UP);
    },
    createPoint: function (position) {
        if (!position) return;
        var that = this;
        return this.viewer.entities.add({
            position: position,
            point: {
                pixelSize: 5,
                color: that.Cesium.Color.YELLOW,
                outlineWidth: 2,
                outlineColor: that.Cesium.Color.DARKRED,
                heightReference: that.Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            show: false
        });
    },
    createPolyline: function () {
        var that = this;
        console.log(that.positions)
        var material = '';
        if(this.style.glow && this.style.glow === 'on'){
            material = new this.Cesium.PolylineGlowMaterialProperty({
                color: this.Cesium.Color.fromCssColorString(this.style.material),
                glowPower: 0.5,
                taperPower: 1
            });
        }else {
            material = this.style.material ? this.style.material.indexOf('#') === 0 ?  this.Cesium.Color.fromCssColorString(this.style.material) : this.style.material : this.Cesium.Color.fromCssColorString("#ffffff");
        }
        var polyline = this.viewer.entities.add({
            polyline: {
                positions: new that.Cesium.CallbackProperty(function () {
                    return that.positions
                }, false),
                show: true,
                material: material,
                width: this.style.width || 3,
                clampToGround: this.style.clampToGround == undefined ? false : true
            }
        });
        polyline.objId = this.objId;
        console.log(this.objId);
        return polyline;
    },
    getPositions: function () {
        return this.positions;
    },
    //获取相关属性
    getAttr: function () {
        if (!this.polyline) return;
        var obj = {};
        var line = this.polyline.polyline;
        obj.width = line.width._value;
        obj.clampToGround = line.clampToGround._value;
        obj.color = line.material.color._value;
        obj.lineType = "solid";
        return obj;
    },
    setStyle: function (obj) {},
    remove: function () {
        if (this.polyline) {
            this.state = 0;
            this.viewer.entities.remove(this.polyline);
            this.polyline = null;
        }
    },
    setVisible: function (vis) {
        this.polyline.show = vis;
    },
    forbidDrawWorld: function (isForbid) {
        this.viewer.scene.screenSpaceCameraController.enableRotate = !isForbid;
        this.viewer.scene.screenSpaceCameraController.enableTilt = !isForbid;
        this.viewer.scene.screenSpaceCameraController.enableTranslate = !isForbid;
        this.viewer.scene.screenSpaceCameraController.enableInputs = !isForbid;
    },
    destroy: function () {
        this.linePointArr = [];

        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
        if (this.modifyHandler) {
            this.modifyHandler.destroy();
            this.modifyHandler = null;
        }
        if (this.polyline) {
            this.viewer.entities.remove(this.polyline);
            this.polyline = null;
        }
        if (this.floatPoint) {
            this.viewer.entities.remove(this.floatPoint);
            this.floatPoint = null;
        }
        this.positions = [];
        this.style = null;
        for (var i = 0; i < this.linePointArr.length; i++) {
            var point = this.linePointArr[i];
            this.viewer.entities.remove(point);
        }
        this.linePointArr = [];
        this.modifyPoint = null;
        // if (this.prompt) this.prompt.destroy();
		//if (this.modifyPrompt) this.modifyPrompt.destroy();
    },
    getCatesian3FromPX2: function (px, viewer, entitys) {
        var pick = viewer.scene.pick(px);
        var cartesian;
        var drillPick = viewer.scene.drillPick(px);
        var truePick = null;
        if (entitys) {
            for (var i = 0; i < drillPick.length; i++) {
                if (drillPick[i].id._id != entitys[0].id && drillPick[i].id._id != entitys[1].id) {
                    truePick = drillPick[i].id;
                    break;
                }
            }
        } else {
            truePick = pick;
        }
        if (viewer.scene.pickPositionSupported && this.Cesium.defined(truePick)) {
            cartesian = viewer.scene.pickPosition(px);
        } else {
            var ray = viewer.camera.getPickRay(px);
            if (!ray) return;
            cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        }
        return cartesian;
    },
    getCatesian3FromPX: function (px, viewer, entitys) {
        viewer.scene.globe.depthTestAgainstTerrain = true
        // console.log(px);
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
        return cartesian;
        // return viewer.scene.pickPosition(px);
    }

}
