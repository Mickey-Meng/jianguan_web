var pipelineSelectId = []; //所有图层中的管线图层
var LayerManagement = {
    isContain: false,
    /**
     * 功能：获取图层根节点
     * 参数：无
     * 返回值：图层根节点
     */
    getRootLayer: function(earth) {
        var rootLayer = earth.LayerManager.LayerList;
        return rootLayer;
    },

    initLayerDataType: function(earth, layer) {
        if (layer == null) {
            layer = this.getRootLayer(earth);
        }

        var childCount = layer.GetChildCount();
        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);
            if (childLayer.LocalSearchParameter != null) {
                if (childLayer.LayerType == 'POI') {
                    childLayer.LocalSearchParameter.ReturnDataType = 1;
                } else {
                    childLayer.LocalSearchParameter.ReturnDataType = 4;
                }
            }
            if (childLayer.GetChildCount() > 0) {
                this.initLayerDataType(earth, childLayer);
            }
        }
    },

    /**
     * 功能：根据图层类型，获取图标样式
     * 参数：layerType-图层类型
     * 返回值：图标样式
     */
    getLayerIcon: function(layerType) {
        var icon = "";
        if (layerType === "POI") {
            icon = 'image/layer/layer_poi.gif';
        } else if (layerType === "Vector") {
            icon = 'image/layer/layer_vector.gif';
        } else if (layerType === "Model") {
            icon = 'image/layer/layer_model.gif';
        } else if (layerType === "Block") {
            icon = 'image/layer/layer_block.gif';
        } else if (layerType === "MatchModel") {
            icon = 'image/layer/layer_matchmodel.gif';
        } else if (layerType === "Billboard") {
            icon = 'image/layer/layer_billboard.gif';
        } else if (layerType === "Annotation") {
            icon = 'image/layer/layer_annotation.gif';
        } else if (layerType === "Equipment") {
            icon = 'image/layer/layer_equipment.png';
        } else if (layerType === "Container") {
            icon = 'image/layer/layer_container2.png';
        } else if (layerType === "Well") {
            icon = 'image/layer/layer_well.png';
        } else if (layerType === "Joint") {
            icon = 'image/layer/layer_joint2.png';
        } else if (layerType === "Plate") {
            icon = 'image/layer/layer_plate.png';
        } else if (layerType === "Pipeline") {
            icon = 'image/layer/layer_pipeline.gif';
        } else if (layerType === "Project") {
            icon = 'image/layer/projectIcon.gif';
        } else if (layerType === "Powerline") {
            icon = 'image/layer/layer_powerline.gif';
        } else if (layerType === "Line") {
            icon = 'image/layer/layer_line.gif';
        } else if (layerType === "Tower") {
            icon = 'image/layer/layer_tower.gif';
        }
        return icon;
    },
    /**
     * 功能：递归获取管线图层Guid集合
     * 参数：layer-图层根节点（最开始是工程级图层）
     * 返回值：该图层的子节点是否全部是管线图层
     （ true：该图层所有子节点全部是管线图层，则该根节点也需要push进管线图层Guid集合中；
        false：该图层所有子节点不全是管线图层，则该根节点不需要push进管线图层Guid集合中）
     */
    getPipelineSelectIds: function(layer) {
        var bAllPipeline = true;
        var childCount = layer.GetChildCount();
        for (var s = 0; s < childCount; s++) { //获取所有的管线图层ID集合，用于从基础图层中消除
            var childLayer = layer.GetChildAt(s);
            var layerType = childLayer.LayerType;
            if (layerType === "Pipeline") {
                pipelineSelectId.push(childLayer.Guid);
            } else if (layerType === "Folder") {
                var bFlagg = this.getPipelineSelectIds(childLayer);
                if (!bFlagg) {
                    bAllPipeline = false;
                }
            } else {
                bAllPipeline = false;
            }
        }
        if (bAllPipeline) {
            pipelineSelectId.push(layer.Guid);
        }
        return bAllPipeline;
    },
    /**
     * 功能：获取图层数据
     * 参数：layer-图层根节点
     * 返回值：图层数据数组
     */
    getLayerData: function(layer) {
        var layerData = [];
        var childCount = layer.GetChildCount();
        // if (layer.Guid === SYSTEMPARAMS.project) {//modified by zhangd
        for (var s = 0; s < childCount; s++) { //获取所有的管线图层ID集合，用于从基础图层中消除
            var childLayer = layer.GetChildAt(s);
            // var layerType = childLayer.LayerType;
            // if (layerType === "Pipeline") {
            //     pipelineSelectId.push(childLayer.Guid);
            // } else if (layerType === "Folder") {
            //     var childLayerF = childLayer.GetChildAt(0);
            //     var layerTypeF = childLayerF.LayerType;
            //     if (layerTypeF === "Pipeline") {
            //         pipelineSelectId.push(childLayer.Guid);
            //     }
            // }
            this.getPipelineSelectIds(childLayer); //modified by zhangd 修改基础图层显示，剔除管线图层，包括管线图层的根节点
        }
        // }
        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);
            var id = childLayer.Guid;
            var name = childLayer.Name;
            var visibility = childLayer.Visibility;
            var layerType = childLayer.LayerType;
            if (layerType === "Pipeline") {
                //PIPELINELAYERS.push({'id':id, 'name':name, 'server':childLayer.GISServer, 'pltype':childLayer.PipeLineType});
            } else if (layerType === "POI") {
                POILAYERS.push({
                    'id': id,
                    'name': name,
                    'server': childLayer.GISServer,
                    'pltype': childLayer.PipeLineType
                });
            }

            if (name == "equipment") {
                name = "附属设施";
            } else if (name == "container") {
                name = "管线";
            } else if (name == "well") {
                name = "井";
            } else if (name == "joint") {
                name = "附属点";
            } else if (name == "plate") {
                name = "井盖";
            } else if (name == "buffer") {
                childLayer.visibility = false;
            } else if (name == "room") {
                name = "井室";
            } else if (name == "container_og") {
                name = "地上管线"
            } else if (name == "joint") {
                name = "特征";
            } else if (name == "joint_og") {
                name == "地上特征";
            }

            var data = {};
            data.id = id;
            data.name = name;
            data.checked = visibility;
            data.type = layerType;
            data.icon = this.getLayerIcon(layerType);
            var count = childLayer.GetChildCount();
            layerData.push(data);
            if (count > 0) {
                // var b = 0;
                var bFlagPipeline = false;
                if (pipelineSelectId.length > 0) { //清除基础图层中所有的管线图层（基础图层中不应该包括管线图层）
                    for (var a = 0; a < pipelineSelectId.length; a++) {
                        if (pipelineSelectId[a] === childLayer.Guid) {
                            layerData.splice(layerData.length - 1, 1);
                            bFlagPipeline = true;
                            break;
                        }
                        /*else {
                                                    b++;
                                                    if (b < 2) {
                                                        data.children = this.getLayerData(childLayer);
                                                    }
                                                }*/
                    }
                    if (!bFlagPipeline) {
                        data.children = this.getLayerData(childLayer);
                    }
                } else {
                    data.children = this.getLayerData(childLayer);
                }
            }
        }
        return layerData;
    },

    /**
     * 功能：获取管线图层数据
     * 参数：layer-图层根节点
     * 返回值：图层管线数据数组
     */
    getPipelineLayerData: function(layer) {
        var layerData = [];
        var childCount = layer.GetChildCount();
        for (var i = 0; i < childCount; i++) {
            var childLayer = layer.GetChildAt(i);
            if (((Number(childLayer.Rtti) === 103 || Number(childLayer.Rtti) === 104)) && Number(layer.Rtti) != 114) { //BuildingLayer精模图层 BlockLayer白膜图层
                if (!(childLayer.getChildAt(0) && childLayer.getChildAt(0).name === "Equipment" && childLayer.getChildAt(1).name === "container" && childLayer.getChildAt(2).name === "well")) {
                    PIPEMODELLAYERS.push(childLayer);
                }
            }
            var id = childLayer.Guid;
            var name = childLayer.Name;
            if (name === "buffer") {
                //alert("buffer");
                childLayer.Visibility = false;
            }
            if (name === "model") { //根据当前项目的模型图层名称来判断模型图层
                //zhangd修改保存模型图层的方式，之前是只保存最外层模型图层，这里是保存所有子模型图层
                this.GetModelLayers(childLayer);
            }
            //如果是重点管线则添加到数组对象中 2014.1.6
            if (childLayer.KeyLine) {
                importPipeLines.push({
                    guid: childLayer.guid,
                    name: childLayer.name,
                    mScope: childLayer.MScope,
                    pScope: childLayer.PScope
                });
            }
            var visibility = childLayer.Visibility;
            var layerType = childLayer.LayerType;
            var count = childLayer.GetChildCount();
            if (count > 0) {
                if (layerType === "Project" || layerType === "Folder" || layerType === "Pipeline") {/* || layerType === "Pipeline"*/
                    var children = this.getPipelineLayerData(childLayer);
                    if (children.length > 0) {
                        var data = {};
                        data.id = id;
                        data.name = name;
                        data.checked = visibility;
                        data.icon = this.getLayerIcon(layerType);
                        data.children = children;
                        layerData.push(data);
                        PIPELINELAYERS.push({
                            'id': data.id,
                            'name': data.name,
                            'server': childLayer.GISServer,
                            'pltype': childLayer.PipeLineType,
                            customColor: childLayer.CustomColor
                        });
                        if (layerType === "Project") {
                            PROJECTLIST.push({
                                'id': id,
                                'name': name,
                                'server': childLayer.GISServer,
                                'pltype': childLayer.PipeLineType
                            });
                        }
                        if (layerType === "Folder") {
                            guihuaArr.push({
                                'id': id,
                                'name': name
                            });
                        }
                    }
                }
            } else { //添加Container_Og和Joint_Og架空管线，add by zhangd
                if ((layerType === "Container") || (layerType === "Container_Og") || (layerType === "Equipment") || (layerType === "Joint") || (layerType === "Joint_Og") || (layerType === "Well") || (layerType === "Plate") || (layerType === "Buffer") || (layerType.toUpperCase() === "ROOM") || (layerType === "Model_container") || (layerType === "Model_camera") || (layerType === "Model_catchment") || (layerType === "Model_equipment") || (layerType === "Model_plate") || (layerType === "Model_sensor") || (layerType === "Model_upperplate")) {
                    if (layerType === "Equipment") {
                        name = "附属设施";
                    } else if (layerType === "Container") {
                        name = "管线";
                    } else if (layerType === "Well") {
                        name = "井";
                    } else if (layerType === "Joint") {
                        name = "特征";
                        PIPELINELAYERS.push({
                            'id': id,
                            'name': name,
                            'server': childLayer.GISServer,
                            'pltype': childLayer.PipeLineType,
                            customColor: childLayer.CustomColor
                        });
                    } else if (layerType === "Plate") {
                        name = "井盖";
                    } else if (name === "buffer") { //这里为啥图层的name为buffer呢
                        childLayer.visibility = false;
                    } else if (layerType.toUpperCase() == "ROOM") {
                        name = "井室";
                    } else if (layerType === "Container_Og") {
                        name = "地上管线";
                    } else if (layerType === "Joint_Og") {
                        name = "地上特征";
                    }
                    var data = {};
                    data.id = id;
                    data.name = name;
                    data.checked = visibility;
                    data.icon = this.getLayerIcon(layerType);
                    layerData.push(data);
                }
            }
        }
        return layerData;
    },
    //初始化时保存所有模型图层
    GetModelLayers: function(layer) {
        var count = layer.GetChildCount();
        for (var i = 0; i < count; i++) {
            var childLayer = layer.GetChildAt(i);
            if (childLayer.GetChildCount() > 0) {
                this.GetModelLayers(childLayer);
            } else {
                var retLayer = {};
                retLayer.layer = childLayer;
                retLayer.guid = childLayer.Guid;
                retLayer.name = childLayer.Name;
                modelLayerList.push(retLayer);
            }
        }
    },

    /**
     * 功能：定位到选定的图层
     * 参数：lonLatRect-图层范围对象
     * 返回值：无
     */
    flyToLayer: function(earth, lonLatRect) {
        var rectNorth = lonLatRect.North;
        var rectSouth = lonLatRect.South;
        var rectEast = lonLatRect.East;
        var rectWest = lonLatRect.West;

        var centerX = (rectEast + rectWest) / 2;
        var centerY = (rectNorth + rectSouth) / 2;
        var width = (parseFloat(rectNorth) - parseFloat(rectSouth)) / 2;
        var range = width / 180 * Math.PI * 6378137 / Math.tan(22.5 / 180 * Math.PI);
        earth.GlobeObserver.FlytoLookat(centerX, centerY, 0, 0, 90, 0, range, 5);
    },

    /**
     * 功能: 图层树节点单击事件
     * 参数: event-标准的 js event 对象；
     *       treeId-对应图层树的Id；
     *       node-被单击的节点
     * 返回值: 无
     */
    layerTreeClick: function(earth, node) {
        CURRLAYERID = node.id;
        var tempLayer = earth.LayerManager.GetLayerByGUID(CURRLAYERID);
        if (tempLayer == null) {
            return;
        }
        // LookHere
        if ((tempLayer.PipeLineType >= 4000 && tempLayer.PipeLineType < 5000) || tempLayer.PipeLineType >= 7000 || (tempLayer.PipeLineType >= 6000 && tempLayer.PipeLineType <= 6500)) { // fire
            $("div[tag=ViewFlowShowing]").attr("disabled", false);
        } else {
            $("div[tag=ViewFlowShowing]").attr("disabled", true);
        }
        var MObj = $("div[tag='pipeMHidden']");
        var PObj = $("div[tag='pipePHidden']");
        if (tempLayer.KeyLine) {
            MObj.removeAttr("disabled");
            PObj.removeAttr("disabled");
        } else {
            MObj.attr("disabled", "disabled");
            PObj.attr("disabled", "disabled");
        }

        for (var i = 0; i < importPipeLines.length; i++) {
            if (importPipeLines[i].guid === CURRLAYERID) {
                if (importPipeLines[i].IsMOpen) {
                    MObj.addClass('selected');
                    PObj.removeClass('selected');
                } else if (importPipeLines[i].IsPOpen) {
                    PObj.addClass('selected');
                    MObj.removeClass('selected');
                } else {
                    MObj.removeClass('selected');
                    PObj.removeClass('selected');
                }
            }
        }

        // if(MObj.hasClass("selected") === true){
        //    MObj.removeClass("selected");
        // }
        // if(PObj.hasClass("selected") === true){
        //    PObj.removeClass("selected");
        // }
        //alert(treeId + "," + node.id+","+node.name);
    },

    /**
     * 功能：图层树节点双击击事件
     * 参数：event-标准的 js event 对象；
     *       treeId-对应图层树的Id；
     *       node-被双击击的节点
     * 返回值：无
     */
    layerTreeDbClick: function(earth, node) {
        if (node && node.id) {
            var id = node.id;
            var layerObj = earth.LayerManager.GetLayerByGUID(id);
            // if (layerObj.LayerType === "") {//2015-04-16新增倾斜图层，由于StampManager2尚未修改完，获取不到该图层的类型，故去掉图层类型判断
            //     return;
            // }
            var rect = layerObj.LonLatRect;
            this.flyToLayer(earth, rect); //定位图层
        }
    },

    /**
     * 功能：图层树节点 checkbox / radio 被勾选或取消勾选的事件
     * 参数：event-标准的 js event 对象；
     *       treeId-对应图层树的Id；
     *       node-被勾选或取消的节点
     * 返回值：无
     */
    layerTreeCheck: function(earth, node) {
        if (node && node.id) {
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    this.layerTreeCheck(earth, node.children[i]);
                }
            } else {
                var id = node.id;
                var layerObj = earth.LayerManager.GetLayerByGUID(id);
                if (node.type != null && (node.type.toLowerCase() === "map" || node.type.toLowerCase() === "wms")) {
                    if (node.checked) {
                        if ($("div[tag='ViewFullScreen2D']").hasClass("selected") === false && $("div[tag='ViewScreen2DLink']").hasClass("selected") === false) {
                            $("div[tag='ViewScreen2D']").addClass("selected");
                        }
                    } else {
                        var layers = [];
                        var rootLayer = LayerManagement.getRootLayer(earth);
                        var zNodes = LayerManagement.getLayerData(rootLayer);
                        layers = getWmsMapLayerLayers(zNodes, layers, node);
                        if (layers == null || layers.length == 0) {
                            $("div[tag='ViewScreen2D']").removeClass("selected");
                            if ($("div[tag='ViewFullScreen2D']").hasClass("selected") === true) {
                                fullScreen2DClick();
                            }
                        }
                    }
                }
                if(layerObj.LayerType == 'Pipeline'){
                    (typeof window.setLayerVisible == 'function') && window.setLayerVisible(layerObj.Name, node.checked);
                }
                layerObj.Visibility = node.checked;
            }
        }
    },

    showBufferNode: function(layerObj, node) {
        var mScope;
        var pScope;
        var fillColor;
        for (var i = 0; i < importPipeLines.length; i++) {
            var pID = importPipeLines[i].guid;
            if (pID === node.id) {
                mScope = importPipeLines[i].mScope;
                pScope = importPipeLines[i].mScope;
                fillColor = importPipeLines[i].fillColor;
            }
        }
        var eventObj = $("div[tag='pipeMHidden']");
        if (eventObj.hasClass("selected") === true) {
            layerObj.BufferDist = Number(mScope);
            layerObj.BufferColor = parseInt("0x" + fillColor);
            layerObj.ShowPipeLineBuffer(true);
        }
        var eventObj = $("div[tag='pipePHidden']");
        if (eventObj.hasClass("selected") === true) {
            layerObj.BufferDist = Number(pScope);
            layerObj.BufferColor = parseInt("0x" + fillColor);
            layerObj.ShowPipeLineBuffer(true);
        }
    },

    hideAllBuffers: function(earth) {
        // var rootLayer = earth.LayerManager.LayerList;
        var projectId = SYSTEMPARAMS.project;
        var layerObj = earth.LayerManager.GetLayerByGUID(projectId);
        //layerObj.Visibility = false;
        if (layerObj.GetChildCount() === 0) {
            layerObj.ShowPipeLineBuffer(false);
        } else {
            this.hideBufferLayer(layerObj);
        }
    },

    hideBufferLayer: function(layerObj) {
        var num = layerObj.GetChildCount();
        if (num > 0) {
            for (var i = num - 1; i >= 0; i--) {
                var layer = layerObj.GetChildAt(i);
                if (layer.name === "buffer") {
                    layerObj.ShowPipeLineBuffer(false);
                } else {
                    this.hideBufferLayer(layer);
                }
            };
        } else {
            //layerObj.ShowPipeLineBuffer(false);
        }
    },

    layerPipelineTreeCheck: function(earth, node) {
        var id;
        if (node.children.length > 0) {
            for (var i = 0; i < node.children.length; i++) {
                id = node.children[i].id;
                var layerObj = earth.LayerManager.GetLayerByGUID(id);
                layerObj.Visibility = node.checked;
            }

        }
    },

    /**
     * 功能：图层控制
     * 参数：无
     * 返回值：无
     */
    initLayerTree: function(earthObj, treeContainer) {
        var setting = {
            check: {
                enable: true, //是否显示checkbox或radio
                chkStyle: "checkbox" //显示类型,可设置(checbox,radio)
            },
            view: {
                dblClickExpand: false, //双击节点时，是否自动展开父节点的标识
                expandSpeed: "", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
                selectedMulti: false //设置是否允许同时选中多个节点
            },
            callback: {
                onClick: function(event, treeId, node) {
                    LayerManagement.layerTreeClick(earthObj, node);
                },
                onDblClick: function(event, treeId, node) {
                    // if(node && node.level === 1){
                    //     return;
                    // }
                    LayerManagement.layerTreeDbClick(earthObj, node);
                },
                onCheck: function(event, treeId, node) {
                    LayerManagement.layerTreeCheck(earthObj, node);
                }
            }
        };
        var rootLayer = this.getRootLayer(earthObj);
        var zNodes = this.getLayerData(rootLayer);
        // for (var s = 0; s < zNodes.length; s++) {
        //     if (zNodes[s].children == undefined && zNodes[s].children.length < 1) {
        //         zNodes.splice(s, 1);
        //     }
        // }

        //2013-12-20
        // if(zNodes[1].children[0].name === "建筑"){
        //     var len = zNodes[1].children.length;
        //     var building = zNodes[1].children[0];
        //     var model = building.children[0];//精模
        //     var simpleModel = building.children[1];//白模
        //     //精模处理
        //     for(var m = 0; m < model.children.length; m++){
        //         var obj = model.children[m];
        //         PIPEMODELLAYERS.push({id:obj.id,
        //             name:obj.name,
        //             type:obj.type
        //             });
        //     }
        //     //白模处理
        //     for(var n = 0; n < simpleModel.children.length; n++){
        //         var obj = simpleModel.children[n];
        //         PIPEMODELLAYERS.push({id:obj.id,
        //             name:obj.name,
        //             type:obj.type
        //             });
        //     }
        // }

        var tree = $.fn.zTree.init(treeContainer, setting, zNodes);
        return tree;
    },

    /**
     * 功能：图层控制
     * 参数：无
     * 返回值：无
     */
    initPipelineTree: function(earthObj, treeContainer) {
        var setting = {
            check: {
                enable: true, //是否显示checkbox或radio
                chkStyle: "checkbox" //显示类型,可设置(checbox,radio)
            },
            view: {
                dblClickExpand: false, //双击节点时，是否自动展开父节点的标识
                expandSpeed: "", //节点展开、折叠时的动画速度, 可设置("","slow", "normal", or "fast")
                selectedMulti: false //设置是否允许同时选中多个节点
            },
            callback: {
                onClick: function(event, treeId, node) {
                    LayerManagement.layerTreeClick(earthObj, node);
                },
                onDblClick: function(event, treeId, node) { //当双击定位的时候 针对重点管线进行特殊处理
                    var isNode = false;
                    //双击定位修改为判断图层的pipelineType
                    if (node && node.isParent) {
                        var layerID = node.id;
                        var dblLayer = earth.LayerManager.GetLayerByGUID(layerID);
                        if (dblLayer && dblLayer.pipelineType) {
                            var ppType = dblLayer.pipelineType;
                            if (Number(ppType) > 0) {
                                isNode = true;
                            }
                        } else {
                            return;
                        }
                    };
                    if (isNode) { //双击定位
                        LayerManagement.layerTreeDbClick(earthObj, node);
                    }
                },
                onCheck: function(event, treeId, node) {
                    LayerManagement.layerTreeCheck(earthObj, node);
                },
                onRightClick: function(event, treeId, node) {
                    //LayerManagement.rightClickuserdataTreeNode(event, treeId, node);
                }
            }
        };
        var rootLayer = this.getRootLayer(earthObj);
        var zNodes = [];
        var childCount = rootLayer.GetChildCount();
        for (var i = 0; i < childCount; i++) {
            var childLayer = rootLayer.GetChildAt(i);
            if (SYSTEMPARAMS.project === childLayer.Guid) {
                var children = this.getPipelineLayerData(childLayer);
                var data = {};
                data.id = childLayer.Guid;
                data.name = childLayer.Name;
                if (childLayer.Name === "buffer") {
                    //alert("buffer");
                    childLayer.visibility = false;
                }
                data.checked = childLayer.visibility;
                data.icon = this.getLayerIcon(childLayer.LayerType);
                data.children = children;
                zNodes.push(data);
            }
        }
        var tree = $.fn.zTree.init(treeContainer, setting, zNodes);
        //默认展开level为1的节点 2013-12-18
        var nodes = tree.getNodes();
        if (nodes[0] && nodes[0].children) {
            var child = nodes[0].children;
            for (var i = 0; i < child.length; i++) {
                var nChild = child[i];
                tree.expandNode(nChild, true);
            }
        }
        return tree;
    },

    //todo:这里要怎么判断呢???针对管线图层的右键
    rightClickuserdataTreeNode: function(event, treeId, node) {
        //这里要针对只有六个子类图层的父对象进行判断
        if (node && node.isParent) {
            var isNode = false;
            var childNum = node.children.length;
            for (var i = 0; i < childNum; i++) {
                if (node.children[0].name === "管线" && node.children[1].name === "特征" && node.children[2].name === "井") {
                    isNode = true;
                }
            }
            if (isNode) {
                $('#contextMenuUserdata').menu('show', {
                    left: event.pageX,
                    top: event.pageY
                });
            }
        }
    }
};
