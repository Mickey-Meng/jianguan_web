<template>
  <div class="wrapper">
    <div class="title">
      <div class="titletext">
        <div class="titleitem"></div>
        <el-select v-model="videoType" @change="changeValue">
          <el-option
            v-for="item in typeArr"
            :key="item.key"
            :value="item.key"
            :label="item.name"
          />
        </el-select>
      </div>
      <!-- <span v-if="videoType == 1" class="see-new-btm"
        >监控页面<i class="el-icon-d-arrow-right"
      /></span> -->
      <el-select v-if="videoType == 2" v-model="videoId" @change="changeVideo">
        <el-option
          v-for="item in videoData"
          :key="item.id"
          :value="item.id"
          :label="item.address"
        />
      </el-select>
    </div>
    <div v-show="videoType == 1" class="video">
      <div id="video-container" />
    </div>
    <ul v-show="videoType == 2" class="content">
      <li>
        <img :src="wendu" alt="" />
        <div class="text-box">
          <div>实时温度</div>
          <span>{{ currentVideo.tem }}℃</span>
        </div>
      </li>
      <li>
        <img :src="zaoyin" alt="" />
        <div class="text-box">
          <div>实时噪声</div>
          <span>{{ currentVideo.noise }}dB</span>
        </div>
      </li>
      <li>
        <img :src="pm" alt="" />
        <div class="text-box">
          <div>实时PM2.5</div>
          <span>{{ currentVideo.pm25 }}μg/m3</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import wendu from "@/assets/image/wendu.png";
import pm from "@/assets/image/pm2.5.png";
import zaoyin from "@/assets/image/zaoyin.png";
import EZUIKit from "ezuikit-js";
import { getEnvironmentVideo, getVideoToken } from "@/api/wisdomSite";

let player = null;

export default {
  name: "",
  components: {},
  data() {
    return {
      wendu: wendu,
      pm: pm,
      zaoyin: zaoyin,
      videoType: 1,
      typeArr: [
        {
          name: "监控视频",
          key: 1,
        },
        {
          name: "环境监测",
          key: 2,
        },
      ],
      videoData: [],
      videoId: "",
      currentVideo: {},
    };
  },
  mounted() {
    this.initPlayer();
  },
  methods: {
    initPlayer() {
      getVideoToken().then((res) => {
        player = new EZUIKit.EZUIKitPlayer({
          id: "video-container", // 视频容器ID
          accessToken: res.data,
          url: "ezopen://open.ys7.com/E61698613/1.hd.live",
          width: 400,
          height: 260,
          audio: 0,
          autoplay: false,
          template: "standard", //
        });
      });
    },
    changeValue(val) {
      if (val == 1) {
      } else {
        getEnvironmentVideo().then((res) => {
          this.videoData = res.data;
          if (res.data && res.data.length > 0) {
            this.videoId = res.data[0].id;
            this.currentVideo = res.data[0];
          }
        });
      }
    },
    changeVideo(val) {
      this.currentVideo = this.videoData.find((e) => e.id === val);
    },
  },
  destroyed() {
    player.stop();
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  background-image: url(../../../assets/image/边框-小.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 100%;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    // padding-top:16px ;
    padding-right: 10px;
    .titletext {
      display: flex;
      align-items: center;
      .titleitem {
        z-index: 1;
        margin-left: 16px;
      }
      ::v-deep .el-select {
        width: 110px;
        text-indent: 0;
        //height: 35px !important;
        .el-input {
          .el-input__inner {
            height: 30px !important;
            line-height: 30px;
            background-color: transparent !important;
            color: #fff;
            border: none;
          }
          .el-input__suffix {
            .el-input__icon {
              line-height: 30px;
              color: #4f71ff;
            }
          }
        }
      }
    }

    span {
      cursor: pointer;
    }
  }

  .video {
    margin-top: 5px;
    height: calc(100% - 60px);
    padding: 0px 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    margin-top: 5px;
    height: calc(100% - 40px);
    padding: 0px 2px;
    display: flex;
    flex-direction: column;
    li {
      background-color: #1e374b;
      margin: 5px 0;
      flex: 1;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .text-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        span {
          margin-top: 10px;
          color: #f4ea1c;
          font-size: 18px;
        }
      }
    }
  }
}
</style>
