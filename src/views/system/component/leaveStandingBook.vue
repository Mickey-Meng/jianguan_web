<!--
@name:
@description: 请假台账
@author: 王海林
@time: 2022-08-05 13:39:26
@modifier:
@modifierTime:
-->
<template>
  <el-container>
    <el-header>
      <div>
        <div class="input-box">
          <div class="input-value">
            <el-input v-model="queryData.leaveName" clearable placeholder="请输入请假人"></el-input>
          </div>

        </div>
        <div class="input-box" style="margin-left: 10px">
          <div class="input-value">
            <el-date-picker
              v-model="queryData.leaveTime"
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
        <div class="input-box" style="margin-left: 10px">
          <div class="input-value">
            <el-select v-model="queryData.state" placeholder="请选择" clearable>
              <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button type="primary" style="margin-left: 10px" @click="queryClick">搜索</el-button>
      </div>

    </el-header>
    <el-main class="submit">
        <el-table :data="tableData.slice((queryData.pageNum-1)*queryData.pageSize,queryData.pageNum*queryData.pageSize)"
                  style="width: 100%" border height="100%" class="have_scrolling">
          <el-table-column prop="leaverPersonName" label="请假人"></el-table-column>
          <el-table-column prop="leaverType" label="请假类型"></el-table-column>
          <el-table-column prop="startTime" label="开始时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column prop="leaveDay" label="请假天数"></el-table-column>
          <el-table-column prop="handoffPerson" label="工作交接人"></el-table-column>
          <el-table-column prop="remark" label="请假原因"></el-table-column>
          <!--          <el-table-column prop="uploadname" label="备注"></el-table-column>-->
          <el-table-column label="状态">
            <template slot-scope="{row,$index}">
              <span>{{ row.status === 2 ? "审核完成" : row.status === 1 ? "审核中" : row.status === 3 ? "已失效" : "" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="text" size="mini" @click="seeDetail(row)">详情</el-button>
              <el-button type="text" size="mini" v-if="roleId ===2" @click="deleteInfo(row,$index)">删除</el-button>

            </template>
          </el-table-column>

        </el-table>
    </el-main>
    <el-footer>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableData.length">
      </el-pagination>
    </el-footer>

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
  import {getNowDate, checkAuditTime} from "@/utils/date";
  import {mapGetters} from "vuex";
  import {getLeaveRecordsById,getAllLeaveRecords, deleteLeaveRecord, deleteChangeRecord} from "@/api/staffApproval";
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
        allData: [],
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
        status: [
          {
            name: "审批中",
            value: 1
          },
          {
            name: "审批通过",
            value: 2
          },
          {
            name: "已失效",
            value: 3
          }
        ],
        queryData: {
          leaveName: "",
          leaveTime: null,
          pageNum: 1,
          totalPage: 1,
          state: "",
          pageSize: 10,
          selectValue: 10
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
      ...mapGetters(["userInfo", "name", "project", "roleId"])
    },
    components: {tasklog},
    methods: {
      init() {
        let {selectValue, leaveName, leaveTime, state} = this.queryData;
        let type = selectValue === 10 ? undefined : selectValue;
        getAllLeaveRecords(this.project.id, type, state).then(res => {
          let data = res.data;
          if (!leaveName && !leaveTime) {
            this.tableData = data;
          } else if (leaveName && !leaveTime) {
            this.tableData = data.filter(e => e.leaverPersonName.indexOf(leaveName) !== -1);
          } else if (!leaveName && leaveTime && leaveTime.length > 0) {
            let startTime = leaveTime[0];
            let endTime = leaveTime[1];
            this.tableData = data.filter(e => e.startTime && e.endTime && checkAuditTime(startTime, endTime, e.startTime, e.endTime));
          } else {
            let startTime = leaveTime[0];
            let endTime = leaveTime[1];
            this.tableData = data.filter(e => e => e.startTime && e.endTime && checkAuditTime(startTime, endTime, e.startTime, e.endTime) && e.leaverPersonName.indexOf(leaveName) !== -1);
          }
        });
      },
      seeDetail(row) {
        this.dialogFormVisible = true;
        this.form = Object.assign({}, row);
        let {processDefinitionId, processInstanceId, taskId} = row;
        if (processDefinitionId && processInstanceId && taskId) {
          let flowKey = processDefinitionId.split(":")[0];
          this.taskInfo = {
            processDefinitionId, processInstanceId, taskId, flowKey
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
      deleteInfo(row, index) {
        this.$confirm("确定删除该请假信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteLeaveRecord(row.id, this.project.id).then(() => {
            // this.tableData.splice(index, 1);
            let ind = this.tableData.findIndex(e => e.id === row.id);
            this.tableData.splice(ind, 1);
            // this.init();
            this.$message.success("删除成功");
          }).catch(() => {
            this.$message.info("删除失败");
          });
        }).catch(() => {
          this.$message.info("取消删除");
        });
      },
      handleSizeChange(val) {
        this.queryData.pageSize = val;
      },
      handleCurrentChange(val) {
        this.queryData.pageNum = val;
      },
      queryClick() {
        this.init();
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../../assets/css/table.scss";
  @import "../../../assets/css/dialog.scss";
  .el-header {
    > div {
      display: flex;
    }
  }

  .submit {
    padding: 20px 0 0 0 !important;
  }

  .container-box {
    .el-header {
      display: flex;
      align-items: center;

      .input-value {
        .el-date-editor {
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
