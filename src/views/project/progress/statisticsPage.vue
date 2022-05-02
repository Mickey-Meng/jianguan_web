<!--
 * @Descripttion:首页中间页面和进度总览右侧页面
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-26 15:57:58
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-24 16:42:02
-->
<template>
  <div class="statistics_page">
    <div class="progress_nav">
      <ul>
        <li
          v-for="(item, index) in nav"
          :key="index"
          :class="{ active: currentView == item.key }"
          @click="changeModel(item.key)"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="check_box">
        <el-radio v-model="radio" label="1">统计模式</el-radio>
        <el-radio v-model="radio" label="2">报表模式</el-radio>
      </div>
    </div>
    <div class="progress_content">
      <weeklyAndMonthly
        v-if="radio === '2'"
        :currentView="currentView"
      ></weeklyAndMonthly>
      <statisticsChart
        v-if="radio === '1'"
        :currentView="currentView"
      ></statisticsChart>
    </div>
  </div>
</template>

<script>
import weeklyAndMonthly from "@/views/project/component/weeklyAndMonthly";
import statisticsChart from "@/views/project/progress/statisticsChart";

export default {
  data() {
    return {
      radio: "1",
      currentView: "QL",
      nav: [
        {
          name: "桥梁",
          key: "QL",
        },
        {
          name: "道路",
          key: "DL",
        },
        {
          name: "隧道",
          key: "SD",
        },
        {
          name: "其它",
          key: "other",
        },
      ],
    };
  },
  created() {},
  components: { weeklyAndMonthly, statisticsChart },
  computed: {},
  methods: {
    changeModel(item) {
      // if (item === "SD" || item === "DL") {
      //   this.$message({
      //     message: "暂无数据，正在处理中",
      //     type: "info",
      //     customClass: "message_override",
      //   });
      // }
      this.currentView = item;
    },
  },
};
</script>
<style lang='scss' scoped>
.statistics_page {
  height: 100%;
  .progress_nav {
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    justify-content: space-between;
    // border-top: 1px solid rgb(56, 122, 253);
    // border-bottom: 1px solid rgb(56, 122, 253);
    // margin: 5px 0;
    ul {
      display: flex;
      li {
        text-align: center;
        margin-left: 15px;
        // width: 33%;
        width: 80px;
        height: 24px;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 24px;
        cursor: pointer;
        background-image: url(../../../assets/image/tab.png);
        // background-image: url(../../);
        background-repeat: no-repeat;
        background-size: 100%;
      }
      .active {
        border: none;
        // background-color: rgb(56, 122, 253);
        background-image: url(../../../assets/image/tab-bg.png);
        background-repeat: no-repeat;
        background-size: 100%;
      }
    }
    .check_box {
      ::v-deep.el-radio {
        .el-radio__label {
          color: #ffffff;
        }
      }
    }
  }
  .progress_content {
    height: calc(100% - 50px);
  }
}
</style>
