import api from "./index";
import request from "@/utils/request";

/**
 * @Description: '获取安全大类数据'
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/14
 */
export const getBigSmallSafeData = () => {
  return request({
    url: api.bigSmallSafe,
    method: "get"
  });
};
/**
 * @Description: 根据大类数据ID获取安全小类数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/19
 */
export const getSmallSafeData = id => {
  return request({
    url: api.bigSmallSafe + `?id=${id}`,
    method: "get"
  });
};
/**
 * @Description: 监理方确认安全事件延期处理代办  确认延期
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const doDelaySafeEvent = data => {
  return request({
    url: api.doDelaySafeEvent,
    method: "post",
    data
  });
};
/**
 * @Description: 监理方处理延期安全整改代办
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const doNotDoneSafeEvent = data => {
  return request({
    url: api.doNotDoneSafeEvent,
    method: "post",
    data
  });
};
/**
 * @Description: 监理方查询延期安全延期代办   施工方申请延期事件
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const getDelaySafeEvent = (projectId) => {
  return request({
    url: api.getDelaySafeEvent,
    method: "get",
    params: {
      projectId
    }
  });
};
/**
 * @Description: 监理方查询已办安全检查事件  事件记录页面
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const getDoneSafeEvent = () => {
  return request({
    url: api.getDoneSafeEvent,
    method: "get"
  });
};

/**
 * @des: 查询所有安全时间
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getAllSafeEvents = (projectId, singleProjectId) => {
  return request({
    url: api.getAllSafeEvents,
    method: "get",
    params: {
      projectId: projectId || undefined,
      singleProjectId: singleProjectId || undefined
    }
  });
};

/**
 * @Description: 监理方查询安全整改代办  整改确认页面 施工方已提交整改
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const getNotDoneSafeEvent = (projectId) => {
  return request({
    url: api.getNotDoneSafeEvent,
    method: "get",
    params: {
      projectId
    }
  });
};
/**
 * @Description: 施工方获取安全检查事件   安全整改页面
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const getSafeEvent = (projectId) => {
  return request({
    url: api.getSafeEvent,
    method: "get",
    params: {
      projectId
    }
  });
};
/**
 * @Description: 获取每个工区的负责人
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const getcheck = () => {
  return request({
    url: api.getcheck,
    method: "get"
  });
};
/**
 * @Description: 施工方对安全事件进行处理
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const submitDealWithSafeEvent = data => {
  return request({
    url: api.submitDealWithSafeEvent,
    method: "post",
    data
  });
};
/**
 * @Description: 施工方对安全事件进行延期处理  申请事件延期
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const submitDelaySafeEvent = data => {
  return request({
    url: api.submitDelaySafeEvent,
    method: "post",
    data
  });
};
/**
 * @Description: 监理上传安全检查  安全检查页面监理上报  获取工区负责人和事件大小类数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/16
 */
export const submitSafeData = data => {
  return request({
    url: api.submitSafeData,
    method: "post",
    data
  });
};
/**
 * @Description: 获取每月安全事件数据--表格左侧的工区每日状态
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/23
 */
export const getPerMonthSafeData = data => {
  return request({
    url: api.getPerMonthSafeData,
    method: "post",
    data
  });
};
/**
 * @Description: 获取某一天的安全事件
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/26
 */
export const getDayData = time => {
  return request({
    url: api.getDayData + `?askTime=${time}`,
    method: "get"
  });
};
/**
 * @Description: 安全事件分类汇总
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/26
 */
export const getByFirstType = () => {
  return request({
    url: api.getByFirstType,
    method: "get"
  });
};
/**
 * @Description: 获取周月履职情况
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/26
 */
export const getPerSafeData = time => {
  return request({
    url: api.getPerSafeData + `?askTime=${time}`,
    method: "get"
  });
};
/**
 * @Description: 安全总览右上角安全事件统计
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/26
 */
export const getSafeEventsStatistic = (type = 1) => {
  return request({
    url: api.getSafeEventsStatistic,
    method: "get",
    params: {
      count: type
    }
  });
};
/**
 * @Description: 安全总览左下角巡更一览数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/26
 */
export const getSafePerday = date => {
  return request({
    url: api.getSafePerday,
    method: "get",
    params: {
      date
    }
  });
};
/**
 * @Description: 安全总览右下角检查明细
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/26
 */
export const getDaySafeEvents = (gqid, date) => {
  return request({
    url: api.getDaySafeEvents,
    method: "get",
    params: {
      gqid,
      date
    }
  });
};
/**
 * @des: 删除安全事件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const deleteSafeEvent = params => {
  return request({
    url: api.deleteSafeEvent,
    method: "post",
    data:{},
    params
  });
};
