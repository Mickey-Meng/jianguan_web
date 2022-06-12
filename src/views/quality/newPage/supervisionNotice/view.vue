<template>
	<div>

		<div class="form-content">
			<el-form ref="form" label-width="80px">
				<div class="form-block">
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">项目名称</div>
							<div class="block-item-value">
								{{baseInfo.buildSectionName}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">编号</div>
							<div class="block-item-value">
								{{formData.code}}
							</div>
						</div>
					</div>
					
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">主送<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.mainSent}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">标题<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.title}}
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
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">通知内容<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.content}}
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
					"auditUser": {},
					"code": "",
					"content": "",
					"copy": "",
					"deletedFlag": 1,
					"draftFlag": 1,
					"mainSent": "",
					"projectId": this.$store.getters.project['parentid'],
					"title": ""
				},
				taskInfo:{}
			};
		},
		created() {},
		components: {
			attachlist
		},
		computed: {
		},
		watch: {
			
		},
		mounted() {
			
		},
		methods: {
			getDetail(id) {
				api.getSupervisionNoticeDeatil(id).then((res) => {
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
