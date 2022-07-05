<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" @close="closeDialog"  :fullscreen="true" :visible.sync="dialogFormVisible">
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
								<div class="form-title">
									<div class="title-big-bar"></div>
									<strong>施工方案-浙公路（JL）011</strong>
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
												{{formData.projectCode}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>专项施工方案附件清单</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">专项施工方案名称</div>
											<div class="block-item-value">
												{{formData.buildPlanName}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">附件清单</div>
											<div class="block-item-value">
												{{formData.attachmentList}}
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
									
									<attachlist :editAble="false" ref="attachlist" :attachTable="buildPlanAttachTable"></attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>专家论证会议纪要附件清单</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									
									<attachlist :editAble="false" ref="attachlist" :attachTable="expertMeetingAttachTable"></attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>专家论证情况描述</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">是否需要专家论证</div>
											<div class="block-item-value">
												<el-switch disabled :active-value="0" :inactive-value="1" style="display: block" v-model="formData.expertArgument"
												active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否">
												</el-switch>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">专家论证意见</div>
											<div class="block-item-value">
												<el-input v-model="formData.expertOpinion" type="textarea" :rows="4" disabled></el-input>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">专家论证意见的落实情况</div>
											<div class="block-item-value">
												<el-input v-model="formData.expertOpinionImplement" type="textarea" :rows="4" disabled></el-input>
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
									
									<attachlist :editAble="false" ref="attachlist" :attachTable="replyAttachTable"></attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>审批意见</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">各相关专业监理工程师审批意见</div>
											<div class="block-item-value">
												<el-input v-model="formData.projectCode" type="textarea" :rows="4" disabled></el-input>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">建设单位审批意见</div>
											<div class="block-item-value">
												<el-input v-model="formData.projectCode" type="textarea" :rows="4" disabled></el-input>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">总监审批信息意见</div>
											<div class="block-item-value">
												<el-input v-model="formData.projectCode" type="textarea" :rows="4" disabled></el-input>
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
	import {
		convertOptions,
		getQueryVariable
	} from "@/utils/format.js";
	import tasklog from "../../../common/tasklog.vue"
	import taskhandle from '../../../common/taskhandle'
	import attachlist from "../../../common/attachlist.vue"
	import projectinfo from "../../../common/projectinfo.vue"
	
	export default {
		props:['detailRow'],
		data() {
			return {
				dialogTitle: '项目全生命周期数字管理平台',
				dialogFormVisible: false,
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				baseInfo: {
					buildSection: 1,
					buildSectionName: '235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
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
				taskInfo:{}
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
		mounted() {
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
		watch:{
			detailRow(obj){
				if(obj['id']){
					this.getDetail(obj['id']);
				}
			}
		},
		methods: {
			closeDialog(){
				// if(this.taskInfo['processDefinitionId']){
				// 	this.$router.go(-1);
				// }
			},
			changeVisible(value){
				this.dialogFormVisible=value;
			},
			getDetail(id){
				api.getBuildPlanDetail({id:id}).then((res) => {
					let data=res['data']||{};
					this.formData=data;
					this.buildPlanAttachTable=data.buildPlanAttachment||[];
					this.expertMeetingAttachTable=data.expertMeetingAttachment||[];
					this.replyAttachTable=data.replyAttachment||[];
					this.attachTable=data.attachment||[];
				});
				api.getFlowAndTaskInfo({businessKey: id}).then((res) => {
					console.log(res.data);
					let data=res['data'];
					this.taskInfo={
						processDefinitionId: data['processDefinitionId'],
						processInstanceId: data['processInstanceId'],
						taskId: data['taskId']
					}
					this.updateTaskLog();
				});
			},
			updateTaskLog(){
				setTimeout(()=>{
					this.$refs['tasklog'].initData();
				},100)
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>

