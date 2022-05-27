
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
    data: {},
    params
  });
};


///-------------------人员变更----------------------
export const addPersonChange = (data) => {
  return request({
    url: api.addPersonChange,
    method: "post",
    data
  });
};
export const getPersonChange = (id) => {
  return request({
    url: api.getPersonChange,
    method: "post",
    data: {},
    params: {
      projectid: id
    }
  });
};
export const getPersonChangeByProcessId = (params) => {
  return request({
    url: api.getPersonChangeByProcessId,
    method: "post",
    data: {},
    params
  });
};
//------------------请假申请----------------
export const submitLeave = (data) => {
  return request({
    url: api.submitLeave,
    method: "post",
    data
  });
}
export const getLeave = (id) => {
  return request({
    url: api.getLeave,
    method: "post",
    data: {},
    params: {
      projectId: id
    }
  });
};
export const getLeaveByProcessId = (params) => {
  return request({
    url: api.getLeaveByProcessId,
    method: "post",
    data: {},
    params
  });
};
