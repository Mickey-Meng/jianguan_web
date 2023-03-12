<!--
@name:
@description: 投资情况报告
@author: 王海林
@time: 2022-08-03 14:58:28
@modifier:
@modifierTime:
-->
<template>
  <div class="nvestment_status_seport">
    <div class="left_container">
      <div class="text_label">投资进度完成率</div>
      <div class="chart_box" :class="{isFullScreen:isFullScreen}">
                <div><span>25</span><span>.77</span></div>
<!--        <v-chart :options="option" autoresize class="v-chart-box"/>-->

      </div>
    </div>
    <div class="right_container">
      <el-select v-model="value" placeholder="请选择" popper-class="project_select">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <div class="item" style="margin-bottom: 10px">
        <div>333099</div>
        <div>预计投资(万元)</div>
      </div>
      <div class="item">
        <div>85839</div>
        <div>实际投资(万元)</div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    props: [],
    watch: {},
    data() {
      return {
        value: 1,
        options: [
          {
            name: "2023计划",
            id: 1
          }
        ],
        isFullScreen: false,
        option: {}
      };

    },
    created() {
      this.getPageHeight();
      window.addEventListener("resize", this.getPageHeight);
    },
    mounted() {
    },
    methods: {
      getPageHeight() {
        let a = document.body.scrollHeight;
        if (a > 1000) {
          this.isFullScreen = true;
        } else {
          this.isFullScreen = false;
        }
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .nvestment_status_seport {
    height: 100%;
    padding: 15px 20px;
    display: flex;

    .left_container {
      width: calc(100% - 160px);

      .text_label {
        height: 16%;
        max-height: 40px;
        margin-bottom: 20px;
        font-size: 16px;
        font-family: AlibabaPuHuiTiB;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .chart_box {
        margin: 0 auto;
        //height: calc(84% - 20px);
        //min-width: 140px;
        //min-height: 140px;
        //max-height: 184px;
        //max-width: 184px;
        width: 140px;
        height: 140px;
        background: url("../../../../assets/mapView/饼状图.png") no-repeat;
        background-size: 100% 100%;
        position: relative;

        div {
          position: absolute;
          top: 50px;
          left: 40px;
          > span:nth-of-type(1) {
            height: 34px;
            font-size: 28px;
            font-family: DINPro-Bold;
            font-weight: bold;
            color: #039F22;
          }

          > span:nth-of-type(2) {
            height: 34px;
            font-size: 14px;
            font-family: DINPro-Bold;
            font-weight: bold;
            color: #039F22;
          }
        }
      }

      .isFullScreen {
        width: 184px;
        height: 184px;
        div {
          position: absolute;
          left: 54px;
          top: 65px;
          > span:nth-of-type(1) {
            height: 34px;
            font-size: 34px;
            font-family: DINPro-Bold;
            font-weight: bold;
            color: #039F22;
          }

          > span:nth-of-type(2) {
            height: 34px;
            font-size: 18px;
            font-family: DINPro-Bold;
            font-weight: bold;
            color: #039F22;
          }

        }
      }

    }

    .right_container {
      width: 160px;

      ::v-deep.el-select {
        height: 16%;
        max-height: 40px;
        margin-bottom: 20px;

        .el-input {
          height: 100%;
          //background: url("../../../../assets/mapView/下拉背景.png") no-repeat;
          background-size: 100% 100%;

          .el-input__inner {
            //background: transparent;
            background-color: rgba(40, 97, 246, .1);
            border: none;
            height: 100%;
            line-height: 100%;
            color: #FFFFFF;
            font-size: 16px;
            font-family: DINPro-Bold, DINPro;
            font-weight: bold;
          }

          .el-input__suffix {
            .el-select__caret {
              &:before {
                content: '';
                background: url("../../../../assets/mapView/下拉选择.png") center center no-repeat;
                //background: url("../../../../assets/mapView/下拉选择.png")  no-repeat;
                position: absolute;
                width: 100%;
                height: 100%;
                appearance: none;
                -moz-appearance: none;
                -webkit-appearance: none;
                top: 0;
                right: 10%;
                //transform: rotateY(180deg);

              }

              &:after {

              }
            }

            .el-icon-arrow-up {
              transform: translateZ(0);
            }
            .el-icon-arrow-up.is-reverse{
              transform: rotateZ(180deg);
            }
          }
        }
      }

      .item {
        //height: 36%;
        height: calc((84% - 30px) / 2);
        background: url("../../../../assets/mapView/计划背景.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        > div:nth-of-type(1) {
          margin-bottom: 3px;
          height: 32px;
          font-size: 32px;
          font-family: DINPro-Bold, DINPro;
          font-weight: bold;
          color: #34C5C9;
          line-height: 41px;
          background: linear-gradient(180deg, #FFFFFF 70%, #2861F6 90%, #2861F6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        > div:nth-of-type(2) {
          height: 24px;
          font-size: 14px;
          font-family: AlibabaPuHuiTiB;
          color: #FFFFFF;
          line-height: 24px;
        }

      }
    }
  }

</style>
