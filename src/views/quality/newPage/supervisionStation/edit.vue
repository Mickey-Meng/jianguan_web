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
							<el-form :model="formData" ref="ruleForm" :rules="rules" label-width="200px">
								<div class="form-title">
									<div class="title-big-bar"></div>
									<strong>监理旁站</strong>
									<drafthandle v-if="addOrModifyFlag" @addOrModify="addOrModify"
										@checkDraft="checkDraft" ref="drafthandle"></drafthandle>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>发起位置</strong>

									</div>
									<locationmap></locationmap>
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<!-- <div class="block-item">
											<div class="block-item-label">创建人</div>
											<div class="block-item-value">
												{{baseInfo.userName}}
											</div>
										</div> -->
										<div class="block-line">
											<div class="block-item">
												<div class="block-item-label">旁站时间</div>
												<div class="block-item-value">
													<el-form-item prop="sideDate">
														<el-date-picker value-format="yyyy-MM-dd"
															v-model="formData.sideDate" type="date" placeholder="请选择">
														</el-date-picker>
													</el-form-item>

												</div>
											</div>
										</div>

									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>旁站信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item-label">工程部位</div>
										<div class="block-item-value">
											<el-form-item prop="projectPartId">
												<el-input readonly @focus="checkPartPro"
													v-model="formData.projectPartStr"></el-input>


												<!-- <el-select v-model="formData.projectPartId" placeholder="请选择">
													<el-option v-for="item in partOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select> -->
											</el-form-item>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-label">旁站监理项目<i class="require-icon"></i></div>
										<div class="block-item-value">
											<el-form-item prop="sideProjectId">
												<el-select v-model="formData.sideProjectId" placeholder="请选择">
													<el-option v-for="item in sideOptions" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</el-form-item>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">工程部位描述</div>
											<div class="block-item-value">
												<el-form-item prop="projectPartDesc">
													<el-input v-model="formData.projectPartDesc"></el-input>
												</el-form-item>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">异常情况<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-form-item prop="exceptionCondition">
													<el-input v-model="formData.exceptionCondition"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>旁站信息记录</strong>
									</div>

									<el-collapse v-model="sideInfoVisible">
										<el-collapse-item title="嵌入表单" name="1">
											<el-row
												style="font-size: 18px;color: #606266;font-weight: 600;text-align: center;">
												桩基首盘混凝土</el-row>
											<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">施工过程详情
											</el-row>
											<el-row>
												<el-form-item label="旁站时间">
													<el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
														v-model="sideInfo.a01" type="datetime" placeholder="请选择">
													</el-date-picker>
												</el-form-item>
											</el-row>
											<el-row>
												<el-col :span="8">
													<el-form-item label="施工员在岗情况">
														<el-radio v-model="sideInfo.a02" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a02" label="否">否</el-radio>
													</el-form-item>
												</el-col>
												<el-col :span="8">
													<el-form-item label="质检员在岗情况">
														<el-radio v-model="sideInfo.a03" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a03" label="否">否</el-radio>
													</el-form-item>
												</el-col>
												<el-col :span="8">
													<el-form-item label="安全员在岗情况" prop="sideDate">
														<el-radio v-model="sideInfo.a04" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a04" label="否">否</el-radio>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="施工作业人员满足施工需要情况" prop="sideDate">
														<el-radio v-model="sideInfo.a05" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a05" label="否">否</el-radio>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="特殊作业人员持证上岗情况" prop="sideDate">
														<el-radio v-model="sideInfo.a06" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a06" label="否">否</el-radio>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="施工机械满足施工需要情况" prop="sideDate">
														<el-radio v-model="sideInfo.a07" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a07" label="否">否</el-radio>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="施工材料符合设计和规范要求" prop="sideDate">
														<el-radio v-model="sideInfo.a08" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a08" label="否">否</el-radio>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="开始施工时间" prop="sideDate">
														<el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
															v-model="sideInfo.a09" type="datetime" placeholder="请选择">
														</el-date-picker>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="结束施工时间" prop="sideDate">
														<el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
															v-model="sideInfo.a10" type="datetime" placeholder="请选择">
														</el-date-picker>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-form-item label="施工工艺按审批施工方案实施" prop="sideDate">
													<el-radio v-model="sideInfo.a11" label="是">是</el-radio>
													<el-radio v-model="sideInfo.a11" label="否">否</el-radio>
												</el-form-item>
											</el-row>
											<el-row>
												<el-form-item label="钢筋笼安放所采用的施工机械设备是否满足要求" prop="sideDate">
													<el-radio v-model="sideInfo.a12" label="是">是</el-radio>
													<el-radio v-model="sideInfo.a12" label="否">否</el-radio>
												</el-form-item>
											</el-row>
											<el-row>
												<el-form-item label="钢筋笼吊装及安放工艺是否符合批准的施工方案" prop="sideDate">
													<el-radio v-model="sideInfo.a13" label="是">是</el-radio>
													<el-radio v-model="sideInfo.a13" label="否">否</el-radio>
												</el-form-item>
											</el-row>
											<el-row>
												<el-col :span="8">
													<el-form-item label="施工现场质量措施落实情况" prop="sideDate">
														<el-radio v-model="sideInfo.a14" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a14" label="否">否</el-radio>
													</el-form-item>
												</el-col>
												<el-col :span="8">
													<el-form-item label="安全措施落实情况" prop="sideDate">
														<el-radio v-model="sideInfo.a15" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a15" label="否">否</el-radio>
													</el-form-item>
												</el-col>
												<el-col :span="8">
													<el-form-item label="环保措施落实情况" prop="sideDate">
														<el-radio v-model="sideInfo.a16" label="是">是</el-radio>
														<el-radio v-model="sideInfo.a16" label="否">否</el-radio>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row style="font-size: 16px;color: #236fa1;font-weight: 600;">主要数据记录
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="施工现场质量措施落实情况" prop="sideDate">
														<el-input v-model="sideInfo.a17" placeholder="请输入桩位设计值">
														</el-input>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="桩位实测值" prop="sideDate">
														<el-input v-model="sideInfo.a18"
															placeholder="请输入桩位实测值，多个数据请用,隔开"></el-input>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="孔深设计值(m）" prop="sideDate">
														<el-input v-model="sideInfo.a19" placeholder="请输入孔深设计值">
														</el-input>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="孔深实测值(m）" prop="sideDate">
														<el-input v-model="sideInfo.a20"
															placeholder="请输入孔深实测值，多个数据请用,隔开"></el-input>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="孔径设计值(mm)" prop="sideDate">
														<el-input v-model="sideInfo.a21" placeholder="请输入孔径设计值">
														</el-input>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="孔径实测值(mm)" prop="sideDate">
														<el-input v-model="sideInfo.a22"
															placeholder="请输入孔径实测值，多个数据请用,隔开"></el-input>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="钻孔倾斜度设计值(mm)" prop="sideDate">
														<el-input v-model="sideInfo.a23" placeholder="请输入钻孔倾斜度设计值">
														</el-input>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="倾斜度实测值(mm)" prop="sideDate">
														<el-input v-model="sideInfo.a24"
															placeholder="请输入倾斜度实测值，多个数据请用,隔开"></el-input>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="沉淀厚度设计值(mm)" prop="sideDate">
														<el-input v-model="sideInfo.a25" placeholder="请输入沉淀厚度设计值">
														</el-input>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="沉淀厚度实测值(mm)" prop="sideDate">
														<el-input v-model="sideInfo.a26"
															placeholder="请输入沉淀厚度实测值，多个数据请用,隔开"></el-input>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="终孔后泥浆比重" prop="sideDate">
														<el-input v-model="sideInfo.a27" placeholder="请输入终孔后泥浆比重">
														</el-input>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="砂率" prop="sideDate">
														<el-input v-model="sideInfo.a28" placeholder="请输入砂率，多个数据请用,隔开">
														</el-input>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="一清后泥浆的比重" prop="sideDate">
														<el-input v-model="sideInfo.a29" placeholder="请输入一清后泥浆的比重">
														</el-input>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="砂率" prop="sideDate">
														<el-input v-model="sideInfo.a30" placeholder="请输入砂率，多个数据请用,隔开">
														</el-input>
													</el-form-item>
												</el-col>
											</el-row>
											<el-row>
												<el-col :span="12">
													<el-form-item label="二清后泥浆的比重" prop="sideDate">
														<el-input v-model="sideInfo.a31" placeholder="请输入二清后泥浆的比重">
														</el-input>
													</el-form-item>
												</el-col>
												<el-col :span="12">
													<el-form-item label="砂率" prop="sideDate">
														<el-input v-model="sideInfo.a32" placeholder="请输入砂率，多个数据请用,隔开">
														</el-input>
													</el-form-item>
												</el-col>
											</el-row>
										</el-collapse-item>
									</el-collapse>

									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">旁站工作情况</div>
											<div class="block-item-value">
												<el-form-item prop="sideWorkCondition">
													<el-input v-model="formData.sideWorkCondition"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">发现的问题及处理结果</div>
											<div class="block-item-value">
												<el-form-item prop="problemDealCondition">
													<el-input v-model="formData.problemDealCondition"></el-input>
												</el-form-item>
											</div>
										</div>
									</div>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>旁站现场照片</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist"
										:attachTable="formData.scenePhotoAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>实测实量照片</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist"
										:attachTable="formData.actualCheckAttachment">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>视频上传</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.video">
									</attachlist>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件上传</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="true" ref="attachlist" :attachTable="formData.attachment">
									</attachlist>
								</div>

								<approveuser :auditUser="auditUser" :flowKey="flowKey">
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
			<supervisionStation @hideDraft="hideDraft" @getDetail="getDetail" :isDraft="draftVisible"
				v-if="draftVisible">
			</supervisionStation>
		</el-dialog>

		<el-dialog title="选择工程部位" width="50%" class="little-container" :visible.sync="partVisible">
			<partproject @callback="checkPartProCallback">
			</partproject>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		getUserInfo
	} from "@/api/user";
	import {
		convertOptions,
		formatDate,
		formatDateTime,
		getDaysBetween,
		diffCompare,
		getChidlren
	} from "@/utils/format.js";

	import {
		getBridgeTree
	} from "@/api/tree";

	import simpleData from '../../../common/simdata.js'

	import upload from "../../../common/upload.vue"
	import attachlist from "../../../common/attachlist.vue"
	import drafthandle from "../../../common/drafthandle.vue"
	import locationmap from "../../../common/locationmap.vue"
	import approveuser from "../../../common/approveuser.vue"
	import projectinfo from "../../../common/projectinfo.vue"
	import partproject from "../../../common/partproject.vue"
	export default {
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogFormVisible: false,
				dialogTitle: '项目全生命周期数字管理平台',
				childOptions: [],
				partOptions: [],
				sideOptions: [],
				baseInfo: {
					userName: this.$store.getters.userInfo.name,
					startDate: formatDate(new Date()),
				},
				sideInfoVisible:'',
				sideInfo: {

				},
				formData: { //表单参数
					"actualCheckAttachment": [],
					"address": {},
					"attachment": [],
					"auditUser": {},
					"deletedFlag": 1,
					"draftFlag": 1,
					"exceptionCondition": "",
					"problemDealCondition": "",
					buildSection: this.$store.getters.project.id,
					projectId: this.$store.getters.project['parentid'],
					"projectPartDesc": "",
					"projectPartId": null,
					"projectPartStr": '',
					"scenePhotoAttachment": [],
					"sideDate": formatDate(new Date()),
					"sideInfo": "",
					"sideProjectId": null,
					"sideWorkCondition": "",
					"video": []
				},
				rules: {
					buildSection: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					sideProjectId: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					exceptionCondition: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					sideWorkCondition: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}],
					problemDealCondition: [{
						required: true,
						message: '必须项',
						trigger: 'blur'
					}]
				},
				auditUser: {},
				flowKey: 'jianlipangzhan',
				partVisible: false,
				treeData: null
			};
		},
		created() {},
		components: {
			upload,
			attachlist,
			drafthandle,
			approveuser,
			locationmap,
			projectinfo,
			partproject,
			supervisionStation: () => import("../supervisionStation.vue")
		},
		computed: {

		},
		watch: {

		},
		mounted() {
			this.initData();
			this.getChildProject();
			this.getSupervisionSideEnums();
		},
		methods: {
			initData() {
				this.treeData = [simpleData.data];
				// getBridgeTree('QL', null).then((res) => {
				//   const arr = [];
				//   arr.push(res.data);
				//   this.treeInfo = arr;
				// });
			},
			checkPartPro() {
				this.partVisible = true;
			},
			checkPartProCallback(node, data, treename) {
				if (!data.isLeaf) {
					this.$message({
						type: 'warning',
						message: '请选择到最后一级!'
					});
					return;
				}
				this.formData.projectPartId = node.id;
				this.formData.projectPartStr = treename.join('/');
				this.partVisible = false
			},
			getChildProject() {
				api.getChildProject({
					projectid: this.$store.getters.project['parentid']
				}).then((res) => {
					let options = res.data || [];
					this.childOptions = convertOptions(options, 'name', 'id');
				});
			},
			changeChild() {
				api.getCompanyByProjectId({
					projectid: this.formData.buildSection
				}).then((res) => {
					this.baseInfo = res;
				});
			},
			getSupervisionSideEnums() {
				api.getSupervisionSideEnums().then((res) => {
					let options = res.data || [];
					this.sideOptions = convertOptions(options, 'desc', 'code');
				});
			},
			changeVisible(obj, value) {
				this.dialogFormVisible = value;
				obj = obj || {};
				this.sideInfoVisible=''
				this.addOrModifyFlag = obj['id'] ? false : true;
				if (obj['id']) {
					this.getDetail(obj['id']);
				} else {
					this.sideInfo = {}
					this.formData = {
						"actualCheckAttachment": [],
						"address": {},
						"attachment": [],
						"auditUser": {},
						"deletedFlag": 1,
						"draftFlag": 1,
						"exceptionCondition": "",
						"problemDealCondition": "",
						buildSection: this.$store.getters.project.id,
						projectId: this.$store.getters.project['parentid'],
						"projectPartDesc": "",
						"projectPartId": null,
						"projectPartStr": '',
						"scenePhotoAttachment": [],
						"sideDate": formatDate(new Date()),
						"sideInfo": "",
						"sideProjectId": null,
						"sideWorkCondition": "",
						"video": []
					}
				}
			},

			getDetail(id) {
				api.getSupervisionSideDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.sideInfo = data['sideInfo'] ? JSON.parse(data['sideInfo']) : {};
					let treename = getChidlren(this.treeData, this.formData.projectPartId, []);
					this.formData.projectPartStr = (treename ? treename : []).join('/');
				});
			},
			addOrModify(isdraft) {
				if (isdraft) {
					this.formData.sideInfo = JSON.stringify(this.sideInfo);
					if (diffCompare([this.formData], [{
							"actualCheckAttachment": [],
							"address": {},
							"attachment": [],
							"auditUser": {},
							"deletedFlag": 1,
							"draftFlag": 1,
							"exceptionCondition": "",
							"problemDealCondition": "",
							buildSection: this.$store.getters.project.id,
							projectId: this.$store.getters.project['parentid'],
							"projectPartDesc": "",
							"projectPartId": null,
							"projectPartStr": '',
							"scenePhotoAttachment": [],
							"sideDate": formatDate(new Date()),
							"sideInfo": "",
							"sideProjectId": null,
							"sideWorkCondition": "",
							"video": []
						}], ['sideDate'])) {
						this.$message({
							type: 'warning',
							message: '不能提交空白!'
						});
						return;
					}

					this.formData.draftFlag = isdraft ? 0 : 1;
					this.formData.auditUser = this.auditUser;
					api.addOrUpdateSupervisionSide(this.formData).then((res) => {
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
							this.formData.sideInfo = JSON.stringify(this.sideInfo);
							this.formData.auditUser = this.auditUser;
							this.formData.draftFlag = 1;
							api.addOrUpdateSupervisionSide(this.formData).then((res) => {
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
	.el-collapse-item {
		.el-input {
			width: calc(100% - 200px) !important
		}
	}

	@import "../../../../assets/css/dialog.scss"
</style>
