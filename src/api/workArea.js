/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-01-20 16:26:15
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-11 11:29:08
 */
import api from "./index";
import request from "@/utils/request";

/**
 * @des: 获取工区和工区下的项目
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getWorkArea = id => {
  return request({
    url: api.getWorkArea,
    method: "get",
    params: {
      id: id || undefined
    }
  });
};
/**
 * @des: 根据用户权限返回对应的工区
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getAreaByAuthority = () => {
  return request({
    url: api.getAreaByAuthority,
    method: "post",
    data: {}
  });
};
/**
 * @des: 根据工区获取施工人员数据
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getCheckerByAreaId = id => {
  return request({
    url: api.getCheckerByAreaId,
    method: "post",
    params: {
      group: id
    }
  });
};
