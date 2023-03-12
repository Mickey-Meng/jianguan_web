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
									<strong>监理指令</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>

								<div class="form-block">
									<!-- <div class="form-block-title">
										<div class="title-bar"></div><strong>地理位置</strong>

									</div>
									<locationmap></locationmap> -->
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">发起人</div>
											<div class="block-item-value">
												{{baseInfo.userName}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">发起时间</div>
											<div class="block-item-value">
												{{baseInfo.startDate}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">抄送</div>
											<div class="block-item-value">
												<el-form-item prop="copy">
													<el-input v-model="formData.copy"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">指令编号<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="orderCode">
													<el-input v-model="formData.orderCode"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>指令信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">指令标题<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="orderTitle">
													<el-input v-model="formData.orderTitle"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">回复期限<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="orderDate">
													<el-date-picker value-format="yyyy-MM-dd"
														v-model="formData.orderDate" type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">工程部位<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="projectPart">
													<el-input v-model="formData.projectPart"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">严重程度<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="seriousLevel">
													<el-select v-model="formData.seriousLevel" placeholder="请选择">
														<el-option v-for="item in levelOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="form-block">
										<div class="form-block-title">
											<div class="title-bar"></div><strong>问题照片</strong>
											<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png 文件，且不超过
												100M</span>
										</div>
										<attachlist :editAble="true" :attachTable="formData.problemPhotoAttachment">
										</attachlist>

									</div>
									<div class="form-block">
										<div class="form-block-title">
											<div class="title-bar"></div><strong>其他附件</strong>
											<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png mp4 docx
												doc xlsx xls pdf 文件，且不超过 100M</span>
										</div>
										<attachlist :editAble="true" :attachTable="formData.otherAttachment">
										</attachlist>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">指令内容<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="orderContent">
													<el-input v-model="formData.orderContent" type="textarea" :rows="4"
														placeholder="请输入"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<!-- <div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>指令回复</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">指令回复编号<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="replyCode">
													<el-input v-model="formData.replyCode"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">回复内容<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="replyContent">
													<el-input v-model="formData.replyContent" type="textarea" :rows="4"
														placeholder="请输入"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="form-block">
										<div class="form-block-title">
											<div class="title-bar"></div><strong>整改照片</strong>
											<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png 文件，且不超过
												100M</span>
										</div>
										<attachlist :editAble="true" :attachTable="formData.replyPhotoAttachment">
										</attachlist>

									</div>
									<div class="form-block">
										<div class="form-block-title">
											<div class="title-bar"></div><strong>其他附件</strong>
											<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png mp4 docx
												doc xlsx xls pdf 文件，且不超过 100M</span>
										</div>
										<attachlist :editAble="true" :attachTable="formData.replyOtherAttachment">
										</attachlist>

									</div>

								</div> -->
								<approveuser v-if="approveVisible" :auditUser="auditUser" :flowKey="flowKey">
								</approveuser>

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

		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<supervisionOfInstruction @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible" v-if="draftVisible">
			</supervisionOfInstruction>
		</el-dialog>
	</div>
</template>

<script>
	import {mapGetters} from "vuex";
	import * as api from "@/api/quality";
	import {
		getUserInfo
	} from "@/api/user";
	import {
		convertOptions,
		formatDate,
		formatDateTime,
		getDaysBetween,
		diffCompare
	} from "@/utils/format.js";

	import upload from "../../../common/upload.vue"
	import attachlist from "../../../common/attachlist.vue"
	import drafthandle from "../../../common/drafthandle.vue"
	import approveuser from "../../../common/approveuser.vue"
	import projectinfo from "../../../common/projectinfo.vue"
	import locationmap from "../../../common/locationmap.vue"

	export default {
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogFormVisible: false,
				dialogTitle: '全生命周期智慧建设管理平台',
				levelOptions: [{
					label: '一般',
					value: 0
				}, {
					label: '严重',
					value: 1
				}],
				baseInfo: {
					userName:this.$store.getters.userInfo.name,
					startDate:formatDate(new Date()),
				},
				formData: { //表单参数
					"address": {},
					"auditUser": {},
					"copy": "",
					"deletedFlag": 1,
					"draftFlag": 1,
					"orderCode": "",
					"orderContent": "",
					"orderDate": formatDate(new Date()),
					"orderTitle": "",
					"otherAttachment": [],
					"problemPhotoAttachment": [],
					"buildSection": this.$store.getters.project.id,
					"projectId":this.$store.getters.project['parentid'],
					"projectPart": "",
					"replyCode": "",
					"replyContent": "",
					"replyDate": formatDate(new Date()),
					"replyOtherAttachment": [],
					"replyPhotoAttachment": [],
					"reviewDirector": "",
					"reviewSupervision": "",
					"seriousLevel": 0
				},
				rules: {
					orderCode: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					orderTitle: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					orderDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					projectPart: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					seriousLevel: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					orderContent: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					replyCode: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					replyContent: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}]
				},
				auditUser: {},
                approveVisible:true,
				flowKey: 'jianlizhiling'
			};
		},
		created() {},
		components: {
			upload,
			attachlist,
			drafthandle,
			approveuser,
			projectinfo,
			locationmap,
			supervisionOfInstruction: () => import("../supervisionOfInstruction.vue")
		},
		watch: {

		},
		computed: {
		  ...mapGetters(["userInfo", "name", "project", "roleId", "getUrl"])
		},
		mounted() {
		},
		methods: {

			changeVisible(obj, value) {
				this.dialogFormVisible = value;
				obj = obj || {};
				this.addOrModifyFlag = obj['id'] ? false : true;
				if (obj['id']) {
					this.getDetail(obj['id']);
                    this.approveVisible=false;
				} else {
					this.formData = {
						"address": {},
						"auditUser": {},
						"copy": "",
						"deletedFlag": 1,
						"draftFlag": 1,
						"orderCode": "",
						"orderContent": "",
						"orderDate": formatDate(new Date()),
						"orderTitle": "",
						"otherAttachment": [],
						"problemPhotoAttachment": [],
						"buildSection": this.$store.getters.project.id,
						"projectId":this.$store.getters.project['parentid'],
						"projectPart": "",
						"replyCode": "",
						"replyContent": "",
						"replyDate": formatDate(new Date()),
						"replyOtherAttachment": [],
						"replyPhotoAttachment": [],
						"reviewDirector": "",
						"reviewSupervision": "",
						"seriousLevel": 0
					}
					// this.auditUser={};
					this.approveVisible=true;
				}
			},

			getDetail(id) {
				api.getSupervisionOrderDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData], [{
								"address": {},
								"auditUser": {},
								"copy": "",
								"deletedFlag": 1,
								"draftFlag": 1,
								"orderCode": "",
								"orderContent": "",
								"orderDate": formatDate(new Date()),
								"orderTitle": "",
								"otherAttachment": [],
								"problemPhotoAttachment": [],
								"buildSection": this.$store.getters.project.id,
								"projectId":this.$store.getters.project['parentid'],
								"projectPart": "",
								"replyCode": "",
								"replyContent": "",
								"replyDate": formatDate(new Date()),
								"replyOtherAttachment": [],
								"replyPhotoAttachment": [],
								"reviewDirector": "",
								"reviewSupervision": "",
								"seriousLevel": 0
							},

						])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateSupervisionOrder(this.formData).then((res) => {
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
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag = 1;
							api.addOrUpdateSupervisionOrder(this.formData).then((res) => {
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
	@import "../../../../assets/css/dialog.scss"
</style>
