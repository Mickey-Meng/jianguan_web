import request from "@/utils/request";

// 获取填充数据后的模板
export function getFillDataTemplate(id, params) {
    return request({
      url: '/system/jg/produce/getFillDataTemplate/' + id,
      method: 'get',
      params: params,
     // transformRequest: [(params) => { return tansParams(params) }],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob'
    })
  }
  
  export function saveFillDataTemplate(id, data) {
    return request({
      url: '/system/jg/produce/saveFillDataTemplate/' + id,
      method: 'post',
      data: data
    })
  }

  export function saveOnlineTemplate(id, data) {
    return request({
      url: '/onlineForms/produceOnline/saveFillDataTemplate/' + id,
      method: 'post',
      data: data
    })
  }

  export function addReportRecord(data) {
    return request({
      url: '/produce/addRecode',
      method: 'post',
      data: data
    })
  }

  export function getRecordById(id) {
    return request({
      url: '/produce/getCheckDataByrecod',
      method: 'get',
      params: {recodeid : id}
    })
  }

  export function submitReport(data) {
    return request({
      url: '/onlineForms/produceOnline/submitReport',
      method: 'post',
      data: data
    })
  }

  //根据流程idH获取三个key 用于查看审批信息
  export function getFlowAndTaskInfo(data) {
    return request({
      url: "/admin/flow/flowStaticPage/getFlowAndTaskInfo",
      method: "get",
      params: data
    });
  };
  