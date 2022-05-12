<template>
  <!-- <div class="allbg"> -->
  <div class="wrapper">
    <div class="container-box">
<!--      <div class="title">-->
<!--        <div class="titleLeft">-->
<!--          <div class="titleitem" />-->
<!--          <div class="titletext">项目统计</div>-->
<!--        </div>-->
<!--        <div class="select">-->
<!--          <el-button size="mini" @click="exportData">导出</el-button>-->
<!--          <div class="titleselect">-->
<!--            <el-select v-model="timeKey" @change="changData">-->
<!--              <el-option-->
<!--                v-for="item in sectionData"-->
<!--                :key="item.key"-->
<!--                :value="item.key"-->
<!--                :label="item.name"-->
<!--              />-->
<!--            </el-select>-->
<!--          </div>-->
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
  <!-- </div> -->
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
      default: () => "QL",
    },
  },
  components: { BridgeTable, RoadTable, tunneling, othetEngTable },
  data() {
    return {
      showComponent: "BridgeTable",
      timeKey: 3,
      typeKey: 1,
      timeValue: null,
      sectionData: [
        {
          name: "周报",
          key: 3,
        },
        {
          name: "月报",
          key: 4,
        },
      ],
      time: {},
      info: {},
    };
  },
  created() {
    this.timeValue = getCurrentDate();
    this.initData();
  },
  methods: {
    // changeView(str) {
    //   if (this.currentView != str) {
    //     this.currentView = str;
    //   }
    // },
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
    changData(val) {
      if (val === 3) {
        this.initData();
      } else if (val === 4) {
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
        .titleselect {
          ::v-deep .el-select {
            width: 158px;
            margin-left: 20px;
            //height: 35px !important;
            .el-input {
              .el-input__inner {
                height: 30px !important;
                line-height: 30px;
                background-image: url(../../../assets/image/日期选择.png);
                background-repeat: no-repeat;
                background-size: 100% 100%;
                color: #fff;
                border: none;
              }
              input {
                background: transparent;
              }
              .el-input__suffix {
                .el-input__icon {
                  line-height: 30px;
                }
              }
            }
          }
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
      height: calc(100% - 20px);
      //height: 100%;
    }
  }
}
</style>
