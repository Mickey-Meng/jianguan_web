import Layout from "@/layout";
import ParentView from '@/components/ParentView'
// import secondLayout from '@/secondLayout/Index.vue'
// import RouterView from '@/components/router'
import Home from "@/views/index/index";
import Pandect from "@/views/pandect/index";

export const constantRoutes = [{
  path: "/login",
  component: () => import("@/views/login/index"),
  hidden: true
},

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },
  {
    path: "/200",
    component: () => import("@/views/200"),
    hidden: true
  },
// {
//   path: '/globalView',
//   component: () => import('@/views/screenWindow/index'),
//   hidden: true
// },
  {
    path: '/mapView',
    component: () => import('@/views/screenWindow/mapView'),
    hidden: true
  },
  {
    path: "/home",
    component: Home,
    hidden: true
  },
  {
    path: "/pandect",
    component: Pandect,
    hidden: true
  },
  {
    path: "/handlerFlowTask",
    name: "handlerFlowTask",
    component: () => import("@/views/task/handlerFlowTask/index"),
    children: [{
      path: "/supervisionOfInstruction_detail",
      name: "supervisionOfInstruction_detail",
      code: "jianlizhiling",
      component: () => import("@/views/quality/newPage/supervisionOfInstruction/view")
    }, {
      path: "/qualityActivity_detail",
      name: "qualityActivity_detail",
      code: "zhilianghuodong",
      component: () => import("@/views/quality/newPage/qualityActivity/view")
    }, {
      path: "/supervisionNotice_detail",
      name: "supervisionNotice_detail",
      code: "jianlitongzhi",
      component: () => import("@/views/quality/newPage/supervisionNotice/view")
    }, {
      path: "/supervisionStation_detail",
      name: "supervisionStation_detail",
      code: "jianlipangzhan",
      component: () => import("@/views/quality/newPage/supervisionStation/view")
    }, {
      path: "/supervisionPatrol_detail",
      name: "supervisionPatrol_detail",
      code: "jianlixunshi",
      component: () => import("@/views/quality/newPage/supervisionPatrol/view")
    }, {
      path: "/firstProcessApproval_detail",
      name: "firstProcessApproval_detail",
      code: "shoujianrenke",
      component: () => import("@/views/quality/newPage/firstProcessApproval/view")
    }, {
      path: "/qualityPresentation_detail",
      name: "qualityPresentation_detail",
      code: "zhiliangjianbao",
      component: () => import("@/views/quality/newPage/qualityPresentation/view")
    }, {
      path: "/projectCommencementApplication_detail",
      name: "projectCommencementApplication_detail",
      code: "xiangmukaigongshenqing",
      component: () => import("@/views/quality/newPage/projectCommencementApplication/view")
    }, {
      path: "/separateApplicationForCommencement_detail",
      name: "separateApplicationForCommencement_detail",
      code: "fenxiangkaigongshenqing",
      component: () => import("@/views/quality/newPage/separateApplicationForCommencement/view")
    }, {
      path: "/qualityTest_detail",
      name: "qualityTest_detail",
      code: "zhiliangjiance",
      component: () => import("@/views/quality/newPage/qualityTest/view")
    }, {
      path: "/equipmentEntryForInspection_detail",
      name: "equipmentEntryForInspection_detail",
      code: "shebeijinchangbaoyan",
      component: () => import("@/views/contractManagement/equipmentEntryForInspection/view")
    }, {
      path: "/equipmentExitForInspection_detail",
      name: "equipmentExitForInspection_detail",
      code: "shebeituichangbaoyan",
      component: () => import("@/views/contractManagement/equipmentExitForInspection/view")
    }, {
      path: "/concealedWorksManagement_detail",
      name: "concealedWorksManagement_detail",
      code: "yinbigongchengguanli",
      component: () => import("@/views/quality/newPage/concealedWorksManagement/view")
    }, {
      path: "/constructionSubcontract_detail",
      name: "constructionSubcontract_detail",
      code: "shigongfenbaohetong",
      component: () => import("@/views/contractManagement/constructionSubcontract/view")
    }, {
      path: "/constructionScheme_detail",
      name: "constructionScheme_detail",
      code: "shigongfangan",
      component: () => import("@/views/quality/newPage/constructionScheme/view")
    }, {
      path: "/laborSubcontract_detail",
      name: "laborSubcontract_detail",
      code: "laowufenbaohetong",
      component: () => import("@/views/contractManagement/laborSubcontract/view")
    }, {
      path: "/metrology_detail",
      name: "metrology_detail",
      code: "jiliangshenpiv3",
      component: () => import("@/views/metrology/ledger/view")
    }, {
      path: "/dailyReport_detail",
      name: "dailyReport_detail",
      code: "dailyReport",
      component: () => import("@/views/dailyReport/view")
    },
      {
        path: "/materialBrandReport_detail",
        name: "materialBrandReport_detail",
        code: "materialBrandReport",
        component: () => import("@/views/materialBrandReport/view")
      },
      {
        path: "/materialSampleConfirmation_detail",
        name: "materialSampleConfirmation_detail",
        code: "materialSampleConfirmation",
        component: () => import("@/views/materialSampleConfirmation/view")
      },
      {
        path: "/materialAcceptance_detail",
        name: "materialAcceptance_detail",
        code: "materialAcceptance",
        component: () => import("@/views/materialAcceptance/view")
      },
      {
        path: "/constructionPrototype_detail",
        name: "constructionPrototype_detail",
        code: "constructionPrototype",
        component: () => import("@/views/constructionPrototype/view")
      }, {
        path: "/constructionPlan_detail",
        name: "constructionPlan_detail",
        code: "constructionPlan",
        component: () => import("@/views/constructionPlan/view")
      }, {
        path: "/constructionPlanReport_detail",
        name: "constructionPlanReport_detail",
        code: "constructionPlanReport",
        component: () => import("@/views/constructionPlanReport/view")
      },
      {
      path: "/contractPayment_detail",
      name: "contractPayment_detail",
      code: "contractPayment",
      component: () => import("@/views/contract/payment/view")
    }, {
      path: "/safetyAndCivilized_detail",
      name: "safetyAndCivilized_detail",
      code: "DSFJCDWZLGL", // 工作流key值相同
      component: () => import("@/views/datum/thirdTestingUnitFM/view")
    }, {
      path: "/thirdTestingUnitFM_detail",
      name: "thirdTestingUnitFM_detail",
      code: "AQWMCSF", // 工作流key值相同
      component: () => import("@/views/contract/payment/safetyAndCivilized/view")
    },{
      path: "/entranceAndExitManagement_detail",
      name: "entranceAndExitManagement_detail",
      code: "jintuichangguanli",
      component: () => import("@/views/contractManagement/entranceAndExitManagement/view")
    }, {
      path: "/currentAccountManagement_detail",
      name: "currentAccountManagement_detail",
      code: "wanglaikuanguanli",
      component: () => import("@/views/contractManagement/currentAccountManagement/view")
    }, { // 施工技术交底
      path: "/constructionTechnologyDisclosure_detail",
      name: "constructionTechnologyDisclosure_detail",
      code: "shigongjishujiaodi",
      component: () => import("@/views/quality/newPage/constructionTechnologyDisclosure/view")
    },
      {
        path: "/staffSubmit_detail",
        name: "staffSubmit_detail",
        code: "hetongrenyuanbaoshen,sgdwhtrybs,jldwhtrybs,qzdwhtrybs",
        component: () => import("@/views/contractManagement/staffSubmit/view")
      },
      {
        path: "/personnelChange_detail",
        name: "personnelChange_detail",
        code: "renyuanbiangeng,sgdwrybg,jldwrybg,qzdwrybg",
        component: () => import("@/views/contractManagement/personChange/view")
      },
      {
        path: "/applicationForLeave_detail",
        name: "applicationForLeave_detail",
        code: "qingjiashenqing,sgdwryqj,jldwryqj,qzdwryqj",
        component: () => import("@/views/contractManagement/leave/view")
      },

      // 计划管理-证照管理 流程审批界面
      {
        path: "/planCertificatePhotos_detail",
        name: "planCertificatePhotos_detail",
        code: "planCertificatePhotos",
        component: () => import ("@/views/planManage/certificatePhotos/view")
      },
      // 进度管理-证照管理 流程审批界面
      {
        path: "/progressCertificatePhotos_detail",
        name: "progressCertificatePhotos_detail",
        code: "progressCertificatePhotos",
        component: () => import ("@/views/progressManage/certificatePhotos/view")
      },
      // 计划申报-施工图设计 流程审批界面
      {
        path: "/planConstructionDesign_detail",
        name: "planConstructionDesign_detail",
        code: "planConstructionDesign",
        component: () => import ("@/views/planApplyReview/constructionDesign/view")
      },
      // 进度管理-施工图设计 流程审批界面
      {
        path: "/progressConstructionDesign_detail",
        name: "progressConstructionDesign_detail",
        code: "progressConstructionDesign",
        component: () => import ("@/views/progressApplyReview/constructionDesign/view")
      },
      // 在线-工序填报 流程审批界面
      {
        path: "/produceOnlineReport_detail",
        name: "produceOnlineReport_detail",
        code: "produceOnlineReport",
        component: () => import ("@/views/onlineForms/produceReport/view")
      },
      // 在线-工序核验 流程审批界面
      {
        path: "/produceOnlineCheck_detail",
        name: "produceOnlineCheck_detail",
        code: "produceOnlineCheck",
        component: () => import ("@/views/onlineForms/produceCheck/view")
      }
    ]
  },
