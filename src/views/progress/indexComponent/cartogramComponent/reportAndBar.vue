<template>
  <div class="allbg">
    <div class="wrapper">
      <div class="top">
        <weeklyAndMonthly />
      </div>
      <div class="bottom">
        <!-- <div class="title">各类构件进度</div> -->
        <div class="charts-box">
          <v-chart autoresize :options="option" class="charts" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import weeklyAndMonthly from '@/views/project/component/weeklyAndMonthly'
import { getFinishConponent } from '@/api/data'

export default {
  name: '',
  components: { weeklyAndMonthly },
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 50,
          x2: 50,
          y2: 50
        },
        xAxis: {
          type: 'category',
          data: [],

          axisLabel: {
            show: true,
            rotate: 20,
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1 // 这里是为了突出显示加上的
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '单位：个',
          axisLabel: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1 // 这里是为了突出显示加上的
            }
          }
        },
        series: [
          {
            data: [],
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#0C61BB'
              }
            }
          },
          {
            data: [],
            type: 'bar',
            barWidth: 20,
            itemStyle: {
              normal: {
                color: '#05e600'
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getFinishConponent({
      }).then(res => {
        const x = []
        const planArr = []
        const finish = []
        const plan = res.data.plan.mapData.QL
        const act = res.data.act.mapData.QL
        for (let i = 0; i < plan.length; i++) {
          const item = plan[i]
          x.push(item.name)
          planArr.push(item.count)
          const obj = act.find(e => e.name === item.name)
          if (obj) {
            finish.push(obj.count)
          } else {
            finish.push(0)
          }
        }
        this.option.xAxis.data = x
        this.option.series[0].data = planArr
        this.option.series[1].data = finish
      })
    }
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  > div {
    height: 50%;
    .title {
      font-size: 18px;
      line-height: 20px;
    }
    .charts-box {
      height: calc(100% - 20px);
      .charts {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
