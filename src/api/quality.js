/*
 * 质量验收总览页面接口
 * */
import api from "./index";
import request from "@/utils/request";

/**
 * @Description: 获取左侧工序树  质量总览页面
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/8
 */
export const getQualityTree = () => {
	return request({
		url: api.checkViewTree,
		method: "get"
	});
};

/**
 * @Description: 根据工序类型获取质量检查数据  暂时不传id  质量总览页面
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/8
 */
export const getQualityTable = () => {
	return request({
		url: api.checkViewTable,
		method: "get"
	});
};

/**
 * @Description: 质量验收表格数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/8
 */
export const getNewCheckViewTable = data => {
	return request({
		url: api.getNewCheckViewTable,
		method: "post",
		data
	});
};
export const getCurrentPdf = id => {
	return request({
		url: api.getCurrentPdf,
		method: "get",
		params: {
			recodeid: id
		}
	});
};
/**
 * @Description: 根据记录id查询每到工序的记录  质量总览页面查看详情 填报记录审核记录也可以查询
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/12
 */
export const getProcessRecordsById = id => {
	return request({
		url: api.processRecords + `?id=${id}`,
		method: "get"
	});
};

/*
 * 工序填报页面接口
 * */

/**
 * @Description: 根据构件编码查询构件的报检信息  根据构件编码查询工序 工序填报页面
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/14
 */
export const getCheckDataByConponentId = (id, type) => {
	return request({
		url: api.checkData + `?id=${id}&type=${type}`,
		method: "get"
	});
};
export const getCheckData = id => {
	return request({
		url: api.getCheckData + `?id=${id}`,
		method: "get"
	});
};
/**
 * @Description: 根据构件编码查询报检人信息  根据构件编码编号查询指定的监理人员
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/15
 */
export const getPersonByComponentId = id => {
	return request({
		url: api.checker,
		method: "get",
		params: {
			group: id || undefined
		}
	});
};
/**
 * @Description: 获取当前人报检的项目，返回3个项目类型桥梁，地面，地道工程下面的每一个子项目
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/14
 */
export const getPorjectItem = id => {
	return request({
		url: api.fillProject,
		method: "get"
	});
};
/**
 * @Description: 上传填报记录
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/14
 */
export const addRecord = data => {
	return request({
		url: api.addRecord,
		method: "post",
		data
	});
};

/**
 * @Description: 获取工序审核数据
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/19
 */
export const getAgency = () => {
	return request({
		url: api.getAgency,
		method: "get"
	});
};

/**
 * @Description: 确认填报记录 工序审核页面处理施工方上传的工序填报
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/21
 */
export const confirmReport = data => {
	return request({
		url: api.confirmReport,
		method: "post",
		data
	});
};

/**
 * @Description: 获取工序填报数据和审核记录数据  1是审核记录 2是填报记录
 * @author wangharry
 * @param {}
 * @returns {}
 * @date 2021/7/19
 */
export const getAllcheckData = type => {
	return request({
		url: api.getAllcheckData + `?type=${type}`,
		method: "post"
	});
};

//-----------------------------------------质量检查，审核-确认等-----------------------------------------------

