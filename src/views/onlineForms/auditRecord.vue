<template>
	<div>
		<div class="log-btns">
			<el-button size="medium" @click="createFlow">流程图</el-button>
			<el-button v-if="false" class="print-btn" size="medium" type="primary">打印预览</el-button>
			<el-button v-if="false" class="print-select-btn" size="medium" type="primary" icon="el-icon-arrow-down">
			</el-button>
		</div>

		<div class='record_wrapper'>
			<div class='record_title'>审批记录</div>
			<div class='record_content'>
				<el-steps direction="vertical" :active="3" :space="120">
					<el-step v-for="(item, index) in stepData" :key="index" finish-status="success">
						<template #icon>
							<div class="step_icon">
								<i :class="item.icon"></i>
								<div class="step_title">{{ item.taskName }}</div>
							</div>
						</template>
						<template #description>
							<div class="content">
								<div class="tpp">
									<div>
										<div class="descStyle">
											<div v-if="item.createName" style="margin-right: 20px; display: inline-block">{{item.approvalType === 'save'?'发起人':'审核人'}}：{{ item.createName }}</div>
											<div v-if="item.comment">{{item.approvalType === 'save'?'执行内容':'审核意见'}}： {{ item.comment }}</div>
											<div v-if="item.approvalType">执行状态： {{ item.approvalType === 'save'? '已提交':(item.approvalType === 'agree'? '同意':'驳回') }}</div>
											<div v-if="item.createTime">提交时间： {{ item.createTime }}</div>
										</div>
									</div>
								</div>
							</div>
						</template>
					</el-step>
				</el-steps>
			</div>
		</div>
		<el-drawer title="流程图" :visible.sync="dialogVisible" :with-header="false" size="90%">
			<div id="container" style="width:100%;height:100%" v-if="dialogVisible"></div>
		</el-drawer>
	</div>
  </template>
  
  <script>
	import BpmnModeler from 'bpmn-js/lib/Modeler';
	import * as api from "@/api/quality";
	import { getUserInfo } from "@/api/user";

  export default {
	props: ['taskInfo'],
	data() {
	  return {
		dialogVisible: false,
		stepData:[
			// {nodeTitle:"流程开始"},
			// {nodeTitle:"质检员提交",isSubmitNode:true,person:"王某某",auditOption:'发起工序报验',auditStatus:'已提交',submitTime:'2023年10月12日 10:30:59',icon:"el-icon-check"},
			// {nodeTitle:"项目施工负责人审核",person:"李某某",auditOption:'同意报验',auditStatus:'已审核',submitTime:'2023年10月12日 10:30:59',icon:"el-icon-check"},
			// {nodeTitle:"监理单位审核",person:"张某某",auditOption:'同意报验',auditStatus:'已审核',submitTime:'2023年10月12日 10:30:59',icon:"el-icon-check"},
			//  {nodeTitle:"流程审核完毕",icon:"el-icon-aim"}
		],
		bpmnModeler: null, // lrj 注释
		runVariables: {},
		hasTaskUser: false,
		processNodeInfo: {}
	  };
	},
	created() {

	},
	components: {

	},
	computed: {
	
	},
	mounted() {
	
	},
	watch: {

	},
	methods: {
		initData() {
			if (this.taskInfo['processDefinitionId']) {
				api.viewProcessBpmn({
					processDefinitionId: this.taskInfo['processDefinitionId']
				}).then((res) => {
					this.xmlStr = res["data"];
				});
			}
			if (this.taskInfo['processInstanceId'] && this.taskInfo['flowKey']) {
				api.getRunVariables({
					processInstanceId: this.taskInfo['processInstanceId'],
					flowKey: this.taskInfo['flowKey'],
					buildSection: this.$store.getters.project.id,
					projectId: this.$store.getters.project['parentid'],
				}).then((res) => {
					this.runVariables = res['data'];

				})
			}
			if (this.taskInfo['processInstanceId']) {
				api.viewHighlightFlowData({
					processInstanceId: this.taskInfo['processInstanceId']
				}).then((res) => {
					this.processNodeInfo = res.data;
					// 未完成的任务节点集合
					let unfinishedTaskNodeSet = res.data.unfinishedTaskNodeSet;
					api.listFlowTaskComment({
						processInstanceId: this.taskInfo["processInstanceId"]
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
						let flowTaskArray = res["data"] || [];
						// 完成审批的流程任务
						flowTaskArray = flowTaskArray.map(function (item, index, flowTaskArray){
							item.icon = "el-icon-check";
							return item;
						});

						unfinishedTaskNodeSet.map(function (item, index, unfinishedTaskNodeSet){
							item.icon = "el-icon-aim";
							flowTaskArray.push(item);
						});
						
						flowTaskArray.push( { taskName:"流程审核完毕", icon: this.processNodeInfo.unfinishedTaskSet.length > 0 ? "el-icon-aim": "el-icon-check" } )
						this.stepData = flowTaskArray;
						this.stepData.unshift( { taskName:"流程开始", icon:"el-icon-check" } );
						console.log(this.stepData);
					});
				});
			}
		},

		createFlow() {
			const that = this;
			this.dialogVisible = true;
			// lrj 注释
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
						const elementRegistry = this.bpmnModeler.get("elementRegistry");
						const nodeList = elementRegistry.filter(
							(item) => finishedTaskSet.indexOf(item.id) > -1 && unfinishedTaskSet.indexOf(item.id) < 0
						);
						const userTaskList = elementRegistry.filter(
							(item) => item.type === "bpmn:UserTask"
						);
			  			// 此时得到的userTaskList 便是流程图中所有的节点的集合
						console.log(nodeList, elementRegistry);
						// 步骤2 ：为节点添加颜色
						// 方式1 ：modeling.setColor(参数1：节点，可以是单个元素实例，也可是多个节点组成的数组，参数2：class类);
			  			let modeling = this.bpmnModeler.get("modeling");
						nodeList.forEach(item => {
							modeling.setColor(item, {
								stroke: "green",
								fill: "rgb(197 255 197)"
							});
			  			});
			  			userTaskList.forEach(item => {
							let nodename = item.businessObject.$attrs["flowable:assignee"].replace("${", "").replace("}", "");
							if (nodename == "assignee") {
								nodename = nodename + "List";
							}
							if (nodename == "startUserName" && !that.runVariables[nodename + "Str"]) {
								nodename = "initiator";
							}
							modeling.updateLabel(item, item.businessObject.name + "\n" + (that.runVariables[nodename + "Str"] && that.runVariables[nodename + "Str"].length > 0 ? that.runVariables[nodename + "Str"].join(",") : "无"));
			  			});
			  			// this.setProcessStatus(this.processNodeInfo) // 未起作用，可能是css问题
					} else {
						console.log('something went wrong:', err);
					}
				});
			}, 200)
		},
		// 设置流程图元素状态  // lrj 注释
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
	}
  };
  </script>
  
  <style scoped lang="scss">
.record_wrapper{
	padding:8px;
	width:100%;
	.record_title{
		font-weight: bolder;
		font-size: 16px;
		margin-bottom: 18px;
		&:before {
			float:left;
			content:" ";
			width: 4px;
			height: 18px;
			background: #355dff;
			border-radius: 0 3px 3px 0;
			 margin: 0px 8px 0px 0;
		}
	}
	.record_content{
		.el-steps--vertical{
			margin-left:150px;
			.step_icon{
				position: relative;
				.step_title{
					position: absolute;
					left: -166px;
					top: -2px;
					text-align: right;
					width: 150px;	
					font-weight: 800;
				}
			}
		}

	}
}

  </style>
  