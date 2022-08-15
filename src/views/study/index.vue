<template>
  <el-container class="container-box">
    <el-header>
      <el-button type="primary" @click="showDialog">上传教学视频</el-button>
      <!--      <div>教学视频</div>-->
    </el-header>
    <el-main>
      <el-table :data="tableData" style="width: 100%" border height="100%">
        <el-table-column type="index" width="55" label="序号">
        </el-table-column>
        <el-table-column prop="uploadname" label="标题"></el-table-column>
        <el-table-column prop="uploadtype" label="文件类型"></el-table-column>
        <el-table-column prop="uploadtime" label="上传时间"></el-table-column>
        <el-table-column label="操作" width="230">
          <template slot-scope="{ row, $index }">
            <el-button type="primary" size="small" @click="playVideo(row)" class="primary_mini">
              播放
            </el-button>
            <el-button type="primary" size="small" @click="downLoadFile(row)" class="primary_mini">
              下载
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row, $index)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>

    </el-footer>
    <el-dialog
      title="上传教学视频"
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
          <el-upload
            class="upload-demo"
            :headers="header"
            action="/ZhuJiRoad/mong/uploadVideo"
            multiple
            :limit="1"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <div slot="tip" class="el-upload__tip">
              只能上传MP4文件
            </div>
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
      title="教学视频播放"
      :visible.sync="dialogVideoVisible"
      destroy-on-close
      :close-on-click-modal="false"
      :append-to-body="true"
    >
      <video :src="videoUrl" width="100%" height="500px" controls type="video/mp4"></video>
      <div slot="footer">
        <el-button size="mini" @click="dialogVideoVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </el-container>

</template>

<script>
  import {mapGetters} from "vuex";
  import {getToken} from "@/utils/auth";
  import {deleteFile, getFile, uploadF} from "@/api/file";
  import {downLoadFile} from "@/utils/download";

  export default {
    name: "",
    data() {
      return {
        fileList: [],
        tableData: [],
        form: {
          fileurl: "", //文件url
          uploadname: "", //文件名称
          uploadtype: "", //文件类型
          uploadusername: "", //上传人
          changereason: "",//文件名
          type: 20, //类型
          distiancename: "",
          changecontent: "",
          isutf: "0",
          softname: "",
          opiontion: "",
          callunit: "",
          calladdr: "",
          calltime: ""
        },
        videoUrl: "",
        suffixName: "MP4",
        header: {token: ""},
        rules: {
          uploadname: [
            {required: true, message: "请输入文件名称", trigger: "blur"}
          ],
          fileurl: [{required: true, message: "请上传文件", trigger: "blur"}]
        },
        dialogVisible: false,
        dialogVideoVisible: false
      };
    },
    computed: {
      ...mapGetters(["project"])
    },
    created() {
      this.header.token = getToken("zj_token");
      this.init();
    },
    methods: {
      init() {
        getFile(20, this.project.id).then((res) => {
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
          type: 20,
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
        this.fileList = [];
        this.dialogVisible = true;
      },
      downLoadFile(row) {
        let link = document.createElement("a"); // 创建a标签
        link.style.display = "none"; //ZhuJiRoad/mong/preview?fileid=
        link.href = "/ZhuJiRoad/mong/downloadVideo?fileName=" + row.changereason + "&url=" + row.fileurl; // 设置下载地址
        link.setAttribute("download", ""); // 添加downLoad属性
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      playVideo(row) {
        this.videoUrl = "/ZhuJiRoad/mong/previewVideo?url=" + row.fileurl;
        this.dialogVideoVisible = true;
      },
      handleDelete(row, index) {
        this.$confirm("是否删除该文件?", "删除文件", {
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          customClass: "message_override",
          type: "warning"
        }).then(() => {
          deleteFile(row.id).then((res) => {
            this.$message({
              message: "删除成功",
              type: "success",
              customClass: "message_override"
            });
            this.tableData.splice(index, 1);
          });
        });
      },
      addFile() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            uploadF(obj).then((res) => {
              this.dialogVisible = false;
              this.init();
              this.$message({
                message: "教学视频上传成功",
                type: "success",
                customClass: "message_override"
              });
            });
          } else {
            return false;
          }
        });
      },
      beforeUpload(file) {
        const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
        if (fileSuffix.toLowerCase() !== "mp4") {
          this.$message({
            message: "请上传mp4文件",
            type: "warning",
            customClass: "message_override"
          });
          return false;
        }
      },
      uploadSuccess(response, file, fileList) {
        let str = file.name;
        let index = str.lastIndexOf(".") + 1;
        let type = str.substring(index);
        let name = str.substring(0, index - 1);
        this.form.uploadname = name;
        this.form.uploadtype = type;
        this.form.fileurl = response.data[0].fileUrl;
        this.form.changereason = response.data[0].fileName;
        this.uploadusername = getToken("userName");
        this.fileList = fileList;
      },
      handleRemove(file, fileList) {
        this.form.uploadname = "";
        this.form.uploadtype = "";
        this.form.fileurl = "";
        this.fileList = fileList;
      },
      handleExceed() {
        this.$message({
          message: "文件数量超出限制",
          type: "warning",
          customClass: "message_override"
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  //.container-box {
  //  background-color: #ebecee;
  //
  //  .el-header {
  //    line-height: 60px;
  //    background-color: #FFFFFF;
  //    margin: 0 20px;
  //    color: black;
  //    font-size: 22px;
  //    font-weight: 700;
  //  }
  //
  //  .el-main {
  //    background-color: #FFFFFF;
  //    margin: 10px 20px 0 20px;
  //    padding: 0;
  //
  //
  //  }
  //}

</style>
