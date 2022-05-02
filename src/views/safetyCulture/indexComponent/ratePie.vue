<template>
  <div class="wrapper">
    <v-chart autoresize :options="option" class="charts"></v-chart>
    <ul class="legend">
      <li class="green"></li>
      <li>已巡检</li>
      <li class="red"></li>
      <li>未巡检</li>
    </ul>
  </div>

</template>

<script>
  import echarts from 'echarts'

  export default {
    name: '',
    props: {
      resumption: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        option: {
          animation: false,
          title: {
            textStyle: {
              color: '#28BCFE',
              fontSize: 40
            },
            subtext: '',
            subtextStyle: {
              color: '#0de6a4',
              fontSize: 18
            },
            itemGap: 20,
            left: 'center',
            top: '40%'
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
            radius: '100%' //图形大小
          },
          series: [{
            type: 'bar',
            data: [],
            showBackground: true,
            backgroundStyle: {
              color: '#FF0000'
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 20,
            itemStyle: {
              normal: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#05E600'
                }, {
                  offset: 1,
                  color: '#05E600'
                }]),
                shadowBlur: 5
              }
            }
          }]

        }
      }
    },
    mounted() {

    },
    methods:{
      initData(){
        let num = Math.floor(this.resumption.month.performance/this.resumption.month.count * 100)
        this.option.series[0].data = [num]
        this.option.title.subtext = '巡检' + num + '%'
      }
    },
    watch:{
      resumption(n,o){
        if(n.month){
          this.initData()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper{
    height: 100%;
    position: relative;
    .legend{
      position: absolute;
      bottom: 10px;
      display: flex;
      align-items: center;
      left: 50%;
      transform: translateX(-50%);
      li{
        margin: 0 5px;
      }
      .green{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #05e600;
      }
      .red{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #ff0000;
      }
    }
  }
  .charts {
    width: 100%;
    height: 100%;
  }

</style>
