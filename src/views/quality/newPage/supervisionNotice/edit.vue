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
									<strong>监理通知</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>
								<projectinfo></projectinfo>
								<div class="form-block">
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">编号</div>
											<div class="block-item-value">
												<el-form-item prop="code">
													<el-input v-model="formData.code"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>

									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">主送<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="mainSent">
													<el-input v-model="formData.mainSent"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">标题<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="title">
													<el-input v-model="formData.title"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">抄送</div>
											<div class="block-item-value">
												<el-form-item prop="copy">
													<el-input v-model="formData.copy"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">通知内容<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="content">
													<el-input v-model="formData.content" type="textarea" :rows="4"
														placeholder="请输入"></el-input>
												</el-form-item>
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
			<supervisionNotice @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible" v-if="draftVisible">
			</supervisionNotice>
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
					"auditUser": {},
					"code": "",
					"content": "",
					"copy": "",
					"deletedFlag": 1,
					"draftFlag": 1,
					"mainSent": "",
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					"title": ""
				},
				rules: {
					mainSent: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					title: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					content: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}]
				},
				auditUser: {},
                approveVisible:true,
				flowKey: 'jianlitongzhi'
			};
		},
		created() {},
		components: {
			upload,
			attachlist,
			drafthandle,
			approveuser,
			projectinfo,
			supervisionNotice: () => import("../supervisionNotice.vue")
		},
		computed: {
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
						"auditUser": {},
						"code": "",
						"content": "",
						"copy": "",
						"deletedFlag": 1,
						"draftFlag": 1,
						"mainSent": "",
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid'],
						"title": ""
					}
					this.auditUser={};
					this.approveVisible=true;
				}
			},

			getDetail(id) {
				api.getSupervisionNoticeDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData], [{
								"auditUser": {},
								"code": "",
								"content": "",
								"copy": "",
								"deletedFlag": 1,
								"draftFlag": 1,
								"mainSent": "",
								buildSection: this.$store.getters.project.id,
								projectId:this.$store.getters.project['parentid'],
								"title": ""
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
					api.addOrUpdateSupervisionNotice(this.formData).then((res) => {
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
							this.formData.otherAttachment = this.attachTable;
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag = 1;
							api.addOrUpdateSupervisionNotice(this.formData).then((res) => {
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
