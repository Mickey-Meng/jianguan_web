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
									<strong>施工技术交底-浙公路（JL）011</strong>
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
											<div class="block-item-label">登记时间</div>
											<div class="block-item-value">
												{{formData.checkDate}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">工程名称</div>
											<div class="block-item-value">
												{{baseInfo.buildSectionName}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">施工单位</div>
											<div class="block-item-value">
												{{baseInfo.buildCompany}}
											</div>
										</div>
									</div>
									<div class="block-line">

										<div class="block-item">
											<div class="block-item-label">施工技术交底概述</div>
											<div class="block-item-value">
												<el-input v-model="formData.buildTechBottom" type="textarea" :rows="4"></el-input>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">备注</div>
											<div class="block-item-value">
												<el-input v-model="formData.remark" type="textarea" :rows="4"></el-input>
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
													<el-button type="text" size="mini" @click="deleteAttach(row, $index)">删除</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</div>

								<div class="form-title">
									<div class="title-big-bar"></div><strong>审批信息</strong>
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
											<div class="block-item-label">监理<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="qualityCheckUser">
													<el-select v-model="formData.qualityCheckUser" placeholder="请选择">
														<el-option v-for="item in userOptions" :key="item.value"
															:label="item.label" :value="item.value">
														</el-option>
													</el-select>
												</el-form-item>
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
	</div>
</template>

<script>
	Date.prototype.format = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}
	import * as api from "@/api/quality";
	import {
		formatDateTime,
		formatDate,
		createProjectInfo
	} from "@/utils/format.js";
	import upload from "../../../common/upload.vue"
	
	export default {
		props: ['editRow'],
		data() {
			return {
				dialogTitle: '项目全生命周期数字管理平台',
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
					BuildTechBottom: [{
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
					buildSectionName: '',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
				},
				formData: { //表单参数
					buildSection: 1, // 施工标段id
					buildTechBottom: '', // 施工交底概述
					checkDate: formatDate(new Date()), // 登记时间
					remark: '', // 备注

					attachment: [],
					buildCheckselfResult: '',
					deletedFlag: 1,
					draftFlag: 1,
					BuildTechBottom: '',
					// id: null,
					projectBuildUser: 1,
					projectChargeUser: 1,
					projectCode: '',
					projectId: this.$store.getters.project['parentid'],
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
			upload
		},
		computed: {},
		mounted() {
			this.getProjectInfoById();
		},
		watch: {
			editRow(obj) {
				obj=obj||{};
				if (obj['id']) {
					this.getDetail(obj['id']);
				} else {
					this.formData = {
						attachment: [],
						buildCheckselfResult: '',
						deletedFlag: 1,
						draftFlag: 1,
						BuildTechBottom: '',
						// id: null,
						projectBuildUser: 1,
						projectChargeUser: 1,
						projectCode: '',
						projectId: this.$store.getters.project['parentid'],
						qualityCheckUser: 1,
						subProject: '',
						supervisorEngineerUser: 1,
						supervisorUser: 1,
						unit: ''
					}
					this.attachTable=[]
				}
			}
		},
		methods: {
			changeVisible(value) {
				this.dialogFormVisible = value;
			},
			getProjectInfoById(){
				api.getProjectInfoById({
					projectid:this.$store.getters.project['parentid']
				}).then((res) => {
					let data = res['data'] || {};
					this.baseInfo['buildSectionName']=data['project']?data['project']['name']:'';
					let list=data['companys'] || [];
					let info=createProjectInfo(list);
					this.baseInfo['buildCompany']=info['buildCompany'];
					this.baseInfo['supervisionUnit']=info['supervisionUnit'];

					this.formData['buildSection'] = data['project'] ? data['project']['id'] : 1;
				});
			},
			getDetail(id) {
				api.getBuildTechBottomDetail({
					id: id
				}).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable=data.attachment||[];
				});
			},
			addOrModify() {
				this.$refs['ruleForm'].validate((valid) => {
					if(valid){
						this.formData.attachment=this.attachTable;
						api.addOrUpdateBuildTechBottom(this.formData).then((res) => {
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
			},
			afterUp(data){
				this.attachTable.push({
					createTime:formatDateTime(data['uploadTime']),
					fileName:data['fileName'],
					fileUrl:data['fileId'],
					creatorName:'test'
				})
			},
			deleteAttach(row, index){
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.attachTable.splice(index,1);
				});
			}
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
