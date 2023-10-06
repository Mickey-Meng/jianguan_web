<template>
  <el-container class="container-box">
    <el-header>
      <div class="btn-box">
        <div class="project_type">工程类型：</div>
        <el-select v-model="leftQuery.type" @change="engTypeChange">
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            :disabled="item.value === 'other'"
          />
        </el-select>
      </div>
      <div class="btn-box">
        <div style="margin: 0 0 0 5px">构件类型：</div>
        <el-select
          v-model="bridgeComponentType"
          placeholder="请选择"
          @change="bridgeTypeChange"
        >
          <el-option
            v-for="(item, index) in componentType[leftQuery.type]"
            :key="index"
            :label="item.name"
            :value="item.type"
          />
        </el-select>
        <div
          v-for="(item, index) in lists"
          :key="index"
          class="type-btn"
          :class="{ active: item.value === currentType }"
          @click="changeList(item.value)"
        >
          {{ item.name }}
        </div>
        <el-button type="primary">查询</el-button>
      </div>
      <!-- <el-date-picker
        v-model="timeValue"
        type="datetimerange"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      /> -->
    </el-header>
    <el-main>
      <el-row class="row-top" :gutter="10" type="flex">
        <el-col :span="12" class="row-top-left">
          <div class="box">
            <div class="header"><label>形象完成量</label></div>
            <div class="content">
              <div>
                <v-chart autoresize :options="activeOption" class="charts" />
              </div>
              <div>
                <v-chart autoresize :options="option" class="charts" />
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="roe-top-center">
          <div class="box">
            <div class="header"><label>计划完成量</label></div>
            <div class="content">
              <div>
                <v-chart
                  autoresize
                  :options="planFinishOption"
                  class="charts"
                />
              </div>
              <div>
                <v-chart autoresize :options="planOption" class="charts" />
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="row-bottom" :gutter="10" type="flex">
        <el-col :span="12" class="row-bottom-left">
          <div class="box">
            <div class="header">
              <label>分期完成量统计</label>
            </div>
            <div class="content">
              <div class="only-one">
                <v-chart
                  autoresize
                  :options="barOption"
                  class="charts"
                  v-show="fenqiValue"
                />
                <div
                  v-show="!fenqiValue"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                  "
                >
                  暂无数据
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="12" class="row-bottom-center">
          <div class="box">
            <div class="header"><label>累计完成量统计</label></div>
            <div class="content">
              <div class="only-one">
                <v-chart
                  autoresize
                  :options="lineOption"
                  class="charts"
                  v-show="leijiValue"
                />
                <div
                  v-show="!leijiValue"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                  "
                >
                  暂无数据
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <!-- <el-footer /> -->
  </el-container>
</template>

<script>
import {
  getFinishConponent,
  getComponentType,
  getCountConponent,
  getCountIncresConponent
} from "@/api/data";
import {mapGetters} from "vuex";
// import echarts from "echarts";

