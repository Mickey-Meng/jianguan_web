<template>
  <div class="wrapper">
    <div class="header">
      <div class="title">
        <div class="titleitem" />
        <div class="titletext">报表中心</div>
      </div>
      <div class="nav">
        <ul>
          <li
            v-for="(item, index) in engs"
            :key="index"
            :class="{ active: item.value === currentEng }"
            @click="changeView(item.value)"
          >
            {{ item.name }}
          </li>
        </ul>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <div class="btn-box">
          <el-button
            v-for="(item, index) in btns"
            :key="index"
            size="mini"
            :class="{ 'active-mode': mode === item.value }"
            @click="changeMode(item.value)"
            >{{ item.name }}
          </el-button>
          <span v-if="mode === 'month'">{{ monthTime }}</span>
          <span v-else>{{ weekTime }}</span>
        </div>
        <div class="export">
          <el-date-picker
            v-model="timeValue"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          />
          <el-button size="mini">导出报表</el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <el-table
        v-show="currentEng === 'QL'"
        key="QL"
        :data="bridgeData"
        style="width: 100%"
        class="bim-table"
        height="100%"
        border
      >
        <el-table-column label="分项名称" align="center" />
        <el-table-column label="G235改建" align="center">
          <el-table-column
            :label="mode === 'month' ? '当月完成' : '当周完成'"
            align="center"
          />
          <el-table-column label="累计完成" align="center" />
          <el-table-column label="累计完成比例" align="center" />
        </el-table-column>
      </el-table>
      <el-table
        v-show="currentEng === 'DL'"
        key="DL"
        :data="roadData"
        style="width: 100%"
        class="bim-table"
        height="100%"
        border
      />
      <el-table
        v-show="currentEng === 'DD'"
        key="DD"
        :data="tunnelData"
        style="width: 100%"
        class="bim-table"
        height="100%"
        border
      />
    </div>
  </div>
</template>

<script>
import { getCurrentMonth, getCurrentWeek } from "@/utils/date";

export default {
  name: "",
  data() {
    return {
      engs: [
        {
          name: "桥梁工程",
          value: "QL",
        },
        {
          name: "道路工程",
          value: "DL",
        },
        {
          name: "隧道工程",
          value: "DD",
        },
      ],
      btns: [
        {
          name: "周报",
          value: "week",
        },
        {
          name: "月报",
          value: "month",
        },
      ],
      currentEng: "QL",
      value: "",
      mode: "month", // week
      timeValue: "",
      options: [],
      monthTime: "",
      weekTime: "",
      bridgeData: [],
      roadData: [],
      tunnelData: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      const month = getCurrentMonth();
      const week = getCurrentWeek();
      this.monthTime = `${month.start_time} - ${month.end_time}`;
      this.weekTime = `${week.start_time} - ${week.end_time}`;
    },
    changeView(val) {
      this.currentEng = val;
    },
    changeMode(val) {
      this.mode = val;
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 98%;
  background-image: none !important;
  padding: 0 !important;
  .header {
    // height: 150px;
    .title {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 29px;
      .titletext {
        margin-left: 16px;
      }
    }
    .nav {
      margin-bottom: 20px;
    }
    > div {
      height: 50%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      ul {
        display: flex;

        li {
          width: 125px;
          height: 35px;
          // border: 1px solid rgb(56, 122, 253);
          background-image: url(../../assets/image/tab.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          text-align: center;
          line-height: 35px;
          cursor: pointer;
        }

        .active {
          border: none;
          background-image: url(../../assets/image/tab-bg.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }

      ::v-deep .el-select {
        width: 158px;
        margin-left: 5px;
        //height: 35px !important;
        .el-input {
          .el-input__inner {
            height: 30px !important;
            line-height: 30px;
            background-color: #060c26 !important;
            color: #fff;
            border: 1px solid #387afd;
          }

          .el-input__suffix {
            .el-input__icon {
              line-height: 30px;
            }
          }
        }
      }

      ::v-deep .el-date-editor {
        margin-right: 5px;

        .el-input__inner {
          height: 30px !important;
          line-height: 30px;
          border: none;
          color: #ffffff;
          background-image: url(../../assets/image/日期选择.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        input {
          background: transparent;
        }
        .el-input__prefix {
          .el-input__icon {
            line-height: 30px;
          }
        }

        .el-input__suffix {
          .el-input__icon {
            line-height: 30px;
          }
        }
      }

      .el-button {
        background-color: transparent;
        border: none;
        background-image: url(../../assets/image/tab.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        color: #fff;
      }

      .active-mode {
        background-image: url(../../assets/image/tab-bg.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }

      .btn-box {
        > span {
          margin-left: 50px;
        }
      }
      .export {
        ::v-deep .el-button {
          background-image: url(../../assets/image/导出.png);
        }
      }
    }
  }

  .main {
    height: calc(100% - 150px);
    ::v-deep .el-table {
      border-color: #4f71ff;
      &::before,
      &::after {
        background-color: #4f71ff;
      }
    }
  }
}
</style>
