<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-17 17:32:48
-->
<template>
  <div class="simulation">
    <div class="simulation_box">
      <div class="slider">
        <el-slider v-model="value" disabled :show-tooltip="false"></el-slider>
      </div>
      <div class="btn_input">
        <div class="btn">
          <img src="../../assets/image/bofang.png" v-if="!isPlay" alt="" />
          <img src="../../assets/image/zanting.png" v-if="isPlay" alt="" />
          <img src="../../assets/image/jieshu.png" alt="" />
        </div>
        <div class="day_inp">
          播放速度：<el-input v-model="inpDay"></el-input>天
        </div>
        <div class="check_group">
          <el-radio v-model="radio" label="1">计划进度</el-radio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentDate, addYear } from "@/utils/date";
export default {
  name: "",
  data() {
    return {
      value: 0,
      maxTimeStamp: null,
      inpDay: 1,
      isPlay: false,
      radio: "1",
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      let currentDay = getCurrentDate();
      let num = new Date(currentDay);
      let timestamp = num.getTime();
      let year = addYear(currentDay, 5);
      this.value = timestamp;
    },
  },
};
</script>

<style scoped lang="scss">
.simulation {
  position: absolute;
  pointer-events: auto;
  right: 90px;
  top: calc(100% - 175px);
  background-color: rgba(38, 38, 38, 0.75);
  border: 1px solid #526f82;
  width: calc(100% - 500px);
  height: 125px;
  .simulation_box {
    height: 100%;
    position: relative;
    .slider {
      height: 50px;
      padding: 0 20px;
    }
    .btn_input {
      height: 60px;
      display: flex;
      .btn {
        margin-left: 40px;
        display: flex;
        align-items: center;
        img {
          width: 32px;
          height: 32px;
          display: inline-block;
          cursor: pointer;
          margin: 0 2px;
        }
      }
      .day_inp {
        margin-left: 40px;
        width: 250px;
        display: flex;
        align-items: center;
        .el-input {
          width: 100px;
          margin: 0 5px;
        }
      }
      .check_group {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
