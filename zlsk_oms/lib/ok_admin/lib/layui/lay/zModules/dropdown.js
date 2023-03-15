/**
 * 下拉菜单模块
 * date:2019-07-12   License By http://easyweb.vip
 */
layui.define(["jquery"],
    function(e) {
        var g = layui.jquery;
        var h = "dropdown-open";
        var d = "dropdown-disabled";
        var a = "dropdown-no-scroll";
        var b = "dropdown-menu-shade";
        var m = "dropdown-menu";
        var l = "dropdown-menu-nav";
        var i = "dropdown-hover";
        var c = "fixed";
        var f = "no-shade";
        var j = "layui-anim layui-anim-upbit";
        var k = ["bottom-left", "bottom-right", "bottom-center", "top-left", "top-right", "top-center", "left-top", "left-bottom", "left-center", "right-top", "right-bottom", "right-center"];
        layui.link(layui.cache.dir + 'css/zModules/dropdown.css');
        var n = {
            init: function() {
                g(document).off("click.dropdown").on("click.dropdown", "." + m + ">*:first-child",
                    function(q) {
                        var r = g(this).parent();
                        if (!r.hasClass(i)) {
                            if (r.hasClass(h)) {
                                r.removeClass(h)
                            } else {
                                n.show(g(this).parent().find("." + l))
                            }
                        }
                        q.stopPropagation()
                    });
                g(document).off("click.dropHide").on("click.dropHide",
                    function(q) {
                        n.hideAll()
                    });
                g(document).off("click.dropNav").on("click.dropNav", "." + l,
                    function(q) {
                        q.stopPropagation()
                    });
                var p, o;
                g(document).off("mouseenter.dropdown").on("mouseenter.dropdown", "." + m + "." + i,
                    function(q) {
                        if (o && o == q.currentTarget) {
                            clearTimeout(p)
                        }
                        n.show(g(this).find("." + l))
                    });
                g(document).off("mouseleave.dropdown").on("mouseleave.dropdown", "." + m + "." + i,
                    function(q) {
                        o = q.currentTarget;
                        p = setTimeout(function() {
                                g(q.currentTarget).removeClass(h)
                            },
                            300)
                    });
                g(document).off("click.dropStand").on("click.dropStand", "[data-dropdown]",
                    function(q) {
                        n.showFixed(g(this));
                        q.stopPropagation()
                    })
            },
            openClickNavClose: function() {
                g(document).off("click.dropNavA").on("click.dropNavA", "." + l + ">li>a",
                    function(o) {
                        n.hideAll();
                        g(this).parentsUntil("." + m).parent().removeClass(h);
                        o.stopPropagation()
                    })
            },
            hideAll: function() {
                g("." + m).removeClass(h);
                g("." + l + "." + c).addClass("layui-hide");
                g("." + b).remove();
                g("body").removeClass(a);
                g(".dropdown-fixParent").removeClass("dropdown-fixParent");
                g("[data-dropdown]").removeClass(h)
            },
            show: function(q) {
                if (q && q.length > 0 && !q.hasClass(d)) {
                    q.addClass(j);
                    var o;
                    for (var p = 0; p < k.length; p++) {
                        if (q.hasClass("dropdown-" + k[p])) {
                            o = k[p];
                            break
                        }
                    }
                    if (!o) {
                        q.addClass("dropdown-" + k[0]);
                        o = k[0]
                    }
                    n.forCenter(q, o);
                    q.parent("." + m).addClass(h);
                    return o
                }
                return false
            },
            showFixed: function(p) {
                var s = g(p.data("dropdown")),
                    o;
                if (!s.hasClass("layui-hide")) {
                    n.hideAll();
                    return
                }
                o = n.show(s);
                if (o) {
                    s.addClass(c);
                    s.removeClass("layui-hide");
                    var r = n.getTopLeft(p, s, o);
                    r = n.checkPosition(s, p, o, r);
                    s.css(r);
                    g("body").addClass(a);
                    var q = (p.attr("no-shade") == "true");
                    g("body").append('<div class="' + (q ? (b + " " + f) : b) + ' layui-anim layui-anim-fadein"></div>');
                    p.parentsUntil("body").each(function() {
                        var t = g(this).css("z-index");
                        if (/[0-9]+/.test(t)) {
                            g(this).addClass("dropdown-fixParent")
                        }
                    });
                    p.addClass(h)
                }
            },
            forCenter: function(o, t) {
                if (!o.hasClass(c)) {
                    var s = o.parent().outerWidth(),
                        p = o.parent().outerHeight();
                    var r = o.outerWidth(),
                        u = o.outerHeight();
                    var v = t.split("-"),
                        q = v[0],
                        w = v[1];
                    if ((q == "top" || q == "bottom") && w == "center") {
                        o.css("left", (s - r) / 2)
                    }
                    if ((q == "left" || q == "right") && w == "center") {
                        o.css("top", (p - u) / 2)
                    }
                }
            },
            getTopLeft: function(A, z, x) {
                var v = A.outerWidth();
                var t = A.outerHeight();
                var o = z.outerWidth();
                var w = z.outerHeight();
                var y = A.offset().top - g(document).scrollTop();
                var s = A.offset().left;
                var C = s + v;
                var B = 0,
                    r = 0;
                var u = x.split("-");
                var q = u[0];
                var p = u[1];
                if (q == "top" || q == "bottom") {
                    w += 8;
                    switch (p) {
                        case "left":
                            r = s;
                            break;
                        case "center":
                            r = s - o / 2 + v / 2;
                            break;
                        case "right":
                            r = C - o
                    }
                }
                if (q == "left" || q == "right") {
                    o += 8;
                    switch (p) {
                        case "top":
                            B = y + t - w;
                            break;
                        case "center":
                            B = y - w / 2 + t / 2;
                            break;
                        case "bottom":
                            B = y
                    }
                }
                switch (q) {
                    case "top":
                        B = y - w;
                        break;
                    case "right":
                        r = s + v;
                        break;
                    case "bottom":
                        B = y + t;
                        break;
                    case "left":
                        r = s - o
                }
                return {
                    top: B,
                    left: r,
                    right: "auto",
                    bottom: "auto"
                }
            },
            checkPosition: function(s, p, o, q) {
                var r = o.split("-");
                if ("bottom" == r[0]) {
                    if ((q.top + s.outerHeight()) > n.getPageHeight()) {
                        q = n.getTopLeft(p, s, "top-" + r[1]);
                        s.removeClass("dropdown-" + o);
                        s.addClass("dropdown-top-" + r[1])
                    }
                } else {
                    if ("top" == r[0]) {
                        if (q.top < 0) {
                            q = n.getTopLeft(p, s, "bottom-" + r[1]);
                            s.removeClass("dropdown-" + o);
                            s.addClass("dropdown-bottom-" + r[1])
                        }
                    }
                }
                return q
            },
            getPageHeight: function() {
                return document.documentElement.clientHeight || document.body.clientHeight
            },
            getPageWidth: function() {
                return document.documentElement.clientWidth || document.body.clientWidth
            }
        };
        n.init();
        e("dropdown", n)
    });
