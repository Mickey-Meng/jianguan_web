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
							<div class="block-item-label">报审类型<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.type==0?'进场':'退场'}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">劳务分包合同<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.laborContractCode}}
							</div>
						</div>
						<div class="block-item">
							<div class="block-item-label">人数<i class="require-icon"></i></div>
							<div class="block-item-value">
								{{formData.num}}
							</div>
						</div>
					</div>
					<div class="block-line">
						<div class="block-item">
							<div class="block-item-label">说明</div>
							<div class="block-item-value">
								{{formData.explaination}}
							</div>
						</div>
					</div>
				</div>
				<div class="form-block">
					<div class="form-block-title">
						<div class="title-bar"></div><strong>人员清单</strong>
					</div>
					<div class="block-table">
						<el-table :data="inOutUserTable" style="width: 100%" border
							class="have_scrolling">
							<el-table-column type="index" width="50" align="center" label="序号">
							</el-table-column>
							<el-table-column prop="name" align="center" label="人员姓名"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="phone" align="center" label="手机号码"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="card" align="center" label="身份证号"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="household" align="center" label="户籍"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="bodyStatus" align="center" label="健康状况"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column label="接触中高风险疫区情况">
								<el-table-column prop="isRisk" align="center" label="是否到过中高风险地区"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="riskArea" align="center" label="中高风险地区"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="startArea" align="center" label="出发地"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="wayCity" align="center" label="途径城市"
									show-overflow-tooltip>
								</el-table-column>
							</el-table-column>
							<el-table-column prop="isVaccine" align="center" label="是否完成疫苗接种"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="isHealth" align="center" label="健康码(是否为绿码)"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="workType" align="center" label="工种"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column prop="remark" align="center" label="备注"
								show-overflow-tooltip>
							</el-table-column>
							<el-table-column label="队伍公司">
								<el-table-column prop="companyName" align="center" label="名称"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="companyPhone" align="center" label="联系电话"
									show-overflow-tooltip>
								</el-table-column>
							</el-table-column>
						</el-table>
					</div>
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
	
	import projectinfo from "../../common/projectinfo.vue"
	
	export default {
		data() {
			return {
				dialogTitle: '全生命周期智慧建设管理平台',
				dialogFormVisible: false,
				baseInfo: {
					buildSection: 1,
					projectName:'池州市平天湖东部区域棚户区改造建设工程EPC总承包',
					buildSectionName: '235国道项目部',
					contractCode: 'ORG_00004',
					startupUser: '赵赞文',
					startupDate: formatMonth(new Date()),
				},
				formData: { //表单参数
					enterExitUsers: [],
					deletedFlag: 1,
					explaination: '',
					deletedFlag: 1,
					draftFlag: 1,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid'],
					laborContractCode: null,
					num: null,
					type: 0
				},
				inOutUserTable: [], //附件
			};
		},
		created() {},
		components: {
			projectinfo
		},
		computed: {},
		watch: {
			
		},
		mounted() {
			
		},
		methods: {
			getDetail(id) {
				api.getEnterExitDeatil(id).then((res) => {
					let data = res['data'] || {};
					this.formData = data;
					this.inOutUserTable = data.enterExitUsers || [];
				});
			},
		},
	};
</script>

<style scoped lang="scss">
	@import "../../../assets/css/dialog.scss"
</style>
