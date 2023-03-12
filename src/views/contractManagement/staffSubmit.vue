<!--
 * @Descripttion: 人员填报
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 10:03:01
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 14:04:52
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.subName" clearable placeholder="请输入记录人"></el-input>

          <!--          <el-input v-model="queryData.projectCode" placeholder="请输入标段"></el-input>-->
        </div>

      </div>
      <div class="input-box"  style="margin-left: 10px">
        <div class="input-value">
          <el-date-picker
            v-model="queryData.subDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择填报时间">
          </el-date-picker>
        </div>
      </div>
      <el-button type="primary" style="margin-left: 10px" @click="queryClick">搜索</el-button>

      <div class="right-btns">
        <div class="operate-btns">
          <el-button size="small" @click="openDialog">新增填报</el-button>
<!--          <el-button size="small">导出</el-button>-->
<!--          <el-button size="small">批量操作</el-button>-->
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="listData.slice((queryData.pageNum-1)*queryData.pageSize,queryData.pageNum*queryData.pageSize)"
                  style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="projectName" label="标段"></el-table-column>
          <el-table-column prop="recorder" label="记录人"></el-table-column>
          <el-table-column prop="uploadname" label="填报时间">
            <template slot-scope="{row}">
              {{ row.subDate | getTime }}
            </template>
          </el-table-column>
          <el-table-column label="人员类型">
            <template slot-scope="{row}">
              {{ row.isContract === 1 ? "合同人员" : "非合同人员" }}
            </template>
          </el-table-column>
          <!--          <el-table-column prop="uploadname" label="是否自管"></el-table-column>-->
          <!--          <el-table-column prop="uploadname" label="状态"></el-table-column>-->
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <!--              <el-button type="text" size="mini" @click="issueStep(row)">发布</el-button>-->
              <!--              <el-button type="text" size="mini">修改</el-button>-->
              <el-button type="text" size="mini" @click="seeDetail(row)">详情</el-button>
