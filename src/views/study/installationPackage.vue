<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-30 16:34:41
-->
<template>
  <el-container class="container-box">
    <el-header>
      <el-button type="primary" @click="showDialog">上传安装包</el-button>
      <div class="text">诸暨建设集团项目管理</div>
      <svg-icon icon-class="erweima" class="return" @click="seeShuZi" />
<!--      <div class="text">项目数据中心</div>-->
<!--      <svg-icon icon-class="erweima" class="return" @click="seeShuJu" />-->
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" border height="100%">
        <el-table-column type="index" width="55" label="序号">
        </el-table-column>
        <el-table-column prop="uploadname" label="安装包名称">
        </el-table-column>
        <el-table-column prop="uploadtype" label="文件类型"> </el-table-column>
        <el-table-column prop="uploadtime" label="上传时间"> </el-table-column>
        <el-table-column label="二维码" width="90" align="center">
          <template slot-scope="{ row }">
            <svg-icon
              icon-class="code"
              class="return"
              @click="seeDymCode(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <el-button type="primary" size="small" class="primary_mini" @click="downLoadFile(row)">
              下载
            </el-button>
            <el-button
              type="danger"
              size="small"
              v-if="[2].includes(groupId)"
              @click="handleDelete(row, $index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer> </el-footer>
    <el-dialog
      title="上传安装包"
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
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="安装包名称" prop="uploadname">
          <el-input
            placeholder="请输入安装包名称"
            v-model="form.uploadname"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传安装包" prop="fileurl">
          <el-upload
            class="upload-demo"
            :headers="header"
            :action="uploadUrl"
            multiple
            :limit="1"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        <el-button size="mini" type="primary" class="primary_mini" @click="addFile">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="扫码下载"
      :visible.sync="dialogCodeVisible"
      destroy-on-close
      :close-on-click-modal="false"
      :append-to-body="true"
      width="20%"
    >
      <div class="qrcode" ref="qrCodeUrl" v-if="showCode"></div>
      <img
        src="../../assets/code/shujuzhongxin.png"
        alt="数据中心"
        v-if="showshuju"
        class="code"
      />
<!--      <img-->
<!--        src="../../assets/code/shuzihua.png"-->
<!--        alt="数字化"-->
<!--        v-if="showshuzi"-->
<!--        class="code"-->
<!--      />-->
      <img
        src="../../assets/code/xinma.png"
        alt="数字化"
        v-if="showshuzi"
        class="code"
      />
      <div slot="footer">
        <el-button
          size="mini"
          type="primary"
          @click="() => (dialogCodeVisible = false)"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
import { uploadF, getFile, deleteFile, updateFileInfo } from "@/api/file";
import { downLoadFile } from "@/utils/download";
import { getToken } from "@/utils/auth";
import QRCode from "qrcodejs2";
export default {
  name: "",
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      dialogCodeVisible: false,
      rules: {
        uploadname: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],
      },
      form: {
        fileurl: "",
        uploadname: "",
        uploadtype: "",
        uploadusername: "",
        changereason: "",
        type: 17,
        distiancename: "",
        changecontent: "",
        isutf: "0",
        softname: "",
        opiontion: "",
        callunit: "",
        calladdr: "",
        calltime: "",
      },
      header: { token: "" }, // 文件上传带token
      fileList: [],
      groupId: null,
      showshuzi: false,
      showshuju: false,
      showCode: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo", "uploadUrl", "project"])
  },
  created() {
    this.groupId = getToken("groupId");
    this.initData();
  },
  methods: {
    initData() {
      getFile(17,this.project.id).then((res) => {
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
        type: 17,
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
      if (this.fileList.length === 0) {
        this.$message({
          message: "请上传文件",
          type: "warning",
          customClass: "message_override",
        });
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const obj = Object.assign({}, this.form);
          let str = this.fileList[0].response.data;
          obj.fileurl = str;
          obj.uploadtype = "apk";
          uploadF(obj).then((res) => {
            this.fileList = [];
            this.dialogVisible = false;
            this.initData();
            this.$message({
              message: "添加成功",
              type: "success",
              customClass: "message_override",
            });
          });
        }
      });
    },
    beforeUpload(file) {
      const fileName = file.name;
      const suffix = fileName
        .substring(fileName.lastIndexOf(".") + 1)
        .toUpperCase();
      if (suffix !== "APK") {
        this.$message.error("上传文件类型必须是apk格式!");
        return false;
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
      let link = document.createElement("a"); // 创建a标签
      link.style.display = "none"; //ZhuJiRoad/mong/preview?fileid=
      link.href = "/ZhuJiRoad/mong/download?fileid=" + row.fileurl; // 设置下载地址
      link.setAttribute("download", ""); // 添加downLoad属性
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    seeShuZi() {
      this.showshuzi = true;
      this.showshuju = false;
      this.showCode = false;
      this.dialogCodeVisible = true;
    },
    seeShuJu() {
      this.showshuzi = false;
      this.showshuju = true;
      this.showCode = false;
      this.dialogCodeVisible = true;
    },
    seeDymCode(row) {
      this.showshuzi = false;
      this.showshuju = false;
      this.showCode = true;
      this.dialogCodeVisible = true;

      this.$nextTick(() => {
        var qrcode = new QRCode(this.$refs.qrCodeUrl, {
          text:
            "https://system.zlskkj.com:59031/ZhuJiRoad/mong/download?fileid=" +
            row.fileurl, // 需要转换为二维码的内容
          width: 100,
          height: 100,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container-box {
  background-color: #ebecee;
  //padding: 0 20px;
  .el-header {
    line-height: 60px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    .el-button {
      margin-right: 100px;
    }
    .text {
      color: #000;
      margin: 0 10px;
    }
    svg {
      width: 40px;
      height: 40px;
    }
  }
  .el-main {
    padding: 0;
    margin-top: 10px;
  }
}
.qrcode {
  display: inline-block;
  img {
    width: 132px;
    height: 132px;
    background-color: #fff; //设置白色背景色
    padding: 6px; // 利用padding的特性，挤出白边
    box-sizing: border-box;
  }
}
.code {
  display: block;
  width: 200px;
  height: 200px;
}
</style>
