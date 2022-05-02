<!--
 * @Descripttion:进度总览左下进度变化组件
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-26 15:46:52
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-07 18:15:12
-->
<template>
  <div class="allbg">
    <div class="header_g">
      <div class="title_item"></div>
      <div class="title_text">进度变化</div>
      <el-select v-model="type" @change="changeType">
        <el-option
          v-for="item in typeArr"
          :key="item.key"
          :value="item.key"
          :label="item.name"
        />
      </el-select>
    </div>
    <v-chart autoresize :options="option" class="charts"></v-chart>
  </div>
</template>

<script>
import echarts from "echarts";
import { getAreaProgress } from "@/api/progress";
export default {
  data() {
    return {
      typeArr: [
        {
          name: "桥梁",
          key: "QL",
        },
        {
          name: "隧道",
          key: "SD",
        },
        {
          name: "路面",
          key: "LM",
        },
        {
          name: "其他",
          key: "other",
        },
      ],
      type: "QL",
      option: {
        legend: {
          show: true,
          right: "auto",
          top: "2%",
          itemGap: 20,
          itemWidth: 15,
          itemHeight: 10,
          textStyle: {
            color: "#ffffff",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            label: {
              show: true,
              backgroundColor: "#fff",
              color: "#556677",
              borderColor: "rgba(0,0,0,0)",
              shadowColor: "rgba(0,0,0,0)",
              shadowOffsetY: 0,
            },
            lineStyle: {
              width: 0,
            },
          },
          backgroundColor: "#fff",
          textStyle: {
            color: "#5c6c7c",
          },
        },
        grid: {
          top: "10%",
          left: "10%",
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisLine: {
              lineStyle: {
                color: "#0173DA",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              textStyle: {
                color: "#FFFFFF",
              },
              // 默认x轴字体大小
              fontSize: 12,
              // margin:文字到x轴的距离
            },
            boundaryGap: false,
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#0173DA",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#0173DA",
              },
            },
            axisLabel: {
              textStyle: {
                color: "#FFFFFF",
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "#0173DA",
              },
            },
          },
          {
            type: "value",
            position: "right",
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#0173DA",
              },
              formatter: "{value}",
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#0173DA",
              },
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [],
      },
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  components: {},
  computed: {},
  methods: {
    changeType() {
      this.initData();
    },
    initData() {
      getAreaProgress(this.type).then((res) => {
        let data = res.data;
        let x = [];
        let series = [];
        let o = data[Object.keys(data)[0]];
        o.reverse();
        o.forEach((item) => {
          x.push(item.name);
        });
        for (let i in data) {
          let num = [];
          let lists = data[i];
          lists.reverse();
          if (lists && lists.length > 0) {
            lists.forEach((result) => {
              num.push(result.number);
            });
          }
          let obj = {
            name: i,
            type: "line",
            data: num,
            symbolSize: 1,
            symbol: "circle",
            smooth: true,
            yAxisIndex: 0,
            showSymbol: false,
            lineStyle: {
              width: 2,
              // color: "#00DAFF",
            },
          };
          series.push(obj);
        }
        this.option.series = series;
        this.option.xAxis[0].data = x;
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.allbg {
  .header_g {
    display: flex;
    align-items: center;
    position: relative;
    .el-select {
      position: absolute;
      right: 30px;
      // flex-basis: ;
    }
  }
  .charts {
    width: 100%;
    height: calc(100% - 40px);
  }
}
::v-deep .el-select {
  // width: 210px;
  text-indent: 0;
  //height: 35px !important;
  .el-input {
    .el-input__inner {
      height: 28px !important;
      line-height: 28px;
      // background-color: #060C26 !important;
      background-image: url("../../../../assets/image/日期选择.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: #fff;
      border: none;
    }
    input {
      background: transparent;
    }
    .el-input__suffix {
      .el-input__icon {
        line-height: 28px;
        color: #7ceff6;
      }
    }
  }
}
</style>
