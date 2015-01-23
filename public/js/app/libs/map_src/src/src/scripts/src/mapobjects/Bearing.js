"use strict";
var prefix = "_bearing";
/**
 * @class
 * @classdesc
 * Пеленг
 * @param {Object} options
 * @param {string} [options.tacticObjectType='bearing'] тип
 * @param {GUID} options.sourceId GUID ИРИ
 * @param {GUID} options.postId GUID поста
 * @param {GUID} options.id GUID
 * @param {number} options.timeStamp UTC timestamp
 * @param {number} options.latitude широта
 * @param {number} options.longitude долгота
 * @param {number} [options.course] истиный курс
 * @param {number} options.bearing истиный пеленг
 * @param {string} [options.caption] подпись
 * @param {string} [options.tooltip] всплывающая подсказка
 * @example
 * var a = Gis.bearing({
     *      id: Gis.Util.generateGUID(),
     *      postId: post.getId(),
     *      sourceId: source.getId(),
     *      timeStamp: new Date().getTime(),
     *      latitude: 59.96600,
     *      longitude: 29.92675,
     *      course: 35,
     *      bearing: 68,
     *      tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
     *      caption: "Example caption"
     * }).addTo(gisMap)
 * @extends Gis.Objects.Base
 */
Gis.Objects.Bearing = Gis.Objects.Base.extend(
    /** @lends Gis.Objects.Bearing# */
    {
        required: ['postId', 'sourceId', 'timeStamp', 'latitude', 'longitude', 'bearing'],
        fixed: 'sourceId postId tacticObjectType',
        _maxLongitude: 360,
        step: 10,
        stepKilometres: 200000,
        options: {
            tacticObjectType: 'bearing',
            sourceId: undefined,
            postId: undefined,
            timeStamp: undefined,
            latitude: undefined,
            longitude: undefined,
            course: undefined,
            bearing: undefined
        },
        optionsFire: [
            'tacticObjectType',
            'sourceId',
            'postId',
            'caption',
            'tooltip',
            'timeStamp',
            'latitude',
            'longitude',
            'bearing',
            'customActions',
            'course'
        ],
        initialize: function () {
            this._id = Gis.Util.generateGUID();
            Gis.Objects.Base.prototype.initialize.apply(this, arguments);
        },
        preAdd: function (map) {
            var source = map.getLayer(this.options.sourceId),
                visible = source && source.isBearingVisible(this),
                post = map.getLayer(this.options.postId);
            if (!source) {
                map.requestObject(this.options.sourceId, this);
            }
            if (!post) {
                map.requestObject(this.options.postId, this);
            }
            if (!visible) {
                Gis.Logger.log('Bearing not visible', this._id, visible);
            }
            return visible && post;
        },
        getLayers: function () {
            return Gis.Objects.Base.prototype.getLayers.call(this) || (this._source && this._source.getLayers()) || [];
        },
        /**
         * @override
         * @private
         */
        _clearData: function () {
            Gis.Objects.Base.prototype._clearData.call(this);
            Gis.Util.extend(this.options, {
                sourceId: undefined,
                postId: undefined,
                timeStamp: undefined,
                latitude: undefined,
                longitude: undefined,
                course: undefined,
                bearing: undefined
            });
            this._points = null;
            this._needRecalculate = true;
            this._post = undefined;
            this._source = undefined;
//            this._lowLevelObject = null;
            this._insertPosition = null;
            this._markerIcon = null;
            this._isVisible = false;
        },
        onAdd: function (map) {
            var self = this;
            Gis.Objects.Base.prototype.onAdd.call(this, map);
            this._source = map.getLayer(this.options.sourceId);
            this._post = map.getLayer(this.options.postId);
            this._zoom = map.getZoom();
//            this._points = this._getLinePointsByLen();
            self._needRecalculate = true;

            this._zoomFunc = function () {
                self._zoom = map.getZoom();
                self._needRecalculate = true;
            };

            this._post.on("remove hided clearmeta", this._parentRemoved, this);
            this._post.on("change", this._postChanged, this);
            this._source.on('zoomchanged', this._zoomFunc, this);
            this._source.fire("attach", {to: this});
        },
        onClosePoint: function () {
            if (this._map || Gis.Map.CURRENT_MAP) {
                (this._map || Gis.Map.CURRENT_MAP).removeLayer(this);
            } else {
                console.error("this._map not found in bearung!!!!");
            }
        },
        onDelete: function (e) {
            this.hide(e.from);
            this._disableParentActions();
            Gis.Objects.Base.prototype.onDelete.call(this, e);
            this.pushToCache();
        },
        _disableParentActions: function () {
            if (this._post) {
                this._post.off("remove hided clearmeta", this._parentRemoved, this);
                this._post.off("change", this._postChanged, this);
            }
            if (this._source) {
                this._source.off('zoomchanged', this._zoomFunc, this);
            }
        },
        _parentRemoved: function (e) {
            this._map.removeLayer(this);
        },
        /**
         * @fires Gis.Objects.Base.NEED_REDRAW_EVENT для источника
         * @param e
         * @private
         */
        _postChanged: function (e) {
            this._markerIcon = undefined;
            this._source.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE);
        },
        _parentWantToClean: function (e) {
//            this._source.checkContains(this);
        },
        isVisible: function () {
            return this._isVisible;
        },
        hide: function (map) {
            if (this._isVisible) {
                map.removeLayer(this);
                this._disableParentActions();
                this._isVisible = false;
            }
        },
        getAngle: function () {
            var options = this.getOptionsWithStyle();
            return (this._markerIcon && this._markerIcon.isRotatable() && options.course) || 0;
        },
        showBearing: function (map) {
            var caption, tooltip, marker, course,
                line, options;
            //рисуем собственно пеленг
            this._points = this._needRecalculate ? this._getLinePointsByLen(null, map) : this._points;
            this._needRecalculate = false;
            options = this.getOptionsWithStyle();
            caption = options.caption;
            tooltip = options.tooltip;
            line = map.drawPolyline({
                latlng: this._points,
                tooltip: tooltip,
                line: this._source.getBearingStyle()
            }, this._lowLevelObject && this._lowLevelObject.line);

            this._markerIcon = this._markerIcon || Gis.icon({
                type: 'arrow',
                width: 15,
                color: this._post.options.icon.getColor()
            });
            // рисуем маркер
            marker = map.drawMarker(Gis.Util.extend({}, this._post.options, {
                latlng: this.getLatLng(),
                caption: caption,
                icon: this._markerIcon,
                popup: tooltip,
                position: this._post._position,
                angle: this.getAngle(),
                className: 'gis-bearing'
            }), this._lowLevelObject && this._lowLevelObject.marker);
            // рисуем линию курса
//            if (this._post.needDrawCourse()) {
//                course = this._post.drawCourse(map, this._lowLevelObject && this._lowLevelObject.course, this.options.course, this.getLatLng());
//            }
            this._isVisible = true;
            this._lowLevelObject = {
                inset: true,
                marker: marker,
                line: line
//                course: course
            };
        },
        draw: function (map) {
            if (!this.preDraw() || this._isVisible) {
                return;
            }
            //TODO webworkers
            this.showBearing(map);
        },
        /**
         * вычисляет долготу ортодромии
         * @param {float[]} start точка отправки
         * @param {float[]} end точка назначения
         * @param {float} longitude широта промежуточной точки
         * @private
         * @returns {float} долгота точки
         * */
        _calculateLatitude: function (start, end, longitude) {
            var startLatitude = Gis.Util.gradToRad(start[0]),
                endLongitude = Gis.Util.gradToRad(end[1]),
                startLongitude = Gis.Util.gradToRad(start[1]),
                endLatitude = Gis.Util.gradToRad(end[0]),
                lat,
                A,
                B;
            longitude = Gis.Util.gradToRad(longitude);
            A = Math.tan(endLatitude) / Math.sin(endLongitude - startLongitude);
            B = Math.tan(startLatitude) / Math.sin(endLongitude - startLongitude);
            lat = Math.atan(A * (Math.sin(longitude - startLongitude)) + B * (Math.sin(endLongitude - longitude)));
            return Gis.Util.radToGrad(lat);

        },
        _calcLatByAngle: function (angle, start, lon) {
            var radToGrad = Gis.Util.gradToRad,
                course = radToGrad(angle),
                endLon = radToGrad(lon),
                startLat = radToGrad(start[0]),
                startLon = radToGrad(start[1]),
                tan = Math.tan,
                cos = Math.cos;
            return Gis.Util.radToGrad(Math.atan(
                (tan(endLon - startLon) / (tan(course) * cos(startLat)) + tan(startLat)) *
                    cos(endLon - startLon)
            ));
        },
        _calculateBearingLength: function (angle) {
            var eqLen = Gis.Projection.L;
            angle = Math.abs(angle);
            if (angle === 180 || angle === 0 || angle === -360) {
                return Gis.Projection.L / 2;
            }
            return eqLen * Math.cos(Gis.Util.gradToRad(this.options.latitude));
        },
        bearingByAngle: function (start, angle, step) {
            var lon, points = [], lat, absAngle;
            angle %= 360;
            absAngle = Math.abs(angle);

            angle = angle > 180 ? angle - 360 : angle < -180 ? angle + 360 : angle;
            step = step || this.step;

            if (absAngle === 180 || angle === 0) {
                step = absAngle === 180 ? -step : step;
                lon = start[1];
                for (lat = start[0]; Math.abs(lat) < 85; lat += step) {
                    points.push([lat, lon]);
                }
                return points;
            }
            return points;
        },
        bearingByLen: function (start, angle, step) {
            var len, points = [], point, strippedAngle = angle % 360, toTheEast, toTheWest, lastPoint, bearingLen = this._calculateBearingLength(angle);
            step = step || this.stepKilometres;
            toTheEast = (strippedAngle < 180 && strippedAngle > 0) || strippedAngle < -180;
            toTheWest = strippedAngle > 180 || (strippedAngle > -180 && strippedAngle < 0);

            for (len = 0; Math.abs(len) < Gis.Projection.L; len += step) {
                point = this._pointByLen(len, start, angle);
                lastPoint = points[points.length - 1];
                if (len && (len > bearingLen ||
                    (toTheEast && point[1] < lastPoint[1]) ||
                        (toTheWest && point[1] > lastPoint[1]))) {
                    break;
                }
                points.push(point);
            }
            return points;
        },
        _pointByLen: function (d, startPoint, azimuth) {
            return Gis.Projection.nextPointByLen(d, startPoint, azimuth);
        },
        /**
         * выдает точки для рисования ломаной, в зависимости от точности
         * @private
         * */
        _getLinePoints: function (step) {
            var result, firstPoint, firstLong;

            firstLong = this.options.longitude;
            firstPoint = [this.options.latitude, firstLong];

            step = step || (this.step / (this._zoom || 1));
            result = this.bearingByAngle(firstPoint, this.options.bearing, step);
            this._needRecalculate = false;
            return result;
        },
        /**
         * выдает точки для рисования ломаной, в зависимости от точности по длине пеленга
         * @private
         * */
        _getLinePointsByLen: function (step, map) {
            var result, firstPoint, firstLong;

            firstLong = this.options.longitude;
            firstPoint = [this.options.latitude, firstLong];
//            step = step || ((map.getCurveStep() || this.stepKilometres) / (map.getZoom() || 1));
            step = step || (this.stepKilometres / (Math.log(this._zoom || 1) + 1));
            result = this.bearingByLen(firstPoint, this.options.bearing, step);
            this._needRecalculate = false;
            return result;
        },
        getCaption: function () {
            return this.getOption('caption');
        },
        getLatLng: function () {
            return [this.getOption('latitude'), this.getOption('longitude')];
        },
        getId: function () {
            return prefix + this.options.sourceId + this.options.timeStamp;
        },
        getTimeStamp: function () {
            return this.options.timeStamp;
        },
        isControllable: function () {
            return false;
        }
    }
);
Gis.bearing = function (data) {
    return new Gis.Objects.Bearing(data);
};
Gis.ObjectFactory.list.bearing = Gis.Objects.Bearing;