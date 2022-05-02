<template>
  <div class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <div class="box">
      <Header class="top-menu-box" />
      <div class="wrapper">
        <!--          <sidebar class="sidebar-container" />-->
        <div class="main-container">
          <!--              <div :class="{'fixed-header':fixedHeader}">-->
          <!--                <navbar />-->
          <!--              </div>-->
          <map-container />
        </div>
      </div>
      <div class="company-name">诸暨市建设集团有限公司</div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import Header from "./components/header/Index";
import MapContainer from "./components/MapContainer";
import { updateOnline } from "@/api/user";
// import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: "Layout",
  components: {
    MapContainer,
    Navbar,
    Sidebar,
    AppMain,
    Header,
  },
  data() {
    return {
      timer: null,
    };
  },
  // mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  watch: {
    $route() {
      this.checkRoute();
    },
  },
  created() {
    this.checkRoute();
    this.init();
  },
  methods: {
    // handleClickOutside() {
    //   this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    // },
    checkRoute() {
      this.showMap = this.$route.meta.showMap;
    },
    init() {
      let that = this;
      updateOnline();
      that.timer = setInterval(() => {
        updateOnline();
      }, 1000 * 60 * 3);
    },
  },
  destroyed() {
    this.timer && clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  //background: url("../assets/image/mian-bg.png") no-repeat;
  //background-size: 100% 100%;
  &.mobile.openSidebar {
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

.top-menu-box {
  height: 135px;
  width: 100%;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.box {
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/image/mainviewbg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 20px;
}

.wrapper {
  height: calc(100% - 140px);
  position: relative;
  padding-left: 30px;
  padding-right: 30px;
  overflow: hidden;
  .main-container {
    height: 100%;
  }
}

.company-name {
  position: fixed;
  right: 50px;
  bottom: 0px;
  font-size: 14px;
  color: #88a2c5;
  z-index: 1000;
}
</style>
