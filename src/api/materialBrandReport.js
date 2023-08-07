
import api from "./index";
import request from "@/utils/request";


export const addOrUpdateMaterialBrandReport = data => {
	return request({
		url: api.addOrUpdateMaterialBrandReport,
		method: "post",
		data: data
	});
};

export const getMaterialBrandReportDetail = id => {
	return request({
		url: api.getMaterialBrandReportDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteMaterialBrandReport = id => {
	return request({
		url: api.deleteMaterialBrandReport,
		method: "get",
		params: {
			id
		}
	});
};

export const getMaterialBrandReportList = data => {
	return request({
		url: api.getMaterialBrandReportList,
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
