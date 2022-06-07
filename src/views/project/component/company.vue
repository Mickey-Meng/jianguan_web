<template>
  <div class="wrapper">
    <div class="new_ui_header">
      <div class="header_line"></div>
      <div class="header_text">关联单位</div>
    </div>
    <div class="table-wrp">
      <el-table :data="lists"  style="width: 100%" height="100%" :show-header="false">
        <el-table-column
          prop="title"
          width="120">
        </el-table-column>
        <el-table-column
          prop="name" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
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
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
    border-radius: 15px;
  }

  .new_ui_header {
    display: flex;
    align-items: center;
    padding: 20px 0px 10px 20px;

    .header_line {
      width: 4px;
      height: 16px;
      background-color: #1E6EEB;
      margin-right: 8px;
      border-radius: 3px;
    }

    .header_text {
      color: #2D405E;
      font-size: 18px;
      font-weight: bold;
      font-family: PingFang SC;
    }

  }

  .table-wrp {
    height: calc(100% - 70px);
    overflow: auto;

    ::v-deep.el-table {
      .el-table__body-wrapper {
        height: 100%;
        //.el-table__body{
        //  tbody{
        //    tr{
        //      background-color: #F6F6F6;
        //    }
        //  }
        //}
      }
    }
  }
</style>
