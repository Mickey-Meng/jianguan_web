<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" :visible.sync="dialogFormVisible" :fullscreen="true">
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
											<div class="block-item-label">施工标段</div>
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
											<div class="block-item-label">监理标段</div>
											<div class="block-item-value">
												{{baseInfo.supervisionSection}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">报验单号</div>
											<div class="block-item-value">
												{{formData.inspectionCode}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">填报日期</div>
											<div class="block-item-value">
												{{formData.fillDate}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>检测信息</strong>
									</div>
									<div class="block-table">
										<el-table :data="examineTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="pro" align="center" label="材料名称"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="qualityfirstname" width="160px" align="center"
												label="材料来源">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="材料规格">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="工程部位">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="材料数量(吨)">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="取样地点">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="试验日期">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="实验数量">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="合格数量">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="总合格率(%)">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="检测结果">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="报告编号">
											</el-table-column>
										</el-table>
									</div>
								</div>
								<div class="form-title">
									<div class="title-big-bar"></div><strong>附件上传</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>试验检测报告</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<div class="block-table">
										<el-table :data="annexTableData" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="pro" align="center" label="附件" show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="qualityfirstname" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="上传人">
											</el-table-column>
										</el-table>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>出厂信息</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<div class="block-table">
										<el-table :data="annexTableData" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="pro" align="center" label="附件" show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="qualityfirstname" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="上传人">
											</el-table-column>
										</el-table>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>其他附件</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<div class="block-table">
										<el-table :data="annexTableData" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="pro" align="center" label="附件" show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="qualityfirstname" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="上传人">
											</el-table-column>
										</el-table>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">备注</div>
											<div class="block-item-value">
												{{formData.remark}}
											</div>
										</div>
									</div>
								</div>

								<div class="form-title">
									<div class="title-big-bar"></div><strong>审核人员</strong>
								</div>
								<div class="form-block">
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">岗位</div>
											<div class="block-item-value">
												施工负责人
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">审核人</div>
											<div class="block-item-value">
												{{formData.detectionUser}}
											</div>
										</div>
									</div>
									<!-- <div class="block-line">
									<div class="block-item">
										<div class="block-item-label"></div>
										<div class="block-item-value">
											<el-select v-model="value" placeholder="请选择">
												<el-option v-for="item in options" :key="item.value"
													:label="item.label" :value="item.value">
												</el-option>
											</el-select>
										</div>
									</div>
								</div> -->
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
				<el-aside
					style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
					<tasklog></tasklog>
				</el-aside>
			</el-container>
		</el-dialog>
		
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions
	} from "@/utils/format.js";
	import tasklog from "../../../common/tasklog.vue"

	export default {
		props:['detailRow'],
		data() {
			return {
				dialogFormVisible: false,
				dialogTitle: '项目全生命周期数字管理平台',
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],

				baseInfo: {
					buildSection: 1,
					buildSectionName: '235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
					supervisionSection: '监理办'
				},
				formData: { //表单参数
					buildSection: 1,
					deletedFlag: 1,
					detectionInfo: [],
					detectionReport: [],
					detectionUser: 1,
					draftFlag: 1,
					fillDate: new Date(),
					id: 1,
					inspectionCode: '',
					projectId: 1,
					remark: '',
					createTime: null,
					createUserId: null,
					updateTime: null,
					updateUserId: null
				},
				
				examineTable: [], //检测信息
				reportTable: [], //试验检测报告
				factoryTable: [], //出厂信息
				attachTable: [], //其他附件
			};
		},
		created() {},
		components: {
			tasklog
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
			changeVisible(value){
				this.dialogFormVisible=value;
			},
			getDetail(id){
				api.getQualityDetectionDetail({id:id}).then((res) => {
					let data=res['data']||{};
					this.formData=data;
					this.examineTable=data.detectionInfo||[];
					this.reportTable=data.detectionReport||[];
					this.factoryTable=data.factoryInfo||[];
					this.attachTable=data.otherAttachment||[];
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
