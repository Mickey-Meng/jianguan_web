/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:28
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-20 15:31:42
 */
/**
 * Created by PanJiaChen on 16/11/18.
 */
import store from "@/store/index";
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */

export const validPicurl = url => {
  let arr = [];
  if (url) {
    if (url.indexOf(",") != -1) {
      let a = url.split(",");
      a.forEach(item => {
        let str = store.getters.lookUrl + item;
        arr.push(str);
      });
      return arr;
    } else {
      let str = store.getters.lookUrl + url;
      return [str];
    }
  } else {
    return [];
  }
};

export const disposeUrl = data => {
  let url = "";
  if (data.length > 0) {
    data.forEach(e => {
      let uid = e.response.data;
      url += `${uid},`;
    });
    return url.substring(0, url.lastIndexOf(","));
  } else {
    return url;
  }
};
