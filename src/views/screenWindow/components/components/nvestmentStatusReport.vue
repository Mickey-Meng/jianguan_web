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
      <div class="chart_box">
        <v-chart :options="option" autoresize class="v-chart-box"/>
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
        <div>152472</div>
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
            name: "2022计划",
            id: 1
          }
        ],
        option: {}
      };

    },
    created() {
    },
    mounted() {
    },
    methods: {},
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
        height: calc(84% - 20px);
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
                position: absolute;
                width: 100%;
                height: 100%;
                appearance: none;
                -moz-appearance: none;
                -webkit-appearance: none;
                top: 0;
                right: 10%;

              }

              &:after {

              }
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
