<template>
  <div class="wrapper">
<!--    <div class="header">待审核工序列表</div>-->
    <div class="nav">
      <div
        :class="{ active: currentView === 'check' }"
        @click="changeView('check')"
      >
        工序审核
      </div>
      <div
        :class="{ active: currentView === 'record' }"
        @click="changeView('record')"
      >
        审核记录
      </div>
    </div>
<!--    <div class="select-search">-->
<!--      <el-cascader v-model="value" :options="options"></el-cascader>-->
<!--    </div>-->
<!--    <div class="date-s" v-if="currentView === 'record'">-->
<!--      <div class="label">完工日期</div>-->
<!--      <el-date-picker-->
<!--        v-model="timeValue"-->
<!--        type="date"-->
<!--        placeholder="选择日期"-->
<!--        value-format="yyyy-MM-dd"-->
<!--      >-->
<!--      </el-date-picker>-->
<!--    </div>-->
<!--    <div class="input-search">-->
<!--      <el-input-->
<!--        placeholder="请输入构件编码"-->
<!--        v-model="inputValue"-->
<!--        class="input-with-select"-->
<!--      >-->
<!--        <el-button slot="append" icon="el-icon-search">搜索</el-button>-->
<!--      </el-input>-->
<!--    </div>-->
    <div class="main" v-show="currentView === 'check'">
      <el-table
        :data="tableData"
        style="width: 100%"
        class="small_scrolling"
        key="check"
        height="100%"
        border
      >
        <!-- <el-table-column prop="conponentcode" label="构件编码" align="center">
        </el-table-column>
        <el-table-column prop="conponentname" label="构件类型" align="center">
        </el-table-column> -->
        <el-table-column prop="producename" label="工序名称" align="center">
        </el-table-column>
        <el-table-column
          prop="stime"
          label="完成时间"
          align="center"
          show-overflow-tooltip=""
        >
        </el-table-column>
        <el-table-column label="附件" align="center">
          <template slot-scope="{ row }">
            <svg-icon
              class="svg-class svg-btn finish"
              icon-class="seeDetail"
              @click="seeRecord(row)"
            ></svg-icon>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-tooltip
              class="item"
              popper-class="tooltio-panel"
              :enterable="false"
              effect="dark"
              content="审核"
              placement="top"
            >
              <svg-icon
                icon-class="audit"
                class="svg-btn"
                @click="showAuditDialog(row)"
              ></svg-icon>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="main-box-table" v-show="currentView === 'record'">
      <el-table
        :data="recordsData"
        style="width: 100%"
        class="small_scrolling"
        key="record"
        height="100%"
        border
      >
        <el-table-column prop="conponentcode" label="构件编码" align="center">
        </el-table-column>
        <el-table-column prop="conponentname" label="构件类型" align="center">
        </el-table-column>
        <el-table-column prop="producename" label="工序名称" align="center">
        </el-table-column>
        <el-table-column
          prop="stime"
          label="完成时间"
          align="center"
          show-overflow-tooltip=""
        >
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{ row }">
            <el-tooltip
              class="item"
              popper-class="tooltio-panel"
              :enterable="false"
              effect="dark"
              content="查看详情"
              placement="top"
            >
              <svg-icon
                icon-class="eye-open"
                class="svg-btn"
                @click="showDrawer(row)"
              ></svg-icon>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="工序审核"
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
        class="bim-form-panel"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="审核状态" prop="result">
          <el-select
            v-model="form.result"
            placeholder="请选择审核状态"
          >
            <el-option
              v-for="item in status"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核照片">
          <el-upload
            class="upload-demo"
            :headers="header"
            action="/ZhuJiRoad/mong/upload"
            multiple
            :limit="3"
            :before-upload="beforeUploadImage"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
          >
            <div slot="tip" class="el-upload__tip">
              只能上传JPG,JPEG,PNG,BMP,GIF文件
            </div>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="PDF">
          <el-upload
            class="upload-demo"
            :headers="header"
            action="/ZhuJiRoad/mong/upload"
            multiple
            :limit="1"
            :before-upload="beforeUpload"
            :on-success="uploadPdfSuccess"
            :on-remove="handlePdfRemove"
            :file-list="fileListPdf"
          >
            <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
