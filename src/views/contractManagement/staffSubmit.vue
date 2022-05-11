<!--
 * @Descripttion: 人员报审
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-09 10:03:01
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 14:04:52
-->
<template>
  <el-container class="container-box">
    <el-header>
      <el-button type="primary" size="medium" @click="openDialog">人员填报</el-button>
    </el-header>
    <el-main>
      <el-table :data="listData" style="width: 100%" border height="100%">
        <el-table-column prop="uploadname" label="工区"></el-table-column>
        <el-table-column prop="uploadname" label="记录人"></el-table-column>
        <el-table-column prop="uploadname" label="填报时间"></el-table-column>
        <el-table-column prop="uploadname" label="人员类型"></el-table-column>
        <el-table-column prop="uploadname" label="是否自管"></el-table-column>
        <el-table-column prop="uploadname" label="状态"></el-table-column>
        <el-table-column prop="uploadname" label="操作"></el-table-column>
      </el-table>
      <el-dialog class="full-dialog" title="人员填报" fullscreen="true" :visible.sync="dialogFormVisible">
        <el-container>
          <el-header class="center-header">人员填报</el-header>
          <el-main>
            <el-form ref="form" :model="form" label-width="80px">
              <p class="base_title">基本信息</p>
              <el-row>
                <el-col :span="4">
                  <el-form-item label="工区">
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="记录人">
                    <el-input v-model="form.userName" readonly></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
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
                <el-col :span="4">
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
                <el-col :span="4">
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
              <p class="base_title">报审信息</p>
              <!--        <el-form-item label="">-->
              <el-button type="primary" size="medium" style="margin: 0 0 10px 36px" @click="addRow">添加行</el-button>
              <!--        </el-form-item>-->
              <div class="submit_table">
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
              <p class="base_title">待处理人</p>
              <el-row>
                <el-col :span="24">
                  <el-form-item class="set-margin" label="负责人">
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-main>
          <el-footer>
            <el-button type="primary" size="medium">提交</el-button>
          </el-footer>
        </el-container>

      </el-dialog>

    </el-main>
    <el-footer>

      <!--      <el-button type="primary" size="medium">提交</el-button>-->
    </el-footer>
  </el-container>
</template>

<script>
  import {getNowDate} from "@/utils/date";
  import {mapGetters} from "vuex";

  export default {
    name: "",
    data() {
      return {
        form: {
          time: getNowDate(),
          userName: "",
          isContract: true,
          autogestion: true
        },
        tableData: [],
        listData: [],
        dialogFormVisible: false
      };
    },
    created() {
      this.form.userName = this.name;
    },
    computed: {
      ...mapGetters(["userInfo", "name"])
    },
    methods: {
      addRow() {
        this.tableData.push({name: "11", time: ""});
      },
      openDialog() {
        this.dialogFormVisible = true;
      },
      deleteInfo(index) {
        this.tableData.splice(index, 1);
      }
    }
  };
</script>

<style scoped lang="scss">
  .container-box {
    background-color: #ebecee;
    padding: 5px;

    .el-header {
      line-height: 60px;
      background-color: #ffffff;
    }

    .el-main {
      padding: 0;
      margin-top: 10px;
    }
  }
  .center-header{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
  }
</style>
