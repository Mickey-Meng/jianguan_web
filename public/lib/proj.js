! function (t, s) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = s() : "function" == typeof define && define.amd ? define(s) : (t.SFM || (t.SFM = {})) && (t.SFM.proj4 = s())
}(this, function () {
  "use strict";
  var f = 1,
    m = 2,
    o = 4,
    l = 5,
    P = 484813681109536e-20,
    S = Math.PI / 2,
    M = .16666666666666666,
    c = .04722222222222222,
    u = .022156084656084655,
    N = 1e-10,
    r = .017453292519943295,
    p = 57.29577951308232,
    d = Math.PI / 4,
    a = 2 * Math.PI,
    y = 3.14159265359,
    _ = {
      greenwich: 0,
      lisbon: -9.131906111111,
      paris: 2.337229166667,
      bogota: -74.080916666667,
      madrid: -3.687938888889,
      rome: 12.452333333333,
      bern: 7.439583333333,
      jakarta: 106.807719444444,
      ferro: -17.666666666667,
      brussels: 4.367975,
      stockholm: 18.058277777778,
      athens: 23.7163375,
      oslo: 10.722916666667
    },
    v = {
      ft: {
        to_meter: .3048
      },
      "us-ft": {
        to_meter: 1200 / 3937
      }
    },
    n = /[\s_\-\/\(\)]/g;

  function x(t, s) {
    if (t[s]) return t[s];
    for (var i, a = Object.keys(t), h = s.toLowerCase().replace(n, ""), e = -1; ++e < a.length;)
      if ((i = a[e]).toLowerCase().replace(n, "") === h) return t[i]
  }
  var h = function (t) {
      var s, i, a, h = {},
        e = t.split("+").map(function (t) {
          return t.trim()
        }).filter(function (t) {
          return t
        }).reduce(function (t, s) {
          var i = s.split("=");
          return i.push(!0), t[i[0].toLowerCase()] = i[1], t
        }, {}),
        n = {
          proj: "projName",
          datum: "datumCode",
          rf: function (t) {
            h.rf = parseFloat(t)
          },
          lat_0: function (t) {
            h.lat0 = t * r
          },
          lat_1: function (t) {
            h.lat1 = t * r
          },
          lat_2: function (t) {
            h.lat2 = t * r
          },
          lat_ts: function (t) {
            h.lat_ts = t * r
          },
          lon_0: function (t) {
            h.long0 = t * r
          },
          lon_1: function (t) {
            h.long1 = t * r
          },
          lon_2: function (t) {
            h.long2 = t * r
          },
          alpha: function (t) {
            h.alpha = parseFloat(t) * r
          },
          lonc: function (t) {
            h.longc = t * r
          },
          x_0: function (t) {
            h.x0 = parseFloat(t)
          },
          y_0: function (t) {
            h.y0 = parseFloat(t)
          },
          k_0: function (t) {
            h.k0 = parseFloat(t)
          },
          k: function (t) {
            h.k0 = parseFloat(t)
          },
          a: function (t) {
            h.a = parseFloat(t)
          },
          b: function (t) {
            h.b = parseFloat(t)
          },
          r_a: function () {
            h.R_A = !0
          },
          zone: function (t) {
            h.zone = parseInt(t, 10)
          },
          south: function () {
            h.utmSouth = !0
          },
          towgs84: function (t) {
            h.datum_params = t.split(",").map(function (t) {
              return parseFloat(t)
            })
          },
          to_meter: function (t) {
            h.to_meter = parseFloat(t)
          },
          units: function (t) {
            h.units = t;
            var s = x(v, t);
            s && (h.to_meter = s.to_meter)
          },
          from_greenwich: function (t) {
            h.from_greenwich = t * r
          },
          pm: function (t) {
            var s = x(_, t);
            h.from_greenwich = (s || parseFloat(t)) * r
          },
          nadgrids: function (t) {
            "@null" === t ? h.datumCode = "none" : h.nadgrids = t
          },
          axis: function (t) {
            var s = "ewnsud";
            3 === t.length && -1 !== s.indexOf(t.substr(0, 1)) && -1 !== s.indexOf(t.substr(1, 1)) && -1 !== s.indexOf(t.substr(2, 1)) && (h.axis = t)
          }
        };
      for (s in e) i = e[s], s in n ? "function" == typeof (a = n[s]) ? a(i) : h[a] = i : h[s] = i;
      return "string" == typeof h.datumCode && "WGS84" !== h.datumCode && (h.datumCode = h.datumCode.toLowerCase()), h
    },
    i = 1,
    s = /\s/,
    e = /[A-Za-z]/,
    g = /[A-Za-z84]/,
    b = /[,\]]/,
    w = /[\d\.E\-\+]/;

  function A(t) {
    if ("string" != typeof t) throw new Error("not a string");
    this.text = t.trim(), this.level = 0, this.place = 0, this.root = null, this.stack = [], this.currentObject = null, this.state = i
  }

  function C(t, s, i) {
    Array.isArray(s) && (i.unshift(s), s = null);
    var a = s ? {} : t,
      h = i.reduce(function (t, s) {
        return E(s, t), t
      }, a);
    s && (t[s] = h)
  }

  function E(t, s) {
    if (Array.isArray(t)) {
      var i, a = t.shift();
      if ("PARAMETER" === a && (a = t.shift()), 1 === t.length) return Array.isArray(t[0]) ? (s[a] = {}, void E(t[0], s[a])) : void(s[a] = t[0]);
      if (t.length)
        if ("TOWGS84" !== a) switch (Array.isArray(a) || (s[a] = {}), a) {
          case "UNIT":
          case "PRIMEM":
          case "VERT_DATUM":
            return s[a] = {
              name: t[0].toLowerCase(),
              convert: t[1]
            }, void(3 === t.length && E(t[2], s[a]));
          case "SPHEROID":
          case "ELLIPSOID":
            return s[a] = {
              name: t[0],
              a: t[1],
              rf: t[2]
            }, void(4 === t.length && E(t[3], s[a]));
          case "PROJECTEDCRS":
          case "PROJCRS":
          case "GEOGCS":
          case "GEOCCS":
          case "PROJCS":
          case "LOCAL_CS":
          case "GEODCRS":
          case "GEODETICCRS":
          case "GEODETICDATUM":
          case "EDATUM":
          case "ENGINEERINGDATUM":
          case "VERT_CS":
          case "VERTCRS":
          case "VERTICALCRS":
          case "COMPD_CS":
          case "COMPOUNDCRS":
          case "ENGINEERINGCRS":
          case "ENGCRS":
          case "FITTED_CS":
          case "LOCAL_DATUM":
          case "DATUM":
            return t[0] = ["name", t[0]], void C(s, a, t);
          default:
            for (i = -1; ++i < t.length;)
              if (!Array.isArray(t[i])) return E(t, s[a]);
            return C(s, a, t)
        } else s[a] = t;
        else s[a] = !0
    } else s[t] = !0
  }
  A.prototype.readCharicter = function () {
    var t = this.text[this.place++];
    if (4 !== this.state)
      for (; s.test(t);) {
        if (this.place >= this.text.length) return;
        t = this.text[this.place++]
      }
    switch (this.state) {
      case i:
        return this.neutral(t);
      case 2:
        return this.keyword(t);
      case 4:
        return this.quoted(t);
      case 5:
        return this.afterquote(t);
      case 3:
        return this.number(t);
      case -1:
        return
    }
  }, A.prototype.afterquote = function (t) {
    if ('"' === t) return this.word += '"', void(this.state = 4);
    if (b.test(t)) return this.word = this.word.trim(), void this.afterItem(t);
    throw new Error("havn't handled \"" + t + '" in afterquote yet, index ' + this.place)
  }, A.prototype.afterItem = function (t) {
    return "," === t ? (null !== this.word && this.currentObject.push(this.word), this.word = null, void(this.state = i)) : "]" === t ? (this.level--, null !== this.word && (this.currentObject.push(this.word), this.word = null), this.state = i, this.currentObject = this.stack.pop(), void(this.currentObject || (this.state = -1))) : void 0
  }, A.prototype.number = function (t) {
    if (!w.test(t)) {
      if (b.test(t)) return this.word = parseFloat(this.word), void this.afterItem(t);
      throw new Error("havn't handled \"" + t + '" in number yet, index ' + this.place)
    }
    this.word += t
  }, A.prototype.quoted = function (t) {
    '"' !== t ? this.word += t : this.state = 5
  }, A.prototype.keyword = function (t) {
    if (g.test(t)) this.word += t;
    else {
      if ("[" === t) {
        var s = [];
        return s.push(this.word), this.level++, null === this.root ? this.root = s : this.currentObject.push(s), this.stack.push(this.currentObject), this.currentObject = s, void(this.state = i)
      }
      if (!b.test(t)) throw new Error("havn't handled \"" + t + '" in keyword yet, index ' + this.place);
      this.afterItem(t)
    }
  }, A.prototype.neutral = function (t) {
    if (e.test(t)) return this.word = t, void(this.state = 2);
    if ('"' === t) return this.word = "", void(this.state = 4);
    if (w.test(t)) return this.word = t, void(this.state = 3);
    if (!b.test(t)) throw new Error("havn't handled \"" + t + '" in neutral yet, index ' + this.place);
    this.afterItem(t)
  }, A.prototype.output = function () {
    for (; this.place < this.text.length;) this.readCharicter();
    if (-1 === this.state) return this.root;
    throw new Error('unable to parse string "' + this.text + '". State is ' + this.state)
  };
  var k = .017453292519943295;

  function q(t) {
    return t * k
  }
  var t, I = function (t) {
    var s = function (t) {
        return new A(t).output()
      }(t),
      i = s.shift(),
      a = s.shift();
    s.unshift(["name", a]), s.unshift(["type", i]);
    var h = {};
    return E(s, h),
      function (s) {
        "GEOGCS" === s.type ? s.projName = "longlat" : "LOCAL_CS" === s.type ? (s.projName = "identity", s.local = !0) : "object" == typeof s.PROJECTION ? s.projName = Object.keys(s.PROJECTION)[0] : s.projName = s.PROJECTION, s.UNIT && (s.units = s.UNIT.name.toLowerCase(), "metre" === s.units && (s.units = "meter"), s.UNIT.convert && ("GEOGCS" === s.type ? s.DATUM && s.DATUM.SPHEROID && (s.to_meter = s.UNIT.convert * s.DATUM.SPHEROID.a) : s.to_meter = s.UNIT.convert));
        var t = s.GEOGCS;

        function i(t) {
          return t * (s.to_meter || 1)
        }
        "GEOGCS" === s.type && (t = s), t && (t.DATUM ? s.datumCode = t.DATUM.name.toLowerCase() : s.datumCode = t.name.toLowerCase(), "d_" === s.datumCode.slice(0, 2) && (s.datumCode = s.datumCode.slice(2)), "new_zealand_geodetic_datum_1949" !== s.datumCode && "new_zealand_1949" !== s.datumCode || (s.datumCode = "nzgd49"), "wgs_1984" === s.datumCode && ("Mercator_Auxiliary_Sphere" === s.PROJECTION && (s.sphere = !0), s.datumCode = "wgs84"), "_ferro" === s.datumCode.slice(-6) && (s.datumCode = s.datumCode.slice(0, -6)), "_jakarta" === s.datumCode.slice(-8) && (s.datumCode = s.datumCode.slice(0, -8)), ~s.datumCode.indexOf("belge") && (s.datumCode = "rnb72"), t.DATUM && t.DATUM.SPHEROID && (s.ellps = t.DATUM.SPHEROID.name.replace("_19", "").replace(/[Cc]larke\_18/, "clrk"), "international" === s.ellps.toLowerCase().slice(0, 13) && (s.ellps = "intl"), s.a = t.DATUM.SPHEROID.a, s.rf = parseFloat(t.DATUM.SPHEROID.rf, 10)), ~s.datumCode.indexOf("osgb_1936") && (s.datumCode = "osgb36"), ~s.datumCode.indexOf("osni_1952") && (s.datumCode = "osni52"), (~s.datumCode.indexOf("tm65") || ~s.datumCode.indexOf("geodetic_datum_of_1965")) && (s.datumCode = "ire65")), s.b && !isFinite(s.b) && (s.b = s.a), [
          ["standard_parallel_1", "Standard_Parallel_1"],
          ["standard_parallel_2", "Standard_Parallel_2"],
          ["false_easting", "False_Easting"],
          ["false_northing", "False_Northing"],
          ["central_meridian", "Central_Meridian"],
          ["latitude_of_origin", "Latitude_Of_Origin"],
          ["latitude_of_origin", "Central_Parallel"],
          ["scale_factor", "Scale_Factor"],
          ["k0", "scale_factor"],
          ["latitude_of_center", "Latitude_of_center"],
          ["lat0", "latitude_of_center", q],
          ["longitude_of_center", "Longitude_Of_Center"],
          ["longc", "longitude_of_center", q],
          ["x0", "false_easting", i],
          ["y0", "false_northing", i],
          ["long0", "central_meridian", q],
          ["lat0", "latitude_of_origin", q],
          ["lat0", "standard_parallel_1", q],
          ["lat1", "standard_parallel_1", q],
          ["lat2", "standard_parallel_2", q],
          ["alpha", "azimuth", q],
          ["srsCode", "name"]
        ].forEach(function (t) {
          return function (t, s) {
            var i = s[0],
              a = s[1];
            !(i in t) && a in t && (t[i] = t[a], 3 === s.length && (t[i] = s[2](t[i])))
          }(s, t)
        }), s.long0 || !s.longc || "Albers_Conic_Equal_Area" !== s.projName && "Lambert_Azimuthal_Equal_Area" !== s.projName || (s.long0 = s.longc), s.lat_ts || !s.lat1 || "Stereographic_South_Pole" !== s.projName && "Polar Stereographic (variant B)" !== s.projName || (s.lat0 = q(0 < s.lat1 ? 90 : -90), s.lat_ts = s.lat1)
      }(h), h
  };

  function R(t) {
    var s = this;
    if (2 === arguments.length) {
      var i = arguments[1];
      R[t] = "string" == typeof i ? "+" === i.charAt(0) ? h(arguments[1]) : I(arguments[1]) : i
    } else if (1 === arguments.length) {
      if (Array.isArray(t)) return t.map(function (t) {
        Array.isArray(t) ? R.apply(s, t) : R(t)
      });
      if ("string" == typeof t) {
        if (t in R) return R[t]
      } else "EPSG" in t ? R["EPSG:" + t.EPSG] = t : "ESRI" in t ? R["ESRI:" + t.ESRI] = t : "IAU2000" in t ? R["IAU2000:" + t.IAU2000] = t : console.log(t);
      return
    }
  }(t = R)("EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"), t("EPSG:4269", "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees"), t("EPSG:3857", "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs"), t.WGS84 = t["EPSG:4326"], t["EPSG:3785"] = t["EPSG:3857"], t.GOOGLE = t["EPSG:3857"], t["EPSG:900913"] = t["EPSG:3857"], t["EPSG:102113"] = t["EPSG:3857"];
  var O = ["PROJECTEDCRS", "PROJCRS", "GEOGCS", "GEOCCS", "PROJCS", "LOCAL_CS", "GEODCRS", "GEODETICCRS", "GEODETICDATUM", "ENGCRS", "ENGINEERINGCRS"];

  function G(t) {
    return function (t) {
      return "string" == typeof t
    }(t) ? function (t) {
      return t in R
    }(t) ? R[t] : function (s) {
      return O.some(function (t) {
        return -1 < s.indexOf(t)
      })
    }(t) ? I(t) : function (t) {
      return "+" === t[0]
    }(t) ? h(t) : void 0 : t
  }

  function j(t, s, i) {
    var a = t * s;
    return i / Math.sqrt(1 - a * a)
  }

  function L(t) {
    return t < 0 ? -1 : 1
  }

  function z(t) {
    return Math.abs(t) <= y ? t : t - L(t) * a
  }

  function T(t, s, i) {
    var a = t * i,
      h = .5 * t;
    return a = Math.pow((1 - a) / (1 + a), h), Math.tan(.5 * (S - s)) / a
  }

  function D(t, s) {
    for (var i, a, h = .5 * t, e = S - 2 * Math.atan(s), n = 0; n <= 15; n++)
      if (i = t * Math.sin(e), e += a = S - 2 * Math.atan(s * Math.pow((1 - i) / (1 + i), h)) - e, Math.abs(a) <= 1e-10) return e;
    return -9999
  }
  var B = function (t, s) {
    var i, a;
    if (t = t || {}, !s) return t;
    for (a in s) void 0 !== (i = s[a]) && (t[a] = i);
    return t
  };

  function U(t) {
    return t
  }
  var F = [{
      init: function () {
        var t = this.b / this.a;
        this.es = 1 - t * t, "x0" in this || (this.x0 = 0), "y0" in this || (this.y0 = 0), this.e = Math.sqrt(this.es), this.lat_ts ? this.sphere ? this.k0 = Math.cos(this.lat_ts) : this.k0 = j(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) : this.k0 || (this.k ? this.k0 = this.k : this.k0 = 1)
      },
      forward: function (t) {
        var s, i, a = t.x,
          h = t.y;
        if (90 < h * p && h * p < -90 && 180 < a * p && a * p < -180) return null;
        if (Math.abs(Math.abs(h) - S) <= N) return null;
        if (this.sphere) s = this.x0 + this.a * this.k0 * z(a - this.long0), i = this.y0 + this.a * this.k0 * Math.log(Math.tan(d + .5 * h));
        else {
          var e = Math.sin(h),
            n = T(this.e, h, e);
          s = this.x0 + this.a * this.k0 * z(a - this.long0), i = this.y0 - this.a * this.k0 * Math.log(n)
        }
        return t.x = s, t.y = i, t
      },
      inverse: function (t) {
        var s, i, a = t.x - this.x0,
          h = t.y - this.y0;
        if (this.sphere) i = S - 2 * Math.atan(Math.exp(-h / (this.a * this.k0)));
        else {
          var e = Math.exp(-h / (this.a * this.k0));
          if (-9999 === (i = D(this.e, e))) return null
        }
        return s = z(this.long0 + a / (this.a * this.k0)), t.x = s, t.y = i, t
      },
      names: ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "merc"]
    }, {
      init: function () {},
      forward: U,
      inverse: U,
      names: ["longlat", "identity"]
    }],
    Q = {},
    W = [];

  function H(t, s) {
    var i = W.length;
    return t.names ? ((W[i] = t).names.forEach(function (t) {
      Q[t.toLowerCase()] = i
    }), this) : (console.log(s), !0)
  }
  var X = {
      start: function () {
        F.forEach(H)
      },
      add: H,
      get: function (t) {
        if (!t) return !1;
        var s = t.toLowerCase();
        return void 0 !== Q[s] && W[Q[s]] ? W[Q[s]] : void 0
      }
    },
    J = {
      MERIT: {
        a: 6378137,
        rf: 298.257,
        ellipseName: "MERIT 1983"
      },
      SGS85: {
        a: 6378136,
        rf: 298.257,
        ellipseName: "Soviet Geodetic System 85"
      },
      GRS80: {
        a: 6378137,
        rf: 298.257222101,
        ellipseName: "GRS 1980(IUGG, 1980)"
      },
      IAU76: {
        a: 6378140,
        rf: 298.257,
        ellipseName: "IAU 1976"
      },
      airy: {
        a: 6377563.396,
        b: 6356256.91,
        ellipseName: "Airy 1830"
      },
      APL4: {
        a: 6378137,
        rf: 298.25,
        ellipseName: "Appl. Physics. 1965"
      },
      NWL9D: {
        a: 6378145,
        rf: 298.25,
        ellipseName: "Naval Weapons Lab., 1965"
      },
      mod_airy: {
        a: 6377340.189,
        b: 6356034.446,
        ellipseName: "Modified Airy"
      },
      andrae: {
        a: 6377104.43,
        rf: 300,
        ellipseName: "Andrae 1876 (Den., Iclnd.)"
      },
      aust_SA: {
        a: 6378160,
        rf: 298.25,
        ellipseName: "Australian Natl & S. Amer. 1969"
      },
      GRS67: {
        a: 6378160,
        rf: 298.247167427,
        ellipseName: "GRS 67(IUGG 1967)"
      },
      bessel: {
        a: 6377397.155,
        rf: 299.1528128,
        ellipseName: "Bessel 1841"
      },
      bess_nam: {
        a: 6377483.865,
        rf: 299.1528128,
        ellipseName: "Bessel 1841 (Namibia)"
      },
      clrk66: {
        a: 6378206.4,
        b: 6356583.8,
        ellipseName: "Clarke 1866"
      },
      clrk80: {
        a: 6378249.145,
        rf: 293.4663,
        ellipseName: "Clarke 1880 mod."
      },
      clrk58: {
        a: 6378293.645208759,
        rf: 294.2606763692654,
        ellipseName: "Clarke 1858"
      },
      CPM: {
        a: 6375738.7,
        rf: 334.29,
        ellipseName: "Comm. des Poids et Mesures 1799"
      },
      delmbr: {
        a: 6376428,
        rf: 311.5,
        ellipseName: "Delambre 1810 (Belgium)"
      },
      engelis: {
        a: 6378136.05,
        rf: 298.2566,
        ellipseName: "Engelis 1985"
      },
      evrst30: {
        a: 6377276.345,
        rf: 300.8017,
        ellipseName: "Everest 1830"
      },
      evrst48: {
        a: 6377304.063,
        rf: 300.8017,
        ellipseName: "Everest 1948"
      },
      evrst56: {
        a: 6377301.243,
        rf: 300.8017,
        ellipseName: "Everest 1956"
      },
      evrst69: {
        a: 6377295.664,
        rf: 300.8017,
        ellipseName: "Everest 1969"
      },
      evrstSS: {
        a: 6377298.556,
        rf: 300.8017,
        ellipseName: "Everest (Sabah & Sarawak)"
      },
      fschr60: {
        a: 6378166,
        rf: 298.3,
        ellipseName: "Fischer (Mercury Datum) 1960"
      },
      fschr60m: {
        a: 6378155,
        rf: 298.3,
        ellipseName: "Fischer 1960"
      },
      fschr68: {
        a: 6378150,
        rf: 298.3,
        ellipseName: "Fischer 1968"
      },
      helmert: {
        a: 6378200,
        rf: 298.3,
        ellipseName: "Helmert 1906"
      },
      hough: {
        a: 6378270,
        rf: 297,
        ellipseName: "Hough"
      },
      intl: {
        a: 6378388,
        rf: 297,
        ellipseName: "International 1909 (Hayford)"
      },
      kaula: {
        a: 6378163,
        rf: 298.24,
        ellipseName: "Kaula 1961"
      },
      lerch: {
        a: 6378139,
        rf: 298.257,
        ellipseName: "Lerch 1979"
      },
      mprts: {
        a: 6397300,
        rf: 191,
        ellipseName: "Maupertius 1738"
      },
      new_intl: {
        a: 6378157.5,
        b: 6356772.2,
        ellipseName: "New International 1967"
      },
      plessis: {
        a: 6376523,
        rf: 6355863,
        ellipseName: "Plessis 1817 (France)"
      },
      krass: {
        a: 6378245,
        rf: 298.3,
        ellipseName: "Krassovsky, 1942"
      },
      SEasia: {
        a: 6378155,
        b: 6356773.3205,
        ellipseName: "Southeast Asia"
      },
      walbeck: {
        a: 6376896,
        b: 6355834.8467,
        ellipseName: "Walbeck"
      },
      WGS60: {
        a: 6378165,
        rf: 298.3,
        ellipseName: "WGS 60"
      },
      WGS66: {
        a: 6378145,
        rf: 298.25,
        ellipseName: "WGS 66"
      },
      WGS7: {
        a: 6378135,
        rf: 298.26,
        ellipseName: "WGS 72"
      }
    },
    K = J.WGS84 = {
      a: 6378137,
      rf: 298.257223563,
      ellipseName: "WGS 84"
    };
  J.sphere = {
    a: 6370997,
    b: 6370997,
    ellipseName: "Normal Sphere (r=6370997)"
  };
  var V = {};

  function Z(t, s) {
    if (!(this instanceof Z)) return new Z(t);
    s = s || function (t) {
      if (t) throw t
    };
    var i = G(t);
    if ("object" == typeof i) {
      var a = Z.projections.get(i.projName);
      if (a) {
        if (i.datumCode && "none" !== i.datumCode) {
          var h = x(V, i.datumCode);
          h && (i.datum_params = h.towgs84 ? h.towgs84.split(",") : null, i.ellps = h.ellipse, i.datumName = h.datumName ? h.datumName : i.datumCode)
        }
        i.k0 = i.k0 || 1, i.axis = i.axis || "enu", i.ellps = i.ellps || "wgs84";
        var e = function (t, s, i, a, h) {
            if (!t) {
              var e = x(J, a);
              t = (e = e || K).a, s = e.b, i = e.rf
            }
            return i && !s && (s = (1 - 1 / i) * t), (0 === i || Math.abs(t - s) < N) && (h = !0, s = t), {
              a: t,
              b: s,
              rf: i,
              sphere: h
            }
          }(i.a, i.b, i.rf, i.ellps, i.sphere),
          n = function (t, s, i, a) {
            var h = t * t,
              e = s * s,
              n = (h - e) / h,
              r = 0;
            return a ? (h = (t *= 1 - n * (M + n * (c + n * u))) * t, n = 0) : r = Math.sqrt(n), {
              es: n,
              e: r,
              ep2: (h - e) / e
            }
          }(e.a, e.b, e.rf, i.R_A),
          r = i.datum || function (t, s, i, a, h, e) {
            var n = {};
            return n.datum_type = void 0 === t || "none" === t ? l : o, s && (n.datum_params = s.map(parseFloat), 0 === n.datum_params[0] && 0 === n.datum_params[1] && 0 === n.datum_params[2] || (n.datum_type = f), 3 < n.datum_params.length && (0 === n.datum_params[3] && 0 === n.datum_params[4] && 0 === n.datum_params[5] && 0 === n.datum_params[6] || (n.datum_type = m, n.datum_params[3] *= P, n.datum_params[4] *= P, n.datum_params[5] *= P, n.datum_params[6] = n.datum_params[6] / 1e6 + 1))), n.a = i, n.b = a, n.es = h, n.ep2 = e, n
          }(i.datumCode, i.datum_params, e.a, e.b, n.es, n.ep2);
        B(this, i), B(this, a), this.a = e.a, this.b = e.b, this.rf = e.rf, this.sphere = e.sphere, this.es = n.es, this.e = n.e, this.ep2 = n.ep2, this.datum = r, this.init(), s(null, this)
      } else s(t)
    } else s(t)
  }

  function Y(t) {
    return t === f || t === m
  }
  V.wgs84 = {
    towgs84: "0,0,0",
    ellipse: "WGS84",
    datumName: "WGS84"
  }, V.ch1903 = {
    towgs84: "674.374,15.056,405.346",
    ellipse: "bessel",
    datumName: "swiss"
  }, V.ggrs87 = {
    towgs84: "-199.87,74.79,246.62",
    ellipse: "GRS80",
    datumName: "Greek_Geodetic_Reference_System_1987"
  }, V.nad83 = {
    towgs84: "0,0,0",
    ellipse: "GRS80",
    datumName: "North_American_Datum_1983"
  }, V.nad27 = {
    nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
    ellipse: "clrk66",
    datumName: "North_American_Datum_1927"
  }, V.potsdam = {
    towgs84: "606.0,23.0,413.0",
    ellipse: "bessel",
    datumName: "Potsdam Rauenberg 1950 DHDN"
  }, V.carthage = {
    towgs84: "-263.0,6.0,431.0",
    ellipse: "clark80",
    datumName: "Carthage 1934 Tunisia"
  }, V.hermannskogel = {
    towgs84: "653.0,-212.0,449.0",
    ellipse: "bessel",
    datumName: "Hermannskogel"
  }, V.osni52 = {
    towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
    ellipse: "airy",
    datumName: "Irish National"
  }, V.ire65 = {
    towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
    ellipse: "mod_airy",
    datumName: "Ireland 1965"
  }, V.rassadiran = {
    towgs84: "-133.63,-157.5,-158.62",
    ellipse: "intl",
    datumName: "Rassadiran"
  }, V.nzgd49 = {
    towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
    ellipse: "intl",
    datumName: "New Zealand Geodetic Datum 1949"
  }, V.osgb36 = {
    towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
    ellipse: "airy",
    datumName: "Airy 1830"
  }, V.s_jtsk = {
    towgs84: "589,76,480",
    ellipse: "bessel",
    datumName: "S-JTSK (Ferro)"
  }, V.beduaram = {
    towgs84: "-106,-87,188",
    ellipse: "clrk80",
    datumName: "Beduaram"
  }, V.gunung_segara = {
    towgs84: "-403,684,41",
    ellipse: "bessel",
    datumName: "Gunung Segara Jakarta"
  }, V.rnb72 = {
    towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
    ellipse: "intl",
    datumName: "Reseau National Belge 1972"
  }, (Z.projections = X).start();
  var $ = function (t, s, i) {
      return function (t, s) {
        return t.datum_type === s.datum_type && (!(t.a !== s.a || 5e-11 < Math.abs(t.es - s.es)) && (t.datum_type === f ? t.datum_params[0] === s.datum_params[0] && t.datum_params[1] === s.datum_params[1] && t.datum_params[2] === s.datum_params[2] : t.datum_type !== m || t.datum_params[0] === s.datum_params[0] && t.datum_params[1] === s.datum_params[1] && t.datum_params[2] === s.datum_params[2] && t.datum_params[3] === s.datum_params[3] && t.datum_params[4] === s.datum_params[4] && t.datum_params[5] === s.datum_params[5] && t.datum_params[6] === s.datum_params[6]))
      }(t, s) ? i : t.datum_type === l || s.datum_type === l ? i : t.es !== s.es || t.a !== s.a || Y(t.datum_type) || Y(s.datum_type) ? (i = function (t, s, i) {
        var a, h, e, n, r = t.x,
          o = t.y,
          l = t.z ? t.z : 0;
        if (o < -S && -1.001 * S < o) o = -S;
        else if (S < o && o < 1.001 * S) o = S;
        else if (o < -S || S < o) return null;
        return r > Math.PI && (r -= 2 * Math.PI), h = Math.sin(o), n = Math.cos(o), e = h * h, {
          x: ((a = i / Math.sqrt(1 - s * e)) + l) * n * Math.cos(r),
          y: (a + l) * n * Math.sin(r),
          z: (a * (1 - s) + l) * h
        }
      }(i, t.es, t.a), Y(t.datum_type) && (i = function (t, s, i) {
        if (s === f) return {
          x: t.x + i[0],
          y: t.y + i[1],
          z: t.z + i[2]
        };
        if (s === m) {
          var a = i[0],
            h = i[1],
            e = i[2],
            n = i[3],
            r = i[4],
            o = i[5],
            l = i[6];
          return {
            x: l * (t.x - o * t.y + r * t.z) + a,
            y: l * (o * t.x + t.y - n * t.z) + h,
            z: l * (-r * t.x + n * t.y + t.z) + e
          }
        }
      }(i, t.datum_type, t.datum_params)), Y(s.datum_type) && (i = function (t, s, i) {
        if (s === f) return {
          x: t.x - i[0],
          y: t.y - i[1],
          z: t.z - i[2]
        };
        if (s === m) {
          var a = i[0],
            h = i[1],
            e = i[2],
            n = i[3],
            r = i[4],
            o = i[5],
            l = i[6],
            M = (t.x - a) / l,
            c = (t.y - h) / l,
            u = (t.z - e) / l;
          return {
            x: M + o * c - r * u,
            y: -o * M + c + n * u,
            z: r * M - n * c + u
          }
        }
      }(i, s.datum_type, s.datum_params)), function (t, s, i, a) {
        var h, e, n, r, o, l, M, c, u, f, m, p, d, _, y, v = 1e-12,
          x = t.x,
          g = t.y,
          b = t.z ? t.z : 0;
        if (h = Math.sqrt(x * x + g * g), e = Math.sqrt(x * x + g * g + b * b), h / i < v) {
          if (_ = 0, e / i < v) return S, y = -a, {
            x: t.x,
            y: t.y,
            z: t.z
          }
        } else _ = Math.atan2(g, x);
        for (n = b / e, c = (r = h / e) * (1 - s) * (o = 1 / Math.sqrt(1 - s * (2 - s) * r * r)), u = n * o, d = 0; d++, l = s * (M = i / Math.sqrt(1 - s * u * u)) / (M + (y = h * c + b * u - M * (1 - s * u * u))), p = (m = n * (o = 1 / Math.sqrt(1 - l * (2 - l) * r * r))) * c - (f = r * (1 - l) * o) * u, c = f, u = m, 1e-24 < p * p && d < 30;);
        return {
          x: _,
          y: Math.atan(m / Math.abs(f)),
          z: y
        }
      }(i, s.es, s.a, s.b)) : i
    },
    tt = function (t, s, i) {
      var a, h, e, n = i.x,
        r = i.y,
        o = i.z || 0,
        l = {};
      for (e = 0; e < 3; e++)
        if (!s || 2 !== e || void 0 !== i.z) switch (h = 0 === e ? (a = n, "x") : 1 === e ? (a = r, "y") : (a = o, "z"), t.axis[e]) {
          case "e":
            l[h] = a;
            break;
          case "w":
            l[h] = -a;
            break;
          case "n":
            l[h] = a;
            break;
          case "s":
            l[h] = -a;
            break;
          case "u":
            void 0 !== i[h] && (l.z = a);
            break;
          case "d":
            void 0 !== i[h] && (l.z = -a);
            break;
          default:
            return null
        }
      return l
    },
    st = function (t) {
      var s = {
        x: t[0],
        y: t[1]
      };
      return 2 < t.length && (s.z = t[2]), 3 < t.length && (s.m = t[3]), s
    },
    it = function (t) {
      at(t.x), at(t.y)
    };

  function at(t) {
    if ("function" == typeof Number.isFinite) {
      if (Number.isFinite(t)) return;
      throw new TypeError("coordinates must be finite numbers")
    }
    if ("number" != typeof t || t != t || !isFinite(t)) throw new TypeError("coordinates must be finite numbers")
  }

  function ht(t, s, i) {
    var a;
    return Array.isArray(i) && (i = st(i)), it(i), t.datum && s.datum && function (t, s) {
      return (t.datum.datum_type === f || t.datum.datum_type === m) && "WGS84" !== s.datumCode || (s.datum.datum_type === f || s.datum.datum_type === m) && "WGS84" !== t.datumCode
    }(t, s) && (i = ht(t, a = new Z("WGS84"), i), t = a), "enu" !== t.axis && (i = tt(t, !1, i)), i = "longlat" === t.projName ? {
      x: i.x * r,
      y: i.y * r
    } : (t.to_meter && (i = {
      x: i.x * t.to_meter,
      y: i.y * t.to_meter
    }), t.inverse(i)), t.from_greenwich && (i.x += t.from_greenwich), i = $(t.datum, s.datum, i), s.from_greenwich && (i = {
      x: i.x - s.from_greenwich,
      y: i.y
    }), "longlat" === s.projName ? i = {
      x: i.x * p,
      y: i.y * p
    } : (i = s.forward(i), s.to_meter && (i = {
      x: i.x / s.to_meter,
      y: i.y / s.to_meter
    })), "enu" !== s.axis ? tt(s, !0, i) : i
  }
  var et = Z("WGS84");

  function nt(t, s, i) {
    var a, h, e;
    return Array.isArray(i) ? (a = ht(t, s, i), 3 === i.length ? [a.x, a.y, a.z] : [a.x, a.y]) : (h = ht(t, s, i), 2 === (e = Object.keys(i)).length || e.forEach(function (t) {
      "x" !== t && "y" !== t && (h[t] = i[t])
    }), h)
  }

  function rt(t) {
    return t instanceof Z ? t : t.oProj ? t.oProj : Z(t)
  }

  function ot(s, i, t) {
    s = rt(s);
    var a, h = !1;
    return void 0 === i ? (i = s, s = et, h = !0) : void 0 === i.x && !Array.isArray(i) || (t = i, i = s, s = et, h = !0), i = rt(i), t ? nt(s, i, t) : (a = {
      forward: function (t) {
        return nt(s, i, t)
      },
      inverse: function (t) {
        return nt(i, s, t)
      }
    }, h && (a.oProj = i), a)
  }
  var lt = 6,
    Mt = "AJSAJS",
    ct = "AFAFAF",
    ut = 65,
    ft = 73,
    mt = 79,
    pt = 86,
    dt = 90,
    _t = {
      forward: yt,
      inverse: function (t) {
        var s = bt(At(t.toUpperCase()));
        if (s.lat && s.lon) return [s.lon, s.lat, s.lon, s.lat];
        return [s.left, s.bottom, s.right, s.top]
      },
      toPoint: vt
    };

  function yt(t, s) {
    return s = s || 5,
      function (t, s) {
        var i = "00000" + t.easting,
          a = "00000" + t.northing;
        return t.zoneNumber + t.zoneLetter + function (t, s, i) {
          var a = wt(i),
            h = Math.floor(t / 1e5),
            e = Math.floor(s / 1e5) % 20;
          return function (t, s, i) {
            var a = i - 1,
              h = Mt.charCodeAt(a),
              e = ct.charCodeAt(a),
              n = h + t - 1,
              r = e + s,
              o = !1;
            dt < n && (n = n - dt + ut - 1, o = !0);
            (n === ft || h < ft && ft < n || (ft < n || h < ft) && o) && n++;
            (n === mt || h < mt && mt < n || (mt < n || h < mt) && o) && ++n === ft && n++;
            dt < n && (n = n - dt + ut - 1);
            o = pt < r && (r = r - pt + ut - 1, !0);
            (r === ft || e < ft && ft < r || (ft < r || e < ft) && o) && r++;
            (r === mt || e < mt && mt < r || (mt < r || e < mt) && o) && ++r === ft && r++;
            pt < r && (r = r - pt + ut - 1);
            return String.fromCharCode(n) + String.fromCharCode(r)
          }(h, e, a)
        }(t.easting, t.northing, t.zoneNumber) + i.substr(i.length - 5, s) + a.substr(a.length - 5, s)
      }(function (t) {
        var s, i, a, h, e, n, r, o, l = t.lat,
          M = t.lon,
          c = .00669438,
          u = xt(l),
          f = xt(M);
        o = Math.floor((M + 180) / 6) + 1, 180 === M && (o = 60);
        56 <= l && l < 64 && 3 <= M && M < 12 && (o = 32);
        72 <= l && l < 84 && (0 <= M && M < 9 ? o = 31 : 9 <= M && M < 21 ? o = 33 : 21 <= M && M < 33 ? o = 35 : 33 <= M && M < 42 && (o = 37));
        r = xt(6 * (o - 1) - 180 + 3), s = c / (1 - c), i = 6378137 / Math.sqrt(1 - c * Math.sin(u) * Math.sin(u)), a = Math.tan(u) * Math.tan(u), h = s * Math.cos(u) * Math.cos(u), e = Math.cos(u) * (f - r), n = 6378137 * (.9983242984503243 * u - .002514607064228144 * Math.sin(2 * u) + 2639046602129982e-21 * Math.sin(4 * u) - 35 * c * c * c / 3072 * Math.sin(6 * u));
        var m = .9996 * i * (e + (1 - a + h) * e * e * e / 6 + (5 - 18 * a + a * a + 72 * h - 58 * s) * e * e * e * e * e / 120) + 5e5,
          p = .9996 * (n + i * Math.tan(u) * (e * e / 2 + (5 - a + 9 * h + 4 * h * h) * e * e * e * e / 24 + (61 - 58 * a + a * a + 600 * h - 330 * s) * e * e * e * e * e * e / 720));
        l < 0 && (p += 1e7);
        return {
          northing: Math.round(p),
          easting: Math.round(m),
          zoneNumber: o,
          zoneLetter: function (t) {
            var s = "Z";
            t <= 84 && 72 <= t ? s = "X" : t < 72 && 64 <= t ? s = "W" : t < 64 && 56 <= t ? s = "V" : t < 56 && 48 <= t ? s = "U" : t < 48 && 40 <= t ? s = "T" : t < 40 && 32 <= t ? s = "S" : t < 32 && 24 <= t ? s = "R" : t < 24 && 16 <= t ? s = "Q" : t < 16 && 8 <= t ? s = "P" : t < 8 && 0 <= t ? s = "N" : t < 0 && -8 <= t ? s = "M" : t < -8 && -16 <= t ? s = "L" : t < -16 && -24 <= t ? s = "K" : t < -24 && -32 <= t ? s = "J" : t < -32 && -40 <= t ? s = "H" : t < -40 && -48 <= t ? s = "G" : t < -48 && -56 <= t ? s = "F" : t < -56 && -64 <= t ? s = "E" : t < -64 && -72 <= t ? s = "D" : t < -72 && -80 <= t && (s = "C");
            return s
          }(l)
        }
      }({
        lat: t[1],
        lon: t[0]
      }), s)
  }

  function vt(t) {
    var s = bt(At(t.toUpperCase()));
    return s.lat && s.lon ? [s.lon, s.lat] : [(s.left + s.right) / 2, (s.top + s.bottom) / 2]
  }

  function xt(t) {
    return t * (Math.PI / 180)
  }

  function gt(t) {
    return t / Math.PI * 180
  }

  function bt(t) {
    var s = t.northing,
      i = t.easting,
      a = t.zoneLetter,
      h = t.zoneNumber;
    if (h < 0 || 60 < h) return null;
    var e, n, r, o, l, M, c, u, f, m = 6378137,
      p = .00669438,
      d = (1 - Math.sqrt(1 - p)) / (1 + Math.sqrt(1 - p)),
      _ = i - 5e5,
      y = s;
    a < "N" && (y -= 1e7), c = 6 * (h - 1) - 180 + 3, e = p / (1 - p), f = (u = y / .9996 / 6367449.145945056) + (3 * d / 2 - 27 * d * d * d / 32) * Math.sin(2 * u) + (21 * d * d / 16 - 55 * d * d * d * d / 32) * Math.sin(4 * u) + 151 * d * d * d / 96 * Math.sin(6 * u), n = m / Math.sqrt(1 - p * Math.sin(f) * Math.sin(f)), r = Math.tan(f) * Math.tan(f), o = e * Math.cos(f) * Math.cos(f), l = m * (1 - p) / Math.pow(1 - p * Math.sin(f) * Math.sin(f), 1.5), M = _ / (.9996 * n);
    var v = f - n * Math.tan(f) / l * (M * M / 2 - (5 + 3 * r + 10 * o - 4 * o * o - 9 * e) * M * M * M * M / 24 + (61 + 90 * r + 298 * o + 45 * r * r - 252 * e - 3 * o * o) * M * M * M * M * M * M / 720);
    v = gt(v);
    var x, g = (M - (1 + 2 * r + o) * M * M * M / 6 + (5 - 2 * o + 28 * r - 3 * o * o + 8 * e + 24 * r * r) * M * M * M * M * M / 120) / Math.cos(f);
    if (g = c + gt(g), t.accuracy) {
      var b = bt({
        northing: t.northing + t.accuracy,
        easting: t.easting + t.accuracy,
        zoneLetter: t.zoneLetter,
        zoneNumber: t.zoneNumber
      });
      x = {
        top: b.lat,
        right: b.lon,
        bottom: v,
        left: g
      }
    } else x = {
      lat: v,
      lon: g
    };
    return x
  }

  function wt(t) {
    var s = t % lt;
    return 0 === s && (s = lt), s
  }

  function At(t) {
    if (t && 0 === t.length) throw "MGRSPoint coverting from nothing";
    for (var s, i = t.length, a = null, h = "", e = 0; !/[A-Z]/.test(s = t.charAt(e));) {
      if (2 <= e) throw "MGRSPoint bad conversion from: " + t;
      h += s, e++
    }
    var n = parseInt(h, 10);
    if (0 === e || i < e + 3) throw "MGRSPoint bad conversion from: " + t;
    var r = t.charAt(e++);
    if (r <= "A" || "B" === r || "Y" === r || "Z" <= r || "I" === r || "O" === r) throw "MGRSPoint zone letter " + r + " not handled: " + t;
    a = t.substring(e, e += 2);
    for (var o = wt(n), l = function (t, s) {
        var i = Mt.charCodeAt(s - 1),
          a = 1e5,
          h = !1;
        for (; i !== t.charCodeAt(0);) {
          if (++i === ft && i++, i === mt && i++, dt < i) {
            if (h) throw "Bad character: " + t;
            i = ut, h = !0
          }
          a += 1e5
        }
        return a
      }(a.charAt(0), o), M = function (t, s) {
        if ("V" < t) throw "MGRSPoint given invalid Northing " + t;
        var i = ct.charCodeAt(s - 1),
          a = 0,
          h = !1;
        for (; i !== t.charCodeAt(0);) {
          if (++i === ft && i++, i === mt && i++, pt < i) {
            if (h) throw "Bad character: " + t;
            i = ut, h = !0
          }
          a += 1e5
        }
        return a
      }(a.charAt(1), o); M < Ct(r);) M += 2e6;
    var c = i - e;
    if (c % 2 != 0) throw "MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters" + t;
    var u, f, m, p = c / 2,
      d = 0,
      _ = 0;
    return 0 < p && (u = 1e5 / Math.pow(10, p), f = t.substring(e, e + p), d = parseFloat(f) * u, m = t.substring(e + p), _ = parseFloat(m) * u), {
      easting: d + l,
      northing: _ + M,
      zoneLetter: r,
      zoneNumber: n,
      accuracy: u
    }
  }

  function Ct(t) {
    var s;
    switch (t) {
      case "C":
        s = 11e5;
        break;
      case "D":
        s = 2e6;
        break;
      case "E":
        s = 28e5;
        break;
      case "F":
        s = 37e5;
        break;
      case "G":
        s = 46e5;
        break;
      case "H":
        s = 55e5;
        break;
      case "J":
        s = 64e5;
        break;
      case "K":
        s = 73e5;
        break;
      case "L":
        s = 82e5;
        break;
      case "M":
        s = 91e5;
        break;
      case "N":
        s = 0;
        break;
      case "P":
        s = 8e5;
        break;
      case "Q":
        s = 17e5;
        break;
      case "R":
        s = 26e5;
        break;
      case "S":
        s = 35e5;
        break;
      case "T":
        s = 44e5;
        break;
      case "U":
        s = 53e5;
        break;
      case "V":
        s = 62e5;
        break;
      case "W":
        s = 7e6;
        break;
      case "X":
        s = 79e5;
        break;
      default:
        s = -1
    }
    if (0 <= s) return s;
    throw "Invalid zone letter: " + t
  }

  function Et(t, s, i) {
    if (!(this instanceof Et)) return new Et(t, s, i);
    if (Array.isArray(t)) this.x = t[0], this.y = t[1], this.z = t[2] || 0;
    else if ("object" == typeof t) this.x = t.x, this.y = t.y, this.z = t.z || 0;
    else if ("string" == typeof t && void 0 === s) {
      var a = t.split(",");
      this.x = parseFloat(a[0], 10), this.y = parseFloat(a[1], 10), this.z = parseFloat(a[2], 10) || 0
    } else this.x = t, this.y = s, this.z = i || 0;
    console.warn("proj4.Point will be removed in version 3, use proj4.toPoint")
  }
  Et.fromMGRS = function (t) {
    return new Et(vt(t))
  }, Et.prototype.toMGRS = function (t) {
    return yt([this.x, this.y], t)
  };

  function Pt(t) {
    var s = [];
    s[0] = 1 - t * (.25 + t * (.046875 + t * (kt + t * qt))), s[1] = t * (.75 - t * (.046875 + t * (kt + t * qt)));
    var i = t * t;
    return s[2] = i * (.46875 - t * (.013020833333333334 + .007120768229166667 * t)), i *= t, s[3] = i * (.3645833333333333 - .005696614583333333 * t), s[4] = i * t * .3076171875, s
  }

  function St(t, s, i, a) {
    return i *= s, s *= s, a[0] * t - i * (a[1] + s * (a[2] + s * (a[3] + s * a[4])))
  }

  function Nt(t, s, i) {
    for (var a = 1 / (1 - s), h = t, e = 20; e; --e) {
      var n = Math.sin(h),
        r = 1 - s * n * n;
      if (h -= r = (St(h, n, Math.cos(h), i) - t) * (r * Math.sqrt(r)) * a, Math.abs(r) < N) return h
    }
    return h
  }
  var kt = .01953125,
    qt = .01068115234375;

  function It(t) {
    var s = Math.exp(t);
    return s = (s - 1 / s) / 2
  }

  function Rt(t, s) {
    t = Math.abs(t), s = Math.abs(s);
    var i = Math.max(t, s),
      a = Math.min(t, s) / (i || 1);
    return i * Math.sqrt(1 + Math.pow(a, 2))
  }

  function Ot(t) {
    var s = Math.abs(t);
    return s = function (t) {
      var s = 1 + t,
        i = s - 1;
      return 0 == i ? t : t * Math.log(s) / i
    }(s * (1 + s / (Rt(1, s) + 1))), t < 0 ? -s : s
  }

  function Gt(t, s) {
    for (var i, a = 2 * Math.cos(2 * s), h = t.length - 1, e = t[h], n = 0; 0 <= --h;) i = a * e - n + t[h], n = e, e = i;
    return s + i * Math.sin(2 * s)
  }

  function jt(t, s, i) {
    for (var a, h, e = Math.sin(s), n = Math.cos(s), r = It(i), o = function (t) {
        var s = Math.exp(t);
        return s = (s + 1 / s) / 2
      }(i), l = 2 * n * o, M = -2 * e * r, c = t.length - 1, u = t[c], f = 0, m = 0, p = 0; 0 <= --c;) a = m, h = f, u = l * (m = u) - a - M * (f = p) + t[c], p = M * m - h + l * f;
    return [(l = e * o) * u - (M = n * r) * p, l * p + M * u]
  }
  var Lt = {
    init: function () {
      this.x0 = void 0 !== this.x0 ? this.x0 : 0, this.y0 = void 0 !== this.y0 ? this.y0 : 0, this.long0 = void 0 !== this.long0 ? this.long0 : 0, this.lat0 = void 0 !== this.lat0 ? this.lat0 : 0, this.es && (this.en = Pt(this.es), this.ml0 = St(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en))
    },
    forward: function (t) {
      var s, i, a, h = t.x,
        e = t.y,
        n = z(h - this.long0),
        r = Math.sin(e),
        o = Math.cos(e);
      if (this.es) {
        var l = o * n,
          M = Math.pow(l, 2),
          c = this.ep2 * Math.pow(o, 2),
          u = Math.pow(c, 2),
          f = Math.abs(o) > N ? Math.tan(e) : 0,
          m = Math.pow(f, 2),
          p = Math.pow(m, 2);
        s = 1 - this.es * Math.pow(r, 2), l /= Math.sqrt(s);
        var d = St(e, r, o, this.en);
        i = this.a * (this.k0 * l * (1 + M / 6 * (1 - m + c + M / 20 * (5 - 18 * m + p + 14 * c - 58 * m * c + M / 42 * (61 + 179 * p - p * m - 479 * m))))) + this.x0, a = this.a * (this.k0 * (d - this.ml0 + r * n * l / 2 * (1 + M / 12 * (5 - m + 9 * c + 4 * u + M / 30 * (61 + p - 58 * m + 270 * c - 330 * m * c + M / 56 * (1385 + 543 * p - p * m - 3111 * m)))))) + this.y0
      } else {
        var _ = o * Math.sin(n);
        if (Math.abs(Math.abs(_) - 1) < N) return 93;
        if (i = .5 * this.a * this.k0 * Math.log((1 + _) / (1 - _)) + this.x0, a = o * Math.cos(n) / Math.sqrt(1 - Math.pow(_, 2)), 1 <= (_ = Math.abs(a))) {
          if (N < _ - 1) return 93;
          a = 0
        } else a = Math.acos(a);
        e < 0 && (a = -a), a = this.a * this.k0 * (a - this.lat0) + this.y0
      }
      return t.x = i, t.y = a, t
    },
    inverse: function (t) {
      var s, i, a, h, e = (t.x - this.x0) * (1 / this.a),
        n = (t.y - this.y0) * (1 / this.a);
      if (this.es)
        if (s = this.ml0 + n / this.k0, i = Nt(s, this.es, this.en), Math.abs(i) < S) {
          var r = Math.sin(i),
            o = Math.cos(i),
            l = Math.abs(o) > N ? Math.tan(i) : 0,
            M = this.ep2 * Math.pow(o, 2),
            c = Math.pow(M, 2),
            u = Math.pow(l, 2),
            f = Math.pow(u, 2);
          s = 1 - this.es * Math.pow(r, 2);
          var m = e * Math.sqrt(s) / this.k0,
            p = Math.pow(m, 2);
          a = i - (s *= l) * p / (1 - this.es) * .5 * (1 - p / 12 * (5 + 3 * u - 9 * M * u + M - 4 * c - p / 30 * (61 + 90 * u - 252 * M * u + 45 * f + 46 * M - p / 56 * (1385 + 3633 * u + 4095 * f + 1574 * f * u)))), h = z(this.long0 + m * (1 - p / 6 * (1 + 2 * u + M - p / 20 * (5 + 28 * u + 24 * f + 8 * M * u + 6 * M - p / 42 * (61 + 662 * u + 1320 * f + 720 * f * u)))) / o)
        } else a = S * L(n), h = 0;
      else {
        var d = Math.exp(e / this.k0),
          _ = .5 * (d - 1 / d),
          y = this.lat0 + n / this.k0,
          v = Math.cos(y);
        s = Math.sqrt((1 - Math.pow(v, 2)) / (1 + Math.pow(_, 2))), a = Math.asin(s), n < 0 && (a = -a), h = 0 == _ && 0 === v ? 0 : z(Math.atan2(_, v) + this.long0)
      }
      return t.x = h, t.y = a, t
    },
    names: ["Transverse_Mercator", "Transverse Mercator", "tmerc"]
  };
  var zt = {
    init: function () {
      if (void 0 === this.es || this.es <= 0) throw new Error("incorrect elliptical usage");
      this.x0 = void 0 !== this.x0 ? this.x0 : 0, this.y0 = void 0 !== this.y0 ? this.y0 : 0, this.long0 = void 0 !== this.long0 ? this.long0 : 0, this.lat0 = void 0 !== this.lat0 ? this.lat0 : 0, this.cgb = [], this.cbg = [], this.utg = [], this.gtu = [];
      var t = this.es / (1 + Math.sqrt(1 - this.es)),
        s = t / (2 - t),
        i = s;
      this.cgb[0] = s * (2 + s * (-2 / 3 + s * (s * (116 / 45 + s * (26 / 45 + -2854 / 675 * s)) - 2))), this.cbg[0] = s * (s * (2 / 3 + s * (4 / 3 + s * (-82 / 45 + s * (32 / 45 + 4642 / 4725 * s)))) - 2), i *= s, this.cgb[1] = i * (7 / 3 + s * (s * (-227 / 45 + s * (2704 / 315 + 2323 / 945 * s)) - 1.6)), this.cbg[1] = i * (5 / 3 + s * (-16 / 15 + s * (-13 / 9 + s * (904 / 315 + -1522 / 945 * s)))), i *= s, this.cgb[2] = i * (56 / 15 + s * (-136 / 35 + s * (-1262 / 105 + 73814 / 2835 * s))), this.cbg[2] = i * (-26 / 15 + s * (34 / 21 + s * (1.6 + -12686 / 2835 * s))), i *= s, this.cgb[3] = i * (4279 / 630 + s * (-332 / 35 + -399572 / 14175 * s)), this.cbg[3] = i * (1237 / 630 + s * (-24832 / 14175 * s - 2.4)), i *= s, this.cgb[4] = i * (4174 / 315 + -144838 / 6237 * s), this.cbg[4] = i * (-734 / 315 + 109598 / 31185 * s), i *= s, this.cgb[5] = i * (601676 / 22275), this.cbg[5] = i * (444337 / 155925), i = Math.pow(s, 2), this.Qn = this.k0 / (1 + s) * (1 + i * (.25 + i * (1 / 64 + i / 256))), this.utg[0] = s * (s * (2 / 3 + s * (-37 / 96 + s * (1 / 360 + s * (81 / 512 + -96199 / 604800 * s)))) - .5), this.gtu[0] = s * (.5 + s * (-2 / 3 + s * (5 / 16 + s * (41 / 180 + s * (-127 / 288 + 7891 / 37800 * s))))), this.utg[1] = i * (-1 / 48 + s * (-1 / 15 + s * (437 / 1440 + s * (-46 / 105 + 1118711 / 3870720 * s)))), this.gtu[1] = i * (13 / 48 + s * (s * (557 / 1440 + s * (281 / 630 + -1983433 / 1935360 * s)) - .6)), i *= s, this.utg[2] = i * (-17 / 480 + s * (37 / 840 + s * (209 / 4480 + -5569 / 90720 * s))), this.gtu[2] = i * (61 / 240 + s * (-103 / 140 + s * (15061 / 26880 + 167603 / 181440 * s))), i *= s, this.utg[3] = i * (-4397 / 161280 + s * (11 / 504 + 830251 / 7257600 * s)), this.gtu[3] = i * (49561 / 161280 + s * (-179 / 168 + 6601661 / 7257600 * s)), i *= s, this.utg[4] = i * (-4583 / 161280 + 108847 / 3991680 * s), this.gtu[4] = i * (34729 / 80640 + -3418889 / 1995840 * s), i *= s, this.utg[5] = -.03233083094085698 * i, this.gtu[5] = .6650675310896665 * i;
      var a = Gt(this.cbg, this.lat0);
      this.Zb = -this.Qn * (a + function (t, s) {
        for (var i, a = 2 * Math.cos(s), h = t.length - 1, e = t[h], n = 0; 0 <= --h;) i = a * e - n + t[h], n = e, e = i;
        return Math.sin(s) * i
      }(this.gtu, 2 * a))
    },
    forward: function (t) {
      var s = z(t.x - this.long0),
        i = t.y;
      i = Gt(this.cbg, i);
      var a = Math.sin(i),
        h = Math.cos(i),
        e = Math.sin(s),
        n = Math.cos(s);
      i = Math.atan2(a, n * h), s = Math.atan2(e * h, Rt(a, h * n)), s = Ot(Math.tan(s));
      var r, o, l = jt(this.gtu, 2 * i, 2 * s);
      return i += l[0], s += l[1], o = Math.abs(s) <= 2.623395162778 ? (r = this.a * (this.Qn * s) + this.x0, this.a * (this.Qn * i + this.Zb) + this.y0) : r = 1 / 0, t.x = r, t.y = o, t
    },
    inverse: function (t) {
      var s, i, a = (t.x - this.x0) * (1 / this.a),
        h = (t.y - this.y0) * (1 / this.a);
      if (h = (h - this.Zb) / this.Qn, a /= this.Qn, Math.abs(a) <= 2.623395162778) {
        var e = jt(this.utg, 2 * h, 2 * a);
        h += e[0], a += e[1], a = Math.atan(It(a));
        var n = Math.sin(h),
          r = Math.cos(h),
          o = Math.sin(a),
          l = Math.cos(a);
        h = Math.atan2(n * l, Rt(o, l * r)), a = Math.atan2(o, l * r), s = z(a + this.long0), i = Gt(this.cgb, h)
      } else i = s = 1 / 0;
      return t.x = s, t.y = i, t
    },
    names: ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc"]
  };

  function Tt(t, s) {
    return Math.pow((1 - t) / (1 + t), s)
  }
  var Dt = {
    init: function () {
      var t = function (t, s) {
        if (void 0 === t) {
          if ((t = Math.floor(30 * (z(s) + Math.PI) / Math.PI) + 1) < 0) return 0;
          if (60 < t) return 60
        }
        return t
      }(this.zone, this.long0);
      if (void 0 === t) throw new Error("unknown utm zone");
      this.lat0 = 0, this.long0 = (6 * Math.abs(t) - 183) * r, this.x0 = 5e5, this.y0 = this.utmSouth ? 1e7 : 0, this.k0 = .9996, zt.init.apply(this), this.forward = zt.forward, this.inverse = zt.inverse
    },
    names: ["Universal Transverse Mercator System", "utm"],
    dependsOn: "etmerc"
  };
  var Bt = {
    init: function () {
      var t = Math.sin(this.lat0),
        s = Math.cos(this.lat0);
      s *= s, this.rc = Math.sqrt(1 - this.es) / (1 - this.es * t * t), this.C = Math.sqrt(1 + this.es * s * s / (1 - this.es)), this.phic0 = Math.asin(t / this.C), this.ratexp = .5 * this.C * this.e, this.K = Math.tan(.5 * this.phic0 + d) / (Math.pow(Math.tan(.5 * this.lat0 + d), this.C) * Tt(this.e * t, this.ratexp))
    },
    forward: function (t) {
      var s = t.x,
        i = t.y;
      return t.y = 2 * Math.atan(this.K * Math.pow(Math.tan(.5 * i + d), this.C) * Tt(this.e * Math.sin(i), this.ratexp)) - S, t.x = this.C * s, t
    },
    inverse: function (t) {
      for (var s = t.x / this.C, i = t.y, a = Math.pow(Math.tan(.5 * i + d) / this.K, 1 / this.C), h = 20; 0 < h && (i = 2 * Math.atan(a * Tt(this.e * Math.sin(t.y), -.5 * this.e)) - S, !(Math.abs(i - t.y) < 1e-14)); --h) t.y = i;
      return h ? (t.x = s, t.y = i, t) : null
    },
    names: ["gauss"]
  };
  var Ut = {
    init: function () {
      Bt.init.apply(this), this.rc && (this.sinc0 = Math.sin(this.phic0), this.cosc0 = Math.cos(this.phic0), this.R2 = 2 * this.rc, this.title || (this.title = "Oblique Stereographic Alternative"))
    },
    forward: function (t) {
      var s, i, a, h;
      return t.x = z(t.x - this.long0), Bt.forward.apply(this, [t]), s = Math.sin(t.y), i = Math.cos(t.y), a = Math.cos(t.x), h = this.k0 * this.R2 / (1 + this.sinc0 * s + this.cosc0 * i * a), t.x = h * i * Math.sin(t.x), t.y = h * (this.cosc0 * s - this.sinc0 * i * a), t.x = this.a * t.x + this.x0, t.y = this.a * t.y + this.y0, t
    },
    inverse: function (t) {
      var s, i, a, h, e;
      if (t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, t.x /= this.k0, t.y /= this.k0, e = Math.sqrt(t.x * t.x + t.y * t.y)) {
        var n = 2 * Math.atan2(e, this.R2);
        s = Math.sin(n), i = Math.cos(n), h = Math.asin(i * this.sinc0 + t.y * s * this.cosc0 / e), a = Math.atan2(t.x * s, e * this.cosc0 * i - t.y * this.sinc0 * s)
      } else h = this.phic0, a = 0;
      return t.x = a, t.y = h, Bt.inverse.apply(this, [t]), t.x = z(t.x + this.long0), t
    },
    names: ["Stereographic_North_Pole", "Oblique_Stereographic", "Polar_Stereographic", "sterea", "Oblique Stereographic Alternative"]
  };
  var Ft = {
    init: function () {
      this.coslat0 = Math.cos(this.lat0), this.sinlat0 = Math.sin(this.lat0), this.sphere ? 1 === this.k0 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= N && (this.k0 = .5 * (1 + L(this.lat0) * Math.sin(this.lat_ts))) : (Math.abs(this.coslat0) <= N && (0 < this.lat0 ? this.con = 1 : this.con = -1), this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e)), 1 === this.k0 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= N && (this.k0 = .5 * this.cons * j(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / T(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts))), this.ms1 = j(this.e, this.sinlat0, this.coslat0), this.X0 = 2 * Math.atan(this.ssfn_(this.lat0, this.sinlat0, this.e)) - S, this.cosX0 = Math.cos(this.X0), this.sinX0 = Math.sin(this.X0))
    },
    forward: function (t) {
      var s, i, a, h, e, n, r = t.x,
        o = t.y,
        l = Math.sin(o),
        M = Math.cos(o),
        c = z(r - this.long0);
      return Math.abs(Math.abs(r - this.long0) - Math.PI) <= N && Math.abs(o + this.lat0) <= N ? (t.x = NaN, t.y = NaN, t) : this.sphere ? (s = 2 * this.k0 / (1 + this.sinlat0 * l + this.coslat0 * M * Math.cos(c)), t.x = this.a * s * M * Math.sin(c) + this.x0, t.y = this.a * s * (this.coslat0 * l - this.sinlat0 * M * Math.cos(c)) + this.y0, t) : (i = 2 * Math.atan(this.ssfn_(o, l, this.e)) - S, h = Math.cos(i), a = Math.sin(i), Math.abs(this.coslat0) <= N ? (e = T(this.e, o * this.con, this.con * l), n = 2 * this.a * this.k0 * e / this.cons, t.x = this.x0 + n * Math.sin(r - this.long0), t.y = this.y0 - this.con * n * Math.cos(r - this.long0)) : (Math.abs(this.sinlat0) < N ? (s = 2 * this.a * this.k0 / (1 + h * Math.cos(c)), t.y = s * a) : (s = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * a + this.cosX0 * h * Math.cos(c))), t.y = s * (this.cosX0 * a - this.sinX0 * h * Math.cos(c)) + this.y0), t.x = s * h * Math.sin(c) + this.x0), t)
    },
    inverse: function (t) {
      var s, i, a, h, e;
      t.x -= this.x0, t.y -= this.y0;
      var n = Math.sqrt(t.x * t.x + t.y * t.y);
      if (this.sphere) {
        var r = 2 * Math.atan(n / (.5 * this.a * this.k0));
        return s = this.long0, i = this.lat0, n <= N ? (t.x = s, t.y = i, t) : (i = Math.asin(Math.cos(r) * this.sinlat0 + t.y * Math.sin(r) * this.coslat0 / n), s = Math.abs(this.coslat0) < N ? 0 < this.lat0 ? z(this.long0 + Math.atan2(t.x, -1 * t.y)) : z(this.long0 + Math.atan2(t.x, t.y)) : z(this.long0 + Math.atan2(t.x * Math.sin(r), n * this.coslat0 * Math.cos(r) - t.y * this.sinlat0 * Math.sin(r))), t.x = s, t.y = i, t)
      }
      if (Math.abs(this.coslat0) <= N) {
        if (n <= N) return i = this.lat0, s = this.long0, t.x = s, t.y = i, t;
        t.x *= this.con, t.y *= this.con, a = n * this.cons / (2 * this.a * this.k0), i = this.con * D(this.e, a), s = this.con * z(this.con * this.long0 + Math.atan2(t.x, -1 * t.y))
      } else h = 2 * Math.atan(n * this.cosX0 / (2 * this.a * this.k0 * this.ms1)), s = this.long0, n <= N ? e = this.X0 : (e = Math.asin(Math.cos(h) * this.sinX0 + t.y * Math.sin(h) * this.cosX0 / n), s = z(this.long0 + Math.atan2(t.x * Math.sin(h), n * this.cosX0 * Math.cos(h) - t.y * this.sinX0 * Math.sin(h)))), i = -1 * D(this.e, Math.tan(.5 * (S + e)));
      return t.x = s, t.y = i, t
    },
    names: ["stere", "Stereographic_South_Pole", "Polar Stereographic (variant B)"],
    ssfn_: function (t, s, i) {
      return s *= i, Math.tan(.5 * (S + t)) * Math.pow((1 - s) / (1 + s), .5 * i)
    }
  };
  var Qt = {
    init: function () {
      var t = this.lat0;
      this.lambda0 = this.long0;
      var s = Math.sin(t),
        i = this.a,
        a = 1 / this.rf,
        h = 2 * a - Math.pow(a, 2),
        e = this.e = Math.sqrt(h);
      this.R = this.k0 * i * Math.sqrt(1 - h) / (1 - h * Math.pow(s, 2)), this.alpha = Math.sqrt(1 + h / (1 - h) * Math.pow(Math.cos(t), 4)), this.b0 = Math.asin(s / this.alpha);
      var n = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2)),
        r = Math.log(Math.tan(Math.PI / 4 + t / 2)),
        o = Math.log((1 + e * s) / (1 - e * s));
      this.K = n - this.alpha * r + this.alpha * e / 2 * o
    },
    forward: function (t) {
      var s = Math.log(Math.tan(Math.PI / 4 - t.y / 2)),
        i = this.e / 2 * Math.log((1 + this.e * Math.sin(t.y)) / (1 - this.e * Math.sin(t.y))),
        a = -this.alpha * (s + i) + this.K,
        h = 2 * (Math.atan(Math.exp(a)) - Math.PI / 4),
        e = this.alpha * (t.x - this.lambda0),
        n = Math.atan(Math.sin(e) / (Math.sin(this.b0) * Math.tan(h) + Math.cos(this.b0) * Math.cos(e))),
        r = Math.asin(Math.cos(this.b0) * Math.sin(h) - Math.sin(this.b0) * Math.cos(h) * Math.cos(e));
      return t.y = this.R / 2 * Math.log((1 + Math.sin(r)) / (1 - Math.sin(r))) + this.y0, t.x = this.R * n + this.x0, t
    },
    inverse: function (t) {
      for (var s = t.x - this.x0, i = t.y - this.y0, a = s / this.R, h = 2 * (Math.atan(Math.exp(i / this.R)) - Math.PI / 4), e = Math.asin(Math.cos(this.b0) * Math.sin(h) + Math.sin(this.b0) * Math.cos(h) * Math.cos(a)), n = Math.atan(Math.sin(a) / (Math.cos(this.b0) * Math.cos(a) - Math.sin(this.b0) * Math.tan(h))), r = this.lambda0 + n / this.alpha, o = 0, l = e, M = -1e3, c = 0; 1e-7 < Math.abs(l - M);) {
        if (20 < ++c) return;
        o = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + e / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(l)) / 2)), M = l, l = 2 * Math.atan(Math.exp(o)) - Math.PI / 2
      }
      return t.x = r, t.y = l, t
    },
    names: ["somerc"]
  };
  var Wt = {
    init: function () {
      this.no_off = this.no_off || !1, this.no_rot = this.no_rot || !1, isNaN(this.k0) && (this.k0 = 1);
      var t = Math.sin(this.lat0),
        s = Math.cos(this.lat0),
        i = this.e * t;
      this.bl = Math.sqrt(1 + this.es / (1 - this.es) * Math.pow(s, 4)), this.al = this.a * this.bl * this.k0 * Math.sqrt(1 - this.es) / (1 - i * i);
      var a, h, e = T(this.e, this.lat0, t),
        n = this.bl / s * Math.sqrt((1 - this.es) / (1 - i * i));
      if (n * n < 1 && (n = 1), isNaN(this.longc)) {
        var r = T(this.e, this.lat1, Math.sin(this.lat1)),
          o = T(this.e, this.lat2, Math.sin(this.lat2));
        0 <= this.lat0 ? this.el = (n + Math.sqrt(n * n - 1)) * Math.pow(e, this.bl) : this.el = (n - Math.sqrt(n * n - 1)) * Math.pow(e, this.bl);
        var l = Math.pow(r, this.bl),
          M = Math.pow(o, this.bl);
        h = .5 * ((a = this.el / l) - 1 / a);
        var c = (this.el * this.el - M * l) / (this.el * this.el + M * l),
          u = (M - l) / (M + l),
          f = z(this.long1 - this.long2);
        this.long0 = .5 * (this.long1 + this.long2) - Math.atan(c * Math.tan(.5 * this.bl * f) / u) / this.bl, this.long0 = z(this.long0);
        var m = z(this.long1 - this.long0);
        this.gamma0 = Math.atan(Math.sin(this.bl * m) / h), this.alpha = Math.asin(n * Math.sin(this.gamma0))
      } else a = 0 <= this.lat0 ? n + Math.sqrt(n * n - 1) : n - Math.sqrt(n * n - 1), this.el = a * Math.pow(e, this.bl), h = .5 * (a - 1 / a), this.gamma0 = Math.asin(Math.sin(this.alpha) / n), this.long0 = this.longc - Math.asin(h * Math.tan(this.gamma0)) / this.bl;
      this.no_off ? this.uc = 0 : 0 <= this.lat0 ? this.uc = this.al / this.bl * Math.atan2(Math.sqrt(n * n - 1), Math.cos(this.alpha)) : this.uc = -1 * this.al / this.bl * Math.atan2(Math.sqrt(n * n - 1), Math.cos(this.alpha))
    },
    forward: function (t) {
      var s, i, a, h = t.x,
        e = t.y,
        n = z(h - this.long0);
      if (Math.abs(Math.abs(e) - S) <= N) a = 0 < e ? -1 : 1, i = this.al / this.bl * Math.log(Math.tan(d + a * this.gamma0 * .5)), s = -1 * a * S * this.al / this.bl;
      else {
        var r = T(this.e, e, Math.sin(e)),
          o = this.el / Math.pow(r, this.bl),
          l = .5 * (o - 1 / o),
          M = .5 * (o + 1 / o),
          c = Math.sin(this.bl * n),
          u = (l * Math.sin(this.gamma0) - c * Math.cos(this.gamma0)) / M;
        i = Math.abs(Math.abs(u) - 1) <= N ? Number.POSITIVE_INFINITY : .5 * this.al * Math.log((1 - u) / (1 + u)) / this.bl, s = Math.abs(Math.cos(this.bl * n)) <= N ? this.al * this.bl * n : this.al * Math.atan2(l * Math.cos(this.gamma0) + c * Math.sin(this.gamma0), Math.cos(this.bl * n)) / this.bl
      }
      return this.no_rot ? (t.x = this.x0 + s, t.y = this.y0 + i) : (s -= this.uc, t.x = this.x0 + i * Math.cos(this.alpha) + s * Math.sin(this.alpha), t.y = this.y0 + s * Math.cos(this.alpha) - i * Math.sin(this.alpha)), t
    },
    inverse: function (t) {
      var s, i;
      this.no_rot ? (i = t.y - this.y0, s = t.x - this.x0) : (i = (t.x - this.x0) * Math.cos(this.alpha) - (t.y - this.y0) * Math.sin(this.alpha), s = (t.y - this.y0) * Math.cos(this.alpha) + (t.x - this.x0) * Math.sin(this.alpha), s += this.uc);
      var a = Math.exp(-1 * this.bl * i / this.al),
        h = .5 * (a - 1 / a),
        e = .5 * (a + 1 / a),
        n = Math.sin(this.bl * s / this.al),
        r = (n * Math.cos(this.gamma0) + h * Math.sin(this.gamma0)) / e,
        o = Math.pow(this.el / Math.sqrt((1 + r) / (1 - r)), 1 / this.bl);
      return Math.abs(r - 1) < N ? (t.x = this.long0, t.y = S) : Math.abs(1 + r) < N ? (t.x = this.long0, t.y = -1 * S) : (t.y = D(this.e, o), t.x = z(this.long0 - Math.atan2(h * Math.cos(this.gamma0) - n * Math.sin(this.gamma0), Math.cos(this.bl * s / this.al)) / this.bl)), t
    },
    names: ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "omerc"]
  };
  var Ht = {
    init: function () {
      if (this.lat2 || (this.lat2 = this.lat1), this.k0 || (this.k0 = 1), this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, !(Math.abs(this.lat1 + this.lat2) < N)) {
        var t = this.b / this.a;
        this.e = Math.sqrt(1 - t * t);
        var s = Math.sin(this.lat1),
          i = Math.cos(this.lat1),
          a = j(this.e, s, i),
          h = T(this.e, this.lat1, s),
          e = Math.sin(this.lat2),
          n = Math.cos(this.lat2),
          r = j(this.e, e, n),
          o = T(this.e, this.lat2, e),
          l = T(this.e, this.lat0, Math.sin(this.lat0));
        Math.abs(this.lat1 - this.lat2) > N ? this.ns = Math.log(a / r) / Math.log(h / o) : this.ns = s, isNaN(this.ns) && (this.ns = s), this.f0 = a / (this.ns * Math.pow(h, this.ns)), this.rh = this.a * this.f0 * Math.pow(l, this.ns), this.title || (this.title = "Lambert Conformal Conic")
      }
    },
    forward: function (t) {
      var s = t.x,
        i = t.y;
      Math.abs(2 * Math.abs(i) - Math.PI) <= N && (i = L(i) * (S - 2 * N));
      var a, h, e = Math.abs(Math.abs(i) - S);
      if (N < e) a = T(this.e, i, Math.sin(i)), h = this.a * this.f0 * Math.pow(a, this.ns);
      else {
        if ((e = i * this.ns) <= 0) return null;
        h = 0
      }
      var n = this.ns * z(s - this.long0);
      return t.x = this.k0 * (h * Math.sin(n)) + this.x0, t.y = this.k0 * (this.rh - h * Math.cos(n)) + this.y0, t
    },
    inverse: function (t) {
      var s, i, a, h, e, n = (t.x - this.x0) / this.k0,
        r = this.rh - (t.y - this.y0) / this.k0;
      i = 0 < this.ns ? (s = Math.sqrt(n * n + r * r), 1) : (s = -Math.sqrt(n * n + r * r), -1);
      var o = 0;
      if (0 !== s && (o = Math.atan2(i * n, i * r)), 0 !== s || 0 < this.ns) {
        if (i = 1 / this.ns, a = Math.pow(s / (this.a * this.f0), i), -9999 === (h = D(this.e, a))) return null
      } else h = -S;
      return e = z(o / this.ns + this.long0), t.x = e, t.y = h, t
    },
    names: ["Lambert Tangential Conformal Conic Projection", "Lambert_Conformal_Conic", "Lambert_Conformal_Conic_2SP", "lcc"]
  };

  function Xt(t, s, i, a, h) {
    return t * h - s * Math.sin(2 * h) + i * Math.sin(4 * h) - a * Math.sin(6 * h)
  }

  function Jt(t) {
    return 1 - .25 * t * (1 + t / 16 * (3 + 1.25 * t))
  }

  function Kt(t) {
    return .375 * t * (1 + .25 * t * (1 + .46875 * t))
  }

  function Vt(t) {
    return .05859375 * t * t * (1 + .75 * t)
  }

  function Zt(t) {
    return t * t * t * (35 / 3072)
  }

  function Yt(t, s, i) {
    var a = s * i;
    return t / Math.sqrt(1 - a * a)
  }

  function $t(t) {
    return Math.abs(t) < S ? t : t - L(t) * Math.PI
  }

  function ts(t, s, i, a, h) {
    var e, n;
    e = t / s;
    for (var r = 0; r < 15; r++)
      if (e += n = (t - (s * e - i * Math.sin(2 * e) + a * Math.sin(4 * e) - h * Math.sin(6 * e))) / (s - 2 * i * Math.cos(2 * e) + 4 * a * Math.cos(4 * e) - 6 * h * Math.cos(6 * e)), Math.abs(n) <= 1e-10) return e;
    return NaN
  }
  var ss = {
    init: function () {
      this.a = 6377397.155, this.es = .006674372230614, this.e = Math.sqrt(this.es), this.lat0 || (this.lat0 = .863937979737193), this.long0 || (this.long0 = .4334234309119251), this.k0 || (this.k0 = .9999), this.s45 = .785398163397448, this.s90 = 2 * this.s45, this.fi0 = this.lat0, this.e2 = this.es, this.e = Math.sqrt(this.e2), this.alfa = Math.sqrt(1 + this.e2 * Math.pow(Math.cos(this.fi0), 4) / (1 - this.e2)), this.uq = 1.04216856380474, this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa), this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2), this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g, this.k1 = this.k0, this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2)), this.s0 = 1.37008346281555, this.n = Math.sin(this.s0), this.ro0 = this.k1 * this.n0 / Math.tan(this.s0), this.ad = this.s90 - this.uq
    },
    forward: function (t) {
      var s, i, a, h, e, n, r, o = t.x,
        l = t.y,
        M = z(o - this.long0);
      return s = Math.pow((1 + this.e * Math.sin(l)) / (1 - this.e * Math.sin(l)), this.alfa * this.e / 2), i = 2 * (Math.atan(this.k * Math.pow(Math.tan(l / 2 + this.s45), this.alfa) / s) - this.s45), a = -M * this.alfa, h = Math.asin(Math.cos(this.ad) * Math.sin(i) + Math.sin(this.ad) * Math.cos(i) * Math.cos(a)), e = Math.asin(Math.cos(i) * Math.sin(a) / Math.cos(h)), n = this.n * e, r = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(h / 2 + this.s45), this.n), t.y = r * Math.cos(n) / 1, t.x = r * Math.sin(n) / 1, this.czech || (t.y *= -1, t.x *= -1), t
    },
    inverse: function (t) {
      var s, i, a, h, e, n, r, o = t.x;
      t.x = t.y, t.y = o, this.czech || (t.y *= -1, t.x *= -1), e = Math.sqrt(t.x * t.x + t.y * t.y), h = Math.atan2(t.y, t.x) / Math.sin(this.s0), a = 2 * (Math.atan(Math.pow(this.ro0 / e, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45), s = Math.asin(Math.cos(this.ad) * Math.sin(a) - Math.sin(this.ad) * Math.cos(a) * Math.cos(h)), i = Math.asin(Math.cos(a) * Math.sin(h) / Math.cos(s)), t.x = this.long0 - i / this.alfa, n = s;
      for (var l = r = 0; t.y = 2 * (Math.atan(Math.pow(this.k, -1 / this.alfa) * Math.pow(Math.tan(s / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(n)) / (1 - this.e * Math.sin(n)), this.e / 2)) - this.s45), Math.abs(n - t.y) < 1e-10 && (r = 1), n = t.y, l += 1, 0 === r && l < 15;);
      return 15 <= l ? null : t
    },
    names: ["Krovak", "krovak"]
  };

  function is(t, s) {
    var i;
    return 1e-7 < t ? (1 - t * t) * (s / (1 - (i = t * s) * i) - .5 / t * Math.log((1 - i) / (1 + i))) : 2 * s
  }
  var as = {
    init: function () {
      this.sphere || (this.e0 = Jt(this.es), this.e1 = Kt(this.es), this.e2 = Vt(this.es), this.e3 = Zt(this.es), this.ml0 = this.a * Xt(this.e0, this.e1, this.e2, this.e3, this.lat0))
    },
    forward: function (t) {
      var s, i, a = t.x,
        h = t.y;
      if (a = z(a - this.long0), this.sphere) s = this.a * Math.asin(Math.cos(h) * Math.sin(a)), i = this.a * (Math.atan2(Math.tan(h), Math.cos(a)) - this.lat0);
      else {
        var e = Math.sin(h),
          n = Math.cos(h),
          r = Yt(this.a, this.e, e),
          o = Math.tan(h) * Math.tan(h),
          l = a * Math.cos(h),
          M = l * l,
          c = this.es * n * n / (1 - this.es);
        s = r * l * (1 - M * o * (1 / 6 - (8 - o + 8 * c) * M / 120)), i = this.a * Xt(this.e0, this.e1, this.e2, this.e3, h) - this.ml0 + r * e / n * M * (.5 + (5 - o + 6 * c) * M / 24)
      }
      return t.x = s + this.x0, t.y = i + this.y0, t
    },
    inverse: function (t) {
      t.x -= this.x0, t.y -= this.y0;
      var s, i, a = t.x / this.a,
        h = t.y / this.a;
      if (this.sphere) {
        var e = h + this.lat0;
        s = Math.asin(Math.sin(e) * Math.cos(a)), i = Math.atan2(Math.tan(a), Math.cos(e))
      } else {
        var n = this.ml0 / this.a + h,
          r = ts(n, this.e0, this.e1, this.e2, this.e3);
        if (Math.abs(Math.abs(r) - S) <= N) return t.x = this.long0, t.y = S, h < 0 && (t.y *= -1), t;
        var o = Yt(this.a, this.e, Math.sin(r)),
          l = o * o * o / this.a / this.a * (1 - this.es),
          M = Math.pow(Math.tan(r), 2),
          c = a * this.a / o,
          u = c * c;
        s = r - o * Math.tan(r) / l * c * c * (.5 - (1 + 3 * M) * c * c / 24), i = c * (1 - u * (M / 3 + (1 + 3 * M) * M * u / 15)) / Math.cos(r)
      }
      return t.x = z(i + this.long0), t.y = $t(s), t
    },
    names: ["Cassini", "Cassini_Soldner", "cass"]
  };
  var hs = .3333333333333333,
    es = .17222222222222222,
    ns = .10257936507936508,
    rs = .06388888888888888,
    os = .0664021164021164,
    ls = .016415012942191543;

  function Ms(t) {
    return 1 < Math.abs(t) && (t = 1 < t ? 1 : -1), Math.asin(t)
  }
  var cs = {
    init: function () {
      var t, s = Math.abs(this.lat0);
      if (Math.abs(s - S) < N ? this.mode = this.lat0 < 0 ? this.S_POLE : this.N_POLE : Math.abs(s) < N ? this.mode = this.EQUIT : this.mode = this.OBLIQ, 0 < this.es) switch (this.qp = is(this.e, 1), this.mmf = .5 / (1 - this.es), this.apa = function (t) {
        var s, i = [];
        return i[0] = t * hs, s = t * t, i[0] += s * es, i[1] = s * rs, s *= t, i[0] += s * ns, i[1] += s * os, i[2] = s * ls, i
      }(this.es), this.mode) {
        case this.N_POLE:
        case this.S_POLE:
          this.dd = 1;
          break;
        case this.EQUIT:
          this.rq = Math.sqrt(.5 * this.qp), this.dd = 1 / this.rq, this.xmf = 1, this.ymf = .5 * this.qp;
          break;
        case this.OBLIQ:
          this.rq = Math.sqrt(.5 * this.qp), t = Math.sin(this.lat0), this.sinb1 = is(this.e, t) / this.qp, this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1), this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * t * t) * this.rq * this.cosb1), this.ymf = (this.xmf = this.rq) / this.dd, this.xmf *= this.dd
      } else this.mode === this.OBLIQ && (this.sinph0 = Math.sin(this.lat0), this.cosph0 = Math.cos(this.lat0))
    },
    forward: function (t) {
      var s, i, a, h, e, n, r, o, l, M, c = t.x,
        u = t.y;
      if (c = z(c - this.long0), this.sphere) {
        if (e = Math.sin(u), M = Math.cos(u), a = Math.cos(c), this.mode === this.OBLIQ || this.mode === this.EQUIT) {
          if ((i = this.mode === this.EQUIT ? 1 + M * a : 1 + this.sinph0 * e + this.cosph0 * M * a) <= N) return null;
          s = (i = Math.sqrt(2 / i)) * M * Math.sin(c), i *= this.mode === this.EQUIT ? e : this.cosph0 * e - this.sinph0 * M * a
        } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
          if (this.mode === this.N_POLE && (a = -a), Math.abs(u + this.phi0) < N) return null;
          i = d - .5 * u, s = (i = 2 * (this.mode === this.S_POLE ? Math.cos(i) : Math.sin(i))) * Math.sin(c), i *= a
        }
      } else {
        switch (l = o = r = 0, a = Math.cos(c), h = Math.sin(c), e = Math.sin(u), n = is(this.e, e), this.mode !== this.OBLIQ && this.mode !== this.EQUIT || (r = n / this.qp, o = Math.sqrt(1 - r * r)), this.mode) {
          case this.OBLIQ:
            l = 1 + this.sinb1 * r + this.cosb1 * o * a;
            break;
          case this.EQUIT:
            l = 1 + o * a;
            break;
          case this.N_POLE:
            l = S + u, n = this.qp - n;
            break;
          case this.S_POLE:
            l = u - S, n = this.qp + n
        }
        if (Math.abs(l) < N) return null;
        switch (this.mode) {
          case this.OBLIQ:
          case this.EQUIT:
            l = Math.sqrt(2 / l), i = this.mode === this.OBLIQ ? this.ymf * l * (this.cosb1 * r - this.sinb1 * o * a) : (l = Math.sqrt(2 / (1 + o * a))) * r * this.ymf, s = this.xmf * l * o * h;
            break;
          case this.N_POLE:
          case this.S_POLE:
            0 <= n ? (s = (l = Math.sqrt(n)) * h, i = a * (this.mode === this.S_POLE ? l : -l)) : s = i = 0
        }
      }
      return t.x = this.a * s + this.x0, t.y = this.a * i + this.y0, t
    },
    inverse: function (t) {
      t.x -= this.x0, t.y -= this.y0;
      var s, i, a, h, e, n, r, o = t.x / this.a,
        l = t.y / this.a;
      if (this.sphere) {
        var M, c = 0,
          u = 0;
        if (1 < (i = .5 * (M = Math.sqrt(o * o + l * l)))) return null;
        switch (i = 2 * Math.asin(i), this.mode !== this.OBLIQ && this.mode !== this.EQUIT || (u = Math.sin(i), c = Math.cos(i)), this.mode) {
          case this.EQUIT:
            i = Math.abs(M) <= N ? 0 : Math.asin(l * u / M), o *= u, l = c * M;
            break;
          case this.OBLIQ:
            i = Math.abs(M) <= N ? this.phi0 : Math.asin(c * this.sinph0 + l * u * this.cosph0 / M), o *= u * this.cosph0, l = (c - Math.sin(i) * this.sinph0) * M;
            break;
          case this.N_POLE:
            l = -l, i = S - i;
            break;
          case this.S_POLE:
            i -= S
        }
        s = 0 !== l || this.mode !== this.EQUIT && this.mode !== this.OBLIQ ? Math.atan2(o, l) : 0
      } else {
        if (r = 0, this.mode === this.OBLIQ || this.mode === this.EQUIT) {
          if (o /= this.dd, l *= this.dd, (n = Math.sqrt(o * o + l * l)) < N) return t.x = 0, t.y = this.phi0, t;
          h = 2 * Math.asin(.5 * n / this.rq), a = Math.cos(h), o *= h = Math.sin(h), l = this.mode === this.OBLIQ ? (r = a * this.sinb1 + l * h * this.cosb1 / n, e = this.qp * r, n * this.cosb1 * a - l * this.sinb1 * h) : (r = l * h / n, e = this.qp * r, n * a)
        } else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
          if (this.mode === this.N_POLE && (l = -l), !(e = o * o + l * l)) return t.x = 0, t.y = this.phi0, t;
          r = 1 - e / this.qp, this.mode === this.S_POLE && (r = -r)
        }
        s = Math.atan2(o, l), i = function (t, s) {
          var i = t + t;
          return t + s[0] * Math.sin(i) + s[1] * Math.sin(i + i) + s[2] * Math.sin(i + i + i)
        }(Math.asin(r), this.apa)
      }
      return t.x = z(this.long0 + s), t.y = i, t
    },
    names: ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"],
    S_POLE: 1,
    N_POLE: 2,
    EQUIT: 3,
    OBLIQ: 4
  };
  var us = {
    init: function () {
      Math.abs(this.lat1 + this.lat2) < N || (this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e3 = Math.sqrt(this.es), this.sin_po = Math.sin(this.lat1), this.cos_po = Math.cos(this.lat1), this.t1 = this.sin_po, this.con = this.sin_po, this.ms1 = j(this.e3, this.sin_po, this.cos_po), this.qs1 = is(this.e3, this.sin_po, this.cos_po), this.sin_po = Math.sin(this.lat2), this.cos_po = Math.cos(this.lat2), this.t2 = this.sin_po, this.ms2 = j(this.e3, this.sin_po, this.cos_po), this.qs2 = is(this.e3, this.sin_po, this.cos_po), this.sin_po = Math.sin(this.lat0), this.cos_po = Math.cos(this.lat0), this.t3 = this.sin_po, this.qs0 = is(this.e3, this.sin_po, this.cos_po), Math.abs(this.lat1 - this.lat2) > N ? this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1) : this.ns0 = this.con, this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1, this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0)
    },
    forward: function (t) {
      var s = t.x,
        i = t.y;
      this.sin_phi = Math.sin(i), this.cos_phi = Math.cos(i);
      var a = is(this.e3, this.sin_phi, this.cos_phi),
        h = this.a * Math.sqrt(this.c - this.ns0 * a) / this.ns0,
        e = this.ns0 * z(s - this.long0),
        n = h * Math.sin(e) + this.x0,
        r = this.rh - h * Math.cos(e) + this.y0;
      return t.x = n, t.y = r, t
    },
    inverse: function (t) {
      var s, i, a, h, e, n;
      return t.x -= this.x0, t.y = this.rh - t.y + this.y0, a = 0 <= this.ns0 ? (s = Math.sqrt(t.x * t.x + t.y * t.y), 1) : (s = -Math.sqrt(t.x * t.x + t.y * t.y), -1), (h = 0) !== s && (h = Math.atan2(a * t.x, a * t.y)), a = s * this.ns0 / this.a, n = this.sphere ? Math.asin((this.c - a * a) / (2 * this.ns0)) : (i = (this.c - a * a) / this.ns0, this.phi1z(this.e3, i)), e = z(h / this.ns0 + this.long0), t.x = e, t.y = n, t
    },
    names: ["Albers_Conic_Equal_Area", "Albers", "aea"],
    phi1z: function (t, s) {
      var i, a, h, e, n = Ms(.5 * s);
      if (t < N) return n;
      for (var r = t * t, o = 1; o <= 25; o++)
        if (n += e = .5 * (h = 1 - (a = t * (i = Math.sin(n))) * a) * h / Math.cos(n) * (s / (1 - r) - i / h + .5 / t * Math.log((1 - a) / (1 + a))), Math.abs(e) <= 1e-7) return n;
      return null
    }
  };
  var fs = {
    init: function () {
      this.sin_p14 = Math.sin(this.lat0), this.cos_p14 = Math.cos(this.lat0), this.infinity_dist = 1e3 * this.a, this.rc = 1
    },
    forward: function (t) {
      var s, i, a, h, e, n, r, o = t.x,
        l = t.y;
      return a = z(o - this.long0), s = Math.sin(l), i = Math.cos(l), h = Math.cos(a), 1, r = 0 < (e = this.sin_p14 * s + this.cos_p14 * i * h) || Math.abs(e) <= N ? (n = this.x0 + 1 * this.a * i * Math.sin(a) / e, this.y0 + 1 * this.a * (this.cos_p14 * s - this.sin_p14 * i * h) / e) : (n = this.x0 + this.infinity_dist * i * Math.sin(a), this.y0 + this.infinity_dist * (this.cos_p14 * s - this.sin_p14 * i * h)), t.x = n, t.y = r, t
    },
    inverse: function (t) {
      var s, i, a, h, e, n;
      return t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, t.x /= this.k0, t.y /= this.k0, e = (s = Math.sqrt(t.x * t.x + t.y * t.y)) ? (h = Math.atan2(s, this.rc), i = Math.sin(h), a = Math.cos(h), n = Ms(a * this.sin_p14 + t.y * i * this.cos_p14 / s), e = Math.atan2(t.x * i, s * this.cos_p14 * a - t.y * this.sin_p14 * i), z(this.long0 + e)) : (n = this.phic0, 0), t.x = e, t.y = n, t
    },
    names: ["gnom"]
  };
  var ms = {
    init: function () {
      this.sphere || (this.k0 = j(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)))
    },
    forward: function (t) {
      var s, i, a = t.x,
        h = t.y,
        e = z(a - this.long0);
      if (this.sphere) s = this.x0 + this.a * e * Math.cos(this.lat_ts), i = this.y0 + this.a * Math.sin(h) / Math.cos(this.lat_ts);
      else {
        var n = is(this.e, Math.sin(h));
        s = this.x0 + this.a * this.k0 * e, i = this.y0 + this.a * n * .5 / this.k0
      }
      return t.x = s, t.y = i, t
    },
    inverse: function (t) {
      var s, i;
      return t.x -= this.x0, t.y -= this.y0, this.sphere ? (s = z(this.long0 + t.x / this.a / Math.cos(this.lat_ts)), i = Math.asin(t.y / this.a * Math.cos(this.lat_ts))) : (i = function (t, s) {
        var i = 1 - (1 - t * t) / (2 * t) * Math.log((1 - t) / (1 + t));
        if (Math.abs(Math.abs(s) - i) < 1e-6) return s < 0 ? -1 * S : S;
        for (var a, h, e, n, r = Math.asin(.5 * s), o = 0; o < 30; o++)
          if (h = Math.sin(r), e = Math.cos(r), n = t * h, r += a = Math.pow(1 - n * n, 2) / (2 * e) * (s / (1 - t * t) - h / (1 - n * n) + .5 / t * Math.log((1 - n) / (1 + n))), Math.abs(a) <= 1e-10) return r;
        return NaN
      }(this.e, 2 * t.y * this.k0 / this.a), s = z(this.long0 + t.x / (this.a * this.k0))), t.x = s, t.y = i, t
    },
    names: ["cea"]
  };
  var ps = {
    init: function () {
      this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Equidistant Cylindrical (Plate Carre)", this.rc = Math.cos(this.lat_ts)
    },
    forward: function (t) {
      var s = t.x,
        i = t.y,
        a = z(s - this.long0),
        h = $t(i - this.lat0);
      return t.x = this.x0 + this.a * a * this.rc, t.y = this.y0 + this.a * h, t
    },
    inverse: function (t) {
      var s = t.x,
        i = t.y;
      return t.x = z(this.long0 + (s - this.x0) / (this.a * this.rc)), t.y = $t(this.lat0 + (i - this.y0) / this.a), t
    },
    names: ["Equirectangular", "Equidistant_Cylindrical", "eqc"]
  };
  var ds = {
    init: function () {
      this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = Jt(this.es), this.e1 = Kt(this.es), this.e2 = Vt(this.es), this.e3 = Zt(this.es), this.ml0 = this.a * Xt(this.e0, this.e1, this.e2, this.e3, this.lat0)
    },
    forward: function (t) {
      var s, i, a, h = t.x,
        e = t.y,
        n = z(h - this.long0);
      if (a = n * Math.sin(e), this.sphere) i = Math.abs(e) <= N ? (s = this.a * n, -1 * this.a * this.lat0) : (s = this.a * Math.sin(a) / Math.tan(e), this.a * ($t(e - this.lat0) + (1 - Math.cos(a)) / Math.tan(e)));
      else if (Math.abs(e) <= N) s = this.a * n, i = -1 * this.ml0;
      else {
        var r = Yt(this.a, this.e, Math.sin(e)) / Math.tan(e);
        s = r * Math.sin(a), i = this.a * Xt(this.e0, this.e1, this.e2, this.e3, e) - this.ml0 + r * (1 - Math.cos(a))
      }
      return t.x = s + this.x0, t.y = i + this.y0, t
    },
    inverse: function (t) {
      var s, i, a, h, e, n, r, o, l;
      if (a = t.x - this.x0, h = t.y - this.y0, this.sphere)
        if (Math.abs(h + this.a * this.lat0) <= N) s = z(a / this.a + this.long0), i = 0;
        else {
          var M;
          for (n = this.lat0 + h / this.a, r = a * a / this.a / this.a + n * n, o = n, e = 20; e; --e)
            if (o += l = -1 * (n * (o * (M = Math.tan(o)) + 1) - o - .5 * (o * o + r) * M) / ((o - n) / M - 1), Math.abs(l) <= N) {
              i = o;
              break
            } s = z(this.long0 + Math.asin(a * Math.tan(o) / this.a) / Math.sin(i))
        }
      else if (Math.abs(h + this.ml0) <= N) i = 0, s = z(this.long0 + a / this.a);
      else {
        var c, u, f, m, p;
        for (n = (this.ml0 + h) / this.a, r = a * a / this.a / this.a + n * n, o = n, e = 20; e; --e)
          if (p = this.e * Math.sin(o), c = Math.sqrt(1 - p * p) * Math.tan(o), u = this.a * Xt(this.e0, this.e1, this.e2, this.e3, o), f = this.e0 - 2 * this.e1 * Math.cos(2 * o) + 4 * this.e2 * Math.cos(4 * o) - 6 * this.e3 * Math.cos(6 * o), o -= l = (n * (c * (m = u / this.a) + 1) - m - .5 * c * (m * m + r)) / (this.es * Math.sin(2 * o) * (m * m + r - 2 * n * m) / (4 * c) + (n - m) * (c * f - 2 / Math.sin(2 * o)) - f), Math.abs(l) <= N) {
            i = o;
            break
          } c = Math.sqrt(1 - this.es * Math.pow(Math.sin(i), 2)) * Math.tan(i), s = z(this.long0 + Math.asin(a * c / this.a) / Math.sin(i))
      }
      return t.x = s, t.y = i, t
    },
    names: ["Polyconic", "poly"]
  };
  var _s = {
    init: function () {
      this.A = [], this.A[1] = .6399175073, this.A[2] = -.1358797613, this.A[3] = .063294409, this.A[4] = -.02526853, this.A[5] = .0117879, this.A[6] = -.0055161, this.A[7] = .0026906, this.A[8] = -.001333, this.A[9] = 67e-5, this.A[10] = -34e-5, this.B_re = [], this.B_im = [], this.B_re[1] = .7557853228, this.B_im[1] = 0, this.B_re[2] = .249204646, this.B_im[2] = .003371507, this.B_re[3] = -.001541739, this.B_im[3] = .04105856, this.B_re[4] = -.10162907, this.B_im[4] = .01727609, this.B_re[5] = -.26623489, this.B_im[5] = -.36249218, this.B_re[6] = -.6870983, this.B_im[6] = -1.1651967, this.C_re = [], this.C_im = [], this.C_re[1] = 1.3231270439, this.C_im[1] = 0, this.C_re[2] = -.577245789, this.C_im[2] = -.007809598, this.C_re[3] = .508307513, this.C_im[3] = -.112208952, this.C_re[4] = -.15094762, this.C_im[4] = .18200602, this.C_re[5] = 1.01418179, this.C_im[5] = 1.64497696, this.C_re[6] = 1.9660549, this.C_im[6] = 2.5127645, this.D = [], this.D[1] = 1.5627014243, this.D[2] = .5185406398, this.D[3] = -.03333098, this.D[4] = -.1052906, this.D[5] = -.0368594, this.D[6] = .007317, this.D[7] = .0122, this.D[8] = .00394, this.D[9] = -.0013
    },
    forward: function (t) {
      var s, i = t.x,
        a = t.y - this.lat0,
        h = i - this.long0,
        e = a / P * 1e-5,
        n = h,
        r = 1,
        o = 0;
      for (s = 1; s <= 10; s++) r *= e, o += this.A[s] * r;
      var l, M = o,
        c = n,
        u = 1,
        f = 0,
        m = 0,
        p = 0;
      for (s = 1; s <= 6; s++) l = f * M + u * c, u = u * M - f * c, f = l, m = m + this.B_re[s] * u - this.B_im[s] * f, p = p + this.B_im[s] * u + this.B_re[s] * f;
      return t.x = p * this.a + this.x0, t.y = m * this.a + this.y0, t
    },
    inverse: function (t) {
      var s, i, a = t.x,
        h = t.y,
        e = a - this.x0,
        n = (h - this.y0) / this.a,
        r = e / this.a,
        o = 1,
        l = 0,
        M = 0,
        c = 0;
      for (s = 1; s <= 6; s++) i = l * n + o * r, o = o * n - l * r, l = i, M = M + this.C_re[s] * o - this.C_im[s] * l, c = c + this.C_im[s] * o + this.C_re[s] * l;
      for (var u = 0; u < this.iterations; u++) {
        var f, m = M,
          p = c,
          d = n,
          _ = r;
        for (s = 2; s <= 6; s++) f = p * M + m * c, m = m * M - p * c, p = f, d += (s - 1) * (this.B_re[s] * m - this.B_im[s] * p), _ += (s - 1) * (this.B_im[s] * m + this.B_re[s] * p);
        m = 1, p = 0;
        var y = this.B_re[1],
          v = this.B_im[1];
        for (s = 2; s <= 6; s++) f = p * M + m * c, m = m * M - p * c, p = f, y += s * (this.B_re[s] * m - this.B_im[s] * p), v += s * (this.B_im[s] * m + this.B_re[s] * p);
        var x = y * y + v * v;
        M = (d * y + _ * v) / x, c = (_ * y - d * v) / x
      }
      var g = M,
        b = c,
        w = 1,
        A = 0;
      for (s = 1; s <= 9; s++) w *= g, A += this.D[s] * w;
      var C = this.lat0 + A * P * 1e5,
        E = this.long0 + b;
      return t.x = E, t.y = C, t
    },
    names: ["New_Zealand_Map_Grid", "nzmg"]
  };
  var ys = {
    init: function () {},
    forward: function (t) {
      var s = t.x,
        i = t.y,
        a = z(s - this.long0),
        h = this.x0 + this.a * a,
        e = this.y0 + this.a * Math.log(Math.tan(Math.PI / 4 + i / 2.5)) * 1.25;
      return t.x = h, t.y = e, t
    },
    inverse: function (t) {
      t.x -= this.x0, t.y -= this.y0;
      var s = z(this.long0 + t.x / this.a),
        i = 2.5 * (Math.atan(Math.exp(.8 * t.y / this.a)) - Math.PI / 4);
      return t.x = s, t.y = i, t
    },
    names: ["Miller_Cylindrical", "mill"]
  };
  var vs = {
    init: function () {
      this.sphere ? (this.n = 1, this.m = 0, this.es = 0, this.C_y = Math.sqrt((this.m + 1) / this.n), this.C_x = this.C_y / (this.m + 1)) : this.en = Pt(this.es)
    },
    forward: function (t) {
      var s, i, a = t.x,
        h = t.y;
      if (a = z(a - this.long0), this.sphere) {
        if (this.m)
          for (var e = this.n * Math.sin(h), n = 20; n; --n) {
            var r = (this.m * h + Math.sin(h) - e) / (this.m + Math.cos(h));
            if (h -= r, Math.abs(r) < N) break
          } else h = 1 !== this.n ? Math.asin(this.n * Math.sin(h)) : h;
        s = this.a * this.C_x * a * (this.m + Math.cos(h)), i = this.a * this.C_y * h
      } else {
        var o = Math.sin(h),
          l = Math.cos(h);
        i = this.a * St(h, o, l, this.en), s = this.a * a * l / Math.sqrt(1 - this.es * o * o)
      }
      return t.x = s, t.y = i, t
    },
    inverse: function (t) {
      var s, i, a, h;
      return t.x -= this.x0, a = t.x / this.a, t.y -= this.y0, s = t.y / this.a, this.sphere ? (s /= this.C_y, a /= this.C_x * (this.m + Math.cos(s)), this.m ? s = Ms((this.m * s + Math.sin(s)) / this.n) : 1 !== this.n && (s = Ms(Math.sin(s) / this.n)), a = z(a + this.long0), s = $t(s)) : (s = Nt(t.y / this.a, this.es, this.en), (h = Math.abs(s)) < S ? (h = Math.sin(s), i = this.long0 + t.x * Math.sqrt(1 - this.es * h * h) / (this.a * Math.cos(s)), a = z(i)) : h - N < S && (a = this.long0)), t.x = a, t.y = s, t
    },
    names: ["Sinusoidal", "sinu"]
  };
  var xs = {
    init: function () {},
    forward: function (t) {
      for (var s = t.x, i = t.y, a = z(s - this.long0), h = i, e = Math.PI * Math.sin(i);;) {
        var n = -(h + Math.sin(h) - e) / (1 + Math.cos(h));
        if (h += n, Math.abs(n) < N) break
      }
      h /= 2, Math.PI / 2 - Math.abs(i) < N && (a = 0);
      var r = .900316316158 * this.a * a * Math.cos(h) + this.x0,
        o = 1.4142135623731 * this.a * Math.sin(h) + this.y0;
      return t.x = r, t.y = o, t
    },
    inverse: function (t) {
      var s, i;
      t.x -= this.x0, t.y -= this.y0, i = t.y / (1.4142135623731 * this.a), .999999999999 < Math.abs(i) && (i = .999999999999), s = Math.asin(i);
      var a = z(this.long0 + t.x / (.900316316158 * this.a * Math.cos(s)));
      a < -Math.PI && (a = -Math.PI), a > Math.PI && (a = Math.PI), i = (2 * s + Math.sin(2 * s)) / Math.PI, 1 < Math.abs(i) && (i = 1);
      var h = Math.asin(i);
      return t.x = a, t.y = h, t
    },
    names: ["Mollweide", "moll"]
  };
  var gs = {
    init: function () {
      Math.abs(this.lat1 + this.lat2) < N || (this.lat2 = this.lat2 || this.lat1, this.temp = this.b / this.a, this.es = 1 - Math.pow(this.temp, 2), this.e = Math.sqrt(this.es), this.e0 = Jt(this.es), this.e1 = Kt(this.es), this.e2 = Vt(this.es), this.e3 = Zt(this.es), this.sinphi = Math.sin(this.lat1), this.cosphi = Math.cos(this.lat1), this.ms1 = j(this.e, this.sinphi, this.cosphi), this.ml1 = Xt(this.e0, this.e1, this.e2, this.e3, this.lat1), Math.abs(this.lat1 - this.lat2) < N ? this.ns = this.sinphi : (this.sinphi = Math.sin(this.lat2), this.cosphi = Math.cos(this.lat2), this.ms2 = j(this.e, this.sinphi, this.cosphi), this.ml2 = Xt(this.e0, this.e1, this.e2, this.e3, this.lat2), this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1)), this.g = this.ml1 + this.ms1 / this.ns, this.ml0 = Xt(this.e0, this.e1, this.e2, this.e3, this.lat0), this.rh = this.a * (this.g - this.ml0))
    },
    forward: function (t) {
      var s, i = t.x,
        a = t.y;
      if (this.sphere) s = this.a * (this.g - a);
      else {
        var h = Xt(this.e0, this.e1, this.e2, this.e3, a);
        s = this.a * (this.g - h)
      }
      var e = this.ns * z(i - this.long0),
        n = this.x0 + s * Math.sin(e),
        r = this.y0 + this.rh - s * Math.cos(e);
      return t.x = n, t.y = r, t
    },
    inverse: function (t) {
      var s, i, a, h;
      t.x -= this.x0, t.y = this.rh - t.y + this.y0, s = 0 <= this.ns ? (i = Math.sqrt(t.x * t.x + t.y * t.y), 1) : (i = -Math.sqrt(t.x * t.x + t.y * t.y), -1);
      var e = 0;
      if (0 !== i && (e = Math.atan2(s * t.x, s * t.y)), this.sphere) return h = z(this.long0 + e / this.ns), a = $t(this.g - i / this.a), t.x = h, t.y = a, t;
      var n = this.g - i / this.a;
      return a = ts(n, this.e0, this.e1, this.e2, this.e3), h = z(this.long0 + e / this.ns), t.x = h, t.y = a, t
    },
    names: ["Equidistant_Conic", "eqdc"]
  };
  var bs = {
    init: function () {
      this.R = this.a
    },
    forward: function (t) {
      var s, i, a = t.x,
        h = t.y,
        e = z(a - this.long0);
      Math.abs(h) <= N && (s = this.x0 + this.R * e, i = this.y0);
      var n = Ms(2 * Math.abs(h / Math.PI));
      (Math.abs(e) <= N || Math.abs(Math.abs(h) - S) <= N) && (s = this.x0, i = 0 <= h ? this.y0 + Math.PI * this.R * Math.tan(.5 * n) : this.y0 + Math.PI * this.R * -Math.tan(.5 * n));
      var r = .5 * Math.abs(Math.PI / e - e / Math.PI),
        o = r * r,
        l = Math.sin(n),
        M = Math.cos(n),
        c = M / (l + M - 1),
        u = c * c,
        f = c * (2 / l - 1),
        m = f * f,
        p = Math.PI * this.R * (r * (c - m) + Math.sqrt(o * (c - m) * (c - m) - (m + o) * (u - m))) / (m + o);
      e < 0 && (p = -p), s = this.x0 + p;
      var d = o + c;
      return p = Math.PI * this.R * (f * d - r * Math.sqrt((m + o) * (1 + o) - d * d)) / (m + o), i = 0 <= h ? this.y0 + p : this.y0 - p, t.x = s, t.y = i, t
    },
    inverse: function (t) {
      var s, i, a, h, e, n, r, o, l, M, c, u;
      return t.x -= this.x0, t.y -= this.y0, c = Math.PI * this.R, e = (a = t.x / c) * a + (h = t.y / c) * h, c = 3 * (h * h / (o = -2 * (n = -Math.abs(h) * (1 + e)) + 1 + 2 * h * h + e * e) + (2 * (r = n - 2 * h * h + a * a) * r * r / o / o / o - 9 * n * r / o / o) / 27) / (l = (n - r * r / 3 / o) / o) / (M = 2 * Math.sqrt(-l / 3)), 1 < Math.abs(c) && (c = 0 <= c ? 1 : -1), u = Math.acos(c) / 3, i = 0 <= t.y ? (-M * Math.cos(u + Math.PI / 3) - r / 3 / o) * Math.PI : -(-M * Math.cos(u + Math.PI / 3) - r / 3 / o) * Math.PI, s = Math.abs(a) < N ? this.long0 : z(this.long0 + Math.PI * (e - 1 + Math.sqrt(1 + 2 * (a * a - h * h) + e * e)) / 2 / a), t.x = s, t.y = i, t
    },
    names: ["Van_der_Grinten_I", "VanDerGrinten", "vandg"]
  };
  var ws = {
    init: function () {
      this.sin_p12 = Math.sin(this.lat0), this.cos_p12 = Math.cos(this.lat0)
    },
    forward: function (t) {
      var s, i, a, h, e, n, r, o, l, M, c, u, f, m, p, d, _, y, v, x, g, b, w = t.x,
        A = t.y,
        C = Math.sin(t.y),
        E = Math.cos(t.y),
        P = z(w - this.long0);
      return this.sphere ? Math.abs(this.sin_p12 - 1) <= N ? (t.x = this.x0 + this.a * (S - A) * Math.sin(P), t.y = this.y0 - this.a * (S - A) * Math.cos(P)) : Math.abs(this.sin_p12 + 1) <= N ? (t.x = this.x0 + this.a * (S + A) * Math.sin(P), t.y = this.y0 + this.a * (S + A) * Math.cos(P)) : (y = this.sin_p12 * C + this.cos_p12 * E * Math.cos(P), _ = (d = Math.acos(y)) / Math.sin(d), t.x = this.x0 + this.a * _ * E * Math.sin(P), t.y = this.y0 + this.a * _ * (this.cos_p12 * C - this.sin_p12 * E * Math.cos(P))) : (s = Jt(this.es), i = Kt(this.es), a = Vt(this.es), h = Zt(this.es), Math.abs(this.sin_p12 - 1) <= N ? (e = this.a * Xt(s, i, a, h, S), n = this.a * Xt(s, i, a, h, A), t.x = this.x0 + (e - n) * Math.sin(P), t.y = this.y0 - (e - n) * Math.cos(P)) : Math.abs(this.sin_p12 + 1) <= N ? (e = this.a * Xt(s, i, a, h, S), n = this.a * Xt(s, i, a, h, A), t.x = this.x0 + (e + n) * Math.sin(P), t.y = this.y0 + (e + n) * Math.cos(P)) : (r = C / E, o = Yt(this.a, this.e, this.sin_p12), l = Yt(this.a, this.e, C), M = Math.atan((1 - this.es) * r + this.es * o * this.sin_p12 / (l * E)), v = 0 === (c = Math.atan2(Math.sin(P), this.cos_p12 * Math.tan(M) - this.sin_p12 * Math.cos(P))) ? Math.asin(this.cos_p12 * Math.sin(M) - this.sin_p12 * Math.cos(M)) : Math.abs(Math.abs(c) - Math.PI) <= N ? -Math.asin(this.cos_p12 * Math.sin(M) - this.sin_p12 * Math.cos(M)) : Math.asin(Math.sin(P) * Math.cos(M) / Math.sin(c)), u = this.e * this.sin_p12 / Math.sqrt(1 - this.es), d = o * v * (1 - (x = v * v) * (p = (f = this.e * this.cos_p12 * Math.cos(c) / Math.sqrt(1 - this.es)) * f) * (1 - p) / 6 + (g = x * v) / 8 * (m = u * f) * (1 - 2 * p) + (b = g * v) / 120 * (p * (4 - 7 * p) - 3 * u * u * (1 - 7 * p)) - b * v / 48 * m), t.x = this.x0 + d * Math.sin(c), t.y = this.y0 + d * Math.cos(c))), t
    },
    inverse: function (t) {
      var s, i, a, h, e, n, r, o, l, M, c, u, f, m, p, d, _, y, v, x, g, b;
      if (t.x -= this.x0, t.y -= this.y0, this.sphere) {
        if ((s = Math.sqrt(t.x * t.x + t.y * t.y)) > 2 * S * this.a) return;
        return i = s / this.a, a = Math.sin(i), h = Math.cos(i), e = this.long0, Math.abs(s) <= N ? n = this.lat0 : (n = Ms(h * this.sin_p12 + t.y * a * this.cos_p12 / s), r = Math.abs(this.lat0) - S, e = Math.abs(r) <= N ? 0 <= this.lat0 ? z(this.long0 + Math.atan2(t.x, -t.y)) : z(this.long0 - Math.atan2(-t.x, t.y)) : z(this.long0 + Math.atan2(t.x * a, s * this.cos_p12 * h - t.y * this.sin_p12 * a))), t.x = e, t.y = n, t
      }
      return o = Jt(this.es), l = Kt(this.es), M = Vt(this.es), c = Zt(this.es), Math.abs(this.sin_p12 - 1) <= N ? (u = this.a * Xt(o, l, M, c, S), s = Math.sqrt(t.x * t.x + t.y * t.y), n = ts((u - s) / this.a, o, l, M, c), e = z(this.long0 + Math.atan2(t.x, -1 * t.y))) : Math.abs(this.sin_p12 + 1) <= N ? (u = this.a * Xt(o, l, M, c, S), s = Math.sqrt(t.x * t.x + t.y * t.y), n = ts((s - u) / this.a, o, l, M, c), e = z(this.long0 + Math.atan2(t.x, t.y))) : (s = Math.sqrt(t.x * t.x + t.y * t.y), p = Math.atan2(t.x, t.y), f = Yt(this.a, this.e, this.sin_p12), d = Math.cos(p), y = -(_ = this.e * this.cos_p12 * d) * _ / (1 - this.es), v = 3 * this.es * (1 - y) * this.sin_p12 * this.cos_p12 * d / (1 - this.es), b = 1 - y * (g = (x = s / f) - y * (1 + y) * Math.pow(x, 3) / 6 - v * (1 + 3 * y) * Math.pow(x, 4) / 24) * g / 2 - x * g * g * g / 6, m = Math.asin(this.sin_p12 * Math.cos(g) + this.cos_p12 * Math.sin(g) * d), e = z(this.long0 + Math.asin(Math.sin(p) * Math.sin(g) / Math.cos(m))), n = Math.atan((1 - this.es * b * this.sin_p12 / Math.sin(m)) * Math.tan(m) / (1 - this.es))), t.x = e, t.y = n, t
    },
    names: ["Azimuthal_Equidistant", "aeqd"]
  };
  var As = {
      init: function () {
        this.sin_p14 = Math.sin(this.lat0), this.cos_p14 = Math.cos(this.lat0)
      },
      forward: function (t) {
        var s, i, a, h, e, n, r, o = t.x,
          l = t.y;
        return a = z(o - this.long0), s = Math.sin(l), i = Math.cos(l), h = Math.cos(a), 1, (0 < (e = this.sin_p14 * s + this.cos_p14 * i * h) || Math.abs(e) <= N) && (n = 1 * this.a * i * Math.sin(a), r = this.y0 + 1 * this.a * (this.cos_p14 * s - this.sin_p14 * i * h)), t.x = n, t.y = r, t
      },
      inverse: function (t) {
        var s, i, a, h, e, n, r;
        return t.x -= this.x0, t.y -= this.y0, s = Math.sqrt(t.x * t.x + t.y * t.y), i = Ms(s / this.a), a = Math.sin(i), h = Math.cos(i), n = this.long0, Math.abs(s) <= N ? (r = this.lat0, t.x = n, t.y = r, t) : (r = Ms(h * this.sin_p14 + t.y * a * this.cos_p14 / s), e = Math.abs(this.lat0) - S, n = Math.abs(e) <= N ? 0 <= this.lat0 ? z(this.long0 + Math.atan2(t.x, -t.y)) : z(this.long0 - Math.atan2(-t.x, t.y)) : z(this.long0 + Math.atan2(t.x * a, s * this.cos_p14 * h - t.y * this.sin_p14 * a)), t.x = n, t.y = r, t)
      },
      names: ["ortho"]
    },
    Cs = 1,
    Es = 2,
    Ps = 3,
    Ss = 4,
    Ns = 5,
    ks = 6,
    qs = {
      AREA_0: 1,
      AREA_1: 2,
      AREA_2: 3,
      AREA_3: 4
    };

  function Is(t, s, i, a) {
    var h;
    return t < N ? (a.value = qs.AREA_0, h = 0) : (h = Math.atan2(s, i), Math.abs(h) <= d ? a.value = qs.AREA_0 : d < h && h <= S + d ? (a.value = qs.AREA_1, h -= S) : S + d < h || h <= -(S + d) ? (a.value = qs.AREA_2, h = 0 <= h ? h - y : h + y) : (a.value = qs.AREA_3, h += S)), h
  }

  function Rs(t, s) {
    var i = t + s;
    return i < -y ? i += a : +y < i && (i -= a), i
  }
  var Os, Gs = {
    init: function () {
      this.x0 = this.x0 || 0, this.y0 = this.y0 || 0, this.lat0 = this.lat0 || 0, this.long0 = this.long0 || 0, this.lat_ts = this.lat_ts || 0, this.title = this.title || "Quadrilateralized Spherical Cube", this.lat0 >= S - d / 2 ? this.face = Ns : this.lat0 <= -(S - d / 2) ? this.face = ks : Math.abs(this.long0) <= d ? this.face = Cs : Math.abs(this.long0) <= S + d ? this.face = 0 < this.long0 ? Es : Ss : this.face = Ps, 0 !== this.es && (this.one_minus_f = 1 - (this.a - this.b) / this.a, this.one_minus_f_squared = this.one_minus_f * this.one_minus_f)
    },
    forward: function (t) {
      var s, i, a, h, e, n, r = {
          x: 0,
          y: 0
        },
        o = {
          value: 0
        };
      if (t.x -= this.long0, s = 0 !== this.es ? Math.atan(this.one_minus_f_squared * Math.tan(t.y)) : t.y, i = t.x, this.face === Ns) h = S - s, a = d <= i && i <= S + d ? (o.value = qs.AREA_0, i - S) : S + d < i || i <= -(S + d) ? (o.value = qs.AREA_1, 0 < i ? i - y : i + y) : -(S + d) < i && i <= -d ? (o.value = qs.AREA_2, i + S) : (o.value = qs.AREA_3, i);
      else if (this.face === ks) h = S + s, a = d <= i && i <= S + d ? (o.value = qs.AREA_0, -i + S) : i < d && -d <= i ? (o.value = qs.AREA_1, -i) : i < -d && -(S + d) <= i ? (o.value = qs.AREA_2, -i - S) : (o.value = qs.AREA_3, 0 < i ? -i + y : -i - y);
      else {
        var l, M, c, u, f, m;
        this.face === Es ? i = Rs(i, +S) : this.face === Ps ? i = Rs(i, +y) : this.face === Ss && (i = Rs(i, -S)), u = Math.sin(s), f = Math.cos(s), m = Math.sin(i), l = f * Math.cos(i), M = f * m, c = u, this.face === Cs ? a = Is(h = Math.acos(l), c, M, o) : this.face === Es ? a = Is(h = Math.acos(M), c, -l, o) : this.face === Ps ? a = Is(h = Math.acos(-l), c, -M, o) : this.face === Ss ? a = Is(h = Math.acos(-M), c, l, o) : (h = a = 0, o.value = qs.AREA_0)
      }
      return n = Math.atan(12 / y * (a + Math.acos(Math.sin(a) * Math.cos(d)) - S)), e = Math.sqrt((1 - Math.cos(h)) / (Math.cos(n) * Math.cos(n)) / (1 - Math.cos(Math.atan(1 / Math.cos(a))))), o.value === qs.AREA_1 ? n += S : o.value === qs.AREA_2 ? n += y : o.value === qs.AREA_3 && (n += 1.5 * y), r.x = e * Math.cos(n), r.y = e * Math.sin(n), r.x = r.x * this.a + this.x0, r.y = r.y * this.a + this.y0, t.x = r.x, t.y = r.y, t
    },
    inverse: function (t) {
      var s, i, a, h, e, n, r, o, l, M, c, u, f = {
          lam: 0,
          phi: 0
        },
        m = {
          value: 0
        };
      if (t.x = (t.x - this.x0) / this.a, t.y = (t.y - this.y0) / this.a, i = Math.atan(Math.sqrt(t.x * t.x + t.y * t.y)), s = Math.atan2(t.y, t.x), 0 <= t.x && t.x >= Math.abs(t.y) ? m.value = qs.AREA_0 : 0 <= t.y && t.y >= Math.abs(t.x) ? (m.value = qs.AREA_1, s -= S) : t.x < 0 && -t.x >= Math.abs(t.y) ? (m.value = qs.AREA_2, s = s < 0 ? s + y : s - y) : (m.value = qs.AREA_3, s += S), l = y / 12 * Math.tan(s), e = Math.sin(l) / (Math.cos(l) - 1 / Math.sqrt(2)), n = Math.atan(e), (r = 1 - (a = Math.cos(s)) * a * (h = Math.tan(i)) * h * (1 - Math.cos(Math.atan(1 / Math.cos(n))))) < -1 ? r = -1 : 1 < r && (r = 1), this.face === Ns) o = Math.acos(r), f.phi = S - o, m.value === qs.AREA_0 ? f.lam = n + S : m.value === qs.AREA_1 ? f.lam = n < 0 ? n + y : n - y : m.value === qs.AREA_2 ? f.lam = n - S : f.lam = n;
      else if (this.face === ks) o = Math.acos(r), f.phi = o - S, m.value === qs.AREA_0 ? f.lam = -n + S : m.value === qs.AREA_1 ? f.lam = -n : m.value === qs.AREA_2 ? f.lam = -n - S : f.lam = n < 0 ? -n - y : -n + y;
      else {
        var p, d, _;
        l = (p = r) * p, d = 1 <= (l += (_ = 1 <= l ? 0 : Math.sqrt(1 - l) * Math.sin(n)) * _) ? 0 : Math.sqrt(1 - l), m.value === qs.AREA_1 ? (l = d, d = -_, _ = l) : m.value === qs.AREA_2 ? (d = -d, _ = -_) : m.value === qs.AREA_3 && (l = d, d = _, _ = -l), this.face === Es ? (l = p, p = -d, d = l) : this.face === Ps ? (p = -p, d = -d) : this.face === Ss && (l = p, p = d, d = -l), f.phi = Math.acos(-_) - S, f.lam = Math.atan2(d, p), this.face === Es ? f.lam = Rs(f.lam, -S) : this.face === Ps ? f.lam = Rs(f.lam, -y) : this.face === Ss && (f.lam = Rs(f.lam, +S))
      }
      return 0 !== this.es && (M = f.phi < 0 ? 1 : 0, c = Math.tan(f.phi), u = this.b / Math.sqrt(c * c + this.one_minus_f_squared), f.phi = Math.atan(Math.sqrt(this.a * this.a - u * u) / (this.one_minus_f * u)), M && (f.phi = -f.phi)), f.lam += this.long0, t.x = f.lam, t.y = f.phi, t
    },
    names: ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"]
  };
  return ot.defaultDatum = "WGS84", ot.Proj = Z, ot.WGS84 = new ot.Proj("WGS84"), ot.Point = Et, ot.toPoint = st, ot.defs = R, ot.transform = ht, ot.mgrs = _t, ot.version = "2.4.4", (Os = ot).Proj.projections.add(Lt), Os.Proj.projections.add(zt), Os.Proj.projections.add(Dt), Os.Proj.projections.add(Ut), Os.Proj.projections.add(Ft), Os.Proj.projections.add(Qt), Os.Proj.projections.add(Wt), Os.Proj.projections.add(Ht), Os.Proj.projections.add(ss), Os.Proj.projections.add(as), Os.Proj.projections.add(cs), Os.Proj.projections.add(us), Os.Proj.projections.add(fs), Os.Proj.projections.add(ms), Os.Proj.projections.add(ps), Os.Proj.projections.add(ds), Os.Proj.projections.add(_s), Os.Proj.projections.add(ys), Os.Proj.projections.add(vs), Os.Proj.projections.add(xs), Os.Proj.projections.add(gs), Os.Proj.projections.add(bs), Os.Proj.projections.add(ws), Os.Proj.projections.add(As), Os.Proj.projections.add(Gs), ot
});