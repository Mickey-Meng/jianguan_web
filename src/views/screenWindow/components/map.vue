<template>
  <div id="map">

  </div>
</template>

<script>
  import {earth} from "@/config/map";

  const Cesium = window.Cesium;
  // let earth = {};
  let mapCtx = {};
  export default {
    props: [],
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
        let obj = JSON.parse(JSON.stringify(earth));
        obj.layers = [
          {
            name: "午夜蓝图",
            type: "url",
            url: "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}"
          },
          {
            name: "诸暨白模",
            type: "C3DTILES",
            url: "https://system.zlskkj.com:59031/data_zlsk/zhujishi/jianzhu/tileset.json",
            clampToGround: true
          }
        ];
        mapCtx.zlskEarthHelper = new ZlskEarthHelper("map", obj);
        this.setColour();
      },
      setColour() {
        let ffectOptions = {
          "type": "lsex",
          "data": {
            "color": [7, 102, 184, 1],
            "maxHeight": 300,
            "fScanning": 1, //开启扫描
            "cycle1": 100,
            "fGradient": 1,
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
        let layer =  mapCtx.zlskEarthHelper.layers.getLayerByName('诸暨白模');
        mapCtx.zlskEarthHelper.layers.set3dtilesEffectById(layer.gid, ffectOptions);

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
