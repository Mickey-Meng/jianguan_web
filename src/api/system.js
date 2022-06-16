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

export const getWorkPoint = (projectId) => {
  return request({
    url: api.getWorkPoint,
    method: "post",
    data: {},
    params: {projectId}
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
//-----------------------------岗位结束----------------
//--------------------------组织开始 -------------------

export const addOrganization = (data) => {
  return request({
    url: api.addOrganization,
    method: "post",
    data
  });
};
export const getOrganization = () => {
  return request({
    url: api.getOrganization,
    method: "post",
    data: {}
  });
};
export const deleteOrganization = (id) => {
  return request({
    url: api.deleteOrganization,
    method: "post",
    data: {},
    params: {id}
  });
};
export const updateOrganization = (data) => {
  return request({
    url: api.updateOrganization,
    method: "post",
    data
  });
};
export const bindingUsersToOrganizations = (data) => {
  return request({
    url: api.bindingUsersToOrganizations,
    method: "post",
    data
  });
};
export const getUserBindOrganizations = () => {
  return request({
    url: api.getUserBindOrganizations,
    method: "post",
    data: {}
  });
};
export const getAllOrganization = () => {
  return request({
    url: api.getAllOrganization,
    method: "post",
    data: {}
  });
};

export const getRoleInfoByUserId = (id) => {
  return request({
    url: api.getRoleInfoByUserId,
    method: "post",
    data: {},
    params: {
      projectid: id
    }
  });
};
