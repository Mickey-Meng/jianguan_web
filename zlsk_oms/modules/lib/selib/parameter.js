var params = {
	ip: "http://192.168.2.110", //服务器地址
	screen: 0, //数据配置文件索引,
	show2D: false, //是否二维叠加
	//link2D:"http://192.168.1.228:8080/Pipeline2D", //二维鹰眼地址  //而为鹰眼由于跨域问题，无法联动，现将二维鹰眼文件放在本网站内 根目录可查看
	product: "product"
};
window.params = params;

var PS2_config = {};
PS2_config.auth = {
	enableAuth: false,
	loginTitle: '地下管线三维可视化应用系统-登录',
	loginCaption: '地下管线三维可视化应用系统',
	loginImg: './image/loginImg.png'
};

PS2_config.server = {
	serviceIp: /*'http://192.168.2.110:8080',*/ 'http://127.0.0.1:8080',
	stampMgrIp: 'http://192.168.2.110:8080',
	businessIp: 'http://192.168.1.65'
};


PS2_config.service = {
	authentication: PS2_config.server.stampMgrIp + '/StampManager2/functionAction.do?method=webServiceList&p=ps2',
	uploadTempFile: PS2_config.server.businessIp + '/DataManager/DataManagerREST.svc/UploadTempFile',
	getPipeInfoFromMdb: PS2_config.server.businessIp + '/DataManager/DataManagerREST.svc/GetPipeInfoFromMdb2',

	query: PS2_config.server.serviceIp + '/STRestService/query/',
	statistics: PS2_config.server.serviceIp + '/STRestService/statistics/',
	analysis: PS2_config.server.serviceIp + '/STRestService/analysis/'
}

PS2_config.poiConfig = {
	hasImg:false,
	imgPath:'image/poiImg/',
	imgNameField:'SE_NAME'
}

// //数据库中建设年代的日期格式：1990-01-01 或者 1990/01/01 或者 1990-01 或者 1990/01
// PS2_config.BD_TIMEFORMAT="1990-01-01";//生命周期、预警分析、一键提醒、埋设统计中用到

PS2_config.LineProperty={
	DLLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		"US_VENTNUM",	//电缆条数
		"US_HOLETOL",	//总孔数
		"US_HOLEUSE",	//已用孔数
		"US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	DXLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		// "US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		"US_VENTNUM",	//电缆条数
		"US_HOLETOL",	//总孔数
		"US_HOLEUSE",	//已用孔数
		"US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	JSLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		// "US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	PSLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		// "US_PRESSUR",	//压力
		"US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	RQLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	RLLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	GYLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		"US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	DEFAULTLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		// "US_PRESSUR",	//压力
		// "US_FLOWDIR",	//流向
		// "US_VENTNUM",	//电缆条数
		// "US_HOLETOL",	//总孔数
		// "US_HOLEUSE",	//已用孔数
		// "US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	]
}

PS2_config.PointProperty = {
	WELLPOINT:[
		"US_KEY",		//编号
		"X",			//X坐标
		"Y",			//Y坐标
		"US_PT_ALT",	//地面高程
		"US_PT_TYPE",	//特征
		"US_ATTACHMENT",//附属物
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_UPDATE",	//更新状态
		"US_WELL",		//井类型
		"US_WDIA",		//井直径
		"US_NDEEP",		//井脖深
		"US_WDEEP",		//井底深
		"US_PLATE",		//井盖类型
		"US_PSIZE",		//井盖规格
		"US_PMATER",	//井盖材质
		"US_WMATER",	//井材质
		"US_ANGLE",		//旋转角度
		"US_OFFSET"		//偏心井点号
	],
	DEFAULTPOINT:[
		"US_KEY",		//编号
		"X",			//X坐标
		"Y",			//Y坐标
		"US_PT_ALT",	//地面高程
		"US_PT_TYPE",	//特征
		"US_ATTACHMENT",//附属物
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_UPDATE"		//更新状态
	]
};


