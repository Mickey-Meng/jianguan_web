<template>
  <div class="wrapper-box">
    <div class="main-menu">
      <ul>
        <li
          v-for="(item, index) in menus"
          :key="index"
          :class="{ 'current-route': item.path === currentPath }"
          @click="changeRouter(item)"
        >
          <img :src="item.meta.icon" alt="" />
          <span>{{ item.meta.title }}</span>
        </li>
      </ul>
    </div>
    <div class="left-again">
      <div class="header-box">
        <div class="leftpart">
          <div class="left-box">
            <el-tooltip
              class="item"
              effect="dark"
              content="返回首页"
              placement="top"
            >
              <svg-icon icon-class="returnb" class="return" @click="goHome" />
            </el-tooltip>
            <div class="leftitem" />
            <a href="javascript:void(0)">
              <template
                ><span>{{ project.name }}</span></template
              >
            </a>
          </div>
          <div class="right-box">
            <!-- <div class="section">
              <Section />
            </div> -->
            <div class="navbar">
              <el-scrollbar wrap-class="scrollbar-wrapper-box">
                <el-menu
                  :default-active="activeMenu"
                  text-color="#fff"
                  :unique-opened="false"
                  active-text-color="#fff"
                  :collapse-transition="false"
                  mode="vertical"
                  class="nav-menu"
                >
                  <sidebar-item
                    v-for="route in currentRoutes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                  />
                </el-menu>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="rightpart">
          <div class="show-date">
            <div class="datecolitem"></div>
            <div class="daterowitem"></div>
            <div class="showtime">{{ nowTime }}</div>
            <div class="shownowdate">
              <div>{{ nowday }}</div>
              <div>{{ nowDate }}</div>
            </div>
          </div>
          <div class="right-menu">
            <el-dropdown>
              <div>
                <svg-icon icon-class="message" class="msg_icon" />
                <el-badge
                  :value="msg.total"
                  :max="99"
                  type="primary"
                  class="item"
                >
                </el-badge>
              </div>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item>
                  工序审核
                  <el-badge :value="12" :max="99" type="primary" class="item">
                  </el-badge>
                </el-dropdown-item> -->
                <el-dropdown-item @click.native="toSafe">
                  安全整改
                  <el-badge
                    :value="msg.safe"
                    :max="99"
                    type="primary"
                    class="item"
                  >
                  </el-badge>
                </el-dropdown-item>
                <el-dropdown-item @click.native="toQuailiy">
                  质量整改
                  <el-badge
                    :value="msg.quality"
                    :max="99"
                    type="primary"
                    class="item"
                  >
                  </el-badge>
                </el-dropdown-item>
                <el-dropdown-item @click.native="toDelay">
                  延期申请
                  <el-badge
                    :value="msg.delay"
                    :max="99"
                    type="primary"
                    class="item"
                  >
                  </el-badge>
                </el-dropdown-item>
                <el-dropdown-item @click.native="doSure">
                  整改确认
                  <el-badge
                    :value="msg.affirm"
                    :max="99"
                    type="primary"
                    class="item"
                  >
                  </el-badge>
                </el-dropdown-item>
                <el-dropdown-item @click.native="toProcess">
                  工序审核
                  <el-badge
                    :value="msg.processNum"
                    :max="99"
                    type="primary"
                    class="item"
                  >
                  </el-badge>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown class="avatar-container" trigger="click">
              <div class="avatar-wrapper">
                <img :src="avatar ? avatar : admin" class="user-avatar" />
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="name"
                  placement="top"
                >
                  <span class="user_name" style="width=200px">{{ name }} </span>
                </el-tooltip>
                <i class="el-icon-caret-bottom" />
              </div>
              <el-dropdown-menu slot="dropdown" class="user-dropdown">
                <el-dropdown-item @click.native="showCodeDialog">
                  修改密码
                </el-dropdown-item>
                <el-dropdown-item @click.native="systemManagement">
                  系统管理
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout">
                  退出登陆
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
    <!-- 系统管理 -->
    <system ref="system"></system>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="DialogVisible"
      custom-class="dialog-panel"
      :append-to-body="true"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        size="small"
        label-position="right"
        label-width="120px"
        class="bim-form-panel"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="新密码" prop="pwd">
          <el-input
            v-model="form.pwd"
            placeholder="请输入密码"
            type="password"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码确认" prop="pwdsure">
          <el-input
            v-model="form.pwdsure"
            placeholder="请输入再次输入密码"
            type="password"
          ></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button plain size="mini" class="btn-bg" @click="updateCode"
          >提交</el-button
        >
        <el-button
          plain
          size="mini"
          class="btn-bg"
          @click="DialogVisible = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { removeToken, getToken } from "@/utils/auth";
