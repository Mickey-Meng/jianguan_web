<!--
 * @Descripttion:质量检测
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
					<el-input v-model="queryData.buildSection" placeholder="标段"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.name" placeholder="材料名称"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input v-model="queryData.specification" placeholder="材料规格"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-select v-model="queryData.detectionResult" placeholder="检测结果">
						<el-option v-for="item in examineResultOptions" :key="item.value" :label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-date-picker v-model="queryData.createStartTime" type="date" placeholder="开始日期">
					</el-date-picker>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-date-picker v-model="queryData.createEndTime" type="date" placeholder="结束日期">
					</el-date-picker>
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
					<el-table-column prop="buildSection" align="center" label="标段" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="materialsName" align="center" label="材料名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="fillDate" align="center" label="填报日期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="materialSpecification" align="center" label="材料规格" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="projectParts" align="center" label="工程部位" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="testResult" align="center" label="检测结果">
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button type="text" size="mini" @click="modify(row)">修改</el-button>
							<el-button type="text" size="mini" @click="viewDetail(row)">详情</el-button>
							<el-button type="text" size="mini" @click="deleteRow(row)">删除</el-button>
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
	import edit from './qualityTest/edit';
	import detail from './qualityTest/detail';
	import { mapGetters } from 'vuex'

	export default {
		components: {
			edit,
			detail
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
					buildSection: null,
					createEndTime: null,
					createStartTime: null,
					detectionResult: null,
					draftFlag: 1,
					name: '',
					specification: '',
					pageNum: 1,
					totalPage: 1,
					pageSize: 10,
					projectId:this.$store.getters.project['parentid']
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
				api.getQualityDetectionList(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = this.formateTableData(res.data.list);
					this.queryData.pageNum = res.data.pageNum;
					this.queryData.totalPage = res.data.total;
					this.queryData.pageSize = res.data.pageSize;
				});
			},
			formateTableData(list) {
				list = list || [];
				list.forEach(item => {
					item['materialSpecification'] = item['materialSpecification'] ? item['materialSpecification']
						.join('、') : '';
					item['materialsName'] = item['materialsName'] ? item['materialsName'].join('、') : '';
					item['projectParts'] = item['projectParts'] ? item['projectParts'].join('、') : '';
					item['testResult'] = item['testResult'] ? item['testResult'].join('、') : '';
				})
				return list;
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
					api.deleteQualityDetection({
						id: row['id']
					}).then((res) => {
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
			}
		},
	};
</script>
<style scoped lang="scss">
	@import "../../../assets/css/table.scss"
</style>
