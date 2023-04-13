import request from "@/utils/request";
export default class FlowEntryController {
  static list (data) {
    // return sender.doUrl('/admin/flow/flowEntry/list', 'post', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/list",
      method: "post",
      data: data
    });
  }

  static view (params) {
    // return sender.doUrl('/admin/flow/flowEntry/view', 'get', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/view",
      method: "get",
      params: params
    });
  }

  static add (data) {
    // return sender.doUrl('/admin/flow/flowEntry/add', 'post', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/add",
      method: "post",
      data: data
    });
  }

  static update (data) {
    // return sender.doUrl('/admin/flow/flowEntry/update', 'post', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/update",
      method: "post",
      data: data
    });
  }

  static delete (data) {
    // return sender.doUrl('/admin/flow/flowEntry/delete', 'post', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/delete",
      method: "post",
      data: data
    });
  }

  static publish (data) {
    // return sender.doUrl('/admin/flow/flowEntry/publish', 'post', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/publish",
      method: "post",
      data: data
    });
  }

  static listFlowEntryPublish (params) {
    // return sender.doUrl('/admin/flow/flowEntry/listFlowEntryPublish', 'get', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/listFlowEntryPublish",
      method: "get",
      params: params
    });
  }

  static updateMainVersion (data) {
    // return sender.doUrl('/admin/flow/flowEntry/updateMainVersion', 'post', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/updateMainVersion",
      method: "post",
      data: data
    });
  }

  // 通过flowKey删除流程节点审核人员
  static removeByFlowKey (params) {
    // return sender.doUrl('/admin/flow/flowEntry/updateMainVersion', 'post', params, axiosOption, httpOption);
    return request({
      url: "/web/api/v1/flowAuditEntry/removeByFlowKey",
      method: "get",
      params: params
    });
  }

  static suspendFlowEntryPublish (data) {
    // return sender.doUrl('/admin/flow/flowEntry/suspendFlowEntryPublish', 'post', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/suspendFlowEntryPublish",
      method: "post",
      data: data
    });
  }

  static activateFlowEntryPublish (data) {
    // return sender.doUrl('/admin/flow/flowEntry/activateFlowEntryPublish', 'post', params, axiosOption, httpOption);
    return request({
      url: "/admin/flow/flowEntry/activateFlowEntryPublish",
      method: "post",
      data: data
    });
  }

  static viewDict (sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowEntry/viewDict', 'get', params, axiosOption, httpOption);
  }

  static listDict (sender, params, axiosOption, httpOption) {
    return sender.doUrl('/admin/flow/flowEntry/listDict', 'get', params, axiosOption, httpOption);
  }
}
