<template>
  <div class="wrapper">
    <div class="header">待整改事件</div>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="small_scrolling"
      ref="table_data"
      key="check"
      height="90%"
      border
    >
      <el-table-column label="事件照片" align="center">
        <template slot-scope="{ row }">
          <img-viewer :img-list="row.uploadurl"></img-viewer>
        </template>
      </el-table-column>
      <el-table-column prop="modifydate" label="期限(天)" align="center">
      </el-table-column>
      <el-table-column
        label="是否逾期"
        align="center"
        prop="isOverdueText"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="uploadremark"
        label="问题描述"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="dodelayreason"
        label="驳回意见"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template slot-scope="{ row }">
          <el-tooltip
            class="item"
            popper-class="tooltio-panel"
            :enterable="false"
            effect="dark"
            content="确认整改"
            placement="top"
            v-if="row.role"
          >
            <svg-icon
              icon-class="affirm"
              class="svg-btn"
              @click="showDialog(row)"
            ></svg-icon>
          </el-tooltip>
          <el-tooltip
            class="item"
            popper-class="tooltio-panel"
            :enterable="false"
            effect="dark"
            content="申请延期"
            placement="top"
            v-if="row.role"
          >
            <svg-icon
              icon-class="postpone"
              class="svg-btn"
              @click="ShowDialog(row)"
            ></svg-icon>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="安全事件确认整改"
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
        class="form-panel"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="整改时间" prop="modifydate">
          <el-date-picker
            v-model="form.modifydate"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择整改时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="整改图片">
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
        <el-form-item label="整改备注">
          <el-input
            v-model="form.modifyremark"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
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
      title="申请延期"
      :visible.sync="DialogVisible"
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
        <el-form-item label="延期天数" prop="delay">
          <el-input
            v-model="delayForm.delay"
            placeholder="请输入延期天数"
          ></el-input>
        </el-form-item>

        <el-form-item label="延期原因">
          <el-input
            v-model="delayForm.reason"
            placeholder="请输入延期原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button plain size="mini" class="btn-bg" @click="submitDelayData"
          >提交</el-button
        >
        <el-button
          plain
          size="mini"
          class="btn-bg"
          @click="DialogVisible = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as api from "@/api/safe";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
import { validPicurl, disposeUrl } from "@/utils/validate";
import { addAnyDays, getNowDate, diffDay } from "@/utils/date";

export default {
  name: "",
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      DialogVisible: false,
      header: { token: "" },
      fileList: [],
      form: {},
      delayForm: {},
      rowData: {},
      rules: {
        modifydate: [
          { required: true, message: "请选择整改时间", trigger: "blur" },
        ],
      },
      delayRules: {
        delay: [{ required: true, message: "请输入延期天数", trigger: "blur" }],
        reason: [
          { required: true, message: "请输入延期原因", trigger: "blur" },
        ],
      },
      dom: null,
    };
  },
  created() {
    this.initData();
  },
  computed: {
    ...mapGetters(["userInfo", "lookUrl", "uploadUrl","project"]),
  },
  methods: {
    initData() {
      this.header.token = getToken("zj_token");
      api.getSafeEvent(this.project.id).then((res) => {
        let { role, data } = res.data;
        if (data && data.length > 0) {
          let arr = data.map((item) => {
            let { zjSafeEvent, isOverdue, overdueTime } = item;
            let obj = Object.assign({}, zjSafeEvent);
            obj.isOverdue = isOverdue;
            obj.isOverdueText = isOverdue ? "逾期" : "未逾期";
            obj.overdueTime = overdueTime;
            obj.role = role;
            obj.uploadurl = validPicurl(obj.uploadurl);
            if (!obj.delayday) {
              obj.delayday = 0;
            }
            let deadline = addAnyDays(obj.delayday, overdueTime);
            let nowtime = getNowDate();
            let num = diffDay(deadline, nowtime);
            if (num > 0) {
              obj.modifydate = num;
            } else {
              obj.modifydate = 0;
              obj.overTime = Math.abs(num);
              obj.isOverdueText = "逾期" + Math.abs(num) + "天";
            }

            return obj;
          });
          this.tableData = arr;
        } else {
          this.tableData = [];
        }
      });
    },
    showDialog(row) {
      this.fileList = [];
      this.dialogVisible = true;
      this.form = {};
      this.rowData = row;
    },
    submitData() {
      if (this.fileList.length === 0) {
        this.$message({
          message: "请上传整改照片",
          type: "warning",
          customClass: "message_override",
        });
        return;
      }
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let obj = Object.assign({}, this.form);
          obj.eventid = this.rowData.id;
          obj.modifyurl = disposeUrl(this.fileList);
          api.submitDealWithSafeEvent(obj).then((res) => {
            this.fileList = [];
            this.dialogVisible = false;
            this.$message({
              message: "整改确认上报成功",
              type: "success",
              customClass: "message_override",
            });
            this.initData();
          });
        }
      });
    },
    ShowDialog(row) {
      this.delayForm = {};
      this.DialogVisible = true;
      this.rowData = row;
    },
    submitDelayData() {
      this.$refs["delayForm"].validate((valid) => {
        if (valid) {
          let obj = Object.assign({}, this.delayForm);
          obj.eventid = this.rowData.id;
          api.submitDelaySafeEvent(obj).then((res) => {
            this.DialogVisible = false;
            this.$message({
              message: "申请延期上报成功",
              type: "success",
              customClass: "message_override",
            });
            this.initData();
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
  .header {
    text-indent: 2em;
    line-height: 50px;
    height: 50px;
    //background-color: #1e374b;
  }
}
</style>
