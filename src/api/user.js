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
    url: api.tellOnline,
    method: "post"
  });
}

export function loginMap(username, pwd) {
  return request({
    url: `/index/loadMap`,
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

export function getUserInfo(id) {
  return request({
    url: `/index/loadMenuAndUserInfo`,
    method: "get"
  });
}
export const getServiceRoles = () =>{
  return request({
    url: `/STSfmzj/userauth/selectRole`,
    method: "get"
  });
}
export const getRoles = (id) => {
  return request({
    url: `/ZhuJiRoad/projects/getRolesByProject?projectId=${id}`,
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
    url: `/STSfmzj/mapConfig/getMyMap?type=2,3&userid=${ID}&groupId=${GROUPID}&rolesId=${r}`,
    method: "get"
  });
};
//根据组织id获取用户
export const getUserByGroupId = (groupid, code, name = undefined) => {
  return request({
    url: `/STSfmzj/userauth/selectByGroup?pageNumber=1&pageSize=1000&groupid=${groupid}&code=${code}&name1=`,
    method: "get"
  });
};
//根据角色id获取用户
export const getUserByRoleId = (projectId, id) => {
  return request({
    url: `/ZhuJiRoad/person/getUserByRole?roleid=${id}&projectId=${projectId}`,
    method: "post"
  });
};
//获取组织信息
export const getOrgInfo = () => {
  return request({
    url: `/STSfmzj/userauth/selectGroup`,
    method: "get"
  });
};
//huoquzuzhi
export const getGroupInfo = (id = 0) => {
  return request({
    url: `/ZhuJiRoad/user/getGroups`,
    method: "post",
    params: {
      userId: id
    }
  });
};
//绑定用户与组织的关系
export const bindUserToGroup = data => {
  return request({
    url: `/ZhuJiRoad/user/addGroups`,
    method: "post",
    data
  });
};
//修改用户密码
export const updatePassword = data => {
  return request({
    url: `/ZhuJiRoad/user/updatePwd`,
    method: "post",
    data
  });
};
export const getDic = (key) => {
  return request({
    url: `/STSfmzj/userauth/selectDicByParentKey?keyStr=${key}`,
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
    url: `/ZhuJiRoad/projects/getRolesByProject?projectId=${id}`,
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
    url: `/ZhuJiRoad/user/getOnlineCount?date=${date}`,
    method: "post"
  });
};
