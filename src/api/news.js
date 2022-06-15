/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-02-16 10:44:22
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-03-01 17:03:43
 */
import api from "./index";
import request from "@/utils/request";

/**
 * @Description: 查询新闻
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/22
 */
export const getNews = (type = 1, projectId) => {
  return request({
    url: api.getNews,
    method: "get",
    params: {
      type,
      projectId
    }
  });
};

export const addNews = data => {
  return request({
    url: api.addNews,
    method: "post",
    data
  });
};

export const deleteNews = ({ id }) => {
  return request({
    url: api.deleteNews,
    method: "get",
    params: {
      id: id
    }
  });
};

export const getTenNews = (projectId) => {
  return request({
    url: api.getTenNews,
    method: "get",
    params:{projectId}
  });
};
