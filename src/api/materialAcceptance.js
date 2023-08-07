
import api from "./index";
import request from "@/utils/request";


export const addOrUpdateMaterialAcceptance = data => {
	return request({
		url: api.addOrUpdateMaterialAcceptance,
		method: "post",
		data: data
	});
};

export const getMaterialAcceptanceDetail = id => {
	return request({
		url: api.getMaterialAcceptanceDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deletematerialAcceptance = id => {
	return request({
		url: api.deleteMaterialAcceptance,
		method: "get",
		params: {
			id
		}
	});
};

export const getmaterialAcceptanceList = data => {
	return request({
		url: api.getMaterialAcceptanceList,
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
