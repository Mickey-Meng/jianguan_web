
import api from "./index";
import request from "@/utils/request";

export const getFileInfo = (id) => {
  return request({
    url: api.selectByPrimaryKey,
    method: "post",
    data: {},
    params: {id}
  });
};
