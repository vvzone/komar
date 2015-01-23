/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
(function (L) {
    'use strict';
    L.Point.prototype.contains = function (point) {
        point = L.point(point);
        var diff = 1.0e-8;
        return (Math.abs(point.x) - Math.abs(this.x)) <= diff &&
            (Math.abs(point.y) - Math.abs(this.y)) <= diff;
    };
    L.Point.prototype.ceil = function () {
        return this.clone()._ceil();
    };
    L.Point.prototype.toFixed = function (precision) {
        return this.multiplyBy(precision)._floor().divideBy(precision);
    };
    L.Point.prototype._ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    };
}(L));