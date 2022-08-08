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
          <!--      <img src="../../../../assets/mapView/进度管理.png" alt="">-->
          <div class="important_point" :class="{isActive:currentKey==='1'}" @click="changeView('1')">进度管理</div>
          <div class="important_point" :class="{isActive:currentKey==='2'}" @click="changeView('2')">项目重要节点</div>
      </div>
      <div class="content" :class="{isTable:currentKey==='2'}">
          <div class="project_num" v-if="currentKey === '1'">
              <div>
                  <div class="value">22</div>
                  <div class="label">项目总数(个)</div>
              </div>
              <div>
                  <div class="value">75</div>
                  <div class="label">关键节点(个)</div>
              </div>
          </div>
          <div class="chart_wrapper" v-if="currentKey === '1'">
              <v-chart :options="option" autoresize class="v-chart-box"/>
          </div>

          <el-table
                  v-if="currentKey === '2'"
                  :data="tableData"
                  height="calc(100% - 20px)"
                  class="quality_safety"
                  style="width: 100%">
              <el-table-column
                      prop="a"
                      align="center"
                      show-overflow-tooltip
                      label="项目名称">
              </el-table-column>
              <el-table-column
                      prop="b"
                      align="center"
                      width="100"
                      label="关键节点">
              </el-table-column>
              <el-table-column
                      prop="c"
                      width="110"
                      label="日期">
              </el-table-column>
          </el-table>
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
          currentKey: "1",
          tableData: [
              {
                  a: "235国道杭州至诸暨公路萧山河上至诸暨安",
                  b: "新建",
                  c: "2021.01.23"
              },
              {
                  a: "诸暨市店口综合港区工程",
                  b: "新建",
                  c: "2021.01.23"
              },
              {
                  a: "诸暨市枫桥镇虎山隧道建设工程",
                  b: "新建",
                  c: "2021.01.23"
              },
              {
                  a: "诸暨店口湄池大桥改建工程",
                  b: "新建",
                  c: "2021.01.23"
              },
              {
                  a: "诸暨市枫桥镇虎山隧道建设工程",
                  b: "新建",
                  c: "2021.01.23"
              },
              {
                  a: "诸暨店口湄池大桥改建工程",
                  b: "新建",
                  c: "2021.01.23"
              }
          ],
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
                      }
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

      },
        changeView(key) {
            this.currentKey = key;
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
        cursor: pointer;
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

      .isActive {
        color: #FFFFFF;
        line-height: 24px;
        //text-shadow: 0px 1px 5px rgba(13, 88, 228, .5);
        text-shadow: unset;
        background: linear-gradient(180deg, #FFFFFF 40%, #0D58E4 90%, #0D58E4 100%);
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
    .isTable{
      padding: 0 20px 0 20px;
    }
  }

  ::v-deep .quality_safety {
    border: none;
    background-color: transparent;

    &:before {
      background-color: transparent;
    }

    tr {
      background-color: transparent !important;

      &:hover,
      &.hover-row,
      &.current-row {
        td {
          background-color: transparent !important;
        }
      }
    }

    th {
      background-color: transparent !important;
    }

    th.el-table__cell {
      background-color: transparent;

    }

    td {
      border-bottom: none;
    }

    td.el-table__cell {
      border-bottom: none;
    }

    .el-table__header-wrapper {

      .el-table__header {
        thead {
          th {
            padding: 12px 0;
            line-height: 14px;

            .cell {
              line-height: 14px;
              font-size: 12px;
              font-weight: bold;
              font-family: AlibabaPuHuiTiB;
              color: #FFFFFF;
            }

            border-bottom: none;
          }
        }
      }
    }

    .el-table__body {
      -webkit-border-vertical-spacing: 10px; // 垂直间距 设置的是行间距
      tbody {
        font-size: 14px;
        font-weight: 400;
        color: #FFFFFF;

        tr {
          background: url("../../../../assets/mapView/行背景.png") no-repeat;
          background-size: 100% 100%;

          td {
            padding: 0;
            height: 40px;
            line-height: 40px;
          }
        }

      }
    }

    .el-table__body-wrapper {
      overflow-y: hidden;

      &:hover {
        overflow-y: auto;
      }

      &::-webkit-scrollbar {
        width: 6px !important;
        height: 6px !important;
        background-color: transparent;
      }

      /**
  * 滚动条的滑块
  */
      &::-webkit-scrollbar-thumb {
        background-color: #194BCC;
        //background-color: #0f88d2;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
      }

      &::-webkit-scrollbar-track {
        //background-color: #0e4f94;
        background-color: #3C5189;
        border-radius: 0px;
        -webkit-box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
