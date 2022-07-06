<!--
@name:
@description: 请假记录
@author: 王海林
@time: 2022-05-11 15:53:37
@modifier:
@modifierTime:
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.projectCode" placeholder="请输入请假人"></el-input>
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
          <!--          <el-button size="small">导出</el-button>-->
          <!--          <el-button size="small">批量操作</el-button>-->
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableData.slice((queryData.pageNum-1)*queryData.pageSize,queryData.pageNum*queryData.pageSize)"
                  style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="leaverPersonName" label="请假人"></el-table-column>
          <el-table-column prop="leaverType" label="请假类型"></el-table-column>
          <el-table-column prop="startTime" label="开始时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column prop="leaveDay" label="请假天数"></el-table-column>
          <el-table-column prop="handoffPerson" label="工作交接人"></el-table-column>
          <el-table-column prop="remark" label="请假原因"></el-table-column>
          <!--          <el-table-column prop="uploadname" label="备注"></el-table-column>-->
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <span>{{ row.status === 2 ? "审核完成" : "审核中" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="text" size="mini" @click="seeDetail(row)">详情</el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.length">
        </el-pagination>
      </div>
    </el-main>

    <el-dialog class="full-dialog defined-dialog" :fullscreen="true" :visible.sync="dialogFormVisible">
      <template slot="title">
        {{ dialogTitle }}
      </template>
      <el-container class="full_dialog_container">
        <el-main style="height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
          <div class="form-bg">
            <el-form ref="form" :model="form" label-width="80px">
              <div class="form-title">
                <div class="title-big-bar"></div>
                <strong>请假申请</strong>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>基本信息</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">请假人</div>
                    <div class="block-item-value">
                      {{ form.leaverPersonName }}
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">请假类型</div>
                    <div class="block-item-value">
                      {{ form.leaverType }}
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">请假时间</div>
                    <div class="block-item-value">
                      {{ form.startTime }} - {{ form.endTime }}
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">请假天数</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        {{ form.leaveDay }}
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">工作交接人</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        {{ form.handoffPerson }}
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">请假原因</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        {{ form.leaveReason }}
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">备注</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        {{ form.remark }}
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </el-main>
        <el-aside width="8px" class="close-wrapper">
          <div class="close-wrap">
            <i class="el-icon-caret-right"></i>
          </div>
        </el-aside>
        <el-aside
          style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);"
        >
          <tasklog :taskInfo="taskInfo" ref="tasklog"></tasklog>
        </el-aside>
      </el-container>

    </el-dialog>


  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {mapGetters} from "vuex";
  import {getLeaveRecordsById} from "@/api/staffApproval";
  import tasklog from "@/views/common/tasklog";


  export default {
    name: "",
    data() {
      return {
        form: {},
        projectName: "",
        tableData: [],
        taskInfo: {},
        dialogFormVisible: false,
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
      this.init();
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
    components: {tasklog},
    methods: {
      init() {
        getLeaveRecordsById(this.project.id).then(res => {
          console.log(res);
          this.tableData = res.data;
        });
      },
      seeDetail(row) {
        this.dialogFormVisible = true;
        this.form = Object.assign({}, row);
        let {processDefinitionId, processInstanceId, taskId} = row;
        if (processDefinitionId && processInstanceId && taskId) {
          this.taskInfo = {
            processDefinitionId, processInstanceId, taskId
          };

        } else {
          this.taskInfo = {};
        }

        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["tasklog"].initData();
        });
      },
      openDialog() {
        // this.dialogFormVisible = true;
      },
      handleSizeChange(val) {
        this.queryData.pageSize = val;
      },
      handleCurrentChange(val) {
        this.queryData.pageNum = val;
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
