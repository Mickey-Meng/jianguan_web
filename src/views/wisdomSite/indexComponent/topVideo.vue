<template>
  <div class="wrapper">
    <div class="left">
      <!-- <div v-for="(item, index) in videoArr" :key="index" class="video_box" @click="selectedVideo=index">
        <div class="label">{{ item.name }}</div>
        <div :id="'video_line' + item.id" class="video"></div>
      </div> -->
      <div id="video_line" class="video"></div>
    </div>
    <div class="right">

      <div class="header">
        监控列表
        <!-- <i class="el-icon-close" @click="closePanel"></i> -->
      </div>
      <div class="main" >
        <el-table
          :data="minData.filter((e) => e.type === 2 && e.project == project.id)"
          height="100%"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="name"
            label="位置"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="{ row }">
              <svg-icon icon-class="site" @click="initVideo(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-row>
        <el-button icon="el-icon-arrow-left" circle @mousedown.native="startCtrl(2)" @mouseup.native="stopCtrl"></el-button>
        <el-button icon="el-icon-arrow-right" circle @mousedown.native="startCtrl(3)" @mouseup.native="stopCtrl"></el-button>
        <el-button icon="el-icon-arrow-down" circle @mousedown.native="startCtrl(1)" @mouseup.native="stopCtrl"></el-button>
        <el-button icon="el-icon-arrow-up" circle @mousedown.native="startCtrl(0)" @mouseup.native="stopCtrl"></el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import EZUIKit from "ezuikit-js";
import {mapGetters} from "vuex";
import { getVideoToken } from "@/api/wisdomSite";

export default {
  props: {
    minData: {
      type: Array,
      default: () => [],
    },
  },
  name: "",
  data() {
    return {
      tableData: [],
      playerArr: [],
      player: undefined,
      videoArr: [],
      selectedVideo: {},
      videoToken: '',
      moveActive: false
    };
  },
  computed: {
    ...mapGetters(["project"])
  },
  mounted() {},
  methods: {
    init() {
      this.videoArr = this.minData.filter((e) => e.type === 2 && e.project == this.project.id);
      getVideoToken().then((res) => {
        let token = res.data;
        this.videoToken = token;
        this.$nextTick(() => {
          this.initVideo(this.videoArr[0])
        });
      });
    },
    initVideo(item) {
      if (this.player && this.player.params.url == item.url) return
      this.player && this.player.stop()
      this.selectedVideo = item;
      document.getElementById(`video_line`).innerHTML="";
      this.player = new EZUIKit.EZUIKitPlayer({
        id: `video_line`, // 视频容器ID
        accessToken: this.videoToken,
        url: item.url,
        width: 1200,
        height: 800,
        autoplay: true,
        template: "standard", //
        splitBasis: 1, //设置窗口切割参数
      });
    },
    left() {},
    right() {},
    closePanel() {
      this.$emit("closePanel");
      this.stopVideo();
    },
    flySite(row) {
      this.$emit("flySite", row);
      this.stopVideo();
    },
    stopVideo() {
      if (this.playerArr.length > 0) {
        this.playerArr.forEach((item) => {
          item.stop();
        });
      }
    },
    startCtrl(direction) {
      const playerInfo = this.selectedVideo;
      
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("accessToken", this.videoToken);
      urlencoded.append("deviceSerial", playerInfo.deviceNo);
      urlencoded.append("channelNo", playerInfo.channelNo);
      urlencoded.append("direction", direction);
      urlencoded.append("speed", "1");

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      fetch("https://open.ys7.com/api/lapp/device/ptz/start", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
      
      this.moveActive = true;
    },
    stopCtrl() {
      const playerInfo = this.selectedVideo;
      
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("accessToken", this.videoToken);
      urlencoded.append("deviceSerial", playerInfo.deviceNo);
      urlencoded.append("channelNo", playerInfo.channelNo);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      fetch("https://open.ys7.com/api/lapp/device/ptz/stop", requestOptions)
        .then(response => response.text())
        .then(result => {this.moveActive = false;})
        .catch(error => console.log('error', error));

      
    }
  },
  watch: {
    minData: function (n) {
      if (n.length > 0) {
        this.init();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  display: flex;
  .left {
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .video {
      width: 100%;
      height: calc(100%-50px);
    }
    .video_box {
      width: 100%;
      height: 500px;
      .label {
        height: 25px;
        text-align: center;
        line-height: 25px;
      }
    }
  }
  .right {
    width: 20%;
    .header {
      height: 40px;
      line-height: 40px;
      background-color: #FFFFFF;
      text-indent: 2em;
      position: relative;
      i {
        position: absolute;
        right: 10px;
        top: 4px;
        font-size: 22px;
        cursor: pointer;
      }
    }

    .main {
      height: calc(100% - 180px);
      margin-bottom: 5px;
    }

    .footer {
      text-align: center;

      .el-button {
        border: 1px solid rgb(40, 157, 233);
        background-color: rgb(6, 12, 38);
        color: #ffffff;
      }
    }
  }
}
</style>
