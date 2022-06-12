<template>
	<div class="handle-bg">
		<el-form ref="ruleform" label-width="80px" :rules="rules" :model="formData">
			<div class="form-block">
				<div class="form-block-title">
					<div class="title-bar"></div><strong>审核</strong>
				</div>
				<div class="block-line">
					<div class="block-item">
						<div class="block-item-label">审批意见</div>
						<div class="block-item-value">
							<el-form-item prop="comment">
								<el-input v-model="formData.comment" type="textarea" :rows="4" placeholder="请输入审批意见">
								</el-input>
							</el-form-item>
						</div>
					</div>
				</div>
				<div class="block-line" v-if="copyUserVisible">
					<div class="block-item">
						<div class="block-item-label">抄送</div>
						<div class="block-item-value">
							<el-form-item prop="qualityCheckUser">
								<el-select placeholder="请选择" 
									multiple
									v-model="auditUser">
									<el-option v-for="(item, index) in userOptions"
										:key="index" :label="item.name"
										:value="item.username">
									</el-option>
								</el-select>
							</el-form-item>
						</div>
					</div>
				</div>
			</div>
			<div class="form-block" style="text-align: center;">
				<!-- <el-button @click="agreeTask" size="small" type="primary">同意</el-button>
				<el-button @click="transferTask" size="small" type="primary">转办</el-button>
				<el-button @click="rejectTask" size="small" type="primary">驳回</el-button> -->

				<el-button v-for="(operation, index) in flowOperationList" :key="index" size="small"
					:type="getButtonType(operation.type) || 'primary'" :plain="operation.plain || false"
					@click="handlerOperation(operation)">
					{{operation.label}}
				</el-button>
			</div>
		</el-form>
	</div>
</template>

