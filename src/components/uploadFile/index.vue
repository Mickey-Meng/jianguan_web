<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-26 10:03:14
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-15 11:46:25
-->

<template>
  <el-upload
    ref="upload"
    v-model="attachment"
    class="upload-demo"
    :headers="header"
    :limit="limitFileNum"
    :action="uploadUrl"
    :file-list="fileList"
    :before-upload="beforeUpload"
    :on-success="uploadSuccess"
    :on-remove="handleRemove"
  >
    <el-button v-if="!hideButton" size="small" type="primary"
      >点击上传</el-button
    >
    <div
      v-if="!hideButton"
      slot="tip"
      class="el-upload__tip"
      style="display: inline-block; margin-left: 10px"
    >
      仅支持上传{{ limitFileNum }}个文件！
    </div>
  </el-upload>
</template>
<script>
import { getToken } from "@/utils/auth";
import api from "@/api";
export default {
  name: "UploadFile",
  props: {
    inputValue: {
      type: String,
      default: () => "",
    },
    hideButton: {
      type: Boolean,
      default: () => false,
    },
    limitFileSize:{
      type: Number,
      default: () => 20,
    }
  },
  data() {
    return {
      header: { token: "" },
      uploadUrl: process.env.VUE_APP_BASE_API+"/"+api.uploadFile,
      attachment: this.inputValue,
      fileList: this.attachment,
      suffixName: "DOC,DOCX,XLS,XLSX,PPT,PDF,TXT,JPG,JPEG,PNG,BMP,GIF",
      limitFileNum: 1,
      // limitFileSize: 20,
    };
  },
  created() {
    this.header.token = getToken("zj_token");
    this.header.Authorization ='Bearer ' + getToken("auth_token");
  },
  mounted() {},
  methods: {
    handleRemove(file, fileList) {
      this.fileList = [];
      this.$emit("changeValue", null);
    },
    beforeUpload(file) {
      const fileName = file.name;
      const suffix = fileName
        .substring(fileName.lastIndexOf(".") + 1)
        .toUpperCase();
      const isSuffix = this.suffixName.indexOf(suffix) !== -1;
      const isLtM = file.size / 1024 / 1024 < this.limitFileSize;
      if (!isSuffix) {
        this.$message.error("上传文件类型必须是" + this.suffixName + "格式!");
      }
      if (!isLtM) {
        this.$message.error(
          "上传文件大小不能超过" + this.limitFileSize + "MB!"
        );
      }
      return isSuffix && isLtM;
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList;
      let str = file.name;
      let index = str.lastIndexOf(".") + 1;
      let type = str.substring(index);
      let name = str.substring(0, index - 1);
      if (file) {
        const obj = {
          uploadtype: type,
          fileurl: response.data,
          uploadname: name,
          uploadusername: getToken("userName"),
        };
        this.$emit("changeValue", obj);
      }
    },
  },
};
</script>
