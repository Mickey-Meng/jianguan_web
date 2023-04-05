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
					<el-input v-model="queryData.metrologyNo" placeholder="编号"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.applyUnit" placeholder="申请单位"></el-input>
				</div>
			</div>
			<el-button type="primary" @click="query">搜索</el-button>
			<div v-if="!isDraft" class="right-btns">
				<div class="operate-btns" v-show="operateBtnsVisible">
					<el-button size="small" @click="addNew">新增</el-button>
					<el-button size="small" @click="exportData">导出</el-button>
					<el-button size="small" v-show="false">批量操作</el-button>
				</div>
			</div>
		</el-header>
		<el-main>
			<div class="container">
				<el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
					class="have_scrolling">
					<el-table-column type="index" width="50" align="center" label="序号">
					</el-table-column>
					<el-table-column prop="metrologyNo" align="center" label="计量编号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="metrologyName" align="center" label="计量期数" show-overflow-tooltip></el-table-column>
					<el-table-column prop="startDate" align="center" label="计量开始时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="endDate" align="center" label="计量结束时间" show-overflow-tooltip></el-table-column>
					<el-table-column prop="applyUnit" align="center" label="申请单位" show-overflow-tooltip></el-table-column>
					<el-table-column prop="content" align="center" label="计量内容" show-overflow-tooltip></el-table-column>
					<el-table-column prop="amount" align="center" label="计量金额" show-overflow-tooltip></el-table-column>
					<el-table-column prop="auditStatus" align="center" label="审批状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.auditStatus == 1"
                size="mini"
                type="success"
              >
                审批中
              </el-tag>
              <el-tag
                v-if="scope.row.auditStatus == 2"
                size="mini"
                type="warning"
              >
                已审批
              </el-tag>
            </template>
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
  import * as api from "@/api/metrology.js";
	import edit from './ledger/edit.vue';
	import detail from './ledger/detail';

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
					laborContractProjectName: '',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
					buildSection: this.$store.getters.project.id,projectId:this.$store.getters.project['parentid']
				},
				editRow: null,
				detailRow: null
			};
		},
		created() {},
		computed: {
		  auditStatusDesc(auditStatus, a, b, c) {
		    debugger;
		    if(auditStatus === "1") {
		      return "审批中";
        }
          return "已审批";
      }
		},
		mounted() {
			this.query();
		},
		methods: {
			query() {
				this.queryData.draftFlag=this.isDraft?0:1;
				api.getMetrologyList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.allData['list']||[];
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
					api.deleteMetrology(row['id']).then((res) => {
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
				api.exportMetrologyList(this.queryData).then((res) => {
					const reader = new FileReader();
					reader.readAsDataURL(res);
					reader.onload = (e) => {
						const a = document.createElement('a');
						a.download = `劳务分包合同清单.xls`;
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
	@import "../../assets/css/table.scss"
</style>
