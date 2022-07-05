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
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="{row}">
              {{ row.gender === 1 ? "男" : "女" }}
            </template>
          </el-table-column>
          <el-table-column prop="post" label="岗位"></el-table-column>
          <el-table-column prop="identityId" label="身份证号"></el-table-column>
          <el-table-column prop="certificateName" label="证件名称"></el-table-column>
          <el-table-column prop="approvalTime" label="进场时间"></el-table-column>
          <el-table-column label="退场时间"></el-table-column>
          <el-table-column label="脸部照片">
            <template slot-scope="{row}">
              <img-viewer :img-list="[row.newPeoplePic]" v-if="row.peoplePic"></img-viewer>
              <span v-else>未上传</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{row}">
              <span>进场</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="text" size="mini" @click="seeDetail(row)">详情</el-button>
              <el-button type="text" size="mini" >退场</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="queryData.pageNum"
        	:page-size="queryData.pageSize" layout="total, prev, pager, next, jumper"
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
                <strong>详情</strong>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>基本信息</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">姓名</div>
                    <div class="block-item-value">
                      {{ form.name }}
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">身份证号</div>
                    <div class="block-item-value">
                      {{ form.identityId }}
                      <!--                      <el-input v-model="form.recorder" readonly></el-input>-->
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">有效期</div>
                    <div class="block-item-value">
                      {{ form.identityTime }}
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">性别</div>
                    <div class="block-item-value">
                        {{ form.gender == 1 ? "男" : "女" }}
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">岗位</div>
                    <div class="block-item-value">
                      {{ form.post }}
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">证件名称
                    </div>
                    <div class="block-item-value">
                      {{ form.certificateName }}
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">证件编号</div>
                    <div class="block-item-value">
                      {{ form.certificateCode }}
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">发证单位
                    </div>
                    <div class="block-item-value">
                      {{ form.issuer }}
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">有效期</div>
                    <div class="block-item-value">
                      {{ form.effectiveTime }}
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">文化程度
                    </div>
                    <div class="block-item-value">
                      {{ form.education }}
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">人脸识别</div>
                    <div class="block-item-value">
                      <img :src="form.newPeoplePic" alt="" v-if="form.peoplePic" style="width: 100px;height: 100px">
                      <span v-else>未上传</span>
                    </div>
                  </div>
                </div>
              </div>

            </el-form>
          </div>
        </el-main>
        <!--        <el-aside width="8px" class="close-wrapper">-->
        <!--          <div class="close-wrap">-->
        <!--            <i class="el-icon-caret-right"></i>-->
        <!--          </div>-->
        <!--        </el-aside>-->
        <!--        <el-aside-->
        <!--          style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">-->
        <!--          <tasklog  :taskInfo="taskInfo" ref="tasklog"></tasklog>-->
        <!--        </el-aside>-->
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
          let lists = [];
          let data = res?.data || [];
          if (data && data.length > 0) {
            data.forEach(item => {
              let {person, personSubs} = item;
              let {approvalTime} = person;
              personSubs.forEach(e => {
                e.approvalTime = approvalTime;
                e.newPeoplePic = "/ZhuJiRoad/mong/preview?fileid=" + e.peoplePic;
              });
              lists = lists.concat(personSubs);
            });
            this.tableData = lists;
            console.log(lists, 99);
          } else {
            this.tableData = [];
          }
        });
      },
      seeDetail(row) {
        this.form = Object.assign({}, row);
        console.log(this.form);
        this.dialogFormVisible = true;

      },
      handleCurrentChange(page) {
      	this.queryData.pageNum=page
      	this.query()
      },
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
    width: 60% !important;

    .form-block {
      .el-date-editor {
        width: 100% !important;
      }
    }
  }

  ::v-deep.full-dialog .el-dialog__headerbtn{
    background: #FFFFFF;
  }


</style>
