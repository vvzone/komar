"use strict";
/**
 * @description Один пеленг всегда остается видимым
 * @class
 * @classdesc
 * Поведение линии пеленга
 * @param {Object} options
 * @param {number} [options.latestBearingCount=1] количество всегда показываемых пеленгов
 * @param {number} [options.bearingShowTimeSeconds=undefined] сколько времени показываеть пеленг
 * @extends Gis.BaseClass
 */
Gis.Additional.BearingBehavior = Gis.BaseClass.extend(
    /** @lends Gis.Additional.BearingBehavior# */
    {
        options: {
            latestBearingCount: 1,
            bearingShowTimeSeconds: undefined
        },
        /**
         * @public
         * @returns {number|*}
         */
        getLatestBearingCount: function () {
            return this.options.latestBearingCount || Gis.Config.style.DefaultBearingBehavior.bearingShowTimeSeconds;
        },
        /**
         * check is this bearing visible
         * @public
         * @param {Gis.Objects.Bearing} bearing
         * @param {int} positionInBearingList
         * @returns {Boolean}
         * */
        isBearingVisible: function (bearing, positionInBearingList) {
            var isPositionCorrect;
            isPositionCorrect = !Gis.Util.isNumeric(positionInBearingList) || positionInBearingList <= this.getLatestBearingCount();
            return (this.isBearingVisibleInTime(bearing) && isPositionCorrect) || positionInBearingList <= Gis.Additional.BearingBehavior.ALWAYS_SHOW_COUNT;
        },
        /**
         * @public
         * @param {Gis.Objects.Bearing} bearing
         * @returns {boolean} пеленг все еще видим
         */
        isBearingVisibleInTime: function (bearing) {
            var currTime;
            if (!this.gerBearingShowTimeSeconds()) {
                return true;
            }
            currTime = Date.now() / 1000;
            return ((currTime - bearing.getTimeStamp()) < this.gerBearingShowTimeSeconds());
        },
        /**
         * усеченный массив точек. выбирает наименьший исходя из пути и пройденного времени
         * @public
         * @param {Array.<Gis.Objects.Bearing>} points массив точек {@link Gis.Objects.Bearing} уже отсортированный
         * @returns {Array.<Gis.Objects.Bearing>} массив в котором отсечены все невидимые точки
         * */
        getVisiblePoints: function (points) {
            var id, len, result = [];
            for (id = 0, len = points.length; id < len; id += 1) {
                if (this.isBearingVisible(points[id], len - id)) {
                    result.push(points[id]);
                }
            }
            return result;
        },
        /**
         * @public
         * @returns {*}
         */
        gerBearingShowTimeSeconds: function () {
            return Gis.Util.isNumeric(this.options.bearingShowTimeSeconds) ? this.options.bearingShowTimeSeconds : Gis.Config.style.DefaultBearingBehavior.bearingShowTimeSeconds;
        }
    }
);
Gis.BearingBehavior = Gis.Additional.BearingBehavior;

/**
 * Создает новый {@link Gis.Additional.BearingBehavior}
 * @param {Object | Gis.Additional.BearingBehavior} data если уже является экземпляром Gis.Additional.BearingBehavior, то он же и вернется.
 * так что можно использовать без проверки
 * @return {Gis.Additional.BearingBehavior}
 */
Gis.bearingBehavior = function (data) {
    if (data && data.setData) {
        return data;
    }
    return new Gis.Additional.BearingBehavior(data);
};
Gis.Additional.BearingBehavior.ALWAYS_SHOW_COUNT = 1;
/**
 * Поведение пеленга по умолчанию
 * можно переопределить напрямую или
 * @example
 * Gis.Config.setConfig('SourceBearingBehavior', Gis.bearingBehavior({}));
 * @type {*}
 */
Gis.Config.SourceBearingBehavior = Gis.bearingBehavior({latestBearingCount: 2});
