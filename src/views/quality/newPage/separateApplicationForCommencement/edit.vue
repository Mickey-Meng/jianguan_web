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
							<el-form :model="formData" ref="ruleForm" :rules="rules" label-width="80px">
								<div class="form-title">
									<div class="title-big-bar"></div>
									<strong>质量检测</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">施工标段<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="buildSection">
													<el-select
													@change="changeChild"
													    v-model="formData.buildSection" placeholder="请选择">
														<el-option v-for="item in childOptions" :key="item.value" :label="item.label"
															:value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
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
												<el-form-item prop="inspectionCode">
													<el-input v-model="formData.inspectionCode"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">填报日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="fillDate">
													<el-date-picker format="yyyy-MM-dd" v-model="formData.fillDate"
														type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>

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
											<el-table-column prop="addressStr" width="180px" align="center"
												label="材料来源">
											</el-table-column>
											<el-table-column prop="specification" width="120px" align="center"
												label="材料规格">
											</el-table-column>
											<el-table-column prop="projectPart" width="120px" align="center"
												label="工程部位">
											</el-table-column>
											<el-table-column prop="num" width="120px" align="center" label="材料数量(吨)">
											</el-table-column>
											<el-table-column prop="takeAddress" width="120px" align="center"
												label="取样地点">
											</el-table-column>
											<el-table-column prop="testDate" width="120px" align="center" label="试验日期">
											</el-table-column>
											<el-table-column prop="testNum" width="120px" align="center" label="实验数量">
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
													<el-button type="text" size="mini" @click="deleteExamine(row, $index)">删除</el-button>
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
									<attachlist :editAble="true" ref="attachlist" :attachTable="reportTable"></attachlist>
									
									
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>出厂信息</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="factoryTable"></attachlist>
									
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>其他附件</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="attachTable"></attachlist>
									
									
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
									<div class="title-big-bar"></div><strong>审批信息</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>待审批人</strong>
									</div>
									<div class="block-line" v-for="userOptions in flowNodesUsersData">
										<div class="block-item">
											<div class="block-item-label">{{userOptions.entryName}}<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="qualityCheckUser">
													<el-select placeholder="请选择" 
													:disabled="userOptions['isSign']?true:false"
													:multiple="userOptions['isSign']?true:false"
													v-model="auditUser[userOptions.entryUserVariable]" @change="flowUserChange($event, userOptions.entryUserVariable)">
														<el-option v-for="(item, idx) in userOptions.userName" :key="item"
															:label="userOptions.userNameStr[idx]" :value="item">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<el-button class="submit-btn" size="small" type="primary" @click="addOrModify()">提交
									</el-button>
								</div>
							</el-form>
						</div>
					</div>
				</el-main>
				<!-- <el-aside width="8px" class="close-wrapper">
					<div class="close-wrap">
						<i class="el-icon-caret-right"></i>
					</div>
				</el-aside> -->
				<!-- <el-aside
					style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
					<tasklog></tasklog>
				</el-aside> -->
			</el-container>
		</el-dialog>
		<el-dialog class="defined-dialog" title="新增" :visible.sync="examineVisible">
			<el-form ref="newform" label-width="80px" :rules="newrules" :model="examineInfo">
				<div class="form-block">
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">材料名称<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="name">
									<el-select v-model="examineInfo.name" placeholder="请选择">
										<el-option v-for="item in materialOptions" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">材料来源</div>
							<div class="block-item-value">
								<el-input style="max-width: 200px;" readonly v-model="examineInfo.addressStr">
								</el-input>
								<el-button size="medium" @click="changeArea">选择</el-button>
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
							<div class="block-item-label">材料数量(吨)<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="num">
									<el-input v-model.number="examineInfo.num"></el-input>
								</el-form-item>
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
								<el-date-picker format="yyyy-MM-dd" v-model="examineInfo.testDate" type="date"
									placeholder="请选择">
								</el-date-picker>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">试验数量<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="testNum">
									<el-input v-model.number="examineInfo.testNum"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">合格数量<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="qualifiedNum">
									<el-input v-model.number="examineInfo.qualifiedNum"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">总合格率(%)<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="qualifiedRate">
									<el-input v-model.number="examineInfo.qualifiedRate"></el-input>
								</el-form-item>
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
			<el-dialog class="defined-dialog" title="选择材料来源" :visible.sync="areaVisible">
				<el-form label-width="80px">
					<div class="form-block">
						<div class="block-line">
							<div class="block-item">
								<el-select @change="changeProvince" v-model="addressItem.proviceId" placeholder="请选择省份">
									<el-option v-for="item in provinceOptions" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</div>
							<div class="block-item">
								<el-select @change="changeCity" v-model="addressItem.cityId" placeholder="请选择地市">
									<el-option v-for="item in cityOptions" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="block-line">
							<div class="block-item">
								<el-select @change="changeCounty" v-model="addressItem.districtId" placeholder="请选择区县">
									<el-option v-for="item in countyOptions" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</div>
						</div>
					</div>
					<div class="form-block">
						<el-button @click="checkArea" class="submit-btn" size="small" type="primary">确定</el-button>
					</div>
				</el-form>
			</el-dialog>
		</el-dialog>
		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<qualityTest @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</qualityTest>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import { getUserInfo } from "@/api/user";
	import {
		convertOptions,
		formatDate,
		formatDateTime,
		diffCompare
	} from "@/utils/format.js";

	import upload from "../../../common/upload.vue"
	import attachlist from "../../../common/attachlist.vue"
	import drafthandle from "../../../common/drafthandle.vue"

	export default {
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogFormVisible: false,
				childOptions:[],
				examineResultOptions1: [{
					label: '合格',
					value: 0
				}, {
					label: '不合格',
					value: 1
				}],
				dialogTitle: '项目全生命周期数字管理平台',
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				options: [],
				baseInfo: {
					buildSection: 1,
					buildSectionName: '',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
					supervisionSection: ''
				},
				formData: { //表单参数
					buildSection: '',
					deletedFlag: 1,
					detectionInfo: [],
					detectionReport: [],
					factoryInfo: [],
					otherAttachment: [],
					draftFlag: 1,
					fillDate: formatDate(new Date()),
					// id: 222,
					inspectionCode: '',
					projectId: this.$store.getters.project['parentid'],
					remark: '',
					// createTime: null,
					// createUserId: null,
					// updateTime: null,
					// updateUserId: null
				},
				rules: {
					buildSection: [{
						required: true,
						message: '请选择施工标段',
						trigger: 'blur'
					}],
					inspectionCode: [{
						required: true,
						message: '请填写报验单号',
						trigger: 'blur'
					}],
					fillDate: [{
						required: true,
						message: '请选择填报日期',
						trigger: 'blur'
					}]
				},
				newrules: {
					name: [{
						required: true,
						message: '请填写材料名称',
						trigger: 'blur'
					}],
					num: [{
							required: true,
							message: '请填写材料数量',
							trigger: 'blur'
						},{
						type: 'number',
						message: '材料数量必须为数字'
					}],
					testNum: [{
							required: true,
							message: '请填写实验数量',
							trigger: 'blur'
						},
						{
							type: 'number',
							message: '实验数量必须为数字'
						}
					],
					qualifiedNum: [{
							required: true,
							message: '请填写合格数量',
							trigger: 'blur'
						},
						{
							type: 'number',
							message: '合格数量必须为数字'
						}
					],
					qualifiedRate: [{
							required: true,
							message: '请填写总合格率',
							trigger: 'blur'
						},
						{
							type: 'number',
							message: '合格率必须为数字'
						}
					]
				},
				examineVisible: false, //检测信息弹窗是否显示
				areaVisible: false,
				examineInfo: { //检测信息弹窗信息
					address: null,
					addressStr: '',
					detectionResult: 1,
					name: '',
					num: null,
					projectPart: '',
					qualifiedNum: null,
					qualifiedRate: null,
					reportCode: '',
					specification: '',
					takeAddress: '',
					testDate: formatDate(new Date()),
					testNum: null
				},
				examineTable: [], //检测信息
				reportTable: [], //试验检测报告
				factoryTable: [], //出厂信息
				attachTable: [], //其他附件
				materialOptions: [],
				provinceOptions: [],
				cityOptions: [],
				countyOptions: [],
				addressItem: {
					city: "",
					cityId: undefined,
					district: "",
					districtId: undefined,
					provice: "",
					proviceId: undefined
				},
				flowNodesUsersData: [],
				auditUser: {}
			};
		},
		created() {},
		components: {
			upload,
			attachlist,
			drafthandle,
			qualityTest: () => import("../qualityTest.vue")
		},
		computed: {
			
		},
		watch: {
			
		},
		mounted() {
			this.getChildProject();
			this.getMaterialEnums();
			this.getProvince();
			this.getFlowAuditEntry();
		},
		methods: {
			flowUserChange(data, data1){
				this.auditUser[data1] = data;
				this.$forceUpdate();
			},
			getFlowAuditEntry() {
				api.getFlowAuditEntry({
					flowKey: 'zhiliangjiance',
					projectId: this.$store.getters.project['parentid'] || 2
				}).then((res) => {
					console.log(11111111111111111111, res);
					for (let i = 0; i < res.data.length; i++) {
						const item = res.data[i];
						if(res.data[i]['isSign']){
													this.auditUser[item.entryUserVariable] = item.userName;
												}else{
													this.auditUser[item.entryUserVariable] = item.userName[0];
												}
						if (!item.userNameStr) item.userNameStr = [];
						for (let j = 0; j < item.userId.length; j++) {
							const id = item.userId[j];
							getUserInfo(id).then(res => {
								item.userNameStr[j] = res.data.userInfo.NAME;
								this.$forceUpdate();
							})
						}
					}
					console.log(this.auditUser);
					this.flowNodesUsersData = res.data;
				});
			},
			changeVisible(obj,value) {
				this.dialogFormVisible = value;
				obj = obj || {};
				this.addOrModifyFlag = obj['id'] ? false : true;
				if (obj['id']) {
					this.getDetail(obj['id']);
				} else {
					this.formData = {
						buildSection: '',
						deletedFlag: 1,
						detectionInfo: [],
						detectionReport: [],
						factoryInfo: [],
						otherAttachment: [],
						draftFlag: 1,
						fillDate: formatDate(new Date()),
						// id: 222,
						inspectionCode: '',
						projectId: this.$store.getters.project['parentid'],
						remark: '',
					}
					this.examineTable=[];
					this.reportTable=[];
					this.factoryTable=[];
					this.attachTable=[];
				}
			},
			getChildProject(){
				api.getChildProject({
					projectid:this.$store.getters.project['parentid']
				}).then((res) => {
					let options = res.data || [];
					this.childOptions = convertOptions(options, 'name', 'id');
				});
			},
			changeChild(){
				api.getCompanyByProjectId({
					projectid:this.formData.buildSection
				}).then((res) => {
					this.baseInfo=res;
				});
			},
			getMaterialEnums() {
				api.getMaterialEnums().then((res) => {
					let options = res.data || [];
					this.materialOptions = convertOptions(options, 'desc', 'desc');
				});
			},
			getProvince() {
				api.getProvince().then((res) => {
					let options = res.data || [];
					this.provinceOptions = convertOptions(options, 'name', 'id');
				});
			},
			changeProvince(value) {
				this.addressItem.proviceId = value;
				this.addressItem.provice = this.getLabelByValue(this.provinceOptions, value);
				this.countyOptions = [];
				this.cityOptions = [];
				this.addressItem.cityId = undefined;
				this.addressItem.districtId = undefined;
				this.addressItem.city = '';
				this.addressItem.district = '';
				api.getCity({
					provinceId: value
				}).then((res) => {
					let options = res.data || [];
					this.cityOptions = convertOptions(options, 'name', 'id');
				});
			},
			changeCity(value) {
				this.addressItem.cityId = value;
				this.addressItem.city = this.getLabelByValue(this.cityOptions, value);
				this.countyOptions = [];
				this.addressItem.districtId = undefined;
				this.addressItem.district = '';
				api.getDistrict({
					cityId: value
				}).then((res) => {
					let options = res.data || [];
					this.countyOptions = convertOptions(options, 'name', 'id');
				});
			},
			changeCounty(value) {
				this.addressItem.districtId = value;
				this.addressItem.district = this.getLabelByValue(this.countyOptions, value);
			},
			getLabelByValue(list, value) {
				let label = '';
				list.forEach(item => {
					if (item['value'] == value) {
						label = item['label'];
					}
				})
				return label;
			},
			addExamine() {
				this.examineVisible = true;
			},
			addExamineTable() {
				this.$refs['newform'].validate((valid) => {
					if (valid) {
						this.examineTable.push(this.examineInfo);
						this.examineVisible = false;
					}
				})

			},
			getDetail(id) {
				api.getQualityDetectionDetail({
					id: id
				}).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.examineTable=data.detectionInfo||[];
					this.reportTable=data.detectionReport||[];
					this.factoryTable=data.factoryInfo||[];
					this.attachTable=data.otherAttachment||[];
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData, this.examineTable,this.reportTable,this.factoryTable,this.attachTable], [{
								buildSection: '',
								deletedFlag: 1,
								detectionInfo: [],
								detectionReport: [],
								factoryInfo: [],
								otherAttachment: [],
								draftFlag: 1,
								fillDate: formatDate(new Date()),
								inspectionCode: '',
								projectId: this.$store.getters.project['parentid'],
								remark: '',
							},
							[],[],[],[]
						],['fillDate'])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.detectionInfo = this.examineTable;
					this.formData.detectionReport = this.reportTable;
					this.formData.factoryInfo = this.factoryTable;
					this.formData.otherAttachment = this.attachTable;
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateQualityDetection(this.formData).then((res) => {
						if (res.data) {
							this.$message({
								type: 'success',
								message: '提交成功!'
							});
							this.dialogFormVisible = false;
							this.$emit("query");
						}
					});
					
				}else{
					this.$refs['ruleForm'].validate((valid) => {
						if (valid) {
							this.formData.detectionInfo = this.examineTable;
							this.formData.detectionReport = this.reportTable;
							this.formData.factoryInfo = this.factoryTable;
							this.formData.otherAttachment = this.attachTable;
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag=1;
							api.addOrUpdateQualityDetection(this.formData).then((res) => {
								if (res.data) {
									this.$message({
										type: 'success',
										message: '提交成功!'
									});
									this.dialogFormVisible = false;
									this.$emit("query");
								}
							});
						}
					
					})
				}
				
			},
			changeArea() {
				this.countyOptions = [];
				this.cityOptions = [];
				this.addressItem.cityId = undefined;
				this.addressItem.districtId = undefined;
				this.addressItem.proviceId = undefined;
				this.addressItem.city = '';
				this.addressItem.district = '';
				this.addressItem.provice = '';
				this.areaVisible = true;
			},
			checkArea() {
				this.examineInfo.address = this.addressItem;
				this.examineInfo.addressStr = this.addressItem.provice + '/' + this.addressItem.city + '/' + this
					.addressItem.district;
				this.areaVisible = false;
			},
			deleteExamine(row, index){
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.examineTable.splice(index,1);
				});
				
			},
			hideDraft() {
				this.draftVisible = false;
			},
			checkDraft() {
				this.draftVisible = true;
			}
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
