"use strict";

!(function (e, n) {
  "object" == typeof exports ? module.exports = n() : "function" == typeof define && define.amd ? define(n) : e.crel = n();
})(undefined, function () {
  function e() {
    var o,
        l = arguments,
        s = l[0],
        y = l[1],
        v = 2,
        g = l.length,
        h = e[i];if ((s = e[c](s) ? s : a.createElement(s), 1 === g)) return s;if (((!d(y, t) || e[u](y) || p(y)) && (--v, y = null), g - v === 1 && d(l[v], "string") && void 0 !== s[r])) s[r] = l[v];else for (; g > v; ++v) if ((o = l[v], null != o)) if (p(o)) for (var x = 0; x < o.length; ++x) m(s, o[x]);else m(s, o);for (var N in y) if (h[N]) {
      var b = h[N];typeof b === n ? b(s, y[N]) : s[f](b, y[N]);
    } else s[f](N, y[N]);return s;
  }var n = "function",
      t = "object",
      o = "nodeType",
      r = "textContent",
      f = "setAttribute",
      i = "attrMap",
      u = "isNode",
      c = "isElement",
      a = typeof document === t ? document : {},
      d = function d(e, n) {
    return typeof e === n;
  },
      l = typeof Node === n ? function (e) {
    return e instanceof Node;
  } : function (e) {
    return e && d(e, t) && o in e && d(e.ownerDocument, t);
  },
      s = function s(n) {
    return e[u](n) && 1 === n[o];
  },
      p = function p(e) {
    return e instanceof Array;
  },
      m = function m(n, t) {
    e[u](t) || (t = a.createTextNode(t)), n.appendChild(t);
  };return (e[i] = {}, e[c] = s, e[u] = l, e);
});
//# sourceMappingURL=crel.js.map
