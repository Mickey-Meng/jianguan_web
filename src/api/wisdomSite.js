/*
* 智慧工地
* */
import api from './index'
import request from '@/utils/request'

/**
 * @Description: 获取视频监控token
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/30
*/
export const getVideoToken = (id)  => {
  return request({
    url: api.viewToken+`?projectId=${id}`,
    method: 'post'
  })
}
/*
* 视频环境页面
* */

/**
 * @Description: 获取环境监控视频监测数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/22
*/
export const getEnvironmentVideo = () => {
  return request({
    url: api.environmentVideo,
    method: 'get'
  })
}
/**
 * @Description: 每日环境趋势变化图
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/29
*/
export const getDayTrend = (data) => {
  return request({
    url: api.getDayTrend,
    method: 'post',
    data
  })
}
/**
 * @Description: 获取每月环境统计数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/29
 */
export const getEnvPerMonth = () => {
  return request({
    url: api.getEnvPerMonth,
    method: 'get'
  })
}
/**
 * @Description: 超限记录
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/29
 */
export const getExceedData = () => {
  return request({
    url: api.getExceedData,
    method: 'get'
  })
}
