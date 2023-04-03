<template>
  <div class="wrapper">
<!--    <div class="header">质量检查</div>-->
    <div class="nav">
      <div
        :class="{ active: currentView === 'check' }"
        @click="changeView('check')"
      >
        质量检查
      </div>
      <div
        :class="{ active: currentView === 'delay' }"
        @click="changeView('delay')"
      >
        申请延期确认
      </div>
      <!-- <div
        :class="{ active: currentView === 'record' }"
        @click="changeView('record')"
      >
        检查记录
      </div> -->
    </div>
    <div class="main" v-if="currentView === 'check'">
      <el-form
        ref="form"
        size="small"
        class="bim-form-panel"
        label-position="right"
        label-width="120px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="质量大类">
          <el-select
            v-model="form.qualityfirst"
            clearable
            placeholder="请选择质量大类"
            @change="bigChange"
          >
            <el-option
              v-for="item in bigQualityData"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="质量小类" prop="qualitysecond">
          <el-select
            v-model="form.qualitysecond"
            clearable
            placeholder="请选择质量小类"
          >
            <el-option
              v-for="item in smallQualityData"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查日期" prop="uploadtime">
          <el-date-picker
            v-model="form.uploadtime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input
            v-model="form.uploadremark"
            type="textarea"
            placeholder="请输入问题描述，最多300字！"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="照片" prop="uploadurl">
          <el-upload
            class="upload-demo"
            :headers="header"
            :action="uploadUrl"
            multiple
            :limit="3"
            :on-success="uploadSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="工区" prop="gongquid">
          <el-select
            v-model="form.gongquid"
            clearable
            placeholder="请选择工区"
            @change="changeArea"
          >
            <el-option
              v-for="item in areaData"
              :key="item.sort"
              :value="item.sort"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单位工程" prop="singleProjectId">
          <el-select
            v-model="form.singleProjectId"
            clearable
            placeholder="请选择项目"
          >
            <el-option
              v-for="item in projectData"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="modifyid">
          <el-select
            v-model="form.modifyid"
            filterable
            clearable
            placeholder="请选择工区负责人"
          >
            <el-option
              v-for="item in functionary"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="整改期限">
          <el-input-number
            v-model="form.modifydate"
            controls-position="right"
            :min="1"
            :max="30"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button plain size="mini" class="btn-bg" @click="submitData"
          >提交</el-button
        >
      </div>
    </div>
    <div class="main" v-if="currentView === 'delay'">
      <el-table
        key="delay"
        :data="delayData"
        style="width: 100%"
        height="98%"
        border
      >
        <el-table-column
          prop="delayday"
          label="延期天数"
          align="center"
          width="80"
        />
        <el-table-column
          prop="delayreason"
          label="延期原因"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="80" align="center">
          <template slot-scope="{ row }">
            <el-tooltip
              class="item"
              popper-class="tooltio-panel"
              :enterable="false"
              effect="dark"
              content="允许延期"
              placement="top"
            >
              <svg-icon
                icon-class="affirm"
                class="svg-btn"
                @click="allowDelay(row)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              popper-class="tooltio-panel"
              :enterable="false"
              effect="dark"
              content="拒绝延期"
              placement="top"
            >
              <svg-icon
                icon-class="reject"
                class="svg-btn"
                @click="rejectDelay(row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="main" v-if="currentView === 'record'">
      <el-table
        key="record"
        :data="recordData"
        style="width: 100%"
        class="bim-table"
        height="98%"
        border
      >
        <el-table-column
          prop="delayday"
          label="责任人"
          align="center"
          width="80"
        />
        <el-table-column
          prop="delayreason"
          label="整改期限"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="delayreason"
          label="延期天数"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="delayreason"
          label="状态"
          align="center"
          show-overflow-tooltip
        />
      </el-table> -->
    <!-- </div> -->
    <el-dialog
      title="质量事件延期处理"
      :visible.sync="dialogVisible"
      custom-class="dialog-panel"
      :append-to-body="true"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        ref="delayForm"
        size="small"
        label-position="right"
        label-width="120px"
        class="form-panel"
        :model="delayForm"
        :rules="delayRules"
      >
        <el-form-item label="拒绝原因" prop="reason">
          <el-input v-model="delayForm.reason" placeholder="请输入拒绝原因" />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button plain size="mini" class="btn-bg" @click="rejctEvent"
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
</template>

