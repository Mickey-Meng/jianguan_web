/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-03-16 09:31:09
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-16 10:37:17
 */
import api from "./index";
import request from "@/utils/request";

export const getWorkPoint = () => {
  return request({
    url: api.getWorkPoint,
    method: "post",
    data: {}
  });
};
export const addWorkPoint = data => {
  return request({
    url: api.addWorkPoint,
    method: "post",
    data
  });
};
export const updateWorkPoint = data => {
  return request({
    url: api.updateWorkPoint,
    method: "post",
    data
  });
};
export const deleteWorkPoint = id => {
  return request({
    url: api.deleteWorkPoint,
    method: "post",
    params: {
      id
    }
  });
};
