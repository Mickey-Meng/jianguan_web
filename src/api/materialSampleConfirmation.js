
import api from "./index";
import request from "@/utils/request";


export const addOrUpdateMaterialSampleConfirmation = data => {
	return request({
		url: api.addOrUpdateMaterialSampleConfirmation,
		method: "post",
		data: data
	});
};

export const getMaterialSampleConfirmationDetail = id => {
	return request({
		url: api.getMaterialSampleConfirmationDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deletematerialSampleConfirmation = id => {
	return request({
		url: api.deleteMaterialSampleConfirmation,
		method: "get",
		params: {
			id
		}
	});
};

export const getmaterialSampleConfirmationList = data => {
	return request({
		url: api.getMaterialSampleConfirmationList,
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
