<template>
  <div class="wrapper">
    <div class="top">
      <div class="calendar">
        <timeTable @getSafeData="getSafeData"></timeTable>
      </div>
      <div class="rate">
        <div class="header">
          <el-select v-model="typeKey">
            <el-option
              v-for="item in typeArr"
              :key="item.key"
              :value="item.key"
              :label="item.name"
            ></el-option>
          </el-select>
          <el-date-picker
            v-model="timePremium"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="checkTimeChange"
          >
          </el-date-picker>
          <ul class="type-nav rate-li">
            <!--            <li :class="{'active':currentType === 'week'}" @click="changeView('week')">周巡检率</li>-->
            <!--            <li :class="{'active':currentType === 'month'}" @click="changeView('month')">月巡检率</li>-->
            <li class="active">质量检查统计图</li>
          </ul>
        </div>
        <div class="content">
          <!--          <rateBar v-show="currentType === 'week'" :resumption="resumption"></rateBar>-->
          <!--          <ratePie v-show="currentType === 'month'" :resumption="resumption"></ratePie>-->
        </div>
      </div>
      <!--      <div class="statistics">-->
      <!--        <div class="header">-->
      <!--          <ul class="type-nav">-->
      <!--            <li :class="{'active':statisticalType === 'type'}" @click="changeStatisticalType('type')">类型统计</li>-->
      <!--            <li :class="{'active':statisticalType === 'num'}" @click="changeStatisticalType('num')">数量统计</li>-->
      <!--          </ul>-->
      <!--          <span class="see-new-btm">地图模式<i class="el-icon-d-arrow-right"></i></span>-->
      <!--        </div>-->
      <!--        <div class="main">-->
      <!--          <patrollingBar v-show="statisticalType === 'type'"></patrollingBar>-->
      <!--          <patrollingPie  v-show="statisticalType === 'num'"></patrollingPie>-->
      <!--        </div>-->
      <!--        <div class="footer">-->
      <!--          <div style="height: 12px;width: 12px; border-radius: 50%;background-color: rgb(60,187,12)"></div>-->
      <!--          <div>整改完成</div>-->
      <!--          <div style="height: 12px;width: 12px; border-radius: 50%;background-color: rgb(12,97,187)"></div>-->
      <!--          <div>未整改(未延期)</div>-->
      <!--          <div style="height: 12px;width: 12px; border-radius: 50%;background-color: rgb(243,200,6)"></div>-->
      <!--          <div>未整改(延期)</div>-->
      <!--        </div>-->

      <!--      </div>-->
    </div>
    <div class="bottom">
      <div class="table">
        <div class="header">
          <el-button size="mini">检查记录</el-button>
          <el-date-picker
            v-model="timeValue"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期时间"
            @change="timeChange"
          >
          </el-date-picker>
        </div>
        <div class="content">
          <el-table :data="tableData" style="width: 100%" border height="100%">
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            >
            </el-table-column>
            <el-table-column
              prop="safefirstname"
              align="center"
              label="构件编码"
            >
            </el-table-column>
            <el-table-column
              prop="safesecondname"
              align="center"
              label="构件类型"
            >
            </el-table-column>
            <el-table-column prop="uploadname" align="center" label="检查人员">
            </el-table-column>
            <el-table-column prop="uploadtime" align="center" label="检查日期">
            </el-table-column>
            <el-table-column
              prop="uploadremark"
              align="center"
              label="质量描述"
            >
            </el-table-column>
            <el-table-column align="center" label="检查照片">
              <template slot-scope="{ row }">
                <img-viewer :img-list="row.uploadurl"></img-viewer>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import patrollingBar from "@/views/safetyCulture/indexComponent/patrollingBar";
import patrollingPie from "@/views/safetyCulture/indexComponent/patrollingPie";
import rateBar from "@/views/safetyCulture/indexComponent/rateBar";
import ratePie from "@/views/safetyCulture/indexComponent/ratePie";
import timeTable from "./timeTable";
import { validPicurl } from "@/utils/validate";
import { getDayData, getByFirstType, getPerSafeData } from "@/api/safe";
import { getCurrentDate } from "@/utils/date";

