var DisplayModes = earthCtx.DisplayModes = {};
var tuliShow = "";
(function() {
    /**
     * 材质显示
     */
    var fColor = "materialShowing";
    var materialShowing = function() {
        return materialShowing2();
        tuliShow = "cz";
        var toolItem = $("div[tag=ViewMaterialShowing]");
        if (!toolItem.hasClass("selected")) {
            for (var i = 0; i < PIPELINELAYERS.length; i++) {
                earth.LayerManager.ResetMaterial(PIPELINELAYERS[i].id);
            }
            toolItem.addClass("selected");
            $("div[tag=ViewStandardColorShowing]").removeClass("selected");
            $("div[tag=ViewCustomColorShowing]").removeClass("selected");
            //$("div[tag=ViewLegendShowing]").customAttr("disabled","disabled");
        }
        //$("div[tag=ViewLegendShowing]").customAttr("disabled","disabled");
    };
    var materialShowing2 = function() {
        tuliShow = "cz";
        for (var i = 0; i < PIPELINELAYERS.length; i++) {
            earth.LayerManager.ResetMaterial(PIPELINELAYERS[i].id);
        }
    };
    /**
     * 自定义颜色显示
     */
    var pipeRecordsArrayList = [];
    var customColorShowing = function() {
        return customColorShowing2();
        tuliShow = "zdy";
        for (var i = 0; i < PIPELINELAYERS.length; i++) {
            //var customColor =  parseInt("0x"+PIPELINELAYERS[i].customColor);
            var customColor = PIPELINELAYERS[i].customColor;
            var id = PIPELINELAYERS[i].id;
            /*var color = "ff" + customColor;
             color = parseInt(color,16);*/
            earth.LayerManager.SetColor(id, customColor);
            pipeRecordsArrayList.push(id.toString() + "," + customColor)
        }
        var toolItem = $("div[tag=ViewCustomColorShowing]");
        toolItem.addClass("selected");
        $("div[tag=ViewMaterialShowing]").removeClass("selected");
        $("div[tag=ViewStandardColorShowing]").removeClass("selected");
        $("div[tag=ViewLegendShowing]").removeAttr("disabled");
    };
    var customColorShowing2 = function() {
        tuliShow = "zdy";
        for (var i = 0; i < PIPELINELAYERS.length; i++) {
            //var customColor =  parseInt("0x"+PIPELINELAYERS[i].customColor);
            var customColor = PIPELINELAYERS[i].customColor;
            var id = PIPELINELAYERS[i].id;
            /*var color = "ff" + customColor;
             color = parseInt(color,16);*/
            earth.LayerManager.SetColor(id, customColor);
            pipeRecordsArrayList.push(id.toString() + "," + customColor)
        }
    };
    /**
     *标准色显示
     */
    var standardColorShowing = function() {
        return standardColorShowing2();
        tuliShow = "bzs";
        var toolItem = $("div[tag=ViewStandardColorShowing]");
        if (!toolItem.hasClass("selected")) {
            var rootPath = getRootPath();
            for (var i = 0; i < PIPELINELAYERS.length; i++) {
                var plType = PIPELINELAYERS[i].pltype;
                //[1-2,FF0000][2-3,00ff00][3-4,0000ff][4-5,cc9900] [5-6,ff00ff] 【6-7.0099cc】[7-8,000000]
                /* var url="http://" + rootPath + "/image/PipeMaterial/Standard/" + plType + ".jpg"
                earth.LayerManager.SetMaterial(PIPELINELAYERS[i].id,url);*/
                var color = 0;
                if (plType >= 1000 && plType < 2000) {
                    //color = parseInt("0xcc" + "FF0000");
                    color = parseInt("0xcc" + fromArgb(255, 255, 0, 0)); //电力

                } else if (plType >= 2000 && plType < 3000) {
                    //color = parseInt("0xcc" + "00ff00");
                    color = parseInt("0xcc" + fromArgb(255, 0, 255, 0)); //电信
                } else if (plType >= 3000 && plType < 4000) {
                    //color = parseInt("0xcc" + "0000ff");
                    color = parseInt("0xcc" + fromArgb(255, 0, 255, 255)); //给水
                } else if (plType >= 4000 && plType < 5000) {
                    //color = parseInt("0xcc" + "cc9900");
                    color = parseInt("0xcc" + fromArgb(255, 127, 0, 0)); //排水
                } else if (plType >= 5000 && plType < 6000) {
                    //color = parseInt("0xcc" + "ff00ff");
                    color = parseInt("0xcc" + fromArgb(255, 255, 0, 255)); //燃气
                } else if (plType >= 6000 && plType < 7000) {
                    //color = parseInt("0xcc" + "0099cc");
                    color = parseInt("0xcc" + fromArgb(255, 255, 102, 0)); //热力
                } else if (plType >= 7000 && plType < 8000) {
                    //color = parseInt("0xcc" + "000000");
                    color = parseInt("0xcc" + fromArgb(255, 0, 0, 0)); //工业
                } else if (plType >= 8000) {
                    color = parseInt("0xcc" + fromArgb(255, 0, 127, 127)); //其他
                }
                earth.LayerManager.SetColor(PIPELINELAYERS[i].id, color);
            }
            toolItem.addClass("selected");
            $("div[tag=ViewMaterialShowing]").removeClass("selected");
            $("div[tag=ViewCustomColorShowing]").removeClass("selected");

        }
        $("div[tag=ViewLegendShowing]").removeAttr("disabled");
    };
    var standardColorShowing2 = function() {
        tuliShow = "bzs";
        var rootPath = getRootPath();
        for (var i = 0; i < PIPELINELAYERS.length; i++) {
            var plType = PIPELINELAYERS[i].pltype;
            //[1-2,FF0000][2-3,00ff00][3-4,0000ff][4-5,cc9900] [5-6,ff00ff] 【6-7.0099cc】[7-8,000000]
            /* var url="http://" + rootPath + "/image/PipeMaterial/Standard/" + plType + ".jpg"
            earth.LayerManager.SetMaterial(PIPELINELAYERS[i].id,url);*/
            var color = 0;
            if (plType >= 1000 && plType < 2000) {
                //color = parseInt("0xcc" + "FF0000");
                color = parseInt("0xcc" + fromArgb(255, 255, 0, 0)); //电力

            } else if (plType >= 2000 && plType < 3000) {
                //color = parseInt("0xcc" + "00ff00");
                color = parseInt("0xcc" + fromArgb(255, 0, 255, 0)); //电信
            } else if (plType >= 3000 && plType < 4000) {
                //color = parseInt("0xcc" + "0000ff");
                color = parseInt("0xcc" + fromArgb(255, 0, 255, 255)); //给水
            } else if (plType >= 4000 && plType < 5000) {
                //color = parseInt("0xcc" + "cc9900");
                color = parseInt("0xcc" + fromArgb(255, 127, 0, 0)); //排水
            } else if (plType >= 5000 && plType < 6000) {
                //color = parseInt("0xcc" + "ff00ff");
                color = parseInt("0xcc" + fromArgb(255, 255, 0, 255)); //燃气
            } else if (plType >= 6000 && plType < 7000) {
                //color = parseInt("0xcc" + "0099cc");
                color = parseInt("0xcc" + fromArgb(255, 255, 102, 0)); //热力
            } else if (plType >= 7000 && plType < 8000) {
                //color = parseInt("0xcc" + "000000");
                color = parseInt("0xcc" + fromArgb(255, 0, 0, 0)); //工业
            } else if (plType >= 8000) {
                color = parseInt("0xcc" + fromArgb(255, 0, 127, 127)); //其他
            }
            earth.LayerManager.SetColor(PIPELINELAYERS[i].id, color);
        }
    };

    function fromArgb(a, r, g, b) {
        // red: 'ffff0000'
        var rgb = r + "," + g + "," + b;
        var rbgtohex = rgbsToHex(rgb);
        return rbgtohex;
    };

    function rgbsToHex(rgbArgument) {
        var result = rgbArgument.split(",");
        var R = result[0];
        var G = result[1];
        var B = result[2];
        var n = Math.round(B);
        n += Math.round(G) << 8;
        n += Math.round(R) << 16;
        var i = 0;
        var j = 20;
        var str = "";
        while (j >= 0) {
            i = (n >> j) % 16;
            if (i >= 10) {
                if (i == 10) str += "A";
                else if (i == 11) str += "B";
                else if (i == 12) str += "C";
                else if (i == 13) str += "D";
                else if (i == 14) str += "E";
                else str += "F";
            } else {
                str += i;
            }
            j -= 4;
        }
        return str;
    };

    function RGBToHex(rgb) {
        var regexp = /^rgb\(([0-9]{0,3})\,\s([0-9]{0,3})\,\s([0-9]{0,3})\)/g;
        var re = rgb.replace(regexp, "$1 $2 $3").split(" "); //利用正则表达式去掉多余的部分
        var hexColor = "#";
        var hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        for (var i = 0; i < 3; i++) {
            var r = null;
            var c = re[i];
            var hexAr = [];
            while (c > 16) {
                r = c % 16;
                c = (c / 16) >> 0;
                hexAr.push(hex[r]);
            }
            hexAr.push(hex[c]);
            hexColor += hexAr.reverse().join('');
        }
        alert(hexColor)
        return hexColor;
    }

    function getRootPath() {
        var pathName = window.document.location.pathname;
        var localhost = window.location.host;
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhost + projectName);
    }

    function toHex(num) {

        var rs = "";
        var temp;
        while (num / 16 > 0) {
            temp = num % 16;
            rs = (temp + "").replace("10", "a").replace("11", "b").replace("12", "c").replace("13", "d").replace("14", "e").replace("15", "f") + rs;
            num = parseInt(num / 16);
        }
        return rs;
    }
    var legendHtmlBalloons = null;

    function legendShow(htmlStr, Height) {
        clearLegendHtmlBalloon();
        var height = (parseInt(Height / 2)) * 25 + 160;
        /*  var x=1000;//screen.availWidth-300;
        var y=600;//screen.availHeight-270;*/
        var x = window.document.body.offsetWidth;
        var y = window.document.body.offsetHeight - 114;
        var guid = earth.Factory.CreateGuid();
        legendHtmlBalloons = earth.Factory.CreateHtmlBalloon(guid, "balloon");
        legendHtmlBalloons.SetScreenLocation(x, y);

        legendHtmlBalloons.SetRectSize(430, height);
        legendHtmlBalloons.SetIsAddCloseButton(true);
        legendHtmlBalloons.SetIsAddMargin(true);
        if (params.product != "jiaoda") {
            legendHtmlBalloons.SetIsAddBackgroundImage(true);
            legendHtmlBalloons.SetIsTransparence(false); //控制样式 和是否允许移动
        }

        legendHtmlBalloons.ShowHtml(htmlStr);
        /*earth.Event.OnHtmlBalloonFinished = function(id){
            if(guid==id){
                if(legendHtmlBalloons!=null){
                    legendHtmlBalloons.DestroyObject();
                    legendHtmlBalloons=null;
                }
            }
        };*/
    }

    function legendShow1(htmlStr, Height) {
        clearLegendHtmlBalloon();
        var height = (parseInt(Height / 2)) * 25 + 160;
        /*  var x=1000;//screen.availWidth-300;
        var y=600;//screen.availHeight-270;*/
        var x = window.document.body.offsetWidth;
        var y = window.document.body.offsetHeight - 114;
        var guid = earth.Factory.CreateGuid();
        legendHtmlBalloons = earth.Factory.CreateHtmlBalloon(guid, "图例");
        legendHtmlBalloons.SetScreenLocation(x, y);

        legendHtmlBalloons.SetRectSize(430, height);
        legendHtmlBalloons.SetIsAddCloseButton(true);
        legendHtmlBalloons.SetIsAddMargin(true);
        legendHtmlBalloons.SetIsAddBackgroundImage(false);
        legendHtmlBalloons.SetIsTransparence(false); //控制样式 和是否允许移动

        legendHtmlBalloons.ShowHtml(htmlStr);
        /*earth.Event.OnHtmlBalloonFinished = function(id){
            if(guid==id){
                if(legendHtmlBalloons!=null){
                    legendHtmlBalloons.DestroyObject();
                    legendHtmlBalloons=null;
                }
            }
        };*/
    }
    var clearLegendHtmlBalloon = function() {
        if (legendHtmlBalloons != null) {
            legendHtmlBalloons.DestroyObject();
            legendHtmlBalloons = null;
        }
    }

    var getPipeListByLayer = function(layer) {
        var pipelineArr = [];
        var count = layer.GetChildCount();
        for (var i = 0; i < count; i++) {
            var childLayer = layer.GetChildAt(i);
            var layerType = childLayer.LayerType;
            if (layerType === "Pipeline") {
                var pipelineId = childLayer.Guid;
                var pipelineName = childLayer.Name;
                var pipelineServer = childLayer.GISServer;
                pipelineArr.push({
                    id: pipelineId,
                    name: pipelineName,
                    server: pipelineServer,
                    LayerType: layerType
                });
            } else {
                var childCount = childLayer.GetChildCount();
                if (childCount > 0) {
                    var childPipelineArr = getPipeListByLayer(childLayer);
                    for (var k = 0; k < childPipelineArr.length; k++) {
                        pipelineArr.push(childPipelineArr[k]);
                    }
                }
            }
        }
        return pipelineArr;
    }

    var legendShowing = function(buttonObj) {
        var toolItem = ""; //标准色
        var customColor = ""; //自定义颜色
        var material = "";
        toolItem = $("div[tag=ViewStandardColorShowing]"); //标准色
        customColor = $("div[tag=ViewCustomColorShowing]"); //自定义颜色
        material = $("div[tag=ViewMaterialShowing]");
        if (toolItem.hasClass("selected") || tuliShow === "bzs") {
            var temp = "<div id='content' style='padding: 20px;background:#eef5fd;height: 150px;overflow: auto;'>";
            temp += "<div style='float: left;'>";
            temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
            temp += "<span style='width:60px;height:20px;background-color:#" + fromArgb(255, 255, 0, 0) + ";'></span>";
            temp += "电力";
            temp += "</div>";
            temp += "</div>";
            //电信
            temp += "<div style='float: left;'>";
            temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
            temp += "<span style='width:60px;height:20px;background-color:#" + fromArgb(255, 0, 255, 0) + ";'></span>";
            temp += "电信";
            temp += "</div>";
            temp += "</div>";
            //给水
            temp += "<div style='float: left;'>";
            temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
            temp += "<span style='width:60px;height:20px;background-color:#" + fromArgb(255, 0, 255, 255) + ";'></span>";
            temp += "给水";
            temp += "</div>";
            temp += "</div>";
            //排水
            temp += "<div style='float: left;'>";
            temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
            temp += "<span style='width:60px;height:20px;background-color:#" + fromArgb(255, 127, 0, 0) + ";'></span>";
            temp += "排水";
            temp += "</div>";
            temp += "</div>";
            //燃气
            temp += "<div style='float: left;'>";
            temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
            temp += "<span style='width:60px;height:20px;background-color:#" + fromArgb(255, 255, 0, 255) + ";'></span>";
            temp += "燃气";
            temp += "</div>";
            temp += "</div>";
            //热力
            temp += "<div style='float: left;'>";
            temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
            temp += "<span style='width:60px;height:20px;background-color:#" + fromArgb(255, 255, 102, 0) + ";'></span>";
            temp += "热力";
            temp += "</div>";
            temp += "</div>";
            //工业
            temp += "<div style='float: left;'>";
            temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
            temp += "<span style='width:60px;height:20px;background-color:#" + fromArgb(255, 0, 0, 0) + ";'></span>";
            temp += "工业";
            temp += "</div>";
            temp += "</div>";

            //其他
            temp += "<div style='float: left;'>";
            temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
            temp += "<span style='width:60px;height:20px;background-color:#" + fromArgb(255, 0, 127, 127) + ";'></span>";
            temp += "其他";
            temp += "</div>";
            temp += "</div>";
            temp += "</div>";
            legendShow1(temp, 11);
        }
        if (material.hasClass("selected") || tuliShow === "cz") {
            var m = 0;
            var temp = "<div id='content' style='width:100%;height:100%;overflow:auto;background:#eef5fd;'>";
            var projectId = SYSTEMPARAMS.project;
            var proLayer = earth.LayerManager.GetLayerByGUID(projectId);
            var pipelineArr = getPipeListByLayer(proLayer);

            for (var i = 0; i < pipelineArr.length; i++) {
                var pipeline = pipelineArr[i];
                var pipelineGuid = pipeline.id;
                var layer = earth.LayerManager.GetLayerByGUID(pipelineGuid);
                var layerGuid = layer.Guid;
                var a = earth.LayerManager.GetBlockLayerTextureNum(pipelineGuid);
                if (a === 0) {
                    continue;
                }
                var imgPath = earth.LayerManager.GetBlockLayerSymbol(pipelineGuid, 0, layer.Name + ".jpg");
                temp += "<div style='float: left;'>";
                temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
                temp += "<img style='width:60px;height:20px;' src='" + imgPath + "'>";
                temp += "" + layer.Name + "";
                temp += "</div>";
                temp += "</div>";
                m++;
            }
            temp += "</div>";
            legendShow1(temp, m);
        }
        if (customColor.hasClass("selected") || tuliShow === "zdy") {
            var m = 0;
            var temp = "<div id='content' style='width:100%;height:100%;overflow:auto;background:#eef5fd;'>";
            var projectId = SYSTEMPARAMS.project;
            var proLayer = earth.LayerManager.GetLayerByGUID(projectId);
            var pipelineArr = getPipeListByLayer(proLayer);

            for (var i = 0; i < pipelineArr.length; i++) {
                var pipeline = pipelineArr[i];
                var pipelineGuid = pipeline.id;
                var layer = earth.LayerManager.GetLayerByGUID(pipelineGuid);
                var layerGuid = layer.Guid;
                var color = layer.CustomColor;
                color = toHex(color);
                color = color.substring(2);
                temp += "<div style='float: left;'>";
                temp += "<div id='img' style='width:160px;height:25px;text-align:left;'>";
                temp += "<span style='width:60px;height:20px;background-color:#" + color + ";'></span>";
                temp += "" + layer.Name + "";
                temp += "</div>";
                temp += "</div>";
                m++;
            }
            temp += "</div>";
            legendShow1(temp, m);
        }

    };

    DisplayModes.materialShowing = materialShowing;
    DisplayModes.customColorShowing = customColorShowing;
    DisplayModes.standardColorShowing = standardColorShowing;
    DisplayModes.legendShowing = legendShowing;
    DisplayModes.clearLegendHtmlBalloon = clearLegendHtmlBalloon;
    DisplayModes.fColor = fColor;
})();
