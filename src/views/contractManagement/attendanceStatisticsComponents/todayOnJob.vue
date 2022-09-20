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
    <div class="label">今日已打卡/未打卡/请假占比</div>
    <div class="chart_content">
      <v-chart autoresize :options="option" class="charts"></v-chart>
    </div>
  </div>
</template>

<script>
  // import {getOnDutyOrNotCount} from "@/api/attendanceStatistics";
  import {getTodayClockOut} from "@/api/attendanceStatistics";

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
            data: ["已打卡", "未打卡", "请假"]
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
              value: 0,
              name: "已打卡",
              itemStyle: {
                normal: {
                  color: "#7F7FFE"
                }
              }
            }, {
              name: "未打卡",
              value: 0,
              itemStyle: {
                normal: {
                  color: "#D6D6D6"
                }
              }
            },
              {
                name: "请假",
                value: 0,
                itemStyle: {
                  normal: {
                    color: "#F49923"
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
        getTodayClockOut(this.project.id).then(res => {
          let {jl, qz, sg} = res.data;
          let clockCount = jl.clockInCount + qz.clockInCount + sg.clockInCount;
          let notClockInCount = jl.notClockInCount + qz.notClockInCount + sg.notClockInCount;
          let leaveCount = jl.leaveCount + qz.leaveCount + sg.leaveCount;
          this.option.series[0].data[0].value = clockCount;
          this.option.series[0].data[1].value = notClockInCount;
          this.option.series[0].data[2].value = leaveCount;
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
