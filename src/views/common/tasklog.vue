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
		props:['currentRow'],
		data() {
			return {
				dialogVisible: false,
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				bpmnModeler: null,
			};
		},
		created() {},
		components: {},
		computed: {},
		mounted() {
		},
		methods: {
			createFlow() {
				this.dialogVisible = true;
				setTimeout(() => {
					const containerElement = document.getElementById('container');
					this.bpmnModeler = new BpmnModeler({
						container: containerElement,
						additionalModules: [{
							paletteProvider: ["value", ''], // 禁用/清空左侧工具栏
							labelEditingProvider: ["value", ''], // 禁用节点编辑
							contextPadProvider: ["value", ''], // 禁用图形菜单
							// bendpoints: ["value", {}], // 禁用连线拖动
							// zoomScroll: ["value", ''], // 禁用滚动
							// moveCanvas: ['value', ''], // 禁用拖动整个流程图
							// move: ['value', ''] // 禁用单个图形拖动
						}]
					});
					const xmlString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<bpmn2:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn2=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xmlns:flowable=\"http://flowable.org/bpmn\" id=\"diagram_hiddenProject\" targetNamespace=\"http://flowable.org/bpmn\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\">\n  <bpmn2:process id=\"hiddenProject\" name=\"隐蔽工程验收记录\" isExecutable=\"true\">\n    <bpmn2:startEvent id=\"Event_1hydd68\">\n      <bpmn2:outgoing>Flow_0mhqeco</bpmn2:outgoing>\n    </bpmn2:startEvent>\n    <bpmn2:userTask id=\"Activity_0y3krd6\" name=\"项目质检负责人\" flowable:formKey=\"{&#34;routerName&#34;:&#34;hiddenProject&#34;,&#34;readOnly&#34;:true,&#34;groupType&#34;:&#34;ASSIGNEE&#34;}\" flowable:assignee=\"admin\">\n      <bpmn2:extensionElements>\n        <flowable:operationList />\n        <flowable:variableList />\n        <flowable:copyItemList />\n      </bpmn2:extensionElements>\n      <bpmn2:incoming>Flow_0mhqeco</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_0irs9tz</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:userTask id=\"Activity_0sykucb\" name=\"项目施工负责人\" flowable:formKey=\"{&#34;routerName&#34;:&#34;hiddenProject&#34;,&#34;readOnly&#34;:true,&#34;groupType&#34;:&#34;ASSIGNEE&#34;}\" flowable:assignee=\"admin\">\n      <bpmn2:extensionElements>\n        <flowable:operationList />\n        <flowable:variableList />\n        <flowable:copyItemList />\n      </bpmn2:extensionElements>\n      <bpmn2:incoming>Flow_0irs9tz</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_0ugz1ug</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:userTask id=\"Activity_0fthl63\" name=\"现场监理人员\" flowable:formKey=\"{&#34;routerName&#34;:&#34;hiddenProject&#34;,&#34;readOnly&#34;:true,&#34;groupType&#34;:&#34;ASSIGNEE&#34;}\" flowable:assignee=\"admin\">\n      <bpmn2:extensionElements>\n        <flowable:operationList />\n        <flowable:variableList />\n        <flowable:copyItemList />\n      </bpmn2:extensionElements>\n      <bpmn2:incoming>Flow_0ugz1ug</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_044phlv</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:endEvent id=\"Event_1p3sq99\">\n      <bpmn2:incoming>Flow_191yyxv</bpmn2:incoming>\n    </bpmn2:endEvent>\n    <bpmn2:sequenceFlow id=\"Flow_0mhqeco\" sourceRef=\"Event_1hydd68\" targetRef=\"Activity_0y3krd6\" />\n    <bpmn2:sequenceFlow id=\"Flow_0irs9tz\" sourceRef=\"Activity_0y3krd6\" targetRef=\"Activity_0sykucb\" />\n    <bpmn2:sequenceFlow id=\"Flow_0ugz1ug\" sourceRef=\"Activity_0sykucb\" targetRef=\"Activity_0fthl63\" />\n    <bpmn2:userTask id=\"Activity_0c6xew6\" name=\"专业监理工程师\" flowable:formKey=\"{&#34;routerName&#34;:&#34;hiddenProject&#34;,&#34;readOnly&#34;:true,&#34;groupType&#34;:&#34;ASSIGNEE&#34;}\" flowable:assignee=\"admin\">\n      <bpmn2:extensionElements>\n        <flowable:operationList />\n        <flowable:variableList />\n        <flowable:copyItemList />\n      </bpmn2:extensionElements>\n      <bpmn2:incoming>Flow_044phlv</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_1p2tkol</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:userTask id=\"Activity_1xvbz1n\" name=\"项目负责人\" flowable:formKey=\"{&#34;routerName&#34;:&#34;hiddenProject&#34;,&#34;readOnly&#34;:true,&#34;groupType&#34;:&#34;ASSIGNEE&#34;}\" flowable:assignee=\"admin\">\n      <bpmn2:extensionElements>\n        <flowable:operationList />\n        <flowable:variableList />\n        <flowable:copyItemList />\n      </bpmn2:extensionElements>\n      <bpmn2:incoming>Flow_1p2tkol</bpmn2:incoming>\n      <bpmn2:outgoing>Flow_191yyxv</bpmn2:outgoing>\n    </bpmn2:userTask>\n    <bpmn2:sequenceFlow id=\"Flow_044phlv\" sourceRef=\"Activity_0fthl63\" targetRef=\"Activity_0c6xew6\" />\n    <bpmn2:sequenceFlow id=\"Flow_1p2tkol\" sourceRef=\"Activity_0c6xew6\" targetRef=\"Activity_1xvbz1n\" />\n    <bpmn2:sequenceFlow id=\"Flow_191yyxv\" sourceRef=\"Activity_1xvbz1n\" targetRef=\"Event_1p3sq99\" />\n  </bpmn2:process>\n  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"hiddenProject\">\n      <bpmndi:BPMNEdge id=\"Flow_0mhqeco_di\" bpmnElement=\"Flow_0mhqeco\">\n        <di:waypoint x=\"258\" y=\"290\" />\n        <di:waypoint x=\"360\" y=\"290\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0irs9tz_di\" bpmnElement=\"Flow_0irs9tz\">\n        <di:waypoint x=\"460\" y=\"290\" />\n        <di:waypoint x=\"530\" y=\"290\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_0ugz1ug_di\" bpmnElement=\"Flow_0ugz1ug\">\n        <di:waypoint x=\"630\" y=\"290\" />\n        <di:waypoint x=\"730\" y=\"290\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_044phlv_di\" bpmnElement=\"Flow_044phlv\">\n        <di:waypoint x=\"830\" y=\"290\" />\n        <di:waypoint x=\"930\" y=\"290\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_1p2tkol_di\" bpmnElement=\"Flow_1p2tkol\">\n        <di:waypoint x=\"1030\" y=\"290\" />\n        <di:waypoint x=\"1100\" y=\"290\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNEdge id=\"Flow_191yyxv_di\" bpmnElement=\"Flow_191yyxv\">\n        <di:waypoint x=\"1200\" y=\"290\" />\n        <di:waypoint x=\"1312\" y=\"290\" />\n      </bpmndi:BPMNEdge>\n      <bpmndi:BPMNShape id=\"Event_1hydd68_di\" bpmnElement=\"Event_1hydd68\">\n        <dc:Bounds x=\"222\" y=\"272\" width=\"36\" height=\"36\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0y3krd6_di\" bpmnElement=\"Activity_0y3krd6\">\n        <dc:Bounds x=\"360\" y=\"250\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Event_1p3sq99_di\" bpmnElement=\"Event_1p3sq99\">\n        <dc:Bounds x=\"1312\" y=\"272\" width=\"36\" height=\"36\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0sykucb_di\" bpmnElement=\"Activity_0sykucb\">\n        <dc:Bounds x=\"530\" y=\"250\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0fthl63_di\" bpmnElement=\"Activity_0fthl63\">\n        <dc:Bounds x=\"730\" y=\"250\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_0c6xew6_di\" bpmnElement=\"Activity_0c6xew6\">\n        <dc:Bounds x=\"930\" y=\"250\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n      <bpmndi:BPMNShape id=\"Activity_1xvbz1n_di\" bpmnElement=\"Activity_1xvbz1n\">\n        <dc:Bounds x=\"1100\" y=\"250\" width=\"100\" height=\"80\" />\n      </bpmndi:BPMNShape>\n    </bpmndi:BPMNPlane>\n  </bpmndi:BPMNDiagram>\n</bpmn2:definitions>\n";
					this.bpmnModeler.importXML(xmlString, (err) => {
						if (!err) {
							// 让图能自适应屏幕
							const canvas = this.bpmnModeler.get('canvas')
							canvas.zoom('fit-viewport')
						} else {
							console.log('something went wrong:', err);
						}
					});
				}, 1000)
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../assets/css/dialog.scss"
</style>


