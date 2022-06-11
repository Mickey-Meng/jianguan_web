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
									<strong>退场设备报验单-浙公路（JL）011</strong>
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
												<el-input v-model="formData.projectCode"></el-input>
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
												<el-form-item prop="supervisionBan">
													<el-input v-model="formData.supervisionBan"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<el-button size="small" @click="addEquipment" type="primary">新增</el-button>
									</div>
									<div class="block-table">
										<el-table :data="equipmentTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="equipmentName" width="180px" align="center"
												label="设备名称">
											</el-table-column>
											<el-table-column prop="specification" width="120px" align="center"
												label="规格型号">
											</el-table-column>
											<el-table-column prop="num" width="120px" align="center" label="数量">
											</el-table-column>
											<el-table-column prop="exitDate" width="120px" align="center" label="拟退场日期">
											</el-table-column>
											<el-table-column prop="remark" width="120px" align="center" label="备注">
											</el-table-column>
											<el-table-column prop="exitReason" width="120px" align="center" label="退场原因">
											</el-table-column>
											<el-table-column prop="techStatus" width="120px" align="center"
												label="技术状态">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="text" size="mini">预览</el-button>
													<el-button type="text" size="mini"
														@click="deleteEquipment(row, $index)">删除</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</div>
								<!-- <div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件清单</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>

									<attachlist :editAble="true" ref="attachlist" :attachTable="attachTable">
									</attachlist>

								</div> -->
								
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
		<el-dialog class="defined-dialog" title="新增" :visible.sync="equipmentVisible">
			<el-form ref="newform" label-width="80px" :rules="newrules" :model="equipmentInfo">
				<div class="form-block">
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">设备名称<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="equipmentName">
									<el-input v-model="equipmentInfo.equipmentName"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">规格型号</div>
							<div class="block-item-value">
								<el-form-item prop="specification">
									<el-input v-model="equipmentInfo.specification"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						
						<div class="block-item">
							<div class="block-item-label">数量<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="num">
									<el-input v-model.number="equipmentInfo.num"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">拟退场日期<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-form-item prop="exitDate">
									<el-date-picker format="yyyy-MM-dd" v-model="equipmentInfo.exitDate" type="date"
										placeholder="请选择">
									</el-date-picker>
								</el-form-item>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">退场原因</div>
							<div class="block-item-value">
								<el-form-item prop="exitReason">
									<el-input v-model="equipmentInfo.exitReason"></el-input>
								</el-form-item>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">技术状态</div>
							<div class="block-item-value">
								<el-form-item prop="techStatus">
									<el-input v-model.number="equipmentInfo.techStatus"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>

					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">备注</div>
							<div class="block-item-value">
								<el-form-item prop="remark">
									<el-input v-model="equipmentInfo.remark"></el-input>
								</el-form-item>
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<el-button @click="addEquipmentTable" class="submit-btn" size="small" type="primary">提交</el-button>
				</div>
			</el-form>
		</el-dialog>
		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<constructionSubcontract @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</constructionSubcontract>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/contract.js";
	import { getUserInfo } from "@/api/user";
	import * as proapi from "@/api/project.js";
	import {
		formatDate,
		formatDateTime,
		convertOptions,
		createProjectInfo,
		diffCompare
	} from "@/utils/format.js";
	import attachlist from "../../common/attachlist.vue"
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
				rules: {
					supervisionBan: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}]
				},
				newrules:{
					equipmentName: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					exitDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					num:[{
						required: true,
						message: '必须项',
						trigger: 'blur'
					},{
						type: 'number',
						message: '数量必须为数字'
					}]
				},
				baseInfo: {
					buildSection: 1,
					buildSectionName: '',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
				},
				formData: { //表单参数
					attachment: [],
					equipmentInfo:[],
					deletedFlag: 1,
					draftFlag: 1,
					projectCode: '',
					projectId: this.$store.getters.project['parentid'],
					supervisionBan: ''
				},
				attachTable: [], //附件
				equipmentTable: [],
				equipmentVisible: false,
				equipmentInfo: {
					equipmentName: '',
					num: null,
					specification: '',
					exitReason:'',
					techStatus: '',
					remark: '',
					exitDate: formatDate(new Date())
				},
				auditUser: {},
				flowKey:'shebeituichangbaoyan'
			};
		},
		created() {},
		components: {
			attachlist,
			drafthandle,
			approveuser,
		},
		computed: {},
		mounted() {
			this.getProjectInfoById();
		},
		watch: {
		},
		methods: {
			
			changeVisible(obj,value) {
				this.dialogFormVisible = value;
				obj=obj||{};
				if (obj['id']) {
					this.getDetail(obj['id']);
				} else {
					this.formData = {
						attachment: [],
						equipmentInfo:[],
						deletedFlag: 1,
						draftFlag: 1,
						projectCode: '',
						projectId: this.$store.getters.project['parentid'],
						supervisionBan: ''
					}
					this.attachTable=[];
					this.equipmentTable=[];
				}
			},
			getProjectInfoById() {
				proapi.getProjectInfoById({
					projectid: this.$store.getters.project['parentid']
				}).then((res) => {
					let data = res['data'] || {};
					this.baseInfo['buildSectionName'] = data['project'] ? data['project']['name'] : '';
					let list = data['companys'] || [];
					let info = createProjectInfo(list);
					this.baseInfo['buildCompany'] = info['buildCompany'];
					this.baseInfo['supervisionUnit'] = info['supervisionUnit'];
				});
			},
			getDetail(id) {
				api.getEquipmentExitDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
					this.equipmentTable = data.equipmentInfo || [];
				});
			},
			addOrModify(isdraft) {
				if(isdraft){
					if (diffCompare([this.formData, this.attachTable, this.equipmentTable], [{
								attachment: [],
								equipmentInfo:[],
								deletedFlag: 1,
								draftFlag: 1,
								projectCode: '',
								projectId: this.$store.getters.project['parentid'],
								supervisionBan: ''
							},
							[],
							[]
						])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.attachment = this.attachTable;
					this.formData.equipmentInfo = this.equipmentTable;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateEquipmentExit(this.formData).then((res) => {
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
							this.formData.equipmentInfo = this.equipmentTable;
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag=1;
							api.addOrUpdateEquipmentExit(this.formData).then((res) => {
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
			addEquipment() {
				this.equipmentVisible = true;
			},
			addEquipmentTable() {
				this.$refs['newform'].validate((valid) => {
					if (valid) {
						this.equipmentTable.push(this.equipmentInfo);
						this.equipmentVisible = false;
					}
				})
			},
			deleteEquipment(row, index) {
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.equipmentTable.splice(index, 1);
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
