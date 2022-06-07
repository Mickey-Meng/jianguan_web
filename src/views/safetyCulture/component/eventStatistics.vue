<!--
 * @Descripttion:安全总览事件统计
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-25 14:11:56
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-06 11:04:43
-->
<template>
  <div class="event_statistics">
<!--    <div class="header">-->
<!--      <div class="title">-->
<!--        <div class="titleitem"></div>-->
<!--        <div class="title-text">事件统计</div>-->
<!--      </div>-->
<!--      <div class="check_box">-->
<!--        <el-radio v-model="radio" label="1" @change="changeSelect"-->
<!--          >近一个月</el-radio-->
<!--        >-->
<!--        <el-radio v-model="radio" label="3" @change="changeSelect"-->
<!--          >近三个月</el-radio-->
<!--        >-->
<!--      </div>-->
<!--    </div>-->
    <div class="new_ui_header">
      <div class="left">
        <div class="header_line"></div>
        <div class="header_text">事件统计</div>
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


    <div class="event_content">
      <v-chart :options="option" ref="schart" autoresize class="v-chart-box" />
    </div>
  </div>
</template>

<script>
import { getSafeEventsStatistic } from "@/api/safe";
export default {
  data() {
    return {
      radio: "1",
      series: [],
      x: [],
      info: {},
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {
          textStyle: {
            color: "#ffffff",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff",
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#46828F",
            },
          },
        },
        yAxis: {
          type: "category",
          data: [],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#fff",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#46828F",
            },
          },
        },
        series: [],
      },
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
      getSafeEventsStatistic(type).then((res) => {
        if (res.data && res.data.length > 0) {
          let safeType = [];
          let x = [];
          let data = res.data;
          let ar = data.filter((e) => e.name);
          ar.sort((a, b) => b.sort - a.sort);
          ar.forEach((item) => {
            x.push(item.name);
            if (item.object && item.object.length > 0) {
              item.object.forEach((a) => {
                safeType.push(a.safefirstname);
              });
            }
          });
          let newType = [...new Set(safeType)];
          this.series = [];
          this.info = [];
          let series = [];
          newType.forEach((m) => {
            let obj = {
              name: m,
              type: "bar",
              stack: "total",
              label: {
                show: true,
              },
              emphasis: {
                focus: "series",
              },
              barWidth: 25,
              data: [],
            };
            series.push(obj);
          });
          this.series = series;
          this.x = x;
          this.info = ar;
          this.disposeData();
        } else {
          this.$refs.schart.clear();
          this.option.yAxis.data = [];
          this.option.series = [];
        }
      });
    },
    disposeData() {
      this.$refs.schart.clear();
      let series = this.series;
      const init = function (d) {
        if (d.object || d.object.length == 0) {
          series.forEach((e) => {
            let obj = d.object.find((o) => o.safefirstname === e.name);
            if (obj) {
              e.data.push(obj.count);
            } else {
              e.data.push(null);
            }
          });
        }
      };
      let info = this.info;
      info.forEach((i) => {
        init(i);
      });
      this.option.yAxis.data = this.x;
      this.option.series = series;
    },
  },
};
</script>
<style lang='scss' scoped>
.event_statistics {
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
      ::v-deep.el-radio.is-checked{
        .el-radio__label {
          color: #2D405E;
        }
      }
    }


  }
  .event_content {
    height: calc(100% - 40px);
  }
}
</style>
