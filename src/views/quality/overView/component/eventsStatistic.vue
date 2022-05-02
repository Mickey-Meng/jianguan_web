<!--
 * @Descripttion:安全总览事件统计
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-25 14:11:56
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-01 17:55:47
-->
<template>
  <div class="allbg event_statistics">
    <div class="header">
      <div class="title">
        <div class="titleitem"></div>
        <div class="title-text">事件统计</div>
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
    <div class="event_content">
      <v-chart :options="option" ref="qchart" autoresize class="v-chart-box" />
    </div>
  </div>
</template>

<script>
import { getQualityEventsStatistic } from "@/api/quality";
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
      getQualityEventsStatistic(type).then((res) => {
        if (res.data && res.data.length > 0) {
          let safeType = [];
          let x = [];
          let data = res.data;
          data.sort((a, b) => b.sort - a.sort);
          data.forEach((item) => {
            x.push(item.name);
            if (item.object && item.object.length > 0) {
              item.object.forEach((a) => {
                safeType.push(a.safefirstname);
              });
            }
          });
          let newType = [...new Set(safeType)];
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
          this.info = data;
          this.disposeData();
        } else {
          this.$refs.qchart.clear();
          this.option.yAxis.data = [];
          this.option.series = [];
        }
      });
    },
    disposeData() {
      let series = this.series;
      const init = function (d) {
        if (d.object && d.object.length > 0) {
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
  .event_content {
    height: calc(100% - 40px);
  }
}
</style>
