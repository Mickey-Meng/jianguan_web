<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-16 11:20:14
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
    <el-table-column label="操作" align="center">
      <template slot-scope="{ row, $index }">
        <el-button size="mini" @click="deleteNew(row, $index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { deleteNews } from "@/api/news";
export default {
  name: "",
  props: {
    type: {
      type: String,
      default: () => "negNews",
    },
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
  created() {},
  methods: {
    initData() {
      if (this.type === "negNews") {
        this.tableData = this.newsData;
      }
    },
    deleteNew(row, index) {
      this.$confirm("删除信息?", "删除", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        deleteNews({ id: row.id }).then((res) => {
          this.newsData.splice(index, 1);
          this.$message({
            message: "删除成功",
            type: "success",
            customClass: "message_override",
          });
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.preview {
  width: 120px;
  height: 60px;
}
</style>
