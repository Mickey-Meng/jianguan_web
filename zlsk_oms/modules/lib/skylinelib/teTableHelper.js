(function(ctx, $){
	ctx.SFM.TeTableHelper = ctx.SFM.TableHelper.extend({
		constructor: function(options){
	        var me = this;
	        me.base(options);
	        me.data.keyField = options.keyField || 'key';
	        me.data.queryKeyField = options.queryKeyField || 'ST_KEY';
	        me.data.teHelper = options.teHelper;
	        me.data.hlMgr = options.highlightMgr;
	        me.data.popMgr = options.popupMgr;
	        me.data.cb.onDblClick = options.onDblClick || me._onRowDblClick;
	        me.data.el.$chkShowResult = options.chkShowResult;
	        me.data.el.$chkDetail = options.chkDetail;
	        if(me.data.el.$chkShowResult){
	        	me.data.el.$chkShowResult.on('click', function(){
	        		me.showResult(this.checked);
	        	});
	        }
	        if(me.data.el.$chkDetail){
	        	me.data.el.$chkDetail.on('click', function(){
	        		if(!this.checked){
	        			me.clearPopup();
	        		}
	        	});
	        }
	    },
	    setData: function(data, geometry,layername){
	        this.base(data);
	        this.data.curGeom = geometry;
	        this.data.layername = layername;
	        delete this.data.features;
	        return this;
	    },
	    clear: function(){
	    	this.showResult(false);
	        this.data.curGeom = null;
	        this.base();
	        return this;
	    },
	    clearHighlight: function(){
		    this.data.hlMgr && this.data.hlMgr.clearHighlight();
		},
		clearPopup: function(){
		    this.data.popMgr && this.data.popMgr.clearPopups();
		},
		showPopup: function(content){
		    this.data.popMgr.createPopup({
		        title: '属性',
		        width: 275,
		        height: 340,
		        align: 'Top Right',
		        html: content
		    });
		},

		showResult: function(isShow){
			var me = this;
			me.clearHighlight();
			if(isShow){
				if(!me.data.features){
					me.data.features = [];
					var lkl = [];
					var km = {};
					var d = me.data.data;
					for(var i = 0;i < d.length;i++){
						var lk = d[i].layerKey;
						var k = d[i][me.data.keyField];
						if(d[i].hlWhenShowAll === false){
							continue;
						}
						if($.inArray(lk, lkl) < 0){
							lkl.push(lk);
							km[lk] = [];
						}
						km[lk].push(k + '');
					}
					for(var i = 0;i < lkl.length;i++){
						var lk = lkl[i];
						var fa = me.data.teHelper.searchFeaturesByLayerKey(earth, lk, {geometry: me.data.curGeom}, km[lk]);
						if(fa && fa.length > 0){
							while(fa.length > 0){
								me.data.features.push(fa.pop());
							}
							// me.data.features.push.apply(ctx, fa);
						}
					}
				}
				for(var i = 0;i < me.data.features.length;i++){
					me.data.hlMgr.showHighlight(me.data.features[i], false, false);
				}
			}
			return me;
		},

	    _onRowDblClick: function(data, rowIndex){
	    	var me = this;
		    me.clearHighlight();
		    me.clearPopup();
		    var lk = data.layerKey;
		    var k = data[me.data.keyField];
		    if(data.data){
			    var fa = me.data.teHelper.getPipeFeaturesFromLayer(earth, lk, data.data.geometry.geometryText,
			    	data.data.attributes[me.data.queryKeyField],me.data.layername);
			    if(fa && fa.length > 0){
	                me.data.hlMgr.showHighlight(fa[0], false, true);
	            }
			    if(me.data.el.$chkDetail[0].checked){
			        var h = SFM.reqHelper.getAttrHtml2(data.data.fields, data.data.attributes);
			        me.showPopup(h);
			    }
			    return;
			}

		    SFM.reqHelper.queryByField(lk, k, me.data.queryKeyField).then(function(data){
	            var d = data.getMe && data.getMe[0];
	            if(!d){
	                return;
	            }
	            var fa = me.data.teHelper.getPipeFeaturesFromLayer(earth, lk, d.geometry.geometryText, k,me.data.layername);
	            if(fa && fa.length > 0){
	                me.data.hlMgr.showHighlight(fa[0], false, true);
	            }

	            if (me.data.el.$chkDetail[0].checked){
	                var h = SFM.reqHelper.getAttrHtml2(d.fields, d.attributes);
	                me.showPopup(h);
	            }
	        });
		},
	    destroy: function(){
	    	this.data.el.$chkShowResult && this.data.el.$chkShowResult.off('click');
	        this.base();
	    }
	});
})(window, jQuery);
