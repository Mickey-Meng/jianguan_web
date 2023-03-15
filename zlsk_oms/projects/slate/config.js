/*
 * @Descripttion:
 * @version:
 * @Author: WangHarry
 * @Date: 2022-05-16 14:09:36
 * @LastEditors: WangHarry
 * @LastEditTime: 2022-06-03 08:14:21
 */
((function (factory, ctx, undefined) {
    if ((typeof module) !== 'undefined' && module.exports) {
        module.exports = factory();
    } else if ((typeof define) === 'function' && define.amd) {
        define([], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.sfmAppConfig = factory();
        $.extend(true, ctx.SFM.sfmConfig, ctx.SFM.sfmAppConfig);
    }
})(function () {
    var serverIp = window.location.host;
	var stSvc = 'https://{$serviceIp$}/STSfmzj/assets/';
	var stFormSvc = 'https://{$serviceIp$}/STSfmzj/formController/';
    var stAuthSvc = 'https://{$serviceIp$}/STSfmzj/userauth/';
    var stFlowSvc = 'https://{$serviceIp$}/STSfmzj/workflow/';
    var stMapSvc =  'https://{$serviceIp$}/STSfmzj/mapConfig/';
    var stFlowSvc2 = 'https://{$serviceIp$}/STSfmzj/workflow2/';
    var sfmAppConfig = {
        appType: 'local',
        theme: 'cultrueCityBlue',
        sfmLogin: {
            mode: 1
        },
        auth: {
            mode: 2
        },
        sysName:'oms',
        rootUrl: '/zlsk_oms',
        priority:'2,3,1',//获取地图优先级(1 根据组织关联  2 根据角色关联 3 根据用户关联)
        serviceProtocol: 'http:',
        serviceIp: serverIp,
        docTitle: '诸暨BIM平台运维管理',
        subtitle: '系统',
        /* loginBgimg: '', */
        loginImg: '',
        loginLogo: '',
        mainLogo: '../../../../../images/logos/logo.png',
		homePage:{
            MENUCODE:'user'
        },
		mapConfig:{

		},
        server: {
            serviceIp: serverIp
        },
        service: {
            stBase: {
                name: 'stBase',
                url: stSvc
            },
            stAuth: {
                name: 'stAuth',
                url: stAuthSvc
            },
            stFlow: {
                name: 'stFlow',
                url: stFlowSvc
            },
            stFlow: {
                name: 'stFlow2',
                url: stFlowSvc2
            },
            stMap:{
                name:'stMap',
                url:stMapSvc
            },
            stForm:{
                name:'stForm',
                url:stFormSvc
            }
        },
        lib: [],
        login: {
            url: '/lib/ok_admin/pages/login.html',
        },
        container: {
            url: '/lib/ok_admin/index.html'
        },
        menu: [],
        toolbar: [],
        pre: [],
        module: [],
        sfmFileRoot: 'SimpleFile',
        copyright: '版权所有Copyright&copy;&nbsp;2020&nbsp;运维管理平台'
    };
    return sfmAppConfig;
}, window));
