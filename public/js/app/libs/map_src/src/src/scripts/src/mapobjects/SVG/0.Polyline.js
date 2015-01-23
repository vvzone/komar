'use strict';
/**
 * @abstract
 * @classdesc
 * Базовый класс для маршрута и полигона
 * @class
 * @param {Object} options
 * @param {Array.<Gis.Objects.PathPoint>} options.points опорные точки
 * @param {Gis.Additional.LineStyle} [options.line=Gis.lineStyle({color: "#0033ff"})]
 * @param {Gis.Additional.Icon} [options.icon]
 * @param {Function} [options.step]
 * @param {boolean} [options.draggable=false]
 * @param {string} [options.className]
 * @extends Gis.Objects.Selectable
 */
Gis.Objects.Polyline = Gis.Objects.Selectable.extend(
    /** @lends Gis.Objects.Polyline# */
    {
        includes: Gis.CourseIconBehavior,
        _isCached: true,
        _markerEvents: 'change drag dragstart dragend click',
        _markers: undefined,
        events: Gis.Core.Events.availableDomEvents,
        fixed: 'id tacticObjectType',
        required: ['id', 'points'],
        _iconDraggable: true,
        _iconSelectable: true,
        _cycled: false,
        options: {
            points: undefined,
            line: undefined,
            icon: null,
            draggable: undefined,
            selectable: undefined,
            //Unoficial
            className: undefined,
            step: undefined
        },
        /**
         *
         * @return {*}
         */
        isDraggable: function () {
            return this.getOption('draggable');
        },
        _initEventFunctions: function () {
            var self = this;
            this._markerEvent = this._markerEvent || function (event) {
                if (event.type === 'dragend' || event.type === 'dragstart' || event.type === 'drag') {
                    self.fire('marker_drag', Gis.Util.extend(event, {markerKey: this.getIndex(), target: self}));
                } else {
                    if (event.type === 'click') {
                        self._selectedAdditional = {markerKey: this.getIndex()};
                    }
                    if (event.type !== 'change') {
                        self.fire(event.type, Gis.Util.extend(event, {markerKey: this.getIndex(), target: self}));
                    }
                }
            };
        },
        initialize: function (data) {
            this._fillOption(data, null, 'icon', Gis.icon);
            data.line = Gis.lineStyle(data.line || {
                color: '#0033ff'
            });
            data.id = data.id || Gis.Util.generateGUID();
            var points = data.points && this._updatePoints(data);
            if (points) {
                data.points = points;
            }
            Gis.Objects.Selectable.prototype.initialize.call(this, data);
            this._initEventFunctions();
            this._markers = [];
            this._markersAsimuth = [];
        },

        setData: function (data, val, noFire) {
            this._notFire = noFire;
            var points, changed, recievedPoints, selfPoints = this.options.points;
            if ((data && data.points) || data === 'points') {

                recievedPoints = (data.points || val);
                if (recievedPoints.length !== selfPoints.length ||
                    (recievedPoints !== selfPoints &&
                    recievedPoints.reduce(function (previous, val, key) {
                        return previous + (selfPoints[key].equals(Gis.pathPoint(val)) ? '' : '1');
                    }, ''))) {
                    points = this._updatePoints(Gis.extend({}, Gis.Util.extend({}, this.options, this.getStyle()), {points: recievedPoints}));
                    if (points) {
                        if (val) {
                            val = points;
                        } else {
                            data.points = points;
                        }
                    }
                } else {
                    if (data === 'points') {
                        return false;
                    }
                    delete data.points;
                }
            }
            val = this._fillOption(data, val, 'icon', Gis.icon);
            val = this._fillOption(data, val, 'line', Gis.lineStyle);
            changed = Gis.Objects.Selectable.prototype.setData.call(this, data, val, noFire);
            this._notFire = undefined;
            return changed;
        },

        /**
         * Добавить точку в конец пути
         * @param {Gis.Objects.PathPoint} point
         * @returns {Gis.Objects.Path}
         */
        appendPoint: function (point) {
            this.options.points.push(point);
            this.fire('change', {
                target: this,
                rows: ['points']
            });
            return this;
        },
        /**
         *
         * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
         * @private
         */
        _zoomFunc: function () {
            var self = this;
            if (this.getOptionsWithStyle().orthodrome) {
                if (this._timeout) {
                    clearTimeout(this._timeout);
                }
                this._timeout = setTimeout(function () {
                    self._timeout = undefined;
                    Gis.requestAnimationFrame(100)(function () {
                        self.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE, {target: self});
                    });
                }, 1000);
            }
        },
        onAdd: function (gis) {
            Gis.Objects.Selectable.prototype.onAdd.call(this, gis);
            this.on('drag', this._onDrag, this);
            this.on('hided', this._onHided, this);
            this.on('dragend', this._onDragEnd, this);
            this.on('marker_drag', this._markerDrag, this);
            gis.on('zoomend', this._zoomFunc, this);
        },
        onDelete: function (e) {
            this._removeMarkers();
            this._map.off('zoomend', this._zoomFunc, this);
            Gis.Objects.Selectable.prototype.onDelete.call(this, e);
            this.off('drag', this._onDrag, this);
            this.off('hided', this._onHided, this);
            this.off('dragend', this._onDragEnd, this);
            this.off('marker_drag', this._markerDrag, this);
        },
        setControllableByServer: function (controllable) {
            this.options.points.forEach(function (val) {
                val.setControllableByServer(controllable);
            });
            return Gis.Objects.Selectable.prototype.setControllableByServer.call(this, controllable);
        },
        _toggleMarkerVisibility: function (visibility) {
            var id, ids = '', markers = this.getMarkersArray();
            for (id in markers) {
                if (markers.hasOwnProperty(id)) {
                    ids += ' ' + id;
                }
            }
            if (visibility) {
                this._map.showLayersByID(ids);
            } else {
                this._map.hideLayersByID(ids);
            }
        },
        _dragCalculate: function (event, fireEvent) {
            var diff = [
                parseFloat(event.latLng.latitude) - parseFloat(this.getLatitudes()[0]),
                parseFloat(event.latLng.longitude) - parseFloat(this.getLongitudes()[0])
            ];

            this._dragged = true;
            this._increaseLanLng(diff, !fireEvent);
            this.fire('change', {
                target: this,
                rows: ['points'],
                notFireToServer: !fireEvent
            });
        },

        /**
         * Возвращает модифицированную или новую позицию
         * @param {Gis.Objects.PathPoint} val
         * @param {number} index
         * @param {object} options
         * @ignore
         * @returns {Gis.Objects.PathPoint}
         * @private
         */
        _getModifiedRow: function (val, index, options) {
            options = options || this.options;
            var customData,
                tmpObject,
                returnPoint,
                i,
                len,
                selfPoints = this.options.points;
            tmpObject = Gis.pathPoint(val);
            customData = {
                selectable: options.selectable && tmpObject.isSelectable(),
                parentId: options.id,
                className: Gis.Config.imageLabelClass + ' ' + (options.className || ''),
                draggable: tmpObject.isDraggable() || options.draggable
            };
            tmpObject.setData(customData, null, this._notFire);
            tmpObject.setIndex(index);
            if (selfPoints) {
                for (i = 0, len = selfPoints.length; i < len; i += 1) {
                    if (selfPoints[i].getId() === tmpObject.getId()) {
                        returnPoint = selfPoints[i];
                        returnPoint.setData(tmpObject.getParams(), null, this._notFire);
                        returnPoint.setIndex(tmpObject.getIndex());
                        break;
                    }
                }
            }
            return returnPoint || tmpObject.setControllableByServer(this.isControllableByServer());
        },
        _increase: function (array, diff) {
            var id, len;
            for (id = 0, len = array.length; id < len; id += 1) {
                array[id] = parseFloat(array[id]) + diff;
            }
        },

        _updatePoints: function (options) {
            var selfPoints = this.options.points,
                points = options.points,
                newPoints = [],
                self = this;
            if (points) {
                points.forEach(function (val, index) {
                    newPoints.push(self._getModifiedRow(val, index, options));
                });
            }
            if (selfPoints) {
                this.removeMarkersExclude(newPoints);
            }
            return newPoints;
        },

        /**
         *  ПОлучить позицию маркера в списке
         * @param {Gis.Objects.PathPoint[]} markers
         * @param {Gis.Objects.PathPoint} marker
         * @ignore
         * @returns {number}
         */
        getMarkerPosiotion: function (markers, marker) {
            var id, len;
            marker = Gis.pathPoint(marker);
            for (id = 0, len = markers.length; id < len; id += 1) {
                var pathPoint = Gis.pathPoint(markers[id]);
                if (pathPoint.getId() === marker.getId() || marker.equals(pathPoint)) {
                    return id;
                }
            }
            return markers.indexOf(marker);
        },

        removeMarkersExclude: function (markersExclude) {
            var id, len, marker, markers = this.getMarkersArray(), markersAsimuth = this._markersAsimuth;
            for (id = 0, len = markers.length; id < len; id += 1) {
                marker = markers[id];
                if (this.getMarkerPosiotion(markersExclude, marker) === -1) {
                    marker.off(this._markerEvents, this._markerEvent, marker);
                    this._map.removeLayer(marker);
                }
            }
            id = markersExclude.length;
            for (len = markersAsimuth.length; id < len; id += 1) {
                this._map.removeLayer(markersAsimuth[id]);
            }
        },
        _increaseLanLng: function (diff, notFire) {
            var params, changed;
            this.options.points.forEach(function (point) {
                params = point.getParams();
                changed = point.setData({
                    latitude: params.latitude + diff[0],
                    longitude: params.longitude + diff[1]
                }, null, notFire);
                if (!changed && !notFire) {
                    point.fire('change', {
                        target: point,
                        notFireToServer: notFire,
                        rows: ['latitude', 'longitude']
                    });
                }
            });
        },
        isOrthodrome: function () {
            return this.options.orthodrome;
        },
        _getPointCoordinates: function (type) {
            var mapFunction;
            switch (type) {
            case Gis.Objects.Path.CoordinateTypeFull:
                mapFunction = function (value) {
                    return value.getLatLng();
                };
                break;
            case Gis.Objects.Path.CoordinateTypeLatitudes:
                mapFunction = function (value) {
                    return value.getLatLng()[0];
                };
                break;
            case Gis.Objects.Path.CoordinateTypeLongitudes:
                mapFunction = function (value) {
                    return value.getLatLng()[1];
                };
                break;
            }
            return this.options.points.map(mapFunction);
        },
        _onDrag: function (event) {
            this._dragCalculate(event, false);
        },
        _onDragEnd: function (event) {
            this._dragCalculate(event, true);
        },
        _getLatLngArray: function (latitudes, longitudes, orthodrome, step) {
            var data = [],
                i,
                lat = latitudes || this.getLatitudes(),
                lon = longitudes || this.getLongitudes(),
                len = Math.max(lat.length, lon.length),
                diffPoints,
                previousPoint,
                curveStepKilometr;
            if (orthodrome) {
                curveStepKilometr = step || (this.getOption('step') && this.getOption('step')()) || this._map.getOption('provider').getCurveStepKilometr();
            }
            for (i = 0; i < len; i += 1) {
                if (orthodrome) {
                    if (lat[i + 1] !== undefined) {
                        previousPoint = data[data.length - 1];
                        diffPoints = Gis.Projection.bearingByPoints(
                            Gis.latLng([(previousPoint && previousPoint[0]) || parseFloat(lat[i]), (previousPoint && previousPoint[1]) || parseFloat(lon[i])]),
                            Gis.latLng([parseFloat(lat[i + 1]), parseFloat(lon[i + 1])]),
                            curveStepKilometr
                        );
                        this._latLngDraw = this._latLngDraw || [diffPoints[0]];
                        this._latLngDraw.push([parseFloat(lat[i + 1]), parseFloat(lon[i + 1])]);
                        data = data.concat(diffPoints);
                    }
                } else {
                    data.push([parseFloat(lat[i]), parseFloat(lon[i])]);
                }
            }
            return data;
        },
        /**
         *
         * @param latitudes
         * @param longitudes
         * @param {boolean} orthodrome
         * @returns {Array.<Array.<number>>}
         */
        getLatLngs: function (latitudes, longitudes, orthodrome) {
            return this._getLatLngArray(latitudes, longitudes, orthodrome);
        },
        /**
         * @returns {Array.<Gis.LatLng>}
         */
        getLatLngArray: function () {
            var result, latLngArray = this._getLatLngArray(this.getLatitudes(), this.getLongitudes(), false);
            if (latLngArray) {
                result = [];
                for (var i = 0, len = latLngArray.length; i < len; i += 1) {
                    result.push(Gis.latLng(latLngArray[i][0], latLngArray[i][1]));
                }
            }
            return result;
        },
        _getMarkerName: function (value) {
            return 'marker' + value[0] + '_' + value[1];
        },
        getLowLevelMarker: function (value) {
            return this._lowLevelObject && this._lowLevelObject[this._getMarkerName(value)];
        },
        _hideNewPath: function () {
            this._mapRender.removeLayer(this._lowLevelObject.templine);
            this._lowLevelObject.templine = undefined;
        },
        /** Рисует временную линию при перемещении маркера
        * @param {number} position позиция перемещаемой точки
        * @private
        */
        _drawNewPath: function (position) {
            var longitudes = this.getLongitudes(),
                latitudes = this.getLatitudes(),
                minPos = (position - 1 >= 0 ? position - 1 : 0),
                len = Math.min(latitudes.length, longitudes.length) - 1,
                latlng;
            latlng = this._getLatLngArray(latitudes.slice(minPos, position + 2), longitudes.slice(minPos, position + 2));
            if (this._cycled && position === 0) {
                latlng.unshift([latitudes[len], longitudes[len]]);
            } else if (this._cycled && position === len) {
                latlng.push([latitudes[0], longitudes[0]]);
            }
            this._lowLevelObject.templine = this._mapRender.drawPolyline(
                Gis.Util.extend({}, {
                    latlng: latlng,
                    drawIcon: false,
                    line: Gis.lineStyle(Gis.Config.style.DefaultTempLine)
                }),
                this._lowLevelObject && this._lowLevelObject.templine
            );
        },
        setIconDraggable: function (draggable) {
            this._iconDraggable = draggable;
        },
        setIconSelectable: function (selectable) {
            this._iconSelectable = selectable;
        },
        hasMarker: function (id) {
            return this.getMarkersArray().hasOwnProperty(id);
        },
        clearMarkers: function () {
            this.options.points = [];
            return this;
        },
        removeSelectedMarkers: function (markers, markersAsimuth) {
            if (markers) {
                var id, len, marker;
                for (id = 0, len = Math.max(markers.length || markersAsimuth.length); id < len; id += 1) {
                    marker = markers[id];
                    if (marker) {
                        marker.off(this._markerEvents, this._markerEvent, marker);
                        this._map.removeLayer(marker);
                    }
                    if (markersAsimuth[id]) {
                        this._map.removeLayer(markersAsimuth[id]);
                    }
                }
            }
        },
        _removeMarkers: function (startPoint) {
            startPoint = startPoint || 0;
            var markersArray = this.getMarkersArray();
            if (markersArray) {
                this.removeSelectedMarkers(markersArray.splice(startPoint), this._markersAsimuth.splice(startPoint));
            }
        },
        /**
         * @deprecated use {@link getPoints} or {@link getMarkersArraySafe}
         * @return {*}
         */
        getMarkersArray: function () {
            return this.options.points;
        },
        /**
         * @return {*}
         */
        getMarkersArraySafe: function () {
            return this.options.points.slice();
        },
        /**
         *
         * @param marker
         */
        pushMarker: function (marker) {
            this._markers[marker.getIndex()] = marker;
        },
        _drawPointMarker: function (idx, value) {
            var oldSelected, changed, marker, data, iconChanged = this._firstIcon !== this.getOption('icon'), options;
            marker = this.getMarkersArray()[idx];
            options = this.getOptionsWithStyle();
            if (!marker) {
                this._firstIcon = options.icon;
                marker = Gis.pathPoint({
                    tacticObjectType: this.getType(),
                    parentId: this.getId(),
                    latitude: value[0],
                    longitude: value[1],
                    draggable: options.draggable && this._iconDraggable && this.isThisEventable(),
                    className: Gis.Config.imageLabelClass + ' ' + (options.className || ''),
                    selectable: options.selectable && this._iconSelectable && this.isThisEventable()
                });
                marker.setSelected(this._selected && this._selectedAdditional && this._selectedAdditional.markerKey === idx);
                marker.setIndex(idx);
                marker.setControllableByServer(false);
                marker.addTo(this._map);
                marker.on(this._markerEvents, this._markerEvent, marker);
                this.pushMarker(marker);
            } else {
                oldSelected = marker.isSelected();
                data = {
                    latitude: value[0],
                    longitude: value[1],
                    draggable: options.draggable && this._iconDraggable && this.isThisEventable(),
                    className: Gis.Config.imageLabelClass + ' ' + (options.className || ''),
                    selectable: options.selectable && this._iconSelectable && this.isThisEventable()
                };
                marker.setSelected(this._selected && this._selectedAdditional && this._selectedAdditional.markerKey === idx);
                changed = marker.setData(data);

                if (!this._map.hasLayer(marker)) {
                    marker.addTo(this._map);
                    marker.on(this._markerEvents, this._markerEvent, marker);
                } else if (!changed && oldSelected !== marker.isSelected()) {
                    marker.fire('change');
                }
            }
            if (iconChanged) {
                this._firstIcon = options.icon;
            }
        },
        drawAllMarkers: function (latlngArray, map) {
            var self = this,
                len,
                i;
            if (latlngArray && latlngArray.length) {
                len = latlngArray.length;
                this._lowLevelObject = this._lowLevelObject || {inset: true};
                Gis.Objects.Selectable.prototype.draw.call(this, map);
                if (this._lastLng && this._lastLng.length > len) {
                    this._removeMarkers(len);
                }
                for (i = 0; i < len; i += 1) {
                    self._drawPointMarker(i, latlngArray[i]);
                    if (self._course) {
                        self._drawCourseIcon(i, latlngArray[i], latlngArray);
                    }
                }
                this._lastLng = latlngArray;
            }
        },
        hideAllMarkers: function () {
            var markers = this.getMarkersArraySafe().splice(0),
                len = markers && markers.length,
                i;
            if (len) {
                for (i = 0; i < len; i += 1) {
                    markers[i].hideFromMap();
                }
            }
        },
        _onHided: function () {
            this.hideAllMarkers();
        },
        draw: function (map) {
            if (!map || !this.preDraw()) {
                return;
            }
            this.drawAllMarkers(this._latLngDraw || this._getLatLngArray(), map);
        },
        /**
         * Выделить точку
         * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
         * @param key позиция точки
         * @param forceUpdate вызвать перерисовку как только будет возможность
         */
        setSelectedPoint: function (key, forceUpdate) {
            this._selectedAdditional = this._selectedAdditional || {};
            this._selectedAdditional.markerKey = key;
            if (forceUpdate) {
                this.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE);
            }
        },
        _markerDrag: function (e) {
            if (e.type === 'dragend' || (this.getOption('orthodrome') && e.type === 'drag')) {
                this._hideNewPath(e.markerKey);
                this.fire('change', {
                    target: this,
                    rows: ['points']
                });
            } else {
                this._drawNewPath(e.markerKey);
            }
        },
        getLatLng: function () {
            return [this.getLatitudes()[0], this.getLongitudes()[0]];
        },
        getStartPoint: function () {
            return this.getLatLng();
        },
        getCenter: function () {
            try {
                var bounds = this.getCurrentLatLngBounds();
                return [(bounds.getSouthWest().lat + bounds.getNorthWest().lat) / 2, (bounds.getSouthWest().lng + bounds.getSouthEast().lng) / 2];
            } catch (e) {
                return undefined;
            }
        },
        /**
         *
         * @returns {Array.<Gis.Objects.PathPoint>}
         */
        getPoints: function () {
            return this.getOption('points');
        },
        /**
         *
         * @return {number[]}
         */
        getLatitudes: function () {
            return this._getPointCoordinates(Gis.Objects.Path.CoordinateTypeLatitudes);
        },
        /**
         *
         * @return {number[]}
         */
        getLongitudes: function () {
            return this._getPointCoordinates(Gis.Objects.Path.CoordinateTypeLongitudes);
        },
        /**
         *
         * @return {Gis.LatLngBounds}
         */
        getLatLngBounds: function () {
            var i, len, lat = this.getLatitudes(), lng = this.getLongitudes(),
                maxLat = 0, maxLng = 0, minLat = lat[0], minLng = lng[0];
            len = Math.min(lat.length, lng.length);
            for (i = 0; i < len; i += 1) {
                maxLat = Math.max(maxLat, lat[i]);
                maxLng = Math.max(maxLng, lng[i]);
                minLat = Math.min(minLat, lat[i]);
                minLng = Math.min(minLng, lng[i]);
            }
            return Gis.latLngBounds(Gis.latLng(maxLat, minLng), Gis.latLng(minLat, maxLng));
        }
    }
);
