<template>
  <div :class="classObj" class="app-wrapper">
    <div class="box">
      <Header class="top-menu-box" />
      <div class="wrapper">
        <slide class="sidebar-container" />
        <div class="main-container">
          <map-container />
          <!-- <map-container v-if="showMap"/> -->
          <!-- <Main v-else /> -->
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import Header from './components/Header.vue'
import Main from './components/Main.vue'
import Slide from './components/Sidebar/index'
// import ResizeMixin from '../layout/mixin/ResizeHandler'

import MapContainer from './components/MapContainer'

export default {
  name: 'SecondLayout',
  components: {
    Header,
    Main,
    Slide,
    MapContainer
  },
  data() {
    return {
      showMap: false
    }
  },
  // mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  watch: {
    $route() {
      this.checkRoute()
    }
  },
  created() {
    this.checkRoute()
  },
  methods: {
    checkRoute() {
      this.showMap = this.$route.meta.showMap
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
 .top-menu-box {
        height: 60px;
        width: 100%;
        padding: 0;
      }
  .box{
    width: 100vw;
    height: 100vh;
  }

  .wrapper{
     height: calc(100vh - 60px);
     position: relative;
     background-color: #1C4684;
  }
</style>
