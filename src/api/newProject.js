/**
 * @Description: 接口加标段ID
 * @author 王海林
 * @date
 */
const apiUrl = {
  //首页数据和公共接口
  getProjectAndSection: "",//获取项目和标段,
  getAreaBySectionId: "/ZhuJiRoad/safe/getGroups",//根据标段ID和用户权限返回工区
  getConstructionWorkersBySectionId: "/ZhuJiRoad/safe/getPersonLiableByGroup",//根据标段ID查询施工人员
  //用户、角色相关
  getUserRoleAndCode: "/ZhuJiRoad/projects/getRoleByUser"
};

import request from "@/utils/request";

//-------------------公共数据接口------------------------
/**
 * @Description: 根据标段ID和用户权限返回工区
 * @author 王海林
 * @date
 */
export const getAreaBySectionId = (id) => {
  return request({
    url: apiUrl.getAreaBySectionId,
    method: "post",
    data: {},
    params: {
      projectId: id
    }
  });
};
/**
 * @Description:根据标段ID查询施工人员
 * @author 王海林
 * @date
 */
export const getConstructionWorkersBySectionId = (projectId,group) => {
  return request({
    url: apiUrl.getConstructionWorkersBySectionId,
    method: "post",
    data: {},
    params: {
      projectId,
      group
    }
  });
};
//------------------- 用户、角色相关--------------------------
/**
 * @Description: 获取用户角色信息和父级角色code
 * @author 王海林
 * @date
 */
export const getUserRoleAndCode = (id) => {
  return request({
    url: apiUrl.getUserRoleAndCode,
    method: "post",
    data: {},
    params: {
      projectId: id
    }
  });
};
