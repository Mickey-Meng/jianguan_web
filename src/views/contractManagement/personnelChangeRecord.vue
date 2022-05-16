<!--
@name:
@description: 人员变更记录
@author: 王海林
@time: 2022-05-11 15:40:36
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
          <el-input v-model="queryData.subProject" placeholder="请输入负责人"></el-input>
        </div>
      </div>
      <el-button type="primary">搜索</el-button>

      <div class="right-btns">
        <!-- <el-button type="primary" size="small"
          :icon="operateBtnsVisible?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"
          @click="operateBtnsVisible=!operateBtnsVisible"></el-button> -->
        <div class="operate-btns">
          <el-button size="small">导出</el-button>
          <el-button size="small">批量操作</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableDta" style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="uploadname" label="标段"></el-table-column>
          <el-table-column prop="uploadname" label="人员变更类型"></el-table-column>
          <el-table-column prop="uploadname" label="变更岗位"></el-table-column>
          <el-table-column prop="uploadname" label="变更前人员"></el-table-column>
          <el-table-column prop="uploadname" label="变更后人员"></el-table-column>
          <el-table-column prop="uploadname" label="录入日期"></el-table-column>
          <el-table-column prop="uploadname" label="负责人"></el-table-column>
          <el-table-column prop="uploadname" label="操作"></el-table-column>
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
                <strong>人员变更记录</strong>
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
                    <div class="block-item-label">填报人</div>
                    <div class="block-item-value">
                      <el-input readonly></el-input>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">填报日期</div>
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
                </div>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>变更信息</strong>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">项目</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input readonly></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">标段</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input readonly></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">人员变更类型</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-select placeholder="请选择">
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">建设单位</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-select placeholder="请选择">
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">变更单位</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-select placeholder="请选择">
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">变更岗位</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-select placeholder="请选择">
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">变更前人员</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-select placeholder="请选择">
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">变更前(执业)资格证书号</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input readonly></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">变更后人员</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-select placeholder="请选择">
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">变更后(执业)资格证书号</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input readonly></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>


              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>附件</strong>
                </div>
                <div class="block-line">
                  <el-button size="small" type="primary">下载全部</el-button>
                </div>
                <div class="block-table">
                  <el-table :data="fileData" border style="width: 100%;">-->
                    <el-table-column prop="uploadname" label="附件"></el-table-column>
                    <el-table-column prop="uploadname" label="上传日期"></el-table-column>
                    <el-table-column prop="uploadname" label="上传人"></el-table-column>
                    <el-table-column prop="uploadname" label="操作"></el-table-column>
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
                    <div class="block-item-label">负责人<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">

                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">项目部<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">

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
  export default {
    data() {
      return {
        tableDta: [],
        fileData: [],//上传的附件
        form: {},
        dialogFormVisible: true,
        dialogTitle: "项目全生命周期数字管理平台",
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
    components: {},
    computed: {},
    methods: {
      handleSizeChange() {
      },
      handleCurrentChange() {
      }
    }
  };
</script>
<style lang='scss' scoped>
  @import "../../assets/css/table.scss";
  @import "../../assets/css/dialog.scss";

  .form-bg {
    .form-block {
      .block-item-label {
        width: 180px !important;
      }

      .block-item-value {
        width: calc(100% - 200px) !important;
      }

      .el-date-editor {
        width: 100% !important;
      }
    }
  }


</style>
