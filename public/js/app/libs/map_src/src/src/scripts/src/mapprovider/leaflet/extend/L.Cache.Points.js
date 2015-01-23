/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
(function (L) {
    'use strict';
    var latLngCache = [], pointCache = [],
        CACHE_SIZE = 50000,
        CACHE_SIZE_POINT = 100000,
        i;
//    for (i = 0; i < CACHE_SIZE; i += 1) {
//        latLngCache[i] = new L.latLng(0, 0);
//        pointCache[i] = new L.Point(0, 0);
//    }
//    for (i = 0; i < CACHE_SIZE_POINT; i += 1) {
//        pointCache[i] = new L.Point(0, 0);
//    }
    L.latLng = function (a, b, alt, forcenew) { // (LatLng) or ([Number, Number]) or (Number, Number)
        if (a instanceof L.LatLng) {
            if (forcenew) {
                return new L.LatLng(a.lat, a.lng, a.alt);
            }
            return a;
        }
        if (L.Util.isArray(a)) {
            if (typeof a[0] === 'number' || typeof a[0] === 'string') {
                return new L.LatLng(a[0], a[1], a[2]);
            } else {
                return null;
            }
        }
        if (a === undefined || a === null) {
            return a;
        }
        if (typeof a === 'object' && 'lat' in a) {
            return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon);
        }
        if (b === undefined) {
            return null;
        }
        return new L.LatLng(a, b);
    };
    L.LatLng.cache = function (latlng) {
//        var i, len;
//        if (Gis.Util.isArray(latlng)) {
//            for (i = 0, len = latlng.length; i < len; i += 1) {
//                L.LatLng.cache(latlng[i]);
//            }
//        } else if (latLngCache.length < CACHE_SIZE) {
//            latLngCache[latLngCache.length] = latlng;
//        }
    };
    L.point = function (x, y, round, forcenew) {
        var point;
        if (x instanceof L.Point) {
            if (forcenew) {
                if (pointCache.length) {
                    point = pointCache.pop();
                    point.x = x.x;
                    point.y = x.y;
                    return point;
                }
                return new L.Point(x.x, x.y);
            }
            return x;
        }
        if (pointCache.length) {
            point = pointCache.pop();
        }
        if (L.Util.isArray(x)) {
            if (point) {
                point.x = x[0];
                point.y = x[1];
                return point;
            }
            return new L.Point(x[0], x[1]);
        }
        if (x === undefined || x === null) {
            return x;
        }
        if (point) {
            point.x = (round ? Math.round(x) : x);
            point.y = (round ? Math.round(y) : y);
            return point;
        }
        return new L.Point(x, y, round);
    };
    L.Point.cache = function (point) {
//        var i, len;
//        if (Gis.Util.isArray(point)) {
//            for (i = 0, len = point.length; i < len; i += 1) {
//                L.Point.cache(point[i]);
//            }
//        } else if (pointCache.length < CACHE_SIZE_POINT) {
//            pointCache[pointCache.length] = point;
//        }
    };
}(L));