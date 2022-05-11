/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-03-16 09:31:09
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 19:53:49
 */
import api from "./index";
import request from "@/utils/request";

export const getWorkPoint = () => {
  return request({
    url: api.getWorkPoint,
    method: "post",
    data: {},
  });
};
export const addWorkPoint = (data) => {
  return request({
    url: api.addWorkPoint,
    method: "post",
    data,
  });
};
export const updateWorkPoint = (data) => {
  return request({
    url: api.updateWorkPoint,
    method: "post",
    data,
  });
};
export const deleteWorkPoint = (id) => {
  return request({
    url: api.deleteWorkPoint,
    method: "post",
    params: {
      id,
    },
  });
};
//------------------------- 工点结束 -----------------------
//-----------------------岗位管理开始 ----------------------------
export const getAllPost = () => {
  return request({
    url: api.getAllPost,
    method: "post",
    data: {}
  });
};
export const addPost = (data) => {
  return request({
    url: api.addPost,
    method: "post",
    data
  });
};
export const deletePost = (id) => {
  return request({
    url: api.deletePost,
    method: "post",
    data: {},
    params: {
      id
    }
  });
};
export const updatePost = (data) => {
  return request({
    url: api.updatePost,
    method: "post",
    data
  });
};
