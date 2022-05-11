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
  doDelaySafeEvent: "/ZhuJiRoad/safe/doDelaySafeEvent", //监理处理安全事件延期申请
  doNotDoneSafeEvent: "/ZhuJiRoad/safe/doNotDoneSafeEvent", //监理审核安全事件整改
  getDelaySafeEvent: "/ZhuJiRoad/safe/getDelaySafeEvent", //查询延期申请事件
  getDoneSafeEvent: "/ZhuJiRoad/safe/getDoneSafeEvent", //查询监理已审核确认整改安全事件
  getNotDoneSafeEvent: "/ZhuJiRoad/safe/getNotDoneSafeEvent", //监理查询待审核确认整改事件
  getSafeEvent: "/ZhuJiRoad/safe/getSafeEvent", //施工方获取安全检查事件
  bigSmallSafe: "/ZhuJiRoad/safe/getTree", //获取安全事件大小类数据
  getcheck: "/ZhuJiRoad/safe/getcheck", //获取安全事件工区负责人数据
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
  //------------------------系统管理、岗位管理 --------------------------
  getAllPost: "/ZhuJiRoad/person/getPosts", //查询岗位信息
  addPost: "/ZhuJiRoad/person/addPost", //新增岗位
  deletePost: "/ZhuJiRoad/person/deletePost", //删除岗位
  updatePost: "/ZhuJiRoad/person/updatePost", //修改岗位
};

export default api;
