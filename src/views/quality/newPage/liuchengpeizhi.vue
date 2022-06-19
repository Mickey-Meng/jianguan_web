<!--
 * @Descripttion:流程配置
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 14:10:50
 * @LastEditors: 周海
 * @LastEditTime: 2022-05-11 14:10:57
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.flowName" placeholder="流程名称"></el-input>
				</div>
			</div>

			<el-button type="primary" @click="query">搜索</el-button>
		</el-header>
		<el-main>
			<div class="container">
				<el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
					class="have_scrolling">
					<el-table-column type="index" width="50" align="center" label="序号">
					</el-table-column>
					<el-table-column prop="flowName" align="center" label="流程名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="flowKey" align="center" label="流程key" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="createTime" align="center" label="创建日期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="updateTime" align="center" label="最后更新日期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button v-if="!isDraft"  type="text" size="mini" @click="addFlowEntryByFlowKey(row)" :disabled="row.count>0">生成节点</el-button>
							<el-button v-if="!isDraft"  type="text" size="mini" @click="modify(row)" :disabled="row.count==0">配置</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @current-change="handleCurrentChange" :current-page="queryData.pageNum"
					:page-size="queryData.pageSize" layout="total, prev, pager, next, jumper"
					:total="queryData.totalPage">
				</el-pagination>
			</div>
		</el-main>

		<edit ref="edit" @query="query" :editRow="editRow"></edit>
	</el-container>
</template>

<script>
	import * as api from "@/api/quality";
	import {
		convertOptions
	} from "@/utils/format.js";
	import edit from './liuchengpeizhi/edit';
	import { mapGetters } from 'vuex'

	export default {
		props:{
			isDraft:{
				type:Boolean,
				default:false
			}
		},
		components: {
			edit
		},
		data() {
			
			return {
				
				examineResultOptions: [{
					label: '全部',
					value: null
				}, {
					label: '合格',
					value: 0
				}, {
					label: '不合格',
					value: 1
				}],
				allData: [],
				tableData: [],
				operateBtnsVisible: true,
				dialogFormVisible: false,
				queryData: { //查询参数
					flowName: '',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
					buildSection: this.$store.getters.project.id,projectId:this.$store.getters.project['parentid']
				},
				currentPattern: 0, //0查看，1新增，2修改
				editRow: null,
				detailRow: null
			};
		},
		created() {},
		computed: {
			...mapGetters(["project"])
		},
		mounted() {
			this.query();
		},
		methods: {
			query() {
				api.getFlowType(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = res.data.list;
					this.queryData.pageNum = res.data.pageNum;
					this.queryData.totalPage = res.data.total;
					this.queryData.pageSize = res.data.pageSize;
				});
			},
			modify(row) {
				this.$refs.edit.changeVisible(row, true);
			},
			addFlowEntryByFlowKey(row) {
				this.$confirm("确认生成流程节点?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					let params = {
						flowKey: row.flowKey,
						typeId: row.id,
						buildSection: this.$store.getters.project.id,
						projectId:this.$store.getters.project['parentid']
					}
					api.addFlowEntryByFlowKey(params).then((res) => {
						this.$message({
							message: "节点生成成功",
							type: "success",
							customClass: "message_override",
						});
						this.query()
					});
				});
			},
			handleCurrentChange(page) {
				this.queryData.pageNum=page
				this.query()
			},
		},
	};
</script>
<style scoped lang="scss">
	@import "../../../assets/css/table.scss"
</style>
