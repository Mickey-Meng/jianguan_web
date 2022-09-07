<!--
@name:
@description: 考勤统计
@author: 王海林
@time: 2022-09-05 09:20:58
@modifier:
@modifierTime:
-->
<template>
  <div class="statistics_box">
    <div class="top">
      <todayThePerformance></todayThePerformance>
      <todayWorkers></todayWorkers>
      <todayOnJob></todayOnJob>
    </div>
    <div class="bottom">
      <div class="label_btn">
        <div class="label">考勤统计列表</div>
        <div class="btn_select_date">
          <!--          <el-button type="primary" size="mini">导出</el-button>-->
          <span>单位:</span>
          <el-select v-model="queryData.unitType" placeholder="请选择" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <span>考勤状态:</span>
          <el-select v-model="queryData.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
          <span>时间:</span>
          <div>
            <el-date-picker
              v-model="queryData.date"
              value-format="yyyy-MM"
              type="month"
              style="width: 220px;margin: 0 5px"
              placeholder="选择月">
            </el-date-picker>
          </div>
          <el-button type="primary" size="mini" @click="initData()">查询</el-button>

        </div>
      </div>
      <div class="table_b_w">
        <el-table
          :data="tableData.slice((pageNum-1)*pageSize,pageNum*pageSize)"
          border
          key="create_table"
          class="have_scrolling"
          height="100%"
          style="width: 100%">
          <el-table-column
            label="姓名"
            prop="userName"
          >
          </el-table-column>
          <el-table-column
            label="单位"
            prop="unitName"
          >
          </el-table-column>
          <el-table-column
            label="角色"
            prop="roleName"
          >
          </el-table-column>
          <el-table-column
            label="总打卡数(次)"
            prop="clockInDay"
          >
          </el-table-column>
          <el-table-column
            label="未打卡数(次)"
            prop="notClockInDay"
          >
          </el-table-column>
          <el-table-column
            label="请假数(天)"
            prop="leaveDay"
          >
          </el-table-column>
          <el-table-column
            label="今日状态"
            prop="clockInState"
          >
            <template slot-scope="{row}">
              <span>{{ row.clockInState === 1 ? "已打卡" : row.clockInState === 2 ? "未打卡" : "休假" }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!--        <div>-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="pageNum" :page-size="pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.length">
        </el-pagination>
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import todayThePerformance from "@/views/contractManagement/attendanceStatisticsComponents/todayThePerformance";
  import todayOnJob from "@/views/contractManagement/attendanceStatisticsComponents/todayOnJob";
  import todayWorkers from "@/views/contractManagement/attendanceStatisticsComponents/todayWorkers";

  import {getAllClockOut} from "@/api/attendanceStatistics";
  import {mapGetters} from "vuex";


  export default {
    props: [],
    watch: {},
    data() {
      return {
        tableData: [],
        queryData: {
          projectId: null,
          unitType: null,
          date: "",
          type: ""
        },
        pageNum: 1,
        pageSize: 10,
        options: [
          {
            name: "施工单位",
            value: 1
          },
          {
            name: "监理单位",
            value: 2
          },
          {
            name: "全咨单位",
            value: 3
          }
        ],
        status: [
          {
            name: "已打卡",
            value: 1
          },
          {
            name: "未打卡",
            value: 2
          },
          {
            name: "请休假",
            value: 3
          }
        ]
      };
    },
    created() {
      this.queryData.projectId = this.project.id;
      this.initData();
    },
    mounted() {
    },
    computed: {
      ...mapGetters(["project"])
    },
    methods: {
      initData() {
        let obj = Object.assign({},this.queryData)
        // obj.unitType = obj.unitType === 10 ? "" : obj.unitType;
        getAllClockOut(obj).then(res => {
          this.tableData = res.data;
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
      },
      handleCurrentChange(val) {
        this.pageNum = val;
      }
    },
    components: {todayThePerformance, todayOnJob, todayWorkers},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .statistics_box {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;

    //.top, .bottom {
    //  height: calc(50% - 10px);
    //}

    .top {
      display: flex;
      height: 45%;

      > div {
        flex: 1;
        background-color: #FFFFFF;
        border-radius: 5px;
      }

      > div:nth-of-type(2) {
        margin: 0 20px;

      }
    }

    .bottom {
      height: calc(55% - 20px);
      background-color: #FFFFFF;
      border-radius: 5px;

      .label_btn {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .label {
          text-indent: 1em;
          font-family: PingFang SC;
        }

        .btn_select_date {
          display: flex;
          align-items: center;
          padding-right: 10px;

          span {
            white-space: nowrap;
          }

          .el-select {
            margin: 0 10px;
          }
        }
      }

      .table_b_w {
        height: calc(100% - 80px);
        padding: 0 10px;
      }

    }

  }

</style>
<style lang="scss">
  .attendance_box {
    .label {
      height: 35px;
      line-height: 35px;
      text-indent: 1em;
      font-family: PingFang SC;
    }

    .chart_content {
      height: calc(100% - 35px);

      .charts {
        width: 100%;
        height: 100%;
      }
    }

  }
</style>
