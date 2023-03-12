<template>
  <div id="map">

  </div>
</template>

<script>
  import {earth} from "@/config/map";
  import {getProjectsByUser} from "@/api/project";
  import {mapGetters, mapMutations} from "vuex";
  import redline_line from "@/config/redline_line.json";

  const Cesium = window.Cesium;
  // let earth = {};
  let mapCtx = {};
  // let mm, otherMm, roomMm;
  let markerManagement = {};
  let popupManagement = {};
  let that;
  window.clickProject = function (id) {
    that.goSystem(id);
  };
  export default {
    props: {},
    watch: {},
    data() {
      return {
        allProjects: [],
        allPopupId: []
      };
    },
    created() {
      that = this;
      this.initData();
    },
    mounted() {
      this.initMap();
    },
    computed: {
      ...mapGetters(["menus"])
    },
    methods: {
      ...mapMutations("project", ["SET_PROJECT"]),
      initMap() {
        let obj = JSON.parse(JSON.stringify(earth));
        obj.init = {
          lon: 117.46471434258237,
          lat: 30.59982300620444,
          height: 3529.704298839902,
          heading: 16.196112994937916,
          pitch: -29.742000441177492,
          roll: 0.0010975985507093802,
          duration: 3
        };
        obj.layers = [
          {
            name: "午夜蓝图",
            type: "gcj02",
            url: "https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
          },
          {
            name: "诸暨白模",
            type: "C3DTILES",
            url: "http://150.158.139.18:8080/static/data_zlsk/chizhoushi/jianzhu/tileset.json",
            clampToGround: true
          }
        ];
        window.ddd = mapCtx.zlskEarthHelper = new ZlskEarthHelper("map", obj);
        // mm = mapCtx.zlskEarthHelper.earth.createMarkerManager();
        this.addCityLine();
        this.setColour();
        const handler = new Cesium.ScreenSpaceEventHandler(mapCtx.zlskEarthHelper.viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            const camera = mapCtx.zlskEarthHelper.viewer.camera;
            const pitch = Cesium.Math.toDegrees(mapCtx.zlskEarthHelper.viewer.camera.pitch);
            const heading = Cesium.Math.toDegrees(mapCtx.zlskEarthHelper.viewer.camera.heading);
            const roll = Cesium.Math.toDegrees(mapCtx.zlskEarthHelper.viewer.camera.roll);

            
            let scene = mapCtx.zlskEarthHelper.viewer.scene;
            let ellipsoid = scene.globe.ellipsoid;
            const cartographic = mapCtx.zlskEarthHelper.viewer.scene.globe.ellipsoid.cartesianToCartographic(camera.position);

            let currentHeight = ellipsoid.cartesianToCartographic(mapCtx.zlskEarthHelper.viewer.camera.position).height;
            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
            let latitude = Cesium.Math.toDegrees(cartographic.latitude);

            const click_pos = mapCtx.zlskEarthHelper.viewer.scene.pickPosition(movement.position)
            const cartographic_pos = mapCtx.zlskEarthHelper.viewer.scene.globe.ellipsoid.cartesianToCartographic(click_pos);
            let longitude_pos = Cesium.Math.toDegrees(cartographic_pos.longitude);
            let latitude_pos = Cesium.Math.toDegrees(cartographic_pos.latitude);

            console.log({
                destination: Cesium.Cartesian3.clone(camera.position),
                orientation: {
                  direction: Cesium.Cartesian3.clone(camera.direction),
                  up: Cesium.Cartesian3.clone(camera.up),
                },
                longitude_pos,
                latitude_pos,
                latitude,
                longitude,
                height: currentHeight,
                pitch,
                heading,
                roll
            })
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      },
      getMm(type) {
        if (!markerManagement[type]) {
          markerManagement[type] = mapCtx.zlskEarthHelper.earth.createMarkerManager();
          if (type != "交通类") {
            markerManagement[type].visible = false;
          }
        }
        return markerManagement[type];
      },
      getPopup(type) {
        if (!popupManagement[type]) {
          popupManagement[type] = [];
        }
        return popupManagement[type];
      },
      addCityLine() {
        this.$axios.get("./data/池州市_市界.json").then(res => {
          console.log(res);
          let features = res.data.geometries[0].coordinates;
          let Cartesian3 = features.map((item) => {
            return Cesium.Cartesian3.fromDegrees(item[0], item[1], 10);
          });


          let ins = new Cesium.GeometryInstance({
            geometry: new Cesium.GroundPolylineGeometry({
              positions: Cartesian3,
              width: 2
            })
          });
         let linePrimitive = new Cesium.GroundPolylinePrimitive({
            show: true,
            geometryInstances: ins,
            appearance: new Cesium.PolylineMaterialAppearance({
              closed: true,
              material: new Cesium.Material({
                fabric: {
                  type: "Color",
                  uniforms: {
                    color: Cesium.Color.AQUA,
                  },
                },
              }),
            }),
          });
          mapCtx.zlskEarthHelper.viewer.scene.groundPrimitives.add(linePrimitive);


        });
      },
      setColour() {
        let ffectOptions = {
          "type": "lsex",
          "data": {
            "color": [7, 102, 184, 1],
            // "color": [150,153,161, 1],
            "maxHeight": 300,
            "fScanning": 1, //开启扫描
            "cycle1": 100,
            "fGradient": 1,//渐变
            "cycle2": 120,
            "offset": 0.1,
            "intensity1": 2,
            "sc": [101, 99, 99, 1],
            "ec": [254, 254, 254, 1],
            "sp": 0,
            "ep": 1,
            "fStripe": 0,
            "intensity2": 2
          }
        };
        let layer = mapCtx.zlskEarthHelper.layers.getLayerByName("诸暨白模");
        mapCtx.zlskEarthHelper.layers.set3dtilesEffectById(layer.gid, ffectOptions);

      },
      initData() {
        getProjectsByUser().then(res => {
          let data = res.data;
          this.allProjects = data;
          let img = require("@/assets/mapView/施工.png");
          console.log(data);
          data.forEach(item => {
            let {introduction, name, projectpoint, id, projecttype} = item;
            projecttype = projecttype ? projecttype : "其他类";
            if (projectpoint) {
              let mm = this.getMm(projecttype);
              let popup = this.getPopup(projecttype);
              let site = projectpoint.split(",");
              let mmid = mm.add({
                position: [Number(site[1]), Number(site[0]), 20],
                image: img,
                visibleRange: [600, 1e9],
                imageScaleRange: [0, 1, 1e9, 0.5],
                textVisibleRange: [600, 45000],
                // textColor: textColor,
                textOffset: [0, -45],
                textBackground: true, // 可选，默认值: true
                // textBgColor: textBgColor,
                // handleLineColor: [255, 255, 0, 255],
                onClick: function (id, b, c) {
                }
              });
              let html = `<div class='map_view_item'><div class='map_view_item_header'>${name}</div><div class='map_view_item_content'>项目基本简介:${introduction}</div>
                           <div class='map_view_item_footer' onclick="clickProject('${id}')">查看详情></div>
                </div>`;
              const a = mapCtx.zlskEarthHelper.openPopup({
                position: [Number(site[1]), Number(site[0]), 0], // 必须 弹窗位置
                visibleRange: [600, 45000],
                offset: [0, -10], // 可选，弹窗是否偏移
                width: 300, // 可选，默认值: 400
                height: 140, // 可选，默认值: 240
                content: html, // 弹框内容 可选，默认值: ''
                class: "map_view_popup", // 可选，默认值:
                closable: false, // 关闭按钮 可选，默认值: true
                visible: projecttype === "交通类" ? true : false
              });
              popup.push(a);
              this.allPopupId.push(a);
              // mapCtx.zlskEarthHelper.earth.flytoLookat({
              //   longitude: Number(site[1]),
              //   latitude: Number(site[0]),
              //   height: 2000,
              //   pitch: -90,
              //   heading: 0,
              //   range: 0
              // });

            }

          });
        });
      },
      goSystem(id) {
        let obj = this.allProjects.find(e => e.id == id);
        if (obj) {
          this.SET_PROJECT(obj);
          if (this.menus && this.menus.length > 0) {
            let item = this.menus[0];
            if (item.children && item.children.length > 0) {
              let path = item.children[0];
              this.$router.push(path.path);
            }
          }
        }
      },
      changeMarkerVisible(type) {
        if (Object.keys(markerManagement).length > 0) {
          for (let i in markerManagement) {
            markerManagement[i].visible = false;
          }
        }
        if (markerManagement[type]) {
          markerManagement[type].visible = true;
        }
        this.allPopupId.forEach(item => {
          mapCtx.zlskEarthHelper.updatePopup(item, {visible: false});
        });
        if (popupManagement[type]) {
          popupManagement[type].forEach(item => {
            mapCtx.zlskEarthHelper.updatePopup(item, {visible: true});
          });
        }
        console.log(markerManagement);
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  #map {
    width: 100%;
    height: 100%;
  }

</style>

<style lang="scss">
  .map_view_popup {
    background: url("../../../assets/mapView/气泡框.png") no-repeat;
    background-size: 100% 100%;
    border-radius: unset;
    box-shadow: unset;
    z-index: 990;

    .sfm-m-popup-bg {
      padding: 0 16px;

      .sfm-m-popup-content-wrapper {
        .sfm-m-popup-content {
          .map_view_item {
            height: 100%;

            .map_view_item_header {
              height: 48px;
              line-height: 48px;
              font-size: 16px;
              font-family: AlibabaPuHuiTiB;
              color: #FFFFFF;
              background: linear-gradient(180deg, #FFFFFF 45%, #2861F6 70%, #2861F6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              overflow: hidden; // 溢出部分隐藏
              white-space: nowrap; // 文字不换行
              text-overflow: ellipsis; // 显示省略号
            }

            .map_view_item_content {
              height: 60px;
              font-size: 14px;
              font-family: PingFang SC;
              font-weight: 500;
              color: #FFFFFF;
              line-height: 20px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3; // 多行在这里修改数字即可，这里显示2行
              -webkit-box-orient: vertical;
            }

            .map_view_item_footer {
              margin-top: 4px;
              text-align: right;
              font-size: 12px;
              font-family: AlibabaPuHuiTiB;
              color: #FFFFFF;
              background: linear-gradient(180deg, #FFFFFF 45%, #2861F6 80%, #2861F6 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
