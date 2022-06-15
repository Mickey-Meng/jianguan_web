/*
 * 管理大脑
 * */
import api from "./index";
import request from "@/utils/request";

/**
 * @Description: 获取项目信息工程规模，合同工期，投资规模以及关联单位
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/22
 */
export const getEngCompany = () => {
  return request({
    url: api.getEngCompany,
    method: "get"
  });
};

/**
 * @Description: 获取进度中间表格数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/22
 */

export const getMiddleData = (projectId) => {
  return request({
    url: api.getMiddleData,
    method: "get",
    params: {projectId}
  });
};

/**
 * @Description: 获取进度的右侧数据 日报周报使用 周报1，月报2，自定义3，当前 4
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/22
 */

export const getWeekMonthly = data => {
  return request({
    url: api.getWeekMonthly,
    method: "post",
    data
  });
};
/*
 * 数据中心
 * */
/**
 * @Description: 构件完成数量--左右上图数据，还有方量数量
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/27
 */
export const getFinishConponent = data => {
  return request({
    url: api.getFinishConponent,
    method: "post",
    data
  });
};

/**
 * @Description: 构件完成数量按照月，按照日，按照季度--左下图数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/27
 */
export const getCountConponent = data => {
  return request({
    url: api.getCountConponent,
    method: "post",
    data
  });
};
/**
 * @Description: 构件完成数量按照月，按照日，按照季度--右下图数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/27
 */
export const getCountIncresConponent = data => {
  return request({
    url: api.getCountIncresConponent,
    method: "post",
    data
  });
};
/**
 * @Description: 获取项目下的构件的类型分类
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/27
 */
export const getComponentType = (projectId) => {
  return request({
    url: api.componentType,
    method: "get",
    params: {projectId}
  });
};
/**
 * @Description: 获取项目下拉选数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/8/6
 */
export const projectSelect = () => {
  return request({
    url: api.projectSelect,
    method: "get"
  });
};
//----------------------- 首页统计图表数据---------------

/**
 * @Description: 获取首页统计图表数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/8/6
 */
export const getHomeChart = (id,projectId) => {
  return request({
    url: api.getHomeChart,
    method: "get",
    params: {
      projectcode: id,
      projectId
    }
  });
};

export const getHomeBottomChart = (type,projectId) => {
  return request({
    url: api.getHomeBottomChart,
    method: "get",
    params: {
      type,
      projectId
    }
  });
};
export const getSafeChart = (type = 1, projectId) => {
  return request({
    url: api.getSafeChart,
    method: "get",
    params: {
      count: type,
      projectId
    }
  });
};
//-----------------消息提示------------------
export const getSupervisorMsg = () => {
  return request({
    url: api.getSupervisorMsg,
    method: "post",
    data: {}
  });
};
export const getConstructionMsg = () => {
  return request({
    url: api.getConstructionMsg,
    method: "post",
    data: {}
  });
};
