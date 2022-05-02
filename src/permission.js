/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:32
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-28 10:39:28
 */
import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie

import getPageTitle from "@/utils/get-page-title";
const hasToken = getToken("zj_token");

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const LoginPath = ["/login"]; // no redirect whitelist
// const whiteList = getWhiteList(constantRouters); //白名单
// console.log(store)

if (hasToken) {
  store
    .dispatch("user/getUserRights")
    .then(res => {})
    .catch(error => {
      window.localStorage.clear();
      router.push(`/login`);
    });
} else {
  window.localStorage.clear();
  router.push(`/login`);
}

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  let token = getToken("zj_token");
  let rights = getToken("rights");
  document.title = getPageTitle(to.meta.title);
  if (token && rights) {
    if (to.path === "/login") {
      next({ path: "/home" });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          next();
        } catch (error) {
          next(`/login`);
          NProgress.done();
        }
      }
    }
  } else {
    if (LoginPath.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
