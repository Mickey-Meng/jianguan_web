<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-25 15:06:10
-->
<template>
  <div class="wrapper_b">
    <div class="container_m" :class="{ show_page: !isShow }">
      <div class="top">
        <topVideo
          @closePanel="closePanel"
          :minData="minData"
          @flySite="flySite"
        ></topVideo>
      </div>
      <div class="bottom">
        <monitoring :minData="minData" @flySite="flySite"></monitoring>
      </div>
    </div>
    <!-- <div class="video1 video" :class="{ go_left: isShow }">
      <div class="header_title">一工区檀树山隧道</div>
      <div id="video1" class="video-b"></div>
    </div>
    <div class="video2 video" :class="{ go_left: isShow }">
      <div class="header_title">四工区杭金衢分离大桥</div>
      <div id="video2" class="video-b"></div>
    </div>
    <div class="video3 video" :class="{ go_right: isShow }">
      <div class="header_title">二工区灵山坞1号桥</div>
      <div id="video3" class="video-b"></div>
    </div>
    <div class="video4 video" :class="{ go_right: isShow }">
      <div class="header_title">三工区草塔互通主线1号桥</div>
      <div id="video4" class="video-b"></div>
    </div> -->

    <svg-icon
      icon-class="minPanel"
      class="return_b"
      v-if="!isShow"
      @click="showHideClick"
    />
    <svg-icon
      icon-class="video"
      class="return_a"
      v-if="!isShow"
      @click="showVideoTable = !showVideoTable"
    />
    <div class="video_table" v-show="showVideoTable && !isShow">
      <el-table
        :data="minData.filter((e) => e.type == 2)"
        height="100%"
        style="width: 100%"
        @row-click="rowClick"
      >
        <el-table-column
          prop="name"
          label="位置"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column label="操作" align="center" width="80">
          <template slot-scope="{ row }">
            <svg-icon icon-class="site" @click="flySite(row)" />
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <ul class="legend" v-if="!isShow">
      <li>
        <img src="../../assets/marker/环境监测.png" alt="环境监测" /><span
          >环境监测</span
        >
      </li>
      <li>
        <img src="../../assets//marker/视频监控.png" alt="视频监控" /><span
          >视频监控</span
        >
      </li>
    </ul>
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js";
import {mapGetters} from "vuex";

