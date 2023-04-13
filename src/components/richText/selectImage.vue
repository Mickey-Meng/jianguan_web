<template>
  <div>
    <!-- 图片上传组件辅助 -->
    <el-upload
      class="avatar-uploader quill-img"
      :action="action"
      name="file"
      :multiple="multiple"
      :drag="drag"
      :accept="accept"
      :show-file-list="false"
      :on-success="quillImgSuccess"
      :on-error="uploadError"
      :before-upload="quillImgBefore"
    ></el-upload>
  </div>
</template>

<script>
  export default {
    props: {
      action: {
        type: String,
        default: () => "/mong/upload"
      },
      previewUrl: {
        type: String,
        default: () => "/mong/preview?fileid="
      },
      multiple: {
        type: Boolean,
        default: () => false
      },
      drag: {
        type: Boolean,
        default: () => false
      },
      accept: {
        type: String,
        default: () => ".jpg,.png,.jpeg,.gif"
        // default: () => ".jpg,.png,.jpeg,.gif,.avi,.mp4,.mkv,.rmvb,.kux,.mp3"
      },
      limitFileSize: {
        type: Number,//上传文件的默认大小
        default: () => 50
      }
    },
    watch: {},
    data() {
      return {};
    },
    created() {
    },
    mounted() {
    },
    methods: {
      //上传成功的回调
      quillImgSuccess(response) {
        if (response.status === 200) {
          let {data} = response;
          let fileUrl = this.previewUrl + data;
          this.$emit("uploadSuccess", fileUrl);
          this.$message.success("上传成功!");
        } else {
          this.$message.error("上传失败!");
        }
      },
      //上传错误的回调
      uploadError() {
      },
      /**
       * @Description: 上传图片之前的验证
       * @author 王海林
       * @date
       */
      quillImgBefore(file) {
        const fileName = file.name;
        const suffix = fileName
          .substring(fileName.lastIndexOf("."))
          .toLowerCase();
        const isSuffix = this.accept.indexOf(suffix) !== -1;
        const isLtM = file.size / 1024 / 1024 < this.limitFileSize;
        if (!isSuffix) {
          this.$message.warning("上传文件类型必须是" + this.accept + "格式!");
          return false;
        }
        if (!isLtM) {
          this.$message.warning(
            "上传文件大小不能超过" + this.limitFileSize + "MB!"
          );
          return false;
        }
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>

</style>
