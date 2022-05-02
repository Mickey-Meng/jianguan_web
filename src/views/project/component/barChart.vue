<template>
  <div class="wrapperbox">
    <v-chart autoresize :options="option" class="charts"></v-chart>

  </div>

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
    data(){
      return{
        option:{
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisTick: {
                alignWithLabel: true
              },
              axisLabel:{
                show:true,
                rotate:20,
                textStyle:{
                  fontSize:12
                }
              },
              axisLine:{
                lineStyle:{
                  color:'#fffff',
                  width:1,//这里是为了突出显示加上的
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine:{
                lineStyle:{
                  color:'#ffffff',
                  width:1,//这里是为了突出显示加上的
                }
              }
            }
          ],
          series: [
            {
              name: '巡检率',
              type: 'bar',
              barWidth: '40%',
              data: [],
              itemStyle:{
                normal:{
                  color:'#05e600'
                }
              }
            }
          ]
        }
      }
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
        this.option.xAxis[0].data = x
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
  .wrapperbox{
    height:100%;
    .charts{
      width: 100%;
      height: 100%;
    }
  }

</style>
