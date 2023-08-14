<template>
  <div class="map">
    <div id="l_map"></div>
    <ul class="btn-box">
      <li @click="startDraw">
        <el-tooltip
          class="item"
          effect="dark"
          content="绘制电子围栏"
          placement="left-start"
        >
          <img src="../../../assets/mapbtn/line.png" />
        </el-tooltip>
      </li>
      <li @click="reViewSite">
        <el-tooltip
          class="item"
          effect="dark"
          content="复位"
          placement="left-start"
        >
          <img src="../../../assets/mapbtn/site.png" />
        </el-tooltip>
      </li>
      <li @click="clearFeature">
        <el-tooltip
          class="item"
          effect="dark"
          content="清除"
          placement="left-start"
        >
          <img src="../../../assets/mapbtn/clear.png" />
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
import ol from "openlayers";
import "openlayers/css/ol.css";

let map;
let L = window.L;
let featureGroup;
let workDraw = null;
let source = null;
let key = ["49ea1deec0ffd88ef13a3f69987e9a63"];
export default {
  props: ["siteStr", "centerPointer", "name"],
  watch: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      let that = this;
      // L.zlskmap.createMap({
      //   id: "l_map",
      //   crs: "EPSG:4326",
      //   data: {
      //     zoom: 14,
      //     center: {
      //       x: 120.1095329338229,
      //       y: 29.706018768457866
      //     },
      //     basemaps: [
      //     ]
      //   },
      //   success: function (i) {
      //     map = i;
      //     L.zlskmap.layer.createLayer({
      //       type: "www_tdt",
      //       layer: "vec",
      //       key: key,
      //       crs: "EPSG4326",
      //     }).addTo(map);
      //     that.initDrawer();
      //     that.addLine();
      //     that.addMarker();
      //   }
      // });
      // https://t1.tianditu.gov.cn/cva_c/wmts?Service=WMTS&Request=GetTile&Version=1.0.0&Style=Default&Format=tiles&serviceMode=KVP&layer=cva&TileMatrixSet=c&TileMatrix=11&TileRow=342&TileCol=1708&tk=49ea1deec0ffd88ef13a3f69987e9a63

      var taindiLayer = new ol.layer.Tile({
        title: "天地图",
        source: new ol.source.XYZ({
          url: "http://t4.tianditu.com/DataServer?T=vec_w&tk=49ea1deec0ffd88ef13a3f69987e9a63&x={x}&y={y}&l={z}",
        }),
      });
      var taindiLayer_annotation = new ol.layer.Tile({
        title: "天地图文字标注",
        source: new ol.source.XYZ({
          // url: "https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=49ea1deec0ffd88ef13a3f69987e9a63",
          url: "https://t6.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=91132fd9920e45ec3408d3080d391831"
        }),
      });
      const layers = [taindiLayer, taindiLayer_annotation];
      map = new ol.Map({
        layers: layers,
        target: "l_map",
        view: new ol.View({
          center: ol.proj.fromLonLat([117.46471434258237, 30.63982300620444]),
          zoom: 12,
        }),
      });
      that.initDrawer();
    },
    initDrawer() {
      source = new ol.source.Vector({wrapX: false});
      const vector = new ol.layer.Vector({
        source: source,
      });

      map.addLayer(vector)
    },
    startDraw() {
      this.$emit("clearStr");
      source.clear();
      if (!workDraw) {
        workDraw = new ol.interaction.Draw({
          source: source,
          type: "Polygon",
        });
        workDraw.on('drawend', (data) => {
          this.$emit("clearStr");
          data.feature.getGeometry().transform('EPSG:3857','EPSG:4326'); // 坐标转换
          let extent = data.feature.getGeometry().getExtent();
          // extent = new ol.Extent(extent);
          const centerPoint = ol.extent.getCenter(extent);
          this.$emit("setStr", JSON.stringify(data.feature.getGeometry().getCoordinates()[0]));
          this.$emit("setCenter", JSON.stringify(centerPoint));
        })
        map.addInteraction(workDraw);
      }
    },
    closeDialog() {
      workDraw = undefined;
    },
    reViewSite() {
      if (map) {
        map.setView(new ol.View({center: ol.proj.fromLonLat([117.46471434258237, 30.63982300620444]), zoom: 12}));
      }
    },
    clearFeature() {
      this.$emit("clearStr");
      if (source) source.clear()
    },
    disposeStr(arr) {
      if (arr && arr.length > 0) {
        let str = arr.map((item) => {
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
          opacity: 0.8,
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
            tooltipAnchor: [0, -15],
          }),
        });
        let len = this.name.replace(/[\u0391-\uFFE5]/g, "aa").length;
        let fontsize = 14;
        let width = (len * fontsize) / 2;
        let marker1 = L.marker(point, {
          icon: L.divIcon({
            iconSize: [width, fontsize],
            iconAnchor: [width / 2, -fontsize / 1.2],
            className: "leaflet-text-marker",
            html: this.name,
          }),
        });
        featureGroup.addLayer(marker);
        featureGroup.addLayer(marker1);
      }
    },
  },
  components: {},
  destroyed() {},
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
