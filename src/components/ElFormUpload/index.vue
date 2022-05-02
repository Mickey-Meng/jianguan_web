<template>
  <div class="el-upload-container">
    <div class="upload-picture-card" @click.stop="handleClick">
      <div v-if="status" class="upload-preview" @click.stop>
        <img alt="" :src="value" />
        <span class="upload-label">
          <i class="upload-success-icon upload-icon"></i>
        </span>
        <span class="upload-handle">
          <i
            class="upload-handle-delete-icon upload-icon"
            @click.self="handleClickDel"
          ></i>
        </span>
      </div>
      <i v-else class="upload-icon upload-add"></i>
      <input
        ref="input"
        type="file"
        name="file"
        class="upload__input"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script>
import { uploadFile } from "@/api/file";

export default {
  name: "ElFormUpload",
  model: {
    event: "change",
  },
  inject: {
    elForm: {
      default: "",
    },
    elFormItem: {
      default: "",
    },
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    fileSize: {
      type: [Number, String],
      default: -1,
    },
    onSuccess: Function,
    onError: Function,
    onExceed: Function,
    onSize: Function,
  },
  data() {
    return {
      status: false, //是否已经上传
    };
  },
  created() {
    this.initData();
  },
  computed: {},
  methods: {
    initData() {
      if (this.value) {
        this.status = true;
      }
    },
    handleClick() {
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    handleClickDel() {
      this.$emit("change", "");
      this.status = false;
    },
    handleChange(e) {
      const files = e.target.files;
      if (!files) {
        return;
      }
      let postFiles = Array.prototype.slice.call(files);
      postFiles = postFiles.slice(0, 1);
      if (postFiles.length === 0) {
        return;
      }
      let file = postFiles[0];
      let size = file.size / 1024; //计算多少kb
      if (this.fileSize > 0 && size > this.fileSize) {
        // this.dispatch('ElFormItem', 'el.form.change', [url]);
        if (this.onSize) {
          this.onSize(file);
        }
      } else {
        this.uploadFile(file);
      }
    },
    uploadFile(file) {
      let formData = new FormData();
      formData.append("file", file);
      uploadFile(formData)
        .then((res) => {
          let url = res.data;
          this.$emit("change", url);
          if (this.onSuccess) {
            this.onSuccess(file, url);
          }
        })
        .catch((error) => {
          if (this.onSuccess) {
            this.onSuccess(file, error);
          }
        });
    },
  },
  destroyed() {
    this.fileList = [];
  },
  watch: {
    value(cur, old) {
      this.initData();
      // this.$emit('change', cur);
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-icon {
  font-family: element-icons !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}

.el-upload-container {
  width: 100%;
}

.upload-picture-card {
  position: relative;
  text-align: center;
  display: inline-block;
  border: 1px dashed #00a0e9;
  border-radius: 6px;
  box-sizing: border-box;
  width: 148px;
  height: 148px;
  cursor: pointer;
  vertical-align: top;

  .upload-add {
    font-size: 28px;
    color: #8c939d;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -14px;
    margin-left: -14px;

    &::before {
      content: "\e6d9";
    }
  }

  .upload__input {
    display: none;
  }
}

.upload-preview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fff;
  -webkit-box-sizing: border-box;
  /*box-sizing: border-box;
    display: inline-block;
    -webkit-transition: all .5s cubic-bezier(.55,0,.1,1);
    transition: all .5s cubic-bezier(.55,0,.1,1);*/

  img {
    width: 100%;
    height: 100%;
  }

  //右上角
  .upload-label {
    position: absolute;
    display: block;
    right: -15px;
    top: -6px;
    width: 40px;
    height: 24px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);

    .upload-success-icon {
      display: inline-block;
      color: #fff;
      font-size: 12px;
      margin-top: 11px;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);

      &::before {
        content: "\E6DA";
      }
    }
  }

  //删除面板
  .upload-handle {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-transition: opacity 0.3s;
    transition: opacity 0.3s;

    .upload-handle-delete-icon {
      position: inherit;
      left: 50%;
      top: 50%;
      margin-top: -10px;
      margin-left: -10px;
      cursor: pointer;

      &::before {
        content: "\E6D7";
      }
    }
  }

  &:hover {
    .el-icon-upload-success {
      display: none;
    }

    .upload-handle {
      opacity: 1;

      .upload-handle-delete-icon::before {
        content: "\E6D7";
      }
    }
  }
}
</style>
