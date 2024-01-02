import request from '@/utils/request'

// 查询工序附件信息列表
export function listProduceDocument(params) {
  return request({
    url: '/produce/produceDocument/list',
    method: 'get',
    params: params
  })
}

// 查询工序附件信息详细
export function getProduceDocument(id) {
  return request({
    url: '/produce/produceDocument/' + id,
    method: 'get'
  })
}

// 新增工序附件信息
export function addProduceDocument(data) {
  return request({
    url: '/produce/produceDocument',
    method: 'post',
    data: data
  })
}

// 修改工序附件信息
export function updateProduceDocument(data) {
  return request({
    url: '/produce/produceDocument',
    method: 'put',
    data: data
  })
}

// 删除工序附件信息
export function delProduceDocument(id) {
  return request({
    url: '/produce/produceDocument/' + id,
    method: 'delete'
  })
}
