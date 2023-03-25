<template>
  <div class="wrapper">
    <div class="left">
      <div v-for="(item, index) in videoArr" :key="index" class="video_box" @click="selectedVideo=index">
        <div class="label">{{ item.name }}</div>
        <div :id="'video_line' + item.id" class="video"></div>
      </div>
    </div>
    <div class="right">
      <el-row v-show="project.id == 191">
        <el-button icon="el-icon-arrow-left" circle @mousedown.native="startCtrl(2)" @mouseup.native="stopCtrl"></el-button>
        <el-button icon="el-icon-arrow-right" circle @mousedown.native="startCtrl(3)" @mouseup.native="stopCtrl"></el-button>
        <el-button icon="el-icon-arrow-down" circle @mousedown.native="startCtrl(1)" @mouseup.native="stopCtrl"></el-button>
        <el-button icon="el-icon-arrow-up" circle @mousedown.native="startCtrl(2)" @mouseup.native="stopCtrl"></el-button>
      </el-row>

      <div class="header" style="display:none;">
        监控列表
        <i class="el-icon-close" @click="closePanel"></i>
      </div>
      <div class="main" style="display:none;">
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
              <svg-icon icon-class="site" @click="flySite(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
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
      videoArr: [],
      selectedVideo: 0,
      videoToken: ''
    };
  },
  computed: {
    ...mapGetters(["project"])
  },
  mounted() {},
  methods: {
    initVideo() {
      this.videoArr = this.minData.filter((e) => e.type === 2 && e.project == this.project.id);
      getVideoToken().then((res) => {
        let token = res.data;
        this.videoToken = token;
        this.$nextTick(() => {
          this.videoArr.forEach((item, index) => {
            let player = new EZUIKit.EZUIKitPlayer({
              id: `video_line${item.id}`, // 视频容器ID
              accessToken: token,
              url: item.url,
              width: 600,
              height: 475,
              autoplay: index < 2 ? true : false,
              template: "security", //
              splitBasis: 1, //设置窗口切割参数
            });
            this.playerArr.push(player);
          });
        });
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
      const playerInfo = this.videoArr[this.selectedVideo];
      // 准备一个对象，给接口传参用，参数说明在文档中有详细介绍
      let obj = {
        accessToken: "at.6i2pbipi5bc6cgc80kv7qif88wui5eo7-9rirnc32yg-1gusung-6gaolfzl9", // accessToken，相当于密钥
        deviceSerial: playerInfo.deviceNo, // 设备的序列号
        channelNo: parseInt(playerInfo.channelNo), // 设备通道号，文档中说要用int，所以我就加了个parseInt，估计不加也行
        direction, // 代表需要怎样控制，这里就是拿的方法中传过来的参数0、1等
        speed: 1 // 速度，0最慢，文档中也有说明
      }

      // 调用萤石云提供的接口，本来我用是axios调用，但是一直报缺少accessToken的错，又不想用原生http请求了，就直接用jquery请求接口了
      this.$axios.post("https://open.ys7.com/api/lapp/device/ptz/start", obj).then((res) => {
        console.log(res)
      });
    },
    stopCtrl() {
      const playerInfo = this.videoArr[this.selectedVideo];

      // 准备请求参数，跟开始控制方法相比，少了direction与speed两个参数
      let obj = {
        accessToken: "at.6i2pbipi5bc6cgc80kv7qif88wui5eo7-9rirnc32yg-1gusung-6gaolfzl9", // 授权过程获取的access_token
        deviceSerial: playerInfo.deviceNo, // 设备序列号
        channelNo: parseInt(playerInfo.channelNo), // 通道号
      }

      // 调用萤石云提供的停止云台控制的方法，文档中有提供
      this.$axios.post("https://open.ys7.com/api/lapp/device/ptz/stop", obj).then((res) => {
        console.log(res)
      });
    }
  },
  watch: {
    minData: function (n) {
      if (n.length > 0) {
        this.initVideo();
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
    .video_box {
      width: 50%;
      height: 500px;
      .label {
        height: 25px;
        text-align: center;
        line-height: 25px;
      }
      .video {
        height: 475px;
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
      height: calc(100% - 90px);
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
