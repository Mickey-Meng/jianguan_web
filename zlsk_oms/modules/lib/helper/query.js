var queryObj = {
    showLayerList: function(obj, method, options,datas) {
        var layerList = [];
        SFM.reqHelper.getLayerList(options).then(function(data) {
            for (var i = 0; i < data.length; i++) {
                var flag = false;
                for (var j = 0; j < layerList.length; j++) {
                    if (layerList[j].group == data[i].group) {
                        flag = true;
                    }
                }
                if (!flag && (data[i].type == 'line' || data[i].type == 'point')) {
                    //layerList.push(data[i]);
                    if($.inArray( data[i].group,datas ) >= 0){
                         layerList.push(data[i]);
                    }
                }
            }
            for (var i = 0; i < layerList.length; i++) {
                var layerStr = '';
                var pipeLineLayer = layerList[i];

                layerStr = '<div style="width:100px;overflow: auto;">' +
                    '<input type="checkbox" id="' + pipeLineLayer.key + '" value="' + pipeLineLayer.key +
                    '" data-gp="' + pipeLineLayer.group + '" />' +
                    '<label for="' + pipeLineLayer.key + '">' + pipeLineLayer.group + '</label>' +
                    '</div>';
                obj.append(layerStr);
            }
            method && method();
        });
    },
    showLayerListSelect: function(obj, datas, method, options) {
        var layerList = [];
        SFM.reqHelper.getLayerList().then(function(data) {
            if(options && options.before){
                for(var i = 0;i < options.before.length;i++){
                    layerList.push(options.before[i]);
                }
            }
            for (var i = 0; i < data.length; i++) {
                var flag = false;
                for (var j = 0; j < layerList.length; j++) {
                    if (layerList[j].name == data[i].name) {
                        flag = true;
                    }
                }
                if (!flag && (data[i].type == 'line' || data[i].type == 'point')) {
                    if($.inArray( data[i].group,datas ) >= 0){
                         layerList.push(data[i]);
                    }

                }
            }
            if(options && options.after){
                for(var i = 0;i < options.after.length;i++){
                    layerList.push(options.after[i]);
                }
            }
            var layerStr = '';
            for (var i = 0; i < layerList.length; i++) {
                var pipeLineLayer = layerList[i];
                layerStr += '<option id="' + pipeLineLayer.key + '" value="' + pipeLineLayer.key + '" data-type="'+pipeLineLayer.type+'">' + pipeLineLayer.name + '</option>';
            }
            obj.html(layerStr);
            method && method();
        });
    },
    showLayerLineList: function(obj, method,options,datas) {
        var layerList = [];
        SFM.reqHelper.getLayerList(options).then(function(data) {
            for (var i = 0; i < data.length; i++) {
                var flag = false;
                for (var j = 0; j < layerList.length; j++) {
                    if (layerList[j].group == data[i].group) {
                        flag = true;
                    }
                }
                if (!flag && data[i].type == 'line') {
                    //layerList.push(data[i]);
                    if($.inArray( data[i].group,datas ) >= 0){
                         layerList.push(data[i]);
                    }
                }
            }
            for (var i = 0; i < layerList.length; i++) {
                var layerStr = '';
                var pipeLineLayer = layerList[i];
                layerStr = '<div style="width:100px;overflow: auto;">' +
                    '<input type="checkbox" id="' + pipeLineLayer.key + '" value="' + pipeLineLayer.key + '" />' +
                    '<label for="' + pipeLineLayer.key + '">' + pipeLineLayer.group + '</label>' +
                    '</div>';
                obj.append(layerStr);
            }
            method && method();
        });
    },
     showLayerSelect: function(obj, method) {
        var layerList = [];
        SFM.reqHelper.getLayerList().then(function(data) {
            for (var i = 0; i < data.length; i++) {
                var flag = false;
                for (var j = 0; j < layerList.length; j++) {
                    if (layerList[j].group == data[i].group) {
                        flag = true;
                    }
                }
                if (!flag && (data[i].type == 'line' || data[i].type == 'point')) {
                    layerList.push(data[i]);
                }
            }
            var layerStr = '';
            for (var i = 0; i < layerList.length; i++) {
                var pipeLineLayer = layerList[i];
                layerStr += '<option id="' + pipeLineLayer.key + '" value="' + pipeLineLayer.key + '">' + pipeLineLayer.group + '</option>';
            }
            obj.html(layerStr);
            method && method();
        });
    },
    getStandardName: function(fieldName, pipeType, returnStandardName) {
        if (fieldName === "" || fieldName === undefined) {
            return;
        }
        if (pipeType === "" || pipeType === undefined) {
            return;
        }
        var configXML = loadXMLStr(pRes.AttributeName);
        var lineData;
        if (pipeType === 1 || pipeType === "1") {
            lineData = configXML.getElementsByTagName("LineFieldInfo")[0] ? configXML.getElementsByTagName("LineFieldInfo")[0].getElementsByTagName("SystemFieldList")[0] : null;
        } else if (pipeType === 0 || pipeType === "0") {
            lineData = configXML.getElementsByTagName("PointFieldInfo")[0] ? configXML.getElementsByTagName("PointFieldInfo")[0].getElementsByTagName("SystemFieldList")[0] : null;
        }
        if (lineData && lineData.childNodes.length) {
            for (var i = lineData.childNodes.length - 1; i >= 0; i--) {
                var item = lineData.childNodes[i];
                if (item.getAttribute("FieldName").toUpperCase() == fieldName.toUpperCase()) {
                    if (returnStandardName) {
                        return item.getAttribute("StandardName").toUpperCase();
                    } else {
                        return item.getAttribute("CaptionName");
                    }
                }
            };
        }
    },
    sortNumber: function(a, b) {
        return a - b;
    },
    showRangeList: function(container, rangeList) {
        container.html("");
        var htmlStr = '<table style="width:100%;" cellspacing="1">';
        container.append();
        for (var k = 0; k < rangeList.length; k++) {
            htmlStr = htmlStr + '<tr><td style="text-align:left; cursor:default;" onclick="queryObj.selectSingleRow(this)">' + rangeList[k] + '</td></tr>';
        }
        htmlStr = htmlStr + '</table>';
        container.html(htmlStr);
    },
    selectSingleRow: function(obj) {
        var trObj = obj.parentNode;
        var tableObj = trObj.parentNode;
        for (var i = 0; i < tableObj.rows.length; i++) {
            tableObj.rows[i].style.color = "#000000";
            tableObj.rows[i].style.backgroundColor = "transparent";
        }
        trObj.style.color = "#ffffff";
        trObj.style.backgroundColor = "#316ac5";
        tableObj.parentNode.selectIndex = trObj.rowIndex;
    },
    appendStatisticsRangeRow: function(downValue, upValue, container) {
        var htmlStr = '<tr>';
        htmlStr = htmlStr + '<td class="downLimitTd" onclick="ectx.StatisticsMgr.selectSingleRow(this)" ondblclick="ectx.StatisticsMgr.editSingleCell(this)">' + downValue + '</td>';
        htmlStr = htmlStr + '<td class="upLimitTd" onclick="ectx.StatisticsMgr.selectSingleRow(this)" ondblclick="ectx.StatisticsMgr.editSingleCell(this)">' + upValue + '</td>';
        htmlStr = htmlStr + '</tr>';
        container.append(htmlStr);
    },
    showClassificationResult4: function(classResList, container, columnNum) {
        var tdCss = "border-right: 1px double #ACA899;border-bottom: 1px double #ACA899;overflow: auto;";
        var htmlStr = '<table id="exportTab" style="width: 100%;" cellspacing="0" >';
        for (var i = 0; i < classResList.length; i++) {
            var classLayer = classResList[i];
            if (classLayer.dataList.length > 1) {
                for (var k = 0; k < classLayer.dataList.length; k++) {
                    var dataObj = classLayer.dataList[k];
                    htmlStr = htmlStr + '<tr>';
                    if (k == 0 && dataObj["layerName"]) {
                        htmlStr = htmlStr + '<td rowspan="' + (classLayer.dataList.length - 1) + '" style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj["layerName"] + '</td>';
                        k++;
                        dataObj = classLayer.dataList[k];
                        if (!dataObj.dataType) {
                            dataObj.dataType = '';
                        }
                        for (var attr in dataObj) {
                            htmlStr = htmlStr + '<td style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj[attr] + '</td>';
                        }
                    } else {
                        if (!dataObj.dataType) {
                            dataObj.dataType = '';
                        }
                        for (var attr in dataObj) {

                            htmlStr = htmlStr + '<td style="' + tdCss + '" align="center" width="' + 100 / (columnNum + 1) + '%">' + dataObj[attr] + '</td>';
                        }
                    }
                    htmlStr = htmlStr + '</tr>';
                }
            }
        }
        htmlStr = htmlStr + '</table>';
        container.html(htmlStr);
    },
    addSelectAllEvent: function(btnObj, callback, resBtn) {
        btnObj.click(function() {
            resBtn.prop("checked", true);
            if (callback != null) {
                callback();
            }
        });
    },
    addInvSelectEvent: function(btnObj, callback, resBtn) {
        btnObj.click(function() {
            resBtn.each(function() {
                $(this).prop("checked", !$(this).prop("checked"));
            });

            if (callback != null) {
                callback();
            }
        });
    },
    addClearSelectEvent: function(btnObj, callback, resBtn) {
        btnObj.click(function() {
            resBtn.prop("checked", false);
            if (callback != null) {
                callback();
            }
        });
    },
    importExcelByTable: function(tabObj, columns) {
        var xls = null;
        try {
            xls = new ActiveXObject("Excel.Application");
        } catch (e) {
            xls = this.WPSExcelHv();
        }
        try {
            xls.visible = true;
            var xlsBook = xls.Workbooks.Add;
            var xlsSheet = xlsBook.WorkSheets(1);

            for (var k = 0; k < columns.length; k++) {
                xlsSheet.Cells(1, k + 1).Value = columns[k];
            }

            var rowList = tabObj.rows;
            for (var i = 0; i < rowList.length; i++) {
                var cellList = rowList[i].cells;
                for (var j = 0; j < cellList.length; j++) {
                    xlsSheet.Cells(i + 2, j + 1).Value = cellList[j].innerHTML;
                }
            }

            xls.UserControl = true;
        } catch (err) {
            //alert("出现一个异常:" + err.message);
        }
    },
     WPSExcelHv:function() {
        var xls = null;
        try {
            xls = new ActiveXObject("KET.Application");
        } catch (e) {
           xls = this.WPSExcelLv();
        }
        return xls;
    },
    WPSExcelLv:function() {
        var xls = null;
        try {
            xls = new ActiveXObject("ET.Application");
        } catch (e) {
            alert("无法启动Excel\n\n如果您确信您的电脑中已经安装了Excel, 那么请调整IE的安全级别\n" +
                "具体的操作：\n" +
                "工具 -> Internet选项 -> 安全 -> 自定义级别 -> 对没有标记为安全的ActiveX进行初始化和脚本运行 -> 启用");
          return;
        }
        return xls;
    }

};
