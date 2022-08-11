<template>
  <div class="wrapper">
    <div class="left">
      <div class="header">
        <div class="header-left">
          <el-button
            size="mini"
            v-for="(item, index) in btns"
            :key="index"
            @click="changeView(item.key)"
            :class="{ active: item.key === currentKey }"
            >{{ item.name }}
          </el-button>
        </div>
        <div class="header-right">
          <ul v-if="currentKey === 'monitoring'">
            <li>
                <span>正常运行</span><span>{{ inLine || 0 }}</span>
            </li>
              <li><span>离线设备</span><span>{{ outLine || 0 }}</span></li>
          </ul>
          <el-button size="mini" v-if="currentKey === 'record'"
            >导出记录</el-button
          >
          <div class="box" v-if="currentKey === 'statistics'">
            <div
              @click="changeNoise('raiseDust')"
              :class="{ 'current-mon': mnitoringType === 'raiseDust' }"
            >
              扬尘监测
            </div>
            <div
              @click="changeNoise('noise')"
              :class="{ 'current-mon': mnitoringType === 'noise' }"
            >
              噪声监测
            </div>
          </div>
          <div class="trend-box" v-if="currentKey === 'trend'">
            <span>位置：</span>
            <el-select
              v-model="siteKey"
              style="width: 220px"
              @change="equipmentChange"
            >
              <el-option
                v-for="item in siteArr"
                :key="item.id"
                :value="item.code"
                :label="item.name"
              ></el-option>
            </el-select>
            <span>日期：</span>
            <el-date-picker
              v-model="timeValue"
              type="date"
              @change="timeChange"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :clearable="false"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="trend-box" v-if="currentKey === 'trend'">
          <div>
            <v-chart autoresize :options="option" class="charts"></v-chart>
          </div>
          <div>
            <v-chart autoresize :options="optionS" class="charts"></v-chart>
          </div>
          <div>
            <v-chart autoresize :options="optionT" class="charts"></v-chart>
          </div>
        </div>
        <el-table
          :data="raiseData"
          height="100%"
          key="raiseDust"
          class="small_scrolling"
          style="width: 100%"
          v-if="currentKey === 'statistics' && mnitoringType === 'raiseDust'"
          :header-cell-style="cellStyle"
        >
          <el-table-column
            prop="name"
            label="监测点"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div>{{ row.pm25.type }}</div>
              <div>{{ row.pm10.type }}</div>
            </template>
          </el-table-column>
          <el-table-column label="优" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div>
                <span class="one">{{ row.pm25.one ? row.pm25.one : 0 }}</span
                >天
              </div>
              <div>
                <span class="one">{{ row.pm10.one ? row.pm10.one : 0 }}</span
                >天
              </div>
            </template>
          </el-table-column>
          <el-table-column label="良" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div>
                <span class="two">{{ row.pm25.two ? row.pm25.two : 0 }}</span
                >天
              </div>
              <div>
                <span class="two">{{ row.pm10.two ? row.pm25.two : 0 }}</span
                >天
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="轻度污染"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <div>
                <span class="three">{{
                  row.pm25.three ? row.pm25.three : 0
                }}</span
                >天
              </div>
              <div>
                <span class="three">{{
                  row.pm10.three ? row.pm25.three : 0
                }}</span
                >天
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="中度污染"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <div>
                <span class="four">{{ row.pm25.four ? row.pm25.four : 0 }}</span
                >天
              </div>
              <div>
                <span class="four">{{ row.pm10.four ? row.pm25.four : 0 }}</span
                >天
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="重度污染"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <div>
                <span class="five">{{ row.pm25.five ? row.pm25.five : 0 }}</span
                >天
              </div>
              <div>
                <span class="five">{{ row.pm10.five ? row.pm25.five : 0 }}</span
                >天
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="严重污染"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <div>
                <span class="six">{{ row.pm25.six ? row.pm25.six : 0 }}</span
                >天
              </div>
              <div>
                <span class="six">{{ row.pm10.six ? row.pm25.six : 0 }}</span
                >天
              </div>
            </template>
          </el-table-column>
          <el-table-column label="优良率" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div>
                <span>{{ row.pm25 | getRate }}</span
                >%
              </div>
              <div>
                <span>{{ row.pm10 | getRate }}</span
                >%
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          :data="raiseData"
          height="100%"
          key="noise"
          style="width: 100%"
          class="small_scrolling"
          v-if="currentKey === 'statistics' && mnitoringType === 'noise'"
          :header-cell-style="cellNoise"
        >
          <el-table-column
            prop="name"
            label="监测点"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="正常" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div>
                <span class="one">{{ row.noise | getNoise }}</span
                >天
              </div>
            </template>
          </el-table-column>
          <el-table-column label="超限" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div>
                <span class="four">{{ row.noise | getOverrun }}</span
                >天
              </div>
            </template>
          </el-table-column>
          <el-table-column label="正常率" align="center" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <div>
                <span>{{ row.noise | getRate }}</span
                >%
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          :data="tableData"
          height="100%"
          key="monitoring"
          class="small_scrolling"
          style="width: 100%"
          v-if="currentKey === 'monitoring'"
        >
          <el-table-column
            prop="address"
            label="监测点"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="tem"
            label="温度(℃)"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="hum"
            label="湿度(%RH)"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="noise"
            label="噪声(db)"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="pm25"
            label="PM2.5(μg/m3)"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="pm10"
            label="PM10(μg/m3)"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="time"
            label="采集时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>

        <el-table
          :data="transfiniteRecords"
          height="100%"
          border
          key="record"
          class="small_scrolling"
          style="width: 100%"
          v-if="currentKey === 'record'"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="date"
            label="发送时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="addr"
            label="监测站点"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <!--          <el-table-column-->
          <!--            prop="name"-->
          <!--            label="监测项目"-->
          <!--            align="center"-->
          <!--            show-overflow-tooltip-->
          <!--          ></el-table-column>-->
          <el-table-column
            prop="data"
            label="超限数值"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="污染程度"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              {{ row.level | checkIn }}
            </template>
          </el-table-column>
          <!--          <el-table-column-->
          <!--            prop="name"-->
          <!--            label="环境责任人"-->
          <!--            align="center"-->
          <!--            show-overflow-tooltip-->
          <!--          ></el-table-column>-->
          <!--          <el-table-column-->
          <!--            prop="name"-->
          <!--            label="联系电话"-->
          <!--            align="center"-->
          <!--            show-overflow-tooltip-->
          <!--          ></el-table-column>-->
        </el-table>
      </div>
    </div>
    <div class="right">
      <div class="header">环境监测列表</div>
      <div class="main">
        <el-table
          :data="minData.filter((e) => e.type === 1)"
          height="100%"
          border
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="序号"
            width="55"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="name"
            label="位置"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="{ row }">
              <svg-icon icon-class="site" @click="flySite(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="footer">
        <el-button size="mini">环境监测管理</el-button>
      </div> -->
    </div>
  </div>
