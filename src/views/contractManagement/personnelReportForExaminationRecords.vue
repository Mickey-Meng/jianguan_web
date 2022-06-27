<!--
@name:
@description: 人员报审记录
@author: 王海林
@time: 2022-05-13 15:41:03
@modifier:
@modifierTime:
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.projectCode" placeholder="请输入标段"></el-input>
        </div>

      </div>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.subProject" placeholder="请输入记录人"></el-input>
        </div>
      </div>
      <el-button type="primary">搜索</el-button>

      <div class="right-btns">
        <!-- <el-button type="primary" size="small"
          :icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
          @click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
        <div class="operate-btns">
          <!--        <el-button size="small" @click="openDialog">新增填报</el-button>-->
          <el-button size="small">导出</el-button>
          <el-button size="small">批量操作</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table border :data="tableData" style="width: 100%" height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="projectName" label="标段"></el-table-column>
          <el-table-column prop="recorder" label="记录人"></el-table-column>
          <el-table-column prop="subDate" label="填报时间"></el-table-column>
          <el-table-column label="人员类型">
            <template slot-scope="{row}">
              {{ row.isContract == 1 ? "合同人员" : "非合同人员" }}
            </template>
          </el-table-column>
          <el-table-column label="是否自管">
            <template slot-scope="{row}">
              {{ project.isauto === 1 ? "自管" : "非自管" }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <span>{{ row.status === 2 ? "审核完成" : "审核中" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="text" size="mini" @click="seeDetail(row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="queryData.totalPage">
        </el-pagination>
      </div>

    </el-main>
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
                <strong>人员填报</strong>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>基本信息</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">标段</div>
                    <div class="block-item-value">
                      {{ form.projectName }}
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">记录人</div>
                    <div class="block-item-value">
                      <el-input v-model="form.recorder" readonly></el-input>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">报审日期</div>
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
                    <div class="block-item-label">人员类型</div>
                    <div class="block-item-value">
                      <el-form-item prop="projectChargeUser">
                        {{ form.isContract == 1 ? "合同人员" : "非合同人员" }}
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">是否自管</div>
                    <div class="block-item-value">
                      {{ project.isauto === 1 ? "自管" : "非自管" }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>报审信息</strong>
                </div>
                <div class="block-table">
                  <el-table
                    :data="listsData"
                    border
                    class="have_scrolling"
                    style="width: 100%">
                    <el-table-column
                      label="姓名"
                      prop="name"
                      width="160">
                    </el-table-column>

                    <el-table-column
                      label="身份证号"
                      width="220"
                      prop="identityId">
                    </el-table-column>
                    <el-table-column
                      label="有效期"
                      width="320"
                      prop="identityTime">
                    </el-table-column>
                    <el-table-column
                      label="性别"
                      width="120">
                      <template slot-scope="{row}">
                        {{ row.gender == 1 ? "男" : "女" }}

                      </template>
                    </el-table-column>
                    <el-table-column
                      label="岗位"
                      width="150"
                      prop="post">
                    </el-table-column>
                    <el-table-column
                      label="证件名称"
                      width="250"
                      prop="certificateName">
                    </el-table-column>
                    <el-table-column
                      label="证件编号"
                      width="250"
                      prop="certificateCode">
                    </el-table-column>
                    <el-table-column
                      label="发证单位"
                      width="250"
                      prop="issuer">
                    </el-table-column>
                    <el-table-column
                      label="有效期"
                      width="320"
                      prop="effectiveTime">

                    </el-table-column>
                    <el-table-column
                      label="文化程度"
                      width="120"
                      prop="education">
                    </el-table-column>
                    <el-table-column
                      label="脸部照片"
                      width="120"
                      align="center">
                      <template slot-scope="{row}">
                        <img-viewer :img-list="[row.peoplePic]"></img-viewer>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
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
          style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
          <tasklog  :taskInfo="taskInfo" ref="tasklog"></tasklog>
        </el-aside>
      </el-container>

    </el-dialog>
  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {mapGetters} from "vuex";
  import {getStaffRecordsById} from "@/api/staffApproval";
  import tasklog from "@/views/common/tasklog";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        tableData: [],
        listsData: [],
        form: {
          time: getNowDate(),
          userName: "",
          isContract: true,
          autogestion: true
        },
        dialogTitle: "项目全生命周期数字管理平台",
        dialogFormVisible: false,
        taskInfo:{},
        queryData: {
          projectCode: "",
          subProject: "",
          pageNum: 1,
          totalPage: 1,
          pageSize: 10
        }
      };
    },
    created() {
      this.init();
    },
    computed: {
      ...mapGetters(["project"])
    },
    mounted() {
    },
    methods: {
      init() {
        getStaffRecordsById(this.project.id).then(res => {
          let data = res?.data || [];
          if (data && data.length > 0) {
            this.tableData = data.map(item => {
              let obj = Object.assign(item, item.person);
              return obj;
            });
          } else {
            this.tableData = [];
          }
        });
      },
      seeDetail(row) {
        this.form = Object.assign({}, row.person);
        let data = row.personSubs;
        if (data && data.length > 0) {
          this.listsData = data.map(item => {
            if (item.peoplePic) {
              item.peoplePic = "/ZhuJiRoad/mong/preview?fileid=" + item.peoplePic;
            }
            return item;
          });
        }
        this.isCreate = false;
        let {maps} = row;
        let {processDefinitionId, processInstanceId, taskId} = maps;
        if (processDefinitionId && processInstanceId && taskId) {
          this.taskInfo = {
            processDefinitionId, processInstanceId, taskId
          };
        } else {
          this.taskInfo = {};
        }
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["tasklog"].initData();
        });
      },
      handleSizeChange() {
      },
      handleCurrentChange() {
      }
    },
    components: {tasklog},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  @import "../../assets/css/table.scss";
  @import "../../assets/css/dialog.scss";

  .form-bg {
    width: 80% !important;

    .form-block {
      .el-date-editor {
        width: 100% !important;
      }
    }
  }


</style>
