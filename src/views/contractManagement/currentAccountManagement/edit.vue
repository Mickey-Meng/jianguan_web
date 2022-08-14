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
									<strong>往来款管理</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">账单编号<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="billCode">
													<el-input v-model="formData.billCode"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">付款单位<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="payUnit">
													<el-input v-model="formData.payUnit"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">收款单位<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="gatherUnit">
													<el-input v-model="formData.gatherUnit"></el-input>
												</el-form-item>

											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">支付金额<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="payAmount">
													<el-input v-model="formData.payAmount" @input="formatNum(formData.payAmount, 'payAmount')"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">支付日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="payDate">
													<el-date-picker value-format="yyyy-MM-dd" v-model="formData.payDate"
														type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>
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

									<attachlist :editAble="true" ref="attachlist" :attachTable="attachTable">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.explaination" type="textarea" :rows="4"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>

								<approveuser v-if="approveVisible" :auditUser="auditUser" :copyData="copyData"  :flowKey="flowKey">
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
		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<currentAccountManagement @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</currentAccountManagement>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/contract.js";
	import {
		getUserInfo
	} from "@/api/user";
	import * as proapi from "@/api/project.js";

	import {
		formatMonth,
		formatDate,
		formatDateTime,
		convertOptions,
		diffCompare
	} from "@/utils/format.js";
	import attachlist from "../../common/attachlist.vue"
	import drafthandle from "../../common/drafthandle.vue"
import approveuser from "../../common/approveuser.vue"
import projectinfo from "../../common/projectinfo.vue"

	export default {
		props: ['editRow'],
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogTitle: '项目全生命周期数字管理平台',
				dialogFormVisible: false,
				childOptions: [],
				userOptions: [{
					label: '陈武林',
					value: 1
				}],
				rules: {
					buildSection: [{
						required: true,
						message: '请选择施工标段',
						trigger: 'blur'
					}],
					billCode: [{
						required: true,
						message: '请填写账单编号',
						trigger: 'blur'
					}],
					gatherUnit: [{
						required: true,
						message: '请填写收款单位',
						trigger: 'blur'
					}],
					payDate: [{
						required: true,
						message: '请选择支付日期',
						trigger: 'blur'
					}],
					payUnit: [{
						required: true,
						message: '请填写付款单位',
						trigger: 'blur'
					}],
					payAmount: [{
						required: true,
						message: '请选择拟分包工程部位',
						trigger: 'blur'
					}
					// , {
					// 	type: 'number',
					// 	message: '合同金额必须为数字'
					// },
					]
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
					attachment: [],
					billCode: '',
					explaination: '',
					gatherUnit: '',
					payAmount: null,
					deletedFlag: 1,
					draftFlag: 1,
					payUnit: '',
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					payDate: formatDate(new Date())
				},
				attachTable: [], //附件,
				flowNodesUsersData: [],
				auditUser: {},
				copyData: {},
				approveVisible:true,
				flowKey:'wanglaikuanguanli'
			};
		},
		created() {},
		components: {
			attachlist,
			drafthandle,
			approveuser,
			projectinfo,
			currentAccountManagement: () => import("../currentAccountManagement.vue")
		},
		computed: {},
		mounted() {
			this.getChildProject();
		},
		watch: {

		},
		methods: {
			formatNum(val, key) {
			  let temp = val.toString();
			  temp = temp.replace(/。/g, ".");
			  temp = temp.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
			  temp = temp.replace(/^\./g, ""); //验证第一个字符是数字
			  temp = temp.replace(/\.{2,}/g, ""); //只保留第一个, 清除多余的
			  temp = temp.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
			  temp = temp.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
			  this.formData[key] = temp;
			},
			changeVisible(obj, value) {
				this.dialogFormVisible = value;
				obj = obj || {};
				if (obj['id']) {
					this.getDetail(obj['id']);
					this.approveVisible=false;
				} else {
					this.formData = {
						attachment: [],
						billCode: '',
						explaination: '',
						gatherUnit: '',
						payAmount: null,
						deletedFlag: 1,
						draftFlag: 1,
						payUnit: '',
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid'],
						payDate: formatDate(new Date())
					}
					this.attachTable = [];
					this.copyData={};
					this.auditUser={};
					this.approveVisible=true;
				}
			},
			getDetail(id) {
				api.getComeGoMoneyDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
				});
			},
			getChildProject() {
				proapi.getChildProject({
					projectid: this.$store.getters.project['parentid']
				}).then((res) => {
					let options = res.data || [];
					this.childOptions = convertOptions(options, 'name', 'id');
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData, this.attachTable], [{
								attachment: [],
								billCode: '',
								explaination: '',
								gatherUnit: '',
								payAmount: null,
								deletedFlag: 1,
								draftFlag: 1,
								payUnit: '',
								buildSection: this.$store.getters.project.id,
								projectId:this.$store.getters.project['parentid'],
								payDate: formatDate(new Date())
							},
							[]
						],['payDate'])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.attachment = this.attachTable;
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					this.formData.copyData.user = this.copyData.join(',');
					api.addOrUpdateComeGoMoney(this.formData).then((res) => {
						if (res.data) {
							this.$message({
								type: 'success',
								message: '提交成功!'
							});
							this.dialogFormVisible = false;
							this.$emit("query");
						}
					});
				} else {
					this.$refs['ruleForm'].validate((valid) => {
						if (valid) {
							this.formData.attachment = this.attachTable;
							this.formData.auditUser = this.auditUser;
							this.copyData.user = this.copyData.user.join(",");
							this.formData.copyData = this.copyData;
							this.formData.draftFlag=1;
							api.addOrUpdateComeGoMoney(this.formData).then((res) => {
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
