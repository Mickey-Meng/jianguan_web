
import api from "./index";
import request from "@/utils/request";


export const addOrUpdateConstructionPrototype = data => {
	return request({
		url: api.addOrUpdateConstructionPrototype,
		method: "post",
		data: data
	});
};

export const getConstructionPrototypeDetail = id => {
	return request({
		url: api.getConstructionPrototypeDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteConstructionPrototype = id => {
	return request({
		url: api.deleteConstructionPrototype,
		method: "get",
		params: {
			id
		}
	});
};

export const getConstructionPrototypeList = data => {
	return request({
		url: api.getConstructionPrototypeList,
		method: "post",
		data: data
	});
};

export const getFlowAndTaskInfo = data => {
  return request({
    url: api.getFlowAndTaskInfo,
    method: "get",
    params: data
  });
};
