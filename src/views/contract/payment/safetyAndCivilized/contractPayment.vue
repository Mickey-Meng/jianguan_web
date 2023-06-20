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
          <el-input v-model="queryData.recordTime" placeholder="申报日期"></el-input>
        </div>
      </div>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.status" placeholder="审核状态"></el-input>
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
          <el-table-column prop="type" align="center" label="款项类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="amount" align="center" label="款项金额" show-overflow-tooltip></el-table-column>
          <el-table-column prop="recordTime" align="center" label="填报日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remark" align="center" label="备注" show-overflow-tooltip></el-table-column>
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
              <el-button v-if="editStatus(row)"  type="text" size="mini" @click="modify(row)">修改</el-button>
              <el-button type="text" size="mini" @click="viewDetail(row)">详情</el-button>
              <el-button v-if="$store.getters.rolePerms && $store.getters.rolePerms[0] == 'gly'" type="text" size="mini" @click="deleteRow(row)">删除</el-button>
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
import * as api from "@/api/contractPayment.js";
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
      allData: [],
      tableData: [],
      operateBtnsVisible: true,
      queryData: { //查询参数
        includeTypeCodes: [],
        excludeTypeCodes: [],
        recordTime: '',
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
      if(row.status != 2) {
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
      this.queryData.includeTypeCodes = ['51'];
      api.getContractPaymentList(this.queryData).then((res) => {
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
        api.deleteContractPayment(row['id']).then((res) => {
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
@import "../../../../assets/css/table.scss"
</style>
