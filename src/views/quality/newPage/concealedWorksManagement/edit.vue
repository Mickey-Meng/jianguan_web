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
									<strong>隐蔽工程管理</strong>
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
											<div class="block-item-label">工程编号</div>
											<div class="block-item-value">
												<el-input v-model="formData.projectCode"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>隐蔽工程信息</strong>
									</div>
									<div class="block-line">

										<div class="block-item">
											<div class="block-item-label">单位、分部工程<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="unit">
													<el-input v-model="formData.unit"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">分项工程<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="subProject">
													<el-input v-model="formData.subProject"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">隐蔽工程项目<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="hiddenProject">
													<el-input v-model="formData.hiddenProject" type="textarea" :rows="4"
														placeholder="请输入隐蔽工程项目"></el-input>
												</el-form-item>

											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">施工自检结果<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="buildCheckselfResult">
													<el-input v-model="formData.buildCheckselfResult" type="textarea"
														:rows="4" placeholder="请输入施工自检结果"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件清单</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>

									<attachlist :editAble="true" ref="attachlist" :attachTable="attachTable">
									</attachlist>

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
				<!-- <el-aside width="8px" class="close-wrapper">
					<div class="close-wrap">
						<i class="el-icon-caret-right"></i>
					</div>
				</el-aside>
				<el-aside
					style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
					<tasklog></tasklog>
				</el-aside> -->
			</el-container>
		</el-dialog>
		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<concealedWorksManagement @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</concealedWorksManagement>
		</el-dialog>

	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import { getUserInfo } from "@/api/user";
	import {
		formatDateTime,
		createProjectInfo,
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
				dialogTitle: '全生命周期智慧建设管理平台',
				dialogFormVisible: false,
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				rules: {
					subProject: [{
						required: true,
						message: '请填写分项工程',
						trigger: 'blur'
					}],
					unit: [{
						required: true,
						message: '请填写	单位、分部工程',
						trigger: 'blur'
					}],
					hiddenProject: [{
						required: true,
						message: '请填写隐蔽工程项目',
						trigger: 'blur'
					}],
					buildCheckselfResult: [{
						required: true,
						message: '请填写施工自检结果',
						trigger: 'blur'
					}],

				},
				baseInfo: {
					buildSection: 1,
					buildSectionName: '',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
				},
				formData: { //表单参数
					attachment: [],
					buildCheckselfResult: '',
					deletedFlag: 1,
					draftFlag: 1,
					hiddenProject: '',
					// id: null,
					projectCode: '',
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					subProject: '',
					unit: ''
				},
				formData_bak: null,
				attachTable_bak: null,
				attachTable: [], //附件
				fileList: [],
				auditUser: {},
                approveVisible:true,
				flowKey:'yinbigongchengguanli'
			};
		},
		created() {},
		components: {
			upload,
			attachlist,
			drafthandle,
			approveuser,
			projectinfo,
			concealedWorksManagement: () => import("../concealedWorksManagement.vue")
		},
		computed: {

		},
		mounted() {
			this.getProjectInfoById();
		},
		watch: {

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
						attachment: [],
						buildCheckselfResult: '',
						deletedFlag: 1,
						draftFlag: 1,
						hiddenProject: '',
						projectCode: '',
						buildSection: this.$store.getters.project.id,projectId:this.$store.getters.project['parentid'],
						subProject: '',
						unit: ''
					}
					this.attachTable = [];
					// this.auditUser={};
					this.approveVisible=true;
				}
			},
			getProjectInfoById() {
				api.getProjectInfoById({
					projectid: this.$store.getters.project['parentid']
				}).then((res) => {
					let data = res['data'] || {};
					this.baseInfo['buildSectionName'] = data['project'] ? data['project']['name'] : '';
					let list = data['companys'] || [];
					let info = createProjectInfo(list);
					this.baseInfo['buildCompany'] = info['buildCompany'];
					this.baseInfo['supervisionUnit'] = info['supervisionUnit'];
				});
			},
			getDetail(id) {
				api.getHiddenProjectDetail({
					id: id
				}).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData, this.attachTable], [{
								attachment: [],
								buildCheckselfResult: '',
								deletedFlag: 1,
								draftFlag: 1,
								hiddenProject: '',
								projectCode: '',
								buildSection: this.$store.getters.project.id,projectId:this.$store.getters.project['parentid'],
								subProject: '',
								unit: ''
							},
							[]
						])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.attachment = this.attachTable;
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateHiddenProject(this.formData).then((res) => {
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
							this.formData.attachment = this.attachTable;
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag = 1;
							api.addOrUpdateHiddenProject(this.formData).then((res) => {
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
