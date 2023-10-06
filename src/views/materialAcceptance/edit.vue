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
                      <div class="block-item-label">材料品牌</div>
                      <div class="block-item-value">
                        <el-form-item prop="remark">
                          <el-input readonly v-model="formData.materialBrand"></el-input>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="block-item">
                      <div class="block-item-label">材料类型</div>
                      <div class="block-item-value">
                        <el-form-item prop="type">
                          <el-select v-model="formData.materialCategory" filterable clearable placeholder="请选择材料类型">
                            <el-option v-for="item in functionary" :key="item.id" :value="item.id+','+item.name"
                              :label="item.name" />
                          </el-select>
                        </el-form-item>
                      </div>

                    </div>
                  </div>
                  <div class="block-line">
<!--                    <div class="block-item">-->
<!--                      <div class="block-item-label">样板照片</div>-->
<!--                      <div class="block-item-value">-->
<!--                        <el-form-item prop="samplePhoto">-->
<!--                          <el-input readonly v-model="formData.samplePhoto"></el-input>-->
<!--                        </el-form-item>-->
<!--                      </div>-->
<!--                    </div>-->
                    <div class="block-item">
                      <div class="block-item-label">样板内容</div>
                      <div class="block-item-value">
                        <el-form-item prop="samplePhoto">
                          <el-input readonly v-model="formData.sampleContent"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>

                  <div class="block-line">
<!--                    <div class="block-item">-->
<!--                      <div class="block-item-label">材料进场照片</div>-->
<!--                      <div class="block-item-value">-->
<!--                        <el-form-item prop="samplePhoto">-->
<!--                          <el-input v-model="formData.materialApproachPhoto"></el-input>-->
<!--                        </el-form-item>-->
<!--                      </div>-->
<!--                    </div>-->
                    <div class="block-item">
                      <div class="block-item-label">材料进场内容</div>
                      <div class="block-item-value">
                        <el-form-item prop="samplePhoto">
                          <el-input v-model="formData.materialApproachContent"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">材料进场数量</div>
                      <div class="block-item-value">
                        <el-form-item prop="samplePhoto">
                          <el-input v-model="formData.materialApproachQuantity"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>

                </div>
                <div class="form-block">
                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>样板照片</strong>
                    <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png文件，且不超过100m</span>
                  </div>
                  <attachlist :editAble="false" ref="attachlist" :attachTable="formData.samplePhoto"></attachlist>
                </div>
                <div class="form-block">
                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>材料进场照片</strong>
                    <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png文件，且不超过100m</span>
                  </div>
                  <attachlist :editAble="true" ref="attachlist" :attachTable="materialApproachPhoto"></attachlist>
                </div>
                <div class="form-block">
                  <div class="form-block-title">
                    <div class="title-bar"></div><strong>附件</strong>
                    <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
                      xisx xis pdf文件，且不超过100m</span>
                  </div>
                  <attachlist :editAble="true" ref="attachlist" :attachTable="attachTable"></attachlist>
                </div>
                <approveuser v-if="approveVisible" :auditUser="auditUser" :flowKey="flowKey"></approveuser>

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
import * as api from "@/api/materialAcceptance.js";
import {getUserInfo, getUsersByProjectId} from "@/api/user";
import upload from "../common/upload.vue"
import attachlist from "../common/attachlist.vue"
import drafthandle from "../common/drafthandle.vue"
import approveuser from "../common/approveuser.vue"
import projectinfo from "../common/projectinfo.vue"
import {mapGetters} from "vuex";
import {getFileDictByPCode} from "@/api/file";

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
      },
      userInfo: {
        userName: ''
      },
      baseInfo: {
      },
      formData: { //表单参数
        materialBrand: '',
        materialCategory:'',
      },
      functionary: [],
      attachTable: [], //附件
      materialApproachPhoto: [],
      auditUser: {},
      approveVisible:true,
      flowKey:'aterialAcceptance',
      dataDictionaryList: []
    };
  },
  created() {

  },
  components: {
    upload,
    attachlist,
    drafthandle,
    approveuser,
    projectinfo,
    payment: () => import("../materialBrandReport/materialBrandReport.vue")
  },
  computed: {
    ...mapGetters(["userInfo", "name", "project", "roleId", "getUrl"])
  },
  mounted() {
    this.getUserInfo();
    // this.findDataDictionarys();
  },
  watch: {
    editRow(obj) {
      obj=obj||{};
      if (obj['id']) {
        this.getDetail(obj['id']);
        this.approveVisible=true;
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
        this.auditUser={};
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
        this.approveVisible=true;
      } else {
        this.formData = {
          // content: '',
          // name:'',
          // plainStartTime:'',
          // responsiblePerson:'',
          // reportPeople: '',
          // reportTime: null,
          projectId:this.$store.getters.project['parentid'],
        }
        this.attachTable = [];
        // this.auditUser={};
        this.approveVisible=true;
        // this.auditUser={};
        //
        //
        // this.functionary = [];
        // getFileDictByPCode("cllb").then((res) => {
        //   this.functionary = res.data;
        // }).catch(function (error) {
        // });
      }
    },
    getDetail(id) {
      api.getMaterialAcceptanceDetail(id).then((res) => {
        let data = res['data'] || {};
        this.formData = data;
        this.attachTable = data.attachment || [];
      });
    },
    addOrModify(isdraft) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.formData.attachment = this.attachTable;
          this.formData.materialApproachPhoto = this.materialApproachPhoto;
          this.formData.auditUser = this.auditUser;
          this.formData.draftFlag=1;
          this.formData.typeCode = this.formData.type;
          this.dataDictionaryList.forEach(item=> {
            if(item.id === this.formData.type) {
              this.formData.type = item.name;
            }
          })
          api.addOrUpdateMaterialAcceptance(this.formData).then((res) => {
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
@import "../../assets/css/dialog";
</style>
