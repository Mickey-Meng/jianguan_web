<!--
 * @Descripttion:计划报审-施工图设计
 * @version:
 * @Author: WangHarry
 * @Date: 2023-6-19 20:59:08
 * @LastEditors: mengzhengbin
 * @LastEditTime: 2023-6-19 20:59:16
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.name" placeholder="施工图名称"></el-input>
        </div>
      </div>
      <div class="input-box">
        <div class="input-value">
          <el-select v-model="queryData.status" placeholder="请选择审核状态">
            <el-option 
              v-for="item in statusOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <el-button type="primary" @click="query">搜索</el-button>
      <div v-if="!isDraft" class="right-btns">
        <div class="operate-btns" v-show="operateBtnsVisible">
          <el-button size="small" @click="addNew">新增</el-button>
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
          <el-table-column prop="name" align="center" label="施工图名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="contents" align="center" label="施工图内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="startTime" align="center" label="计划开始时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="endTime" align="center" label="计划结束时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="reportTime" align="center" label="上报时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="reportUser" align="center" label="上报人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="owner" align="center" label="责任人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" align="center" label="审核状态" show-overflow-tooltip>
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
              <el-button type="text" size="mini" @click="viewDetail(row)">详情</el-button>
              <el-button v-if="editStatus(row)" type="text" size="mini" @click="deleteRow(row)">删除</el-button>
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
import * as api from "@/api/constructionDesign/planConstructionDesign";
import edit from './edit.vue';
import detail from './detail';

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
      statusOptions: [
        { value: "0", label: "审批中" },
        { value: "1", label: "已审批" },
        { value: "2", label: "驳回" },
      ],
      allData: [],
      tableData: [],
      operateBtnsVisible: true,
      queryData: { //查询参数
        name: '',
        status: '',
        pageNum: 1,
        totalPage: 1,
        pageSize: 10,
        buildSection: this.$store.getters.project.id,
        projectId:this.$store.getters.project['parentid']
      },
      editRow: null,
      detailRow: null
    };
  },
  created() {},
  computed: {
  },
  mounted() {
    this.query();
  },
  methods: {
    editStatus(row) {
      if(row.status == 0 || row.status == 1) {
        return false;
      }
      if(row.createUserId == this.$store.getters.userInfo.ID) {
        return true;
      }
      if(this.$store.getters.rolePerms[0] == 'gly') {
        return true;
      }
      return false;
    },
    query() {
      this.queryData.draftFlag=this.isDraft?0:1;
      api.getPlanConstructionDesignList(this.queryData).then((res) => {
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
        api.deletePlanConstructionDesign(row['id']).then((res) => {
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
