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
											<div class="block-item-label">报审类型<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.type==0?'进场':'退场'}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">劳务分包合同<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.laborContractCode}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">人数<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.num}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.explaination}}
											</div>
										</div>
									</div>
								</div>
								
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>人员清单</strong>
									</div>
									
									<div class="block-table">
										<el-table :data="inOutUserTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="name" align="center" label="人员姓名"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="phone" align="center" label="手机号码"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="card" align="center" label="身份证号"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="household" align="center" label="户籍"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="bodyStatus" align="center" label="健康状况"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column label="接触中高风险疫区情况">
												<el-table-column prop="isRisk" align="center" label="是否到过中高风险地区"
													show-overflow-tooltip>
												</el-table-column>
												<el-table-column prop="riskArea" align="center" label="中高风险地区"
													show-overflow-tooltip>
												</el-table-column>
												<el-table-column prop="startArea" align="center" label="出发地"
													show-overflow-tooltip>
												</el-table-column>
												<el-table-column prop="wayCity" align="center" label="途径城市"
													show-overflow-tooltip>
												</el-table-column>
											</el-table-column>
											<el-table-column prop="isVaccine" align="center" label="是否完成疫苗接种"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="isHealth" align="center" label="健康码(是否为绿码)"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="workType" align="center" label="工种"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="remark" align="center" label="备注"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column label="队伍公司">
												<el-table-column prop="companyName" align="center" label="名称"
													show-overflow-tooltip>
												</el-table-column>
												<el-table-column prop="companyPhone" align="center" label="联系电话"
													show-overflow-tooltip>
												</el-table-column>
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<!-- <el-button type="text" size="mini">预览</el-button> -->
													<!-- <el-button type="text" size="mini"
														@click="deleteInOutUser(row, $index)">删除</el-button> -->
												</template>
											</el-table-column>
										</el-table>
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
	import * as proapi from "@/api/project.js";
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
				dialogTitle: '全生命周期智慧建设管理平台',
				dialogFormVisible: false,

				baseInfo: {
					buildSection: 1,
					projectName: '池州市平天湖东部区域棚户区改造建设工程EPC总承包',
					buildSectionName: '池州市平天湖东部区域棚户区改造建设工程EPC总承包',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
				},
				formData: { //表单参数
					enterExitUsers: [],
					deletedFlag: 1,
					explaination: '',
					deletedFlag: 1,
					draftFlag: 1,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					laborContractCode: null,
					num: null,
					type: 0
				},
				inOutUserTable: [], //附件
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
			getProjectInfoById() {
				proapi.getProjectInfoById({
					projectid: this.$store.getters.project['id']
				}).then((res) => {
					let data = res['data'] || {};
					this.baseInfo['buildSectionName'] = data['project'] ? data['project']['name'] : '';
					let list = data['companys'] || [];
					let info = createProjectInfo(list);

					info = data['item'] || {}
					
					this.baseInfo['buildCompany'] = info['constructdpt']
					this.baseInfo['supervisionUnit'] = info['supervisordpt']
				});
			},
			getDetail(id){
				api.getEnterExitDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.inOutUserTable = data.enterExitUsers || [];
				});
				api.getFlowAndTaskInfo({businessKey: id}).then((res) => {
					console.log(res.data);
					let data=res['data'];
					this.taskInfo={
						processDefinitionId: data['processDefinitionId'],
						processInstanceId: data['processInstanceId'],
						taskId: data['taskId'],
						flowKey: 'jintuichangguanli'
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