/**
 * @des: 获取质量大小类数据
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getQualityBigSmallData = id => {
	return request({
		url: api.bigSmallQuality,
		method: "get",
		params: {
			id: id || undefined
		}
	});
};
/** 获取工区负责人数据
 * @des:
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getQualityPrincipal = () => {
	return request({
		url: api.getQualityPrincipal,
		method: "get"
	});
};
/**
 * @des:监理上传质量事件接口
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const addQuality = data => {
	return request({
		url: api.addQuality,
		method: "post",
		data
	});
};
/**
 * @des:施工方获取质量检查事件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getWorkLists = () => {
	return request({
		url: api.getWorkList,
		method: "get"
	});
};
/**
 * @des:施工方填报质量整改
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const submitFinishEvent = data => {
	return request({
		url: api.submitFinishEvent,
		method: "post",
		data
	});
};
/**
 * @des:施工方对质量事件延期处理
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const submitDealEvent = data => {
	return request({
		url: api.submitDealEvent,
		method: "post",
		data
	});
};
/**
 * @des:监理查询延期申请事件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getDelayEvent = () => {
	return request({
		url: api.getDelayEvent,
		method: "get"
	});
};
/**
 * @des:监理方处理延期申请
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const disposeDelay = data => {
	return request({
		url: api.disposeDelay,
		method: "post",
		data
	});
};
/**
 * @des:监理方确认质量整改事件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const disposeFinishQualityEvent = data => {
	return request({
		url: api.disposeFinishQualityEvent,
		method: "post",
		data
	});
};
/**
 * @des:监理方获取已整改待确认事件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getFinishQualityEvent = () => {
	return request({
		url: api.getFinishQualityEvent,
		method: "get"
	});
};
/**
 * @des:获取监理已审核确认质量事件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getCompleteEvents = () => {
	return request({
		url: api.getCompleteEvents,
		method: "get"
	});
};
/**
 * @des:获取所有质量事件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getAllQualityEvents = projectid => {
	return request({
		url: api.getAllQualityEvents,
		method: "get",
		params: {
			projectid: projectid || undefined
		}
	});
};
/**
 * @des:获取质量总览右上角数据
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getQualityEventsStatistic = (type = 1) => {
	return request({
		url: api.getQualityEventsStatistic,
		method: "get",
		params: {
			count: type
		}
	});
};
/**
 * @des:获取质量总览左上角数据
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getQualityChart = (type = 1) => {
	return request({
		url: api.getQualityChart,
		method: "get",
		params: {
			count: type
		}
	});
};
/**
 * @des:获取质量总览左下角
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const getAllQualityGetPerday = date => {
	return request({
		url: api.getAllQualityGetPerday,
		method: "get",
		params: {
			date
		}
	});
};
export const getQualityEventsGetDay = (gqid, date) => {
	return request({
		url: api.getQualityEventsGetDay,
		method: "get",
		params: {
			gqid,
			date
		}
	});
};
/**
 * @des:删除质量事件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const deleteQualityEvent = params => {
	return request({
		url: api.deleteQualityEvent,
		method: "post",
		data: {},
		params
	});
};


//-----------------------流程引擎新增接口 ------------------------
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
export const getUserByRoleId = params => {
	return request({
		url: api.getUserByRoleId,
		method: "post",
		data: {},
		params
	});
};
/**
 * 上传文件
 */
export const uploadFile = data => {
	return request({
		url: api.uploadFile,
		method: "post",
		data: data
	});
};
/**
 * 查询文件信息
 */
export const getFileInfo = data => {
	return request({
		url: api.getFileInfo,
		method: "post",
		data: data
	});
};
/**
 * @des:下载文件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const downloadFile = params => {
	// return request({
	//   url: api.downloadFile,
	//   method: "get",
	//   params
	// });
	var url = '';
	var fields = [];
	for (var i in params) {
		fields.push(i)
	}
	for (var i = 0; i < fields.length; i++) {
		if (i == 0) {
			url += '?' + fields[i] + '=' + params[fields[i]];
		} else {
			url += '&' + fields[i] + '=' + params[fields[i]];
		}
	}
	window.open(api.downloadFile+url,'_blank')
};
/**
 * @des:预览文件
 * @test:
 * @msg:
 * @param {*}
 * @return {*}
 */
export const previewFile = params => {
	return request({
		url: api.previewFile,
		method: "get",
		params
	});
};
/**
 * 查询待办任务
 */
export const listHandleTask = data => {
	return request({
		url: api.listHandleTask,
		method: "post",
		data: data
	});
};

/**
 * 抄送列表
 */
export const listRemindingTask = data => {
	return request({
		url: api.listRemindingTask,
		method: "post",
		data: data
	});
};

/**
 * 查询已办任务
 */
export const listHistoricTask = data => {
	return request({
		url: api.listHistoricTask,
		method: "post",
		data: data
	});
};
/**
 * 查询历史任务
 */
export const listHistoricProcessInstance = data => {
	return request({
		url: api.listHistoricProcessInstance,
		method: "post",
		data: data
	});
};
/**
 * 
 */
