<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" :visible.sync="dialogFormVisible" :fullscreen="true">
			<template slot="title">
				{{dialogTitle}}
				<div class="logo-icon"></div>
			</template>
			<el-container>
				<el-main
					style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
					<div class="form-bg">
						<div class="form-content">
							<el-form :model="formData" ref="ruleForm" :rules="rules" label-width="80px">
								<div class="form-title">
									<div class="title-big-bar"></div>
									<strong>项目开工申请</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify" @checkDraft="checkDraft"
										ref="drafthandle"></drafthandle>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>项目开工申请信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">申请开工日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="openDate">
													<el-date-picker value-format="yyyy-MM-dd" v-model="formData.openDate"
														type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">计划完工日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="endDate">
													<el-date-picker value-format="yyyy-MM-dd" v-model="formData.endDate"
														type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">共计划日历天:{{intervalPlan}}</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">合同规定工期起<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="contractOpenDate">
													<el-date-picker value-format="yyyy-MM-dd"
														v-model="formData.contractOpenDate" type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">合同规定工期止<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="contractEndDate">
													<el-date-picker value-format="yyyy-MM-dd"
														v-model="formData.contractEndDate" type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">历时天数:{{intervalContract}}</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>施工组织设计审批情况</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">申报说明<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="buildApplyExplain">
												<el-input v-model="formData.buildApplyExplain"></el-input>
											</el-form-item>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>工程划分审核情况</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">申报说明<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="projectApplyExplain">
												<el-input v-model="formData.projectApplyExplain"></el-input>
											</el-form-item>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>技术、质量、安全、环保保证体系建立情况（含相关人员证书）</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">申报说明<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="techApplyExplain">
												<el-input v-model="formData.techApplyExplain"></el-input>
											</el-form-item>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>试验检测工作准备情况</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">申报说明<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="checkApplyExplain">
												<el-input v-model="formData.checkApplyExplain"></el-input>
											</el-form-item>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>设计交底情况</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">申报说明<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="designApplyExplain">
												<el-input v-model="formData.designApplyExplain"></el-input>
											</el-form-item>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>原始基准点、地面线复测情况</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">申报说明<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="againApplyExplain">
												<el-input v-model="formData.againApplyExplain"></el-input>
											</el-form-item>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>开工预付款担保及保险情况</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">申报说明<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="insuranceApplyExplain">
												<el-input v-model="formData.insuranceApplyExplain"></el-input>
											</el-form-item>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>合同段施工安全风险评估情况</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">申报说明<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="securityApplyExplain">
												<el-input v-model="formData.securityApplyExplain"></el-input>
											</el-form-item>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>其他有关情况说明</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">申报说明<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="otherApplyExplain">
												<el-input v-model="formData.otherApplyExplain"></el-input>
											</el-form-item>
										</div>
									</div>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件上传</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="attachTable">
									</attachlist>

								</div>

								<approveuser v-if="approveVisible" :auditUser="auditUser" :flowKey="flowKey">
								</approveuser>

								<div class="form-block">
									<el-button class="submit-btn" size="small" type="primary" @click="addOrModify()"
										:loading="submitDisable">提交
									</el-button>
								</div>
							</el-form>
						</div>
					</div>
				</el-main>
				<!-- <el-aside width="8px" class="close-wrapper">
					<div class="close-wrap">
						<i class="el-icon-caret-right"></i>
					</div>
				</el-aside> -->
				<!-- <el-aside
					style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
					<tasklog></tasklog>
				</el-aside> -->
			</el-container>
		</el-dialog>

		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<projectCommencementApplication @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</projectCommencementApplication>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		getUserInfo
	} from "@/api/user";
	import {
		convertOptions,
		formatDate,
		formatDateTime,
		getDaysBetween,
		diffCompare
	} from "@/utils/format.js";

	import upload from "../../../common/upload.vue"
	import attachlist from "../../../common/attachlist.vue"
	import drafthandle from "../../../common/drafthandle.vue"
	import approveuser from "../../../common/approveuser.vue"
	import projectinfo from "../../../common/projectinfo.vue"
	export default {
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogFormVisible: false,
				dialogTitle: '项目全生命周期数字管理平台',
				// intervalPlan: '',
				// intervalContract: '',
				baseInfo: {
					buildSection: 1,
					buildSectionName: '',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
					supervisionSection: ''
				},
				formData: { //表单参数
					deletedFlag: 1,
					attachment: [],
					draftFlag: 1,
					againApplyExplain: '',
					buildApplyExplain: '',
					checkApplyExplain: '',
					designApplyExplain: '',
					insuranceApplyExplain: '',
					otherApplyExplain: '',
					projectApplyExplain: '',
					securityApplyExplain: '',
					techApplyExplain: '',
					contractEndDate: formatDate(new Date()),
					contractOpenDate: formatDate(new Date()),
					endDate: formatDate(new Date()),
					openDate: formatDate(new Date()),
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
				},
				rules: {
					againApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					buildApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					checkApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					designApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					insuranceApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					otherApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					projectApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					securityApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					techApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					contractEndDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					contractOpenDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					endDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					openDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}]
				},
				attachTable: [], //其他附件
				flowNodesUsersData: [],
				auditUser: {},
                approveVisible:true,
				flowKey:'xiangmukaigongshenqing',

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
			projectCommencementApplication: () => import("../projectCommencementApplication.vue")
		},
		computed: {
			intervalPlan: function() {
				return getDaysBetween(this.formData.openDate, this.formData.endDate)
			},
			intervalContract: function() {
				return getDaysBetween(this.formData.contractOpenDate, this.formData.contractEndDate)
			}
		},
		watch: {

		},
		mounted() {
			
		},
		methods: {
			
			changeVisible(obj, value) {
				this.dialogFormVisible = value;
				obj = obj || {};
				this.addOrModifyFlag = obj['id'] ? false : true;
				if (obj['id']) {
					this.getDetail(obj['id']);
                    this.approveVisible=false;
				} else {
					this.formData = {
						deletedFlag: 1,
						attachment: [],
						draftFlag: 1,
						againApplyExplain: '',
						buildApplyExplain: '',
						checkApplyExplain: '',
						designApplyExplain: '',
						insuranceApplyExplain: '',
						otherApplyExplain: '',
						projectApplyExplain: '',
						securityApplyExplain: '',
						techApplyExplain: '',
						contractEndDate: formatDate(new Date()),
						contractOpenDate: formatDate(new Date()),
						endDate: formatDate(new Date()),
						openDate: formatDate(new Date()),
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid'],
					}
					this.attachTable = [];
					// this.auditUser={};
					this.approveVisible=true;
				}
			},

			getDetail(id) {
				api.getProjectOpenDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.examineTable = data.detectionInfo || [];
					this.reportTable = data.detectionReport || [];
					this.factoryTable = data.factoryInfo || [];
					this.attachTable = data.attachment || [];
				});
			},
			addOrModify(isdraft) {
      if (this.submitDisable) return;
      
      this.submitDisable = true;
				if (isdraft) {
					if (diffCompare([this.formData, this.attachTable], [{
								deletedFlag: 1,
								attachment: [],
								draftFlag: 1,
								againApplyExplain: '',
								buildApplyExplain: '',
								checkApplyExplain: '',
								designApplyExplain: '',
								insuranceApplyExplain: '',
								otherApplyExplain: '',
								projectApplyExplain: '',
								securityApplyExplain: '',
								techApplyExplain: '',
								contractEndDate: formatDate(new Date()),
								contractOpenDate: formatDate(new Date()),
								endDate: formatDate(new Date()),
								openDate: formatDate(new Date()),
								buildSection: this.$store.getters.project.id,
								projectId:this.$store.getters.project['parentid'],
							},
							[]
						], ['contractEndDate','contractOpenDate','endDate','openDate'])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.attachment = this.attachTable;
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateProjectOpenExit(this.formData).then((res) => {
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
					this.$refs['ruleForm'].validate((valid) => {
						if (valid) {
							this.formData.attachment = this.attachTable;
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag = 1;
							// this.formData.openDate = "2022-06-16";
							api.addOrUpdateProjectOpenExit(this.formData).then((res) => {
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
				}
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
@import "../../../../assets/css/dialog.scss"
</style>