// {
// 		path: "/qualityTest_detail",
// 		name: "qualityTest_detail",
// 		component: () => import("@/views/quality/newPage/qualityTest/detail"),
// },
// {
// 	path: "/concealedWorksManagement_detail",
// 	name: "concealedWorksManagement_detail",
// 	component: () => import("@/views/quality/newPage/concealedWorksManagement/detail")
// },
  {
    path: "*",
    redirect: "/home",
    hidden: true
  }
];
export const asyncRoutes = [
  {
    path: "/mytask",
    meta: {
      title: "我的任务",
      icon: "home",
      code: "mytask"
    },
    alwaysShow: true,
    component: Layout,
    redirect: "/agencytask",
    children: [{
      path: "/agencytask",
      name: "agencytask",
      component: () => import("@/views/task/agencytask"),
      meta: {
        title: "待办任务",
        code: "agencytask",
        icon: "circle",
        allMap: false,
        partMap: false,
        noMap: true
      }
    }, {
      path: "/completedtasks",
      name: "completedtasks",
      component: () => import("@/views/task/completedtasks"),
      meta: {
        title: "已办任务",
        code: "completedtasks",
        icon: "circle",
        allMap: false,
        partMap: false,
        noMap: true
      }
    }, {
      path: "/historicaltask",
      name: "historicaltask",
      component: () => import("@/views/task/historicaltask"),
      meta: {
        title: "历史任务",
        code: "historicaltask",
        icon: "circle",
        allMap: false,
        partMap: false,
        noMap: true
      }
    }, {
      path: "/liuchengrenyuanpeizhi",
      name: "liuchengrenyuanpeizhi",
      component: () => import("@/views/quality/newPage/liuchengpeizhi"),
      meta: {
        title: "流程配置temp",
        code: "liuchengrenyuanpeizhi",
        icon: "circle",
        allMap: false,
        partMap: false,
        noMap: true
      }
    }, {
      path: "/liuchengsheji",
      name: "liuchengsheji",
      component: () => import("@/views/workFlow/flowEntry/formFlowEntry"),
      meta: {
        title: "流程设计temp",
        code: "liuchengsheji",
        icon: "circle",
        allMap: false,
        partMap: false,
        noMap: true
      }
    }, {
      path: "/copytask",
      name: "copytask",
      component: () => import("@/views/task/copytask"),
      meta: {
        title: "抄送列表",
        code: "copytask",
        icon: "circle",
        allMap: false,
        partMap: false,
        noMap: true
      }
    },
      {
        path: "/notifyList",
        name: "notifyList",
        component: () => import("@/views/task/notifyList"),
        meta: {
          title: "通知列表",
          code: "notifyList",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      }]
  },
  {
    path: "/preliminary",
    meta: {
      title: "前期专题",
      icon: "home",
      code: "preliminary"
    },
    alwaysShow: true,
    component: Layout,
    redirect: "/noRedirect",
    children: [{
      path: "/earlierStage",
      meta: {
        title: "前期管理",
        icon: "earlier",
        code: "qianqiguanli"
      },
      alwaysShow: true,
      "component": ParentView,
      redirect: "/removeLand",
      children: [{
        path: "/removeLand",
        name: "removeLand",
        component: () => import("@/views/earlierStage/index"),
        meta: {
          title: "征地拆迁",
          icon: "circle",
          code: "zhengdichaiqian",
          allMap: true,
          partMap: false,
          noMap: false,
          left: true,
          open: true
        }
      },
        {
          path: "/pipeManage",
          name: "pipeManage",
          component: () => import("@/views/earlierStage/pipeManage"),
          meta: {
            title: "管线管理",
            code: "guanxianguanli",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            open: true
          }
        },
        {
          path: "/schemeContrast",
          name: "schemeContrast",
          component: () => import("@/views/earlierStage/schemeContrast"),
          meta: {
            title: "方案对比",
            icon: "circle",
            code: "fanganduibi",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            open: true
          }
        },

      ]
    }, {
      path: "/informationManage",
      name: "informationManage",
      component: () => import("@/views/earlierStage/informationManage"),
      meta: {
        title: "资料管理",
        code: "ziliaoguanli",
        icon: "circle",
        allMap: false,
        partMap: false,
        noMap: true
      }
    },

    {
      path: "/planManage",
      meta: {
        title: "计划管理",
        icon: "earlier",
        code: "jihuaguanli"
      },
      alwaysShow: true,
      "component": ParentView,
      redirect: "/planCertificatePhotos",
      children: [
        {
          path: "/planCertificatePhotos",
		      name: "planCertificatePhotos",
		      component: () => import ("@/views/planManage/certificatePhotos/certificatePhotos"),
		      meta: {
			      title: "证照管理",
			      icon: "circle",
			      code: "jh_zhengzhaoguanli",
			      allMap: false,
			      partMap: false,
			      noMap: true
		      }
        }
      ]
    },

    {
      path: "/progressManage",
      meta: {
        title: "进度管理",
        icon: "earlier",
        code: "jinduguanli"
      },
      alwaysShow: true,
      "component": ParentView,
      redirect: "/progressCertificatePhotos",
      children: [
        {
          path: "/progressCertificatePhotos",
		      name: "progressCertificatePhotos",
		      component: () => import ("@/views/progressManage/certificatePhotos/certificatePhotos"),
		      meta: {
			      title: "证照管理",
			      icon: "circle",
			      code: "jd_zhengzhaoguanli",
			      allMap: false,
			      partMap: false,
			      noMap: true
		      }
        }
      ]
    }

  ]
  },
  {
    "component": Layout,
    "meta": {
      "icon": "#",
      "noCache": false,
      "title": "招标管理"
    },
    alwaysShow: true,
    redirect: "/noRedirect",
    "name": "Invitetenders",
    "path": "/invitetenders"
  },
  {
    "component": Layout,
    "meta": {
      "icon": "#",
      "noCache": false,
      "title": "合同成本管理"
    },
    alwaysShow: true,
    redirect: "/noRedirect",
    "name": "contractchengben",
    "path": "/contractchengben",
    children: [{
      // "component": Layout,
      "meta": {
        "icon": "#",
        "noCache": false,
        "title": "分包管理"
      },
      "component": ParentView,
      alwaysShow: true,
      redirect: "/laborSubcontract",
      "name": "fenbaoguanli",
      "path": "/fenbaoguanli",
      children: [{
        path: "/laborSubcontract",
        name: "laborSubcontract",
        component: () => import("@/views/contractManagement/laborSubcontract"),
        meta: {
          title: "劳务分包合同",
          code: "laowufenbaohetong",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      },{
        path: "/contractPayment",
        name: "contractPayment",
        component: () => import("@/views/contract/payment/contractPayment"),
        meta: {
          title: "合同付款",
          code: "payment",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      },{
        path: "/safetyAndCivilized",
        name: "safetyAndCivilized",
        component: () => import("@/views/contract/payment/safetyAndCivilized/contractPayment"),
        meta: {
          title: "安全文明措施费",
          code: "payment",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      }]
    }]
  },

  {
    "component": Layout,
    "meta": {
      "icon": "#",
      "noCache": false,
      "title": "设计专题"
    },
    alwaysShow: true,
    redirect: "/noRedirect",
    "name": "Design",
    "path": "/design",
    children: [
      {
        path: "/planApplyReview",
        meta: {
          title: "计划报审",
          icon: "earlier",
          code: "jihuabaoshen"
        },
        alwaysShow: true,
        "component": ParentView,
        redirect: "/planConstructionDesign",
        children: [
          {
            path: "/planConstructionDesign",
            name: "planConstructionDesign",
            component: () => import ("@/views/planApplyReview/constructionDesign/constructionDesign"),
            meta: {
              title: "施工图设计",
              icon: "circle",
              code: "jh_shigongsheji",
              allMap: false,
              partMap: false,
              noMap: true
            }
          }
        ]
      },

      {
        path: "/progressApplyReview",
        meta: {
          title: "进度管理",
          icon: "earlier",
          code: "jhbs_jinduguanli"
        },
        alwaysShow: true,
        "component": ParentView,
        redirect: "/progressConstructionDesign",
        children: [
          {
            path: "/progressConstructionDesign",
            name: "progressConstructionDesign",
            component: () => import ("@/views/progressApplyReview/constructionDesign/constructionDesign"),
            meta: {
              title: "施工图设计",
              icon: "circle",
              code: "jdbs_shigongsheji",
              allMap: false,
              partMap: false,
              noMap: true
            }
          }
        ]
      }
    ]
  },

  {
    "component": Layout,
    "meta": {
      "icon": "#",
      "noCache": false,
      "title": "建设专题"
    },
    "name": "jianshezhuanti",
    "path": "/jianshezhuanti",
    children: [
      {
      path: "/guanlidanao",
      "component": ParentView,
      meta: {
        title: "管理大脑",
        icon: "home",
        code: "guanlidanao"
      },
      alwaysShow: true,
      redirect: "/data",
      children: [{
        path: "/data",
        name: "data",
        component: () => import("@/views/project/data"),
        meta: {
          title: "数据中心",
          icon: "circle",
          code: "shujuzhongxin",
          allMap: false,
          partMap: false,
          noMap: true
        }
      },
        {
          path: "/statistics",
          name: "statistics",
          component: () => import("@/views/project/statistics"),
          meta: {
            title: "工程统计",
            code: "gongchengtongji",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/about",
          name: "about",
          component: () => import("@/views/project/about"),
          meta: {
            title: "工程概况",
            code: "gongchenggaikuang",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/newsCenter",
          name: "newsCenter",
          component: () => import("@/views/project/newsCenter"),
          meta: {
            title: "新闻中心",
            code: "xinwenzhongxin",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/engineeringMap",
          name: "engineeringMap",
          component: () => import("@/views/project/engineeringMap"),
          meta: {
            title: "工程布置图",
            code: "gongchengbuzhitu",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        }
      ]
    }, {
      path: "/scene",
      meta: {
        title: "数字孪生",
        icon: "figure",
        code: "sanweichangjing"
      },
      "component": ParentView,
      alwaysShow: true,
      redirect: "/sceneOverview",
      children: [{
        path: "/sceneOverview",
        name: "sceneOverview",
        component: () => import("@/views/scene/index"),
        meta: {
          title: "三维总览",
          code: "sanweizonglan",
          icon: "circle",
          allMap: true,
          partMap: false,
          noMap: false,
          cover: true,
          left: true,
          open: true
        }
      }]
    }, {
      path: "/shebeiguanli",
      meta: {
        title: "设备管理",
        icon: "figure",
        code: "shebeiguanli"
      },
      "component": ParentView,
      alwaysShow: true,
      redirect: "/equipmentEntryForInspection",
      children: [{
        path: "/equipmentEntryForInspection",
        name: "equipmentEntryForInspection",
        component: () => import("@/views/contractManagement/equipmentEntryForInspection"),
        meta: {
          title: "设备进场报验",
          code: "shebeijinchangbaoyan",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      },
        {
          path: "/equipmentExitForInspection",
          name: "equipmentExitForInspection",
          component: () => import("@/views/contractManagement/equipmentExitForInspection"),
          meta: {
            title: "设备退场报验",
            code: "shebeituichangbaoyan",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },]
    },
      {
        path: "/cailiaoguanli",
        "component": ParentView,
        meta: {
          title: "材料管理",
          icon: "home",
          code: "cailiaoguanli"
        },
        alwaysShow: true,
        redirect: "/materialBrandReport",
        children: [
          {
            path: "/materialBrandReport",
            name: "materialBrandReport",
            component: () => import("@/views/materialBrandReport/materialBrandReport"),
            meta: {
              title: "材料品牌报审",
              code: "materialBrandReport",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/materialSampleConfirmation",
            name: "materialSampleConfirmation",
            component: () => import("@/views/materialSampleConfirmation/materialSampleConfirmation"),
            meta: {
              title: "材料样板确认",
              code: "materialSampleConfirmation",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/materialAcceptance",
            name: "materialAcceptance",
            component: () => import("@/views/materialAcceptance/materialAcceptance"),
            meta: {
              title: "材料进场验收",
              code: "materialAcceptance",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
        ]
      },
      {
      path: "/progress",
      meta: {
        title: "进度管理",
        icon: "schedule",
        code: "jinduguanli"
      },
      alwaysShow: true,
      "component": ParentView,
      redirect: "/planOverview",
      children: [{
        path: "/progressWarning",
        name: "progressWarning",
        component: () => import("@/views/progress/progressWarning"),
        meta: {
          title: "进度预警",
          code: "progressWarning",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      },
        {
          path: "/planOverview",
          name: "planOverview",
          component: () => import("@/views/progress/index"),
          meta: {
            title: "进度总览",
            code: "jinduzonglan",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/visualProgress",
          name: "visualProgress",
          component: () => import("@/views/progress/visualProgress"),
          meta: {
            title: "形象进度",
            code: "xingxiangjindu",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            open: true,
            cover: true
          }
        },
        {
          path: "/simulation",
          name: "simulation",
          component: () => import("@/views/progress/simulation"),
          meta: {
            title: "进度模拟",
            code: "jindumoni",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            open: true,
            cover: true
          }
        },
        {
          path: "/planToFill",
          name: "PlanToFill",
          component: () => import("@/views/progress/planToFill"),
          meta: {
            title: "计划填报",
            code: "jihuatianbao",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            right: true,
            offsetToRight: true, // 三维地图工具栏向右偏移200px
            open: true
          }
        }
      ]
    }, {
      path: "/quality",
      meta: {
        title: "质量管理",
        icon: "quality",
        code: "zhiliangguanli"
      },
      alwaysShow: true,
      "component": ParentView,
      redirect: "/qualityOverview",
      children: [{
        path: "/qualityOverview",
        name: "qualityOverview",
        // component: () => import("@/views/quality/qualityOverview"),
        component: () => import("@/views/quality/overView/index"),
        meta: {
          title: "质量总览",
          code: "zhiliangzonglan",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      },
        {
          path: "/constructionPrototype",
          name: "constructionPrototype",
          component: () => import("@/views/constructionPrototype/constructionPrototype"),
          meta: {
            title: "施工样板",
            code: "constructionPrototype",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/constructionPlan",
          name: "constructionPlan",
          component: () => import("@/views/constructionPlan/constructionPlan"),
          meta: {
            title: "施工方案计划",
            code: "constructionPlan",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/constructionPlanReport",
          name: "constructionPlanReport",
          component: () => import("@/views/constructionPlanReport/constructionPlanReport"),
          meta: {
            title: "施工方案计划上报",
            code: "constructionPlanReport",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/processCheck",
          name: "processCheck",
          component: () => import("@/views/quality/processCheck"),
          meta: {
            title: "质量检查",
            code: "zhiliangjiancha",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            right: true,
            offsetToRight: true, // 三维地图工具栏向右偏移200px
            open: true
          }
        },
        {
          path: "/qualityRecords",
          name: "qualityRecords",
          component: () => import("@/views/quality/qualityRecords"),
          meta: {
            title: "质量记录",
            code: "zhiliangjilu",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/qualityImprovement",
          name: "qualityImprovement",
          component: () => import("@/views/quality/qualityImprovement"),
          meta: {
            title: "质量整改",
            code: "zhiliangzhenggai",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            right: true,
            offsetToRight: true, // 三维地图工具栏向右偏移200px
            open: true
          }
        },
        {
          path: "/qualityConfirmation",
          name: "qualityConfirmation",
          component: () => import("@/views/quality/qualityConfirmation"),
          meta: {
            title: "整改确认",
            code: "zhenggaiqueren",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            right: true,
            offsetToRight: true, // 三维地图工具栏向右偏移200px
            open: true
          }
        },
        {
          path: "/acceptance",
          name: "acceptance",
          component: () => import("@/views/quality/index"),
          meta: {
            title: "质量验收",
            code: "zhiliangyanshou",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/processFill",
          name: "processFill",
          component: () => import("@/views/quality/processFill"),
          meta: {
            title: "工序填报",
            code: "gongxutianbao",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            right: true,
            offsetToRight: true, // 三维地图工具栏向右偏移200px
            open: true
          }
        },
        {
          path: "/processAudit",
          name: "processAudit",
          component: () => import("@/views/quality/processAudit"),
          meta: {
            title: "工序审核",
            code: "gongxushenhe",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            right: true,
            offsetToRight: true, // 三维地图工具栏向右偏移200px
            open: true
          }
        },
        // {
        //   path: '/processExamine',
        //   name: 'processExamine',
        //   component: () => import('@/views/quality/processExamine'),
        //   meta: { title: '工序报验', icon: '', allMap: true, partMap: false, noMap: false, left: true, right: true }
        // },
        // {
        //   path: '/dataUpload',
        //   name: 'dataUpload',
        //   component: () => import('@/views/quality/dataUpload'),
        //   meta: { title: '资料上传', icon: '', allMap: false, partMap: false, noMap: true }
        // },
        // {
        //   path: '/dataExamine',
        //   name: 'dataExamine',
        //   component: () => import('@/views/quality/dataExamine'),
        //   meta: { title: '资料审核', icon: '', allMap: false, partMap: false, noMap: true }
        // },
        // {
        //   path: '/standard',
        //   name: 'standard',
        //   component: () => import('@/views/quality/standard'),
        //   meta: { title: '验收标准', icon: '', allMap: false, partMap: false, noMap: true }
        // }

        {
          path: "/concealedWorksManagement",
          name: "concealedWorksManagement",
          component: () => import("@/views/quality/newPage/concealedWorksManagement"),
          meta: {
            title: "隐蔽工程管理",
            code: "yinbigongchengguanli",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/qualityTest",
          name: "qualityTest",
          component: () => import("@/views/quality/newPage/qualityTest"),
          meta: {
            title: "质量检测",
            code: "zhiliangjiance",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },

        {
          path: "/qualityPresentation",
          name: "qualityPresentation",
          component: () => import("@/views/quality/newPage/qualityPresentation"),
          meta: {
            title: "质量简报",
            code: "zhiliangjianbao",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/managedObject",
          name: "managedObject",
          component: () => import("@/views/quality/newPage/managedObject"),
          meta: {
            title: "管理目标",
            code: "guanlimubiao",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/managementSystem",
          name: "managementSystem",
          component: () => import("@/views/quality/newPage/managementSystem"),
          meta: {
            title: "管理制度",
            code: "guanlizhidu",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/supervisionStation",
          name: "supervisionStation",
          component: () => import("@/views/quality/newPage/supervisionStation"),
          meta: {
            title: "监理旁站",
            code: "jianlipangzhan",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/supervisionPatrol",
          name: "supervisionPatrol",
          component: () => import("@/views/quality/newPage/supervisionPatrol"),
          meta: {
            title: "监理巡视",
            code: "jianlixunshi",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/constructionTechnologyDisclosure",
          name: "constructionTechnologyDisclosure",
          component: () => import("@/views/quality/newPage/constructionTechnologyDisclosure"),
          meta: {
            title: "施工技术交底",
            code: "shigongjishujiaodi",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/constructionScheme",
          name: "constructionScheme",
          component: () => import("@/views/quality/newPage/constructionScheme"),
          meta: {
            title: "施工方案",
            code: "shigongfangan",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/firstProcessApproval",
          name: "firstProcessApproval",
          component: () => import("@/views/quality/newPage/firstProcessApproval"),
          meta: {
            title: "首件认可",
            code: "shoujianrenke",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/projectCommencementApplication",
          name: "projectCommencementApplication",
          component: () => import("@/views/quality/newPage/projectCommencementApplication"),
          meta: {
            title: "项目开工申请",
            code: "xiangmukaigongshenqing",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/separateApplicationForCommencement",
          name: "separateApplicationForCommencement",
          component: () => import("@/views/quality/newPage/separateApplicationForCommencement"),
          meta: {
            title: "分项开工申请",
            code: "fenxiangkaigongshenqing",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/qualityActivity",
          name: "qualityActivity",
          component: () => import("@/views/quality/newPage/qualityActivity"),
          meta: {
            title: "质量活动",
            code: "zhilianghuodong",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/supervisionOfInstruction",
          name: "supervisionOfInstruction",
          component: () => import("@/views/quality/newPage/supervisionOfInstruction"),
          meta: {
            title: "监理指令",
            code: "jianlizhiling",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/supervisionNotice",
          name: "supervisionNotice",
          component: () => import("@/views/quality/newPage/supervisionNotice"),
          meta: {
            title: "监理通知",
            code: "jianlitongzhi",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
      ]
    }, {
      path: "/anquanguanli",
      meta: {
        title: "安全管理",
        icon: "safe",
        code: "anquanguanli"
      },
      alwaysShow: true,
      "component": ParentView,
      redirect: "/safetyProduction",
      children: [{
        path: "/safetyProduction",
        name: "safetyProduction",
        component: () =>
          // import("@/views/safetyCulture/indexComponent/securityPatrolling"),
          import("@/views/safetyCulture/securityOverview"),
        meta: {
          title: "安全总览",
          code: "anquanzonglan",
          icon: "circle",
          allMap: true,
          partMap: false,
          noMap: false,
          cover: true
        }
      },
        // {
        //   path: '/civilizedConstruction',
        //   name: 'civilizedConstruction',
        //   component: () => import('@/views/safetyCulture/civilizedConstruction'),
        //   meta: { title: '文明施工', icon: '', allMap: false, partMap: false, noMap: true }
        // },
        {
          path: "/incidentRecord",
          name: "incidentRecord",
          component: () => import("@/views/safetyCulture/incidentRecord"),
          meta: {
            title: "安全记录",
            code: "anquanjilu",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/dailyReport",
          name: "dailyReport",
          component: () => import("@/views/dailyReport/dailyReport"),
          meta: {
            title: "每日晨检上报",
            code: "dailyReport",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/securityCheck",
          name: "securityCheck",
          component: () => import("@/views/safetyCulture/securityCheck"),
          meta: {
            title: "安全检查",
            code: "anquanjiancha",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            offsetToRight: true, // 三维地图工具栏向右偏移200px
            right: true
          }
        },
        {
          path: "/safetyMeasures",
          name: "safetyMeasures",
          component: () => import("@/views/safetyCulture/safetyMeasures"),
          meta: {
            title: "安全整改",
            code: "anquanzhenggai",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            offsetToRight: true, // 三维地图工具栏向右偏移200px
            right: true
          }
        },
        {
          path: "/rectificationConfirm",
          name: "rectificationConfirm",
          component: () => import("@/views/safetyCulture/rectificationConfirm"),
          meta: {
            title: "整改确认",
            code: "zhenggaiqueren",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            left: true,
            offsetToRight: true, // 三维地图工具栏向右偏移200px
            right: true
          }
        },
        {
          path: "/threeEducation",
          name: "threeEducation",
          component: () => import("@/views/datum/threeEducation"),
          meta: {
            title: "三级教育培训",
            code: "threeEducation",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/safeStudy",
          name: "safeStudy",
          component: () => import("@/views/datum/safeStudy"),
          meta: {
            title: "日常安全资料学习",
            code: "safeStudy",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/safetyDocument",
          name: "safetyDocument",
          component: () => import("@/views/datum/safetyDocument"),
          meta: {
            title: "安全体系",
            code: "anquantixi",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        {
          path: "/hazardInformation",
          name: "hazardInformation",
          component: () => import("@/views/datum/hazardInformation"),
          meta: {
            title: "危险源信息",
            code: "weixianyuanxinxi",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
        // {
        //   path: '/sourceOfDanger',
        //   name: 'sourceOfDanger',
        //   component: () => import('@/views/safetyCulture/sourceOfDanger'),
        //   meta: { title: '危险源', icon: '', allMap: true, partMap: false, noMap: false, left: true, right: true }
        // }
      ]
    }, {
      path: "/biangengguanli",
      meta: {
        title: "变更管理",
        icon: "staff",
        code: "biangengguanli"
      },
      alwaysShow: true,
      "component": ParentView,
      redirect: "/",
    }, {
        path: "/jiliang",
        meta: {
          title: "计量管理",
          icon: "education",
          code: "jiliangguanli"
        },
        redirect: "/metrology",
        alwaysShow: true,
        "component": ParentView,
        children: [{
          path: "/metrology",
          name: "metrology",
          component: () => import("@/views/metrology/metrology"),
          meta: {
            title: "计量管理",
            code: "jiliangguanli",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        }]
      }, {
        path: "/wisdomSite",
        meta: {
          title: "智慧工地",
          icon: "construction",
          code: "zhihuigongdi"
        },
        alwaysShow: true,
        "component": ParentView,
        redirect: "/videoEnvironment",
        children: [{
          path: "/videoMonitor",
          name: "videoMonitor",
          component: () => import("@/views/wisdomSite/index"),
          meta: {
            title: "视频监控",
            code: "shipinjiankong",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            cover: true
          }
        },{
          path: "/videoEnvironment",
          name: "videoEnvironment",
          component: () => import("@/views/wisdomSiteEnvironment/environment"),
          meta: {
            title: "视频环境",
            code: "shipinhuanjing",
            icon: "circle",
            allMap: true,
            partMap: false,
            noMap: false,
            cover: true
          }
        },
          // {
          //   path: '/panorama',
          //   name: 'panorama',
          //   component: () => import('@/views/wisdomSite/panorama'),
          //   meta: { title: '全景图', icon: '', allMap: false, partMap: false, noMap: true }
          // },
          // {
          //   path: '/pollingVideo',
          //   name: 'pollingVideo',
          //   component: () => import('@/views/wisdomSite/pollingVideo'),
          //   meta: { title: '巡检视频', icon: '', allMap: false, partMap: false, noMap: true }
          // },
          {
            path: "/geologicalAnalysis",
            name: "geologicalAnalysis",
            component: () => import("@/views/wisdomSite/geologicalAnalysis"),
            meta: {
              title: "数字运管",
              code: "shuzishiyanshi",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          // {
          // 	path: "/constructionMonitoring",
          // 	name: "constructionMonitoring",
          // 	component: () => import("@/views/wisdomSite/constructionMonitoring"),
          // 	meta: {
          // 		title: "施工监测",
          // 		code: "shigongjiance",
          // 		icon: "circle",
          // 		allMap: false,
          // 		partMap: false,
          // 		noMap: true
          // 	}
          // }
          // {
          //   path: '/aiAnalysis',
          //   name: 'aiAnalysis',
          //   component: () => import('@/views/wisdomSite/aiAnalysis'),
          //   meta: { title: 'AI分析', icon: '', allMap: false, partMap: false, noMap: true }
          // },
          // {
          //   path: '/aiWarning',
          //   name: 'aiWarning',
          //   component: () => import('@/views/wisdomSite/aiWarning'),
          //   meta: { title: 'AI预警', icon: '', allMap: false, partMap: false, noMap: true }
          // }
        ]
      }, {
        path: "/dailyFileManager",
        meta: {
          title: "日常资料管理",
          icon: "education",
          code: "dailyManagerFile"
        },
        redirect: "/supervisordptFM",
        alwaysShow: true,
        "component": ParentView,
        children: [
          {
            path: "/supervisordptFM",
            name: "supervisordptFM",
            component: () => import("@/views/datum/supervisordptFM"),
            meta: {
              title: "监理资料管理",
              code: "supervisordptFM",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/auditUnitdptFM",
            name: "auditUnitdptFM",
            component: () => import("@/views/datum/auditUnitdptFM"),
            meta: {
              title: "全咨资料管理",
              code: "auditUnitdptFM",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/constructdptFM",
            name: "constructdptFM",
            component: () => import("@/views/datum/constructdptFM"),
            meta: {
              title: "施工资料管理",
              code: "constructdptFM",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/thirdTestingUnitFM",
            name: "thirdTestingUnitFM",
            component: () => import("@/views/datum/thirdTestingUnitFM"),
            meta: {
              title: "第三方检测资料管理",
              code: "thirdTestingUnitFM",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          }]
      },{
        path: "/datum",
        meta: {
          title: "档案管理",
          icon: "record",
          code: "danganguanli"
        },
        alwaysShow: true,
        "component": ParentView,
        redirect: "/contractManagement",
        children: [{
          path: "/contractManagement",
          name: "contractManagement",
          component: () => import("@/views/datum/index"),
          meta: {
            title: "合同管理",
            code: "hetongguanli",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
          {
            path: "/engineeringChange",
            name: "engineeringChange",
            component: () => import("@/views/datum/engineeringChange"),
            meta: {
              title: "工程变更",
              code: "gongchengbiangeng",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/drawingModel",
            name: "drawingModel",
            component: () => import("@/views/datum/drawingModel"),
            meta: {
              title: "图纸模型",
              code: "tuzhimoxing",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/meetingSummary",
            name: "meetingSummary",
            component: () => import("@/views/datum/meetingSummary"),
            meta: {
              title: "会议纪要",
              code: "huiyijiyao",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/qualityDocument",
            name: "qualityDocument",
            component: () => import("@/views/datum/qualityDocument"),
            meta: {
              title: "质量体系",
              code: "zhiliangtixi",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
        ]
      }, {
        path: '/contract',
        meta: {
          title: "合同管理",
          icon: "contract",
          code: "yijihetongguanli"
        },
        alwaysShow: true,
        "component": ParentView,
        redirect: "/staffSubmit",
        children: [{
          path: "/staffSubmit",
          name: "staffSubmit",
          component: () => import("@/views/contractManagement/staffSubmit"),
          meta: {
            title: "人员报审",
            code: "hetongrenyuanbaoshen",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
          // {
          // 	path: "/personnelAudit",
          // 	name: "personnelAudit",
          // 	component: () => import("@/views/contractManagement/personnelAudit"),
          // 	meta: {
          // 		title: "人员审核",
          // 		code: "renyuanshenhe",
          // 		icon: "circle",
          // 		allMap: false,
          // 		partMap: false,
          // 		noMap: true
          // 	}
          // },
          {
            path: "/personnelReportForExaminationRecords",
            name: "personnelReportForExaminationRecords",
            component: () => import("@/views/contractManagement/personnelReportForExaminationRecords"),
            meta: {
              title: "人员台账",
              code: "renyuanbaoshenjilu",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/personnelChange",
            name: "personnelChange",
            component: () => import("@/views/contractManagement/personnelChange"),
            meta: {
              title: "人员变更",
              code: "renyuanbiangeng",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          // {
          // 	path: "/personnelChangeAudit",
          // 	name: "personnelChangeAudit",
          // 	component: () => import("@/views/contractManagement/personnelChangeAudit"),
          // 	meta: {
          // 		title: "人员变更审核",
          // 		code: "renyuanbiangengshenhe",
          // 		icon: "circle",
          // 		allMap: false,
          // 		partMap: false,
          // 		noMap: true
          // 	}
          // },
          {
            path: "/personnelChangeRecord",
            name: "personnelChangeRecord",
            component: () => import("@/views/contractManagement/personnelChangeRecord"),
            meta: {
              title: "人员变更记录",
              code: "renyuanbiangengjilu",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/applicationForLeave",
            name: "applicationForLeave",
            component: () => import("@/views/contractManagement/applicationForLeave"),
            meta: {
              title: "请假申请",
              code: "qingjiashenqing",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          // {
          // 	path: "/leaveApproval",
          // 	name: "leaveApproval",
          // 	component: () => import("@/views/contractManagement/leaveApproval"),
          // 	meta: {
          // 		title: "请假审核",
          // 		code: "qingjiashenhe",
          // 		icon: "circle",
          // 		allMap: false,
          // 		partMap: false,
          // 		noMap: true
          // 	}
          // },
          {
            path: "/leaveRecord",
            name: "leaveRecord",
            component: () => import("@/views/contractManagement/leaveRecord"),
            meta: {
              title: "请假记录",
              code: "qingjiajilu",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/areaSetting",
            name: "areaSetting",
            component: () => import("@/views/contractManagement/areaSetting"),
            meta: {
              title: "电子围栏",
              code: "dianziweilan",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/attendanceClock",
            name: "attendanceClock",
            component: () => import("@/views/contractManagement/attendanceClock"),
            meta: {
              title: "考勤打卡",
              code: "kaoqindaka",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/attendanceRecord",
            name: "attendanceRecord",
            component: () => import("@/views/contractManagement/attendanceRecord"),
            meta: {
              title: "考勤记录",
              code: "kaoqinjilu",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/attendanceStatistics",
            name: "attendanceStatistics",
            component: () => import("@/views/contractManagement/attendanceStatistics"),
            meta: {
              title: "考勤统计",
              code: "kaoqintongji",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/constructionSubcontract",
            name: "constructionSubcontract",
            component: () => import("@/views/contractManagement/constructionSubcontract"),
            meta: {
              title: "施工分包合同",
              code: "shigongfenbaohetong",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },

          {
            path: "/entranceAndExitManagement",
            name: "entranceAndExitManagement",
            component: () => import("@/views/contractManagement/entranceAndExitManagement"),
            meta: {
              title: "进退场管理",
              code: "jintuichangguanli",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/currentAccountManagement",
            name: "currentAccountManagement",
            component: () => import("@/views/contractManagement/currentAccountManagement"),
            meta: {
              title: "往来款管理",
              code: "wanglaikuanguanli",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
        ]
      }, {
        path: "/study",
        meta: {
          title: "教育培训",
          icon: "education",
          code: "jiaoyupeixun"
        },
        alwaysShow: true,
        "component": ParentView,
        redirect: "/teachingVideo",
        children: [{
          path: "/teachingVideo",
          name: "teachingVideo",
          component: () => import("@/views/study/index"),
          meta: {
            title: "教学视频",
            code: "jiaoxueshipin",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
          {
            path: "/teachingDocument",
            name: "teachingDocument",
            component: () => import("@/views/study/teachingDocument"),
            meta: {
              title: "教学文档",
              code: "jiaoxuewendang",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          // {
          //   path: '/prefabricatedModel',
          //   name: 'prefabricatedModel',
          //   component: () => import('@/views/study/prefabricatedModel'),
          //   meta: { title: '预制模型', icon: '', allMap: false, partMap: false, noMap: true }
          // },
          {
            path: "/installationPackage",
            name: "installationPackage",
            component: () => import("@/views/study/installationPackage"),
            meta: {
              title: "安装包",
              code: "anzhuangbao",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          }
        ]
      }, {
        path: "/staffManage",
        meta: {
          title: "人员管理",
          icon: "staff",
          code: "renyuanguanli"
        },
        alwaysShow: true,
        "component": ParentView,
        redirect: "/clockingIn",
        children: [{
          path: "/clockingIn",
          name: "clockingIn",
          component: () => import("@/views/staffManage/index"),
          meta: {
            title: "考勤管理",
            code: "kaoqinguanli",
            icon: "circle",
            allMap: false,
            partMap: false,
            noMap: true
          }
        },
          {
            path: "/processManage",
            name: "processManage",
            component: () => import("@/views/staffManage/processManage"),
            meta: {
              title: "流程管理",
              code: "liuchengguanli",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/Infotip",
            name: "Infotip",
            component: () => import("@/views/staffManage/Infotip"),
            meta: {
              title: "信息提醒",
              code: "xinxitixing",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          },
          {
            path: "/statisticAnalysis",
            name: "statisticAnalysis",
            component: () => import("@/views/staffManage/statisticAnalysis"),
            meta: {
              title: "统计分析",
              code: "tongjifenxi",
              icon: "circle",
              allMap: false,
              partMap: false,
              noMap: true
            }
          }
        ]
      },]
  },

  {
    component: Layout,
    meta: {
      icon: "#",
      noCache: false,
      title: "在线表单"
    },
    alwaysShow: true,
    redirect: "/noRedirect",
    name: "onlineForms",
    path: "/onlineForms",
    children: [
      {
        path: "/onlineProduce",
        meta: {
          title: "在线工序",
          icon: "earlier",
          code: "onlineProduce"
        },
        alwaysShow: true,
        component: ParentView,
        redirect: "/produceReport",
        children: [
          {
            path: "/produceReport",
            name: "produceReport",
            component: () => import ("@/views/onlineForms/produceReport/produceReport"),
            meta: {
              title: "工序填报",
              icon: "circle",
              code: "produceReport",
              // 地图相关
              allMap: false,
              partMap: false,
              noMap: true
              // 左侧目录树
              /**
               left: true,
               right: true,
               offsetToRight: true, // 三维地图工具栏向右偏移200px
               open: true 
               */              
            }
          },

          {
            path: "/produceCheck",
            name: "produceCheck",
            component: () => import ("@/views/onlineForms/produceCheck/produceCheck"),
            meta: {
              title: "工序核验",
              icon: "circle",
              code: "produceCheck",
              allMap: false,
              partMap: false,
              noMap: true
            }
          }
        ]
      }
    ]
  },

  {
    path: "/digitalarchives",
    meta: {
      title: "数字档案",
      icon: "education",
      code: "digitalarchives"
    },
    alwaysShow: true,
    component: Layout
  }










  // {
  //   path: '/pitchControl',
  //   meta: { title: '投控管理', icon: require('../assets/image/项目管理.png') },
  //   component: Layout,
  //   redirect: '/carefulRecords',
  //   children: [
  //     {
  //       path: '/carefulRecords',
  //       name: 'carefulRecords',
  //       component: () => import('@/views/pitchControl/index'),
  //       meta: {
  //         title: '跟审记录',
  //         icon: '',
  //         allMap: true,
  //         partMap: false,
  //         noMap: false,
  //         left: true,
  //         right: true,
  //         open: true
  //       }
  //     },
  //     {
  //       path: '/tracking',
  //       name: 'tracking',
  //       component: () => import('@/views/pitchControl/tracking'),
  //       meta: {
  //         title: '现场跟踪',
  //         icon: '',
  //         allMap: true,
  //         partMap: false,
  //         noMap: false,
  //         left: true,
  //         right: true,
  //         open: true
  //       }
  //     },
  //     {
  //       path: '/measurementAudit',
  //       name: 'measurementAudit',
  //       component: () => import('@/views/pitchControl/measurementAudit'),
  //       meta: {
  //         title: '计量审核',
  //         icon: '',
  //         allMap: false,
  //         partMap: false,
  //         noMap: true
  //       }
  //     },
  //     {
  //       path: '/payAudit',
  //       name: 'payAudit',
  //       component: () => import('@/views/pitchControl/payAudit'),
  //       meta: {
  //         title: '支付审核',
  //         icon: '',
  //         allMap: false,
  //         partMap: false,
  //         noMap: true
  //       }
  //     }
  //   ]
  // },


];
