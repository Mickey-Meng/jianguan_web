<template>
  <div class="allbg">
    <div class="wrapper">
      <div class="title">
        <div class="titleitem" />
        <div class="titletext">项目进度</div>
      </div>
      <div class="content">
        <div class="content-left">
          <div class="left">
            <div class="leftcontent">
              <el-progress :percentage="70" :show-text='false' color='#7ceff6'></el-progress>
              <span class="contenttext">完成工期</span>
              <span class="contentnum">{{ info.workDays }}<span>天</span></span>
            </div>
          </div>
          <div class="center">
            <div class="total">
              <v-chart :options="progressOption" autoresize class="v-chart-box" />
            </div>
            <div class="centertext">总工期</div>
          <!-- <div>{{ info.projectduration }}<span>天</span></div> -->
          </div>
          <!-- <dv-percent-pond :config="config" style="width:100%;height:40px;" /> -->
          <div class="right">
            <div class="rightcontent">
              <el-progress :percentage="70" :show-text='false' color='#4f71ff'></el-progress>
              <span class="contenttext">剩余工期</span>
              <span class="contentnum">{{ info.restDays }}<span>天</span></span>
            </div>
          </div>
        </div>
        <div class="content-right">
          <div class="bottom">
            <div class="bridge">
              <v-chart :options="option" autoresize class="v-chart-box" />
            </div>
            <div class="road">
              <v-chart :options="roadOption" autoresize class="v-chart-box" />
            </div>
            <div class="road">
              <v-chart :options="roadOption" autoresize class="v-chart-box" />
            </div>
          </div>
           <div class="top">
            <div>道路进度</div>
             <div>桥梁进度</div>
            <div>道路进度</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import echarts from 'echarts'
import { getCurrentDate, diffDay } from '@/utils/date'
import { getEngCompany, getMiddleData } from '@/api/data'
import * as api from '@/api/data'