PS2_config.menuConfig = [{
	id: 'browse',
	name: '三维浏览',
	icon: './image/menu/browse.png',
	children: [{
		id: 'ViewUndergroundMode',
		name: '地下浏览',
		icon: './image/menu/browse/dixialiulan.png'
	}, {
		id: 'ViewTranSetting',
		name: '地形透明',
		icon: './image/menu/browse/dixingtouming.png'
	}, {
		id: 'ViewPointManagement',
		name: '视点管理',
		icon: './image/menu/browse/shidianguanli.png'
	}, {
		id: 'mMultipleScreen',
		name: '双屏比对',
		icon: './image/menu/browse/shuangpingduibi.png'
	}, {
		id: 'ViewFlyMode',
		name: '路径',
		icon: './image/menu/browse/lujing.png'
	}, {
		id: 'ViewPersonMode',
		name: '漫游',
		icon: './image/menu/browse/manyou.png'
	}, {
		id: 'mScreenShot',
		name: '截屏',
		icon: './image/menu/browse/jieping.png'
	}, {
		id: 'pictures',
		name: '出图',
		icon: './image/menu/browse/chutu.png'
	}, {
		id: 'poiPoint',
		name: '兴趣点',
		icon: './image/menu/browse/xingqudian.png'
	}, {
		id: 'ViewCoordLocation',
		name: '坐标定位',
		icon: './image/menu/browse/zuobiaodingwei.png'
	}, {
		id: 'EffectRain',
		name: '雨',
		icon: './image/menu/browse/yu.png'
	}, {
		id: 'EffectSnow',
		name: '雪',
		icon: './image/menu/browse/xue.png'
	}, {
		id: 'EffectFog',
		name: '雾',
		icon: './image/menu/browse/wu.png'
	}, {
		id: 'ViewOpenCollision',
		name: '开启碰撞',
		icon: './image/menu/browse/kaiqipengzhuang.png'
	}, {
		id: 'ViewSystemSetting',
		name: '系统设置',
		icon: './image/menu/browse/xitongshezhi.png'
	}]
}, {
	id: 'display',
	name: '三维显示',
	icon: './image/menu/display.png',
	children: [{
		id: 'ViewMaterialShowing',
		name: '材质显示',
		icon: './image/menu/display/caizhixianshi.png'
	}, {
		id: 'ViewStandardColorShowing',
		name: '标准色显示',
		icon: './image/menu/display/biaozhunshexianshi.png'
	}, {
		id: 'ViewCustomColorShowing',
		name: '自定义显示',
		icon: './image/menu/display/zidingyixianshi.png'
	}, {
		id: 'ViewLegendShowing',
		name: '显示图例',
		icon: './image/menu/display/xianshituli.png'
	}, {
		id: 'RoadName',
		name: '道路名显示',
		icon: './image/menu/display/daolumingxianshi.png',
		disabled: true
	}]
}, {
	id: 'query',
	name: '管线查询',
	icon: './image/menu/query.png',
	children: [{
		id: 'QueryProperty',
		name: '属性查询',
		icon: './image/menu/query/shuxingchaxun.png'
	}, {
		id: 'QuerySpatial',
		name: '空间查询',
		icon: './image/menu/query/kongjianchaxun.png'
	}, {
		id: 'QueryOwner',
		name: '权属查询',
		icon: './image/menu/query/quanshuchaxun.png'
	}, {
		id: 'AnalysisBuffer',
		name: '缓冲查询',
		icon: './image/menu/query/huanchongchaxun.png'
	}, {
		id: 'QueryRoad',
		name: '道路查询',
		icon: './image/menu/query/daoluchaxun.png'
	}, {
		id: 'QueryCanton',
		name: '行政查询',
		icon: './image/menu/query/xingzhengchaxun.png'
	}, {
		id: 'QueryCompany',
		name: '单位查询',
		icon: './image/menu/query/danweichaxun.png'
	}, {
		id: 'QueryEquipment',
		name: '特征查询',
		icon: './image/menu/query/tezhengchaxun.png'
	}, {
		id: 'QueryAttachment',
		name: '附属物查询',
		icon: './image/menu/query/fushuwuchaxun.png'
	}, {
		id: 'AnalysisEquipmentSearch',
		name: '特征搜索',
		icon: './image/menu/query/tezhengsousuo.png'
	}, {
		id: 'AnalysisAttachmentSearch',
		name: '设施搜索',
		icon: './image/menu/query/sheshisousuo.png'
	}, {
		id: 'QuerySquareness',
		name: '管径查询',
		icon: './image/menu/query/guanjingchaxun.png'
	}, {
		id: 'QueryMaterial',
		name: '材质查询',
		icon: './image/menu/query/caizhichaxun.png'
	}, {
		id: 'QueryBase',
		name: '基础查询',
		icon: './image/menu/query/jichuchaxun.png'
	}, {
		id: 'QueryComplex',
		name: '复合查询',
		icon: './image/menu/query/fuhechaxun.png'
	}]
}, {
	id: 'stat',
	name: '管线统计',
	icon: './image/menu/stat.png',
	children: [{
		id: 'StatisticsDiameter',
		name: '管径分段',
		icon: './image/menu/stat/guanjingfenduan.png'
	}, {
		id: 'StatisticsCoveringDepth',
		name: '埋深分段',
		icon: './image/menu/stat/maishenfenduan.png'
	}, {
		id: 'StatisticsEquipmentClass',
		name: '特征分类',
		icon: './image/menu/stat/tezhengfenlei.png'
	}, {
		id: 'StatisticsAttachmentClass',
		name: '附属物分类',
		icon: './image/menu/stat/fushuwufenlei.png'
	}, {
		id: 'StatisticsDiameterClass',
		name: '管径分类',
		icon: './image/menu/stat/guanjingfenlei.png'
	}, {
		id: 'StatisticsMaterialClass',
		name: '材质分类',
		icon: './image/menu/stat/caizhifenlei.png'
	}, {
		id: 'StatisticsAbandon',
		name: '废弃统计',
		icon: './image/menu/stat/feiqitongji.png'
	}, {
		id: 'StatisticsOwner',
		name: '权属统计',
		icon: './image/menu/stat/quanshutongji.png'
	}, {
		id: 'StatisticsInbuilt',
		name: '埋设统计',
		icon: './image/menu/stat/maishetongji.png'
	}, {
		id: 'StatisticsRoad',
		name: '道路统计',
		icon: './image/menu/stat/daolutongji.png'
	}]
}, {
	id: 'analysis',
	name: '管线分析',
	icon: './image/menu/analysis.png',
	children: [{
		id: 'AnalysisHorizontalDis',
		name: '水平净距',
		icon: './image/menu/analysis/shuipingjingju.png'
	}, {
		id: 'AnalysisVerticalDis',
		name: '垂直净距',
		icon: './image/menu/analysis/chuizhijingju.png'
	}, {
		id: 'AnalysisCollision',
		name: '碰撞分析',
		icon: './image/menu/analysis/pengzhuangfenxi.png'
	}, {
		id: 'AnalysisCoveringDepth',
		name: '覆土分析',
		icon: './image/menu/analysis/futufenxi.png'
	}, {
		id: 'AnalysisVerSection',
		name: '纵断面',
		icon: './image/menu/analysis/zongduanmian.png'
	}, {
		id: 'AnalysisTranSection',
		name: '横断面',
		icon: './image/menu/analysis/hengduanmian.png'
	}, {
		id: 'AnalysisCustomSection',
		name: '自定义横断面',
		icon: './image/menu/analysis/zidingyihengduanmian.png'
	}, {
		id: 'AnalysisBurst',
		name: '爆管分析',
		icon: './image/menu/analysis/baoguanfenxi.png'
	}, {
		id: 'ViewFlowShowing',
		name: '流向分析',
		icon: './image/menu/analysis/liuxiangfenxi.png',
		disabled: true
	}, {
		id: 'AnalysisExcava',
		name: '开挖分析',
		icon: './image/menu/analysis/kaiwafenxi.png'
	}, {
		id: 'TerrainAnalysis',
		name: '隧道分析',
		icon: './image/menu/analysis/suidaofenxi.png'
	}, {
		id: 'AnalysisPipel',
		name: '智能排管',
		icon: './image/menu/analysis/zhinengpaiguan.png'
	}, {
		id: 'LifeCycle',
		name: '生命周期',
		icon: './image/menu/analysis/shengmingzhouqi.png'
	}, {
		id: 'AnalysisWarning',
		name: '预警分析',
		icon: './image/menu/analysis/yujingfenxi.png'
	}, {
		id: 'keyRemind',
		name: '一键提醒',
		icon: './image/menu/analysis/yijiantixing.png'
	}]
}, {
	id: 'measure',
	name: '地图量算',
	icon: './image/menu/measure.png',
	children: [{
		id: 'BTerrain',
		name: '忽略地形',
		icon: './image/menu/measure/huluedixing.png'
	}, {
		id: 'MeasureHorizontalDis',
		name: '水平距离',
		icon: './image/menu/measure/shuipingjuli.png'
	}, {
		id: 'MeasureVerticalDis',
		name: '垂直距离',
		icon: './image/menu/measure/chuizhijuli.png'
	}, {
		id: 'MeasureSpaceDis',
		name: '空间距离',
		icon: './image/menu/measure/kongjianjuli.png'
	}, {
		id: 'mPlaneAngle',
		name: '平面角度',
		icon: './image/menu/measure/pingmianjiaodu.png'
	}, {
		id: 'MeasureFlatArea',
		name: '水平面积',
		icon: './image/menu/measure/shuipingmianji.png'
	}, {
		id: 'MeasurePipelineHorDis',
		name: '管间水平距离',
		icon: './image/menu/measure/guanjianshuipingjuli.png'
	}, {
		id: 'MeasurePipelineVerDis',
		name: '管间垂直距离',
		icon: './image/menu/measure/guanjianchuizhijuli.png'
	}, {
		id: 'MeasurePipelineSpaceDis',
		name: '管间空间距离',
		icon: './image/menu/measure/guanjiankongjianjuli.png'
	}]
}, {
	id: 'marker',
	name: '管线标注',
	icon: './image/menu/marker.png',
	children: [{
		id: 'MarkedElevation',
		name: '标高标注',
		icon: './image/menu/marker/biaogaobiaozhu.png'
	}, {
		id: 'MarkedDiameter',
		name: '管径标注',
		icon: './image/menu/marker/guanjingbiaozhu.png'
	}, {
		id: 'MarkedCoveringDepth',
		name: '埋深标注',
		icon: './image/menu/marker/maishenbiaozhu.png'
	}, {
		id: 'MarkedCoordinates',
		name: '坐标标注',
		icon: './image/menu/marker/zuobiaobiaozhu.png'
	}, {
		id: 'MarkedSlope',
		name: '坡度标注',
		icon: './image/menu/marker/podubiaozhu.png'
	}, {
		id: 'MarkedCurvedAngle',
		name: '弯头角度',
		icon: './image/menu/marker/wantoubiaozhu.png'
	}, {
		id: 'MarkedAngleAndLength',
		name: '栓点标注',
		icon: './image/menu/marker/shuandianbiaozhu.png'
	}, {
		id: 'MarkedComplex',
		name: '扯旗标注',
		icon: './image/menu/marker/cheqibiaozhu.png'
	}, {
		id: 'MarkedCustomPart',
		name: '自定义标注',
		icon: './image/menu/marker/zidingyibiaozhu.png'
	}, {
		id: 'MarkedManagement',
		name: '标注管理',
		icon: './image/menu/marker/biaozhuguanli.png'
	}]
}];
