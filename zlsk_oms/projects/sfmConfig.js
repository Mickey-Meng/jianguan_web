((function (factory, ctx, undefined) {
    if ((typeof module) !== 'undefined' && module.exports) {
        module.exports = factory();
    } else if ((typeof define) === 'function' && define.amd) {
        define([], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.sfmConfig = factory();
    }
})(function () {
    var svcIp = window.location.host;

    var stFileSvc = 'http://{$serviceIp$}/STRestService/file/';
    var stQuerySvc = 'http://{$serviceIp$}/STRestService/query/';
    var stStatisticsSvc = 'http://{$serviceIp$}/STRestService/statistics/';
    var stAnalysisSvc = 'http://{$serviceIp$}/STRestService/analysis/';
    var stConfigSvc = 'http://{$serviceIp$}/STRestService/config/';
    var stOmsSvc = 'http://{$serviceIp$}/STOms/dailyinfoAction.do?';

    var sfmConfig = {
        project: 'slate',
        appType: 'local',
        theme: 'blue',
        sfmLogin: {
            mode: -1
        },
        auth: {
            mode: 2
        },
        serviceProtocol: 'http:',
        serviceIp: svcIp,
        docTitle: 'shadowy feather meow',
        title: 'Header',
        titleImg: '',
        loginBgimg: '',
        loginImg: '',
        loginLogo: '',
        mainLogo: '../../../../../images/logos/zlsk.png',
        server: {
            serviceIp: svcIp
        },
        service: {
            stFile: {
                name: 'stFile',
                url: stFileSvc
            },
            stQuery: {
                name: 'stQuery',
                url: stQuerySvc
            },
            stStatistics: {
                name: 'stStatistics',
                url: stStatisticsSvc
            },
            stAnalysis: {
                name: 'stAnalysis',
                url: stAnalysisSvc
            },
            stConfig: {
                name: 'stConfig',
                url: stConfigSvc
            },
            stOms: {
                name: 'stOms',
                url: stOmsSvc
            }
        },
        sfmFileRoot: 'SimpleFile',
        moduleConfig: {
            ST_PH: {
                HOST_URL: SFM.sfmUtil.getHostUrl()
            }
        },
        widgetCfg: null,

        copyright: 'Copyright&nbsp;2016-2026&nbsp;版权所有&nbsp;SimpleSpace'
    };

    var s = window.location.search;
    if (s != '') {
        s = s.substr(1, s.length - 1);
        s = s.split('&');
        for (var i = 0; i < s.length; i++) {
            if (s[i].indexOf('=') < 0) {
                continue;
            }
            var a = s[i].split('=');
            if (a.length == 2) {
                if (a[0] == 'app') {
                    sfmConfig.project = a[1];
                    break;
                }
            }
        }
    }

    return sfmConfig;
}, window));
