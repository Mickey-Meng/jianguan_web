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
					<el-date-picker v-model="queryData.beginDate" type="date" placeholder="开始日期">
					</el-date-picker>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-date-picker v-model="queryData.endDate" type="date" placeholder="结束日期">
					</el-date-picker>
				</div>
			</div>
			<!-- <div class="input-box">
				<div class="input-value">
					<el-date-picker v-model="queryData.createDate" type="daterange" range-separator="至" start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</div>
			</div> -->
			<el-button type="primary" @click="query">搜索</el-button>
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
					<el-table-column prop="startUserId" align="center" label="任务发起人" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="startTime" align="center" label="任务发起时间" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="endTime" align="center" label="任务结束时间" show-overflow-tooltip>
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button type="text" size="mini" @click="gotoHandle(row)">详情</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @current-change="handleCurrentChange"
					:current-page="queryData.pageParam.pageNum" :page-size="queryData.pageParam.pageSize"
					layout="total, prev, pager, next, jumper" :total="queryData.pageParam.totalPage">
				</el-pagination>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	import * as api from "@/api/quality";
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				tableData: [],
				queryData: {
					// processDefinitionName:'',
					// beginDate:'2021-05-15',
					// endDate:'2022-05-15',
					pageParam:{
						pageNum: 1,
						totalPage: 1,
						pageSize: 10
					},
				},
				routes:null
			};
		},
		created() {
			this.routes = this.menus;
		},
		components: {},
		computed: {
			...mapGetters(["menus"])
		},
		mounted() {
			this.query();
		},
		methods: {
			query(){
				api.listHistoricProcessInstance(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.allData.list||[];
					this.queryData.pageParam.pageNum = res.data.pageNum;
					this.queryData.pageParam.totalPage = res.data.total;
					this.queryData.pageParam.pageSize = res.data.pageSize;
				});
			},
			handleCurrentChange(page) {
				this.queryData.pageNum=page
				this.query()
			},
			gotoHandle(row){
				//row['taskFormKey']=(typeof row['taskFormKey'])=='string'?JSON.parse(row['taskFormKey']):row['taskFormKey'];
				this.routes.forEach(parent=>{
					parent['children'].forEach(child=>{
						if(child['meta']['code']==row['processDefinitionKey']){
							this.$router.push({
								path:child['path']+'_detail',
								query:{
									taskId: row.executionId,
									businessKey:row.businessKey,
									processDefinitionKey: row.processDefinitionKey,
									processInstanceId: row.processInstanceId,
									processDefinitionId: row.processDefinitionId,
									taskName: row.taskName,
									flowEntryName: row.processDefinitionName,
									processInstanceInitiator: row.processInstanceInitiator,
								}
							});
						}
					})
				})
			}
		}
	}
</script>
<style scoped lang="scss">
	@import "../../assets/css/table.scss"
</style>
