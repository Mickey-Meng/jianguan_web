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
          <el-input v-model="queryData.projectCode" placeholder="请输入人员姓名"></el-input>
        </div>

      </div>
      <div class="input-box">
        <div class="input-value">
          <el-date-picker
            v-model="queryData.subProject"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <el-button type="primary">搜索</el-button>

      <div class="right-btns">
        <!-- <el-button type="primary" size="small"
          :icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
          @click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
        <div class="operate-btns">
          <!--          <el-button size="small" @click="openDialog">新增请假</el-button>-->
          <el-button size="small">导出</el-button>
          <!--          <el-button size="small">批量操作</el-button>-->
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="listData" style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="uploadname" label="打卡人"></el-table-column>
          <el-table-column prop="uploadname" label="图片"></el-table-column>
          <el-table-column prop="uploadname" label="标段"></el-table-column>
          <el-table-column prop="uploadname" label="打卡时间"></el-table-column>
          <el-table-column prop="uploadname" label="打卡次数"></el-table-column>
          <el-table-column prop="uploadname" label="打卡位置"></el-table-column>
          <el-table-column prop="uploadname" label="备注"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="queryData.totalPage">
        </el-pagination>
      </div>
    </el-main>


  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {mapGetters} from "vuex";

  export default {
    name: "",
    data() {
      return {
        form: {},
        projectName: "",
        tableData: [],
        listData: [],
        userOptions: [],
        dialogFormVisible: false,
        dialogPersonVisible: false,//控制选择人的弹框
        queryData: {
          projectCode: "",
          subProject: "",
          pageNum: 1,
          totalPage: 1,
          pageSize: 10
        },
        dialogTitle: "项目全生命周期数字管理平台"
      };
    },
    created() {
      this.projectName = this.project.name;
      this.form = {
        recorder: this.name,
        recordId: this.userInfo.ID,
        subDate: getNowDate(),//填报时间
        projectId: this.project.id,
        isContract: "1"
      };
    },
    computed: {
      ...mapGetters(["userInfo", "name", "project"])
    },
    methods: {
      addRow() {
        let obj = Object.assign({}, this.tableRowData);
        this.tableData.push(obj);
      },
      openDialog() {
        // this.dialogFormVisible = true;
      },
      deleteInfo(index) {
        this.tableData.splice(index, 1);
      },
      handleSizeChange() {
      },
      handleCurrentChange() {
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
