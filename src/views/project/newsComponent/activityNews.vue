<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-16 11:22:49
-->
<template>
  <el-table :data="newsData" style="width: 100%" height="100%" border>
    <el-table-column type="index" label="序号" width="80px" align="center">
    </el-table-column>
    <el-table-column prop="" label="预览" align="center">
      <template slot-scope="{ row }">
        <img :src="row.image" alt="新闻图片" class="preview" />
      </template>
    </el-table-column>
    <el-table-column prop="title" label="标题" align="center" width="750">
    </el-table-column>
    <el-table-column prop="sttime" label="时间" align="center">
    </el-table-column>
    <el-table-column label="图片" align="center">
      <template slot-scope="{ row }">
        <img-viewer :img-list="row.pic"></img-viewer>
      </template>
    </el-table-column>
    <!-- <el-table-column
        prop="address"
        label="附件"
      align="center">
      </el-table-column> -->
    <el-table-column label="操作" align="center" width="240">
      <template slot-scope="{ row, $index }">
        <el-button size="mini" type="primary" class="primary_mini" @click="seeDetail(row, $index)">详情</el-button>
        <el-button size="mini" type="primary" class="primary_mini" @click="modify(row, $index)">修改</el-button>
        <el-button size="mini"  @click="deleteNew(row, $index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { deleteNews } from "@/api/news";
export default {
  name: "",
  props: {
    newsData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    seeDetail(row) {
      this.$emit("showNewsDetail", row);
    },
    modify(row) {
      this.$emit("modifyData", row);
    },
    deleteNew(row, index) {
      this.$confirm("删除信息?", "删除", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning"
      }).then(() => {
        deleteNews({id: row.id}).then((res) => {
          this.newsData.splice(index, 1);
          this.$message({
            message: "删除成功",
            type: "success",
            customClass: "message_override"
          });
        });
      });
    },
  },
};
</script>

<style scoped>
.preview {
  width: 120px;
  height: 60px;
}
</style>
