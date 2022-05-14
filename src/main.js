/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:27
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-08 20:01:53
 */
import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import dataV from "@jiaminghi/data-view";

import "@/styles/index.scss"; // global css
import "@/plugins/others";
import "viewerjs/dist/viewer.css";

import App from "./App";
import store from "./store";
import router from "./router";
import axios from "axios";
import "@/icons"; // icon
import "@/permission"; // permission control
import "@/utils/geturl";

import "@/assets/css/common.css"


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(ElementUI);
Vue.use(dataV);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
