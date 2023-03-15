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
        ctx.SFM.SfmLayerTreeManager = factory(ctx.$, ctx._, ctx.SFM.SfmResizableWidgetBase);
    }
})(function($, _, SfmResizableWidgetBase){

	var SfmLayerTreeManager = SfmResizableWidgetBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            var vod = me.getSfmUtil().valueOrDefault;
            me.data.config = vod(options, 'config', null);
            me.data.LM = me.doAction('map_getLayerManager');
            var t = vod(me.data.config, 'type', null);
            if(t){
                me.data.tree = me.data.LM.getLayerTreeByType(t);
            }else{
                me.data.tree = me.data.LM.getLayerTreeData();
            }
            me.data.control = vod(me.data.config, 'control', false);
            me.data.onTreeCheck = vod(options, 'onTreeCheck', null);
            me.data.control && me.addAction('getMapLayerKeys', me.getLayerKeys);
        },
        destroy: function() {
            this.data.control && this.removeAction('getMapLayerKeys');
        },
        render: function(options) {
            var me = this;
            var el = me._el = me.getSfmUtil().valueOrDefault(options, 'el', null) || me._el;
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
            return this.data.tree;
        },
        getLayerTreeData: function(){
            return this.data.LM.getLayerTreeData();
        },
        getLayerListByType: function(types){
            return this.data.LM.getLayerListByType(types);
        },
        getLayerListByNodeType: function(types){
            return this.data.LM.getLayerListByNodeType(types);
        },
        checkAll: function(checked){
            this.data.ztree.checkAllNodes(checked);
            return this;
        },
        zTreeOnCheck: function(event, treeId, treeNode) {
            if(typeof this.data.onTreeCheck == 'function') this.data.onTreeCheck(event, treeNode);
            if(!this.data.control) return;
            if(treeNode.type != this.data.LM.layerType.LAYER_TYPE_FOLDER) {
                this.data.LM.setLayerVisible(treeNode.id, null, treeNode.checked);
            }
            return this;
        },
        initTree: function() {
            var me = this;
            var control = me.data.control;
            var setting = {
                view: {
                    // selectedMulti: false
                },
                data: {
                    key: {
                        // checked: 'visible'
                    }
                },
                check: {
                    enable: true
                },
                callback: {
                    onCheck: $.proxy(me.zTreeOnCheck, me)
                }
            };

            var nodes = me.getLayerTreeData();
            me.data.ztree = $.fn.zTree.init(me.data.ui.$tree, setting, nodes);
            return me;
        },

        __className__: 'SfmLayerTreeManager'
    });

    return SfmLayerTreeManager;
}, window));
