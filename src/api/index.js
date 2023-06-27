/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2021-09-08 09:11:32
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-05-09 19:52:20
 */

const api = {
    //login: "/user/login",
    login: "/user/doLogin",
    onlineStatus:"/monitor/online/onlineStatus",
    getWorkArea: "/safe/uploadAddr", //获取工区数据，
    getAreaByAuthority: "/safe/getGroups", //根据用户权限返回对应的工区
    getProjectByArea: "/safe/getprojectBygongqu", //根据工区获取项目数据
    getCheckerByAreaId: "/safe/getPersonLiableByGroup", //根据工区获取施工人员数据
    getQiaoData: "/count/getQiaoData", // 获取桥数据
    viewToken: "/user/viewToken/new", // 获取视频token，当视频token过期的时候请求这个接口
    getSupervisorMsg: "/message/getMessage1", //消息提示
    getConstructionMsg: "/message/getMessage2", //消息提示
    tellOnline: "/user/updateOnline", //上报在新
    getComponentProgressByModel: "/component/getComponentProgress", //根据模型id查询构件的进度信息
    getTodayWeather: "/count/getTodayWeather", //获取诸暨当天天气情况
    getConAndReferPerson: "/person/getPerson",//获取建设集团和全咨集团的人

    //----------------------根据项目id获取数据、修改------------------------
    getWorkAreaByProjectId: "/projects/getGongQu", //根据项目id获取下面的工区
    getRolesByProject: "/projects/getRolesByProject?projectId=3",


    /*
     * 数据中心首页接口
     * */
    // 获取项目信息工程规模，合同工期，投资规模以及关联单位
    getEngCompany: "/count/getProjectDetail",
    // 获取项目
    // 获取进度中间表格数据
    getMiddleData: "/progress/getMiddleData",
    // 获取进度的右侧数据周报月报
    getWeekMonthly: "/progress/getStatus",
    //设置构件计划时间
    setComponentTime: "/progress/uploadProgress",
    //获取构件四个时间
    getConponmentTime: "/progress/getByConponentid",
    //
  bridgeTree: "/component/getTree",
  schedule: "/schedule/getScheuleAll",
  getProgressWarningTableData: "/schedule/getProcessWarning",
  // 获取项目下拉选数据
  projectSelect: "/progress/projectSelect",
  getHomeChart: "/count/getpjFirst", //首页统计模式图表数据
  getHomeBottomChart: "/count/getGqFirst", //首页统计模式图表数据
  getSafeChart: "/safe/newInterface", //首页安全统计
  getAreaProgress: "/count/getCountIncresConponentGroupGq", //获取进度总览左下进度折线图数据
  getAllProject: "/projects/getAllProjects", //获取所有项目、后续根据用户查询有权限访问的数据
  getAllProjectsData: "/projects/getAll", //获取项目表所有数据
  getProjectsByUser: "/projects/getProjectByUser",//通过用户工区权限查询项目


  getMonitoringByProjectId: "/system/jg/project/monitor",//通过项目查询监控列表
  /*
   * 工程统计
   * */
  // 获取每个构件的完成情况  形象进度  进度总览
  getConponentStatus: "/progress/getConponentStatus",
  // 构件完成数量--左右上图数据，还有方量数量
  getFinishConponent: "/count/getFinishConponent",
  // 构件完成数量按照月，按照日，按照季度--左下图数据
  getCountConponent: "/count/getCountConponent",
  // 获取项目下的构件的类型分类
  componentType: "/count/getNewType",
  // 构件完成数量按照月，按照日，按照季度--右下图数据
  getCountIncresConponent: "/count/getCountIncresConponent",
  // 获取每个工程的项目构件类型
  getProjectTypeData: "/count/getProject", //进度总览表格图下拉选择接口
  getProgressTableData: "/count/getTypeData", //获取进度总览表格数据

  /*
   * 质量管理页面
   * */
  checkViewTree: "/produce/getType",
  checkViewTable: "/produce/getTypeStatus", //原质量验收表格数据
  getNewCheckViewTable: "/produce/getTypeStatus", //最新质量验收表格数据
  getCurrentPdf: "/produce/getCheckDataByrecod", //获取质量验收工序pdf
    processRecords: "/produce/getCheckDataById",
    getAllcheckData: "/produce/getAllcheckData",
    getAllQualityGetPerday: "/quality/getPerday", //质量总览左下角数据
    getQualityEventsGetDay: "/quality/getDay", //质量总览右下角数据
    deleteQualityEvent: "/quality/deleteEvent", //删除质量事件

    // ------------------质量检查、质量整个、整改确认、质量验收 -------------
    bigSmallQuality: "/quality/getTree", //获取质量大小类
    getQualityPrincipal: "/quality/getcheck", //获取工区负责人
    addQuality: "/quality/uploadData", //监理上传质量事件接口
    getWorkList: "/quality/getQualityEvent", //施工获取质量检查事件
    submitFinishEvent: "/quality/submitDealWithSafeEvent", //施工方确认质量整改
    submitDealEvent: "/quality/submitDelaySafeEvent", //施工方对质量事件延期处理
    getDelayEvent: "/quality/getDelaySafeEvent", //监理查询申请延期事件
    disposeDelay: "/quality/doDelaySafeEvent", //监理方处理延期申请
    disposeFinishQualityEvent: "/quality/doNotDoneSafeEvent", //监理确认已整改质量事件
    getFinishQualityEvent: "/quality/getNotDoneSafeEvent", //监理方获取已整改待确认事件
    getCompleteEvents: "/quality/getDoneSafeEvent", //获取监理验收审核的质量事件
    getAllQualityEvents: "/quality/getAllStatusQualityEvent", //获取所有质量事件
    getQualityEventsStatistic: "/quality/group", //获取质量总览右上角数据
    getQualityChart: "/quality/newInterface", //质量总览左上角图表数据
    //---------------------------新闻---------------------------------
    getNews: "/news/get", //根据type查询新闻
    addNews: "/news/add", //新增新闻
    updateNews: "/news/update", //更新新闻
    deleteNews: "/news/del", //删除新闻
    getTenNews: "/news/getNews", //查询最新的10条新闻

    //-------------------- 工序---------
    deleteProduceInfo: "/produce/deleteProcess", //删除工序
    getCopyInfos: "/produce/getCopyInfos",//获取工序审核通知数据
    /*
     * 工序填报页面
     * */
    checkData: "/produce/getCheckDataByConponentId", //原获取工序接口
    getCheckData: "/produce/getCheckDataByConponentId", //最新获取工序接口
    fillProject: "/produce/getPorjectItem",
    addRecord: "/produce/addRecode",
    checker: "/produce/getChecker",
    updateProgress: "/produce/updateRecode", //驳回后的工序再次修改
    /*
     * 工序审核页面
     * */
    getAgency: "/produce/getAgency",
    confirmReport: "/produce/check",
    /*
     * 安全
     * */


    getDoneSafeEvent: "/safe/getDoneSafeEvent", //查询监理已审核确认整改安全事件  ------没有用到 -----------

    //---------安全接口已修改-----
    getNotDoneSafeEvent: "/safe/getNotDoneSafeEvent", //监理方根据标段ID查询需要整改确认的数据
    getSafeEvent: "/safe/getSafeEvent", //施工方根据标段ID获取安全检查事件
    getDelaySafeEvent: "/safe/getDelaySafeEvent", //监理方根据标段ID查询延期申请事件
    //无需修改接口
    doDelaySafeEvent: "/safe/doDelaySafeEvent", //监理处理安全事件延期申请
    doNotDoneSafeEvent: "/safe/doNotDoneSafeEvent", //监理审核安全事件整改
    //---------安全接口已修改-----

	bigSmallSafe: "/safe/getTree", //获取安全事件大小类数据
	getcheck: "/safe/getcheck", //获取安全事件工区负责人数据  ----弃用----------
	submitDealWithSafeEvent: "/safe/submitDealWithSafeEvent", //施工方对安全数据进行整改上报
	submitDelaySafeEvent: "/safe/submitDelaySafeEvent", //施工方申请事件延期处理
  submitSafeData: "/safe/uploadData", //监理方提交安全检查事件
  getAllSafeEvents: "/safe/getAllStatusSafeEvent",
  getSafeEventsStatistic: "/safe/group", //安全总览右上角事件统计接口
  deleteSafeEvent: "/safe/deleteEvent", //删除安全事件


  // 获取每月安全事件数据--表格左侧的工区每日状态
  getPerMonthSafeData: "/count/getPerMonthSafeData",
  // 获取某一天的安全事件
  getDayData: "/count/getDayData",
  // 安全事件分类汇总
  getByFirstType: "/count/getByFirstType",
  // 获取周月履职情况
  getPerSafeData: "/count/getPerSafeData",
  getSafePerday: "/safe/getPerday", //获取安全总览巡更一览数据
  getDaySafeEvents: "/safe/getDay", //安全总览获取某天的安全事件
  /*
   * 智慧工地
   * */
  environmentVideo: "/progress/getYcData",
  // 每日环境趋势变化图
  getDayTrend: "/count/getDayTrend",
  // 获取每月环境统计数据
  getEnvPerMonth: "/count/getEnvPerMonth",
  // 每日环境趋势变化图
  getExceedData: "/count/getExceedData",
  //-----------------------系统管理 工点管理-------------
  getWorkPoint: "/digitalTwin/getData", //获取工点
  addWorkPoint: "/digitalTwin/addData", //新增工点
  deleteWorkPoint: "/digitalTwin/delData", //删除工点
  updateWorkPoint: "/digitalTwin/updateData", //更新工点
  //------------------------系统管理、岗位管理 --------------------------弃用
  getAllPost: "/person/getPosts", //查询岗位信息
  addPost: "/person/addPost", //新增岗位
  deletePost: "/person/deletePost", //删除岗位
  updatePost: "/person/updatePost", //修改岗位
  personnelBindingPost: "/person/addUserPost", //人员绑定岗位
  //-----------------------系统管理、组织管理 ------------------------ 弃用
  addOrganization: "/person/addDepartment", //新增组织
  updateOrganization: "/person/updateDepartment", //更新组织
  deleteOrganization: "/person/deleteDepartment", //删除组织
  getOrganization: "/person/getDepartments", //获取组织,
  bindingUsersToOrganizations: "/person/addUserGroup", //组织绑定用户
  getUserBindOrganizations: "/person/getPersonRole", //获取用户组织关联关系
  getAllOrganization: "/person/getUserByGroup", //获取组织，一维数组
  getRoleInfoByUserId: "/projects/getUsersByUserid", //根据用ID和项目想ID查询角色信息
  //-------------------人员报审模块开始 ---------------------------
  getOrgUser: "/projects/getUsersByUserid", //获取用户对应组织下的所有用户信息
  getUsersRoles: "/projects/getAllRoles", //获取用户和角色的数据
  addStaffApproval: "/person/subContract", //上传报审信息,
  getStaffApprovalBase: "/person/getContracts", //获取报审的基本信息
  getStaffByProcessIdAndProjectId: "/person/getContractByProcessId", //根据项目id和工单ID查询报审的信息
  getStaffRecordsById: "/person/getContractStandingBook",//人员报审台账,
  deleteStaffRecord: "/person/delContract",//删除报审信息
  adminGetAllStaffRecord: "/person/getAllContract",//管理员获取报审台账
  getPersonDetail: "/person/getPersonDetail",//管理员获取报审台账
  getPersonByBusinessKey: "/person/findPersonByBusinessKey",//管理员获取报审台账

  //----------------人员变更 -----------------
  addPersonChange: "/person/subPersonChange", //提交人员变更
  getPersonChange: "/person/getPersonChange", //获取人员变更信息
  getPersonChangeByProcessId: "/person/getChangeByProcessId", //根据项目id和工单ID查询变更信息
  getPersonChangeRecords: "/person/getChangeStandingBook",//人员变更记录
  deleteChangeRecord: "/person/delChange",//删除变更记录
  getAllPersonChangeRecords: "/person/getAllChange",//获取所有变更记录
  //-------------------- 请假申请------------------
  submitLeave: "/person/subLeave", //提交请假申请
  getLeave: "/person/getLeaveData", //获取请假数据
  getLeaveByProcessId: "/person/getLeaveByProcessId",
  getLeaveRecordsById: "/person/getLeaveStandingBook",//获取请假台账
  deleteLeaveRecord: "/person/delLeave",//删除请假
  getAllLeaveRecords: "/person/getAllLeave",//管理员获取所有请假记录

  //-------------电子围栏--------------
  addFence: "/fence/addFence", //新增电子围栏
  deleteFence: "/fence/delFence", //删除电子围栏
  getFence: "/fence/getFence", //获取电子围栏
  updateFence: "/fence/updateFence", //更新电子围栏
  //-------------打卡时间制定-------------------
  addClockTime: "/fence/addClock",
  getClockTime: "/fence/getClock",
  updateClockTime: "/fence/updateClock",
  deleteClockTime: "/fence/delClock",
  //------------打卡记录 --------------
  getAllClockRecords: "/person/getClockIn",//获取所有打卡记录
  getMyClockRecords: "/person/getSelfClockIn",//获取个人打卡记录


  //-----------------------流程引擎新增接口 ------------------------
  //项目相关
  getChildProject: "/projects/getChildProject", //通过项目id获取项目子级的标段信息
  getCompanyByProjectId: "/projects/getCompanyByProjectId", //通过项目下的标段id获取项目的单位信息
  getInfoByProjectId: "/projects/getInfoByProjectId", //通过项目id查询组织信息和用户信息
  getProjectInfoById: "/projects/getProjectInfoById", //通过项目id查询项目详细信息（项目名、施工单位、监理单位、合同号等）
  getProjectRoleTree: "/projects/getProjectRoleTree", //获取项目下面的组织角色树
  getProjectUserTree: "/projects/getProjectUserTree", //获取项目下面的组织用户树
  getUserByRoleId: "/projects/getUserByRoleId", //通过角色id获取用户信息
  //上传文件接口
  uploadFile: "/mong/newUpload",
  getFileInfo: "/mong/findFile",
  downloadFile: "/mong/download", //下载文件
  previewFile: "/mong/preview", //预览文件
  selectByPrimaryKey: "/mong/selectByPrimaryKey", //预览文件

  //任务

  listHandleTask: "/flow/flowOperation/listRuntimeTask", //待办
  listHistoricTask: "/flow/flowOperation/listHistoricTask", //已办
  listHistoricProcessInstance: "/flow/flowOperation/listHistoricProcessInstance", //历史任务
  submitUserTask: "/admin/flow/flowStaticPage/submitUserTask",
  startAndTakeUserTask: "/admin/flow/flowStaticPage/startAndTakeUserTask",//流程显示人员接口
  rejectRuntimeTask: "/admin/flow/flowOperation/rejectRuntimeTask", //驳回
  rejectToStartUserTask: "/admin/flow/flowOperation/rejectToStartUserTask",
  stopProcessInstance: "/admin/flow/flowOperation/stopProcessInstance",
  deleteProcessInstance: "/admin/flow/flowOperation/deleteProcessInstance",
  revokeHistoricTask: "/admin/flow/flowOperation/revokeHistoricTask",
  viewTaskUserInfo: "/admin/flow/flowOperation/viewTaskUserInfo", //审批人
  viewRuntimeTaskInfo: "/admin/flow/flowOperation/viewRuntimeTaskInfo", //查询流程按钮
  viewHighlightFlowData: "/admin/flow/flowOperation/viewHighlightFlowData", //高亮流程图
  viewProcessBpmn: "/admin/flow/flowOperation/viewProcessBpmn", //获取流程图bpmn
  listFlowTaskComment: "/flow/flowOperation/listFlowTaskComment", //获取当前流程任务的审批列表
  listRemindingTask: "/admin/flow/flowMessage/listRemindingTask", //抄送列表
  listCopyMessage: "/admin/flow/flowMessage/listCopyMessage", //抄送列表
  getFlowAndTaskInfo: "/admin/flow/flowStaticPage/getFlowAndTaskInfo", //根据流程idH获取三个key 用于查看审批信息
  getRunVariables: "/flow/flowOperation/getRunVariables", //根据流程idH获取三个key 用于查看审批信息
  getFlowType: "/web/api/v1/flowType/page",//分页查询流程类型数据
  addFlowEntryByFlowKey: "/web/api/v1/flowAuditEntry/addFlowEntryByFlowKey",//新增流程节点信息
  addOrUpdateFlowAuditEntry: "/web/api/v1/flowAuditEntry/addOrUpdate",//新增或者更新流程节点审核人员数据
  getFlowTypeDetail: "/web/api/v1/flowType/getAuditInfoByTypeId", //通过id获取一条流程类型数据
  flowAuditEntry: "/web/api/v1/flowAuditEntry/getAuditInfoByFlowKey",
  getCopyUserByFlowKey: "/web/api/v1/flowAuditEntry/getCopyUserByFlowKey",

  // 流程配置
  getFlowEntryList: "/admin/flow/flowEntry/list", // 获取所有流程列表
  getFlowCategoryListDict: "/admin/flow/flowCategory/listDict", // 获取流程分类
  //省市区
  getDistrict: "/web/api/v1/proviceCityArea/getDistrict", //区县
  getCity: "/web/api/v1/proviceCityArea/getCity", //地市
  getProvince: "/web/api/v1/proviceCityArea/getProvince", //省
  //隐蔽工程
  getHiddenProjectList: "/web/api/v1/hiddenProjectAccept/page",
  getHiddenProjectDetail: "/web/api/v1/hiddenProjectAccept/detail/id",
  addOrUpdateHiddenProject: "/web/api/v1/hiddenProjectAccept/addOrUpdate",
  deleteHiddenProject: "/web/api/v1/hiddenProjectAccept/id",
  exportHiddenProject: "/web/api/v1/hiddenProjectAccept/export",
  //质量检测

	addOrUpdateQualityDetection: "/web/api/v1/qualityDetection/addOrUpdate",
	getQualityDetectionDetail: "/web/api/v1/qualityDetection/detail/id",
	getMaterialEnums: "/web/api/v1/qualityDetection/material/enums",
	deleteQualityDetection: "/web/api/v1/qualityDetection/id",
	getQualityDetectionList: "/web/api/v1/qualityDetection/page",
	exportQualityDetection: "/web/api/v1/qualityDetection/export",

	//流程引擎相关接口

	//-----------------------流程引擎新增接口 ------------------------
	//-----------------------流程引擎新增接口 ZH ---------------------
	addOrUpdateManagementObjectList: "/web/api/v1/manageTarget/addOrUpdate", // 新增或更新管理目标数据
	getManagementObject: "/web/api/v1/manageTarget/detail/id", // 通过id获取一条管理目标数据
	deleteManagementObject: "/web/api/v1/manageTarget/id", // 删除单个管理目标数据
	getManagementObjectList: "/web/api/v1/manageTarget/page", // 管理目标list
	exportManagementObjectList: "/web/api/v1/manageTarget/export",

	addOrUpdateManageRegimeList: "/web/api/v1/manageRegime/addOrUpdate", // 新增或更新管理制度数据
	getManageRegime: "/web/api/v1/manageRegime/detail/id", // 通过id获取一条管理制度数据
	deleteManageRegime: "/web/api/v1/manageRegime/id", // 删除单个管理制度数据
	getManageRegimeList: "/web/api/v1/manageRegime/page", // 管理制度list
	exportManageRegimeList: "/web/api/v1/manageRegime/export",

	//施工技术交底
	getBuildTechBottomList: "/web/api/v1/buildTechBottom/page",
	getBuildTechBottomDetail: "/web/api/v1/buildTechBottom/detail/id",
	addOrUpdateBuildTechBottom: "/web/api/v1/buildTechBottom/addOrUpdate",
	deleteBuildTechBottom: "/web/api/v1/buildTechBottom/id",
	exportBuildTechBottomList: "/web/api/v1/buildTechBottom/export",


	//施工方案
	getBuildPlanList: "/web/api/v1/buildPlan/page",
	getBuildPlanDetail: "/web/api/v1/buildPlan/detail/id",
	addOrUpdateBuildPlan: "/web/api/v1/buildPlan/addOrUpdate",
	deleteBuildPlan: "/web/api/v1/buildPlan/id",
	exportBuildPlanList: "/web/api/v1/buildPlan/export",
	//-----------------------流程引擎新增接口 ZH ----------------------


	//劳务分包合同
	addOrUpdateContractLabor: "/web/api/v1/laborContract/addOrUpdate",
	getContractLaborDeatil: "/web/api/v1/laborContract/detail/id",
	deleteContractLabor: "/web/api/v1/laborContract/id",
	getContractLaborList: "/web/api/v1/laborContract/page",
	exportContractLaborList: "/web/api/v1/laborContract/export",
  getContractLaborListNoPage: "/web/api/v1/laborContract/list",

	//施工专业分包合同
	addOrUpdateContractBuild: "/web/api/v1/buildContract/addOrUpdate",
	getContractBuildDeatil: "/web/api/v1/buildContract/detail/id",
	deleteContractBuild: "/web/api/v1/buildContract/id",
	getContractBuildList: "/web/api/v1/buildContract/page",
	getContractBuildEnums: "/web/api/v1/buildContract/buildContractPart/enums",
	exportContractBuildList: "/web/api/v1/buildContract/export",

	//往来款
	addOrUpdateComeGoMoney: "/web/api/v1/comeGoMoney/addOrUpdate",
	getComeGoMoneyDeatil: "/web/api/v1/comeGoMoney/detail/id",
	deleteComeGoMoney: "/web/api/v1/comeGoMoney/id",
	getComeGoMoneyList: "/web/api/v1/comeGoMoney/page",
	exportComeGoMoneyList: "/web/api/v1/comeGoMoney/export",

	//进退场
	addOrUpdateEnterExit: "/web/api/v1/enterExit/addOrUpdate",
	getEnterExitDeatil: "/web/api/v1/enterExit/detail/id",
	deleteEnterExit: "/web/api/v1/enterExit/id",
	getEnterExitList: "/web/api/v1/enterExit/page",
	getEnterExitUserList: "/web/api/v1/enterExitUser/page",
	exportEnterExitUserList: "/web/api/v1/enterExitUser/export",
    exitEnterExitUserList: "/web/api/v1/enterExitUser/exitUsers",

	//设备进场
	addOrUpdateEquipmentEnter: "/web/api/v1/equipmentEnter/addOrUpdate",
	getEquipmentEnterDeatil: "/web/api/v1/equipmentEnter/detail/id",
	deleteEquipmentEnter: "/web/api/v1/equipmentEnter/id",
	getEquipmentEnterList: "/web/api/v1/equipmentEnter/page",
    getEquipmentInfoList: "/web/api/v1/equipmentInfo/page",
	getEquipmentEnterEnums: "/web/api/v1/equipmentEnter/equipment/enums",
	exportEquipmentEnterList: "/web/api/v1/equipmentEnter/export",

	//设备退场
	addOrUpdateEquipmentExit: "/web/api/v1/equipmentExit/addOrUpdate",
	getEquipmentExitDeatil: "/web/api/v1/equipmentExit/detail/id",
	deleteEquipmentExit: "/web/api/v1/equipmentExit/id",
	getEquipmentExitList: "/web/api/v1/equipmentExit/page",
	exportEquipmentExitList: "/web/api/v1/equipmentExit/export",

	//项目开工申请
	addOrUpdateProjectOpenExit: "/web/api/v1/projectOpen/addOrUpdate",
	getProjectOpenDeatil: "/web/api/v1/projectOpen/detail/id",
	deleteProjectOpen: "/web/api/v1/projectOpen/id",
	getProjectOpenList: "/web/api/v1/projectOpen/page",
	exportProjectOpenList: "/web/api/v1/projectOpen/export",

	//分项开工申请
  addOrUpdateSubitemOpen: "/web/api/v1/subitemOpen/addOrUpdate",
  getSubitemOpenDeatil: "/web/api/v1/subitemOpen/detail/id",
  deleteSubitemOpen: "/web/api/v1/subitemOpen/id",
  getSubitemOpenList: "/web/api/v1/subitemOpen/page",
    exportSubitemOpenList: "/web/api/v1/subitemOpen/export",

  //首件认可
  addOrUpdateFirstAccept: "/web/api/v1/firstAccept/addOrUpdate",
  getFirstAcceptDeatil: "/web/api/v1/firstAccept/detail/id",
  deleteFirstAccept: "/web/api/v1/firstAccept/id",
  getFirstAcceptList: "/web/api/v1/firstAccept/page",
  exportFirstAcceptList: "/web/api/v1/firstAccept/export",

  //质量简报
  addOrUpdateQualityReport: "/web/api/v1/qualityReport/addOrUpdate",
  getQualityReportDeatil: "/web/api/v1/qualityReport/detail/id",
  deleteQualityReport: "/web/api/v1/qualityReport/id",
  getQualityReportList: "/web/api/v1/qualityReport/page",
  exportQualityReportList: "/web/api/v1/qualityReport/export",

  //监理旁站
  addOrUpdateSupervisionSide: "/web/api/v1/supervisionSide/addOrUpdate",
  getSupervisionSideDeatil: "/web/api/v1/supervisionSide/detail/id",
  deleteSupervisionSide: "/web/api/v1/supervisionSide/id",
  getSupervisionSideList: "/web/api/v1/supervisionSide/page",
  getSupervisionSideEnums: "/web/api/v1/supervisionSide/sideProject/enums",
  exportSupervisionSideList: "/web/api/v1/supervisionSide/export",

  //监理巡视
  addOrUpdateSupervisionPatrol: "/web/api/v1/supervisionPatrol/addOrUpdate",
  getSupervisionPatrolDeatil: "/web/api/v1/supervisionPatrol/detail/id",
  deleteSupervisionPatrol: "/web/api/v1/supervisionPatrol/id",
  getSupervisionPatrolList: "/web/api/v1/supervisionPatrol/page",
  exportSupervisionPatrolList: "/web/api/v1/supervisionPatrol/export",

  //监理通知
  addOrUpdateSupervisionNotice: "/web/api/v1/supervisionNotice/addOrUpdate",
  getSupervisionNoticeDeatil: "/web/api/v1/supervisionNotice/detail/id",
  deleteSupervisionNotice: "/web/api/v1/supervisionNotice/id",
  getSupervisionNoticeList: "/web/api/v1/supervisionNotice/page",
  exportSupervisionNoticeList: "/web/api/v1/supervisionNotice/export",

  //质量活动
  addOrUpdateQualityActivity: "/web/api/v1/qualityActivity/addOrUpdate",
  getQualityActivityDeatil: "/web/api/v1/qualityActivity/detail/id",
  deleteQualityActivity: "/web/api/v1/qualityActivity/id",
  getQualityActivityList: "/web/api/v1/qualityActivity/page",
 exportQualityActivityList: "/web/api/v1/qualityActivity/export",

  //监理指令
  addOrUpdateSupervisionOrder: "/web/api/v1/supervisionOrder/addOrUpdate",
  getSupervisionOrderDeatil: "/web/api/v1/supervisionOrder/detail/id",
  deleteSupervisionOrder: "/web/api/v1/supervisionOrder/id",
  getSupervisionOrderList: "/web/api/v1/supervisionOrder/page",
  exportSupervisionOrderList: "/web/api/v1/supervisionOrder/export",


  // 计量管理
  addOrUpdateMetrology: "/web/api/v1/metrology/addOrUpdate",
  getMetrologyDetail: "/web/api/v1/metrology/detail/id",
  deleteMetrology: "/web/api/v1/metrology/id",
  getMetrologyList: "/web/api/v1/metrology/page",
  exportMetrologyList: "/web/api/v1/metrology/export",
  getMetrologyListNoPage: "/web/api/v1/metrology/list",


  // 合同付款
  addOrUpdateContractPayment: "/web/api/v1/contract/payment/addOrUpdate",
  getContractPaymentDetail: "/web/api/v1/contract/payment/detail/id",
  deleteContractPayment: "/web/api/v1/contract/payment/id",
  getContractPaymentList: "/web/api/v1/contract/payment/page",
  getContractPaymentListNoPage: "/web/api/v1/contract/payment/list",


  // 每日晨报
  addOrUpdateDailyReport: "/web/api/v1/daily_report/addOrUpdate",
  getDailyReportDetail: "/web/api/v1/daily_report/detail/id",
  deleteDailyReport: "/web/api/v1/daily_report/id",
  getDailyReportList: "/web/api/v1/daily_report/page",
  getDailyReportListNoPage: "/web/api/v1/daily_report/list",

  // ConstructionPrototype
  addOrUpdateConstructionPrototype: "/web/api/v1/construction_prototype/addOrUpdate",
  getConstructionPrototypeDetail: "/web/api/v1/construction_prototype/detail/id",
  deleteConstructionPrototype: "/web/api/v1/construction_prototype/id",
  getConstructionPrototypeList: "/web/api/v1/construction_prototype/page",
  getConstructionPrototypeListNoPage: "/web/api/v1/construction_prototype/list",

  // 计划管理-证照管理
  addOrUpdatePlanCertificatePhotos: "/web/api/v1/certificate/plan/addOrUpdate",
  getPlanCertificatePhotosDetail: "/web/api/v1/certificate/plan/detail/id",
  deletePlanCertificatePhotos: "/web/api/v1/certificate/plan/id",
  getPlanCertificatePhotosList: "/web/api/v1/certificate/plan/page",
  getPlanCertificatePhotosListNoPage: "/web/api/v1/certificate/plan/list",

  // 进度管理-证照管理
  addOrUpdateProgressCertificatePhotos: "/web/api/v1/certificate/progress/addOrUpdate",
  getProgressCertificatePhotosDetail: "/web/api/v1/certificate/progress/detail/id",
  deleteProgressCertificatePhotos: "/web/api/v1/certificate/progress/id",
  getProgressCertificatePhotosList: "/web/api/v1/certificate/progress/page",
  getProgressCertificatePhotosListNoPage: "/web/api/v1/certificate/progress/list",

  // 计划申报-施工图设计
  addOrUpdatePlanConstructionDesign: "/web/api/v1/constructionDesign/plan/addOrUpdate",
  getPlanConstructionDesignDetail: "/web/api/v1/constructionDesign/plan/detail/id",
  deletePlanConstructionDesign: "/web/api/v1/constructionDesign/plan/id",
  getPlanConstructionDesignList: "/web/api/v1/constructionDesign/plan/page",
  getPlanConstructionDesignListNoPage: "/web/api/v1/constructionDesign/plan/list",

  // 进度管理-施工图设计
  addOrUpdateProgressConstructionDesign: "/web/api/v1/constructionDesign/progress/addOrUpdate",
  getProgressConstructionDesignDetail: "/web/api/v1/constructionDesign/progress/detail/id",
  deleteProgressConstructionDesign: "/web/api/v1/constructionDesign/progress/id",
  getProgressConstructionDesignList: "/web/api/v1/constructionDesign/progress/page",
  getProgressConstructionDesignListNoPage: "/web/api/v1/constructionDesign/progress/list",

  // 数据字典查询
  findDataDictionaryList: "/dataDictionary/dataDictionary/list",

};

export default api;
