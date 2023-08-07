<template>
  <div class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <div class="box">
      <!--      <Header class="top-menu-box" />-->
      <newHeader class="top_header"></newHeader>

      <div class="wrapper">
        <sidebar class="sidebar_container" />

        <div class="main-container">
          <!--              <div :class="{'fixed-header':fixedHeader}">-->
          <!--                <navbar />-->
          <!--              </div>-->
          <map-container />
        </div>
      </div>
      <div class="company-name">池州建设投资集团有限公司</div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import Header from './components/header/Index'
import MapContainer from './components/MapContainer'
import { updateOnline } from '@/api/user'

import * as api from '@/api/quality'

import newHeader from './components/header/header'

import store from '@/store'

// import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    MapContainer,
    Navbar,
    Sidebar,
    AppMain,
    Header,
    newHeader,
  },
  data() {
    return {
      timer: null,
      tasktimer:null
    }
  },
  // mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    },
  },
  watch: {
    $route() {
      this.checkRoute()
    },
  },
  created() {
    this.checkRoute()
    this.init()
  },
  methods: {
    // handleClickOutside() {
    //   this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    // },
    checkRoute() {
      this.showMap = this.$route.meta.showMap
    },
    upInlineStatus() {
      updateOnline().then((res) => {
        let { isChange } = res.data
        if (isChange === 'true') {
          MessageBox.confirm('用户角色改变,请重新登录', '系统提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            window.localStorage.clear();
            this.$router.push(`/login`);
          })
        }
      })
    },
    updateTaskNum() {
      //待办
      api
        .listHandleTask({
          processDefinitionName: '',
          processDefinitionKey: '',
          taskName: '',
          taskHandleStatus: 1,
          projectId: this.$store.getters.project.parentid,
          pageParam: {
            pageNum: 1,
            totalPage: 1,
            pageSize: 10,
          },
        })
        .then((res) => {
          res.data = res.data || {}
          let agencyNum = res.data.total || 0
        //   console.log('待办任务条数：'+agencyNum);
          store.dispatch('task/updateAgencyNum', agencyNum)
        })
      //抄送
      api
        .listCopyMessage({
          orderParam: [{ fieldName: 'createTime', asc: 1 }],
          pageParam: {
            pageNum: 1,
            totalPage: 1,
            pageSize: 10,
          },
          read: false,
        })
        .then((res) => {
          res.data = res.data || {}
          let copyNum =res.data.total || 0
        //   console.log('抄送任务条数：'+copyNum);
          store.dispatch('task/updateCopyNum', copyNum)
        })
    },
    init() {
      let that = this
      this.upInlineStatus()
      this.updateTaskNum()
      that.timer = setInterval(() => {
        this.upInlineStatus()
      }, 1000 * 60 * 3)

      that.tasktimer = setInterval(() => {
        this.updateTaskNum()
      }, 1000 * 60)
    },
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
    this.tasktimer && clearInterval(this.tasktimer)
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
@import '~@/styles/variables.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.top_header {
  // border-bottom: 1px solid #e8e8e8;
  background: url(../assets/image/project_name_bg.png) no-repeat;
  background-size: cover;
}

.box {
  //width: 100vw;
  //height: 100vh;
  height: 100%;
  width: 100%;
  //display: flex;
  overflow: hidden;

  .wrapper {
    height: calc(100% - 80px) !important;
    //height: 100%;
    position: relative;
    background-color: #fff;
    display: flex;

    .sidebar_container {
      width: 200px;
      background: url(../assets/image/tree_bg.png) no-repeat;
      background-size: cover;
    }

    .main-container {
      width: calc(100% - 200px);
      padding: 2px;
      height: 100%;
      background-color: #eaf0f9;
      //height: calc(100% - 60px) !important;
    }
  }
}

.company-name {
  position: fixed;
  right: 50px;
  bottom: 0;
  font-size: 14px;
  color: #88a2c5;
  z-index: 100000;
}
</style>
