/*
 * 计划管理-证照管理
 * */
import api from "../index";
import request from "@/utils/request";


export const addOrUpdatePlanCertificatePhotos = data => {
	return request({
		url: api.addOrUpdatePlanCertificatePhotos,
		method: "post",
		data: data
	});
};

export const getPlanCertificatePhotosDetail = id => {
	return request({
		url: api.getPlanCertificatePhotosDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deletePlanCertificatePhotos = id => {
	return request({
		url: api.deletePlanCertificatePhotos,
		method: "get",
		params: {
			id
		}
	});
};

export const getPlanCertificatePhotosList = data => {
	return request({
		url: api.getPlanCertificatePhotosList,
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
