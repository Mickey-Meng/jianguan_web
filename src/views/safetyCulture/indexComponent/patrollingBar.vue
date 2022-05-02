<template>
  <v-chart autoresize class="charts" :options="option"></v-chart>

</template>

<script>
  import { getByFirstType } from '@/api/safe'

  export default {
    name: '',
    data(){
      return{
        option:{
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top:10,
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [],
            axisLabel:{
              show:true,
              rotate:40,
              textStyle:{
                fontSize:10
              }
            },
          },
          yAxis: {
            type: 'value'
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
          },
            {
              data: [],
              type: 'bar',
              barWidth: '20%',
              itemStyle:{
                normal:{
                  color:'#0C61BB'
                }
              }
            },
            {
              data: [],
              type: 'bar',
              barWidth: '20%',
              itemStyle:{
                normal:{
                  color:'#F3C806'
                }
              }
            }]
        }
      }
    },
    mounted() {
      this.initData()
    },
    methods:{
      initData(){
        getByFirstType().then(res => {
          let x = []
          let finish = []
          let notCorrected = []
          let postpone = []
          if(res.data && res.data.length>0){
            res.data.forEach(item => {
              x.push(item.name)
              finish.push(item.check)
              postpone.push(item.nodo)
              notCorrected.push(item.nodelay)
            })
          }
          this.option.xAxis.data = x
          this.option.series[0].data = finish
          this.option.series[1].data = notCorrected
          this.option.series[2].data = postpone
        })
      }
    }
  }
</script>

<style scoped>
  .charts{
    width: 100%;
    height: 100%;
  }

</style>