export default {
  name: "",
  components: { patrollingBar, patrollingPie, rateBar, ratePie, timeTable },
  data() {
    return {
      timeValue: "", //时间值
      timePremium: "",
      typeKey: "",
      typeArr: [], //施工单位下拉选择
      tableData: [], //巡更表格数据,
      currentType: "week", //周履职率week 月履职率month
      statisticalType: "type", //  类型统计type  数量统计num
      resumption: {},
    };
  },
  created() {},
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      let time = getCurrentDate();
      this.timePremium = time;
      getPerSafeData(time).then((res) => {
        this.resumption = res.data;
      });
    },
    changeStatisticalType(val) {
      if (this.statisticalType != val) {
        this.statisticalType = val;
      }
    },
    changeView(val) {
      if (this.currentType != val) {
        this.currentType = val;
      }
    },
    getSafeData(val, time) {
      if (val && val.length > 0) {
        val.forEach((item) => {
          item.uploadurl = validPicurl(item.uploadurl);
          item.modifyurl = validPicurl(item.modifyurl);
        });
        this.tableData = val;
      } else {
        this.tableData = [];
      }
      this.timeValue = time;
    },
    timeChange(val) {
      if (val) {
        getDayData(val).then((res) => {
          if (res.data && res.data.length > 0) {
            res.data.forEach((item) => {
              item.uploadurl = validPicurl(item.uploadurl);
              item.modifyurl = validPicurl(item.modifyurl);
            });
            this.tableData = res.data;
          } else {
            this.tableData = [];
          }
        });
      } else {
        this.tableData = [];
      }
    },
    checkTimeChange(val) {
      if (val) {
        getPerSafeData(val).then((res) => {
          this.resumption = res.data;
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  padding: 5px;
  background-color: #EAF0F9;
  height: 100%;
  display: flex;
  flex-direction: column;
  //color: #000000;

  //::v-deep .el-date-editor {
  //  width: 150px;
  //
  //  .el-input__inner {
  //    border-color: black;
  //    height: 30px;
  //    width: 150px;
  //    line-height: 30px;
  //  }
  //
  //  .el-input__prefix {
  //    .el-input__icon {
  //      line-height: 30px;
  //    }
  //  }
  //
  //  .el-input__suffix {
  //    .el-input__icon {
  //      line-height: 30px;
  //    }
  //  }
  //}
  //
  //.el-button {
  //  background-color: rgb(51, 133, 255);
  //  color: #ffffff;
  //  padding: 8px 30px;
  //}

  .header {
    height: 50px;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    ::v-deep .el-select {
      width: 120px;
      text-indent: 0;
      //height: 35px !important;
      .el-input {
        .el-input__inner {
          height: 30px !important;
          line-height: 30px;
          background-color: #387afd !important;
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

    .legend {
      display: flex;
      align-items: center;
      color: black;

      li {
        display: flex;
        align-items: center;

        img {
          width: 25px;
          height: 25px;
          margin: 0 10px;
        }
      }
    }

    .type-nav {
      display: flex;

      li {
        border: 1px solid rgb(51, 133, 255);
        padding: 0 20px;
        cursor: pointer;
        color: rgb(51, 133, 255);
        height: 30px;
        line-height: 30px;
        text-align: center;
      }
      .active {
        color: #ffffff;
        background-color: rgb(51, 133, 255);
      }
    }
    .rate-li {
      li {
        padding: 0 10px;
      }
    }

    span {
      color: #0819e2;
      cursor: pointer;
    }
  }

  .content {
    padding: 1px 5px;
    height: calc(100% - 50px);
  }

  .top {
    height: 50%;
    margin-bottom: 10px;
    display: flex;

    > div {
      background-color: #ffffff;
    }

    .calendar {
      width: 54.5%;
    }

    .rate {
      margin-left: 10px;
      //width: 25.5%;
      flex: 1;
    }

    .statistics {
      flex: 1;
      .main {
        height: calc(100% - 90px);
      }
      .footer {
        height: 40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }

  .bottom {
    flex: 1;
    background-color: #ffffff;
    //display: flex;
    .header {
      ::v-deep .el-date-editor {
        width: 220px;

        .el-input__inner {
          border-color: black;
          height: 30px;
          width: 220px;
          line-height: 30px;
        }
      }
    }

    .table {
      width: 100%;
      height: 94%;
      border-right: 1px solid #eeeeee;
    }

    //.map {
    //  flex: 1;
    //}
  }
}
</style>
