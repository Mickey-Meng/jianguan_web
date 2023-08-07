
import api from "./index";
import request from "@/utils/request";


export const addOrUpdateConstructionPlan = data => {
	return request({
		url: api.addOrUpdateconstructionPlanReport,
		method: "post",
		data: data
	});
};

export const getConstructionPlanDetail = id => {
	return request({
		url: api.getconstructionPlanReportDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteConstructionPlan = id => {
	return request({
		url: api.deleteconstructionPlanReport,
		method: "get",
		params: {
			id
		}
	});
};

export const getConstructionPlanList = data => {
	return request({
		url: api.getconstructionPlanReportList,
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
