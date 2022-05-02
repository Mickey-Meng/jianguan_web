<!--
@name:
@description: 整改确认页面
@author: 王海林
@time: 2021-07-15 20:28:37
@modifier:
@modifierTime:
-->
<template>
  <div class="wrapper">
    <div class="header">整改确认列表</div>
    <el-table
      :data="tableData"
      style="width: 100%"
      class="bim-table"
      key="check"
      height="85%"
      border
    >
      <el-table-column label="质量照片" align="center">
        <template slot-scope="{ row }">
          <img-viewer :img-list="row.uploadurl"></img-viewer>
        </template>
      </el-table-column>
      <el-table-column label="整改照片" align="center">
        <template slot-scope="{ row }">
          <img-viewer :img-list="row.modifyurl"></img-viewer>
        </template>
      </el-table-column>
      <el-table-column
        prop="uploadremark"
        label="问题描述"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="{ row, $index }">
          <el-tooltip
            class="item"
            popper-class="tooltio-panel"
            :enterable="false"
            effect="dark"
            content="整改验收"
            placement="top"
          >
            <svg-icon
              icon-class="affirm"
              class="svg-btn"
              @click="showDialog(row, $index)"
            ></svg-icon>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="整改确认"
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
        <el-form-item label="审核状态" prop="result">
          <el-select
            v-model="form.result"
            placeholder="请选择审核状态"
            popper-class="select-panel"
          >
            <el-option
              v-for="item in status"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="
            form.result ? (form.result == 1 ? '备注' : '不通过原因') : '备注'
          "
          :prop="form.result == 2 ? 'reason' : ''"
        >
          <el-input
            type="text"
            v-model="form.reason"
            :placeholder="
              form.result
                ? form.result == 1
                  ? '请输入备注'
                  : '请输入不通过原因'
                : '请输入备注'
            "
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
  </div>
</template>

<script>
import * as api from "@/api/quality";
import { disposeUrl, validPicurl } from "@/utils/validate";

export default {
  name: "",
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      rowData: {},
      index: null,
      form: {
        result: 1,
        eventid: null,
        reason: "",
      },
      status: [
        {
          name: "通过",
          id: 1,
        },
        {
          name: "驳回",
          id: 2,
        },
      ],
      rules: {
        result: [
          { required: true, message: "请选择审核状态", trigger: "blur" },
        ],
        reason: [
          { required: true, message: "请输入不通过原因", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      api.getFinishQualityEvent().then((res) => {
        if (res.data && res.data.length > 0) {
          res.data.forEach((item) => {
            item.uploadurl = validPicurl(item.uploadurl);
            item.modifyurl = validPicurl(item.modifyurl);
          });
          this.tableData = res.data;
        }
      });
    },
    showDialog(row, index) {
      this.rowData = row;
      this.index = index;
      this.form = {
        result: 1,
        eventid: null,
        reason: "",
      };
      this.dialogVisible = true;
    },
    submitData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let obj = Object.assign({}, this.form);
          obj.eventid = this.rowData.id;
          api.disposeFinishQualityEvent(obj).then((res) => {
            this.dialogVisible = false;
            this.$message({
              message: "整改确认成功",
              type: "success",
              customClass: "message_override",
            });
            this.tableData.splice(this.index, 1);
          });
        }
      });
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
    background-color: #1e374b;
  }
}
</style>
