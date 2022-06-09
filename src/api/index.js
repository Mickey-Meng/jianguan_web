/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:32
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 19:52:20
 */
const api = {
  login: "/ZhuJiRoad/user/login",
  getWorkArea: "/ZhuJiRoad/safe/uploadAddr", //获取工区数据，
  getAreaByAuthority: "/ZhuJiRoad/safe/getGroups", //根据用户权限返回对应的工区
  getProjectByArea: "/ZhuJiRoad/safe/getprojectBygongqu", //根据工区获取项目数据
  getCheckerByAreaId: "/ZhuJiRoad/safe/getPersonLiableByGroup", //根据工区获取施工人员数据
  getQiaoData: "/ZhuJiRoad/count/getQiaoData", // 获取桥数据
  viewToken: "/ZhuJiRoad/user/viewToken", // 获取视频token，当视频token过期的时候请求这个接口
  getSupervisorMsg: "/ZhuJiRoad/message/getMessage1", //消息提示
  getConstructionMsg: "/ZhuJiRoad/message/getMessage2", //消息提示
  tellOnline: "/ZhuJiRoad/user/updateOnline", //上报在新
  getComponentProgressByModel: "/ZhuJiRoad/component/getComponentProgress", //根据模型id查询构件的进度信息

  //----------------------根据项目id获取数据、修改------------------------
  getWorkAreaByProjectId: "/ZhuJiRoad/projects/getGongQu",//根据项目id获取下面的工区
  /*
   * 数据中心首页接口
   * */
  // 获取项目信息工程规模，合同工期，投资规模以及关联单位
  getEngCompany: "/ZhuJiRoad/count/getProjectDetail",
  // 获取项目
  // 获取进度中间表格数据
  getMiddleData: "/ZhuJiRoad/progress/getMiddleData",
  // 获取进度的右侧数据周报月报
  getWeekMonthly: "/ZhuJiRoad/progress/getStatus",
  //设置构件计划时间
  setComponentTime: "/ZhuJiRoad/progress/uploadProgress",
  //获取构件四个时间
  getConponmentTime: "/ZhuJiRoad/progress/getByConponentid",
  //
  bridgeTree: "/ZhuJiRoad/component/getTree",
  schedule: "/ZhuJiRoad/schedule/getScheuleAll",
  // 获取项目下拉选数据
  projectSelect: "/ZhuJiRoad/progress/projectSelect",
  getHomeChart: "/ZhuJiRoad/count/getpjFirst", //首页统计模式图表数据
  getHomeBottomChart: "/ZhuJiRoad/count/getGqFirst", //首页统计模式图表数据
  getSafeChart: "/ZhuJiRoad/safe/newInterface", //首页安全统计
  getAreaProgress: "/ZhuJiRoad/count/getCountIncresConponentGroupGq", //获取进度总览左下进度折线图数据
  getAllProject: "/ZhuJiRoad/projects/getAllProjects",//获取所有项目、后续根据用户查询有权限访问的数据
  getAllProjectsData: "/ZhuJiRoad/projects/getAll",//获取项目表所有数据
  /*
   * 工程统计
   * */
  // 获取每个构件的完成情况  形象进度  进度总览
  getConponentStatus: "/ZhuJiRoad/progress/getConponentStatus",
  // 构件完成数量--左右上图数据，还有方量数量
  getFinishConponent: "/ZhuJiRoad/count/getFinishConponent",
  // 构件完成数量按照月，按照日，按照季度--左下图数据
  getCountConponent: "/ZhuJiRoad/count/getCountConponent",
  // 获取项目下的构件的类型分类
  componentType: "/ZhuJiRoad/count/getNewType",
  // 构件完成数量按照月，按照日，按照季度--右下图数据
  getCountIncresConponent: "/ZhuJiRoad/count/getCountIncresConponent",
  // 获取每个工程的项目构件类型
  getProjectTypeData: "/ZhuJiRoad/count/getProject", //进度总览表格图下拉选择接口
  getProgressTableData: "/ZhuJiRoad/count/getTypeData", //获取进度总览表格数据

  /*
   * 质量管理页面
   * */
  checkViewTree: "/ZhuJiRoad/produce/getType",
  checkViewTable: "/ZhuJiRoad/produce/getTypeStatus", //原质量验收表格数据
  getNewCheckViewTable: "/ZhuJiRoad/produce/getTypeStatus", //最新质量验收表格数据
  getCurrentPdf: "/ZhuJiRoad/produce/getCheckDataByrecod", //获取质量验收工序pdf
  processRecords: "/ZhuJiRoad/produce/getCheckDataById",
  getAllcheckData: "/ZhuJiRoad/produce/getAllcheckData",
  getAllQualityGetPerday: "/ZhuJiRoad/quality/getPerday", //质量总览左下角数据
  getQualityEventsGetDay: "/ZhuJiRoad/quality/getDay", //质量总览右下角数据
  deleteQualityEvent: "/ZhuJiRoad/quality/deleteEvent", //删除质量事件

  // ------------------质量检查、质量整个、整改确认、质量验收 -------------
  bigSmallQuality: "/ZhuJiRoad/quality/getTree", //获取质量大小类
  getQualityPrincipal: "/ZhuJiRoad/quality/getcheck", //获取工区负责人
  addQuality: "/ZhuJiRoad/quality/uploadData", //监理上传质量事件接口
  getWorkList: "/ZhuJiRoad/quality/getQualityEvent", //施工获取质量检查事件
  submitFinishEvent: "/ZhuJiRoad/quality/submitDealWithSafeEvent", //施工方确认质量整改
  submitDealEvent: "/ZhuJiRoad/quality/submitDelaySafeEvent", //施工方对质量事件延期处理
  getDelayEvent: "/ZhuJiRoad/quality/getDelaySafeEvent", //监理查询申请延期事件
  disposeDelay: "/ZhuJiRoad/quality/doDelaySafeEvent", //监理方处理延期申请
  disposeFinishQualityEvent: "/ZhuJiRoad/quality/doNotDoneSafeEvent", //监理确认已整改质量事件
  getFinishQualityEvent: "/ZhuJiRoad/quality/getNotDoneSafeEvent", //监理方获取已整改待确认事件
  getCompleteEvents: "/ZhuJiRoad/quality/getDoneSafeEvent", //获取监理验收审核的质量事件
  getAllQualityEvents: "/ZhuJiRoad/quality/getAllStatusQualityEvent", //获取所有质量事件
  getQualityEventsStatistic: "/ZhuJiRoad/quality/group", //获取质量总览右上角数据
  getQualityChart: "/ZhuJiRoad/quality/newInterface", //质量总览左上角图表数据
  //---------------------------新闻---------------------------------
  getNews: "/ZhuJiRoad/news/get", //根据type查询新闻
  addNews: "/ZhuJiRoad/news/add", //新增新闻
  updateNews: "/ZhuJiRoad/news/update", //更新新闻
  deleteNews: "/ZhuJiRoad/news/del", //删除新闻
  getTenNews: "/ZhuJiRoad/news/getNews", //查询最新的10条新闻

  //-------------------- 工序---------
  deleteProduceInfo: "/ZhuJiRoad/produce/deleteProcess", //删除工序
  /*
   * 工序填报页面
   * */
  checkData: "/ZhuJiRoad/produce/getCheckDataByConponentId", //原获取工序接口
  getCheckData: "/ZhuJiRoad/produce/getCheckDataByConponentId", //最新获取工序接口
  fillProject: "/ZhuJiRoad/produce/getPorjectItem",
  addRecord: "/ZhuJiRoad/produce/addRecode",
  checker: "/ZhuJiRoad/produce/getChecker",
  updateProgress: "/ZhuJiRoad/produce/updateRecode", //驳回后的工序再次修改
  /*
   * 工序审核页面
   * */
  getAgency: "/ZhuJiRoad/produce/getAgency",
  confirmReport: "/ZhuJiRoad/produce/check",
  /*
   * 安全
   * */


  getDoneSafeEvent: "/ZhuJiRoad/safe/getDoneSafeEvent", //查询监理已审核确认整改安全事件  ------没有用到 -----------

  //---------安全接口已修改-----
  getNotDoneSafeEvent: "/ZhuJiRoad/safe/getNotDoneSafeEvent", //监理方根据标段ID查询需要整改确认的数据
  getSafeEvent: "/ZhuJiRoad/safe/getSafeEvent", //施工方根据标段ID获取安全检查事件
  getDelaySafeEvent: "/ZhuJiRoad/safe/getDelaySafeEvent", //监理方根据标段ID查询延期申请事件
  //无需修改接口
  doDelaySafeEvent: "/ZhuJiRoad/safe/doDelaySafeEvent", //监理处理安全事件延期申请
  doNotDoneSafeEvent: "/ZhuJiRoad/safe/doNotDoneSafeEvent", //监理审核安全事件整改
  //---------安全接口已修改-----

  bigSmallSafe: "/ZhuJiRoad/safe/getTree", //获取安全事件大小类数据
  getcheck: "/ZhuJiRoad/safe/getcheck", //获取安全事件工区负责人数据  ----弃用----------
  submitDealWithSafeEvent: "/ZhuJiRoad/safe/submitDealWithSafeEvent", //施工方对安全数据进行整改上报
  submitDelaySafeEvent: "/ZhuJiRoad/safe/submitDelaySafeEvent", //施工方申请事件延期处理
  submitSafeData: "/ZhuJiRoad/safe/uploadData", //监理方提交安全检查事件
  getAllSafeEvents: "/ZhuJiRoad/safe/getAllStatusSafeEvent",
  getSafeEventsStatistic: "/ZhuJiRoad/safe/group", //安全总览右上角事件统计接口
  deleteSafeEvent: "/ZhuJiRoad/safe/deleteEvent", //删除安全事件


  // 获取每月安全事件数据--表格左侧的工区每日状态
  getPerMonthSafeData: "/ZhuJiRoad/count/getPerMonthSafeData",
  // 获取某一天的安全事件
  getDayData: "/ZhuJiRoad/count/getDayData",
  // 安全事件分类汇总
  getByFirstType: "/ZhuJiRoad/count/getByFirstType",
  // 获取周月履职情况
  getPerSafeData: "/ZhuJiRoad/count/getPerSafeData",
  getSafePerday: "/ZhuJiRoad/safe/getPerday", //获取安全总览巡更一览数据
  getDaySafeEvents: "/ZhuJiRoad/safe/getDay", //安全总览获取某天的安全事件
  /*
   * 智慧工地
   * */
  environmentVideo: "/ZhuJiRoad/progress/getYcData",
  // 每日环境趋势变化图
  getDayTrend: "/ZhuJiRoad/count/getDayTrend",
  // 获取每月环境统计数据
  getEnvPerMonth: "/ZhuJiRoad/count/getEnvPerMonth",
  // 每日环境趋势变化图
  getExceedData: "/ZhuJiRoad/count/getExceedData",
  //-----------------------系统管理 工点管理-------------
  getWorkPoint: "/ZhuJiRoad/digitalTwin/getData", //获取工点
  addWorkPoint: "/ZhuJiRoad/digitalTwin/addData", //新增工点
  deleteWorkPoint: "/ZhuJiRoad/digitalTwin/delData", //删除工点
  updateWorkPoint: "/ZhuJiRoad/digitalTwin/updateData", //更新工点
  //------------------------系统管理、岗位管理 --------------------------弃用
  getAllPost: "/ZhuJiRoad/person/getPosts", //查询岗位信息
  addPost: "/ZhuJiRoad/person/addPost", //新增岗位
  deletePost: "/ZhuJiRoad/person/deletePost", //删除岗位
  updatePost: "/ZhuJiRoad/person/updatePost", //修改岗位
  personnelBindingPost: "/ZhuJiRoad/person/addUserPost",//人员绑定岗位
  //-----------------------系统管理、组织管理 ------------------------ 弃用
  addOrganization: "/ZhuJiRoad/person/addDepartment", //新增组织
  updateOrganization: "/ZhuJiRoad/person/updateDepartment", //更新组织
  deleteOrganization: "/ZhuJiRoad/person/deleteDepartment", //删除组织
  getOrganization: "/ZhuJiRoad/person/getDepartments", //获取组织,
  bindingUsersToOrganizations: "/ZhuJiRoad/person/addUserGroup",//组织绑定用户
  getUserBindOrganizations: "/ZhuJiRoad/person/getPersonRole",//获取用户组织关联关系
  getAllOrganization: "/ZhuJiRoad/person/getUserByGroup",//获取组织，一维数组
  getRoleInfoByUserId: "/ZhuJiRoad/projects/getUsersByUserid",//根据用ID和项目想ID查询角色信息
  //-------------------人员报审模块开始 ---------------------------
  getOrgUser: "/ZhuJiRoad/projects/getUsersByUserid",//获取用户对应组织下的所有用户信息
  getUsersRoles: "/ZhuJiRoad/projects/getAllRoles",//获取用户和角色的数据
  addStaffApproval: "/ZhuJiRoad/person/subContract",//上传报审信息,
  getStaffApprovalBase: "/ZhuJiRoad/person/getContracts",//获取报审的基本信息
  getStaffByProcessIdAndProjectId: "/ZhuJiRoad/person/getContractByProcessId",//根据项目id和工单ID查询报审的信息
  //----------------人员变更 -----------------
  addPersonChange: "/ZhuJiRoad/person/subPersonChange",//提交人员变更
  getPersonChange: "/ZhuJiRoad/person/getPersonChange",//获取人员变更信息
  getPersonChangeByProcessId: "/ZhuJiRoad/person/getChangeByProcessId",//根据项目id和工单ID查询变更信息
  //-------------------- 请假申请------------------
  submitLeave: "/ZhuJiRoad/person/subLeave",//提交请假申请
  getLeave: "/ZhuJiRoad/person/getLeaveData",//获取请假数据
  getLeaveByProcessId: "/ZhuJiRoad/person/getLeaveByProcessId",
  //-------------电子围栏--------------
  addFence: "/ZhuJiRoad/fence/addFence",//新增电子围栏
  deleteFence: "/ZhuJiRoad/fence/delFence",//删除电子围栏
  getFence: "/ZhuJiRoad/fence/getFence",//获取电子围栏
  updateFence: "/ZhuJiRoad/fence/updateFence",//更新电子围栏
  //-------------打卡时间制定-------------------
  addClockTime: "/ZhuJiRoad/fence/addClock",
  getClockTime: "/ZhuJiRoad/fence/getClock",
  updateClockTime: "/ZhuJiRoad/fence/updateClock",
  deleteClockTime: "/ZhuJiRoad/fence/delClock",


  //-----------------------流程引擎新增接口 ------------------------
  //项目相关
  getChildProject: "/ZhuJiRoad/projects/getChildProject",//通过项目id获取项目子级的标段信息
  getCompanyByProjectId: "/ZhuJiRoad/projects/getCompanyByProjectId",//通过项目下的标段id获取项目的单位信息
  getInfoByProjectId: "/ZhuJiRoad/projects/getInfoByProjectId",//通过项目id查询组织信息和用户信息
  getProjectInfoById: "/ZhuJiRoad/projects/getProjectInfoById",//通过项目id查询项目详细信息（项目名、施工单位、监理单位、合同号等）
  getProjectRoleTree: "/ZhuJiRoad/projects/getProjectRoleTree",//获取项目下面的组织角色树
  getProjectUserTree: "/ZhuJiRoad/projects/getProjectUserTree",//获取项目下面的组织用户树
  getUserByRoleId: "/ZhuJiRoad/projects/getUserByRoleId",//通过角色id获取用户信息
  //上传文件接口
  uploadFile: "/ZhuJiRoad/mong/newUpload",
  getFileInfo: "/ZhuJiRoad/mong/findFile",
  downloadFile: "/ZhuJiRoad/mong/download",//下载文件
  previewFile: "/ZhuJiRoad/mong/preview",//预览文件
  //任务
  listHandleTask:'/ZhuJiApi/admin/flow/flowOperation/listRuntimeTask',//待办
  listHistoricTask:'/ZhuJiApi/admin/flow/flowOperation/listHistoricTask',//已办
  listHistoricProcessInstance:'/ZhuJiApi/admin/flow/flowOperation/listHistoricProcessInstance',//历史任务
  submitUserTask:'/ZhuJiApi/admin/flow/flowStaticPage/submitUserTask',
  rejectRuntimeTask:'/ZhuJiApi/admin/flow/flowOperation/rejectRuntimeTask',//驳回
  viewTaskUserInfo:'/ZhuJiApi/admin/flow/flowOperation/viewTaskUserInfo',//审批人
  viewRuntimeTaskInfo:'/ZhuJiApi/admin/flow/flowOperation/viewRuntimeTaskInfo',//查询流程按钮
  viewHighlightFlowData:'/ZhuJiApi/admin/flow/flowOperation/viewHighlightFlowData',//高亮流程图
  viewProcessBpmn:'/ZhuJiApi/admin/flow/flowOperation/viewProcessBpmn',//获取流程图bpmn
  listFlowTaskComment:'/ZhuJiApi/admin/flow/flowOperation/listFlowTaskComment',//获取当前流程任务的审批列表

  getFlowAndTaskInfo:'/ZhuJiApi/admin/flow/flowStaticPage/getFlowAndTaskInfo',//根据流程idH获取三个key 用于查看审批信息

  //省市区
  getDistrict:'/ZhuJiApi/web/api/v1/proviceCityArea/getDistrict',//区县
  getCity:'/ZhuJiApi/web/api/v1/proviceCityArea/getCity',//地市
  getProvince:'/ZhuJiApi/web/api/v1/proviceCityArea/getProvince',//省
  //隐蔽工程
  getHiddenProjectList: "/ZhuJiApi/web/api/v1/hiddenProjectAccept/page",
  getHiddenProjectDetail: "/ZhuJiApi/web/api/v1/hiddenProjectAccept/detail/id",
  addOrUpdateHiddenProject: "/ZhuJiApi/web/api/v1/hiddenProjectAccept/addOrUpdate",
  deleteHiddenProject: "/ZhuJiApi/web/api/v1/hiddenProjectAccept/id",
  exportHiddenProject: "/ZhuJiApi/web/api/v1/hiddenProjectAccept/export",
  //质量检测
  flowAuditEntry: "/ZhuJiApi/web/api/v1/flowAuditEntry/getAuditInfoByFlowKey",
  addOrUpdateQualityDetection: "/ZhuJiApi/web/api/v1/qualityDetection/addOrUpdate",
  getQualityDetectionDetail: "/ZhuJiApi/web/api/v1/qualityDetection/detail/id",
  getMaterialEnums: "/ZhuJiApi/web/api/v1/qualityDetection/material/enums",
  deleteQualityDetection: "/ZhuJiApi/web/api/v1/qualityDetection/id",
  getQualityDetectionList: "/ZhuJiApi/web/api/v1/qualityDetection/page",
  exportQualityDetection: "/ZhuJiApi/web/api/v1/qualityDetection/export",

  //流程引擎相关接口

  //-----------------------流程引擎新增接口 ------------------------
  //-----------------------流程引擎新增接口 ZH ---------------------
  addOrUpdateManagementObjectList: "/ZhuJiApi/web/api/v1/manageTarget/addOrUpdate", // 新增或更新管理目标数据
  getManagementObject: "/ZhuJiApi/web/api/v1/manageTarget/detail/id", // 通过id获取一条管理目标数据
  deleteManagementObject: "/ZhuJiApi/web/api/v1/manageTarget/id", // 删除单个管理目标数据
  getManagementObjectList: "/ZhuJiApi/web/api/v1/manageTarget/page", // 管理目标list

  addOrUpdateManageRegimeList: "/ZhuJiApi/web/api/v1/manageRegime/addOrUpdate", // 新增或更新管理制度数据
  getManageRegime: "/ZhuJiApi/web/api/v1/manageRegime/detail/id", // 通过id获取一条管理制度数据
  deleteManageRegime: "/ZhuJiApi/web/api/v1/manageRegime/id", // 删除单个管理制度数据
  getManageRegimeList: "/ZhuJiApi/web/api/v1/manageRegime/page", // 管理制度list


  //施工技术交底
  getBuildTechBottomList: "/ZhuJiApi/web/api/v1/buildTechBottom/page",
  getBuildTechBottomDetail: "/ZhuJiApi/web/api/v1/buildTechBottom/detail/id",
  addOrUpdateBuildTechBottom: "/ZhuJiApi/web/api/v1/buildTechBottom/addOrUpdate",
  deleteBuildTechBottom: "/ZhuJiApi/web/api/v1/buildTechBottom/id",
  //施工方案
  getBuildPlanList: "/ZhuJiApi/web/api/v1/buildPlan/page",
  getBuildPlanDetail: "/ZhuJiApi/web/api/v1/buildPlan/detail/id",
  addOrUpdateBuildPlan: "/ZhuJiApi/web/api/v1/buildPlan/addOrUpdate",
  deleteBuildPlan: "/ZhuJiApi/web/api/v1/buildPlan/id",
  //-----------------------流程引擎新增接口 ZH ----------------------


  //劳务分包合同
  addOrUpdateContractLabor: "/ZhuJiApi/web/api/v1/laborContract/addOrUpdate",
  getContractLaborDeatil: "/ZhuJiApi/web/api/v1/laborContract/detail/id",
  deleteContractLabor: "/ZhuJiApi/web/api/v1/laborContract/id",
  getContractLaborList: "/ZhuJiApi/web/api/v1/laborContract/page",

  //施工专业分包合同
  addOrUpdateContractBuild: "/ZhuJiApi/web/api/v1/buildContract/addOrUpdate",
  getContractBuildDeatil: "/ZhuJiApi/web/api/v1/buildContract/detail/id",
  deleteContractBuild: "/ZhuJiApi/web/api/v1/buildContract/id",
  getContractBuildList: "/ZhuJiApi/web/api/v1/buildContract/page",
  getContractBuildEnums: "/ZhuJiApi/web/api/v1/buildContract/buildContractPart/enums",

  //往来款
  addOrUpdateComeGoMoney: "/ZhuJiApi/web/api/v1/comeGoMoney/addOrUpdate",
  getComeGoMoneyDeatil: "/ZhuJiApi/web/api/v1/comeGoMoney/detail/id",
  deleteComeGoMoney: "/ZhuJiApi/web/api/v1/comeGoMoney/id",
  getComeGoMoneyList: "/ZhuJiApi/web/api/v1/comeGoMoney/page",
  //进退场
  addOrUpdateEnterExit: "/ZhuJiApi/web/api/v1/enterExit/addOrUpdate",
  getEnterExitDeatil: "/ZhuJiApi/web/api/v1/enterExit/detail/id",
  deleteEnterExit: "/ZhuJiApi/web/api/v1/enterExit/id",
  getEnterExitList: "/ZhuJiApi/web/api/v1/enterExit/page",
  getEnterExitUserList: "/ZhuJiApi/web/api/v1/enterExitUser/page",

  //设备进场
  addOrUpdateEquipmentEnter: "/ZhuJiApi/web/api/v1/equipmentEnter/addOrUpdate",
  getEquipmentEnterDeatil: "/ZhuJiApi/web/api/v1/equipmentEnter/detail/id",
  deleteEquipmentEnter: "/ZhuJiApi/web/api/v1/equipmentEnter/id",
  getEquipmentEnterList: "/ZhuJiApi/web/api/v1/equipmentEnter/page",
  getEquipmentEnterEnums: "/ZhuJiApi/web/api/v1/equipmentEnter/equipment/enums",
  //设备退场
  addOrUpdateEquipmentExit: "/ZhuJiApi/web/api/v1/equipmentExit/addOrUpdate",
  getEquipmentExitDeatil: "/ZhuJiApi/web/api/v1/equipmentExit/detail/id",
  deleteEquipmentExit: "/ZhuJiApi/web/api/v1/equipmentExit/id",
  getEquipmentExitList: "/ZhuJiApi/web/api/v1/equipmentExit/page",
  
  //项目开工申请
  addOrUpdateProjectOpenExit: "/ZhuJiApi/web/api/v1/projectOpen/addOrUpdate",
  getProjectOpenDeatil: "/ZhuJiApi/web/api/v1/projectOpen/detail/id",
  deleteProjectOpen: "/ZhuJiApi/web/api/v1/projectOpen/id",
  getProjectOpenList: "/ZhuJiApi/web/api/v1/projectOpen/page",
  //分项开工申请
  addOrUpdateSubitemOpen: "/ZhuJiApi/web/api/v1/subitemOpen/addOrUpdate",
  getSubitemOpenDeatil: "/ZhuJiApi/web/api/v1/subitemOpen/detail/id",
  deleteSubitemOpen: "/ZhuJiApi/web/api/v1/subitemOpen/id",
  getSubitemOpenList: "/ZhuJiApi/web/api/v1/subitemOpen/page",
};

export default api;
