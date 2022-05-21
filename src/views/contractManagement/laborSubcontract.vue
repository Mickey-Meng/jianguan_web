<!--
 * @Descripttion:劳务分包合同
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 14:10:50
 * @LastEditors: yangtao
 * @LastEditTime: 2022-05-11 14:10:57
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.buildSectionName" placeholder="施工标段"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.laborContractProjectName" placeholder="拟劳务合作工程名称"></el-input>
				</div>
			</div>
			<el-button type="primary" @click="query">搜索</el-button>
			<div class="right-btns">
				<div class="operate-btns" v-show="operateBtnsVisible">
					<el-button size="small" @click="addNew">新增质量检测</el-button>
					<el-button size="small">导出</el-button>
					<el-button size="small">批量操作</el-button>
				</div>
			</div>
		</el-header>
		<el-main>
			<div class="container">
				<el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
					class="have_scrolling">
					<el-table-column type="index" width="50" align="center" label="序号">
					</el-table-column>
					<el-table-column prop="buildSectionName" align="center" label="施工标段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="laborContractProjectName" align="center" label="拟劳务合作工程名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="createTime" align="center" label="备案日期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="contractUser" align="center" label="承包人" show-overflow-tooltip>
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button type="text" size="mini" @click="modify(row)">修改</el-button>
							<el-button type="text" size="mini" @click="viewDetail(row)">详情</el-button>
							<el-button type="text" size="mini" @click="deleteRow(row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="queryData.pageNum" :page-size="queryData.pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="queryData.totalPage">
				</el-pagination>
			</div>
		</el-main>

		<edit ref="edit" @query="query" :editRow="editRow"></edit>
		<detail ref="detail" :detailRow="detailRow"></detail>
	</el-container>
</template>

<script>
	import * as api from "@/api/contract.js";
	import edit from './laborSubcontract/edit.vue';
	import detail from './laborSubcontract/detail';

	export default {
		components: {
			edit,
			detail
		},
		data() {
			return {
				allData: [],
				tableData: [],
				operateBtnsVisible: true,
				queryData: { //查询参数
					buildSectionName: '',
					laborContractProjectName: '',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
					projectId:this.$store.getters.project['id']
				},
				editRow: null,
				detailRow: null
			};
		},
		created() {},
		computed: {
		},
		mounted() {
			this.query();
		},
		methods: {
			query() {
				api.getContractLaborList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.allData['list']||[];
					this.queryData.pageNum = res.data.pageNum;
					this.queryData.totalPage = res.data.total;
					this.queryData.pageSize = res.data.pageSize;
				});
			},
			addNew() {
				this.editRow = null;
				this.$refs.edit.changeVisible(true);
			},
			modify(row) {
				this.editRow = row;
				this.$refs.edit.changeVisible(true);
			},
			viewDetail(row) {
				this.detailRow = row;
				this.$refs.detail.changeVisible(true);
			},
			deleteRow(row) {
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					api.deleteContractLabor(row['id']).then((res) => {
						this.query();
						this.$message({
							type: 'success',
							message: '删除成功!'
						});
					}).catch(error => {
						this.$message({
							type: 'fail',
							message: '删除失败!'
						});
					});
				});
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			}
		},
	};
</script>
<style scoped lang="scss">
	@import "../../assets/css/table.scss"
</style>
