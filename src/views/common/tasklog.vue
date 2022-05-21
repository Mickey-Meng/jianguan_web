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
						<el-table-column prop="createUsername" align="center" label="执行人">
						</el-table-column>
						<el-table-column prop="approvalType" align="center" label="操作">
						</el-table-column>
						<el-table-column prop="taskComment" align="center" label="审批意见"  show-overflow-tooltip>
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
				hasTaskUser:true
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
				// api.viewHighlightFlowData({
				// 	processInstanceId:this.taskInfo['processInstanceId']
				// }).then((res) => {
				// 	debugger
				// });
				api.listFlowTaskComment({
					processInstanceId:this.taskInfo['processInstanceId']
				}).then((res) => {
					this.logData=res['data']||[];
				});
				
				if(this.taskInfo['taskId']){
					api.viewTaskUserInfo({
						processDefinitionId: this.taskInfo['processDefinitionId'],
						processInstanceId: this.taskInfo['processInstanceId'],
						taskId: this.taskInfo['taskId'],
						historic:true
					}).then((res) => {
						this.userData=res['data']||[];
					});
				}else{
					this.hasTaskUser=false;
				}
			},
			createFlow() {
				this.dialogVisible = true;
				if(this.bpmnModeler)return;
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
						} else {
							console.log('something went wrong:', err);
						}
					});
				},200)
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../assets/css/dialog.scss"
</style>


