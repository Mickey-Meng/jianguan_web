(function (window) {
    var zInfoWindow = function () {

    };

    var popupPosHandler = null;
    var parentElement;
    var infoElement;
    var Cartesian3;
    var $;
    var datasource;

    zInfoWindow.prototype.showInfoWindow = function(jquery,option){
        var that = this;

        $ = jquery;
        var config = {};
        $.extend(true,config,option);

        var viewer = config.viewer;
        var Cesium = config.Cesium;
        parentElement = $("#" + config.parentElement);
        var content = config.content;
        var point = config.point;
        Cartesian3 = Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude,point.height + 5);
        var Cartesian2 = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, Cartesian3,Cartesian2);

        infoElement = '#trackPopUp';
        datasource = zUtil.getDataSourceByName(Cesium,viewer,'showInfoWindow');

        var trackPopUp = document.getElementById('trackPopUp');
        if(!trackPopUp){
            var infoDiv = '<div id="trackPopUp" class="trackPopUp">' +
                '<div id="trackPopUpContent" class="leaflet-popup" style="top:5px;left:0;">' +
                '<a class="leaflet-popup-close-button"></a>' +
                '<div class="leaflet-popup-content-wrapper">' +
                '<div id="trackPopUpLink" class="leaflet-popup-content"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            parentElement.append(infoDiv);
        }else {
            parentElement.find(infoElement).hide();
        }

        function positionPopUp(c) {
            var dom = parentElement.find('#trackPopUpContent');
            var x = c.x - (dom.width()) / 2 + 10;
            var y = c.y - (dom.height()) + 10;
            dom.css('top', y + 'px');
            dom.css('left', x + 'px');
        }

        $(".cesium-selection-wrapper").show();
        parentElement.find('#trackPopUpLink').empty();
        parentElement.find('#trackPopUpLink').append(content);
        parentElement.find(infoElement).show();
        positionPopUp(Cartesian2);

        if (!popupPosHandler) {
            popupPosHandler = viewer.scene.postRender.addEventListener(function() {
                if (Cartesian3) {
                    var Cartesian2 = new Cesium.Cartesian2();
                    Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, Cartesian3, Cartesian2);
                    positionPopUp(Cartesian2);
                }
            });
        }

        datasource.entities.removeAll();
        datasource.entities.add({
            polyline:{
                positions:[Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude,point.height),
                    Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude,point.height + 5)],
                material: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.fromCssColorString('#3397ff').withAlpha(0.5),
                    glowPower: 0.25,
                    taperPower: 1
                }),
                width: 4
            }
        });

        parentElement.find('.leaflet-popup-close-button').off('click').on('click',function () {
            that.closeInfoWindow();
            return false;
        });
    };

    zInfoWindow.prototype.closeInfoWindow = function(){
        Cartesian3 = null;
        popupPosHandler && (popupPosHandler.call(), popupPosHandler = null);
        if(parentElement && infoElement && $){
            parentElement.find(infoElement).hide();
            $(".cesium-selection-wrapper").hide();
        }
        if(datasource && datasource.entities){
            datasource.entities.removeAll();
        }
    };

    window.zInfoWindow = new zInfoWindow();
})(window);
