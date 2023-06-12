<!--
 * @Descripttion:施工方案
 * @version:
 * @Author: zhouhai
 * @Date: 2022-05-09 14:16:58
 * @LastEditors: zhouhai
 * @LastEditTime: 2022-05-09 14:17:04
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.buildPlanName" placeholder="专项施工方案名称"></el-input>
        </div>

      </div>
      <!-- <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.buildSectionName" placeholder="施工标段"></el-input>
        </div>
      </div>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.supervisionSectionName" placeholder="监理标段"></el-input>
        </div>
      </div> -->
      <el-button @click="query" type="primary">搜索</el-button>

      <div v-if="!isDraft" class="right-btns">
        <!-- <el-button type="primary" size="small"
          :icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
          @click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
        <div class="operate-btns" v-show="operateBtnsVisible">
          <el-button size="small" @click="addNew">新增</el-button>
          <el-button size="small" @click="exportData">导出</el-button>
          <!-- <el-button size="small">批量操作</el-button> -->
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)"
                  class="have_scrolling">
          <el-table-column type="index" width="50" align="center" label="序号">
          </el-table-column>
          <el-table-column prop="projectName" align="center" label="项目名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="projectCode" align="center" label="工程编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="buildSectionName" align="center" label="标段" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="buildPlanName" align="center" label="专项施工方案名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status == '2'"
                size="mini"
                type="warning"
              >
                驳回
              </el-tag>
              <el-tag
                v-if="scope.row.status == '0'"
                size="mini"
                type="default"
              >
                审批中
              </el-tag>
              <el-tag
                v-if="scope.row.status == '1'"
                size="mini"
                type="success"
              >
                已审批
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="120" align="center" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button v-if="editStatus(row)" type="text" size="mini" @click="modify(row)">修改</el-button>
              <el-button v-if="!isDraft" type="text" size="mini" @click="viewDetail(row)">详情</el-button>

              <el-button v-if="isDraft" type="text" size="mini" @click="checkDetail(row)">选择</el-button>
              <el-button type="text" size="mini" v-if="$store.getters.rolePerms && $store.getters.rolePerms[0] == 'gly'"
                         @click="deleteRow(row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="queryData.pageNum"
                       :page-size="queryData.pageSize" layout="total, prev, pager, next, jumper"
                       :total="queryData.totalPage">
        </el-pagination>
      </div>
    </el-main>
    <edit v-if="!isDraft" ref="edit" @query="query" :editRow="editRow"></edit>
    <detail v-if="!isDraft" ref="detail" :detailRow="detailRow"></detail>
  </el-container>
</template>

<script>
import * as api from "@/api/quality";
import edit from './constructionScheme/edit';
import detail from './constructionScheme/detail';

export default {
  props: {
    isDraft: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allData: {},
      tableData: [],
      operateBtnsVisible: true,
      dialogTitle: '智慧建设通用版-【绍兴市】235国道杭州',
      dialogFormVisible: false,
      queryData: {
        buildPlanName: '',
        buildSectionName: '',
        supervisionSectionName: '',
        pageNum: 1,
        totalPage: 1,
        pageSize: 10,
        buildSection: this.$store.getters.project.id,
        projectId: this.$store.getters.project['parentid']
      },
      editRow: null,
      detailRow: null
    };
  },
  created() {
  },
  components: {
    edit,
    detail
  },
  computed: {},
  mounted() {
    this.query();
  },
  methods: {
    editStatus(row) {
      if (row.status != 2) {
        return false;
      }
      if (row.createUserId == this.$store.getters.userInfo.ID) {
        return true;
      }
      if (this.$store.getters.rolePerms[0] == 'gly') {
        return true;
      }
      return false;
    },
    query() {
      this.queryData.draftFlag = this.isDraft ? 0 : 1;
      api.getBuildPlanList(this.queryData).then((res) => {
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

      })
      return list;
    },
    addNew() {
      // this.editRow=null;
      this.$refs.edit.changeVisible(null, true);
    },
    modify(row) {
      // this.editRow=row;
      this.$refs.edit.changeVisible(row, true);
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
        api.deleteBuildPlan({id: row['id']}).then((res) => {
          if (this.tableData.length == 1) {
            this.queryData.pageNum = this.queryData.pageNum > 1 ? this.queryData.pageNum - 1 : 1
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
      this.queryData.pageNum = page
      this.query()
    },
    checkDetail(row) {
      this.$emit("hideDraft");
      this.$emit("getDetail", row['id']);
    },
    exportData() {
      this.queryData.draftFlag = 1;
      api.exportBuildPlanList(this.queryData).then((res) => {
        const reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onload = (e) => {
          const a = document.createElement('a');
          a.download = `施工方案清单.xls`;
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
