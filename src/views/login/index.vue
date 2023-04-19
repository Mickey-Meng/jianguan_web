<template>
  <div class="login-container">
    <img src="../../assets/image/logo.png" alt="logo" class="logo-box" />
    <div class="title-container">
      <h3 class="title">全生命周期智慧建设管理平台</h3>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="off"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登陆</el-button
      >
    </el-form>
    <div class="company-name">池州建设投资集团有限公司</div>
  </div>
</template>

<script>
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
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
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
  methods: {
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
    font-size: 20px;
    color: #88a2c5;
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
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

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #00051D inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
    input:-webkit-autofill,
    textarea:-webkit-autofill,
    select:-webkit-autofill {
      /*覆盖背景颜色*/
      -webkit-box-shadow: 0 0 0px 1000px #00051D inset !important;
      /*字体颜色重置*/
      // -webkit-text-fill-color: #c62222 !important;
    }
    input:-internal-autofill-selected{
      background-color: #00051D !important;
    }
    input[type="text"]:focus,
    input[type="password"]:focus,
    textarea:focus {
      -webkit-box-shadow: 0 0 0 1000px #00051D inset !important;
    }
  }

  .el-form-item {
    border: 1px solid #0e4f94;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
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
    width: 520px;
    max-width: 100%;
    padding: 0 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      letter-spacing: 5px;
      font-size: 40px;
      color: $light_gray;
      margin: 250px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
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
</style>
