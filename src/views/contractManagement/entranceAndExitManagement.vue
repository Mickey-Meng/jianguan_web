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
						<el-button type="primary" @click="query">搜索</el-button>
						<div class="right-btns">
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
								<el-table-column prop="buildSectionName" align="center" label="施工标段"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="buildUnits" align="center" label="施工单位" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="typeStr" align="center" label="报审类型" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="num" align="center" label="人数"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="explaination" align="center" label="说明" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="statusStr" align="center" label="状态" show-overflow-tooltip>
								</el-table-column>
								<el-table-column fixed="right" width="120" align="center" label="操作">
									<template slot-scope="{ row, $index }">
										<el-button type="text" size="mini" @click="modify(row)">修改</el-button>
										<el-button type="text" size="mini" @click="viewDetail(row)">详情</el-button>
										<el-button type="text" size="mini" @click="deleteRow(row)">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
							<el-pagination @current-change="handleCurrentChange"
								:current-page="queryData.pageNum" :page-size="queryData.pageSize"
								layout="total, prev, pager, next, jumper" :total="queryData.totalPage">
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
								<el-input v-model="queryData_1.buildSectionName" placeholder="标段名称"></el-input>
							</div>
						</div>
						<div class="input-box">
							<div class="input-value">
								<el-input v-model="queryData_1.name" placeholder="人员姓名">
								</el-input>
							</div>
						</div>
						<div class="input-box">
							<div class="input-value">
								<el-button type="primary" @click="query_1">搜索</el-button>
							</div>
						</div>
						
						<div class="input-box">
							<div class="input-value">
								<el-radio v-model="queryData_1.type" label=0>在场人员</el-radio>
								<el-radio v-model="queryData_1.type" label=1>已退场人员</el-radio>
							</div>
						</div>
						
						<div class="right-btns">
							<div class="operate-btns">
								<el-button size="small">退场</el-button>
							</div>
						</div>
					</el-header>
					<el-main>
						<div class="container">
							<el-table :data="tableData_1" style="width: 100%" border height="calc(100% - 48px)"
								class="have_scrolling">
								<el-table-column type="index" width="50" align="center" label="序号">
								</el-table-column>
								<el-table-column prop="name" align="center" label="人员姓名"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="phone" align="center" label="手机号码"
									show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="card" align="center" label="身份证号" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="household" align="center" label="户籍" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="bodyStatus" align="center" label="健康状况" show-overflow-tooltip>
								</el-table-column>
								<el-table-column  label="接触中高风险疫区情况">
									<el-table-column prop="isRisk" align="center" label="是否到过中高风险地区" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="riskArea" align="center" label="中高风险地区" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="startArea" align="center" label="出发地" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="wayCity" align="center" label="途径城市" show-overflow-tooltip>
									</el-table-column>
								</el-table-column>
								<el-table-column prop="isVaccine" align="center" label="是否完成疫苗接种" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="isHealth" align="center" label="健康码(是否为绿码)" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="workType" align="center" label="工种" show-overflow-tooltip>
								</el-table-column>
								<el-table-column prop="remark" align="center" label="备注" show-overflow-tooltip>
								</el-table-column>
								<el-table-column  label="队伍公司">
									<el-table-column prop="companyName" align="center" label="名称" show-overflow-tooltip>
									</el-table-column>
									<el-table-column prop="companyPhone" align="center" label="联系电话" show-overflow-tooltip>
									</el-table-column>
								</el-table-column>
							</el-table>
							<el-pagination @current-change="handleCurrentChange_1"
								:current-page="queryData_1.pageNum" :page-size="queryData_1.pageSize"
								layout="total, prev, pager, next, jumper" :total="queryData_1.totalPage">
							</el-pagination>
						</div>
					</el-main>
				</el-container>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import * as api from "@/api/contract.js";
	import edit from './entranceAndExitManagement/edit.vue';
	import detail from './entranceAndExitManagement/detail';

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
				tableData_1: [],
				operateBtnsVisible: true,
				queryData: { //查询参数
					buildSectionName: '',
					pageNum: 1,
					draftFlag:1,
					totalPage: 1,
					pageSize: 10,
					projectId: this.$store.getters.project['id']
				},
				queryData_1: { //查询参数
					buildSectionName: '',
					name:'',
					type:0,
					draftFlag:1,
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
			this.query_1();
		},
		methods: {
			query() {
				api.getEnterExitList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.allData['list'] || [];
					this.queryData.pageNum = res.data.pageNum;
					this.queryData.totalPage = res.data.total;
					this.queryData.pageSize = res.data.pageSize;
				});
			},
			query_1() {
				api.getEnterExitUserList(this.queryData_1).then((res) => {
					res.data = res.data || {};
					this.tableData_1 = res.data['list'] || [];
					this.queryData_1.pageNum = res.data.pageNum;
					this.queryData_1.totalPage = res.data.total;
					this.queryData_1.pageSize = res.data.pageSize;
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
						if (this.tableData.length == 1) {
							this.queryData.pageNum = this.queryData.pageNum> 1 ? this.queryData.pageNum - 1 : 1
						}
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
			handleCurrentChange(page) {
				this.queryData.pageNum=page
				this.query()
			},
			handleCurrentChange_1(page){
				this.queryData_1.pageNum=page
				this.query_1()
			}
		},
	};
</script>
<style scoped lang="scss">
	@import "../../assets/css/table.scss"
</style>
