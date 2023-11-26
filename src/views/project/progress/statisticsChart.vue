<!--
 * @Descripttion:首页统计模式组件
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-25 11:24:18
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-15 16:07:32
-->
<template>
  <div class="statistics_chart_box">
    <div class="statistics_chart_box_top">
      <div class="chart_b">
        <v-chart
          :options="options"
          autoresize
          class="v-chart-box"
          ref="currentChart"
        />
      </div>
    </div>
    <div class="statistics_chart_box_bottom">
      <v-chart :options="bottomOption" autoresize class="v-chart-box"/>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import { getHomeChart, getHomeBottomChart } from "@/api/data";
import {merge} from "lodash";
import {mapGetters} from "vuex";
export default {
  props: {
    currentAreaInfo: {
      type: Object,
      default: () => {
      }
    },
    currentView: {
      type: String,
      default: () => "QL"
    },
  },
  data() {
    return {
      gongqu: null,
      currentRef: "",
      options: {},
      topData: [],
      bottomOption: {
        grid: {
          left: "30%",
          right: "4%",
          bottom: "10%",
          top: "12%"
          // containLabel: true,
        },
        legend: {
          show: true,
          orient: "horizontal",
          textStyle: {
            color: "#2D405E"
          },
          data: ["完成比例", "未完成比例"],
          left: "6%",
          top: "-5",
        },
        xAxis: [
          {
            type: "value",
            max: 100, // 设置最大值是多少
            splitNumber: 5, // 设置分几段显示
            axisLabel: {
              show: true,
              interval: "auto",
              formatter: "{value} %", // 给每个数值添加%
              textStyle: {
                color: "#000000",
                fontWeight: "normal",
                fontSize: "14",
              },
            },
            show: true,
          },
        ],
        yAxis: {
          type: "category",
          // data: ["桥面结构", "上部结构", "下部结构"],
          data: [],
          axisLabel: {
            inside: false,
            interval: 0,
            textStyle: {
              color: "#000000",
              fontWeight: "normal",
              fontSize: "14",
            },
          },
        },
        series: [
          {
            name: "完成比例",
            type: "bar",
            stack: "total",
            itemStyle: {
              normal: {
                color: "#6F8DFB"
              },
            },
            label: {
              show: true,
              position: "insideLeft", //在左边显示
              formatter: "{c}%", // 给计算后的数值添加%
            },
            emphasis: {
              focus: "series",
            },
            data: [100, 100, 100],
          },
          {
            name: "未完成比例",
            type: "bar",
            barWidth: "20",
            itemStyle: {
              normal: {
                color: "#FB6260"
              },
            },
            stack: "total",
            label: {
              show: true,
              position: "insideRight", // 在右边显示
              formatter: "{c}%",
            },
            emphasis: {
              focus: "series",
            },
            data: [0, 0, 0],
          },
        ],
      },
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
    bindEvents() {
      let that = this;
      this.$nextTick(() => {
        let dom = this.$refs.currentChart;
        if (dom) {
          dom.chart.on("click", params => {
            let code = params.name.substring(
              params.name.lastIndexOf("-") + 1
            );
            that.initBottomChart(code);
          });
        }
      });
    },
    initData() {
      if (this.currentAreaInfo) {
        let lists = this.currentAreaInfo.list;
        if (lists && lists.length > 0) {
          let option = {
            grid: {
              left: "3%",
              right: "4%",
              bottom: "15%",
              top: "10%",
              containLabel: true
            },
            tooltip: {},
            dataZoom: [
              {
                id: "dataZoomX",
                type: "slider",
                backgroundColor: "#F2F5F9",
                fillerColor: "#BFCCE3",
                showDataShadow: false,
                height: 13,
                right: 60,
                left: 60,
                bottom: 5,
                start: 0,
                end: 45,
                handleSize: "150%", // 手柄大小
                borderColor: "none",
                handleIcon:
                // "M0,0 v9.7h5 v-9.7h-5 Z", // 画一个长方形
                  "path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z", // 画一个圆形
                handleStyle: {
                  color: "#BFCCE3",
                  global: true, // 缺省为 false
                  shadowBlur: 6,
                  shadowColor: "rgba(123, 154, 204, 0.5)",
                  shadowOffsetX: 0, // 阴影偏移x轴多少
                  shadowOffsetY: 0 // 阴影偏移y轴多少
                }
              }
            ],
            yAxis: {
              type: "value",
              axisTick: {
                show: false
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#363e83"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#363e83 "
                }
              },
              axisLabel: {
                textStyle: {
                  color: "#000000",
                  fontWeight: "normal",
                  fontSize: "12"
                }
              }
            },
            xAxis: [
              {
                type: "category",
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: "#363e83"
                  }
                },
                axisLabel: {
                  inside: false,
                  interval: 0,
                  // rotate: 20,
                  formatter: function (value) {
                    let str = value.substring(0, value.lastIndexOf("-"));
                    return str;
                  },
                  textStyle: {
                    color: "#000000",
                    fontWeight: "normal",
                    fontSize: "12"
                  }
                },
                data: []
              }
            ],
            series: []
          };
          let colorList = [
            "#C1232B",
            "#B5C334",
            "#FCCE10",
            "#E87C25",
            "#27727B",
            "#FE8463",
            "#9BCA63",
            "#FAD860",
            "#F3A43B",
            "#60C0DD",
            "#D7504B",
            "#C6E579",
            "#F4E001",
            "#F0805A",
            "#26C0C0"
          ];
          let series = [];
          let gongqu = lists[0].projectcode;
          this.initBottomChart(gongqu);
          let obj = merge({}, option);
          series = [];
          let m = {
            data: [],
            type: "bar",
            barWidth: 30,
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                }
              }
            },
            label: {
              show: true,
              position: "top",
              formatter: "{c}"
            }
          };
          let x = [];
          let totalNum = [];
          lists.forEach((item) => {
            let {projectname, finish, total, projectcode} = item;
            let num = finish || 0;
            let to = total || 0;
            totalNum.push(to);
            x.push(projectname + "-" + projectcode);
            m.data.push(num);
          });
          if (lists.length <= 4) {
            obj.dataZoom[0].end = 100;
          }
          if (lists.length > 4) {
            obj.dataZoom[0].end = 10;
          }
          series.push(m);
          obj.tooltip = {
            trigger: "axis",
            formatter(params) {
              for (x in params) {
                let index = params[x].dataIndex;
                let total = totalNum[index];
                let rate = Math.floor((params[x].data / total) * 10000) / 100;
                let name = params[x].name.substring(
                  0,
                  params[x].name.lastIndexOf("-")
                );
                return name + "已完成比例" + ":" + rate + "%";
              }
            }
          };

          obj.xAxis[0].data = x;
          obj.series = series;
          this.options = obj;
          this.bindEvents();
        } else {
          this.bottomOption.series[1].data = [100, 100, 100];
          this.bottomOption.series[0].data = [];
          this.bottomOption.yAxis.data = [];
        }
      } else {
        this.bottomOption.series[1].data = [100, 100, 100];
        this.bottomOption.series[0].data = [];
        this.bottomOption.yAxis.data = [];

        this.options = {};
        // this.options.xAxis[0].data = []
        // this.options
      }
    },
    initBottomChart(id) {
      getHomeChart(id,this.project.id, this.currentView).then((res) => {
        let x = [];
        let count = [];
        let finishCount = [];
        if (res.data && res.data.length > 0) {
          res.data.forEach((item) => {
            let { list } = item;
            if (list && list.length > 0) {
              list.forEach((result) => {
                let { finish, sxname, projectname, total } = result;
                let num = finish || 0;
                let totaln = total || 0;
                let frate = Math.floor((num / totaln) * 10000) / 100;
                let nrate = 100 - frate;
                x.push(sxname);
                finishCount.push(frate);
                count.push(nrate);
              });
            }
            this.bottomOption.yAxis.data = x;
            this.bottomOption.series[0].data = finishCount;
            this.bottomOption.series[1].data = count;
          });
        } else {
            this.bottomOption.yAxis.data = [];
            this.bottomOption.series[0].data = [];
            this.bottomOption.series[1].data = [];
        }
      });
    },
  },
  watch: {
    currentAreaInfo: function () {
      this.initData();
    }
  },
};
</script>
<style lang='scss' scoped>
.statistics_chart_box {
  height: 100%;
  > div {
    height: 49%;
  }
  .statistics_chart_box_top {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .chart_b {
      width: 100%;
      height: 100%;
      .v-chart-box {
        height: calc(100% - 20px) !important;
      }
      .area_name {
        height: 20px;
        text-align: center;
        span {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
