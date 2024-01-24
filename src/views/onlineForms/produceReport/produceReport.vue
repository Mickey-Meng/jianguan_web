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

                <el-table-column label="附件" width="100px" align="center">
                  <template slot-scope="{ row }">
                    <svg-icon class="svg-class svg-btn" :class="row.status === 3
                      ? 'submit'
                      : row.status === 2
                        ? 'reject'
                        : row.status === 1
                          ? 'finish'
                          : 'error'
                      " icon-class="seeDetail" v-if="row.recordid" @click="seeFile(row)"></svg-icon>
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
            <!--        <el-cascader v-model="value" :options="options"></el-cascader>
            <el-table :data="recordsData" style="width: 100%" class="small_scrolling" key="check"
              v-if="currentView === 'record'" height="95%" border>
              <el-table-column prop="status" align="center" width="150px" label="审核状态" show-overflow-tooltip>
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
              <el-table-column prop="stime" label="完成时间" width="180px" align="center">
              </el-table-column>
            </el-table>
            -->
            <div class="table-content">
              <div class="header">
                <span>工区</span>
                <el-select v-model="areaId" @change="changeArea">
                  <el-option
                    v-for="item in area"
                    :key="item.sort"
                    :value="item.sort"
                    :label="item.name"
                  ></el-option>
                </el-select>
                <span>单位工程：</span>
                <el-select v-model="typeKey">
                  <el-option
                    v-for="item in typeArr"
                    :key="item.projectid"
                    :value="item.projectid"
                    :label="item.projectname"
                  ></el-option>
                </el-select>
                <!-- 
                <span>形象完成：</span>
                <el-date-picker
                  v-model="timeValue"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  @change="timeChange"
                />
                -->
                <span>构件编码：</span>
                <el-input v-model="paramData.code" placeholder="请输入构件编码" />
                <el-button class="active" @click="queryData">搜索</el-button>
              </div>
              <div class="table_contet">
                <el-table :data="tableRecordData" height="100%" class="have_scrolling" border ref="tableBox" style="width: 100%" >
                  <el-table-column
                    v-for="(value, index) in headerData"
                    :key="index + value.name"
                    :label="value.name"
                    align="center"
                  >
                    <template slot-scope="{ row }">
                      <svg-icon
                        v-if="dynamicData.includes(value.code)"
                        class="svg-class svg-btn"
                        :key="index + value.name"
                        :class=" row[value.code] ? 'finish' : 'error'"
                        icon-class="seeDetail"
                        @click="seeRecordFile(row, value)"
                      />
                      <span v-else>{{
                        row[value.code] === "null" ? "" : row[value.code]
                      }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>   
          </div>
        </div>
      </div>
      
      <el-drawer :visible.sync="drawerVisible" :with-header="false" custom-class="drawer-bottom-panel"
        append-to-body size="50%" :wrapperClosable="false" direction="btt">
        <el-container>
          <el-header>
            <div class="link-info">
              类型： <span>{{ processData ? processData.componentName : "" }}</span>
              编码： <span>{{ processData ? processData.componentCode : "" }}</span>
              工序名称： <span>{{ processData ? processData.name : "" }}</span>
            </div>
            <i class="el-icon-close" @click="drawerVisible = false"></i>
          </el-header>
          <el-main>
            <div class="tab-page">
              <el-tabs v-model="activeName">
                <el-tab-pane label="照片" name="first">
                  <el-container class="container-box">
                    <el-main>
                      <div class="container" style="width: 65%">
                        <attachlist :editAble="false" ref="attachlist" :attachTable="attachTable"></attachlist>
                      </div>
                    </el-main> 
                  </el-container>
                </el-tab-pane>
                <el-tab-pane label="表格" name="second">
                  <el-container class="container-box">
                    <el-main>
                      <div class="container">
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
                      </div>
                    </el-main>
                  </el-container>
                </el-tab-pane>
              </el-tabs>
            </div>
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
      <edit ref="edit" :editRow="submitDataInfo" @freshData = "getCheackDataById"></edit>
      <detail ref="detail" :editRow="submitDataInfo"></detail>
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
  import attachlist from "../../common/attachlist.vue"
  import { download } from "@/utils/download";
  import { getFillDataTemplate, saveFillDataTemplate, getReportRecord, getNewCheckViewTable, getRecordById } from "@/api/onlineForms";
  import { listProduceDocument, getProduceDocument } from "@/api/produceDocument";
  
  export default {
    name: "",
    components: { edit, detail, LeftTree, attachlist },
    data() {
      return {
        treeType:"onlineProduceReport",
        dynamicData: ["P0", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9", "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20"],
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/mong/upload",
        currentView: "fill", //record
        activeName: "first",
        attachTable: [],
        drawerVisible: false,
        isDraft: true,
        name: "",
        value: "",
        options: [],
        recordsData: [],
        tableData: [],
        tableRecordData: [],
        title: "",
        supervisor: [],
        processData: {},
        processRecordData: [],
        area: [], //工区数据
        areaId: null, //选中的工区
        typeArr: [], //项目数据
        timeValue: "",
        typeKey: "",
        pickerOptions: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
              },
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
              },
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit("pick", [start, end]);
              },
            },
          ],
        },
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
        templateListData: [],
        paramData:{
          code: "",
          endtime: "",
          gongquid: "",
          list: [],
          projectId: null,
          sttime: "",
          type: "",
          projectType: "QL"
        }
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
       /**api.getAllcheckData(2, this.project.id).then((res) => {
          this.recordsData = res.data;
        });
        getReportRecord(this.componentInfo.id).then((res) => {
          this.recordsData = res.data;
        });*/
        this.paramData.projectId = this.project.id;
        this.paramData.type = this.submitDataInfo.conponenttype;
        this.paramData.projectType = this.submitDataInfo.projectType;
        getNewCheckViewTable(this.paramData).then((res) => {
          if (res.data) {
            this.headerData = [];
            this.headerData = res.data.head.filter(function(item) {
              return item.code !== 'wbscode';
            });

            let lists = res.data.list;
            const dec = ["P0_status", "P1_status", "P2_status", "P3_status", "P4_status", "P5_status", "P6_status", "P7_status", "P8_status", "P9_status", "P10_status", "P11_status", "P12_status", "P13_status", "P14_status", "P15_status", "P16_status", "P17_status", "P18_status", "P19_status", "P20_status"]
            lists.forEach((item) => {
              const produceRecordDetails = item.produceRecordDetails;
              produceRecordDetails.forEach((detail, index) => {
                item[dec[index]] = detail.produceRangee.split("_")[1] || undefined;
                item[this.dynamicData[index]] = detail.produceRangee || undefined;
              })
            });
            this.tableRecordData = lists;
            this.rowdata = {};
            this.$nextTick(() => {
              //在数据加载完，重新渲染表格
              this.$refs["tableBox"].doLayout();
            });
          } else {
            this.tableRecordData = [];
            this.rowdata = {};
          }
        });     
      },
      queryData() {
        let { timeValue, paramData, typeKey } = this;
        if (timeValue) {
          paramData.sttime = timeValue[0];
          paramData.endtime = timeValue[1];
        } else {
          paramData.sttime = "";
          paramData.endtime = "";
        }
        paramData.list = [];
        if (typeKey && typeKey !== "all") {
          paramData.list.push(typeKey);
        }
        if (this.areaId === 95270) {
          paramData.gongquid = "";
        } else {
          paramData.gongquid = this.areaId;
        }
        this.getNewCheckViewTable(this.paramData);
      },
      cloumnWidth(value) {
        const arr = [0.2, 0.5, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0];
        if (arr.includes(value)) {
          return 200;
        } else if (value === 0.1) {
          return 80;
        } else {
          return 180;
        }
      },
      timeChange() {
      },
      changeArea(val) {
        this.typeKey = "";
        if (val === 95270) {
          this.typeArr = this.allProjectArr;
        } else {
          this.typeArr = this.allProjectArr.filter((e) => e.parentid === val);
        }
      },
      getCheackDataById() {
        api.getCheckData(this.componentInfo.id).then((res) => {
          let resComponent = res.data.data;
          let produceList = res.data.check;
          this.tableData = produceList.map(function(produceItem, index, produceList){
            produceItem.componentCode = resComponent.conponentcode;
            produceItem.componentName = resComponent.projectname;
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
      seeRecordFile(row, value) {
        console.log(1111111111);
        console.log(row);
        console.log(value);
        let recordids = row[value.code];
        if (recordids) {
          row.recordid = recordids.split("_")[0];          
          row.componentName = row.conponenttypename;
          row.componentCode = row.conponentcode;
          row.name = value.name;
          this.seeFile(row)
        } else {
          this.$message({
            message: "暂无附件信息",
            type: "warning",
            customClass: "message_override",
          });
        }
      },
      /**
       * @Description: 查看填报详情
       * @author wangharry
       * @param {}
       * @returns {}
       * @date 2021/7/16
       */
       seeFile(row) {
        this.processData = row;
        console.log(this.processData);
        this.drawerVisible = true;
        this.templateListData = [];
        let produceId = row.produceid;
        let componentId = row.conponentid;
        getRecordById(row.recordid).then((res) => {
          if (res.data.recode !== undefined) {
            this.attachTable = JSON.parse(res.data.recode.remark) || [];
          }
          let produceAndRecode = res.data.produceandrecode;
          if (produceId === undefined) {
            produceId = produceAndRecode.produceid;
            componentId = produceAndRecode.conponentid;
          }
          if (componentId === undefined) {
            componentId = produceAndRecode.conponentid;
          }
          console.log({documentType : 1, componentId : componentId, produceId : produceId});
          // 根据构建ID和工序ID查询待填写文档
          listProduceDocument({documentType : 1, componentId : componentId, produceId : produceId}).then((res) => {
            this.templateListData = res.rows;
          });
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
      width: 400px;
    }
    .table-content {
      background-color: #FFFFFF;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: calc(100% - 5px);
      margin-left: 5px;
      overflow: auto;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #4B5973;

      .header {
        display: flex;
        align-items: center;
        height: 50px;


        ::v-deep .el-select {
          width: 240px;
          height: 28px;
          line-height: 28px;
          margin: 0 10px;
          background-color: rgba(128, 142, 169, .14);
          .el-input__inner {
            background-color: transparent;
            border: none;
            height: 28px;
            line-height: 28px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #2D405E;
          }
          .el-input__suffix {
            .el-input__icon {
              line-height: 28px;
            }
          }
        }

        ::v-deep .el-date-editor {
          height: 28px;
          line-height: 28px;
          margin-right: 10px;
          text-align: center;
          font-family: PingFang SC;
          font-weight: 500;
          color: #2D405E;
          .el-range-separator {
            color: #2D405E;
            line-height: 28px;
            height: 28px;
          }
          .el-range-input {
            color: #2D405E;
          }
          .el-range__icon {
            height: 28px;
            line-height: 28px;
          }
        }
        ::v-deep .el-input__inner {
          //background-image: url(../../assets/image/日期选择.png);
          background-color: rgba(128, 142, 169, .14);
          border: none;
          height: 28px;
          input {
            background-color: transparent;
          }
        }
        .el-input {
          width: 150px;
          margin-right: 5px;
        }

        .el-button {
          width: 64px;
          height: 28px;
          background: #4f71ff;
          border-radius: 2px;
          border: none;
          color: #fff;
          padding: 5px;
        }
      }
      .table_contet {
        height: calc(100% - 50px);
      }
      .svg-icon {
        color: #8f9c07;
      }
      .submit {
        color: #4f71ff !important;
      }
      .finish {
        color: #0dfa72 !important;
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
    }
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
  