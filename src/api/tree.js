/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:32
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-01-20 16:41:27
 */
import api from "./index";
import request from "@/utils/request";

export const getBridgeTree = (type, projectId) => {
  return request({
    url: api.bridgeTree,
    method: "get",
    params: {
      type,
      projectId
    }
  });
};

export const getDeptTreeData = () => {
  return request({
    url: '/sysManage/permission/deptTree',
    method: "get",
  });
};
