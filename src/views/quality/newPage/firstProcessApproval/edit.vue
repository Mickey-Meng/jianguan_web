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
									<strong>分项开工申请</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">施工标段<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="buildSection">
													<el-select @change="changeChild" v-model="formData.buildSection"
														placeholder="请选择">
														<el-option v-for="item in childOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">施工单位</div>
											<div class="block-item-value">
												{{baseInfo.buildCompany}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">首件工程名称<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="firstProjectName">
													<el-input v-model="formData.firstProjectName"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">合同号</div>
											<div class="block-item-value">
												{{baseInfo.contractCode}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">分部分项<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="subProject">
													<el-select v-model="formData.subProject"
														placeholder="请选择">
														<el-option v-for="item in partOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">单位工程</div>
											<div class="block-item-value">
												{{baseInfo.contractCode}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">分部工程</div>
											<div class="block-item-value">
												{{baseInfo.contractCode}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">分项工程</div>
											<div class="block-item-value">
												{{baseInfo.contractCode}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">具体分项<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="subProjectDetail">
													<el-input v-model="formData.subProjectDetail"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">实施日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="buildDate">
													<el-date-picker value-format="yyyy-MM-dd" v-model="formData.buildDate"
														type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>

											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">施工过程简述<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="buildProcessExplain">
													<el-input v-model="formData.buildProcessExplain"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">监理工作情况<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="supervisionWorkExplain">
													<el-input v-model="formData.supervisionWorkExplain"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">主要数据记录<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="mainDataExplain">
													<el-input v-model="formData.mainDataExplain"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">发现的问题及处理情况<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="problemDealExplain">
													<el-input v-model="formData.problemDealExplain"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>质量检验及评定</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">检验结果描述<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="checkResultExplain">
													<el-input v-model="formData.checkResultExplain"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">外观质量描述<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="faceQuelityExplain">
													<el-input v-model="formData.faceQuelityExplain"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block-title">
									<div class="title-bar"></div><strong>开工申请</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>施工技术、工艺方案说明和图表<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.buildTechAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>测量放样资料<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.measureAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>材料出厂保证书、材料检测试验报告<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.materialAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>机械的主要技术标准及最大生产能力<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.mechanicalAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>批准的标准试验报告<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.testAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>开工申请<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.openAttachment">
									</attachlist>
								</div>
								<div class="form-block-title">
									<div class="title-bar"></div><strong>质量保证资料<i class="require-icon"></i></strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>文件</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.qualityAttachment">
									</attachlist>
								</div>
								<div class="form-block-title">
									<div class="title-bar"></div><strong>影像资料</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>文件</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.imageVideo">
									</attachlist>
								</div>
								<div class="form-block-title">
									<div class="title-bar"></div><strong>首件工程总结</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>文件<i class="require-icon"></i></strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.firstProjectVideo">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">首件工程通过情况</div>
											<div class="block-item-value">
												<el-form-item prop="firstPassExplain">
													<el-input v-model="formData.firstPassExplain" placeholder="请输入">
													</el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>

								<approveuser :auditUser="auditUser"  :flowKey="flowKey">
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
	import approveuser from "../../../common/approveuser.vue"
	export default {
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogFormVisible: false,
				dialogTitle: '项目全生命周期数字管理平台',
				childOptions: [],
				partOptions: [],
				baseInfo: {
					buildSection: 1,
					buildSectionName: '',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
					supervisionSection: ''
				},
				formData: { //表单参数
					buildDate: formatDate(new Date()),
					buildProcessExplain: "",
					buildSection: '',
					buildTechAttachment: [],
					checkResultExplain: "",
					deletedFlag: 1,
					draftFlag: 1,
					faceQuelityExplain: "",
					firstPassExplain: "",
					firstProjectName: "",
					firstProjectVideo: [],
					imageVideo: [],
					mainDataExplain: "",
					materialAttachment: [],
					measureAttachment: [],
					mechanicalAttachment: [],
					openAttachment: [],
					problemDealExplain: "",
					projectId: this.$store.getters.project['parentid'],
					qualityAttachment: [],
					subProject: 0,
					subProjectDetail: "",
					supervisionWorkExplain: "",
					testAttachment: []
				},
				rules: {
					buildSection: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					firstProjectName: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					subProject: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					subProjectDetail: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					buildDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					buildProcessExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					projectApplyExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					supervisionWorkExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					mainDataExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					problemDealExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					checkResultExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					faceQuelityExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					firstPassExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}]
				},
				auditUser: {},
				flowKey:'shoujianrenke'
			};
		},
		created() {},
		components: {
			upload,
			attachlist,
			drafthandle,
			approveuser,
			firstProcessApproval: () => import("../firstProcessApproval.vue")
		},
		computed: {},
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
			changeChild(){
				api.getCompanyByProjectId({
					projectid:this.formData.buildSection
				}).then((res) => {
					this.baseInfo=res;
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
						buildDate: formatDate(new Date()),
						buildProcessExplain: "",
						buildSection: '',
						buildTechAttachment: [],
						checkResultExplain: "",
						deletedFlag: 1,
						draftFlag: 1,
						faceQuelityExplain: "",
						firstPassExplain: "",
						firstProjectName: "",
						firstProjectVideo: [],
						imageVideo: [],
						mainDataExplain: "",
						materialAttachment: [],
						measureAttachment: [],
						mechanicalAttachment: [],
						openAttachment: [],
						problemDealExplain: "",
						projectId: this.$store.getters.project['parentid'],
						qualityAttachment: [],
						subProject: 0,
						subProjectDetail: "",
						supervisionWorkExplain: "",
						testAttachment: []
					}
					this.attachTable = [];
				}
			},

			getDetail(id) {
				api.getFirstAcceptDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData], [{
								buildDate: formatDate(new Date()),
								buildProcessExplain: "",
								buildSection: '',
								buildTechAttachment: [],
								checkResultExplain: "",
								deletedFlag: 1,
								draftFlag: 1,
								faceQuelityExplain: "",
								firstPassExplain: "",
								firstProjectName: "",
								firstProjectVideo: [],
								imageVideo: [],
								mainDataExplain: "",
								materialAttachment: [],
								measureAttachment: [],
								mechanicalAttachment: [],
								openAttachment: [],
								problemDealExplain: "",
								projectId: this.$store.getters.project['parentid'],
								qualityAttachment: [],
								subProject: 0,
								subProjectDetail: "",
								supervisionWorkExplain: "",
								testAttachment: []
							}
						], ['buildDate'])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateFirstAccept(this.formData).then((res) => {
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
							api.addOrUpdateFirstAccept(this.formData).then((res) => {
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
