<template>
  <div class="wrapper">
    <!-- <dv-border-box-12> -->
    <div class="title">
      <div class="title-item" ></div>
      <div class="global-title">项目进度</div>
    </div>
    <div class="center">
      <!-- <div class="center-left">
        <div>总体投资进度</div>
        <dv-percent-pond :config="config" style="width:300px;height:40px;" />
      </div> -->
      <div class="total">
        <div class="chart">
          <dv-percent-pond :config="config" style="width:300px;height:40px;" />
        </div>
        <div>总体投资进度</div>
      </div>
      <div class="bridge">
        <div class="charts">
          <v-chart :options="option" autoresize class="v-chart-box" />
        </div>
        <div>房建进度</div>
      </div>
      <div class="road">
        <div class="charts">
          <v-chart :options="roadOption" autoresize class="v-chart-box" />
        </div>
        <div>桥梁进度</div>
      </div>
      <div class="tunneling">
        <div class="charts">
          <v-chart :options="roadOption" autoresize class="v-chart-box" />
        </div>
        <div>道路进度</div>
      </div>
    </div>
    <div class="bottom">
      <div class="nav">
        <div :class="{'active':currentView == 'Bridge'}" @click="changeView('Bridge')">房建工程</div>
        <div :class="{'active':currentView == 'Road'}" @click="changeView('Road')">桥梁工程</div>
        <div :class="{'active':currentView == 'tunneling'}" @click="changeView('tunneling')">道路工程</div>
      </div>
      <keep-alive>
        <component :is="currentView" :engineering="engineering" />
      </keep-alive>
    </div>
    <!-- </dv-border-box-12> -->
  </div>
</template>

<script>
import echarts from 'echarts'
import Bridge from '@/views/project/component/Bridge'
import Road from '@/views/project/component/Road'
import tunneling from '@/views/project/component/tunneling'
import * as api from '@/api/data'

export default {
  name: '',
  components: { Bridge, Road, tunneling },
  data() {
    return {
      currentView: 'Bridge',
      config: {
        value: 0
      },
      engineering: {},
      option: {},
      roadOption: {
        title: {
          textStyle: {
            color: '#28BCFE',
            fontSize: 40
          },
          subtext: '0%',
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
  methods: {
    changeView(str) {
      if (this.currentView != str) {
        this.currentView = str
      }
    },
    initData() {
      api.getMiddleData().then(res => {
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
        this.engineering = res.data
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
    background-image: url(../../../assets/image/边框-大.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-left: 20px;
    margin-right: 20px;
    .title{
      display: flex;
        margin-top: 16px;
      .title-item{
        margin-left: 16px;
        width: 2px;
        height: 15px;
        background: #4F71FF;
      }
      .global-title{
        font-size: 16px;
        font-family: PingFangSC;
        font-weight: 600;
        color: #FFFFFF;
      }
    }
    .center {
      height: 45%;
      display: flex;
      padding-bottom: 16px;
      margin-left: 20px;
        width: 100%;
        .chart{
          height: calc(100% - 20px);
          padding-top: 50px;
        }
        .charts {
          height: calc(100% - 20px);
        }
        > div {
          flex: 1;
          text-align: center;
          font-size: 18px;
          line-height: 18px;
          font-weight: 600;
        }
    }
    .bottom {
      height: calc(45% - 40px);
       .nav {
         width: 40%;
          display: flex;
          margin-bottom: 20px;
          > div {
            text-align: center;
            margin-left: 15px;
            width: 33%;
            height: 24px;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            // border: 1px solid rgb(56, 122, 253);
            line-height: 24px;
            cursor: pointer;
            background-image: url(../../../assets/image/tab.png);
            background-repeat: no-repeat;
            background-size: 100%;
          }
          .active {
            border: none;
            // background-color: rgb(56, 122, 253);
            background-image: url(../../../assets/image/tab-bg.png);
            background-repeat: no-repeat;
            background-size: 100%;
          }

        }
    }

  }

</style>
