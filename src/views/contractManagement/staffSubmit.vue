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
      <!--      <el-button type="primary">上传教学文档</el-button>-->
      <div>人员填报</div>
    </el-header>
    <el-main>
      <el-form ref="form" :model="form" label-width="80px">
        <p class="base_title">基本信息</p>
        <el-row>
          <el-col :span="8">
            <el-form-item label="工区">
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="记录人">
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="报审日期">
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
              prop="date"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="证件名称">
            </el-table-column>
            <el-table-column
              prop="address"
              label="证件编号">
            </el-table-column>
            <el-table-column
              prop="address"
              label="发证单位">
            </el-table-column>
            <el-table-column
              prop="address"
              label="有效期">
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
</template>

<script>
export default {
  name: "",
  data() {
    return {
      form: {},
      tableData: []
    };
  },
  methods: {
    addRow() {
      this.tableData.push({});
    }
  }
};
</script>

<style scoped lang="scss">
.container-box {
  .el-header {
    line-height: 60px;
    background-color: #ffffff;
    margin: 0 20px;
    color: black;
    font-size: 22px;
    font-weight: 700;
    text-align: center;
    border-bottom: 1px solid #E8E8E8;
  }
  .el-main {
    background-color: #ffffff;
    margin: 10px 20px;
    padding: 0;

    .el-form {
      //height: 100%;

      .el-form-item {
        margin-bottom: 0;
      }

      .set-margin {
        margin-left: 16px;
      }

      //.submit_table {
      //  max-height: 60%;
      //}
    }

    .base_title {
      font-size: 18px;
      font-weight: 600;
    }
  }
}
</style>
