<template>
  <div class="wrapper">
    <div class="new_ui_header">
      <div class="header_line"></div>
      <div class="header_text">项目信息</div>
    </div>
    <div class="project_content">

      <div class="item">
        <img src="../../../assets/newUi/home.png" alt="">
        <div class="text_value">
          <div class="value">{{ time }}</div>
          <div class="text">安全生产(天)</div>
        </div>
      </div>
      <div class="item">
        <img src="../../../assets/newUi/home1.png" alt="">
        <div class="text_value">
          <div class="value">{{ companyData.inputscale }}</div>
          <div class="text">工程规模(km)</div>
        </div>
      </div>
      <div class="item">
        <img src="../../../assets/newUi/home2.png" alt="">
        <div class="text_value">
          <div class="value">{{ companyData.projectduration }}</div>
          <div class="text">合同工期(天)</div>
        </div>
      </div>
      <div class="item">
        <img src="../../../assets/newUi/home3.png" alt="">
        <div class="text_value">
          <div class="value">{{ companyData.projectscale }}</div>
          <div class="text">投资规模(万元)</div>
        </div>
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
  background-color: #FFFFFF;
  border-radius: 15px;
  //padding: 5px;

  .header {
    height: 30px;
  }

  .new_ui_header {
    display: flex;
    align-items: center;
    padding: 20px 0px 20px 20px;

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

  .project_content {
    //height: calc(100% - 30px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    .item {
      width: 49%;
      height: 62px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;

      img {
        width: 62px;
        height: 62px;
        margin-right: 16px;
      }

      .text_value {
        display: flex;
        height: 62px;
        flex-direction: column;
        justify-content: space-around;

        .value {
          font-size: 18px;
          font-family: ShiShangZhongHeiJianTi;
          font-weight: 400;
          color: #2D405E;
        }

        .text {
          font-size: 14px;
          font-weight: 500;
          color: #808EA9;
          font-family: PingFang SC;
        }

      }
    }
  }
}
</style>
