<template>
	<div>

		<div class="form-content">
			<el-form ref="form" label-width="80px">
<!--				<div class="form-title">-->
<!--					<div class="title-big-bar"></div>-->
<!--					<strong>施工技术交底</strong>-->
<!--				</div>-->

				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>基本信息</strong>
					</div>
					<projectinfo></projectinfo>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">登记时间</div>
							<div class="block-item-value">
								{{baseInfo.contractCode}}
							</div>
						</div>
					</div>
					<div class="block-line">

						<div class="block-item">
							<div class="block-item-label">施工技术交底概述</div>
							<div class="block-item-value">
								{{formData.buildTechBottom}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">备注</div>
							<div class="block-item-value">
								{{formData.remark}}
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
						<div class="block-table-btns">
							<!-- <el-button size="small" type="primary">下载全部</el-button> -->
						</div>
					</div>

					<attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
				</div>

				<!-- <div class="form-title">
					<div class="title-big-bar"></div><strong>审批信息</strong>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>待审批人</strong>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">监理<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.qualityCheckUser}}
							</div>
						</div>
					</div>
				</div> -->
			</el-form>
		</div>
	</div>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions,
		getQueryVariable,
		formatDate
	} from "@/utils/format.js";
	import attachlist from "../../../common/attachlist.vue"
	import projectinfo from "../../../common/projectinfo.vue"
	export default {
		props: ['detailRow'],
		data() {
			return {

				baseInfo: {
					buildSection: 1,
					buildSectionName: '池州市平天湖东部区域棚户区改造建设工程EPC总承包',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
				},
				formData: { //表单参数
					buildTechBottom: '', // 施工交底概述
					checkDate: formatDate(new Date()), // 登记时间
					remark: '', // 备注
					attachment: [],
					buildCheckselfResult: '',
					deletedFlag: 1,
					draftFlag: 1,
					BuildTechBottom: '',
					projectBuildUser: 1,
					projectChargeUser: 1,
					projectCode: '',
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					qualityCheckUser: 1,
					subProject: '',
					supervisorEngineerUser: 1,
					supervisorUser: 1,
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
				api.getBuildTechBottomDetail({
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
	@import "../../../../assets/css/dialog.scss"
</style>
