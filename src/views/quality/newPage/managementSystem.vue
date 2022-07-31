<!--
@name:
@description: 管理制度
@author: zhouhai
@time: 2022-05-13 09:17:45
@modifier:
@modifierTime:
-->
<template>
	<el-container class="container-box">
		<el-header>
			<div v-if="!isDraft" class="right-btns">
				<div class="operate-btns" v-show="operateBtnsVisible">
					<el-button size="small" @click="addNew">新增</el-button>
					<el-button size="small" @click="exportData">导出</el-button>
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
					<!-- <el-table-column prop="compileDeptName" align="center" label="编制单位" show-overflow-tooltip>
					</el-table-column> -->
					<el-table-column prop="compileUser" align="center" label="编制人" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="compileDate" align="center" label="编制时间" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="regimeContent" align="center" label="制度内容" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="updateTime" align="center" label="更新时间" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="deletedFlagStr" align="center" label="数据状态" show-overflow-tooltip>
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
				<el-pagination @current-change="handleCurrentChange" :current-page="queryData.pageNum"
					:page-size="queryData.pageSize" layout="total, prev, pager, next, jumper"
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
	import store from "@/store/index";
	import edit from './managementSystem/edit';
	import detail from './managementSystem/detail';
	
	export default {
		props:{
			isDraft:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				allData: [],
				tableData: [],
				operateBtnsVisible: true,
				dialogFormVisible: false,
				queryData: { //查询参数
					
					draftFlag: 1,
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
					buildSection: this.$store.getters.project.id,
					projectId:this.$store.getters.project['parentid']
				},
				currentPattern: 0, //0查看，1新增，2修改
				editRow: null,
				detailRow: null
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
				this.queryData.draftFlag=this.isDraft?0:1;
				api.getManageRegimeList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.allData?this.allData.list:[];
					this.queryData.pageNum = res.data.pageNum;
					this.queryData.totalPage = res.data.total;
					this.queryData.pageSize = res.data.pageSize;
				});
				
			},
			addNew() {
				this.$refs.edit.changeVisible(null,true);
			},
			modify(row) {
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
					api.deleteManageRegime(row['id']).then((res) => {
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
			},
			exportData() {
				this.queryData.draftFlag = 1;
				api.exportManageRegimeList(this.queryData).then((res) => {
					const reader = new FileReader();
					reader.readAsDataURL(res);
					reader.onload = (e) => {
						const a = document.createElement('a');
						a.download = `管理制度清单.xls`;
						a.href = e.target.result;
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
					};
				});
			}
		},
	};
</script>
<style scoped lang="scss">
	@import "../../../assets/css/table.scss"
</style>