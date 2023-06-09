
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
//1、待办;2、已办;3、历史
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

/**
 * @Description: 管理员获取所有报审信息
 * @author 王海林
 * @date
 */
export const adminGetAllStaffRecord = (projectId, roleType = undefined) => {
  return request({
    url: api.adminGetAllStaffRecord,
    method: "post",
    data: {},
    params: {
      projectId,
      roleType
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
export const deleteChangeRecord = (id, projectId) => {
  return request({
    url: api.deleteChangeRecord,
    method: "post",
    data: {},
    params: {
      id,
      projectId
    }
  });
};
export const getAllPersonChangeRecords = (projectId, roleType) => {
  return request({
    url: api.getAllPersonChangeRecords,
    method: "post",
    data: {},
    params: {
      roleType,
      projectId
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
export const deleteLeaveRecord = (id, projectId) => {
  return request({
    url: api.deleteLeaveRecord,
    method: "post",
    data: {},
    params: {
      projectId,
      id
    }
  });
};

export const getAllLeaveRecords = (projectId, roleType, state) => {
  return request({
    url: api.getAllLeaveRecords,
    method: "post",
    data: {},
    params: {
      roleType,
      projectId,
      state
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
export const getAllClockRecords = (id, startTime = undefined, endTime = undefined, roleType = undefined) => {
  return request({
    url: api.getAllClockRecords,
    method: "post",
    data: {},
    params: {
      projectId: id,
      startTime,
      endTime,
      roleType
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


/**
 * @Description: 流程显示人员接口
 * @author 王海林
 * @date
 */

export const startAndTakeUserTask = (key, data) => {
  return request({
    url: api.startAndTakeUserTask + "/" + key,
    method: "post",
    data
  });
};
