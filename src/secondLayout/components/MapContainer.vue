<template>
  <div class="main-box map-container" ref="main_box">
    <split-pane :min-percent="0" :default-percent="noMap?0:partMap?58:allMap?100:58" split="horizontal">
      <template slot="paneL">
        <transition>
          <div class="map-box">
            <cesium-map></cesium-map>
          </div>
        </transition>
      </template>
      <template slot="paneR">
        <section class="app-main">
          <transition name="fade-transform" mode="out-in">
            <router-view :key="key"/>
          </transition>
        </section>
      </template>
    </split-pane>
  </div>
</template>


<script>
import CesiumMap from "@/components/Map/Index";
export default {
  name: "MapContainer",
  data() {
    return {
      noMap: false,
      allMap:false,
      partMap:false,
    };
  },
  methods: {},
  created() {
    this.checkRoute();
  },
  computed: {
    key() {
      return this.$route.path;
    }
  },
  methods: {
    checkRoute() {
      this.noMap = this.$route.meta.noMap;
      this.allMap = this.$route.meta.allMap;
      this.partMap = this.$route.meta.partMap;
    }
  },
  watch: {
    $route() {
      this.checkRoute();
    }
  },
  components: {
    CesiumMap
  }
};
</script>

<style lang='scss' scoped>

::v-deep .splitter-pane-resizer{
  background-color: transparent !important;
} 
.main-box {
  height: calc(100vh - 60px);
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 10px;
  .map-box {
    height: 100%;
  }
}
.app-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  -moz-box-sizing: border-box; /* Firefox */
  -webkit-box-sizing: border-box; /* Safari */
}
</style>
