<template>
  <div class="wrapper">
    <!-- <dv-border-box-12> -->
    <div class="header_g">
      <div class="title_item"></div>
      <div class="title_text">关联单位</div>
    </div>
    <el-table
      :data="lists"
      style="width: 90%"
      class="bim-table"
      height="70%"
      :show-header="false"
    >
      <el-table-column prop="title" width="110px">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" />
    </el-table>
    <!-- </dv-border-box-12> -->
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      lists: [
        {
          title: "管理单位",
          name: "诸暨市建设集团有限公司",
        },
        {
          title: "建设单位",
          name: "诸暨市交通基础设施建设有限公司",
        },
        {
          title: "全过程咨询单位",
          name: "浙江公路水运工程咨询有限责任公司",
        },
        {
          title: "监理单位",
          name: "浙江交科公路水运工程监理有限公司",
        },
        {
          title: "设计单位",
          name: "浙江省交通规划设计研究院有限公司",
        },
        {
          title: "施工单位",
          name: "中交上海航道局有限公司",
        },
        {
          title: "施工单位",
          name: "中国交通建设股份有限公司",
        },
        {
          title: "施工单位",
          name: "浙江诸安集团有限公司",
        },
      ],
    };
  },
  created() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.wrapper {
  // margin-top: 19px;
  height: 100%;
  background-image: url(../../../assets/image/边框-小.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
::v-deep.bim-table {
  background: transparent !important;
  margin-left: 16px;
  .el-table__body-wrapper {
    background: transparent !important;
    tr {
      padding-top: 10px;
      td {
        border: none;
        margin-top: 10px;
        background: #1c1f45;
      }
    }
  }
}
::v-deep .el-table {
  tr {
    background-color: transparent !important;
  }
  &::after {
    background-color: transparent !important;
  }
  &::before {
    background-color: transparent !important;
  }
}
</style>
