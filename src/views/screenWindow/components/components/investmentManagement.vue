<!--
@name:
@description: 投资管理
@author: 王海林
@time: 2022-08-03 13:49:03
@modifier:
@modifierTime:
-->
<template>
  <div>
      <div class="measure" @click="openSystem">计量管理</div>
    <v-chart :options="option" autoresize class="v-chart-box"/>

  </div>
</template>

<script>
  let colorList = ["#04FEF9", "#77ED4D", "#48A3FF", "#FFE822", "#FF61D8", "#FCCF77"];
  export default {
    props: [],
    watch: {},
    data() {
      return {
        option: {
          tooltip: {
            trigger: "axis",
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend:{
            top: "2%",
            right: "5%",
            data: ["投资计划", "投资完成"],
            textStyle: {
              fontSize: 14,
              color: "#fff"
            }
          },
          grid: {
            containLabel: true,
            left: "10%",
            top: "21%",
            right: "10%",
            bottom: "4%"
          },
          xAxis: [{
            type: "category",
            data: ["一季度", "二季度", "三季度", "四季度"],
            axisTick: {
              show: false,
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: "rgba(40, 97, 246, .5)"
              }
            },
            axisLabel: {
              color: "#fff"
            }
          }],
          yAxis: {
            type: "value",
            name:"单位:万元",
            nameTextStyle:{
              color:"#fff",
              padding:[0,10,0,60]
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "rgba(40, 97, 246, .5)"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(255, 255, 255, .1)"
              }
            },
            axisLabel: {
              textStyle: {
                color: "#EFFEF7",
                fontSize: 10
              }
            },
          },
          series: [
            {
              tooltip: {
                show: false
              },
              name: "投资计划背景",
              type: "pictorialBar",
              silent: true,
              symbol: "rect",
              symbolRepeat: true,
              symbolMargin: 1,
              symbolSize: [25, 4],
              symbolOffset: ['-50%', '0%'],
              itemStyle: {
                color: "rgba(114, 154, 224, .2)"
              },
              data: [350000, 350000, 350000, 350000]
            },
            {
              name: "投资计划",
              type: "pictorialBar",
              animation: true,
              animationDuration: 600,
              symbol: "rect",
              symbolRepeat: true,
              symbolOffset: ['-50%', '0%'],
              symbolSize: [25, 4],
              symbolMargin: 1,
              itemStyle: {
                normal: {
                  color: "rgba(114, 154, 224, 1)",
                  label: {
                    show: false
                  }
                }
              },
              data: [30121, 100984, 196539, 333916]
            },
            {
              tooltip: {
                show: false
              },
              name: "投资完成背景",
              type: "pictorialBar",
              silent: true,
              symbol: "rect",
              symbolRepeat: true,
              symbolMargin: 1,
              symbolOffset: ['85%', '0%'],
              symbolSize: [25, 4],
              itemStyle: {
                color: "rgba(255, 138, 64, .2)"
              },
              data: [350000, 350000, 350000, 350000]
            },
            {
              name: "投资完成",
              type: "pictorialBar",
              animation: true,
              animationDuration: 600,
              symbol: "rect",
              symbolRepeat: true,
              symbolOffset: ['85%', '0%'],
              symbolSize: [25, 4],
              symbolMargin: 1,
              itemStyle: {
                normal: {
                  color: "rgba(255, 138, 64, 1)",
                  label: {
                    show: false
                  }
                }
              },
              // label: {
              //   normal: {
              //     show: true,
              //     position: ['25','-10']
              //   }
              //
              // },
              data: [49452, 152473, 0, 0]
            }
          ]
        }
      };
    },
      created() {
      },
      mounted() {
      },
      methods: {
          openSystem() {
              window.open('http://112.15.105.16:8081/');
          }
      },
      components: {},
      beforeDestroy() {
      }

  };
</script>

<style lang='scss' scoped>
  .measure {
    position: absolute;
    left: 154px;
    top: 11px;
    margin-left: 12px;
    height: 28px;
    font-size: 20px;
    font-family: CKTKingKong;
    color: #FFFFFF;
    line-height: 24px;
    text-shadow: 0px 1px 5px rgba(13, 88, 228, .5);
    background: linear-gradient(180deg, #FFFFFF 10%, #0D58E4 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    cursor: pointer;
  }

</style>