<!--        <el-form-item label="通知全咨" v-if="form.result ==1">
          <el-select v-model="qz" multiple :disabled="true">
            <el-option
              v-for="item in clientCompany"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知建设集团" v-if="form.result ==1">
          <el-select v-model="jsdw" multiple :disabled="true">
            <el-option
              v-for="item in constructionGroup"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="旁站记录">
          <el-input
            type="textarea"
            v-model="form.standbyrecode"
            :rows="3"
          ></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="备注">
          <el-input
            type="text"
            v-model="form.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item> -->
      </el-form>
      <div style="text-align: right">
        <el-button plain size="mini" class="btn-bg" @click="submitData"
          >提交</el-button
        >
        <el-button
          plain
          size="mini"
          class="btn-bg"
          @click="dialogVisible = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="dialogPdfVisible"
      width="80%"
      append-to-body
      class="top_dialog"
    >
      <div v-if="false" slot="title"></div>
      <iframe
        v-if="dialogPdfVisible"
        :src="recode.pdf"
        width="100%"
        height="600"
      ></iframe>
    </el-dialog>

    <el-drawer
      title="我是标题"
      :visible.sync="DrawerVisible"
      :with-header="false"
      custom-class="drawer-bottom-panel"
      append-to-body
      size="50%"
      :wrapperClosable="false"
      direction="btt"
    >
      <el-container>
        <el-header>
          <div class="link-info">
            类型：
            <span>{{ componentInfo.conponentname }}</span>
            编码：
            <span>{{ componentInfo.conponentcode }}</span>
            工序名称：
            <span>{{ componentInfo.producename }}</span>
          </div>
          <i class="el-icon-close" @click="DrawerVisible = false"></i>
        </el-header>
        <el-main>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="processRecordData"
                style="width: 100%"
                border
                height="100%"
              >
                <el-table-column
                  prop="process"
                  label="流程"
                  align="center"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="执行人员"
                  align="center"
                  width="120"
                >
                </el-table-column>
                <el-table-column
                  prop="time"
                  width="180"
                  align="center"
                  label="执行时间"
                >
                </el-table-column>
                <el-table-column align="center" label="举牌照片">
                  <template slot-scope="{ row }">
                    <div class="image-box">
                      <div v-for="(item, index) in row.image" :key="index">
                        <img :src="item" alt="" @click="seePicDetail(item)" />
                        <div @click="downloadImage(item)">下载</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="附件">
                  <template slot-scope="{ row }">
                    <el-button
                      type="primary"
                      size="mini"
                      v-if="row.pdf"
                      @click="seePdf(row)"
                      >预览附件</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <!-- <el-col :span="12" class="accept">
              <div>
                <ul>
                  <li>验收记录</li>
                  <li>关键数据</li>
                </ul>
                <div class="record-box">
                  <div class="img">
                    <div
                      v-if="
                        (acceptData && acceptData.accrecodeurl.length === 0) ||
                        !acceptData
                      "
                      class="empty-text"
                    >
                      暂无数据
                    </div>
                    <div v-else class="img-box">
                      <div v-for="(item, index) in acceptData.accrecodeurl">
                        <img :src="item" alt="" @click="seePicDetail(item)" />
                        <div>下载</div>
                      </div>
                    </div>
                  </div>
                  <div class="text">
                    <div
                      v-if="(acceptData && !acceptData.keydata) || !acceptData"
                      class="empty-text"
                    >
                      暂无数据
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <ul>
                  <li>测试报告</li>
                  <li>旁站记录</li>
                </ul>
                <div class="record-box">
                  <div class="img">
                    <div
                      v-if="
                        (acceptData && acceptData.testurl.length === 0) ||
                        !acceptData
                      "
                      class="empty-text"
                    >
                      暂无数据
                    </div>
                    <div v-else class="img-box">
                      <div v-for="(item, index) in acceptData.testurl">
                        <img :src="item" alt="" @click="seePicDetail(item)" />
                        <div>下载</div>
                      </div>
                    </div>
                  </div>
                  <div class="text"></div>
                </div>
              </div>
            </el-col>-->
          </el-row>
        </el-main>
        <div ref="viewer" v-viewer="{ movable: false }" style="display: none">
          <template v-for="src in showPic">
            <img v-if="src" :src="src" :key="src" />
          </template>
        </div>
      </el-container>
    </el-drawer>
  </div>
</template>

