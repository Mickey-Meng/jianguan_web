/*
 * 计划管理-证照管理
 * */
import api from "../index";
import request from "@/utils/request";


export const addOrUpdatePlanConstructionDesign = data => {
	return request({
		url: api.addOrUpdatePlanConstructionDesign,
		method: "post",
		data: data
	});
};

export const getPlanConstructionDesignDetail = id => {
	return request({
		url: api.getPlanConstructionDesignDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deletePlanConstructionDesign = id => {
	return request({
		url: api.deletePlanConstructionDesign,
		method: "get",
		params: {
			id
		}
	});
};

export const getPlanConstructionDesignList = data => {
	return request({
		url: api.getPlanConstructionDesignList,
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
