<template>
  <div class="wrapper">
    <div class="new_ui_header">
      <div class="header_line"></div>
      <div class="header_text">关联单位</div>
    </div>
    <div class="table-wrp" style="padding: 10px;">
      <!-- <el-table :data="lists"  style="width: 100%" height="100%" :show-header="false">
        <el-table-column
          prop="title"
          width="120">
        </el-table-column>
        <el-table-column
          prop="name">
        </el-table-column>
      </el-table> -->
      <div v-for="(item, index) in lists" v-show="item.name" v-bind:key="index" style="height: 48px;
background: #E4E4E44f;line-height: 48px;padding-left: 14px;font-size: 16px;
font-family: AlibabaPuHuiTiR;
color: #11142D;margin-bottom: 8px;
border-radius: 4px;" :title="item.name">{{item.title}}:{{item.name && item.name.slice(0, 20)}}</div>
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
        data.managedpt = data.managedpt || "";
        let _temp = data.managedpt.split(',');
        _temp.forEach(item => {
          array.push({
            title: "管理单位",
            name: item,
          })
        });
        
        data.builddpt = data.builddpt || "";
        _temp = data.builddpt.split(',');
        _temp.forEach(item => {
          array.push({
            title: "建设单位",
            name: item,
          })
        });

        data.auditUnit = data.auditUnit || "";
        _temp = data.auditUnit.split(',');
        _temp.forEach(item => {
          array.push({
            title: "审计单位",
            name: item,
          })
        });

        data.supervisordpt = data.supervisordpt || "";
        _temp = data.supervisordpt.split(',');
        _temp.forEach(item => {
          array.push({
            title: "监理单位",
            name: item,
          })
        });

        data.desgindpt = data.desgindpt || "";
        _temp = data.desgindpt.split(',');
        _temp.forEach(item => {
          array.push({
            title: "设计单位",
            name: item,
          })
        });

        data.constructdpt = data.constructdpt || "";
        _temp = data.constructdpt.split(',');
        _temp.forEach(item => {
          array.push({
            title: "施工单位",
            name: item,
          })
        });

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
    background: #EAF1FF;
    border-radius: 4px 4px 0px 0px;

    .header_line {
      width: 24px;
      height: 24px;
      background-color: #1E6EEB;
      margin-right: 8px;
      border-radius: 3px;
      background: url(../../../assets/image/datacenter_headericon1.svg) no-repeat;
      background-size: cover;
    }

    .header_text {
      color: #2D405E;
      font-size: 18px;
      font-weight: bold;
      font-family: PingFang SC;
      font-size: 16px;
      font-family: AlibabaPuHuiTiM;
      color: #191919;
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
