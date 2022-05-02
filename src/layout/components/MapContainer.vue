<template>
  <div
    ref="main_box"
    class="main-box"
    :class="{ haveLeft: haveLeft, haveRight: haveRight }"
  >
    <div v-show="haveLeft" class="tree">
      <PartTree />
    </div>
    <split-pane
      :min-percent="0"
      :default-percent="noMap ? 0 : partMap ? 58 : allMap ? 100 : 58"
      split="horizontal"
    >
      <template slot="paneL">
        <transition>
          <div class="map-box">
            <cesium-map />
          </div>
        </transition>
      </template>
      <template slot="paneR">
        <section class="app-main">
          <transition name="fade-transform" mode="out-in">
            <!--            <keep-alive>-->
            <router-view v-if="noMap" :key="key" />
            <!--            </keep-alive>-->
          </transition>
        </section>
      </template>
    </split-pane>
    <router-view v-if="haveRight" class="left" />
    <router-view v-if="cover" class="cover" />
    <div v-if="open" class="open-close" :class="isOpen ? '' : 'close-open'">
      <i
        :class="isOpen ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"
        @click="closeTree"
      />
    </div>
  </div>
</template>

<script>
import CesiumMap from "@/components/Map/Index";
import PartTree from "@/components/tree/inde";
export default {
  name: "MapContainer",
  components: {
    CesiumMap,
    PartTree,
  },
  data() {
    return {
      isOpen: true,
      noMap: false,
      allMap: false,
      partMap: false,
      haveLeft: false,
      haveRight: false,
      open: false,
      cover: false,
    };
  },
  computed: {
    key() {
      return this.$route.path;
    },
  },
  watch: {
    $route() {
      this.checkRoute();
    },
  },
  created() {
    this.checkRoute();
  },
  methods: {
    checkRoute() {
      this.noMap = this.$route.meta.noMap;
      this.allMap = this.$route.meta.allMap;
      this.partMap = this.$route.meta.partMap;
      this.haveLeft = this.$route.meta.left;
      this.haveRight = this.$route.meta.right;
      this.open = this.$route.meta.open;
      this.cover = this.$route.meta.cover;
      this.isOpen = true;
    },
    closeTree() {
      this.isOpen = !this.isOpen;
      this.haveLeft = this.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .splitter-pane-resizer {
  background-color: transparent !important;
  display: none !important;
}
.main-box {
  // height: calc(100vh - 180px);
  height: 100%;
  position: relative;
  width: 100%;
  overflow: hidden;
  // padding: 5px;
  .map-box {
    height: 100%;
  }
  .tree {
    position: absolute;
    top: 0;
    left: 0;
    width: 380px;
    z-index: 2001;
    height: 100%;
    background: #060c26;
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
.haveLeft {
  padding-left: 380px;
  .main-box {
    padding: 0 !important;
  }
}
.haveRight {
  padding-right: 400px;
}
.left {
  width: 400px;
  // height: calc(100vh - 180px);
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
}
.cover {
  width: 100%;
  position: absolute;
  top: 0;
  height: 100%;
  z-index: 2001;
  pointer-events: none;
}

.open-close {
  position: absolute;
  top: 50%;
  left: 355px;
  z-index: 10;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  line-height: 50px;
  text-align: center;
  background-color: #060c26;
  transform: translateY(-50%);
  cursor: pointer;
  i {
    font-size: 30px;
    vertical-align: middle;
  }
}
.close-open {
  left: 10px;
}
</style>
