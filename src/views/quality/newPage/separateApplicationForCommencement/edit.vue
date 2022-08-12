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
									<strong>分项开工申请</strong>
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
											<div class="block-item-label">工程编号</div>
											<div class="block-item-value">
												<el-input v-model="formData.projectCode"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>分项开工申请报告信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">建议开工日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="openDate">
													<el-date-picker value-format="yyyy-MM-dd" v-model="formData.openDate"
														type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">计划完工日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="endDate">
													<el-date-picker value-format="yyyy-MM-dd" v-model="formData.endDate"
														type="date" placeholder="请选择">
													</el-date-picker>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">地点或桩号<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="place">
													<el-input v-model="formData.place" placeholder="请输入地点或桩号">
													</el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">现场负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="liveUser">
													<el-select v-model="formData.liveUser" placeholder="请选择">
														<el-option v-for="item in liveUserOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">施工员<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="buildUser">
													<el-select v-model="formData.buildUser" placeholder="请选择">
														<el-option v-for="item in buildUserOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">质检员<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="checkUser">
													<el-select v-model="formData.checkUser" placeholder="请选择">
														<el-option v-for="item in  checkUserOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">施工准备情况说明<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="buildPrepareExplain">
													<el-input v-model="formData.buildPrepareExplain"
														placeholder="请输入隐蔽工程项目"></el-input>
												</el-form-item>

											</div>
										</div>

									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>标准试验审批表</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.experimentAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.experimentExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>专项施工方案审批表</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.buildAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.buildExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>工艺试验审批表</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.processAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.processExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>到场材料审批表</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.materialAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.materialExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>到场设备审批表（含特种设备检测报告）</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.equipmentAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.equipmentExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>到场技术、质量、安全、环保管理人员及主要操人员、特种作业人员情况及证件复印件</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.techAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.techExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>施工方案</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.buildPlanAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.buildPlanExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>安全技术措施</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.securityAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.securityExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>危险性较大项目安全专项施工方案审查记录</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.riskAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.riskExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>环境保护措施</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.environmentAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.environmentExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>环保、安全、质量、技术交底材料</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.bottomAttachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">说明</div>
											<div class="block-item-value">
												<el-input v-model="formData.bottomExplain" type="textarea" :rows="2"
													placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>
								<approveuser v-if="approveVisible" :auditUser="auditUser"  :flowKey="flowKey">
								</approveuser>

								<div class="form-block">
									<el-button @click="addOrModify()" class="submit-btn" size="small" type="primary">提交
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
				</el-aside>
				<el-aside
					style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
					<tasklog></tasklog>
				</el-aside> -->
			</el-container>
		</el-dialog>
		<el-dialog width="80%" class="little-container" :visible.sync="draftVisible">
			<separateApplicationForCommencement @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</separateApplicationForCommencement>
		</el-dialog>

	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import * as userapi from "@/api/user";
	import {
		getUserInfo
	} from "@/api/user";
	import {
		formatDate,
		formatDateTime,
		createProjectInfo,
		diffCompare
	} from "@/utils/format.js";
	import upload from "../../../common/upload.vue"
	import attachlist from "../../../common/attachlist.vue"
	import drafthandle from "../../../common/drafthandle.vue"
	import approveuser from "../../../common/approveuser.vue"
	import projectinfo from "../../../common/projectinfo.vue"
	export default {
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogTitle: '项目全生命周期数字管理平台',
				dialogFormVisible: false,
				
				buildUserOptions:[{
					label:'洪涛',
					value:'148'
				}],
				checkUserOptions:[{
					label:'洪涛',
					value:'148'
				}],
				liveUserOptions:[{
					label:'洪涛',
					value:'148'
				}],
				
				rules: {
					openDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					endDate: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					place: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					liveUser: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					buildUser: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					checkUser: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					buildPrepareExplain: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
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
					bottomAttachment: [],
					bottomExplain: '',
					buildAttachment: [],
					buildExplain: '',
					buildPlanAttachment: [],
					buildPlanExplain: '',
					buildPrepareExplain: '',
					buildUser: '',
					checkUser: '',
					endDate: formatDate(new Date()),
					environmentAttachment: [],
					environmentExplain: '',
					equipmentAttachment: [],
					equipmentExplain: '',
					experimentAttachment: [],
					experimentExplain: '',
					liveUser: '',
					materialAttachment: [],
					materialExplain: '',
					openDate: formatDate(new Date()),
					place: '',
					processAttachment: [],
					processExplain: '',
					projectCode: '',
					riskAttachment: [],
					riskExplain: '',
					securityAttachment: [],
					securityExplain: '',
					techAttachment: [],
					techExplain: '',
					deletedFlag: 1,
					draftFlag: 1,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid']
				},
				auditUser: {},
                approveVisible:true,
				flowKey:'fenxiangkaigongshenqing'
			};
		},
		created() {},
		components: {
			upload,
			attachlist,
			drafthandle,
			approveuser,
			projectinfo,
			separateApplicationForCommencement: () => import("../separateApplicationForCommencement.vue")
		},
		computed: {

		},
		mounted() {
			this.getProjectInfoById();
			this.getUserOptions();
		},
		watch: {

		},
		methods: {
			getUserOptions(){
				this.buildUserOptions=[];
				this.checkUserOptions=[];
				this.liveUserOptions=[];
				
				userapi.getUserByRoleId(this.$store.getters.project['id'],70).then(res=>{
					let data=res.data||[];
					data.forEach(item=>{
						this.buildUserOptions.push({
							label:item['name'],
							value:item['id']
						})
					})
				})
				userapi.getUserByRoleId(this.$store.getters.project['id'],99).then(res=>{
					let data=res.data||[];
					data.forEach(item=>{
						this.checkUserOptions.push({
							label:item['name'],
							value:item['id']
						})
					})
				})
				userapi.getUserByRoleId(this.$store.getters.project['id'],70).then(res=>{
					let data=res.data||[];
					data.forEach(item=>{
						this.liveUserOptions.push({
							label:item['name'],
							value:item['id']
						})
					})
				})
			},
			changeVisible(obj, value) {
				this.dialogFormVisible = value;
				obj = obj || {};
				this.addOrModifyFlag = obj['id'] ? false : true;
				if (obj['id']) {
					this.getDetail(obj['id']);
                    this.approveVisible=false;
				} else {
					this.formData = {
						bottomAttachment: [],
						bottomExplain: '',
						buildAttachment: [],
						buildExplain: '',
						buildPlanAttachment: [],
						buildPlanExplain: '',
						buildPrepareExplain: '',
						buildUser: '',
						checkUser: '',
						endDate: formatDate(new Date()),
						environmentAttachment: [],
						environmentExplain: '',
						equipmentAttachment: [],
						equipmentExplain: '',
						experimentAttachment: [],
						experimentExplain: '',
						liveUser: '',
						materialAttachment: [],
						materialExplain: '',
						openDate: formatDate(new Date()),
						place: '',
						processAttachment: [],
						processExplain: '',
						projectCode: '',
						riskAttachment: [],
						riskExplain: '',
						securityAttachment: [],
						securityExplain: '',
						techAttachment: [],
						techExplain: '',
						deletedFlag: 1,
						draftFlag: 1,
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid']
					}
					this.auditUser={};
					this.approveVisible=true;
				}
			},
			getProjectInfoById() {
				api.getProjectInfoById({
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
				api.getSubitemOpenDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					if (diffCompare([this.formData], [{
								bottomAttachment: [],
								bottomExplain: '',
								buildAttachment: [],
								buildExplain: '',
								buildPlanAttachment: [],
								buildPlanExplain: '',
								buildPrepareExplain: '',
								buildUser: '',
								checkUser: '',
								endDate: formatDate(new Date()),
								environmentAttachment: [],
								environmentExplain: '',
								equipmentAttachment: [],
								equipmentExplain: '',
								experimentAttachment: [],
								experimentExplain: '',
								liveUser: '',
								materialAttachment: [],
								materialExplain: '',
								openDate: formatDate(new Date()),
								place: '',
								processAttachment: [],
								processExplain: '',
								projectCode: '',
								riskAttachment: [],
								riskExplain: '',
								securityAttachment: [],
								securityExplain: '',
								techAttachment: [],
								techExplain: '',
								deletedFlag: 1,
								draftFlag: 1,
								buildSection: this.$store.getters.project.id,
								projectId:this.$store.getters.project['parentid']
							}
						],['endDate','openDate'])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}
					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateSubitemOpen(this.formData).then((res) => {
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
							api.addOrUpdateSubitemOpen(this.formData).then((res) => {
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
