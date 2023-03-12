<template>
	<div>

		<div class="form-content">
			<el-form ref="form" label-width="80px">
				<div class="form-title">
					<div class="title-big-bar"></div>
					<strong>隐蔽工程管理</strong>
				</div>

				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>基本信息</strong>
					</div>
					<projectinfo></projectinfo>
					<div class="block-line">

						<div class="block-item">
							<div class="block-item-label">工程编号</div>
							<div class="block-item-value">
								{{formData.projectCode}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>隐蔽工程信息</strong>
					</div>
					<div class="block-line">

						<div class="block-item">
							<div class="block-item-label">单位、分部工程<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.unit}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">分项工程<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.subProject}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">隐蔽工程项目<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.hiddenProject}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">施工自检结果<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.buildCheckselfResult}}
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
						<div class="block-table-title">附件</div>
				<!-- 		<div class="block-table-btns">
							<el-button size="small" type="primary">下载全部</el-button>
						</div> -->
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>

				</div>


			</el-form>
		</div>
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions,
		getQueryVariable
	} from "@/utils/format.js";
	import attachlist from "../../../common/attachlist"
	import projectinfo from "../../../common/projectinfo.vue"
	export default {
		props: ['detailRow'],
		data() {
			return {

				baseInfo: {
					buildSection: 1,
					buildSectionName: '池州港乌沙港区公用码头工程项目',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
				},
				formData: { //表单参数
					attachment: [],
					buildCheckselfResult: '',
					deletedFlag: 1,
					draftFlag: 1,
					hiddenProject: '',
					id: null,
					projectCode: '',
					projectId: 1,
					subProject: '',
					unit: ''
				},
				attachTable: [], //附件
			};
		},
		created() {},
		components: {
			attachlist,
			projectinfo
		},
		computed: {},
		mounted() {
			setTimeout(() => {
				var params = getQueryVariable();
				if (params['processDefinitionId']) {
					this.dialogFormVisible = true;
					params['id'] = params['businessKey'];
					this.taskInfo = params;
					this.getDetail(params['businessKey']);
				}
			}, 500)
		},
		watch: {
			detailRow(obj) {
				if (obj['id']) {
					this.getDetail(obj['id']);
				}
			}
		},
		methods: {
			getDetail(id) {
				api.getHiddenProjectDetail({
					id: id
				}).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss";
</style>
