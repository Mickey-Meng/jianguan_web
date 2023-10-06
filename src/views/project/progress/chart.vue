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
        <div class="text" style="position: relative; top: -60px;">项目完成进度</div>
      </div>
      <div class="left_chart min" style="margin-right:10px;">
        <div class="chart_box" style="width:254px;height:254px;">
          <v-chart :options="option1" autoresize class="v-chart-box"/>
        </div>
        <div class="text">产值进度</div>
      </div>
      <div class="left_chart min" style="margin-left:10px;">
        <div class="chart_box" style="width:154px;height:154px;">
          <v-chart :options="option2" autoresize class="v-chart-box"/>
        </div>
        <div class="text">付款进度</div>
      </div>
      <div class="right_process" style="display:none;">
        <div class="item">
          <div class="header_text">
            <div class="text">道路进度</div>
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
          text: "0%",
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
          radius: ["58%", "86%"],
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
      },
      option1: {
        title: {
          text: "0%",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            color: "#1E6EEB",
            fontSize: "18",
          }
        },
        color: ["rgba(210,226,251, 1)"],
        series: [{
          name: "",
          type: "pie",
          // clockWise: true,
          radius: ["70%", "80%"],
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
            value: 4.6,
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
            value: 95.4
          }]
        }]
      },
      option2: {
        title: {
          text: "0%",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            color: "#F5B544",
            fontSize: "18",
          }
        },
        color: ["#F5B5441a"],
        series: [{
          name: "",
          type: "pie",
          // clockWise: true,
          radius: ["70%", "80%"],
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
            value: 6.6,
            name: "完成",
            itemStyle: {
              normal: {
                color: "#F5B544",
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
            value: 93.4
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
        const {QL, SD, DL, LM} = res.data; // LM代表道路
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
        if (LM) { // LM代表道路
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

      api.getEngCompany(this.project.id).then((res) => {
        let rate = res.data.productionProgress || 0
        let nFinish = 100 - rate;
        this.option1.series[0].data[0].value = rate;
        this.option1.series[0].data[1].value = nFinish;
        this.option1.title.text = rate + "%";


        rate = res.data.attachmentProgress || 0
        nFinish = 100 - rate;
        this.option2.series[0].data[0].value = rate;
        this.option2.series[0].data[1].value = nFinish;
        this.option2.title.text = rate + "%";
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
    padding: 10px 0px 10px 20px;
    background: #EAF1FF;
    border-radius: 4px 4px 0px 0px;
    margin-bottom: 10px;

    .header_line {
      width: 24px;
      height: 24px;
      background-color: #1E6EEB;
      margin-right: 8px;
      border-radius: 3px;
      background: url(../../../assets/image/datacenter_headericon3.svg) no-repeat;
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

  .content {
    height: calc(100% - 50px);
    display: flex;
    justify-content: space-between;

    .left_chart {
      width: 40%;

      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

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
        font-size: 12px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #040415;
      }

    }
    .left_chart.min {
      width: 20%;
      margin: 30px;
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
