<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" @close="closeDialog" :visible.sync="dialogFormVisible" :fullscreen="true">
			<template slot="title">{{dialogTitle}}
				<div class="logo-icon"></div>
			</template>
			<el-container>
				<el-main style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
					<div class="form-bg">
						<el-row>
							<el-col :span="16">
			  					<div class="form-content">
									<el-form :model="formData" ref="ruleForm" label-width="80px">
										<div class="form-title">
											<div class="title-big-bar"></div>
											<strong>质量评定</strong>
										</div>
						
										<div class="form-block">
											<div class="form-block-title">
											<div class="title-bar"></div><strong>基本信息</strong>
											</div>
											<div class="block-line">
						
											<div class="block-item">
												<div class="block-item-label">具体部位</div>
												<div class="block-item-value">
												<el-form-item prop="conponenttypename">
													<el-input v-model="produceInfo.componentName" disabled></el-input>
												</el-form-item>
												</div>
											</div>
						
											<div class="block-item">
												<div class="block-item-label">构建编码</div>
												<div class="block-item-value">
												<el-form-item prop="componentcode">
													<el-input v-model="produceInfo.componentCode" disabled></el-input>
												</el-form-item>
												</div>
											</div>
											</div>
						
											<div class="block-line">
											<div class="block-item">
												<div class="block-item-label">工序名称</div>
												<div class="block-item-value">
												<el-form-item prop="name">
													<el-input v-model="produceInfo.name" disabled></el-input>
												</el-form-item>
												</div>
											</div>
						
											<div class="block-item">
												<div class="block-item-label">完成时间</div>
												<div class="block-item-value">
												<el-form-item prop="finish">
													<el-date-picker value-format="yyyy-MM-dd" v-model="produceInfo.finish" type="date" disabled></el-date-picker>
												</el-form-item>
												</div>
											</div>
						
											</div>
						
											<div class="block-line">
											<div class="block-item">
												<div class="block-item-label">备注</div>
												<div class="block-item-value">
												<el-form-item prop="pjctype">
													<el-input v-model="editRow.conponenttype" disabled></el-input>
												</el-form-item>
												</div>
											</div>
											</div>
										</div> 

										<div class="form-block">
											<div class="form-block-title">
											<div class="title-bar"></div><strong>应填表格</strong>
											</div>
											<div class="block-table">
												<el-table :data="templateListData" style="width: 100%" border class="have_scrolling">
													<el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
													<el-table-column prop="documentName" width="500" align="center" label="表格名称"></el-table-column>
													<el-table-column label="状态" width="150" align="center">
														<template slot-scope="{ row }">
															{{ row.documentStatus === 1 ? "已填写" :  "待填写" }}
														</template>
													</el-table-column>
													<el-table-column fixed="right" width="200" align="center" label="操作">
														<template slot-scope="{ row, $index }">
														<!-- <el-button type="text" size="mini" @click="preview(row)">预览</el-button> -->
														<el-button type="text" size="mini" @click="handleDownload(row)">下载</el-button>
														</template>
													</el-table-column>
												</el-table>
											</div>
										</div> 
									</el-form>
			  					</div>
							</el-col>
							<el-col :span="8">
								<auditRecord :taskInfo="taskInfo" ref="tasklog"></auditRecord>
							</el-col>
						</el-row>
					</div>
		  		</el-main>
			</el-container>
		</el-dialog>
	</div>
</template>

<script>
	import { listProduceDocument, getProduceDocument } from "@/api/produceDocument.js";
	import * as api from "@/api/onlineForms";
	import { getUserInfo } from "@/api/user";
	import tasklog from "../../common/tasklog.vue"
	import taskhandle from '../../common/taskhandle'
	import attachlist from "../../common/attachlist"
	import projectinfo from "../../common/projectinfo.vue"
	import { formatMonth, formatDate, lo } from "@/utils/format.js";
	import { download } from "@/utils/download";
	import auditRecord from "../auditRecord.vue"
	export default {
		props:['editRow'],
		data() {
			return {
				dialogTitle: '项目全生命周期数字管理平台',
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
				produceInfo: {},
				templateListData: [],
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
			projectinfo,
			auditRecord
		},
		computed: {
			toFixedAmount(detail) {
				return detail.formData.amount.toFixed(2);
			}
    	},
		watch:{
			
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
			changeVisible(produceObj,value){
				this.dialogFormVisible = value;
				this.produceInfo = produceObj || {};
				this.attachTable = [];
				// 根据构建ID和工序ID查询待填写文档
				listProduceDocument({documentType : 2, componentId : this.editRow.conponentid, produceId : produceObj.produceid}).then((res) => {
					this.templateListData = res.rows;
				});
				// 根据附件记录ID查询附件信息
				api.getRecordById(produceObj.recordid).then((res) => {
					this.attachTable = JSON.parse(res.data.recode.remark) || [];
				});
				api.getFlowAndTaskInfo({businessKey: produceObj.produceAndRecodeId + "_" + produceObj.recordid + "_produceOnlineCheck"}).then((res) => {
					console.log(res.data);
					let data=res['data'];
					this.taskInfo={
		 				processDefinitionId: data['processDefinitionId'],
						processInstanceId: data['processInstanceId'],
						taskId: data['taskId'],
				  		flowKey:'produceOnlineCheck'
					}
					this.updateTaskLog();
				});
			},
			updateTaskLog(){
				setTimeout(()=>{
					this.$refs['tasklog'].initData();
				},100)
			},
			/**
			 * 附件下载
			 */
			handleDownload(file) {
				download(file.documentUrl, file.documentName, false);
			}
		}
	};
</script>
<style scoped lang="scss">
	@import "src/assets/css/dialog";
	.full-dialog{
		.form-bg{
			width: 1510px!important;
		}
	}
</style>