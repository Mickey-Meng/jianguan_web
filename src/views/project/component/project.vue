<template>
  <div class="wrapper">
    <div class="header_g">
      <div class="title_item"></div>
      <div class="title_text">项目信息</div>
    </div>
    <div class="p-info">
      <div class="info-item">
        <span class="title-name">安全生产</span>
        <span class="num">{{ time }}<span class="numafter">天</span> </span>
      </div>
      <div class="info-item">
        <span class="title-name">工程规模</span>
        <span class="num"
          >{{ companyData.inputscale }}<span class="numafter">km</span></span
        >
      </div>
      <div class="info-item">
        <span class="title-name">合同工期</span>
        <span class="num"
          >{{ companyData.projectduration
          }}<span class="numafter">天</span></span
        >
      </div>
      <div class="info-item">
        <span class="title-name">投资规模</span>
        <span class="num"
          >{{ companyData.projectscale
          }}<span class="numafter">万元</span></span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentDate, diffDay } from "@/utils/date";
export default {
  name: "",
  props: {
    companyData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      time: null,
    };
  },
  watch: {
    companyData(n, o) {
      if (n.starttime) {
        this.initData();
      }
    },
  },
  created() {},
  mounted() {},
  methods: {
    initData() {
      const time = getCurrentDate();
      const obj = Object.assign({}, this.companyData);
      const start = obj.starttime.split(" ")[0];
      this.time = diffDay(time, start);
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  background-image: url(../../../assets/image/边框-小.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  .box-title {
    display: flex;
    align-items: center;
    height: 40px;
    .title-item {
      width: 2px;
      height: 15px;
      background: #4f71ff;
      margin-left: 16px;
      margin-right: 12px;
    }
    .title-text {
      width: 64px;
      height: 16px;
      font-size: 16px;
      font-family: PingFangSC;
      font-weight: 600;
      color: #ffffff;
    }
  }
  .p-info {
    display: flex;
    flex-wrap: wrap;
    padding-left: 12px;
    .info-item {
      margin-top: 5px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      width: 50%;
      .title-name {
        padding-top: 5px;
        padding-bottom: 5px;
        padding-left: 15%;
        font-size: 14px;
        font-family: PingFangSC;
        font-weight: 500;
        color: #d7e3fc;
        text-shadow: 0px 1px 0px rgba(20, 14, 34, 0.69);
        background-image: url(../../../assets/image/项目信息背景.png);
        background-repeat: no-repeat;
        // background-position: center;
      }
      .num {
        margin-top: 10px;
        // text-align: center;
        padding-left: 20%;
        font-size: 24px;
        font-family: HuXiaoBo-NanShen;
        font-weight: 400;
        color: #4f85ff;
        .numafter {
          font-size: 14px;
          margin-left: 15px;
        }
      }
    }
  }
}
</style>
