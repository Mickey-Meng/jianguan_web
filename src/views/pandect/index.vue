<template>
  <div class="wrapper">
    <div class="header">
      <div class="title">
        <div class="titleitem" />
        <div class="titletext">诸暨交投项目</div>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div style="text-align: right">
        <svg-icon icon-class="return" class="svg-btn" @click="goBack" />
      </div>
    </div>
    <div class="empty">正在开发中</div>
    <!-- <div class="main">
      <div class="left">
        <div class="allbg">
          <div class="progress-title">
            <div class="titleitem" />
            <div class="titletext">项目进度</div>
            <div class="btn-box">
              <svg-icon icon-class="table" class="svg-btn" @click="changeLeftType('table')" />
              <svg-icon icon-class="chart" class="svg-btn" @click="changeLeftType('chart')" />
            </div>
          </div>
          <div class="progress-container">
            <el-table
              v-show="leftType === 'table'"
              key="monitoring"
              :data="tableData"
              height="100%"
              class="bim-table"
              style="width: 100%"
            >
              <el-table-column
                label="项目名称"
                align="center"
              />
              <el-table-column
                label="投资进度"
                align="center"
              />
              <el-table-column
                label="桥梁进度"
                align="center"
              />
              <el-table-column
                label="道路进度"
                align="center"
              />
              <el-table-column
                label="隧道进度"
                align="center"
              />
            </el-table>
            <div v-show="leftType === 'chart'" class="left-chart-box" />

          </div>
        </div>
        <div class="news">
          <div class="global-title">
            <div class="titleitem" />
            <div class="titletext">新闻预览</div>
          </div>
          <div class="newList">
            <img :src="lists[currentIndex].img">
            <ul>
              <li v-for="(item,index) in lists" :class="{'active':index == currentIndex}">
                <div>{{ item.name }}</div>
                <div>{{ item.time }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="allbg">
          <weeklyNewspaper />
        </div>
        <div class="bottom">
          <div class="safe">
            <div class="days">
              <div class="title">
                <div class="titleitem" />
                <label class="titletext">安全生产天数</label>
              </div>
              <ul class="content">
                <li>
                  <span>G235</span>
                  <div><span>41</span>天</div>
                </li>
                <li />
                <li />
                <li />
                <li />
                <li />
                <li />
                <li />
              </ul>
            </div>
            <div class="days-chart">
              <div class="title">
                <div class="titleitem" />
                <div class="titletext">近30天安全</div>
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="content">
                <v-chart autoresize class="chart" :options="option" />
              </div>
            </div>
          </div>
          <div class="environment" />
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { projectSelect } from "@/api/data";

import weeklyNewspaper from "@/views/pandect/weeklyNewspaper";
import fangtai from "@/assets/newsImage/fangtai.webp";
import jindong from "@/assets/newsImage/jindong.jpg";
import fangzai from "@/assets/newsImage/fangzai.webp";
import baodao from "@/assets/newsImage/baodao.png";
import bg_8 from "@/assets/newsImage/8a.jpg";
import bg_7 from "@/assets/newsImage/7.jpg";
import bg_6 from "@/assets/newsImage/6.jpg";
import bg_5 from "@/assets/newsImage/5.png";

export default {
  name: "",
  components: { weeklyNewspaper },
  data() {
    return {
      value: "",
      options: [],
      newsIndex: 1,
      currentIndex: 0,
      leftType: "table", // chart
      lists: [
        {
          name: "诸暨235国道项目“防台十二时辰战役",
          time: "07/23",
          img: fangtai,
        },
        {
          name: "诸暨235国道项目前塘坞隧道正式进洞",
          time: "07/20",
          img: jindong,
        },
        {
          name: "王珣一行莅临诸暨235国道项目开展防灾减灾检查并召开专项会议",
          time: "07/08",
          img: fangzai,
        },
        {
          name: " 235国道项目数字化应用报道",
          time: "07/05",
          img: baodao,
        },
        {
          name: "绍兴市委常委、诸暨市委书记沈志江莅临诸暨235国道项目现场调研",
          time: "05/06",
          img: bg_8,
        },
        {
          name: "诸暨交投集团党委书记、董事长郭剑波莅临诸暨235国道项目调研",
          time: "04/23",
          img: bg_7,
        },
        {
          name: "诸暨235国道项目召开首次合同交底会",
          time: "03/26",
          img: bg_6,
        },
        {
          name: "马忠贤莅临诸暨235国道项目开展设备工作调研",
          time: "03/23",
          img: bg_5,
        },
      ],
      timer: null,
      tableData: [],
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        // legend: {
        //   data: ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine']
        // },
        grid: {
          left: "20%",
          right: "5%",
          bottom: "10%",
          top: "5%",
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
          axisLine: {
            show: false,
            lineStyle: {
              color: "#fff",
            },
          },
          splitLine: {
            show: true,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "category",
          data: ["G235"],
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
              color: "#fff",
            },
          },
        },
        series: [
          {
            name: "已整改",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            barWidth: 30,
            emphasis: {
              focus: "series",
            },
            areaStyle: {},
            itemStyle: {
              normal: { color: "#72b201" },
            },
            data: [10],
          },
          {
            name: "未整改",
            type: "bar",
            stack: "total",
            label: {
              show: true,
            },
            emphasis: {
              focus: "series",
            },
            data: [1],
          },
        ],
      },
    };
  },
  created() {
    this.autoPlay();
    // projectSelect().then(res =>{
    //   console.log(res,99090)
    // })
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    changeLeftType(val) {
      if (this.leftType != val) {
        this.leftType = val;
      }
    },
    autoPlay() {
      setInterval(() => {
        if (this.currentIndex == this.lists.length - 1) {
          this.currentIndex = 0;
        } else {
          this.currentIndex++;
        }
      }, 5000);
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  // background-color: #060C26;
  background-image: url(../../assets/image/mainviewbg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 30px;
  .header {
    // height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    ::v-deep .el-select {
      width: 158px;
      margin-left: 5px;
      //height: 35px !important;
      .el-input {
        .el-input__inner {
          height: 30px !important;
          line-height: 30px;
          background-image: url(../../assets/image/日期选择.png);
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
            line-height: 30px;
          }
        }
      }
    }

    .svg-btn {
      width: 35px;
      height: 35px;
    }

    .title {
      width: 30%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .titleitem {
        width: 3px;
        height: 28px;
        background-color: #7ceff6;
      }
      .titletext {
        margin-left: 16px;
        font-size: 30px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 62px;
        letter-spacing: 2px;
        color: #ffffff;
        margin-right: 60px;
      }
    }
  }
  .empty {
    height: calc(100% - 80px);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 34px;
  }

  .main {
    overflow: hidden;
    height: calc(100% - 80px);
    padding: 10px 10px 5px 10px;
    display: flex;
    justify-content: space-between;

    .left {
      width: 33%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .allbg {
        height: 65%;
        // background: url("../../assets/image/zuoshang.png") no-repeat;
        // background-size: 100% 100%;
        .progress-title {
          height: 60px;
          padding: 10px 20px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .titletext {
            margin-left: 16px;
          }
          .svg-btn {
            width: 25px;
            height: 25px;
            margin-left: 10px;
          }
        }
        .progress-container {
          padding: 5px;
          height: calc(100% - 80px);
          ::v-deep .el-table {
            &::before {
              background: transparent;
              border: none;
            }
          }
        }
      }

      .news {
        height: 33%;
        background-image: url(../../assets/image/边框-大.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        padding: 16px;
        .global-title {
          display: flex;
        }
        .newList {
          height: calc(100% - 30px);
          display: flex;
          justify-content: space-between;
          ul {
            width: 60%;
            overflow: hidden;
            li {
              display: flex;
              justify-content: space-between;
              align-items: center;
              line-height: 25px;
              height: 25px;
              color: rgb(152, 156, 159);
              margin: 5px 0;
              cursor: pointer;
              div:first-of-type {
                width: 80%;

                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              div:last-of-type {
                width: 20%;
                text-align: center;
              }
            }
            .active {
              color: #ffffff;
            }
          }
          img {
            margin-top: 10px;
            width: 37%;
            height: 85%;
          }
        }
      }
    }

    .right {
      width: 66%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .allbg {
        padding: 16px;
        height: 49%;
      }

      .bottom {
        height: 49%;
        display: flex;
        justify-content: space-between;

        > div {
          width: 49%;
          // background: url("../../assets/image/zuoxia.png") no-repeat;
          background-image: url(../../assets/image/边框-大.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        .safe {
          display: flex;
          .days {
            width: 50%;
            border-right: 1px solid #0565b9;
            .content {
              // border: 1px solid #006B75;
              border-bottom: none;
              display: flex;
              margin: 0 20px;
              flex-direction: column;
              height: calc(100% - 90px);
              li {
                height: 12.5%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-image: url(../../assets/image/项目信息背景.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                margin-bottom: 10px;
                > span {
                  width: 60%;
                  text-align: left;
                  font-size: 16px;
                  padding-left: 30px;
                }
                > div {
                  width: 40%;
                  color: #00ffd8;
                  display: flex;
                  align-items: center;
                  font-size: 12px;
                  > span {
                    font-size: 18px;
                  }
                }
              }
            }
          }
          .days-chart {
            width: 50%;
          }
          > div {
            .title {
              padding: 0 10px;
              display: flex;
              // justify-content: space-between;
              align-items: center;
              height: 60px;
              ::v-deep .el-select {
                width: 158px;
                margin-left: 20px;
                //height: 35px !important;
                .el-input {
                  .el-input__inner {
                    height: 30px !important;
                    line-height: 30px;
                    background-image: url(../../assets/image/日期选择.png);
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
                      line-height: 30px;
                    }
                  }
                }
              }
              .titletext {
                margin-left: 5%;
              }
            }
            .content {
              height: calc(100% - 60px);
              .chart {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