</template>

<script>
import {
  getEnvironmentVideo,
  getEnvPerMonth,
  getExceedData,
  getDayTrend,
} from "@/api/wisdomSite";
import { getNowDate, getCurrentDate } from "@/utils/date";

export default {
  name: "",
  props: {
    minData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
        currentKey: "monitoring",
        mnitoringType: "raiseDust", //raiseDust扬尘  noise噪音
        siteKey: "",
        siteKeyBf: "",
        siteArr: [],
        dataArr: [],
        timeValue: "",
        inLine: null,
        outLine: null,
        btns: [
            {
                name: "实时监测",
                key: "monitoring"
            },
            {
                name: "月度统计",
                key: "statistics"
            },
            {
                name: "变化趋势",
                key: "trend"
            },
            {
                name: "超限记录",
                key: "record"
            }
        ],

        tableData: [],
        raiseData: [],
        transfiniteRecords: [],
        option: {
            tooltip: {
                trigger: "axis"
            },
            grid: {
                x: 50,
                y: 30,
                x2: 70,
                y2: 30
            },
            xAxis: {
                type: "category",
                name: "时间(小时)",
                data: [],
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: "#000"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "#000",
                        width: 1 //这里是为了突出显示加上的
                    }
                }
            },
            yAxis: {
                type: "value",
                name: "噪声(dB)",
                axisLabel: {
                    formatter: "{value}",
                    textStyle: {
                        color: "#000"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "#000",
                        width: 1 //这里是为了突出显示加上的
                    }
                }
            },
            series: [
                {
                    data: [],
                    type: "line",
                    symbol: "circle", //折线点设置为实心点
                    symbolSize: 8, //折线点的大小
                    itemStyle: {
                        normal: {
                            color: "#5BB6FF",
                            lineStyle: {
                                color: "#5BB6FF" //改变折线颜色
                            }
                        }
                    }
                }
            ]
        },
        optionS: {
            tooltip: {
                trigger: "axis"
            },
            grid: {
                x: 50,
                y: 30,
                x2: 70,
                y2: 30
            },
            xAxis: {
                type: "category",
                name: "时间(小时)",
                data: [],
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: "#000"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "#000",
                        width: 1 //这里是为了突出显示加上的
                    }
                }
            },
            yAxis: {
          type: "value",
          name: "PM2.5(μg/m3)",
          axisLabel: {
            formatter: "{value}",
            textStyle: {
              color: "#000",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#000",
              width: 1, //这里是为了突出显示加上的
            },
          },
        },
        series: [
          {
            data: [],
            type: "line",
            symbol: "circle", //折线点设置为实心点
            symbolSize: 8, //折线点的大小
            itemStyle: {
              normal: {
                color: "#5BB6FF",
                lineStyle: {
                  color: "#5BB6FF", //改变折线颜色
                },
              },
            },
          },
        ],
      },
      optionT: {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          x: 50,
          y: 30,
          x2: 70,
          y2: 30,
        },
        xAxis: {
          type: "category",
          name: "时间(小时)",
          data: [],
          axisLabel: {
            show: true,
            textStyle: {
              color: "#000",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#000",
              width: 1, //这里是为了突出显示加上的
            },
          },
        },
        yAxis: {
          type: "value",
          name: "PM10(μg/m3)",
          axisLabel: {
            formatter: "{value}",
            textStyle: {
              color: "#000",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#000",
              width: 1, //这里是为了突出显示加上的
            },
          },
        },
        series: [
          {
            data: [],
            type: "line",
            symbol: "circle", //折线点设置为实心点
            symbolSize: 8, //折线点的大小
            itemStyle: {
              normal: {
                color: "#5BB6FF",
                lineStyle: {
                  color: "#5BB6FF", //改变折线颜色
                },
              },
            },
          },
        ],
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    changeView(val) {
      this.currentKey = val;

      if (val === "trend") {
        this.timeValue = getCurrentDate();

        this.getChangeData();
      } else {
        this.siteKey = this.siteKeyBf;
      }
    },
    flySite(row) {
      this.$emit("flySite", row);
    },
    initData() {
      getEnvironmentVideo().then((res) => {
          this.tableData = res.data;
          this.siteArr = res.data;
          let time = getCurrentDate();
          let inLineData = null;
          res.data.forEach(e => {
              if (e.time) {
                  let date = e.time.split(" ");
                  if (time == date[0]) {
                      inLineData += 1;
                  }

              }
          });
          this.inLine = inLineData;
          this.outLine = res.data.length - inLineData;
          if (res.data && res.data.length > 0) {
              this.siteKey = res.data[0].code;
              this.siteKeyBf = res.data[0].code;
          }
      });
      getEnvPerMonth().then((res) => {
        let data = res.data;
        let arr = [];
        for (let key in data) {
          let obj = {};
          obj.name = key;
          data[key].forEach((item) => {
            obj[item.type] = item;
          });
          arr.push(obj);
        }
        this.raiseData = arr;
      });
      getExceedData().then((res) => {
        //超限记录
        this.transfiniteRecords = res.data.slice(0, 200);
      });
    },
    getChangeData() {
      let obj = {
        code: this.siteKey,
        askTime: this.timeValue,
      };
      getDayTrend(obj).then((res) => {
        let x = [];
        let db = [];
        let pb = [];
        let pm = [];
        let data = res.data;
        if (data) {
          let arr = data[this.siteKey]
          arr.forEach((item) => {
            let time = item.time.split(" ")[1];
            let hour = time.split(":")[0];
            x.push(hour);
            db.push(item.noise);
            pb.push(item.pm25);
            pm.push(item.pm10);
          });
          this.option.xAxis.data = x;
          this.option.series[0].data = db;
          this.optionS.xAxis.data = x;
          this.optionS.series[0].data = pb;
          this.optionT.xAxis.data = x;
          this.optionT.series[0].data = pm;
        } else {
          this.option.xAxis.data = [];
          this.option.series[0].data = [];
          this.optionS.xAxis.data = [];
          this.optionS.series[0].data = [];
          this.optionT.xAxis.data = [];
          this.optionT.series[0].data = [];
          this.$message({
            message: res.message,
            type: "warning",
            customClass: "message_override",
          });
        }
      });
    },
    changeNoise(val) {
      if (val != this.mnitoringType) {
        this.mnitoringType = val;
      }
    },
    //自定义表头class
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 2) {
        //指定坐标
        return "background:#00ff99;color:#000";
      } else if (rowIndex === 0 && columnIndex === 3) {
        return "background:#ffff00;color:#000";
      } else if (rowIndex === 0 && columnIndex === 4) {
        return "background:#ff9900;color:#000";
      } else if (rowIndex === 0 && columnIndex === 5) {
        return "background:#ff0000;color:#000";
      } else if (rowIndex === 0 && columnIndex === 6) {
        return "background:#9933ff;color:#000";
      } else if (rowIndex === 0 && columnIndex === 7) {
        return "background:#993366;color:#000";
      } else if (rowIndex === 0 && columnIndex === 8) {
        // return 'background:#00ff99;color:#000'
      } else {
        return "";
      }
    },
    cellNoise({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 1) {
        //指定坐标
        return "background:#00ff99;color:#000";
      } else if (rowIndex === 0 && columnIndex === 2) {
        return "background:#ff0000;color:#fff";
      } else if (rowIndex === 0 && columnIndex === 3) {
        return "background:#EFF0E9;color:#000";
      } else {
        return "";
      }
    },
    timeChange() {
      this.getChangeData();
    },
    equipmentChange() {
      this.getChangeData();
    },
  },
  filters: {
    checkIn: function (val) {
      switch (val) {
        case 1:
          return "优良";
        case 2:
          return "良好";
        case 3:
          return "轻度污染";
        case 4:
          return "中度污染";
        case 5:
          return "重度污染";
        case 6:
          return "严重污染";
      }
    },
    getRate: function (val) {
      let best = val.one || 0;
      let good = val.two || 0;
      let three = val.three || 0;
      let four = val.four || 0;
      let five = val.five || 0;
      let six = val.six || 0;
      return (
        (Math.floor(
          ((best + good) / (best + good + three + four + five + six)) * 100
        ) /
          100) *
        100
      );
    },
    getNoise: function (val) {
      let best = val.one || 0;
      let good = val.two || 0;
      return best + good;
    },
    getOverrun: function (val) {
      let three = val.three || 0;
      let four = val.four || 0;
      let five = val.five || 0;
      let six = val.six || 0;
      return three + four + five + six;
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  display: flex;
  .left {
    width: 80%;
    padding: 0 5px;
    .header {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      .header-left {
        .el-button {
          //border: 1px solid rgb(40, 157, 233);
          //background-color: rgb(6, 12, 38);
          //color: #ffffff;
          background-color: rgba(128, 142, 169, .16);
          color: #4B5973;
          border-radius: 6px;
        }
        .active {
          background: #1E6EEB;
          border-radius: 6px;
          color: #FFFFFF;
        }
      }
      .header-right {
        ul {
          display: flex;

          li {
            margin: 0 10px;
          }
          li:first-of-type {
            color: #00ff99;
          }
          li:last-of-type {
            color: #ff9900;
          }
        }
        .box {
          display: flex;
          height: 100%;
          align-items: center;
          div {
            height: 30px;
            line-height: 30px;
            padding: 0 20px;
            color: #4B5973;
            cursor: pointer;
            background-color: rgba(128, 142, 169, .16);
            border-radius: 6px;
            margin-left: 10px;
          }
          .current-mon {
            background: #1E6EEB;
            border-radius: 6px;
            color: #FFFFFF;
          }
        }
        .trend-box {
          ::v-deep .el-select {
            width: 158px;
            text-indent: 0;
            margin-right: 10px;
            .el-input {
              .el-input__inner {
                height: 30px !important;
                line-height: 30px;
              }
              .el-input__suffix {
                .el-input__icon {
                  line-height: 30px;
                }
              }
            }
          }
          ::v-deep .el-date-editor {
            margin-right: 5px;

            .el-input__inner {
              height: 30px !important;
              width: 158px;
              margin-right: 20px;
              line-height: 30px;
            }
            .el-input__prefix {
              .el-input__icon {
                line-height: 30px;
              }
            }
          }
        }
      }
    }
    .content {
      height: calc(100% - 50px);
      .trend-box {
        display: flex;
        height: 100%;
        div {
          flex: 1;
          .charts {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .right {
    width: 20%;
    .header {
      height: 40px;
      line-height: 40px;
      background-color: #FFFFFF;
      text-indent: 2em;
    }
    .main {
      height: calc(100% - 60px);
      margin-bottom: 5px;
    }
    .footer {
      text-align: center;
      .el-button {
        border: 1px solid rgb(40, 157, 233);
        background-color: rgb(6, 12, 38);
        color: #ffffff;
      }
    }
  }
}
.one {
  color: #00ff99;
  font-size: 20px;
  margin-right: 5px;
}
.two {
  color: #ffff00;
  font-size: 20px;
  margin-right: 5px;
}
.three {
  color: #ff9900;
  font-size: 20px;
  margin-right: 5px;
}
.four {
  color: #ff0000;
  font-size: 20px;
  margin-right: 5px;
}
.five {
  color: #9933ff;
  font-size: 20px;
  margin-right: 5px;
}
.six {
  color: #993366;
  font-size: 20px;
  margin-right: 5px;
}
</style>
