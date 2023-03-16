var CreateModel = function(Cesium,viewer, style) {
    this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
    this.Cesium = Cesium;
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.modifyHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.state = 0; //1为新增 2为编辑 0为清除
    this.image = style.image || "../img/mark1.png";
    this.style = style;
    this.model = null;
};
CreateModel.prototype = {
    start: function(callBack) {
        var that = this;
        this.handler.setInputAction(function(evt) { //单机开始绘制
            var cartesian = that.getCatesian3FromPX(evt.position, that.viewer);
            that.model = that.createModel(cartesian);
            that.state = 1;
            that.handler.destroy();
            if (callBack) callBack(that.model);
        }, that.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function(evt) { //单机开始绘制
        }, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    createByPositions: function(lnglatArr, callBack) { //通过传入坐标数组创建面
        if (!lnglatArr) return;
        var position = this.Cesium.Cartesian3.fromDegrees(lnglatArr[0], lnglatArr[1]);
        if (!position) return;
        this.model = this.createModel(position);
        callBack(this.model);
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
                that.forbidDrawWorld(true);
                // that.state = 2;
            } else {
                //if(that.modifyPrompt) that.modifyPrompt.destroy();


            }

        }, that.Cesium.ScreenSpaceEventType.LEFT_DOWN);
        this.modifyHandler.setInputAction(function(evt) { //移动时绘制线
            if (!that.model || !that.openModify) return;
            var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer);
            if (that.model) {
                //that.modifyPrompt.updatePrompt(evt.endPosition, "鼠标拖动修改");
                that.model.position.setValue(cartesian);
            }
        }, that.Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.modifyHandler.setInputAction(function(evt) { //移动时绘制线
            if (!that.model) return;
            that.openModify = false;
            that.forbidDrawWorld(false);
            if (that.modifyHandler) {
                that.modifyHandler.destroy();
                that.modifyHandler = null;
            }
        }, that.Cesium.ScreenSpaceEventType.LEFT_UP);
    },
    createModel: function(cartesian) {
        if (!cartesian) return;
        var modelUrl = this.style.url;
        if(this.style.tempUrl){
            modelUrl = this.style.tempUrl + this.style.url;
        }
        var heading = this.Cesium.Math.toRadians(this.style.heading);
        var pitch = this.style.pitch;
        var roll = this.style.roll;
        var hpr = new this.Cesium.HeadingPitchRoll(heading, pitch, roll);
        var orientation = this.Cesium.Transforms.headingPitchRollQuaternion(cartesian, hpr);
        var model = this.viewer.entities.add({
            position: cartesian,
            orientation : orientation,
            model : {
                scale:this.style.scale,
                uri : modelUrl,
            }
        });
        model.objId = this.objId;
        return model;
    },
    getPositions: function() {
        return this.model.position;
    },
    setStyle: function(obj) {},
    remove: function() {
        if (this.model) {
            this.state = 0;
            this.viewer.entities.remove(this.model);
            this.model = null;
        }
    },
    setVisible: function(vis) {
        this.model.show = vis;
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
        if (this.model) {
            this.viewer.entities.remove(this.model);
            this.model = null;
        }
        this.style = null;
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
