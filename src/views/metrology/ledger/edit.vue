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
									<strong>计量管理</strong>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>计量期数管理</strong>
									</div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">计量期数名称</div>
                      <div class="block-item-value">
                        <el-form-item prop="metrologyName">
                          <el-input v-model="formData.metrologyName"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">开始日期</div>
                      <div class="block-item-value">
                        <el-form-item prop="startDate">
                          <el-date-picker value-format="yyyy-MM-dd" v-model="formData.startDate" type="date"
                                          placeholder="请选择">
                          </el-date-picker>
                        </el-form-item>
                      </div>
                    </div>

                    <div class="block-item">
                      <div class="block-item-label">结束日期</div>
                      <div class="block-item-value">
                        <el-form-item prop="endDate">
                          <el-date-picker value-format="yyyy-MM-dd" v-model="formData.endDate" type="date"
                                          placeholder="请选择">
                          </el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                </div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>计量信息管理</strong>
									</div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">计量编号<i class="require-icon"></i></div>
                      <div class="block-item-value">
                        <el-form-item prop="metrologyNo">
                          <el-input v-model="formData.metrologyNo"></el-input>
                        </el-form-item>

                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">申请日期</div>
                      <div class="block-item-value">

                        <el-form-item prop="applyDate">
                          <el-date-picker value-format="yyyy-MM-dd" v-model="formData.applyDate" type="date"
                                          placeholder="请选择">
                          </el-date-picker>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">申请单位</div>
                      <div class="block-item-value">
                        <el-form-item prop="applyUnit">
                          <el-input v-model="formData.applyUnit"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                    <div class="block-item">
                      <div class="block-item-label">计量金额</div>
                      <div class="block-item-value">
                        <el-form-item prop="amount">
                          <el-input-number v-model="formData.amount" :precision="2"></el-input-number>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">计量内容</div>
                      <div class="block-item-value">
                        <el-form-item prop="content">
                          <el-input v-model="formData.content"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
									<div class="block-line">
                    <div class="block-item">
                      <div class="block-item-label">申请依据</div>
                      <div class="block-item-value">
                        <el-form-item prop="applyCertificate">
                          <el-input v-model="formData.applyCertificate"></el-input>
                        </el-form-item>
                      </div>
                    </div>
									</div>
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
  import * as api from "@/api/metrology.js";
	import { getUserInfo } from "@/api/user";
	import {
		formatMonth,
		formatDate,
		formatDateTime,
		diffCompare,
		convertOptions
	} from "@/utils/format.js";
	import upload from "../../common/upload.vue"
	import attachlist from "../../common/attachlist.vue"
	import drafthandle from "../../common/drafthandle.vue"
import approveuser from "../../common/approveuser.vue"
import projectinfo from "../../common/projectinfo.vue"

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
					contractCode: [{
						required: true,
						message: '请填写合同编号',
						trigger: 'blur'
					}],
          amount:[{
            required: true,
            message: '请填写计量金额'
          }]
				},
				userInfo: {
					userName: ''
				},
				baseInfo: {
					buildSection: 1,
					projectName:'池州市平天湖东部区域棚户区改造建设工程EPC总承包',
					buildSectionName: '235国道项目部',
					contractCode: 'ORG_00004',
					startupUser: '赵赞文',
					startupDate: formatMonth(new Date()),
				},
				formData: { //表单参数
					attachment: [],
					contractCode: '',
					information: [],
					contractUser: '',
					deletedFlag: 1,
					draftFlag: 1,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid']
				},
				attachTable: [], //附件
				contractTable: [],
				contractVisible: false,
				contractInfo: {
					buildProjectName: '',
					buildProjectPartName: '',
					cardNum: '',
					contractChargeUserName: '',
					contractNum: null,
					contractUserName: '',
					contractUserQualification: '',
					remark: '',
					buildStartMonth: formatMonth(new Date()),
					buildEndMonth: formatMonth(new Date())
				},
				auditUser: {},
        approveVisible:true,
				flowKey:'jiliangshenpiv3',

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
      metrology: () => import("../metrology.vue")
		},
		computed: {},
		mounted() {

			this.getContractBuildEnums();
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
						contractCode: '',
						information: [],
						contractUser: '',
						deletedFlag: 1,
						draftFlag: 1,
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid'],
						startDate:formatDate(new Date())
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
				getUserInfo(localStorage.getItem('ID')).then(res => {
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
						contractCode: '',
						information: [],
						contractUser: '',
						deletedFlag: 1,
						draftFlag: 1,
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid'],
						startDate:formatDate(new Date())
					}
					this.examineTable = [];
					this.reportTable = [];
					this.factoryTable = [];
					this.attachTable = [];
					// this.auditUser={};
					this.approveVisible=true;
				}
			},
			getDetail(id) {
				api.getMetrologyDetail(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
					this.contractTable = data.information || [];
				});
			},

			getContractBuildEnums() {
				api.getContractBuildEnums().then((res) => {
					let options = res.data || [];
					this.partOptions = convertOptions(options, 'desc', 'desc');
				});
			},
			addOrModify(isdraft) {
      if (this.submitDisable) return;
      
      this.submitDisable = true;
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.formData.attachment = this.attachTable;
            this.formData.information = this.contractTable;
            this.formData.auditUser = this.auditUser;
            this.formData.draftFlag=1;
            api.addOrUpdateMetrology(this.formData).then((res) => {
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

			addContract() {
				this.contractVisible = true;
			},
			addContractTable(){
				this.$refs['newform'].validate((valid) => {
					if (valid) {
						this.contractTable.push(JSON.parse(JSON.stringify(this.contractInfo)));
						this.contractVisible = false;
					}
				})
			},
			deleteContract(row, index) {
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.contractTable.splice(index, 1);
				});

			},
			deleteExamine(row, index){
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.contractTable.splice(index, 1);
				});
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
