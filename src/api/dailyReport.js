
import api from "./index";
import request from "@/utils/request";


export const addOrUpdateDailyReport = data => {
	return request({
		url: api.addOrUpdateDailyReport,
		method: "post",
		data: data
	});
};

export const getDailyReportDetail = id => {
	return request({
		url: api.getDailyReportDetail,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteDailyReport = id => {
	return request({
		url: api.deleteDailyReport,
		method: "get",
		params: {
			id
		}
	});
};

export const getDailyReportList = data => {
	return request({
		url: api.getDailyReportList,
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
