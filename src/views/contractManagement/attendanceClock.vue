<!--
 * @Descripttion:考勤打卡
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 10:06:35
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 10:06:41
-->
<template>
  <div class="clock_wrapper">
    <el-calendar v-model="value" id="calendar">
      <template slot-scope="{date,data}" slot="dateCell">
        <div class="cell_data">
          <!--          日期数据-->
          <span>{{ data.day.split("-").slice(2).join("-") }}</span>
          <div v-for="(item, index) in clickData" :key="index">
            <!-- #794 lrj 20230917  .slice(5)改成.slice(5, 10)-->
            <div class="is_clock"
              v-if="item.clockTime.split('T')[0].slice(5, 10) === data.day.split('-').slice(1).join('-')">
            </div>
            <div class="clockTime"
              v-if="item.clockTime.split('T')[0].slice(5, 10) === data.day.split('-').slice(1).join('-')">
              打卡时间: {{ item.clockTime | disposeTime }}
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
    <div class="legend">
      <div class="circle"></div>
      <div>已打卡</div>
    </div>
  </div>
</template>

<script>
import { getCurrentMonth, getCurrentDate, formatDate } from "@/utils/date";
import { getMyClockRecords } from "@/api/staffApproval";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      value: "",
      clickData: []
    };
  },
  created() {
    this.init(getCurrentDate());
  },
  components: {},
  computed: {
    ...mapGetters(["project"])
  },
  methods: {
    init(month) {
      let startEnd = getCurrentMonth(month);
      let { end_time, start_time } = startEnd;
      // #794 lrj 
      getMyClockRecords(this.project.id, start_time, end_time).then(res => {
        let data = res.data;
        data.forEach(item => {
          item.clockStartTime = formatDate(item.clockStartTime);
          item.clockEndTime = formatDate(item.clockEndTime);
        });
        this.clickData = data;
        console.log('+++++', this.clickData)
        // item.clockTime.split('T')[0].slice(5) === data.day.split('-').slice(1).join('-') 
      });
    }
  },
  watch: {
    value: function (val) {
      this.init(val);
    }
  },
  filters: {
    disposeTime: function (val) {
      if (val) {
        return formatDate(val);
      } else {
        return "";
      }

    }
  }
};
</script>
<style lang='scss' scoped>
.clock_wrapper {
  height: 100%;
  position: relative;

  .el-calendar {
    height: 97%;

    .cell_data {
      height: 100%;
      //display: flex;
      //justify-content: center;
      //align-items: center;
      position: relative;

      span {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -70%);
        z-index: 1;
      }
    }

    .is_clock {
      width: 50px;
      height: 50px;
      background: #0FE54D;
      border-radius: 50%;
      opacity: 0.6;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -70%);


    }

    .clockTime {
      position: absolute;
      font-size: 14px;
      color: black;
      left: 0;
      bottom: 0px;
    }
  }

  .legend {
    position: absolute;
    bottom: 50px;
    left: 30px;
    display: flex;
    align-items: center;

    .circle {
      width: 50px;
      height: 50px;
      background: #0FE54D;
      border-radius: 50%;
      opacity: 0.6;
      margin-right: 10px;
    }
  }
}
</style>
