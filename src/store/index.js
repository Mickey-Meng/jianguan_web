/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:26
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-11 10:14:16
 */
import Vue from "vue";
import Vuex from "vuex";
import getters from "./getters";
import app from "./modules/app";
import settings from "./modules/settings";
import user from "./modules/user";
import project from "./modules/project";
import task from "./modules/task";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    project,
    task
  },
  getters
});

export default store;
