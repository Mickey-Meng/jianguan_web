<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-25 09:59:08
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-27 17:24:33
-->
<template>
  <div class="progress_chart">
    <div class="new_ui_header">
      <div class="header_line"></div>
      <div class="header_text">项目进度</div>
    </div>
    <div class="content">
      <div class="left_chart">
        <div class="chart_box">
          <v-chart :options="option" autoresize class="v-chart-box"/>
        </div>
        <div class="text">总体进度</div>
      </div>
      <div class="right_process">
        <div class="item">
          <div class="header_text">
            <div class="text">房建进度</div>
            <div class="num ql">{{ lmNum }}</div>
          </div>
          <div class="line">
            <div class="actual_progress_ql" :style="{width:lmNum}" :class="{noBorderRadius:lmFinish}"></div>
          </div>
        </div>
        <div class="item item_dl">
          <div class="header_text">
            <div class="text">桥梁进度</div>
            <div class="num dl">{{ dlNum }}</div>
          </div>
          <div class="line">
            <div class="actual_progress_dl" :style="{width:dlNum}" :class="{noBorderRadius:dlFinish}"></div>
          </div>
        </div>
        <div class="item">
          <div class="header_text">
            <div class="text">道路进度</div>
            <div class="num sd">{{ sdNum }}</div>
          </div>
          <div class="line">
            <div class="actual_progress_sd" :style="{width:sdNum}" :class="{noBorderRadius:sdFinish}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import * as api from "@/api/data";
import {merge} from "lodash";
import {mapGetters} from "vuex";
export default {
  data() {
    return {
      qlNum: 0.00 + "%",
      dlNum: 0.00 + "%",
      sdNum: 0.00 + "%",
      lmNum: 0.00 + "%",
      qlFinish: false,
      dlFinish: false,
      lmFinish: false,
      sdFinish: false,
      option: {
        title: {
          text: "",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            color: "#1E6EEB",
            fontSize: "24"
          }
        },
        color: ["rgba(210,226,251, 1)"],
        series: [{
          name: "",
          type: "pie",
          // clockWise: true,
          radius: ["58%", "76%"],
          itemStyle: {
            normal: {
              label: {
                show: false
              },
              labelLine: {
                show: false
              }
            }
          },
          hoverAnimation: false,
          data: [{
            value: 100,
            name: "完成",
            itemStyle: {
              normal: {
                color: "#1E6EEB",
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            }
          }, {
            name: "未完成",
            value: 0
          }]
        }]
      }
    };
  },
  created() {
  },
  mounted() {
    this.initData();
  },
  components: {},
  computed: {
    ...mapGetters(["project"])
  },
  methods: {
    initData() {
      api.getMiddleData(this.project.id).then((res) => {
        const {QL, SD, DL, LM} = res.data; // LM代表房建
        let allCount = 0,
          allFinish = 0;
        if (QL) {
          let finish = QL.finish || 0;
          let count = QL.count || 0;
          if (finish && count && finish === count) {
            this.qlFinish = true;
          }
          allFinish += finish;
          allCount += count;
          this.qlNum = Math.floor((finish / count) * 10000)/100 + "%";
        }
        if (SD && SD) {
          let finish = SD.finish || 0;
          let count = SD.count || 0;
          if (finish && count && finish === count) {
            this.sdFinish = true;
          }
          allFinish += finish;
          allCount += count;
          this.sdNum = Math.floor((finish / count) * 10000)/100 + "%";
        }
        if (DL) {
          let finish = DL.finish || 0;
          let count = DL.count || 0;
          if (finish && count && finish === count) {
            this.dlFinish = true;
          }
          allFinish += finish;
          allCount += count;
          this.dlNum = Math.floor((finish / count) * 10000)/100 + "%";
        }
        if (LM) { // LM代表房建
          let finish = LM.finish || 0;
          let count = LM.count || 0;
          if (finish && count && finish === count) {
            this.lmFinish = true;
          }
          allFinish += finish;
          allCount += count;
          this.lmNum = Math.floor((finish / count) * 10000)/100 + "%";
        }
        let rate = 0;
        // 解决allcount为0时，计算出来的结果时NaN
        if(allCount != 0) {
          rate = Math.floor((allFinish / allCount) * 10000)/100;
        }
        let nFinish = 100 - rate;
        this.option.series[0].data[0].value = rate;
        this.option.series[0].data[1].value = nFinish;
        this.option.title.text = rate + "%";
      });
    },
  },
};
</script>
<style lang='scss' scoped>
  .progress_chart {
    height: 100%;
    background-color: #FFFFFF;
    border-radius: 15px;
  }

  .new_ui_header {
    display: flex;
    align-items: center;
    padding: 20px 0px 10px 20px;

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

  .content {
    height: calc(100% - 50px);
    display: flex;
    justify-content: space-between;

    .left_chart {
      width: 214px;


      .chart_box {
        width: 214px;
        height: 160px;
      }

      .text {
        text-align: center;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #2D405E;
      }

    }

    .right_process {
      margin-right: 32px;
      width: 380px;
      display: flex;
      flex-direction: column;

      .item {
        .header_text {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;

          .text {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #2D405E;
          }

          .ql {
            font-size: 18px;
            font-family: ShiShangZhongHeiJianTi;
            font-weight: 400;
            color: #5473E8;
          }

          .dl {
            font-size: 18px;
            font-family: ShiShangZhongHeiJianTi;
            font-weight: 400;
            color: #FEC03D;
          }

          .sd {
            font-size: 18px;
            font-family: ShiShangZhongHeiJianTi;
            font-weight: 400;
            color: #79D3FE;
          }
        }

        .line {
          width: 100%;
          background-color: #E4EDFD;
          height: 14px;
          position: relative;

          > div {
            position: absolute;
            left: 0;
            top: 0;
            height: 14px;
            border-radius: 0px 7px 7px 0px;
          }

          .noBorderRadius {
            border-radius: 0;
          }

          .actual_progress_ql {
            background: linear-gradient(86deg, #5473E8 0%, #6F8DFB 100%);
          }

          .actual_progress_lm {
            background: linear-gradient(86deg, #5473E8 0%, #6F8DFB 100%);
          }

          .actual_progress_dl {
            background: linear-gradient(86deg, #FDB92A 0%, #FED277 100%);
          }

          .actual_progress_sd {
            background: linear-gradient(86deg, #52C1F5 0%, #79D3FE 100%);
          }
        }
      }

      .item_dl {
        margin: 22px 0;
      }
    }
  }
</style>
