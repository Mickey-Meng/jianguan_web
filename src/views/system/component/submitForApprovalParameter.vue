<!--
@name:
@description: 报审台账
@author: 王海林
@time: 2022-08-05 13:38:13
@modifier:
@modifierTime:
-->
<template>
  <el-container>
    <el-header>
      <div>
        <div>
          <el-input v-model="queryData.subName" clearable placeholder="请输入姓名"></el-input>
        </div>
        <div class="input-box" style="margin-left: 10px">
          <div class="input-value">
            <el-date-picker v-model="queryData.subDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择进场时间">
            </el-date-picker>
          </div>
        </div>
        <div class="input-box" style="margin-left: 10px">
          <div class="input-value">
            <el-select v-model="queryData.selectValue" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <el-button type="primary" style="margin-left: 10px" @click="queryClick">搜索</el-button>

      </div>

    </el-header>
    <el-main class="submit">
      <el-table border
        :data="tableData.slice((queryData.pageNum-1)*queryData.pageSize,queryData.pageNum*queryData.pageSize)"
        style="width: 100%" height="100%" class="have_scrolling">
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
          <template slot-scope="{row,$index}">
            <el-button type="text" size="mini" @click="seeDetail(row)">详情</el-button>
            <!--            <el-button type="text" size="mini">退场</el-button>-->
            <el-button type="text" size="mini" v-if="rolePerms[0] =='gly'" @click="deleteInfo(row,$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryData.pageNum" :page-size="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper"
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
  import {adminGetAllStaffRecord, deleteStaffRecord} from "@/api/staffApproval";
  import {mapGetters} from "vuex";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        dialogFormVisible: false,
        dialogTitle: "项目全生命周期数字管理平台",
        tableData: [],
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
        queryData: {
          projectCode: "",
          subProject: "",
          pageNum: 1,
          totalPage: 1,
          pageSize: 10,
          subName: "",
          subDate: null,
          selectValue: 10
        }
      };
    },
    created() {
      this.init();

    },
    mounted() {
    },
    computed: {
      ...mapGetters(["project", "roleId", "rolePerms"])
    },
    methods: {
      init() {
        let {selectValue, subDate, subName} = this.queryData;
        let type = selectValue === 10 ? undefined : selectValue;
        adminGetAllStaffRecord(this.project.id, type).then(res => {
          let lists = [];
          let data = res?.data || [];
          if (data && data.length > 0) {
            data.forEach(item => {
              let {person, personSubs} = item;
              let {approvalTime, id} = person;
              personSubs.forEach(e => {
                e.approvalTime = approvalTime;
                e.newPeoplePic = "/mong/preview?fileid=" + e.peoplePic;
                e.staffId = id;
              });
              lists = lists.concat(personSubs);
            });
            if (!subDate && !subName) {
              this.tableData = lists;
            } else if (!subDate && subName) {
              this.tableData = lists.filter(e => e.name.indexOf(subName) !== -1);
            } else if (subDate && !subName) {
              this.tableData = lists.filter(e => e.approvalTime && e.approvalTime?.indexOf(subDate) !== -1);
            } else {
              this.tableData = lists.filter(e => e.approvalTime?.indexOf(subDate) !== -1 && e.name.indexOf(subName) !== -1);
            }
          } else {
            this.tableData = [];
          }
        });
      },
      handleSizeChange(val) {
        this.queryData.pageSize = val;
      },
      handleCurrentChange(val) {
        this.queryData.pageNum = val;
      },
      queryClick() {
        this.init();
      },
      seeDetail(row) {
        this.form = Object.assign({}, row);
        this.dialogFormVisible = true;
      },
      deleteInfo(row) {
        this.$confirm("注意,多条人员数据属于一个报审记录,请慎重删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteStaffRecord(row.staffId, this.project.id).then(() => {
            this.init();
            this.$message.success("删除成功");
          }).catch(() => {
            this.$message.info("删除失败");
          });
        }).catch(() => {
          this.$message.info("取消删除");
        });
      }
    },
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
@import "../../../assets/css/table.scss";
@import "../../../assets/css/dialog.scss";

.el-header {
  >div {
    display: flex;
  }
}

.submit {
  padding: 20px 0 0 0 !important;
}

//@import "@/assets/css/table.scss";
//@import "@/assets/css/dialog.scss";

.form-bg {
  width: 60% !important;

  .form-block {
    .el-date-editor {
      width: 100% !important;
    }
  }
}

::v-deep.full-dialog .el-dialog__headerbtn {
  background: #FFFFFF;
}
</style>