export default {
  name: '',
  data() {
    return {
      config: {
        value: 0
      },
      info: {},
      option: {},
      progressOption: {},
      roadOption: {
        title: {
          textStyle: {
            color: '#28BCFE',
            fontSize: 40
          },
          subtext: '',
          subtextStyle: {
            color: '#0de6a4',
            fontSize: 20
          },
          itemGap: 20,
          left: 'center',
          top: '30%'
        },
        tooltip: {
          formatter: function(params) {
            return `<span style="color: #fff;">${params.value}%</span>`
          }
        },
        angleAxis: {
          max: 100,
          clockwise: true, // 逆时针
          // 隐藏刻度线
          show: false
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false

          },
          axisTick: {
            show: false
          }
        },
        polar: {
          center: ['50%', '50%'],
          radius: '100%' // 图形大小
        },
        series: [{
          type: 'bar',
          data: [0],
          showBackground: true,
          backgroundStyle: {
            color: '#BDEBFF'
          },
          coordinateSystem: 'polar',
          roundCap: true,
          barWidth: 10,
          itemStyle: {
            normal: {
              opacity: 1,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#25BFFF'
              }, {
                offset: 1,
                color: '#5284DE'
              }]),
              shadowBlur: 5,
              shadowColor: '#2A95F9'
            }
          }
        }]
      }
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.initCharts()
  },
  methods: {
    initData() {
      const time = getCurrentDate()
      getEngCompany().then(res => {
        const info = res.data
        const start = info.starttime.split(' ')[0]
        const days = diffDay(time, start)
        info.workDays = days
        info.restDays = parseInt(info.projectduration) - days
        const value = Math.floor((parseInt(info.projectduration) - days) / parseInt(info.projectduration) * 100)
        this.config.value = value
        this.config = { ...this.config }
        this.info = info
        const obj = {
          title: {
            textStyle: {
              color: '#28BCFE',
              fontSize: 40
            },
            subtext: '',
            subtextStyle: {
              color: '#0de6a4',
              fontSize: 20
            },
            itemGap: 20,
            left: 'center',
            top: '30%'
          },
          tooltip: {
            formatter: function(params) {
              return `<span style="color: #fff;">${params.value}%</span>`
            }
          },
          angleAxis: {
            max: 100,
            clockwise: true, // 逆时针
            // 隐藏刻度线
            show: false
          },
          radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false

            },
            axisTick: {
              show: false
            }
          },
          polar: {
            center: ['50%', '50%'],
            radius: '100%' // 图形大小
          },
          series: [{
            type: 'bar',
            data: [],
            showBackground: true,
            backgroundStyle: {
              color: '#BDEBFF'
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            itemStyle: {
              normal: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#25BFFF'
                }, {
                  offset: 1,
                  color: '#5284DE'
                }]),
                shadowBlur: 5,
                shadowColor: '#2A95F9'
              }
            }
          }]
       }
       let rate = Math.floor(days/info.projectduration * 100)
        obj.series[0].data = [rate]
        this.progressOption  = obj

      })
    },
    initCharts() {
      getMiddleData().then(res => {
        const { QL } = res.data
        const obj = {
          title: {
            textStyle: {
              color: '#28BCFE',
              fontSize: 40
            },
            subtext: '',
            subtextStyle: {
              color: '#0de6a4',
              fontSize: 20
            },
            itemGap: 20,
            left: 'center',
            top: '30%'
          },
          tooltip: {
            formatter: function(params) {
              return `<span style="color: #fff;">${params.value}%</span>`
            }
          },
          angleAxis: {
            max: 100,
            clockwise: true, // 逆时针
            // 隐藏刻度线
            show: false
          },
          radiusAxis: {
            type: 'category',
            show: true,
            axisLabel: {
              show: false
            },
            axisLine: {
              show: false

            },
            axisTick: {
              show: false
            }
          },
          polar: {
            center: ['50%', '50%'],
            radius: '100%' // 图形大小
          },
          series: [{
            type: 'bar',
            data: [],
            showBackground: true,
            backgroundStyle: {
              color: '#BDEBFF'
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            itemStyle: {
              normal: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#25BFFF'
                }, {
                  offset: 1,
                  color: '#5284DE'
                }]),
                shadowBlur: 5,
                shadowColor: '#2A95F9'
              }
            }
          }]
        }
        const ql = Object.assign({}, obj)
        const qlnum = Math.floor(QL.finish / QL.count * 100)
        ql.title.subtext = `${qlnum}%`
        ql.series[0].data = [qlnum]
        this.option = ql
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .wrapper {
    height: 100%;
    padding: 16px;
    // background-image: url(../../../../assets/image/边框-长.png);
    // background-repeat: no-repeat;
    // background-size: 100% 100%;
    .title{
      display: flex;
        font-size: 18px;
        line-height: 20px;
        .titletext{
          font-size: 16px;
          font-family: PingFangSC;
          font-weight: 600;
          color: #FFFFFF;
          margin-left: 16px;
          margin-bottom: 20px;
        }
    }
    .content{
      height: calc(100% - 50px);
      display: flex;
      .content-left{
        margin-left: 16px;
        margin-right: 16px;
        width: 50%;
        display: flex;
        justify-content: space-around;
        .left{
          width: 33%;
          display: flex;
          background-image: url(../../../../assets/image/完成工期.png);
          background-repeat: no-repeat;
          .leftcontent{
            margin-left: 21px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .contenttext{
              margin-top: 11px;
            }
            .contentnum{
              margin-top: 20px;
              font-size: 20px;
              color: #7ceff6;
              span{
                font-size: 11px;
              }
            }
          }
        }
        .center{
            width: 33%;
          display: flex;
          flex-direction: column;
          .total{
            height: 70%;
            .v-chart-box{
              width: 100%;
              height: 100%;
            }
          }
          .centertext{
            text-align: center;
          }
        }
        .right{
          display: flex;
          justify-content: flex-end;
          width: 33%;
          background-image: url(../../../../assets/image/剩余工期.png);
          background-repeat: no-repeat;
          background-position: right;
          .rightcontent{
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-right: 21px;
            .contenttext{
              margin-top: 11px;
            }
            .contentnum{
              margin-top: 20px;
              font-size: 20px;
              color: #4f71ff;
              span{
                font-size: 11px;
              }
            }
          }
        }
        .top{
          height: 50px;
          line-height: 50px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          div:first-of-type{
            font-size: 26px;
          }
          div:last-of-type{
            font-size: 40px;
            color: #3385FF;
            span{
              font-size: 18px;
              color: #FFFFFF;
              margin-left: 5px;
            }
          }
        }
        .bottom{
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-size: 18px;
          div:first-of-type{
            span{
              color: #70B700;
              font-size: 26px;
              margin: 0 5px;
            }

          }
          div:last-of-type{
            span{
              color: #3385FF;
              font-size: 26px;
              margin: 0 5px;
            }
          }
        }
      }
      .content-right{
        width: 50%;
        display: flex;
        flex-direction: column;
        .top{
          height: 30px;
          line-height: 30px;
          display: flex;
          div{
            flex: 1;
            text-align: center;
            font-weight: bold;
          }
        }
        .bottom{
          flex: 1;
          display: flex;
          div{
            flex: 1;
            .v-chart-box{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }

</style>
