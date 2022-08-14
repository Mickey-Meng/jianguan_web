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
							<div class="block-item-label">账单编号<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.billCode}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">付款单位<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.payUnit}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">收款单位<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.gatherUnit}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">支付金额<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.payAmount}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">支付日期<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.payDate}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>附件上传</strong>
						<span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
							xisx xis pdf文件，且不超过100m</span>
					</div>
				
					<attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
				</div>
				
			</el-form>
		</div>
	</div>
</template>

<script>
	import * as api from "@/api/contract";
	import {
		formatMonth,
		formatDate,
		formatDateTime,
		convertOptions
	} from "@/utils/format.js";
	import attachlist from "../../common/attachlist.vue"
	import projectinfo from "../../common/projectinfo.vue"
	
	export default {
		data() {
			return {
				dialogTitle: '项目全生命周期数字管理平台',
				dialogFormVisible: false,
				
				baseInfo: {
					buildSection: 1,
					projectName:'235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程',
					buildSectionName: '235国道项目部',
					contractCode: 'ORG_00004',
					startupUser: '赵赞文',
					startupDate: formatMonth(new Date()),
				},
				formData: { //表单参数
					attachment: [],
					billCode: '',
					explaination: '',
					gatherUnit: '',
					payAmount: null,
					deletedFlag: 1,
					draftFlag: 1,
					payUnit: '',
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					payDate: formatDate(new Date())
				},
				attachTable: []
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
			
		},
		methods: {
			getDetail(id) {
				api.getComeGoMoneyDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../assets/css/dialog.scss"
</style>
