<!--
@name:
@description: 今日考勤统计
@author: 王海林
@time: 2022-09-05 09:32:27
@modifier:
@modifierTime:
-->
<template>
  <div class="attendance_box">
    <div class="label">今日考勤统计</div>
    <div class="chart_content">
      <v-chart autoresize :options="option" class="charts"></v-chart>
    </div>
  </div>
</template>

<script>
  import {getTodayClockOut} from "@/api/attendanceStatistics";
  import {mapGetters} from "vuex";

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
          grid: {
            left: "5%",
            right: "4%",
            bottom: "8%",
            top: "16%",
            containLabel: true
          },
          legend: {
            // data: ['1', '2', '3'],
            right: 10,
            top: 12,
            textStyle: {
              color: "#000"
            },
            itemWidth: 12,
            itemHeight: 10
            // itemGap: 35
          },
          xAxis: {
            type: "category",
            data: ["施工单位", "监理单位", "全咨单位"],
            axisLine: {
              lineStyle: {
                color: "#000"
              }
            },
            axisLabel: {
              // interval: 0,
              // rotate: 40,
              textStyle: {
                fontFamily: "Microsoft YaHei"
              }
            }
          },

          yAxis: {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#000"
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "rgba(255,255,255,0.3)"
              }
            },
            axisLabel: {}
          },
          series: [{
            name: "总人数",
            type: "bar",
            barWidth: "15%",
            itemStyle: {
              normal: {
                color: "#3AA0FE",
                barBorderRadius: 12
              }
            },
            data: []
          },
            {
              name: "已打卡",
              type: "bar",
              barWidth: "15%",
              itemStyle: {
                normal: {
                  color: "#7F7FFE",
                  barBorderRadius: 12
                }
              },
              data: []
            },
            {
              name: "未打卡",
              type: "bar",
              barWidth: "15%",
              itemStyle: {
                normal: {
                  color: "#D6D6D6",
                  barBorderRadius: 11
                }

              },
              data: []
            },
            {
              name: "休假",
              type: "bar",
              barWidth: "15%",
              itemStyle: {
                normal: {
                  color: "#F49923",
                  barBorderRadius: 11
                }
              },
              data: []
            }]
        }
      };
    },
    computed: {
      ...mapGetters(["project"])
    },
    created() {
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        getTodayClockOut(this.project.id).then(res => {
          let {jl, qz, sg} = res.data;
          let inWork = [sg.clockInCount, jl.clockInCount, qz.clockInCount];
          let outWork = [sg.notClockInCount, jl.notClockInCount, qz.notClockInCount];
          let leaveWork = [sg.leaveCount, jl.leaveCount, qz.leaveCount];
          let all = [sg.all, jl.all, qz.all];
          this.option.series[0].data = all;
          this.option.series[1].data = inWork;
          this.option.series[2].data = outWork;
          this.option.series[3].data = leaveWork;
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
