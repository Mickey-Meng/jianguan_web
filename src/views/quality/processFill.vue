<template>
  <div class="wrapper">
    <div class="header">
      工序填报<span>{{ name }}</span>
    </div>
    <div class="nav">
      <div
        :class="{ active: currentView === 'fill' }"
        @click="changeView('fill')"
      >
        工序填报
      </div>
      <div
        :class="{ active: currentView === 'record' }"
        @click="changeView('record')"
      >
        填报记录
      </div>
    </div>
    <div class="main">
      <div v-if="currentView === 'fill'" class="fill">
        <div>
          <el-table
            :data="tableData"
            style="width: 100%"
            class=""
            key="check"
            height="100%"
            v-if="currentView === 'fill'"
            border
          >
            <el-table-column prop="name" label="工序名称" align="center">
            </el-table-column>
            <el-table-column
              label="完成时间"
              width="140px"
              show-overflow-tooltip
              align="center"
            >
              <template slot-scope="{ row }">
                {{ row.finish ? row.finish : "未录入" }}
              </template>
            </el-table-column>
            <el-table-column label="照片/附件" width="80px" align="center">
              <template slot-scope="{ row }">
                <svg-icon
                  class="svg-class svg-btn"
                  :class="
                    row.status === 3
                      ? 'submit'
                      : row.status === 2
                      ? 'reject'
                      : row.status === 1
                      ? 'finish'
                      : 'error'
                  "
                  icon-class="seeDetail"
                  v-if="row.recordid"
                  @click="seeRecord(row)"
                ></svg-icon>
                <span v-else>未录入</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60px" align="center">
              <template slot-scope="{ row, $index }">
                <el-tooltip
                  class="item"
                  popper-class="tooltio-panel"
                  :enterable="false"
                  effect="dark"
                  content="填报"
                  placement="top"
                >
                  <svg-icon
                    icon-class="update"
                    class="svg-btn"
                    @click="fillProcess(row, $index)"
                  ></svg-icon>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- <el-button type="primary" size="small">删除工序</el-button> -->
      </div>
      <div v-if="currentView === 'record'" class="record">
