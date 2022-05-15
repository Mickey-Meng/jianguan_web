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
									<strong>隐蔽功能验收记录-浙公路（JL）011</strong>
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
										<div class="title-bar"></div><strong>隐蔽功能信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">分项工程<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input v-model="formData.subProject"></el-input>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">单位、分部工程<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input v-model="formData.unit"></el-input>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">隐蔽工程项目<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input v-model="formData.hiddenProject" type="textarea" :rows="4"
													placeholder="请输入隐蔽工程项目"></el-input>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">施工自检结果<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input v-model="formData.buildCheckselfResult" type="textarea"
													:rows="4" placeholder="请输入施工自检结果"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件清单</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>

									<div class="block-line">
										<upload @afterUp="afterUp($event)"></upload>
										<!-- <div class="block-table-title">附件</div> -->
										<div class="block-table-btns">
											<el-button size="small" type="primary">下载全部</el-button>
										</div>
									</div>
									<div class="block-table">
										<el-table :data="attachTable" style="width: 100%" border class="have_scrolling">
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
													<el-button type="text" size="mini">删除</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</div>

								<div class="form-title">
									<div class="title-big-bar"></div><strong>监理办验收情况</strong>
								</div>

								<!-- <div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>审批意见</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">处理人</div>
											<div class="block-item-value">江逸</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">处理操作</div>
											<div class="block-item-value">同意</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">处理时间</div>
											<div class="block-item-value">2022-04-19 11:30:31</div>
										</div>
									</div>
								</div> -->
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>待审批人</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目质检负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-select v-model="formData.qualityCheckUser" placeholder="请选择">
													<el-option v-for="item in userOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目施工负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-select v-model="formData.projectBuildUser" placeholder="请选择">
													<el-option v-for="item in userOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">现场监理人员<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-select v-model="formData.supervisorUser" placeholder="请选择">
													<el-option v-for="item in userOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">专业监理工程师<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-select v-model="formData.supervisorEngineerUser" placeholder="请选择">
													<el-option v-for="item in userOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目负责人<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-select v-model="formData.projectChargeUser" placeholder="请选择">
													<el-option v-for="item in userOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<el-button @click="addOrModify" class="submit-btn" size="small" type="primary">提交
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
		formatDateTime
	} from "@/utils/format.js";
	import upload from "../../../common/upload.vue"
	import tasklog from "../../../common/tasklog.vue"
	
	export default {
		props: ['currentRow'],
		data() {
			return {
				dialogTitle: '智慧建设通用版-【绍兴市】235国道杭州',
				dialogFormVisible: false,
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				userOptions: [{
					label: '陈武林',
					value: 1
				}],
				rules: {
					subProject: [{
						required: true,
						message: '请填写分项工程',
						trigger: 'blur'
					}],
					unit: [{
						required: true,
						message: '请填写	单位、分部工程',
						trigger: 'blur'
					}],
					hiddenProject: [{
						required: true,
						message: '请填写隐蔽工程项目',
						trigger: 'blur'
					}],
					buildCheckselfResult: [{
						required: true,
						message: '请填写施工自检结果',
						trigger: 'blur'
					}],
					qualityCheckUser: [{
						required: true,
						message: '请选择项目质检负责人',
						trigger: 'blur'
					}],
					projectBuildUser: [{
						required: true,
						message: '请选择项目施工负责人',
						trigger: 'blur'
					}]
				},
				baseInfo: {
					buildSection: 1,
					buildSectionName: '235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
				},
				formData: { //表单参数
					attachment: [],
					buildCheckselfResult: '',
					deletedFlag: 1,
					draftFlag: 1,
					hiddenProject: '',
					id: null,
					projectBuildUser: 1,
					projectChargeUser: 1,
					projectCode: '',
					projectId: 1,
					qualityCheckUser: 1,
					subProject: '',
					supervisorEngineerUser: 1,
					supervisorUser: 1,
					unit: ''
				},
				attachTable: [], //附件
				fileList:[]
			};
		},
		created() {},
		components: {
			upload,
			tasklog
		},
		computed: {},
		mounted() {},
		watch: {
			currentRow(obj) {
				if (obj['id']) {
					this.getDetail(obj['id']);
				} else {
					this.formData = {
						attachment: [],
						buildCheckselfResult: '',
						deletedFlag: 1,
						draftFlag: 1,
						hiddenProject: '',
						id: null,
						projectBuildUser: 1,
						projectChargeUser: 1,
						projectCode: '',
						projectId: 1,
						qualityCheckUser: 1,
						subProject: '',
						supervisorEngineerUser: 1,
						supervisorUser: 1,
						unit: ''
					}
				}
			}
		},
		methods: {

			changeVisible(value) {
				this.dialogFormVisible = value;
			},
			getDetail(id) {
				api.getHiddenProjectDetail({
					id: id
				}).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
			addOrModify() {
				this.$refs['ruleForm'].validate((valid) => {
					this.formData.attachment=this.attachTable;
					api.addOrUpdateHiddenProject(this.formData).then((res) => {
						if (res.data) {
							this.$message({
								type: 'success',
								message: '提交成功!'
							});
							this.dialogFormVisible = false;
							this.$emit("query");
						}
					});
				})

			},
			afterUp(data){
				this.attachTable.push({
					createTime:formatDateTime(data['uploadTime']),
					fileName:data['fileName'],
					fileUrl:data['fileId'],
					creatorName:'test'
				})
			}
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