import monitoring from "@/views/wisdomSite/indexComponent/monitoring";
import topVideo from "@/views/wisdomSite/indexComponent/topVideo";
import { getVideoToken } from "@/api/wisdomSite";
import {getMonitoring} from "@/api/project";
let zeh, em, player, popupId;
export default {
  name: "",
  components: { monitoring, topVideo },
  data() {
    return {
      isShow: true,
      token: null,
      minData: [],
      playerData: [],
      showVideoTable: false,
    };
  },
  computed: {
    ...mapGetters(["project"])
  },
  created() {
    zeh = window.zeh;
    // em = zeh.earth.createMarkerManager({ clusterType: "dilute" });
    // em.beginCluster();
  },
  mounted() {
    this.getToken();
  },
  methods: {
    showHideClick() {
      this.isShow = true;
      this.showVideoTable = false;
    },
    closePanel() {
      this.isShow = false;
    },
    getToken() {
      getVideoToken(this.project.id).then((res) => {
        this.token = res.data;
        this.initData();
        // this.initPageVideo();
      });
    },
    initPageVideo() {
      let player1 = new EZUIKit.EZUIKitPlayer({
        id: `video1`, // 视频容器ID
        accessToken: this.token,
        url: "ezopen://open.ys7.com/E61698613/1.hd.live",
        width: 350,
        height: 240,
        autoplay: false,
        template: "standard", //
        splitBasis: 1, //设置窗口切割参数
      });
      let player2 = new EZUIKit.EZUIKitPlayer({
        id: `video2`, // 视频容器ID
        accessToken: this.token,
        url: "ezopen://open.ys7.com/E58345532/1.hd.live",
        width: 350,
        height: 240,
        autoplay: false,
        template: "standard", //
        splitBasis: 1, //设置窗口切割参数
      });
      let player3 = new EZUIKit.EZUIKitPlayer({
        id: `video3`, // 视频容器ID
        accessToken: this.token,
        url: "ezopen://open.ys7.com/E60311014/1.hd.live",
        width: 350,
        height: 240,
        autoplay: false,
        template: "standard", //
        splitBasis: 1, //设置窗口切割参数
      });
      let player4 = new EZUIKit.EZUIKitPlayer({
        id: `video4`, // 视频容器ID
        accessToken: this.token,
        url: "ezopen://open.ys7.com/E32519666/1.hd.live",
        width: 350,
        height: 240,
        autoplay: false,
        template: "standard", //
        splitBasis: 1, //设置窗口切割参数
      });
      this.playerData = [player1, player2, player3, player4];
    },
    flySite(row) {
      this.isShow = false;
      zeh.flyto({
        height: 200,
        latitude: row.geom[1],
        longitude: row.geom[0],
        pitch: -90,
      });
    },
    initData() {
      getMonitoring(this.project.id).then((res) => {
        let data = res.data.monitorDevices;
        this.minData = data;
        if (data && data.length > 0) {
          // this.initMarker(data);
        }
      });
      // this.$axios.get("./data/monitoring.json").then((res) => {
      //   let data = res.data.data;
      //   this.minData = data;
      //   if (data && data.length > 0) {
      //     // this.initMarker(data);
      //   }
      // });
    },
    initMarker(data) {
      let token = this.token;
      let image = require("@/assets/marker/环境监测.png");
      let image1 = require("@/assets/marker/视频监控.png");
      data.forEach((item) => {
        let { name, type, geom } = item;
        em.add({
          position: geom,
          image: type === 1 ? image : image1,
          text: name,
          textOffset: [0, -45],
          textVisibleRange: [0, 5000000],
          imageVisibleRange: [0, 5000000], //点位图片可见高度 可选 [ min, max]
          imageScaleRange: [0, 0.4, 5000000, 0.2],
          edata: item,
          onClick: function (id, b, c) {
            let { edata } = b;
            // player && player.stop();
            popupId && zeh.closePopup(popupId);
            if (edata.type === 2) {
              popupId = zeh.openPopup({
                position: geom, // 必须 弹窗位置
                // visibleRange: popupVisibleRange,
                offset: [0, -35], // 可选，弹窗是否偏移W
                width: 380, // 可选，默认值: 400
                height: 270, // 可选，默认值: 240
                content: `<div id="mon_video"></div>`, // 弹框内容 可选，默认值: ''
                class: "popup", // 可选，默认值:
                closable: true, // 关闭按钮 可选，默认值: true
              });
              player = new EZUIKit.EZUIKitPlayer({
                id: `mon_video`, // 视频容器ID
                accessToken: token,
                url: edata.url,
                width: 350,
                height: 250,
                autoplay: true,
                template: "standard", //
                splitBasis: 1, //设置窗口切割参数
              });
            }
          },
        });
      });
    },
    rowClick(row) {
      let token = this.token;
      popupId && zeh.closePopup(popupId);
      popupId = zeh.openPopup({
        position: row.geom, // 必须 弹窗位置
        // visibleRange: popupVisibleRange,
        offset: [0, -35], // 可选，弹窗是否偏移W
        width: 380, // 可选，默认值: 400
        height: 270, // 可选，默认值: 240
        content: `<div id="mon_video"></div>`, // 弹框内容 可选，默认值: ''
        class: "popup", // 可选，默认值:
        closable: true, // 关闭按钮 可选，默认值: true
      });
      player = new EZUIKit.EZUIKitPlayer({
        id: `mon_video`, // 视频容器ID
        accessToken: token,
        url: row.url,
        width: 350,
        height: 250,
        autoplay: true,
        template: "standard", //
        splitBasis: 1, //设置窗口切割参数
      });
      zeh.flyto({
        height: 200,
        latitude: row.geom[1],
        longitude: row.geom[0],
        pitch: -90,
      });
    },
  },
  destroyed() {
    em && em.clear();
    if (this.playerData && this.playerData.length > 0) {
      this.playerData.forEach((item) => {
        item.stop();
      });
    }
  },
};
</script>

<style scoped lang="scss">
.wrapper_b {
  // pointer-events: auto;
  .return_b {
    position: absolute;
    left: 50px;
    top: 10px;
    width: 30px;
    height: 30px;
    pointer-events: auto;
  }
  .return_a {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 30px;
    height: 30px;
    pointer-events: auto;
  }
  .video_table {
    width: 200px;
    height: 400px;
    position: absolute;
    left: 10px;
    top: 50px;
    pointer-events: auto;
    //background-color: #EAF0F9 !important;
  }
  .video {
    width: 350px;
    height: 270px;
    background: #0f0d22;
    border-radius: 5px;
    transition: transform 1s;
    pointer-events: auto;
    .header_title {
      text-align: center;
      height: 30px;
      line-height: 30px;
    }
    .video-b {
      width: 100%;
      height: calc(100% - 30px);
    }
  }
  .go_left {
    transform: translateX(-150%);
    transition: transform 1s;
  }
  .go_right {
    transform: translateX(150%);
    transition: transform 1s;
  }
  .video1 {
    position: absolute;
    left: 20px;
    top: 30px;
  }
  .video2 {
    position: absolute;
    left: 20px;
    top: 320px;
  }
  .video3 {
    position: absolute;
    right: 90px;
    top: 30px;
  }
  .video4 {
    position: absolute;
    right: 90px;
    top: 320px;
  }
  .legend {
    width: 150px;
    height: 100px;
    position: absolute;
    bottom: 10px;
    right: 100px;
    color: #FFFFFF;
    li {
      height: 30px;
      margin: 10px 0;
      display: flex;
      align-items: center;
      img {
        margin-right: 20px;
        display: inline-block;
        width: 30px;
        height: 30px;
      }
    }
  }
  .container_m {
    height: 100%;
    transition: transform 1s;
    background-color: #EAF0F9;
    pointer-events: auto;
    .top {
      height: 100%;
    }
    .bottom {
      border-top: 2px solid #ffffff;
      height: 0%;
    }
  }
  .show_page {
    transform: translateY(-100%);
    transition: transform 1s;
  }
}
</style>
