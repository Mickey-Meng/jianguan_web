import request from "@/utils/request";


const api = {
  getAllClockOut: "/count/getAllClockOut", //获取考勤统计列表、施工、监理、全咨
  getPeopleProportion: "/count/getPeopleProportion", //统计人员占比
  getTodayClockOut: "/count/getTodayClockOut", //获取今日考勤统计
  getOnDutyOrNotCount: "/count/getOnDutyOrNotCount" //获取在岗/不在岗统计(只统计 施工,监理,全资)
};


/**
 * @Description: 获取今日考勤统计
 * @author 王海林
 * @date
 */
export const getTodayClockOut = (projectId) => {
  return request({
    url: api.getTodayClockOut,
    method: "post",
    data: {},
    params: {projectId}
  });
};
/**
 * @Description: 获取今日考勤统计
 * @author 王海林
 * @date
 */
export const getPeopleProportion = (projectId) => {
  return request({
    url: api.getPeopleProportion,
    method: "post",
    data: {},
    params: {projectId}
  });
};
/**
 * @Description: 获取在岗/不在岗统计(只统计 施工,监理,全资)
 * @author 王海林
 * @date
 */
export const getOnDutyOrNotCount = (projectId) => {
  return request({
    url: api.getOnDutyOrNotCount,
    method: "post",
    data: {},
    params: {projectId}
  });
};

/**
 * @Description: 查询列表
 * @author 王海林
 * @date
 */
export const getAllClockOut = (data) => {
  return request({
    url: api.getAllClockOut,
    method: "post",
    data
  });
};
