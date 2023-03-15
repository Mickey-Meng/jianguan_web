(function (window) {
    var zUtil = function () {
        layui.use(['okLayer','okUtils','laydate','form','contextMenu','constantUrl','layedit','xmSelect','zUpload','table','zTable','zTreeGrid','contextMenu'],function () {

        });
    };

    zUtil.prototype.getPage = function(url, callback){
        layui.okUtils.ajax({
            url:url,
            type: 'get',
            dataType: 'html',
        }).done(function (data) {
            callback(data);
        });
    };

    zUtil.prototype.setLayerVisibleByName = function(instance, name, visible){
        try{
            var earthContext = instance.doAction('getEarthContext');
            earthContext.zlskCesiumHelper.getDefaultLayerManager().setLayerVisibleByName(name,visible);

            var earth_getLayerTree = instance.doAction("earth_getLayerTree");
            if(earth_getLayerTree){
                var node = earth_getLayerTree.getNodesByParam('name',name);
                earth_getLayerTree.checkNode(node[0],visible);
            }
        }catch (e) {

        }
    };

    zUtil.prototype.getConfigByNames = function(names){
        var configs = JSON.parse(sessionStorage.getItem("configJson"));
        var result = [];
        for (var index = 0;index < names.length;index ++){
            result.push(configs[names[index]]);
        }
        return result;
    };

    zUtil.prototype.getListShowContent = function(config,properties){
        var content = '';
        for (var fieldIndex = 0;fieldIndex < config.listShowField.length;fieldIndex ++){
            content += properties[config.listShowField[fieldIndex]] + '&nbsp;&nbsp;'
        }
        return content;
    };

    zUtil.prototype.switchLayerVisible = function(baseConfigs,name,instance) {
        for (var index = 0;index < baseConfigs.length;index ++){
            var config = baseConfigs[index];
            this.setLayerVisibleByName(instance,config.name,config.name === name);
        }
    };

    zUtil.prototype.switchLayerInVisible = function(baseConfigs,visible,instance) {
        for (var index = 0;index < baseConfigs.length;index ++){
            var config = baseConfigs[index];
            this.setLayerVisibleByName(instance,config.name,visible);
        }
    };

    zUtil.prototype.getConfigByName = function(configs,name){
      for (var index = 0;index < configs.length;index ++){
          if(name === configs[index].name){
              return configs[index];
          }
      }
    };

    zUtil.prototype.cacheDataToStorage = function(key,url,callback) {
        $.ajax({
            url: url,
            async: false,
            success: function (data) {
                sessionStorage.setItem(key, JSON.stringify(data));
                if(callback){
                    callback(data);
                }
            }
        });
    };

    zUtil.prototype.renderSelect = function(option){
        var config = {
            filterable: true,
            repeat: true,
            radio: true,
            clickClose: true,
            theme: {
                color: '#333333',
            },
            model: {
                label: {
                    type: 'block',
                    block: {
                        showCount: 0,
                        showIcon: option.showDeleteIcon,//是否显示删除图标
                    }
                }
            }
        };
        $.extend(true,config,option);
        return layui.xmSelect.render(config);
    };

    zUtil.prototype.deepCopy = function(arr) {
        var temp = [];
        for (var index = 0;index < arr.length;index ++){
            temp[index] = arr[index];
        }
        return temp;
    };

    zUtil.prototype.renderEasySelect = function($,option){
        var config = {
            el: '',
            tips:'',
            name: '',
            filterable: true,
            repeat: true,
            radio: true,
            clickClose: true,
            data: [],
            theme: {
                color: '#333333',
            },
            model: {
                label: {
                    type: 'block',
                    block: {
                        showCount: 0,
                        showIcon: false,//是否显示删除图标
                    }
                }
            }
        };
        $.extend(true,config,option);
        return layui.xmSelect.render(config);
    };

    //region math

    /**
     * 获取重心
     * @param mPoints
     * @returns {{latitude: number, longitude: number}}
     */
    zUtil.prototype.getCenterOfGravityPoint = function(mPoints){
        var area = 0.0;//多边形面积
        var Gx = 0.0, Gy = 0.0;// 重心的x、y
        for (var i = 1; i <= mPoints.length; i++) {
            var iLat = mPoints[i % mPoints.length].latitude;
            var iLng = mPoints[i % mPoints.length].longitude;
            var nextLat = mPoints[i - 1].latitude;
            var nextLng = mPoints[i - 1].longitude;
            var temp = (iLat * nextLng - iLng * nextLat) / 2.0;
            area += temp;
            Gx += temp * (iLat + nextLat) / 3.0;
            Gy += temp * (iLng + nextLng) / 3.0;
        }
        Gx = Gx / area;
        Gy = Gy / area;
        return {
            latitude:Gx,
            longitude:Gy
        };
    };

    /**
     * 获取中心
     * @param mPoints
     * @returns {{latitude: number, longitude: number}}
     */
    zUtil.prototype.getCenterPoint = function(mPoints){
        var x = 0,y = 0;
        for(var index = 0;index < mPoints.length;index ++){
            x += mPoints[index].longitude;
            y += mPoints[index].latitude;
        }
        return {
            longitude: x / mPoints.length,
            latitude: y / mPoints.length
        };
    };

    //endregion

    //region cesium

	 zUtil.prototype.getTDT = function(Cesium){
        var token = '73c8cafe0bf281cfc6685ffed36baf6e';
        // 服务域名
        var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
        // 服务负载子域
        var subdomains = ['0','1','2','3','4','5','6','7'];
        return new Cesium.UrlTemplateImageryProvider({
            url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
            subdomains: subdomains,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
            minimumLevel: 1,
            maximumLevel: 17
        });
    };

    zUtil.prototype.initCesium = function($,element,option,initPoint){
		let that = this;
        var config = {
            animation: false,//左下角动画组件
            baseLayerPicker: false,//地图选择按钮
            fullscreenButton: true,//全屏按钮,
            vrButton: false,//右下角全屏按钮旁VR开启按钮
            geocoder: false,//右上角第一个地理编码按钮
            homeButton: true,//复位按钮
            infoBox: false,
            sceneModePicker: false,//视角模式按钮
            selectionIndicator: false,
            timeline: false,//时间线
            navigationHelpButton: false,//帮助按钮,
            navigationInstructionsInitiallyVisible: false,
            scene3DOnly: false,
            shadows: true,
            imageryProvider: that.getTDT(Cesium),
            terrainProvider: new Cesium.CesiumTerrainProvider({ //加载火星在线地形
                url: "http://data.marsgis.cn/terrain"
            }),
			shouldAnimate : true
        };
        $.extend(true,config,option);
        var viewer = new Cesium.Viewer(element,config);
        viewer._cesiumWidget._creditContainer.style.display="none";
        viewer.scene.debugShowFramesPerSecond = false;

        var destination = Cesium.Cartesian3.fromDegrees(initPoint.longitude,initPoint.latitude,initPoint.height);

        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(e) {
            e.cancel = true;
            viewer.camera.flyTo({
                destination: destination
            });
        });
        viewer.camera.flyTo({
            destination : destination,
            orientation : {
                heading : Cesium.Math.toRadians(0.0),
                pitch : Cesium.Math.toRadians(-90.0),
                roll : 0.0
            }
        });

        return viewer;
    };

    zUtil.prototype.getEntityLabelContent = function(fields,attributes) {
        var content = '';
        for (var fieldIndex = 0;fieldIndex < fields.length;fieldIndex ++){
            content += attributes[fields[fieldIndex]] + ' '
        }
        return content;
    };

    zUtil.prototype.getHeight = function(Cesium,viewer,cartographic2s,callback){
        var promise = Cesium.sampleTerrain(viewer.terrainProvider, 14, cartographic2s);
        Cesium.when(promise, function (updatedPositions) {
            callback(updatedPositions);
        });
    };

    zUtil.prototype.countAreaInCartesian3 = function(ps) {
        var s = 0;
        for (var i = 0; i < ps.length; i++) {
            var p1 = ps[i];
            var p2;
            if (i < ps.length - 1)
                p2 = ps[i + 1];
            else
                p2 = ps[0];
            s += p1.x * p2.y - p2.x * p1.y;
        }
        return Math.abs(s / 2);
    };

    zUtil.prototype.getDataSourceByName = function(Cesium,viewer,name){
        var dataSource;
        for (let index = 0; index < viewer.dataSources.length; index++) {
            dataSource = viewer.dataSources.get(index);
            if (dataSource.name == name) {
                return dataSource;
            }
        }
        dataSource = new Cesium.CustomDataSource(name);
        viewer.dataSources.add(dataSource);
        return dataSource;
    };

    zUtil.prototype.flyToPoint = function(Cesium,viewer,lon,lat,height,option){
        var config = {
            destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-90),
                roll: Cesium.Math.toRadians(0),
            },
        };
        $.extend(true,config,option);
        viewer.camera.flyTo(config);
    };

    var tempEntity = [];
    zUtil.prototype.openCircleRipple = function (Cesium,viewer,lon,lat,height) {
        this.closeCircleRipple(viewer,);
        var imgurl1 = "../../../../widget/slate/images/redCircle2.png";
        addCircleRipple(Cesium,viewer,{ //默认只绘制两个圆圈叠加 如遇绘制多个，请自行源码内添加。
            id:'ld',
            lon:lon,
            lat:lat,
            height:height || 100,
            maxR:100,
            minR:0,//最好为0
            deviationR:1,//差值 差值也大 速度越快
            eachInterval:1000,//两个圈的时间间隔
            imageUrl:imgurl1
        });
        function addCircleRipple(Cesium,viewer,data){
            var r1=data.minR,r2=data.minR;

            function changeR1() { //这是callback，参数不能内传
                r1=r1+data.deviationR;
                if(r1>=data.maxR){
                    r1=data.minR;
                }

                return r1;
            }
            function changeR2() {
                r2=r2+data.deviationR;
                if(r2>=data.maxR){
                    r2=data.minR;
                }
                return r2;
            }
            var a= viewer.entities.add({
                id:data.id,
                name:"",
                position:Cesium.Cartesian3.fromDegrees(data.lon,data.lat,data.height),
                ellipse : {
                    semiMinorAxis :new Cesium.CallbackProperty(changeR1,false),
                    semiMajorAxis :new Cesium.CallbackProperty(changeR1,false),
                    height:data.height,
                    material:new Cesium.ImageMaterialProperty({
                        image:data.imageUrl,
                        repeat:new Cesium.Cartesian2(1.0, 1.0),
                        transparent:true,
                        color:new Cesium.CallbackProperty(function () {
                            var alp=1-r1/data.maxR;
                            return Cesium.Color.WHITE.withAlpha(alp)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
                        },false)
                    })
                }
            });
            tempEntity.push(a);
            setTimeout(function () {
                var b = viewer.entities.add({
                    name:"",
                    position:Cesium.Cartesian3.fromDegrees(data.lon,data.lat,data.height),
                    ellipse : {
                        semiMinorAxis :new Cesium.CallbackProperty(changeR2,false),
                        semiMajorAxis :new Cesium.CallbackProperty(changeR2,false),
                        height:data.height,
                        material:new Cesium.ImageMaterialProperty({
                            image:data.imageUrl,
                            repeat:new Cesium.Cartesian2(1.0, 1.0),
                            transparent:true,
                            color:new Cesium.CallbackProperty(function () {
                                var alp=1;
                                alp=1-r2/data.maxR;
                                return Cesium.Color.WHITE.withAlpha(alp)
                            },false)
                        })
                    }
                });
                tempEntity.push(b);
            },data.eachInterval)
        }
    };

    zUtil.prototype.closeCircleRipple = function (viewer) {
        for (let i = 0; i < tempEntity.length; i++) {
            viewer.entities.remove(tempEntity[i]);
        }
    };

    zUtil.prototype.getCenterPointFromPolygon = function(polygon){
        var x = 0,y = 0;
        for(var index = 0;index < polygon.length;index ++){
            x += polygon[index][0];
            y += polygon[index][1];
        }
        return {
            x: x / polygon.length,
            y: y / polygon.length
        };
    };

    zUtil.prototype.twinkling = function(dataSource){
        var count = 0;
        var isShow = false;
        var setIntervalId = setInterval(function () {
            if(count === 12){
                clearInterval(setIntervalId);
                count = 0;
                isShow = false;
                dataSource.entities.removeAll();
            }
            dataSource.show = isShow;
            isShow = !isShow;
            count ++;
        },150);
    };

    zUtil.prototype.twinklingGeometry = function(geometry,callback){
        var count = 0;
        var isShow = false;
        var setIntervalId = setInterval(function () {
            geometry.show = isShow;
            isShow = !isShow;
            count ++;
            if(count === 6){
                clearInterval(setIntervalId);
                if(callback){
                    callback();
                }
            }
        },150);
    };

    zUtil.prototype.screenToGeo = function(Cesium,viewer,position){
        var screen = new Cesium.Cartesian2(position.x,position.y);
        var world = viewer.scene.globe.pick(viewer.camera.getPickRay(screen),viewer.scene);
        if(!world){
            return null;
        }
        var Geography = viewer.scene.globe.ellipsoid.cartesianToCartographic(world);
        return {
            longitude: Cesium.Math.toDegrees(Geography.longitude),
            latitude: Cesium.Math.toDegrees(Geography.latitude),
            height:Geography.height
        };
    };

    zUtil.prototype.cartesian3ToGeo = function(Cesium,viewer,cartesian3){
        var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
        return {
            longitude: Cesium.Math.toDegrees(cartographic.longitude),
            latitude: Cesium.Math.toDegrees(cartographic.latitude)
        };
    };
    zUtil.prototype.cartesian3ToGeoArray = function(Cesium,viewer,cartesian3){
        var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian3);
        return [Cesium.Math.toDegrees(cartographic.longitude),Cesium.Math.toDegrees(cartographic.latitude)];
    };

    zUtil.prototype.getHeightFromcartesian3 = function(Cesium,viewer,cartesian3,callback){
        var geo = this.cartesian3ToGeo(Cesium,viewer,cartesian3);
        var cartographic2s = [];
        cartographic2s.push(Cesium.Cartographic.fromDegrees(geo.longitude, geo.latitude));
        this.getHeight(Cesium,viewer,cartographic2s,function (updatePoints) {
            var cartesian = Cesium.Cartesian3.fromDegrees(geo.longitude, geo.latitude,updatePoints[0].height || 0);
            callback(cartesian,{longitude:geo.longitude,latitude:geo.latitude,height:updatePoints[0].height || 0});
        });
    };

    zUtil.prototype.drawPolygon = function(Cesium,viewer,datasource,option){
        var config = {
            polygonColor:'#ea4c9a',
            polylineColor:'#EA2B30',
            labelColor:'#EA2B30',
            extrudedHeight:5,
            labelText:'',
            labelDisplay: 2000,
            polygonDisplay: 4000,
            polylineDisplay: 4000,
            isNeedPolygon:true
        };
        $.extend(true,config,option);
        var positions = [],x = 0,y = 0;
        for (var pointIndex = 0; pointIndex < config.points.length; pointIndex++) {
            var point = config.points[pointIndex];
            x += point[0];
            y += point[1];
            if(pointIndex === config.points.length - 1){
                x /= config.points.length;
                y /= config.points.length;
            }
            positions.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]));
        }
        var cartographic2s = [Cesium.Cartographic.fromDegrees(x, y)];
        this.getHeight(Cesium,viewer,cartographic2s,function (updatePoints) {
            var entity = {
                id:config.id,
                configName:config.configName,
                feature:config.feature,
                position : Cesium.Cartesian3.fromDegrees(x, y,updatePoints[0].height + config.extrudedHeight),
                polyline:{
                    positions: positions,
                    show: true,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        color: Cesium.Color.fromCssColorString(config.polylineColor).withAlpha(0.5),
                        glowPower: 0.25,
                        taperPower: 1
                    }),
                    width: 4,
                    clampToGround: true,
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition (0, config.polylineDisplay),
                },
                label:{
                    text:config.labelText,
                    font:'16px sans-serif',
                    style:Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineColor:Cesium.Color.WHITE,
                    outlineWidth:5,
                    fillColor:Cesium.Color.fromCssColorString(config.labelColor),
                    pixelOffset:new Cesium.Cartesian2 (0,-40),
                    scaleByDistance : new Cesium.NearFarScalar(1.5e2, 0.8, 1.5e7, 0.2),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition (0, config.labelDisplay),
                }
            };
            if(config.isNeedPolygon){
                entity.polygon = {
                    show: true,
                        hierarchy: positions,
                        material: Cesium.Color.fromCssColorString(config.polygonColor).withAlpha(0.2),
                        extrudedHeight:config.extrudedHeight,
                        extrudedHeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                        heightReference:Cesium.HeightReference.CLAMP_TO_GROUND ,
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition (0,config.polygonDisplay),
                };
            }
            datasource.entities.add(entity);
        });
    };

    zUtil.prototype.showPolygon = function(Cesium,viewer,datasource,option){
        datasource.entities.removeAll();
        var config = {
            polygonColor:'#EA2B30',
            polylineColor:'#EA2B30',
            labelColor:'#EA2B30',
            extrudedHeight:300,
            labelText:''
        };
        $.extend(true,config,option);
        var positions = [],x = 0,y = 0;
        for (var pointIndex = 0; pointIndex < config.points.length; pointIndex++) {
            var point = config.points[pointIndex];
            x += point[0];
            y += point[1];
            if(pointIndex === config.points.length - 1){
                x /= config.points.length;
                y /= config.points.length;
            }
            positions.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]));
        }

        var cartographic2s = [Cesium.Cartographic.fromDegrees(x, y)];
        this.getHeight(Cesium,viewer,cartographic2s,function (updatePoints) {
            datasource.entities.add({
                position : Cesium.Cartesian3.fromDegrees(x, y,updatePoints[0].height + config.extrudedHeight),
                polygon: {
                    show: true,
                    hierarchy: positions,
                    material: Cesium.Color.fromCssColorString(config.polygonColor).withAlpha(0.2),
                    extrudedHeight:config.extrudedHeight,
                    extrudedHeightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
                    heightReference:Cesium.HeightReference.CLAMP_TO_GROUND ,
                },
                polyline:{
                    positions: positions,
                    show: true,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        color: Cesium.Color.fromCssColorString(config.polylineColor).withAlpha(0.9),
                        glowPower: 0.25,
                        taperPower: 1
                    }),
                    width: 10,
                    clampToGround: true
                },
                label:{
                    text:config.labelText,
                    font:'20px sans-serif',
                    style:Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineColor:Cesium.Color.WHITE,
                    outlineWidth:5,
                    fillColor:Cesium.Color.fromCssColorString(config.labelColor),
                    pixelOffset:new Cesium.Cartesian2 (0,-40),
                    scaleByDistance : new Cesium.NearFarScalar(1.5e2, 0.8, 1.5e7, 0.2),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition (0, 4000.0),
                }
            });
        });

        this.flyToPoint(Cesium,viewer,x, y, 4000);
        this.twinklingGeometry(datasource);
    };

    zUtil.prototype.showPolyline = function(Cesium,viewer,datasource,option){
        datasource.entities.removeAll();
        var config = {
            polylineColor:'#EA2B30',
            labelColor:'#EA2B30'
        };
        $.extend(true,config,option);
        var positions = [];
        for (var pointIndex = 0; pointIndex < config.points.length; pointIndex++) {
            var point = config.points[pointIndex];
            positions.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]));
        }
        var x = config.points[parseInt(config.points.length/2)][0];
        var y = config.points[parseInt(config.points.length/2)][1];
        datasource.entities.add({
            polyline:{
                positions: positions,
                show: true,
                material: new Cesium.PolylineGlowMaterialProperty({
                    color: Cesium.Color.fromCssColorString(config.polylineColor).withAlpha(0.9),
                    glowPower: 0.25,
                    taperPower: 1
                }),
                width: 10,
                clampToGround: true
            }
        });
        if(config.labelText){
            var cartographic2s = [Cesium.Cartographic.fromDegrees(x, y)];
            this.getHeight(Cesium,viewer,cartographic2s,function (updatePoints) {
                datasource.entities.add({
                    position : Cesium.Cartesian3.fromDegrees(x, y,updatePoints[0].height),
                    label:{
                        text:config.labelText,
                        font:'20px sans-serif',
                        style:Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineColor:Cesium.Color.WHITE,
                        outlineWidth:5,
                        fillColor:Cesium.Color.fromCssColorString(config.labelColor),
                        pixelOffset:new Cesium.Cartesian2 (0,-40)
                    },
                });
            });
        }
        this.flyToPoint(Cesium,viewer,x, y, 4000);
        this.twinklingGeometry(datasource);
    };

    zUtil.prototype.showPoint = function(Cesium,viewer,points){
        var _this = this;
        var x = points[0][0];
        var y = points[0][1];
        this.flyToPoint(Cesium,viewer,x, y, 1500);
        var cartographic2s = [Cesium.Cartographic.fromDegrees(x, y)];
        _this.getHeight(Cesium,viewer,cartographic2s,function (updatePoints) {
            _this.openCircleRipple(Cesium,viewer,x, y,updatePoints[0].height)
        });
    };

    //endregion

    //region eChart

    zUtil.prototype.renderPieChart = function(param){
        var config = {
            center:["50%", "50%"],
            color: ['#2edfa3', '#bce672', '#ff4777', '#70f3ff', '#4b5cc4', '#f47983', '#8d4bbb', '#6635EF', '#FFAFDA'],
            tooltipFormatter: "{b} <br/>面积：{c}亩<br/>占比：{d}%",
            seriesName:'',
        };
        $.extend(true,config,param);
        var option = {
            color: config.color,
            tooltip: {
                show:true,
                trigger: 'item',
                formatter: config.tooltipFormatter
            },
            legend: {
                orient: 'horizontal',
                icon: 'circle',
                bottom: 0,
                x: 'center',
                textStyle: {
                    color: '#fff'
                },
                data: config.legend
            },
            series: [
                {
                    name: config.seriesName,
                    type: 'pie',
                    selectedMode: 'single',
                    radius: ['30%', '60%'],
                    center: config.center,
                    label: {
                        normal: {
                            show: false,
                            position: 'inner',
                            formatter: '{d}%',
                            textStyle: {
                                color: '#fff',
                                fontWeight: 'normal',
                                fontSize: 12
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: config.seriesData
                },
                {
                    name: config.seriesName,
                    type: 'pie',
                    radius: ['62%', '64%'],
                    center: config.center,
                    label: {
                        normal: {
                            formatter: '{b|{b}}\n{hr|}\n{d|{d}%}',
                            rich: {
                                b: {
                                    fontSize: 12,
                                    color: '#fff',
                                    align: 'left',
                                    padding: 2
                                },
                                hr: {
                                    borderColor: '#12EABE',
                                    width: '100%',
                                    borderWidth: 2,
                                    height: 0
                                },
                                d: {
                                    fontSize: 12,
                                    color: '#fff',
                                    align: 'left',
                                    padding: 2
                                },
                                c: {
                                    fontSize: 12,
                                    color: '#fff',
                                    align: 'center',
                                    padding: 2
                                }
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 20,
                            length2: 20,
                            lineStyle: {
                                type: 'dashed',
                                width: 2
                            }
                        }
                    },
                    data: config.seriesData
                }
            ]
        };
        var chart = echarts.init($("#" + config.id)[0]);
        chart.setOption(option);
    };

    zUtil.prototype.renderPieChart2 = function(param){
        var config = {
            center:["50%", "50%"],
            color: ['#2edfa3', '#bce672', '#ff4777', '#70f3ff', '#4b5cc4', '#f47983', '#8d4bbb', '#6635EF', '#FFAFDA'],
            tooltipFormatter: "{b} <br/>面积：{c}亩<br/>占比：{d}%",
            seriesName:'',
        };
        $.extend(true,config,param);
        var option = {
            color: config.color,
            grid: {
                left: -100,
                top: 20,
                bottom: 10,
                right: 10,
                containLabel: true
            },
            tooltip: {
                show:true,
                trigger: 'item',
                formatter: config.tooltipFormatter
            },
            legend: {
                orient: "horizontal",
                bottom: "0",
                itemWidth: 16,
                itemHeight: 8,
                itemGap: 16,
                textStyle: {
                    color: '#A3E2F4',
                    fontSize: 12,
                    fontWeight: 0
                },
                data: config.legend
            },
            series: [{
                type: 'pie',
                radius: ["10%", "20%"],
                center: config.center, 　　　　//这个属性调整图像的位置
                hoverAnimation: false,
                labelLine: {
                    normal: {
                        show: false,
                        length: 25,
                        length2: 30
                    },
                    emphasis: {
                        show: false
                    }
                },
                data: [{
                    name: '',
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "#0B4A6B"
                        }
                    }
                }]
            }, {
                type: 'pie',
                radius: ["68%", "70%"],
                center: config.center, 　　　　//这个属性调整图像的位置
                hoverAnimation: false,
                labelLine: {
                    normal: {
                        show: false,
                        length: 25,
                        length2: 30
                    },
                    emphasis: {
                        show: false
                    }
                },
                name: "",
                data: [{
                    name: '',
                    value: 0,
                    itemStyle: {
                        normal: {
                            color: "#0B4A6B"
                        }
                    }
                }]
            },{
                stack: 'a',
                type: 'pie',
                radius: ["16%", "65%"],
                center: config.center,　　　　//这个属性调整图像的位置
                roseType: 'area',
                zlevel:10,
                label: {
                    normal: {
                        formatter: '{b|{b}}\n{hr|}\n{d|{d}%}',
                        rich: {
                            b: {
                                fontSize: 12,
                                color: '#fff',
                                align: 'left',
                                padding: 2
                            },
                            hr: {
                                borderColor: '#12EABE',
                                width: '100%',
                                borderWidth: 2,
                                height: 0
                            },
                            d: {
                                fontSize: 12,
                                color: '#fff',
                                align: 'left',
                                padding: 2
                            },
                            c: {
                                fontSize: 12,
                                color: '#fff',
                                align: 'center',
                                padding: 2
                            }
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        length: 15,
                        length2: 20
                    },
                    emphasis: {
                        show: false
                    }
                },
                data: config.seriesData
            }, ]
        };
        var chart = echarts.init($("#" + config.id)[0]);
        chart.setOption(option);
    };

    zUtil.prototype.renderPieChart3 = function(param){
        var config = {
            center:["50%", "50%"],
            color: ['#2edfa3', '#bce672', '#ff4777', '#70f3ff', '#4b5cc4', '#f47983', '#8d4bbb', '#6635EF', '#FFAFDA'],
            tooltipFormatter: "{b} <br/>面积：{c}亩<br/>占比：{d}%",
            seriesName:'',
        };
        $.extend(true,config,param);
        var data1 = 0;
        let baseData = [];
        for (var i = 0; i < config.seriesData.length; i++) {
            baseData.push({
                value: config.seriesData[i].value,
                name: config.seriesData[i].name,
                itemStyle: {
                    normal: {
                        borderWidth: 22,
                        shadowBlur: 50,
                        borderColor: config.color[i],
                        shadowColor: 'rgba(0, 0, 0, 0.8)'
                    }
                }
            });
            data1 += parseFloat(config.seriesData[i].value);
        }
        var option = {
            color: config.color,
            tooltip: {
                show:true,
                trigger: 'item',
                formatter: config.tooltipFormatter
            },
            legend: {
                data: config.legend,
                icon: 'circle',
                bottom: "0",
                itemWidth: 16,
                itemHeight: 8,
                itemGap: 16,
                textStyle: {
                    color: '#A3E2F4',
                    fontSize: 12,
                    fontWeight: 0
                },
            },
            grid: {
                top: 'bottom',
                left: '90',
                width: '90%',
                height: '80%',
            },
            series: [{
                zlevel: 1,
                name: '面积',
                type: 'pie',
                selectedMode: 'single',
                radius: ['50%', '60%'],
                center:config.center,
                startAngle: '40',
                hoverAnimation: false,
                label: {
                    normal: {
                        formatter: '{b|{b}}\n{hr|}\n{d|{d}%}',
                        rich: {
                            b: {
                                fontSize: 12,
                                color: '#fff',
                                align: 'left',
                                padding: 2
                            },
                            hr: {
                                borderColor: '#12EABE',
                                width: '100%',
                                borderWidth: 2,
                                height: 0
                            },
                            d: {
                                fontSize: 12,
                                color: '#fff',
                                align: 'left',
                                padding: 2
                            },
                            c: {
                                fontSize: 12,
                                color: '#fff',
                                align: 'center',
                                padding: 2
                            }
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true,
                        length: 15,
                        length2: 30
                    },
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        shadowColor: 'rgba(0, 0, 0, 0.8)',
                        shadowBlur: 50,
                    }
                },
                data: baseData
            },
                {
                    name: '',
                    type: 'pie',
                    selectedMode: 'single',
                    radius: ['30%', '30%'],
                    center: ['50%', '50%'],
                    startAngle: '10',
                    data: [{
                        "value": data1,
                        "name": "",
                        "label": {
                            "normal": {
                                "show": true,
                                "formatter": '{c|{c}} {b|亩} \n {a|总面积}',
                                rich: {
                                    c: {
                                        color: '#FBFE27',
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        lineHeight: 15
                                    },
                                    b: {
                                        color: '#FBFE27',
                                        fontSize: 20,
                                        lineHeight: 15
                                    },
                                    a: {
                                        align: 'center',
                                        color: 'rgb(98,137,169)',
                                        fontSize: 20,
                                        height: 30
                                    },
                                },
                                "textStyle": {
                                    "fontSize": 12,
                                    "fontWeight": "bold"
                                },
                                "position": "center"

                            }
                        }
                    }, ]
                }
            ]
        };
        var chart = echarts.init($("#" + config.id)[0]);
        chart.setOption(option);
    };

    zUtil.prototype.renderHBarChart = function(param){
        var config = {
            tooltipFormatter: "{b} : {c}亩",
            seriesName:'',
        };
        $.extend(true,config,param);
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: config.tooltipFormatter
            },
            grid: {
                top: '8%',
                right: '3%',
                left: '8%',
                bottom: '8%'
            },
            xAxis: [{
                type: 'category',
                data: config.xAxisData,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.12)'
                    }
                },
                axisLabel: {
                    margin: 6,
                    color: '#e2e9ff',
                    textStyle: {
                        fontSize: 12
                    },
                },
            }],
            yAxis: [{
                nameTextStyle:{
                    color:'#e2e9ff',
                    fontSize: 12
                },
                axisLabel: {
                    formatter: '{value}',
                    color: '#e2e9ff',
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.12)'
                    }
                }
            }],
            series: [{
                type: 'bar',
                data: config.seriesData,
                barWidth: '20px',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0,244,255,1)' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: 'rgba(0,77,167,1)' // 100% 处的颜色
                        }], false),
                        barBorderRadius: [30, 30, 30, 30],
                        shadowColor: 'rgba(0,160,221,1)',
                        shadowBlur: 4,
                    }
                },
                "label": {
                    "normal": {
                        "show": true,
                        "position": "top",
                        "formatter": "{c}亩",
                        color: '#ffffff',
                    }
                },
            }]
        };
        var chart = echarts.init($("#" + config.id)[0]);
        chart.setOption(option);
        return chart;
    };

    zUtil.prototype.renderHBarChart2 = function(param){
        var config = {
            tooltipFormatter: "{b} : {c}亩",
            seriesName:'',
        };
        $.extend(true,config,param);
        var wkData = 30;
        var wkDatas = [];
        for (let i = 0; i < config.seriesData.length; i++) {
            wkDatas.push(wkData);
        }
        var option = {
            grid: {
                show:'true',
                borderWidth:'0',
                height:"95%",
                width:"80%",
                x:"15%",
                y:"5%",
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: config.tooltipFormatter
            },
            xAxis: {
                show: false,                //是否显示x轴
                type: 'value'
            },
            yAxis: {
                type: 'category',
                inverse:true,               //让y轴数据逆向
                axisLabel: {
                    textStyle:{
                        color:'#ffffff',
                        fontSize : 14      //更改坐标轴文字大小
                    }
                },
                splitLine: {show: false},   //横向的线
                axisTick: {show: false},    //y轴的端点
                axisLine: {show: false},    //y轴的线
                data: config.xAxisData
            },
            series: [
                {
                    name: '数据内框',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30,
                            color: '#00b5eb',
                        }
                    },
                    barWidth: 20,
                    data: config.seriesData,
                    "label": {
                        "normal": {
                            "show": true,
                            "position": "right",
                            "formatter": "{c}亩",
                            color: '#ffffff',
                        }
                    },
                },
                {
                    name: '外框',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30,
                            color: 'rgba(255, 255, 255, 0.14)' //rgba设置透明度0.14
                        }
                    },
                    barGap: '-100%',
                    z: 0,
                    barWidth: 20,
                    data: wkDatas
                }
            ]
        };
        var chart = echarts.init($("#" + config.id)[0]);
        chart.setOption(option);
        return chart;
    };

    //endregion

    //region wfs

    zUtil.prototype.wfsSearch = function(config){
        var _this = this;
        layui.use('okUtils',function () {
            var params = {
                service:'WFS',
                request:'GetFeature',
                version:'1.0.0',
                outputFormat:'application/json',
                typeName:config.layerName,
            };

            if(config.searchType === 'point'){
                params.filter = _this.getFilterByPoint(config.point);
            }else if(config.searchType === 'polygon'){
                params.filter = _this.getFilterByPolygon(config.polygon);
            }else if(config.searchType === 'property'){
                if(config.searchMap && config.searchMap !== ''){
                    params.filter =  _this.getFilterByFiled(config.searchMap);
                }
            }
            layui.okUtils.ajax({
                url:config.url,
                data:params,
                async:config.async
            }).done(function (data) {
                config.callback(data);
            });
        });
    };

    zUtil.prototype.getFilterByPoint = function(point){
        var gml = point.x + "," + point.y;
        return "<Filter\n" +
            "    xmlns=\"http://www.opengis.net/ogc \"\n" +
            "    xmlns:gml=\"http://www.opengis.net/gml \">\n" +
            "    <Intersects>\n" +
            "        <PropertyName>the_geom</PropertyName>\n" +
            "        <gml:Point>\n" +
            "            <gml:coordinates>" + gml + "</gml:coordinates>\n" +
            "        </gml:Point>\n" +
            "    </Intersects>\n" +
            "</Filter>";
    };

    zUtil.prototype.getFilterByPolygon = function(polygon){
        var gml = '';

        //构造gml

        return "<Filter\n" +
            "    xmlns=\"http://www.opengis.net/ogc\"\n" +
            "    xmlns:gml=\"http://www.opengis.net/gml\">\n" +
            "    <Intersects>\n" +
            "        <PropertyName>geom</PropertyName>\n" +
            "        <gml:Polygon>\n" +
            "            <gml:outerBoundaryIs>\n" +
            "                <gml:LinearRing>\n" +
            "                    <gml:coordinates>" + gml + "</gml:coordinates>\n" +
            "                </gml:LinearRing>\n" +
            "            </gml:outerBoundaryIs>\n" +
            "        </gml:Polygon>\n" +
            "    </Intersects>\n" +
            "</Filter>\n";
    };

    zUtil.prototype.getFilterByFiled = function(fieldMap){
        var gml = '';
        for(var item in fieldMap){
            if(!fieldMap[item]){
                continue;
            }
            gml += ("<PropertyIsLike wildCard=\"*\" singleChar=\"*\" escapeChar=\"\\\">" +
                "<PropertyName>" + item + "</PropertyName>" +
                "<Literal>*"+ fieldMap[item] +"*</Literal>" +
                "</PropertyIsLike>");
        }

        return gml === '' ? '' : "<Filter>" +
            "<Or>" +
            gml +
            "</Or>" +
            "</Filter>";
    };

    //endregion

    //region arcgis feature edit

    zUtil.prototype.arcgis_updateFeatures = function(url,layerId,features,callback){
        url = url + '/' + layerId + '/updateFeatures';
        layui.okUtils.ajax({
            url:url,
            type:'POST',
            data:{
                f:'json',
                features:JSON.stringify(features)
            },
            isNeedToken:false,
            returnDataAnyWay:true
        }).done(function (data) {
            if(callback){
                callback(data);
            }
        });
    };

    zUtil.prototype.arcgis_addFeatures = function(url,layerId,features,callback){
        url = url + '/' + layerId + '/addFeatures';
        layui.okUtils.ajax({
            url:url,
            type:'POST',
            data:{
                f:'json',
                features:JSON.stringify(features)
            },
            isNeedToken:false,
            returnDataAnyWay:true
        }).done(function (data) {
            if(callback){
                callback(data);
            }
        });
    };

    zUtil.prototype.arcgis_deleteFeatures = function(url,layerId,ids,callback){
        url = url + '/' + layerId + '/deleteFeatures';
        layui.okUtils.ajax({
            url:url,
            type:'POST',
            data:{
                f:'json',
                objectIds:ids
            },
            isNeedToken:false,
            returnDataAnyWay:true
        }).done(function (data) {
            if(callback){
                callback(data);
            }
        });
    };

    //endregion

    //region arcgis query

    zUtil.prototype.getLayerData = function(url,callback){
        layui.okUtils.ajax({
            url:url,
            data:{
                f:'pjson'
            },
            isNeedToken:false,
            returnDataAnyWay:true
        }).done(function (data) {
            var layers = data.layers;
            var allIds = [];
            for (var index = 0;index < layers.length;index ++){
                allIds.push(layers[index].id);
                layers[index].open = true;
                layers[index].checked = true;
            }
            var result = layui.okUtils.getTreeByList('id','parentLayerId','children',layers,-1);
            callback(layers,result,allIds);
        });
    };

    zUtil.prototype.getLayerFields = function(url,callback){
        layui.okUtils.ajax({
            url:url,
            data:{
                f:'pjson'
            },
            isNeedToken:false,
            returnDataAnyWay:true
        }).done(function (data) {
            callback(data.fields,data);
        });
    };

    /**
     *ARCGIS 属性查询
     */
    zUtil.prototype.queryArcgis = function(url,option,callback){
        var where = '';
        var index = 0;
        for(var key in option){
            var value = option[key];
            if(key !== 'remove' && value && value !== ''){
                // where += key + ' like \'%' + value + '%\' ';
                where += key + " = '" + value + "' ";
                if(index < Object.keys(option).length - 1){
                    where += ' or ';
                }
                index ++;
            }
        }
        if(where === ''){
            where = ' 1 = 1 ';
        }
        var data = {
            returnGeometry: true,
            where: where,
            outSr: 4326,
            inSr: 4326,
            outFields: '*',
            f: 'json'
        };
        layui.okUtils.ajax({
            url:url + '/query',
            data:data,
            isNeedToken:false,
            returnDataAnyWay:true,
            async:false
        }).done(function (data) {
            callback(data);
        });
    };

    /**
     *点击空间查询
     */
    zUtil.prototype.queryArcgisFromPolygon = function(url,geometry,callback){
        var data = {
            returnGeometry: true,
            geometryType:'esriGeometryPolygon',
            spatialRel:'esriSpatialRelIntersects',
            geometry:JSON.stringify(geometry),
            where: '',
            outSr: 4326,
            inSr: 4326,
            outFields: '*',
            f: 'pjson'
        };
        layui.okUtils.ajax({
            url:url + '/query',
            data:data
        }).done(function (data) {
            callback(data);
        });
    };

    zUtil.prototype.getBufferFromArcgisService = function(url,geometry,distance,callback){
        var data = {
            geometries:geometry,
            outSr: 4326,
            inSr: 4326,
            bufferSR:3857,
            distances:distance,
            outFields: '*',
            unionResults:true,
            geodesic:false,
            f: 'pjson'
        };
        layui.okUtils.ajax({
            url:url + '/Utilities/Geometry/GeometryServer/buffer',
            data:data
        }).done(function (data) {
            callback(data);
        });
    };

    zUtil.prototype.getBufferPolygonFromPoint = function(Cesium,viewer,point,radius){
        var pointsCount = 8;
        var points = [];
        var sin;
        var cos;
        var x;
        var y;
        for (var i = 0; i < pointsCount; i++) {
            sin = Math.sin(Math.PI * 2 * i / pointsCount);
            cos = Math.cos(Math.PI * 2 * i / pointsCount);
            x = point.x + radius * sin;
            y = point.y + radius * cos;
            var geo = this.screenToGeo(Cesium,viewer,{x:x,y:y});
            points.push([geo.longitude,geo.latitude]);
        }
        return points;
    };

    /**
     * 获取重心
     * @param mPoints
     * @returns {{x: number, y: number}}
     */
    zUtil.prototype.getRingCenterOfGravityPoint = function(mPoints){
        var area = 0.0;//多边形面积
        var Gx = 0.0, Gy = 0.0;// 重心的x、y
        for (var i = 1; i <= mPoints.length; i++) {
            var iLat = mPoints[i % mPoints.length][1];
            var iLng = mPoints[i % mPoints.length][0];
            var nextLat = mPoints[i - 1][1];
            var nextLng = mPoints[i - 1][0];
            var temp = (iLat * nextLng - iLng * nextLat) / 2.0;
            area += temp;
            Gx += temp * (iLat + nextLat) / 3.0;
            Gy += temp * (iLng + nextLng) / 3.0;
        }
        Gx = Gx / area;
        Gy = Gy / area;
        return {
            y:Gx,
            x:Gy
        };
    };

    zUtil.prototype.getPolygonGravityPoint = function(mPoints){
        var area = 0.0;//多边形面积
        var Gx = 0.0, Gy = 0.0;// 重心的x、y
        for (var i = 1; i <= mPoints.length; i++) {
            var iLat = mPoints[i % mPoints.length].latitude;
            var iLng = mPoints[i % mPoints.length].longitude;
            var nextLat = mPoints[i - 1].latitude;
            var nextLng = mPoints[i - 1].longitude;
            var temp = (iLat * nextLng - iLng * nextLat) / 2.0;
            area += temp;
            Gx += temp * (iLat + nextLat) / 3.0;
            Gy += temp * (iLng + nextLng) / 3.0;
        }
        Gx = Gx / area;
        Gy = Gy / area;
        return {
            latitude:Gx,
            longitude:Gy
        };
    };

    /**
     * 获取中心
     * @param mPoints
     * @returns {{x: number, y: number}}
     */
    zUtil.prototype.getRingCenterPoint = function(mPoints){
        var x = 0,y = 0;
        for(var index = 0;index < mPoints.length;index ++){
            x += mPoints[index][0];
            y += mPoints[index][1];
        }
        return {
            x: x / mPoints.length,
            y: y / mPoints.length
        };
    };

    //endregion

    window.zUtil = new zUtil();
})(window);
