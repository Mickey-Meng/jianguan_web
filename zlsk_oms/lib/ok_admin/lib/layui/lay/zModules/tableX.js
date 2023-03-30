layui.define(["layer", "table", "laytpl", "form", "util", "contextMenu"],
    function(r) {
        var g = layui.jquery;
        var q = layui.layer;
        var m = layui.table;
        var d = layui.laytpl;
        var c = layui.form;
        var a = layui.util;
        var s = layui.contextMenu;
        var k = layui.device;
        var b = "tb-search";
        var i = "tb-refresh";
        var j = "tb-export";
        var e = "txField_";
        var p = {
            merges: function(y, A, u, x) {
                if (!y) {
                    console.error("table filter not be null");
                    return
                }
                if (!A) {
                    console.warn("merge indexs not be null");
                    return
                }
                if (typeof u === "boolean") {
                    x = u;
                    u = undefined
                }
                var t = g('[lay-filter="' + y + '"]+.layui-table-view>.layui-table-box>.layui-table-body>table');
                var v = t.find(">tbody>tr");
                t.addClass("layui-table-x");
                function z(B, G, H) {
                    var E = m.cache[B];
                    if (E.length > 0) {
                        var I, C = 1;
                        if (H) {
                            I = E[0][H]
                        } else {
                            I = v.eq(0).find("td").eq(G).find(".layui-table-cell").html()
                        }
                        for (var F = 1; F < E.length; F++) {
                            var J;
                            if (H) {
                                J = E[F][H]
                            } else {
                                J = v.eq(F).find("td").eq(G).find(".layui-table-cell").html()
                            }
                            if (J == I) {
                                C++;
                                if (F == E.length - 1) {
                                    v.eq(F - C + 1).find("td").eq(G).attr("rowspan", C);
                                    for (var D = 1; D < C; D++) {
                                        v.eq(F - D + 1).find("td").eq(G).attr("del", "true")
                                    }
                                }
                            } else {
                                v.eq(F - C).find("td").eq(G).attr("rowspan", C);
                                for (var D = 1; D < C; D++) {
                                    v.eq(F - D).find("td").eq(G).attr("del", "true")
                                }
                                C = 1;
                                I = J
                            }
                        }
                    }
                }
                for (var w = 0; w < A.length; w++) {
                    if (!u) {
                        z(y, A[w], undefined)
                    } else {
                        z(y, A[w], u[w])
                    }
                }
                v.find('[del="true"]').remove(); (x == undefined) && (x = true);
                if (x) {
                    m.on("sort(" + y + ")",
                        function(B) {
                            p.merges(y, A, u)
                        })
                }
            },
            exportData: function(x) {
                var z = x.cols;
                var y = x.data;
                var J = x.fileName;
                var t = x.expType;
                var A = x.option;
                A || (A = {});
                if (k.ie) {
                    return q.msg("不支持ie导出")
                }
                if (y && typeof y === "string") {
                    var I = q.msg("加载中..", {
                        icon: 16,
                        shade: 0.01,
                        time: 0
                    });
                    A.url = y;
                    p.loadUrl(A,
                        function(L) {
                            q.close(I);
                            x.data = L;
                            p.exportData(x)
                        });
                    return
                }
                for (var G = 0; G < z.length; G++) {
                    for (var F = 0; F < z[G].length; F++) {
                        if (z[G][F].type == undefined) {
                            z[G][F].type = "normal"
                        }
                        if (z[G][F].hide == undefined) {
                            z[G][F].hide = false
                        }
                    }
                }
                var K = [],
                    D = [],
                    B = [];
                m.eachCols(undefined,
                    function(L, M) {
                        if (M.type == "normal" && !M.hide) {
                            K.push(M.title ? M.title: "");
                            D.push(M.field ? M.field: (e + L))
                        }
                    },
                    z);
                var E = p.parseTbData(z, p.deepClone(y), true);
                for (var G = 0; G < E.length; G++) {
                    var w = [];
                    for (var F = 0; F < D.length; F++) {
                        var H = E[G][D[F]];
                        if (typeof H == "string") {
                            H = H.replace(/,/g, "，")
                        }
                        w.push(H)
                    }
                    B.push(w)
                }
                var u = ({
                    csv: "text/csv",
                    xls: "application/vnd.ms-excel"
                })[t];
                var v = document.createElement("a");
                var C = function() {
                    var M = [],
                        L = [];
                    layui.each(B,
                        function(O, N) {
                            var P = [];
                            layui.each(K,
                                function(Q, R) {
                                    O == 0 && M.push(R || "")
                                });
                            layui.each(m.clearCacheKey(N),
                                function(R, Q) {
                                    P.push(Q)
                                });
                            L.push(P.join(","))
                        });
                    return K.join(",") + "\r\n" + B.join("\r\n")
                };
                v.href = "data:" + u + ";charset=utf-8,\ufeff" + encodeURIComponent(C());
                v.download = (J || "table") + "." + (t ? t: "xls");
                document.body.appendChild(v);
                v.click();
                document.body.removeChild(v)
            },
            exportDataBack: function(v, y, t) {
                y || (y = {});
                if (!t || t.toString().toLowerCase() == "get") {
                    var x = "";
                    for (var A in y) {
                        if (!x) {
                            x = "?" + A + "=" + y[A]
                        } else {
                            x += ("&" + A + "=" + y[A])
                        }
                    }
                    window.open(v + x)
                } else {
                    var u = '<html><body style="display: none;"><form id="eFrom" action="' + v + '" method="' + t + '">';
                    for (var A in y) {
                        u += ('<textarea name="' + A + '">' + y[A] + "</textarea>")
                    }
                    u += "</form></body></html>";
                    g("#exportFrame").remove();
                    g("body").append('<iframe id="exportFrame" style="display: none;"></iframe>');
                    var B = document.getElementById("exportFrame");
                    var z = B.contentWindow;
                    var w = z.document;
                    z.focus();
                    w.open();
                    w.write(u);
                    w.close();
                    w.getElementById("eFrom").submit()
                }
            },
            render: function(v) {
                var t = g(v.elem).attr("lay-filter");
                v.autoSort = false;
                var u = m.render(v);
                m.on("sort(" + t + ")",
                    function(y) {
                        var w = y.field,
                            z = y.type;
                        var x = g.extend(v.where, {
                            sort: w,
                            order: z
                        });
                        u.reload({
                            where: x,
                            page: {
                                curr: 1
                            }
                        })
                    });
                return u
            },
            renderFront: function(z) {
                var y, w = g(z.elem).attr("lay-filter");
                z.autoSort = false;
                for (var v = 0; v < z.cols.length; v++) {
                    for (var u = 0; u < z.cols[v].length; u++) {
                        if (z.cols[v][u].templet && !z.cols[v][u].field) {
                            z.cols[v][u].field = e + v + "_" + u
                        }
                    }
                }
                if (z.url) {
                    var x = p.deepClone(z);
                    x.data = [],
                        x.url = "";
                    y = m.render(x);
                    y.reloadUrl = function(C) {
                        var B = p.deepClone(z);
                        C && (B = g.extend(B, C));
                        var A = q.msg("加载中..", {
                            icon: 16,
                            shade: 0.01,
                            time: 0
                        });
                        p.loadUrl(B,
                            function(D) {
                                q.close(A);
                                p.parseTbData(B.cols, D);
                                p.putTbData(w, D);
                                g("input[" + b + '="' + w + '"]').val("");
                                window.tbX.cacheSearch[w] = undefined;
                                y.reload({
                                    url: "",
                                    data: D,
                                    page: {
                                        curr: 1
                                    }
                                })
                            })
                    };
                    var t = q.msg("加载中..", {
                        icon: 16,
                        shade: 0.01,
                        time: 0
                    });
                    p.loadUrl(z,
                        function(A) {
                            q.close(t);
                            p.parseTbData(z.cols, A);
                            p.putTbData(w, A);
                            y.reload({
                                url: "",
                                data: A,
                                page: {
                                    curr: 1
                                }
                            })
                        });
                    p.renderAllTool(y)
                } else {
                    p.parseTbData(z.cols, z.data);
                    p.putTbData(w, z.data);
                    y = m.render(z);
                    p.renderAllTool(y);
                    y.reloadData = function(A) {
                        y.reload(A);
                        p.parseTbData(z.cols, A.data);
                        p.putTbData(w, A.data);
                        g("input[" + b + '="' + w + '"]').val("");
                        window.tbX.cacheSearch[w] = undefined
                    }
                }
                return y
            },
            renderAllTool: function(t) {
                h(t);
                l(t);
                o(t);
                n(t)
            },
            loadUrl: function(u, y) {
                u.response = g.extend({
                        statusName: "code",
                        statusCode: 0,
                        msgName: "msg",
                        dataName: "data",
                        countName: "count"
                    },
                    u.response);
                var v = u.request,
                    t = u.response,
                    x = {};
                var w = g.extend(x, u.where);
                if (u.contentType && u.contentType.indexOf("application/json") == 0) {
                    w = JSON.stringify(w)
                }
                g.ajax({
                    type: u.method || "get",
                    url: u.url,
                    contentType: u.contentType,
                    data: w,
                    dataType: "json",
                    headers: u.headers || {},
                    success: function(z) {
                        if (typeof u.parseData === "function") {
                            z = u.parseData(z) || z
                        }
                        if (z[t.statusName] != t.statusCode) {
                            var A = z[t.msgName] || ("返回的数据不符合规范，正确的成功状态码 (" + t.statusName + ") 应为：" + t.statusCode);
                            q.msg(A, {
                                icon: 2
                            })
                        } else {
                            y(z[t.dataName])
                        }
                    },
                    error: function(A, z) {
                        q.msg("数据接口请求异常：" + z, {
                            icon: 2
                        })
                    }
                })
            },
            parseTbData: function(z, w, u) {
                var y = [];
                m.eachCols(undefined,
                    function(C, D) {
                        if (D.templet) {
                            var B = {
                                field: ((D.field && (u || D.field.indexOf(e) == 0)) ? D.field: ("txField_" + C))
                            };
                            if (typeof D.templet === "string") {
                                B.templet = function(F) {
                                    var E = undefined;
                                    d(g(D.templet).html()).render(F,
                                        function(G) {
                                            E = G
                                        });
                                    return E
                                }
                            } else {
                                B.templet = D.templet
                            }
                            y.push(B)
                        }
                    },
                    z);
                for (var v = 0; v < w.length; v++) {
                    var x = w[v];
                    for (var t = 0; t < y.length; t++) {
                        var A = "<div>" + y[t].templet(x) + "</div>";
                        x[y[t].field] = g(A).not(".export-hide").text().replace(/(^\s*)|(\s*$)/g, "")
                    }
                }
                return w
            },
            getTbData: function(u) {
                var t = window.tbX.cache[u];
                if (t == undefined) {
                    t = m.cache[u]
                }
                return p.deepClone(t)
            },
            putTbData: function(u, t) {
                window.tbX.cache[u] = t;
                return t
            },
            bindCtxMenu: function(z, u) {
                var w = m.cache[z];
                var t = [];
                for (var v = 0; v < u.length; v++) {
                    var y = u[v];
                    t.push({
                        icon: y.icon,
                        name: y.name,
                        click: function(E, D) {
                            var C = g(E.currentTarget).attr("lay-id");
                            var B = g(D.currentTarget);
                            var A = B.attr("data-index");
                            u[parseInt(C.substring(8))].click(w[A]);
                            B.removeClass("layui-table-click")
                        }
                    })
                }
                var x = "#" + z + "+.layui-table-view .layui-table-body tr";
                g(x).bind("contextmenu",
                    function(A) {
                        g(x).removeClass("layui-table-click");
                        g(this).addClass("layui-table-click");
                        s.show(t, A.clientX, A.clientY, A);
                        return false
                    })
            },
            filterData: function(B, u, t) {
                var v = [],
                    z;
                for (var y = 0; y < B.length; y++) {
                    var x = B[y];
                    if (!z) {
                        if (!u) {
                            z = [];
                            for (var A in x) {
                                z.push(A)
                            }
                        } else {
                            z = u.split(",")
                        }
                    }
                    for (var w = 0; w < z.length; w++) {
                        if (p.isContains(x[z[w]], t)) {
                            v.push(x);
                            break
                        }
                    }
                }
                return v
            },
            isContains: function(u, t) {
                u || (u = "");
                t || (t = "");
                u = u.toString().toLowerCase();
                t = t.toString().toLowerCase();
                if (u == t || u.indexOf(t) != -1) {
                    return true
                }
                return false
            },
            deepClone: function(w) {
                var t;
                var u = p.isClass(w);
                if (u === "Object") {
                    t = {}
                } else {
                    if (u === "Array") {
                        t = []
                    } else {
                        return w
                    }
                }
                for (var v in w) {
                    var x = w[v];
                    if (p.isClass(x) == "Object") {
                        t[v] = arguments.callee(x)
                    } else {
                        if (p.isClass(x) == "Array") {
                            t[v] = arguments.callee(x)
                        } else {
                            t[v] = w[v]
                        }
                    }
                }
                return t
            },
            isClass: function(t) {
                if (t === null) {
                    return "Null"
                }
                if (t === undefined) {
                    return "Undefined"
                }
                return Object.prototype.toString.call(t).slice(8, -1)
            }
        };
        window.tbX || (window.tbX = new Object());
        window.tbX.cache || (window.tbX.cache = new Object());
        window.tbX.cacheSearch || (window.tbX.cacheSearch = new Object());
        var o = function(u) {
            var t = u.config.id,
                v = g("input[" + b + '="' + t + '"]');
            if (! (v && v.length > 0)) {
                return
            }
            if (!v.attr("placeholder")) {
                v.attr("placeholder", "输入关键字按回车键搜索")
            }
            v.off("keydown").on("keydown",
                function(z) {
                    if (z.keyCode != 13) {
                        return
                    }
                    var w = v.attr("name");
                    var A = v.val().replace(/(^\s*)|(\s*$)/g, "");
                    var x = q.msg("搜索中..", {
                        icon: 16,
                        shade: 0.01,
                        time: 0
                    });
                    var y = p.getTbData(t);
                    var B = p.filterData(y, w, A);
                    window.tbX.cacheSearch[t] = B;
                    u.reload({
                        url: "",
                        data: B,
                        page: {
                            curr: 1
                        }
                    });
                    q.close(x)
                })
        };
        var l = function(u) {
            var t = u.config.id;
            m.on("sort(" + t + ")",
                function(y) {
                    var v = y.field,
                        z = y.type;
                    var w = q.msg("加载中..", {
                        icon: 16,
                        shade: 0.01,
                        time: 0
                    });
                    var x = window.tbX.cacheSearch[t];
                    x || (x = p.getTbData(t));
                    if (z) {
                        x = x.sort(function(D, B) {
                            var C = D[v],
                                A = B[v];
                            if (z == "asc") {
                                return (C == A) ? 0 : ((C < A) ? -1 : 1)
                            } else {
                                return (C == A) ? 0 : ((C < A) ? 1 : -1)
                            }
                        })
                    }
                    u.reload({
                        initSort: y,
                        url: "",
                        data: x,
                        page: {
                            curr: 1
                        }
                    });
                    q.close(w)
                })
        };
        var h = function(t) {
            g("[" + i + '="' + t.config.id + '"]').off("click").on("click",
                function() {
                    if (t.reloadUrl) {
                        t.reloadUrl()
                    } else {
                        t.reload({
                            page: {
                                curr: 1
                            }
                        })
                    }
                })
        };
        var n = function(u) {
            var t = u.config.id;
            g("[" + j + '="' + t + '"]').off("click").on("click",
                function(v) {
                    if (g(this).find(".tbx-dropdown-menu").length > 0) {
                        return
                    }
                    if (v !== void 0) {
                        v.preventDefault();
                        v.stopPropagation()
                    }
                    var w = '<div class="tbx-dropdown-menu">';
                    w += '      <div class="tbx-dropdown-menu-item" data-type="check">导出选中数据</div>';
                    w += '      <div class="tbx-dropdown-menu-item" data-type="current">导出当前页数据</div>';
                    w += '      <div class="tbx-dropdown-menu-item" data-type="all">导出全部数据</div>';
                    w += "   </div>";
                    g(this).append(w);
                    g(this).addClass("tbx-dropdown-btn");
                    g(this).parent().css("position", "relative");
                    g(this).parent().css("z-index", "9998");
                    g(".tbx-dropdown-menu").off("click").on("click", ".tbx-dropdown-menu-item",
                        function(z) {
                            var y = g(this).data("type");
                            if (y == "check") {
                                var x = m.checkStatus(t);
                                if (x.data.length == 0) {
                                    q.msg("请选择要导出的数据", {
                                        icon: 2
                                    })
                                } else {
                                    g(".tbx-dropdown-menu").remove();
                                    p.exportData({
                                        fileName: u.config.title,
                                        cols: u.config.cols,
                                        data: x.data
                                    })
                                }
                            } else {
                                if (y == "current") {
                                    p.exportData({
                                        fileName: u.config.title,
                                        cols: u.config.cols,
                                        data: m.cache[t]
                                    })
                                } else {
                                    if (y == "all") {
                                        p.exportData({
                                            fileName: u.config.title,
                                            cols: u.config.cols,
                                            data: p.getTbData(t)
                                        })
                                    }
                                }
                            }
                            if (z !== void 0) {
                                z.preventDefault();
                                z.stopPropagation()
                            }
                        })
                });
            g(document).off("click.tbxDropHide").on("click.tbxDropHide",
                function() {
                    g(".tbx-dropdown-menu").remove()
                })
        };
        var f = function() {
            var t = ".tbx-dropdown-btn {";
            t += "        position: relative;";
            t += "   }";
            t += "   .tbx-dropdown-btn:hover {";
            t += "        opacity: 1";
            t += "   }";
            t += "   .tbx-dropdown-menu {";
            t += "        position: absolute;";
            t += "        top: 100%;";
            t += "        right: 0;";
            t += "        padding: 5px 0;";
            t += "        margin: 5px 0 0 0;";
            t += "        overflow: visible;";
            t += "        min-width: 110px;";
            t += "        background: #fff;";
            t += "        border-radius: 2px;";
            t += "        box-shadow: 0 2px 4px rgba(0, 0, 0, .12);";
            t += "        border: 1px solid #d2d2d2;";
            t += "        z-index: 9998;";
            t += "        cursor: default;";
            t += "   }";
            t += "   .tbx-dropdown-menu .tbx-dropdown-menu-item {";
            t += "        display: block;";
            t += "        color: #555;";
            t += "        font-size: 14px;";
            t += "        padding: 10px 15px;";
            t += "        text-decoration: none;";
            t += "        white-space: nowrap;";
            t += "        cursor: pointer;";
            t += "        user-select: none;";
            t += "        line-height: normal;";
            t += "   }";
            t += "   .tbx-dropdown-menu .tbx-dropdown-menu-item:hover {";
            t += "        background-color: #eeeeee;";
            t += "   }";
            t += "   .export-show {";
            t += "        display: none;";
            t += "   }";
            return t
        };
        g("head").append("<style>" + f() + "</style>");
        r("tableX", p)
    });