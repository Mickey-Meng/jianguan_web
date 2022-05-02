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
            trigger: 'item'
          },
          color:['#3CBB0C', '#0C61BB', '#F3C806',],
          series: [
            {
              name: '整改完成',
              type: 'pie',
              radius: '50%',
              data: [

              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
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
    methods:{
      initData(){
        getByFirstType().then(res => {
          let check = null
          let nodo = null
          let nodelay = null
          let nocheck = null
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              check += item.check
              nocheck += item.nocheck
              nodelay += item.nodelay
              nodo += item.nodo
            })
          }
          let arr = [
            { value: check, name: '整改完成' },
            { value: nodo, name: '未整改(未延期)' },
            { value: nodelay, name: '未整改(延期)' }
          ]
          this.option.series[0].data = arr


        })
      }
    }
  }
</script>

<style scoped>
  .charts{
    width: 100%;
    height: 100%;}

</style>
