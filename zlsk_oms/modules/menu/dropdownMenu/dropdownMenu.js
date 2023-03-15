SFM.DropdownMenu = SFM.SfmMenuBase.extend({
    constructor: function(options){
        var me = this;
        me.base(options);
        me.addAction('setMenuName', me._setMenuName);
    },
    destroy: function(){
        this.base();
    },
    render: function(){
        var me = this;
        me.initConfig();
        me.el = me._el;
        me._el.html('<div id="divMenuBox" class="sfm-m-ddmenu-menu-box sfm-m-ddmenu-menu-box-lv1"></div>');
        me.data._ui = {$mb: me._el.find('#divMenuBox')};
        me._renderMenus();
        me.base();
        return me;
    },


    showMenu: function(id){
        this._el.find('.sfm-m-ddmenu-mi-box-lv1').removeClass('sfm-f-active');
        this._el.find('#' + id).addClass('sfm-f-active');
        this._el.find('.sfm-m-ddmenu-menu-panel').hide();
        var $mp = this._el.find('.sfm-m-ddmenu-menu-panel[data-panel=' + id + ']').show();
        this._setMi1Img();
    },

    _bindEvents: function(){
        var me = this;
        this._el.find('.sfm-m-ddmenu-mi-box-lv1, .sfm-m-ddmenu-mi-box-lv2').on('mouseover', function(){
            var $t = $(this);
            if(!$t.hasClass('sfm-f-hover')){
                $t.addClass('sfm-f-hover');
            }
            me._setMi1Img();
        });
        this._el.find('.sfm-m-ddmenu-mi-box-lv1, .sfm-m-ddmenu-mi-box-lv2').on('mouseout', function(){
            var $t = $(this);
            if($t.hasClass('sfm-f-hover')){
                $t.removeClass('sfm-f-hover');
            }
            me._setMi1Img();
        });
        me.base();
        return me;
    },

    _renderMenus: function(){
        var me = this;
        var menus = me.menu;
        var h1 = '';
        if(menus){
            var h2 = '';
            for(var i = 0;i < menus.length;i++){
                var mi = menus[i];
                h1 += me._getMi1Html(mi);
            }
        }
        me.data._ui.$mb.html(h1);
    },
    _setMi1Img: function(){
        var me = this;
        this._el.find('.sfm-m-ddmenu-mi-box-lv1').each(function(){
            var $t = $(this);
            var mi = me._getMi1(this.id);
            if(mi && mi.icon1){
                var $i = $t.find('img');
                if($t.hasClass('sfm-f-active') || $t.hasClass('sfm-f-hover')){
                    $i[0].src = mi.icon1;
                }else{
                    $i[0].src = mi.icon;
                }
            }
        });
    },
    _getMi1: function(id){
        var menus = this.menu;
        if(menus){
            for(var i = 0;i < menus.length;i++){
                if(menus[i].mid == id){
                    return menus[i];
                }
            }
        }
        return null;
    },
    _getMi1Html: function(mi){
        var h = '';
        if(mi){
            h += '<div id="' + mi.mid + '" class="sfm-m-ddmenu-mi-box sfm-m-ddmenu-mi-box-lv1">';
            if(mi.icon != null){
                h += '<img src="' + mi.icon + '" class="sfm-m-ddmenu-mi-img" />';
            }
            h += '<div class="sfm-m-ddmenu-mi-text">' + mi.name + '</div>';
            if(mi.children){
                h += '<div class="sfm-m-ddmenu-menu-panel" data-panel="' + mi.mid + '">';
                for(var j = 0;j < mi.children.length;j++){
                    var cmj = mi.children[j];
                    h += this._getMi2Html(cmj);
                }
                h += '</div>';
            }
            h += '</div>';
        }
        return h;
    },
    _getMi2Html: function(mi){
        var h = '';
        if(mi){
            var s = mi.disabled ? ' disabled="disabled"' : '';
            var acn = mi.actived ? ' sfm-f-active' : '';
            h += '<div id="' + mi.mid + '" class="sfm-m-ddmenu-mi-box sfm-m-ddmenu-mi-box-lv2' + acn + '" data-mk="' + (mi.mk || mi.id) + '"';
            if(mi.radioGroup){
                h += ' data-rg="' + mi.radioGroup + '"';
            }
            h += s + '>';
            if(mi.icon != null){
                h += '<img src="' + mi.icon + '" class="sfm-m-ddmenu-mi-img" />';
            }
            h += '<div id="' + mi.mid + '_t" class="sfm-m-ddmenu-mi-text">' + mi.name + '</div>';
            h += '</div>';
        }
        return h;
    },
    _setMenuName: function(mk, name){
        var me = this;
        if(mk){
            var mi = me.menuMap[mk];
            if(mi){
                var $md = me._el.find('#' + mi.mid);
                me._setMiName($md, name);
            }
        }
        me.doAction('onSetMenuName', null, mk, name);
        return me;
    },
    _setMiName: function($mi, name){
        $mi.find('.sfm-m-ddmenu-mi-text').text(name);
        return this;
    },

    __className__: 'DropdownMenu'
});
