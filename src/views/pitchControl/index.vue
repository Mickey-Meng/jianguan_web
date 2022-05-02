<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-09 13:46:00
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-24 17:19:07
-->
<template>
  <el-container class="container-box">
    <el-header>
      <span>跟审记录时间：</span>
      <el-date-picker
        v-model="timeValue"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="选择日期"
      >
      </el-date-picker>
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="bim-table"
        height="95%"
        border
      >
        <el-table-column prop="date" label="序号" align="center">
        </el-table-column>
        <el-table-column prop="name" label="填报时间"> </el-table-column>
        <el-table-column prop="address" label="跟审人员" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center"> </el-table-column>
      </el-table>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      tableData: [],
      timeValue: null,
    };
  },
  methods: {},
};
</script>

<style scoped lang="scss">
.container-box {
  .el-header {
    padding: 0 5px;
    line-height: 60px;
    ::v-deep .el-date-editor {
      margin-right: 5px;

      .el-input__inner {
        height: 30px !important;
        line-height: 30px;
        border: 1px solid rgb(56, 122, 253);
        color: #ffffff;
        background-color: #060c26 !important;
      }
      .el-input__prefix {
        .el-input__icon {
          line-height: 30px;
        }
      }
      .el-input__suffix {
        .el-input__icon {
          line-height: 30px;
        }
      }
    }
  }
  .el-main {
    padding: 0;
  }
}
</style>
