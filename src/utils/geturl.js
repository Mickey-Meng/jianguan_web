/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-03-08 19:59:56
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-13 09:29:07
 */
import store from "../store";

(function () {
  store.commit("settings/SET_URL", process.env.VUE_APP_SERVER_ADDRESS + "/mong/preview?fileid=");
})();
