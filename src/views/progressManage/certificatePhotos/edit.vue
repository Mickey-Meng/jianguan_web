<template>
  <div>
    <el-dialog class="full-dialog defined-dialog" :fullscreen="true" :visible.sync="dialogFormVisible">
      <template slot="title">
        {{dialogTitle}}
        <div class="logo-icon"></div>
      </template>
      <el-container>
        <el-main
          style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
          <div class="form-bg">
            <div class="form-content">

              <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="80px">
                <div class="form-title">
                  <div class="title-big-bar"></div>
                  <strong>进度管理-证照管理</strong>
                </div>

                <div class="form-block">
                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>基本信息</strong>
                  </div>

                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">证照名称</div>
                      <div class="block-item-value">{{ formData.name }}</div>
                    </div>

                    <div class="block-item">
                      <div class="block-item-label">证照内容</div>
                      <div class="block-item-value">{{ formData.contents }}</div>
                    </div>
                  </div>


                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">计划开始时间</div>
                      <div class="block-item-value">{{ formData.startTime }}</div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">计划结束时间</div>
                      <div class="block-item-value">{{ formData.endTime }}</div>
                    </div>
                  </div>

                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">上报时间</div>
                      <div class="block-item-value">{{ formData.reportTime }}</div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">上报人</div>
                      <div class="block-item-value">{{ formData.reportUser }}</div>
                    </div>
                  </div>

                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">责任人<i class="require-icon"></i></div>
                      <div class="block-item-value">
                        <div class="block-item-value">{{ formData.ownerName }}</div>
                      </div>
                    </div>

                    <div class="block-item">
                      <div class="block-item-label">备注</div>
                      <div class="block-item-value">{{ formData.remark }}</div>
                    </div>
                  </div>
                </div>

                <div class="form-block">
                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>证照附件</strong>
                    <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
                      xisx xis pdf文件，且不超过100m</span>
                  </div>
                  <attachlist :editAble="true" ref="attachlist" :attachTable="attachTable"></attachlist>
                </div>

                <approveuser v-if="approveVisible" :auditUser="auditUser" :flowKey="flowKey"></approveuser>

                <div class="form-block">
                  <el-button @click="addOrModify()" class="submit-btn" size="small" type="primary"
                    :loading="submitDisable">提交
                  </el-button>
                </div>
              </el-form>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/certificate/progressCertificatePhotos.js";
import { mapGetters } from "vuex";
import { getUserInfo, getUsersByProjectId } from "@/api/user";
import upload from "../../common/upload.vue"
import attachlist from "../../common/attachlist.vue"
import drafthandle from "../../common/drafthandle.vue"
import approveuser from "../../common/approveuser.vue"
import projectinfo from "../../common/projectinfo.vue"
import { findDataDictionaryList } from "@/api/dataDictionary"

export default {
  props: ['editRow'],
  data() {
    return {
      draftVisible: false,
      addOrModifyFlag: true,
      dialogTitle: '项目全生命周期数字管理平台',
      dialogFormVisible: false,
      partOptions:[],
      rules: {
        owner: [{
          required: true,
          message: '请输入责任人',
          trigger: 'blur'
        }],
        attachment: [{
          required: true,
          message: '请上传附件',
          trigger: 'blur'
        }]
      },
      userInfo: {
        userName: ''
      },
      baseInfo: {
      },
      formData: { //表单参数
        id: undefined,
        owner: undefined,
        attachment: []
      },
      // 责任人下拉选项值
      ownerOptions: [],
      attachTable: [], //附件
      auditUser: {},
      approveVisible:true,
      flowKey:'progressCertificatePhotos',
      dataDictionaryList: [],

      submitDisable: false
    };
  },
  created() {},
  components: {
    upload,
    attachlist,
    drafthandle,
    approveuser,
    projectinfo,
    payment: () => import("./certificatePhotos.vue")
  },
  computed: {
    ...mapGetters(["userInfo", "name", "project", "roleId", "getUrl"])
  },
  mounted() {
    this.getUserInfo();
    this.findDataDictionarys();
  },
  watch: {
    editRow(obj) {
      obj=obj||{};
      this.formData.id = obj['id'];
      console.log("editRow..."+ this.formData.id);
      if (this.formData.id) {
        this.getDetail(this.formData.id);
        // 修改和删除操作，都可以选择审批人
        this.approveVisible=true;
      } else {
        this.$message({
          type: 'error',
          message: '操作数据ID为空,请检查!'
        });
      }
    }
  },
  methods: {
    findDataDictionarys() {
      findDataDictionaryList({"parentId": 50}).then((res)=>{
        this.dataDictionaryList = res.data.filter(item=>{
          return item.name != "安全文明措施费";
        });
      });
    },
    getUserInfo() {
      getUserInfo(localStorage.getItem('ID')).then((res) => {
        this.userInfo = res.data.userInfo;
      });
    },
    changeVisible(obj,value) {
      this.dialogFormVisible = value;
      obj = obj || {};
      this.addOrModifyFlag = obj['id'] ? false : true;
      this.formData.id = obj['id'];
      console.log("changeVisible..."+ this.formData.id);
      if (this.formData.id) {
        this.getDetail(this.formData.id);
        // 修改和删除操作，都可以选择审批人
        this.approveVisible = obj['status'] === -1; // 只有在未发起流程的时候显示审批节点信息
      } else {
        this.$message({
          type: 'error',
          message: '操作数据ID为空,请检查!'
        });
      }
      // 根据项目ID查询其下属工区对应的所有用户信息
      getUsersByProjectId(this.project.id).then((res) => {
        this.ownerOptions = res.data;
      });
    },
    getDetail(id) {
      api.getProgressCertificatePhotosDetail(id).then((res) => {
        let data = res['data'] || {};
        this.formData = data;
        this.attachTable = data.attachment || [];
      });
    },
    addOrModify(isdraft) {
      if (this.submitDisable) return;
      
      this.submitDisable = true;
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.formData.attachment = this.attachTable;
          this.formData.auditUser = this.auditUser;
          this.formData.draftFlag = 1;
          /**
          this.dataDictionaryList.forEach(item=> {
            if(item.id === this.formData.type) {
              this.formData.type = item.name;
            }
          }) **/
          api.addOrUpdateProgressCertificatePhotos(this.formData).then((res) => {
            if (res.data) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.dialogFormVisible = false;
              setTimeout(()=> {
                this.submitDisable = false;
              }, 500)
              this.$emit("query");
            }
          });
        } else {
          setTimeout(()=> {
            this.submitDisable = false;
          }, 500)
        }

      })
    },
    hideDraft() {
      this.draftVisible = false;
    },
    checkDraft() {
      this.draftVisible = true;
    }
  },
};
</script>

<style scoped lang="scss">
@import "src/assets/css/dialog";
</style>
