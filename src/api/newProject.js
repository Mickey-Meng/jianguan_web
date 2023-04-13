/**
 * @Description: 接口加标段ID
 * @author 王海林
 * @date
 */
const apiUrl = {
  //首页数据和公共接口
  getProjectAndSection: "/projects/getProjects",//获取项目和标段,
  getAreaBySectionId: "/safe/getGroups",//根据标段ID和用户权限返回工区
  getConstructionWorkersBySectionId: "/safe/getPersonLiableByGroup",//根据标段ID查询施工人员
  //用户、角色相关
  getUserRoleAndCode: "/projects/getRoleByUser"
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
export const getProjectAndSection = () => {
  return request({
    url: apiUrl.getProjectAndSection,
    method: "post"
  });
};
/**
 * @Description: 查询项目、包含标段信息
 * @author 王海林
 * @date
 */
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
