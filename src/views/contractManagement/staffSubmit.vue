<!--
 * @Descripttion: 人员填报
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 10:03:01
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 14:04:52
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
          <el-button size="small" @click="openDialog">新增填报</el-button>
          <el-button size="small">导出</el-button>
          <el-button size="small">批量操作</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="listData" style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="uploadname" label="标段"></el-table-column>
          <el-table-column prop="uploadname" label="记录人"></el-table-column>
          <el-table-column prop="uploadname" label="填报时间"></el-table-column>
          <el-table-column prop="uploadname" label="人员类型"></el-table-column>
          <el-table-column prop="uploadname" label="是否自管"></el-table-column>
          <el-table-column prop="uploadname" label="状态"></el-table-column>
          <el-table-column prop="uploadname" label="操作"></el-table-column>
        </el-table>
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
                    <!--                    <div class="form-btns">-->
                    <!--                      <el-button size="medium">暂存</el-button>-->
                    <!--                      <el-button size="medium">保存草稿</el-button>-->
                    <!--                      <el-button size="medium">选择草稿</el-button>-->
                    <!--                      <el-button size="medium" type="primary">复制填充</el-button>-->
                    <!--                    </div>-->
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
                          {{ projectName }}
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
                            <el-select v-model="form.isContract" placeholder="请选择">
                              <el-option label="合同人员" value="1"></el-option>
                              <el-option label="非合同人员" value="0"></el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                    </div>
                    <div class="block-line">
                      <div class="block-item">
                        <div class="block-item-label">是否自管</div>
                        <div class="block-item-value">
                          自管
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-block">
                    <div class="form-block-title">
                      <div class="title-bar"></div>
                      <strong>报审信息</strong>
                    </div>
                    <div class="block-line">
                      <el-button size="small" type="primary" @click="addRow">添加行</el-button>
                    </div>
                    <div class="block-table">
                      <el-table
                        :data="tableData"
                        border
                        class="have_scrolling"
                        style="width: 100%">
                        <el-table-column
                          label="姓名"
                          width="160">
                          <template slot-scope="{row}">
                            <div class="user_select">
                              <el-select v-model="row.name" filterable placeholder="请选择人员">
                                <el-option
                                  v-for="item in allUsers"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                              </el-select>
                            </div>
                          </template>
                        </el-table-column>

                        <el-table-column
                          label="身份证号"
                          width="220">
                          <template slot-scope="{row}">
                            <el-input v-model="row.identityId" placeholder="请输入身份证号"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="有效期"
                          width="320">
                          <template slot-scope="{row}">
                            <el-date-picker
                              v-model="row.identityTime"
                              type="daterange"
                              value-format="yyyy-MM-dd"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
                            </el-date-picker>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="性别"
                          width="120">
                          <template slot-scope="{row}">
                            <!--                            <el-input v-model="row.name"></el-input>-->
                            <el-select v-model="row.gender" placeholder="请选择">
                              <el-option label="男" :value="1"></el-option>
                              <el-option label="女" :value="0"></el-option>
                            </el-select>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="岗位"
                          width="150">
                          <template slot-scope="{row}">
                            <el-input v-model="row.post" readonly></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="证件名称"
                          width="250">
                          <template slot-scope="{row}">
                            <el-input v-model="row.certificateName"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="证件编号"
                          width="250">
                          <template slot-scope="{row}">
                            <el-input v-model="row.certificateCode"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="发证单位"
                          width="250">
                          <template slot-scope="{row}">
                            <el-input v-model="row.issuer"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="有效期"
                          width="320">
                          <template slot-scope="{row}">
                            <el-date-picker
                              v-model="row.effectiveTime"
                              type="daterange"
                              value-format="yyyy-MM-dd"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
                            </el-date-picker>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="文化程度"
                          width="120">
                          <template slot-scope="{row}">
                            <el-input v-model="row.education"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="脸部照片"
                          width="120"
                          align="center">
                          <template slot-scope="{row}">
                            <img-viewer :img-list="[row.peoplePic]"></img-viewer>
                          </template>
                        </el-table-column>
                        <el-table-column
                          label="操作"
                          width="200">
                          <template slot-scope="{$index}">
                            <el-button type="primary" size="mini" class="primary_mini">上传照片</el-button>
                            <el-button type="danger" size="mini" @click="deleteInfo($index)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                  <div class="form-block">
                    <div class="form-block-title">
                      <div class="title-bar"></div>
                      <strong>待处理人</strong>
                    </div>
                    <div class="block-line">
                      <div class="block-item">
                        <div class="block-item-label">待处理人<i class="require-icon"></i></div>
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
                  <div class="form-block">
                    <el-button class="submit-btn" size="small" type="primary">提交
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
              style="width: 410px;background-color: rgb(242, 242, 242);overflow: scroll;height: calc(100vh - 96px);">
              <!--              <tasklog></tasklog>-->
            </el-aside>
          </el-container>

        </el-dialog>

        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="queryData.totalPage">
        </el-pagination>
      </div>
    </el-main>


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
        allUsers: [],//所有的用户
        tableRowData: {
          identityId: "",//身份证ID;
          identityTime: "",//身份证有效时间
          gender: 1,//性别 0女 1男
          post: "",//角色
          certificateName: "",//证件名称
          certificateCode: "", //证件编号
          issuer: "", //发证单位
          effectiveTime: "", //证件有效期
          education: "", //文化程度
          peoplePic: "", //人脸照片
          name: "", //用户名,
          userId: null,//用户ID
          roldid: null//角色id
        },
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
