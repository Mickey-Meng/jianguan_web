
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
export const getStaffRecordsById = (projectId, roleType = undefined) => {
  return request({
    url: api.getStaffRecordsById,
    method: "post",
    data: {},
    params: {
      projectId,
      roleType
    }
  });
};
export const deleteStaffRecord = (id, projectId) => {
  return request({
    url: api.deleteStaffRecord,
    method: "post",
    data: {},
    params: {
      id,
      projectId
    }
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
export const getPersonChangeRecords = (projectId, roleType = undefined) => {
  return request({
    url: api.getPersonChangeRecords,
    method: "post",
    data: {},
    params: {
      projectId,
      roleType
    }
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
export const getLeaveRecordsById = (projectId, roleType = undefined) => {
  return request({
    url: api.getLeaveRecordsById,
    method: "post",
    data: {},
    params: {
      projectId,
      roleType
    }
  });
};


//--------------------------电子围栏-------------------
export const addFence = (data) => {
  return request({
    url: api.addFence,
    method: "post",
    data
  });
};
export const updateFence = (data) => {
  return request({
    url: api.updateFence,
    method: "post",
    data
  });
};
export const getFence = (id) => {
  return request({
    url: api.getFence,
    method: "post",
    data: {},
    params: {
      projectId: id
    }
  });
};
export const deleteFence = (pid, id) => {
  return request({
    url: api.deleteFence,
    method: "post",
    data: {},
    params: {
      projectId: pid,
      id
    }
  });
};
//--------------------- 打卡时间制定----------------------
export const addClockTime = (data) => {
  return request({
    url: api.addClockTime,
    method: "post",
    data
  });
};
export const updateClockTime = (data) => {
  return request({
    url: api.updateClockTime,
    method: "post",
    data
  });
};
export const getClockTime = (id) => {
  return request({
    url: api.getClockTime,
    method: "post",
    data: {},
    params: {
      projectId: id
    }
  });
};
export const deleteClockTime = (pid, id) => {
  return request({
    url: api.deleteClockTime,
    method: "post",
    data: {},
    params: {
      projectId: pid,
      id
    }
  });
};
//-------------------------------打卡记录-----------------------
export const getAllClockRecords = (id, startTime = undefined, endTime = undefined) => {
  return request({
    url: api.getAllClockRecords,
    method: "post",
    data: {},
    params: {
      projectId: id,
      startTime,
      endTime
    }
  });
};
export const getMyClockRecords = (id, startTime = undefined, endTime = undefined) => {
  return request({
    url: api.getMyClockRecords,
    method: "post",
    data: {},
    params: {
      projectId: id,
      startTime,
      endTime
    }
  });
};
