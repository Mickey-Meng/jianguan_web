<template>
	<div>

		<div class="form-content">
			<el-form ref="form" label-width="80px">
				
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>基本信息</strong>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">项目名称</div>
							<div class="block-item-value">
				
								{{formData.projectName}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">标段</div>
							<div class="block-item-value">
								{{baseInfo.buildSectionName}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">合同编号</div>
							<div class="block-item-value">
								{{formData.contractCode}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">承包人</div>
							<div class="block-item-value">
								{{formData.contractUser}}
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
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>合同信息</strong>
					</div>
					<div class="block-table">
						<el-table :data="contractTable" style="width: 100%" border
							class="have_scrolling">
							<el-table-column type="index" width="50" align="center" label="序号">
							</el-table-column>
							<el-table-column prop="buildProjectName" align="center" label="拟分包工程名称"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="buildProjectPartName" width="180px" align="center"
								label="拟分包工程部位">
							</el-table-column>
							<el-table-column prop="contractUserName" width="120px" align="center"
								label="承包人名称">
							</el-table-column>
							<el-table-column prop="contractChargeUserName" width="120px" align="center"
								label="承包负责人">
							</el-table-column>
							<el-table-column prop="cardNum" width="120px" align="center" label="身份证号">
							</el-table-column>
							<el-table-column prop="contractNum" width="120px" align="center"
								label="拟分包工程合同金额(元)">
							</el-table-column>
							<el-table-column prop="buildDate" width="120px" align="center"
								label="拟分包施工日期">
							</el-table-column>
							<el-table-column prop="contractUserQualification" width="120px"
								align="center" label="承包人专业分包资质">
							</el-table-column>
							<el-table-column prop="remark" width="120px" align="center" label="备注">
							</el-table-column>
							
						</el-table>
					</div>
				</div>
				
				
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>待处理人</strong>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">项目经理</div>
							<div class="block-item-value">
								{{formData.projectManageUser}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">监理办</div>
							<div class="block-item-value">
								{{formData.supervisionUser}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">指挥部</div>
							<div class="block-item-value">
								{{formData.commandUser}}
							</div>
						</div>
					</div>
				</div>
			</el-form>
		</div>
	</div>
</template>

<script>
	import * as api from "@/api/contract";
	import attachlist from "../../common/attachlist"
	export default {
		data() {
			return {
				dialogTitle: '项目全生命周期数字管理平台',
				dialogFormVisible: false,
				
				baseInfo: {
					buildSection: 1,
					buildSectionName: '235国道项目部',
					contractCode: '',
					buildCompany: '',
					supervisionUnit: '',
				},
				formData: { //表单参数
					attachment: [],
					buildSection: '4',
					commandUser: 1,
					contractCode: '',
					contractInfo: [],
					contractUser: '',
					deletedFlag: 1,
					draftFlag: 1,
					projectId: this.$store.getters.project['id'],
					projectManageUser: 1,
					projectName: '',
					supervisionUser: 1
				},
				attachTable: [], //附件
				contractTable: [],
			};
		},
		created() {},
		components: {
			attachlist
		},
		computed: {},
		watch: {
			
		},
		mounted() {
			
		},
		methods: {
			getDetail(id) {
				api.getContractBuildDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.attachTable = data.attachment || [];
					this.contractTable = data.contractInfo || [];
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../assets/css/dialog.scss"
</style>
