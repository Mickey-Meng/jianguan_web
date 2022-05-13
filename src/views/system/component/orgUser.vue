<template>
  <el-container>
    <el-aside width="30%">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        accordion
        node-key="id"
        :highlight-current="true"
        :expand-on-click-node="false"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <svg-icon icon-class="userInfo" v-if="data.rolename"/>
          <span class="label">{{ node.label }}</span>
          <span class="role_name" v-if="data.rolename">({{ data.rolename || "" }})</span>
        </div>
      </el-tree>
    </el-aside>
    <el-aside width="30%">
      <el-tree
        :data="treeData"
        :props="defaultPostProps"
        accordion
        node-key="id"
        :highlight-current="true"
        :expand-on-click-node="false"
      >
        <!--        <div class="custom-tree-node" slot-scope="{ node, data }">-->
        <!--          <span>{{ node.label }}</span>-->
        <!--          <span class="bth-box" v-if="data.pid === 0">-->
        <!--          <i class="el-icon-plus" @click="addSonDep(data)"></i>-->
        <!--                        <i class="el-icon-edit" @click="updateDep(data)"></i>-->
        <!--                        <i class="el-icon-delete" @click="deleteDep(node,data)"></i>-->

        <!--        </span>-->
        <!--        </div>-->
      </el-tree>
    </el-aside>
    <el-main></el-main>

  </el-container>
</template>

<script>
  import {disposeOrg} from "@/utils/disposeOrg";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        defaultProps: {
          children: "children",
          label: "name"
        },
        defaultPostProps: {
          children: "post",
          label: "name"
        },
        treeData: []
      };
    },
    created() {
      disposeOrg().then(res => {
        console.log(res);
        this.treeData = res;
      });
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
  .custom-tree-node {
    .label {

    }

    .role_name {
      margin-left: 15px;
    }
  }

</style>
