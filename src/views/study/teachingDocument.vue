<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-08 16:08:59
-->
<template>
  <el-container class="container-box">
    <el-header>
      <el-button type="primary" @click="showDialog">上传教学文档</el-button>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" border height="100%">
        <el-table-column type="index" width="55" label="序号">
        </el-table-column>
        <el-table-column prop="uploadname" label="标题"> </el-table-column>
        <el-table-column prop="uploadtype" label="文件类型"> </el-table-column>
        <el-table-column prop="uploadtime" label="上传时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button type="primary" size="small" @click="downLoadFile(row)">
              下载
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row, $index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer> </el-footer>
    <el-dialog
      title="上传教学文档"
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
        <el-form-item label="文件名称" prop="uploadname">
          <el-input
            placeholder="请输入文件名称"
            v-model="form.uploadname"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传文件" prop="fileurl">
          <uploadFile
            ref="otherOrgAttachments"
            @changeValue="changeValue"
          ></uploadFile>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="addFile">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { uploadF, getFile, deleteFile, updateFileInfo } from "@/api/file";
import { downLoadFile } from "@/utils/download";
export default {
  name: "",
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      form: {
        fileurl: "", //文件url
        uploadname: "", //文件名称
        uploadtype: "", //文件类型
        uploadusername: "", //上传人
        changereason: "", //变更事由
        type: 16, //类型
        distiancename: "", //标段名称
        changecontent: "", //更新内容
        isutf: "0", //是否编码
        softname: "", //报批人 批复人
        opiontion: "", //文件编码
        callunit: "", //发布单位
        calladdr: "", //会议地点
        calltime: "",
      },
      rules: {
        uploadname: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],
        fileurl: [{ required: true, message: "请上传文件", trigger: "blur" }],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getFile(16).then((res) => {
        this.tableData = res.data;
      });
    },
    showDialog() {
      this.form = {
        fileurl: "",
        uploadname: "",
        uploadtype: "",
        uploadusername: "",
        changereason: "",
        type: 16,
        distiancename: "",
        changecontent: "",
        isutf: "0",
        softname: "",
        opiontion: "",
        callunit: "",
        calladdr: "",
        calltime: "",
      };
      this.dialogVisible = true;
    },
    addFile() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let obj = Object.assign({}, this.form);
          uploadF(obj).then((res) => {
            this.dialogVisible = false;
            this.init();
            this.$message({
              message: "文件上传上传成功",
              type: "success",
              customClass: "message_override",
            });
          });
        } else {
          return false;
        }
      });
    },
    changeValue(value) {
      if (value) {
        this.form = Object.assign(this.form, value);
      } else {
        this.form.fileurl = "";
        this.form.uploadtype = "";
        this.form.uploadname = "";
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
    downLoadFile(row) {
      downLoadFile(row.fileurl);
    },
  },
};
</script>

<style scoped lang="scss">
.container-box {
  background-color: #ebecee;
  padding: 0 20px;
  .el-header {
    line-height: 60px;
    background-color: #ffffff;
  }
  .el-main {
    padding: 0;
    margin-top: 10px;
  }
}
</style>
