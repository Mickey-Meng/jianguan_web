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


export const addOrUpdateComeGoMoney = data => {
	return request({
		url: api.addOrUpdateComeGoMoney,
		method: "post",
		data: data
	});
};

export const getComeGoMoneyDeatil = id => {
	return request({
		url: api.getComeGoMoneyDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteComeGoMoney = id => {
	return request({
		url: api.deleteComeGoMoney,
		method: "get",
		params: {
			id
		}
	});
};

export const getComeGoMoneyList = data => {
	return request({
		url: api.getComeGoMoneyList,
		method: "post",
		data: data
	});
};


export const addOrUpdateEnterExit = data => {
	return request({
		url: api.addOrUpdateEnterExit,
		method: "post",
		data: data
	});
};

export const getEnterExitDeatil = id => {
	return request({
		url: api.getEnterExitDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteEnterExit = id => {
	return request({
		url: api.deleteEnterExit,
		method: "get",
		params: {
			id
		}
	});
};

export const getEnterExitList = data => {
	return request({
		url: api.getEnterExitList,
		method: "post",
		data: data
	});
};

export const getEnterExitUserList = data => {
	return request({
		url: api.getEnterExitUserList,
		method: "post",
		data:data
	});
};