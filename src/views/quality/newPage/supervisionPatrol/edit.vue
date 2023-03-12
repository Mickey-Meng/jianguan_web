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
									<strong>监理巡视</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>

								<div class="form-block">
									<!-- <div class="form-block-title">
										<div class="title-bar"></div><strong>发起位置</strong>
									</div>
									<locationmap></locationmap> -->
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-line">
											<div class="block-item">
												<div class="block-item-label">发起时间</div>
												<div class="block-item-value">
													<el-form-item prop="startDate">
														<el-date-picker value-format="yyyy-MM-dd" v-model="formData.startDate"
															type="date" placeholder="请选择">
														</el-date-picker>
													</el-form-item>

												</div>
											</div>
										</div>

									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>巡视信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">巡视地点<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="patrolPlace">
												<el-input v-model="formData.patrolPlace"></el-input>
											</el-form-item>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-label">主要施工情况<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="buildCondition">
												<el-input v-model="formData.buildCondition"></el-input>
											</el-form-item>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">质量、安全、环保情况<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="qualityCondition">
													<el-input v-model="formData.qualityCondition"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">发现的问题及处理意见<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="problemDealCondition">
													<el-input v-model="formData.problemDealCondition"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>


								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>巡视现场照片</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist"
										:attachTable="formData.patrolPhotoAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>视频</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.video">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">其他附件</div>
											<div class="block-item-value">
												<el-input v-model="formData.otherAttachmentInfo" type="textarea"
													:rows="4" placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>

								<approveuser v-if="approveVisible" :auditUser="auditUser" :flowKey="flowKey">
								</approveuser>

								<div class="form-block">
									<el-button class="submit-btn" size="small" type="primary" @click="addOrModify()">提交
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
			<supervisionPatrol @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible" v-if="draftVisible">
			</supervisionPatrol>
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
	import locationmap from "../../../common/locationmap.vue"
	import approveuser from "../../../common/approveuser.vue"
	import projectinfo from "../../../common/projectinfo.vue"
	
	export default {
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogFormVisible: false,
				dialogTitle: '全生命周期智慧建设管理平台',
				childOptions:[],
				baseInfo: {
					buildSection: 1,
					buildSectionName: '',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
					supervisionSection: ''
				},
				formData: { //表单参数
					"address": {},
					"auditUser": {},
					"buildCondition": "",
					"deletedFlag": 1,
					"draftFlag": 1,
					"otherAttachmentInfo": "",
					"patrolPhotoAttachment": [],
					"patrolPlace": "",
					"problemDealCondition": "",
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					"qualityCondition": "",
					"startDate": formatDate(new Date()),
					"video": [],
				},
				rules: {
					buildSection: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					patrolPlace: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					buildCondition: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					qualityCondition: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					problemDealCondition: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}]
				},
				auditUser: {},
                approveVisible:true,
				flowKey: 'jianlixunshi'
			};
		},
		created() {},
		components: {
			upload,
			attachlist,
			drafthandle,
			approveuser,
			locationmap,
			projectinfo,
			supervisionPatrol: () => import("../supervisionPatrol.vue")
		},
		computed: {

		},
		watch: {

		},
		mounted() {
			this.getChildProject()
		},
		methods: {
			getChildProject() {
				api.getChildProject({
					projectid: this.$store.getters.project['parentid']
				}).then((res) => {
					let options = res.data || [];
					this.childOptions = convertOptions(options, 'name', 'id');
				});
			},
			changeChild() {
				api.getCompanyByProjectId({
					projectid: this.formData.buildSection
				}).then((res) => {
					this.baseInfo = res;
				});
			},
			changeVisible(obj, value) {
				this.dialogFormVisible = value;
				obj = obj || {};
				this.addOrModifyFlag = obj['id'] ? false : true;
				if (obj['id']) {
					this.getDetail(obj['id']);
                    this.approveVisible=false;
				} else {
					this.formData = {
						"address": {},
						"auditUser": {},
						"buildCondition": "",
						"deletedFlag": 1,
						"draftFlag": 1,
						"otherAttachmentInfo": "",
						"patrolPhotoAttachment": [],
						"patrolPlace": "",
						"problemDealCondition": "",
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid'],
						"qualityCondition": "",
						"startDate": formatDate(new Date()),
						"video": [],
					}
					// this.auditUser={};
					this.approveVisible=true;
				}
			},

			getDetail(id) {
				api.getSupervisionPatrolDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData], [{
							"address": {},
							"auditUser": {},
							"buildCondition": "",
							"deletedFlag": 1,
							"draftFlag": 1,
							"otherAttachmentInfo": "",
							"patrolPhotoAttachment": [],
							"patrolPlace": "",
							"problemDealCondition": "",
							buildSection: this.$store.getters.project.id,
							projectId:this.$store.getters.project['parentid'],
							"qualityCondition": "",
							"startDate": formatDate(new Date()),
							"video": [],
						}], ['startDate'])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateSupervisionPatrol(this.formData).then((res) => {
						if (res.data) {
							this.$message({
								type: 'success',
								message: '提交成功!'
							});
							this.dialogFormVisible = false;
							this.$emit("query");
						}
					});

				} else {
					this.$refs['ruleForm'].validate((valid) => {
						if (valid) {
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag = 1;
							api.addOrUpdateSupervisionPatrol(this.formData).then((res) => {
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
