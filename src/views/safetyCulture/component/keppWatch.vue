<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-25 14:23:55
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-17 11:21:37
-->
<template>
  <div class="keep_watch">
    <div class="watch_table allbg">
      <div class="watch_table_header">
        <div class="header_g">
          <div class="title_item"></div>
          <div class="title_text">安全检查一览</div>
        </div>
        <el-date-picker
          v-model="month"
          type="month"
          :clearable="false"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="monthChange"
        >
        </el-date-picker>
      </div>
      <div class="main">
        <el-table
          :data="tableData"
          class="watch_table"
          height="100%"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="工区"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <!-- <el-table-column
            prop="gongqu"
            label="巡更位置"
            align="center"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column
            width="30px"
            align="center"
            v-for="(item, index) in currentMonth"
            :key="index"
            :label="item.week"
          >
            <el-table-column :label="item.date" width="30px" align="center">
              <template slot-scope="{ row }">
                <div
                  :class="{ 'have-thing': row.object.includes(item.date) }"
                  class="no-thing"
                  @click="geiDetailInfo(row, item.date)"
                >
                  <!-- {{row.object}}{{item.date}} -->
                </div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="watch_detail allbg">
      <div class="header_g">
        <div class="title_item"></div>
        <div class="title_text">{{ currentDay }} 安全检查明细</div>
      </div>
      <div class="main">
        <el-table
          :data="detailData"
          height="100%"
          class="watch_table"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="gongqu"
            label="完成情况"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="{ row }">
              <span>{{
                row.status === 0
                  ? "提交事件"
                  : row.status === 1
                  ? "申请延期"
                  : row.status === 2
                  ? "提交整改"
                  : row.status === 3
                  ? "确认整改"
                  : "提交事件"
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="gongqu"
            label="巡更人员"
            align="center"
            show-overflow-tooltip
          ></el-table-column> -->
          <!-- <el-table-column
            prop="gongqu"
            label="签到时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column> -->
          <el-table-column
            prop="modifytime"
            label="整改时间"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="safefirstname"
            label="完成检查大项"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="safesecondname"
            label="完成检查小项"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="uploadname"
            label="发起整改"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="modifyname"
            label="完成整改"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="gongqu"
            label="巡更地图"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentDate } from "@/utils/date";
import { getNowMonth } from "@/utils/date";
import { getSafePerday, getDaySafeEvents } from "@/api/safe";
export default {
  data() {
    return {
      currentDay: "",
      month: "",
      dayLength: null,
      currentMonth: [],
      tableData: [],
      detailData: [],
    };
  },
  created() {
    this.initData();
    this.getCurrentDate();
  },
  components: {},
  computed: {},
  methods: {
    initData() {
      // this.currentDay = getCurrentDate();
      this.month = getNowMonth("YYYY-MM");
    },
    monthChange() {
      this.getCurrentDate();
    },
    getCurrentDate() {
      let date = new Date(this.month);
      let arr = [];
      this.dayLength = this.getDayNum(date);
      for (let i = 1; i <= this.dayLength; i++) {
        let nowDate = date.setDate(i);
        const { year, month, day } = this.formatDate(nowDate);
        this.month = year + "-" + month;
        let everyDay = year + "-" + month + "-" + day;
        let week = this.getWeek(everyDay);
        arr.push({ date: day, week: week });
      }
      this.currentMonth = arr;
      this.getData();
    },
    getDayNum(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let d = new Date(year, month, 0);
      return d.getDate();
    },
    getWeek(date) {
      let dt2 = new Date(date);
      var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      if (weekDay.indexOf(weekDay[dt2.getDay()]) > -1) {
        return weekDay[dt2.getDay()];
      }
      return "";
    },
    formatDate(date) {
      date = new Date(date);
      let myyear = date.getFullYear();
      let mymonth = date.getMonth() + 1;
      let myweekday = date.getDate();
      mymonth < 10 ? (mymonth = "0" + mymonth) : mymonth;
      myweekday < 10 ? (myweekday = "0" + myweekday) : myweekday;
      return {
        year: myyear,
        month: mymonth,
        day: myweekday + "",
      };
    },
    getData() {
      getSafePerday(this.month).then((res) => {
        let data = res.data;
        this.tableData = data;
      });
    },
    geiDetailInfo(row, key) {
      let date = this.month + "-" + key;
      this.currentDay = date;
      if (row.object.includes(key)) {
        getDaySafeEvents(row.sort, date).then((res) => {
          this.detailData = res.data;
        });
      } else {
        this.$message("未发生安全事件");
        this.detailData = [];
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.keep_watch {
  height: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: auto;
  .watch_table {
    width: 62%;
    .watch_table_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    ::v-deep.el-table {
      font-size: 12px;
      th {
        padding: 0;
        > .cell {
          padding: 0;
        }
      }
    }
  }
  .watch_detail {
    width: 37.5%;
    ::v-deep.el-table {
      font-size: 14px;
      th {
        padding: 0;
        > .cell {
          padding: 0;
        }
      }
    }
  }
  .main {
    padding: 0 5px;
    height: calc(100% - 45px);
  }
}
::v-deep .el-date-editor {
  margin-right: 25px;

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
::v-deep.watch_table {
  background-color: rgba(15, 15, 46, 1);
  .el-table__header-wrapper {
    .el-table__header {
      th {
        background-color: rgba(15, 15, 46, 1) !important;
        color: rgba(124, 239, 246, 1);
      }
    }
  }
  .cell {
    padding: 0;
    .no-thing {
      margin: 0 auto;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #54f6f6;
      cursor: pointer;
    }
    .have-thing {
      margin: 0 auto;
      cursor: pointer;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #ffffff;
      border: 2px solid red;
    }
  }
}
</style>
