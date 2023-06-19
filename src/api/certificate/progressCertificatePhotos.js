/*
 * 进度管理-证照管理
 * */
import api from "../index";
import request from "@/utils/request";


export const addOrUpdateProgressCertificatePhotos = data => {
	return request({
		url: api.addOrUpdateProgressCertificatePhotos,
		method: "post",
		data: data
	});
};

export const getProgressCertificatePhotosDetail = id => {
	return request({
		url: api.getProgressCertificatePhotosDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteProgressCertificatePhotos = id => {
	return request({
		url: api.deleteProgressCertificatePhotos,
		method: "get",
		params: {
			id
		}
	});
};

export const getProgressCertificatePhotosList = data => {
	return request({
		url: api.getProgressCertificatePhotosList,
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
