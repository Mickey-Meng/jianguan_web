<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-21 17:00:15
-->
<template>
  <el-container class="container-box">
    <el-header>
      <el-button type="primary" @click="showDialog">添加合同</el-button>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" border height="100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="uploadname" label="合同名称"></el-table-column>
        <el-table-column prop="uploadtime" label="时间"></el-table-column>
        <el-table-column prop="uploadtype" label="文件类型"></el-table-column>
        <!-- <el-table-column label="预览"></el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="primary" class="primary_mini" @click="showEdit(row)"
              >编辑</el-button
            >
            <el-button size="mini" class="primary_mini" type="primary" @click="downFile(row)"
              >下载</el-button
            >
            <el-button v-if="$store.getters.rolePerms && $store.getters.rolePerms[0] == 'gly'"
              size="mini"
              type="danger"
              @click="handleDelete(row, $index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer />
    <el-dialog
      :title="isCreate ? '上传合同' : '修改信息'"
      :visible.sync="dialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        :model="form"
        v-if="dialogVisible"
        ref="form"
        size="small"
        label-position="right"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="合同名称" prop="uploadname">
          <el-input
            placeholder="请输入合同名称"
            v-model="form.uploadname"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传合同" prop="fileurl" v-if="isCreate">
          <uploadFile
            ref="otherOrgAttachments"
            @changeValue="changeValue"
          ></uploadFile>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary"  class="primary_mini"  @click="addFile">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import {uploadF, getFile, deleteFile, updateFileInfo} from "@/api/file";
  import {downLoadFile} from "@/utils/download";
  import {mapGetters} from "vuex";
  // const docx = require("docx-preview");
  // window.JSZip = require("jszip");
  export default {
    name: "",
    data() {
      return {
        dialogVisible: false,
        isCreate: false,
        showPreview: true,
        tableData: [],
      form: {
        fileurl: "",
        uploadname: "",
        uploadtype: "",
        uploadusername: "",
        type: 1,
      },
      rules: {
        uploadname: [
          { required: true, message: "请输入合同名称", trigger: "blur" },
        ],
        fileurl: [
          { required: true, message: "请上传合同文件", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initData();
  },

    mounted() {
      // this.$axios({
      //   method: "get",
      //   responseType: "blob", // 设置响应文件格式
      //   url: "/mong/preview?fileid=620da6edfe834755c49cf7b2",
      // }).then((res) => {
      //   // console.log(new Blob(res.data));
      //   // docx.renderAsync(new Blob(res.data), this.$refs.file); // 渲染到页面预览
      // });
    },
    computed: {
      ...mapGetters(["project"])
    },
    methods: {
      showDialog() {
        this.isCreate = true;
        this.dialogVisible = true;
        this.form = {
          fileurl: "",
          uploadname: "",
          uploadtype: "",
          uploadusername: "",
          type: 1,
          projectId: this.project.id
      };
    },
    showEdit(row) {
      this.isCreate = false;
      this.form = Object.assign({}, row);
      this.dialogVisible = true;
    },
    initData() {
      getFile(1,this.project.id).then((res) => {
        this.tableData = res.data;
      });
    },
    addFile() {
      if (this.isCreate) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            uploadF(obj).then((res) => {
              this.dialogVisible = false;
              this.$message({
                message: "文件上传上传成功",
                type: "success",
                customClass: "message_override",
              });
              this.initData();
            });
          } else {
            return false;
          }
        });
      } else {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            updateFileInfo(obj).then((res) => {
              this.dialogVisible = false;
              this.$message({
                message: "信息修改成功",
                type: "success",
                customClass: "message_override",
              });
              this.initData();
            });
          } else {
            return false;
          }
        });
      }
    },
    downFile(row) {
      downLoadFile(row.fileurl);
    },
    changeValue(value) {
      if (value) {
        this.form = Object.assign(this.form, value);
      } else {
        this.form.fileurl = "";
        this.form.uploadtype = "";
      }
    },
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
  },
};
</script>

<style scoped lang="scss">

</style>
