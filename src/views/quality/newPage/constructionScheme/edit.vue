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
									<strong>施工方案</strong>
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
											<div class="block-item-label">工程编号<i class="require-icon"></i></div>
											<div class="block-item-value" prop="projectCode">
												<!-- <el-input v-model="formData.projectCode"></el-input> -->
												<el-form-item prop="projectCode">
													<el-input v-model="formData.projectCode"></el-input>
												</el-form-item>
											</div>

										</div>
									</div>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>专项施工方案</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">专项施工方案名称<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="buildPlanName">
													<el-input v-model="formData.buildPlanName"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">附件清单</div>
											<div class="block-item-value">
												<el-input v-model="formData.attachmentList" type="textarea" :rows="4"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>专项施工方案附件清单</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>

									<attachlist :editAble="true" ref="attachlist" :attachTable="buildPlanAttachTable"></attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>专家论证会议纪要附件清单</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="expertMeetingAttachTable"></attachlist>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>专家论证情况描述</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">是否需要专家论证</div>
											<div class="block-item-value">
												<el-switch :active-value="0" :inactive-value="1" style="display: block" v-model="formData.expertArgument"
												active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否">
												</el-switch>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">专家论证意见</div>
											<div class="block-item-value">
												<el-input v-model="formData.expertOpinion" type="textarea" :rows="4" :disabled="formData.expertArgument==1"></el-input>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">专家论证意见的落实情况</div>
											<div class="block-item-value">
												<el-input v-model="formData.expertOpinionImplement" type="textarea" :rows="4" :disabled="formData.expertArgument==1"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>整改回复</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>

									<attachlist :editAble="true" ref="attachlist" :attachTable="replyAttachTable"></attachlist>
								</div>

								<!-- <div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>审批意见</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">各相关专业监理工程师审批意见</div>
											<div class="block-item-value">
												<el-input v-model="formData.projectCode" type="textarea" :rows="4"></el-input>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">建设单位审批意见</div>
											<div class="block-item-value">
												<el-input v-model="formData.projectCode" type="textarea" :rows="4"></el-input>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">总监审批信息意见</div>
											<div class="block-item-value">
												<el-input v-model="formData.projectCode" type="textarea" :rows="4"></el-input>
											</div>
										</div>
									</div>
								</div> -->
								<!-- <div class="form-title">
									<div class="title-big-bar"></div><strong>审批信息</strong>
								</div> -->

								<!-- <div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>审批意见</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">处理人</div>
											<div class="block-item-value">江逸</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">处理操作</div>
											<div class="block-item-value">同意</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">处理时间</div>
											<div class="block-item-value">2022-04-19 11:30:31</div>
										</div>
									</div>
								</div> -->

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
			<constructionScheme @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</constructionScheme>
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
		props: ['editRow'],
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogTitle: '全生命周期智慧建设管理平台',
				dialogFormVisible: false,
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				userOptions: [{
					label: '陈武林',
					value: 1
				}],
				rules: {
					projectCode: [{
						required: true,
						message: '请输入工程编号',
						trigger: 'blur'
					}],
					buildPlanName: [{
						required: true,
						message: '请输入专项施工方案名称',
						trigger: 'blur'
					}],
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
					qualityCheckUser: [{
						required: true,
						message: '请选择项目质检负责人',
						trigger: 'blur'
					}],
					projectBuildUser: [{
						required: true,
						message: '请选择项目施工负责人',
						trigger: 'blur'
					}]
				},
				baseInfo: {
					buildSection: 1,
					buildSectionName: '',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
				},
				formData: { //表单参数
					buildPlanName: '', // 专项施工方案名称
					attachmentList: '', // 附件清单
					expertArgument:0,
					attachment: [],
					buildCheckselfResult: '',
					deletedFlag: 1,
					draftFlag: 1,
					hiddenProject: '',
					projectBuildUser: 1,
					projectChargeUser: 1,
					projectCode: '',
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					qualityCheckUser: 1,
					subProject: '',
					supervisorEngineerUser: 1,
					supervisorUser: 1,
					unit: ''
				},
				attachTable: [], //附件
				buildPlanAttachTable: [], // 专项施工方案附件
				expertMeetingAttachTable: [], // 专家论证会议纪要附件
				replyAttachTable: [], // 整改回复附件
				fileList:[],
				auditUser: {},
                approveVisible:true,
				flowKey:'shigongfangan',

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
			constructionScheme: () => import("../constructionScheme.vue")
		},
		computed: {},
		mounted() {
			this.getProjectInfoById();
		},
		watch: {
		},
		methods: {
			changeVisible(obj, value) {
				this.dialogFormVisible = value;
				obj=obj||{};
				if (obj['id']) {
					this.getDetail(obj['id']);
                    this.approveVisible=false;
				} else {
					this.formData = {
						buildPlanName: '', // 专项施工方案名称
						attachmentList: '', // 附件清单
						expertArgument:0,
						attachment: [],
						buildCheckselfResult: '',
						deletedFlag: 1,
						draftFlag: 1,
						hiddenProject: '',
						projectBuildUser: 1,
						projectChargeUser: 1,
						projectCode: '',
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid'],
						qualityCheckUser: 1,
						subProject: '',
						supervisorEngineerUser: 1,
						supervisorUser: 1,
						unit: ''
					}
					this.attachTable=[]
					this.buildPlanAttachTable=[]
					this.expertMeetingAttachTable=[]
					this.replyAttachTable=[]
					// this.auditUser={};
					this.approveVisible=true;
				}
			},
			getProjectInfoById(){
				api.getProjectInfoById({
					projectid: this.$store.getters.project['id']
				}).then((res) => {
					let data = res['data'] || {};
					this.baseInfo['buildSectionName']=data['project']?data['project']['name']:'';
					let list=data['companys'] || [];
					let info=createProjectInfo(list);

					info = data['item'] || {}
					
					this.baseInfo['buildCompany'] = info['constructdpt']
					this.baseInfo['supervisionUnit'] = info['supervisordpt']
				});
			},
			getDetail(id) {
				api.getBuildPlanDetail({
					id: id
				}).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.buildPlanAttachTable=data.buildPlanAttachment||[];
					this.expertMeetingAttachTable=data.expertMeetingAttachment||[];
					this.replyAttachTable=data.replyAttachment||[];
					this.attachTable=data.attachment||[];
				});
			},
			addOrModify(isdraft) {
      if (this.submitDisable) return;
      
      this.submitDisable = true;
				if (isdraft) {
					if (diffCompare([this.formData, this.attachTable], [{
								buildPlanName: '', // 专项施工方案名称
								attachmentList: '', // 附件清单
								expertArgument:0,
								attachment: [],
								buildCheckselfResult: '',
								deletedFlag: 1,
								draftFlag: 1,
								hiddenProject: '',
								projectBuildUser: 1,
								projectChargeUser: 1,
								projectCode: '',
								buildSection: this.$store.getters.project.id,
								projectId:this.$store.getters.project['parentid'],
								qualityCheckUser: 1,
								subProject: '',
								supervisorEngineerUser: 1,
								supervisorUser: 1,
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
					this.formData.attachment=this.attachTable;
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateBuildPlan(this.formData).then((res) => {
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
						if(valid){
							this.formData.buildPlanAttachment=this.buildPlanAttachTable;
							this.formData.expertMeetingAttachment=this.expertMeetingAttachTable;
							this.formData.replyAttachment=this.replyAttachTable;
							this.formData.attachment=this.attachTable;
							this.formData.auditUser = this.auditUser;
							api.addOrUpdateBuildPlan(this.formData).then((res) => {
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
							this.$message({
								type: 'success',
								message: '请检查必填项!'
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
			},
			buildPlanAfterUp(data){
				this.buildPlanAttachTable.push({
					createTime:formatDateTime(data['uploadTime']),
					fileName:data['fileName'],
					fileUrl:data['fileId'],
					creatorName:'test'
				})
			},
			expertMeetingAfterUp(data){
				this.expertMeetingAttachTable.push({
					createTime:formatDateTime(data['uploadTime']),
					fileName:data['fileName'],
					fileUrl:data['fileId'],
					creatorName:'test'
				})
			},
			replyAfterUp(data){
				this.replyAttachTable.push({
					createTime:formatDateTime(data['uploadTime']),
					fileName:data['fileName'],
					fileUrl:data['fileId'],
					creatorName:'test'
				})
			},
			afterUp(data){
				this.attachTable.push({
					createTime:formatDateTime(data['uploadTime']),
					fileName:data['fileName'],
					fileUrl:data['fileId'],
					creatorName:'test'
				})
			},
			deleteAttach(row, index){
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.attachTable.splice(index,1);
				});
			}
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
