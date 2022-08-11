import api from "./index";
import request from "@/utils/request";

/**
 * @Description: 查询所有项目
 * @author wangharry
 * @param {}
 * @returns {}
 * @date
 */
export const getAllProject = () => {
  return request({
    url: api.getAllProject,
    method: "post",
    data: {}
  });
};
/**
 * @Description: 查询项目表所有数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date
 */
export const getAllProjectsData = () => {
  return request({
    url: api.getAllProjectsData,
    method: "post",
    data: {}
  });
};
/**
 * @Description: 通过用户工区权限查询项目
 * @author wangharry
 * @param {}
 * @returns {}
 * @date
 */
export const getProjectsByUser = () => {
  return request({
    url: api.getProjectsByUser,
    method: "post",
    data: {}
  });
};

//项目相关
export const getChildProject = params => {
	// return request.post(api.getChildProject,data)
	return request({
		url: api.getChildProject,
		method: "post",
		data: {},
		params
	});
};
export const getCompanyByProjectId = params => {
	return request({
		url: api.getCompanyByProjectId,
		method: "post",
		data: {},
		params
	});
};
export const getInfoByProjectId = params => {
	return request({
		url: api.getInfoByProjectId,
		method: "post",
		data: {},
		params
	});
};
export const getProjectInfoById = params => {
	return request({
		url: api.getProjectInfoById,
		method: "post",
		data: {},
		params
	});
};
export const getProjectRoleTree = params => {
	return request({
		url: api.getProjectRoleTree,
		method: "post",
		data: {},
		params
	});
};
export const getProjectUserTree = params => {
	return request({
		url: api.getProjectUserTree,
		method: "post",
		data: {},
		params
	});
};

