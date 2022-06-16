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

			<el-button type="primary" @click="refreshFormFlowEntry">搜索</el-button>
      
			<div class="right-btns">
				<div class="operate-btns">
					<el-button size="small" @click="onAddFlowEntryClick">新建</el-button>
				</div>
			</div>
		</el-header>
		<el-main>
			<div class="container">
				<el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
					class="have_scrolling">
					<el-table-column type="index" width="50" align="center" label="序号">
					</el-table-column>
					<el-table-column prop="processDefinitionName" align="center" label="流程名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="processDefinitionKey" align="center" label="流程key" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="status" align="center" label="发布状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status == 1"
                size="mini"
                type="success"
              >
                已发布
              </el-tag>
              <el-tag
                v-if="scope.row.status == 0"
                size="mini"
                type="warning"
              >
                未发布
              </el-tag>
            </template>
					</el-table-column>
					<el-table-column prop="mainFlowEntryPublish" align="center" label="流程主版本" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.mainFlowEntryPublish"
                size="mini"
                type="primary"
                effect="dark"
              >
                {{ 'V:' + scope.row.mainFlowEntryPublish.publishVersion }}
              </el-tag>
              <el-tag
                v-if="scope.row.mainFlowEntryPublish"
                size="mini"
                effect="dark"
                style="margin-left: 10px"
                :type="
                  scope.row.mainFlowEntryPublish.activeStatus
                    ? 'success'
                    : 'danger'
                "
              >
                {{
                  scope.row.mainFlowEntryPublish.activeStatus ? '激活' : '挂起'
                }}
              </el-tag>
            </template>
					</el-table-column>
					<el-table-column prop="createTime" align="center" label="创建日期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="updateTime" align="center" label="最后更新日期" show-overflow-tooltip>
					</el-table-column>
					<el-table-column fixed="right" width="320" align="center" label="操作">
						<template slot-scope="scope">
							<!-- <el-button class="table-btn success" @click.stop="onStartFlowEntryClick(scope.row)"
								type="text" size="mini" :disabled="!( scope.row.mainFlowEntryPublish && scope.row.mainFlowEntryPublish.activeStatus)">启动</el-button> -->
							<el-button class="table-btn success"
								@click.stop="onEditFlowEntryClick(scope.row)" type="text" size="mini">编辑</el-button>
							<el-button @click.stop="onPublishedClick(scope.row)" type="text" size="mini">发布</el-button>
							<el-button @click.stop="onPublishedEntryListClick(scope.row)" type="text" size="mini">版本管理</el-button>
							<el-button type="text" size="mini" @click.stop="onDeleteFlowEntryClick(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @current-change="handleCurrentChange" :current-page="queryData.pageParam.pageNum"
					:page-size="queryData.pageParam.pageSize" layout="total, prev, pager, next, jumper"
					:total="queryData.pageParam.totalPage">
				</el-pagination>
			</div>
		</el-main>

		<!-- <edit ref="edit" @refreshFormFlowEntry="refreshFormFlowEntry" :editRow="editRow"></edit> -->
    
    <FormEditFlowEntry
      v-if="showFlowEntryDesign"
      :flowEntry="currentFlowEntry"
      @close="onEditFlowEntryClose"
    />
	</el-container>
</template>

<script>
	import * as api from "@/api/quality";
