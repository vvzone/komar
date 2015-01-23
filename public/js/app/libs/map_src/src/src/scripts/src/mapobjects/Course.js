/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
(function (G) {
    "use strict";
    G.Course = {
        _step: 10,
        _isVisible: true,
        _defaultCourseStyle: null,
        getCourse: function () {
            return this.options.course;
        },
        getDefaultCourseStyle: function () {
            this._defaultCourseStyle = this._defaultCourseStyle || (G.Config.style.DefaultCourseStyle && G.lineStyle(G.Util.extend({}, G.Config.style.DefaultCourseStyle)));
            return this._defaultCourseStyle;
        },
        needDrawCourse: function () {
            return !!this.getOption('courseStyle');
        },
        /**
         * draw course line
         * @param {Gis.Maps.Base} map
         * @param {Object} cached кэшированный объект
         * @param {number} course истиный курс
         * @param {number[]} latlng
         * @returns {Object} кэшированный объект
         * */
        drawCourse: function (map, cached, course, latlng) {
            var style = this.options.courseStyle || this.getDefaultCourseStyle(), points;
            if (this.selfDraw() && !this.selfDraw().course) {
                style = G.lineStyle({color: 'rgba(0,0,0,0)', border: 'rgba(0,0,0,0)'});
            }
            points = this.recalculateCoursePoints(latlng, course, map);
            if (points && points.length > 1 && style) {
                cached = map.drawPolyline({
                    latlng: points,
                    line: style
                }, cached);
            }
            return cached;
        },

        /**
         * заново рассчитать опорные точки
         * @param {nubmer[]} latlng
         * @param {nubmer} course истиный курс
         * @returns {nubmer[]} кэшированный объект
         * */
        recalculateCoursePoints: function (latlng, course, map) {
            return this.getCoursePoints(latlng || this.getLatLng(), course, map);
        },

        /**
         * Вычисляет опорные точки локсодромии
         * @param {Array} point начальная точка
         * @param {Number} course курс
         * */
        getCoursePoints: function (point, course, map) {
            var currLatitude, currLongitude = point[1], maxLatitude, maxLongitude, points = [], step, maxBounds = map.getMaxBounds(), functionCheck, currentPoint;
            if (course !== false && course !== undefined) {
                course = course % 360;
                currLatitude = point[0];

                functionCheck = function (current, max) {
                    return Math.abs(current) <= Math.abs(max);
                };
                maxLatitude = (maxBounds && maxBounds.getNorthEast().lat) || 85; //TODO projection
                maxLongitude = (maxBounds && maxBounds.getNorthEast().lng) || 180; //TODO projection

                step = (map.getCurveStep() || this._step) / (map.getZoom() || 1);
                if (Math.abs(course) > 90 && (Math.abs(course) <= 270)) {
                    if (maxBounds) {
                        currLatitude = Math.min(currLatitude, maxBounds.getNorthEast().lat);
                        currLongitude = Math.min(currLongitude, maxBounds.getNorthEast().lng);
                    }
                    maxLatitude = (maxBounds && maxBounds.getSouthEast().lat) || -maxLatitude; //TODO projection
                    functionCheck = function (current, max) {
                        return current >= max;
                    };
                    step = -step;
                } else if (maxBounds) {
                    currLatitude = Math.max(currLatitude, maxBounds.getSouthEast().lat);
                    currLongitude = Math.max(currLongitude, maxBounds.getNorthWest().lng);
                }
                if (course !== 270 && course !== 90) {
                    for (currLatitude; functionCheck(currLatitude, maxLatitude); currLatitude += step) {
                        currentPoint = [currLatitude, this.calculateCourseLongitude(currLatitude, point, course)];
                        if (!maxBounds || maxBounds.contains(Gis.latLng(currentPoint))) {
                            points.push(currentPoint);
                        }
                    }
                } else {
                    if (course === 270) {
                        maxLongitude = (maxBounds && maxBounds.getSouthWest().lng) || -maxLongitude; //TODO projection
                    }
                    for (currLongitude; functionCheck(currLongitude, maxLongitude); currLongitude += step) {
                        currentPoint = [currLatitude, currLongitude];
                        if (!maxBounds || maxBounds.contains(Gis.latLng(currentPoint))) {
                            points.push(currentPoint);
                        }
                    }
                }
                return points;
            }
            return false;
        },
        calculateCourseLongitude: function (latitude, point, course) {
            var secondLongitude,
                grToRad = G.Util.gradToRad,
                pointLatitude = grToRad(point[0]),
                pointLongitude = grToRad(point[1]),
                tg = Math.tan,
                ln = Math.log;

            latitude = grToRad(latitude);
            course = grToRad(course);
            secondLongitude = (course !== (Math.PI / 2) && course !== (Math.PI * 1.5)) ? pointLongitude + tg(course) * ((
                ln(tg(Math.PI / 4 + latitude / 2)) -
                ln(tg(Math.PI / 4 + pointLatitude / 2))
            )) : (pointLongitude + (latitude - pointLatitude));
            return G.Util.radToGrad(secondLongitude);
        }
    };
}(Gis));