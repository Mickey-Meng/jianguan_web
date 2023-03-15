(function(factory, context, undefined) {
    if (typeof module != 'undefined' && module.exports) {
        module.exports = factory();
    } else if(typeof define == 'function' && define.amd) {
        define([], function() {
            return factory();
        });
    } else {
        if(context.SFM == undefined){
            context.SFM = {};
        }
        var oldRef = context.SFM.SfmEventManager;
        context.SFM.SfmEventManager = factory(oldRef, context);
    }
})(function(oldRef, context) {
    var VERSION = '0.0.1';
    var FIRE_ONCE_EVENTS = ['LBDown', 'LBUp', 'RBDown', 'MBDown'];

    var earth = null;
    var _events = {};

    var SfmEventManager = function(options){
        if(!(this instanceof SfmEventManager)){
            return new SfmEventManager(options);
        }

        this.initialize(options);
    }

    SfmEventManager.prototype = {
        initialize: function(options) {
            earth = options.earth;
        },
        on: function(name, callback, context, times, filter) {
            var me = this;
            var events = _events;
            if (!earth || !events) {
                return me;
            }
            var en = name;
            if (!en) {
                return me;
            }
            var cb = callback;
            if (typeof cb != 'function') {
                return me;
            }
            var fireOnceEvents = FIRE_ONCE_EVENTS;
            var cbs = events[en] || (events[en] = []);
            var info = '__info_' + en + '__';
            if (cbs.length == 0) {
                var _ecb = function() {
                    var args = arguments;
                    for (var i = 0; i < cbs.length; i++) {
                        var tf = cbs[i].filter;
                        if (tf) {
                            if (typeof tf == 'function') {
                                var fr = tf.apply(context, args);
                                if (!fr) {
                                    continue;
                                }
                            }
                        }
                        var cbi = cbs[i];
                        var ci = cbi.callback[info];
                        if (ci.times > 0) {
                            ci.times--;
                        }
                        cbi.callback.apply(cbi.ctx, args);
                        if (ci.times == 0) {
                            cbs.splice(i, 1);
                            i--;
                        }
                    }
                    if ($.inArray(en, fireOnceEvents) >= 0) {
                        // earth.Event['On' + en] = _ecb;
                        // if (en == 'LBDown') {
                        //     earth.Event.OnLBUp = function() {
                        //         earth.Event.OnLBDown = _ecb;
                        //     };
                        // }
                        window.setTimeout(function() {
                            earth.Event['On' + en] = _ecb;
                        }, 20);
                    }
                }
                earth.Event['On' + en] = _ecb;
            }
            if (typeof cb == 'function') {
                if (cb[info] == null) {
                    cb[info] = {
                        id: en + '_' + earth.Factory.CreateGuid() + '_' + new Date().getTime(),
                        times: times || -1
                    };
                    cbs.push({
                        callback: cb,
                        context: context,
                        ctx: context || me,
                        filter: filter
                    });
                } else {
                    var i = 0;
                    for (i = 0; i < cbs.length; i++) {
                        if (cbs[i].callback[info].id == cb[info].id) {
                            // cbs.splice(i, 1, cb);
                            break;
                        }
                    }
                    if (i == cbs.length) {
                        cbs.push({
                            callback: cb,
                            context: context,
                            ctx: context || me
                        });
                    }
                }
            }
            return me;
        },
        once: function(name, callback, context, filter) {
            var me = this;
            me.on(name, callback, context, 1, filter);
            return me;
        },
        off: function(name, callback, context) {
            var me = this;
            var events = _events;
            if (!earth || !events) {
                return me;
            }
            var en = name;
            var cb = callback;
            if (!en) {
                if (context) {
                    for (var e in events) {
                        var cbs = events[e];
                        for (var i = 0; i < cbs.length; i++) {
                            if (cbs[i].context && cbs[i].context == context) {
                                cbs.splice(i, 1);
                                i--;
                            }
                        }
                    }
                    return me;
                }
                for (var i in events) {
                    delete events[i];
                }
                return me;
            }
            var cbs = events[en] || (events = []);
            if (!cb) {
                if (context) {
                    for (var i = 0; i < cbs.length; i++) {
                        if (cbs[i].context && cbs[i].context == context) {
                            cbs.splice(i, 1);
                            i--;
                        }
                    }
                    return me;
                }
                cbs.splice(0, cbs.length);
                return me;
            }
            var info = '__info_' + en + '__';
            for (var i = 0; i < cbs.length; i++) {
                if (cb[info] && cbs[i].callback[info].id == cb[info].id) {
                    if (context && cbs[i].context && context !== cbs[i].context) {
                        continue;
                    }
                    cbs.splice(i, 1);
                    i--;
                }
            }
            if (cbs.length == 0) {
                delete events[en];
            }
            return me;
        }
    };

    return SfmEventManager;
}, this);
