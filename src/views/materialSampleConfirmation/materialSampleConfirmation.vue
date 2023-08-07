<template>
  <el-container class="container-box">
    <el-header>
<!--      <div v-if="!isDraft" class="left-btns">-->
<!--        <div class="operate-btns" v-show="operateBtnsVisible">-->
<!--          <el-button size="small" @click="addNew">新增</el-button>-->
<!--        </div>-->
<!--      </div>-->
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
          <el-table-column prop="materialBrand" align="center" label="材料品牌" show-overflow-tooltip></el-table-column>
          <el-table-column prop="materialCategory" align="center" label="材料类别" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sampleContent" align="center" label="样板内容" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status1" align="center" label="审核状态" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.status1 == '2'"
                size="mini"
                type="warning"
              >
                驳回
              </el-tag>
              <el-tag
                v-if="scope.row.status1 == '0'"
                size="mini"
                type="default"
              >
                审批中
              </el-tag>
              <el-tag
                v-if="scope.row.status1 == '1'"
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
import * as api from "@/api/materialSampleConfirmation.js";
import edit from '../materialSampleConfirmation/edit.vue';
import detail from '../materialSampleConfirmation/detail.vue';
import {deletematerialSampleConfirmation, getmaterialSampleConfirmationList} from "@/api/materialSampleConfirmation.js";

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
      if(row.status == 1&&row.status1==-1) {
        return true;
      }
      if(row.status1 != 2) {
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
      api.getmaterialSampleConfirmationList(this.queryData).then((res) => {
        this.allData = res.data || {};
        this.tableData = this.allData['list']||[];
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
        api.deletematerialSampleConfirmation(row['id']).then((res) => {
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
@import "../../assets/css/table"
</style>
