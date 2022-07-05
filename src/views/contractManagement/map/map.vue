<template>
  <div class="map">
    <div id="l_map"></div>
    <ul class="btn-box">
      <li @click="startDraw">
        <el-tooltip class="item" effect="dark" content="绘制电子围栏" placement="left-start">
          <img src="../../../assets/mapbtn/line.png"/>
        </el-tooltip>
      </li>
      <li @click="reViewSite">
        <el-tooltip class="item" effect="dark" content="复位" placement="left-start">
          <img src="../../../assets/mapbtn/site.png"/>
        </el-tooltip>
      </li>
      <li @click="clearFeature">
        <el-tooltip class="item" effect="dark" content="清除" placement="left-start">
          <img src="../../../assets/mapbtn/clear.png"/>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
  let map;
  let L = window.L;
  let featureGroup;
  let workDraw = null;
  let key = ["49ea1deec0ffd88ef13a3f69987e9a63"];
  export default {
    props: ["siteStr", "centerPointer", "name"],
    watch: {},
    data() {
      return {};
    },
    created() {
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        let that = this;
        L.zlskmap.createMap({
          id: "l_map",
          crs: "EPSG:4326",
          data: {
            zoom: 14,
            center: {
              x: 120.1095329338229,
              y: 29.706018768457866
            },
            basemaps: [
            ]
          },
          success: function (i) {
            map = i;
            L.zlskmap.layer.createLayer({
              type: "www_tdt",
              layer: "vec",
              key: key,
              crs: "EPSG4326",
            }).addTo(map);
            that.initDrawer();
            that.addLine();
            that.addMarker();
          }
        });

      },
      initDrawer() {
        let that = this;
        workDraw = new L.zlskmap.Draw({
          map: map,
          hasDel: false,
          isOnly: true,
          onCreate: function (e) {
            if (e.layer._latlngs[0].length < 4) {
              that.$message({
                type: "warning",
                message: "请重新绘制。注意:至少绘制三个点",
                customClass: "message_override"
              });
              workDraw.clearDraw();
              workDraw.stopDraw();
              this.$emit("clearStr");
            } else {
              workDraw.stopDraw();
              that.disposeStr(e.layer._latlngs[0]);
            }

          },
          onChange: function (e) {
            that.disposeStr(e.layer._latlngs[0]);
          }
        });
        workDraw.hasEdit(true);

      },
      startDraw() {
        this.$emit("clearStr");
        featureGroup && featureGroup.remove();
        workDraw && workDraw.clearDraw();
        workDraw.startDraw("polygon", {
          style: {
            color: "#3388ff",
            weight: 3,
            opacity: 1,
            dashArray: ""
          }
        });
      },
      reViewSite() {
        if (map) {
          map.setView([29.706018768457866, 120.1095329338229], 14);
        }
      },
      clearFeature() {
        this.$emit("clearStr");
        featureGroup && featureGroup.remove();
        workDraw && workDraw.clearDraw();
        workDraw && workDraw.stopDraw();
      },
      disposeStr(arr) {
        if (arr && arr.length > 0) {
          let str = arr.map(item => {
            return [item.lat, item.lng];
          });
          let start = str[0];
          str.push(start);
          this.$emit("setStr", JSON.stringify(str));
        }
      },
      addLine() {
        featureGroup && featureGroup.remove();
        featureGroup = L.featureGroup().addTo(map);
        if (this.siteStr) {
          let str = JSON.parse(this.siteStr);
          let marker = L.polyline(str, {
            weight: 2,
            dashArray: "5,10",
            color: "#448BFB",
            opacity: 0.8
          });
          map.fitBounds(marker.getBounds());
          featureGroup.addLayer(marker);

        }
      },
      addMarker() {
        if (this.centerPointer) {
          let point = JSON.parse(this.centerPointer);
          let image = require("@/assets/marker/定位.png");
          let marker = L.marker(point, {
            icon: L.icon({
              iconUrl: image,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              tooltipAnchor: [0, -15]
            })
          });
          let len = this.name.replace(/[\u0391-\uFFE5]/g, "aa").length;
          let fontsize = 14;
          let width = len * fontsize / 2;
          let marker1 = L.marker(point, {
            icon: L.divIcon({
              iconSize: [width, fontsize],
              iconAnchor: [width / 2, -fontsize/1.2],
              className: "leaflet-text-marker",
              html: this.name
            })
          });
          featureGroup.addLayer(marker);
          featureGroup.addLayer(marker1);

        }

      }
    },
    components: {},
    destroyed() {
    }

  };
</script>

<style lang='scss' scoped>
  .map {
    height: 100%;
    position: relative;

    #l_map {
      height: 100%;
    }

    .btn-box {
      position: absolute;
      left: 10px;
      top: 10px;
      display: flex;
      flex-direction: column;
      z-index: 100000001;
      pointer-events: auto;

      li {
        cursor: pointer;
        height: 38px;
        width: 38px;
        background: url("../../../assets/mapbtn/li_bg.png");
        background-size: 100% 100%;
        margin-bottom: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

</style>
