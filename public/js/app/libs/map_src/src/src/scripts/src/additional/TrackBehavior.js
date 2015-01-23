"use strict";
/**
 * @class
 * @classdesc
 * Поведение линии пути
 * @param {Object} options
 * @param {number} [options.traceLengthSeconds] Gis.setConfig('style.DefaultTrackBehavior.traceLengthSeconds', 0)
 * @param {number} [options.traceLengthMeters] Gis.setConfig('style.DefaultTrackBehavior.traceLengthMeters', 10000)
 */
Gis.Additional.TrackBehavior = Gis.BaseClass.extend(
    /** @lends Gis.Additional.TrackBehavior.prototype */
    {
        options: {
            traceLengthSeconds: null,
            traceLengthMeters: null
        },
        getTraceLengthSeconds: function () {
            return parseFloat(Gis.Util.isNumeric(this.options.traceLengthSeconds) ? this.options.traceLengthSeconds : Gis.Config.style.DefaultTrackBehavior.traceLengthSeconds);
        },
        getTraceLengthMeters: function () {
            return parseFloat(Gis.Util.isNumeric(this.options.traceLengthMeters) ? this.options.traceLengthMeters : Gis.Config.style.DefaultTrackBehavior.traceLengthMeters);
        },
        /**
         * вычисляет точку на отрезке между двумя точками в определнный момент времени
         * @param {Object} cropped более старая точка (отсекаемая)
         * @param {Object} next более новая точка (будет следовать за вычисленной точкой)
         * @param {int} timestamp временная метка для новой позиции
         * @returns {int[]} координаты новой точки
         * */
        findMiddleInTime: function (cropped, next, timestamp) {
            var croppedStamp = cropped.getTimeStamp(),
                nextStamp = next.getTimeStamp(),
                tLen1 = timestamp - croppedStamp,
                tLen2 = nextStamp - timestamp,
                cropLng = cropped.getLatLng(),
                nextLng = next.getLatLng(),
                fullTelta = tLen1 + tLen2,
                latitude = fullTelta && tLen1 > 0 ? (tLen2 * cropLng[0] + tLen1 * nextLng[0]) / (tLen1 + tLen2) : nextLng[0],
                longitude = fullTelta && tLen1 > 0 ? (tLen2 * cropLng[1] + tLen1 * nextLng[1]) / (tLen1 + tLen2) : nextLng[1];
            return Gis.position({
                latitude: latitude,
                longitude: longitude,
                parentId: cropped.getParentId(),
                timeStamp: timestamp
            });
        },

        needCrop: function () {
            return this.getTraceLengthSeconds() > 0 || this.getTraceLengthMeters() > 0;
        },
        /**
         * усеченный массив точек. выбирает наименьший исходя из пути и пройденного времени
         * @param {Gis.Objects.Position[]} points массив точек @link Gis.Objects.Position уже отсортированный
         * @param {int} [timestamp] время для которого нужно определить позицию
         * @returns {Gis.Objects.Position[]} массив в котором отсечены все невидимые точки
         * */
        getVisiblePoints: function (points, timestamp) {
            var byTime = this.positionInTime(points, timestamp),
                byLength = this.positionByLen(points);

            return byTime.length > byLength.length ? byLength : byTime;
        },
        showFirstPoint: function (points) {
            var i, len;
            if (this._showFirst) {
                for (i = 0, len = points.length; i < len; i += 1) {
                    if (this._showFirst === points[i].getId()) {
                        points[i].setLastShowedTime(points[i].calculateNextStamp());
                    }
                }
            }
            return i;
        },
            /**
         * усеченный массив точек
         * @param {Gis.Objects.Position[]} points массив точек @link Gis.Objects.Position уже отсортированный
         * @param {int} [timestamp] время для которого нужно определить позицию
         * @returns {Gis.Objects.Position[]} массив в котором отсечены все невидимые точки
         * */
        positionInTime: function (points, timestamp) {
            var i = 0,
                len = points.length - 1,
                nextPosIndex,
                result = points,
                boundStamp,
                nextPos,
                currentTimestamp,
                lastStamp;

            currentTimestamp = Date.now() / 1000;
            boundStamp = timestamp || (currentTimestamp - this.getTraceLengthSeconds());
            this.showFirstPoint(points);
            if (this.getTraceLengthSeconds()) {
                for (i; i < len; i += 1) {
                    nextPosIndex = i + 1;
                    nextPos = points[nextPosIndex];
                    lastStamp = points[i].getLastShowedTime(points[i - 1], nextPos);
                    if (points[i].getLastShowedTime(points[i - 1], nextPos) < boundStamp) {
                        result = [];
                        if (nextPos.getLastShowedTime(points[i], points[i + 2]) > boundStamp) {
                            result = points.slice(nextPosIndex);
                            result.unshift(this.findMiddleInTime(points[i], nextPos, boundStamp));
                            break;
                        }
                    }
                }
                this._showFirst = false;
                result = result.length ? result : points.slice(len);
                if (result.length === 1) {
                    result[0].setLastShowedTime(result[0].calculateNextStamp());
                    this._showFirst = result[0].getId();
                }
            }
            return result;
        },
        /**
         * возвращает крайнюю точку учитывая длину пути
         * @param {Gis.Objects.Position[]} points массив точек @link Gis.Objects.Position уже отсортированный
         * @returns {Gis.Objects.Position[]} массив в котором отсечены все невидимые точки
         * */
        positionByLen: function (points) {
            var i = points.length - 1,
                distance = 0,
                traceLengthMeters = this.getTraceLengthMeters();
            if (traceLengthMeters && i > 0) {
                for (i; i > 0; i -= 1) {
                    distance += points[i].distanceTo(points[i - 1]);
                    if (distance > traceLengthMeters) {
                        return points.slice(i);
                    }
                }
            }
            return points;
        }
    }
);

Gis.TrackBehavior = Gis.Additional.TrackBehavior;

/**
 *
 * @param data
 * @returns {Gis.Additional.TrackBehavior}
 */
Gis.trackBehavior = function (data) {
    if (data && data.positionByLen) {
        return data;
    }
    return new Gis.TrackBehavior(data);
};
Gis.Config.SourceTrackBehavior = Gis.trackBehavior({});
Gis.Config.PostTrackBehavior = Gis.trackBehavior({});