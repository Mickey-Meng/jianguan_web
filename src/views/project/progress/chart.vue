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
    <div class="total">
      <div class="chart">
        <dv-percent-pond :config="config" style="width: 280px; height: 40px" />
      </div>
      <div>总体投资进度</div>
    </div>
    <div class="bridge">
      <div class="charts">
        <v-chart :options="option" autoresize class="v-chart-box" />
      </div>
      <div>桥梁进度</div>
    </div>
    <div class="road">
      <div class="charts">
        <v-chart :options="roadOption" autoresize class="v-chart-box" />
      </div>
      <div>道路进度</div>
    </div>
    <div class="tunneling">
      <div class="charts">
        <v-chart :options="sdOption" autoresize class="v-chart-box" />
      </div>
      <div>隧道进度</div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import * as api from "@/api/data";
import { merge } from "lodash";
export default {
  data() {
    return {
      config: {
        value: 0,
      },
      option: {},
      roadOption: {},
      sdOption: {},
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  components: {},
  computed: {},
  methods: {
    initData() {
      api.getMiddleData().then((res) => {
        const { QL, SD, DL } = res.data;
        const obj = {
          title: {
            textStyle: {
              color: "#28BCFE",
              fontSize: 22,
            },
            subtext: "",
            subtextStyle: {
              color: "#0de6a4",
              fontSize: 20,
            },
            itemGap: 20,
            left: "center",
            top: "25%",
          },
          tooltip: {
            formatter: function (params) {
              return `<span style="color: #fff;">${params.value}%</span>`;
            },
          },
          angleAxis: {
            max: 100,
            clockwise: true, // 逆时针
            // 隐藏刻度线
            show: false,
          },
          radiusAxis: {
            type: "category",
            show: true,
            axisLabel: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          polar: {
            center: ["50%", "50%"],
            radius: "130%", // 图形大小
          },
          series: [
            {
              type: "bar",
              data: [],
              showBackground: true,
              backgroundStyle: {
                color: "#BDEBFF",
              },
              coordinateSystem: "polar",
              roundCap: true,
              barWidth: 10,
              itemStyle: {
                normal: {
                  opacity: 1,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#25BFFF",
                    },
                    {
                      offset: 1,
                      color: "#5284DE",
                    },
                  ]),
                  shadowBlur: 5,
                  shadowColor: "#2A95F9",
                },
              },
            },
          ],
        };
        // this.engineering = res.data;
        // const ql = Object.assign({}, obj);
        let ql = merge({}, obj);
        let dl = merge({}, obj);
        let sd = merge({}, obj);
        let qlnum = 0,
          dlnum = 0,
          sdnum = 0,
          allCount = 0,
          allFinish = 0;
        if (QL) {
          let finish = QL.finish || 0;
          let count = QL.count || 0;
          allFinish += finish;
          allCount += count;
          qlnum = Math.floor((finish / count) * 100);
        }
        if (SD && SD) {
          let finish = SD.finish || 0;
          let count = SD.count || 0;
          allFinish += finish;
          allCount += count;
          sdnum = Math.floor((finish / count) * 100);
        }
        if (DL) {
          let finish = DL.finish || 0;
          let count = DL.count || 0;
          allFinish += finish;
          allCount += count;
          dlnum = Math.floor((finish / count) * 100);
        }

        ql.title.subtext = `${qlnum}%`;
        ql.series[0].data = [qlnum];

        dl.title.subtext = `${dlnum}%`;
        dl.series[0].data = [dlnum];

        sd.title.subtext = `${sdnum}%`;
        sd.series[0].data = [sdnum];
        this.option = ql;
        this.roadOption = dl;
        this.sdOption = sd;

        let globalRate = Math.floor((allFinish / allCount) * 100);
        this.config.value = globalRate;
        this.config = { ...this.config };
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.progress_chart {
  height: 150px;
  padding: 0 10px;
  display: flex;
  width: 100%;
  .chart {
    height: calc(100% - 20px);
    padding-top: 50px;
  }
  .charts {
    height: calc(100% - 20px);
  }
  > div {
    flex: 1;
    text-align: center;
    font-size: 18px;
    line-height: 18px;
    font-weight: 600;
  }
}
</style>
