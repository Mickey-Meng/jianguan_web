<!--
 * @Descripttion:施工方案
 * @version:
 * @Author: zhouhai
 * @Date: 2022-05-09 14:16:58
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 14:17:04
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.projectCode" placeholder="专项施工方案名称"></el-input>
				</div>

			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.subProject" placeholder="施工标段"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.subProject" placeholder="监理标段"></el-input>
				</div>
			</div>
			<el-button type="primary">搜索</el-button>

			<div class="right-btns">
				<!-- <el-button type="primary" size="small"
					:icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
					@click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
				<div class="operate-btns" v-show="operateBtnsVisible">
					<el-button size="small" @click="addNew">新增</el-button>
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
					<el-table-column prop="projectCode" align="center" label="工程编号" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="projectName" align="center" label="项目名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="supervisionSectionName" align="center" label="监理标段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="buildSectionName" align="center" label="施工标段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="contractCode" align="center" label="合同号" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="buildPlanName" align="center" label="专项施工方案名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="buildSectionId" align="center" label="合同段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="supervisorSection" align="center" label="状态描述">
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<!-- <el-button type="text" size="mini" @click="modify(row)">修改</el-button> -->
							<el-button type="text" size="mini" @click="viewDetail(row)">详情</el-button>
							<el-button type="text" size="mini" @click="deleteRow(row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="queryData.pageNum" :page-size="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper"
					:total="queryData.totalPage">
				</el-pagination>
			</div>
		</el-main>
		<edit ref="edit" @query="query" :editRow="editRow"></edit>
		<detail ref="detail" :detailRow="detailRow"></detail>
	</el-container>
</template>

<script>
	import * as api from "@/api/quality";
	import edit from './constructionScheme/edit';
	import detail from './constructionScheme/detail';
	export default {
		data() {
			return {
				allData:{},
				tableData: [],
				operateBtnsVisible: true,
				dialogTitle: '智慧建设通用版-【绍兴市】235国道杭州',
				dialogFormVisible: false,
				queryData: {
					projectCode: '',
					subProject: '',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
					projectId:this.$store.getters.project['parentid']
				},
				editRow:null,
				detailRow:null
			};
		},
		created() {},
		components: {
			edit,
			detail
		},
		computed: {},
		mounted() {
			this.query();
		},
		methods: {
			query() {
				api.getBuildPlanList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.formateTableData(res.data.list);
					this.queryData.pageNum=res.data.pageNum;
					this.queryData.totalPage=res.data.total;
					this.queryData.pageSize=res.data.pageSize;
				});
			},
			formateTableData(list) {
				list = list || [];
				list.forEach(item => {
					item['projectName'] = '235国道杭州至诸暨公路萧山河上至诸暨安华段改建工程';
					item['buildUnit'] = '中交上海航道局有限公司、中国交通建设股份有限公司、浙江诸安建设集团有限公司、浙江省交通规划设计研究院有限公司';
					item['contractCode'] = '235SJSG01';
					item['supervisorUnit'] = '浙江交科公路水运工程监理有限公司';
					item['buildSectionId'] = '';
					item['supervisorSection'] = '';
					item['statusStr'] = '';
				})
				return list;
			},
			addNew() {
				this.editRow=null;
				this.$refs.edit.changeVisible(true);
			},
			modify(row) {
				this.editRow=row;
				this.$refs.edit.changeVisible(true);
			},
			viewDetail(row) {
				this.detailRow=row;
				this.$refs.detail.changeVisible(true);
			},
			deleteRow(row) {
				this.$confirm('确认是否删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					api.deleteBuildPlan({id:row['id']}).then((res) => {
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
	@import "../../../assets/css/table.scss"
</style>