export default {
  name: "",
  data() {
    return {
      leijiValue: true, //累计有值显示图表
      fenqiValue: true,
      type: "1",
      way: "number", // amount
      projectCode: "QL", //当前工程类型
      //工程类型
      options: [
        {
          value: "QL",
          label: "桥梁工程",
        },
        {
          value: "LM",
          label: "道路工程",
        },
        {
          value: "SD",
          label: "隧道工程",
        },
        {
          value: "other",
          label: "其它工程",
        },
      ],
      //周月季
      lists: [
        {
          name: "周",
          value: "week",
        },
        {
          name: "月",
          value: "month",
        },
        {
          name: "季",
          value: "season",
        },
      ],
      componentType: {
        //所有工程的构件类型
        QL: [],
        SD: [],
        LM: [],
        other: [],
      },
      // bridgeType: [],
      bridgeComponentType: "all", //构件类型
      currentType: "month", //分期、累计完成按照周月季查询的条件
      leftQuery: {
        type: "QL",
        askTime: "",
        endtime: "",
        sttime: "",
      },
      timeValue: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      option: {
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "构件类型",
            type: "pie",
            radius: "50%",
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b} : {c} (个)",
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      },
      planOption: {
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "构件类型",
            type: "pie",
            radius: "50%",
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b} : {c} (个)",
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      },
      barOption: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        dataZoom: [
          {
            id: "dataZoomX",
            type: "slider",
            backgroundColor: "#F2F5F9",
            fillerColor: "#BFCCE3",
            showDataShadow: false,
            height: 13,
            // handleSize: 22,
            right: 60,
            left: 60,
            bottom: 15,
            start: 0,
            end: 40,
            handleSize: "200%", // 手柄大小
            borderColor: "none",
            handleIcon:
              // "M0,0 v9.7h5 v-9.7h-5 Z", // 画一个长方形
              "path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z", // 画一个圆形
            handleStyle: {
              color: "#BFCCE3",
              global: true, // 缺省为 false
              shadowBlur: 6,
              shadowColor: "rgba(123, 154, 204, 0.5)",
              shadowOffsetX: 0, // 阴影偏移x轴多少
              shadowOffsetY: 0, // 阴影偏移y轴多少
            },
          },
        ],
        grid: {
          top: 10,
          left: "3%",
          right: "4%",
          bottom: "15%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              show: true,
              rotate: 20,
              textStyle: {
                fontSize: 12,
              },
            },
            axisLine: {
              lineStyle: {
                color: "#000000",
                width: 1, // 这里是为了突出显示加上的
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#000000",
                width: 1, // 这里是为了突出显示加上的
              },
            },
          },
        ],
        series: [
          {
            type: "bar",
            barWidth: 30,
            barGap: 20,
            data: [],
            itemStyle: {
              normal: {
                color: "#5BB6FF",
              },
            },
          },
        ],
      },
      lineOption: {
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [],
        },
        tooltip: {
          trigger: "axis",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "line",
            itemStyle: {
              normal: {
                color: "#5BB6FF",
              },
            },
            areaStyle: {},
          },
        ],
      },
      activeOption: {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        title: [
          {
            show: true,
            text: "",
            subtext: "个",
            left: "center",
            top: "40%",
            textStyle: {
              color: "#0090E1",
              fontSize: "22",
            },
            subtextStyle: {
              color: "#000",
            },
          },
          {
            show: true,
            text: "0",
            left: "20%",
            top: "51%",
            textStyle: {
              color: "#000",
              fontSize: "14",
            },
          },
          {
            show: true,
            text: "20k",
            right: "18%",
            top: "51%",
            textStyle: {
              color: "#000",
              fontSize: "14",
            },
          },
        ],
        series: [
          {
            type: "gauge",
            radius: "100%",
            startAngle: 180, //开始角度
            endAngle: 0, //结束角度
            axisLine: {
              lineStyle: {
                width: 45,
                color: [
                  ["0", "#0090E1"],
                  ["1", "rgba(240, 242, 248, 1)"],
                ],
              },
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: "#0090E1",
                },
              },
            ],
            pointer: {
              show: false,
            },
            animationDuration: 4000,
          },
        ],
      },
      planFinishOption: {
        tooltip: {
          show: true,
        },
        title: [
          {
            show: true,
            text: "",
            subtext: "个",
            left: "center",
            top: "40%",
            textStyle: {
              color: "#0090E1",
              fontSize: "22",
            },
            subtextStyle: {
              color: "#000",
            },
          },
          {
            show: true,
            text: "0",
            left: "20%",
            top: "51%",
            textStyle: {
              color: "#000",
              fontSize: "14",
            },
          },
          {
            show: true,
            text: "",
            right: "18%",
            top: "51%",
            textStyle: {
              color: "#000",
              fontSize: "14",
            },
          },
        ],
        series: [
          {
            type: "gauge",
            radius: "100%",
            startAngle: 180, //开始角度
            endAngle: 0, //结束角度
            axisLine: {
              lineStyle: {
                width: 45,
                color: [
                  ["0", "#0090E1"],
                  ["1", "rgba(240, 242, 248, 1)"],
                ],
              },
            },
            axisLabel: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            itemStyle: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
                itemStyle: {
                  color: "#0090E1",
                },
              },
            ],
            pointer: {
              show: false
            },
            animationDuration: 4000
          },
        ],
      },
    };
  },
  created() {
  },
  computed: {
    ...mapGetters(["project"])
  },
  mounted() {
    //获取各类工程的构件类型
    getComponentType(this.project.id).then((res) => {
      const QL = res.data["桥梁工程"] || [];
      const SD = res.data["隧道工程"] || [];
      let LM = res.data["道路工程"] || [];
      let other = res.data["其它工程"] || [];
      const type = {
        type: "all",
        name: "所有类型"
      };
      QL.unshift(type);
      SD.unshift(type);
      LM.unshift(type);
      other.unshift(type);
      this.componentType = {
        QL: QL,
        SD: SD,
        LM: LM,
        other: other,
      };
      this.initData();
      this.initBottomData();
    });
  },
  methods: {
    initData() {
      let obj = Object.assign({}, this.leftQuery);
      obj.projectId = this.project.id;
      getFinishConponent(obj).then((res) => {
        const {act, plan} = res.data;
        const finishNum = act.finish;
        const allCount = act.count;
        let aRate = Math.floor((finishNum / allCount) * 10000) / 100;
        this.activeOption.series[0].data[0].value = aRate;
        this.activeOption.title[0].text = finishNum;
        this.activeOption.series[0].axisLine.lineStyle.color = [
          [finishNum / allCount, "#0090E1"],
          ["1", "rgba(240, 242, 248, 1)"]
        ];
        let acAllText = "";
        if (allCount > 10000) {
          acAllText = allCount / 1000 + "K";
        } else {
          acAllText = allCount;
        }
        this.activeOption.title[2].text = acAllText;

        const planFinishNum = plan.finish;
        const planAll = plan.count;
        let prate = Math.floor((planFinishNum / planAll) * 10000) / 100;
        this.planFinishOption.series[0].data[0].value = prate;
        this.planFinishOption.title[0].text = planFinishNum;
        this.planFinishOption.series[0].axisLine.lineStyle.color = [
          [planFinishNum / planAll, "#0090E1"],
          ["1", "rgba(240, 242, 248, 1)"],
        ];
        let plAllText = "";
        if (planAll > 10000) {
          plAllText = planAll / 1000 + "K";
        } else {
          plAllText = planAll;
        }
        this.planFinishOption.title[2].text = plAllText;

        //判断mapData是否为空
        const arr = [];
        const planArr = [];
        let acData = act.mapData;
        let acArr = Object.keys(acData);
        if (acArr.length > 0) {
          let data = acData[this.leftQuery.type];
          data.forEach((item) => {
            arr.push({
              value: item.count,
              name: item.name,
            });
          });
        }
        //yangaogao 20230923 产品说先用act对象。由于是map对象，若act plan返回同一个map则会返回引用类型暂时不好解决。所以前端直接获取act即可
        // let plData = plan.mapData;
        let plData = act.mapData;
        let plArr = Object.keys(plData);
        if (plArr.length > 0) {
          let data = plData[this.leftQuery.type];
          data.forEach((item) => {
            planArr.push({
              value: item.count,
              name: item.name,
            });
          });
        }
        this.option.series[0].data = arr;
        this.planOption.series[0].data = planArr;
      });
    },
    changeList(val) {
      if (this.currentType != val) {
        this.currentType = val;
        this.initBottomData();
      }
    },
    bridgeTypeChange() {
      this.initBottomData();
    },
    initBottomData() {
      const obj = {
        projectCode: this.leftQuery.type,
        type: this.currentType,
        conponentType: this.bridgeComponentType,
        projectId: this.project.id
      };
      getCountConponent(obj).then((res) => {
        if (res.data.length > 0) {
          this.fenqiValue = true;
          this.disposeData(res.data);
        } else {
          this.barOption.xAxis[0].data = [];
          this.barOption.series[0].data = [];
          this.fenqiValue = false;
        }
      });
      getCountIncresConponent(obj).then((res) => {
        const x = [];
        const s = [];
        const data = res.data;
        // const data = res.data.reverse();
        if (data && data.length > 0) {
          this.leijiValue = true;
          data.forEach((item) => {
            x.push(item.name);
            s.push(item.count);
          });
          this.lineOption.xAxis.data = x;
          this.lineOption.series[0].data = s;
        } else {
          this.leijiValue = false;
          this.lineOption.xAxis.data = x;
          this.lineOption.series[0].data = s;
        }
      });
    },
    disposeData(data) {
      const x = [];
      const s = [];
      if (data && data.length > 0) {
        data.forEach((item) => {
          x.push(item.name);
          s.push(item.count);
        });
        this.barOption.xAxis[0].data = x;
        this.barOption.series[0].data = s;
      }
    },
    //工程类型变化的时候更新左侧两个图表的数据
    engTypeChange() {
      this.bridgeComponentType = "all";
      this.initData();
      this.initBottomData();
    },
  },
};
</script>

