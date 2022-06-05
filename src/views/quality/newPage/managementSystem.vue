<!--
@name:
@description: 管理制度
@author: zhouhai
@time: 2022-05-13 09:17:45
@modifier:
@modifierTime:
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div class="right-btns">
				<!-- <el-button type="primary" size="small"
					:icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
					@click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
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
					<el-table-column prop="pro" align="center" label="编制单位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="qualityfirstname" align="center" label="编制人" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="compileDate" align="center" label="编制时间" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="regimeContent" align="center" label="制度内容" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="updateTime" align="center" label="更新时间" show-overflow-tooltip>
					</el-table-column>
					<el-table-column align="center" label="数据状态" show-overflow-tooltip>
						已生效
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button type="text" size="mini" @click="viewDetail(row)">详情</el-button>
							<el-button type="text" style="color: red;" size="mini" @click="deleteManageRegime(row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
					:total="totalPage">
				</el-pagination>
			</div>
		</el-main>
		<el-dialog class="full-dialog defined-dialog" :fullscreen="true" :visible.sync="dialogFormVisible">
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
									<strong>管理制度</strong>
									<div class="form-btns" v-show="!previewMode">
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
											<div class="block-item-label">编制人：</div>
											<div class="block-item-value">{{formData.userName}}</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">编制日期<i class="require-icon"></i></div>
											<el-date-picker type="date" v-model="formData.compileDate" placeholder="选择日期" :disabled="previewMode"></el-date-picker>
										</div>
									</div>
								</div>
								<div class="form-title">
									<div class="title-big-bar"></div><strong>制度信息</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>制度文件</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 jpg/jpeg png mp4 docx doc xlsx xls pdf zip 文件，且不超过 200M</span>
									</div>
									
									<attachlist :editAble="true" ref="attachlist" :attachTable="attachTable"></attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">制度内容<i class="require-icon"></i></div>
											<div class="block-item-value">
												<el-input type="textarea" style="width: 600px" :rows="15" placeholder="请输入" v-model="formData.regimeContent" :disabled="previewMode"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<el-button class="submit-btn" size="small" type="primary" @click="addManagedSystem" v-show="!previewMode">提交</el-button>
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
						<el-button class="print-btn" size="medium" type="primary">打印预览</el-button>
						<el-button class="print-select-btn" size="medium" type="primary" icon="el-icon-arrow-down">
						</el-button>

						<el-button size="medium" @click="changeManageRegime">变更</el-button>
						<el-button type="danger" size="medium" @click="deleteManageRegime(formData.id)">删除</el-button>
					</div>
					<div class="log-content">
						<el-tabs v-model="activeName" type="card">
							<el-tab-pane label="表单提交记录" name="first">
								<el-collapse>
									<el-collapse-item name="1">
										<template slot="title">
											<span class="process-index">1</span>
											 吕冬敏({{formData.updateTime}}) 
										</template>
										<div class="log-line">
											<div class="log-line-label">编制单位：</div>
											<div class="log-line-value">235国道项目部</div>
										</div>
										<div class="log-line">
											<div class="log-line-label">编制人：</div>
											<div class="log-line-value">
												吕冬敏</div>
										</div>
										<div class="log-line">
											<div class="log-line-label">编制日期：</div>
											<div class="log-line-value">{{formData.compileDate}}</div>
										</div>
										<div class="log-line">
											<div class="log-line-label">上传</div>
										</div>
										
										<attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
                              
										<div class="log-line">
											<div class="log-line-label">制度内容：</div>
											<div class="log-line-value">{{formData.regimeContent}}</div>
										</div>
									</el-collapse-item>
								</el-collapse>
							</el-tab-pane>
						</el-tabs>
					</div>
				</el-aside>
			</el-container>
		</el-dialog>
	</el-container>
</template>

