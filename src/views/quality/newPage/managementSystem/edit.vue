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
									<strong>管理制度</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-item">
											
											<div class="block-item-label">编制人：<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="compileUser">
													<el-input v-model="formData.compileUser"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">编制日期<i class="require-icon"></i></div>
											<div class="block-item-value">
											<el-form-item prop="compileDate">
												<el-date-picker type="date"  value-format="yyyy-MM-dd" v-model="formData.compileDate" placeholder="选择日期"></el-date-picker>
											</el-form-item>
											</div>
										</div>
									</div>
									
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>制度文件</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 jpg/jpeg png mp4 docx doc xlsx xls pdf zip 文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.attachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">制度内容<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="regimeContent">
													<el-input type="textarea" style="width: 600px" :rows="15" placeholder="请输入" v-model="formData.regimeContent"></el-input>
												</el-form-item>
												
											</div>
										</div>
									</div>
								</div>


								<div class="form-block">
									<el-button class="submit-btn" size="small" type="primary" @click="addOrModify()">提交
									</el-button>
								</div>
							</el-form>
						</div>
					</div>
				</el-main>
			</el-container>
		</el-dialog>

		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<managementSystem @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible" v-if="draftVisible">
			</managementSystem>
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
	import projectinfo from "../../../common/projectinfo.vue"
	
	export default {
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogFormVisible: false,

				dialogTitle: '全生命周期智慧建设管理平台',

				formData: { //表单参数
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project.parentid,
					compileDate: formatDate(), // 编制日期
					compileUser: '', // 编制人
					regimeContent: '', // 制度内容
					deletedFlag: 1,
					draftFlag: 1,
					attachment: []
				},
				rules: {
					compileUser: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					compileDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					regimeContent: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}]
				}
			};
		},
		created() {},
		components: {
			upload,
			attachlist,
			drafthandle,
			projectinfo,
			managementSystem: () => import("../managementSystem.vue")
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
				} else {
					this.formData = {
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project.parentid,
						compileDate: formatDate(), // 编制日期
						compileUser: '', // 编制人
						regimeContent: '', // 制度内容
						deletedFlag: 1,
						draftFlag: 1,
						attachment: []
					}
				}
			},

			getDetail(id) {
				api.getManageRegime(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData], [{
								buildSection: this.$store.getters.project.id,
								projectId:this.$store.getters.project.parentid,
								compileDate: formatDate(), // 编制日期
								compileUser: '', // 编制人
								regimeContent: '', // 制度内容
								deletedFlag: 1,
								draftFlag: 1,
								attachment: []
							},
						])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.draftFlag = isdraft ? 0 : 1;
					api.addOrUpdateManageRegimeList(this.formData).then((res) => {
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
							this.formData.draftFlag = 1;
							api.addOrUpdateManageRegimeList(this.formData).then((res) => {
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
