/*
 * 进度管理-证照管理
 * */
import api from "../index";
import request from "@/utils/request";


export const addOrUpdateProgressConstructionDesign = data => {
	return request({
		url: api.addOrUpdateProgressConstructionDesign,
		method: "post",
		data: data
	});
};

export const getProgressConstructionDesignDetail = id => {
	return request({
		url: api.getProgressConstructionDesignDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteProgressConstructionDesign = id => {
	return request({
		url: api.deleteProgressConstructionDesign,
		method: "get",
		params: {
			id
		}
	});
};

export const getProgressConstructionDesignList = data => {
	return request({
		url: api.getProgressConstructionDesignList,
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
