<template>
  <v-chart autoresize :options="option" class="charts"></v-chart>

</template>

<script>
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
        week:{},
        option: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [],
            axisLabel:{
              show:true,
              textStyle:{
                fontSize:12
              }
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} %',
              show:true,
              rotate:40,
              textStyle:{
                fontSize:10
              }
            }
          },
          series: [{
            data: [],
            type: 'bar',
            barWidth: '20%',
            itemStyle:{
              normal:{
                color:'#3CBB0C'
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
        let data = this.resumption.weeks.reverse()
        let x = []
        let s = []
        data.forEach(item => {
          s.push(Math.floor((item.performance/item.count)*100)/100)
          let start = item.peroid.split('_')[0]
          let end = item.peroid.split('_')[1]
          let str = start.slice(5) + '_' + end.slice(5)
          x.push(str)
        })
        this.option.xAxis.data = x
        this.option.series[0].data = s
      }
    },
    watch:{
      resumption(n,o){
        if(n.weeks){
          this.initData()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .charts{
    width: 100%;
    height: 100%;
  }

</style>
