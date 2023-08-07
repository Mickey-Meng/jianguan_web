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
                <div class="form-block">
                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>基本信息</strong>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">施工方案名称</div>
                      <div class="block-item-value">
                        <el-form-item prop="remark">
                          <el-input readonly v-model="formData.name"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">施工方案内容</div>
                      <div class="block-item-value">
                        <el-form-item prop="remark">
                          <el-input readonly v-model="formData.content"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">计划开始时间</div>
                      <div class="block-item-value">
                        <el-form-item prop="plainStartTime">
                          <el-date-picker readonly value-format="yyyy-MM-dd" v-model="formData.plainStartTime" type="date" placeholder="请选择">
                          </el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">计划结束时间</div>
                      <div class="block-item-value">
                        <el-form-item prop="plainEndTime">
                          <el-date-picker readonly value-format="yyyy-MM-dd" v-model="formData.plainEndTime" type="date" placeholder="请选择">
                          </el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">上报时间</div>
                      <div class="block-item-value">
                        <el-form-item prop="reportTime">
                          <el-date-picker readonly value-format="yyyy-MM-dd" v-model="formData.reportTime" type="date" placeholder="请选择">
                          </el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">上报人</div>
                      <div class="block-item-value">
                        <el-form-item prop="remark">
                          <el-input readonly v-model="formData.reportPeople"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">责任人</div>
                      <div class="block-item-value">
                        <el-form-item prop="remark">
                          <el-input readonly v-model="formData.responsiblePerson"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-block">
                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>附件</strong>
                    <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
                  </div>
                  <attachlist :editAble="true" ref="attachlist" :attachTable="attachTable"></attachlist>
                </div>

                <approveuser v-if="approveVisible" :auditUser="auditUser"  :flowKey="flowKey">
                </approveuser>

                <div class="form-block">
                  <el-button @click="addOrModify()" class="submit-btn" size="small" type="primary" :loading="submitDisable">提交
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
import * as api from "@/api/constructionPlanReport.js";
import { getUserInfo } from "@/api/user";
import upload from "../common/upload.vue"
import attachlist from "../common/attachlist.vue"
import drafthandle from "../common/drafthandle.vue"
import approveuser from "../common/approveuser.vue"
import projectinfo from "../common/projectinfo.vue"

export default {
  props: ['editRow'],
  data() {
    return {
      draftVisible: false,
      addOrModifyFlag: true,
      dialogTitle: '全生命周期智慧建设管理平台',
      dialogFormVisible: false,
      partOptions:[],
      rules: {
      },
      userInfo: {
        userName: ''
      },
      baseInfo: {
      },
      formData: { //表单参数
        content: '',
        name:'',
        plainStartTime:'',
        plainEndTime:'',
        responsiblePerson:'',
        reportPeople: '',
        reportTime: null
      },
      attachTable: [], //附件
      contractTable: [],
      contractVisible: false,
      auditUser: {},
      approveVisible:true,
      flowKey:'constructionPlanReport',
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
    payment: () => import("../constructionPlanReport/constructionPlanReport.vue")
  },
  computed: {},
  mounted() {
    this.getUserInfo();
    this.findDataDictionarys();
  },
  watch: {
    editRow(obj) {
      obj=obj||{};
      if (obj['id']) {
        this.getDetail(obj['id']);
        this.approveVisible=false;
      } else {
        this.formData = {
          attachment: [],
          content: '',
          reportPeople: '',
          reportTime: null,
          projectId:this.$store.getters.project['parentid']
        }
        this.attachTable = [];
        this.contractTable = [];
        // this.auditUser={};
        this.approveVisible=true;
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
      if (obj['id']) {
        this.getDetail(obj['id']);
        // 修改和删除操作，都可以选择审批人
        this.approveVisible=true;
      } else {
        this.formData = {
          content: '',
          name:'',
          plainStartTime:'',
          responsiblePerson:'',
          reportPeople: '',
          reportTime: null,
          projectId:this.$store.getters.project['parentid'],
        }
        this.attachTable = [];
        // this.auditUser={};
        this.approveVisible=true;
      }
    },
    getDetail(id) {
      api.getConstructionPlanDetail(id).then((res) => {
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
          this.formData.reportStatus=null;
          this.formData.typeCode = this.formData.type;
          this.dataDictionaryList.forEach(item=> {
            if(item.id === this.formData.type) {
              this.formData.type = item.name;
            }
          })
          api.addOrUpdateConstructionPlan(this.formData).then((res) => {
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
@import "../../assets/css/dialog";
</style>
