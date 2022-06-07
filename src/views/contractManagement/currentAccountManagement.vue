<!--
@name:
@description:进退场管理
@author: 王海林
@time: 2022-05-23 11:32:49
@modifier:
@modifierTime:
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.buildSectionName" placeholder="标段名称"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.billCode" placeholder="编号">
					</el-input>
				</div>
			</div>
			<el-button type="primary" @click="query">搜索</el-button>
			<div v-if="!isDraft" class="right-btns">
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
					<el-table-column prop="buildSectionName" align="center" label="施工标段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="billCode" align="center" label="账单编号" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="payUnit" align="center" label="付款单位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="gatherUnit" align="center" label="收款单位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="payAmount" align="center" label="支付金额(元)" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="statusStr" align="center" label="状态" show-overflow-tooltip>
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button v-if="!isDraft"  type="text" size="mini" @click="modify(row)">修改</el-button>
							<el-button v-if="!isDraft"  type="text" size="mini" @click="viewDetail(row)">详情</el-button>
							
							<el-button v-if="isDraft" type="text" size="mini" @click="checkDetail(row)">选择</el-button>
							
							<el-button  type="text" size="mini" @click="deleteRow(row)">删除</el-button>
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
</template>

<script>
	import * as api from "@/api/contract.js";
	import edit from './currentAccountManagement/edit.vue';
	import detail from './currentAccountManagement/detail';

	export default {
		props:{
			isDraft:{
				type:Boolean,
				default:false
			}
		},
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
					billCode: '',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
					projectId: this.$store.getters.project['parentid']
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
				this.queryData.draftFlag=this.isDraft?0:1;
				api.getComeGoMoneyList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.allData['list'] || [];
					this.queryData.pageNum = res.data.pageNum;
					this.queryData.totalPage = res.data.total;
					this.queryData.pageSize = res.data.pageSize;
				});
			},
			addNew() {
				// this.editRow = null;
				this.$refs.edit.changeVisible(null,true);
			},
			modify(row) {
				// this.editRow = row;
				this.$refs.edit.changeVisible(row,true);
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
					api.deleteComeGoMoney(row['id']).then((res) => {
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
			checkDetail(row){
				this.$emit("hideDraft");
				this.$emit("getDetail",row['id']);
			}
		},
	};
</script>
<style scoped lang="scss">
	@import "../../assets/css/table.scss"
</style>
