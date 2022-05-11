<template>
  <el-container class="container-box">
    <el-header></el-header>
    <el-main>
      <el-table border :data="tableData" style="width: 100%" height="100%">
        <el-table-column prop="uploadname" label="工区"></el-table-column>
        <el-table-column prop="uploadname" label="记录人"></el-table-column>
        <el-table-column prop="uploadname" label="填报时间"></el-table-column>
        <el-table-column prop="uploadname" label="人员类型"></el-table-column>
        <el-table-column prop="uploadname" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer></el-footer>
    <el-dialog class="full-dialog" title="查看详情" fullscreen="true" :visible.sync="dialogFormVisible">
      <el-container>
        <el-header class="center-header">报审记录</el-header>
        <el-main>
          <el-form ref="form" :model="form" label-width="80px">
            <p class="base_title">报审记录</p>
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
            <div class="submit_table">
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  label="姓名"
                  width="180">
                </el-table-column>

                <el-table-column
                  label="岗位"
                  width="180">
                </el-table-column>
                <el-table-column
                  label="证件名称">
                </el-table-column>
                <el-table-column
                  label="证件编号">
                </el-table-column>
                <el-table-column
                  label="发证单位">
                </el-table-column>
                <el-table-column
                  label="有效期"
                  width="420">
                </el-table-column>
              </el-table>
            </div>
            <p class="base_title">处理人</p>
            <el-row>
              <el-col :span="24">
                <el-form-item class="set-margin" label="处理人">
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-main>
<!--        <el-footer>-->
<!--          <el-button type="primary" size="medium">提交</el-button>-->
<!--        </el-footer>-->
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
        dialogFormVisible: true
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {},
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .container-box {
    background-color: #ebecee;
    padding: 5px;

    .el-header {
      padding: 0 5px;
      line-height: 60px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      color: #000000;
    }

    .el-main {
      padding: 0;
      margin-top: 10px;
    }
  }
  .center-header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: 600;
  }

</style>
