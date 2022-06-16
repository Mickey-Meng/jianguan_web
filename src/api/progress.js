/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:32
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-04-12 14:40:31
 */
/**
 * 形象进度信息
 */
import api from "./index";
import request from "@/utils/request";

/**
 * 获取构件完成状态
 */
export const getConponentStatus = (projectId) => {
  return request({
    url: api.getConponentStatus,
    method: "get",
    params: {projectId}
  });
};

/**
 * @Description: 获取桥数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/30
 */
export const getQiaoData = () => {
  return request({
    url: api.getQiaoData,
    method: "get"
  });
};

/**
 * @des:设置构件计划开始、完成、实际开始、完成时间
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const setConponmentTime = data => {
  return request({
    url: api.setComponentTime,
    method: "post",
    data
  });
};

/**
 * @des: 根据构件id获取四个时间
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */

export const getConponmentTime = id => {
  return request({
    url: api.getConponmentTime + "?conid=" + id,
    method: "post",
    data: {}
  });
};
/**
 * @des: 进度总览左下折线图数据
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */

export const getAreaProgress = (type,projectId) => {
  return request({
    url: api.getAreaProgress,
    method: "get",
    params: {
      type,
      projectId
    }
  });
};
/**
 * @des: 进度总览表格图下拉选择数据
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getProjectTypeData = () => {
  return request({
    url: api.getProjectTypeData,
    method: "get"
  });
};
/**
 * @des: 进度总览表格数据
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getProgressTableData = data => {
  return request({
    url: api.getProgressTableData,
    method: "post",
    data
  });
};
/**
 * @des:删除工序
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const deleteProduceInfo = params => {
  return request({
    url: api.deleteProduceInfo,
    method: "post",
    params
  });
};
/**
 * @des: 根据模型id查询构件的进度信息
 * @data:
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getComponentProgressByModel = data => {
  return request({
    url: api.getComponentProgressByModel,
    method: "post",
    data: data
  });
};
/**
 * @des: 驳回后的工序再次修改
 * @data:
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const updateProgress = data => {
  return request({
    url: api.updateProgress,
    method: "post",
    data
  });
};