export const rejectRuntimeTask = data => {
	return request({
		url: api.rejectRuntimeTask,
		method: "post",
		data: data
	});
};
/**
 * 查询省份
 */
export const getProvince = () => {
	return request({
		url: api.getProvince,
		method: "get",
		params: {}
	});
};
/**
 * 提交流程的用户任务
 */
export const submitUserTask = data => {
	return request({
		url: api.submitUserTask,
		method: "post",
		data: data
	});
};
/**
 * viewRuntimeTaskInfo
 */
export const viewRuntimeTaskInfo = (params) => {
	return request({
		url: api.viewRuntimeTaskInfo,
		method: "get",
		params: params
	});
};
/**
 * viewHighlightFlowData
 */
export const viewHighlightFlowData = (params) => {
	return request({
		url: api.viewHighlightFlowData,
		method: "get",
		params: params
	});
};
/**
 * viewProcessBpmn
 */
export const viewProcessBpmn = (params) => {
	return request({
		url: api.viewProcessBpmn,
		method: "get",
		params: params
	});
};
/**
 * listFlowTaskComment
 */
export const listFlowTaskComment = (params) => {
	return request({
		url: api.listFlowTaskComment,
		method: "get",
		params: params
	});
};
/**
 * getFlowAndTaskInfo
 */
export const getFlowAndTaskInfo = (params) => {
	return request({
		url: api.getFlowAndTaskInfo,
		method: "get",
		params: params
	});
};
/**
 * viewTaskUserInfo
 */
export const viewTaskUserInfo = (params) => {
	return request({
		url: api.viewTaskUserInfo,
		method: "get",
		params: params
	});
};
/**
 * 查询地市
 */
export const getCity = params => {
	return request({
		url: api.getCity,
		method: "get",
		params: params
	});
};
/**
 * 查询区县
 */
export const getDistrict = params => {
	return request({
		url: api.getDistrict,
		method: "get",
		params: params
	});
};
/**
 * 新增或者更新质量检测数据
 */
