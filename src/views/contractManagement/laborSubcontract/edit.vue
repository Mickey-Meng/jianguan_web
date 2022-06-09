<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" :fullscreen="true" :visible.sync="dialogFormVisible">
			<template slot="title">
				{{dialogTitle}}
				<div class="logo-icon"></div>
			</template>
			<el-container>
				<el-main
					style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
					<div class="form-bg">
						<div class="form-content">
							<el-form :model="formData" :rules="rules" ref="ruleForm" label-width="80px">
								<div class="form-title">
									<div class="title-big-bar"></div>
									<strong>劳务分包合同</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>

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
												{{userInfo.NAME}}

											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">发起日期</div>
											<div class="block-item-value">
												<el-form-item prop="startDate">
													<el-date-picker format="yyyy-MM-dd" v-model="formData.startDate" type="date"
														placeholder="请选择">
													</el-date-picker>
												</el-form-item>
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
											<div class="block-item-label">合同编号<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="contractCode">
													<el-input v-model="formData.contractCode"></el-input>
												</el-form-item>
												
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">承包人</div>
											<div class="block-item-value">
												<el-form-item prop="contractUser">
													<el-input v-model="formData.contractUser"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="form-block-title">
										<div class="title-bar"></div><strong>合同附件</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
								
									<attachlist :editAble="true" ref="attachlist" :attachTable="attachTable"></attachlist>
									
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>信息填报</strong>
									</div>
									<div class="block-line">
										<el-button size="small" @click="addContract" type="primary">新增</el-button>
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
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="text" size="mini">预览</el-button>
													<el-button type="text" size="mini"
														@click="deleteExamine(row, $index)">删除</el-button>
												</template>
											</el-table-column>
										</el-table>
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
									<el-button @click="addOrModify()" class="submit-btn" size="small" type="primary">提交
									</el-button>
								</div>
							</el-form>
						</div>
					</div>
				</el-main>
			</el-container>
		</el-dialog>
		<el-dialog class="defined-dialog" title="新增" :visible.sync="contractVisible">
			<el-form ref="newform" label-width="80px" :rules="newrules" :model="contractInfo">
				<div class="form-block">
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">拟分包工程名称<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="buildProjectName">
									<el-input v-model="contractInfo.buildProjectName">
									</el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">拟分包工程部位<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="buildProjectPartName">
									<el-select v-model="contractInfo.buildProjectPartName" placeholder="请选择">
										<el-option v-for="item in partOptions" :key="item.value"
											:label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">承包人名称</div>
							<div class="block-item-value">
								<el-form-item prop="contractUserName">
									<el-input v-model="contractInfo.contractUserName"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">承包负责人</div>
							<div class="block-item-value">
								<el-form-item prop="contractUserName">
									<el-input v-model="contractInfo.contractChargeUserName"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">身份证号</div>
							<div class="block-item-value">
								<el-form-item prop="cardNum">
									<el-input v-model="contractInfo.cardNum"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">拟分包工程合同金额(元)</div>
							<div class="block-item-value">
								<el-form-item prop="contractNum">
									<el-input v-model.number="contractInfo.contractNum"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">拟分包施工工期开始月份</div>
							<div class="block-item-value">
								<el-form-item prop="buildDate">
									<el-date-picker format="yyyy-MM" v-model="contractInfo.buildStartMonth" type="month"
										placeholder="请选择">
									</el-date-picker>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">拟分包施工工期结束月份</div>
							<div class="block-item-value">
								<el-form-item prop="buildDate">
									<el-date-picker format="yyyy-MM" v-model="contractInfo.buildEndMonth" type="month"
										placeholder="请选择">
									</el-date-picker>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">承包人专业分包资质</div>
							<div class="block-item-value">
								<el-form-item prop="contractUserQualification">
									<el-input v-model="contractInfo.contractUserQualification"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">备注</div>
							<div class="block-item-value">
								<el-form-item prop="remark">
									<el-input v-model="contractInfo.remark"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<el-button @click="addContractTable" class="submit-btn" size="small" type="primary">提交</el-button>
				</div>
			</el-form>
		</el-dialog>
		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<laborSubcontract @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</laborSubcontract>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/contract.js";
	import { getUserInfo } from "@/api/user";
	import {
		formatMonth,
		formatDate,
		formatDateTime,
		diffCompare,
		convertOptions
	} from "@/utils/format.js";
	import upload from "../../common/upload.vue"
	import attachlist from "../../common/attachlist.vue"
	import drafthandle from "../../common/drafthandle.vue"

	export default {
		props: ['editRow'],
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogTitle: '项目全生命周期数字管理平台',
				dialogFormVisible: false,
				partOptions:[],
				rules: {
					contractCode: [{
						required: true,
						message: '请填写合同编号',
						trigger: 'blur'
					}]
				},
				newrules:{
					buildProjectName: [{
						required: true,
						message: '请填写拟分包工程名称',
						trigger: 'blur'
					}],
					buildProjectPartName: [{
						required: true,
						message: '请选择拟分包工程部位',
						trigger: 'blur'
					}],
					contractNum:[{
						type: 'number',
						message: '合同金额必须为数字'
					}]
				},
				userInfo: {
					userName: ''
				},
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
				contractVisible: false,
				contractInfo: {
					buildProjectName: '',
					buildProjectPartName: '',
					cardNum: '',
					contractChargeUserName: '',
					contractNum: null,
					contractUserName: '',
					contractUserQualification: '',
					remark: '',
					buildStartMonth: formatMonth(new Date()),
					buildEndMonth: formatMonth(new Date())
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
			laborSubcontract: () => import("../laborSubcontract.vue")
		},
		computed: {},
		mounted() {
			this.getContractBuildEnums();
			this.getUserInfo();
			this.getFlowAuditEntry();
		},
		watch: {
			editRow(obj) {
				obj=obj||{};
				if (obj['id']) {
					this.getDetail(obj['id']);
				} else {
					this.formData = {
						attachment: [],
						buildSection: '4',
						contractCode: '',
						information: [],
						contractUser: '',
						deletedFlag: 1,
						draftFlag: 1,
						projectId: this.$store.getters.project['parentid'],
						startDate:formatDate(new Date())
					}
					this.attachTable = [];
					this.contractTable = [];
				}
			}
		},
		methods: {
			flowUserChange(data, data1){
				this.auditUser[data1] = data;
				this.$forceUpdate();
			},
			getFlowAuditEntry() {
				api.getFlowAuditEntry({
					flowKey: 'laowufenbaohetong',
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
			getUserInfo() {
				getUserInfo(localStorage.getItem('ID')).then(res => {
					this.userInfo = res.data.userInfo;
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
						attachment: [],
						buildSection: '4',
						contractCode: '',
						information: [],
						contractUser: '',
						deletedFlag: 1,
						draftFlag: 1,
						projectId: this.$store.getters.project['parentid'],
						startDate:formatDate(new Date())
					}
					this.examineTable = [];
					this.reportTable = [];
					this.factoryTable = [];
					this.attachTable = [];
				}
			},
			getDetail(id) {
				api.getContractLaborDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
					this.contractTable = data.information || [];
				});
			},
			getContractBuildEnums() {
				api.getContractBuildEnums().then((res) => {
					let options = res.data || [];
					this.partOptions = convertOptions(options, 'desc', 'desc');
				});
			},
			addOrModify(isdraft) {
				if(isdraft){
					if (diffCompare([this.formData, this.attachTable, this.contractTable], [{
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
							[],
							[]
						], ['startDate'])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.attachment = this.attachTable;
					this.formData.contractInfo = this.contractTable;
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateContractBuild(this.formData).then((res) => {
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
							this.formData.attachment = this.attachTable;
							this.formData.information = this.contractTable;
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag=1;
							api.addOrUpdateContractLabor(this.formData).then((res) => {
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
			
			addContract() {
				this.contractVisible = true;
			},
			addContractTable(){
				this.$refs['newform'].validate((valid) => {
					if (valid) {
						this.contractTable.push(this.contractInfo);
						this.contractVisible = false;
					}
				})
			},
			deleteContract(row, index) {
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.contractTable.splice(index, 1);
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
	@import "../../../assets/css/dialog.scss"
</style>
