/*
 * на основе L.LatLngBounds
 */
(function (G) {
    "use strict";
    /**
     *
     * @param southWest
     * @param northEast
     * @constructor
     */
    G.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
        var i, len, latlngs;
        if (!southWest) { return; }

        latlngs = northEast ? [southWest, northEast] : southWest;

        for (i = 0, len = latlngs.length; i < len; i += 1) {
            this.extend(latlngs[i]);
        }
    };

    G.LatLngBounds.prototype = {
        // extend the bounds to contain the given point or bounds
        extend: function (obj) { // (LatLng) or (LatLngBounds)
            if (typeof obj[0] === 'number' || typeof obj[0] === 'string' || obj.distanceTo) {
                obj = G.latLng(obj);
            } else {
                obj = G.latLngBounds(obj);
            }

            if (obj.distanceTo) {
                if (!this._southWest && !this._northEast) {
                    this._southWest = new G.LatLng(obj.lat, obj.lng);
                    this._northEast = new G.LatLng(obj.lat, obj.lng);
                } else {
                    this._southWest.lat = Math.min(obj.lat, this._southWest.lat);
                    this._southWest.lng = Math.min(obj.lng, this._southWest.lng);

                    this._northEast.lat = Math.max(obj.lat, this._northEast.lat);
                    this._northEast.lng = Math.max(obj.lng, this._northEast.lng);
                }
            } else if (obj.getNorthEast) {
                this.extend(obj._southWest);
                this.extend(obj._northEast);
            }
            return this;
        },

        // extend the bounds by a percentage
        pad: function (bufferRatio) { // (Number) -> LatLngBounds
            var sw = this._southWest,
                ne = this._northEast,
                heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
                widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

            return new G.LatLngBounds(
                new G.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
                new G.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer)
            );
        },

        getCenter: function () { // -> LatLng
            return new G.LatLng(
                (this._southWest.lat + this._northEast.lat) / 2,
                (this._southWest.lng + this._northEast.lng) / 2
            );
        },

        getSouthWest: function () {
            return this._southWest;
        },

        getNorthEast: function () {
            return this._northEast;
        },

        getNorthWest: function () {
            return new G.LatLng(this._northEast.lat, this._southWest.lng);
        },

        getSouthEast: function () {
            return new G.LatLng(this._southWest.lat, this._northEast.lng);
        },

        contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
            if (typeof obj[0] === 'number' || obj instanceof G.LatLng) {
                obj = G.latLng(obj);
            } else {
                obj = G.latLngBounds(obj);
            }

            var sw = this._southWest, ne = this._northEast, sw2, ne2;

            if (obj instanceof G.LatLngBounds) {
                sw2 = obj.getSouthWest();
                ne2 = obj.getNorthEast();
            } else {
                sw2 = ne2 = obj;
            }

            return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
                (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
        },

        intersects: function (bounds) { // (LatLngBounds)
            bounds = G.latLngBounds(bounds);

            var sw = this._southWest,
                ne = this._northEast,
                sw2 = bounds.getSouthWest(),
                ne2 = bounds.getNorthEast(),

                latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
                lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

            return latIntersects && lngIntersects;
        },

        toBBoxString: function () {
            var sw = this._southWest,
                ne = this._northEast;

            return [sw.lng, sw.lat, ne.lng, ne.lat].join(',');
        },

        equals: function (bounds) { // (LatLngBounds)
            if (!bounds) { return false; }

            bounds = G.latLngBounds(bounds);

            return this._southWest.equals(bounds.getSouthWest()) &&
                this._northEast.equals(bounds.getNorthEast());
        },

        isValid: function () {
            return !!(this._southWest && this._northEast);
        }
    };


    G.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
        if (!a || a instanceof G.LatLngBounds) {
            return a;
        }
        return new G.LatLngBounds(a, b);
    };
}(Gis));