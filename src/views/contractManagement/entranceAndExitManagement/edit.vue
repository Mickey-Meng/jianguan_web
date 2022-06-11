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
									<strong>进退场管理</strong>
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
											<div class="block-item-label">施工标段<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="buildSection">
													<el-select @change="changeChild" v-model="formData.buildSection"
														placeholder="请选择">
														<el-option v-for="item in childOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
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
											<div class="block-item-label">报审类型<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="type">
													<el-select v-model="formData.type" placeholder="请选择">
														<el-option v-for="item in typeOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">劳务分包合同<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="laborContractId">
													<el-select filterable v-model="formData.laborContractId"
														placeholder="请选择">
														<el-option v-for="item in contractOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">人数<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="num">
													<el-input v-model.number="formData.num"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-form-item prop="explaination">
													<el-input v-model="formData.explaination"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>人员清单</strong>
									</div>
									<div class="block-line">
										<el-button size="small" @click="addInOutUser" type="primary">新增</el-button>
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
													<el-button type="text" size="mini">预览</el-button>
													<el-button type="text" size="mini"
														@click="deleteInOutUser(row, $index)">删除</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</div>
								
								<approveuser :auditUser="auditUser"  :flowKey="flowKey">
								</approveuser>
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
		<el-dialog class="defined-dialog" title="新增" :visible.sync="inoutUserVisible">
			<el-form ref="newform" label-width="80px" :rules="newrules" :model="inoutUserInfo">
				<div class="form-block">
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">人员姓名<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="name">
									<el-input v-model="inoutUserInfo.name">
									</el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">手机号码<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="phone">
									<el-input v-model="inoutUserInfo.phone">
									</el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">身份证号<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="card">
									<el-input v-model="inoutUserInfo.card"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">户籍<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="household">
									<el-input v-model="inoutUserInfo.household"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">健康状况<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="bodyStatus">
									<el-input v-model="inoutUserInfo.bodyStatus"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="form-block-title">
						<div class="title-bar"></div><strong>接触中高风险疫区情况</strong>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">是否到过中高风险地区<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="isRisk">
									<el-select v-model="inoutUserInfo.isRisk" placeholder="请选择">
										<el-option v-for="item in boolOptions" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">中高风险地区</div>
							<div class="block-item-value">
								<el-form-item prop="riskArea">
									<el-input v-model="inoutUserInfo.riskArea"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">出发地<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="startArea">
									<el-input v-model="inoutUserInfo.startArea"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">途径城市</div>
							<div class="block-item-value">
								<el-form-item prop="wayCity">
									<el-input v-model="inoutUserInfo.wayCity"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">是否完成疫苗接种<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="isVaccine">
									<el-select v-model="inoutUserInfo.isVaccine" placeholder="请选择">
										<el-option v-for="item in boolOptions" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">健康码（是否为绿码）<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="isHealth">
									<el-select v-model="inoutUserInfo.isHealth" placeholder="请选择">
										<el-option v-for="item in boolOptions" :key="item.value" :label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">工种</div>
							<div class="block-item-value">
								<el-form-item prop="workType">
									<el-input v-model="inoutUserInfo.workType"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">备注</div>
							<div class="block-item-value">
								<el-form-item prop="remark">
									<el-input v-model="inoutUserInfo.remark"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="form-block-title">
						<div class="title-bar"></div><strong>队伍公司</strong>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">名称</div>
							<div class="block-item-value">
								<el-form-item prop="companyName">
									<el-input v-model="inoutUserInfo.companyName"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">联系电话</div>
							<div class="block-item-value">
								<el-form-item prop="companyPhone">
									<el-input v-model="inoutUserInfo.companyPhone"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<el-button @click="addInOutUserTable" class="submit-btn" size="small" type="primary">提交</el-button>
				</div>
			</el-form>
		</el-dialog>
		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<entranceAndExitManagement @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</entranceAndExitManagement>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/contract.js";
	import { getUserInfo } from "@/api/user";
	import * as proapi from "@/api/project.js";
	import {
		formatMonth,
		formatDate,
		formatDateTime,
		convertOptions,
		diffCompare
	} from "@/utils/format.js";
	import upload from "../../common/upload.vue"
	import drafthandle from "../../common/drafthandle.vue"
