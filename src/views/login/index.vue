<template>
  <div class="login-container">
    <!-- #636 lrj 2023-09-12 -->
    <img src="../../assets/image/logo111.png" alt="logo" class="logo-box" />
    <div class="title-container">
      <h3 class="title">{{ systemName }}</h3>
    </div>
    <div class="title-loginForm">
    </div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
      label-position="left">
      <el-form-item prop="username" class="login-form-item" style="margin-top: 60px;">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input ref="username" v-model="loginForm.username" placeholder="请输入用户名" name="username" type="text"
          tabindex="1" auto-complete="off" />
      </el-form-item>
      <el-form-item prop="password" class="login-form-item">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="请输入密码"
          name="password" tabindex="2" auto-complete="off" @keyup.enter.native="handleLogin" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <div class="codeWrapper" v-if="captchaEnabled">
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 53%"
            @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          </el-input>

        </el-form-item>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </div>


      <el-button class="login-form-item" :loading="loading" type="primary"
        style="width: 100%; margin-top: 26px;font-size: 18px; font-weight: 400;"
        @click.native.prevent="handleLogin">登陆</el-button>
    </el-form>
    <div class="company-name"> {{ companyName }}</div>
  </div>
</template>

<script>
import { getSystemName } from "@/api/system";
import { getCodeImg } from "@/api/user";
export default {
  name: "Login",
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入用户名" },
        ],
        password: [{ required: true, trigger: "blur", validator: validatePassword }],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      codeUrl: "",
      // 验证码开关
      captchaEnabled: true,
      loading: false,
      passwordType: "password",
      redirect: undefined,
      systemName: "全生命xx周期智慧建设平台",
      companyName: "池州xx建设投资集团有限公司 · 池州建投建筑科技有限公司",
    };
  },
  mounted() {
    this.resetForm();
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     this.redirect = route.query && route.query.redirect
    //   },
    //   immediate: true
    // }
  },
  created() {
    this.getCode();
    this.updateSystemName();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.data.img;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    },
    updateSystemName() { 
      getSystemName('system_name').then((res) => {
        const sysNames = res.msg.split(",");
        const sysNamesObj ={
          systemName:sysNames[0],
          companyName:sysNames[1],
          layoutCompanyName:sysNames[2],
          ViewsHeaderCompanyName:sysNames[3],
        }
        localStorage.setItem("sysNames",JSON.stringify(sysNamesObj));
        console.log(sysNamesObj)
        this.systemName = sysNamesObj.systemName;
        // #1122 浏览器上的标题动态改动 lrj 需要合所有分支
        document.title= this.systemName
        this.companyName = sysNamesObj.companyName;
      })
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // this.$store.dispatch('user/getUserRights', this.loginForm).then((res) => {
          this.$store
            .dispatch("user/login", this.loginForm)
            .then((res) => {
              console.log("handleLogin->then:");
              console.log(res);
              let { userInfo } = res.data;
              if (userInfo) {
                this.loading = false;
                this.$router.push("/home");
              } else {
                this.loading = false;
                this.$message({
                  message: "用户不存在，请检查是否输入正确",
                  type: "warning",
                  customClass: "message_override"
                });
              }
            })
            .catch((errRes) => {
              console.log("handleLogin->catch:");
              console.log(errRes);
              if (this.captchaEnabled) {
                this.getCode();
              }
              if (errRes.message)
                this.$message({
                  message: errRes.message,
                  type: "warning",
                  customClass: "message_override"
                });
            });
          this.loading = false;
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs["loginForm"].resetFields();
    },
  },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  // background: url("../../assets/image/bj.jpg") no-repeat;
  background: url("../../assets/image/bg_main.png") no-repeat;
  background-size: 100% 100%;

  .logo-box {
    width: 250px;
    //height: 50px;
    position: fixed;
    top: 0;
    left: 0;
  }

  .company-name {
    color: #88a2c5;
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 18px;
    font-family: AlibabaPuHuiTiR;
    color: #FFFFFF;
    line-height: 25px;
  }

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      //caret-color: $cursor;
    }
  }

  .el-form-item {
    border: 1px solid #0e4f94;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}


input:-internal-autofill-selected {
  appearance: menulist-button;
  background-image: none !important;
  background-color: transparent !important;
  color: fieldtext !important;
}

.el-input__inner:-webkit-autofill,
.el-input__inner:-webkit-autofill:hover,
.el-input__inner:-webkit-autofill:focus,
.el-input__inner:-webkit-autofill:active {
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out,
    background-color 99999s ease-out;
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 430px;
    max-width: 100%;
    padding: 0 80px 0;
    margin: 0 auto;
    overflow: hidden;
    height: 364px;
    background: rgba(0, 21, 61, 0.7);

    // login_form_input
    .login-form-item {
      background: url(../../assets/image/login_form_input.png) no-repeat;
      background-size: 100% 100%;
      width: 270px;
      height: 50px;
      border: unset;
      border-radius: unset;
      margin-bottom: 24px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $light_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;
    //#636 lrj 2023-9-12
    //background: url("../../assets/image/sys_title.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    // width: 344px;
    height: 74px;

    .title {
      letter-spacing: 5px;
      font-size: 36px;
      color: $light_gray;
      margin: 250px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .title-loginForm {
    position: relative;
    background: url("../../assets/image/title-loginForm.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    width: 430px;
    height: 40px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    // user-select: none;
  }
}

.codeWrapper {
  display: flex;
  flex-direction: row;
}

.login-code {
  width: 43%;
  height: 47px;
  float: right;
  position: relative;
  margin-left: 10px;

  img {
    cursor: pointer;
    vertical-align: middle;
    position: absolute;
    right: 0px;
    height: 47px;
    width: 100px;
  }
}

.login-code-img {
  height: 38px;
}
</style>