<script>
	Date.prototype.format = function (fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	}
	import * as api from "@/api/quality";
	import store from "@/store/index";
	import attachlist from "../../common/attachlist.vue"
	import { getUserInfo } from "@/api/user";
	export default {
		data() {
			return {
				tableData: [],
				operateBtnsVisible: true,
				currentPage: 1,
				totalPage: 1,
				pageSize: 20,
				dialogTitle: '新建',
				dialogFormVisible: false,
				annexTableData: [],
				activeName: 'first',
				queryData: {
					pageNum: 1,
					totalPage:1,
					pageSize: 10,
					projectId: this.$store.getters.project['parentid'], // 项目id
				},
				userInfo: {},
				formData: {
					id: '',
					compileDate: '2022-05-06', // 编制日期
					compileDeptName: '2022-05-06', // 编制单位名称
					compileUser: '1', // 编制人
					userName: '',	// 编制人名称
					projectName: '',// 项目名称
					regimeContent: '', // 制度内容
					projectId: this.$store.getters.project['parentid'], // 项目id
				    attachment: [ // 附件
					]
				},
				attachTable: [ // 附件
				],
				viewImgVisible: false,
				viewImgType: 'img',
				viewImgUrl: '',
			};
		},
		created() {},
		components: {
			attachlist
		},
		computed: {},
		mounted() {
			this.query();
			this.getUserInfo();
		},
		methods: {
			query() {
				api.getManageRegimeList(this.queryData).then((res) => {
				  this.tableData = res.data.list;
				});
				
			},
			getUserInfo() {
				getUserInfo(localStorage.getItem('ID')).then(res => {
					this.userInfo = res.data.userInfo;
				});
			},
			addNew() {
				this.previewMode = false;
				this.dialogFormVisible = true;
				const hasGetUserInfo = store.getters.name;
				
				this.formData.userName = hasGetUserInfo;
				this.formData.groupName = this.userInfo.GROUPNAME;
				this.formData.id = '';
				this.formData.regimeContent = '';
				this.formData.attachment = [];
				this.attachTable = [];
			},
			addManagedSystem() {
				if (this.formData.compileDate instanceof Date) this.formData.compileDate = this.formData.compileDate.format("yyyy-MM-dd");
				
				this.formData.attachment = this.attachTable;
				api.addOrUpdateManageRegimeList(this.formData).then((res) => {
				  	this.query();
					this.dialogFormVisible = false;

				});
			},
			changeManageRegime() {
				this.previewMode = false;
				this.$forceUpdate();
			},
			deleteManageRegime(id) {
				// /web/api/v1/manageTarget/id
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					api.deleteManageRegime(id).then((res) => {
						this.query();
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
					}).catch(error => {
						this.$message({
							type: 'fail',
							message: '删除失败!'
						});
					});
				});
			},
			viewDetail(row) {
				const that = this;
				// this.formData = row;
				this.dialogTitle = "查看详情";
				this.dialogFormVisible = true;
				this.previewMode = true;
				api.getManageRegime(row.id).then((res) => {
				  	if (res && res.data) {
						for (let i = 0; i < res.data.attachment.length; i++) {
							const item = res.data.attachment[i];
							item.uploadTime = new Date(item.uploadTime).format('yyyy-MM-dd hh:mm:ss')
						}
						this.formData = res.data;
						this.attachTable = res.data.attachment;
						
						// that.formData.userName = 'rers';
						getUserInfo(res.data.compileUser).then(res => {
							that.formData.userName = res.data.userInfo.NAME;
							that.formData.compileDeptName = this.userInfo.GROUPNAME;
							that.$forceUpdate();
						});
					}
				});
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			afterUpAttach(data){
				// api.getFileInfo({id: data['fileId']}).then((res) => {
				//   	if (res) {
				// 		debugger
				// 	}
				// });
				this.formData.attachment.push({
					uploadTime: new Date(data['uploadTime']).format('yyyy-MM-dd hh:mm:ss'),
					fileName: data['fileName'],
					fileUrl: data['fileId'],
					creatorName: this.userInfo.NAME,
					"createUid": "",
					"filePath": "",
					"fileSize": 0,
					"id": ""
				})
			},
		},
	};
