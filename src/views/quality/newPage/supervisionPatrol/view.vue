<template>
	<div>

		<div class="form-content">
			<el-form ref="form" label-width="80px">
				<div class="form-block">
					<!-- <div class="form-block-title">
						<div class="title-bar"></div><strong>发起位置</strong>
						
					</div>
					<locationmap></locationmap> -->
					<div class="form-block-title">
						<div class="title-bar"></div><strong>基本信息</strong>
					</div>
					<projectinfo></projectinfo>
					<div class="block-line">
						<div class="block-line">
							<div class="block-item">
								<div class="block-item-label">发起时间</div>
								<div class="block-item-value">
									{{formData.startDate}}
				
								</div>
							</div>
						</div>
				
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>巡视信息</strong>
					</div>
					<div class="block-line">
						<div class="block-item-label">巡视地点<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.patrolPlace}}
						</div>
					</div>
					<div class="block-line">
						<div class="block-item-label">主要施工情况<i class="require-icon"></i></div>
						<div class="block-item-value">
							{{formData.buildCondition}}
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">质量、安全、环保情况<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.qualityCondition}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">发现的问题及处理意见<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.problemDealCondition}}
							</div>
						</div>
					</div>
				</div>
				
				
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>巡视现场照片</strong>
						<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
							文件，且不超过 200M</span>
					</div>
					<attachlist :editAble="false" ref="attachlist"
						:attachTable="formData.patrolPhotoAttachment">
					</attachlist>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>视频</strong>
						<span style="font-size: 12px;margin-left: 40px;">最少数量1， 支持上传 docx doc pdf
							文件，且不超过 200M</span>
					</div>
					<attachlist :editAble="false" ref="attachlist" :attachTable="formData.video">
					</attachlist>
				</div>
				<div class="form-block">
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">其他附件</div>
							<div class="block-item-value">
								{{formData.otherAttachmentInfo}}
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
		formatDate,
		getDaysBetween
	} from "@/utils/format.js";
	import attachlist from "../../../common/attachlist"
	import locationmap from "../../../common/locationmap.vue"
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
					"address": {},
					"auditUser": {},
					"buildCondition": "",
					"deletedFlag": 1,
					"draftFlag": 1,
					"otherAttachmentInfo": "",
					"patrolPhotoAttachment": [],
					"patrolPlace": "",
					"problemDealCondition": "",
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					"qualityCondition": "",
					"startDate": formatDate(new Date()),
					"video": [],
				},
				taskInfo:{}
			};
		},
		created() {},
		components: {
			attachlist,
			locationmap,
			projectinfo
		},
		computed: {
			
		},
		watch: {
			
		},
		mounted() {
			
		},
		methods: {
			getDetail(id) {
				api.getSupervisionPatrolDeatil(id).then((res) => {
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
