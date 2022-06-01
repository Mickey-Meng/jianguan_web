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
									<strong>施工方案-浙公路（JL）011</strong>
									<div class="form-btns">
										<el-button size="medium">暂存</el-button>
										<el-button size="medium">保存草稿</el-button>
										<el-button size="medium">选择草稿</el-button>
										<el-button size="medium" type="primary">复制填充</el-button>
									</div>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目名称</div>
											<div class="block-item-value">
												{{baseInfo.buildSectionName}}
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
											<div class="block-item-label">合同号</div>
											<div class="block-item-value">
												{{baseInfo.contractCode}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">监理单位</div>
											<div class="block-item-value">
												{{baseInfo.supervisionUnit}}
											</div>
										</div>
									</div>
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
								
								<div class="form-block">
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
								</div>
								<div class="form-title">
									<div class="title-big-bar"></div><strong>审批信息</strong>
								</div>

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
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>待审批人</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">技术负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="qualityCheckUser">
													<el-select v-model="formData.qualityCheckUser" placeholder="请选择">
														<el-option v-for="item in userOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="qualityCheckUser">
													<el-select v-model="formData.qualityCheckUser" placeholder="请选择">
														<el-option v-for="item in userOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">各相关专业监理工程师<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="qualityCheckUser">
													<el-select v-model="formData.qualityCheckUser" placeholder="请选择">
														<el-option v-for="item in userOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">总监审核<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="qualityCheckUser">
													<el-select v-model="formData.qualityCheckUser" placeholder="请选择">
														<el-option v-for="item in userOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">指挥部备案<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="qualityCheckUser">
													<el-select v-model="formData.qualityCheckUser" placeholder="请选择">
														<el-option v-for="item in userOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<el-button @click="addOrModify" class="submit-btn" size="small" type="primary">提交
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
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		formatDateTime,
		createProjectInfo
	} from "@/utils/format.js";
	import upload from "../../../common/upload.vue"
	import attachlist from "../../../common/attachlist.vue"
	
	export default {
		props: ['editRow'],
		data() {
			return {
				dialogTitle: '项目全生命周期数字管理平台',
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
					// id: null,
					projectBuildUser: 1,
					projectChargeUser: 1,
					projectCode: '',
					projectId: this.$store.getters.project['parentid'],
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
				fileList:[]
			};
		},
		created() {},
		components: {
			upload,
			attachlist
		},
		computed: {},
		mounted() {
			this.getProjectInfoById();
		},
		watch: {
			editRow(obj) {
				obj=obj||{};
				if (obj['id']) {
					this.getDetail(obj['id']);
				} else {
					this.formData = {
						buildPlanName: '', // 专项施工方案名称
						attachmentList: '', // 附件清单
						buildPlanAttachTable: [], // 专项施工方案附件
						expertMeetingAttachTable: [], // 专家论证会议纪要附件
						replyAttachTable: [], // 整改回复附件

						attachment: [],
						buildCheckselfResult: '',
						deletedFlag: 1,
						draftFlag: 1,
						hiddenProject: '',
						// id: null,
						projectBuildUser: 1,
						projectChargeUser: 1,
						projectCode: '',
						projectId: this.$store.getters.project['parentid'],
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
				}
			}
		},
		methods: {
			changeVisible(value) {
				this.dialogFormVisible = value;
			},
			getProjectInfoById(){
				api.getProjectInfoById({
					projectid:this.$store.getters.project['parentid']
				}).then((res) => {
					let data = res['data'] || {};
					this.baseInfo['buildSectionName']=data['project']?data['project']['name']:'';
					let list=data['companys'] || [];
					let info=createProjectInfo(list);
					this.baseInfo['buildCompany']=info['buildCompany'];
					this.baseInfo['supervisionUnit']=info['supervisionUnit'];
				});
			},
			getDetail(id) {
				api.getHiddenProjectDetail({
					id: id
				}).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable=data.attachment||[];
				});
			},
			addOrModify() {
				this.$refs['ruleForm'].validate((valid) => {
					if(valid){
						this.formData.buildPlanAttachment=this.buildPlanAttachTable;
						this.formData.expertMeetingAttachment=this.expertMeetingAttachTable;
						this.formData.replyAttachment=this.replyAttachTable;
						this.formData.attachment=this.attachTable;
						api.addOrUpdateBuildPlan(this.formData).then((res) => {
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
						this.$message({
							type: 'success',
							message: '请检查必填项!'
						});
					}
					
				})
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
