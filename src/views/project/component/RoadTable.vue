<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-08 14:26:12
-->
<template>
  <div class="wrapperbox">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      height="100%"
    >
      <!-- <el-table-column prop="date" label="单位工程" /> -->
      <el-table-column prop="date" label="分项名称" />
      <el-table-column prop="name" label="设计数量" />
      <el-table-column prop="address" :label="label" />
      <el-table-column prop="address" label="累计完成" />
      <el-table-column prop="address" label="累计完成比例" />
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
  },
  data() {
    return {
      tableData: [],
      label: "当周完成",
    };
  },
  methods: {
    init() {},
  },
  watch: {
    type(n, o) {
      if (n === 3) {
        this.label = "当周完成";
      } else if (n === 4) {
        this.label = "当月完成";
      }
    },
  },
  methods: {
    exportTable() {
      this.$message({
        message: "加急开发中，请等待",
        type: "info",
        customClass: "message_override",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.wrapperbox {
  height: 100%;
}
//::v-deep .el-table {
//  &::after {
//    background-color: transparent !important;
//  }
//  &::before {
//    background-color: transparent !important;
//  }
//}
</style>
