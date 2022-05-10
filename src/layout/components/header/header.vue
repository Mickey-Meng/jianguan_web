<template>
  <div class="header_wrapper">
    <div class="search"></div>
    <div class="info_box">
      <div class="show-date">
        <!--        <div class="datecolitem"></div>-->
        <!--        <div class="daterowitem"></div>-->
        <div class="showtime">{{ nowTime }}</div>
        <div class="shownowdate">
          <div>{{ nowday }}</div>
          <div>{{ nowDate }}</div>
        </div>
      </div>
      <div class="right-menu">
        <el-dropdown class="msg_dropdown">
          <div>
            <svg-icon icon-class="message" class="msg_icon"/>
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
            <img :src="avatar ? avatar : admin" class="user-avatar" alt=""/>
            <el-tooltip
              class="item"
              effect="dark"
              :content="name"
              placement="top"
            >
              <span class="user_name">{{ name }} </span>
            </el-tooltip>
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown" class="user-dropdown">
            <el-dropdown-item @click.native="showCodeDialog">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item @click.native="systemManagement">
              系统管理
            </el-dropdown-item>
            <el-dropdown-item @click.native="returnProjects">
              返回多项目
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              退出登陆
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 系统管理 -->
    <system ref="system"></system>
    <!--   修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="DialogVisible"
      :append-to-body="true"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form
        ref="form"
        size="small"
        label-position="right"
        label-width="120px"
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
        >提交
        </el-button
        >
        <el-button
          plain
          size="mini"
          class="btn-bg"
          @click="DialogVisible = false"
        >取消
        </el-button
        >
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {getNowDatehs, getDay, getCurrentDate} from "@/utils/date";
  import {getToken} from "@/utils/auth";
  import {getConstructionMsg, getSupervisorMsg} from "@/api/data";
  import {updatePassword} from "@/api/user";
  import admin from "@/assets/image/admin.png";
  import system from "@/views/system/index.vue";
  import {mapGetters} from "vuex";

  export default {
    props: [],
    watch: {},
    data() {
      return {
        admin: admin,
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
          total: null
        },
        websock: null,
        form: {},
        DialogVisible: false,
        rules: {
          pwd: [{required: true, message: "请输入密码", trigger: "blur"}],
          pwdsure: [
            {required: true, message: "请再次输入密码", trigger: "blur"}
          ]
        }
      };
    },
    created() {
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
    mounted() {
    },
    methods: {
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
      websocketonerror() {
        console.log("WebSocket连接发生错误");
      },
      websocketonmessage() {
        console.log("接收到新的消息");
        this.initMsg();
      },
      websocketclose() {
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
            customClass: "message_override"
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
            processFilling
          } = res1.data;
          let deqNum = delayQualityEvent?.length || 0;
          let desNum = delaySafeEvent?.length || 0;
          let drqNum = doRectificationQualityEvent?.length || 0;
          let drsNum = doRectificationSafeEvent?.length || 0;
          let processNum = processFilling?.length || 0;
          getConstructionMsg().then((res2) => {
            let {zjQualityEventList, zjSafeEventList} = res2.data;
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
              processNum: processNum ? processNum : null
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
              updatePassword({pwd: this.form.pwd}).then((res) => {
                this.$message({
                  message: "修改密码成功，请重新登陆",
                  type: "success",
                  customClass: "message_override"
                });
                this.logout();
              });
            } else {
              this.$message({
                message: "两次密码输入不一致，请确认",
                type: "warning",
                customClass: "message_override"
              });
            }
          } else {
            return false;
          }
        });
      },
      toSafe() {
        this.$router.push("/safetyMeasures");
      },
      toQuailiy() {
        this.$router.push("/qualityImprovement");
      },
      toDelay() {
        this.$confirm("请选择?", "延期申请", {
          cancelButtonText: "质量延期申请",
          confirmButtonText: "安全延期申请",
          customClass: "ceshi",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/securityCheck");
          })
          .catch(() => {
            this.$router.push("/processCheck");
          });
      },
      doSure() {
        this.$confirm("请选择?", "整改确认", {
          cancelButtonText: "质量整改确认",
          confirmButtonText: "安全整改确认",
          customClass: "ceshi",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/rectificationConfirm");
          })
          .catch(() => {
            this.$router.push("/qualityConfirmation");
          });
      },
      toProcess() {
        this.$router.push("/processAudit");
      },
      returnProjects() {
        this.$router.push("/home");
      }
    },
    components: {system},
    computed: {
      ...mapGetters(["device", "avatar", "menus", "project", "name"])
    },
    beforeDestroy() {
    }

  };
</script>

<style lang='scss' scoped>
  .header_wrapper {
    height: 60px;
    display: flex;
    justify-content: space-between;

    .info_box {
      display: flex;
      width: 470px;
      margin-right: 5px;

      .show-date {
        width: 220px;
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
          line-height: 62px;
        }

        .shownowdate {
          font-size: 14px;
          font-family: Microsoft YaHei UI;
          //font-weight: 300;

          div {
            margin: 5px 0;
            width: 85px;
          }
        }
      }
    }

    .right-menu {
      // background-color: #060C26;
      float: right;
      height: 100%;
      //flex: 1;
      width: 250px;
      line-height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      // border-bottom: 1px solid #1E374B;
      .msg_dropdown {
        width: 60px;
      }

      .avatar-container {
        //width: 170px;
        //flex: 1;
      }

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
            color: #000000;
          }

          .user-avatar {
            cursor: pointer;
            width: 50px;
            height: 50px;
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

</style>
