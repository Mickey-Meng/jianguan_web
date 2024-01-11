<!--
@name:
@description: 底部图片选择
@author: 王海林
@time: 2022-08-03 17:58:06
@modifier:
@modifierTime:
-->
<template>
  <div class="image_select">
    <div class="left_btn_box">
      <img src="../../../assets/mapView/左箭头.png" alt="" @click="toLeft">
    </div>
    <div class="main_image_box">
      <div class="video_box" ref="videoBox" :style="{transform:`translateX(${iWidth}px)`}">
        <div v-for="(item, index) in minData" :key="index" :id="'video_line' + item.id">
        </div>
      </div>
    </div>
    <div class="right_btn_box">
      <img src="../../../assets/mapView/右箭头.png" alt="" @click="toRight">
    </div>
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js";
import { getVideoToken } from "@/api/wisdomSite";
import { mapGetters } from "vuex";
export default {
  props: [],
  watch: {},
  data() {
    return { 
      minData: [],
      playerArr: [],
      currentIndex: 0,
      maxIndex: null,
      iWidth: 0,
      lists: [
        {
          image: require("@/assets/mapView/项目图片1.jpg")
        },
        {
          image: require("@/assets/mapView/项目图片2.jpg")
        },
        {
          image: require("@/assets/mapView/项目图片3.jpg")
        },
        {
          image: require("@/assets/mapView/项目图片4.jpg")
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["project"])
  },
  created() {
    this.initData();
  },
  mounted() {
  },
  methods: {
    initData() {
      this.$axios.get("./data/monitoring.json").then((res) => {
        let data = res.data.data.filter((e) => e.type === 2) || [];
        this.minData = data;
        if (data.length > 4) {
          this.maxIndex = data.length - 4;
        }
        this.initVideo();
      });
    },
    initVideo() {
      getVideoToken(this.project.id).then((res) => {
        let token = res.data;
        this.$nextTick(() => {
          this.minData.forEach((item) => {
            let player = new EZUIKit.EZUIKitPlayer({
              id: `video_line${item.id}`, // 视频容器ID
              accessToken: token,
              url: item.url,
              width: 210,
              height: 114,
              autoplay: false,
              template: "standard", //
              splitBasis: 1 //设置窗口切割参数
            });
            this.playerArr.push(player);
          });
        });
      });
    },
    toLeft() {
      if (this.iWidth < 0) {
        this.iWidth += 220;
      }
    },
    toRight() {
      if (this.maxIndex) {
        let maxW = this.maxIndex * 220;
        if (Math.abs(this.iWidth) < maxW) {
          this.iWidth -= 220;
        }
      }
    }
  },
  components: {},
  beforeDestroy() {
  }

};
</script>

<style lang='scss' scoped>
.image_select {
  width: 980px;
  height: 150px;
  background: url("../../../assets/mapView/底部背景框.png") no-repeat;
  background-size: 100% 100%;
  position: absolute;
  bottom: 22px;
  left: 470px;
  z-index: 1000;
  display: flex;

  .left_btn_box,
  .right_btn_box {
    width: 56px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 36px;
      height: 36px;
      cursor: pointer;
    }

  }

  .main_image_box {
    width: calc(100% - 120px);
    display: flex;
    align-items: center;
    overflow: hidden;

    .video_box {
      display: flex;
      align-items: center;
      transition: all 1s;

      div {
        margin-right: 10px;
        width: 210px;
        height: 114px;
      }
    }
  }
}
</style>
