<!--
 * @Descripttion:质量简报
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 14:12:16
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 14:12:22
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
					<el-input v-model="queryData.processDefinitionKey" placeholder="请输入流程标识"></el-input>
				</div>
			</div>
			<div class="input-box">
				<div class="input-value">
					<el-input  v-model="queryData.taskName" placeholder="请输入任务名称"></el-input>
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
					<el-table-column prop="processDefinitionName" align="center" label="流程名称" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="taskName" align="center" label="当前任务" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="processInstanceInitiatorName" align="center" label="任务发起人" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="processInstanceStartTime" align="center" label="任务发起时间" show-overflow-tooltip>
					</el-table-column>
					<el-table-column fixed="right" width="120" align="center" label="操作">
						<template slot-scope="{ row, $index }">
							<el-button type="text" @click="gotoHandle(row)" size="mini">办理</el-button>
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
  import {mapGetters} from "vuex";
  import * as api from "@/api/quality";
  import {constantRoutes} from "@/router/router";
  import {setToken} from "@/utils/auth";

  export default {
    data() {
      return {
        tableData: [],
        queryData: {
          processDefinitionName: "",
          processDefinitionKey: "",
          taskName: "",
          taskHandleStatus: 1,
          pageParam: {
            pageNum: 1,
            totalPage: 1,
            pageSize: 10
          }
        },
        routes: null,
        detailRouters: []
      };
    },
    created() {
      this.routes = this.menus;
      let detailRouter = constantRoutes.find(e => e.name === "handlerFlowTask");
      this.detailRouters = detailRouter?.children;
    },
    components: {},
    computed: {
      ...mapGetters(["menus"])
    },
    mounted() {
      this.query();
    },
    methods: {
      query() {
        api.listHandleTask(this.queryData).then((res) => {
          this.allData = res.data || {};
          this.tableData = this.allData.list || [];
          this.queryData.pageParam.pageNum = res.data.pageNum;
          this.queryData.pageParam.totalPage = res.data.total;
          this.queryData.pageParam.pageSize = res.data.pageSize;
        });
      },
      handleCurrentChange(page) {
        this.queryData.pageNum = page;
        this.query();
      },
      gotoHandle(row) {
        row["taskFormKey"] = (typeof row["taskFormKey"]) == "string" ? JSON.parse(row["taskFormKey"]) : row["taskFormKey"];
        let key = row["taskFormKey"]["routerName"];
        let router = this.detailRouters.find(e => e.code.indexOf(key) !== -1);
        let hiddenEdit = ["sgdwhtrybs", "jldwhtrybs", "qzdwhtrybs", "sgdwrybg", "jldwrybg", "qzdwrybg", "sgdwryqj", "jldwryqj", "qzdwryqj"];
        if (router) {
          setToken("taskType", 1);
          this.$router.push({
            path: router.path,
            query: {
              taskId: row.taskId,
              taskKey: row.taskKey,
              businessKey: row.businessKey,
              processDefinitionKey: row.processDefinitionKey,
              processInstanceId: row.processInstanceId,
              processDefinitionId: row.processDefinitionId,
              taskName: row.taskName,
              flowEntryName: row.processDefinitionName,
              processInstanceInitiator: row.processInstanceInitiator,
              isHiddenEdit: hiddenEdit.includes(key),
              flowKey: hiddenEdit.includes(key) ? key : ""
            }
          });
        }
        // this.routes.forEach(parent => {
        //   parent["children"].forEach(child => {
        //     if (child["meta"]["code"] == row["taskFormKey"]["routerName"]) {
        //       this.$router.push({
        //         path: child["path"] + "_detail",
        //         query: {
        //           taskId: row.taskId,
        //           businessKey: row.businessKey,
        //           processDefinitionKey: row.processDefinitionKey,
        //           processInstanceId: row.processInstanceId,
        //           processDefinitionId: row.processDefinitionId,
        //           taskName: row.taskName,
        //           flowEntryName: row.processDefinitionName,
        //           processInstanceInitiator: row.processInstanceInitiator
        //         }
        //       });
        //     }
        //   });
        // });
      }
    }
  };
</script>
<style scoped lang="scss">
	@import "../../assets/css/table.scss"
</style>