import { FlowEntryController, FlowOperationController } from '@/api/flowController.js';
	import {
		convertOptions
	} from "@/utils/format.js";
	// import edit from './liuchengpeizhi/edit';
	import { mapGetters } from 'vuex'
	import FormPublishedFlowEntry from './formPublishedFlowEntry.vue';
    import FormEditFlowEntry from './formEditFlowEntry.vue';

	export default {
		props:{
			isDraft:{
				type:Boolean,
				default:false
			}
		},
		components: {
			FormEditFlowEntry
		},
		data() {
			
			return {
				SysFlowTaskType: {
					OTHER_TASK: {
						id: 0,
						name: '其他任务',
						symbol: 'OTHER_TASK'
					},
					USER_TASK: {
						id: 1,
						name: '用户任务',
						symbol: 'USER_TASK'
					}
				},
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
					projectId:this.$store.getters.project['parentid'],

          pageParam: {pageNum: 1, pageSize: 10, totalPage: 1}
				},
				currentPattern: 0, //0查看，1新增，2修改
				editRow: null,
				detailRow: null,


        showFlowEntryDesign: false,
        currentFlowEntry: undefined,
			};
		},
		created() {},
		computed: {
			...mapGetters(["project"])
		},
		mounted() {
			this.refreshFormFlowEntry();
		},
		methods: {
			refreshFormFlowEntry() {
				FlowEntryController.list(this.queryData).then((res) => {
					this.allData = res.data || {};
					this.tableData = res.data.dataList;
          
					this.queryData.pageParam.totalPage = res.data.totalCount;
				});
			},
		onEditFlowEntryClose() {
			this.showFlowEntryDesign = false;
			this.currentFlowEntry = null;
			this.refreshFormFlowEntry();
		},
		/**
		 * 启动
		 */
		onStartFlowEntryClick(row) {
			let params = {
				processDefinitionKey: row.processDefinitionKey,
			};
			FlowOperationController.viewInitialTaskInfo(params)
			.then((res) => {
				let paramobj = {};
				if (res.data.propertyList) {
						res.data.propertyList.forEach((a) => {
						paramobj[a.name] = a.val;
					});
				}
				if (
					res.data &&
					res.data.taskType === this.SysFlowTaskType.USER_TASK.id &&
					res.data.assignedMe
				) {
					this.$router.push({
						name: res.data.routerName || 'handlerFlowTask',
						query: Object.assign(paramobj, {
							processDefinitionKey: row.processDefinitionKey,
							formId: res.data.formId,
							routerName: res.data.routerName,
							readOnly: res.data.readOnly,
							taskName: '启动流程',
							flowEntryName: row.processDefinitionName,
							operationList: (res.data.operationList || []).filter((item) => {
							return (
								item.type !== this.SysFlowTaskOperationType.CO_SIGN &&
								item.type !== this.SysFlowTaskOperationType.REVOKE
							);
							}),
							variableList: res.data.variableList,
						}),
					});
				} else {
					FlowOperationController.startOnly({
						processDefinitionKey: row.processDefinitionKey,
					})
					.then((res) => {
						this.$message.success('启动成功！');
					})
					.catch((e) => {});
				}
			})
			.catch((e) => {});
		},
		/**
		 * 新建
		 */
		onAddFlowEntryClick() {
			this.showFlowEntryDesign = true;
		},
		/**
		 * 编辑
		 */
		onEditFlowEntryClick(row) {
			this.currentFlowEntry = row;
			this.showFlowEntryDesign = true;
		},
		/**
		 * 发布
		 */
		onPublishedClick(row) {
		this.$confirm('是否发布当前工作流设计？')
			.then((res) => {
			if (row.entryId == null) {
				this.$message.error('请求失败，发现必填参数为空！');
				return;
			}
			let params = {
				entryId: row.entryId,
			};

			FlowEntryController.publish(params)
				.then((res) => {
					this.$message.success('发布成功');
					this.refreshFormFlowEntry();
				})
				.catch((e) => {});
			})
			.catch((e) => {});
		},
		/**
		 * 版本管理
		 */
		onPublishedEntryListClick(row) {
		this.$dialog
			.show(
			'版本管理',
			FormPublishedFlowEntry,
			{
				area: ['1200px', '750px'],
			},
			{
				flowEntry: row,
			}
			)
			.then((res) => {
				this.refreshFormFlowEntry();
			})
			.catch((e) => {
				this.refreshFormFlowEntry();
			});
		},
      /**
       * 删除
       */
      onDeleteFlowEntryClick(row) {
        if (row.entryId == null) {
          this.$message.error('请求失败，发现必填参数为空！');
          return;
        }
        let params = {
          entryId: row.entryId,
        };

        this.$confirm('是否删除此流程？')
          .then((res) => {
            FlowEntryController.delete(params)
              .then((res) => {
                this.$message.success('删除成功');
                this.refreshFormFlowEntry();
              })
              .catch((e) => {});
          })
          .catch((e) => {});
      },
			modify(row) {
				this.$refs.edit.changeVisible(row, true);
			},
			handleCurrentChange(page) {
				this.queryData.pageParam.pageNum=page
				this.refreshFormFlowEntry()
			},
		},
	};
</script>
<style scoped lang="scss">
	@import "../../../assets/css/table.scss"
</style>
