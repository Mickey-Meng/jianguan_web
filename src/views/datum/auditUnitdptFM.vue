<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-16 09:07:11
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-02-17 17:32:13
-->
<template>
  <div class="con_wrapper">
    <div class="header">
      <ul>
        <li
          v-for="(item, index) in options"
          :key="index"
          :class="{ active: currentView == item.name }"
          @click="changeView(item)"
        >
          {{ item.title }}
        </li>
      </ul>
      <el-button type="primary" @click="showDialog">上传文件</el-button>
    </div>
    <div class="content">
      <keep-alive>
        <component
          :is="currentView"
          :DataArr="tableData"
          @opdateInfo="opdateInfo"
        />
      </keep-alive>
    </div>
    <el-dialog
      :title="isCreate ? '上传文件' : '修改信息'"
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


        <el-form-item label="资料类型" prop="typeText">
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


        <el-form-item label="资料名称" prop="filename">
          <el-input
            placeholder="请输入文件名称"
            v-model="form.filename"
          ></el-input>
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
        <el-button size="mini" type="primary" @click="addFile">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonFile_week from "./supervisordptComponent/commonFileListPage.vue";
import commonFile_month from "./supervisordptComponent/commonFileListPage.vue";
import {
  uploadF,
  getFile,
  deleteFile,
  updateFileInfo,
  getFileByTypeList,
  getFileDictByPCode,
  getStoreFileByPcode
} from "@/api/file";
import {mapGetters} from "vuex";
import {disposeUrl} from "@/utils/validate";

export default {
  name: "",
  components: { commonFile_week,commonFile_month},
  data() {
    return {
      currentView: "commonFile_week",
      dialogVisible: false,
      isCreate: false,
      options: [

        {
          name: "commonFile_week",
          title: "周",
          key: 'sjdwzlgl-week',
        },
        {
          name: "commonFile_month",
          title: "月",
          key: 'sjdwzlgl-month',
        },

      ],
      // type: 12,
      // typeText: "日",
      form: {
        fileurl: "", //文件url
        uploadname: "", //文件名称
        uploadtype: "", //资料类型
        uploadusername: "", //上传人
        changereason: "", //变更事由
        type: "", //类型
        distiancename: "", //标段名称
        changecontent: "", //更新内容
        isutf: "0", //是否编码
        softname: "", //报批人 批复人
        opiontion: "", //文件编码
        callunit: "", //发布单位
        calladdr: "", //会议地点
        calltime: "",
      },
      tableData: [],
      functionary: [], // 文件分类字典
      rules: {
        filename: [
          { required: true, message: "请输入文件名称", trigger: "blur" },
        ],
        fileurl: [{ required: false, message: "请上传文件", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["project"])
  },
  mounted() {},
  created() {
    this.init();
  },
  methods: {
    init() {
      this.functionary = [];
      this.tableData = [];
      if(typeof this.pCode === 'undefined'  ){
        this.pCode = 'sjdwzlgl-week';
      }
      getFileDictByPCode(this.pCode).then((res) => {
        this.functionary = res.data;
      }).catch(function (error) {
      });

      //获取已上传的附件清单
      getStoreFileByPcode(this.pCode,this.project.id).then((res) => {
        this.tableData = res.data;
      });
    },
    changeView(item) {
      // this.typeText = item.title;
      this.currentView = item.name;
      this.pCode = item.key;
      this.init();
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
    showDialog() {
      this.form = {
        fileurl: "",
        uploadname: "",
        uploadtype: "",
        uploadusername: "",
        changereason: "",
        // type: 12,
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
      this.isCreate = true;
      this.dialogVisible = true;
    },
    addFile() {
      if (this.isCreate) {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            const obj = Object.assign({}, this.form);
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
      } else {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            updateFileInfo(obj).then((res) => {
              this.init();
              this.$message({
                message: "基本信息修改成功",
                type: "success",
                customClass: "message_override",
              });
              this.dialogVisible = false;
            });
          } else {
            return false;
          }
        });
      }
    },
    opdateInfo(row) {
      this.form = Object.assign(this.form, row.row);
      this.isCreate = false;
      this.dialogVisible = true;
    },
  },
};
</script>

<style scoped lang='scss'>
.con_wrapper {
  height: 100%;
  // padding: 10px;
  background-color: #edeff8;
  padding: 5px;
  .header {
    background-color: #ffffff;
    height: 70px;
    display: flex;
    align-items: center;
    //margin:5px;
    ul {
      display: flex;
      align-items: center;
      margin-right: 10px;
      li {
        height: 50px;
        padding: 15px 40px;
        border: 1px solid rgb(51, 133, 255);
        cursor: pointer;
        color: #000000;
      }
      .active {
        background-color: rgb(51, 133, 255);
        color: #ffffff;
      }
    }
    .export {
      background-image: url("../../assets/image/导出.png");
      width: 75px;
      height: 28px;
      line-height: 28px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin-left: 20px;
      text-align: center;
    }
  }
  .content {
    margin-top: 5px;
    height: calc(100% - 85px);
  }
}
</style>