import admin from "@/assets/image/admin.png";
import SidebarItem from "../Sidebar/SidebarItem";
import Section from "./section";
import system from "@/views/system/index.vue";
import { getSupervisorMsg, getConstructionMsg } from "@/api/data";
import { updatePassword } from "@/api/user";
import variables from "@/styles/variables.scss";
import { getNowDatehs, getDay, getCurrentDate } from "../../../utils/date";
export default {
  data() {
    return {
      admin: admin,
      TopSysNameValue: "诸暨交投全生命周期智慧建设管理平台",
      DialogVisible: false,
      routes: [],
      currentRoutes: [],
      currentPath: "/",
      nowTime: "",
      nowDate: "",
      nowday: "",
      websockLink: "",
      msg: {
        quality: null,
        safe: null,
        delay: null,
        affirm: null,
        processNum: null,
        total: null,
      },
      websock: null,
      rules: {
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
        pwdsure: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
        ],
      },
      form: {},
    };
  },
  created() {
    this.initMsg();
    this.initRouters();
  },
  computed: {
    ...mapGetters(["device", "avatar", "menus", "project", "name"]),
    variables() {
      return variables;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
  mounted() {
    if (process.env.NODE_ENV === "development") {
      this.websockLink =
        "ws://192.168.2.147:8720/imserver/" + getToken("zj_token");
    } else {
      this.websockLink =
        "wss://system.zlskkj.com:59030/ZhuJiRoad/imserver/" +
        getToken("zj_token");
    }
    this.initWebSocket();
    setInterval(() => {
      this.nowTime = getNowDatehs();
    }, 1000);
    this.nowDate = getCurrentDate();
    switch (getDay()) {
      case 1:
        this.nowday = "星期一";
        break;
      case 2:
        this.nowday = "星期二";
        break;
      case 3:
        this.nowday = "星期三";
        break;
      case 4:
        this.nowday = "星期四";
        break;
      case 5:
        this.nowday = "星期五";
        break;
      case 6:
        this.nowday = "星期六";
        break;
      case 0:
        this.nowday = "星期天";
        break;
    }
  },
  methods: {
    initRouters(name) {
      let routeName = "";
      if (name) {
        routeName = name;
      } else {
        routeName = this.$route.name;
      }
      let rou = null;
      this.menus.forEach((route) => {
        let obj = route.children.find((e) => e.name === routeName);
        if (obj) {
          rou = route;
        }
      });
      this.currentRoutes = rou.children;
      this.currentPath = rou.path;
    },
    initWebSocket() {
      this.websock = new WebSocket(this.websockLink);
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log("WebSocket连接成功");
    },
    websocketonerror(e) {
      console.log("WebSocket连接发生错误");
    },
    websocketonmessage(e) {
      console.log("接收到新的消息");
      this.initMsg();
    },
    websocketclose(e) {
      console.log("关闭");
      this.websock.close();
    },
    logout() {
      window.localStorage.clear();
      this.$router.push(`/login`);
    },
    changeRouter(item) {

      if (item.children.length > 0) {
        this.currentRoutes = item.children;
        if (item.children && item.children.length > 0) {
          let o = item.children[0];
          this.$router.push(o.path);
        }
        this.currentPath = item.path;
      }
    },
    goHome() {
      this.$router.push("/home");
    },
    systemManagement() {
      let groupId = getToken("groupId");
      if ([2].includes(groupId)) {
        this.$refs.system.showDrawer();
      } else {
        this.$message({
          message: "您没有权限",
          type: "warning",
          customClass: "message_override",
        });
      }
    },
    initMsg() {
      getSupervisorMsg().then((res1) => {
        let {
          delayQualityEvent,
          delaySafeEvent,
          doRectificationQualityEvent,
          doRectificationSafeEvent,
          processFilling,
        } = res1.data;
        let deqNum = delayQualityEvent?.length || 0;
        let desNum = delaySafeEvent?.length || 0;
        let drqNum = doRectificationQualityEvent?.length || 0;
        let drsNum = doRectificationSafeEvent?.length || 0;
        let processNum = processFilling?.length || 0;
        getConstructionMsg().then((res2) => {
          let { zjQualityEventList, zjSafeEventList } = res2.data;
          let sEvets = zjSafeEventList?.length || 0;
          let qEvets = zjQualityEventList?.length || 0;
          let delay = deqNum + desNum;
          let affirm = drqNum + drsNum;
          let total = delay + affirm + sEvets + qEvets + processNum;
          this.msg = {
            quality: qEvets ? qEvets : null,
            safe: sEvets ? sEvets : null,
            delay: delay ? delay : null,
            affirm: affirm ? affirm : null,
            total: total ? total : null,
            processNum: processNum ? processNum : null,
          };
        });
      });
    },
    showCodeDialog() {
      this.form = {};
      this.DialogVisible = true;
    },
    updateCode() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.pwd === this.form.pwdsure) {
            updatePassword({ pwd: this.form.pwd }).then((res) => {
              this.$message({
                message: "修改密码成功，请重新登陆",
                type: "success",
                customClass: "message_override",
              });
              this.logout();
            });
          } else {
            this.$message({
              message: "两次密码输入不一致，请确认",
              type: "warning",
              customClass: "message_override",
            });
          }
        } else {
          return false;
        }
      });
    },
    toSafe() {
      this.$router.push("/safetyMeasures");
      this.initRouters("safetyMeasures");
    },
    toQuailiy() {
      this.$router.push("/qualityImprovement");
      this.initRouters("qualityImprovement");
    },
    toDelay() {
      this.$confirm("请选择?", "延期申请", {
        cancelButtonText: "质量延期申请",
        confirmButtonText: "安全延期申请",
        customClass: "ceshi",
        type: "warning",
      })
        .then(() => {
          this.$router.push("/securityCheck");
          this.initRouters("securityCheck");
        })
        .catch(() => {
          this.$router.push("/processCheck");
          this.initRouters("processCheck");
        });
    },
    doSure() {
      this.$confirm("请选择?", "整改确认", {
        cancelButtonText: "质量整改确认",
        confirmButtonText: "安全整改确认",
        customClass: "ceshi",
        type: "warning",
      })
        .then(() => {
          this.$router.push("/rectificationConfirm");
          this.initRouters("rectificationConfirm");
        })
        .catch(() => {
          this.$router.push("/qualityConfirmation");
          this.initRouters("qualityConfirmation");
        });
    },
    toProcess() {
      this.$router.push("/processAudit");
      this.initRouters("processAudit");
    },
  },
  components: {
    SidebarItem,
    Section,
    system,
  },
  destroyed() {
    this.websocketclose();
  },
};
</script>

