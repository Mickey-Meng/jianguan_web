<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" :visible.sync="dialogFormVisible" fullscreen="true">
			<template slot="title">
				{{dialogTitle}}
				<div class="logo-icon"></div>
			</template>
			<el-container>
				<el-main
					style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
					<div class="form-bg">
						<div class="form-content">
							<el-form  :model="formData" ref="ruleForm" :rules="rules" label-width="80px">
								<div class="form-title">
									<div class="title-big-bar"></div>
									<strong>质量检测</strong>
									<div class="form-btns">
										<el-button size="medium">暂存</el-button>
										<el-button size="medium">保存草稿</el-button>
										<el-button size="medium">选择草稿</el-button>
										<el-button size="medium" type="primary">复制填充</el-button>
									</div>
								</div>

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
											<div class="block-item-label">报验单号<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input v-model="formData.inspectionCode"></el-input>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">填报日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-date-picker format="yyyy-MM-dd" v-model="formData.fillDate" type="date"
													placeholder="请选择">
												</el-date-picker>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>检测信息</strong>
									</div>
									<div class="block-line">
										<el-button size="small" @click="addExamine" type="primary">新增</el-button>
									</div>
									<div class="block-table">
										<el-table :data="examineTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="name" align="center" label="材料名称"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="address" width="160px" align="center"
												label="材料来源">
											</el-table-column>
											<el-table-column prop="specification" width="120px" align="center"
												label="材料规格">
											</el-table-column>
											<el-table-column prop="projectPart" width="120px" align="center"
												label="工程部位">
											</el-table-column>
											<el-table-column prop="num" width="120px" align="center"
												label="材料数量(吨)">
											</el-table-column>
											<el-table-column prop="takeAddress" width="120px" align="center"
												label="取样地点">
											</el-table-column>
											<el-table-column prop="testDate" width="120px" align="center"
												label="试验日期">
											</el-table-column>
											<el-table-column prop="testNum" width="120px" align="center"
												label="实验数量">
											</el-table-column>
											<el-table-column prop="qualifiedNum" width="120px" align="center"
												label="合格数量">
											</el-table-column>
											<el-table-column prop="qualifiedRate" width="120px" align="center"
												label="总合格率(%)">
											</el-table-column>
											<el-table-column prop="detectionResult" width="120px" align="center"
												label="检测结果">
											</el-table-column>
											<el-table-column prop="reportCode" width="120px" align="center"
												label="报告编号">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="text" size="mini">预览</el-button>
													<el-button type="text" size="mini">删除</el-button>
												</template>
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
									<div class="block-line">
										<upload @afterUp="afterUpReport($event)"></upload>
									</div>
									<div class="block-table">
										<el-table :data="reportTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="fileName" align="center" label="附件"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="createTime" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="creatorName" width="120px" align="center"
												label="上传人">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="text" size="mini">下载</el-button>
													<el-button type="text" size="mini">预览</el-button>
												</template>
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
									<div class="block-line">
										<upload @afterUp="afterUpFactory($event)"></upload>
									</div>
									<div class="block-table">
										<el-table :data="factoryTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="fileName" align="center" label="附件"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="createTime" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="creatorName" width="120px" align="center"
												label="上传人">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="text" size="mini">下载</el-button>
													<el-button type="text" size="mini">预览</el-button>
												</template>
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
									<div class="block-line">
										<upload @afterUp="afterUpAttach($event)"></upload>
									</div>
									<div class="block-table">
										<el-table :data="attachTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="fileName" align="center" label="附件"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="createTime" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="creatorName" width="120px" align="center"
												label="上传人">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="text" size="mini">下载</el-button>
													<el-button type="text" size="mini">预览</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">备注</div>
											<div class="block-item-value">
												<el-input v-model="formData.remark" type="textarea" :rows="4"
													placeholder="请输入"></el-input>
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
											<div class="block-item-label">审核人<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-select v-model="formData.detectionUser" placeholder="请选择">
													<el-option v-for="item in userOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
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
								<div class="form-block">
									<el-button class="submit-btn" size="small" type="primary" @click="addOrModify">提交
									</el-button>
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
					<tasklog></tasklog>
				</el-aside>
			</el-container>
		</el-dialog>
		<el-dialog class="defined-dialog" title="新增" :visible.sync="examineVisible">
			<el-form ref="newform" label-width="80px" rules="newrules" :model="examineInfo">
				<div class="form-block">
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">材料名称<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-select v-model="examineInfo.name" placeholder="请选择">
									<el-option v-for="item in materialOptions" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">材料来源</div>
							<div class="block-item-value">
								<el-input  v-model="examineInfo.address"></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">材料规格</div>
							<div class="block-item-value">
								<el-input v-model="examineInfo.specification"></el-input>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">工程部位</div>
							<div class="block-item-value">
								<el-input v-model="examineInfo.projectPart"></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">材料数量(吨)</div>
							<div class="block-item-value">
								<el-input v-model="examineInfo.num"></el-input>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">取样地点</div>
							<div class="block-item-value">
								<el-input v-model="examineInfo.takeAddress"></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">试验日期</div>
							<div class="block-item-value">
								<el-date-picker v-model="examineInfo.testDate" type="date" placeholder="请选择">
								</el-date-picker>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">试验数量<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-input v-model="examineInfo.testNum"></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">合格数量<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-input v-model="examineInfo.qualifiedNum"></el-input>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">总合格率(%)<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-input v-model="examineInfo.qualifiedRate"></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">检测结果</div>
							<div class="block-item-value">
								<el-select v-model="examineInfo.detectionResult" placeholder="请选择">
									<el-option v-for="item in examineResultOptions1" :key="item.value"
										:label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">报告编号</div>
							<div class="block-item-value">
								<el-input v-model="examineInfo.reportCode"></el-input>
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<el-button @click="addExamineTable" class="submit-btn" size="small" type="primary">提交</el-button>
				</div>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions,
		formatDate,
		formatDateTime
	} from "@/utils/format.js";
	
	import upload from "../../../common/upload.vue"
	import tasklog from "../../../common/tasklog.vue"

	export default {
		props:['currentRow'],
		data() {
			return {
				dialogFormVisible: false,
				examineResultOptions1: [{
					label: '合格',
					value: 0
				}, {
					label: '不合格',
					value: 1
				}],
				userOptions: [{
					label: '陈武林',
					value: 1
				}],
				dialogTitle: '智慧建设通用版-【绍兴市】235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				options: [],
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
					factoryInfo:[],
					otherAttachment:[],
					detectionUser: 1,
					draftFlag: 1,
					fillDate: formatDate(new Date()),
					id: 222,
					inspectionCode: '',
					projectId: 1,
					remark: '',
					// createTime: null,
					// createUserId: null,
					// updateTime: null,
					// updateUserId: null
				},
				rules: {
					inspectionCode: [{
						required: true,
						message: '请填写报验单号',
						trigger: 'blur'
					}],
					fillDate: [{
						required: true,
						message: '请选择填报日期',
						trigger: 'blur'
					}],
					detectionUser: [{
						required: true,
						message: '请选择审核人员',
						trigger: 'blur'
					}]
				},
				newrules:{
					name: [{
						required: true,
						message: '请填写材料名称',
						trigger: 'blur'
					}],
					testNum: [{
						required: true,
						message: '请填写实验数量',
						trigger: 'blur'
					}],
					qualifiedNum: [{
						required: true,
						message: '请填写合格数量',
						trigger: 'blur'
					}],
					qualifiedRate: [{
						required: true,
						message: '请填写总合格率',
						trigger: 'blur'
					}]
				},
				examineVisible: false, //检测信息弹窗是否显示
				examineInfo: { //检测信息弹窗信息
					address: null,
					detectionResult: 1,
					name: '',
					num: null,
					projectPart: '',
					qualifiedNum: '',
					qualifiedRate: '',
					reportCode: '',
					specification: '',
					takeAddress: '',
					testDate: '',
					testNum: ''
				},
				examineTable: [], //检测信息
				reportTable: [], //试验检测报告
				factoryTable: [], //出厂信息
				attachTable: [], //其他附件
				materialOptions: []
			};
		},
		created() {},
		components: {
			upload,
			tasklog
		},
		computed: {},
		watch:{
			currentRow(obj){
				if(obj['id']){
					this.getDetail(obj['id']);
				}else{
					this.formData={
						buildSection: 1,
						deletedFlag: 1,
						detectionInfo: [],
						detectionReport: [],
						factoryInfo:[],
						otherAttachment:[],
						detectionUser: 1,
						draftFlag: 1,
						fillDate: formatDate(new Date()),
						id: 222,
						inspectionCode: '',
						projectId: 1,
						remark: '',
					}
				}
			}
		},
		mounted() {
			this.getMaterialEnums();
		},
		methods: {
			changeVisible(value){
				this.dialogFormVisible=value;
			},
			getMaterialEnums() {
				api.getMaterialEnums().then((res) => {
					let options = res.data || [];
					this.materialOptions = convertOptions(options);
				});
			},
			addExamine() {
				this.examineVisible = true;
			},
			addExamineTable() {
				this.examineTable.push(this.examineInfo);
				this.examineVisible=false;
			},
			getDetail(id){
				api.getQualityDetectionDetail({id:id}).then((res) => {
					let data=res['data']||{};
					this.formData=data;
				});
			},
			addOrModify(){
				this.$refs['ruleForm'].validate((valid) => {
					this.formData.detectionInfo=this.examineTable;
					this.formData.detectionReport=this.reportTable;
					this.formData.factoryInfo=this.factoryTable;
					this.formData.otherAttachment=this.attachTable;
					api.addOrUpdateQualityDetection(this.formData).then((res) => {
						if(res.data){
							this.$message({
								type: 'success',
								message: '提交成功!'
							});
							this.dialogFormVisible=false;
							this.$emit("query");
						}
					});
				})
			},
			afterUpReport(data){
				this.reportTable.push({
					createTime:formatDateTime(data['uploadTime']),
					fileName:data['fileName'],
					fileUrl:data['fileId'],
					creatorName:'test'
				})
			},
			afterUpFactory(data){
				this.factoryTable.push({
					createTime:formatDateTime(data['uploadTime']),
					fileName:data['fileName'],
					fileUrl:data['fileId'],
					creatorName:'test'
				})
			},
			afterUpAttach(data){
				this.attachTable.push({
					createTime:formatDateTime(data['uploadTime']),
					fileName:data['fileName'],
					fileUrl:data['fileId'],
					creatorName:'test'
				})
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
