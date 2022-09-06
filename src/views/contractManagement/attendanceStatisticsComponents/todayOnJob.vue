<!--
@name:
@description: 今日在岗/不在岗占比
@author: 王海林
@time: 2022-09-05 09:33:02
@modifier:
@modifierTime:
-->
<template>
  <div class="attendance_box">
    <div class="label">今日在岗/不在岗占比</div>
    <div class="chart_content">
      <v-chart autoresize :options="option" class="charts"></v-chart>
    </div>
  </div>
</template>

<script>
  import {getOnDutyOrNotCount} from "@/api/attendanceStatistics";
  import {mapGetters} from "vuex";


  export default {
    props: [],
    watch: {},
    data() {
      return {
        option: {
          tooltip: {
            formatter: function (params) {
              return params.name + "：" + params.percent + " %";
            }
          },
          legend: {
            show: true,
            itemGap: 12,
            data: ["在岗", "不在岗"]
          },

          series: [{
            name: "circle",
            type: "pie",
            clockWise: true,
            radius: ["45%", "60%"],
            label: {
              show: true,
              formatter: function (params) {
                return params.name + ":" + params.value + "人";
              }
            },
            labelLine: {
              normal: {
                length: 15,
                length2: 20,
                lineStyle: {
                  width: 1
                }
              }
            },
            hoverAnimation: false,
            data: [{
              value: 90,
              name: "在岗",
              itemStyle: {
                normal: {
                  color: { // 颜色渐变
                    colorStops: [{
                      offset: 0,
                      color: "#6F78CC" // 0% 处的颜色
                    }, {
                      offset: 1,
                      color: "#6F78CC" // 100% 处的颜色1
                    }]
                  },
                  label: {
                    show: true
                  },
                  labelLine: {
                    show: true
                  }
                }
              }
            }, {
              name: "不在岗",
              value: 10,
              itemStyle: {
                normal: {
                  color: "#4897F6"
                }
              }
            }]
          }]
        }
      };
    },
    created() {
    },
    mounted() {
      this.init();
    },
    computed: {
      ...mapGetters(["project"])
    },
    methods: {
      init() {
        getOnDutyOrNotCount(this.project.id).then(res => {
          let {all, onDuty} = res.data;
          let outDuty = all - onDuty;
          this.option.series[0].data[0].value = onDuty;
          this.option.series[0].data[1].value = outDuty;
        });
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>

</style>
