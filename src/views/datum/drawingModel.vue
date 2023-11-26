<template>
  <el-container class="container-box">
    <el-header>
      <div class="nav">
        <div
          :class="{ active: currentView === 'paper' }"
          @click="changeView('paper')"
        >
          图纸文件管理
        </div>
        <div
          :class="{ active: currentView === 'model' }"
          @click="changeView('model')"
        >
          模型文件管理
        </div>
      </div>
      <el-select :default-first-option="true"
        ref="optionRef"
        v-model="typeKey"
        v-if="currentView === 'paper'"
        @change="selectChange"
        style="width: 200px"
      >
        <el-option
          v-for="item in functionary"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <el-button
        size="mini"
        type="primary"
        @click="showDialog"
        v-if="currentView === 'paper'"
        >上传图纸文件</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="currentView === 'model'"
        @click="showModelDialog"
        >上传模型文件</el-button
      >
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-if="currentView === 'paper'"
        key="paper"
        height="100%"
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="uploadname" label="名称"> </el-table-column>
        <el-table-column prop="uploadtype" label="文件类型"> </el-table-column>
        <el-table-column prop="uploadtime" label="上传时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button size="mini" type="primary"  class="primary_mini"  @click="showEditPaper(row)"
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
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        v-if="currentView === 'model'"
        key="model"
        height="100%"
      >
        <el-table-column type="index" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="distiancename" label="标段名称">
        </el-table-column>
        <el-table-column prop="uploadname" label="文件名称"> </el-table-column>
        <el-table-column prop="uploadusername" label="提交人">
        </el-table-column>
        <el-table-column prop="uploadtime" label="提交时间"> </el-table-column>
        <el-table-column prop="uploadtype" label="提交类型"> </el-table-column>
        <el-table-column prop="changecontent" label="更新内容">
        </el-table-column>
        <el-table-column label="是否编码">
          <template slot-scope="{ row }">
            <!-- <el-switch
              v-model="row.isutf"
              disabled
            ></el-switch> -->
            <span>{{ row.isutf === 1 ? "已编码" : "未编码" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="softname" label="建模软件"> </el-table-column>
        <el-table-column prop="opiontion" label="审查意见"> </el-table-column>
        <el-table-column label="操作" width="220px">
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
        <el-form-item label="文件" prop="fileurl" v-if="isCreate">
          <uploadFile
            ref="otherOrgAttachments"
            @changeValue="changeValue"
            :limitFileSize="300"
          ></uploadFile>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary"  class="primary_mini"  @click="addFile">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="isCreate ? '上传模型文件' : '修改模型文件'"
      :visible.sync="modelDialogVisible"
      destroy-on-close
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <el-form
        :model="form"
        v-if="modelDialogVisible"
        ref="modelform"
        size="small"
        label-position="right"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="标段名称" prop="distiancename">
          <el-input
            placeholder="请输入标段名称"
            v-model="form.distiancename"
          ></el-input>
        </el-form-item>
        <el-form-item label="文件名称" prop="uploadname">
          <el-input
            placeholder="请输入文件名称"
            v-model="form.uploadname"
          ></el-input>
        </el-form-item>
        <el-form-item label="更新内容" prop="changecontent">
          <el-input
            placeholder="请输入更新内容"
            v-model="form.changecontent"
          ></el-input>
        </el-form-item>
        <el-form-item label="建模软件" prop="softname">
          <el-input
            placeholder="请输入建模软件"
            v-model="form.softname"
          ></el-input>
        </el-form-item>
        <el-form-item label="审查意见" prop="opiontion">
          <el-input
            placeholder="请输入审查意见"
            v-model="form.opiontion"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否编码">
          <el-switch
            v-model="form.isutf"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="上传文件" prop="fileurl" v-if="isCreate">
          <uploadFile
            ref="otherOrgAttachments"
            @changeValue="changeValue"
            :limitFileSize="300"
          ></uploadFile>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="modelDialogVisible = false"
          >取消</el-button
        >
        <el-button size="mini" type="primary"  class="primary_mini"  @click="addModelFile"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import {uploadF, getFile, deleteFile, updateFileInfo, getFileDictByPCode} from "@/api/file";
import { downLoadFile, downLoadRowFile } from "@/utils/download";
import {mapGetters} from "vuex";
export default {
  name: "",
  data() {
    return {
      tableData: [],
      modelData: [],
      currentView: "paper", //model
      typeKey: "",
      diaTitle: "",
      dialogVisible: false,
      modelDialogVisible: false,
      isCreate: false,
      typeText: "",
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
      },
      rules: {
        uploadname: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],
        distiancename: [
          { required: true, message: "请输入标段名称", trigger: "blur" },
        ],
        fileurl: [
          { required: true, message: "请上传文件", trigger: "blur" },
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
      this.pCode = 'gclx';
      getFileDictByPCode(this.pCode).then((res) => {
        this.functionary = res.data;

        this.typeKey = res.data[0].id;

        getFile(this.typeKey,this.project.id).then((res) => {
          this.tableData = res.data;
        });
      }).catch(function (error) {
      });

    },
    selectChange() {
      getFile(this.typeKey,this.project.id).then((res) => {
        this.tableData = res.data;
      });
    },
    downFile(row) {
      //downLoadFile(row.fileurl);

      console.log(111111111111);
			console.log(row);
			console.log(222222222222);
      console.log(row.uploadname + "." + row.uploadtype);
      let fileNameBase64 = btoa(unescape(encodeURIComponent(row.uploadname + "." + row.uploadtype)))
      let update = fileNameBase64.replace(/\+/g, '-').replace(/\//g, '_')
      console.log("update:" + update);
      const myObject = {};
      myObject.fileId = row.fileurl;
      myObject.uploadname = update;
      myObject.uploadtype = row.uploadtype;
      const myString = JSON.stringify(myObject);
      console.log(333333333333333);
			console.log(myString);
      downLoadRowFile(myString);
    },
    changeView(val) {
      if (this.currentView !== val) {
        this.currentView = val;
        if (val === "paper") {
          this.init();
        } else {
          getFile(7,this.project.id).then((res) => {
            this.tableData = res.data;
          });
        }
      }
    },
    showEdit(row) {
      this.isCreate = false;
      row.isutf = row.isutf + "";
      this.form = Object.assign({}, row);
      this.modelDialogVisible = true;
    },
    showEditPaper(row) {
      this.isCreate = false;
      this.form = Object.assign({}, row);
      this.diaTitle = this.$refs.optionRef.selected.label
      this.typeText = this.$refs.optionRef.selected.label
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
        type: this.typeKey,
        distiancename: "",
        changecontent: "",
        isutf: "0",
        softname: "",
        opiontion: "",
        callunit: "",
        calladdr: "",
        projectId: this.project.id
      };
      this.dialogVisible = true;
      this.diaTitle = this.$refs.optionRef.selected.label
      this.typeText = this.$refs.optionRef.selected.label;

    },

    showModelDialog() {
      this.isCreate = true;
      this.form = {
        fileurl: "",
        uploadname: "",
        uploadtype: "",
        uploadusername: "",
        changereason: "",
        type: this.typeKey,
        distiancename: "",
        changecontent: "",
        isutf: "0",
        softname: "",
        opiontion: "",
        callunit: "",
        calladdr: "",
        projectId: this.project.id
      };
      this.modelDialogVisible = true;
    },
    changeValue(value) {
      if (value) {
        this.form = Object.assign(this.form, value);
      } else {
        this.form.fileurl = "";
        this.form.uploadtype = "";
      }
    },
    addFile() {
      if (this.isCreate) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            obj.type = this.typeKey;
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
    addModelFile() {
      if (this.isCreate) {
        this.$refs["modelform"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            obj.type = 7;
            uploadF(obj).then((res) => {
              this.modelDialogVisible = false;
              this.$message({
                message: "文件上传上传成功",
                type: "success",
                customClass: "message_override",
              });
              getFile(7,this.project.id).then((res) => {
                this.tableData = res.data;
              });
            });
          } else {
            return false;
          }
        });
      } else {
        this.$refs["modelform"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            updateFileInfo(obj).then((res) => {
              this.modelDialogVisible = false;
              this.$message({
                message: "修改成功",
                type: "success",
                customClass: "message_override",
              });
              getFile(7,this.project.id).then((res) => {
                this.tableData = res.data;
              });
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
.container-box {
  .el-header {
    padding: 0 5px;
    line-height: 60px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    color: #000000;

    .nav {
      display: flex;
      align-items: center;
      margin-right: 20px;

      > div {
        border: 1px solid rgb(56, 122, 253);
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        cursor: pointer;
      }

      .active {
        background-color: rgb(56, 122, 253);
        color: #ffffff;
      }
    }
    .el-select {
      margin-right: 20px;
    }
  }
}
</style>
