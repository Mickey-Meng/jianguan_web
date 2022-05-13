import Layout from "@/layout";
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
  // {
  //   path: '/globalView',
  //   component: () => import('@/views/screenWindow/index'),
  //   hidden: true
  // },
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
    path: "*",
    redirect: "/home",
    hidden: true
  }
];
export const asyncRoutes = [{
  path: "/",
  component: Layout,
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
  },
  {
    path: "/scene",
    meta: {
      title: "数字孪生",
      icon: "figure",
      code: "sanweichangjing"
    },
    component: Layout,
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
  },
  {
    path: "/earlierStage",
    meta: {
      title: "前期管理",
      icon: "earlier",
      code: "qianqiguanli"
    },
    alwaysShow: true,
    component: Layout,
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
      {
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
      }
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
    component: Layout,
    redirect: "/planOverview",
    children: [{
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
          open: true
        }
      }
    ]
  },
  {
    path: "/quality",
    meta: {
      title: "质量管理",
      icon: "quality",
      code: "zhiliangguanli"
    },
    alwaysShow: true,
    component: Layout,
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
    ]
  },
  {
    path: "/safetyCulture",
    meta: {
      title: "安全管理",
      icon: "safe",
      code: "anquanguanli"
    },
    alwaysShow: true,
    component: Layout,
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
          right: true
        }
      }
      // {
      //   path: '/sourceOfDanger',
      //   name: 'sourceOfDanger',
      //   component: () => import('@/views/safetyCulture/sourceOfDanger'),
      //   meta: { title: '危险源', icon: '', allMap: true, partMap: false, noMap: false, left: true, right: true }
      // }
    ]
  },
  {
    path: "/staffManage",
    meta: {
      title: "人员管理",
      icon: "staff",
      code: "renyuanguanli"
    },
    alwaysShow: true,
    component: Layout,
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
  },
  {
    path: "/wisdomSite",
    meta: {
      title: "智慧工地",
      icon: "construction",
      code: "zhihuigongdi"
    },
    alwaysShow: true,
    component: Layout,
    redirect: "/videoEnvironment",
    children: [{
        path: "/videoEnvironment",
        name: "videoEnvironment",
        component: () => import("@/views/wisdomSite/index"),
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
          title: "数字实验室",
          code: "shuzishiyanshi",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      },
      {
        path: "/constructionMonitoring",
        name: "constructionMonitoring",
        component: () => import("@/views/wisdomSite/constructionMonitoring"),
        meta: {
          title: "施工监测",
          code: "shigongjiance",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      }
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
  },
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
  {
    path: "/datum",
    meta: {
      title: "档案管理",
      icon: "record",
      code: "danganguanli"
    },
    alwaysShow: true,
    component: Layout,
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
      }
    ]
  },
  {
    path: "/study",
    meta: {
      title: "教育培训",
      icon: "education",
      code: "jiaoyupeixun"
    },
    alwaysShow: true,
    component: Layout,
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
  },
  {
    path: 'contractManagement',
    meta: {
      title: "合同管理",
      icon: "contract",
      code: "yijihetongguanli"
    },
    alwaysShow: true,
    component: Layout,
    redirect: "/staffSubmit",
    children: [{
        path: "/staffSubmit",
        name: "staffSubmit",
        component: () => import("@/views/contractManagement/staffSubmit"),
        meta: {
          title: "人员填报",
          code: "renyuantianbao",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
    },
      {
        path: "/personnelAudit",
        name: "personnelAudit",
        component: () => import("@/views/contractManagement/personnelAudit"),
        meta: {
          title: "人员审核",
          code: "renyuanshenhe",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      },
      {
        path: "/personnelReportForExaminationRecords",
        name: "personnelReportForExaminationRecords",
        component: () => import("@/views/contractManagement/personnelReportForExaminationRecords"),
        meta: {
          title: "人员报审记录",
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
      {
        path: "/personnelChangeAudit",
        name: "personnelChangeAudit",
        component: () => import("@/views/contractManagement/personnelChangeAudit"),
        meta: {
          title: "人员变更审核",
          code: "renyuanbiangengshenhe",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      },
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
      }, {
        path: "/leaveApproval",
        name: "leaveApproval",
        component: () => import("@/views/contractManagement/leaveApproval"),
        meta: {
          title: "请假审核",
          code: "qingjiashenhe",
          icon: "circle",
          allMap: false,
          partMap: false,
          noMap: true
        }
      }, {
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
      },
    ]
  }
];
