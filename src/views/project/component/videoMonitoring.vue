<template>
  <div class="wrapper">
    <!--    <div class="header">-->
    <!--      <div class="global_text_style">监控视频</div>-->
    <!--      <div class="title">-->
    <!--        <div class="titletext">-->
    <!--          <div class="titleitem"></div>-->

    <!--        </div>-->
    <!--      </div>-->

    <!--      <el-select class="select-site" v-if="videoType == 2" v-model="videoId" @change="changeVideo">-->
    <!--        <el-option-->
    <!--          v-for="item in videoData"-->
    <!--          :key="item.id"-->
    <!--          :value="item.id"-->
    <!--          :label="item.address"-->
    <!--        />-->
    <!--      </el-select>-->
    <!--    </div>-->
    <div class="new_ui_header">
      <div class="left">
        <div class="header_line"></div>
        <div class="header_text">监控视频</div>
      </div>
      <el-select v-model="videoType" @change="changeValue">
        <el-option
          v-for="item in typeArr"
          :key="item.key"
          :value="item.key"
          :label="item.name"
        />
      </el-select>

    </div>
    <div v-show="videoType == 1" class="video">
      <div id="video-container"/>
    </div>
    <ul v-show="videoType == 2" class="content">
      <li>
        <img :src="wendu" alt=""/>
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
import {mapGetters} from "vuex";
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
  computed: {
    ...mapGetters(["project"])
  },
  mounted() {
    this.initPlayer();
  },
  methods: {
    initPlayer() {
      getVideoToken().then((res) => {
        const map = {
          126: "K54134283",  //池州市急救中心建设项目
          3: "K09696219",  //池州港乌沙港区公用码头工程项目
          128: "K09696219",  //池州市平天湖东部区域棚户区改造建设工程EPC总承包
          190: "L18119347",  //池州生态人文纪念园项目
          130: "K54134316",  //池州职业技术学院实验实训南区EPC总承包项目
          195: "K09696219",  //池州职业技术学院实验实训综合提升项目（二期）F+EPC
          132: "K09696219",  //清溪大道改造工程
          1: "K09696219"  //顶级
        }
        player = new EZUIKit.EZUIKitPlayer({
          id: "video-container", // 视频容器ID
          accessToken: res.data,
          url: `ezopen://open.ys7.com/${map[this.project.id] || "K54134283"}/1.hd.live`,
          width: 390,
          height: 190,
          audio: 0,
          autoplay: false,
          template: "standard" //
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
    player && player.stop();
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  background-color: #FFFFFF;
  border-radius: 15px;

  .new_ui_header {
    display: flex;
    align-items: center;
    padding: 10px 0px 5px 20px;

    .left {
      display: flex;
      align-items: center;

      .header_line {
        width: 4px;
        height: 16px;
        background-color: #1E6EEB;
        margin-right: 8px;
        border-radius: 3px;
      }

      .header_text {
        color: #2D405E;
        font-size: 18px;
        font-weight: bold;
        font-family: PingFang SC;
      }
    }

    ::v-deep .el-select {
      width: 100px;
      text-indent: 0;
      //height: 35px !important;
      .el-input {
        .el-input__inner {
          height: 30px !important;
          line-height: 30px;
          background-color: transparent !important;
          color: #000;
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
  .select-site {
    width: 155px !important;
  }

 ::v-deep .video {
    padding: 0 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .content {
    padding: 0 10px;
    height: calc(100% - 55px);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    li {
      background-color: #1e374b;
      height: 30%;
      //margin: 5px 0;
      //flex: 1;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      img{
        width: 60px;
        height: 60px;
      }
      .text-box {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        div{
          color: #FFFFFF;
        }
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
