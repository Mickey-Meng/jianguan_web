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
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目名称</div>
											<div class="block-item-value">
												{{baseInfo.projectName}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">施工标段标段</div>
											<div class="block-item-value">
												{{baseInfo.buildSectionName}}
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
											<div class="block-item-label">发起人</div>
											<div class="block-item-value">
												{{baseInfo.startupUser}}
								
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">发起日期</div>
											<div class="block-item-value">
												{{formData.startDate}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>合同信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">合同编号</div>
											<div class="block-item-value">
												{{formData.contractCode}}
												
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">承包人</div>
											<div class="block-item-value">
												{{formData.contractUser}}
											</div>
										</div>
									</div>
									<div class="form-block-title">
										<div class="title-bar"></div><strong>合同附件</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
								
									<attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
									
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>信息填报</strong>
									</div>
									<div class="block-table">
										<el-table :data="contractTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="buildProjectName" align="center" label="拟分包工程名称"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="buildProjectPartName" width="180px" align="center"
												label="拟分包工程部位">
											</el-table-column>
											<el-table-column prop="contractUserName" width="120px" align="center"
												label="承包人名称">
											</el-table-column>
											<el-table-column prop="contractChargeUserName" width="120px" align="center"
												label="承包负责人">
											</el-table-column>
											<el-table-column prop="cardNum" width="120px" align="center" label="身份证号">
											</el-table-column>
											<el-table-column prop="contractNum" width="120px" align="center"
												label="拟分包工程合同金额(元)">
											</el-table-column>
											<el-table-column prop="buildStartMonth" width="120px" align="center"
												label="拟分包施工工期结束月份">
											</el-table-column>
											<el-table-column prop="buildEndMonth" width="120px" align="center"
												label="拟分包施工工期开始月份">
											</el-table-column>
											<el-table-column prop="contractUserQualification" width="120px"
												align="center" label="承包人专业分包资质">
											</el-table-column>
											<el-table-column prop="remark" width="120px" align="center" label="备注">
											</el-table-column>
											
										</el-table>
									</div>
								</div>
								
							</el-form>
							<taskhandle :taskInfo="taskInfo"></taskhandle>
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
	import { getUserInfo } from "@/api/user";
	import tasklog from "../../common/tasklog.vue"
	import taskhandle from '../../common/taskhandle'
	import attachlist from "../../common/attachlist"
	import {
		formatMonth,
		formatDate,
		formatDateTime,
		convertOptions
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
					buildSection: '4',
					contractCode: '',
					information: [],
					contractUser: '',
					deletedFlag: 1,
					draftFlag: 1,
					projectId: this.$store.getters.project['parentid'],
					startDate:formatDate(new Date())
				},
				attachTable: [], //附件
				contractTable: [],
				taskInfo:{}
			};
		},
		created() {},
		components: {
			tasklog,
			taskhandle,
			attachlist
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
			
		},
		methods: {
			getUserInfo(id) {
				getUserInfo(id).then(res => {
					this.baseInfo.startupUser = res.data.userInfo.NAME;
				});
			},
			closeDialog(){
				if(this.taskInfo['processDefinitionId']){
					this.$router.go(-1);
				}
			},
			changeVisible(value){
				this.dialogFormVisible=value;
			},
			getDetail(id){
				api.getContractLaborDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
					this.contractTable = data.information || [];
					this.getUserInfo(data.createUserId)
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
