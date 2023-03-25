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
import { mapGetters } from "vuex";
import { getEngCompany } from '@/api/data'
export default {
  name: "",
  data() {
    return {
      lists: [
        {
          title: "管理单位",
          name: "池州建设投资集团有限公司",
        },
        {
          title: "建设单位",
          name: "池州乌沙港口运输有限公司",
        },
        {
          title: "审计单位",
          name: "江苏富华工程造价咨询有限公司",
        },
        {
          title: "监理单位",
          name: "安徽省科兴交通建设工程监理有限公司/池州建投工程管理有限公司",
        },
        {
          title: "设计单位",
          name: "安徽省交通勘察设计院有限公司",
        },
        {
          title: "施工单位",
          name: "中交上海航道局有限公司/中交第二航务工程勘察设计院有限公司",
        }
      ],
    };
  },
  computed: {
    ...mapGetters(["project"]),
  },
  created() {
    this.getEngCompany(this.project.id)
  },
  methods: {
    getEngCompany(id) {
      getEngCompany(id).then((res) => {
        const data = res.data;
        const array = [];
        array.push({
          title: "管理单位",
          name: data.managedpt,
        })
        array.push({
          title: "建设单位",
          name: data.builddpt,
        })
        array.push({
          title: "审计单位",
          name: data.auditUnit,
        })
        array.push({
          title: "监理单位",
          name: data.supervisordpt,
        })
        array.push({
          title: "设计单位",
          name: data.desgindpt,
        })
        array.push({
          title: "施工单位",
          name: data.constructdpt,
        })

        this.lists = array;

      });
    }
  },
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
