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
                  <strong>合同付款</strong>
                </div>

                <div class="form-block">
                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>付款基本信息</strong>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">款项类型</div>
                      <div class="block-item-value">
                        <el-form-item prop="type">
                          <el-input v-model="typeName" disabled ></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">款项金额</div>
                      <div class="block-item-value">
                        <el-form-item prop="amount">
                          <el-input-number v-model="formData.amount" :precision="2"></el-input-number>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">填报日期</div>
                      <div class="block-item-value">
                        <el-form-item prop="startDate">
                          <el-date-picker value-format="yyyy-MM-dd" v-model="formData.recordTime" type="date"
                                          placeholder="请选择">
                          </el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">备注<i class="require-icon"></i></div>
                      <div class="block-item-value">
                        <el-form-item prop="remark">
                          <el-input v-model="formData.remark"></el-input>
                        </el-form-item>

                      </div>
                    </div>

                  </div>
                </div>
                <div class="form-block">

                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>合同附件</strong>
                    <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
                  </div>

                  <attachlist :editAble="true" ref="attachlist" :attachTable="attachTable"></attachlist>

                </div>

                <approveuser v-if="approveVisible" :auditUser="auditUser"  :flowKey="flowKey">
                </approveuser>

                <div class="form-block">
                  <el-button @click="addOrModify()" class="submit-btn" size="small" type="primary">提交
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
import * as api from "@/api/contractPayment.js";
import { getUserInfo } from "@/api/user";
import upload from "../../../common/upload.vue"
import attachlist from "../../../common/attachlist.vue"
import drafthandle from "../../../common/drafthandle.vue"
import approveuser from "../../../common/approveuser.vue"
import projectinfo from "../../../common/projectinfo.vue"
import { findDataDictionaryList } from "@/api/dataDictionary"

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
        amount:[{
          required: true,
          message: '请填写款项金额'
        }]
      },
      userInfo: {
        userName: ''
      },
      baseInfo: {
      },
      formData: { //表单参数
        attachment: [],
        type: '',
        amount: 0,
        remark: '',
        recordDate: null
      },
      attachTable: [], //附件
      contractTable: [],
      contractVisible: false,
      auditUser: {},
      approveVisible:true,
      flowKey:'AQWMCSF',
      dataDictionaryList: [],
      typeName: "安全文明措施费"
    };
  },
  created() {},
  components: {
    upload,
    attachlist,
    drafthandle,
    approveuser,
    projectinfo,
    payment: () => import("./contractPayment.vue")
  },
  computed: {},
  mounted() {
    this.getUserInfo();
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
          type: '',
          amount: 0,
          remark: '',
          recordDate: null,
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
        this.approveVisible=false;
      } else {
        this.formData = {
          attachment: [],
          type: '',
          amount: 0,
          remark: '',
          recordDate: null,
          projectId:this.$store.getters.project['parentid'],
        }
        this.attachTable = [];
        // this.auditUser={};
        this.approveVisible=true;
      }
    },
    getDetail(id) {
      api.getContractPaymentDetail(id).then((res) => {
        let data = res['data'] || {};
        this.formData = data;
        this.attachTable = data.attachment || [];
      });
    },
    addOrModify(isdraft) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.formData.attachment = this.attachTable;
          this.formData.auditUser = this.auditUser;
          this.formData.draftFlag=1;
          this.formData.typeCode = 51;
          this.formData.type = this.typeName;
          api.addOrUpdateContractPayment(this.formData).then((res) => {
            if (res.data) {
              this.$message({
                type: 'success',
                message: '提交成功!'
              });
              this.dialogFormVisible = false;
              this.$emit("query");
            }
          });
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
