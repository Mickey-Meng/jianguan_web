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
        var oldRef = context.SFM.SfmBalloonManager;
        context.SFM.SfmBalloonManager = factory(oldRef, context);
    }
})(function(oldRef, context) {
    var DEFAULT_BALLOON_WIDTH = 280;
    var DEFAULT_BALLOON_HEIGHT = 340;

    var _attr = function(o, k, v) {
        try {
            var ks = k.split('.');
            if (!o) {
                o = {};
            }
            var ot = o;
            var i = 0;
            for (i = 0; i < ks.length - 1; i++) {
                if (!ot[ks[i]]) {
                    ot[ks[i]] = {};
                }
                ot = ot[ks[i]];
            }
            if (typeof v != 'undefined') {
                ot[ks[i]] = v;
            }
            return ot[ks[i]];
        } catch (e) {

        }

        return undefined;
    }

    var _valueOrDefault = function(obj, property, defaultValue) {
        try {
            if (!obj) {
                return defaultValue;
            }
            var val = _attr(obj, property);
            if (typeof val == 'undefined') {
                return defaultValue;
            }
            return val;
        } catch (e) {
            return defaultValue;
        }
    }

    var _emptyFunc = function() {};

    var SfmBalloonManager = function(options){
        if(!(this instanceof SfmBalloonManager)){
            return new SfmBalloonManager(options);
        }

        this.initialize(options);
    };

    SfmBalloonManager.prototype = {
        initialize: function(options){
            var me = this;
            me.data = {};
            me.data.earth = options.earth;
            var em = me.data.eventMgr = options.eventManager;
            me.data.bs = [];
            // em.on('HtmlBalloonFinished', me._onHtmlBalloonFinished, me);
        },
        showBalloon: function(options){
            var me = this;
            if(!options){
                return me;
            }
            var x = _valueOrDefault(options, 'x', null);
            var y = _valueOrDefault(options, 'y', null);
            var z = _valueOrDefault(options, 'z', null);
            if(isNaN(x) || isNaN(y)){
                return me;
            }
            var w = _valueOrDefault(options, 'width', DEFAULT_BALLOON_WIDTH);
            var h = _valueOrDefault(options, 'height', DEFAULT_BALLOON_HEIGHT);
            var a = _valueOrDefault(options, 'alpha', -1);
            var guid = me.data.earth.Factory.CreateGUID();
            var name = _valueOrDefault(options, 'name', '');
            var p = me.data.earth.Factory.CreateHtmlBalloon(guid, name);
            p.SetRectSize(w, h);
            if(a < 0){
                p.SetIsTransparence(false);
            }else{
                p.SetIsTransparence(true);
                p.SetBackgroundAlpha(a);
            }
            if(z != null){
                p.SetSphericalLocation(x, y, z);
            }else{
                p.SetScreenLocation(x, y);
            }
            p.SetTailColor(_valueOrDefault(options, 'tailColor', 0xffffff00));
            p.SetIsAddCloseButton(_valueOrDefault(options, 'closable', true));
            p.SetIsAddMargin(_valueOrDefault(options, 'roundCorner', true));
            p.SetIsAddBackgroundImage(!_valueOrDefault(options, 'draggable', false));
            var pm = _valueOrDefault(options, 'placement', null);
            if(pm != null){
                p.SetBalloonPosType(pm);
            }
            var bgc = _valueOrDefault(options, 'backgroundColor', null);
            var bdc = _valueOrDefault(options, 'blendColor', null);
            if(bgc != null){
                p.SetBackgroundRGB(bgc);
            }
            if(bdc != null){
                p.SetBlendColor(bdc);
            }
            var f = _valueOrDefault(options, 'focus', false);
            if(f == true){
                p.SetIsFocusAtShow(f);
            }
            var fg = 0;
            var en = null;
            if(options.content != null){
                en = 'DocumentReadyLoading';
            }else if(options.url){
                en = 'DocumentReadyCompleted';
                fg = 1;
            }
            var cb = _valueOrDefault(options, 'onReady', null);
            if(typeof cb == 'function'){
                me.data.eventMgr.on(en, cb, p, -1, function(id){
                    return id == guid;
                });
            }
            var cbHide = _valueOrDefault(options, 'onHide', null);
            if(typeof cbHide == 'function'){
                me.data.eventMgr.on('HtmlBalloonFinished', cbHide, p, -1, function(id){
                    return id == guid;
                });
            }
            if(fg == 0){
                p.ShowHtml(options.content);
            }else if(fg == 1){
                p.ShowNavigate(options.url);
            }
            var po = {
                id: guid,
                balloon: p,
                onReady: cb,
                onHide: cbHide,
                type: fg
            };
            me.data.bs.push(po);
            return po;
        },
        getBalloon: function(id){
            var me = this;
            var bs = me.data.bs;
            for(var i = 0;i < bs.length;i++){
                var bi = bs[i];
                if(bi.id == id){
                    return bi;
                }
            }
            return null;
        },
        remove: function(id){
            var me = this;
            var bs = me.data.bs;
            var em = me.data.eventMgr;
            for(var i = 0;i < bs.length;i++){
                var bi = bs[i];
                if(bi.id == id){
                    var b = bs.splice(i, 1)[0];
                    if(typeof b.onReady == 'function'){
                        var en = 'DocumentReadyLoading';
                        if(b.type == 1){
                            en = 'DocumentReadyCompleted';
                        }
                        em.off(en, b.onReady, b.balloon);
                    }
                    if(typeof b.onHide == 'function'){
                        em.off('HtmlBalloonFinished', b.onHide, b.balloon);
                    }
                    if(b.balloon != null){
                        b.balloon.DestroyObject();
                        delete b.balloon;
                    }
                    i--;
                }
            }
            return me;
        },
        clear: function(){
            var bs = this.data.bs;
            var em = this.data.eventMgr;
            while(bs.length > 0){
                var b = bs.pop();
                if(typeof b.onReady == 'function'){
                    var en = 'DocumentReadyLoading';
                    if(b.type == 1){
                        en = 'DocumentReadyCompleted';
                    }
                    em.off(en, b.onReady, b.balloon);
                }
                if(typeof b.onHide == 'function'){
                    em.off('HtmlBalloonFinished', b.onHide, b.balloon);
                }
                if(b.balloon != null){
                    b.balloon.DestroyObject();
                    delete b.balloon;
                }
            }
            return this;
        },
        _onHtmlBalloonFinished: function(id){
            this.remove(id);
        },
        destroy: function(){
            this.data.eventMgr.off('HtmlBalloonFinished', me._onHtmlBalloonFinished, me);
            this.clear();
        }
    };

    return SfmBalloonManager;
}, this);
