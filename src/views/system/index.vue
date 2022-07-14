<!--
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-27 21:31:11
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 16:39:25
-->
<template>
  <el-drawer
    title="管理中心"
    :visible.sync="drawer"
    :direction="direction"
    :withHeader="false"
    size="100%"
    :modal="false"
    custom-class="system_management"
  >
    <el-container class="system_wraper_container">
      <el-header>
        <label>管理中心</label>
        <i class="el-icon-close" @click="closeDrawer"></i>
      </el-header>
      <el-main>
        <ul class="left_menu">
          <li
            v-for="(item, index) in options"
            :key="index"
            :class="{ active: item.key === currentView }"
            @click="changeView(item)"
          >
            {{ item.name }}
          </li>
        </ul>
        <div class="right_content">
          <component v-bind:is="currentView"></component>
        </div>
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script>
import siteManage from "@/views/system/component/siteManage";
import authorityManagement from "@/views/system/component/authorityManagement";
import depManagementVue from "./component/depManagement.vue";
import postManagement from "@/views/system/component/postManagement ";
import orgUser from "@/views/system/component/orgUser";
import inLineData from "@/views/system/component/inLineData";
import Bus from "@/assets/eventBus";
export default {
  data() {
    return {
      drawer: false,
      direction: "rtl",
      currentView: "authorityManagement",
      options: [
        {
          name: "工区权限",
          key: "authorityManagement"
        },
        {
          name: "工点管理",
          key: "siteManage"
        },
        {
          name: "上线数据",
          key: "inLineData"
        }
        // {
        //   name: "组织管理",
        //   key: "depManagementVue"
        // },
        // {
        //   name: "组织用户",
        //   key: "orgUser"
        // }
      ],
    };
  },
  created() {
    Bus.$on("closeSystemDrawer", () => {
      this.drawer = false;
    });
  },
  components: {
    siteManage,
    authorityManagement,
    depManagementVue,
    postManagement,
    orgUser, inLineData
  },
  computed: {},
  methods: {
    changeView(item) {
      this.currentView = item.key;
    },
    showDrawer() {
      this.drawer = true;
    },
    closeDrawer() {
      this.drawer = false;
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep.el-drawer__wrapper {
  //top: 80px !important;
  z-index: 999999 !important;
  .el-drawer__body {
    height: 100%;
  }
  .system_management {
    .system_wraper_container {
      background-color: #edeff8;
      height: 100%;
      color: #4a4a4a;
      padding: 10px 20px;
      .el-header {
        padding: 0 20px;
        background-color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        label {
          font-size: 26px;
        }
        i {
          font-size: 30px;
          cursor: pointer;
        }
      }
      .el-main {
        display: flex;
        padding: 20px 0;
        justify-content: space-between;
        .left_menu {
          width: 15%;
          overflow: auto;
          li {
            height: 40px;
            line-height: 40px;
            margin-bottom: 5px;
            cursor: pointer;
            text-align: center;
            background-color: rgb(255, 255, 255);
            border-bottom: 1px solid rgb(230, 232, 234);
            color: rgb(7, 16, 47);
          }
          .active {
            background-color: rgb(233, 244, 252);
          }
        }
        .right_content {
          width: 84.5%;
          .el-container {
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
