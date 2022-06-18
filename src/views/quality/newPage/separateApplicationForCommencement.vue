<!--
 * @Descripttion:分项开工申请
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 14:10:50
 * @LastEditors: yangtao
 * @LastEditTime: 2022-05-11 14:10:57
-->
<template>
	<el-container class="container-box">
		<el-header>
			<!-- <div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.buildSection" placeholder="标段"></el-input>
				</div>
			</div> -->
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.place" placeholder="地点或桩号"></el-input>
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
					<el-table-column prop="projectName" align="center" label="标段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="buildUnits" align="center" label="施工单位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="openDate" align="center" label="建议开工日期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="endDate" align="center" label="计划完工日期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="place" align="center" label="地点或桩号" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="liveUserName" align="center" label="现场负责人" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="buildUserName" align="center" label="施工员" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="checkUserName" align="center" label="质检员" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="statusStr" align="center" label="状态">
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
	import {
		convertOptions
	} from "@/utils/format.js";
	import edit from './separateApplicationForCommencement/edit';
	import detail from './separateApplicationForCommencement/detail';
	import { mapGetters } from 'vuex'

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
				dialogFormVisible: false,
				queryData: { //查询参数
					place: '',
					draftFlag: 1,
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
				this.queryData.draftFlag=this.isDraft?0:1;
				api.getSubitemOpenList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.allData.list;
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
					api.deleteSubitemOpen(row['id']).then((res) => {
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
	@import "../../../assets/css/table.scss"
</style>
