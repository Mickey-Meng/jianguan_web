(function(ctx, $, opt) {
    var TYPE_LINE = 'line';
    var TYPE_POINT = 'point';
    var TYPE_POLYGON = 'polygon';

    var ajax = opt && opt.ajax || window.ajax || $.ajax;
    var mw = SFM.sfmUtil.getMainWin();
    var sfmDm = mw.SFM.sfmDataMgr;
    var sfmMm = mw.SFM.sfmModuleMgr;

    var _layerList = null;
    var _layerKeyMap = null;

    var _lldfd = $.Deferred();
    var _lkdfd = $.Deferred();

    var getInfo = function(options) {
        var u = sfmMm.getServiceUrl('stFile') + 'getInfo';
        var dfd = $.Deferred();
        ajax({
            type: 'GET',
            dataType: 'json',
            url: u,
            data: {
                type: options.type,
                key: options.key,
                ext: options.ext || 'json'
            },
            async: true,
            cache: false
        }).then(function(data) {
            var d = data && data.data;
            if (d) {
                if (d.msg) {
                    dfd.reject(d.msg);
                } else {
                    dfd.resolve(d.getMe[0]);
                }
            } else {
                dfd.reject('获取信息失败');
            }
        }, function(msg) {
            dfd.reject('获取信息失败,可能是网络原因');
        });
        return dfd.promise();
    };
    var saveInfo = function(options) {
        var u = sfmMm.getServiceUrl('stFile') + 'saveInfo';
        var dfd = $.Deferred();
        ajax({
            type: 'POST',
            dataType: 'json',
            url: u,
            data: {
                type: options.type,
                key: options.key,
                ext: options.ext || 'json',
                content: options.content
            },
            async: true,
            cache: false
        }).then(function(data) {
            if (data.success) {
                dfd.resolve(data.data);
            } else {
                dfd.reject('保存信息失败');
            }
        }, function(msg) {
            dfd.reject('保存信息失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var updateCurrnetPorject = function(projectName) {
        var u = sfmMm.getServiceUrl('stConfig') + 'updateCurrnetConfig';
        var dfd = $.Deferred();
        ajax({
            type: 'GET',
            dataType: 'json',
            url: u,
            data: {
                configName: projectName
            },
            async: true,
            cache: false
        }).then(function(data) {
            var d = data && data.data;
            if (d) {
                if (d.msg) {
                    dfd.reject(d.msg);
                } else {
                    dfd.resolve(d.getMe[0]);
                }
            } else {
                dfd.reject('更新配置失败');
            }
        }, function(msg) {
            dfd.reject('更新配置失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var getLayerKeyMap = function() {
        if (_lkdfd.state() == 'resolved') {
            return _lkdfd.promise();
        }
        var u = sfmMm.getServiceUrl('stQuery') + 'getTableKeyMap';
        ajax({
            type: 'GET',
            dataType: 'json',
            url: u,
            async: true,
            cache: false,
            success: function(data, textStatus, jqXHR) {
                var d = data && data.data;
                if (d) {
                    if (d.msg) {
                        _lkdfd.reject(d.msg);
                    } else {
                        _layerKeyMap = d.getMe[0];
                        _lkdfd.resolve(_layerKeyMap);
                    }
                } else {
                    _lkdfd.reject('获取图层信息失败');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                _lkdfd.reject('获取图层信息失败,可能是网络原因');
            }
        });
        return _lkdfd.promise();
    };

    var getLayerList = function(options) {
        if (_lldfd.state() == 'resolved') {
            return _lldfd.promise();
        }
        var u = sfmMm.getServiceUrl('stQuery') + 'getLayerList';
        ajax({
            type: 'GET',
            dataType: 'json',
            url: u,
            async: options && options.async !== false ? true : false,
            cache: false,
            success: function(data, textStatus, jqXHR) {
                var d = data && data.data;
                if (d) {
                    if (d.msg) {
                        _lldfd.reject(d.msg);
                    } else {
                        _layerList = d.getMe;
                        _lldfd.resolve(d.getMe);
                    }
                } else {
                    _lldfd.reject('获取图层列表失败');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                _lldfd.reject('获取图层列表失败,可能是网络原因');
            }
        });
        return _lldfd.promise();
    };

    var getLayerInfo = function(layerKey) {
        if (_layerList == null || _layerList.length == 0) {
            return null;
        }
        for (var i = 0; i < _layerList.length; i++) {
            var li = _layerList[i];
            if (li.key == layerKey) {
                return li;
            }
        }
        return null;
    };
    var getLayerGroup = function(layerKey) {
        var li = getLayerInfo(layerKey);
        if (li) {
            return li.group;
        }
        return null;
    };
    var getLayerName = function(layerKey) {
        var li = getLayerInfo(layerKey);
        if (li) {
            return li.name;
        }
        return null;
    };
    var getLayerKey = function(layerName, type) {
        if (_layerList == null || _layerList.length == 0) {
            return null;
        }
        var l = [];
        for (var i = 0; i < _layerList.length; i++) {
            var li = _layerList[i];
            if (li.group == layerName) {
                if (type) {
                    if (li.type == type) {
                        l.push(li.key);
                    }
                } else {
                    l.push(li.key);
                }
            }
        }
        return l;
    };

    var identify = function(options) {
        var u = sfmMm.getServiceUrl('stQuery') + 'identify';
        var d = {
            layers: options.layers,
            x: options.x,
            y: options.y,
            count: options.count || 1,
            radius: options.radius || 0.1
        };
        var dfd = $.Deferred();
        ajax({
            type: 'GET',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        }).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd);
                }
            } else {
                dfd.reject('查询数据失败');
            }
        }, function() {
            dfd.reject('查询数据失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var total = function(options, rtype) {
        var u = sfmMm.getServiceUrl('stQuery') + 'total';
        var d = {
            layers: options.layers
        };
        if (!rtype) {
            rtype = 'GET';
        }
        var p = {
            type: rtype,
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        if (rtype == 'GET') {
            d.pc = options.pc == null ? undefined : options.pc;
            d.sc = options.sc == null ? undefined : options.sc;
        } else if (rtype == 'POST') {
            d.propertyCondition = options.pc == null ? undefined : options.pc;
            d.spatialCondition = options.sc == null ? undefined : options.sc;
            p.data = JSON.stringify(d);
            p.contentType = 'application/json';
            p.processData = false;
        }
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd);
                }
            } else {
                dfd.reject('查询数据失败');
            }
        }, function() {
            dfd.reject('查询数据失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var query = function(options, rtype) {
        var u = sfmMm.getServiceUrl('stQuery') + 'query';
        var d = {
            layers: options.layers,
            fields: options.fields,
            order: options.order,
            pageNum: options.pageNum,
            pageSize: options.pageSize,
            startIndex: options.startIndex,
            endIndex: options.endIndex,
            returnGeomJson: options.returnGeomJson,
            returnGeomText: options.returnGeomText
        };
        if (!rtype) {
            rtype = 'GET';
        }
        var p = {
            type: rtype,
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        if (rtype == 'GET') {
            d.pc = options.pc == null ? undefined : options.pc;
            d.sc = options.sc == null ? undefined : options.sc;
        } else if (rtype == 'POST') {
            d.propertyCondition = options.pc == null ? undefined : options.pc;
            d.spatialCondition = options.sc == null ? undefined : options.sc;
            p.data = d;
            /*p.data = JSON.stringify(d);
            p.contentType = 'application/json';
            p.processData = false;*/
        }
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd);
                }
            } else {
                dfd.reject('查询数据失败');
            }
        }, function() {
            dfd.reject('查询数据失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var queryByField = function(layers, value, key) {
        return query({
            layers: layers,
            pc: key + ';=;' + value,
            pageSize: 1,
            pageNum: 0,
            returnGeomJson: 1,
            returnGeomText: 1
        });
    };
    var queryById = function(layers, id) {
        return query({
            layers: layers,
            pc: 'ST_ID;=;' + id,
            pageSize: 1,
            pageNum: 0,
            returnGeomJson: 1,
            returnGeomText: 1
        });
    };
    var queryByKey = function(layers, key) {
        return query({
            layers: layers,
            pc: 'ST_KEY;=;' + key,
            pageSize: 1,
            pageNum: 0,
            returnGeomJson: 1,
            returnGeomText: 1
        });
    };

    var getLayerFields = function(layer, async) {
        var u = sfmMm.getServiceUrl('stQuery') + 'fields';
        var a = async == undefined ? true : async;
        var dfd = $.Deferred();
        ajax({
            type: 'GET',
            dataType: 'json',
            url: u,
            data: {
                layer: layer
            },
            async: a,
            cache: false
        }).then(function(data) {
            var d = data && data.data;
            if (d) {
                if (d.msg) {
                    dfd.reject(msg);
                } else {
                    dfd.resolve(d.getMe);
                }
            } else {
                dfd.reject('查询图层字段失败');
            }
        }, function(msg) {
            dfd.reject('查询图层字段失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var getValueRange = function(layer, field, async) {
        var u = sfmMm.getServiceUrl('stQuery') + 'valueRange';
        var a = async == undefined ? true : async;
        var dfd = $.Deferred();
        ajax({
            type: 'GET',
            dataType: 'json',
            url: u,
            data: {
                layer: layer,
                field: field
            },
            async: a,
            cache: false
        }).then(function(data) {
            var d = data && data.data;
            if (d) {
                if (d.msg) {
                    dfd.reject(msg);
                } else {
                    dfd.resolve(d.getMe);
                }
            } else {
                dfd.reject('查询值域失败');
            }
        }, function(msg) {
            dfd.reject('查询值域失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var queryWantouAngle = function(layer, key, async) {
        var u = sfmMm.getServiceUrl('stQuery') + 'queryWantouAngle';
        var a = async == undefined ? true : async;
        var dfd = $.Deferred();
        ajax({
            type: 'GET',
            dataType: 'json',
            url: u,
            data: {
                layer: layer,
                key: key
            },
            async: a,
            cache: false
        }).then(function(data) {
            var d = data && data.data;
            if (d) {
                if (d.msg) {
                    dfd.reject(msg);
                } else {
                    dfd.resolve(d.getMe);
                }
            } else {
                dfd.reject('查询角度失败');
            }
        }, function(msg) {
            dfd.reject('查询角度失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var _stat = function(options, rtype, f) {
        var u = sfmMm.getServiceUrl('stStatistics') + f;
        var d = {
            layers: options.layers,
            fields: options.fields,
            order: options.order,
            group: options.group
        };
        if (!rtype) {
            rtype = 'GET';
        }
        var p = {
            type: rtype,
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        if (rtype == 'GET') {
            d.pc = options.pc;
            d.sc = options.sc;
        } else if (rtype == 'POST') {
            d.propertyCondition = options.pc;
            d.spatialCondition = options.sc;
            p.data = JSON.stringify(d);
            p.contentType = 'application/json';
            p.processData = false;
        }
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd);
                }
            } else {
                dfd.reject('统计数据失败');
            }
        }, function() {
            dfd.reject('统计数据失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var getAttrHtml = function(fields, attrs) {
        var h = '<div style="word-break:keep-all;white-space:nowrap;overflow:auto;' +
            'width:265px;height:310px;margin-top:25px;margin-bottom:25px">';
        h += '<table style="font-size:16px;background-color: #ffffff; color: #fffffe">';
        for (var i = 0; i < fields.length; i++) {
            var fi = fields[i];
            var t = attrs[fi.key];
            if (t == undefined) {
                continue;
            }
            t == undefined && (t = '');
            if (fi.key == 'ST_FLOWDIR') {
                if (Number(t) == 0) {
                    t = '从起点到终点';
                } else if (Number(t) == 1) {
                    t = '从终点到起点';
                } else if (Number(t) == 2) {
                    t = '双向';
                } else {
                    t = '未知';
                }
            } else if (fi.type == 'number' && t != '') {
                t = Number(t).toFixed(3);
            }
            h += '<tr><td width="100">&nbsp;&nbsp;&nbsp;&nbsp;';
            h += fi.name;
            h += '</td><td>&nbsp;&nbsp;&nbsp;&nbsp;';
            h += t;
            h += '</td></tr>';
        }
        if (attrs.GEOM_LENGTH) {
            h += '<tr><td width="100">&nbsp;&nbsp;&nbsp;&nbsp;长度</td><td>&nbsp;&nbsp;&nbsp;&nbsp;' +
                Number(attrs.GEOM_LENGTH).toFixed(2) + '</td></tr>';
        }
        h += '</table></div>';
        return h;
    };
    var getAttrHtml2 = function(fields, attr) {
        var h = '<div style="overflow:auto;width:100%;height:100%;margin:0px 0px 0px 0px;text-align:center;">' +
            '<table border="0" cellpadding="3" cellspacing="1" align="center" width="100%"' +
            ' style="font-size:16px;background-color: #b9d8f3;">';
        for (var i = 0; i < fields.length; i++) {
            var fi = fields[i];
            var t = attr[fi.key];
            if (t == undefined) {
                continue;
            }
            t == undefined && (t = '');
            if (fi.key == 'ST_FLOWDIR') {
                if (Number(t) == 0) {
                    t = '从起点到终点';
                } else if (Number(t) == 1) {
                    t = '从终点到起点';
                } else if (Number(t) == 2) {
                    t = '双向';
                } else {
                    t = '未知';
                }
            } else if (fi.type == 'number' && t != '') {
                t = Number(t).toFixed(3);
            }
            h += '<tr style="background-color:#f4faff;"><td>';
            h += fi.name;
            h += '</td><td>';
            h += t;
            h += '</td></tr>';
        }
        if (attr.GEOM_LENGTH) {
            h += '<tr style="background-color:#f4faff;"><td width="100">长度</td><td>' +
                Number(attr.GEOM_LENGTH).toFixed(2) + '</td></tr>';
        }
        h += '</table></div>';
        return h;
    };

    var exportCad = function(options, rtype) {
        var u = sfmMm.getServiceUrl('stQuery') + 'exportCad';
        var d = {
            layers: options.layers,
            fields: options.fields,
            order: options.order,
            pageNum: options.pageNum,
            pageSize: options.pageSize,
            startIndex: options.startIndex,
            endIndex: options.endIndex,
            returnGeomJson: options.returnGeomJson,
            returnGeomText: options.returnGeomText,
            mip: options.mip,
            sip: options.sip
        };
        if (!rtype) {
            rtype = 'GET';
        }
        var p = {
            type: rtype,
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        if (rtype == 'GET') {
            d.pc = options.pc == null ? undefined : options.pc;
            d.sc = options.sc == null ? undefined : options.sc;
        } else if (rtype == 'POST') {
            d.propertyCondition = options.pc == null ? undefined : options.pc;
            d.spatialCondition = options.sc == null ? undefined : options.sc;
            p.data = JSON.stringify(d);
            p.contentType = 'application/json';
            p.processData = false;
        }
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd.getMe && dd.getMe[0]);
                }
            } else {
                dfd.reject('导出CAD失败');
            }
        }, function() {
            dfd.reject('导出CAD失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var exportExcel = function(data, columns) {
        var xls = null;
        try {
            xls = new ActiveXObject("Excel.Application");
        } catch (e) {
            xls = WPSExcelHv();
        }
        if(!xls){
        	return;
        }
        try {
            xls.visible = true;
            var xlsBook = xls.Workbooks.Add;
            var xlsSheet = xlsBook.WorkSheets(1);

            for (var k = 0; k < columns.length; k++) {
                xlsSheet.Cells(1, k + 1).Value = columns[k];
            }
            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                for (var j = 0; j < r.length; j++) {
                    xlsSheet.Cells(i + 2, j + 1).Value = r[j];
                }
            }

            xls.UserControl = true;
        } catch (e) {
            alert('导出失败,' + e.message);
        }
    };
    var WPSExcelHv = function() {
        var xls = null;
        try {
            xls = new ActiveXObject("KET.Application");
        } catch (e) {
            xls = WPSExcelLv();
        }
        return xls;
    };
    var WPSExcelLv = function() {
        var xls = null;
        try {
            xls = new ActiveXObject("ET.Application");
        } catch (e) {
            // alert("导出WPS失败，确定是否安装了WPS");
            alert("无法启动Excel\n\n如果您确信您的电脑中已经安装了Excel, 那么请调整IE的安全级别\n" +
                "具体的操作：\n" +
                "工具 -> Internet选项 -> 安全 -> 自定义级别 -> 对没有标记为安全的ActiveX进行初始化和脚本运行 -> 启用");
            return;
        }
        return xls;
    };
    var anaDistance = function(options) {
        var u = sfmMm.getServiceUrl('stAnalysis');
        if (options.atype == 1) {
            u += 'hdistance';
        } else if (options.atype == 2) {
            u += 'vdistance';
        } else if (options.atype == 3) {
            u += 'hvdistance';
        }
        var d = {
            layer1: options.layer1,
            line1: options.line1,
            sc1: options.sc1,
            layer2: options.layer2,
            line2: options.line2,
            sc2: options.sc2
        };
        var p = {
            type: 'GET',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd.getMe);
                }
            } else {
                dfd.reject('净距分析失败');
            }
        }, function() {
            dfd.reject('净距分析失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var anaOneDistance = function(options) {
        var u = sfmMm.getServiceUrl('stAnalysis');
        u += 'distance';
        var d = {
            coors: options.coors,
            salt: options.salt,
            ealt: options.ealt,
            size: options.size,
            pipeCode: options.pipeCode,
            presure: options.presure,
            ltType: options.ltType,
            psvalue: options.psvalue,
            layer: options.layer,
            line: options.line,
            sc: options.sc
        };
        var p = {
            type: 'GET',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd.getMe);
                }
            } else {
                dfd.reject('净距分析失败');
            }
        }, function() {
            dfd.reject('净距分析失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var anaDepth = function(options) {
        var u = sfmMm.getServiceUrl('stAnalysis') + 'depth';
        var d = {
            layer: options.layer,
            line: options.line,
            sc: options.sc
        };
        var p = {
            type: 'GET',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd.getMe);
                }
            } else {
                dfd.reject('覆土分析失败');
            }
        }, function() {
            dfd.reject('覆土分析失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var transection = function(options) {
        var u = sfmMm.getServiceUrl('stAnalysis') + 'transection';
        var d = {
            layer: options.layer,
            line: options.line
        };
        var p = {
            type: 'GET',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd.getMe);
                }
            } else {
                dfd.reject('分析横断面失败');
            }
        }, function() {
            dfd.reject('分析横断面失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var verticalSec = function(options) {
        var u = sfmMm.getServiceUrl('stAnalysis') + 'verticalSec';
        var d = {
            layer: options.layer,
            keys: options.keys
        };
        var p = {
            type: 'GET',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd.getMe);
                }
            } else {
                dfd.reject('分析纵断面失败');
            }
        }, function() {
            dfd.reject('分析纵断面失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var anaPipeBurst = function(options) {
        var u = sfmMm.getServiceUrl('stAnalysis') + 'pipeBurst';
        var d = {
            layer: options.layer,
            key: options.key,
            type: options.type
        };
        var p = {
            type: 'GET',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd.getMe);
                }
            } else {
                dfd.reject('爆管分析失败');
            }
        }, function() {
            dfd.reject('爆管分析失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var anaPipeConnection = function(options) {
        var u = sfmMm.getServiceUrl('stAnalysis') + 'anaPipeConnection2';
        var p = {
            type: 'GET',
            dataType: 'json',
            url: u,
            data: options,
            async: true,
            cache: false
        };
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg != '0' && dd.msg != '1') {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve({
                        msg: dd.msg,
                        getMe: dd.getMe
                    });
                }
            } else {
                dfd.reject('连通分析失败');
            }
        }, function() {
            dfd.reject('连通分析失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var calcArea = function(options) {
        var u = sfmMm.getServiceUrl('stAnalysis') + 'calcArea';
        var d = {
            type: options.type,
            coordinates: options.coordinates,
            radius: options.radius,
            endcap: options.endcap
        };
        var p = {
            type: 'GET',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd.getMe);
                }
            } else {
                dfd.reject('计算面积失败');
            }
        }, function() {
            dfd.reject('计算面积失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var calcVolume = function(options) {
        var u = sfmMm.getServiceUrl('stAnalysis') + 'calcVolume';
        var d = {
            type: options.type,
            coordinates: options.coordinates,
            radius: options.radius,
            endcap: options.endcap,
            height: options.height
        };
        var p = {
            type: 'GET',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        };
        var dfd = $.Deferred();
        ajax(p).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd.getMe);
                }
            } else {
                dfd.reject('计算体积失败');
            }
        }, function() {
            dfd.reject('计算体积失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var getDaily = function(name) {
        var _getCookie = function(name) {
            var regKey = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
            var arr = document.cookie.match(regKey);
            if (arr) {
                return unescape(arr[2]);
            } else {
                return null;
            }
        };
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var dates = date.getDate();
        var t = date.toTimeString();
        var time = t.substring(0, t.indexOf('GMT'));
        var d1 = year + '/' + month + '/' + dates;
        var userName = _getCookie('userName');
        var dailyType = name.getDailyName();
        var daily = new Array(time, userName, dailyType, d1);
        return daily;
    };

    var insertDaily = function(daily) {
        var u = sfmMm.getServiceUrl('stOms') + 'method=saveDailyinfo';
        var d = {
            username: daily[1],
            daily: daily[2]

        };
        var dfd = $.Deferred();
        ajax({
            type: 'POST',
            dataType: 'json',
            url: u,
            data: d,
            async: true,
            cache: false
        }).then(function(data) {
            var dd = data && data.data;
            if (dd) {
                if (dd.msg) {
                    dfd.reject(dd.msg);
                } else {
                    dfd.resolve(dd);
                }
            } else {
                dfd.reject('查询数据失败');
            }
        }, function() {
            dfd.reject('查询数据失败,可能是网络原因');
        });
        return dfd.promise();
    };

    var PageHelper = function(options) {
        if (!(this instanceof PageHelper)) {
            return new PageHelper();
        }
        this.initialize(options);
    };
    PageHelper.prototype = {
        initialize: function(options) {
            var me = this;
            me.data = {};
            var ps = options && options.pageSize;
            me.data.pageSize = ps > 0 ? ps : 10;
            me.data.totalIndex = null;
            me.data.pageIndex = null;
            me.data.dfdTt = $.Deferred();
            if (options) {
                me.data.onQueryResult = options.onQueryResult;
                me.data.onQueryFault = options.onQueryFault;
                me.data.onQueryAll = options.onQueryAll;
            }
        },
        setQueryParam: function(options, rtype) {
            this.data.options = options;
            this.data.rtype = rtype;
            this.data.totalIndex = null;
            this.data.total = 0;
            return this;
        },
        pageQuery: function(pageNum, pageSize) {
            var me = this;
            if (pageSize > 0) {
                me.data.pageSize = pageSize;
                me.data.totalIndex = null;
            }
            me.__getTotalIndex__(me.data.options, me.data.rtype).then(function(data) {
                me._pageQuery(me.data.options, me.data.rtype, pageNum);
            }, function(msg) {
                var cb = me.data.onQueryFault;
                if (typeof cb == 'function') {
                    cb.apply(me, [msg]);
                }
            });
            return me;
        },
        __total__: function(options, rtype) {
            return total(options, rtype);
        },
        __query__: function(options, rtype) {
            return query(options, rtype);
        },
        __getTotalIndex__: function(options, rtype) {
            var me = this;
            var dfd = me.data.dfdTt;
            if (me.data.totalIndex) {
                return dfd.promise();
            }
            dfd = me.data.dfdTt = $.Deferred();
            me.__total__(options, rtype).then(function(data) {
                me.data.totalIndex = data.getMe;
                dfd.resolve(data);
            }, function(msg) {
                dfd.reject(msg);
            });
            return dfd.promise();
        },
        __getPageIndex__: function(pageNum) {
            var me = this;
            var pn = pageNum > -1 ? pageNum : 0;
            var ps = me.data.pageSize;
            var si = pn * ps;
            var ei = (pn + 1) * ps;
            var tt = me.data.totalIndex;
            var pl = [];
            var c = 0;
            var cc = 0;
            var i = 0
            for (; i < tt.length; i++) {
                var ti = tt[i];
                try {
                    var ci = ti.total;
                    if (ci == 0) {
                        continue;
                    }
                    var lc = c;
                    var csi = 0;
                    var cei = 0;
                    c += ci;
                    cc += ci;
                    if (c > si) {
                        csi = si - lc;
                        csi = csi < 0 ? 0 : csi;
                        var pi = {
                            key: ti.key,
                            total: ci,
                            si: csi
                        };
                        pl.push(pi);
                        if (c <= ei) {
                            cei = ci;
                            pi.ei = cei;
                        } else {
                            cei = ei - lc;
                            cei = cei < ci ? cei : ci;
                            pi.ei = cei;
                            i++;
                            break;
                        }
                    }
                    /*if(c > si && c <= ei){
                    	csi = si - lc;
                    	csi = csi < 0 ? 0 : csi;
                    	cei = ci;
                    	pl.push({
                    		key: ti.key,
                    		total: ci,
                    		si: csi,
                    		ei: cei
                    	});
                    }else if(c > ei){
                    	csi = si - lc;
                    	csi = csi < 0 ? 0 : csi;
                    	cei = ei - lc;
                    	cei = cei < ci ? cei : ci;
                    	pl.push({
                    		key: ti.key,
                    		total: ci,
                    		si: csi,
                    		ei: cei
                    	});
                    	break;
                    }*/
                } catch (e) {
                    continue;
                }
            }
            for (; i < tt.length; i++) {
                cc += tt[i].total;
            }
            me.data.total = cc;

            return pl;
        },
        _pageQuery: function(options, rtype, pageNum) {
            var me = this;
            var pi = me.__getPageIndex__(pageNum);
            var ps = me.data.pageSize;
            var c = 0;
            var cb1 = me.data.onQueryResult;
            var cb0 = me.data.onQueryFault;
            var cb = me.data.onQueryAll;
            var r = [];
            if (pi.length == 0) {
                if (typeof cb == 'function') {
                    cb.apply(me, [r, 0, pageNum]);
                    alert("无查询数据!");
                }
            }
            for (var i = 0; i < pi.length; i++) {
                var pii = pi[i];
                var o = $.extend({}, options, {
                    layers: pii.key,
                    startIndex: pii.si,
                    endIndex: pii.ei
                });
                me.__query__(o, rtype).then(function(data) {
                    r = r.concat(data.getMe);
                    if (typeof cb1 == 'function') {
                        cb1.apply(me, [data, me.data.total, pageNum]);
                    }
                }, function(msg) {
                    if (typeof cb0 == 'function') {
                        cb0.apply(me, [msg, me.data.total, pageNum]);
                    }
                }).always(function() {
                    c++;
                    if (c == pi.length) {
                        if (typeof cb == 'function') {
                            cb.apply(me, [r, me.data.total, pageNum]);
                        }
                    }
                });
            }
        },
        destroy: function() {}
    };

    if (!ctx.SFM) {
        ctx.SFM = {};
    }
    ctx.SFM.reqHelper = {
        TYPE_LINE: TYPE_LINE,
        TYPE_POINT: TYPE_POINT,
        TYPE_POLYGON: TYPE_POLYGON,

        getInfo: getInfo,
        saveInfo: saveInfo,

        updateCurrnetPorject: updateCurrnetPorject,
        getLayerKeyMap: getLayerKeyMap,
        getLayerList: getLayerList,
        getLayerInfo: getLayerInfo,
        getLayerGroup: getLayerGroup,
        getLayerName: getLayerName,
        getLayerKey: getLayerKey,
        identify: identify,
        getDaily: getDaily,
        insertDaily: insertDaily,
        query: query,
        queryByField: queryByField,
        queryById: queryById,
        queryByKey: queryByKey,
        getLayerFields: getLayerFields,
        getValueRange: getValueRange,
        queryWantouAngle: queryWantouAngle,

        stat: function(options, rtype) {
            return _stat(options, rtype, 'stat');
        },
        statSection: function(options, rtype) {
            return _stat(options, rtype, 'statSection');
        },

        /*getSysBalloonAlpha: function(){
        	var ba = (window.SYSTEMPARAMS || parent.SYSTEMPARAMS || top.SYSTEMPARAMS).balloonAlpha;
        	if(ba != undefined && !isNaN(ba)){
        		ba = parseInt(ba);
        	}else{
        		ba = 0xcc;
        	}
        	return ba;
        },
        getAttrHtml: function(fields, attr){
        	var ba = this.getSysBalloonAlpha();
        	return ba < 0 ? getAttrHtml2(fields, attr) : getAttrHtml(fields, attr);
        },*/


        getAttrHtml: getAttrHtml,
        getAttrHtml2: getAttrHtml2,

        exportCad: exportCad,
        exportExcel: exportExcel,

        anaDistance: anaDistance,
        anaOneDistance: anaOneDistance,
        anaDepth: anaDepth,
        transection: transection,
        verticalSec: verticalSec,
        anaPipeBurst: anaPipeBurst,
        anaPipeConnection: anaPipeConnection,
        calcArea: calcArea,
        calcVolume: calcVolume,

        PageHelper: PageHelper
    };
})(window, jQuery, window.opt);
