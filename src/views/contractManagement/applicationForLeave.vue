<!--
@name:
@description: 请假申请
@author: 王海林
@time: 2022-05-11 15:51:12
@modifier:
@modifierTime:
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.projectCode" placeholder="请输入请假人"></el-input>
        </div>

      </div>
      <div class="input-box">
        <div class="input-value">
          <el-date-picker
            v-model="queryData.subProject"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>
      <el-button type="primary">搜索</el-button>

      <div class="right-btns">
        <!-- <el-button type="primary" size="small"
          :icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
          @click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
        <div class="operate-btns">
          <el-button size="small" @click="openDialog">新增请假</el-button>
          <el-button size="small">导出</el-button>
          <!--          <el-button size="small">批量操作</el-button>-->
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="listData" style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="uploadname" label="请假人"></el-table-column>
          <el-table-column prop="uploadname" label="请假类型"></el-table-column>
          <el-table-column prop="uploadname" label="开始时间"></el-table-column>
          <el-table-column prop="uploadname" label="结束时间"></el-table-column>
          <el-table-column prop="uploadname" label="请假天数"></el-table-column>
          <el-table-column prop="uploadname" label="工作交接人"></el-table-column>
          <el-table-column prop="uploadname" label="请假原因"></el-table-column>
          <el-table-column prop="uploadname" label="备注"></el-table-column>
          <el-table-column prop="uploadname" label="状态"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="queryData.totalPage">
        </el-pagination>
      </div>
    </el-main>

    <!--    基本信息弹框-->
    <el-dialog class="full-dialog defined-dialog" :fullscreen="true" :visible.sync="dialogFormVisible">
      <template slot="title">
        {{ dialogTitle }}
      </template>
      <el-container class="full_dialog_container">
        <el-main style="height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
          <div class="form-bg">
            <el-form ref="form" :model="form" label-width="80px">
              <div class="form-title">
                <div class="title-big-bar"></div>
                <strong>请假申请</strong>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>基本信息</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">请假人</div>
                    <div class="block-item-value">
                      <!--                      {{ form.projectName }}-->
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">请假类型</div>
                    <div class="block-item-value">
                      <!--                      <el-input v-model="form.recorder" readonly></el-input>-->
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">请假时间</div>
                    <div class="block-item-value">
                      <el-date-picker
                        v-model="form.subDate"
                        type="datetime"
                        :clearable="false"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      >
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">请假天数</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        <el-input></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">工作交接人</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        <el-input></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">请假原因</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        <el-input></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">备注</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        <el-input></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>待处理人</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">施工经理<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-select v-model="form.qualityCheckUser" placeholder="请选择">
                          <el-option v-for="item in userOptions" :key="item.value"
                                     :label="item.label" :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block" v-if="isCreate">
                <el-button class="submit-btn" size="small" type="primary" @click="submitStaffInfo">提交
                </el-button>
              </div>
            </el-form>
          </div>
        </el-main>
        <el-aside width="8px" class="close-wrapper">
          <div class="close-wrap">
            <i class="el-icon-caret-right"></i>
          </div>
        </el-aside>
        <el-aside
          style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);"
        >
          <!--          <tasklog v-show="!isCreate"></tasklog>-->
        </el-aside>
      </el-container>

    </el-dialog>


  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {mapGetters} from "vuex";

  export default {
    name: "",
    data() {
      return {
        form: {},
        projectName: "",
        tableData: [],
        listData: [],
        userOptions: [],
        dialogFormVisible: false,
        dialogPersonVisible: false,//控制选择人的弹框
        queryData: {
          projectCode: "",
          subProject: "",
          pageNum: 1,
          totalPage: 1,
          pageSize: 10
        },
        isCreate: true,
        dialogTitle: "项目全生命周期数字管理平台"
      };
    },
    created() {
      this.projectName = this.project.name;
      this.form = {
        recorder: this.name,
        recordId: this.userInfo.ID,
        subDate: getNowDate(),//填报时间
        projectId: this.project.id,
        isContract: "1"
      };
    },
    computed: {
      ...mapGetters(["userInfo", "name", "project"])
    },
    methods: {
      addRow() {
        let obj = Object.assign({}, this.tableRowData);
        this.tableData.push(obj);
      },
      openDialog() {
        this.dialogFormVisible = true;
      },
      deleteInfo(index) {
        this.tableData.splice(index, 1);
      },
      handleSizeChange() {
      },
      handleCurrentChange() {
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../assets/css/table.scss";
  @import "../../assets/css/dialog.scss";
  .container-box{
    .el-header{
      display: flex;
      align-items: center;
      .input-value{
        .el-date-editor{
          display: flex;
          align-items: center;
          margin-right: 10px;
        }
      }
    }
  }

  .form-bg {
    width: 90% !important;

    .form-block {
      .el-date-editor {
        width: 100% !important;
      }
    }
  }


  .user_select {
    display: flex;
    align-items: center;

    i {
      font-size: 28px;
      cursor: pointer;
    }

    .name {
      font-size: 14px;
    }
  }

</style>
