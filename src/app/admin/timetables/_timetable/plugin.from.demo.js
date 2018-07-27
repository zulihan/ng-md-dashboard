"use strict";
var Timetable = function() {
    this.scope = {
        hourStart: 9,
        hourEnd: 17
    },
    this.locations = [],
    this.events = []
};
Timetable.Renderer = function(e) {
    if (!(e instanceof Timetable))
        throw new Error("Initialize renderer using a Timetable");
    this.timetable = e
}
,
function() {
    function e(e, n) {
        return t(e) && t(n)
    }
    function t(e) {
        return n(e) && r(e)
    }
    function n(e) {
        return e === parseInt(e, 10)
    }
    function r(e) {
        return e >= 0 && 24 > e
    }
    function o(e, t) {
        return -1 !== t.indexOf(e)
    }
    function a(e, t) {
        var n = e instanceof Date && t instanceof Date
          , r = t > e;
        return n && r
    }
    function i(e) {
        for (; e.firstChild; )
            e.removeChild(e.firstChild)
    }
    function c(e) {
        var t = 10 > e ? "0" : "";
        return t + e + ":00"
    }
    Timetable.prototype = {
        setScope: function(t, n) {
            if (!e(t, n))
                throw new RangeError("Timetable scope should consist of (start, end) in whole hours from 0 to 23");
            return this.scope.hourStart = t,
            this.scope.hourEnd = n,
            this
        },
        addLocations: function(e) {
            function t() {
                return e instanceof Array
            }
            var n = this.locations;
            if (!t())
                throw new Error("Tried to add locations in wrong format");
            return e.forEach(function(e) {
                if (o(e, n))
                    throw new Error("Location already exists");
                n.push(e)
            }),
            this
        },
        addEvent: function(e, t, n, r, i) {
            if (!o(t, this.locations))
                throw new Error("Unknown location");
            if (!a(n, r))
                throw new Error("Invalid time range: " + JSON.stringify([n, r]));
            return this.events.push({
                name: e,
                location: t,
                startDate: n,
                endDate: r,
                url: i
            }),
            this
        }
    },
    Timetable.Renderer.prototype = {
        draw: function(e) {
            function t(e, t) {
                return t > e ? t - e : 24 + t - e
            }
            function n(e) {
                if (null === e)
                    throw new Error("Timetable container not found")
            }
            function r(e) {
                var t = e.appendChild(document.createElement("aside"))
                  , n = t.appendChild(document.createElement("ul"));
                o(n)
            }
            function o(e) {
                for (var t = 0; t < p.locations.length; t++) {
                    var n = e.appendChild(document.createElement("li"))
                      , r = n.appendChild(document.createElement("span"));
                    r.className = "row-heading",
                    r.textContent = p.locations[t]
                }
            }
            function a(e) {
                var t = e.appendChild(document.createElement("section"))
                  , n = t.appendChild(document.createElement("time"));
                u(n),
                l(n)
            }
            function u(e) {
                for (var t = e.appendChild(document.createElement("header")), n = t.appendChild(document.createElement("ul")), r = !1, o = !1, a = p.scope.hourStart; !r; ) {
                    var i = n.appendChild(document.createElement("li"))
                      , u = i.appendChild(document.createElement("span"));
                    u.className = "time-label",
                    u.textContent = c(a),
                    a !== p.scope.hourEnd || p.scope.hourStart === p.scope.hourEnd && !o || (r = !0),
                    24 === ++a && (a = 0,
                    o = !0)
                }
            }
            function l(e) {
                var t = e.appendChild(document.createElement("ul"));
                t.className = "room-timeline";
                for (var n = 0; n < p.locations.length; n++) {
                    var r = t.appendChild(document.createElement("li"));
                    s(p.locations[n], r)
                }
            }
            function s(e, t) {
                for (var n = 0; n < p.events.length; n++) {
                    var r = p.events[n];
                    r.location === e && d(r, t)
                }
            }
            function d(e, t) {
                var n = e.url
                  , r = n ? "a" : "span"
                  , o = t.appendChild(document.createElement(r))
                  , a = o.appendChild(document.createElement("small"));
                o.title = e.name,
                n && (o.href = e.url),
                o.className = "time-entry",
                o.style.width = h(e),
                o.style.left = f(e),
                a.textContent = e.name
            }
            function h(e) {
                var t = e.startDate
                  , n = e.endDate
                  , r = m(t, n);
                return r / E * 100 + "%"
            }
            function m(e, t) {
                return (t.getTime() - e.getTime()) / 1e3 / 60 / 60
            }
            function f(e) {
                var t = e.startDate
                  , n = t.getHours() + t.getMinutes() / 60;
                return (n - p.scope.hourStart) / E * 100 + "%"
            }
            var p = this.timetable
              , E = t(p.scope.hourStart, p.scope.hourEnd)
              , v = document.querySelector(e);
            n(v),
            i(v),
            r(v),
            a(v)
        }
    }
}();
