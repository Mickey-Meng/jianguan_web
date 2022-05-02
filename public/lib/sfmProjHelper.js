! function (r, n) {
  "object" == typeof exports && "undefined" != typeof module ? module.exports = r(require("proj")) : "function" == typeof define && define.amd ? define(["proj"], r) : (n.SFM || (n.SFM = {})) && (n.SFM.sfmProjHelper = r(n.SFM.proj4))
}(function (e, r) {
  var n = "EPSG:4326",
    t = ["EPSG:4326", "WGS84"],
    o = ["EPSG:3857", "EPSG:3785", "EPSG:900913", "EPSG:102113", "EPSG:102100", "GOOGLE"];
  e.defs("EPSG:102100", e.defs("EPSG:3857"));

  function u(r, n, t) {
    return r == n ? t : e(r, n, t)
  }

  function i(r, n, t) {
    if (r == n) return t;
    if (!t || t.length % 2 != 0) return t;
    for (var e = f(r, n), o = [], u = 0; u < t.length; u += 2) {
      var i = e.forward([t[u], t[u + 1]]);
      o.push(i[0], i[1])
    }
    return o
  }
  var f = function (r, n) {
    return e(r, n)
  };
  return {
    data: {},
    defineProj: function () {
      return e.defs.apply(null, arguments)
    },
    getProjNameWgs84: function () {
      return n
    },
    isWgs84: function (r) {
      for (var n = 0; n < t.length; n++)
        if (r == t[n]) return !0;
      return !1
    },
    isWebMercator: function (r) {
      for (var n = 0; n < o.length; n++)
        if (r == o[n]) return !0;
      return !1
    },
    currentIsWgs84: function () {
      return this.isWgs84(this.curProj)
    },
    transformPoint: u,
    transformPoints: i,
    wgs84ToCurrent: function (r) {
      return u(n, this.curProj, r)
    },
    currentToWgs84: function (r) {
      return u(this.curProj, n, r)
    },
    pointsWgs84ToCurrent: function (r) {
      return i(n, this.curProj, r)
    },
    pointsCurrentToWgs84: function (r) {
      return i(this.curProj, n, r)
    },
    getCurrentProj: function () {
      return this.curProj
    },
    setCurrentProj: function (r) {
      this.curProj = r
    },
    getProjTransformer: f,
    getCurrentProjTransformer: function () {
      return f(n, this.curProj)
    },
    version: "0.1.0"
  }
}, window);