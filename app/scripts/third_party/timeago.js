"use strict";

!(function (t) {
  "function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof module && "object" == typeof module.exports ? require("jquery") : jQuery);
})(function (t) {
  function e() {
    if (!t.contains(document.documentElement, this)) return (t(this).timeago("dispose"), this);var e = i(this),
        o = r.settings;return (isNaN(e.datetime) || (0 == o.cutoff || Math.abs(n(e.datetime)) < o.cutoff) && t(this).text(a(e.datetime)), this);
  }function i(e) {
    if ((e = t(e), !e.data("timeago"))) {
      e.data("timeago", { datetime: r.datetime(e) });var i = t.trim(e.text());r.settings.localeTitle ? e.attr("title", e.data("timeago").datetime.toLocaleString()) : !(i.length > 0) || r.isTime(e) && e.attr("title") || e.attr("title", i);
    }return e.data("timeago");
  }function a(t) {
    return r.inWords(n(t));
  }function n(t) {
    return new Date().getTime() - t.getTime();
  }t.timeago = function (e) {
    return a(e instanceof Date ? e : "string" == typeof e ? t.timeago.parse(e) : "number" == typeof e ? new Date(e) : t.timeago.datetime(e));
  };var r = t.timeago;t.extend(t.timeago, { settings: { refreshMillis: 6e4, allowPast: !0, allowFuture: !1, localeTitle: !1, cutoff: 0, strings: { prefixAgo: null, prefixFromNow: null, suffixAgo: "ago", suffixFromNow: "from now", inPast: "any moment now", seconds: "less than a minute", minute: "about a minute", minutes: "%d minutes", hour: "about an hour", hours: "about %d hours", day: "a day", days: "%d days", month: "about a month", months: "%d months", year: "about a year", years: "%d years", wordSeparator: " ", numbers: [] } }, inWords: function inWords(e) {
      function i(i, n) {
        var r = t.isFunction(i) ? i(n, e) : i,
            o = a.numbers && a.numbers[n] || n;return r.replace(/%d/i, o);
      }if (!this.settings.allowPast && !this.settings.allowFuture) throw "timeago allowPast and allowFuture settings can not both be set to false.";var a = this.settings.strings,
          n = a.prefixAgo,
          r = a.suffixAgo;if ((this.settings.allowFuture && 0 > e && (n = a.prefixFromNow, r = a.suffixFromNow), !this.settings.allowPast && e >= 0)) return this.settings.strings.inPast;var o = Math.abs(e) / 1e3,
          s = o / 60,
          u = s / 60,
          m = u / 24,
          l = m / 365,
          d = 45 > o && i(a.seconds, Math.round(o)) || 90 > o && i(a.minute, 1) || 45 > s && i(a.minutes, Math.round(s)) || 90 > s && i(a.hour, 1) || 24 > u && i(a.hours, Math.round(u)) || 42 > u && i(a.day, 1) || 30 > m && i(a.days, Math.round(m)) || 45 > m && i(a.month, 1) || 365 > m && i(a.months, Math.round(m / 30)) || 1.5 > l && i(a.year, 1) || i(a.years, Math.round(l)),
          f = a.wordSeparator || "";return (void 0 === a.wordSeparator && (f = " "), t.trim([n, d, r].join(f)));
    }, parse: function parse(e) {
      var i = t.trim(e);return (i = i.replace(/\.\d+/, ""), i = i.replace(/-/, "/").replace(/-/, "/"), i = i.replace(/T/, " ").replace(/Z/, " UTC"), i = i.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"), i = i.replace(/([\+\-]\d\d)$/, " $100"), new Date(i));
    }, datetime: function datetime(e) {
      var i = t(e).attr(r.isTime(e) ? "datetime" : "title");return r.parse(i);
    }, isTime: function isTime(e) {
      return "time" === t(e).get(0).tagName.toLowerCase();
    } });var o = { init: function init() {
      var i = t.proxy(e, this);i();var a = r.settings;a.refreshMillis > 0 && (this._timeagoInterval = setInterval(i, a.refreshMillis));
    }, update: function update(i) {
      var a = r.parse(i);t(this).data("timeago", { datetime: a }), r.settings.localeTitle && t(this).attr("title", a.toLocaleString()), e.apply(this);
    }, updateFromDOM: function updateFromDOM() {
      t(this).data("timeago", { datetime: r.parse(t(this).attr(r.isTime(this) ? "datetime" : "title")) }), e.apply(this);
    }, dispose: function dispose() {
      this._timeagoInterval && (window.clearInterval(this._timeagoInterval), this._timeagoInterval = null);
    } };t.fn.timeago = function (t, e) {
    var i = t ? o[t] : o.init;if (!i) throw new Error("Unknown function name '" + t + "' for timeago");return (this.each(function () {
      i.call(this, e);
    }), this);
  }, document.createElement("abbr"), document.createElement("time");
});
//# sourceMappingURL=timeago.js.map