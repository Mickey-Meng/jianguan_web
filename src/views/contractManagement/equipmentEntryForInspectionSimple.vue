<!--
@name:
@description:设备进场报验
@author: 王海林
@time: 2022-05-27 14:28:18
@modifier:
@modifierTime:
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.supervisionBan" placeholder="监理单位"></el-input>
				</div>

			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.projectCode" placeholder="工程编号"></el-input>
				</div>
			</div>
			<el-button type="primary" @click="query()">搜索</el-button>
		</el-header>
		<el-main>
			<div class="container">
				<el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
					class="have_scrolling">
					<el-table-column type="index" width="50" align="center" label="序号">
					</el-table-column>
					<!-- <el-table-column prop="projectName" align="center" label="项目名称" show-overflow-tooltip>
					</el-table-column> -->
					<el-table-column prop="projectCode" align="center" label="工程编号" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="constructdpts" align="center" label="施工单位" show-overflow-tooltip>
					</el-table-column>
					<!-- <el-table-column prop="contractCode" align="center" label="合同号" show-overflow-tooltip>
					</el-table-column> -->
					<el-table-column prop="supervisionBan" align="center" label="监理办" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="supervisordpts" align="center" label="监理单位">
					</el-table-column>
					<!-- <el-table-column prop="contractCode" align="center" label="合同号">
					</el-table-column> -->
					<el-table-column prop="statusStr" align="center" label="状态描述">
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row }">
							<el-button  type="text" size="mini" @click="checkRow(row)">选择</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @current-change="handleCurrentChange"
					:current-page="queryData.pageNum" :page-size="queryData.pageSize" layout="total, prev, pager, next, jumper"
					:total="queryData.totalPage">
				</el-pagination>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	import * as api from "@/api/contract";
	
	export default {
		props:{
			
		},
		data() {
			return {
				allData:{},
				tableData: [],
				queryData: {
					supervisionBan: '',
					projectCode: '',
					draftFlag:1,
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['id']
				},
	
			};
		},
		created() {},
		components: {
			
		},
		computed: {},
		mounted() {
			this.query();
		},
		methods: {
			query() {
				api.getEquipmentEnterList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.formateTableData(this.allData['list']);
					this.queryData.pageNum=res.data.pageNum;
					this.queryData.totalPage=res.data.total;
					this.queryData.pageSize=res.data.pageSize;
				});
			},
			formateTableData(list) {
				list = list || [];
				list.forEach(item => {
					item['buildUnits'] = item['buildUnits'] ? item['buildUnits'].join('、') : '';
					item['supervisorUnits'] = item['supervisorUnits'] ? item['supervisorUnits'].join('、') : '';
				})
				return list;
			},
			
			checkRow(row) {
				this.$emit('getDetail',row)
			},
			handleCurrentChange(page) {
				this.queryData.pageNum=page
				this.query()
			}
		},
	};
</script>
<style scoped lang="scss">
	@import "../../assets/css/table.scss"
</style>