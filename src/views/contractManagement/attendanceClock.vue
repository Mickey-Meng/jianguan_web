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
    <el-calendar v-model="value">
      <template slot-scope="{date,data}" slot="dateCell"></template>
    </el-calendar>
  </div>
</template>

<script>
  import {getCurrentMonth, getCurrentDate} from "@/utils/date";
  import {getMyClockRecords} from "@/api/staffApproval";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        value: ""
      };
    },
    created() {
      // console.log(getCurrentMonth(getCurrentDate()));
    },
    components: {},
    computed: {
      ...mapGetters(["project"])
    },
    methods: {
      init() {
      }
    }
  };
</script>
<style lang='scss' scoped>
  .clock_wrapper {
    height: 100%;

    .el-calendar {
      height: 97%;
    }
  }

</style>
