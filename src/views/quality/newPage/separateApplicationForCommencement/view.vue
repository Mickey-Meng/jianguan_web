<template>
	<div>

		<div class="form-content">
			<el-form ref="form" label-width="80px">
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
						<div class="title-bar"></div><strong>分项开工申请报告信息</strong>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">建议开工日期<i class="require-icon"></i></div>
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
							<div class="block-item-label">地点或桩号<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.place}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">现场负责人<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.liveUser}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">施工员<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.buildUser}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">质检员<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.checkUser}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">施工准备情况说明<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.buildPrepareExplain}}
							</div>
						</div>
				
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>标准试验审批表</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.experimentAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.experimentExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>专项施工方案审批表</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.buildAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.buildExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>工艺试验审批表</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.processAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.processExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>到场材料审批表</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.materialAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.materialExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>到场设备审批表（含特种设备检测报告）</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.equipmentAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.equipmentExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>到场技术、质量、安全、环保管理人员及主要操人员、特种作业人员情况及证件复印件</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.techAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.techExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>施工方案</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.buildPlanAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.buildPlanExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>安全技术措施</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.securityAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.securityExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>危险性较大项目安全专项施工方案审查记录</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.riskAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.riskExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>环境保护措施</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.environmentAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.environmentExplain}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>环保、安全、质量、技术交底材料</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.bottomAttachment">
					</attachlist>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.bottomExplain}}
							</div>
						</div>
					</div>
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
		createProjectInfo
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
				formData: { //表单参数
					bottomAttachment: [],
					bottomExplain: '',
					buildAttachment: [],
					buildExplain: '',
					buildPlanAttachment: [],
					buildPlanExplain: '',
					buildPrepareExplain: '',
					buildUser: '',
					checkUser: '',
					endDate: formatDate(new Date()),
					environmentAttachment: [],
					environmentExplain: '',
					equipmentAttachment: [],
					equipmentExplain: '',
					experimentAttachment: [],
					experimentExplain: '',
					liveUser: '',
					materialAttachment: [],
					materialExplain: '',
					openDate: formatDate(new Date()),
					place: '',
					processAttachment: [],
					processExplain: '',
					projectCode: '',
					riskAttachment: [],
					riskExplain: '',
					securityAttachment: [],
					securityExplain: '',
					techAttachment: [],
					techExplain: '',
					deletedFlag: 1,
					draftFlag: 1,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid']
				},
				examineTable: [], //检测信息
				reportTable: [], //试验检测报告
				factoryTable: [], //出厂信息
				attachTable: [], //其他附件
			};
		},
		created() {},
		components: {
			attachlist,
			projectinfo
		},
		computed: {},
		watch: {
			
		},
		mounted() {
			this.getProjectInfoById();
		},
		methods: {
			getProjectInfoById() {
				api.getProjectInfoById({
					projectid: this.$store.getters.project['parentid']
				}).then((res) => {
					let data = res['data'] || {};
					this.baseInfo['buildSectionName'] = data['project'] ? data['project']['name'] : '';
					let list = data['companys'] || [];
					let info = createProjectInfo(list);
					this.baseInfo['buildCompany'] = info['buildCompany'];
					this.baseInfo['supervisionUnit'] = info['supervisionUnit'];
				});
			},
			getDetail(id) {
				api.getSubitemOpenDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../../assets/css/dialog.scss"
</style>
