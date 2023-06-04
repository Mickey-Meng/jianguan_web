<template>
  <div class="wrapper">
    <div class="new_ui_header">
      <div class="header_line"></div>
      <div class="header_text">项目信息</div>
    </div>
    <div class="project_content">

      <div class="item">
        <!-- <img src="../../../assets/newUi/home.png" alt=""> -->
        <div class="text_value">
          <div class="value_unit">
            <div class="value">{{ time }}</div>
            <div class="unit">天</div>
          </div>
          <div class="text">安全生产(天)</div>
        </div>
      </div>
      <div class="item">
        <!-- <img src="../../../assets/newUi/home1.png" alt=""> -->
        <div class="text_value">
          <div class="value_unit">
            <div class="value">{{ companyData.projectscale }}</div>
            <div class="unit">㎡</div>
          </div>
          <div class="text">建筑面积</div>
        </div>
      </div>
      <div class="item">
        <!-- <img src="../../../assets/newUi/home2.png" alt=""> -->
        <div class="text_value">
          <div class="value_unit">
            <div class="value">{{ companyData.projectduration }}</div>
            <div class="unit">天</div>
          </div>
          <div class="text">合同工期</div>
        </div>
      </div>
      <div class="item">
        <!-- <img src="../../../assets/newUi/home3.png" alt=""> -->
        <div class="text_value">
          <div class="value_unit">
            <div class="value">{{ companyData.inputscale }}</div>
            <div class="unit">万元</div>
          </div>
          <div class="text">投资规模</div>
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
    padding: 20px 0px 10px 20px;
    background: #EAF1FF;
    border-radius: 4px 4px 0px 0px;
    margin-bottom: 10px;

    .header_line {
      width: 24px;
      height: 24px;
      background-color: #1E6EEB;
      margin-right: 8px;
      border-radius: 3px;
      background: url(../../../assets/image/data_center_project_info.svg) no-repeat;
      background-size: cover;
    }

    .header_text {
      color: #2D405E;
      font-size: 18px;
      font-weight: bold;
      font-family: PingFang SC;
      font-size: 16px;
      font-family: AlibabaPuHuiTiM;
      color: #191919;
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

        .value_unit {
          display: flex;
          flex-direction: row;
          justify-content: center;
            .value {
              font-size: 18px;
              font-family: ShiShangZhongHeiJianTi;
              font-weight: 400;
              color: #2D405E;
              font-size: 32px;
              font-family: DINPro-Bold, DINPro;
              font-weight: bold;
              color: #FFFFFF;
              line-height: 41px;
              letter-spacing: 1px;
              -webkit-text-stroke: 1px #3656FF;
              text-stroke: 1px #3656FF;
              background: -webkit-gradient(linear, left top, left bottom, from(rgba(66, 136, 176, 0.3)), to(#51D280));
              background: linear-gradient(180deg, #3656FF4f 0%, #3656FF 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              float: left;
              text-align: center;
            }
            .unit {
              line-height: 41px;
              margin-top: 5px;
              font-size: 12px;
              font-family: AlibabaPuHuiTiR;
              color: #191919;
            }
        }

        .text {
          font-size: 14px;
          font-weight: 500;
          color: #808EA9;
          font-family: PingFang SC;
          font-family: AlibabaPuHuiTiM;
          color: #191919;
          line-height: 20px;
          text-align: center;
        }

      }
    }
  }
}
</style>
