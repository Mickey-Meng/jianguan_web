/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-03-08 19:59:56
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-13 09:29:07
 */
import store from "../store";
(function() {
  if (process.env.NODE_ENV === "development") {
    store.commit(
      "settings/SET_URL",
      "http://127.0.0.1:8088/mong/preview?fileid="
    );
  } else {
    //新生产
    store.commit(
      "settings/SET_URL",
      "http://127.0.0.1:8088/mong/preview?fileid="
    );
    //老生产
    // store.commit(
    //   "settings/SET_URL",
    //   "http://101.200.223.171:8085/ZhuJiRoad/mong/preview?fileid="
    // );
  }
})();
