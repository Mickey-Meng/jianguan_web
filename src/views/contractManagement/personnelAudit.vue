<!--
 * @Descripttion:人员审核（人员报审拆分出来的）
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 14:07:12
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 14:07:22
-->
<template>
  <el-container class="container-box">
    <!--    <el-header>-->
    <!--      <el-button type="primary" @click="showDialog">添加劳务分包合同</el-button>-->
    <!--    </el-header>-->
    <el-main>
      <el-table :data="tableData" style="width: 100%" border height="100%">
        <el-table-column prop="uploadname" label="工区"></el-table-column>
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
    </el-main>
    <el-footer></el-footer>
    <el-dialog class="full_global_dialog" title="详情" :fullscreen="true" :visible.sync="dialogFormVisible">
      <el-container class="full_dialog_container">
        <el-main>
          <div class="form_content">
            <el-form ref="form" :model="form" label-width="120px">
              <div class="header_title">人员审核</div>
              <div class="form_item">
                <div class="form_item_title">
                  <div class="title_bar"></div>
                  <strong>基本信息</strong>
                </div>
                <div class="form_item_content">
                  <el-row>
                    <el-col :span="8">
                      <el-form-item label="标段">
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="记录人">
                        <el-input v-model="form.userName" readonly></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="报审日期" prop="time">
                        <el-date-picker
                          v-model="form.time"
                          type="datetime"
                          :clearable="false"
                          placeholder="选择日期时间"
                          value-format="yyyy-MM-dd HH:mm:ss"
                        >
                        </el-date-picker>
                      </el-form-item>
                    </el-col>

                  </el-row>
                  <el-row type="flex" justify="center">
                    <el-col :span="8">
                      <el-form-item label="人员类型">
                        <el-switch
                          v-model="form.isContract"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          :active-value="true"
                          active-text="合同人员"
                          inactive-text="非合同人员"
                          :inactive-value="false">
                        </el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="是否自管">
                        <el-switch
                          v-model="form.autogestion"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          active-text="自管"
                          inactive-text="非自管"
                          :active-value="true"
                          :inactive-value="false">
                        </el-switch>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="form_item">
                <div class="form_item_title">
                  <div class="title_bar"></div>
                  <strong>报审信息</strong>
                </div>
                <div class="form_item_content">
<!--                  <el-button type="primary" size="medium" style="margin: 0 0 10px 36px" @click="addRow">添加行-->
<!--                  </el-button>-->
                  <div class="form_item_table">
                    <el-table
                      :data="tableData"
                      border
                      style="width: 100%">
                      <el-table-column
                        label="姓名"
                        width="180">
                        <template slot-scope="{row}">
                          <el-input v-model="row.name"></el-input>
                        </template>
                      </el-table-column>

                      <el-table-column
                        label="岗位"
                        width="180">
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
                        width="420">
                        <template slot-scope="{row}">
                          <el-date-picker
                            v-model="row.time"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                          </el-date-picker>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作"
                        width="80">
                        <template slot-scope="{$index}">
                          <el-button type="danger" size="mini" @click="deleteInfo($index)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
              <div class="form_item">
                <div class="form_item_title">
                  <div class="title_bar"></div>
                  <strong>待处理人</strong>
                </div>
                <div class="form_item_content">
                  <el-row>
                    <el-col :span="24">
                      <el-form-item class="set-margin" label="负责人">
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <div class="form_item" style="text-align: center;padding: 5px 0">
                <el-button type="primary">提交</el-button>
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

  export default {
    data() {
      return {
        tableData: [],
        form: {
          time: getNowDate(),
          userName: "",
          isContract: true,
          autogestion: true
        },
        dialogFormVisible: true
      };
    },
    created() {
      this.form.userName = this.name;
    },
    components: {},
    computed: {
      ...mapGetters(["userInfo", "name"])
    },
    methods: {
      deleteInfo() {
      }
    }
  };
</script>
<style lang='scss' scoped>
  .center-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
  }

</style>
