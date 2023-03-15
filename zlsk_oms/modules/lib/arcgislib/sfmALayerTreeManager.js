((function(factory, ctx, undefined){
	if ((typeof module) !== 'undefined' && module.exports) {
		var $ = require('jquery');
		var _  = require('underscore');
        require('jquery_zTree');
		var SfmResizableWidgetBase = require('sfmResizableWidgetBase');
        module.exports = factory($, _, SfmResizableWidgetBase);
    } else if ((typeof define) === 'function' && define.amd) {
        define(['jquery', 'underscore', 'sfmResizableWidgetBase', 'jquery_zTree'], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.SfmALayerTreeManager = factory(ctx.$, ctx._, ctx.SFM.SfmResizableWidgetBase);
    }
})(function($, _, SfmResizableWidgetBase){

	var SfmALayerTreeManager = SfmResizableWidgetBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            var vod = me.getSfmUtil().valueOrDefault;
            me.data.config = vod(options, 'config', null);
            me.data.layerManager = me.doAction('map_getLayerManager');
            me.data.tree = me.data.layerManager.getLayerTree();
            me.data.control = vod(me.data.config, 'control', true);
            me.data.enableCheck = vod(me.data.config, 'enableCheck', true);
            me.data.radio = vod(me.data.config, 'radio', false);
            me.data.radioType = vod(me.data.config, 'radioType', 'all');    // all | level
            me.data.onTreeCheck = vod(options, 'onTreeCheck', null);
            me.data.onTreeNodeClick = vod(options, 'onTreeNodeClick', null);
            me.data.onBeforeTreeNodeClick = vod(options, 'onBeforeTreeNodeClick', null);
        },
        destroy: function() {
            this.base();
        },
        render: function(options) {
            var me = this;
            var el = me._el || (me._el = me.getSfmUtil().valueOrDefault(options, 'el', null));
            if (el.length == 0) {
                return me;
            }
            me.data.ui = {};
            me.data.ui.$container = $('<div style="height:100%;overflow:auto;"><ul id="layerTreeWidget_' + me.getId() + '" class="ztree"></ul></div>');
            me.data.ui.$tree = me.data.ui.$container.find('ul')
            el.html(me.data.ui.$container);

            me.initTree();
            me.base();
            return me;
        },
        setControl: function(flag) {
            this.data.control = !!flag;
            return this;
        },
        getLayerTree: function(){
            return this.data.ztree;
        },
        getLayerTreeData: function(){
            return this.data.layerManager.getLayerTree();
        },
        checkAll: function(checked){
            this.data.ztree.checkAllNodes(checked);
            return this;
        },
        zTreeOnCheck: function(event, treeId, treeNode) {
            if(typeof this.data.onTreeCheck == 'function'){
                if(this.data.onTreeCheck(event, treeNode) === false){
                    return this;
                }
            }
            if(!this.data.control) return;
            var lm = this.data.layerManager;
            if(!lm.isFolder(treeNode)){
                if(lm.isDynamicLayer(treeNode)){
                    this._setDynamicLayerVisible(treeNode);
                }else if(lm.isDynamicSLayer(treeNode)){
                    this._setDynamicLayerVisible(this._getParentDynamicLayerNode(treeNode));
                }else{
                    // var lo = this.data.layerManager.getLayerByNode(treeNode);
                    // lo && lo.layer && lo.layer.setVisibility(treeNode.checked);
                    this.data.layerManager.setLayerVisible(treeNode.layerId, null, treeNode.checked);
                }
            }
            return this;
        },
        initTree: function() {
            var me = this;
            var setting = {
                view: {
                    selectedMulti: false
                },
                data: {
                    key: {
                        // checked: 'visible'
                    }
                },
                check: {
                    enable: !!me.data.enableCheck,
                    chkStyle: !!me.data.radio ? 'radio' : 'checkbox',
                    radioType: me.data.radioType
                },
                callback: {
                    onCheck: $.proxy(me.zTreeOnCheck, me),
                    beforeClick: function(treeId, treeNode, clickFlag){
                        if(typeof me.data.onBeforeTreeNodeClick == 'function'){
                            return me.data.onBeforeTreeNodeClick(treeId, treeNode, clickFlag);
                        }
                    },
                    onClick: function(event, treeId, treeNode, clickFlag){
                        if(typeof me.data.onTreeNodeClick == 'function'){
                            me.data.onTreeNodeClick(event, treeId, treeNode, clickFlag);
                        }
                    }
                }
            };

            var nodes = me.getLayerTreeData();
            me.data.ztree = $.fn.zTree.init(me.data.ui.$tree, setting, nodes);
            return me;
        },

        _getParentDynamicLayerNode: function(node){
            var n = node;
            while(n && !this.data.layerManager.isDynamicLayer(n)){
                n = n.getParentNode();
            }
            return n;
        },
        _setDynamicLayerVisible: function(node){
            var lo = this.data.layerManager.getLayerByNode(node);
            if(!lo){
                return;
            }
            var ns = this.data.ztree.getNodesByFilter(function(node){
                return node.checked;
            }, false, node);
            var a = [];
            if(ns.length == 0){
                a.push(-1);
            }else{
                for(var i = 0;i < ns.length;i++){
                    a.push(ns[i].layerId);
                }
            }
            // lo.layer.setVisibility(node.checked);
            // lo.layer.setVisibleLayers(a);
            this.data.layerManager.setLayerVisible(node.layerId, null, node.checked, a);
        },

        __className__: 'SfmALayerTreeManager'
    });

    return SfmALayerTreeManager;
}, window));
