<!--
 * @Descripttion:监理旁站
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 14:12:51
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 14:15:22
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.processDefinitionName" placeholder="请输入流程名称"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-date-picker v-model="queryData.createDate" type="daterange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</div>
			</div>
			<el-button type="primary">搜索</el-button>
		</el-header>
		<el-main>
			<div class="container">
				<el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
					class="have_scrolling">
					<el-table-column type="index" width="50" align="center" label="序号">
					</el-table-column>
					<el-table-column prop="processDefinitionName" align="center" label="流程名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="processDefinitionKey" align="center" label="流程标识" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="name" align="center" label="任务名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="approvalType" align="center" label="执行操作" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="startUser" align="center" label="任务发起人" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="createTime" align="center" label="任务发起时间" show-overflow-tooltip>
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button type="text" size="mini">详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
					:current-page="queryData.pageNum" :page-size="queryData.pageSize"
					layout="total, sizes, prev, pager, next, jumper" :total="queryData.totalPage">
				</el-pagination>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	import * as api from "@/api/quality";
	export default {
		data() {
			return {
				tableData: [],
				queryData: {
					processDefinitionName:undefined,
					createDate:'',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
				},
			};
		},
		created() {},
		components: {},
		computed: {},
		mounted() {
			this.query();
		},
		methods: {
			query(){
				api.listHistoricProcessInstance(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.allData.list||[];
					this.queryData.pageNum = res.data.pageNum;
					this.queryData.totalPage = res.data.total;
					this.queryData.pageSize = res.data.pageSize;
				});
			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			}
		}
	}
</script>
<style scoped lang="scss">
	@import "../../assets/css/table.scss"
</style>