export const addOrUpdateQualityDetection = data => {
	return request({
		url: api.addOrUpdateQualityDetection,
		method: "post",
		data: data
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

export const getCopyUserByFlowKey = data => {
	return request({
		url: api.getCopyUserByFlowKey,
		method: "get",
		params: data
	});
};

/**
 * 通过id获取一条质量检测数据
 */
export const getQualityDetectionDetail = params => {
	return request({
		url: api.getQualityDetectionDetail,
		method: "get",
		params: params
	});
};
/**
 * 通过id删除一条质量检测数据
 */
export const deleteQualityDetection = params => {
	return request({
		url: api.deleteQualityDetection,
		method: "get",
		params: params
	});
};
/**
 * 质量检测分页查询
 */
export const getQualityDetectionList = data => {
	return request({
		url: api.getQualityDetectionList,
		method: "post",
		data: data
	});
};
/**
 * 导出质量检测记录数据
 */
export const exportQualityDetectionList = data => {
	return request({
		url: api.exportQualityDetection,
		method: "post",
		data: data,
		"responseType": 'blob'
	});
};
/**
 * 获取材料枚举
 */
export const getMaterialEnums = () => {
	return request({
		url: api.getMaterialEnums,
		method: "get",
		params: {}
	});
}
/**
 * 新增或者更新隐蔽工程验收记录数据
 */
export const addOrUpdateHiddenProject = data => {
	return request({
		url: api.addOrUpdateHiddenProject,
		method: "post",
		data: data
	});
};
/**
 * 通过id获取一条隐蔽工程验收记录数据
 */
export const getHiddenProjectDetail = params => {
	return request({
		url: api.getHiddenProjectDetail,
		method: "get",
		params: params
	});
};
/**
 * 通过id删除一条隐蔽工程验收记录数据
 */
export const deleteHiddenProject = params => {
	return request({
		url: api.deleteHiddenProject,
		method: "get",
		params: params
	});
};
/**
 * 分页查询隐蔽工程验收记录数据
 */
export const getHiddenProjectList = data => {
	return request({
		url: api.getHiddenProjectList,
		method: "post",
		data: data
	});
};
/**
 * 导出隐蔽工程验收记录数据
 */
export const exportHiddenProjectList = data => {
	return request({
		url: api.exportHiddenProject,
		method: "post",
		data: data,
		"responseType": 'blob'
	});
};
//-----------------------流程引擎新增接口 ------------------------

//-----------------------流程引擎新增接口 ZH ---------------------

/**
 * 管理目标分页查询
 */
export const getManagementObjectList = data => {
	return request({
		url: api.getManagementObjectList,
		method: "post",
		data: data
	});
};
/**
 * 新增或更新 管理目标 数据
 */
export const addOrUpdateManagementObjectList = data => {
	return request({
		url: api.addOrUpdateManagementObjectList,
		method: "post",
		data: data
	});
};

/**
 * 通过id获取一条管理目标数据
 */
export const getManagementObject = id => {
	return request({
		url: api.getManagementObject,
		method: "get",
		params: {
			id
		}
	});
};

/**
 * 删除 管理目标 数据
 */
export const deleteManagementObject = id => {
	return request({
		url: api.deleteManagementObject,
		method: "get",
		params: {
			id
		}
	});
};


/**
 * 管理目标分页查询
 */
export const getManageRegimeList = data => {
	return request({
		url: api.getManageRegimeList,
		method: "post",
		data: data
	});
};
/**
 * 新增或更新 管理目标 数据
 */
export const addOrUpdateManageRegimeList = data => {
	return request({
		url: api.addOrUpdateManageRegimeList,
		method: "post",
		data: data
	});
};

/**
 * 通过id获取一条管理目标数据
 */
export const getManageRegime = id => {
	return request({
		url: api.getManageRegime,
		method: "get",
		params: {
			id
		}
	});
};

/**
 * 删除 管理目标 数据
 */
export const deleteManageRegime = id => {
	return request({
		url: api.deleteManageRegime,
		method: "get",
		params: {
			id
		}
	});
};

/**
 * 新增或者更新施工技术交底记录数据
 */
 export const addOrUpdateBuildTechBottom = data => {
	return request({
		url: api.addOrUpdateBuildTechBottom,
		method: "post",
		data: data
	});
};
/**
 * 通过id获取一条施工技术交底记录数据
 */
export const getBuildTechBottomDetail = params => {
	return request({
		url: api.getBuildTechBottomDetail,
		method: "get",
		params: params
	});
};
/**
 * 通过id删除一条施工技术交底记录数据
 */
export const deleteBuildTechBottom = params => {
	return request({
		url: api.deleteBuildTechBottom,
		method: "get",
		params: params
	});
};
/**
 * 分页查询施工技术交底记录数据
 */
export const getBuildTechBottomList = data => {
	return request({
		url: api.getBuildTechBottomList,
		method: "post",
		data: data
	});
};

/**
 * 新增或者更新施工方案记录数据
 */
 export const addOrUpdateBuildPlan = data => {
	return request({
		url: api.addOrUpdateBuildPlan,
		method: "post",
		data: data
	});
};
/**
 * 通过id获取一条施工方案记录数据
 */
export const getBuildPlanDetail = params => {
	return request({
		url: api.getBuildPlanDetail,
		method: "get",
		params: params
	});
};
/**
 * 通过id删除一条施工方案记录数据
 */
export const deleteBuildPlan = params => {
	return request({
		url: api.deleteBuildPlan,
		method: "get",
		params: params
	});
};
/**
 * 分页查询施工方案记录数据
 */
export const getBuildPlanList = data => {
	return request({
		url: api.getBuildPlanList,
		method: "post",
		data: data
	});
};
//-----------------------流程引擎新增接口 ZH ---------------------






export const addOrUpdateProjectOpenExit = data => {
	return request({
		url: api.addOrUpdateProjectOpenExit,
		method: "post",
		data: data
	});
};

export const getProjectOpenDeatil = id => {
	return request({
		url: api.getProjectOpenDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteProjectOpen = id => {
	return request({
		url: api.deleteProjectOpen,
		method: "get",
		params: {
			id
		}
	});
};

export const getProjectOpenList = data => {
	return request({
		url: api.getProjectOpenList,
		method: "post",
		data: data
	});
};

export const addOrUpdateSubitemOpen = data => {
	return request({
		url: api.addOrUpdateSubitemOpen,
		method: "post",
		data: data
	});
};

export const getSubitemOpenDeatil = id => {
	return request({
		url: api.getSubitemOpenDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteSubitemOpen = id => {
	return request({
		url: api.deleteSubitemOpen,
		method: "get",
		params: {
			id
		}
	});
};

export const getSubitemOpenList = data => {
	return request({
		url: api.getSubitemOpenList,
		method: "post",
		data: data
	});
};


export const addOrUpdateFirstAccept = data => {
	return request({
		url: api.addOrUpdateFirstAccept,
		method: "post",
		data: data
	});
};

export const getFirstAcceptDeatil = id => {
	return request({
		url: api.getFirstAcceptDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteFirstAccept = id => {
	return request({
		url: api.deleteFirstAccept,
		method: "get",
		params: {
			id
		}
	});
};

export const getFirstAcceptList = data => {
	return request({
		url: api.getFirstAcceptList,
		method: "post",
		data: data
	});
};

export const addOrUpdateQualityReport = data => {
	return request({
		url: api.addOrUpdateQualityReport,
		method: "post",
		data: data
	});
};

export const getQualityReportDeatil = id => {
	return request({
		url: api.getQualityReportDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteQualityReport = id => {
	return request({
		url: api.deleteQualityReport,
		method: "get",
		params: {
			id
		}
	});
};

export const getQualityReportList = data => {
	return request({
		url: api.getQualityReportList,
		method: "post",
		data: data
	});
};



export const addOrUpdateSupervisionSide = data => {
	return request({
		url: api.addOrUpdateSupervisionSide,
		method: "post",
		data: data
	});
};

export const getSupervisionSideDeatil = id => {
	return request({
		url: api.getSupervisionSideDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteSupervisionSide = id => {
	return request({
		url: api.deleteSupervisionSide,
		method: "get",
		params: {
			id
		}
	});
};

export const getSupervisionSideList = data => {
	return request({
		url: api.getSupervisionSideList,
		method: "post",
		data: data
	});
};
export const getSupervisionSideEnums = () => {
	return request({
		url: api.getSupervisionSideEnums,
		method: "get",
		params: {}
	});
}
export const addOrUpdateSupervisionPatrol = data => {
	return request({
		url: api.addOrUpdateSupervisionPatrol,
		method: "post",
		data: data
	});
};

export const getSupervisionPatrolDeatil = id => {
	return request({
		url: api.getSupervisionPatrolDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteSupervisionPatrol = id => {
	return request({
		url: api.deleteSupervisionPatrol,
		method: "get",
		params: {
			id
		}
	});
};

export const getSupervisionPatrolList = data => {
	return request({
		url: api.getSupervisionPatrolList,
		method: "post",
		data: data
	});
};


export const addOrUpdateSupervisionNotice = data => {
	return request({
		url: api.addOrUpdateSupervisionNotice,
		method: "post",
		data: data
	});
};

export const getSupervisionNoticeDeatil = id => {
	return request({
		url: api.getSupervisionNoticeDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteSupervisionNotice = id => {
	return request({
		url: api.deleteSupervisionNotice,
		method: "get",
		params: {
			id
		}
	});
};

export const getSupervisionNoticeList = data => {
	return request({
		url: api.getSupervisionNoticeList,
		method: "post",
		data: data
	});
};


export const addOrUpdateQualityActivity = data => {
	return request({
		url: api.addOrUpdateQualityActivity,
		method: "post",
		data: data
	});
};

export const getQualityActivityDeatil = id => {
	return request({
		url: api.getQualityActivityDeatil,
		method: "get",
		params: {
			id
		}
	});
};

export const deleteQualityActivity = id => {
	return request({
		url: api.deleteQualityActivity,
		method: "get",
		params: {
			id
		}
	});
};

export const getQualityActivityList = data => {
	return request({
		url: api.getQualityActivityList,
		method: "post",
		data: data
	});
};