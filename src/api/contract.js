/*
 * 合同管理模块接口
 * */
import api from "./index";
import request from "@/utils/request";


export const addOrUpdateContractLabor = data => {
	return request({
		url: api.addOrUpdateContractLabor,
		method: "post",
		data: data
	});
};

export const getContractLaborDeatil = id => {
	return request({
		url: api.getContractLaborDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteContractLabor = id => {
	return request({
		url: api.deleteContractLabor,
		method: "get",
		params: {
			id
		}
	});
};

export const getContractLaborList = data => {
	return request({
		url: api.getContractLaborList,
		method: "post",
		data: data
	});
};



export const addOrUpdateContractBuild = data => {
	return request({
		url: api.addOrUpdateContractBuild,
		method: "post",
		data: data
	});
};

export const getContractBuildDeatil = id => {
	return request({
		url: api.getContractBuildDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteContractBuild = id => {
	return request({
		url: api.deleteContractBuild,
		method: "get",
		params: {
			id
		}
	});
};

export const getContractBuildList = data => {
	return request({
		url: api.getContractBuildList,
		method: "post",
		data: data
	});
};

export const getContractBuildEnums = () => {
	return request({
		url: api.getContractBuildEnums,
		method: "get",
		params: {}
	});
};