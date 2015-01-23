"use strict";
/**
 * @class
 */
Gis.Additional.Point = Gis.BaseClass.extend(
    /** @lends Gis.Additional.Point.prototype */
    {
        initialize: function (x, y) {
            if (Gis.Util.isArray(x)) {
                this.x = x[0];
                this.y = x[1];
            } else if (Gis.Util.isNumeric(x)) {
                this.x = x;
                this.y = y;
            } else if (typeof x === 'object' && x.hasOwnProperty('x') && x.hasOwnProperty('y')) {
                this.x = x.x;
                this.y = x.y;
            }
        },
        clone: function () {
            return new Gis.Point(this.x, this.y);
        },

        // non-destructive, returns a new point
        add: function (point) {
            return this.clone()._add(Gis.point(point));
        },

        // destructive, used directly for performance in situations where it's safe to modify existing point
        _add: function (point) {
            this.x += point.x;
            this.y += point.y;
            return this;
        },

        subtract: function (point) {
            return this.clone()._subtract(Gis.point(point));
        },

        _subtract: function (point) {
            this.x -= point.x;
            this.y -= point.y;
            return this;
        },

        divideBy: function (num) {
            return this.clone()._divideBy(num);
        },

        _divideBy: function (num) {
            this.x /= num;
            this.y /= num;
            return this;
        },

        multiplyBy: function (num) {
            return this.clone()._multiplyBy(num);
        },

        _multiplyBy: function (num) {
            this.x *= num;
            this.y *= num;
            return this;
        },

        round: function () {
            return this.clone()._round();
        },

        _round: function () {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            return this;
        },

        floor: function () {
            return this.clone()._floor();
        },

        _floor: function () {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            return this;
        },
        distanceTo: function (point) {
            point = Gis.point(point);

            var x = point.x - this.x,
                y = point.y - this.y;

            return Math.sqrt(x * x + y * y);
        }
    }
);
Gis.Point = Gis.Additional.Point;
Gis.point = function (x, y) {
    return new Gis.Point(x, y);
};