<!--
 * @Descripttion:人员变更
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 10:05:24
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 10:05:33
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.projectCode" placeholder="请输入标段"></el-input>
        </div>

      </div>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.subProject" placeholder="请输入记录人"></el-input>
        </div>
      </div>
      <el-button type="primary">搜索</el-button>

      <div class="right-btns">
        <!-- <el-button type="primary" size="small"
          :icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
          @click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
        <div class="operate-btns">
          <el-button size="small" @click="openDialog">新增变更</el-button>
          <el-button size="small">导出</el-button>
          <el-button size="small">批量操作</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableDta" style="width: 100%" height="calc(100% - 48px)" class="have_scrolling" border>
          <el-table-column prop="projectChildName" label="标段"></el-table-column>
          <el-table-column prop="changeTypeName" label="人员变更类型"></el-table-column>
          <el-table-column prop="changePostName" label="变更岗位"></el-table-column>
          <el-table-column prop="beforePerson" label="变更前人员"></el-table-column>
          <el-table-column prop="afterPerson" label="变更后人员"></el-table-column>
          <el-table-column prop="subDate" label="录入日期"></el-table-column>
          <!--          <el-table-column prop="uploadname" label="负责人"></el-table-column>-->
          <!--          <el-table-column prop="uploadname" label="状态"></el-table-column>-->
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
                       :total="queryData.totalPage">
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
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
              <div class="form-title">
                <div class="title-big-bar"></div>
                <strong>人员变更</strong>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>基本信息</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">标段<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-input readonly v-model="form.projectChildName"></el-input>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">填报人<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-input readonly v-model="form.recorder"></el-input>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">填报日期<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="subDate" v-if="isCreate">
                        <el-date-picker
                          v-model="form.subDate"
                          type="datetime"
                          :clearable="false"
                          placeholder="选择日期时间"
                          value-format="yyyy-MM-dd HH:mm:ss"

                        >
                        </el-date-picker>
                      </el-form-item>
                      <div v-else>{{ form.subDate }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>变更信息</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">项目<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="projectName">
                        <el-input readonly v-model="form.projectName"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">标段<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input readonly v-model="form.projectChildName"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">人员变更类型<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="changeType">
                        <el-select placeholder="请选择" v-model="form.changeType" @change="changeValue" v-if="isCreate">
                          <el-option
                            v-for="item in roleType"
                            :key="item.roleid"
                            :label="item.rolename"
                            :value="item.roleid">
                          </el-option>
                        </el-select>
                        <div v-else>{{ form.changeTypeName }}</div>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">变更岗位<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="changePost">
                        <el-select placeholder="请选择" disabled v-model="form.changePost" v-if="isCreate">
                          <el-option
                            v-for="item in roleType"
                            :key="item.roleid"
                            :label="item.rolename"
                            :value="item.roleid">
                          </el-option>
                        </el-select>
                        <div v-else>{{ form.changePostName }}</div>
                      </el-form-item>
                    </div>
                  </div>
                </div>

                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">变更前人员<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="beforePersonId">
                        <el-select placeholder="请选择" v-model="form.beforePersonId" v-if="isCreate">
                          <el-option
                            v-for="item in beforeUsers"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                        <div v-else>{{ form.beforePerson }}</div>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">变更前(执业)资格证书号</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input v-model="form.beforeCode"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">变更后人员<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="afterPersonId">
                        <el-select placeholder="请选择" v-model="form.afterPersonId" v-if="isCreate">
                          <el-option
                            v-for="item in afterUsers"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                        <div v-else>{{ form.afterPerson }}</div>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">变更后(执业)资格证书号</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input v-model="form.afterCode"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">变更单位<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input readonly v-model="form.changeUnitName"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>


              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>附件</strong>
                  <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
                </div>
                <div class="block-line" style="height: 35px">
                  <!--                  <el-button size="small" type="primary">上传附件</el-button>-->
                  <upload @afterUp="afterUp($event)" v-if="isCreate"></upload>
                  <!-- <div class="block-table-title">附件</div> -->
                  <div class="block-table-btns">
                    <el-button size="small" type="primary" v-if="!isCreate" @click="downLoadEvent">下载全部</el-button>
                  </div>
                </div>
                <div class="block-table">
                  <el-table :data="fileData" border style="width: 100%;">-->
                    <el-table-column prop="fileName" label="附件"></el-table-column>
                    <el-table-column prop="uploadTime" label="上传日期"></el-table-column>
                    <el-table-column prop="uploadPerson" label="上传人"></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="{row,$index}">
                        <el-button type="danger" size="mini" @click="deleteInfo(row,$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div class="block-line">
                  <p>
                    <span style="font-family: FangSong, FangSong_GB2312; font-size: 14px;">
                      <em>应附：替换人与被替换人的简历表、职称证书、学历证书、身份证复印件、工作简历、业绩、社保、资格证书等相关材料。 </em>
                    </span>
                  </p>
                </div>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>待处理人</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">负责人<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">

                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">项目部<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">

                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <el-button class="submit-btn" size="small" type="primary" @click="submitInfo" v-if="isCreate">提交
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
          style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
          <!--              <tasklog></tasklog>-->
        </el-aside>
      </el-container>

    </el-dialog>
  </el-container>
</template>

<script>
  import {mapGetters} from "vuex";
  import upload from "@/views/common/upload";
  import {getAllProjectsData} from "@/api/project";
  import {getNowDate} from "@/utils/date";
  import {getRoleInfoByUserId} from "@/api/system";
  import {getUserByRoleId} from "@/api/quality";
  import {getOrgUser, addPersonChange, getPersonChange} from "@/api/staffApproval";
  import {getOrgInfo} from "@/api/user";
  import {submitUserTask} from "@/api/quality";
  import {downLoadFile} from "@/utils/download";

  export default {
    data() {
      return {
        tableDta: [],
        fileData: [],//上传的附件
        form: {
          projectName: "",
          projectId: ""
        },
        dialogTitle: "项目全生命周期数字管理平台",
        dialogFormVisible: false,
        queryData: {
          projectCode: "",
          subProject: "",
          pageNum: 1,
          totalPage: 1,
          pageSize: 10
        },
        roleType: [],//人员变更类型
        beforeUsers: [],//变更前人员
        afterUsers: [],//变更后人员
        currentOrgUsers: [],//当前用户组织下的所有用户信息
        orgInfo: {},//当前用户的组织信息
        projectInfo: {},
        isCreate: true,
        rules: {
          changeType: [
            {required: true, message: "请选择人员变更类型", trigger: "blur"}
          ],
          beforePersonId: [
            {required: true, message: "请选择变更前人员", trigger: "blur"}
          ],
          afterPersonId: [
            {required: true, message: "请选择变更后人员", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.form = {};
      this.init();
      this.initData();
    },
    components: {upload},
    computed: {
      ...mapGetters(["project", "name", "userInfo"])
    },
    methods: {
      openDialog() {
        this.dialogFormVisible = true;
        this.isCreate = true;
        this.initForm();
        this.fileData = [];
      },
      handleSizeChange() {
      },
      handleCurrentChange() {
      },
      initData() {
        getPersonChange(this.project.id).then(res => {
          this.tableDta = res.data;
        });
      },
      init() {
        getAllProjectsData().then(res => {
          let obj = res.data.find(e => e.id === this.project.parentid);
          this.projectInfo = obj;
          getOrgInfo().then(res1 => {
            let data = res1.data.getMe;
            let info = data.find(e => e.ID === this.userInfo.GROUPID);
            this.orgInfo = info;
            this.initForm();
          });
        });
        getRoleInfoByUserId(this.project.id).then(res => {
          let data = res.data;
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              for (let j = i + 1; j < data.length; j++) {
                if (data[i].roleid === data[j].roleid) {
                  data.splice(j, 1);
                  j--;
                }
              }
            }
          }
          this.roleType = data;
        });
        getOrgUser({projectid: this.project.id}).then(res => {
          this.currentOrgUsers = res.data;
        });

      },
      initForm() {
        this.form = {
          afterCode: "",//变更后（执业）资格证书号
          afterPerson: "",//变更后人员名
          afterPersonId: null,//变更后人员id
          beforeCode: "",//变更前（执业）资格证书号
          beforePerson: "",//变更前人员名
          beforePersonId: null,//变更前人员id
          changePost: null,//变更岗位id
          changePostName: "",//变更岗位名
          changeReason: "",//变更原因
          changeType: null,//角色id
          changeTypeName: "",//角色名
          changeUnit: this.orgInfo.ID,//组织id
          changeUnitName: this.orgInfo.NAME,//组织名
          projectChildId: this.project.id,//项目标段id
          projectChildName: this.project.name,//项目标段名
          projectId: this.projectInfo.id,//项目id
          projectName: this.projectInfo.name,//项目名
          recordId: this.userInfo.ID,//变更发起人id
          recorder: this.name,//变更发起人名
          subDate: getNowDate()//变更发起时间
        };
      },
      afterUp(data) {
        let obj = {
          fileName: data.fileName,
          fileId: data.fileId,
          uploadPerson: this.name,
          uploadPersonId: this.userInfo.ID,
          uploadTime: data.uploadTime
        };
        this.fileData.push(obj);
      },
      //人员变更类型选择变更事件
      changeValue(val) {
        this.form.changePost = val;
        let obj = this.roleType.find(e => e.roleid == val);
        this.form.changePostName = obj.rolename;
        this.form.changeTypeName = obj.rolename;
        this.afterPersonId = null;
        this.beforePersonId = null;
        this.beforeUsers = this.currentOrgUsers.filter(e => e.roleid === val);
        this.afterUsers = this.currentOrgUsers.filter(e => e.roleid !== val);
      },
      //删除文件
      deleteInfo(row, index) {
        this.fileData.splice(index, 1);
      },
      //提交事件
      submitInfo() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            //获取变更前人员姓名
            let beforeInfo = this.beforeUsers.find(e => e.id === obj.beforePersonId);
            obj.beforePerson = beforeInfo.name;
            //获取变更后人员姓名
            let afterInfo = this.afterUsers.find(e => e.id === obj.afterPersonId);
            obj.afterPerson = afterInfo.name;
            //获取人员变更类型
            let info = this.roleType.find(e => e.roleid === obj.changeType);
            obj.changeTypeName = info.rolename;
            if (this.fileData.length > 0) {
              obj.files = this.fileData;
            }
            obj.processDefinitionKey = "renyuanbiangeng";
            //提交
            addPersonChange(obj).then(res => {
              this.issueStep(res);
            });
          } else {
            return false;
          }
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
          taskVariableData: {}
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
      //查看详情
      seeDetail(row) {
        this.form = Object.assign({}, row);
        this.fileData = row.files;
        this.isCreate = false;
        this.dialogFormVisible = true;
      },
      //下载文件
      downLoadEvent() {
        if (this.fileData && this.fileData.length > 0) {
          this.fileData.forEach(item => {
            downLoadFile(item.fileId);
          });

        }
      }
    }
  };
</script>
<style lang='scss' scoped>
  @import "../../assets/css/table.scss";
  @import "../../assets/css/dialog.scss";

  .form-bg {
    .form-block {
      .block-item-label {
        width: 180px !important;
      }

      .block-item-value {
        width: calc(100% - 200px) !important;
      }

      .el-date-editor {
        width: 100% !important;
      }
    }
  }

</style>
