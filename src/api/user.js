/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:32
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-10 17:29:03
 */
import request from "@/utils/request";
import api from "./index";
/**
 * @des: 更新用户在线状态，3分钟一次
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const updateOnline = () => {
  return request({
    url: api.onlineStatus,
    method: "post"
  });
}

export function loginMap(username, pwd) {
  return request({
    url: `/sysManage/permission/loadMap`,
    method: "get"
  });
}

export function doLogin(data) {
  return request({
    url: api.login,
    method: "post",
    data
  });
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

export function getUserInfo(id) {
  return request({
    url: `/sysManage/permission/loadMenuAndUserInfo`,
    method: "get"
  });
}
export const getServiceRoles = (id) =>{
  return request({
    url: `/userauth/selectRole?projectId=${id}`,
    method: "get"
  });
}
export const getRoles = (id) => {
  return request({
    url: `/projects/getRolesByProject?projectId=${id}`,
    method: "post"
  });
}
export const getMap = (ID, GROUPID, roles) => {
  let r = "";
  for (let i = 0; i < roles.length; i++) {
    r += roles[i].ID + ",";
  }
  r = r.substring(0, r.length - 1);
  return request({
    url: `/map/mapServerConfig/getMyMap?serverType=2,3&userId=${ID}&groupId=${GROUPID}&roleIds=${r}`,
    method: "get"
  });
};
//根据组织id获取用户
export const getUserByGroupId = (groupid, code, name = undefined) => {
  return request({
    url: `/userauth/selectByGroup?pageNumber=1&pageSize=1000&groupid=${groupid}&code=${code}&name1=`,
    method: "get"
  });
};
//根据部门ID获取用户
export const getUserListByDeptId = (queryUserParams) => {
  return request({
    url: '/sysManage/permission/getUserListByDeptId',
    method: "get",
    params: queryUserParams
  });
};

//根据角色id获取用户
export const getUserByRoleId = (projectId, id) => {
  return request({
    url: `/person/getUserByRole?roleid=${id}&projectId=${projectId}`,
    method: "post"
  });
};
//获取组织信息(废弃)
export const getOrgInfo = () => {
  return request({
    url: `/userauth/selectGroup`,
    method: "get"
  });
};
//huoquzuzhi
export const getGroupInfo = (id = 0) => {
  return request({
    // url: `/user/getGroups`,
    url: `/sysManage/permission/getWorkAreaByUserId/` + id,
    method: "get"
  });
};
//绑定用户与组织的关系
export const bindUserToGroup = data => {
  return request({
   // url: `/user/addGroups`,
    url: `/sysManage/permission/addWorkArea`,
    method: "post",
    data
  });
};
//修改用户密码
export const updatePassword = data => {
  return request({
    url: `/user/updatePwd`,
    method: "post",
    data
  });
};
export const getDic = (key) => {
  return request({
    url: `/userauth/selectDicByParentKey?keyStr=${key}`,
    method: "get"
  });
};

/**
 * @Description: 根据标段ID查询用到的所有角色
 * @author 王海林
 * @date
 */
export const getRolesByProject = (id) => {
  return request({
    url: `/projects/getRolesByProject?projectId=${id}`,
    method: "post"
  });
}

/**
 * @Description: 查询每天在线情况
 * @author 王海林
 * @date
 */

export const getDayOnLineData = (date) => {
  return request({
    url: `/user/getOnlineCount?date=${date}`,
    method: "post"
  });
};

export const getUsersByProjectId = (projectId) => {
  return request({
    url: `/userProject/getUsersByProjectId/` + projectId,
    method: "get"
  });
}
//lrj 
export function DictionaryController() {
  return 
}



export function SysPostController() {
  return 
}
export function SystemController() {
  return 
}
