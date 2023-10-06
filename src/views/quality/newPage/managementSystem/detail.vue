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
									<div class="form-block-title">
										<div class="title-bar"></div><strong>基本信息</strong>
									</div>
									<projectinfo></projectinfo>
									<div class="block-line">
										<div class="block-item">

											<div class="block-item-label">编制人：<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.compileUser}}
											</div>
										</div>
										<div class="block-item">
											<div class="block-item-label">编制日期<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.compileDate}}
											</div>
										</div>
									</div>

								</div>
								<div class="form-block">
									<div class="form-block-title">
										<div class="title-bar"></div><strong>附件上传</strong>
										<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
											文件，且不超过 200M</span>
									</div>
									<attachlist :editAble="false" ref="attachlist" :attachTable="formData.attachment">
									</attachlist>
									<div class="block-line">
										<div class="block-item">
											<div class="block-item-label">制度内容<i class="require-icon"></i></div>
											<div class="block-item-value">
												{{formData.regimeContent}}
											</div>
										</div>
									</div>
								</div>
							</el-form>
						</div>
					</div>
				</el-main>
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
	import attachlist from "../../../common/attachlist"
	import projectinfo from "../../../common/projectinfo.vue"

	export default {
		props: ['detailRow'],
		data() {
			return {
				dialogFormVisible: false,
				dialogTitle: '项目全生命周期数字管理平台',
				formData: { //表单参数
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project.parentid,
					compileDate: formatDate(), // 编制日期
					compileUser: '', // 编制人
					regimeContent: '', // 制度内容
					deletedFlag: 1,
					draftFlag: 1,
					attachment: []
				}
			};
		},
		created() {},
		components: {
			attachlist,
			projectinfo
		},
		computed: {},
		watch: {
			detailRow(obj) {
				if (obj['id']) {
					this.getDetail(obj['id']);
				}
			}
		},
		mounted() {
			// setTimeout(()=>{
			// 	var params = getQueryVariable();
			// 	if (params['processDefinitionId']) {
			// 		this.dialogFormVisible=true;
			// 		params['id'] = params['businessKey'];
			// 		this.taskInfo=params;
			// 		this.getDetail(params['businessKey']);
			// 	}
			// },500)
		},
		methods: {
			closeDialog() {
				// if (this.taskInfo['processDefinitionId']) {
				// 	this.$router.go(-1);
				// }
			},
			changeVisible(value) {
				this.dialogFormVisible = value;
			},
			getDetail(id) {
				api.getManageRegime(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});

			}
		},
	};
</script>

<style scoped lang="scss">
@import "../../../../assets/css/dialog.scss";
</style>
