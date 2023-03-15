((function(factory, ctx, undefined) {
    if ((typeof module) !== 'undefined' && module.exports) {
        var $ = require('jquery');
        var _ = require('underscore');
        var SfmWidgetBase = require('sfmWidgetBase');
        var OL2Helper = require('ol2Helper');
        require('openLayers2');
        module.exports = factory($, _, SfmWidgetBase, OL2Helper);
    } else if ((typeof define) === 'function' && define.amd) {
        define(['jquery', 'underscore', 'sfmWidgetBase', 'ol2Helper', 'openLayers2'], factory);
    } else {
        if (ctx.SFM == undefined) {
            ctx.SFM = {};
        }
        ctx.SFM.MapMeasureWidget = factory(ctx.$, ctx._, ctx.SFM.SfmWidgetBase, ctx.SFM.OL2Helper);
    }
})(function($, _, SfmWidgetBase, OL2Helper) {
    var MEASURE_TIP = '单点确定地点,双击结束';

    var POINT_STYLE = {
        pointRadius: 4,
        strokeColor: '#ff0000',
        strokeOpacity: 1,
        strokeWidth: 1,
        fillColor: '#ff0000',
        fillOpacity: 0.3,
        labelXOffset: 10,
        labelAlign: 'lm',
        fontColor: '#ff0000'
    };
    var LABEL_STYLE = {};
    var LINE_STYLE = {
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWidth: 3,
        fillColor: '#ff0000',
        fillOpacity: 0.4
    };

    var MapMeasureWidget = SfmWidgetBase.extend({
        constructor: function(options) {
            var me = this;
            me.base(options);
            var vod = me.getSfmUtil().valueOrDefault;
            me.data.config = vod(options, 'config', null);
            me.data.map = me.doAction('getMap');
            me.data.ol2Helper = new OL2Helper(me.data.map);
            me.data.immediate = vod(me.data.config, 'immediate', true);
            me.data.meaResults = [];
            me.data.closeImg = me.getSfmUtil().getHostUrl() + '/images/modules/red_close.gif';
        },
        destroy: function() {
            this._unbindEvents();
            this.data.ol2Helper.quit();
            this.base();
        },
        render: function(options) {
            var me = this;
            var vod = me.getSfmUtil().valueOrDefault;
            var el = me._el = vod(options, 'el', null) || me._el;
            me.data.hasUi = (el && el.length > 0);
            if (me.data.hasUi) {
                var _id = me.getId();
                var h = '<div id="mapMeasureWidget_c_' + _id + '" class="mapMeasureWidget-container">' +
                    '<button id="mapMeasureWidget_mLength_' + _id + '" class="btn btn-small btn-info">长度</button>' +
                    '<button id="mapMeasureWidget_mArea_' + _id + '" class="btn btn-small btn-info">面积</button>' +
                    '<button id="mapMeasureWidget_mClear_' + _id + '" class="btn btn-small btn-success">清理</button>' +
                    '</div>';
                el.html(h);
            }

            me._init()._bindEvents();
            if (me.data.hasUi) {
                if (vod(me.data.config, 'showUi', false)) {
                    me.data.ui.$c.show();
                } else {
                    me.data.ui.$c.hide();
                }
                if (vod(me.data.config, 'showLengthBtn', true)) {
                    me.data.ui.$ml.show();
                } else {
                    me.data.ui.$ml.hide();
                }
                if (vod(me.data.config, 'showAreaBtn', true)) {
                    me.data.ui.$ma.show();
                } else {
                    me.data.ui.$ma.hide();
                }
            }
            return me;
        },
        beginMeasure: function(type) {
            var me = this;
            me.stopMeasure();
            me.data.cmk = me.getSfmUtil().fguid();
            me.data.meaResults.push({
                key: me.data.cmk,
                points: []
            });
            me.data.ol2Helper.measure(type, {
                immediate: true
            });
            me.data.ct = type;
            if (me.data.hasUi) {
                if (type == 'line') {
                    me.data.ui.$ma.removeClass('active');
                    me.data.ui.$ml.addClass('active');
                } else {
                    me.data.ui.$ml.removeClass('active');
                    me.data.ui.$ma.addClass('active');
                }
            }
            return me;
        },
        stopMeasure: function() {
            var me = this;
            if (me.data.cmk) {
                me._removeResult(me.data.cmk);
                me.data.cmk = null;
            }
            me.data.ol2Helper.stopMeasure();
            me.data.ct = null;
            if (me.data.hasUi) {
                me.data.ui.$ml.removeClass('active');
                me.data.ui.$ma.removeClass('active');
            }
            return me;
        },
        removeAllResult: function() {
            this.data.meaResults.splice(0, this.data.meaResults.length);
            this.data.ol2Helper.removeAllFeatures(this._ln());
            if (this.data.ct) {
                this.beginMeasure(this.data.ct);
            }
            return this;
        },

        _init: function() {
            var me = this;
            me.data.ui = {};
            if (me.data.hasUi) {
                me.data.ui.$c = me.j('c');
                me.data.ui.$ml = me.j('mLength');
                me.data.ui.$ma = me.j('mArea');
                me.data.ui.$mc = me.j('mClear');
            }
            me.data.ol2Helper.addTempLayer(me._ln()).events.on({
                featureclick: function(e) {
                    if (e.feature.attributes.type == 'del') {
                        me._removeResult(e.feature.attributes.key);
                    }
                }
            });
            return me;
        },
        _bindEvents: function() {
            var me = this;

            var f = function(event, type, isEnd) {
                var m = event.stmeasure;
                var u = me._unit(event.stunits);
                var l = m.toFixed(3);
                var t = 'length';
                if (type == 'line') {
                    l += u;
                } else if (type == 'polygon') {
                    l += '平方' + u;
                    t = 'area';
                }
                me._addResult(event.geometry, l, type, t, isEnd);
            };
            me.data.ol2Helper.onMeasure = function(event, type) {
                f(event, type, true);
            };
            me.data.ol2Helper.onMeasurePartial = function(event, type) {
                f(event, type, false);
            };

            if (me.data.hasUi) {
                me.data.ui.$ml.on('click', function() {
                    me.beginMeasure('line');
                });
                me.data.ui.$ma.on('click', function() {
                    me.beginMeasure('polygon');
                });
                me.data.ui.$mc.on('click', function() {
                    me.stopMeasure();
                    me.removeAllResult();
                });
            }
            return me;
        },
        _unbindEvents: function() {
            var me = this;
            if (me.data.hasUi) {
                me.data.ui.$ml.off('click');
                me.data.ui.$ma.off('click');
                me.data.ui.$mc.off('click');
            }
            return me;
        },
        _addResult: function(geometry, label, measureType, type, isEnd) {
            var me = this;
            if (!me.data.cmk) {
                return me;
            }
            var r = _.findWhere(me.data.meaResults, { key: me.data.cmk });
            if (!r) {
                return me;
            }
            var ps = r.points;
            var vs = geometry.getVertices();
            if (vs.length == 0) {
                return me;
            }
            var oh = me.data.ol2Helper;
            var l = '';
            var tt = type == 'length' ? '总长' : '面积';
            var p = null;
            if (ps.length == 0) {
                l = '起点';
            } else {
                if (me.data.immediate) {
                    p = ps.pop();
                    oh.removeFeatures(me._ln(), [p.point]);
                }
                l = (type == 'length' ? label : '');
            }
            var n = vs.length - 2;
            if (n < 0 || isEnd) {
                n = vs.length - 1;
            }
            p = vs[n];
            n = ps.length - 1;
            if (ps.length == 0 || ps[n].x != p.x || ps[n].y != p.y) {
                // var geo = new OpenLayers.Geometry.Point(p.x, p.y);
                // var f1 = new OpenLayers.Feature.Vector(geo, null, $.extend({}, POINT_STYLE, { label: l }));
                // var f2 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(p.x, p.y), null, {
                //     label: l,
                //     labelXOffset: 10,
                //     labelAlign: 'lm',
                //     fontColor: '#ff0000'
                // });
                var f1 = oh.createPoint(p, null, $.extend({}, POINT_STYLE, { label: l }));
                oh.addFeatures(me._ln(), [f1]);
                var f3 = null;
                if (ps.length > 0) {
                    // var geoline = new OpenLayers.Geometry.LineString([ps[n].point.geometry, geo]);
                    // f3 = new OpenLayers.Feature.Vector(geoline, null, LINE_STYLE);
                    f3 = oh.createPolyline([ps[n].point.geometry, p], null, LINE_STYLE);
                    oh.addFeatures(me._ln(), [f3]);
                }
                ps.push({
                    x: p.x,
                    y: p.y,
                    point: f1,
                    label: null,
                    line: f3
                });
            }
            if (me.data.immediate || isEnd) {
                var s = {
                    label: tt + ':' + label + '\n' + MEASURE_TIP,
                    labelXOffset: 10,
                    // labelYOffset: 10,
                    labelAlign: 'lm',
                    fontColor: '#ff0000'
                };
                if (isEnd) {
                    if (measureType == 'line') {
                        var pp = ps.pop();
                        var a = [];
                        if (pp.point) {
                            a.push(pp.point);
                        }
                        if (pp.label) {
                            a.push(pp.label);
                        }
                        if (pp.line) {
                            a.push(pp.line);
                        }
                        oh.removeFeatures(me._ln(), a);
                    }

                    s = $.extend({}, POINT_STYLE, { label: tt + ':' + label });
                }
                p = vs[vs.length - 1];
                // var geo = new OpenLayers.Geometry.Point(p.x, p.y);
                var o = {
                    x: p.x,
                    y: p.y,
                    point: oh.createPoint(p, null, s) // new OpenLayers.Feature.Vector(geo, null, s)
                };
                oh.addFeatures(me._ln(), o.point);
                ps.push(o);
                if (isEnd) {
                    // o.gra = new OpenLayers.Feature.Vector(geometry, null, LINE_STYLE);
                    o.gra = oh.feature(geometry, null, LINE_STYLE);
                    me._removeLine();
                    oh.addFeatures(me._ln(), [o.gra]);
                    var ox = 10;
                    var oy = -25;
                    if (ps.length > 1) {
                        if (ps[ps.length - 2].x > p.x) {
                            ox = -27;
                            // oy = 0;
                        }
                    }
                    var ck = me.data.cmk;
                    // o.del = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(p.x, p.y), {
                    //     type: 'del',
                    //     key: ck,
                    //     eventListeners: {
                    //         featureclick: function(e) {
                    //             me._removeResult(ck);
                    //         }
                    //     }
                    // }, {
                    //     // label: 'x',
                    //     // labelXOffset: ox,
                    //     // labelYOffset: oy,
                    //     cursor: 'pointer',
                    //     // fontColor: '#ff0000',
                    //     pointerEvents: 'visiblePainted',
                    //     graphicWidth: 17,
                    //     graphicHeight: 17,
                    //     graphicXOffset: ox,
                    //     graphicYOffset: oy,
                    //     externalGraphic: me.data.closeImg
                    // });
                    if(me.getSfmUtil().valueOrDefault(me.data.config, 'delBtn', true)){
                        o.del = oh.createPoint(p, {
                            type: 'del',
                            key: ck,
                            eventListeners: {
                                featureclick: function(e) {
                                    me._removeResult(ck);
                                }
                            }
                        }, {
                            // label: 'x',
                            // labelXOffset: ox,
                            // labelYOffset: oy,
                            cursor: 'pointer',
                            // fontColor: '#ff0000',
                            pointerEvents: 'visiblePainted',
                            graphicWidth: 17,
                            graphicHeight: 17,
                            graphicXOffset: ox,
                            graphicYOffset: oy,
                            externalGraphic: me.data.closeImg
                        });
                        // o.del = new OpenLayers.Marker(new OpenLayers.LonLat(p.x, p.y),
                        //     new OpenLayers.Icon('/images/modules/red_close.gif',
                        //         new OpenLayers.Size(17, 17), new OpenLayers.Pixel(ox, oy)));
                        // o.del.events.register("click", o.del, function (e) {
                        //     me._removeResult(ck);
                        // });
                        // oh.getTempLayer(me._ln()).addMarker(o.del);
                        oh.addFeatures(me._ln(), [o.del]);
                    }
                    me.data.cmk = null;
                    if (me.getSfmUtil().valueOrDefault(me.data.config, 'autoStop', true)) {
                        me.stopMeasure();
                    } else {
                        me.beginMeasure(measureType);
                    }
                }
            }
            return me;
        },
        _removeResult: function(key) {
            var me = this;
            if (!key) {
                return me;
            }
            var rs = me.data.meaResults;
            for (var i = 0; i < rs.length; i++) {
                if (rs[i].key == key) {
                    var r = rs.splice(i, 1)[0];
                    var a = [];
                    while (r.points.length > 0) {
                        var p = r.points.pop();
                        if (p.point) {
                            a.push(p.point);
                        }
                        if (p.label) {
                            a.push(p.label);
                        }
                        if (p.line) {
                            a.push(p.line);
                        }
                        if (p.gra) {
                            a.push(p.gra);
                        }
                        if (p.del) {
                            a.push(p.del);
                        }
                    }
                    me.data.ol2Helper.removeFeatures(me._ln(), a);
                    return me;
                }
            }
            return me;
        },
        _removeLine: function() {
            var me = this;
            if (!me.data.cmk) {
                return me;
            }
            var r = _.findWhere(me.data.meaResults, { key: me.data.cmk });
            if (!r) {
                return me;
            }
            var ps = r.points;
            var a = [];
            for (var i = 0; i < ps.length; i++) {
                if (ps[i].line) {
                    a.push(ps[i].line);
                    delete ps[i].line;
                }
            }
            me.data.ol2Helper.removeFeatures(me._ln(), a);
            return me;
        },
        _unit: function(u) {
            if (u == 'm') {
                return '米';
            } else if (u == 'km') {
                return '公里';
            }
            return '';
        },
        _ln: function() {
            return (this.data.ln || (this.data.ln = this.getPrefix() + '_' + this.getSfmUtil().fguid()));
            if (!this.data.ln) {
                this.data.ln = this.getPrefix() + '_' + this.getSfmUtil().fguid();
            }
            return this.data.ln;
        },

        __className__: 'MapMeasureWidget'
    });

    return MapMeasureWidget;
}, window));
