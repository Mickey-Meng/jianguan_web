<!--
@name:
@description:进退场管理
@author: 王海林
@time: 2022-05-23 11:32:49
@modifier:
@modifierTime:
-->
<template>
	<div>
		<el-tabs v-model="activeName">
			<el-tab-pane label="人员报审" name="first">
				<el-container class="container-box">
					<el-header>
						<div class="input-box">
							<div class="input-value">
								<el-input v-model="queryData.buildSectionName" placeholder="标段名称"></el-input>
							</div>
						</div>
						<div class="input-box">
							<div class="input-value">
								<el-input v-model="queryData.laborContractProjectName" placeholder="编号">
								</el-input>
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
								<el-table-column prop="buildSectionName" align="center" label="施工标段"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="laborContractProjectName" align="center" label="编号"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="createTime" align="center" label="施工单位" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="contractUser" align="center" label="报审类型" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="laborContractProjectName" align="center" label="人数"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="createTime" align="center" label="说明" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="contractUser" align="center" label="状态" show-overflow-tooltip>
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
			</el-tab-pane>
			<el-tab-pane label="人员一览" name="second">
				<el-container class="container-box">
					<el-header>
						<div class="input-box">
							<div class="input-value">
								<el-input v-model="queryData.buildSectionName" placeholder="标段名称"></el-input>
							</div>
						</div>
						<div class="input-box">
							<div class="input-value">
								<el-input v-model="queryData.laborContractProjectName" placeholder="人员姓名">
								</el-input>
							</div>
						</div>
						<div class="input-box">
							<div class="input-value">
								<el-button type="primary" @click="query">搜索</el-button>
							</div>
						</div>
						
						<div class="input-box">
							<div class="input-value">
								<el-radio label="1">在场人员</el-radio>
								<el-radio label="2">已退场人员</el-radio>
							</div>
						</div>
						
						<div class="right-btns">
							<div class="operate-btns" v-show="operateBtnsVisible">
								<el-button size="small">退场</el-button>
							</div>
						</div>
					</el-header>
					<el-main>
						<div class="container">
							<el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
								class="have_scrolling">
								<el-table-column type="index" width="50" align="center" label="序号">
								</el-table-column>
								<el-table-column prop="buildSectionName" align="center" label="人员姓名"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="laborContractProjectName" align="center" label="手机号码"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="createTime" align="center" label="身份证号" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="contractUser" align="center" label="户籍" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="contractUser" align="center" label="健康状况" show-overflow-tooltip>
								</el-table-column>
								<el-table-column  label="接触中高风险疫区情况">
									<el-table-column prop="contractUser" align="center" label="是否到过中高风险地区" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="contractUser" align="center" label="中高风险地区" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="contractUser" align="center" label="出发地" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="contractUser" align="center" label="途径城市" show-overflow-tooltip>
									</el-table-column>
								</el-table-column>
								<el-table-column prop="contractUser" align="center" label="是否完成疫苗接种" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="contractUser" align="center" label="健康码(是否为绿码)" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="contractUser" align="center" label="工种" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="contractUser" align="center" label="备注" show-overflow-tooltip>
								</el-table-column>
								<el-table-column  label="队伍公司">
									<el-table-column prop="contractUser" align="center" label="名称" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="contractUser" align="center" label="联系电话" show-overflow-tooltip>
									</el-table-column>
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
			</el-tab-pane>
		</el-tabs>
	</div>
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
				activeName:'first',
				allData: [],
				tableData: [],
				operateBtnsVisible: true,
				queryData: { //查询参数
					buildSectionName: '',
					laborContractProjectName: '',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
					projectId: this.$store.getters.project['id']
				},
				editRow: null,
				detailRow: null
			};
		},
		created() {},
		computed: {},
		mounted() {
			this.query();
		},
		methods: {
			query() {
				api.getContractLaborList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.allData['list'] || [];
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
