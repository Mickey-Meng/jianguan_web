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
									<strong>质量活动</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify" @checkDraft="checkDraft"
										ref="drafthandle"></drafthandle>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">活动内容概述</div>
											<div class="block-item-value">
												<el-form-item prop="activityInfo">
													<el-input v-model="formData.activityInfo"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
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
										<div class="title-bar"></div><strong>附件上传</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.attachment">
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
			<qualityActivity @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible" v-if="draftVisible">
			</qualityActivity>
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
				childOptions: [],
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
					"activityInfo": "",
					"attachment": [],
					"auditUser": {},
					"buildSection": 0,
					"deletedFlag": 1,
					"draftFlag": 1,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['id'],
					"remark": ""
				},
				rules: {
					buildSection: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					activityInfo: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}]
				},
				attachTable: [], //其他附件
				flowNodesUsersData: [],
				auditUser: {},
                approveVisible:true,
				flowKey: 'zhilianghuodong',

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
			qualityActivity: () => import("../qualityActivity.vue")
		},
		computed: {
			
		},
		watch: {

		},
		mounted() {
			this.getChildProject();
		},
		methods: {
			getChildProject() {
				api.getChildProject({
					projectid: this.$store.getters.project['id']
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
						"activityInfo": "",
						"attachment": [],
						"auditUser": {},
						"buildSection": 0,
						"deletedFlag": 1,
						"draftFlag": 1,
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['id'],
						"remark": ""
					}
					// this.auditUser={};
					this.approveVisible=true;
				}
			},

			getDetail(id) {
				api.getQualityActivityDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
			addOrModify(isdraft) {
      if (this.submitDisable) return;
      
      this.submitDisable = true;
				if (isdraft) {
					if (diffCompare([this.formData], [{
								"activityInfo": "",
								"attachment": [],
								"auditUser": {},
								"buildSection": 0,
								"deletedFlag": 1,
								"draftFlag": 1,
								buildSection: this.$store.getters.project.id,
								projectId:this.$store.getters.project['id'],
								"remark": ""
							},
							
						])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateQualityActivity(this.formData).then((res) => {
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
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag = 1;
							api.addOrUpdateQualityActivity(this.formData).then((res) => {
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
