
import api from "./index";
import request from "@/utils/request";

export const getOrgUser = (params) => {
  return request({
    url: api.getOrgUser,
    method: "post",
    data:{},
    params
  });
};
// export const getUsersRoles = () => {
//   return request({
//     url: api.getUsersRoles,
//     method: "post",
//     data:{}
//   });
// };
export const addStaffApproval = (data) => {
  return request({
    url: api.addStaffApproval,
    method: "post",
    data
  });
};
export const getStaffApprovalBase = (params) => {
  return request({
    url: api.getStaffApprovalBase,
    method: "post",
    data:{},
    params
  });
};

export const getStaffByProcessIdAndProjectId = (params) => {
  return request({
    url: api.getStaffByProcessIdAndProjectId,
    method: "post",
    data:{},
    params
  });
};

