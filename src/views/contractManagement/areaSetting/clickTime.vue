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
                      <el-input readonly v-model="form.title"></el-input>
                    </div>
                  </div>
                  <div class="block-item">
                    <div class="block-item-label">人员岗位<i class="require-icon"></i></div>
                    <div class="block-item-value">
                      <el-form-item prop="clockGroupId">
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
                              show-checkbox
                              :accordion="true"
                              :data="treeData"
                              :props="props"
                              :expand-on-click-node="false"
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
                <div class="form-block-title">
                  <div class="title-bar"></div>
                  <strong>打卡时间明细</strong>
                </div>
                <div class="block-table">
                  <el-table :data="tableData" border style="width: 100%;">
                    <el-table-column prop="fileName" label="标题" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="uploadTime" label="人员岗位" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="uploadPerson" label="时间范围" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="uploadPerson" label="时长(h)" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="{row,$index}">
                        <!--                        <el-button type="danger" size="mini" @click="deleteInfo(row,$index)">删除</el-button>-->
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="form-block">
                <el-button style="margin: 20px 0 20px 160px;padding: 0 70px" size="small" type="primary"
                >提交
                </el-button>
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

  import {getRoles} from "@/api/user";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        selectLabel: "",
        selectKey: "",
        treeData: [],
        props: {
          children: "children",
          label: "NAME"
        },
        form: {},
        timeValue: "",
        rules: {},
        tableData: [],
        dialogTitle: "项目全生命周期数字管理平台",
        dialogFormVisible: false
      };
    },
    created() {
      this.initData();
    },
    mounted() {
    },
    methods: {
      initForm() {
        this.timeValue = "";
        this.form = {
          clockInEndTime: "",
          clockInOften: "",
          clockInStartTime: "",
          postId: "",
          postName: "",
          projectId: this.project.id
        };
      },
      initData() {
        getRoles().then(res => {
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
          let data = res.data.getMe;
          let tree = getTree(data)
          this.treeData = tree
        });

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
      }
    },
    computed: {
      ...mapGetters(["project"])
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
