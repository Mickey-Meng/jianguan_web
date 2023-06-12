/*
 * 合同付款
 * */
import api from "./index";
import request from "@/utils/request";


export const addOrUpdateContractPayment = data => {
	return request({
		url: api.addOrUpdateContractPayment,
		method: "post",
		data: data
	});
};

export const getContractPaymentDetail = id => {
	return request({
		url: api.getContractPaymentDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteContractPayment = id => {
	return request({
		url: api.deleteContractPayment,
		method: "get",
		params: {
			id
		}
	});
};

export const getContractPaymentList = data => {
	return request({
		url: api.getContractPaymentList,
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
