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
											<div class="block-item-label">账单编号<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.billCode}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">付款单位<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.payUnit}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">收款单位<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.gatherUnit}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">支付金额<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.payAmount}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">支付日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.payDate}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件上传</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
								
									<attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
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
	import tasklog from "../../common/tasklog.vue"
	import taskhandle from '../../common/taskhandle'
	import attachlist from "../../common/attachlist"
	import projectinfo from "../../common/projectinfo.vue"
	
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
					billCode: '',
					explain: '',
					gatherUnit: '',
					payAmount: null,
					deletedFlag: 1,
					draftFlag: 1,
					payUnit: '',
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					payDate: formatDate(new Date())
				},
				attachTable: [], //附件
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
				api.getComeGoMoneyDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
				});
				api.getFlowAndTaskInfo({businessKey: id}).then((res) => {
					console.log(res.data);
					let data=res['data'];
					this.taskInfo={
						processDefinitionId: data['processDefinitionId'],
						processInstanceId: data['processInstanceId'],
						taskId: data['taskId'],
						flowKey: 'wanglaikuanguanli'
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
