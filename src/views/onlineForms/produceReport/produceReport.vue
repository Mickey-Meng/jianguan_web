<template>
    <div class="wrapper">
      <div class="content">
      <div class="tree_wrapper_box">
        <LeftTree :treeType ="treeType" /> 
      </div>

      <div class="table-content">
        <div class="header"> 工序报验<span>{{ name }}</span> </div>
        <div class="nav">
          <div :class="{ active: currentView === 'fill' }" @click="changeView('fill')"> 工序报验 </div>
          <div :class="{ active: currentView === 'record' }" @click="changeView('record')"> 验收记录 </div>
        </div>
      
        <div class="main">
          <!-- 工序填报 Tab页面 -->
          <div v-if="currentView === 'fill'" class="fill">
            <div>
              <el-table :data="tableData" style="width: 100%" class="" key="check" height="100%" v-if="currentView === 'fill'" border>
                <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
                <el-table-column prop="componentName" label="具体部位" align="center"></el-table-column>
                <el-table-column prop="componentCode" label="构建编码" align="center"></el-table-column>
                <el-table-column prop="name" label="工序名称" align="center"></el-table-column>
                <el-table-column label="完成时间" width="180px" show-overflow-tooltip align="center">
                  <template slot-scope="{ row }">
                    {{
                      row.status === 3
                      ? "正在审核"
                      : (row.status === 0 || !row.status
                        ? '未录入'
                        : row.finish)
                    }}
                  </template>
                </el-table-column>
                <el-table-column label="照片" width="100px" align="center">
                  <template slot-scope="{ row }">
                    <svg-icon class="svg-class svg-btn" :class="row.status === 3
                      ? 'submit'
                      : row.status === 2
                        ? 'reject'
                        : row.status === 1
                          ? 'finish'
                          : 'error'
                      " icon-class="photoimg" v-if="row.recordid" @click="seeRecord(row)"></svg-icon>
                    <span v-else>未录入</span>
                  </template>
                </el-table-column>

                <el-table-column label="附件" width="100px" align="center">
                  <template slot-scope="{ row }">
                    <svg-icon class="svg-class svg-btn" :class="row.status === 3
                      ? 'submit'
                      : row.status === 2
                        ? 'reject'
                        : row.status === 1
                          ? 'finish'
                          : 'error'
                      " icon-class="seeDetail" v-if="row.recordid" @click="seeTemplate(row)"></svg-icon>
                    <span v-else>未录入</span>
                  </template>
                </el-table-column>

                <el-table-column prop="status" align="center" label="审核状态" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tag
                      v-if="scope.row.status == '2'"
                      size="mini"
                      type="warning"
                    >
                      驳回
                    </el-tag>
                    <el-tag
                      v-if="scope.row.status == '0'"
                      size="mini"
                      type="default"
                    >
                      审批中
                    </el-tag>
                    <el-tag
                      v-if="scope.row.status == '1'"
                      size="mini"
                      type="success"
                    >
                      已审批
                    </el-tag>
                  </template>
                </el-table-column>

                <el-table-column label="操作" width="100px" align="center">
                  <template slot-scope="{ row, $index }">
                    <el-tooltip v-if="true"  class="item" popper-class="tooltio-panel" :enterable="false" effect="dark" content="填报"
                      placement="top">
                      <svg-icon icon-class="update" class="svg-btn" @click="fillProcess(row, $index)"></svg-icon>
                    </el-tooltip>

                    <el-tooltip class="item" popper-class="tooltio-panel" :enterable="false" effect="dark" content="详情"
                      placement="top">
                      <svg-icon icon-class="seeDetail" class="svg-btn" @click="viewDetail(row, $index)"></svg-icon>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- 填报记录 Tab页面 -->
          <div v-if="currentView === 'record'" class="record">
            <!--        <el-cascader v-model="value" :options="options"></el-cascader>-->
            <el-table :data="recordsData" style="width: 100%" class="small_scrolling" key="check"
              v-if="currentView === 'record'" height="95%" border>
              <el-table-column prop="status" align="center" label="审核状态" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-tag
                      v-if="scope.row.status == '2'"
                      size="mini"
                      type="warning"
                    >
                      驳回
                    </el-tag>
                    <el-tag
                      v-if="scope.row.status == '0'"
                      size="mini"
                      type="default"
                    >
                      审批中
                    </el-tag>
                    <el-tag
                      v-if="scope.row.status == '1'"
                      size="mini"
                      type="success"
                    >
                      已审批
                    </el-tag>
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


          <el-dialog :title="'工序名称:' + name" :visible.sync="dialogVisible" custom-class="dialog-panel" :append-to-body="true"
            destroy-on-close :close-on-click-modal="false">
            <el-form ref="form" size="small" label-position="right" label-width="120px" class="bim-form-panel"
              :model="recordForm" :rules="rules">
              <el-form-item label="完成时间" prop="uploadtime">
                <el-date-picker v-model="recordForm.uploadtime" clearable value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="指定监理" prop="checkid">
                <el-select v-model="recordForm.checkid" clearable placeholder="请选择监理人员" filterable="">
                  <el-option v-for="(item, index) in supervisor" :key="index" :value="item.id" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="举牌照片">
                <el-upload class="upload-demo" :headers="header" :action="uploadFileUrl" multiple :limit="10"
                  :before-upload="beforeUploadImage" :on-success="uploadSuccess" :on-remove="handleRemove"
                  :file-list="fileList">
                  <div slot="tip" class="el-upload__tip">
                    只能上传JPG,JPEG,PNG,BMP,GIF文件
                  </div>
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="PDF">
                <el-upload class="upload-demo" :headers="header" :action="uploadFileUrl" multiple :limit="10"
                  :before-upload="beforeUpload" :on-success="uploadPdfSuccess" :on-remove="handlePdfRemove"
                  :file-list="fileListPdf">
                  <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
            <div style="text-align: right">
              <el-button plain size="mini" class="btn-bg" @click="submitRecord">提交</el-button>
              <el-button plain size="mini" class="btn-bg" @click="dialogVisible = false">取消</el-button>
            </div>
          </el-dialog>
        </div>

      </div>
      
      <el-drawer title="查看已上传图片" :visible.sync="DrawerVisible" :with-header="false" custom-class="drawer-bottom-panel"
        append-to-body size="50%" :wrapperClosable="false" direction="btt">
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
                <el-table :data="processRecordData" style="width: 100%" border height="100%">
                  <el-table-column prop="process" label="流程" align="center" width="120">
                  </el-table-column>
                  <el-table-column prop="name" label="执行人员" align="center" width="120">
                  </el-table-column>
                  <el-table-column prop="time" width="180" align="center" label="执行时间">
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
                      <el-button type="primary" size="mini" v-if="row.pdf" @click="seePdf(row)">预览附件</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-drawer>

      <el-drawer title="查看已上传附件" :visible.sync="templateDrawerVisible" :with-header="false" custom-class="drawer-bottom-panel"
        append-to-body size="50%" :wrapperClosable="false" direction="btt">
        <el-container>
          <el-header>
            <div class="link-info">
              类型： <span>{{ componentInfo ? componentInfo.pname : "" }}</span>
              编码： <span>{{ componentInfo ? componentInfo.conponetcode : "" }}</span>
              工序名称： <span>{{ processData ? processData.name : "" }}</span>
            </div>
            <i class="el-icon-close" @click="templateDrawerVisible = false"></i>
          </el-header>
          <el-main>
            <el-row>
              <el-col :span="24">
                <el-table :data="templateListData" style="width: 65%" border class="have_scrolling">
                  <el-table-column type="index" width="80" align="center" label="序号"></el-table-column>
                  <el-table-column prop="documentName" width="500" align="center" label="表格名称"></el-table-column>
                  <el-table-column label="状态" width="150" align="center">
                    <template slot-scope="{ row }">
                      {{ row.documentStatus === 1 ? "已填写" :  "待填写" }}
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" width="200" align="center" label="操作">
                    <template slot-scope="{ row, $index }">
                    <!-- <el-button type="text" size="mini" @click="preview(row)">预览</el-button> -->
                    <el-button type="text" size="mini" @click="handleDownload(row)">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-drawer>

      <el-dialog :visible.sync="dialogPdfVisible" width="80%" append-to-body class="top_dialog">
        <div v-if="false" slot="title"></div>
        <iframe v-if="dialogPdfVisible" :src="recode.pdf" width="100%" height="600"></iframe>
      </el-dialog>
      <div ref="viewer" v-viewer="{ movable: false }" style="display: none">
        <template v-for="src in showPic">
          <img v-if="src" :src="src" :key="src" />
        </template>
      </div>
    </div>
      <edit ref="edit" :editRow="componentInfo"></edit>
      <detail ref="detail" :editRow="componentInfo"></detail>
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
  import edit from "./edit";
  import detail from './detail';
  import LeftTree from "../leftTree"
  import { download } from "@/utils/download";
  import { getFillDataTemplate, saveFillDataTemplate } from "@/api/onlineForms";
  import { listProduceDocument, getProduceDocument } from "@/api/produceDocument";
  
  export default {
    name: "",
    components: { edit, detail, LeftTree },
    data() {
      return {
        treeType:"onlineProduceReport",
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/mong/upload",
        currentView: "fill", //record
        drawerVisible: false,
        DrawerVisible: false,
        templateDrawerVisible: false,
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
        templateListData: []
      };
    },
    computed: {
      ...mapGetters(["userInfo", "getUrl", "project"])
    },
    mounted() {
      this.$nextTick(() => {
        Bus.$on("getProcessById", (data) => {
          this.componentInfo = data;
          this.name = "(" + data.pname + ":" + data.conponetcode + ")";
          this.getCheackDataById();
        });
      })
    },
    created() {
      this.header.token = getToken("zj_token");
      this.initData();
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
        api.getAllcheckData(2, this.project.id).then((res) => {
          this.recordsData = res.data;
        });
      },
      getCheackDataById() {
        api.getCheckData(this.componentInfo.id).then((res) => {
          let resComponent = res.data.data;
          let produceList = res.data.check;
          this.tableData = produceList.map(function(produceItem, index, produceList){
            produceItem.componentCode = resComponent.conponentcode;
            produceItem.componentName = resComponent.conponenttypename;
            return produceItem;
          })
          this.submitDataInfo = resComponent;
        });
        // let code = this.componentInfo.conponetcode.substring(0, 4);
        let code = this.componentInfo.conponetcode;
        api.getPersonByComponentId(code, this.project.id).then((res) => {
          this.supervisor = res.data;
        });
      },

      editStatus(row) {
        if(row.status == 1) {
          return false;
        }
        if(row.createUserId == this.$store.getters.userInfo.ID) {
          return true;
        }
        if(this.$store.getters.rolePerms[0] == 'gly') {
          return true;
        }
        return false;
      },

      /**
       * 查看详情
       */
      viewDetail(row) {
        this.$refs.detail.changeVisible(row, true);
      },

      fillProcess(row, index) {
        
        let obj = null;
        if (index !== 0) {
          obj = this.tableData[index - 1];
        }
        //0 没填报 3已填报待审核 1已确认 2审核未通过
        //如果点击工序的上一步未审核通过，不能填报
        let { status } = row;
        console.log("status:" + status);
        /**
        if (obj && obj.status !== 1) {
          this.$message({
            message: "请填报上个工序或联系监理审核上个工序",
            type: "warning",
            customClass: "message_override",
          });
          return;
        } */
        //如果点击的工序status是0表示没有填报，可以直接填报
        if (status === undefined || status === 0) {
         /**
          this.isCreate = true;
          this.dialogVisible = true;
          this.title = row.produceName;
          this.recordForm = {};
          this.processData = row;
         */ 
        this.$refs.edit.changeVisible(row, true);
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
      seeTemplate(row) {
        this.templateDrawerVisible = true;
        // 根据构建ID和工序ID查询待填写文档
        listProduceDocument({documentType : 1, componentId : this.componentInfo.id, produceId : row.produceid}).then((res) => {
          this.templateListData = res.rows;
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

      /**
       * 附件下载
       */
      handleDownload(file) {
        download(file.documentUrl, file.documentName, false);
      }
    },
    destroyed() {
      Bus.$off("getProcessById");
      Bus.$emit("clearEffect");
    }
    
  };
  </script>
  
  <style scoped lang="scss">
  .wrapper {
  height: 100%;
  padding: 2px 5px 10px 5px;

  .content {
    height: 100%;
    display: flex;
    .tree_wrapper_box{
      width: 500px;
    }
    .table-content {
      background-color: #FFFFFF;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: calc(100% - 305px);
      margin-left: 5px;
      overflow: auto;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #4B5973;

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
  
      >div {
        padding: 7px 25px;
        cursor: pointer;
        margin-right: 20px;
        background: url("../../../assets/newUi/check_bg.png") no-repeat;
        background-size: 100% 100%;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #808EA9;
      }
  
      .active {
        background: url("../../../assets/newUi/check_active_bg.png") no-repeat;
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
  
        >div {
          width: 100%;
          height: 95%;
        }
      }
    }}
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
  