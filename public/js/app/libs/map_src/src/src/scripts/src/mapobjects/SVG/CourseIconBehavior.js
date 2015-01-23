'use strict';
/**
 * Добавляет функцонал иконки курса
 * @lends Gis.Objects.Polyline#
 */
Gis.CourseIconBehavior = {
    _markersAsimuth: undefined,
    _markersAsimuthDisable: undefined,
    _course: false,
    _coursePosition: 'end',
    /**
     * включить иконку курса
     * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
     * @param {boolean} enable
     * @returns {*}
     */
    setCourseEnable: function (enable) {
        this._course = enable;
        this.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE);
        return this;
    },
    /**
     * расположение иконки курса (в начале или конце отрезка)
     * @param {string} position 'start' | 'end'
     * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
     * @returns {*}
     */
    setCoursePointPosition: function (position) {
        this._coursePosition = position;
        this.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE);
        return this;
    },
    isCoursePositionVisible: function (position) {
        return !this._markersAsimuthDisable || this._markersAsimuthDisable.indexOf(position) < 0;
    },
    /**
     *
     * @param {number | number[]} position
     * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
     * @returns {*}
     */
    setCoursePointDisable: function (position) {
        var changed = false, self = this;
        this._markersAsimuthDisable = this._markersAsimuthDisable || [];
        if (Gis.Util.isArray(position)) {
            position.forEach(function (val) {
                if (Gis.Util.isNumeric(val) && self.isCoursePositionVisible(val)) {
                    self._markersAsimuthDisable.push(val);
                    changed = true;
                }
            });
        } else if (Gis.Util.isNumeric(position) && this.isCoursePositionVisible(position)) {
            this._markersAsimuthDisable.push(position);
            changed = true;
        }
        if (changed) {
            this.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE);
        }
        return this;
    },
    _getCoursePosition: function () {
        var coursePositions = ['start', 'end'];
        if (coursePositions.indexOf(this._coursePosition) > -1) {
            return this._coursePosition;
        }
        return (coursePositions.indexOf(this._coursePosition) > -1 && this._coursePosition) || coursePositions[0];
    },
    /**
     *
     * @param {number | number[]} position
     * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
     * @returns {Gis.CourseIconBehavior}
     */
    setCoursePointEnable: function (position) {
        var changed = false, self = this;
        this._markersAsimuthDisable = this._markersAsimuthDisable || [];
        if (Gis.Util.isArray(position)) {
            position.forEach(function (val) {
                if (Gis.Util.isNumeric(val) && self._markersAsimuthDisable.splice(self._markersAsimuthDisable.indexOf(val), 1).length) {
                    changed = true;
                }
            });
        } else if (Gis.Util.isNumeric(position) && self._markersAsimuthDisable.splice(self._markersAsimuthDisable.indexOf(position), 1).length) {
            changed = true;
        }
        if (changed) {
            this.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE);
        }
        return this;
    },
    /**
     * Установить иконку курса
     * @param {Gis.Additional.Icon} icon
     * @returns {Gis.CourseIconBehavior}
     */
    setCourseIcon: function (icon) {
        this._pathAngleIcon = Gis.icon(icon);
        this._pathAngleIcon.setData({rotatable: true});
        this.fire('change', {target: this}, true);
        return this;
    },
    _drawCourseIcon: function (markerPosition, latlng, latlngArray) {
        var marker, point1, point2, next, prev, pointVisible = this.isCoursePositionVisible(markerPosition), imageChanged;
        switch (this._getCoursePosition()) {
        case 'end':
            prev = latlngArray[markerPosition - 1];
            pointVisible = pointVisible && (this.getOption('isCycle') || markerPosition > 0);
            if (pointVisible) {
                point1 = Gis.latLng(prev ? latlngArray[markerPosition - 1] :  latlngArray[latlngArray.length - 1]);
                point2 = Gis.latLng(latlng);
            }
            break;
        default:
            next = latlngArray[markerPosition + 1];
            point1 = Gis.latLng(next ? latlng : this.getOption('isCycle') ? latlng : latlngArray[markerPosition - 1]);
            point2 = Gis.latLng(next || (this.getOption('isCycle') && latlngArray[0]) || latlng);
            break;
        }
        marker = this._markersAsimuth[markerPosition];
        if (pointVisible) {
            if (!this._pathAngleIcon) {
                this._pathAngleIcon = Gis.icon({
                    type: 'custom',
                    rotatable: true,
                    image: {fullPath: Gis.Config.relativePath + 'images', hash: 'path_triangle.png'}
                });
            }
            if (!this._cloned || (this._pathAngleIcon && !this._pathAngleIcon.equals(this._cloned))) {
                imageChanged = true;
                this._cloned = this._pathAngleIcon.clone();
            }
            if (!marker) {
                marker = Gis.imageLabel({
                    id: Gis.Util.generateGUID(),
                    latitude: latlng[0],
                    longitude: latlng[1],
                    angle: Gis.Projection.calculateLoxodromeAngle(point1, point2),
                    className: 'gis-path-azimuth',
                    icon: this._cloned
                });
                marker.idx = markerPosition;
                marker.setCountable(false);
                marker.setControllableByServer(false);
                marker.addTo(this._map);
                this._markersAsimuth[markerPosition] = marker;
            } else {
                marker.setData(Gis.Util.extend({
                    latitude: latlng[0],
                    longitude: latlng[1],
                    angle: Gis.Projection.calculateLoxodromeAngle(point1, point2)
                }, imageChanged ? {icon: this._cloned} : {}));
                if (!this._map.hasLayer(marker)) {
                    marker.addTo(this._map);
                }
            }
        } else if (marker) {
            this._map.removeLayer(marker);
        }
    }
};