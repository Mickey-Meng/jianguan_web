<!--
@name:
@description: 电子围栏
@author: 王海林
@time: 2022-05-20 17:46:57
@modifier:
@modifierTime:
-->
<template>
  <el-container class="container-box">
    <el-header>
      <div class="input-box">
        <div class="input-value">
          <el-input v-model="queryData.projectCode" placeholder="请输入打卡方案"></el-input>
        </div>

      </div>
      <el-button type="primary">搜索</el-button>

      <div class="right-btns">
        <!-- <el-button type="primary" size="small"
          :icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
          @click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
        <div class="operate-btns">
                    <el-button size="small" @click="openDialog">新建电子围栏</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableData" style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="uploadname" label="打卡方案"></el-table-column>
          <el-table-column prop="uploadname" label="人员岗位"></el-table-column>
          <el-table-column prop="uploadname" label="时间范围"></el-table-column>
          <el-table-column prop="uploadname" label="时长(h)"></el-table-column>
          <el-table-column prop="uploadname" label="描述"></el-table-column>
          <el-table-column prop="uploadname" label="操作"></el-table-column>
          <!--          <el-table-column prop="uploadname" label="请假原因"></el-table-column>-->
          <!--          <el-table-column prop="uploadname" label="备注"></el-table-column>-->
          <!--          <el-table-column prop="uploadname" label="状态"></el-table-column>-->
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="queryData.totalPage">
        </el-pagination>
      </div>
    </el-main>
    <el-dialog class="full-dialog defined-dialog" :fullscreen="true" :destroy-on-close="true"
               :visible.sync="dialogFormVisible">
      <template slot="title">
        {{ dialogTitle }}
      </template>
      <el-container class="full_dialog_container">
        <el-main style="height: calc(100vh - 96px); overflow-y: scroll;padding: 0px;margin: 0;">
          <div class="form-bg">
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
              <div class="form-title">
                <div class="title-big-bar"></div>
                <strong>电子围栏</strong>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>基本信息</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">标段<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-input readonly v-model="form.title"></el-input>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">工区<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="clockGroupId">
                        <el-select v-model="form.clockGroupId" placeholder="请选择">
                          <el-option
                            v-for="item in areaData"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <div class="block-line">
                  <div class="block-item" style="width: 100%">
                    <div class="block-item-label">坐标<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="coordinate">
                        <el-input type="textarea" v-model="form.coordinate" :rows="3" readonly></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">备注</div>
                    <div class="block-item-value">
                      <el-input v-model="form.describe"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <div id="map">
                  <mapView @clearStr="clearStr" @setStr="setStr"></mapView>
                </div>
              </div>
              <div class="form-block">
                <el-button style="margin: 20px 0 20px 160px;padding: 0 70px" size="small" type="primary"
                           @click="submitInfo">提交
                </el-button>
              </div>
            </el-form>
          </div>
        </el-main>
      </el-container>

    </el-dialog>


  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {mapGetters} from "vuex";
  import mapView from "@/views/contractManagement/map/map";
  import {getChildProject} from "@/api/project";

  export default {
    name: "",
    data() {
      return {
        form: {},
        tableData: [],
        areaData: [],
        dialogFormVisible: false,
        queryData: {
          projectCode: "",
          subProject: "",
          pageNum: 1,
          totalPage: 1,
          pageSize: 10
        },
        dialogTitle: "项目全生命周期数字管理平台",
        isCreate: false,
        rules: {
          clockGroupId: [
            {required: true, message: "请请选择工区", trigger: "blur"}
          ],
          coordinate: [
            {required: true, message: "请绘制范围", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.init();
      this.initForm();
    },
    components: {mapView},
    computed: {
      ...mapGetters(["userInfo", "name", "project"])
    },
    methods: {
      initForm() {
        this.form = {
          clockGroupId: null,
          clockGroupName: "",
          clockInEndTime: "",
          clockInOften: "",
          clockInStartTime: "",
          coordinate: "",
          describe: "",
          postId: "",
          postName: "",
          projectId: this.project.id,
          title: this.project.name
        };
      },
      init() {
        getChildProject({projectid: this.project.id}).then(res => {
          this.areaData = res.data;
        });
      },
      openDialog() {
        this.initForm();
        this.isCreate = true;
        this.dialogFormVisible = true;
      },
      clearStr() {
        this.form.coordinate = "";
      },
      setStr(val) {
        this.form.coordinate = val;
      },
      submitInfo() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
          } else {
            return false;
          }
        });
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
    .el-header {
      display: flex;
      align-items: center;

      .input-value {
        .el-date-editor {
          display: flex;
          align-items: center;
          margin-right: 10px;
        }
      }
    }
  }

  ::v-deep.full-dialog {
    .el-dialog__headerbtn {
      background: #FFFFFF;
    }
  }

  .form-bg {
    width: 70% !important;

    .form-block {
      .el-date-editor {
        width: 100% !important;
      }

      #map {
        margin-top: 10px;
        width: 100%;
        height: 500px;
      }
    }
  }


</style>
