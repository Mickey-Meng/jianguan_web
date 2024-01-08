<template>
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
  </template>
  
  <script>
	import BpmnModeler from 'bpmn-js/lib/Modeler';
	import * as api from "@/api/quality";
	import { getUserInfo } from "@/api/user";

  export default {
	props: ['taskInfo'],
	data() {
	  return {
		 stepData:[{nodeTitle:"流程开始"},
		 //{nodeTitle:"质检员提交",isSubmitNode:true,person:"王某某",auditOption:'发起工序报验',auditStatus:'已提交',submitTime:'2023年10月12日 10:30:59',icon:"el-icon-check"},
		 //{nodeTitle:"项目施工负责人审核",person:"李某某",auditOption:'同意报验',auditStatus:'已审核',submitTime:'2023年10月12日 10:30:59',icon:"el-icon-check"},
		 //{nodeTitle:"监理单位审核",person:"张某某",auditOption:'同意报验',auditStatus:'已审核',submitTime:'2023年10月12日 10:30:59',icon:"el-icon-check"},
		// {nodeTitle:"流程审核完毕",icon:"el-icon-aim"}
		],
		 runVariables: {},
		 hasTaskUser: false,
		 processNodeInfo: {}
	  };
	},
	created() {},
	components: {},
	computed: {
	
	},
	mounted() {
	
	},
	watch: {},
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
				});
			}
			if (this.taskInfo["processInstanceId"]) {
				api.listFlowTaskComment({
					processInstanceId: this.taskInfo["processInstanceId"]
				}).then((res) => {
					console.log(1111111);
					console.log(res);
					console.log(2222222);
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
					this.stepData = flowTaskArray.map(function (item, index, flowTaskArray){
						item.icon = "el-icon-check";
						return item;
					});
					this.stepData.unshift( { taskName:"流程开始", icon:"el-icon-check" } );
					console.log(this.processNodeInfo);
					this.stepData.push( { taskName:"流程审核完毕", icon: this.processNodeInfo.unfinishedTaskSet.length > 0 ? "el-icon-aim": "el-icon-check" } )
					console.log(this.stepData);
				});
			}
		}
	},
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
  