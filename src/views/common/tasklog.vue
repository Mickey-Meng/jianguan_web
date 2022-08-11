<template>
	<div>
		<div class="log-btns">
			<el-button size="medium" @click="createFlow">流程图</el-button>
			<el-button class="print-btn" size="medium" type="primary">打印预览</el-button>
			<el-button class="print-select-btn" size="medium" type="primary" icon="el-icon-arrow-down">
			</el-button>
		</div>
		<div class="log-content">
			<el-tabs v-model="activeName" type="card">
				<el-tab-pane label="审批记录" name="first">
					<el-table :data="logData" style="width: 100%" border class="have_scrolling">
						<el-table-column type="index" width="50" align="center" label="序号">
						</el-table-column>
						<el-table-column prop="taskName" align="center" label="流程环节">
						</el-table-column>
						<el-table-column prop="createName" align="center" label="执行人">
						</el-table-column>
						<el-table-column prop="approvalType" align="center" label="操作">
						</el-table-column>
						<el-table-column prop="comment" align="center" label="审批意见"  show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="createTime" align="center" label="处理时间" show-overflow-tooltip>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane v-if="hasTaskUser" label="审批人" name="second">
					<el-table :data="userData" style="width: 100%" border class="have_scrolling">
						<el-table-column type="index" width="50" align="center" label="序号">
						</el-table-column>
						<el-table-column prop="loginName" align="center" label="审批人">
						</el-table-column>
						<el-table-column prop="showName" align="center" label="昵称">
						</el-table-column>
						<el-table-column prop="lastApprovalTime" align="center" label="处理时间">
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</div>
		<el-drawer title="我是标题" :visible.sync="dialogVisible" :with-header="false" size="90%">
			<div id="container" style="width:100%;height:100%"></div>
		</el-drawer>
	</div>
</template>


