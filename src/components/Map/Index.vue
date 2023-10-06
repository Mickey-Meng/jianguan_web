<template>
  <div class="wrapper">
    <div id="earth" />
    <div v-if="haveLeft" class="menu-btn">
      <el-tooltip
        class="svg-item"
        popper-class="tooltio-panel"
        :enterable="false"
        effect="dark"
        :content="showMenu ? '隐藏菜单' : '显示菜单'"
        placement="top"
      >
        <svg-icon
          icon-class="menu"
          style="color: #ffffff; width: 30px; height: 30px; cursor: pointer"
          @click="showHideMenu"
        />
      </el-tooltip>
    </div>
    <div v-if="haveLeft" class="handle-box">
      <mapTool ref="mapTool" :offsetToRight="offsetToRight" v-if="isShow && haveLeft" />
    </div>
    <div class="mapCoordinate" v-show="mapCoordinate.longitude">
      <div class="longitude">经度:{{ mapCoordinate.longitude }}</div>
      <div class="latitude">纬度:{{ mapCoordinate.latitude }}</div>
      <div class="height">高度:{{ mapCoordinate.height }} 千米</div>
      <div class="pitch">俯仰:{{ mapCoordinate.pitch }} 度</div>
    </div>
  </div>
</template>

<script>
import { earth } from "@/config/map";
import Bus from "@/assets/eventBus";
import { mapGetters } from "vuex";
import { getMap } from "@/api/user";
import mapTool from "@/components/tool/index";
import { getToken } from "@/utils/auth";
let zeh, em;
const Cesium = window.Cesium;
const earthCtx = {};

