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
export const exportContractLaborList = data => {
	return request({
		url: api.exportContractLaborList,
		method: "post",
		data: data,
		"responseType": 'blob'
	});
};
export const getContractLaborListNoPage = data => {
	return request({
		url: api.getContractLaborListNoPage,
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

export const exportContractBuildList = data => {
	return request({
		url: api.exportContractBuildList,
		method: "post",
		data: data,
		"responseType": 'blob'
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

export const exportComeGoMoneyList = data => {
	return request({
		url: api.exportComeGoMoneyList,
		method: "post",
		data: data,
		"responseType": 'blob'
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

export const exitEnterExitUserList = data => {
	return request({
		url: api.exitEnterExitUserList,
		method: "post",
		data:data
	});
};

export const exportEnterExitUserList = data => {
	return request({
		url: api.exportEnterExitUserList,
		method: "post",
		data: data,
		"responseType": 'blob'
	});
};

export const addOrUpdateEquipmentEnter = data => {
	return request({
		url: api.addOrUpdateEquipmentEnter,
		method: "post",
		data: data
	});
};

export const getEquipmentEnterDeatil = id => {
	return request({
		url: api.getEquipmentEnterDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteEquipmentEnter = id => {
	return request({
		url: api.deleteEquipmentEnter,
		method: "get",
		params: {
			id
		}
	});
};

export const getEquipmentEnterList = data => {
	return request({
		url: api.getEquipmentEnterList,
		method: "post",
		data: data
	});
};
export const exportEquipmentEnterList = data => {
	return request({
		url: api.exportEquipmentEnterList,
		method: "post",
		data: data,
		"responseType": 'blob'
	});
};

export const getEquipmentEnterEnums = () => {
	return request({
		url: api.getEquipmentEnterEnums,
		method: "get",
		params: {}
	});
};


export const addOrUpdateEquipmentExit = data => {
	return request({
		url: api.addOrUpdateEquipmentExit,
		method: "post",
		data: data
	});
};

export const getEquipmentExitDeatil = id => {
	return request({
		url: api.getEquipmentExitDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteEquipmentExit = id => {
	return request({
		url: api.deleteEquipmentExit,
		method: "get",
		params: {
			id
		}
	});
};

export const getEquipmentExitList = data => {
	return request({
		url: api.getEquipmentExitList,
		method: "post",
		data: data
	});
};
export const exportEquipmentExitList = data => {
	return request({
		url: api.exportEquipmentExitList,
		method: "post",
		data: data,
		"responseType": 'blob'
	});
};
/**
 * 获取流程对应节点的人员范围flowAuditEntry/detail/id
 * @param {*} data 
 * @returns 
 */
 export const getFlowAuditEntry = data => {
	return request({
		url: api.flowAuditEntry,
		method: "get",
		params: data
	});
};

/**
 * 获取流程对应节点的人员范围flowAuditEntry/detail/id
 * @param {*} data 
 * @returns 
 */
 export const getFlowAndTaskInfo = data => {
	return request({
		url: api.getFlowAndTaskInfo,
		method: "get",
		params: data
	});
};
