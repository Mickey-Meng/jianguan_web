<!--
@name:
@description: 考勤记录
@author: 王海林
@time: 2022-05-20 17:08:22
@modifier:
@modifierTime:
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.subName" clearable placeholder="请输入人员姓名"></el-input>
        </div>

      </div>
      <div class="input-box" style="margin-left: 10px">
        <div class="input-value">
          <el-date-picker
            v-model="queryData.subDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <div class="input-box" style="margin-left: 10px">
        <div class="input-value">
          <el-select v-model="queryData.selectValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <el-button type="primary" style="margin-left: 10px" @click="init">搜索</el-button>

      <div class="right-btns">
        <!-- <el-button type="primary" size="small"
          :icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
          @click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
        <div class="operate-btns">
          <!--          <el-button size="small" @click="openDialog">新增请假</el-button>-->
          <!--          <el-button size="small">导出</el-button>-->
          <!--          <el-button size="small">批量操作</el-button>-->
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableData.slice((queryData.pageNum-1)*queryData.pageSize,queryData.pageNum*queryData.pageSize)"
                  style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="attendancePersonName" label="打卡人"></el-table-column>
          <el-table-column label="图片" width="120">
            <template slot-scope="{row}">
              <img-viewer :imgList="[lookUrl+row.clockPic]"></img-viewer>
            </template>


          </el-table-column>
          <el-table-column prop="projectName" label="标段"></el-table-column>
          <el-table-column label="上班打卡时间">
            <template slot-scope="{row}">
              {{ row.clockStartTime | disposeTime }}
            </template>
          </el-table-column>
          <el-table-column label="下班打卡时间">
            <template slot-scope="{row}">
              {{ row.clockEndTime | disposeTime }}
            </template>
          </el-table-column>
          <el-table-column prop="fenceAddrName" label="上班打卡点" show-overflow-tooltip></el-table-column>
          <el-table-column prop="clockAddr" label="上班打卡位置" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fenceAddrName" label="下班打卡点" show-overflow-tooltip></el-table-column>
          <el-table-column prop="clockEndAddr" label="下班打卡位置" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.length">
        </el-pagination>
      </div>
    </el-main>


  </el-container>
</template>

<script>
  import {getNowDate, formatDate} from "@/utils/date";
  import {mapGetters} from "vuex";
  import {getAllClockRecords} from "@/api/staffApproval";

  export default {
    name: "",
    data() {
      return {
        form: {},
        projectName: "",
        tableData: [],
        queryData: {
          subName: "",
          subDate: "",
          pageNum: 1,
          totalPage: 1,
          pageSize: 10,
          selectValue: 10
        },
        options: [
          {
            name: "所有单位",
            value: 10
          },
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
        dialogTitle: "项目全生命周期数字管理平台"
      };
    },
    created() {
      this.projectName = this.project.name;
      this.init();
    },
    computed: {
      ...mapGetters(["userInfo", "name", "project", "lookUrl"])
    },
    methods: {
      init() {
        let {subName, subDate, selectValue} = this.queryData;
        let start, end;
        let type = selectValue === 10 ? undefined : selectValue;
        if (subDate && subDate.length > 0) {
          start = subDate[0];
          end = subDate[1];
        }
        getAllClockRecords(this.project.id, start, end, type).then(res => {
          let data = res.data;
          if (subName) {
            this.tableData = data.filter(e => e.attendancePersonName.indexOf(subName) !== -1);
          } else {
            this.tableData = data;
          }
        });
      },


      handleSizeChange(val) {
        this.queryData.pageSize = val;
      },
      handleCurrentChange(val) {
        this.queryData.pageNum = val;
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

<style scoped lang="scss">
  @import "../../assets/css/table.scss";
  @import "../../assets/css/dialog.scss";
  .container-box{
    .el-header{
      display: flex;
      align-items: center;
      .input-value{
        .el-date-editor{
          display: flex;
          align-items: center;
          margin-right: 10px;
        }
      }
    }
  }

  .form-bg {
    width: 90% !important;

    .form-block {
      .el-date-editor {
        width: 100% !important;
      }
    }
  }


  .user_select {
    display: flex;
    align-items: center;

    i {
      font-size: 28px;
      cursor: pointer;
    }

    .name {
      font-size: 14px;
    }
  }

</style>
