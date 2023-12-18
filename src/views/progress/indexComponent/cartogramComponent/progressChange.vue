<!--
 * @Descripttion:进度总览左下进度变化组件
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-26 15:46:52
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-07 18:15:12
-->
<template>
  <div class="change_wrapper">
    <div class="new_ui_header">
      <div class="left">
        <div class="header_line"></div>
        <div class="header_text">进度变化</div>
      </div>
      <el-select v-model="type" @change="changeType" style="width: 200px;margin-right: 20px">
        <el-option v-for="item in typeArr" :key="item.key" :value="item.key" :label="item.name" />
      </el-select>
    </div>
    <v-chart autoresize :options="option" class="charts"></v-chart>
  </div>
</template>

<script>
import echarts from "echarts";
import { getAreaProgress } from "@/api/progress";
import { mapGetters } from "vuex";
import { getDicts } from "@/api/progress";

export default {
  data() {
    return {
      typeArr: [],
      typeArrMap: {},
      type: "",
      option: {
        legend: {
          show: true,
          right: "auto",
          top: "2%",
          itemGap: 20,
          itemWidth: 15,
          itemHeight: 10,
          textStyle: {
            color: "#2D405E",
          },
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            label: {
              show: true,
              backgroundColor: "#2D405E",
              color: "#556677",
              borderColor: "rgba(0,0,0,0)",
              shadowColor: "rgba(0,0,0,0)",
              shadowOffsetY: 0,
            },
            lineStyle: {
              width: 0,
            },
          },
          // backgroundColor: "#fff",
          textStyle: {
            color: "#FFFFFF",
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
                color: "#2D405E",
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
                color: "#2D405E",
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
        series: []
      },
    };
  },
  created() {
  },
  mounted() {
    getDicts('jg_gclx_all').then(res => {
      const data = res.data || [];
      const array = [];
      const obj1 = {};
      for(let i = 0; i <= data.length - 1; i++){
        const type = data[i];
          if (i === 0) {
            this.type = type.dictValue;
          }     
        const obj = {
          name: type.dictLabel,
          key: type.dictValue
        }
        array.push(obj);
        obj1[type.dictLabel] = type.dictValue;
      }
      this.typeArr = array;
      this.typeArrMap = obj1;

    }),

    this.initData();
    console.log(this)
  },
  components: {},
  computed: {
    ...mapGetters(["project"])
  },
  methods: {
    changeType() {
      this.initData();
    },
    initData() {
      getAreaProgress(this.type, this.project.id).then((res) => {
        let data = res.data;
        let x = [];
        let series = [];
        let o = data[Object.keys(data)[0]];
        o.forEach((item) => {
          x.push(item.name);
        });
        x.reverse();
        for (let i in data) {
          let num = [];
          let lists = data[i];
          // #612 lrj
          if (lists && lists.length > 0) {
            num = lists.map(res => { return res.number })
            num.reverse();
            // lists.forEach((result) => {
            //   num.push(result.number);
            // });
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
        console.log('000000', series[1])

        this.option.xAxis[0].data = x;
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.change_wrapper {
  height: 100%;
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

}

.charts {
  width: 100%;
  height: calc(100% - 40px);
}
</style>
