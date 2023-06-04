<!--
@name:
@description: 变更台账
@author: 王海林
@time: 2022-08-05 13:38:54
@modifier:
@modifierTime:
-->
<template>
  <el-container>
    <el-header>
      <div>
        <div>
          <el-input v-model="queryData.beforeName" clearable placeholder="请输入变更前人员"></el-input>
        </div>
        <div class="input-box" style="margin-left: 10px">
          <div class="input-value">
            <el-input v-model="queryData.afterName" clearable placeholder="请输入变更后人员"></el-input>
          </div>
        </div>
        <div class="input-box" style="margin-left: 10px">
          <div class="input-value">
            <el-date-picker
              v-model="queryData.subDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择录入时间">
            </el-date-picker>
          </div>
        </div>
        <div class="input-box" style="margin-left: 10px">
          <div class="input-value">
            <el-select v-model="queryData.selectValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button type="primary" style="margin-left: 10px" @click="queryClick">搜索</el-button>
      </div>
    </el-header>
    <el-main class="submit">
      <el-table :data="tableData.slice((queryData.pageNum-1)*queryData.pageSize,queryData.pageNum*queryData.pageSize)"
                style="width: 100%" border height="100%" class="have_scrolling">
        <el-table-column prop="projectChildName" label="标段"></el-table-column>
        <el-table-column prop="changeTypeName" label="人员变更类型"></el-table-column>
        <el-table-column prop="changePostName" label="变更岗位"></el-table-column>
        <el-table-column prop="beforePerson" label="变更前人员"></el-table-column>
        <el-table-column prop="afterPerson" label="变更后人员"></el-table-column>
        <el-table-column prop="subDate" label="录入日期">
          <template slot-scope="{row,$index}">
            {{ row.subDate | formatTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="mini" @click="seeDetail(row)">详情</el-button>
            <el-button type="text" size="mini" v-if="rolePerms[0] =='gly'" @click="deleteInfo(row,$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="tableData.length">
      </el-pagination>
    </el-footer>
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
                <strong>人员变更</strong>
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
                      <el-input readonly v-model="form.projectChildName"></el-input>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">填报人</div>
                    <div class="block-item-value">
                      <el-input readonly v-model="form.recorder"></el-input>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">填报日期</div>
                    <div class="block-item-value">
                      {{ form.subDate }}
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
                        <el-input readonly v-model="form.projectName"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">标段</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input readonly v-model="form.projectChildName"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">人员变更类型</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        {{ form.changeTypeName }}
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">变更岗位</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        {{ form.changePostName }}
                      </el-form-item>
                    </div>
                  </div>
                </div>

                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">变更前人员</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        {{ form.beforePerson }}
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">变更前(执业)资格证书号</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input v-model="form.beforeCode"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">变更后人员</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        {{ form.afterPerson }}
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">变更后(执业)资格证书号</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input v-model="form.afterCode"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">变更单位</div>
                    <div class="block-item-value">
                      <el-form-item prop="qualityCheckUser">
                        <el-input readonly v-model="form.changeUnitName"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>附件</strong>
                  <span style="font-size: 12px;margin-left: 40px;">支持上传jpg jpeg png mp4 docx doc
											xisx xis pdf文件，且不超过100m</span>
                </div>
                <div class="block-line" style="height: 35px;">
                  <div class="block-table-btns">
                    <el-button size="small" type="primary" @click="downloadFileEvent">下载全部</el-button>
                  </div>
                </div>
                <div class="block-table">
                  <el-table :data="fileData" border style="width: 100%;">-->
                    <el-table-column prop="fileName" label="附件"></el-table-column>
                    <el-table-column prop="uploadTime" label="上传日期"></el-table-column>
                    <el-table-column prop="uploadPerson" label="上传人"></el-table-column>
                  </el-table>
                </div>
                <div class="block-line">
                  <p>
                    <span style="font-family: FangSong, FangSong_GB2312; font-size: 14px;">
                      <em>应附：替换人与被替换人的简历表、职称证书、学历证书、身份证复印件、工作简历、业绩、社保、资格证书等相关材料。 </em>
                    </span>
                  </p>
                </div>
              </div>
              <!--          <div class="form-block">-->
              <!--            <div class="form-block-title">-->
              <!--              <div class="title-bar"></div>-->
              <!--              <strong>待处理人</strong>-->
              <!--            </div>-->
              <!--            <div class="block-line">-->
              <!--              <div class="block-item">-->
              <!--                <div class="block-item-label">负责人<i class="require-icon"></i></div>-->
              <!--                <div class="block-item-value">-->
              <!--                  <el-form-item prop="qualityCheckUser">-->

              <!--                  </el-form-item>-->
              <!--                </div>-->
              <!--              </div>-->
              <!--              <div class="block-item">-->
              <!--                <div class="block-item-label">项目部<i class="require-icon"></i></div>-->
              <!--                <div class="block-item-value">-->
              <!--                  <el-form-item prop="qualityCheckUser">-->

              <!--                  </el-form-item>-->
              <!--                </div>-->
              <!--              </div>-->
              <!--            </div>-->
              <!--          </div>-->
              <div class="form-block">
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
          <tasklog :taskInfo="taskInfo" ref="tasklog"></tasklog>
        </el-aside>
      </el-container>

    </el-dialog>

  </el-container>
</template>

<script>
  import {deleteChangeRecord, getAllPersonChangeRecords} from "@/api/staffApproval";
  import {formatDate} from "@/utils/date";
  import tasklog from "@/views/common/tasklog";
  import {downLoadFile} from "@/utils/download";
  import {mapGetters} from "vuex";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        dialogFormVisible: false,
        dialogTitle: "全生命周期智慧建设管理平台",
        form: {},
        options: [
          {
            name: "所有单位",
            value: 10
          },
          {
            name: "施工单位",
            value: 1
          },
          {
            name: "监理单位",
            value: 2
          },
          {
            name: "全咨单位",
            value: 3
          }
        ],
        taskInfo: {},
        tableData: [],
        fileData: [],
        queryData: {
          beforeName: "",
          afterName: "",
          subDate: null,
          pageNum: 1,
          totalPage: 1,
          pageSize: 10,
          selectValue: 10
        }
      };
    },
    created() {
      this.init();
    },
    computed: {
      ...mapGetters(["project", "roleId", "rolePerms"])
    },
    mounted() {
    },
    methods: {
      init() {
        let {selectValue, afterName, beforeName, subDate} = this.queryData;
        let type = selectValue === 10 ? undefined : selectValue;
        getAllPersonChangeRecords(this.project.id, type).then(res => {
          let data = res.data;
          if (!subDate && !afterName && !beforeName) {
            this.tableData = data;
          } else if (!subDate && afterName && !beforeName) {
            this.tableData = data.filter(e => e.afterPerson.indexOf(afterName) !== -1);
          } else if (!subDate && !afterName && beforeName) {
            this.tableData = data.filter(e => e.beforePerson.indexOf(beforeName) !== -1);
          } else if (subDate && !afterName && !beforeName) {
            this.tableData = data.filter(e => e.subDate.indexOf(subDate) !== -1);
          } else {
            this.tableData = data.filter(e => e.subDate.indexOf(subDate) !== -1 && e.beforePerson.indexOf(afterName) !== -1 && e.afterPerson.indexOf(afterName) !== -1);
          }
        });
      },
      seeDetail(row) {
        this.form = Object.assign({}, row);
        this.fileData = row.files;
        this.isCreate = false;
        let {processDefinitionId, processInstanceId, taskId} = row;
        if (processDefinitionId && processInstanceId && taskId) {
          let flowKey = processDefinitionId.split(":")[0];
          this.taskInfo = {
            processDefinitionId, processInstanceId, taskId, flowKey
          };

        } else {
          this.taskInfo = {};
        }
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["tasklog"].initData();
        });
      },
      deleteInfo(row, index) {
        this.$confirm("确定删除该变更信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteChangeRecord(row.id, this.project.id).then(() => {
            let ind = this.tableData.findIndex(e => e.id === row.id);
            this.tableData.splice(ind, 1);
            this.$message.success("删除成功");
          }).catch(() => {
            this.$message.info("删除失败");
          });
        }).catch(() => {
          this.$message.info("取消删除");
        });
      },
      queryClick() {
        this.init();
      },
      handleSizeChange(val) {
        this.queryData.pageSize = val;
      },
      handleCurrentChange(val) {
        this.queryData.pageNum = val;
      },
      downloadFileEvent() {
        if (this.fileData && this.fileData.length > 0) {
          this.fileData.forEach(item => {
            downLoadFile(item.fileId);
          });
        }
      }
    },
    components: {tasklog},
    beforeDestroy() {
    },
    filters: {
      formatTime(val) {
        return formatDate(val);
      }
    }

  };
</script>

<style lang='scss' scoped>
  @import "../../../assets/css/table.scss";
  @import "../../../assets/css/dialog.scss";

  .el-header {
    > div {
      display: flex;
    }
  }

  .submit {
    padding: 20px 0 0 0 !important;
  }

</style>
