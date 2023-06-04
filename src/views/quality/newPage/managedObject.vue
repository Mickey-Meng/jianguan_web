<!--
@name:
@description: 管理目标
@author: zhouhai
@time: 2022-05-13 09:17:13
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
					<el-button size="small" @click="exportData">导出</el-button>
					<!-- <el-button size="small">批量操作</el-button> -->
				</div>
			</div>
		</el-header>
		<el-main>
			<div class="container">
				<el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
					class="have_scrolling">
					<el-table-column type="index" width="50" align="center" label="序号">
					</el-table-column>
					<el-table-column prop="title" align="center" label="标题" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="createName" align="center" label="登记人" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="publishDate" align="center" label="发布时间" show-overflow-tooltip>
					</el-table-column>
					<!-- <el-table-column prop="uploadname" align="center" label="登记部门" show-overflow-tooltip>
					</el-table-column> -->
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button type="text" @click="viewDetail(row)">详情</el-button>
							<el-button type="text" style="color: red;" @click="deleteManagementObject(row.id)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @current-change="handleCurrentChange" :current-page="queryData.pageNum"
					:page-size="queryData.pageSize" layout="total, prev, pager, next, jumper"
					:total="queryData.totalPage">
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
									<strong>管理目标</strong>
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
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">登记部门<i class="require-icon"></i></div>
											<div class="block-item-value">{{formData.groupName}}</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">登记人<i class="require-icon"></i></div>
											<div class="block-item-value">{{formData.userName}}</div>
										</div>
									</div>
									<div class="block-line">
										
										<div class="block-item">
											<div class="block-item-label">发布时间</div>
                      						<div class="block-item-value">
												<el-date-picker type="date" v-model="formData.publishDate" placeholder="选择日期" :disabled="previewMode"></el-date-picker>
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">标题<i class="require-icon"></i></div>
											<div class="block-item-value">
                        						<el-input placeholder="请输入内容" v-model="formData.title" :disabled="previewMode"></el-input>
											</div>
										</div>
									</div>
								</div>
								<div class="form-title" v-show="!previewMode">
									<div class="title-big-bar"></div><strong>附件上传</strong>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>文件</strong>
										<span style="font-size: 12px;margin-left: 40px;" v-show="!previewMode">支持上传 jpg/jpeg png mp4 docx doc xlsx xls pdf 文件，且不超过 50M</span>
									</div>
									
									
									<attachlist :editAble="true" ref="attachlist" :attachTable="attachTable"></attachlist>
									
								</div>
								<div class="form-block">
									<el-button class="submit-btn" size="small" type="primary" @click="addManagedObject" v-show="!previewMode">提交</el-button>
								</div>
							</el-form>
						</div>
					</div>
				</el-main>
				
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
	import projectinfo from "../../common/projectinfo.vue"
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
				previewMode: false,
				dialogFormVisible: false,
				annexTableData: [],
				activeName: 'first',
				queryData: {
					pageNum: 1,
					totalPage:1,
					pageSize: 10,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid']
				},
				userInfo: {},
				formData: {
					id: '',
					title: '测试', // 标题
					publishDate: '2022-05-06', // 发布时间
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'], // 项目id
					userName: '',	// 登记人
					groupName: '',	// 登记部门
					projectName: '',// 项目名称 
				    attachment: [ // 附件
					]
				},
				viewImgVisible: false,
				attachment: [],
				attachTable: [ // 附件
				],
				viewImgType: 'img',
				viewImgUrl: '',
			};
		},
		created() {},
		components: {
			attachlist,
			projectinfo
		},
		computed: {},
		mounted() {
			this.query();
			this.getUserInfo();
		},
		methods: {
			query() {
				api.getManagementObjectList(this.queryData).then((res) => {
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
				this.formData.attachment = [];
				this.attachTable = [];
			},
			addManagedObject() {
				if (this.formData.publishDate instanceof Date) this.formData.publishDate = this.formData.publishDate.format("yyyy-MM-dd");
				
				this.formData.attachment = this.attachTable;
				api.addOrUpdateManagementObjectList(this.formData).then((res) => {
				  	this.query();
					this.dialogFormVisible = false;

				});
			},
			deleteManagementObject(id) {
				// /web/api/v1/manageTarget/id
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					api.deleteManagementObject(id).then((res) => {
						if (this.tableData.length == 1) {
							this.queryData.pageNum = this.queryData.pageNum> 1 ? this.queryData.pageNum - 1 : 1
						}
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
				api.getManagementObject(row.id).then((res) => {
				  	if (res && res.data) {
						for (let i = 0; i < res.data.attachment.length; i++) {
							const item = res.data.attachment[i];
							item.uploadTime = new Date(item.uploadTime).format('yyyy-MM-dd hh:mm:ss')
						}
						this.formData = res.data;
						this.attachTable = res.data.attachment;
						getUserInfo(res.data.createUserId).then(res => {
							that.formData.userName = res.data.userInfo.NAME;
							that.formData.groupName = this.userInfo.GROUPNAME;
							that.$forceUpdate();
						});
					}
				});
			},
			handleCurrentChange(page) {
				this.queryData.pageNum=page
				this.query()
			},
			afterUpAttach(data){
				api.getFileInfo({id: data['fileId']}).then((res) => {
				  	if (res) {
					}
				});
				this.attachment.push({
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
			exportData() {
				this.queryData.draftFlag = 1;
				api.exportManagementObjectList(this.queryData).then((res) => {
					const reader = new FileReader();
					reader.readAsDataURL(res);
					reader.onload = (e) => {
						const a = document.createElement('a');
						a.download = `管理目标清单.xls`;
						a.href = e.target.result;
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
					};
				});
			}
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