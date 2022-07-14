<template>
  <el-container>
    <el-header></el-header>
    <el-main>
      <el-table
        :data="tableData"
        style="width: 100%"
        height="100%"
        class="have_scrolling"
        ref="multipleTableUser"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="NAME" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="NEWPOST" label="岗位" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
<!--          <template slot-scope="{ row }">-->
          <!--            <el-button type="primary" size="mini" @click="seeAuthority(row)"-->
          <!--            >查看权限-->
          <!--            </el-button-->
          <!--            >-->
          <!--          </template>-->
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
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

</style>
