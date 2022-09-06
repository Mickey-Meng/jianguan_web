<!--
@name:
@description: 人员占比
@author: 王海林
@time: 2022-09-05 09:31:58
@modifier:
@modifierTime:
-->
<template>
  <div class="attendance_box">
    <div class="label">人员占比</div>
    <div class="chart_content">
      <v-chart autoresize :options="option" class="charts"></v-chart>
    </div>
  </div>
</template>

<script>
  import {getPeopleProportion} from "@/api/attendanceStatistics";
  import {mapGetters} from "vuex";

  let colorList = ["#73DDFF", "#73ACFF", "#FDD56A", "#FDB36A", "#FD866A", "#9E87FF", "#58D5FF"];

  export default {
    props: [],
    watch: {},
    data() {
      return {
        option: {
          tooltip: {
            trigger: "item"
          },
          legend: {
            left: 'center',
            orient:"horizontal",
            top: 12,
            textStyle: {
              color: "#000"
            },
            itemWidth: 12,
            itemHeight: 10
          },
          series: [{
            type: "pie",
            center: ["50%", "60%"],
            radius: ["35%", "50%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 10,
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                }
              }
            },
            label: {
              show: true,
              position: "outside",
              formatter: "{a|{b}：{d}%}\n{hr|}",
              rich: {
                hr: {
                  backgroundColor: "t",
                  borderRadius: 3,
                  width: 3,
                  height: 3,
                  padding: [3, 3, 0, -12]
                },
                a: {
                  padding: [-30, 15, -20, 15]
                }
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
            data: []
          }]
        }
      };
    },
    created() {
    },
    computed: {
      ...mapGetters(["project"])
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        getPeopleProportion(this.project.id).then(res => {
          let {JLCount, QZCount, SGCount, buildGroupCount, buildUnitCount} = res.data;
          let data = [
            {
              name: "建设集团",
              value: buildGroupCount
            },
            {
              name: "建设单位",
              value: buildUnitCount
            },
            {
              name: "监理单位",
              value: JLCount
            },
            {
              name: "全咨单位",
              value: QZCount
            },
            {
              name: "施工单位",
              value: SGCount
            }
          ];
          this.option.series[0].data = data;
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
