import request from "@/utils/request";
export default class FlowEntryVariableController {
  static list (data) {
    // return sender.doUrl('/admin/flow/flowEntryVariable/list', 'post', params, axiosOption, httpOption);
    return request({
      url: "/ZhuJiApi/admin/flow/flowEntryVariable/list",
      method: "post",
      data: data
    });
  }

  static add (data) {
    // return sender.doUrl('/admin/flow/flowEntryVariable/add', 'post', params, axiosOption, httpOption);
    return request({
      url: "/ZhuJiApi/admin/flow/flowEntryVariable/add",
      method: "post",
      data: data
    });
  }

  static update (data) {
    // return sender.doUrl('/admin/flow/flowEntryVariable/update', 'post', params, axiosOption, httpOption);
    return request({
      url: "/ZhuJiApi/admin/flow/flowEntryVariable/update",
      method: "post",
      data: data
    });
  }

  static delete (data) {
    // return sender.doUrl('/admin/flow/flowEntryVariable/delete', 'post', params, axiosOption, httpOption);
    return request({
      url: "/ZhuJiApi/admin/flow/flowEntryVariable/delete",
      method: "post",
      data: data
    });
  }

  static view (params) {
    // return sender.doUrl('/admin/flow/flowEntryVariable/view', 'get', params, axiosOption, httpOption);
    return request({
      url: "/ZhuJiApi/admin/flow/flowEntryVariable/view",
      method: "get",
      params: params
    });
  }
}
