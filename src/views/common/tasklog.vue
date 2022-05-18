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
				<el-tab-pane label="流程日志" name="first">
					<el-collapse>
						<el-collapse-item name="1">
							<template slot="title">
								<span class="process-index">2</span>
								项目质检负责人(同意)江逸2022-04-19 11:30:31
							</template>
							<div class="log-line">
								<div class="log-line-label">审批模板.审批意见：</div>
								<div class="log-line-value">无</div>
							</div>
						</el-collapse-item>
						<el-collapse-item name="2">
							<template slot="title">
								<span class="process-index">1</span>
								开始(提交)黄志庆2022-04-18 20:32:43
							</template>
							<div class="log-line">
								<div class="log-line-label">项目名称：</div>
								<div class="log-line-value">235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">施工单位：</div>
								<div class="log-line-value">
									中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">合同号：</div>
								<div class="log-line-value">SJSG01</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">监理单位：</div>
								<div class="log-line-value">浙江交科公路水运工程监理有限公司</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">工程编号：</div>
								<div class="log-line-value">无</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">文件标题：</div>
								<div class="log-line-value">1-0#立柱隐蔽工程验收记录</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">分项工程：</div>
								<div class="log-line-value">1-0#立柱</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">单位分部工程：</div>
								<div class="log-line-value">k44+281.4杭金衢分离大桥基础及下部构造</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">隐蔽工程项目：</div>
								<div class="log-line-value">1-0#立柱钢筋安装</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">施工自检结果：</div>
								<div class="log-line-value">符合要求</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">附件清单：</div>
								<div class="log-line-value">无</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">上传</div>
							</div>
							<el-table :data="annexTableData" style="width: 100%" border
								class="have_scrolling">
								<el-table-column prop="pro" align="center" label="附件" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="qualityfirstname" width="160px" align="center"
									label="上传日期">
								</el-table-column>
								<el-table-column prop="qualitysecondname" width="120px" align="center"
									label="上传人">
								</el-table-column>
								<el-table-column fixed="right" width="80" align="center" label="操作">
									<template slot-scope="{ row, $index }">
										<el-button type="primary" size="mini">下载</el-button>
										<el-button type="danger" size="mini">预览</el-button>
									</template>
								</el-table-column>
							</el-table>
							<div class="log-line">
								<div class="log-line-label">流程状态：</div>
								<div class="log-line-value">无</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">流程状态：</div>
								<div class="log-line-value">无</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">项目质检负责人处理次数：</div>
								<div class="log-line-value">0</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">项目施工负责人处理次数：</div>
								<div class="log-line-value">0</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">现场监理人员处理次数：</div>
								<div class="log-line-value">0</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">项目质检负责人：</div>
								<div class="log-line-value">江逸</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">项目施工负责人：</div>
								<div class="log-line-value">赵赞文</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">项目质检负责人审批意见：</div>
								<div class="log-line-value">无</div>
							</div>
							<div class="log-line">
								<div class="log-line-label">项目施工负责人审批意见：</div>
								<div class="log-line-value">无</div>
							</div>
						</el-collapse-item>
					</el-collapse>
				</el-tab-pane>
				<el-tab-pane label="待处理人" name="second">
					<el-table :data="waitTableData" style="width: 100%" border class="have_scrolling">
						<el-table-column prop="pro" align="center" label="当前节点" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="qualityfirstname" align="center" label="处理人">
						</el-table-column>
						<el-table-column prop="qualitysecondname" align="center" label="处理操作">
						</el-table-column>
						<el-table-column align="center" label="操作">
							<template slot-scope="{ row, $index }">
								<el-button type="primary" size="mini">催办</el-button>
							</template>
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
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				bpmnModeler: null,
				xmlStr:''
			};
		},
		created() {},
		components: {},
		computed: {},
		mounted() {
			
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
				console.log(res);
			});
		},
		methods: {
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