<script>
  import * as api from "@/api/quality";
  import {mapGetters} from "vuex";
  import {getToken} from "@/utils/auth";
  import {disposeUrl, validPicurl} from "@/utils/validate";
  import {downLoadFile} from "@/utils/download";
  import {formatDate} from "@/utils/date";
  import {getConAndReferPerson} from "@/api/project";

  export default {
    name: "",
    data() {
      return {
        value: "",
        timeValue: "",
        inputValue: "",
        dialogVisible: false,
        currentView: "check", //record
        options: [],
        jsdw: [],
        qz: [],
        status: [
          {
            name: "通过",
            id: 1
          },
          {
            name: "驳回",
            id: 2
          }
        ],
        tableData: [],
        constructionGroup: [],//建设集团的人
        clientCompany: [], //全咨公司的人
        recordsData: [],
        form: {
          result: 1,
          recondid: null,
          testurl: "",
          standbyrecode: "",
          copyUsers: ""
        },
        header: {token: ""},
        fileList: [],
        fileListPdf: [],
        rowData: {},
        rules: {
          result: [
            {required: true, message: "请选择审核状态", trigger: "blur"}
          ]
        },
        //drawer数据
        DrawerVisible: false,
        showPic: [],
        processRecordData: [],
        acceptData: null,
        componentInfo: {},
        recodeUrl: "", //pdf地址
        recode: {}, //pdf数据
        dialogPdfVisible: false
      };
    },
    created() {
      this.header.token = getToken("zj_token");
      this.initPerson();
      this.initData();
      this.recodeUrl = this.getUrl;
    },
    computed: {
      ...mapGetters(["userInfo", "getUrl", "project"])
    },
    methods: {
      changeView(val) {
        if (this.currentView !== val) {
          this.currentView = val;
          if (val === "record") {
            this.getRecord();
          } else {
            this.initData();
          }
        }
      },
      initData() {
        api.getAgency(this.project.id).then((res) => {
          this.tableData = res.data;
        });
      },
      initPerson() {
        getConAndReferPerson(this.project.id).then(res => {
          this.constructionGroup = res.data.JSDW;
          this.clientCompany = res.data.QZ;
        });
      },
      getRecord() {
        api.getAllcheckData(1).then((res) => {
          this.recordsData = res.data.filter((e) => e.checkresult === 1);
        });
      },
      showAuditDialog(row) {
        this.rowData = row;
        this.form = {
          result: 1,
          recondid: null,
          testurl: "",
          standbyrecode: "",
          copyUsers: ""
        };
        this.qz = this.clientCompany.map(e => e.id);
        this.jsdw = this.constructionGroup.map(e => e.id);
        this.dialogVisible = true;
      },
      submitData() {
        // if (this.fileList.length === 0) {
        //   this.$message({
        //     message: "请上传审核照片",
        //     type: "warning",
        //     customClass: "message_override",
        //   });
        //   return;
        // }
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            obj.testurl = disposeUrl(this.fileList);
            obj.recondid = this.rowData.recodeid;
            if (this.fileListPdf && this.fileListPdf.length > 0) {
              let str = this.fileListPdf[0].response.data;
              obj.standbyrecode = str;
            }
            if (obj.result == 1) {
              let userData = this.qz.concat(this.jsdw);
              obj.copyUsers = userData.join(",")
            }
            obj.produceId = this.rowData.produceid;
            api.confirmReport(obj).then((res) => {
              this.dialogVisible = false;
              this.$message({
                message: "审核成功",
                type: "success",
                customClass: "message_override"
              });
              this.fileList = [];
              this.fileListPdf = [];
              this.initData();
            });
          }
        });
      },
      /**
       * @Description: 查看记录详情
       * @author wangharry
       * @param {}
       * @returns {}
       * @date 2021/7/21
       */
      showDrawer(row) {
        this.seeRecord(row);

        // this.acceptData = null;
        // api.getProcessRecordsById(row.id).then((res) => {
        //   let { check, fillin, produceandrecode, recode } = res.data;
        //   if (fillin) {
        //     fillin.picurl = validPicurl(fillin.picurl);
        //     fillin.name = "工序填报";
        //     fillin.user = produceandrecode.updateusername;
        //     this.processRecordData.push(fillin);
        //   }
        //   if (check) {
        //     check.picurl = validPicurl(check.picurl);
        //     check.name = "工序审核";
        //     check.user = produceandrecode.checkusername;
        //     this.processRecordData.push(check);
        //   }
        //   if (recode) {
        //     let obj = Object.assign({}, recode);
        //     obj.accrecodeurl = validPicurl(obj.accrecodeurl);
        //     obj.testurl = validPicurl(obj.testurl);
        //     this.acceptData = obj;
        //   }

        //   this.DrawerVisible = true;
        // });
      },
      seeRecord(row) {
        this.componentInfo = row;
        this.processRecordData = [];
        api.getCurrentPdf(row.recodeid).then((res) => {
          let data = res.data;
          let {recode, produceandrecode} = data;
          let {accrecodeurl, remark, testurl, standbyrecode} = recode;
          let {updateusername, checkusername, stime, updatetime, checkresult} =
            produceandrecode;
          let uploadUrl = validPicurl(accrecodeurl);
          let uploadPdf = remark ? this.recodeUrl + remark : "";
          let checkUrl = validPicurl(testurl);
          let checkPdf = standbyrecode ? this.recodeUrl + standbyrecode : "";
          let arr = [
            {
              process: "工序填报",
              name: updateusername,
              image: uploadUrl,
              pdf: uploadPdf,
              time: formatDate(stime)
            },
            {
              process: "工序审核",
              name: checkusername,
              image: checkresult === 1 ? checkUrl : "",
              pdf: checkresult === 1 ? checkPdf : "",
              time: checkresult === 1 ? formatDate(updatetime) : ""
            }
          ];
          this.processRecordData = arr;
          this.DrawerVisible = true;
        });
    },
    downloadImage(item) {
      let str = item.split("=")[1];
      downLoadFile(str);
    },
    seePdf(row) {
      this.recode = row;
      this.dialogPdfVisible = true;
    },
    seePicDetail(row) {
      this.showPic = [];
      this.showPic.push(row);
      this.$refs.viewer.$viewer.show();
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    beforeUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (fileSuffix.toLowerCase() !== "pdf") {
        this.$message({
          message: "请上传PDF文件",
          type: "warning",
          customClass: "message_override",
        });
        return false;
      }
    },
    uploadPdfSuccess(response, file, fileList) {
      this.fileListPdf = fileList;
    },
    handlePdfRemove(file, fileList) {
      this.fileListPdf = fileList;
    },
    //上传举牌照片前的回调
    beforeUploadImage(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (
        ["JPG", "JPEG", "PNG", "BMP", "GIF"].includes(fileSuffix.toUpperCase())
      ) {
      } else {
        this.$message({
          message: "请上传格式为JPG,JPEG,PNG,BMP,GIF的文件",
          type: "warning",
          customClass: "message_override",
        });
        return false;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  .main {
    height: calc(100% - 90px);
  }
  .main-box-table {
    height: calc(100% - 90px);
  }
  //.header {
  //  background-color: #1e374b;
  //  height: 50px;
  //  line-height: 50px;
  //  text-indent: 2em;
  //}

  .nav {
    display: flex;
    padding: 20px;
    > div {
      padding: 7px 25px;
      cursor: pointer;
      margin-right: 20px;
      background: url("../../assets/newUi/check_bg.png") no-repeat;
      background-size: 100% 100%;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #808EA9;
    }

    .active {
      background: url("../../assets/newUi/check_active_bg.png") no-repeat;
      color: #1E6EEB;
    }
  }
  //.date-s {
  //  display: flex;
  //  align-items: center;
  //  border-bottom: 1px solid #203c56;
  //  height: 40px !important;
  //  line-height: 40px;
  //
  //  .label {
  //    padding: 0 20px 0 15px;
  //    font-size: 14px;
  //    border-right: 1px solid #203c56;
  //  }
  //  ::v-deep .el-date-editor {
  //    margin-left: 15px;
  //
  //    .el-input__inner {
  //      height: 30px !important;
  //      line-height: 30px;
  //    }
  //    .el-input__prefix {
  //      .el-input__icon {
  //        line-height: 30px;
  //      }
  //    }
  //    .el-input__suffix {
  //      .el-input__icon {
  //        line-height: 30px;
  //      }
  //    }
  //  }
  //}

  //.select-search {
  //  border-bottom: 1px solid #203c56;
  //
  //  ::v-deep .el-cascader {
  //    width: 100%;
  //
  //    .el-input {
  //      .el-input__inner {
  //        background-color: transparent;
  //        border: none;
  //      }
  //    }
  //  }
  //}

  //.input-search {
  //  border-bottom: 1px solid #203c56;
  //
  //  ::v-deep .input-with-select {
  //    .el-input__inner {
  //      background-color: transparent;
  //      border: none;
  //    }
  //
  //    .el-input-group__append {
  //      background-color: transparent;
  //      border: none;
  //      color: #ffffff;
  //      border-left: 1px solid #203c56;
  //    }
  //  }
  //}
  .footer {
    height: 30px;
  }
}
::v-deep.bim-table {
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
}
.top_dialog {
  z-index: 10000000007 !important;
}
</style>