import approveuser from "../../common/approveuser.vue"
	export default {
		props: ['editRow'],
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogTitle: '项目全生命周期数字管理平台',
				dialogFormVisible: false,
				childOptions: [],
				typeOptions: [{
					label: '进场',
					value: 0
				}, {
					label: '退场',
					value: 1
				}],
				contractOptions: [{
					label: '劳务分包合同',
					value: 1
				}],
				boolOptions: [{
					label: '是',
					value: '是'
				}, {
					label: '否',
					value: '否'
				}],
				partOptions: [],
				rules: {
					buildSection: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}],
					type: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}],
					laborContractId: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}],
					num: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}, {
						type: 'number',
						message: '必须为数字'
					}]
				},
				newrules: {
					name: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}],
					phone: [{
						required: false,
						message: '必选项',
						trigger: 'blur'
					}, {
						validator: (rule, value, callback) => {
							var reg =/^1[3-9]\d{9}$/
							let valid = reg.test(value)
							if (valid) {
								callback()
							} else {
								callback(new Error('正确的手机号'))
							}
						},
						trigger: 'blur',
					}],
					card: [{
						required: false,
						message: '必选项',
						trigger: 'blur'
					},{
						validator: (rule, value, callback) => {
							var reg =/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
							let valid = reg.test(value)
							if (valid) {
								callback()
							} else {
								callback(new Error('正确的身份证号码'))
							}
						},
						trigger: 'blur',
					}],
					household: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}],
					bodyStatus: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}],
					isRisk: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}],
					startArea: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}],
					isVaccine: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}],
					isHealth: [{
						required: true,
						message: '必选项',
						trigger: 'blur'
					}]
				},
				baseInfo: {
					buildSection: 1,
					projectName: '235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					buildSectionName: '235国道项目部',
					contractCode: 'ORG_00004',
					startupUser: '赵赞文',
					startupDate: formatMonth(new Date()),
				},
				formData: { //表单参数
					enterExitUsers: [],
					buildSection: '4',
					deletedFlag: 1,
					explaination: '',
					deletedFlag: 1,
					draftFlag: 1,
					projectId: this.$store.getters.project['parentid'],
					laborContractId: null,
					num: null,
					type: 0
				},
				inOutUserTable: [],
				inoutUserVisible: false,
				inoutUserInfo: {
					bodyStatus: '',
					card: '',
					companyName: '',
					companyPhone: '',
					household: null,
					isHealth: '是',
					isRisk: '否',
					isVaccine: '是',
					name: '',
					phone: '',
					remark: '',
					riskArea: '',
					startArea: '',
					type: 0,
					wayCity: '',
					workType: ''
				},
				auditUser: {},
				flowKey:'jintuichangguanli'
			};
		},
		created() {},
		components: {
			upload,
			drafthandle,
			approveuser,
			entranceAndExitManagement:() => import("../entranceAndExitManagement.vue")
		},
		computed: {},
		mounted() {
			// this.getContractBuildEnums();
			this.getChildProject();
		},
		watch: {
			
		},
		methods: {
			
			changeVisible(obj,value) {
				this.dialogFormVisible = value;
				obj = obj || {};
				this.addOrModifyFlag = obj['id'] ? false : true;
				if (obj['id']) {
					this.getDetail(obj['id']);
				} else {
					this.formData = {
						enterExitUsers: [],
						buildSection: '4',
						deletedFlag: 1,
						explaination: '',
						deletedFlag: 1,
						draftFlag: 1,
						projectId: this.$store.getters.project['parentid'],
						laborContractId: null,
						num: null,
						type: 0
					}
					this.examineTable = [];
					this.reportTable = [];
					this.factoryTable = [];
					this.attachTable = [];
				}
			},
			getChildProject() {
				proapi.getChildProject({
					projectid: this.$store.getters.project['parentid']
				}).then((res) => {
					let options = res.data || [];
					this.childOptions = convertOptions(options, 'name', 'id');
				});
			},
			changeChild() {
				proapi.getCompanyByProjectId({
					projectid: this.formData.buildSection
				}).then((res) => {
					this.baseInfo = res;
				});
			},
			getDetail(id) {
				api.getEnterExitDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.inOutUserTable = data.enterExitUsers || [];
				});
			},
			// getContractBuildEnums() {
			// 	api.getContractBuildEnums().then((res) => {
			// 		let options = res.data || [];
			// 		this.partOptions = convertOptions(options, 'desc', 'desc');
			// 	});
			// },
			addOrModify(isdraft) {
				if(isdraft){
					if (diffCompare([this.formData, this.inOutUserTable], [{
								enterExitUsers: [],
								buildSection: '4',
								deletedFlag: 1,
								explaination: '',
								deletedFlag: 1,
								draftFlag: 1,
								projectId: this.$store.getters.project['parentid'],
								laborContractId: null,
								num: null,
								type: 0
							},
							[]
						])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					
					if (this.inOutUserTable.length != this.formData.num) {
						this.$message({
							type: 'error',
							message: '人数不符!'
						});
						return
					}
					this.formData.enterExitUsers = this.inOutUserTable;
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateEnterExit(this.formData).then((res) => {
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
					if (this.inOutUserTable.length != this.formData.num) {
						this.$message({
							type: 'error',
							message: '人数不符!'
						});
						return
					}
					this.$refs['ruleForm'].validate((valid) => {
						if (valid) {
							this.formData.enterExitUsers = this.inOutUserTable;
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag=1;
							api.addOrUpdateEnterExit(this.formData).then((res) => {
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
			addInOutUser() {
				this.inoutUserVisible = true;
			},
			addInOutUserTable() {
				this.$refs['newform'].validate((valid) => {
					if (valid) {
						this.inOutUserTable.push(JSON.parse(JSON.stringify(this.inoutUserInfo)));
						this.inoutUserVisible = false;
					}
				})
			},
			deleteInOutUser(row, index) {
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.inOutUserTable.splice(index, 1);
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
