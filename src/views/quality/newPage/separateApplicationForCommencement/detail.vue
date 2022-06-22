<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" @close="closeDialog" :visible.sync="dialogFormVisible"
			:fullscreen="true">
			<template slot="title">
				{{dialogTitle}}
				<div class="logo-icon"></div>
			</template>
			<el-container>
				<el-main
					style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
					<div class="form-bg">
						<div class="form-content">
							<el-form ref="form" label-width="80px">
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">工程编号</div>
											<div class="block-item-value">
												{{formData.projectCode}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>分项开工申请报告信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">建议开工日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.openDate}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">计划完工日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.endDate}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">地点或桩号<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.place}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">现场负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.liveUserName}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">施工员<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.buildUserName}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">质检员<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.checkUserName}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">施工准备情况说明<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.buildPrepareExplain}}
											</div>
										</div>

									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>标准试验审批表</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.experimentAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.experimentExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>专项施工方案审批表</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.buildAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.buildExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>工艺试验审批表</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.processAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.processExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>到场材料审批表</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.materialAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.materialExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>到场设备审批表（含特种设备检测报告）</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.equipmentAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.equipmentExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div>
										<strong>到场技术、质量、安全、环保管理人员及主要操人员、特种作业人员情况及证件复印件</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.techAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.techExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>施工方案</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.buildPlanAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.buildPlanExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>安全技术措施</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.securityAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.securityExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>危险性较大项目安全专项施工方案审查记录</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.riskAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.riskExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>环境保护措施</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.environmentAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.environmentExplain}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>环保、安全、质量、技术交底材料</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="false" ref="attachlist"
										:attachTable="formData.bottomAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												{{formData.bottomExplain}}
											</div>
										</div>
									</div>
								</div>
							</el-form>
							<!-- <taskhandle :taskInfo="taskInfo"></taskhandle> -->
						</div>
					</div>
				</el-main>
				<el-aside width="8px" class="close-wrapper">
					<div class="close-wrap">
						<i class="el-icon-caret-right"></i>
					</div>
				</el-aside>
				<el-aside
					style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
					<tasklog :taskInfo="taskInfo" ref="tasklog"></tasklog>
				</el-aside>
			</el-container>
		</el-dialog>

	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import * as userapi from "@/api/user";
	
	import {
		convertOptions,
		getQueryVariable,
		formatDate,
		getDaysBetween,
		createProjectInfo,
		getOptionsLabel
	} from "@/utils/format.js";
	import tasklog from "../../../common/tasklog.vue"

	import taskhandle from '../../../common/taskhandle'
	import attachlist from "../../../common/attachlist"
	import projectinfo from "../../../common/projectinfo.vue"

	export default {
		props: ['detailRow'],
		data() {
			return {
				dialogFormVisible: false,
				dialogTitle: '项目全生命周期数字管理平台',
				buildUserOptions:[{
					label:'洪涛',
					value:'148'
				}],
				checkUserOptions:[{
					label:'洪涛',
					value:'148'
				}],
				liveUserOptions:[{
					label:'洪涛',
					value:'148'
				}],
				baseInfo: {
					buildSection: '',
					buildSectionName: '235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
					supervisionSection: '监理办'
				},
				formData: { //表单参数
					bottomAttachment: [],
					bottomExplain: '',
					buildAttachment: [],
					buildExplain: '',
					buildPlanAttachment: [],
					buildPlanExplain: '',
					buildPrepareExplain: '',
					buildUser: '',
					checkUser: '',
					endDate: formatDate(new Date()),
					environmentAttachment: [],
					environmentExplain: '',
					equipmentAttachment: [],
					equipmentExplain: '',
					experimentAttachment: [],
					experimentExplain: '',
					liveUser: '',
					materialAttachment: [],
					materialExplain: '',
					openDate: formatDate(new Date()),
					place: '',
					processAttachment: [],
					processExplain: '',
					projectCode: '',
					riskAttachment: [],
					riskExplain: '',
					securityAttachment: [],
					securityExplain: '',
					techAttachment: [],
					techExplain: '',
					deletedFlag: 1,
					draftFlag: 1,
					buildSection: this.$store.getters.project.id,
					projectId: this.$store.getters.project['parentid']
				},
				taskInfo: {}
			};
		},
		created() {},
		components: {
			tasklog,
			taskhandle,
			attachlist,
			projectinfo
		},
		computed: {},
		watch: {
			detailRow(obj) {
				if (obj['id']) {
					this.getDetail(obj['id']);
				}
			}
		},
		mounted() {
			this.getProjectInfoById();
			this.getUserOptions();
			// setTimeout(()=>{
			// 	var params = getQueryVariable();
			// 	if (params['processDefinitionId']) {
			// 		this.dialogFormVisible=true;
			// 		params['id'] = params['businessKey'];
			// 		this.taskInfo=params;
			// 		this.getDetail(params['businessKey']);
			// 	}
			// },500)
		},
		methods: {
			getUserOptions(){
				this.buildUserOptions=[];
				this.checkUserOptions=[];
				this.liveUserOptions=[];
				
				userapi.getUserByRoleId(this.$store.getters.project['id'],70).then(res=>{
					let data=res.data||[];
					data.forEach(item=>{
						this.buildUserOptions.push({
							label:item['name'],
							value:item['id']
						})
					})
				})
				userapi.getUserByRoleId(this.$store.getters.project['id'],99).then(res=>{
					let data=res.data||[];
					data.forEach(item=>{
						this.checkUserOptions.push({
							label:item['name'],
							value:item['id']
						})
					})
				})
				userapi.getUserByRoleId(this.$store.getters.project['id'],99).then(res=>{
					let data=res.data||[];
					data.forEach(item=>{
						this.liveUserOptions.push({
							label:item['name'],
							value:item['id']
						})
					})
				})
			},
			closeDialog() {
				if (this.taskInfo['processDefinitionId']) {
					this.$router.go(-1);
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
			changeVisible(value) {
				this.dialogFormVisible = value;
			},
			getDetail(id) {
				api.getSubitemOpenDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.formData.buildUserName=getOptionsLabel(this.buildUserOptions,this.formData.buildUser)
					this.formData.liveUserName=getOptionsLabel(this.liveUserOptions,this.formData.liveUser)
					this.formData.checkUserName=getOptionsLabel(this.checkUserOptions,this.formData.checkUser)
				});
				api.getFlowAndTaskInfo({
					businessKey: id
				}).then((res) => {
					console.log(res.data);
					let data = res['data'];
					this.taskInfo = {
						processDefinitionId: data['processDefinitionId'],
						processInstanceId: data['processInstanceId'],
						taskId: data['taskId']
					}
					this.updateTaskLog();
				});
			},
			updateTaskLog() {
				setTimeout(() => {
					this.$refs['tasklog'].initData();
				}, 100)
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
