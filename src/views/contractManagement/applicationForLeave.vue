<!--
@name:
@description: 请假申请
@author: 王海林
@time: 2022-05-11 15:51:12
@modifier:
@modifierTime:
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.leaveName" clearable placeholder="请输入请假人"></el-input>
        </div>

      </div>
      <div class="input-box">
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
      <el-button type="primary">搜索</el-button>

      <div class="right-btns">
        <!-- <el-button type="primary" size="small"
          :icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
          @click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
        <div class="operate-btns">
          <el-button size="small" @click="openDialog">新增请假</el-button>
<!--          <el-button size="small">导出</el-button>-->
          <!--          <el-button size="small">批量操作</el-button>-->
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableData.slice((queryData.pageNum-1)*queryData.pageSize,queryData.pageNum*queryData.pageSize)"
                  style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="leaverPersonName" label="请假人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="leaverType" label="请假类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="startTime" label="开始时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endTime" label="结束时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="leaveDay" label="请假天数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="handoffPerson" label="工作交接人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="leaveReason" label="请假原因" show-overflow-tooltip></el-table-column>
          <el-table-column prop="subDate" label="申请时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row,$index}">
              <el-button type="text" size="mini" @click="seeDetail(row)">详情</el-button>
              <el-button type="text" size="mini">删除</el-button>
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

    <!--    基本信息弹框-->
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
                      <el-select placeholder="请选择" v-model="form.leaverType" v-if="isCreate">
                        <el-option
                          v-for="item in eventType"
                          :key="item.id"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                      <div v-else>{{ form.leaverType }}</div>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">请假时间</div>
                    <div class="block-item-value">
                      <el-date-picker
                        v-model="leaveTime"
                        @change="changeTime"
                        v-if="isCreate"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                      </el-date-picker>
                      <div v-else>{{ form.startTime }}至{{ form.endTime }}</div>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">请假天数</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser" v-if="isCreate">
                        <el-input v-model="form.leaveDay"></el-input>
                      </el-form-item>
                      <div v-else>{{ form.leaveDay }}</div>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">工作交接人</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser" v-if="isCreate">
                        <el-select v-model="form.handoffPersonId" filterable placeholder="请选择">
                          <el-option v-for="item in handoffPerson" :key="item.id"
                                     :label="item.name" :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <div v-else>{{ form.leaveReason }}</div>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">请假原因</div>
                    <div class="block-item-value">
                      <el-form-item prop="leaveReason" v-if="isCreate">
                        <el-input v-model="form.leaveReason"></el-input>
                      </el-form-item>
                      <div v-else>{{ form.leaveReason }}</div>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">备注</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        <el-input v-model="form.remark"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <approveuser :auditUser="auditUser" :flowKey="flowKey"></approveuser>
              <div class="form-block" v-if="isCreate">
                <el-button class="submit-btn" size="small" type="primary" @click="submitStaffInfo" v-if="isCreate">提交
                </el-button>
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
                    <tasklog v-show="!isCreate" :taskInfo="taskInfo" ref="tasklog"></tasklog>
        </el-aside>
      </el-container>

    </el-dialog>


  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {getDic} from "@/api/user";
  import {mapGetters} from "vuex";
  import {getOrgUser, submitLeave, getLeave} from "@/api/staffApproval";
  import {submitUserTask} from "@/api/quality";
  import {getUserRoleAndCode} from "@/api/newProject";
  import tasklog from "@/views/common/tasklog";
  import approveuser from "@/views/common/approveuser.vue";


  export default {
    name: "",
    data() {
      return {
        form: {},
        taskInfo: {},
        tableData: [],//请假数据
        userOptions: [],//选择用户
        handoffPerson: [],//工作交接可选人
        eventType: [],
        leaveTime: "",
        dialogFormVisible: false,
        queryData: {
          leaveName: "",
          subProject: "",
          pageNum: 1,
          leaveTime: null,
          totalPage: 1,
          pageSize: 10
        },
        flowTypes: [
          {
            key: "shigongjihe",//施工单位人员请假
            flowKey: "sgdwryqj"
          },
          {
            key: "jianlijihe",//监理单位人员请假
            flowKey: "jldwryqj"
          },
          {
            key: "quanzijihe",//全咨单位人员请假
            flowKey: "qzdwryqj"
          }
        ],
        userRoleParentCode: "",
        isCreate: true,
        dialogTitle: "项目全生命周期数字管理平台",
        workTime: {
          wh: 8,//上班时长,
          on: "9:00",//上班时间
          off: "18:00",//下班时间
          noonOn: "12:00",//午休开始时间
          noonOff: "14:00"//午休结束时间
        },
        auditUser: {},
        flowKey: ""
      };
    },
    created() {
      this.init();
      this.initData();
    },
    computed: {
      ...mapGetters(["userInfo", "name", "project", "roleId"])
    },
    components: {tasklog, approveuser},
    methods: {

      init() {
        getDic("qjlx").then(res => {
          this.eventType = res.data.qjlx;
        });
        getOrgUser({projectid: this.project.id}).then(res => {
          this.handoffPerson = res.data.filter(e => e.id !== this.userInfo.ID);
        });
        //获取用户角色
        getUserRoleAndCode(this.project.id).then(res => {
          if (res && res.data) {
            this.userRoleParentCode = res.data.parentCode;
          }
        });
      },
      initData() {
        getLeave(this.project.id).then(res => {
          this.tableData = res.data;
        });
      },
      initForm() {
        this.form = {
          startTime: "",//开始时间
          endTime: "",//结束时间
          handoffPerson: "",//工作交接人
          handoffPersonId: null,//交接人ID
          leaveDay: null,//请假天数
          leavePersonId: this.userInfo.ID,//leavePersonId
          leaverPersonName: this.name,//leaverPersonName
          leaveReason: "",//leaveReason
          leaverType: "",//请假类型id
          projectId: this.project.id,//项目id
          remark: "",//备注
          subDate: ""//填报时间
        };
      },
      openDialog() {
        if (!this.userRoleParentCode) {
          this.$message({
            type: "warning",
            message: "配置错误、无法获取审批流程，请联系管理员！",
            customClass: "message_override"
          });
          return false;
        }
        let flowObj = this.flowTypes.find(e => e.key === this.userRoleParentCode);
        if (!flowObj) {
          this.$message({
            type: "warning",
            message: "配置错误、无法获取审批流程，请联系管理员！",
            customClass: "message_override"
          });
          return false;
        }
        this.flowKey = flowObj.flowKey;
        this.dialogFormVisible = true;
        this.isCreate = true;
        this.initForm();
        this.leaveTime = "";
      },
      submitStaffInfo() {
        let obj = Object.assign({}, this.form);
        if (this.leaveTime.length > 0) {
          obj.startTime = this.leaveTime[0];
          obj.endTime = this.leaveTime[1];
        }
        obj.subDate = getNowDate();
        obj.processDefinitionKey = this.flowKey;
        if (obj.handoffPersonId) {
          let info = this.handoffPerson.find(e => e.id === obj.handoffPersonId);
          obj.handoffPerson = info.name;
        }
        submitLeave(obj).then(res => {
          this.issueStep(res);
        });
      },
      issueStep(row) {
        let obj = {
          copyData: {},
          flowTaskCommentDto: {
            approvalType: "",
            comment: "",
            delegateAssginee: ""
          },
          masterData: {},
          processInstanceId: row.data,
          slaveData: {},
          taskId: "",
          taskletiableData: {}
        };
        submitUserTask(obj).then(res1 => {
          this.$message({
            type: "success",
            message: "填报成功!",
            customClass: "message_override"
          });
          this.initData();
          this.dialogFormVisible = false;
        });
      },
      seeDetail(row) {
        this.isCreate = false;
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
      //判断时间是不是同一天
      judgeFn(time, time1) {
        return new Date(time).toDateString() === new Date(time1).toDateString();
      },
      changeTime(time) {
        if (time && time.length > 0) {
          let start = time[0];
          let end = time[1];
          let num = this.getLeaveTime(start, end);
          this.form.leaveDay = num;
        } else {
          this.form.leaveDay = null;
        }
      },
      getLeaveTime(startDate, endDate) {
        // 校验参数
        if (!startDate || !endDate) {
          return "";
        }
        let startYearMonthDayStr = startDate.split(" ")[0];
        let endYearMonthDayStr = endDate.split(" ")[0];
        // 解析字符串
        let startYear = startDate.match(/(\d{4})-\d{2}-\d{2}/)[1];
        let startMonth = startDate.match(/\d{4}-(\d{2})-\d{2}/)[1];
        let startDay = startDate.match(/\d{4}-\d{2}-(\d{2})/)[1];
        let startHour = startDate.match(/(\d{1,2}):\d{1,2}/)[1];
        let startMinutes = startDate.match(/\d{1,2}:(\d{1,2})/)[1];
        let startTime = new Date();
        startTime.setFullYear(startYear);
        startTime.setMonth(startMonth - 1);
        startTime.setDate(startDay);
        startTime.setHours(startHour);
        startTime.setMinutes(startMinutes);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        let endYear = endDate.match(/(\d{4})-\d{2}-\d{2}/)[1];
        let endMonth = endDate.match(/\d{4}-(\d{2})-\d{2}/)[1];
        let endDay = endDate.match(/\d{4}-\d{2}-(\d{2})/)[1];
        let endHour = endDate.match(/(\d{1,2}):\d{1,2}/)[1];
        let endMinutes = endDate.match(/\d{1,2}:(\d{1,2})/)[1];
        let endTime = new Date();
        endTime.setFullYear(endYear);
        endTime.setMonth(endMonth - 1);
        endTime.setDate(endDay);
        endTime.setHours(endHour);
        endTime.setMinutes(endMinutes);
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);

        // 12点到5点半的毫秒数
        let from1200To530 = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
        // 8点半到12点的毫秒数
        let from830To12 = 30 * 60 * 1000 + 3 * 60 * 60 * 1000;

        // 开始判断
        // 判断开始时间，请假时长
        // 开始时间的8点半时间对象
        let startTime830 = new Date(startTime.valueOf());
        startTime830.setHours(8);
        startTime830.setMinutes(30);
        // 开始时间的12点时间对象
        let startTime12 = new Date(startTime.valueOf());
        startTime12.setHours(12);
        startTime12.setMinutes(0);
        // 开始时间的下午5点半时间对象
        let startTime530 = new Date(startTime.valueOf());
        startTime530.setHours(17);
        startTime530.setMinutes(30);

        // 结束时间的8点半时间对象
        let endTime830 = new Date(endTime.valueOf());
        endTime830.setHours(8);
        endTime830.setMinutes(30);
        // 结束时间的12点时间对象
        let endTime12 = new Date(endTime.valueOf());
        endTime12.setHours(12);
        endTime12.setMinutes(0);
        // 结束时间的下午5点半时间对象
        let endTime530 = new Date(endTime.valueOf());
        endTime530.setHours(17);
        endTime530.setMinutes(30);


        // 开始时间的23:59:59
        let startTime235959 = new Date(startTime.valueOf());
        startTime235959.setHours(23);
        startTime235959.setMinutes(59);
        startTime235959.setMinutes(59);

        // 结束时间的23:59:59
        let endTime235959 = new Date(endTime.valueOf());
        endTime235959.setHours(23);
        endTime235959.setMinutes(59);
        endTime235959.setMinutes(59);
        let distanceDayNum = (endTime235959 - startTime235959) / 1000 / 60 / 60 / 24 - 1;
        let startDayNum = 0;
        // 判断同一天的情况
        if (startYearMonthDayStr == endYearMonthDayStr) {
          // 0.5天的情况
          // 结束时间小于中午12点大于8:30
          if (endTime.getTime() <= startTime12.getTime() && endTime.getTime() > startTime830.getTime()) {
            return 0.5;
          }

          // 开始时间大于中午12点小于17:30
          if (startTime.getTime() > startTime12.getTime() && startTime.getTime() <= startTime530.getTime()) {
            return 0.5;
          }

          // 一天的情况
          // 早8:30-下午5:30
          if (startTime.getTime() <= startTime830.getTime() && endTime.getTime() >= startTime530.getTime()) {
            return 1;
          }
          // 早上 8:30-12:00 中的某一个时刻  到 下午 12:00-17:30 中的某一个时刻
          if (startTime.getTime() < startTime12.getTime() && endTime.getTime() > startTime12.getTime()) {
            return 1;
          }
        }

        // 跨天的情况
        if (startYearMonthDayStr != endYearMonthDayStr) {
          // 开始为半天的情况,结束为半天的情况
          if (startTime.getTime() >= startTime12.getTime() && endTime.getTime() <= endTime12.getTime()) {
            return 0.5 + 0.5 + distanceDayNum;
          }
          // 开始为半天，结束为一天的情况
          if (startTime.getTime() >= startTime12.getTime() && endTime.getTime() > endTime12.getTime()) {
            return 0.5 + 1 + distanceDayNum;
          }

          // 开始为一天，结束为半天的情况
          if (startTime.getTime() < startTime12.getTime() && endTime.getTime() <= endTime12.getTime()) {
            return 1 + 0.5 + distanceDayNum;
          }

          // 开始为一天，结束为一天的情况
          if (startTime.getTime() < startTime12.getTime() && endTime.getTime() > endTime12.getTime()) {
            return 1 + 1 + distanceDayNum;
          }
        }
        return "";
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
