<template>
  <div>
    <!--    <logo v-if="showLogo" :collapse="isCollapse" />-->
    <!--    <div class="projectName">-->
    <!--      <div class="name">{{ project.name }}</div>-->
    <!--    </div>-->
    <div class="menu_box_w">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="false"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          @select="checkItem"
          mode="vertical"
        >
          <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
        </el-menu>
      </el-scrollbar>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import {
		setToken
	} from "@/utils/auth";

export default {
  components: {SidebarItem, Logo},
  data() {
    return {
      routes: []
    };
  },
  created() {
    this.routes = this.menus;

  },
  computed: {
    ...mapGetters(["device", "avatar", "menus", "project", "name"]),
    activeMenu() {
      const route = this.$route;
      const {meta, path} = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables;
    },
    isCollapse() {
      // return !this.sidebar.opened
    }
  },
  methods:{
    checkItem(){
        setToken("historyData", null);
    }
  }
}
</script>
<style lang="scss" scoped>
  .projectName {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #fff;

    .name {
      color: black;
      font-size: 24px;
      font-weight: 600;
    }
  }

  .menu_box_w {
    //height: calc(100% - 80px);
    height: 100%;
    overflow: hidden;

  ::v-deep  .el-scrollbar {
      height: 100%;

      .el-scrollbar__view {
        .el-submenu__title {
          padding-left: 40px !important;
          font-size: 16px;

          .nav_title_name {
            margin-left: 17px;
            letter-spacing: 3px;
            font-weight: bold;
            //font-family: PingFang SC;
          }

          &:hover {
            background-color: #fff !important;
          }
        }

        .nest-menu {
          padding-left: 10px !important;

          .el-menu-item {
            padding-left: 64px !important;
            font-size: 14px;

            &:hover {
              background-color: #fff !important;
            }

            .nav_title_name {
              margin-left: 17px;
              font-weight: 500;
              letter-spacing: 3px;
            }
          }
          .el-menu-item.is-active{
            background-color: #EAF0F9 !important;
            border-radius: 24px 0px 0px 24px !important;
          }
        }

      }

    .el-submenu.is-active > .el-submenu__title {
      color: #1E6EEB !important;
    }

    .el-submenu.is-active > .el-submenu__title i {
      color: #1E6EEB !important;
    }
  }

  }
  ::v-deep.svg-icon {
    vertical-align: -0.2em ;
  }

</style>
