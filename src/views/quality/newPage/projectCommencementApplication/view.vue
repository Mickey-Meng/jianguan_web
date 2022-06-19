<template>
	<div>

		<div class="form-content">
			<el-form ref="form" label-width="80px">
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>项目开工申请信息</strong>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">申请开工日期<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.openDate}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">计划完工日期<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.endDate}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">共计划日历天:{{intervalPlan}}</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">合同规定工期起<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.contractOpenDate}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">合同规定工期止<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.contractEndDate}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">历时天数:{{intervalContract}}</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>施工组织设计审批情况</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">申报说明<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.buildApplyExplain}}
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>工程划分审核情况</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">申报说明<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.projectApplyExplain}}
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>技术、质量、安全、环保保证体系建立情况（含相关人员证书）</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">申报说明<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.techApplyExplain}}
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>试验检测工作准备情况</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">申报说明<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.checkApplyExplain}}
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>设计交底情况</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">申报说明<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.designApplyExplain}}
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>原始基准点、地面线复测情况</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">申报说明<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.againApplyExplain}}
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>开工预付款担保及保险情况</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">申报说明<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.insuranceApplyExplain}}
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>合同段施工安全风险评估情况</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">申报说明<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.securityApplyExplain}}
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>其他有关情况说明</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">申报说明<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.otherApplyExplain}}
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>附件上传</strong>
						<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
							文件，且不超过 200M</span>
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
		getQueryVariable,
		formatDate,
		getDaysBetween
	} from "@/utils/format.js";
	import attachlist from "../../../common/attachlist"
	import projectinfo from "../../../common/projectinfo.vue"
	
	export default {
		data() {
			return {
				baseInfo: {
					buildSection: 1,
					buildSectionName: '235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
					supervisionSection: '监理办'
				},
				baseInfo: {
					buildSection: '',
					buildSectionName: '235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					contractCode: '235SJSG01',
					buildCompany: '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司',
					supervisionUnit: '浙江交科公路水运工程监理有限公司',
					supervisionSection: '监理办'
				},
				formData: { //表单参数
					deletedFlag: 1,
					attachment: [],
					draftFlag: 1,
					againApplyExplain: '',
					buildApplyExplain: '',
					checkApplyExplain: '',
					designApplyExplain: '',
					insuranceApplyExplain: '',
					otherApplyExplain: '',
					projectApplyExplain: '',
					securityApplyExplain: '',
					techApplyExplain: '',
					contractEndDate: formatDate(new Date()),
					contractOpenDate: formatDate(new Date()),
					endDate: formatDate(new Date()),
					openDate: formatDate(new Date()),
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
				},
				attachTable: [], //其他附件
				taskInfo:{}
			};
		},
		created() {},
		components: {
			attachlist,
			projectinfo
		},
		computed: {
			intervalPlan: function() {
				return getDaysBetween(this.formData.openDate, this.formData.endDate)
			},
			intervalContract: function() {
				return getDaysBetween(this.formData.contractOpenDate, this.formData.contractEndDate)
			}
		},
		watch: {
			
		},
		mounted() {
			
		},
		methods: {
			getDetail(id) {
				api.getProjectOpenDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.otherAttachment || [];
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
