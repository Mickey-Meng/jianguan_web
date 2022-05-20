<template>
  <div class="wrapper">
    <div class="header">
      <div class="global_text_style">关联单位</div>
    </div>
    <div class="table-wrp">
      <el-table :data="lists" stripe style="width: 100%" height="100%" :show-header="false">
        <el-table-column
          prop="title"
          width="120">
        </el-table-column>
        <el-table-column
          prop="name" show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <!--    <ul class="table-wrp">-->
    <!--      <li v-for="(item,index) in lists" :key="index">-->
    <!--        <el-tooltip class="item" effect="dark" :content="item.title + ':' + item.name" placement="top">-->
    <!--          <span> {{ item.title }}:{{ item.name }}</span>-->
    <!--        </el-tooltip>-->
    <!--      </li>-->
    <!--    </ul>-->
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
    padding: 5px;
    height: 100%;
    width: 100%;
  }

  .table-wrp {
    height: calc(100% - 30px);
    border: 1px solid #E8E8E8;
    border-radius: 10px;
    padding: 5px;
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

    //li {
    //  width: 100%;
    //  height: 50px;
    //  line-height: 50px;
    //  background-color: #F6F6F6;
    //  margin-bottom: 5px;
    //  //text-indent: 1em;
    //  padding: 0 10px;
    //  border-radius: 10px;
    //  font-weight: 600;
    //  overflow: hidden;
    //  text-overflow: ellipsis;
    //  white-space: nowrap;
    //  &:hover{
    //    border: 1px solid #395CFB;
    //  }
    //}
  }


  //  ::v-deep .el-table {
  //    tr {
  //      background-color: transparent !important;
  //    }
  //
  //    &::after {
  //    background-color: transparent !important;
  //  }
  //  &::before {
  //    background-color: transparent !important;
  //  }
  //}
</style>