<style lang='scss' scoped>
.header-box {
  color: #fff;
  font-size: 18px;
  // background-color: #060C26;
  display: flex;
  height: 60px;
  justify-content: space-between;
  .leftpart {
    display: flex;
    width: calc(100% - 470px);
    .left-box {
      width: 400px;
      display: flex;
      align-items: center;
      height: 60px;
      font-size: 20px;
      .return {
        // margin-left: 30px;
        width: 25px;
        height: 25px;
        cursor: pointer;
      }
      .leftitem {
        margin: 0 12px;
        width: 3px;
        height: 28px;
        background: #7ceff6;
      }
      a {
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 60px;
        cursor: pointer;
        text-decoration: none;
        overflow: hidden;

        img {
          width: 40px;
          height: 40px;
          vertical-align: middle;
          margin-right: 7px;
        }

        span {
          display: inline-block;
          margin: 0;
          font-weight: 600;
          line-height: 60px;
          vertical-align: middle;
        }
      }
    }
    .right-box {
      // margin-left: 30px;
      display: flex;
      width: calc(100% - 410px);
      align-items: center;
      .navbar {
        // height: 40px;
        width: 100%;
        ::v-deep.el-scrollbar {
          .el-scrollbar__bar.is-vertical {
            display: none;
          }
        }
        ::v-deep .el-scrollbar__wrap {
          overflow-x: auto;
          height: calc(100% + 10px); //多出来的20px是横向滚动条默认的样式
        }
        ::v-deep .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
          white-space: nowrap;
          display: inline-block;
        }
        ::v-deep .scrollbar-wrapper-box {
          .el-scrollbar__view {
            .el-menu {
              display: flex;
              align-items: center;
              border-right: none;
              background: none;
              .el-menu-item {
                text-align: center;
                height: 40px;
                line-height: 40px;
                // width: 105px;
                overflow: hidden;
                margin-right: 15px;
                background-image: url(../../../assets/image/navitembg.png);
                background-size: 100% 100%;
                &:hover {
                  background-color: transparent;
                }
                &:focus {
                  background-color: transparent;
                }
              }
              .el-menu-item.is-active {
                background-image: url(../../../assets/image/activebg.png);
              }
            }
          }
        }
        ::v-deep .el-icon-arrow-down {
          &:before {
            margin-left: 60px;
          }
        }
      }
    }
  }
  .rightpart {
    display: flex;
    width: 470px;
    .show-date {
      display: flex;
      align-items: center;
      margin-right: 15px;
      // margin-left: 20px;
      .datecolitem {
        width: 3px;
        height: 28px;
        background: #ffffff;
        opacity: 0.5;
      }
      .daterowitem {
        margin-left: 10px;
        margin-right: 10px;
        margin-top: -20px;
        width: 10px;
        height: 2px;
        background: #446edc;
      }
      .showtime {
        width: 131px;
        font-size: 30px;
        font-family: DINPro;
        font-weight: 500;
        color: #ffffff;
        line-height: 62px;
      }
      .shownowdate {
        font-size: 12px;
        font-family: Microsoft YaHei UI;
        font-weight: 300;
        color: #ffffff;
        div {
          margin: 5px 0;
          width: 65px;
        }
      }
    }
    .right-menu {
      // background-color: #060C26;
      float: right;
      height: 100%;
      flex: 1;
      // width: 250px;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      // border-bottom: 1px solid #1E374B;
      .msg_icon {
        width: 40px;
        height: 40px;
        vertical-align: middle;
        cursor: pointer;
        &:focus {
          outline: none;
        }
      }
      &:focus {
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;
        &.hover-effect {
          cursor: pointer;
          transition: background 0.3s;
          &:hover {
            background: rgba(0, 0, 0, 0.025);
          }
        }
      }
      .avatar-container {
        margin-right: 30px;
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          display: flex;
          align-items: center;
          .user_name {
            color: #ffffff;
          }
          .user-avatar {
            cursor: pointer;
            width: 30px;
            height: 30px;
            vertical-align: middle;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
}

.main-menu {
  flex: 1;
  ul {
    border: 1px solid #1e374b;

    height: 100%;
    display: flex;
    align-items: center;
    overflow: auto;
    background: url("../../../assets/image/menubg.png") no-repeat;
    background-size: 100% 100%;
    li {
      display: flex;
      justify-content: space-evenly;
      text-align: center;
      line-height: 48px;
      height: 48px;
      cursor: pointer;
      width: 156px;
      font-size: 15px;
      font-weight: 600;
      text-align: center;
      //padding: 0 25px;
      // background: url("../../../assets/image/header-bg.png") no-repeat;
      background-size: 100% 100%;
    }

    .current-route {
      background: url("../../../assets/image/menuactivebg.png") no-repeat;
      background-size: 100% 100%;
    }
  }
}

//
//   .el-dropdown-menu{
//   padding: 0px;
//   min-width: 140px;
//   background-color: #060C26;
//   color: #fff;
//   border-radius: 5px;
//   border: 1px solid #00F6FF;
//
//   .el-dropdown-menu__item{
//     padding: 0;
//     margin: 0;
//   }
// }
//   .el-dropdown-menu__item--divided {
//   border-top: 0px;
//   color: #fff;
//   text-align: center;
//   &:hover{
//     background-color:#060C26;
//   }
//
// }
//.el-dropdown-menu__item--divided:before {
//   background-color:#060C26;
//   margin: 0px;
//   height:0px;
// }
//  ::v-deep .popper__arrow::after {
//     border-bottom-color: #00F6FF !important;
//     top: 0px !important;
//   }
//
//  ::v-deep.popper__arrow {
//     border-bottom-color: #00F6FF !important;
//   }

.bottom-box {
  // background-color: #060C26;
  height: 40px;
  width: 100%;
  display: flex;
  .section {
    width: 380px;
    height: 40px;
    // border-bottom: 1px solid #1E374B;
  }
  .second-navbar {
    height: 40px;
    flex: 1;
    // border: 1px solid #1E374B;
    // border-top: none;
    .el-scrollbar {
      height: 100%;
      .el-scrollbar__bar {
        display: none;
      }
    }

    ::v-deep .scrollbar-wrapper-box {
      // background-color: #060C26;
      overflow: hidden;
      .el-scrollbar__view {
        .el-menu {
          display: flex;
          border-right: none;
          .el-menu-item {
            height: 40px;
            line-height: 40px;
          }
        }
      }
    }
  }
}
</style>
