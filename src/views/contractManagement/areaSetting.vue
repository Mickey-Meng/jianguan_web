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
        </div>
      </div>
      <div class="right-btns">
        <div class="operate-btns">
          <el-button size="small" @click="openDialog">新建电子围栏</el-button>
          <el-button size="small" @click="openTimeDialog">打卡时间制定</el-button>
        </div>
      </div>
    </el-header>
    <el-main>
      <div class="container">
        <el-table :data="tableData.slice((queryData.pageNum-1)*queryData.pageSize,queryData.pageNum*queryData.pageSize)"
                  style="width: 100%" border height="calc(100% - 48px)" class="have_scrolling">
          <el-table-column prop="title" label="标题"></el-table-column>
          <el-table-column prop="clockAddrName" label="打卡点名称"></el-table-column>
          <el-table-column prop="coordinate" label="坐标" show-overflow-tooltip></el-table-column>
          <el-table-column prop="describe" label="描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button type="text" size="mini" @click="modify(row)">修改</el-button>
              <el-button type="text" size="mini" v-if="$store.getters.rolePerms && $store.getters.rolePerms[0] == 'gly'" @click="deleteRow(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="queryData.pageNum" :page-size="queryData.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableData.length">
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
                    <div class="block-item-label">标题<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="title">
                        <el-input v-model="form.title"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">打卡点名称<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="clockAddrName">
                        <el-input v-model="form.clockAddrName"></el-input>
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
                  <mapView @clearStr="clearStr" @setCenter="setCenter" @setStr="setStr" :siteStr="siteStr" :centerPointer="centerPointer"
                           :name="clockName"
                           v-if="dialogFormVisible"></mapView>
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


    <!--    打卡时间制定-->
    <clickTime ref="clickTime"></clickTime>


  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {mapGetters} from "vuex";
  import mapView from "@/views/contractManagement/map/map";
  import clickTime from "@/views/contractManagement/areaSetting/clickTime";
  import {getChildProject} from "@/api/project";
  import {addFence, getFence, deleteFence, updateFence} from "@/api/staffApproval";
  import * as api from "@/api/quality";

  export default {
    name: "",
    data() {
      return {
        form: {},
        tableData: [],
        areaData: [],
        disabledAreaId: [],
        dialogFormVisible: false,
        queryData: {
          projectCode: "",
          subProject: "",
          pageNum: 1,
          totalPage: 1,
          pageSize: 10
        },
        dialogTitle: "全生命周期智慧建设管理平台",
        isCreate: false,
        siteStr: "",
        centerPointer: "",
        clockName: "",
        rules: {
          clockAddrName: [
            {required: true, message: "请输入打卡点名称", trigger: "blur"}
          ],
          coordinate: [
            {required: true, message: "请绘制范围", trigger: "blur"}
          ],
          title: [
            {required: true, message: "请绘输入标题", trigger: "blur"}
          ]
        }
      };
    },
    created() {
      this.initForm();
      this.initTableData();
    },
    components: {mapView, clickTime},
    computed: {
      ...mapGetters(["userInfo", "name", "project"])
    },
    methods: {
      initForm() {
        this.form = {
          centerPoint: null,//
          clockAddrName: "",//打卡点名称
          coordinate: "",//坐标
          describe: "",//描述
          projectId: this.project.id,
          title: ""
        };
      },
      initTableData() {
        getFence(this.project.id).then(res => {
          this.tableData = res.data || [];
        });
      },
      openDialog() {
        this.initForm();
        this.isCreate = true;
        this.dialogFormVisible = true;
        this.siteStr = "";
        this.centerPointer = "";
      },
      clearStr() {
        this.form.coordinate = "";
      },
      setStr(val) {
        this.form.coordinate = val;
      },
      setCenter(val) {
        this.form.centerPoint = val;
      },
      submitInfo() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            // let info = JSON.parse(JSON.stringify(obj));
            // let sites = JSON.parse(info.coordinate);
            // let points = sites.map(item => {
            //   return turf.point(item.reverse());
            // });
            // let features = turf.featureCollection(points);
            // let center = turf.center(features);
            // if (center) {
            //   let point = center.geometry.coordinates.reverse();
            //   obj.centerPoint = JSON.stringify(point);

            // }
            if (this.isCreate) {
              addFence(obj).then(res => {
                this.$message({
                  type: "success",
                  message: "电子围栏添加成功",
                  customClass: "message_override"
                });
                this.initTableData();
                this.dialogFormVisible = false;
              });
            } else {
              updateFence(obj).then(res => {
                this.$message({
                  type: "success",
                  message: "电子围栏修改成功",
                  customClass: "message_override"
                });
                this.initTableData();
                this.dialogFormVisible = false;
              });
            }
          } else {
            return false;
          }
        });
      },
      deleteRow(row) {
        this.$confirm("确认是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteFence(this.project.id, row.id).then(res => {
            this.initTableData();
            this.$message({
              type: "success",
              message: "删除成功",
              customClass: "message_override"
            });
          });

        });
      },
      modify(row) {
        this.form = Object.assign({}, row);
        this.siteStr = row.coordinate;
        this.centerPointer = row.centerPoint;
        this.clockName = row.clockAddrName;
        this.dialogFormVisible = true;
        this.isCreate = false;
      },
      openTimeDialog() {
        this.$refs.clickTime.dialogFormVisible = true;
        this.$refs.clickTime.isCreate = true;
        this.$refs.clickTime.initForm();
        this.$refs.clickTime.initData();
        this.$refs.clickTime.initClockTime();
      },
      handleSizeChange(val) {
        this.queryData.pageSize = val;
      },
      handleCurrentChange(val) {
        this.queryData.pageNum = val;
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
