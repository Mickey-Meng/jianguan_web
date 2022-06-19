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
									<strong>监理旁站</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>发起位置</strong>
										
									</div>
									<locationmap></locationmap>
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<!-- <div class="block-item">
											<div class="block-item-label">创建人</div>
											<div class="block-item-value">
												{{baseInfo.userName}}
											</div>
										</div> -->
										<div class="block-line">
											<div class="block-item">
												<div class="block-item-label">旁站时间</div>
												<div class="block-item-value">
													<el-form-item prop="sideDate">
														<el-date-picker value-format="yyyy-MM-dd" v-model="formData.sideDate"
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
										<div class="title-bar"></div><strong>旁站信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">工程部位</div>
										<div class="block-item-value">
											<el-form-item prop="projectPartId">
												<el-select v-model="formData.projectPartId" placeholder="请选择">
													<el-option v-for="item in partOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</el-form-item>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-label">旁站监理项目<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="sideProjectId">
												<el-select v-model="formData.sideProjectId" placeholder="请选择">
													<el-option v-for="item in sideOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</el-form-item>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">工程部位描述</div>
											<div class="block-item-value">
												<el-form-item prop="projectPartDesc">
													<el-input v-model="formData.projectPartDesc"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">异常情况<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="exceptionCondition">
													<el-input v-model="formData.exceptionCondition"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>旁站信息记录</strong>
									</div>

									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">旁站工作情况</div>
											<div class="block-item-value">
												<el-form-item prop="sideWorkCondition">
													<el-input v-model="formData.sideWorkCondition"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">发现的问题及处理结果</div>
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
										<div class="title-bar"></div><strong>旁站现场照片</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist"
										:attachTable="formData.scenePhotoAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>实测实量照片</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist"
										:attachTable="formData.actualCheckAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>视频上传</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.video">
									</attachlist>
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

								<approveuser :auditUser="auditUser" :flowKey="flowKey">
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
			<qualityTest @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible" v-if="draftVisible">
			</qualityTest>
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
				dialogTitle: '项目全生命周期数字管理平台',
				childOptions:[],
				partOptions: [],
				sideOptions: [],
				baseInfo: {
					userName:this.$store.getters.userInfo.name,
					startDate:formatDate(new Date()),
				},
				formData: { //表单参数
					"actualCheckAttachment": [],
					"address": {},
					"attachment": [],
					"auditUser": {},
					"deletedFlag": 1,
					"draftFlag": 1,
					"exceptionCondition": "",
					"problemDealCondition": "",
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					"projectPartDesc": "",
					"projectPartId": 0,
					"scenePhotoAttachment": [],
					"sideDate": formatDate(new Date()),
					"sideInfo": "",
					"sideProjectId": null,
					"sideWorkCondition": "",
					"video": []
				},
				rules: {
					buildSection: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					sideProjectId: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					exceptionCondition: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					sideWorkCondition: [{
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
				flowKey: 'jianlipangzhan'
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
			supervisionStation: () => import("../supervisionStation.vue")
		},
		computed: {

		},
		watch: {

		},
		mounted() {
			this.getChildProject();
			this.getSupervisionSideEnums();
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
			getSupervisionSideEnums() {
				api.getSupervisionSideEnums().then((res) => {
					let options = res.data || [];
					this.sideOptions = convertOptions(options, 'desc', 'code');
				});
			},
			changeVisible(obj, value) {
				this.dialogFormVisible = value;
				obj = obj || {};
				this.addOrModifyFlag = obj['id'] ? false : true;
				if (obj['id']) {
					this.getDetail(obj['id']);
				} else {
					this.formData = {
						"actualCheckAttachment": [],
						"address": {},
						"attachment": [],
						"auditUser": {},
						"deletedFlag": 1,
						"draftFlag": 1,
						"exceptionCondition": "",
						"problemDealCondition": "",
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid'],
						"projectPartDesc": "",
						"projectPartId": 0,
						"scenePhotoAttachment": [],
						"sideDate": formatDate(new Date()),
						"sideInfo": "",
						"sideProjectId": null,
						"sideWorkCondition": "",
						"video": []
					}
				}
			},

			getDetail(id) {
				api.getSupervisionSideDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData], [{
								"actualCheckAttachment": [],
								"address": {},
								"attachment": [],
								"auditUser": {},
								"deletedFlag": 1,
								"draftFlag": 1,
								"exceptionCondition": "",
								"problemDealCondition": "",
								buildSection: this.$store.getters.project.id,
								projectId:this.$store.getters.project['parentid'],
								"projectPartDesc": "",
								"projectPartId": 0,
								"scenePhotoAttachment": [],
								"sideDate": formatDate(new Date()),
								"sideInfo": "",
								"sideProjectId": null,
								"sideWorkCondition": "",
								"video": []
							}
						], ['sideDate'])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateSupervisionSide(this.formData).then((res) => {
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
							api.addOrUpdateSupervisionSide(this.formData).then((res) => {
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
