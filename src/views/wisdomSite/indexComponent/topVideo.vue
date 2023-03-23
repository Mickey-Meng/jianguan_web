<template>
  <div class="wrapper">
    <div class="left">
      <div v-for="(item, index) in videoArr" :key="index" class="video_box">
        <div class="label">{{ item.name }}</div>
        <div :id="'video_line' + item.id" class="video"></div>
      </div>
    </div>
    <div class="right">
      <div class="header">
        监控列表
        <i class="el-icon-close" @click="closePanel"></i>
      </div>
      <div class="main">
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
        this.$nextTick(() => {
          this.videoArr.forEach((item) => {
            let player = new EZUIKit.EZUIKitPlayer({
              id: `video_line${item.id}`, // 视频容器ID
              accessToken: token,
              url: item.url,
              width: 300,
              height: 225,
              autoplay: false,
              template: "standard", //
              splitBasis: 1, //设置窗口切割参数
            });
            this.playerArr.push(player);
          });
        });
      });
    },
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
      width: 25%;
      height: 250px;
      .label {
        height: 25px;
        text-align: center;
        line-height: 25px;
      }
      .video {
        height: 225px;
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
