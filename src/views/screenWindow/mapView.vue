<template>
  <div class="map_view_wrapper">
    <div class="earth">
      <mapView ref="mapView" :allProjects="allProjects"></mapView>
    </div>
    <div class="header_title">
      <headerTitle></headerTitle>
    </div>
    <div class="side_left"></div>
    <div class="side_right"></div>
    <div class="left_container">
      <leftContainer></leftContainer>
    </div>
    <div class="right_container">
      <rightContainer></rightContainer>
    </div>
    <projectType @changeData="changeData"></projectType>
    <legendView :allProjects="allProjects"></legendView>
    <projectImage></projectImage>

  </div>
</template>

<script>
  import mapView from "./components/map";
  import headerTitle from "./components/header";
  import leftContainer from "@/views/screenWindow/components/leftContainer";
  import rightContainer from "@/views/screenWindow/components/rightContainer";
  import projectType from "@/views/screenWindow/components/projectType";
  import legendView from "./components/legend";
  import projectImage from "./components/projectImage";
  import {getProjectsByUser} from "@/api/project";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        allProjects: []
      };
    },
    created() {
      this.initData();
    },
    mounted() {
    },
    methods: {
      initData() {
        getProjectsByUser().then(res => {
          this.allProjects = res.data;
        });
      },
      changeData(name) {
        this.$refs.mapView.changeMarkerVisible(name);
      }
    },
    components: {mapView, headerTitle, leftContainer, rightContainer, projectType, legendView, projectImage},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .map_view_wrapper {
    position: relative;
    height: 100%;

    .earth {
      width: 100%;
      height: 100%;
    }

    .header_title {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 106px;
      z-index: 1000;
      background: url("../../assets/mapView/顶部.png") no-repeat;
      background-size: 100% 100%;
      pointer-events: auto;

      > div {
        height: 100%;
      }
    }

    .side_left {
      width: 26px;
      height: calc(100% - 48px);
      position: absolute;
      left: 0;
      top: 31px;
      background: url("../../assets/mapView/侧面左.png") no-repeat;
      background-size: 100% 100%;
      z-index: 1000;
    }

    .side_right {
      width: 26px;
      height: calc(100% - 48px);
      position: absolute;
      right: 0;
      top: 31px;
      background: url("../../assets/mapView/侧面右.png") no-repeat;
      background-size: 100% 100%;
      z-index: 1000;
    }

    .left_container {
      position: absolute;
      left: 40px;
      top: 98px;
      z-index: 1000;
      height: calc(100vh - 120px);
      width: 420px;
    }

    .right_container {
      position: absolute;
      right: 40px;
      top: 98px;
      z-index: 1000;
      width: 420px;
      height: calc(100vh - 120px);
    }
  }

</style>
