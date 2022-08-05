<!--
@name:
@description: 进度管理
@author: 王海林
@time: 2022-08-03 16:02:25
@modifier:
@modifierTime:
-->
<template>
  <div class="schedule_management">
    <div class="header">
      <img src="../../../../assets/mapView/进度管理.png" alt="">
      <div class="important_point">项目重要节点</div>
    </div>
    <div class="content">
      <div class="project_num">
        <div>
          <div class="value">22</div>
          <div class="label">项目总数(个)</div>
        </div>
        <div>
          <div class="value">75</div>
          <div class="label">关键节点(个)</div>
        </div>
      </div>
      <div class="chart_wrapper">
        <v-chart :options="option" autoresize class="v-chart-box"/>
      </div>
    </div>

  </div>
</template>

<script>
  let nameList = ["诸暨店口湄池大桥改建工程", "诸暨市枫桥镇虎山隧道建设工程", "诸暨市店口综合港区工程", "235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程"];
  let colorList = ["#D3B020", "#479C39", "#FF8A40", "#729AE0"];
  export default {
    props: [],
    watch: {},
    data() {
      return {
        option: {
          xAxis: {
            // max: total,
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          grid: {
            left: "1%",
            top: "10%", // 设置条形图的边距
            right: "15%",
            bottom: "5%"
          },
          yAxis: [
            {
              type: "category",
              inverse: false,
              data: nameList,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
            }
          ],
          series: [
            {
              // 内
              type: "bar",
              barWidth: 16,
              // silent: true,
              label: {
                normal: {
                  formatter: (item) => {
                    return item.name;
                  },
                  textStyle: {
                    color: "#FFFFFF",
                    fontSize: 12
                  },
                  position: ["0", "-15px"],
                  show: true
                }
              },
              data: [],
              z: 1,
              animationEasing: "elasticOut"
            },
            {
              // 分隔
              type: "pictorialBar",
              itemStyle: {
                normal: {
                  color: "#020b3f"
                }
              },
              symbolRepeat: "fixed",
              symbolMargin: 1,
              symbol: "rect",

              symbolClip: false,
              symbolSize: [1, 17],
              symbolPosition: "start",
              symbolOffset: [3, -2],
              symbolBoundingData: 100,
              data: [100, 100, 100, 100],
              z: 2,
              animationEasing: "elasticOut"
            },
            {
              // label
              type: "pictorialBar",
              symbolBoundingData: 100,

              itemStyle: {
                normal: {
                  color: "none"
                }
              },
              label: {
                normal: {
                  formatter: (params) => {
                    let emue = ["yellow", "red", "purple", "green", "blue"];
                    return `{${emue[params["dataIndex"]]}|${((params["data"] * 100) / 100).toFixed(2)}%}`;
                  },
                  rich: {
                    green: {
                      color: "#729AE0"
                    },
                    blue: {
                      color: "#008AFF"
                    },
                    purple: {
                      color: "#FF8A40"
                    },
                    red: {
                      color: "#479C39"
                    },
                    yellow: {
                      color: "#FFC949"
                    }
                  },
                  // position: "right",
                  position: ["100%", "-2px"],
                  offset: [0, -3],
                  // distance: 10, // 向右偏移位置
                  show: true
                }
              },
              data: [],
              z: 0
            }
          ]
        }
      };
    },
    created() {
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        let valueLists = [31.3, 52, 4.2, 40];
        let category = nameList.map((item, index) => {
          return {
            value: valueLists[index],
            itemStyle: {
              color: colorList[index]
            }
          };
        });
        let datas = [];
        category.forEach((value) => {
          datas.push(value.value);
        });
        this.option.series[0].data = category;
        this.option.series[2].data = datas;

      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .schedule_management {
    height: 100%;

    .header {
      height: 50px;
      background: url("../../../../assets/mapView/面板头部背景.png") no-repeat;
      background-size: 100% 100%;
      margin-bottom: 10px;
      display: flex;
      padding-left: 56px;
      align-items: center;

      .important_point {
        margin-left: 12px;
        height: 28px;
        font-size: 20px;
        font-family: CKTKingKong;
        color: #FFFFFF;
        line-height: 24px;
        text-shadow: 0px 1px 5px rgba(13, 88, 228, .5);
        background: linear-gradient(180deg, #FFFFFF 10%, #0D58E4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .content {
      height: calc(100% - 60px);
      background: url("../../../../assets/mapView/面板内容背景.png") no-repeat;
      background-size: 100% 100%;
      padding: 20px 20px 0 20px;

      .project_num {
        height: 27%;
        display: flex;
        justify-content: space-between;

        > div {
          width: 180px;
          background: url("../../../../assets/mapView/计划背景.png") no-repeat;
          background-size: 100% 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .label {
            height: 24px;
            font-size: 14px;
            font-family: AlibabaPuHuiTiB;
            color: #FFFFFF;
            line-height: 24px;
            margin-top: 5px;
          }

          .value {
            height: 32px;
            font-size: 32px;
            font-family: DINPro-Bold, DINPro;
            font-weight: bold;
            color: #34C5C9;
            line-height: 41px;
            background: linear-gradient(180deg, #FFFFFF 70%, #2861F6 80%, #2861F6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }

      }

      .chart_wrapper {
        height: 73%;
      }
    }
  }

</style>