</script>
<style scoped lang="scss">
	.container-box {
		color: #000000;
		background-color: #FAFAFA;
		padding: 0 20px;

		.el-header {
			line-height: 60px;
			// background-color: #ffffff;
			display: flex;
			align-items: center;
			padding: 0 !important;
			// justify-content: space-between;

			.input-box {
				min-width: 200px;
				display: flex;
				// margin: 0 20px;
			}

			.mini-input-box {
				width: 80px;
				min-width: 80px;
			}

			.right-btns {
				position: absolute;
				right: 20px;

				.el-button {
					// margin-left: 0 !important;
					color: #355DFF;
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
	.full-dialog{
		.form-bg {
			background: rgb(255, 255, 255);
			width: 984px;
			margin: 0px auto;
			min-height: 100%;
			padding: 30px 20px 20px;
			overflow-y: auto;
		}
	}
	.defined-dialog {
		background: rgba(0,0,0,0.5);;
		.logo-icon {
			width: 48px;
			height: 48px;
			background-image: url(../../../assets/process/logo.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			position: absolute;
			right: 20px;
			top: 24px;
			cursor: pointer;
		}

		.el-button--default {
			color: #355DFF;
		}
		.title-big-bar {
			width: 6px;
			height: 20px;
			background-image: url(../../../assets/process/bigbar.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			margin: 8px 8px 8px 0;
		}
		
		.title-bar {
			width: 4px;
			height: 20px;
			background-image: url(../../../assets/process/bar.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
			margin: 2px 8px 2px 0;
		}

		.form-title {
			font-size: 20px;
			width: 100%;
			margin: 16px 0;
			color: #191919;
			font-family: Microsoft YaHei;
			display: inline-flex;
			height: 36px;
			line-height: 36px;
			position: relative;
		}

		.form-btns {
			position: absolute;
			right: 0;
		}

		.form-block {
			.form-block-title {
				margin: 8px 0;
				font-family: "Microsoft YaHei";
				font-size: 16px;
				display: inline-flex;
				height: 24px;
				line-height: 24px;
			}

			.block-line {
				line-height: 36px;
				display: inline-flex;
				font-size: 16px;
				width: 100%;
				position: relative;
				margin: 4px 0;

				.block-item {
					width: 50%;
					display: inline-flex;
				}

				.block-item-label {
					width: 160px;
					padding-right: 20px;
					text-align: right;
					font-weight: 600;
					color: #191919;
					font-family: PingFangSC-Medium, PingFang SC;
					font-size: 14px;
					position: relative;

					.require-icon {
						width: 4px;
						height: 4px;
						background: #FF4925;
						border-radius: 4px;
						position: absolute;
						right: 10px;
						top: 16px;
					}
				}

				.block-item-value {
					width: calc(100% - 180px);
					font-size: 14px;
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

		.submit-btn {
			width: 260px;
			margin: 60px 0px 20px 160px;
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
			margin: 10px 21px;
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

			.log-line {
				display: inline-flex;
				width: calc(100% - 40px);
				margin: 0 20px;
				line-height: 28px;
			}

			.process-index {
				width: 20px;
				background: #355DFF;
				height: 20px;
				border-radius: 12px;
				color: #fff;
				font-weight: 600;
				text-align: center;
				line-height: 20px;
				margin: 0 12px;
				font-size: 12px;
			}
		}
	}
</style>
<style>
	.full-dialog .el-dialog{
		background: transparent;
	}
	.full-dialog .el-dialog__body {
		padding: 0;
		width: 100%;
		color: #191919;
		height: calc(100vh - 96px);
	}
	.full-dialog .el-dialog__header {
		height: 96px;
		padding: 36px 20px;
		border-bottom: 1px solid #ebebeb;
		background: #fff;
		color: #191919;
		font-weight: 600;
	}
	.full-dialog .el-dialog__title {
		font-size: 24px;
		line-height: 24px;
		color: #191919;
	}
	.full-dialog .el-dialog__body .el-main {
		/* background-color: rgba(0, 0, 0, 0.5); */
	}
	.full-dialog .el-dialog__headerbtn {
		top: 96px;
		right: 0;
		color: #355DFF;
		background: rgba(53, 93, 255, 0.1);
		width: 36px;
		height: 36px;
		border-radius: 0 0 0 50px;
	}
	
	.full-dialog .el-dialog__close {
		position: absolute;
		right: 0px;
		color: #355DFF !important;
		font-size: 20px;
		font-weight: 600;
		top: 4px;
	
	}
	
	.el-button--primary:hover {
		color: #FFFFFF;
		background-color: #409EFF;
	}
	.el-button--primary {
		color: #FFFFFF;
		background-color: #355DFF;
		border-color: #355DFF;
		height: 36px;
		line-height: 36px;
		padding: 0 20px;
	}
	.el-input__inner {
		height: 36px;
		line-height: 36px;
	}
	.el-table thead {
		color: #040415;
	}
	.el-select {
		width: 100%;
	}
	.el-tabs__item:hover {
		color: #355DFF !important;
	}
	.el-tabs__item.is-active {
		color: #355DFF !important;
	}
</style>