<script>
  import * as api from "@/api/quality";
  import {getToken} from "@/utils/auth";
  import {mapGetters} from "vuex";
  import {disposeUrl} from "@/utils/validate";
  import {
    getWorkArea,
    getAreaByAuthority,
    getCheckerByAreaId
  } from "@/api/workArea";

  import {getAreaBySectionId, getConstructionWorkersBySectionId} from "@/api/newProject";

  export default {
    name: "",
    data() {
      return {
        value: "",
        header: {token: ""}, // 文件上传带token
        inputValue: "",
        currentView: "check", //record，delay
        functionary: [], //工区负责人
      fileList: [], //上传的文件
      bigQualityData: [], //安全大类数据
      smallQualityData: [], //安全小类数据
      delayData: [], //延期申请数据
      recordData: [], //当前监理提交的检查记录
      areaData: [], //工区数据
      projectData: [], //工区下的项目数据
      dialogVisible: false,
      form: {
        modifydate: 3,
      },
      options: [],
      tableData: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      rules: {
        qualitysecond: [
          { required: true, message: "请选择质量小类", trigger: "blur" },
        ],
        uploadtime: [
          { required: true, message: "请选择检查日期", trigger: "blur" },
        ],
        modifyid: [
          { required: true, message: "请选择工区负责人", trigger: "blur" },
        ],
        singleProjectId: [{ required: true, message: "请选择项目", trigger: "blur" }],
      },
      recordsData: [],
      delayForm: {}, //延期表单
      delayRules: {
        reason: [
          { required: true, message: "请输入拒绝原因", trigger: "blur" },
        ],
      },
      rowData: {}, //延期行数据
    };
  },
  computed: {
    ...mapGetters(["userInfo", "uploadUrl", "project"])
  },
  created() {
    this.initData();
  },
  methods: {
    changeView(val) {
      if (this.currentView !== val) {
        this.currentView = val;
        if (val === "delay") {
          this.getDelayData();
        }
      }
    },
    initData() {
      this.header.token = getToken("zj_token");
      //获取大类数据
      api.getQualityBigSmallData().then((res) => {
        this.bigQualityData = res.data || [];
      });
      //根据标段ID查询工区数据
      getAreaBySectionId(this.project.id).then((res) => {
        this.areaData = res.data || [];
      });
    },
    changeArea(val) {
      this.projectData = [];
      this.functionary = [];
      this.$set(this.form, "singleProjectId", null);
      this.$set(this.form, "modifyid", null);
      getWorkArea(val).then((res) => {
        //获取工区下的项目
        this.projectData = res.data || [];
      });
      //获取工区下的施工
      getConstructionWorkersBySectionId(this.project.id, val).then(res => {
        this.functionary = res.data;
      });
    },
    getDelayData() {
      //获取延期申请数据
      api.getDelayEvent(this.project.id).then((res) => {
        this.delayData = res.data;
      });
    },
    bigChange(val) {
      //质量大项变化的回调
      this.$set(this.form, "qualitysecond", null);
      api.getQualityBigSmallData(val).then((res) => {
        this.smallQualityData = res.data;
      });
    },
    uploadSuccess(response, file, fileList) {
      //文件上传成功的回调
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      //删除文件的回调
      this.fileList = fileList;
    },
    submitData() {
      if (this.fileList.length === 0) {
        this.$message({
          message: "请上传照片",
          type: "warning",
          customClass: "message_override",
        });
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const obj = Object.assign({}, this.form);
          const user = this.functionary.find((e) => e.id === obj.modifyid); //查找工区负责人
          const big = this.bigQualityData.find(
            (e) => e.id === obj.qualityfirst
          ); //查找大类
          const small = this.smallQualityData.find(
            (e) => e.id === obj.qualitysecond
          );
          obj.uploadurl = disposeUrl(this.fileList);
          obj.uploadname = this.userInfo.name;
          obj.modifyname = user.name;
          obj.uploadid = this.userInfo.ID;
          obj.qualityfirstname = big.name;
          obj.qualitysecondname = small.name;
          obj.projectId = this.project.id;
          api.addQuality(obj).then((res) => {
            this.form = {
              modifydate: 3,
            };
            this.fileList = [];
            this.$message({
              message: "上报成功",
              type: "success",
              customClass: "message_override",
            });
          });
        }
      });
    },
    allowDelay(row) {
      this.$confirm("确认允许延期?", "允许延期", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      }).then(() => {
        const obj = {
          eventid: row.id,
          result: 1,
        };
        api.disposeDelay(obj).then((res) => {
          this.$message({
            message: "允许延期成功",
            type: "success",
            customClass: "message_override",
          });
          this.getDelayData();
        });
      });
    },
    rejectDelay(row) {
      this.rowData = Object.assign({}, row);
      this.delayForm = {};
      this.dialogVisible = true;
    },
    rejctEvent() {
      this.$refs["delayForm"].validate((valid) => {
        if (valid) {
          const obj = Object.assign({}, this.delayForm);
          obj.eventid = this.rowData.id;
          obj.result = 2;
          api.disposeDelay(obj).then((res) => {
            this.dialogVisible = false;
            this.$message({
              message: "拒绝延期成功",
              type: "success",
              customClass: "message_override",
            });
            this.getDelayData();
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  //padding: 20px;
  .main {
    height: calc(100% - 101px);
    .bim-form-panel {
      .el-form-item {
        padding: 8px 5px 10px 0;
        border-bottom: 1px solid #c2c4c9;
        margin: 0;
      }
    }
  }

  .nav {
    display: flex;
    //margin-bottom: 20px;
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

  // .select-search {
  //   border-bottom: 1px solid #203c56;

  //   ::v-deep .el-cascader {
  //     width: 100%;

  //     .el-input {
  //       .el-input__inner {
  //         background-color: transparent;
  //         border: none;
  //       }
  //     }
  //   }
  // }

  // .input-search {
  //   border-bottom: 1px solid #203c56;

  //   ::v-deep .input-with-select {
  //     .el-input__inner {
  //       background-color: transparent;
  //       border: none;
  //     }

  //     .el-input-group__append {
  //       background-color: transparent;
  //       border: none;
  //       color: #ffffff;
  //       border-left: 1px solid #203c56;
  //     }
  //   }
  // }
  // .footer {
  //   height: 30px;
  // }
}
</style>
