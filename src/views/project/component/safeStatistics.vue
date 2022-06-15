<!--
 * @Descripttion:首页右下安全事件统计页面
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-24 16:04:41
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-03 10:24:00
-->
<template>
  <div class="safe_statistics">
    <div class="new_ui_header">
      <div class="left">
        <div class="header_line"></div>
        <div class="header_text">安全总览</div>
      </div>
      <div class="check_box">
        <el-radio v-model="radio" label="1" @change="changeSelect"
        >近一个月
        </el-radio
        >
        <el-radio v-model="radio" label="3" @change="changeSelect"
        >近三个月
        </el-radio
        >
      </div>
    </div>
    <ul class="content">
      <li v-for="(item, index) in chartsData" :key="index">
        <div class="c_title">{{ item.gongquname }}</div>
        <div class="c_main">
          <v-chart autoresize :options="item.option" class="charts"></v-chart>
        </div>
        <div class="c_footer">
          <div class="all_events">
            <span class="label">提出整改</span>
            <span class="value">{{ item.count }}<span class="text">起</span
            ></span>

          </div>
          <div class="finish_events">
            <span class="label">完成整改</span>
            <span class="value">{{ item.finish }}<span class="text">起</span
            ></span>
          </div>
          <div class="postpone_events">
            <span class="label">已逾期</span>
            <span class="value">{{ item.overdue }}<span class="text">起</span
            ></span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { merge } from "lodash";
import { getSafeChart } from "@/api/data";
import {mapGetters} from "vuex";
export default {
  props: {
    title: {
      type: String,
    },
  },
  data() {
    return {
      radio: "1",

      chartsData: [],
    };
  },
  created() {},
  mounted() {
    this.initData(1);
  },
  components: {},
  computed: {
    ...mapGetters(["project"])
  },
  methods: {
    changeSelect(val) {
      this.initData(val);
    },
    initData(type) {
      getSafeChart(type,this.project.id).then((res) => {
        let option = {
          title: [
            {
              text: "整改完成率",
              x: "center",
              top: "55%",
              textStyle: {
                color: "#2D405E",
                fontSize: 14,
                fontWeight: "500",
                fontFamily: "HuXiaoBo-NanShe"
              }
            },
            {
              text: "100%",
              x: "center",
              top: "40%",
              textStyle: {
                fontSize: "24",
                color: "#1E6EEB",
                fontFamily: "PingFang SC",
                foontWeight: "400"
              }
            }
          ],
          polar: {
            radius: ["83%", "75%"],
            center: ["50%", "50%"],
          },
          angleAxis: {
            max: 100,
            show: false,
          },
          radiusAxis: {
            type: "category",
            show: true,
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          color: ["rgba(210,226,251, 1)"],
          series: [
            {
              name: "",
              type: "pie",
              radius: ["62%", "76%"],
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
            }


          ]
        };
        let overdueList = res.data.overdueList;
        let total = res.data.total;
        if (total && total.length > 0) {
          total.forEach((item) => {
            if (overdueList && overdueList.length > 0) {
              let obj = overdueList.find((e) => e.gongquid === item.gongquid);
              if (obj) {
                item.overdue = obj.overdue;
              } else {
                item.overdue = 0;
              }
            } else {
              item.overdue = 0;
            }
            let obj = merge({}, option);
            let { count, finish } = item;
            let rate = Math.floor((finish / count) * 100);
            if (isNaN(rate)) {
              rate = 0;
            }
            if(finish && count){
              obj.series[0].data[0].value= rate;
              obj.series[0].data[1].value = 100 - rate;
              obj.title[1].text = rate + "%";
            }
            item.option = obj;
          });
        }
        this.chartsData = total;
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.safe_statistics {
  height: calc(100% - 3px);
  background-color: #FFFFFF;
  border-radius: 15px;


  .new_ui_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0px 5px 20px;

    .left {
      display: flex;
      align-items: center;

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

    .check_box {
      padding-right: 20px;
      display: flex;
      align-items: center;

      ::v-deep.el-radio {
        .el-radio__label {
          color: #85858F;
        }
      }

      ::v-deep.el-radio.is-checked {
        .el-radio__label {
          color: #2D405E;
        }
      }
    }


  }
  .content {
    height: calc(100% - 40px);
    display: flex;
    justify-content: space-around;
    li {
      width: 24%;
      .c_title {
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .c_main {
        height: calc(100% - 150px);

        .charts {
          width: 100%;
          height: 100%;
        }
      }
      .c_footer {
        //height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        div {
          width: 160px;
          padding: 0 5px;
          height: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 2px;

          .label {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #2D405E;
          }

          .value {
            font-family: ShiShangZhongHeiJianTi;

            .text {
              font-family: PingFang SC;
            }
          }
        }
        .all_events {
          background-color: rgba(30, 110, 235, .12);

          .value {
            color: #1E6EEB;
          }
        }
        .finish_events {
          background-color: rgba(82, 193, 245, .12);
          margin: 5px 0;

          .value {
            color: #52C1F5;
          }
        }
        .postpone_events {
          background-color: rgba(251, 98, 96, .12);

          .value {
            color: #FB6260;
          }
        }
      }
    }
  }
}
</style>
