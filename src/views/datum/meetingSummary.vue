<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-18 14:18:52
-->
<template>
  <el-container class="container-box">
    <el-header>
      <el-button type="primary" @click="showDialog">上传会议纪要</el-button>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" border height="100%">
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="uploadname" label="会议名称"> </el-table-column>
        <el-table-column prop="typename"   label="资料类型"  align="center"></el-table-column>
        <el-table-column prop="calltime" label="会议时间"> </el-table-column>
        <el-table-column prop="calladdr" label="会议地点"> </el-table-column>
        <el-table-column prop="callunit" label="召集单位"> </el-table-column>
        <el-table-column prop="uploadtype" label="文件类型"></el-table-column>
        <el-table-column prop="uploadusername" label="上传人">
        </el-table-column>
        <el-table-column prop="uploadtime" label="上传时间"> </el-table-column>
        <el-table-column label="操作" width="270px">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="primary"  class="primary_mini"  @click="showEdit(row)"
              >编辑</el-button
            >
            <el-button size="mini" type="primary"  class="primary_mini"  @click="downFile(row)"
              >下载</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(row, $index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer> </el-footer>
    <el-dialog
      :title="isCreate ? '上传会议纪要' : '修改会议纪要'"
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
        <el-form-item label="会议名称" prop="uploadname">
          <el-input
            placeholder="请输入会议名称"
            v-model="form.uploadname"
          ></el-input>
        </el-form-item>
        <el-form-item label="会议时间">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-model="form.calltime"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="会议地点" prop="calladdr">
          <el-input
            placeholder="请输入会议地点"
            v-model="form.calladdr"
          ></el-input>
        </el-form-item>
        <el-form-item label="召集单位" prop="callunit">
          <el-input
            placeholder="请输入召集单位"
            v-model="form.callunit"
          ></el-input>
        </el-form-item>
        <el-form-item label="资料类型" prop="type">
          <el-select
            v-model="form.type"
            filterable
            clearable
            placeholder="请选择资料类型"
          >
            <el-option
              v-for="item in functionary"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" prop="fileurl" v-if="isCreate">
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
import {uploadF, getFile, deleteFile, updateFileInfo, getFileDictByPCode, getStoreFileByPcode} from "@/api/file";
import { downLoadFile } from "@/utils/download";
import {mapGetters} from "vuex";

export default {
  name: "",
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      isCreate: false,
      form: {
        fileurl: "", //文件url
        uploadname: "", //文件名称
        uploadtype: "", //文件类型
        uploadusername: "", //上传人
        changereason: "", //变更事由
        type: "", //类型
        distiancename: "", //标段名称
        changecontent: "", //更新内容
        isutf: "0", //是否编码
        softname: "", //建模软件
        opiontion: "", //审查意见
        callunit: "", //召集单位
        calladdr: "", //会议地点
        calltime: "",
      },
      rules: {
        uploadname: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请输入资料类型", trigger: "blur" },
        ],
        fileurl: [
          { required: true, message: "请上传会议纪要文件", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.init();
  },
  computed: {
    ...mapGetters(["project"])
  },
  methods: {
    init() {
      this.functionary = [];
      this.tableData = [];
      this.pCode = 'meetingSummary';
      getFileDictByPCode(this.pCode).then((res) => {
        this.functionary = res.data;
      }).catch(function (error) {
      });

      //获取已上传的附件清单
      getStoreFileByPcode(this.pCode,this.project.id).then((res) => {
        this.tableData = res.data;
      });
    },
    changeValue(value) {
      if (value) {
        this.form = Object.assign(this.form, value);
      } else {
        this.form.fileurl = "";
        this.form.uploadtype = "";
      }
    },
    downFile(row) {
      downLoadFile(row.fileurl);
    },
    showEdit(row) {
      this.isCreate = false;
      this.form = Object.assign({}, row);
      this.dialogVisible = true;
    },
    showDialog() {
      this.isCreate = true;
      this.form = {
        fileurl: "",
        uploadname: "",
        uploadtype: "",
        uploadusername: "",
        changereason: "",
        type: "",
        distiancename: "",
        changecontent: "",
        isutf: "0",
        softname: "",
        opiontion: "",
        callunit: "",
        calladdr: "",
        calltime: "",
        projectId: this.project.id
      };
      this.dialogVisible = true;
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
              this.init();
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
                message: "修改成功",
                type: "success",
                customClass: "message_override",
              });
              this.init();
            });
          } else {
            return false;
          }
        });
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
