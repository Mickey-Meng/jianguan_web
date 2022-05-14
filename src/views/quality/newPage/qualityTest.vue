<!--
 * @Descripttion:质量检测
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 14:10:50
 * @LastEditors: yangtao
 * @LastEditTime: 2022-05-11 14:10:57
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.buildSection" placeholder="标段"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.name" placeholder="材料名称"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.specification" placeholder="材料规格"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-select v-model="queryData.detectionResult" placeholder="检测结果">
						<el-option v-for="item in examineResultOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-date-picker v-model="queryData.createEndTime" type="date" placeholder="开始日期">
					</el-date-picker>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-date-picker v-model="queryData.createStartTime" type="date" placeholder="结束日期">
					</el-date-picker>
				</div>
			</div>


			<el-button type="primary" @click="query">搜索</el-button>

			<div class="right-btns">
				<!-- <el-button type="primary" size="small"
					:icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
					@click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
				<div class="operate-btns" v-show="operateBtnsVisible">
					<el-button size="small" @click="addNew">新增质量检测</el-button>
					<el-button size="small">导出</el-button>
					<el-button size="small">批量操作</el-button>
				</div>
			</div>
		</el-header>
		<el-main>
			<div class="container">
				<el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
					class="have_scrolling">
					<el-table-column type="index" width="50" align="center" label="序号">
					</el-table-column>
					<el-table-column prop="buildSection" align="center" label="标段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="materialsName" align="center" label="材料名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="fillDate" align="center" label="填报日期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="materialSpecification" align="center" label="材料规格" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="projectParts" align="center" label="工程部位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="testResult" align="center" label="检测结果">
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button type="text" size="mini">详情</el-button>
							<el-button type="text" size="mini" @click="deleteRow(row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="queryData.pageNum" :page-size="queryData.pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="queryData.totalPage">
				</el-pagination>
			</div>
		</el-main>
		<el-dialog class="full-dialog defined-dialog" fullscreen="true" :visible.sync="dialogFormVisible">
			<template slot="title">
				{{dialogTitle}}
				<div class="logo-icon"></div>
			</template>
			<el-container>
				<el-main
					style="background-color: rgba(0,0 0,0.5);height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
					<div class="form-bg">
						<div class="form-content">
							<el-form ref="form" label-width="80px">
								<div class="form-title">
									<div class="title-big-bar"></div>
									<strong>质量检测</strong>
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
											<div class="block-item-value">235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">合同号</div>
											<div class="block-item-value">235SJSG01</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">施工单位</div>
											<div class="block-item-value">
												中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">监理单位</div>
											<div class="block-item-value">浙江交科公路水运工程监理有限公司</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">监理标段</div>
											<div class="block-item-value">
												监理办</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">报验单号<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input></el-input>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">填报日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-date-picker type="date" placeholder="请选择">
												</el-date-picker>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>检测信息</strong>
									</div>
									<div class="block-line">
										<el-button size="small" @click="addExamine" type="primary">新增</el-button>
									</div>
									<div class="block-table">
										<el-table :data="examineTable" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="pro" align="center" label="材料名称"
												show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="qualityfirstname" width="160px" align="center"
												label="材料来源">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="材料规格">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="工程部位">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="材料数量(吨)">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="取样地点">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="试验日期">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="实验数量">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="合格数量">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="总合格率(%)">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="检测结果">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="报告编号">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="danger" size="mini">删除</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</div>
								<div class="form-title">
									<div class="title-big-bar"></div><strong>附件上传</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>试验检测报告</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<div class="block-line">
										<el-button size="small" type="primary">点击上传</el-button>
									</div>
									<div class="block-table">
										<el-table :data="annexTableData" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="pro" align="center" label="附件" show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="qualityfirstname" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="上传人">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="primary" size="mini">下载</el-button>
													<el-button type="danger" size="mini">预览</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>出厂信息</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<div class="block-line">
										<el-button size="small" type="primary">点击上传</el-button>
									</div>
									<div class="block-table">
										<el-table :data="annexTableData" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="pro" align="center" label="附件" show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="qualityfirstname" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="上传人">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="primary" size="mini">下载</el-button>
													<el-button type="danger" size="mini">预览</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>其他附件</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<div class="block-line">
										<el-button size="small" type="primary">点击上传</el-button>
									</div>
									<div class="block-table">
										<el-table :data="annexTableData" style="width: 100%" border
											class="have_scrolling">
											<el-table-column type="index" width="50" align="center" label="序号">
											</el-table-column>
											<el-table-column prop="pro" align="center" label="附件" show-overflow-tooltip>
											</el-table-column>
											<el-table-column prop="qualityfirstname" width="160px" align="center"
												label="上传日期">
											</el-table-column>
											<el-table-column prop="qualitysecondname" width="120px" align="center"
												label="上传人">
											</el-table-column>
											<el-table-column fixed="right" width="120" align="center" label="操作">
												<template slot-scope="{ row, $index }">
													<el-button type="primary" size="mini">下载</el-button>
													<el-button type="danger" size="mini">预览</el-button>
												</template>
											</el-table-column>
										</el-table>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">备注</div>
											<div class="block-item-value">
												<el-input type="textarea" :rows="4" placeholder="请输入"></el-input>
											</div>
										</div>
									</div>
								</div>

								<div class="form-title">
									<div class="title-big-bar"></div><strong>审核人员</strong>
								</div>
								<div class="form-block">
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">岗位</div>
											<div class="block-item-value">
												施工负责人
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">审核人<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-select v-model="value" placeholder="请选择">
													<el-option v-for="item in options" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label"></div>
											<div class="block-item-value">
												<el-select v-model="value" placeholder="请选择">
													<el-option v-for="item in options" :key="item.value"
														:label="item.label" :value="item.value">
													</el-option>
												</el-select>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<el-button class="submit-btn" size="small" type="primary">提交</el-button>
								</div>
							</el-form>
						</div>
					</div>
				</el-main>
				<el-aside width="8px" class="close-wrapper">
					<div class="close-wrap">
						<i class="el-icon-caret-right"></i>
					</div>
				</el-aside>
				<el-aside
					style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
					<div class="log-btns">
						<el-button size="medium">流程图</el-button>
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
				</el-aside>
			</el-container>
		</el-dialog>
		<el-dialog class="defined-dialog" title="新增" :visible.sync="examineVisible">
			<el-form ref="form" label-width="80px">
				<div class="form-block">
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">材料名称<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-select v-model="value" placeholder="请选择">
									<el-option v-for="item in materialOptions" :key="item.value" :label="item.label"
										:value="item.value">
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">材料来源</div>
							<div class="block-item-value">
								<el-input></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">材料规格</div>
							<div class="block-item-value">
								<el-input></el-input>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">工程部位</div>
							<div class="block-item-value">
								<el-input></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">材料数量(吨)</div>
							<div class="block-item-value">
								<el-input></el-input>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">取样地点</div>
							<div class="block-item-value">
								<el-input></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">试验日期</div>
							<div class="block-item-value">
								<el-date-picker type="date" placeholder="请选择">
								</el-date-picker>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">试验数量<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-input></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">合格数量<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-input></el-input>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">总合格率(%)<i class="require-icon"></i></div>
							<div class="block-item-value">
								<el-input></el-input>
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">检测结果</div>
							<div class="block-item-value">
								<el-select v-model="queryData.detectionResult" placeholder="请选择">
									<el-option v-for="item in examineResultOptions" :key="item.value"
										:label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">报告编号</div>
							<div class="block-item-value">
								<el-input></el-input>
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<el-button class="submit-btn" size="small" type="primary">提交</el-button>
				</div>
			</el-form>
		</el-dialog>
	</el-container>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions
	} from "@/utils/format.js";
	
	export default {
		data() {
			return {
				examineResultOptions: [{
					label: '全部',
					value: null
				}, {
					label: '合格',
					value: '0'
				}, {
					label: '不合格',
					value: '1'
				}],
				allData: [],
				tableData: [],
				operateBtnsVisible: true,
				currentPage: 1,
				totalPage: 1,
				pageSize: 20,
				dialogTitle: '智慧建设通用版-【绍兴市】235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
				dialogFormVisible: false,
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				options: [],
				queryData: {
					buildSection: null,
					createEndTime: null,
					createStartTime: null,
					detectionResult: null,
					draftFlag: 1,
					name: '',
					specification: '',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
				},
				examineVisible: false, //检测信息弹窗是否显示
				examineInfo: { //检测信息弹窗信息
					address: null,
					detectionResult: 0,
					name: '',
					num: null,
					projectPart: '',
					qualifiedNum: '',
					qualifiedRate: '',
					reportCode: '',
					specification: '',
					takeAddress: '',
					testDate: '',
					testNum: ''
				},
				examineTable: [],
				materialOptions:[],
			};
		},
		created() {},
		components: {},
		computed: {},
		mounted() {
			this.query();
			this.getMaterialEnums();
		},
		methods: {
			query() {
				api.getQualityDetectionList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.formateTableData(res.data.list);
					this.queryData.pageNum=res.data.pageNum;
					this.queryData.totalPage=res.data.total;
					this.queryData.pageSize=res.data.pageSize;
				});
			},
			getMaterialEnums(){
				api.getMaterialEnums().then((res) => {
					let options = res.data || [];
					this.materialOptions=convertOptions(options);
				});
			},
			formateTableData(list) {
				list = list || [];
				list.forEach(item => {
					item['materialSpecification'] = item['materialSpecification'].join('、');
					item['materialsName'] = item['materialsName'].join('、');
					item['projectParts'] = item['projectParts'].join('、');
					item['testResult'] = item['testResult'].join('、');
				})
				return list;
			},
			addNew() {
				this.dialogFormVisible = true;
			},
			deleteRow(row) {
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					api.deleteQualityDetection(row['id']).then((res) => {
						this.query();
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
					}).catch(error=>{
						this.$message({
							type: 'fail',
							message: '删除失败!'
						});
					});
				});
			},
			addExamine() {
				this.examineVisible = true;
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			}
		},
	};
</script>
<style scoped lang="scss">
	@import "../../../assets/css/common.scss"
</style>
