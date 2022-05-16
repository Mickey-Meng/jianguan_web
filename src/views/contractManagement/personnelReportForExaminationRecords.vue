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
          <el-table-column prop="uploadname" label="标段"></el-table-column>
          <el-table-column prop="uploadname" label="记录人"></el-table-column>
          <el-table-column prop="uploadname" label="填报时间"></el-table-column>
          <el-table-column prop="uploadname" label="人员类型"></el-table-column>
          <el-table-column prop="uploadname" label="是否自管"></el-table-column>
          <el-table-column prop="uploadname" label="状态"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini">详情</el-button>
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
                <strong>人员报审记录</strong>
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
                      <el-input readonly></el-input>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">记录人</div>
                    <div class="block-item-value">
                      <el-input readonly></el-input>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">报审日期</div>
                    <div class="block-item-value">
                      <el-date-picker
                        v-model="form.time"
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
                      <el-input readonly></el-input>
                    </div>
                  </div>
                </div>
                <div class="block-line">

                  <div class="block-item">
                    <div class="block-item-label">是否自管</div>
                    <div class="block-item-value">
                      <el-input v-model="form.projectCode" readonly></el-input>
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
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                      label="姓名"
                      width="120">
                      <template slot-scope="{row}">
                        <div class="user_select">
                          <div class="name">{{ row.name }}</div>
                        </div>
                      </template>
                    </el-table-column>

                    <el-table-column
                      label="岗位"
                      width="120">
                      <template slot-scope="{row}">
                        <el-input v-model="row.name"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="证件名称">
                      <template slot-scope="{row}">
                        <el-input v-model="row.name"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="证件编号">
                      <template slot-scope="{row}">
                        <el-input v-model="row.name"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="发证单位">
                      <template slot-scope="{row}">
                        <el-input v-model="row.name"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="有效期"
                      width="320">
                      <template slot-scope="{row}">
                        <el-date-picker
                          v-model="row.time"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
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
                    <div class="block-item-label">处理人<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
<!--                        <el-select v-model="form.qualityCheckUser" placeholder="请选择">-->
<!--                          <el-option v-for="item in userOptions" :key="item.value"-->
<!--                                     :label="item.label" :value="item.value">-->
<!--                          </el-option>-->
<!--                        </el-select>-->
                      </el-form-item>
                    </div>
                  </div>
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
          <!--              <tasklog></tasklog>-->
        </el-aside>
      </el-container>

    </el-dialog>
  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {mapGetters} from "vuex";
  export default {
    props: [],
    watch: {},
    data() {
      return {
        tableData: [],
        form: {
          time: getNowDate(),
          userName: "",
          isContract: true,
          autogestion: true
        },
        dialogTitle: "项目全生命周期数字管理平台",
        dialogFormVisible: true,
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
    },
    mounted() {
    },
    methods: {
      handleSizeChange() {
      },
      handleCurrentChange() {
      }
    },
    components: {},
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
