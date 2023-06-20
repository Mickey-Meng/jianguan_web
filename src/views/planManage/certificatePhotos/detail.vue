<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" @close="closeDialog" :visible.sync="dialogFormVisible" :fullscreen="true">
			<template slot="title">{{dialogTitle}}
				<div class="logo-icon"></div>
			</template>
			<el-container>
				<el-main style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
					<div class="form-bg">
						<div class="form-content">

							<el-form :model="formData" :rules="rules" ref="ruleForm" label-width="80px">
								<div class="form-title">
									<div class="title-big-bar"></div>
									<strong>计划管理-证照管理</strong>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>

									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">证照名称</div>
											<div class="block-item-value">{{ formData.name }}</div>
										</div>

										<div class="block-item">
											<div class="block-item-label">证照内容</div>
											<div class="block-item-value">{{ formData.contents }}</div>
										</div>
									</div>


									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">计划开始时间</div>
											<div class="block-item-value">{{ formData.startTime }}</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">计划结束时间</div>
											<div class="block-item-value">{{ formData.endTime }}</div>
										</div>
									</div>

									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">上报时间</div>
											<div class="block-item-value">{{ formData.reportTime }}</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">上报人</div>
											<div class="block-item-value">{{ formData.reportUser }}</div>
										</div>
									</div>

									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">责任人</div>
											<div class="block-item-value">{{ formData.owner }}</div>
										</div>

										<div class="block-item">
											<div class="block-item-label">备注</div>
											<div class="block-item-value">{{ formData.remark }}</div>
										</div>
									</div>
								</div>
							</el-form>
						</div>
					</div>
				</el-main>

				<el-aside width="8px" class="close-wrapper">
					<div class="close-wrap">
						<i class="el-icon-caret-right"></i>
					</div>
				</el-aside>
				<el-aside style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
					<tasklog :taskInfo="taskInfo" ref="tasklog"></tasklog>
				</el-aside>
			</el-container>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/certificate/planCertificatePhotos.js";
	import { getUserInfo } from "@/api/user";
	import tasklog from "../../common/tasklog.vue"
	import taskhandle from '../../common/taskhandle'
	import attachlist from "../../common/attachlist"
	import projectinfo from "../../common/projectinfo.vue"
	import { formatMonth, formatDate, lo } from "@/utils/format.js";

	export default {
		props:['detailRow'],
		data() {
			return {
				dialogTitle: '全生命周期智慧建设管理平台',
				dialogFormVisible: false,

				baseInfo: {
					buildSection: 1,
					projectName:'池州市平天湖东部区域棚户区改造建设工程EPC总承包',
					buildSectionName: '235国道项目部',
					contractCode: 'ORG_00004',
					startupUser: '赵赞文',
					startupDate: formatMonth(new Date()),
				},
				formData: { //表单参数
					attachment: [],
					contractCode: '',
					information: [],
					contractUser: '',
					deletedFlag: 1,
					draftFlag: 1,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
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
			attachlist,
			projectinfo
		},
		computed: {
      toFixedAmount(detail) {
        return detail.formData.amount.toFixed(2);
      }
    },
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
				// if(this.taskInfo['processDefinitionId']){
				// 	this.$router.go(-1);
				// }
			},
			changeVisible(value){
				this.dialogFormVisible=value;
			},
			getDetail(id){
				api.getPlanCertificatePhotosDetail(id).then((res) => {
				  console.log(res);
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
						taskId: data['taskId'],
				  flowKey:'planCertificatePhotos'
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
	@import "src/assets/css/dialog";
</style>
