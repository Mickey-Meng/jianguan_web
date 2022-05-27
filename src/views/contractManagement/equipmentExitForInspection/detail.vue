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
									<strong>退场设备报验单-浙公路（JL）011</strong>
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
											<div class="block-item-label">合同号</div>
											<div class="block-item-value">
												{{baseInfo.contractCode}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">施工单位</div>
											<div class="block-item-value">
												{{baseInfo.buildCompany}}
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
											<div class="block-item-label">工程编号</div>
											<div class="block-item-value">
												{{formData.projectCode}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>退场设备信息</strong>
									</div>
									<div class="block-line">
										
										<div class="block-item">
											<div class="block-item-label">监理办<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.unit}}
											</div>
										</div>
									</div>
		
									<div class="block-line">
										<div class="block-table-title">附件</div>
										<div class="block-table-btns">
											<el-button size="small" type="primary">下载全部</el-button>
										</div>
									</div>
									<div class="block-table">
										<el-table :data="attachTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="fileName" align="center" label="附件" show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="createTime" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="creatorName" width="120px" align="center"
												label="上传人">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="primary" size="mini">下载</el-button>
													<el-button type="danger" size="mini">预览</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</div>
		
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>待审批人</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目质检负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.qualityCheckUser}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目施工负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.projectBuildUser}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">现场监理人员<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.supervisorUser}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">专业监理工程师<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.supervisorEngineerUser}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.projectChargeUser}}
											</div>
										</div>
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
					<tasklog :taskInfo="taskInfo"></tasklog>
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
	import tasklog from "../../common/tasklog.vue"
	import taskhandle from '../../common/taskhandle'
	
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
					attachment:[],
					buildCheckselfResult:'',
					deletedFlag:1,
					draftFlag:1,
					hiddenProject:'',
					id:null,
					projectBuildUser:1,
					projectChargeUser:1,
					projectCode:'',
					projectId:1,
					qualityCheckUser:1,
					subProject:'',
					supervisorEngineerUser:1,
					supervisorUser:1,
					unit:''
				},
				attachTable: [], //附件
				taskInfo:{}
			};
		},
		created() {},
		components: {
			tasklog,
			taskhandle
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
				if(this.taskInfo['processDefinitionId']){
					this.$router.go(-1);
				}
			},
			changeVisible(value){
				this.dialogFormVisible=value;
			},
			getDetail(id){
				api.getHiddenProjectDetail({id:id}).then((res) => {
					let data=res['data']||{};
					this.formData=data;
					this.attachTable=data.attachment||[];
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../assets/css/dialog.scss"
</style>

