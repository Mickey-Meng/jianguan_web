import api from "./index";
import request from "@/utils/request";

/**
 * @Description: 查询所有项目
 * @author wangharry
 * @param {}
 * @returns {}
 * @date
 */
export const getAllProject = () => {
  return request({
    url: api.getAllProject,
    method: "post",
    data: {}
  });
};
