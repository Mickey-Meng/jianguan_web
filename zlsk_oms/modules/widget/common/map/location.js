(function(window) {
    var locationUtil = function () {
    };

    var datasource;
    var currentSearchValue;
    var config = {
        rootDivElement:'#location',
        flyHeight : 5000
    };

    locationUtil.prototype.findDiv = function(element) {
        return $(config.rootDivElement).find(element);
    };

    locationUtil.prototype.initLocation = function(Cesium,viewer,option) {
        var that = this;
        $.extend(true,config,option);
        datasource = zUtil.getDataSourceByName(Cesium,viewer,'Location');
        layui.use(['okUtils'],function () {
            that.findDiv('#btn_search').off('click').on('click',function () {
                currentSearchValue = that.findDiv('#search_value').val();
                if(!currentSearchValue){return;}
                if(currentSearchValue.indexOf(',') !== -1 || currentSearchValue.indexOf('，') !== -1){
                    var result = [];
                    if(currentSearchValue.indexOf(',') !== -1){
                        result = currentSearchValue.split(',');
                    }else {
                        result = currentSearchValue.split('，');
                    }
                    var location = result[1] + ',' + result[0];
                    layui.okUtils.getAddress(location,function (data,location) {
                        that.locate(location,data,Cesium,viewer);
                    });
                }else {
                    layui.okUtils.getLocation(currentSearchValue).done(function (data) {
                        that.locate(data,currentSearchValue,Cesium,viewer);
                    }).fail(function (data) {

                    });
                }
            });
        });
    };

    locationUtil.prototype.locate = function(data,address,Cesium,viewer) {
        var result = gcoord.transform(
            [data.lng,data.lat],    // 经纬度坐标
            gcoord.BD09,          // 当前坐标系
            gcoord.WGS84          // 目标坐标系
        );
        zUtil.flyToPoint(Cesium,viewer,result[0],result[1],config.flyHeight);
        var showText = result[0].toFixed(6) + ',' + result[1].toFixed(6);
        datasource.entities.removeAll();
        var cartesian3 = Cesium.Cartesian3.fromDegrees(result[0],result[1]);
        zUtil.getHeightFromcartesian3(Cesium,viewer,cartesian3,function (result,geo) {
            datasource.entities.add({
                position : result,
                // label:{
                //     text:address + '\n' + showText,
                //     font:'20px serif',
                //     style:Cesium.LabelStyle.FILL_AND_OUTLINE,
                //     outlineColor:Cesium.Color.BLACK,
                //     outlineWidth:5,
                //     fillColor:Cesium.Color.fromCssColorString('#ffffff'),
                //     pixelOffset:new Cesium.Cartesian2 (0,-40),
                // },
                point: {
                    pixelSize:10,
                    color:Cesium.Color.fromCssColorString('#2b73ff'),
                    outlineColor:Cesium.Color.fromCssColorString('#ffffff'),
                    outlineWidth:2,
                },
            });
            zInfoWindow.showInfoWindow($,{
                Cesium:Cesium,
                viewer:viewer,
                point:geo,
                content:getAttrDetailHtml({'地名':address,'经纬度':showText}),
                parentElement:'divCesiumContainer'
            });
        });
    };

    function getAttrDetailHtml(attributes) {
        var html = '<div class="div_slate_list scrollbar_ul" style="height: 200px;margin: 40px 30px 40px 40px">\n' +
            '        <ul>\n';
        for (var key in attributes){
            html += getDetailItemLi(key,attributes[key]);
        }
        html +=    '        </ul>\n' +
            '    </div>';
        return html;
    }

    function getDetailItemLi(text,value) {
        var html = '<li style="300px">';
        html += '<span title="'+ text +'" style="margin-left: 2px;display: inline-block;overflow: hidden;width: 60px">'+ text +'</span>';
        html += '<span title="'+ value +'" style="display: inline-block;overflow: hidden;width: 230px;margin-left: 10px">'+ value +'</span>';
        html += '</li>';
        return html;
    }

    window.locationUtil = new locationUtil();
})(window);
