<template>
  <div class="wrapper">
    <div class="header">
      <ul>
        <li
          :class="{ active: currentView == 'negNews' }"
          @click="changeView('negNews')"
        >
          工程新闻
        </li>
        <li
          :class="{ active: currentView == 'activityNews' }"
          @click="changeView('activityNews')"
        >
          活动新闻
        </li>
        <li
          :class="{ active: currentView == 'safeNews' }"
          @click="changeView('safeNews')"
        >
          安全新闻
        </li>
      </ul>
      <el-button size="mini" @click="showDialog">添加新闻</el-button>
    </div>
    <div class="content">
      <component
        v-bind:is="currentView"
        :newsData="tableData"
        :type="currentView"
        @showNewsDetail="showNewsDetail"
      ></component>
    </div>
    <el-dialog
      title="添加新闻"
      :visible.sync="dialogVisible"
      custom-class="dialog-panel"
      :append-to-body="true"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        size="small"
        label-position="right"
        label-width="120px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="sttime">
          <el-date-picker
            v-model="form.sttime"
            clearable
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="新闻照片" prop="pic">
          <el-upload
            class="upload-demo"
            :headers="header"
            :action="uploadUrl"
            multiple
            :limit="1"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="新闻内容">
          <richTextView v-model="form.content"></richTextView>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button plain size="mini" class="btn-bg" @click="submitNew"
          >提交</el-button
        >
        <el-button
          plain
          size="mini"
          class="btn-bg"
          @click="dialogVisible = false"
        >取消
        </el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="详情"
      :visible.sync="dialogDetailVisible"
      custom-class="dialog-panel news_detail_panel"
      :append-to-body="true"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <div class="news_detail ql-editor" v-html="newsRow.content"></div>
    </el-dialog>
  </div>
</template>

<script>
  import activityNews from "@/views/project/newsComponent/activityNews";
  import negNews from "@/views/project/newsComponent/negNews";
  import safeNews from "@/views/project/newsComponent/safeNews";
  import {mapGetters} from "vuex";
  import {getNews, addNews} from "@/api/news";
  import {validPicurl} from "@/utils/validate";
  import richTextView from "@/components/richText/index";

  export default {
    name: "",
    components: {activityNews, negNews, safeNews, richTextView},
    data() {
      return {
        currentView: "negNews",
        dialogVisible: false,
        dialogDetailVisible: false,
        header: {token: ""}, // 文件上传带token
        newsRow: {},
        fileList: [],
        form: {},
        rules: {
          title: [{required: true, message: "请输入标题", trigger: "blur"}],
          sttime: [{required: true, message: "请选择时间", trigger: "blur"}],
          pic: [{required: true, message: "请上传图片", trigger: "blur"}],
          content: [{required: true, message: "请填写新闻内容", trigger: "blur"}]
        },
        tableData: []
      };
    },
    computed: {
      ...mapGetters(["userInfo", "uploadUrl", "project"])
    },
    created() {
      this.initData();
    },
    methods: {
      initData() {
        let type = null;
        if (this.currentView === "negNews") {
          type = 1;
        } else if (this.currentView === "activityNews") {
          type = 2;
        } else {
          type = 3;
        }
        getNews(type, this.project.id).then((res) => {
          let data = res.data;
          if (data && data.length > 0) {
            data.forEach((item) => {
              item.pic = validPicurl(item.pic);
              item.image = item.pic[0];
            });
          }
          this.tableData = data;
        });
      },
      changeView(val) {
        if (this.currentView != val) {
          this.currentView = val;
          this.initData();
        }
      },
      showNewsDetail(row) {
        if (row.content) {
          this.newsRow = row;
          this.dialogDetailVisible = true;
        } else {
          this.$message({
            message: "未填写新闻内容",
            type: "warning",
            customClass: "message_override"
          });
        }


      },
      showDialog() {
        this.form = {
          projectId: this.project.id,
          content: "",
          pic: "",
          title: ""
        };
        this.fileList = [];
        this.dialogVisible = true;
      },
      submitNew() {
        // if (this.fileList.length === 0) {
        //   this.$message({
        //     message: "请上传照片",
        //     type: "warning",
        //     customClass: "message_override"
        //   });
        //   return;
        // }
        this.$refs["form"].validate((valid) => {
          if (valid) {
            const obj = Object.assign({}, this.form);
            let str = this.fileList[0].response.data;
            obj.pic = str;
            if (this.currentView === "negNews") {
              obj.type = 1;
            } else if (this.currentView === "activityNews") {
              obj.type = 2;
            } else {
              obj.type = 3;
            }
            addNews(obj).then((res) => {
              this.$message({
                message: "添加成功",
                type: "success",
                customClass: "message_override"
              });
            });
            this.fileList = [];
            this.dialogVisible = false;
            this.form = {};
            this.initData();
          }
        });
      },
      uploadSuccess(response, file, fileList) {
        this.form.pic = response.data;
        this.fileList = fileList;
      },
      handleRemove(file, fileList) {
        this.form.pic = "";
        this.fileList = fileList;
      }
    }
  };
</script>

<style scoped lang="scss">
.wrapper {
  height: 100%;
  padding: 2px 5px 5px 5px;
  background-color: #edeff8;
  color: #4a4a4a;
  .header {
    height: 70px;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    padding-left: 10px;
    ul {
      height: 100%;
      display: flex;
      align-items: center;
      margin-right: 30px;
      li {
        height: 50px;
        color: black;
        padding: 15px 40px;
        border: 1px solid rgb(51, 133, 255);
        cursor: pointer;
      }
      .active {
        background-color: rgb(51, 133, 255);
        color: #ffffff;
      }
    }
    .el-button {
      background-color: rgb(51, 133, 255);
      color: #ffffff;
      border-color: rgb(51, 133, 255);
    }
  }

  .content {
    margin-top: 10px;
    background-color: #ffffff;
    height: calc(100% - 100px);
  }
}
</style>
<style lang="scss">
  .news_detail_panel {
    width: 70%;

    .news_detail {
      height: 600px;
      overflow-y: auto;
    }

  }
</style>
