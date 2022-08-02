<template>
	<div>
		<el-dialog class="full-dialog defined-dialog" @close="closeDialog" :visible.sync="dialogFormVisible"
			:fullscreen="true">
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

								<div class="form-block">
									<!-- <div class="form-block-title">
										<div class="title-bar"></div><strong>地理位置</strong>

									</div>
									<locationmap></locationmap> -->
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">发起人</div>
											<div class="block-item-value">
												{{formData.createUserName}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">发起时间</div>
											<div class="block-item-value">
												{{formData.createTime}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">抄送</div>
											<div class="block-item-value">
												{{formData.copy}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">指令编号<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.orderCode}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>指令信息</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">指令标题<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.orderTitle}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">回复期限<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.orderDate}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">工程部位<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.projectPart}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">严重程度<i class="require-icon"></i></div>
											<div class="block-item-value">

												{{formData.seriousLevel==0?'一般':'严重'}}
											</div>
										</div>
									</div>
									<div class="form-block">
										<div class="form-block-title">
											<div class="title-bar"></div><strong>问题照片</strong>
											<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png 文件，且不超过
												100M</span>
										</div>
										<attachlist :editAble="false" :attachTable="formData.problemPhotoAttachment">
										</attachlist>

									</div>
									<div class="form-block">
										<div class="form-block-title">
											<div class="title-bar"></div><strong>其他附件</strong>
											<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png mp4 docx
												doc xlsx xls pdf 文件，且不超过 100M</span>
										</div>
										<attachlist :editAble="false" :attachTable="formData.otherAttachment">
										</attachlist>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">指令内容<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.orderContent}}
											</div>
										</div>
									</div>
								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>指令回复</strong>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">指令回复编号<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.replyCode}}
											</div>
										</div>
									</div>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">回复内容<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.replyContent}}
											</div>
										</div>
									</div>
									<div class="form-block">
										<div class="form-block-title">
											<div class="title-bar"></div><strong>整改照片</strong>
											<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png 文件，且不超过
												100M</span>
										</div>
										<attachlist :editAble="false" :attachTable="formData.replyPhotoAttachment">
										</attachlist>

									</div>
									<div class="form-block">
										<div class="form-block-title">
											<div class="title-bar"></div><strong>其他附件</strong>
											<span style="font-size: 12px;margin-left: 40px;">支持上传 jpg/jpeg png mp4 docx
												doc xlsx xls pdf 文件，且不超过 100M</span>
										</div>
										<attachlist :editAble="false" :attachTable="formData.replyOtherAttachment">
										</attachlist>

									</div>

								</div>
							</el-form>
							<!-- <taskhandle :taskInfo="taskInfo"></taskhandle> -->
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
					<tasklog :taskInfo="taskInfo" ref="tasklog"></tasklog>
				</el-aside>
			</el-container>
		</el-dialog>

	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions,
		getQueryVariable,
		formatDate,
		getDaysBetween
	} from "@/utils/format.js";
	import { getUserInfo } from "@/api/user";
	import tasklog from "../../../common/tasklog.vue"

	import taskhandle from '../../../common/taskhandle'
	import attachlist from "../../../common/attachlist"
	import projectinfo from "../../../common/projectinfo.vue"
	import locationmap from "../../../common/locationmap.vue"
	export default {
		props: ['detailRow'],
		data() {
			return {
				dialogFormVisible: false,
				dialogTitle: '项目全生命周期数字管理平台',
				formData: { //表单参数
					"address": {},
					"auditUser": {},
					"copy": "",
					"deletedFlag": 1,
					"draftFlag": 1,
					"orderCode": "",
					"orderContent": "",
					"orderDate": formatDate(new Date()),
					"orderTitle": "",
					"otherAttachment": [],
					"problemPhotoAttachment": [],
					"buildSection": this.$store.getters.project.id,
					"projectId": this.$store.getters.project['parentid'],
					"projectPart": "",
					"replyCode": "",
					"replyContent": "",
					"replyDate": formatDate(new Date()),
					"replyOtherAttachment": [],
					"replyPhotoAttachment": [],
					"reviewDirector": "",
					"reviewSupervision": "",
					"seriousLevel": 0
				},
				taskInfo: {}
			};
		},
		created() {},
		components: {
			tasklog,
			taskhandle,
			attachlist,
			projectinfo,
			locationmap,
		},
		computed: {

		},
		watch: {
			detailRow(obj) {
				if (obj['id']) {
					this.getDetail(obj['id']);
				}
			}
		},
		mounted() {

		},
		methods: {
			closeDialog() {

			},
			changeVisible(value) {
				this.dialogFormVisible = value;
			},
			getDetail(id) {
				api.getSupervisionOrderDeatil(id).then((res) => {
					let data = res['data'] || {};
					getUserInfo(data.createUserId).then(res1 => {
						data.createUserName = res1.data.userInfo.NAME;
						this.formData = data;
					})
				});
				api.getFlowAndTaskInfo({
					businessKey: id
				}).then((res) => {
					let data = res['data'];
					this.taskInfo = {
						processDefinitionId: data['processDefinitionId'],
						processInstanceId: data['processInstanceId'],
						taskId: data['taskId'],
						flowKey: 'jianlizhiling'
					}
					this.updateTaskLog();
				});
			},
			updateTaskLog() {
				setTimeout(() => {
					this.$refs['tasklog'].initData();
				}, 100)
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
