<template>
  <el-container class="container-box">
    <el-header>
      <el-button type="primary" @click="showDialog">添加变更</el-button>
      <el-select v-model="typeKey" @change="selectChange" style="width: 200px;margin-left: 10px">
        <el-option
          v-for="item in typeArr"
          :key="item.key"
          :value="item.key"
          :label="item.name"
        ></el-option>
      </el-select>
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" border height="100%">
        <el-table-column type="index" width="80" label="序号">
        </el-table-column>
        <el-table-column prop="uploadname" label="名称"> </el-table-column>
        <el-table-column prop="changereason" label="变更事由">
        </el-table-column>
        <el-table-column prop="uploadtime" label="上传时间"> </el-table-column>
        <el-table-column prop="uploadtype" label="文件类型"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="primary"  class="primary_mini"  @click="showEdit(row)"
              >编辑</el-button
            >
            <el-button size="mini" type="primary"  class="primary_mini"  @click="downFile(row)"
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
    <el-footer> </el-footer>
    <el-dialog
      :title="diaTitle"
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
        <el-form-item label="文件类型">
          <el-input readonly="" v-model="typeText"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="uploadname">
          <el-input
            placeholder="请输入文件名称"
            v-model="form.uploadname"
          ></el-input>
        </el-form-item>
        <el-form-item label="变更事由" prop="changereason">
          <el-input
            placeholder="请输入变更事由"
            v-model="form.changereason"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件" prop="fileurl" v-if="isCreate">
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
import { uploadF, getFile, deleteFile, updateFileInfo } from "@/api/file";
import {downLoadFile} from "@/utils/download";
import {mapGetters} from "vuex";
export default {
  name: "",
  data() {
    return {
      dialogVisible: false,
      isCreate: false,
      typeKey: 2,
      diaTitle: "",
      typeArr: [
        {
          name: "变更图纸",
          key: 2,
        },
        {
          name: "变更文档",
          key: 3,
        },
      ],
      typeText: "",
      form: {
        fileurl: "",
        uploadname: "",
        uploadtype: "",
        uploadusername: "",
        changereason: "",
        type: 2,
      },
      rules: {
        uploadname: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],
        changereason: [
          { required: true, message: "请输入变更事由", trigger: "blur" },
        ],
        fileurl: [
          {required: true, message: "请上传变更文件", trigger: "blur"}
        ]
      },
      tableData: []
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
      getFile(this.typeKey,this.project.id).then((res) => {
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
    selectChange() {
      this.init();
    },
    downFile(row) {
      downLoadFile(row.fileurl);
    },
    showDialog() {
      this.dialogVisible = true;
      this.isCreate = true;
      this.typeText = this.typeKey === 2 ? "图纸文件" : "文档文件";
      this.diaTitle =
        this.typeKey === 2 ? "上传变更图纸文件" : "上传变更文档文件";
      this.form = {
        fileurl: "",
        uploadname: "",
        uploadtype: "",
        uploadusername: "",
        changereason: "",
        type: this.typeKey,
        projectId: this.project.id
      };
    },
    showEdit(row) {
      this.typeText = this.typeKey === 2 ? "图纸文件" : "文档文件";
      this.diaTitle =
        this.typeKey === 2 ? "修改变更图纸文件" : "修改变更文档文件";
      this.isCreate = false;
      this.form = Object.assign({}, row);
      this.dialogVisible = true;
    },
    addFile() {
      if (this.isCreate) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            obj.type = this.typeKey;
            uploadF(obj).then((res) => {
              this.dialogVisible = false;
              this.form = {
                fileurl: "",
                uploadname: "",
                uploadtype: "",
                uploadusername: "",
                changereason: "",
                type: this.typeKey,
              };
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
  .container-box{
    .el-header{
      display: flex;
      align-items: center;

    }
  }
</style>
