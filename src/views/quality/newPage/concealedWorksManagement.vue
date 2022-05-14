<!--
 * @Descripttion:隐蔽工程管理
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
				<!-- <div class="input-label">监理单位：</div> -->
				<div class="input-value">
					<el-input placeholder="请输入监理单位"></el-input>
				</div>

			</div>
			<div class="input-box">
				<!-- <div class="input-label">施工单位：</div> -->
				<div class="input-value">
					<el-input placeholder="请输入施工单位"></el-input>
				</div>
			</div>
			<el-button type="primary">搜索</el-button>

			<div class="right-btns">
				<!-- <el-button type="primary" size="small"
					:icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
					@click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
				<div class="operate-btns" v-show="operateBtnsVisible">
					<el-button size="small" @click="addNew">新增验收记录</el-button>
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
					<el-table-column prop="projectName" align="center" label="项目名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="buildUnit" align="center" label="施工单位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="contractCode" align="center" label="合同号" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="supervisorUnit" align="center" label="监理单位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="buildSectionId" align="center" label="施工标段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="supervisorSection" align="center" label="监理标段">
					</el-table-column>
					<el-table-column prop="statusStr" align="center" label="状态描述">
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button type="primary" size="mini">详情</el-button>
							<el-button type="danger" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
					:total="totalPage">
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
									<strong>隐蔽功能验收记录-浙公路（JL）011</strong>
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
											<div class="block-item-label">项目名称</div>
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
											<div class="block-item-label">工程编号</div>
											<div class="block-item-value">
												<el-input></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>隐蔽功能信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">分项工程<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input placeholder="请输入工程编号"></el-input>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">单位、分部工程<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input placeholder="请输入单位、分部工程"></el-input>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">隐蔽工程项目<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input type="textarea" :rows="4" placeholder="请输入隐蔽工程项目"></el-input>
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">施工自检结果<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input type="textarea" :rows="4" placeholder="请输入施工自检结果"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件清单</strong>
										<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
									</div>

									<div class="block-line">
										<el-button size="small" type="primary">点击上传</el-button>
										<!-- <div class="block-table-title">附件</div> -->
										<div class="block-table-btns">
											<el-button size="small" type="primary">下载全部</el-button>
										</div>
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

								<div class="form-title">
									<div class="title-big-bar"></div><strong>监理办验收情况</strong>
								</div>

								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>审批意见</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">处理人</div>
											<div class="block-item-value">江逸</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">处理操作</div>
											<div class="block-item-value">同意</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">处理时间</div>
											<div class="block-item-value">2022-04-19 11:30:31</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>待审批人</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">项目质检负责人<i class="require-icon"></i></div>
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
											<div class="block-item-label">项目施工负责人<i class="require-icon"></i></div>
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
											<div class="block-item-label">现场监理人员<i class="require-icon"></i></div>
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
											<div class="block-item-label">专业监理工程师<i class="require-icon"></i></div>
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
											<div class="block-item-label">项目负责人<i class="require-icon"></i></div>
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
	</el-container>
</template>

<script>
	import * as api from "@/api/quality";
	export default {
		data() {
			return {
				tableData: [],
				operateBtnsVisible: true,
				currentPage: 1,
				totalPage: 1,
				pageSize: 20,
				dialogTitle: '智慧建设通用版-【绍兴市】235国道杭州',
				dialogFormVisible: true,
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
				options: [],
				queryData: {
					projectCode: '',
					subProject: '',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
				},
			};
		},
		created() {},
		components: {},
		computed: {},
		methods: {
			addNew() {
				this.dialogFormVisible = true;
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