<script>
	import BpmnModeler from 'bpmn-js/lib/Modeler';
	import * as api from "@/api/quality";
	import { getUserInfo } from "@/api/user";
	export default {
		props:['taskInfo'],
		data() {
			return {
				dialogVisible: false,
				logData: [],
				activeName: 'first',
				userData: [],
				bpmnModeler: null,
				xmlStr:'',
				runVariables: {},
				hasTaskUser:false,
				processNodeInfo: {}
			};
		},
		created() {},
		components: {},
		computed: {},
		mounted() {
		},
		methods: {
			initData(){
				api.viewProcessBpmn({
					processDefinitionId:this.taskInfo['processDefinitionId']
				}).then((res) => {
					this.xmlStr=res['data'];
					
				});
				api.getRunVariables({
					processInstanceId:this.taskInfo['processInstanceId'],
					flowKey: this.taskInfo['flowKey'],
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
				}).then((res) => {
					this.runVariables=res['data'];
					
				})
				api.viewHighlightFlowData({
					processInstanceId:this.taskInfo['processInstanceId']
				}).then((res) => {
					this.processNodeInfo = res.data;
				});
				api.listFlowTaskComment({
					processInstanceId:this.taskInfo['processInstanceId']
				}).then((res) => {
					const _data = [];
					for (let i = 0; i < res.data.length; i++) {
						const item = res.data[i];
						item.comment = item.comment === undefined ? "发起" : item.comment; // 默认显示为发起
						// getUserInfo(item.createUserId).then(res1 => {
						// 	item.createUsernameStr = res1.data.userInfo.NAME;
						// 	_data.push(JSON.parse(JSON.stringify(item)));
							
						// 	this.logData=_data||[]; // 强制刷新
						// })
					}
					this.logData=res['data']||[];
				});
				
				// if(this.taskInfo['taskId']){
				// 	api.viewTaskUserInfo({
				// 		processDefinitionId: this.taskInfo['processDefinitionId'],
				// 		processInstanceId: this.taskInfo['processInstanceId'],
				// 		taskId: this.taskInfo['taskId'],
				// 		historic:true
				// 	}).then((res) => {
				// 		this.userData=res['data']||[];
				// 	});
				// }else{
				// 	this.hasTaskUser=false;
				// }
			},
			createFlow() {
				const that = this;
				this.dialogVisible = true;
				// if(this.bpmnModeler) return;
				setTimeout(()=>{
					const containerElement = document.getElementById('container');
					this.bpmnModeler = new BpmnModeler({
						container: containerElement,
						additionalModules: [{
							paletteProvider: ["value", ''], // 禁用/清空左侧工具栏
							labelEditingProvider: ["value", ''], // 禁用节点编辑
							contextPadProvider: ["value", ''], // 禁用图形菜单
						}]
					});
					this.bpmnModeler.importXML(this.xmlStr, (err) => {
						if (!err) {
							// 让图能自适应屏幕
							const canvas = this.bpmnModeler.get('canvas')
							canvas.zoom('fit-viewport')

							let { finishedTaskSet, unfinishedTaskSet } = this.processNodeInfo;
							// 目的：为第一个节点添加绿色，为第二个节点添加黄色
							// 实现步骤：1、找到页面里所有节点
							const elementRegistry = this.bpmnModeler.get('elementRegistry');
							const nodeList = elementRegistry.filter (
							(item) => finishedTaskSet.indexOf(item.id) > -1 && unfinishedTaskSet.indexOf(item.id) < 0
							);
							const userTaskList = elementRegistry.filter(
								(item) => item.type === 'bpmn:UserTask'
								);
							// 此时得到的userTaskList 便是流程图中所有的节点的集合
							console.log(nodeList, elementRegistry);
							// 步骤2 ：为节点添加颜色
							// 方式1 ：modeling.setColor(参数1：节点，可以是单个元素实例，也可是多个节点组成的数组，参数2：class类);
							let modeling = this.bpmnModeler.get('modeling');
							nodeList.forEach(item => {
								modeling.setColor(item, {
									stroke: 'green',
									fill: 'rgb(197 255 197)'
								});
							});
							
							userTaskList.forEach(item => {
								let nodename = item.businessObject.$attrs['flowable:assignee'].replace('${','').replace('}','')
								if (nodename == 'assignee') {
									nodename = nodename + 'List';
								}
								if (nodename == 'startUserName' && !that.runVariables[nodename+'Str']) {
									nodename = 'initiator';
								}
								modeling.updateLabel(item, item.businessObject.name + '\n' + (that.runVariables[nodename+'Str']&&that.runVariables[nodename+'Str'].length>0?that.runVariables[nodename+'Str'].join(','):'无'));
							});
							// this.setProcessStatus(this.processNodeInfo) // 未起作用，可能是css问题
						} else {
							console.log('something went wrong:', err);
						}
					});
				},200)
			},
			// 设置流程图元素状态
			setProcessStatus (processNodeInfo) {
				this.processNodeInfo = processNodeInfo;
				// if (this.isLoading || this.processNodeInfo == null || this.bpmnModeler == null) return;
				let { finishedSequenceFlowSet, finishedTaskSet, unfinishedTaskSet } = this.processNodeInfo;
				const canvas = this.bpmnModeler.get('canvas');
				const elementRegistry = this.bpmnModeler.get('elementRegistry');
				if (Array.isArray(finishedSequenceFlowSet)) {
					finishedSequenceFlowSet.forEach(item => {
					if (item != null) {
						canvas.addMarker(item, 'success');
						let element = elementRegistry.get(item);
						const conditionExpression = element.businessObject.conditionExpression;
						if (conditionExpression) {
							canvas.addMarker(item, 'condition-expression');
						}
					}
					});
				}
				if (Array.isArray(finishedTaskSet)) {
					finishedTaskSet.forEach(item => {
					canvas.addMarker(item, 'success');
					});
				}
				if (Array.isArray(unfinishedTaskSet)) {
					unfinishedTaskSet.forEach(item => {
					canvas.addMarker(item, 'current');
					});
				}
			}
		},
	};
</script>

<style scoped lang="scss">
	@import "../../assets/css/dialog.scss"
</style>