export default {
  components: {mapTool},
  props: {
    offsetToRight: {
      type: Boolean,
      default: false,
    }
  }, 
  data() {
    return {
      showMenu: true,
      haveLeft: true,
      isShow: true,

      mapCoordinate: {
        longitude: "",
        latitude: "",
        height: "",
        pitch: "",
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo", "project"]),
  },
  watch: {
    $route(n, o) {
      this.checkRoute();
      // if (n.meta.allMap) {
      //   if (this.markerId.length > 0) {
      //     this.markerId.forEach((item) => {
      //       zeh.updatePopup(item, { visible: true });
      //     });
      //   }
      // } else {
      //   if (this.markerId.length > 0) {
      //     this.markerId.forEach((item) => {
      //       zeh.updatePopup(item, { visible: false });
      //     });
      //   }
      // }
    },
  },
  created() {
    this.checkRoute();
  },
  mounted() {
    getMap(
      getToken("explorerId"),
      getToken("GROUPID"),
      getToken("explorerRoles")
    ).then((res) => {
      let obj = JSON.parse(JSON.stringify(earth))
      obj.layers = res.data.getMe;
      // zeh =
      //   window.zeh =
      //   earthCtx.zlskEarthHelper =
      //     new ZlskEarthHelper("earth", obj);
      const url = this.project.mapUrl || window.location.href;
      // const URL = `http://112.30.143.209:26666/data_zlsk/chizhoushi`;
      // console.log(URL)
      window.viewer = new Cesium.Viewer("earth", {
        // imageryProvider: new Cesium.TileMapServiceImageryProvider({
        //     url: url,
        //     format: 'image/png',
        // }),
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
            url: url,
            format: 'image/png',
        }),
        infoBox: false,
        skyBox: false,
        // globe: false,
        skyAtmosphere: false,
        selectionIndicator: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        animation: false,
        navigationHelpButton: false,
        timeline: false,
        msaaSamples: 8,
        fullscreenButton: false,
        contextOptions: {
            webgl: {
                alpha: true,
                preserveDrawingBuffer: true // 保存截图需要使用此选项
            }
        }
      });
      viewer.scene.msaaSamples = 8;
      viewer.scene.globe.depthTestAgainstTerrain = true
      viewer._cesiumWidget._creditContainer.style.display = "none";

      const options = {};
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      // options.defaultResetView = Rectangle.fromDegrees(80, 22, 130, 50)
      // options.defaultResetView = new Cartographic(CesiumMath.toRadians(111.50623801848565), CesiumMath.toRadians(2.8997206760441205), 8213979.400955964)
      // //相机方向
      // options.orientation = {
      //     heading: CesiumMath.toRadians(350.94452087411315),
      //     pitch: CesiumMath.toRadians(-66.6402342251215),
      //     roll: CesiumMath.toRadians(360)
      // }
      //相机延时
      options.duration = 4//默认为3s

      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass= true;
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls= true;
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend= true;
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing= true;

      //修改重置视图的tooltip
      options.resetTooltip = "重置视图";
      //修改放大按钮的tooltip
      options.zoomInTooltip = "放大";
      //修改缩小按钮的tooltip
      options.zoomOutTooltip = "缩小";
      new CesiumNavigation(viewer, options);

      viewer.getLayerByName = function(layername) {
        const length = viewer.scene.primitives.length;
        for (let i = 0; i < length; i++) {
          const layer = viewer.scene.primitives.get(i);
          if (layer.name == layername) {
            return layer
          }
        }
      }

      window.viewer.scene.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(
        400.0,
        0.0,
        800.0,
        1.0
      );

    //   lon: 117.48387645025284,
    // lat: 30.66751823064398,
    // height: 5000,
    // // lon: 120.10326899646911,
    // // lat: 29.638086861129057,
    // // height: 50,
    // heading: 0,
    // pitch: -90,
    // roll: 0,
    // duration: 3
    const point = this.project.projectpoint && this.project.projectpoint.split(",") || [];

    viewer.camera.flyTo({
      destination : Cesium.Cartesian3.fromDegrees(point[1] || 117.48387645025284, point[0] || 30.66751823064398,5000),
      orientation :{
        heading : 0,
        pitch : Cesium.Math.toRadians(-90.0),
        roll : 0.0
      }
    })


      if (this.project.projectline) {
        const terrainLayer = new Cesium.CesiumTerrainProvider({
            url: this.project.projectline,
        });
        viewer.terrainProvider = terrainLayer;
      }
        // 添加白模
      let modelUrls = this.project.coordinate;
      if (modelUrls) {
        modelUrls = JSON.parse(modelUrls);
        // modelUrls = [{"layername":"次坞大桥桩基","url":"http://localhost:8081/model_CW_Z/tileset.json"}]
        modelUrls = modelUrls.reverse();
        modelUrls.forEach(item => {
          const tilesetModel = new Cesium.Cesium3DTileset({
            url: item.url
          });
          const tileset = viewer.scene.primitives.add(tilesetModel);

          tileset.readyPromise
          .then(function (tileset) {
            tileset.name = item.layername;

            var offset = Cesium.Cartesian3.fromDegrees(point[1] || 117.48387645025284, point[0] || 30.66751823064398,0.6287461962958634)
            
            // tileset._root.transform = Cesium.Transforms.eastNorthUpToFixedFrame(offset)
            // viewer.flyTo(tileset)
            // console.log(viewer.getLayerByName("次坞大桥桩基"))
          })
        })
      }

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      
      let pickedFeature;
      handler.setInputAction(function (movement) {
          var _pickedFeature = viewer.scene.pick(movement.position);

          if (_pickedFeature instanceof Cesium.Cesium3DTileFeature) {
            if (pickedFeature) {
              pickedFeature.color = Cesium.Color.WHITE
              pickedFeature = undefined;
            };
            _pickedFeature.color = Cesium.Color.GREEN;
            pickedFeature = _pickedFeature

            if (viewer.attributeQueryCallback) viewer.attributeQueryCallback(_pickedFeature.getProperty("name"))
          } else {
            if (pickedFeature) pickedFeature.color = Cesium.Color.WHITE
          }
          
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      // em = zeh.earth.createMarkerManager({ clusterType: "dilute" });
      // em.beginCluster();
      // earthCtx.earth = earthCtx.zlskEarth = zeh.earth;
      // earthCtx.viewer = zeh.viewer;
      // earthCtx.zlshEarthHelper = zeh;
      // earthCtx.viewer.scene.globe.showSkirts = true;
      // earthCtx.viewer.scene.globe.depthTestAgainstTerrain = true; // 應針對地形表面對廣告牌，折線，標籤等圖元進行深度測試
      // earthCtx.viewer.scene.screenSpaceCameraController.minimumZoomDistance =
      //   -4;
      // earthCtx.viewer.scene.screenSpaceCameraController.maximumZoomDistance =
      //   40000 * 1000;
      // earthCtx.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      //   Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      // );
      // earthCtx.viewer.scene.skyBox.show = false; // 隐藏天空盒
      // earthCtx.viewer.scene.backgroundColor = new Cesium.Color(
      //   0.0,
      //   0.0,
      //   0.0,
      //   0.0
      // ); // 设置背景透明
      // earthCtx.viewer.scene.skyAtmosphere.show = false; // 隐藏大气圈
      // earthCtx.viewer.scene.sun.show = false; // 隐藏太阳
      // earthCtx.viewer.scene.moon.show = false; // 隐藏月亮
      // zeh.viewer.extend(Cesium.viewerCesiumNavigationMixin, {
      //   enableCompass: true,
      //   enableZoomControls: true,
      //   enableDistanceLegend: true,
      //   enableCompassOuterRing: true,
      // });
      let a = document.getElementsByClassName("compass")[0];
      let b = document.getElementsByClassName("compass-outer-ring")[0];
      a && a.setAttribute("title", "");
      b && b.setAttribute("title", "");
      this.initHandler(); //实时监听更换左下经纬度等信息
      Bus.$emit("mapSucceed");
    });
  },
  methods: {
    checkRoute() {
      this.haveLeft = this.$route.meta.left;
    },

    endPick() {
      zeh.exitPickPosition();
    },
    stopDraw() {
      zeh.drawTool.stop();
      zeh.drawTool.clear();
    },
    existMouseAct() {
      this.endPick();
      this.stopDraw();
    },
    showHideMenu() {
      this.isShow = !this.isShow;
    },
    stopF5Refresh() {
      document.onkeydown = function (e) {
        var evt = window.event || e;
        var code = evt.keyCode || evt.which;
        // 屏蔽F1---F12
        if (code > 111 && code < 124) {
          if (evt.preventDefault) {
            evt.preventDefault();
          } else {
            evt.keyCode = 0;
            evt.returnValue = false;
          }
        }
      };
      // 禁止鼠标右键菜单
      document.oncontextmenu = function (e) {
        return false;
      };
      // 阻止后退的所有动作，包括 键盘、鼠标手势等产生的后退动作。
      history.pushState(null, null, window.location.href);
      window.addEventListener("popstate", function () {
        history.pushState(null, null, window.location.href);
      });
    },
    initHandler() {
      let that = this;
      viewer.camera.changed.addEventListener(function () {
        that.getScreenCenter();
      });

      let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function () {
        that.getScreenCenter();
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    },
    getScreenCenter() {
      try {
        let position = {
          x: viewer.canvas.clientWidth / 2,
          y: viewer.canvas.clientHeight / 2,
        };
        var screen = new Cesium.Cartesian2(position.x, position.y);
        var world = viewer.scene.globe.pick(
          viewer.camera.getPickRay(screen),
          viewer.scene
        );
        var cartographic =
          viewer.scene.globe.ellipsoid.cartesianToCartographic(world);
        let scene = viewer.scene;
        let ellipsoid = scene.globe.ellipsoid;
        let currentHeight = ellipsoid.cartesianToCartographic(
          viewer.camera.position
        ).height;
        currentHeight = (currentHeight / 1000).toFixed(2);
        let pitch = Cesium.Math.toDegrees(viewer.camera.pitch);
        let heading = Cesium.Math.toDegrees(viewer.camera.heading);
        let roll = Cesium.Math.toDegrees(viewer.camera.roll);
        this.mapCoordinate = {
          longitude: Cesium.Math.toDegrees(cartographic.longitude).toFixed(6),
          latitude: Cesium.Math.toDegrees(cartographic.latitude).toFixed(6),
          height: currentHeight,
          pitch: pitch.toFixed(0),
        };
      } catch (e) {
        return null;
      }
    },

    // 工具条点击事件
  },
  // components: { mapTool },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  // pointer-events: none;

  .menu-btn {
    position: absolute;
    left: 10px;
    top: 5px;
    z-index: 100;
  }
  .handle-box {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    pointer-events: none;
    // position: absolute;
    // left: 40px;
    // top: 0;
    // z-index: 100;
    // display: flex;
    // padding: 5px;
  }
}
::v-deep#earth {
  width: 100%;
  height: 100%;
  .popup,
  .sfm-m-popup {
    z-index: 2000 !important;
    background-color: rgba(11, 46, 113, 0.8);
    .sfm-m-popup-anchor {
      border-top-color: rgba(11, 46, 113, 0.8);
    }
  }
  .overlayer_item {
    .overlayer_header {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 100%;
      background: linear-gradient(
        90deg,
        rgba(59, 255, 237, 0.4) 0%,
        rgba(75, 182, 252, 0.05) 100%
      );
      text-align: center;
      margin-bottom: 5px;
    }
    .overlayer_content {
      margin-left: 10px;
      .content_info {
        margin: 5px 0;
        .process {
          color: aqua;
          display: inline-block;
          margin:0 5px;
        }
      }
    }
  }
}
::v-deep .distance-legend {
  left: 25px;
  bottom: 5px;
  right: unset;
  border: none;
  width: 220px !important;
  background-color: transparent;
  color: #FFFFFF;
}
::v-deep .compass {
  top: unset;
  bottom: 110px;
}
::v-deep .navigation-controls {
  bottom: 30px;
  top: unset;
}
#layer {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 200px;
  height: 90%;
  .tree-panel {
    margin-top: 10px;
    border-radius: 5px;
    height: 80%;
    overflow: auto;
    .el-tree-node__content {
      background-color: transparent;
    }
  }
}

::v-deep
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: transparent;
  &:active {
    background-color: transparent;
  }
}
.mapCoordinate {
  position: absolute;
  bottom: 5px;
  left: 550px;
  display: flex;
  align-items: center;
  background: rgba(57, 61, 73, 0.6);
  z-index: 2001;
  color: #e9e9e9;
  height: 30px;
  padding: 0 5px;
  font-size: 14px;
  > div {
    margin-left: 10px;
  }
}

</style>
<style>
.distance-legend {
  left: 400px !important;
}
</style>
