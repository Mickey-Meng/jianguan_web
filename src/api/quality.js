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
