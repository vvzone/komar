/**
 * Representing geographical data of point, based on Leaflet LatLng
 * @param {number[]} rawLat
 * @param {number[]} rawLng
 * @constructor
 */
"use strict";
Gis.LatLng = function (rawLat, rawLng) {
    /** @lends Gis.LatLng.prototype */
    var lat, lng;

    lat = parseFloat(rawLat);
    lng = parseFloat(rawLng);

    if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid LatLng object: (' + rawLat + ', ' + rawLng + ')');
    }

    this.lat = lat;
    this.lng = lng;
};

Gis.Util.extend(Gis.LatLng, {
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,
    MAX_MARGIN: 1.0E-8 // max margin of error for the "equals" check
});
/**
 *
 * @param {Array | Gis.LatLng} point1
 * @param {Array | Gis.LatLng} point2
 * @returns {number}
 */
Gis.LatLng.longitudeDifference = function (point1, point2) {
    var lng1 = Gis.Util.isNumeric(point1.lng) ? point1.lng : point1[1],
        lng2 = Gis.Util.isNumeric(point2.lng) ? point2.lng : point2[1];
    return Math.max(lng1, lng2) - Math.min(lng1, lng2);
};

Gis.LatLng.prototype = {
    equals: function (obj) { // (LatLng) -> Boolean
        if (!obj) { return false; }

        obj = Gis.latLng(obj);

        var margin = Math.max(
            Math.abs(this.lat - obj.lat),
            Math.abs(this.lng - obj.lng)
        );

        return margin <= Gis.LatLng.MAX_MARGIN;
    },

    toString: function (precision) { // (Number) -> String
        return 'LatLng(' +
            Gis.Util.formatNum(this.lat, precision) + ', ' +
            Gis.Util.formatNum(this.lng, precision) + ')';
    },
    abs: function () {
        return Gis.latLng(Math.abs(this.lat), Math.abs(this.lng));
    },

    // Haversine distance formula, see http://en.wikipedia.org/wiki/Haversine_formula
    distanceTo: function (other, rdiff) { // (LatLng) -> Number
        other = Gis.latLng(other);
        var R = 6378137 + (rdiff || 0),
            dLat = Gis.Util.gradToRad(other.lat - this.lat),
            dLon = Gis.Util.gradToRad(other.lng - this.lng),
            lat1 = Gis.Util.gradToRad(this.lat),
            lat2 = Gis.Util.gradToRad(other.lat),
            sin1 = Math.sin(dLat / 2),
            sin2 = Math.sin(dLon / 2),
            a = sin1 * sin1 + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2);

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    },
    angle: function (other) {
        var distance = this.distanceTo(other);
        return distance / 6378137;
//        return Math.acos(Math.sin(this.lat) * Math.sin(other.lat) + Math.cos(this.lat) * Math.cos(other.lat) * Math.cos(Math.abs(this.lng - other.lng)));
    },
    wrap: function (a, b) { // (Number, Number) -> LatLng
        var lng = this.lng;

        a = a || -180;
        b = b ||  180;

        lng = (lng + b) % (b - a) + (lng < a || lng === b ? b : a);

        return new Gis.LatLng(this.lat, lng);
    }
};

Gis.latLng = function (a, b) { // (LatLng) or ([Number, Number]) or (Number, Number)
    if (a instanceof Gis.LatLng) {
        return a;
    }
    if (a instanceof Array) {
        return new Gis.LatLng(a[0], a[1]);
    }
    if (typeof a === 'object' && a.hasOwnProperty('lat') && (a.hasOwnProperty('lng') || a.hasOwnProperty('lon'))) {
        return new Gis.LatLng(a.lat, a.hasOwnProperty('lng') ? a.lng : a.lon);
    }
    if (isNaN(a)) {
        return a;
    }
    if (isNaN(a)) {
        return a;
    }
    return new Gis.LatLng(a, b);
};