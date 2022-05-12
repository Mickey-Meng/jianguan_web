<template>
  <div class="wrapperbox">
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      height="100%"
    >
      <el-table-column prop="name" label="分项名称" width="100" />
      <el-table-column prop="count" label="设计数量" width="80" />
      <el-table-column prop="todayFinish" :label="label">
        <template slot-scope="{ row }">
          <span>{{ row.todayFinish ? row.todayFinish : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="finish" label="累计完成">
        <template slot-scope="{ row }">
          <span>{{ row.finish ? row.finish : 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="累计完成比例" />
      <el-table-column prop="yearPlanRate" label="年度考核目标" />
      <el-table-column prop="yearPlanRate" label="年度计划完成比例" />
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
  watch: {
    type(n, o) {
      if (n === 3) {
        this.label = "当周完成";
      } else if (n === 4) {
        this.label = "当月完成";
      }
    },
    info(n, o) {
      this.initData();
    },
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
      const data = this.info.QL || [];
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
