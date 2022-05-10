<!--
 * @Descripttion:隐蔽工程管理
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 14:10:50
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 14:10:57
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div class="input-box">
				<div class="input-label">监理单位：</div>
				<div class="input-value">
					<el-input placeholder="请输入监理单位"></el-input>
				</div>

			</div>
			<div class="input-box">
				<div class="input-label">施工单位：</div>
				<div class="input-value">
					<el-input placeholder="请输入施工单位"></el-input>
				</div>
			</div>
			<el-button type="primary">搜索</el-button>

			<div class="right-btns">
				<el-button type="primary" size="small"
					:icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
					@click="operateBtnsVisible=!operateBtnsVisible"></el-button>
				<div class="operate-btns" v-show="operateBtnsVisible">
					<el-button size="small" @click="addNew">新增</el-button>
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
					<el-table-column prop="pro" align="center" label="项目名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="qualityfirstname" align="center" label="施工单位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="qualitysecondname" align="center" label="合同号" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="uploadname" align="center" label="监理单位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="modifyname" align="center" label="施工标段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="modifydate" align="center" label="监理标段">
					</el-table-column>
					<el-table-column prop="modifytime" align="center" label="状态描述">
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
		<el-dialog class="full-dialog" :title="dialogTitle" fullscreen="true" :visible.sync="dialogFormVisible">
			<el-container>
				<el-main
					style="background-color: rgb(228, 228, 228);height: calc(100vh - 50px); overflow-y: scroll;padding: 0px;margin: 0;">
					<div class="form-bg">
						<div class="form-content">
							<el-form ref="form" label-width="80px">
								<div class="form-title"><strong>隐蔽功能验收记录</strong></div>
								<div class="form-sub-title">浙公路（JL）011</div>
								<div class="form-block">
									<div class="form-block-title"><strong>基本信息</strong></div>
									<div class="block-line">
										<div class="block-item-2">
											<div class="block-item-label">项目名称</div>
											<div class="block-item-value">235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-2">
											<div class="block-item-label">施工单位</div>
											<div class="block-item-value">
												中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司</div>
										</div>
										<div class="block-item-2">
											<div class="block-item-label">合同号</div>
											<div class="block-item-value">235SJSG01</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-2">
											<div class="block-item-label">监理单位</div>
											<div class="block-item-value">浙江交科公路水运工程监理有限公司</div>
										</div>
										<div class="block-item-2">
											<div class="block-item-label">工程编号</div>
											<div class="block-item-value"></div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title"><strong>隐蔽功能信息</strong></div>
									<div class="block-line">
										<div class="block-item-2">
											<div class="block-item-label">分项工程</div>
											<div class="block-item-value">1-0#立柱</div>
										</div>
										<div class="block-item-2">
											<div class="block-item-label">单位、分部工程</div>
											<div class="block-item-value">k44+281.4杭金衢分离大桥基础及下部构造</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-2">
											<div class="block-item-label">隐蔽工程项目</div>
											<div class="block-item-value">1-0#立柱钢筋安装</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-2">
											<div class="block-item-label">施工自检结果</div>
											<div class="block-item-value">符合要求</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-2">
											<div class="block-item-label">附件清单</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-table-title">附件</div>
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
								<div class="form-block">
									<div class="form-block-title"><strong>监理办验收情况</strong></div>
								</div>
								<div class="form-block">
									<div class="form-block-title"><strong>审批意见</strong></div>
									<div class="block-line">
										<div class="block-table-title">意见</div>
									</div>
									<div class="block-line">
										<div class="block-item-3">
											<div class="block-item-label">处理人</div>
											<div class="block-item-value">江逸</div>
										</div>
										<div class="block-item-3">
											<div class="block-item-label">处理操作</div>
											<div class="block-item-value">同意</div>
										</div>
										<div class="block-item-3">
											<div class="block-item-label">处理时间</div>
											<div class="block-item-value">2022-04-19 11:30:31</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title"><strong>待审批人</strong></div>
									<div class="block-line">
										<div class="block-item-3">
											<div class="block-item-label">项目质检负责人</div>
											<div class="block-item-value">江逸</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-3">
											<div class="block-item-label">项目施工负责人</div>
											<div class="block-item-value">赵赞文</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-3">
											<div class="block-item-label">项目质检负责人审批意见</div>
											<div class="block-item-value"></div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item-3">
											<div class="block-item-label">项目施工负责人审批意见</div>
											<div class="block-item-value"></div>
										</div>
									</div>
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
					style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 50px);">
					<div class="log-btns">
						<el-button size="medium" type="primary" plain>流程图</el-button>
						<el-button class="print-btn" size="medium" type="primary">打印预览</el-button>
						<el-button class="print-select-btn" size="medium" type="primary" icon="el-icon-arrow-down">
						</el-button>
					</div>
					<div class="log-content">
						<el-tabs v-model="activeName">
							<el-tab-pane label="流程日志" name="first">
								<el-collapse>
									<el-collapse-item name="1">
										<template slot="title">
										      项目质检负责人(同意)江逸
										</template>
										<div class="log-line">
											<div class="log-line-label">审批模板.审批意见：</div>
											<div class="log-line-value">无</div>
										</div>
									</el-collapse-item>
									<el-collapse-item title=" 开始(提交)" name="2">
										<div class="log-line">
											<div class="log-line-label">项目名称：</div>
											<div class="log-line-value">235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程</div>
										</div>
										<div class="log-line">
											<div class="log-line-label">施工单位：</div>
											<div class="log-line-value">中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司</div>
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
	export default {
		data() {
			return {
				tableData: [],
				operateBtnsVisible: false,
				currentPage: 1,
				totalPage: 1,
				pageSize: 20,
				dialogTitle: '新建',
				dialogFormVisible: true,
				annexTableData: [],
				activeName: 'first',
				waitTableData: [],
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
	.container-box {
		color: #000000;
		background-color: #ebecee;
		padding: 0 20px;

		.el-header {
			line-height: 60px;
			background-color: #ffffff;
			display: flex;
			align-items: center;
			// justify-content: space-between;

			.input-box {
				min-width: 220px;
				display: flex;
				margin: 0 20px;
			}

			.right-btns {
				position: absolute;
				right: 20px;

				.el-button {
					margin-left: 0 !important;
				}

				.operate-btns {
					display: initial;
				}
			}

		}

		.el-main {
			padding: 0;
			margin-top: 10px;
			display: flex;
			// flex-direction: column;
			justify-content: space-between;

			.container {
				width: 100%;
				background-color: #FFFFFF;

				.el-pagination {
					float: right;
					height: 48px;
					line-height: 48px;
					margin-right: 20px;
				}
			}
		}
	}

	.full-dialog {
		.form-bg {
			background: rgb(255, 255, 255);
			width: 1350px;
			margin: 0px auto;
			min-height: 100%;
			padding: 30px 10px 10px;
			overflow-y: auto;
		}

		.form-title {
			font-size: 24px;
			width: 100%;
			margin: 16px 0;
			font-family: Microsoft YaHei;
			text-align: center;
		}

		.form-sub-title {
			text-align: right;
			word-break: break-all;
			width: 100%;
			font-size: 16px;
			min-height: 35px;
		}

		.form-block {
			.form-block-title {
				margin: 16px 0;
				font-family: "Microsoft YaHei";
				font-size: 18px;
			}

			.block-line {
				line-height: 40px;
				display: inline-flex;
				font-size: 16px;
				width: 100%;
				position: relative;

				.block-item-2 {
					width: 50%;
					display: inline-flex;
				}

				.block-item-3 {
					width: 33.33%;
					display: inline-flex;
				}

				.block-item-label {
					width: 160px;
					padding-left: 40px;
				}

				.block-item-value {
					width: calc(100% - 200px);
				}

				.block-table-title {
					margin-left: 20px;
				}

				.block-table-btns {
					position: absolute;
					right: 20px;
				}
			}
		}


		.is-fullscreen {
			background-color: #E4E4E4 !important;
		}

		.close-wrapper {
			position: relative;
			background: #dcdfe6;
			overflow: hidden;
			z-index: 1000;
		}

		.close-wrap {
			cursor: pointer;
			color: #fff;
			position: absolute;
			left: 0;
			top: calc(50% - 60px);
			width: 8px;
			height: 120px;
			line-height: 60px;
			background: #409eff;
			display: -webkit-box;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-orient: vertical;
			-webkit-box-direction: normal;
			-ms-flex-direction: column;
			flex-direction: column;
			-webkit-box-pack: center;
			-ms-flex-pack: center;
			justify-content: center;
			-webkit-box-align: center;
			-ms-flex-align: center;
			align-items: center;
		}

		.log-btns {
			margin-top: 20px;
			text-align: right;
			padding-right: 10px;
			height: 46px;
			line-height: 46px;

			.print-btn {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0px;
			}

			.print-select-btn {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0px;
				margin: 0;
				width: 28px;
				text-align: center;
				border-left: 1px solid #fff;
				padding-left: 0;
				padding-right: 0;
				border-left-color: rgba(255, 255, 255, .5);
			}
		}

		.log-content {
			background-color: #FFFFFF;
			
			.log-line{
				display: inline-flex;
				width: calc(100% - 40px);
				margin: 0 20px;
				line-height: 28px;
				
				
			}
		}
	}
</style>
<style>
	.el-dialog__body {
		padding: 0;
		width: 100%;
		color: #606266;
		height: calc(100vh - 50px);
	}

	.el-dialog__title {
		font-size: 16px;
		line-height: 16px;
	}

	.el-dialog__header {
		height: 50px;
		padding: 17px 20px;
		border-bottom: 1px solid #ebebeb;
	}
</style>
