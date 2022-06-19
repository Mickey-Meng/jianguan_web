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
							<el-form ref="ruleForm" label-width="80px">
								<div class="form-title">
									<div class="title-big-bar"></div>
									<strong>节点人员配置</strong>
								</div>
								<div class="block">
									<el-timeline>
										<el-timeline-item v-for="(item, idx) in nodeData" :key="item.entryKey" :timestamp="item.entryName" placement="top">
											<div>
												<div class="form-block">
													<div class="block-line">
														<div class="block-item">
															<div class="block-item-label">审批人</div>
															<div class="block-item-value">
																<el-select multiple 
																	v-model="auditUser[item.entryUserVariable]" placeholder="请选择">
																	<el-option v-for="user in nodeUser[item.entryUserVariable]" :key="user.id" :label="user.name"
																		:value="user.username">
																	</el-option>
																</el-select>
															</div>
															<el-button size="small" @click="selectPerson(item.entryUserVariable, 'userId')" type="primary">修改</el-button>
														</div>
														<div class="block-item">
															<div class="block-item-label">抄送人</div>
															<div class="block-item-value">
																<el-select multiple 
																	v-model="auditCopyUser[item.entryUserVariable]" placeholder="请选择">
																	<el-option v-for="user in nodeCopyUser[item.entryUserVariable]" :key="user.id" :label="user.name"
																		:value="user.username">
																	</el-option>
																</el-select>
															</div>
															<el-button size="small" @click="selectPerson(item.entryUserVariable, 'copyUser')" type="primary">修改</el-button>
														</div>
													</div>
												</div>
											</div>
										</el-timeline-item>
									</el-timeline>
								</div>
								
								<div class="form-block">
									<el-button class="submit-btn" size="small" type="primary" @click="addOrModify()">提交
									</el-button>
								</div>
							</el-form>
						</div>
					</div>
				</el-main>
			</el-container>
		</el-dialog>
		<el-dialog class="defined-dialog" title="选择人员" :visible.sync="selectPersonVisible">
			<el-form ref="newform" label-width="80px">
				<div class="input-box" style="max-width:300px; float:left;">
					<div class="input-value">
						<el-select v-model="selectedrole" placeholder="请选择角色" filterable @change="roleChangeEvt">
							<el-option v-for="item in roleData" :key="item.id" :label="item.name"
								:value="item.code">
							</el-option>
						</el-select>
					</div>
				</div>

				<div style="max-width:300px; float:left;">
					<el-select v-model="selecteduser" placeholder="请选择人员" multiple>
						<el-option v-for="item in userOptionsData" :key="item.id" :label="item.name"
							:value="item.name + '_' + item.username + '_' + item.id">
						</el-option>
					</el-select>
				</div>
				<div class="form-block">
					<el-button @click="addPerson" class="submit-btn" size="small" type="primary">确认添加</el-button>
				</div>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import { getUserInfo, getRoles, getUserByRoleId } from "@/api/user";
  	import {} from "@/api/user";
	import {
		convertOptions,
		formatDate,
		formatDateTime,
		diffCompare
	} from "@/utils/format.js";

	import project from '@/store/modules/project';

	export default {
		data() {
			return {
				draftVisible: false,
				addOrModifyFlag: true,
				dialogFormVisible: false,
				dialogTitle: '项目全生命周期数字管理平台',
				
				nodeData: [],
				selectPersonVisible: false, //选人弹窗是否显示
				selectPersonNodeKey: '', //当前选人的节点key
				selectPersonType: '', //当前修改的人员类型  审批或者抄送
				roleData: [],
				selectedrole: [],
				userOptionsData: [],
				selecteduser: [],
				auditUser: {},
				auditCopyUser: {},
				nodeUser: {},
				nodeCopyUser: {},
				test: []
			};
		},
		created() {},
		components: {
		},
		computed: {
			
		},
		watch: {
			
		},
		mounted() {
			this.getRoles();
		},
		methods: {
			getRoles() {
				getRoles(this.$store.getters.project['id'] || 3).then(res => {
				// 	console.log(res.data.getMe)
					const data = res.data;
					// for (let i = 0; i < data.length; i++) {
					// 	const item = data[i];
					// 	if (item.rolelevel == 1) {
					// 		data.splice(i, 1);
					// 		i--;
					// 	}
					// }
					this.roleData = data;
				})
			},
			roleChangeEvt(ID) {
				for (let i = 0; i < this.roleData.length; i++) {
					const item = this.roleData[i];
					if (item.code === ID) {
						let {id} = item;
						getUserByRoleId(this.$store.getters.project['id'] || 3, id).then(res => {
							if (res.data) {
								this.userOptionsData = res.data;
							} else {
								this.userOptionsData = [];
							}
							console.log(res.data)
						})
					}
				}
			},
			changeVisible(obj, value) {
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
						buildSection: this.$store.getters.project.id,projectId:this.$store.getters.project['parentid'],
						remark: '',
					}
					this.examineTable=[];
					this.reportTable=[];
					this.factoryTable=[];
					this.attachTable=[];
				}
			},
			selectPerson(key, type) {
				this.selectPersonVisible = true;
				this.selectPersonNodeKey = key;
				this.selectPersonType = type;
			},
			addPerson() {
				// id: 264
				// name: "江逸"
				// pwd: "45df722154db0444b2ee04ed8362db55"
				// storder: 0
				// ststate: 1
				// sttime: "2022-06-07 00:00:00"
				// usercode: ""
				// username: "13615882434"
				
				const data = [];
				const data1 = [];
				for (let i = 0; i < this.selecteduser.length; i++) {
					const item = this.selecteduser[i];
					const temp = item.split("_");
					const name = temp[0];
					const username = temp[1];
					const id = temp[2];
					data.push({name,username, id})
					data1.push(username)
				}

				if (this.selectPersonType === 'userId') {
					this.auditUser[this.selectPersonNodeKey] = this.auditUser[this.selectPersonNodeKey].concat(data1);
					this.nodeUser[this.selectPersonNodeKey] = this.nodeUser[this.selectPersonNodeKey].concat(data);
				} else {
					this.auditCopyUser[this.selectPersonNodeKey] = this.auditCopyUser[this.selectPersonNodeKey].concat(data1);
					this.nodeCopyUser[this.selectPersonNodeKey] = this.nodeCopyUser[this.selectPersonNodeKey].concat(data);
				}

				this.selectPersonVisible = false;

				this.selectedrole = [];
				this.selecteduser = [];

			},
			getDetail(id) {
				api.getFlowTypeDetail({
					id: id,
					buildSection: this.$store.getters.project.id,projectId:this.$store.getters.project['parentid']
				}).then((res) => {
					let data = res['data'] || {};
					const auditUser = {};
					const auditCopyUser = {};
					for (let i = 0; i < res.data.length; i++) {
						const item = res.data[i];
						if (!item.userInfo) item.userInfo = [];
						if (!item.copyUserInfo) item.copyUserInfo = [];

						if (!auditUser[item.entryUserVariable]) auditUser[item.entryUserVariable] = [];
						for (let j = 0; j < item.userInfo.length; j++) {
							const element = item.userInfo[j];
							auditUser[item.entryUserVariable].push(element.username);
						}

						if (!auditCopyUser[item.entryUserVariable]) auditCopyUser[item.entryUserVariable] = [];
						if (item.copyUserInfo) {
							for (let j = 0; j < item.copyUserInfo.length; j++) {
								const element = item.copyUserInfo[j];
								auditCopyUser[item.entryUserVariable].push(element.username)
							}
						}
						this.nodeUser[item.entryUserVariable] = item.userInfo || [];
						this.nodeCopyUser[item.entryUserVariable] = item.copyUserInfo || [];
					}
					this.auditUser = auditUser;
					this.auditCopyUser = auditCopyUser;
					this.nodeData = data;
				});
			},
			addOrModify() {
				for (let i = 0; i < this.nodeData.length; i++) {
					const item = this.nodeData[i];
					
					const id = item.id;
					const entryUserVariable = item.entryUserVariable;

					const userMaps = {}
					for (let j = 0; j < this.nodeUser[entryUserVariable].length; j++) {
						const user = this.nodeUser[entryUserVariable][j];
						userMaps[user.username] = user;
					}
					for (let j = 0; j < this.nodeCopyUser[entryUserVariable].length; j++) {
						const user = this.nodeCopyUser[entryUserVariable][j];
						userMaps[user.username] = user;
					}

					const userName = this.auditUser[entryUserVariable];

					const userId = [];
					for (let j = 0; j < userName.length; j++) {
						const name = userName[j];
						userId.push(userMaps[name]["id"]);
					}

					const copyUserName = this.auditCopyUser[entryUserVariable];

					const copyUser = [];
					if (copyUserName) {
						for (let j = 0; j < copyUserName.length; j++) {
							const name = copyUserName[j];
							copyUser.push(userMaps[name]["id"]);
						}
					}

					// const copyUser = item.copyUser;
					api.addOrUpdateFlowAuditEntry({id, userId, userName, copyUser}).then((res) => {
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
				this.selectPersonNodeKey = '', //当前选人的节点key
				this.roleData =[],
				this.selectedrole =[],
				this.userOptionsData =[],
				this.selecteduser =[],
				this.auditUser = {},
				this.auditCopyUser = {},
				this.nodeUser = {},
				this.nodeCopyUser = {}
				// nodeData
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
