<!--
@name:
@description: 首页安全文明
@author: 王海林
@time: 2022-05-12 17:30:40
@modifier:
@modifierTime:
-->
<template>
  <div class="index_safe_statistics">
    <div class="header">
      <div class="global_text_style" style="margin: 12px 0">安全文明</div>
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
    <ul class="nav_menu">
      <li v-for="(item) in lists" :key="item.gongquid" @click="initChart(item)"
          :class="{is_active_area:item.gongquid === currentAreaId}">{{ item.gongquname }}
      </li>
    </ul>
    <div class="chart_box">
      <div class="box">
        <v-chart autoresize :options="option" class="charts"></v-chart>
      </div>

    </div>
    <ul class="card_box">
      <li style="background-color:#FBD97F ">
        <div class="value">{{ count }}</div>
        <div class="text">提出整改(起)</div>
      </li>
      <li style="background-color:#B6E980 ">
        <div class="value">{{ finish }}</div>
        <div class="text">完成整改(起)</div>
      </li>
      <li style="background-color:#EE9090 ">
        <div class="value">{{ overdue }}</div>
        <div class="text">已逾期(起)</div>
      </li>
    </ul>

  </div>
</template>

<script>
  import {getSafeChart} from "@/api/data";
  import echarts from "echarts";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        radio: "1",
        currentAreaId: null,
        lists: [],
        enentData: [],
        count: null,
        finish: null,
        overdue: null,
        option: {
          grid: {
            left: "3%",
            right: "3%",
            bottom: "3%",
            containLabel: true
          },
          title: {
            text: "",
            textStyle: {
              fontWeight: "bold",
              fontSize: 38
            },
            subtext: "整改完成率",
            subtextStyle: {
              color: "#000000",
              fontSize:14
            },
            textAlign: "center",
            top: "15%",
            left: "34%"
          },
          series: [
            {
              name: "一般",
              type: "pie",
              //起始刻度的角度，默认为 90 度，即圆心的正上方。0 度为圆心的正右方。
              startAngle: 0,
              hoverAnimation: false,
              tooltip: {},
              radius: ["70%", "64%"],
              center: ["35%", "38%"],
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: 100,
                  itemStyle: {
                    normal: {
                      color: "rgba(80,150,224,0)"
                    }
                  }
                },
                {
                  value: 0,  // 渐变色部分
                  itemStyle: {
                    color: "rgba(244,180,68,1)"
                  }
                },
                {
                  value: 100, // 右侧部分
                  itemStyle: {
                    normal: {
                      color: "rgba(244,180,68,0.2)"
                    }
                  }
                }
              ]
            }
          ]
        }
      };
    },
    created() {
      this.init();
    },
    mounted() {
    },
    methods: {
      changeSelect() {
        this.init();
      },
      init() {
        getSafeChart(this.radio).then(res => {
          let data = res.data.total.filter(e => e.gongquname);
          this.lists = data;
          this.enentData = res.data.overdueList;
          this.initChart(data[0]);

        });
      },
      initChart(item) {
        this.currentAreaId = item.gongquid;
        let {count, finish} = item;
        if (count) {
          let obj = this.enentData.find(e => e.gongquid === item.gongquid);
          this.count = count;
          this.finish = finish;
          let num = count - finish;
          let rate = Math.floor((finish / count) * 100);
          this.option.title.text = rate + "%";
          this.option.series[0].data[0].value = count;
          this.option.series[0].data[1].value = finish;
          this.option.series[0].data[2].value = num;
          if (obj) {
            this.overdue = obj.overdue;
          } else {
            this.overdue = 0;
          }
        } else {
          this.count = 0;
          this.finish = 0;
          this.overdue = 0;
          this.option.title.text = "100%";
          this.option.series[0].data[0].value = 100;
          this.option.series[0].data[1].value = 0;
          this.option.series[0].data[2].value = 100;
        }
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .index_safe_statistics {
    height: 100%;
    padding: 5px 5px 25px 5px;
  }

  .header {
    display: flex;
    justify-content: space-between;
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
  }

  .nav_menu {
    display: flex;
    justify-content: space-around;
    overflow-x: auto;

    li {
      height: 34px;
      line-height: 34px;
      color: #85858F;
      border-radius: 20px;
      cursor: pointer;
      background-color: #FFFFFF;
      border: 1px solid #E8E8E8;
      padding: 0 10px;
    }

    .is_active_area {
      border: none;
      background: #F7F7F7;
      color: #3E69E2;
      border-radius: 20px;
    }
  }

  .chart_box {
    height: calc(100% - 210px);
    display: flex;
    justify-content: center;
    align-items: center;

    .box {
      width: 99%;
      height: 90%;
      border: 1px solid #E8E8E8;
      border-radius: 10px;
    }

    //border: 1px solid #E8E8E8;
  }

  .card_box {
    height: 140px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    li {
      //width: 33%;
      width: 125px;
      height: 125px;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: 600;

      .value {
        margin-bottom: 10px;
        font-size: 24px;
      }

      .text {
        font-size: 16px;
      }
    }
  }


</style>
