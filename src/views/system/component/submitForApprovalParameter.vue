<!--
@name:
@description: 报审台账
@author: 王海林
@time: 2022-08-05 13:38:13
@modifier:
@modifierTime:
-->
<template>
  <el-container>
    <el-header>
      <div>

      </div>

    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        class="have_scrolling"
        ref="multipleTableUser"
      >

      </el-table>
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
  import {adminGetAllStaffRecord} from "@/api/staffApproval";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        tableData: []
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {},
    components: {},
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .el-main {
    padding: 20px 0 0 0 !important;
  }

</style>
