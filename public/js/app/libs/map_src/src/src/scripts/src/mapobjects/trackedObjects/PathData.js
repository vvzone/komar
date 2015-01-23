"use strict";
/**
 *
 * @class
 * @ignore
 * @extends Gis.BaseClass
 */
Gis.Objects.PathData = Gis.BaseClass.extend(
    /** @lends Gis.PathData.prototype */
    {
        tolerance: 0.1,
        initialize: function () {
            this._points = this._points || [];
            Gis.BaseClass.prototype.initialize.apply(this, arguments);
        },
        /**
         * @param {Gis.Objects.Position} point точка
         * */
        add: function (point) {
            var pointStamp = point.getTimeStamp();
            if (!this._points.length) {
                this._points.push(point);
            } else if (this._points[this._points.length - 1].getTimeStamp() <= pointStamp) {
                this._points.push(point);
            } else if (this._points[0].getTimeStamp() > pointStamp) {
                this._points.unshift(point);
            } else {
                this._points.splice(this.searchPositionToInsert(point), 0, point);
            }
        },
        size: function () {
            return this._points.length;
        },
        removePointByIndex: function (i) {
            this._points.splice(i, 1);
        },
        getPoint: function (index) {
            return this._points[index];
        },
        findIndex: function (point) {
            return this._points.indexOf(point);
        }, /**
         * @param {Gis.Objects.Position | Array} point точка
         * */
        remove: function (point) {
            if (Array.isArray(point)) {
                var indexOf = this._points.indexOf(point[0]);
                if (indexOf > -1) {
                    this._points.splice(indexOf, point.length);
                }
            } else if (Gis.Util.isNumeric(point)) {
                this.removePointByIndex(point);
            } else {
                this.removePointByIndex(this.findIndex(point));
            }
        },
        /**
         * Получить позицию для вставки элемента. бинарный поиск
         * @param {Gis.Objects.Bearing | Gis.Objects.Position} searchItem
         * @public
         * @returns {Number} Позиция
         */
        searchPositionToInsert: function(searchItem) {
            var l, u, m, compared, points = this._points, point, timeStamp;
            if (searchItem === undefined) {
                return null;
            }
//            if (searchItem._insertPosition) {
//                return searchItem._insertPosition;
//            }
            if (!points.length) {
                return 0;
            }
            point = points[points.length - 1];
            timeStamp = searchItem.getTimeStamp();
            if (timeStamp >= point.getTimeStamp()) {
                searchItem._insertPosition = points.length;
                return points.length;
            }
            point = points[0];
            if (timeStamp < point.getTimeStamp()) {
                searchItem._insertPosition = 0;
                return 0;
            }
            l = 0;
            u = points.length - 1;
            while (l <= u) {
                m = parseInt((l + u) / 2, 10);
                compared = points[m].getTimeStamp() - timeStamp;
                if (compared < 0 || compared === 0) {
                    point = points[m + 1];
                    compared = point.getTimeStamp() - timeStamp;
                    if (compared > 0) {
                        searchItem._insertPosition = m + 1;
                        return m + 1;
                    }
                    l = m + 1;
                } else {
                    u = m - 1;
                }
            }
            return -1;
        },

        getData: function () {
            return this._points.slice();
        },
        each: function (func, context) {
            var index,
                points = this._points.slice();
            for (index in  points) {
                if (points.hasOwnProperty(index)) {
                    func.call(context || points[index], points[index]);
                }
            }
        },
        /**
         * Возвращает отсортированный массив координат точек
         * @param {Gis.Additional.TrackBehavior} [behavior]
         * */
        getSorted: function (behavior) {
            var latlng = [],
                points,
                i,
                len;
            points = !behavior ? this._points : this.getSortedPoints(behavior);
            for (i = 0, len = points.length; i < len; i += 1) {
                latlng[i] = points[i].getLatLng().slice();
            }
            return latlng;
        },
        /**
         * Возвращает отсортированный массив точек
         * @param {Gis.Additional.TrackBehavior | Gis.Additional.BearingBehavior} [behavior]
         * */
        getSortedPoints: function (behavior) {
            var oldPoints = this._points.slice(),
                i = 0,
                len;
            if (behavior) {
                this._points = behavior.getVisiblePoints(this._points);
                if (!this._points.length) {
                    for (i = 0, len = oldPoints.length; i < len; i += 1) {
                        oldPoints[i].onClosePoint();
                    }
                } else if (this._points[0] !== oldPoints[0]) {
                    /**
                     * len = oldPoints.length - len потому что последняя точка может быть вычисленной
                     */
                    len = Math.max(this._points.length - 1, 0);
                    for (i = 0, len = oldPoints.length - len; i < len; i += 1) {
                        if (this._points.indexOf(oldPoints[i]) === -1) {
                            oldPoints[i].onClosePoint();
                        }
                    }
                }
            }
            return this._points;
        }
    }
);
