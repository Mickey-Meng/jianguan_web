<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-16 09:07:11
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-17 14:27:40
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
        label="批复时间"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="softname"
        label="批复人"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="opiontion"
        label="文件编码"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row, $index }">
          <el-button  size="small" type="primary"  class="primary_mini" @click="editInfo(row)">
            编辑
          </el-button>
          <el-button size="small" type="primary"   class="primary_mini" @click="downLoadFile(row)">
            下载
          </el-button>
          <el-button  size="small" type="danger" v-if="rolePerms[0] =='gly'" @click="handleDelete(row, $index)"
            >删除</el-button
          >
        </template></el-table-column
      >
    </el-table>
  </div>
</template>

<script>
  import {getFile, deleteFile} from "@/api/file";
  import { downLoadFile, downLoadRowFile } from "@/utils/download";
  import {mapGetters} from "vuex";


  export default {
    name: "",
    props: {
      DataArr: {
        type: Array,
        default: () => []
      }
    },
    components: {},
    data() {
      return {
        tableData: []
      };
    },
    created() {
      this.tableData = this.DataArr;
    },
    computed: {
      ...mapGetters(["rolePerms"])
    },
    mounted() {
    },
    methods: {
      handleDelete(row, index) {
        this.$confirm("是否删除该文件?", "删除文件", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          customClass: "ceshi",
          type: "warning"
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
      this.$emit("opdateInfo", { row, key: "reportfile" });
    },
    downLoadFile(row) {
      //downLoadFile(row.fileurl);

      let fileNameBase64 = btoa(unescape(encodeURIComponent(row.uploadname + "." + row.uploadtype)))
      let update = fileNameBase64.replace(/\+/g, '-').replace(/\//g, '_')
      const myObject = {};
      myObject.fileId = row.fileurl;
      myObject.uploadname = update;
      myObject.uploadtype = row.uploadtype;
      const myString = JSON.stringify(myObject);
      downLoadRowFile(myString);
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
  //::v-deep .el-button {
  //  width: 75px;
  //  height: 28px;
  //  line-height: 28px;
  //  padding: 0;
  //  color: #fff;
  //  //background-image: url(../../../assets/image/导出.png);
  //  background-size: 100% 100%;
  //  background-repeat: no-repeat;
  //  text-align: center;
  //}
}
</style>
