/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
(function (L) {
    'use strict';
    L.Util.isArray = Array.isArray || L.Util.isArray;
    L.LatLngBounds.prototype.getIntersect = function (bounds) {
        if (!bounds || !this.intersects(bounds)) {
            return;
        }
        var selfSouthWest = this.getSouthWest(),
            otherSouthWest = bounds.getSouthWest(),
            selfNorthEast = this.getNorthEast(),
            otherNorthEast = bounds.getNorthEast(),
            southWest = L.latLng(Math.max(selfSouthWest.lat, otherSouthWest.lat), Math.max(selfSouthWest.lng, otherSouthWest.lng)),
            northEast = L.latLng(Math.min(selfNorthEast.lat, otherNorthEast.lat), Math.min(selfNorthEast.lng, otherNorthEast.lng));
        return L.latLngBounds(southWest, northEast);
    };
    L.Bounds.prototype.getIntersect = function (bounds) {
        if (!bounds || !this.intersects(bounds)) {
            return;
        }
        var setlfMin = this.min,
            otherMin = bounds.min,
            selfMax = this.max,
            otherMax = bounds.max,
            southWest = L.point(Math.max(setlfMin.x, otherMin.x), Math.max(setlfMin.y, otherMin.y)),
            northEast = L.point(Math.min(selfMax.x, otherMax.x), Math.min(selfMax.y, otherMax.y));
        return L.bounds(southWest, northEast);
    };
    L.Bounds.prototype.equals = function (bounds) {
        return !bounds || (bounds.min.equals(this.min) && bounds.max.equals(this.max));
    };
}(L));