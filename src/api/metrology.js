/*
 * 计量管理
 * */
import api from "./index";
import request from "@/utils/request";


export const addOrUpdateMetrology = data => {
	return request({
		url: api.addOrUpdateMetrology,
		method: "post",
		data: data
	});
};

export const getMetrologyDetail = id => {
	return request({
		url: api.getMetrologyDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteMetrology = id => {
	return request({
		url: api.deleteMetrology,
		method: "get",
		params: {
			id
		}
	});
};

export const getMetrologyList = data => {
	return request({
		url: api.getMetrologyList,
		method: "post",
		data: data
	});
};

export const exportMetrologyList = data => {
	return request({
		url: api.exportMetrologyList,
		method: "post",
		data: data,
		"responseType": 'blob'
	});
};
