/*
 * 数据字典
 */
import api from "./index";
import request from "@/utils/request";


export function findDataDictionaryList (data) {
  return request({
    url: api.findDataDictionaryList,
    method: "get",
    params: data
  });
};
