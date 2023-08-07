<!--
@name:
@description: 打卡时间制定
@author: 王海林
@time: 2022-05-31 14:56:13
@modifier:
@modifierTime:
-->
<template>
  <div>
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
                <strong>打卡时间制定</strong>
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
                    <div class="block-item-label">人员岗位<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="postName">
                        <el-select
                          ref="select"
                          :value="selectLabel"
                          :clearable="false"
                          popper-class="select_tree"
                        >
                          <el-option :value="selectKey" :label="selectLabel">
                            <el-tree
                              id="tree-option"
                              ref="tree"
                              node-key="ID"
                              show-checkbox
                              :accordion="true"
                              :data="treeData"
                              :props="props"
                              :expand-on-click-node="false"
                              @check="checkEvent"
                              @check-change="checkChange"
                            >
                              <template slot-scope="{ node }">
                                <span class="node_label">{{ node.label }}</span>
                              </template>
                            </el-tree>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <div class="block-line">
                  <div class="block-item">
                    <div class="block-item-label">时间范围<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="coordinate">
                        <el-time-picker
                          style="width: 100%"
                          is-range
                          v-model="timeValue"
                          range-separator="至"
                          value-format="HH:mm:ss"
                          start-placeholder="开始时间"
                          end-placeholder="结束时间"
                          @change="timeChange"
                          placeholder="选择时间范围">
                        </el-time-picker>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">时长(h)</div>
                    <div class="block-item-value">
                      <el-input v-model="form.clockInOften" readonly></el-input>
                    </div>
                  </div>
                </div>
              </div>
              <div class="form-block">
                <el-button style="margin: 20px 0 20px 160px;padding: 0 70px" size="small" type="primary"
                           @click="submitInfo"
                >提交
                </el-button>
              </div>
              <div class="form-block">
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>打卡时间明细</strong>
                </div>
                <div class="block-table">
                  <el-table :data="tableData" border style="width: 100%;">
                    <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
                    <el-table-column label="人员岗位" show-overflow-tooltip>
                      <template slot-scope="{row}">
                        <span>{{ row.posts | getName }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="时间范围" show-overflow-tooltip>
                      <template slot-scope="{row}">
                        <span>{{ row.clockInStartTime }} 至 {{ row.clockInEndTime }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="clockInOften" label="时长(h)" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="{row,$index}">
                        <el-button type="text" size="mini" @click="modify(row,$index)">编辑</el-button>
                        <el-button type="text" size="mini" @click="deleteInfo(row,$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

            </el-form>
          </div>
        </el-main>
      </el-container>

    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {diff, getCurrentDate} from "@/utils/date";

  import {getServiceRoles} from "@/api/user";
  import {addClockTime, updateClockTime, getClockTime, deleteClockTime, deleteFence} from "@/api/staffApproval";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        selectLabel: "",
        selectKey: "",
        treeData: [],//角色树
        allRoles: [],//所有的角色数据
        disabledId: [],
        props: {
          children: "children",
          label: "NAME",
          disabled: this.disFn
        },
        form: {},
        timeValue: "",
        isCreate: true,
        rules: {
          name: [
            {required: true, message: "请请填写标题", trigger: "blur"}
          ]
        },
        tableData: [],
        dialogTitle: "全生命周期智慧建设管理平台",
        dialogFormVisible: false
      };
    },
    created() {
      this.initData();
      this.initClockTime();
    },
    mounted() {
    },
    methods: {
      initForm() {
        this.timeValue = "";
        this.selectLabel = "";
        this.form = {
          clockInEndTime: "",
          clockInOften: "",
          clockInStartTime: "",
          postId: "",
          projectId: this.project.id
        };
      },
      initData() {
        getServiceRoles(this.project.id).then(res => {
          function getTree(ary, pid = -1) {
            if (!pid) {
              // 如果没有父id（第一次递归的时候）将所有父级查询出来
              return ary.filter(item => !item.PARENTID).map(item => {
                // 通过父节点ID查询所有子节点
                item.children = getTree(ary, item.ID);
                return item;
              });
            } else {
              return ary.filter(item => item.PARENTID === pid).map(item => {
                // 通过父节点ID查询所有子节点
                item.children = getTree(ary, item.ID);
                return item;
              });
            }
          }
          let filterId = [2, 3];
          let data = res.getMe;//.filter(e => !filterId.includes(e.ID));
          this.allRoles = data;
          let tree = getTree(data);
          this.treeData = tree;
        });

      },
      initClockTime() {
        getClockTime(this.project.id).then(res => {
          let data = res.data;
          this.tableData = data || [];
          let arr = [];
          if (data && data.length > 0) {
            data.forEach(item => {
              if (item.postId) {
                let idArr = item.postId.split(",");
                arr = arr.concat(idArr);
              }
            });
          }
          this.disabledId = arr.map(item => {
            return Number(item);
          });
        });
      },
      disFn(a) {
        if (this.disabledId.includes(a.ID)) {
          return true;
        }
      },
      timeChange(val) {
        if (val && val.length > 0) {
          let day = getCurrentDate();
          let start = day + " " + val[0];
          let end = day + " " + val[1];
          let time = diff(end, start);
          if (!isNaN(time)) {
            this.form.clockInOften = Math.floor(time / (60 * 60) * 100) / 100;
          } else {
            this.form.clockInOften = "";
          }
        }
      },
      checkEvent(node, data) {
        this.form.postId = "";
        this.selectLabel = "";
        let ids = "";
        let checkNodes = data.checkedNodes;
        if (checkNodes && checkNodes.length > 0) {
          let roles = checkNodes.filter(e => e.PARENTID !== -1);
          let str = "";
          roles.forEach(item => {
            str += item.NAME + ",";
            ids += item.ID + ",";
          });
          ids = ids.substring(0, ids.lastIndexOf(","));
          this.selectLabel = str;
          this.form.postId = ids;
        }

      },
      checkChange(a, b, c) {
        // console.log(a,b,c);
      },
      modify(row) {
        let obj = Object.assign({}, row);
        this.selectLabel = "";
        let ids = "";
        if (obj.postId) {
          let arr = obj.postId.split(",");
          let data = arr.map(item => {
            let id = Number(item);
            let index = this.disabledId.findIndex(e => e === id);
            ids += id + ",";
            if (index !== -1) {
              this.disabledId.splice(index, 1);
            }
            return id;
          });
          this.$refs.tree.setCheckedKeys(data);
        }
        let {posts} = obj;
        let pname = "";
        if (posts && posts.length > 0) {
          posts.forEach(item => {
            pname += item.postName + ",";
          });
          this.selectLabel = pname;
        }
        this.isCreate = false;
        this.timeValue = [obj.clockInStartTime, obj.clockInEndTime];
        ids = ids.substring(0, ids.lastIndexOf(","));
        obj.postId = ids;
        this.form = obj;
      },
      submitInfo() {
        let {selectLabel, timeValue, isCreate} = this;
        if (!selectLabel || !timeValue) {
          this.$message({
            type: "warning",
            message: "请选择岗位或者时间",
            customClass: "message_override"
          });
          return false;
        }
        this.$refs["form"].validate((valid) => {
          if (valid) {
            let obj = Object.assign({}, this.form);
            obj.clockInStartTime = timeValue[0];
            obj.clockInEndTime = timeValue[1];
            if (isCreate) {
              addClockTime(obj).then(res => {
                this.initForm();
                this.initClockTime();
                this.$refs.tree.setCheckedKeys([]);
                this.$message({
                  type: "success",
                  message: "新增成功",
                  customClass: "message_override"
                });
              });

            } else {
              delete obj.posts;
              updateClockTime(obj).then(res => {
                this.initForm();
                this.initClockTime();
                this.$refs.tree.setCheckedKeys([]);
                this.$message({
                  type: "success",
                  message: "修改成功",
                  customClass: "message_override"
                });
                this.isCreate = true;
              });

            }
          } else {
            return false;
          }
        });
      },
      deleteInfo(row) {
        this.initForm();
        this.isCreate = true;
        this.$refs.tree.setCheckedKeys([]);
        this.$confirm("确认是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteClockTime(this.project.id, row.id).then(res => {
            this.initClockTime();
            this.$message({
              type: "success",
              message: "删除成功",
              customClass: "message_override"
            });
          });

        });
      }
    },
    computed: {
      ...mapGetters(["project"])
    },
    filters: {
      getName(val) {
        let str = "";
        if (val && val.length > 0) {
          val.forEach(item => {
            str += item.postName + ",";
          });
          str = str.substring(0, str.lastIndexOf(","));
        }
        return str;
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

  ::v-deep.full-dialog {
    .el-dialog__headerbtn {
      background: #FFFFFF;
    }
  }

  .form-bg {
    width: 55% !important;
  }



</style>
