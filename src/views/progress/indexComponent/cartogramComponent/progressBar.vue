<template>
  <div class="wrapper">
    <v-chart autoresize :options="option" class="charts"></v-chart>
  </div>
</template>

<script>
  export default {
    name: '',
    props:{
      lineChartData:{
        type:Array,
        default:() => []
      }
    },
    data() {
      return {
        option: {
          tooltip: {
            trigger: 'axis',
          },
          grid:{
            x:50,
            y:30,
            x2:30,
            y2:30
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1,//这里是为了突出显示加上的
              }
            }
          },
          yAxis: {
            type: 'value',
            name:'单位：个',
            axisLabel : {
              formatter: '{value}',
              textStyle: {
                color: '#fff'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1,//这里是为了突出显示加上的
              }
            }
          },
          series: [{
            data: [],
            type: 'line',
            symbol: 'circle', //折线点设置为实心点
            symbolSize: 8, //折线点的大小
            itemStyle:{
              normal:{
                color:'#5BB6FF',
                lineStyle: {
                  color: '#ffffff' //改变折线颜色
                }
              }
            },
            areaStyle: {}
          }]
        }
      }
    },
    methods:{
      initData(){
        let data = this.lineChartData
        let x = []
        let s = []
        data.forEach(item => {
          x.unshift(item.name)
          s.unshift(item.number)
        })
        this.option.xAxis.data = x
        this.option.series[0].data = s
      }
    },
    watch:{
      lineChartData(n,d){
        if(n.length>0){
          this.initData()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .wrapper {
    height: 100%;

    .charts {
      width: 100%;
      height: 100%;
    }
  }

</style>