<!--              <el-button type="text" size="mini">删除</el-button>-->
            </template>
          </el-table-column>
        </el-table>
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
                    <strong>人员填报</strong>
                  </div>
                  <div class="form-block">
                    <div class="form-block-title">
                      <div class="title-bar"></div>
                      <strong>基本信息</strong>
                    </div>
                    <div class="block-line">
                      <div class="block-item">
                        <div class="block-item-label">标段</div>
                        <div class="block-item-value">
                          {{ form.projectName }}
                        </div>
                      </div>
                      <div class="block-item">
                        <div class="block-item-label">记录人</div>
                        <div class="block-item-value">
                          <el-input v-model="form.recorder" readonly></el-input>
                        </div>
                      </div>
                    </div>
                    <div class="block-line">
                      <div class="block-item">
                        <div class="block-item-label">报审日期</div>
                        <div class="block-item-value">
                          <el-date-picker
                            v-model="form.subDate"
                            type="datetime"
                            :clearable="false"
                            placeholder="选择日期时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                          >
                          </el-date-picker>
                        </div>
                      </div>
                      <div class="block-item">
                        <div class="block-item-label">人员类型</div>
                        <div class="block-item-value">
                          <el-form-item prop="projectChargeUser">
                            <el-select v-model="form.isContract" placeholder="请选择">
                              <el-option label="合同人员" :value="1"></el-option>
                              <el-option label="非合同人员" :value="0" :disabled="true"></el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="block-line">
                      <div class="block-item">
                        <div class="block-item-label">是否自管</div>
                        <div class="block-item-value">
                          {{ project.isauto === 1 ? "自管" : "非自管" }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-block">
                    <div class="form-block-title">
                      <div class="title-bar"></div>
                      <strong>报审信息</strong>
                    </div>
                    <div class="block-line" v-if="isCreate">
                      <el-button size="small" type="primary" @click="addRow">添加行</el-button>
                    </div>
                    <div class="block-table">
                      <el-table
                        :data="tableData"
                        border
                        v-if="isCreate"
                        key="create_table"
                        class="have_scrolling"
                        style="width: 100%">
                        <el-table-column
                          label="姓名"
                          width="160">
                          <template slot-scope="{row}">
                            <div class="user_select">
                              <el-select v-model="row.userId" filterable placeholder="请选择人员" @change="staffChange">
                                <el-option
                                  v-for="item in selectUsers"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id"
                                  :disabled="disabledArr.includes(item.id)">
                                </el-option>
                              </el-select>
                            </div>
                          </template>
                        </el-table-column>

                        <el-table-column
                          label="身份证号"
                          width="220">
                          <template slot-scope="{row}">
                            <el-input v-model="row.identityId" placeholder="请输入身份证号"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="有效期"
                          width="320">
                          <template slot-scope="{row}">
                            <el-date-picker
                              v-model="row.identityTime"
                              type="daterange"
                              value-format="yyyy-MM-dd"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
                            </el-date-picker>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="性别"
                          width="120">
                          <template slot-scope="{row}">
                            <!--                            <el-input v-model="row.name"></el-input>-->
                            <el-select v-model="row.gender" placeholder="请选择">
                              <el-option label="男" :value="1"></el-option>
                              <el-option label="女" :value="0"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="岗位"
                          width="150">
                          <template slot-scope="{row}">
                            <el-input v-model="row.post" readonly></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="证件名称"
                          width="250">
                          <template slot-scope="{row}">
                            <el-input v-model="row.certificateName"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="证件编号"
                          width="250">
                          <template slot-scope="{row}">
                            <el-input v-model="row.certificateCode"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="发证单位"
                          width="250">
                          <template slot-scope="{row}">
                            <el-input v-model="row.issuer"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="有效期"
                          width="320">
                          <template slot-scope="{row}">
                            <el-date-picker
                              v-model="row.effectiveTime"
                              type="daterange"
                              value-format="yyyy-MM-dd"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
                            </el-date-picker>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="文化程度"
                          width="120">
                          <template slot-scope="{row}">
                            <el-input v-model="row.education"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="脸部照片"
                          width="120"
                          align="center">
                          <template slot-scope="{row}">
                            <img-viewer :img-list="[row.pic]"></img-viewer>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          fixed="right"
                          width="200">
                          <template slot-scope="{row,$index}">
                            <div style="display: flex;justify-content: space-around">
                              <el-upload class="upload-demo" action="" :limit="1" :show-file-list="false"
                                         ref="upload"
                                         accept=".jpg,.jpeg,.png,gif,JPG,JPEG,PNG,GIF,.map4,.xlsx,.xls,.pdf,.doc,.docx"
                                         :http-request="importFile">
                                <el-button size="mini" type="primary" class="primary_mini"
                                           @click="currentRowData(row,$index)">
                                  上传照片
                                </el-button>
                              </el-upload>
                              <el-button type="danger" size="mini" @click="deleteInfo(row,$index)">删除</el-button>
                            </div>

                          </template>
                        </el-table-column>
                      </el-table>
                      <el-table
                        :data="tableData"
                        border
                        v-else
                        key="detail_iii"
                        class="have_scrolling"
                        style="width: 100%">
                        <el-table-column
                          label="姓名"
                          prop="name"
                          width="160">
                        </el-table-column>

                        <el-table-column
                          label="身份证号"
                          width="220"
                          prop="identityId">
                        </el-table-column>
                        <el-table-column
                          label="有效期"
                          width="320"
                          prop="identityTime">
                        </el-table-column>
                        <el-table-column
                          label="性别"
                          width="120">
                          <template slot-scope="{row}">
                            {{ row.gender == 1 ? "男" : "女" }}

                          </template>
                        </el-table-column>
                        <el-table-column
                          label="岗位"
                          width="150"
                          prop="post">
                        </el-table-column>
                        <el-table-column
                          label="证件名称"
                          width="250"
                          prop="certificateName">
                        </el-table-column>
                        <el-table-column
                          label="证件编号"
                          width="250"
                          prop="certificateCode">
                        </el-table-column>
                        <el-table-column
                          label="发证单位"
                          width="250"
                          prop="issuer">
                        </el-table-column>
                        <el-table-column
                          label="有效期"
                          width="320"
                          prop="effectiveTime">

                        </el-table-column>
                        <el-table-column
                          label="文化程度"
                          width="120"
                          prop="education">
                        </el-table-column>
                        <el-table-column
                          label="脸部照片"
                          width="120"
                          align="center">
                          <template slot-scope="{row}">
                            <img-viewer :img-list="[row.peoplePic]"></img-viewer>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  <approveuser v-if="approveVisible" :auditUser="auditUser" :flowKey="flowKey"></approveuser>
                  <div class="form-block" v-if="isCreate">
                    <el-button class="submit-btn" size="small" type="primary" @click="submitStaffInfo">提交
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

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="listData.length">
        </el-pagination>
      </div>
    </el-main>


  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {mapGetters} from "vuex";
  import {submitUserTask, listHandleTask} from "@/api/quality";
  import uploadView from "@/views/common/upload";
  // import * as api from "@/api/quality";
  import {uploadFile} from "@/api/file";
  import {formatDate} from "@/utils/date";
  import {getOrgUser, addStaffApproval, getStaffApprovalBase} from "@/api/staffApproval";
  import tasklog from "@/views/common/tasklog";
  import {getUserRoleAndCode} from "@/api/newProject";
  import approveuser from "@/views/common/approveuser.vue";
  import {getFlowAuditEntry} from "@/api/quality";
  import {getToken} from "@/utils/auth";


  export default {
    name: "",
    data() {
      return {
        form: {},//表单
        taskInfo: {},
        tableData: [],//填报的数据
        listData: [],//报审数据
        userOptions: [],
        dialogFormVisible: false,
        allFlowTypes: [
          {
            key: "shigongjihe",//施工单位合同人员报审
            isContract: 1,
            flowKey: "sgdwhtrybs"
          },
          {
            key: "jianlijihe",//监理单位合同人员报审
            isContract: 1,
            flowKey: "jldwhtrybs"
          },
          {
            key: "quanzijihe",//监理单位合同人员报审
            isContract: 1,
            flowKey: "qzdwhtrybs"
          }
        ],
        userRoleParentCode: "",
        // dialogPersonVisible: false,//控制选择人的弹框
        queryData: {
          projectCode: "",
          subProject: "",
          subName: "",
          pageNum: 1,
          pageSize: 10,
          subDate: null
        },
        allData: [],
        tableRowData: {
          identityId: "",//身份证ID;
          identityTime: "",//身份证有效时间
          gender: 1,//性别 0女 1男
          post: "",//角色
          certificateName: "",//证件名称
          certificateCode: "", //证件编号
          issuer: "", //发证单位
          effectiveTime: "", //证件有效期
          education: "", //文化程度
          peoplePic: "", //人脸照片
          name: "", //用户名,
          userId: null,//用户ID
          roldid: null,//角色id
          pic: ""//暂存的相片url，提交时删除
        },
        selectUsers: [],//根据上报人员角色查询对应角色的人员
        dialogTitle: "全生命周期智慧建设管理平台",
        currentRow: {},
        currentRowIndex: null,
        disabledArr: [],
        isShow: true,
        isCreate: true,
        auditUser: {},
        approveVisible:true,
        flowKey: ""
      };
    },
    created() {
      this.initForm();

      this.initData();
    },
    computed: {
      ...mapGetters(["userInfo", "name", "project", "roleId", "getUrl"])
    },
    components: {uploadView, tasklog, approveuser},
    methods: {
      initForm() {
        this.form = {
          projectName: this.project.name,
          recorder: this.name,
          recordId: this.userInfo.ID,
          subDate: getNowDate(),//填报时间
          projectId: this.project.id,
          isContract: 1
        };
      },
      //添加行数据
      addRow() {
        let obj = Object.assign({}, this.tableRowData);
        this.tableData.push(obj);
      },
      //新增
      openDialog() {
        if (!this.userRoleParentCode) {
          this.$message({
            type: "warning",
            message: "配置错误、无法获取审批流程，请联系管理员！",
            customClass: "message_override"
          });
          return false;
        }
        let flowObj = this.allFlowTypes.find(e => e.key === this.userRoleParentCode && e.isContract === this.form.isContract);
        if (!flowObj) {
          this.$message({
            type: "warning",
            message: "配置错误、无法获取审批流程，请联系管理员！",
            customClass: "message_override"
          });
          return false;
        }
        this.flowKey = flowObj.flowKey;
        this.disabledArr = [];
        this.tableData = [];
        this.initForm();
        this.dialogFormVisible = true;
        this.isCreate = true;
      },
      //删除行数据
      deleteInfo(row, index) {
        let a = this.disabledArr.findIndex(e => e === row.userId);
        this.disabledArr.splice(a, 1);
        this.tableData.splice(index, 1);
      },
      handleSizeChange(val) {
        this.queryData.pageSize = val;
      },
      handleCurrentChange(val) {
        this.queryData.pageNum = val;
      },
      queryClick() {
        let {subDate, subName} = this.queryData;
        if (!subDate && !subName) {
          this.listData = this.allData;
        } else if (!subDate && subName) {
          this.listData = this.allData.filter(e => e.recorder.indexOf(subName )!== -1);
        } else if (subDate && !subName) {
          this.listData = this.allData.filter(e => e.uploadname.indexOf(subDate )!== -1);
        } else {
          this.listData = this.allData.filter(e => e.uploadname.indexOf(subDate )!== -1 && e.recorder.indexOf(subName) !== -1);
        }
      },
      //暂存当前行数据
      currentRowData(row, index) {
        this.currentRow = Object.assign({}, row);
        this.currentRowIndex = index;
      },
      //上传文件
      importFile(params) {
        let data = new FormData();
        data.append("file", params.file);
        uploadFile(data).then((res) => {
          this.$message({
            type: "success",
            message: "上传成功!",
            customClass: "message_override"
          });
          this.$refs.upload.clearFiles();
          this.currentRow.peoplePic = res.data;
          this.currentRow.pic = '/ZhuJiRoad/mong/preview?fileid=' + res.data;
          this.tableData.splice(this.currentRowIndex, 1, this.currentRow);
        });
      },

      initData() {
        //获取当前人员对应组织下所有用户
        getOrgUser({projectid: this.project.id}).then(res => {
          this.selectUsers = res.data || [];
        });
        //获取报审的数据
        getStaffApprovalBase({projectid: this.project.id}).then(res => {
          let data = res?.data || [];
          this.allData = data;
          if (data && data.length > 0) {
            this.listData = data.map(item => {
              let obj = Object.assign(item, item.person);
              return obj;
            });
          } else {
            this.listData = [];
          }
        });
        //获取用户角色
        getUserRoleAndCode(this.project.id).then(res => {
          if (res && res.data) {
            this.userRoleParentCode = res.data.parentCode;
          }
        });
      },
      //选择填报人员事件
      staffChange(val) {
        this.disabledArr.push(val);
        let tablerow = this.tableData.find(e => e.userId === val);
        let info = this.selectUsers.find(e => e.id === val);
        tablerow.post = info.rolename;
        tablerow.roldId = info.roleid;
        tablerow.name = info.name;
      },
      //提交表单
      submitStaffInfo() {

        if (this.tableData.length === 0) {
          return false;
        }
        let data = this.tableData.map(item => {
          let obj = Object.assign({}, item);
          delete obj.pic;
          if (obj.effectiveTime && obj.effectiveTime.length > 0) {
            obj.effectiveTime = obj.effectiveTime[0] + "至" + obj.effectiveTime[1];
          }
          if (obj.identityTime && obj.identityTime.length > 0) {
            obj.identityTime = obj.identityTime[0] + "至" + obj.identityTime[1];
          }
          return obj;
        });
        let form = Object.assign({}, this.form);
        let dd = {
          person: form,
          personSubs: data,
          processKey: this.flowKey
        };
        addStaffApproval(dd).then(res => {
          this.issueStep(res);
        });
      },
      issueStep(row) {
        //查询人员
        getFlowAuditEntry({
          flowKey: this.flowKey,
          buildSection: this.$store.getters.project.id,
          projectId: this.$store.getters.project["parentid"] || 2
        }).then(res => {
          let arr = [];
          let {data} = res;
          for (let i in data) {
            arr = arr.concat(data[i]);
          }
          let userMap = {};
          arr.forEach(item => {
            let value = item.entryUserVariable;
            userMap[value] = item.userNames.toString();
          });
          userMap.startUserName = getToken("name");
          let obj = {
            copyData: {},
            flowTaskCommentDto: {
              approvalType: "",
              comment: "",
              delegateAssginee: ""
            },
            // auditUser: userMap,
            masterData: {},
            processInstanceId: row.data,
            slaveData: {},
            taskId: "",
            taskVariableData: userMap
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
        });
      },
      seeDetail(row) {
        //查看详情
        this.form = Object.assign({}, row.person);
        let data = row.personSubs;
        if (data && data.length > 0) {
          this.tableData = data.map(item => {
            if (item.peoplePic) {
              item.peoplePic = "/ZhuJiRoad/mong/preview?fileid=" + item.peoplePic;
            }
            return item;
          });
        }
        this.isCreate = false;
        let {maps} = row;
        let {processDefinitionId, processInstanceId, taskId} = maps;
        if (processDefinitionId && processInstanceId && taskId) {
          let flowKey = processDefinitionId.split(":")[0];
          this.taskInfo = {
            processDefinitionId, processInstanceId, taskId,flowKey
          };
        } else {
          this.taskInfo = {};
        }
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["tasklog"].initData();
        });
      }
    },
    filters: {
      getTime(val) {
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

  .form-bg {
    width: 90% !important;

    .form-block {
      .el-date-editor {
        width: 100% !important;
      }
    }
  }

  ::v-deep.upload_box {
    .upload-demo {
      .el-upload {
        .el-button {
          padding: 7px 15px !important;
          height: unset !important;
          line-height: 1 !important;
          font-size: 12px !important;
        }
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
