<template>
  <div class="wrapper">
    <div class="container-box">
<!--          <el-button size="mini" @click="exportData">导出</el-button>-->

          <!-- <el-date-picker
            v-model="timeValue"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          /> -->
<!--        </div>-->
<!--      </div>-->
      <div class="main-table">
        <keep-alive>
          <component
            :is="showComponent"
            ref="child"
            :type="timeKey"
            :info="info"
          />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import BridgeTable from "@/views/project/component/BridgeTable";
import RoadTable from "@/views/project/component/RoadTable";
import tunneling from "@/views/project/component/tunnelingTable";
import othetEngTable from "@/views/project/component/othetEngTable";
import { getWeekMonthly } from "@/api/data";

import { getCurrentDate, getCurrentWeek, getCurrentMonth } from "@/utils/date";

export default {
  name: "",
  props: {
    currentView: {
      type: String,
      default: () => "QL"
    },
    timeKey: {
      type: [String, Number],
      default: () => 3
    }
  },
  components: { BridgeTable, RoadTable, tunneling, othetEngTable },
  data() {
    return {
      showComponent: "BridgeTable",
      timeValue: null,
      time: {},
      info: {},
    };
  },
  created() {
    this.timeValue = getCurrentDate();
    this.initData();
  },
  methods: {
    exportData() {
      this.$refs.child.exportTable();
    },
    initData() {
      this.time = getCurrentWeek();
      const obj = {
        type: 1,
        sttime: this.time.start_time,
        endtime: this.time.end_time,
      };
      getWeekMonthly(obj).then((res) => {
        this.info = res.data;
      });
    },
    changData() {
      if (this.timeKey === 3) {
        this.initData();
      } else if (this.timeKey  === 4) {
        this.time = getCurrentMonth();
        const obj = {
          type: 2,
          sttime: this.time.start_time,
          endtime: this.time.end_time,
        };
        getWeekMonthly(obj).then((res) => {
          this.info = res.data;
        });
      }
    },
  },
  watch: {
    currentView: function (n) {
      if (n === "QL") {
        this.showComponent = "BridgeTable";
      } else if (n === "SD") {
        this.showComponent = "tunneling";
      } else if (n === "DL") {
        this.showComponent = "RoadTable";
      } else {
        this.showComponent = "othetEngTable";
      }
    },
    timeKey:function (){
      this.changData()
    }
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  //padding: 16px;
  .container-box {
    height: 100%;
    padding: 0 !important;
    background-color: unset !important;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .titleLeft {
        display: flex;
        justify-content: flex-start;
        .titletext {
          margin-left: 16px;
          font-size: 16px;
          font-family: PingFangSC;
          font-weight: 600;
          color: #ffffff;
        }
      }
      .select {
        margin-top: 2px;
        display: flex;
        flex-direction: row-reverse;
        ::v-deep .el-date-editor {
          margin-right: 5px;

          .el-input__inner {
            height: 30px !important;
            line-height: 30px;
            border: none;
            color: #ffffff;
            // background-color: #060C26 !important;
            background-image: url(../../../assets/image/日期选择.png);
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
          margin-left: 19px;
          border: none;
          // background-color: #060C26 !important;
          background-image: url(../../../assets/image/导出.png);
          background-repeat: no-repeat;
          background-size: 100% 100%;
          color: #fff;
        }
      }
    }
    .header {
      height: 35px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 15px;
      margin-bottom: 10px;
      div {
        width: 74px;
        height: 24px;
        border: none;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        background: #4f71ff;
        opacity: 0.2;
        border-radius: 2px;
        margin-left: 16px;
      }
      .active {
        border: none;
        background: #4f71ff;
        opacity: 0.8;
        border-radius: 2px;
      }
    }
    .main-table {
      //margin-top: 5px;
      //height: calc(100% - 20px);
      height: 100%;
    }
  }
}
</style>
