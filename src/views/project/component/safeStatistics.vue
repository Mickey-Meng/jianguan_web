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
    <div class="header">
      <div class="title">
        <div class="titleitem"></div>
        <div class="title-text">{{ title }}</div>
      </div>
      <div class="check_box">
        <el-radio v-model="radio" label="1" @change="changeSelect"
          >近一个月</el-radio
        >
        <el-radio v-model="radio" label="3" @change="changeSelect"
          >近三个月</el-radio
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
            提出整改<span>{{ item.count }}</span
            >起
          </div>
          <div class="finish_events">
            完成整改<span>{{ item.finish }}</span
            >起
          </div>
          <div class="postpone_events">
            已逾期<span>{{ item.overdue }}</span
            >起
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import echarts from "echarts";
import { merge } from "lodash";
import { getSafeChart } from "@/api/data";
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
  computed: {},
  methods: {
    changeSelect(val) {
      this.initData(val);
    },
    initData(type) {
      getSafeChart(type).then((res) => {
        let option = {
          title: [
            {
              text: "整改完成率",
              x: "center",
              top: "40%",
              textStyle: {
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: "100",
              },
            },
            {
              text: "",
              x: "center",
              top: "50%",
              textStyle: {
                fontSize: "18",
                color: "#FFFFFF",
                fontFamily: "DINAlternate-Bold, DINAlternate",
                foontWeight: "600",
              },
            },
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
              show: false,
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
          },
          series: [
            {
              name: "",
              type: "bar",
              roundCap: true,
              barWidth: 90,
              showBackground: true,
              backgroundStyle: {
                color: "rgba(66, 66, 66, .3)",
              },
              data: [],
              coordinateSystem: "polar",

              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: "#16CEB9",
                    },
                    {
                      offset: 1,
                      color: "#6648FF",
                    },
                  ]),
                },
              },
            },
            {
              name: "",
              type: "pie",
              startAngle: 80,
              radius: ["86%"],
              hoverAnimation: false,
              center: ["50%", "50%"],
              itemStyle: {
                color: "rgba(66, 66, 66, .1)",
                borderWidth: 1,
                borderColor: "#5269EE",
              },
              data: [100],
            },
            {
              name: "",
              type: "pie",
              startAngle: 80,
              radius: ["72%"],
              hoverAnimation: false,
              center: ["50%", "50%"],
              itemStyle: {
                color: "rgba(66, 66, 66, .1)",
                borderWidth: 1,
                borderColor: "#5269EE",
              },
              data: [100],
            },
          ],
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
            obj.series[0].data = [rate];
            item.option = obj;
            obj.title[1].text = rate + "%";
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
  height: 100%;
  background-image: url(../../../assets/image/边框-大.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    .title {
      display: flex;
      align-items: center;
      height: 40px;
      .titleitem {
        width: 2px;
        height: 15px;
        background: #4f71ff;
        margin-left: 16px;
        margin-right: 12px;
      }
      .title-text {
        font-size: 16px;
        font-family: PingFangSC;
        font-weight: 600;
        color: #ffffff;
      }
    }
    .check_box {
      padding-right: 20px;
      display: flex;
      align-items: center;
      ::v-deep.el-radio {
        .el-radio__label {
          color: #ffffff;
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
      // border: 1px solid #4f71ff;
      .c_title {
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .c_main {
        height: calc(100% - 120px);
        .charts {
          width: 100%;
          height: 100%;
        }
      }
      .c_footer {
        height: 70px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        div {
          font-size: 12px;
          span {
            font-size: 22px;
            margin: 0 3px;
          }
        }
        .all_events {
          span {
            color: #f5f512;
          }
        }
        .finish_events {
          span {
            color: #14f314;
          }
        }
        .postpone_events {
          span {
            color: #F5400A;
          }
        }
      }
    }
  }
}
</style>