<script>
	import '@/staticDict/flowStaticDict.js';
	import * as api from "@/api/quality";
	export default {
		props: ['taskInfo'],
		data() {
			return {
				formData: {
					approvalType: "agree",
					comment: "",
					delegateAssginee: ""
				},
				rules: {
					comment: [{
						required: true,
						message: '请填写审批意见',
						trigger: 'blur'
					}]
				},
				operationList: [],
				
				userOptions:[],
				auditUser:[],
				copyUserVisible:false
			};
		},
		created() {},
		computed: {
			flowOperationList() {
				if (Array.isArray(this.operationList)) {
					return this.operationList.map(item => {
						if (item.type === this.SysFlowTaskOperationType.MULTI_SIGN && item.multiSignAssignee !=
							null) {
							let multiSignAssignee = {
								...item.multiSignAssignee
							}
							multiSignAssignee.assigneeList = item.multiSignAssignee.assigneeList ?
								multiSignAssignee.assigneeList.split(',') : undefined;
							return {
								...item,
								multiSignAssignee
							}
						} else {
							return {
								...item
							}
						}
					});
				} else {
					return [];
				}
			},
		},
		mounted() {
			
		},
		methods: {
			initData(){
				
				this.getCopyUserByFlowKey();
				
				api.viewRuntimeTaskInfo({
					processDefinitionId: this.taskInfo['processDefinitionId'],
					processInstanceId: this.taskInfo['processInstanceId'],
					taskId: this.taskInfo['taskId']
				}).then((res) => {
					this.operationList = (res.data.operationList || []).filter(item => {
						return item.type !== this.SysFlowTaskOperationType.CO_SIGN && item.type !== this
							.SysFlowTaskOperationType.REVOKE;
					})
				});
			},
			getCopyUserByFlowKey() {
				api.getCopyUserByFlowKey({
					entryKey: this.taskInfo['entryKey'],
					flowKey:this.taskInfo['flowKey'],
					projectId: this.$store.getters.project['parentid'] || 2
				}).then((res) => {
					let data=res.data||{};
					this.userOptions=data.copyUserInfo||[];
					this.copyUserVisible=this.userOptions.length?true:false;
					this.$forceUpdate();
				});
			},
			agreeTask() {
				api.submitUserTask({
					copyData: {},
					flowTaskCommentDto: this.formData,
					masterData: {},
					processInstanceId: this.taskInfo.processInstanceId,
					slaveData: {},
					taskId: this.taskInfo.taskId,
					taskVariableData: {}
				}).then((res) => {
					console.log(res);
				})
			},
			transferTask() {

			},
			rejectTask() {

			},
			getButtonType(type) {
				switch (type) {
					case this.SysFlowTaskOperationType.AGREE:
					case this.SysFlowTaskOperationType.TRANSFER:
					case this.SysFlowTaskOperationType.CO_SIGN:
					case this.SysFlowTaskOperationType.MULTI_AGREE:
					case this.SysFlowTaskOperationType.MULTI_SIGN:
					case this.SysFlowTaskOperationType.SET_ASSIGNEE:
						return 'primary';
					case this.SysFlowTaskOperationType.SAVE:
						return 'success';
					case this.SysFlowTaskOperationType.REFUSE:
					case this.SysFlowTaskOperationType.PARALLEL_REFUSE:
					case this.SysFlowTaskOperationType.MULTI_REFUSE:
						return 'default';
					case this.SysFlowTaskOperationType.REJECT:
					case this.SysFlowTaskOperationType.REJECT_TO_START:
					case this.SysFlowTaskOperationType.REVOKE:
						return 'danger';
					default:
						return 'default';
				}
			},
			getOperationTagType(type) {
				switch (type) {
					case this.SysFlowTaskOperationType.AGREE:
					case this.SysFlowTaskOperationType.MULTI_AGREE:
					case this.SysFlowTaskOperationType.SET_ASSIGNEE:
						return 'success';
					case this.SysFlowTaskOperationType.REFUSE:
					case this.SysFlowTaskOperationType.PARALLEL_REFUSE:
					case this.SysFlowTaskOperationType.MULTI_REFUSE:
						return 'warning';
					case this.SysFlowTaskOperationType.STOP:
					case this.SysFlowTaskOperationType.REJECT:
					case this.SysFlowTaskOperationType.REJECT_TO_START:
					case this.SysFlowTaskOperationType.REVOKE:
						return 'danger';
					default:
						return 'primary';
				}
			},
			/**
			 * 流程操作
			 * @param {Object} operation 流程操作
			 */
			handlerOperation(operation) {
				
				this.formData.approvalType=operation.type;
				// 加签操作
				// if (operation.type === this.SysFlowTaskOperationType.CO_SIGN) {
				// 	this.submitConsign((res || {}).assignee).then(res => {
				// 		this.handlerClose();
				// 	}).catch(e => {});
				// 	return;
				// }
				// 驳回操作
				if (operation.type === this.SysFlowTaskOperationType.REJECT) {
					api.rejectRuntimeTask({
						processInstanceId: this.taskInfo.processInstanceId,
						taskId: this.taskInfo.taskId,
						comment: this.formData.comment
					}).then(res => {
						this.handlerClose();
					}).catch(e => {});
					return;
				}
				// 驳回到起点
				if (operation.type === this.SysFlowTaskOperationType.REJECT_TO_START) {
					api.rejectToStartUserTask({
						processInstanceId: this.taskInfo.processInstanceId,
						taskId: this.taskInfo.taskId,
						comment: this.formData.comment
					}).then(res => {
						this.handlerClose();
					}).catch(e => {});
					return;
				}
				// 撤销操作
				if (operation.type === this.SysFlowTaskOperationType.REVOKE) {
					this.$confirm('是否撤销此任务？').then(res => {
						api.revokeHistoricTask({
							pprocessInstanceId: this.taskInfo.processInstanceId,
							taskId: this.taskInfo.taskId,
							comment: '任务处理人撤销任务'
						}).then(res => {
							this.handlerClose();
						}).catch(e => {});
					}).catch(e => {});
					return;
				}
				
				let coptdata={};
				if(this.auditUser.length){
					coptdata={
						user:this.auditUser.join(',')
					}
				}
				api.submitUserTask({
					copyData: coptdata,
					flowTaskCommentDto: this.formData,
					masterData: {},
					processInstanceId: this.taskInfo.processInstanceId,
					slaveData: {},
					taskId: this.taskInfo.taskId,
					taskVariableData: {}
				}).then(res => {
					this.handlerClose();
					this.$message.success('提交成功！');
				}).catch(e => {});
			},
			handlerClose() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "../../assets/css/dialog.scss"
</style>