<!--        <el-cascader v-model="value" :options="options"></el-cascader>-->
        <el-table
          :data="recordsData"
          style="width: 100%"
          class="small_scrolling"
          key="check"
          v-if="currentView === 'record'"
          height="95%"
          border
        >
          <el-table-column label="状态" align="center">
            <template slot-scope="{ row }">
              <div
                :class="
                  row.checkresult === 3
                    ? 'sum'
                    : row.checkresult === 2
                    ? 'rej'
                    : row.checkresult === 1
                    ? 'yes'
                    : ''
                "
              >
                {{
                  row.checkresult === 3
                    ? "正在审核"
                    : row.checkresult === 2
                    ? "监理驳回"
                    : row.checkresult === 1
                    ? "审核通过"
                    : ""
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="conponentcode" label="构件编码" align="center">
          </el-table-column>
          <el-table-column prop="conponentname" label="构件类型" align="center">
          </el-table-column>
          <el-table-column prop="producename" label="工序名称" align="center">
          </el-table-column>
          <el-table-column prop="stime" label="完成时间" align="center">
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        :title="'工序名称:' + name"
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
          :model="recordForm"
          :rules="rules"
        >
          <el-form-item label="完成时间" prop="uploadtime">
            <el-date-picker
              v-model="recordForm.uploadtime"
              clearable
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="指定监理" prop="checkid">
            <el-select
              v-model="recordForm.checkid"
              clearable
              placeholder="请选择监理人员"
              filterable=""
            >
              <el-option
                v-for="(item, index) in supervisor"
                :key="index"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="举牌照片">
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

          <!-- <el-form-item label="验收报告">
            <el-upload
              class="upload-demo"
              :headers="header"
              action="/ZhuJiRoad/hdfs/uploadFile"
              multiple
              :limit="3"
              :on-success="goodSuccess"
              :on-remove="goodRemove"
              :file-list="goodList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="测试报告">
            <el-upload
              class="upload-demo"
              :headers="header"
              action="/ZhuJiRoad/hdfs/uploadFile"
              multiple
              :limit="3"
              :on-success="testSuccess"
              :on-remove="testRemove"
              :file-list="testList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item> -->
        </el-form>
        <div style="text-align: right">
          <el-button plain size="mini" class="btn-bg" @click="submitRecord"
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
    </div>
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
            <!-- <span>{{componentInfo?componentInfo.childConponent[0].pname:''}}</span> -->
            <span>{{ componentInfo ? componentInfo.pname : "" }}</span>
            编码：
            <span>{{ componentInfo ? componentInfo.conponetcode : "" }}</span>
            <!-- <span>{{componentInfo?componentInfo.childConponent[0].conponentcode:''}}</span> -->
            工序名称：
            <span>{{ processData ? processData.name : "" }}</span>
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
                      <div
                        v-for="(item, index) in acceptData.accrecodeurl"
                        :key="index"
                      >
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
                      <div
                        v-for="(item, index) in acceptData.testurl"
                        :key="index"
                      >
                        <img :src="item" alt="" @click="seePicDetail(item)" />
                        <div>下载</div>
                      </div>
                    </div>
                  </div>
                  <div class="text"></div>
                </div>
              </div>
            </el-col> -->
          </el-row>
        </el-main>
      </el-container>
    </el-drawer>
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
    <div ref="viewer" v-viewer="{ movable: false }" style="display: none">
      <template v-for="src in showPic">
        <img v-if="src" :src="src" :key="src" />
      </template>
    </div>
  </div>
</template>

<script>
//----------- checkresult字段 status   3-已提交,1-确认,2-驳回
import Bus from "@/assets/eventBus";
import { getNowDate, formatDate } from "@/utils/date";
import * as api from "@/api/quality";
import { updateProgress } from "@/api/progress";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import { validPicurl, disposeUrl } from "@/utils/validate";
import { downLoadFile } from "@/utils/download";

export default {
  name: "",
  data() {
    return {
      currentView: "fill", //record
      drawerVisible: false,
      DrawerVisible: false,
      name: "",
      value: "",
      options: [],
      recordsData: [],
      tableData: [],
      title: "",
      supervisor: [],
      processData: {},
      processRecordData: [],
      acceptData: null,
      testData: null,
      componentInfo: null,
      submitDataInfo: null,
      dialogVisible: false,
      dialogPdfVisible: false,
      fileList: [],
      goodList: [],
      testList: [],
      fileListPdf: [],
      header: { token: "" },
      recordForm: {},
      showPic: [],
      rules: {
        uploadtime: [
          { required: true, message: "请选择完成时间", trigger: "blur" },
        ],
        checkid: [
          { required: true, message: "请选择监理人员", trigger: "blur" },
        ],
      },
      recodeUrl: "", //pdf地址
      recode: {}, //pdf数据
      //工序被驳回、走修改
      refuseData: {},
      isCreate: true, //判断是新增工序填报还是修改工序
    };
  },
  computed: {
    ...mapGetters(["userInfo", "getUrl", "project"])
  },
  created() {
    this.header.token = getToken("zj_token");
    this.initData();
    Bus.$on("getProcessById", (data) => {
      this.componentInfo = data;
      this.name = "(" + data.pname + ":" + data.conponetcode + ")";
      this.getCheackDataById();
    });
  },
  methods: {
    initData() {
      this.recodeUrl = this.getUrl;
    },
    changeView(val) {
      if (this.currentView !== val) {
        this.currentView = val;
        if (val === "record") {
          this.getRecord();
        }
      }
    },
    getRecord() {
      api.getAllcheckData(2).then((res) => {
        this.recordsData = res.data;
      });
    },
    getCheackDataById() {
      api.getCheckData(this.componentInfo.id).then((res) => {
        this.tableData = res.data.check;
        this.submitDataInfo = res.data.data;
      });
      // let code = this.componentInfo.conponetcode.substring(0, 4);
      let code = this.componentInfo.conponetcode;
      api.getPersonByComponentId(code,this.project.id).then((res) => {
        this.supervisor = res.data;
      });
    },
    fillProcess(row, index) {
      let obj = null;
      // this.fileList = [];
      // this.goodList = [];
      // this.testList = [];
      if (index !== 0) {
        obj = this.tableData[index - 1];
      }
      //0 没填报 3已填报待审核 1已确认 2审核未通过
      //如果点击工序的上一步未审核通过，不能填报
      let { status } = row;
      if (obj && obj.status !== 1) {
        this.$message({
          message: "请填报上个工序或联系监理审核上个工序",
          type: "warning",
          customClass: "message_override",
        });
        return;
      }
      //如果点击的工序status是0表示没有填报，可以直接填报
      if (status === 0) {
        this.isCreate = true;
        this.dialogVisible = true;
        this.title = row.produceName;
        this.recordForm = {};
        this.processData = row;
      } else if (status === 1) {
        //状态为1，工序审核已完成
        this.$message({
          message: "工序已审核完成，请填报下一道工序",
          type: "warning",
          customClass: "message_override",
        });
        return;
      } else if (status === 2) {
        //状态未2，工序审核被驳回，走修改
        this.processData = row;
        this.isCreate = false;
        this.dialogVisible = true;
        this.title = row.produceName;
        this.recordForm = {};
      } else if (status === 3) {
        this.$message({
          message: "请联系监理审核",
          type: "warning",
          customClass: "message_override",
        });
        return;
      }
      // if (status === 3) {
      //   this.$message({
      //     message: "请联系监理审核",
      //     type: "warning",
      //     customClass: "message_override",
      //   });
      //   return;
      // } else if (status === 2) {
      //   this.processData = row;
      //   this.isCreate = false;
      //   this.dialogVisible = true;
      //   this.title = row.produceName;
      //   this.recordForm = {};
      //   // this.$message({
      //   //   message: "审核未通过，请联系监理",
      //   //   type: "warning",
      //   //   customClass: "message_override",
      //   // });
      //   // return;
      // } else if (status === 0) {
      //   this.isCreate = true;
      //   this.dialogVisible = true;
      //   this.title = row.produceName;
      //   this.recordForm = {};
      //   this.processData = row;
      // }

      // if ((row.recordid && status === 3) || status === 1) {
      //   this.$message({
      //     message: "已填报工序记录",
      //     type: "warning",
      //     customClass: "message_override",
      //   });
      //   return;
      // }
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
    submitRecord() {
      if (this.fileList.length === 0) {
        this.$message({
          message: "请上传举牌照片",
          type: "warning",
          customClass: "message_override",
        });
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.isCreate) {
            let obj = Object.assign({}, this.recordForm);
            let component = this.submitDataInfo;
            let user = this.supervisor.find((e) => e.id === obj.checkid);
            obj.checkusername = user.name;
            obj.conpoentid = component.conponentid;
            obj.conponentname = component.conponenttypename;
            obj.conponenttype = component.conponenttype;
            obj.produceid = this.processData.produceid;
            obj.projectcode = component.projectcode;
            obj.produceidname = this.processData.name;
            obj.updateusername = this.userInfo.name;
            obj.projectId = this.project.id;
            if (this.fileListPdf && this.fileListPdf.length > 0) {
              let str = this.fileListPdf[0].response.data;
              obj.remark = str;
            }
            obj.accrecodeurl = disposeUrl(this.fileList);
            api.addRecord(obj).then((res) => {
              this.getCheackDataById();
              this.recordForm = {};
              this.fileListPdf = [];
              this.fileList = [];
              this.$message({
                message: "填报成功",
                type: "success",
                customClass: "message_override",
              });
              this.dialogVisible = false;
            });
          } else {
            let obj = Object.assign({}, this.recordForm);
            let user = this.supervisor.find((e) => e.id === obj.checkid);
            obj.checkusername = user.name;
            obj.updateusername = this.userInfo.name;
            if (this.fileListPdf && this.fileListPdf.length > 0) {
              let str = this.fileListPdf[0].response.data;
              obj.remark = str;
            }
            obj.accrecodeurl = disposeUrl(this.fileList);
            obj.recodeid = this.processData.recordid;
            obj.projectId = this.project.id;
            updateProgress(obj).then((res) => {
              this.getCheackDataById();
              this.recordForm = {};
              this.fileListPdf = [];
              this.fileList = [];
              this.$message({
                message: "填报成功",
                type: "success",
                customClass: "message_override",
              });
              this.dialogVisible = false;
            });
          }
        }
      });
    },
    /**
     * @Description: 查看填报详情
     * @author wangharry
     * @param {}
     * @returns {}
     * @date 2021/7/16
     */
    seeRecord(row) {
      this.processData = row;
      api.getCurrentPdf(row.recordid).then((res) => {
        this.processRecordData = [];

        let data = res.data;
        let { recode, produceandrecode } = data;
        let { accrecodeurl, remark, testurl, standbyrecode } = recode;
        let { updateusername, checkusername, stime, updatetime, checkresult } =
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
            time: formatDate(stime),
          },
          {
            process: "工序审核",
            name: checkusername,
            image: checkresult === 1 ? checkUrl : "",
            pdf: checkresult === 1 ? checkPdf : "",
            time: checkresult === 1 ? formatDate(updatetime) : "",
          },
        ];
        this.processRecordData = arr;
        this.DrawerVisible = true;
      });
    },
    seePdf(row) {
      this.recode = row;
      this.dialogPdfVisible = true;
    },
    downloadImage(item) {
      let str = item.split("=")[1];
      downLoadFile(str);
    },
    seePicDetail(row) {
      this.showPic = [];
      this.showPic.push(row);
      this.$refs.viewer.$viewer.show();
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
    /**
     * @Description: 举牌照片上传成功的钩子函数 移除的钩子函数
     * @author wangharry
     * @param {}
     * @returns {}
     * @date 2021/7/15
     */
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    /**
     * @Description: 验收报告上传成功的钩子函数 移除的钩子函数
     * @author wangharry
     * @param {}
     * @returns {}
     * @date 2021/7/15
     */
    goodSuccess(response, file, fileList) {
      this.goodList = fileList;
    },
    goodRemove(file, fileList) {
      this.goodList = fileList;
    },
    /**
     * @Description: 测试报告上传成功的钩子函数 移除的钩子函数
     * @author wangharry
     * @param {}
     * @returns {}
     * @date 2021/7/15
     */
    testSuccess(response, file, fileList) {
      this.testList = fileList;
    },
    testRemove(file, fileList) {
      this.testList = fileList;
    },
  },
  destroyed() {
    Bus.$off("getProcessById");
    Bus.$emit("clearEffect");
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  .header {
    //background-color: #1e374b;
    height: 50px;
    line-height: 50px;
    text-indent: 2em;
    border-bottom: 1px solid #E8E8E8;

    span {
      color: #1E6EEB;
    }
  }

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
  .main {
    height: calc(100% - 120px);
    .record {
      height: 100%;
    }
    .fill {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      > div {
        width: 100%;
        height: 95%;
      }
    }
    //::v-deep .el-cascader {
    //  width: 100%;
    //  padding: 0 20px;
    //
    //  .el-input {
    //    .el-input__inner {
    //      background-color: transparent;
    //      //border: none;
    //    }
    //  }
    //}
  }
}

.finish {
  color: #05e600;
}
.reject {
  color: blue;
}
.submit {
  color: #e6c400;
}
.yes {
  color: #05e600;
}
.rej {
  color: #8f9c07;
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
