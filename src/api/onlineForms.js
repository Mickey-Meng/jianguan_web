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
  