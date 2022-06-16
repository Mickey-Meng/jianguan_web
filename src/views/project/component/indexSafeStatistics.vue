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

    <div class="new_ui_header">
      <div class="left">
        <div class="header_line"></div>
        <div class="header_text">安全文明</div>
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
      <li style="background-color:rgba(253, 185, 42, .1) ">
        <div class="value" style="color: #FDB92A">{{ count }}</div>
        <div class="text">提出整改(起)</div>
      </li>
      <li style="background-color:rgba(30, 110, 235, .1) ">
        <div class="value" style="color: #1E6EEB">{{ finish }}</div>
        <div class="text">完成整改(起)</div>
      </li>
      <li style="background-color:rgba(251, 98, 96, .1) ">
        <div class="value" style="color: #FB6260">{{ overdue }}</div>
        <div class="text">已逾期(起)</div>
      </li>
    </ul>

  </div>
</template>

<script>
  import {getSafeChart} from "@/api/data";
  import {mapGetters} from "vuex";
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
              fontSize: 24,
              color:"#1E6EEB"
            },
            subtext: "整改完成率",
            subtextStyle: {
              color: "#2D405E",
              fontSize:14
            },
            // textAlign: "center",
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
              center: ["40%", "38%"],
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
                      color: "rgba(223,235,252,0)"
                    }
                  }
                },
                {
                  value: 0,
                  itemStyle: {
                    color: "rgba(30, 110, 235, 1)"
                  }
                },
                {
                  value: 100,
                  itemStyle: {
                    normal: {
                      color: "rgba(223,235,252,1)"
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
    computed: {
      ...mapGetters(["project"])
    },
    methods: {
      changeSelect() {
        this.init();
      },
      init() {
        getSafeChart(this.radio,this.project.id).then(res => {
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
    background-color: #FFFFFF;
    border-radius: 15px;
    //padding: 5px 5px 25px 5px;

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
      }


    }
  }


  .nav_menu {
    padding: 15px 0 5px 0;
    display: flex;
    justify-content: space-around;
    overflow-x: auto;

    li {
      padding: 0 20px;
      height: 28px;
      line-height: 28px;
      background: url("../../../assets/newUi/area_bg.png") no-repeat;
      background-size: 100% 100%;
      font-family: PingFang SC;
      font-weight: 500;
      color: #808EA9;
      cursor: pointer;
    }

    .is_active_area {
      background: url("../../../assets/newUi/area_active_bg.png") no-repeat;
      background-size: 100% 100%;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #1E6EEB;
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
      //border: 1px solid #E8E8E8;
      //border-radius: 10px;
    }
  }

  .card_box {
    height: 106px;
    display: flex;
    justify-content: space-around;
    align-items: center;

    li {
      //width: 33%;
      width: 138px;
      height: 106px;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: 600;

      .value {
        margin-bottom: 10px;
        font-size: 24px;
        font-family: HuXiaoBo-NanShen;
        font-weight: 400;
      }

      .text {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #2D405E;
      }
    }
  }


</style>