<style scoped lang="scss">
.container-box {
  color: #000000;
  //background-color: #ebecee;
  //padding: 0 5px;

  .el-header {
    line-height: 60px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    ul {
      display: flex;
      margin-right: 10%;

      li {
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 150px;
        border: 1px solid rgb(51, 133, 255);
        cursor: pointer;
      }

      .active {
        color: #ffffff;
        background-color: rgb(51, 133, 255);
      }
    }
    .btn-box {
      // margin: 0 10px;
      width: 50%;
      display: flex;
      align-items: center;
      .type-btn {
        width: 60px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        margin: 0 5px;
        border-radius: 2px;
        border: 1px solid rgb(56, 122, 253);
        cursor: pointer;
      }
      .active {
        background: rgb(56, 122, 253);
        color: #ffffff;
      }
    }
    .el-select {
      margin: 0 5px;
      width: 220px;
    }
    .el-button {
      margin-left: 10px;
    }
  }

  .el-main {
    padding: 0;
    margin: 10px -5px 0 -5px;
    display: flex;
    // flex-direction: column;
    justify-content: space-between;

    .el-row {
      height: 100%;
      width: 50%;
      margin: 0 !important;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .el-col {
        height: 49%;
        width: 100%;
        box-sizing: border-box;
        .box {
          height: 100%;
          background-color: #ffffff;

          .header {
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;

            label {
              font-size: 22px;
            }
          }

          .content {
            height: calc(100% - 50px);
            display: flex;

            > div {
              width: 50%;

              .charts {
                width: 100%;
                height: 100%;
              }
            }
            .only-one {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>
