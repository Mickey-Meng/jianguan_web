<template>
  <div class="wrapper">
<!--    <div class="header">安全检查</div>-->
    <div class="nav">
      <div
        :class="{ active: currentView === 'check' }"
        @click="changeView('check')"
      >
        安全检查
      </div>
      <div
        :class="{ active: currentView === 'postpone' }"
        @click="changeView('postpone')"
      >
        申请延期确认
      </div>
    </div>
    <div v-if="currentView === 'check'" class="main">
      <el-form
        ref="form"
        size="small"
        class="bim-form-panel"
        label-position="right"
        label-width="120px"
        :model="safeForm"
        :rules="rules"
      >
        <el-form-item label="问题大类">
          <el-select
            v-model="safeForm.safefirst"
            clearable
            placeholder="请选择安全大类"
            @change="bigChange"
          >
            <el-option
              v-for="item in bigSafeData"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="问题小类" prop="safesecond">
          <el-select
            v-model="safeForm.safesecond"
            clearable
            placeholder="请选择安全小类"
          >
            <el-option
              v-for="item in smallSafeData"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检查日期" prop="uploadtime">
          <el-date-picker
            v-model="safeForm.uploadtime"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input
            v-model="safeForm.uploadremark"
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
            v-model="safeForm.gongquid"
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
        <el-form-item label="项目" prop="projectid">
          <el-select
            v-model="safeForm.projectid"
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
            v-model="safeForm.modifyid"
            clearable
            filterable
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
            v-model="safeForm.modifydate"
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
    <div v-if="currentView === 'postpone'" class="main">
      <el-table
        key="check"
        :data="delayData"
        style="width: 100%"
        height="100%"
        border
      >
        <el-table-column prop="delayday" label="延期天数" align="center" />
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
    <el-dialog
      title="安全事件延期处理"
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
import * as api from "@/api/safe";
import { getToken } from "@/utils/auth";
import { mapGetters } from "vuex";
import { disposeUrl } from "@/utils/validate";
import {
  getWorkArea,
  getAreaByAuthority,
  getCheckerByAreaId,
} from "@/api/workArea";

export default {
  name: "",
  data() {
    return {
      currentView: "check",
      safeForm: {
        modifydate: 3,
      },
      dialogVisible: false,
      header: { token: "" }, // 文件上传带token
      bigSafeData: [], // 安全大类数据
      smallSafeData: [], // 安全小类数据
      functionary: [], // 工区责任人
      areaData: [], //工区数据
      projectData: [], //工区下的项目数据
      fileList: [],
      delayData: [],
      rowData: {},
      delayForm: {},
      rules: {
        safesecond: [
          { required: true, message: "请选择问题小类", trigger: "blur" },
        ],
        uploadtime: [
          { required: true, message: "请选择检查日期", trigger: "blur" },
        ],
        modifyid: [
          { required: true, message: "请选择工区负责人", trigger: "blur" },
        ],
        projectid: [{ required: true, message: "请选择项目", trigger: "blur" }],
      },
      delayRules: {
        reason: [
          { required: true, message: "请输入拒绝原因", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo", "uploadUrl"]),
  },
  created() {
    this.initData();
  },
  methods: {
    changeView(val) {
      if (this.currentView !== val) {
        this.currentView = val;
        if (val === "postpone") {
          this.getPostponeData();
        }
      }
    },
    initData() {
      this.header.token = getToken("zj_token");
      api.getBigSmallSafeData().then((res) => {
        this.bigSafeData = res.data;
      });
      // api.getcheck().then((res) => {
      //   this.functionary = res.data;
      // });
      getAreaByAuthority().then((res) => {
        this.areaData = res.data || [];
      });
    },
    changeArea(val) {
      this.projectData = [];
      this.functionary = [];
      this.$set(this.safeForm, "projectid", null);
      this.$set(this.safeForm, "modifyid", null);
      getWorkArea(val).then((res) => {
        //获取工区下的项目
        this.projectData = res.data || [];
      });
      //获取工区下的施工
      getCheckerByAreaId(val).then((res) => {
        this.functionary = res.data;
      });
    },
    getPostponeData() {
      api.getDelaySafeEvent().then((res) => {
        this.delayData = res.data;
      });
    },
    bigChange(val) {
      this.$set(this.safeForm, "safesecond", null);
      api.getSmallSafeData(val).then((res) => {
        this.smallSafeData = res.data;
      });
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
          const obj = Object.assign({}, this.safeForm);
          const user = this.functionary.find((e) => e.id === obj.modifyid);
          const big = this.bigSafeData.find((e) => e.id === obj.safefirst);
          const small = this.smallSafeData.find((e) => e.id === obj.safesecond);
          obj.uploadurl = disposeUrl(this.fileList);
          obj.uploadname = this.userInfo.name;
          obj.modifyname = user.name;
          obj.uploadid = this.userInfo.ID;
          // obj.gongquid = user.gongquid;
          obj.safefirstname = big.name;
          obj.safesecondname = small.name;
          api.submitSafeData(obj).then((res) => {
            this.safeForm = {
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
        api.doDelaySafeEvent(obj).then((res) => {
          this.$message({
            message: "允许延期成功",
            type: "success",
            customClass: "message_override",
          });
          this.getPostponeData();
        });
      });
    },
    rejectDelay(row) {
      this.rowData = row;
      this.delayForm = {};
      this.dialogVisible = true;
    },
    rejctEvent() {
      this.$refs["delayForm"].validate((valid) => {
        if (valid) {
          const obj = Object.assign({}, this.delayForm);
          obj.eventid = this.rowData.id;
          obj.result = 2;
          api.doDelaySafeEvent(obj).then((res) => {
            this.dialogVisible = false;
            this.$message({
              message: "拒绝延期成功",
              type: "success",
              customClass: "message_override",
            });
            this.getPostponeData();
          });
        }
      });
    },
    uploadSuccess(response, file, fileList) {
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  border: 1px solid #fff;
  //.header {
  //  text-indent: 2em;
  //  line-height: 50px;
  //  height: 50px;
  //  background-color: #1e374b;
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

  .main {
    height: calc(100% - 100px);
    .bim-form-panel {
      .el-form-item {
        padding: 8px 5px 10px 0;
        border-bottom: 1px solid #c2c4c9;
        margin: 0;
      }
    }
  }
}
</style>
