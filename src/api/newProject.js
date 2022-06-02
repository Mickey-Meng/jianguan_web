/**
 * @Description: 接口加标段ID
 * @author 王海林
 * @date
 */
const apiUrl = {
  //首页数据和公共接口
  getProjectAndSection: "",//获取项目和标段
  //用户、角色相关
  getUserRoleAndCode: "/ZhuJiRoad/projects/getRoleByUser"
};

import request from "@/utils/request";

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
