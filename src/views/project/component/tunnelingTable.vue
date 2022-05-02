<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-07 09:29:16
-->
<template>
  <div class="wrapperbox">
    <el-table
      :data="tableData"
      style="width: 100%"
      height="100%"
      class="bim-table"
    >
      <!-- <el-table-column prop="name" label="单位工程"> </el-table-column> -->
      <el-table-column prop="name" label="分项名称"> </el-table-column>
      <el-table-column prop="count" label="设计数量"> </el-table-column>
      <el-table-column prop="todayFinish" :label="label"> </el-table-column>
      <el-table-column prop="finish" label="累计完成"> </el-table-column>
      <el-table-column prop="rate" label="累计完成比例"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    type: {
      type: Number,
      default: 3,
    },
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      tableData: [],
      label: "当周完成",
    };
  },
  created() {
    this.initData();
  },
  methods: {
    exportTable() {
      this.$message({
        message: "加急开发中，请等待",
        type: "info",
        customClass: "message_override",
      });
    },
    initData() {
      const data = this.info.SD || [];
      data.forEach((item) => {
        if (item.count && item.finish) {
          item.rate =
            Math.floor((item.finish / item.count) * 10000) / 100 + "%";
          item.yearRate = "100%";
          item.yearPlanRate = "100%";
        } else {
          item.rate = "0.00%";
          item.yearRate = "100%";
          item.yearPlanRate = "100%";
        }
      });
      this.tableData = data;
    },
  },
  watch: {
    type(n, o) {
      if (n === 3) {
        this.label = "当周完成";
      } else if (n === 4) {
        this.label = "当月完成";
      }
    },
    info() {
      this.initData();
    },
  },
};
</script>

<style scoped lang="scss">
.wrapperbox {
  height: 100%;
}
::v-deep .el-table {
  &::after {
    background-color: transparent !important;
  }
  &::before {
    background-color: transparent !important;
  }
}
</style>
