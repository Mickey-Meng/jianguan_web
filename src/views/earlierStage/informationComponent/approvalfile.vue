<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-16 09:07:11
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-17 14:26:13
-->
<template>
  <div class="wrapper">
    <el-table :data="tableData" height="100%" border style="width: 100%">
      <el-table-column
        prop="uploadname"
        label="文件名称"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="uploadtype"
        label="文件类型"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="calltime"
        label="报批时间"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="softname"
        label="报批人"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="opiontion"
        label="文件编码"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="text" size="small" @click="editInfo(row)">
            编辑
          </el-button>
          <el-button type="text" size="small" @click="downLoadFile(row)">
            下载
          </el-button>
          <el-button type="text" size="small" @click="handleDelete(row, $index)"
            >删除</el-button
          >
        </template></el-table-column
      >
    </el-table>
  </div>
</template>

<script>
import { getFile, deleteFile } from "@/api/file";
import { downLoadFile } from "@/utils/download";

export default {
  name: "",
  props: {
    DataArr: {
      type: Array,
      default: () => [],
    },
  },
  components: {},
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.tableData = this.DataArr;
  },
  computed: {},
  mounted() {},
  methods: {
    handleDelete(row, index) {
      this.$confirm("是否删除该文件?", "删除文件", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        customClass: "ceshi",
        type: "warning",
      }).then(() => {
        deleteFile(row.id).then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
            customClass: "message_override",
          });
          this.tableData.splice(index, 1);
        });
      });
    },
    editInfo(row) {
      this.$emit("opdateInfo", { row, key: "approvalfile" });
    },
    downLoadFile(row) {
      downLoadFile(row.fileurl);
    },
  },
  watch: {
    DataArr(n) {
      this.tableData = this.DataArr;
    },
  },
};
</script>

<style scoped lang='scss'>
.wrapper {
  height: 100%;
  //padding: 5px;
  ::v-deep .el-button {
    width: 75px;
    height: 28px;
    line-height: 28px;
    padding: 0;
    color: #fff;
    background-image: url(../../../assets/image/导出.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    text-align: center;
  }
}
</style>
