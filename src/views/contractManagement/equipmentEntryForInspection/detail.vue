<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" @close="closeDialog" :visible.sync="dialogFormVisible" :fullscreen="true">
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
										<div class="title-bar"></div><strong>进场设备信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">监理办<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.supervisionBan}}
											</div>
										</div>
									</div>
									<div class="block-table">
										<el-table :data="equipmentTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="equipmentName" width="180px" align="center"
												label="设备名称">
											</el-table-column>
											<el-table-column prop="specification" width="120px" align="center"
												label="规格型号">
											</el-table-column>
											<el-table-column prop="num" width="120px" align="center" label="数量">
											</el-table-column>
											<el-table-column prop="exitDate" width="120px" align="center" label="拟退场日期">
											</el-table-column>
											<el-table-column prop="remark" width="120px" align="center" label="备注">
											</el-table-column>
											<el-table-column prop="exitReason" width="120px" align="center" label="退场原因">
											</el-table-column>
											<el-table-column prop="techStatus" width="120px" align="center"
												label="技术状态">
											</el-table-column>
										</el-table>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件清单</strong>
									</div>
								
									<attachlist :editAble="false" ref="attachlist" :attachTable="attachTable">
									</attachlist>
								
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
	import * as api from "@/api/contract";
	import * as proapi from "@/api/project.js";
	import tasklog from "../../common/tasklog.vue"
	import taskhandle from '../../common/taskhandle'
	import attachlist from "../../common/attachlist"
	import projectinfo from "../../common/projectinfo.vue"
	
	import {
		formatMonth,
		formatDate,
		formatDateTime,
		convertOptions,
		createProjectInfo
	} from "@/utils/format.js";

	export default {
		props:['detailRow'],
		data() {
			return {
				dialogTitle: '项目全生命周期数字管理平台',
				dialogFormVisible: false,
				baseInfo: {
					buildSection: 1,
					projectName:'235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					buildSectionName: '235国道项目部',
					contractCode: 'ORG_00004',
					startupUser: '赵赞文',
					startupDate: formatMonth(new Date()),
				},
				formData: { //表单参数
					attachment: [],
					equipmentInfo:[],
					deletedFlag: 1,
					draftFlag: 1,
					projectCode: '',
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					supervisionBan: ''
				},
				attachTable: [], //附件
				equipmentTable: [],
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
		watch:{
			detailRow(obj){
				if(obj['id']){
					this.getDetail(obj['id']);
				}
			}
		},
		mounted() {
			this.getProjectInfoById();
		},
		methods: {
			closeDialog(){
				// if(this.taskInfo['processDefinitionId']){
				// 	this.$router.go(-1);
				// }
			},
			getProjectInfoById() {
				proapi.getProjectInfoById({
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
			changeVisible(value){
				this.dialogFormVisible=value;
			},
			getDetail(id){
				api.getEquipmentEnterDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
					this.equipmentTable = data.equipmentInfo || [];
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
	@import "../../../assets/css/dialog.scss"
</style>
