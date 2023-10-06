<!--
 * @Descripttion:质量简报
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
          <el-input placeholder="简报名称" v-model="queryData.title"></el-input>
        </div>
      </div>

      <el-button type="primary" @click="query">搜索</el-button>
      <div v-if="!isDraft" class="right-btns">
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
          <el-table-column prop="buildSectionName" align="center" label="标段" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="title" align="center" label="简报名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="createTime" align="center" label="发布时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="statusStr" align="center" label="状态">
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryData.pageNum" :page-size="queryData.pageSize"
          :total="queryData.totalPage" layout="total, sizes, prev, pager, next, jumper" >
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
  formatDate
} from "@/utils/format.js";
import edit from './qualityPresentation/edit';
import detail from './qualityPresentation/detail';
import {mapGetters} from 'vuex'

export default {
  props: {
    isDraft: {
      type: Boolean,
      default: false
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
        buildSectionName: '',
        title: '',
        draftFlag: 1,
        pageNum: 1,
        totalPage: 1,
        pageSize: 10,
        buildSection: this.$store.getters.project.id,
        projectId: this.$store.getters.project['parentid']
      },
      currentPattern: 0, //0查看，1新增，2修改
      editRow: null,
      detailRow: null
    };
  },
  created() {
  },
  computed: {
    ...mapGetters(["project"])
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
      this.queryData.draftFlag = this.isDraft ? 0 : 1;
      api.getQualityReportList(this.queryData).then((res) => {
        this.allData = res.data || {};
        this.tableData = this.allData.list;
        this.queryData.pageNum = res.data.pageNum;
        this.queryData.totalPage = res.data.total;
        //console.log("是否最后一页(当前页:" + res.data.pageNum +", 总页数:" + res.data.pages +"):" , (res.data.pageNum !== res.data.pages));
        if (res.data.pageNum !== res.data.pages) {
          // 当前页不是最后一页
          this.queryData.pageSize = res.data.pageSize;
        }
      });
    },
    addNew() {
      // this.editRow = null;
      this.$refs.edit.changeVisible(null, true);
    },
    modify(row) {
      // this.editRow = row;
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
        api.deleteQualityReport(row['id']).then((res) => {
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
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.queryData.pageNum = 1;
      this.query();
    },
    handleCurrentChange(page) {
      this.queryData.pageNum = page;
      this.query();
    },
    checkDetail(row) {
      this.$emit("hideDraft");
      this.$emit("getDetail", row['id']);
    },
    exportData() {
      this.queryData.draftFlag = 1;
      api.exportQualityReportList(this.queryData).then((res) => {
        const reader = new FileReader();
        reader.readAsDataURL(res);
        reader.onload = (e) => {
          const a = document.createElement('a');
          a.download = `质量简报清单.xls`;
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
