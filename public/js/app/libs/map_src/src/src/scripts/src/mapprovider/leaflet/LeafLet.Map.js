"use strict";
/**
 * @namespace
 * */
Gis.Maps.Leaflet = Gis.Maps.Leaflet || {};


/**
 * Адаптер для работы с leaflet @link http://leafletjs.com
 * @class
 * @extends Gis.Maps.Base
 */
Gis.Maps.Leaflet.LeafletProvider = Gis.Maps.Base.extend(
    /** @lends Gis.Maps.Leaflet.LeafletProvider.prototype */
    {
        _mapContainerId: 'leaflet-map-gis',
        _cachedObjects: {},
        _tileLayer: {},
        _draggable: true,
        _maxInCache: Gis.Config.maxInCache,
        options: {
            container: undefined,
            latlng: undefined,
            zoom: 3,
            layer: undefined,
            maxZoom: null,
            minZoom: null,
            projection: null
        },
        setDraggable: function (enable) {
            this._dragable = enable;
            if (enable) {
                this.map.dragging.enable();
            } else {
                this.map.dragging.disable();
            }
        },
        getCurveStep: function () {
            var maxBounds = this.getMaxBounds();
            if (maxBounds) {
                return (maxBounds.getNorthEast().lat - maxBounds.getSouthEast().lat) / 100;
            }
        },
        getCurveStepKilometr: function () {
            var maxBounds = this.map.getBounds();
            if (maxBounds) {
                return (maxBounds.getNorthEast().distanceTo(maxBounds.getSouthEast())) / 100;
            }
        },
        isDraggableEnabled: function () {
            return this._dragable;
        },
        closeMap: function () {
            var globalContainer,
                container;
            if (this.map) {
                this.map.off('click', this._onMouseEvent, this);
                this.map.off('mousedown', this._onMouseEvent, this);
                this.map.off('mouseup', this._onMouseEvent, this);
                this.map.off('mousemove', this._onMouseEvent, this);
                this.map.off('mouseout', this._onMouseEvent, this);
                this.map.off('zoomstart', this._onZoomStart, this);
                this.map.off('zoomend', this._onZoomEnd, this);
                this.map.off('moveend', this._onMoveEnd, this);
                this.fire('closed');
                this.map = false;
                globalContainer = document.getElementById(this.options.container);
                container = document.getElementById(this._mapContainerId);
                if (container) {
                    globalContainer.removeChild(container);
                }
            }
        },
        zoomIn: function () {
            this.map.zoomIn();
        },
        zoomOut: function () {
            this.map.zoomOut();
        },
        getContainer: function () {
            return document.getElementById(this._mapContainerId);
        },
        getContainerReal: function () {
            return document.getElementById(this.options.container);
        },
        _enableMapContainer: function () {
            var globalContainer,
                container;
            globalContainer = document.getElementById(this.options.container);
            if (globalContainer) {
                container = document.createElement('div');
                container.addEventListener('resize', function () {
                    if (this.map) {
                        this.map.invalidateSize();
                    }
                });
                container.id = this._mapContainerId;
                container.style.width = "100%";
                container.style.height = "100%";
                globalContainer.appendChild(container);
            }
        },
        _getProjection: function (projection) {
            return (projection && L.CRS[projection] && L.CRS[projection]) || L.CRS.EPSG3857;
        },
        getProjectionCode: function () {
            return (this._CRS && this._CRS.code) || this.map.options.crs.code;
        },
        /**
         *
         * @param {Gis.LatLng} latLng
         * @returns {Gis.Point}
         * @param zoom
         */
        projectToZoom: function (latLng, zoom) {
            var point = this.map.project(L.latLng(latLng.lat, latLng.lng), zoom);
            if (point) {
                return Gis.point(point.x, point.y);
            }
        },
        /**
         * @deprecated
         * @param latlng
         * @param zoom
         * @return {*}
         */
        project: function (latlng, zoom) {
            latlng = Gis.latLng(latlng);
            var srcPoint = this.map.latLngToLayerPoint([latlng.lat, latlng.lng]);
            return Gis.point(srcPoint.x, srcPoint.y);
        },
        /**
         *
         * @param {Gis.Additional.Point} point
         * @returns {Gis.LatLng}
         * @param zoom
         */
        unproject: function (point, zoom) {
            point = Gis.point(point);
            var latlng = this.map.unproject(L.point(point.x, point.y), zoom);
            if (latlng) {
                return Gis.latLng(latlng.lat, latlng.lng);
            }
        },
        /**
         * @param {Object} options //options.container - id html dom объекта, latlng - массив [широта, долгота], zoom - масштаб карты /
         * */
        _getMap: function (options) {
            if (!this.map) {
                var mapBounds = options.mapBounds || [[-95, -360], [85, 360]];
                this._enableMapContainer();
                var view = L.map(this._mapContainerId, {
                    zoomControl: false,
//                    maxBounds: mapBounds,
                    boxZoom: false,
                    attributionControl: true,
                    crs: this._getProjection(options.projection)
                }).setView(options.latlng, options.zoom);
                L.control.scale({imperial: false}).addTo(view);
                return view;
            }
            return this.map;
        },
        /**
         * reinitialise map
         * */
        reinit: function () {
            this.closeMap();
            this.showMap();
            this.fire('change');
        },
        /**
         * Устанавливает масштаб карты
         * @param {int} zoom
         * */
        setZoom: function (zoom, animate) {
            this.options.zoom = zoom;
            this.map.setZoom(zoom, {animate: animate});
        },
        fitWorld: function () {
            this.map.fitWorld();
        },
        getScale: function (zoom) {
            try {
                var scale = this.map.options.crs.scale(Gis.Util.isNumeric(zoom) ? zoom : this.getZoom());
                return  Gis.Util.isNumeric(scale) ? scale : -1;
            } catch (e) {
                Gis.Logger.log("Error getScale", e, e.stack);
            }
            return -1;
        },
        /**
         * Запрашивает масштаб карты
         * */
        getZoom: function () {
            return this.map && this.map.getZoom();
        },
        /**
         * @param {Gis.LatLngBounds} bounds
         * @param {boolean} [zoom]
         * */
        setMaxBounds: function (bounds, zoom) {
            var southEast = bounds && bounds.getSouthEast(),
                northWest = bounds && bounds.getNorthWest(),
                changed;
            this.maxBounds = bounds;
            changed = this.map[zoom ? 'setMaxBounds' : 'setMaxCenterBounds'](bounds && L.latLngBounds(L.latLng(southEast.lat, southEast.lng), L.latLng(northWest.lat, northWest.lng)));
            if (changed) {
                this.fire('maxboundschanged');
            }
            return changed;
        },
        /**
         *
         * @param {L.LatLngBounds} bounds
         * @returns {Gis.LatLngBounds}
         * @private
         */
        _convertBounds: function (bounds) {
            var southWest, northEast;
            southWest = bounds.getSouthWest();
            northEast = bounds.getNorthEast();
            return Gis.latLngBounds(Gis.latLng(southWest.lat, southWest.lng), Gis.latLng(northEast.lat, northEast.lng));
        },
        /**
         *
         * @returns {Gis.LatLngBounds | null}
         */
        getMapBounds: function () {
            var bounds;
            bounds = this.map.getBounds();
            if (bounds) {
                return this._convertBounds(bounds);
            }
            return null;
        },
        /**
         *
         * @returns {Gis.LatLngBounds | null}
         */
        getMaxBounds: function () {
            var maxBounds = this.map.options.maxBounds,
                changed;
            if (maxBounds) {
                changed = this._convertBounds(maxBounds);
            }
            maxBounds = this.map.options.maxCenterBounds;
            if (maxBounds) {
                changed = this._convertBounds(maxBounds);
            }
            return changed;
        },
        getCenter: function () {
            var center = this.map.getCenter();
            return Gis.latLng(center.lat, center.lng);
        },
        getMinZoom: function () {
            return this.map.getMinZoom();
        },
        getMaxZoom: function () {
            return this.map.getMaxZoom();
        },
        setMapBounds: function (bounds, panInside) {
            var southWest, northEast;
            if (bounds) {
                southWest = bounds.getSouthWest();
                northEast = bounds.getNorthEast();
                if (panInside) {
                    this.map.panInsideBounds(L.latLngBounds(L.latLng(southWest.lat, southWest.lng), L.latLng(northEast.lat, northEast.lng)));
                } else {
                    this.map.fitBounds(L.latLngBounds(L.latLng(southWest.lat, southWest.lng), L.latLng(northEast.lat, northEast.lng)));
                }
            }
        },
        _fixBbox: function (projectedBounds) {
            this.map._bbox = [
                this._CRS.projection.unproject(L.point(projectedBounds.slice(0, 2))),
                this._CRS.projection.unproject(L.point(projectedBounds[0], projectedBounds[3])),
                this._CRS.projection.unproject(L.point(projectedBounds.slice(2, 4))),
                this._CRS.projection.unproject(L.point(projectedBounds[2], projectedBounds[1]))
            ];
        },
        /**
         *
         * @param projectionName
         * @param [projectionString=null]
         * @param projectedBounds
         * @param options
         * @returns {boolean}
         */
        setProjection: function (projectionName, projectionString, projectedBounds, options) {
            var oldCrsCode = this._CRS && this._CRS.code, bounds;
            this._CRS = Gis.Maps.Leaflet.LeafletProvider.getCustomCrs(projectionName, projectionString, projectedBounds, options);
            if (projectedBounds) {
                this._fixBbox(projectedBounds);
                bounds = L.latLngBounds(this.map._bbox[0],
                    this.map._bbox[2]);
                bounds.extend(this._CRS.projection.unproject(L.point(projectedBounds[0], projectedBounds[3])));
                bounds.extend(this._CRS.projection.unproject(L.point(projectedBounds[2], projectedBounds[1])));
            }
            this.setMaxBounds(bounds);
            this.map.options.crs = this._CRS;
            if (this._CRS.code !== oldCrsCode) {
                this.fire('projectionchanged');
            }
            return false;
        },
        /**
         * инициализирует карту (не для прямого вызова, вызывается автоматически для каждого вновь созданного объекта)
         * @param {Object} options  настройки карты
         * */
        initialize: function (options) {
            Gis.Maps.Base.prototype.initialize.call(this, options);
            this._setOptionsConverter(Gis.Maps.Leaflet.optionsConverter());
        },

        _getLineStyle: function (lineObject) {
            return {
                stroke: {
                    weight: lineObject.getThickness() + 2,
                    stroke: !!lineObject.getBorder(), //!! - convert to boolean
                    opacity: 1,
                    dashArray: lineObject.getDash(),
                    color: lineObject.getBorder()
                },
                line: {
                    opacity: 1,
                    fill: false,
                    weight: lineObject.getThickness(),
                    dashArray: lineObject.getDash(),
                    stroke: !!lineObject.getColor(),
                    color: lineObject.getColor()
                }
            };
        },
        _getFillStyle: function (fillObject) {
            return {
                fill: fillObject.getColor(),
                fillColor: fillObject.getColor(),
                fillOpacity: 1,
                hatch: new L.HatchClass(fillObject.getHatch(), fillObject.getHatchColor())
            };
        },
        /**
         * рисует полигон
         * @param {IF.PolygonData} data данные для рисования объекта
         * @param {Object} oldPoly кэшированный объект, если указан то объект заново не создается а модифицируется
         * @returns {Object} кэшированные данные для последующего использования
         * */
        drawPolygon: function (data, oldPoly) {
            var extendedOptions,
                extendedOptionsLine,
                fillStyle = this._getFillStyle(data.fill),
                lineStyle = this._getLineStyle(data.line),
                result,
                latLng;

            latLng = data.latlng;
            extendedOptions = Gis.Util.extend({}, data, lineStyle.stroke, fillStyle, {clickable: true});
            extendedOptionsLine = Gis.Util.extend({}, data, lineStyle.line, {draggable: false, tooltip: null, caption: null, selectable: false});
            result = {
                polygon: this._polygon(latLng, extendedOptions, oldPoly && oldPoly.polygon),
                line: this._polygon(latLng, extendedOptionsLine, oldPoly && oldPoly.line)
            };
            if (!oldPoly) {
                Gis.Maps.Leaflet.EventConverter.setEvents(data.events, result.polygon);
            }

            this.setLabel(data, result.polygon);
            return result;
        },
        /**
         * draws overlay
         * @param {IF.OverlayData} data данные для рисования объекта
         * @param {Object} lowLevel кэшированный объект, если указан то объект заново не создается а модифицируется
         * */
        drawOverlay: function (data, lowLevel) {
            var currentLowLevel = (lowLevel && lowLevel.image) || new L.Overlay(data.layer, Gis.Util.extend({className: Gis.Config.overlayClass}, data));
            if (!this.map.hasLayer(currentLowLevel)) {
                currentLowLevel.addTo(this.map);
            }
            currentLowLevel.setImage(data.imageData);
            if (lowLevel) {
                this._converter.setOptions(this._converter.overlaySetters(), data, currentLowLevel);
            }
            if (!lowLevel) {
                Gis.Maps.Leaflet.EventConverter.setEvents(data.events, currentLowLevel);
            }
            return {image: currentLowLevel};
        },
        gridVisibility: function (offset) {
            var style = document.querySelector('.leaflet-control-scale').style,
                bottom = L.Grid.OFFSET_TEXT_BOTTOM + 15,
                left = L.Grid.OFFSET_TEXT_LEFT + 15;
            if (offset) {
                left += offset;
                bottom += offset;
            }
            style.marginLeft = left + 'px';
            style.marginBottom = bottom + 'px';
        },
        /**
         * Рисуем карты высот
         * @param {IF.HeatMapData} data данные для рисования объекта
         * @param {Object} lowLevel кэшированный объект, если указан то объект заново не создается а модифицируется
         * */
        drawHeatMap: function (data, lowLevel) {
            var currentLowLevel = (lowLevel && lowLevel.image) || new L.HeatMap(data.canvas, Gis.Util.extend({className: Gis.Config.heatMapClass}, data));
            if (!this.map.hasLayer(currentLowLevel)) {
                currentLowLevel.addTo(this.map);
                Gis.Maps.Leaflet.EventConverter.setEvents(data.events, currentLowLevel);
            } else if (data.changed) {
                currentLowLevel.setPoints(data.points, true);
                currentLowLevel.setBounds(data.bounds, true);
                currentLowLevel.setColors(data.colors, true);
                currentLowLevel.setOpacity(data.opacity, data.reset);
                if (data.reset) {
                    currentLowLevel._updateHeatMapViewport();
                    currentLowLevel.resetForce();
                }
            }
            currentLowLevel.setSelected(data.selected);
            this.setLabel(data, currentLowLevel);
            if (data.tooltip) {
                if (!currentLowLevel._popup) {
                    currentLowLevel.bindPopup(data.tooltip, Gis.Util.extend({className: Gis.Config.popupClass}), true);
                } else {
                    currentLowLevel._popup.setContent(data.tooltip);
                }
            } else {
                currentLowLevel.unbindPopup();
            }
            return {image: currentLowLevel};
        },
        /**
         * рисует линию
         * @param {IF.PolylineData} data данные для рисования объекта
         * @param {Object} oldPath кэшированный объект, если указан то объект заново не создается а модифицируется
         * @param {Boolean} multi multipolyline
         * @returns {Object} кэшированные данные для последующего использования
         * */
        drawPolyline: function (data, oldPath, multi) {
            var lineStyle = this._getLineStyle(data.line),
                result,
                func,
                convertedOptions;

            func = multi ? this._multiPolyline : this._polyline;
            if (data.isCycle) {
                data.latlng.push(data.latlng[0]);
            }
            convertedOptions = Gis.Util.extend(
                this._converter.path(Gis.Util.extend({}, data, lineStyle.line)),
                {clickable: true}
            );
            result =  {
                polylineBorder: func.call(this, data.latlng.slice(0),
                    Gis.Util.extend(
                        this._converter.path(Gis.Util.extend({}, data, lineStyle.stroke)),
                        {clickable: false, draggable: false, className: undefined}
                    ),
                    oldPath && oldPath.polylineBorder),
                polyline: func.call(this, data.latlng.slice(0), convertedOptions, oldPath && oldPath.polyline),
                marker: data.icon && data.drawIcon ? this.drawMarker({
                    latlng: data.latlng[0],
                    icon: data.icon
                }, oldPath && oldPath.marker) : undefined
            };
            if (!oldPath) {
                Gis.Maps.Leaflet.EventConverter.setEvents(data.events, result.polyline);
            }
            this.setLabel(data, result.polyline);
            return result;
        },
        _polyline: function (latlng, options, oldPoly) {
            var polyline, clickable;
            options.className = (options.className || "") + (options.clickable ? ' gis-polyline' : '');
            polyline = oldPoly || L.polyline(latlng, options);
            if (!this.map.hasLayer(polyline)) {
                polyline.addTo(this.map);
            }
            if (oldPoly) {
                clickable = options.clickable || options.tooltip;
                delete options.clickable;
                polyline.setStyle(options);
                this._converter.setOptions(this._converter.polylineSetters(), Gis.Util.extend(options, {clickable: true}), polyline);
            } else {
                polyline.setClassName(options.className);
            }
            if (options.tooltip) {
                if (!polyline._popup) {
                    polyline.bindPopup(options.tooltip, Gis.Util.extend({className: Gis.Config.popupClass}), true);
                } else {
                    polyline._popup.setContent(options.tooltip);
                }
            } else {
                polyline.unbindPopup();
            }
            return polyline;
        },
        _multiPolyline: function (latlng, options, oldPoly) {
            var polyline, clickable;
            options.className = (options.className || "") + (options.clickable ? ' gis-polyline' : '');
            polyline = oldPoly || L.multiPolyline(latlng, options);
            if (!this.map.hasLayer(polyline)) {
                polyline.addTo(this.map);
            }
            if (oldPoly) {
                clickable = options.clickable || options.tooltip;
                delete options.clickable;
                polyline.setStyle(options);
                this._converter.setOptions(this._converter.polylineSetters(), Gis.Util.extend(options, {clickable: true}), polyline);
            } else {
                polyline.setClassName(options.className);
            }
            if (options.tooltip) {
                if (!polyline._popup) {
                    polyline.bindPopup(options.tooltip, Gis.Util.extend({className: Gis.Config.popupClass}), true);
                } else {
                    polyline._popup.setContent(options.tooltip);
                }
            } else {
                polyline.unbindPopup();
            }
            return polyline;
        },
        _polygon: function (latlng, options, oldPoly) {
            var polygon, clickable;
            clickable = true;
            Gis.Util.extend(options, {clickable: clickable});
            polygon = oldPoly || L.polygon(latlng, options);
            if (!this.map.hasLayer(polygon)) {
                polygon.addTo(this.map);
            }
            if (oldPoly) {
                delete options.clickable;
                polygon.setStyle(options);
                options.clickable = clickable;
                this._converter.setOptions(this._converter.polygonSetters(), options, polygon);
            }

            if (options.tooltip) {
                if (!polygon._popup) {
                    polygon.bindPopup(options.tooltip, Gis.Util.extend({className: Gis.Config.popupClass}), true);
                } else {
                    polygon._popup.setContent(options.tooltip);
                }
            } else {
                polygon.unbindPopup();
            }
            return polygon;
        },

        setLabel: function (data, marker) {
            if (data.caption) {
                marker.bindLabel(data.caption, marker._label ? undefined : Gis.Util.extend({className: Gis.Config.captionClass, position: data.captionPosition}));
            } else {
                marker.unbindLabel();
            }
        }, /**
         * @param {IF.MarkerData} data - обязательно указать .latlng - массив координат
         * @param {Object} oldMarker  кэшированный на предыдущем этапе объект
         * */
        drawMarker: function (data, oldMarker) {
            var marker,
                events = data.events,
                convertedOptions,
                icoUrl;

            //TODO extract this??
            if (data.iconUrl || data.icon) {
                icoUrl = data.iconUrl || data.icon.getImageUrl();
                if (!oldMarker || !oldMarker.iconUrl || oldMarker.iconUrl !== icoUrl) {
                    //noinspection JSUndefinedPropertyAssignment
                    data.icon = data.icon.isPredefinedType() ? new L.Icon.Canvas({className: data.className, clickableClass: 'gis-clickable', src: icoUrl}) : L.icon({className: data.className, clickableClass: 'gis-clickable',
                        iconUrl: icoUrl});
                } else {
                    delete data.icon;
                }
            }
            convertedOptions = Gis.Util.extend(this._converter.marker(data), {clickable: true});
            if (!oldMarker) {
                marker = L.markerGis(data.latlng, convertedOptions);
                Gis.Maps.Leaflet.EventConverter.setEvents(events, marker);
            } else {
                marker = oldMarker.marker;
                this._converter.setOptions(this._converter.markerSetters(), convertedOptions, marker);
            }
            if (data.gisClass) {
                marker.addClass(data.gisClass);
            }
            marker[data.selected ? 'addClass' : 'removeClass'](Gis.Config.gisSelectedClass);
            if (!this.map.hasLayer(marker)) {
                marker.addTo(this.map);
            }
            if (data.popup) {
                if (!marker._popup) {
                    marker.bindPopup(data.popup, Gis.Util.extend({className: Gis.Config.popupClass}), true);
                } else {
                    marker._popup.setContent(data.popup);
                }
            } else {
                marker.unbindPopup();
            }
        this.setLabel(data, marker);
            return {marker: marker, iconUrl: icoUrl};
        },
        drawText: function (options, oldText) {
            options.text = options.caption + "";
            var convertedOptions = Gis.Util.extend(this._converter.textLabel(options), {clickable: true, selectedClass: Gis.Config.gisSelectedClass}),
                label = (oldText && oldText.label) || new L.Label(Gis.Util.extend({},
                    convertedOptions,
                    {className: options.className || Gis.Config.textLabelClass})),
                events = options.events;
            this._converter.setOptions(this._converter.textSetters(), convertedOptions, label);
            label.openOn(this.map);
            label.setDraggable(convertedOptions.draggable);
            if (!oldText) {
                Gis.Maps.Leaflet.EventConverter.setEvents(events, label);
            }
            if (options.popup) {
                if (!label._popup) {
                    label.bindPopup(options.popup, Gis.Util.extend({className: Gis.Config.popupClass}), true);
                } else {
                    label._popup.setContent(options.popup);
                }
            } else {
                label.unbindPopup();
            }
            return {label: label};
        },

        /**
         * рисует эллипс
         * @param {IF.EllipseData} data данные для отображения эллипса
         * @param {Object} oldEllipse кэшированный на предыдущем этапе объект
         * */
        drawEllipse: function (data, oldEllipse) {
            var extendedOptions,
                extendedOptionsLine,
                lineStyle = this._getLineStyle(data.line),
                fillStyle = this._getFillStyle(data.fill),
                cached,
                ellipse;
            ellipse = oldEllipse || this.getFromCache('ellipse');
            extendedOptions = Gis.Util.extend(this._converter.ellipse(Gis.Util.extend({}, data)), lineStyle.stroke, fillStyle, {clickable: true});
            extendedOptionsLine =  Gis.Util.extend(this._converter.ellipse(Gis.Util.extend({}, data)), lineStyle.line, {draggable: false});
            cached =  {
                ellipse: this._ellipse(data.latlng, data.alpha, data.betta, data.gamma, extendedOptions, ellipse && ellipse.ellipse),
                stroke: this._ellipse(data.latlng, data.alpha, data.betta, data.gamma, extendedOptionsLine, ellipse && ellipse.stroke)
            };
            if (!oldEllipse) {
                Gis.Maps.Leaflet.EventConverter.setEvents(data.events, cached.ellipse);
            }
            this.setLabel(data, cached.ellipse);
            return cached;
        },
        deleteEvents: function (data, object) {
            Gis.Maps.Leaflet.EventConverter.deleteEvents(data, object);
        },
        _ellipse: function (latlng, outerRadius, innerRadius, rotateAngle, options, oldEllipse) {
            var ellipse, clickable;
            if (!oldEllipse) {
                ellipse = L.ellipse(latlng, outerRadius, innerRadius, rotateAngle, options);
            } else {
                ellipse = oldEllipse;
                delete options.clickable;
                ellipse.setStyle(options);
                this._converter.setOptions(this._converter.ellipseSetters(), Gis.Util.extend(options, {clickable: true}), ellipse);
            }
            if (options.tooltip) {
                if (!ellipse._popup) {
                    ellipse.bindPopup(options.tooltip, Gis.Util.extend({className: Gis.Config.popupClass}), true);
                } else {
                    ellipse._popup.setContent(options.tooltip);
                }
            } else {
                ellipse.unbindPopup();
            }
            if (!this.map.hasLayer(ellipse)) {
                ellipse.addTo(this.map);
            }
            return ellipse;
        },
        /**
         * рисует сектор
         * @param {Object} data данные для отображения эллипса
         * @param {Object} oldSector кэшированный на предыдущем этапе объект
         * */
        drawSector: function (data, oldSector) {
            var lineStyle = this._getLineStyle(data.line),
                fillStyle = this._getFillStyle(data.fill),
                result,
                extendedOptions,
                extendedOptionsLine,
                sector;

            sector = oldSector || this.getFromCache('sector');
            data.stopAngle = data.finishAngle;
            extendedOptions = Gis.Util.extend(this._converter.sector(Gis.Util.extend({}, data)), lineStyle.stroke, fillStyle, {clickable: true});
            extendedOptionsLine = Gis.Util.extend(this._converter.sector(Gis.Util.extend({}, data)), lineStyle.line, {draggable: false});
            result =  {
                sector: this._sector(
                    data.latlng,
                    data.radius,
                    extendedOptions,
                    sector && sector.sector
                ),
                line: this._sector(
                    data.latlng,
                    data.radius,
                    extendedOptionsLine,
                    sector && sector.line
                )
            };
            if (!oldSector) {
                Gis.Maps.Leaflet.EventConverter.setEvents(data.events, result.sector);
            }
            this.setLabel(data, result.sector);
            return result;
        },
        _sector: function (center, radius, data, oldSect) {
            var sector, clickable;
            if (!oldSect) {
                sector = L.sector(center, radius, data);
            } else {
                sector = oldSect;
                clickable = true;
                delete data.clickable;
                sector.setStyle(data);
                this._converter.setOptions(this._converter.sectorSetters(), Gis.Util.extend(data, {clickable: true}), sector);
            }
            if (data.tooltip) {
                if (!sector._popup) {
                    sector.bindPopup(data.tooltip, Gis.Util.extend({className: Gis.Config.popupClass}), true);
                } else {
                    sector._popup.setContent(data.tooltip);
                }
            } else {
                sector.unbindPopup();
            }
            if (!this.map.hasLayer(sector)) {
                sector.addTo(this.map);
            }
            return sector;
        },
        /**
         * @param lowLevelObject
         * @returns {Gis.LatLngBounds | null}
         */
        getObjectBounds: function (lowLevelObject) {
            if (lowLevelObject.getContainerBounds) {
                return this._convertBounds(lowLevelObject.getContainerBounds());
            }
            return null;
        },
        _onZoomStart: function (e) {
            this.fire('zoomstart', e);
        },
        _onZoomEnd: function (e) {
            this.options.zoom = this.getZoom();
            this.fire('zoomend', e);
        },
        _onMoveEnd: function (e) {
            this.options.latlng = this.getCenter();
            this.fire('moveend', e);
        },
        _tileLoad: function (e) {
            if (e.target.key) {
                if (e.target.parentData && e.target.parentData.saveIsLocal) {
                    e.target.parentData.saveIsLocal(e.target.key);
                }
                this.removeTileLayer(this.getTileLayer(e.target.getURL().replace(e.target.key, e.target.del)));
            }
            this.fire('tileload', Gis.Util.extend(e));
        },
        /**
         * Получить отрисовываемый в данный момент слой по его ключу
         * @param {String} key
         * @returns {Object | undefined}
         */
        getTileLayer: function (key) {
            return this._tileLayer && this._tileLayer[key];
        },
        /**
         * Удалить слой с карты
         * @param {L.TileLayer} tileLayer
         * @returns {Gis.Maps.Base}
         */
        removeTileLayer: function (tileLayer) {
            if (tileLayer) {
                tileLayer.off('tileloadok', this._tileLoad, this);
                this.map.removeLayer(tileLayer);
                delete this._tileLayer[tileLayer.getURL()];
            }
            return this;
        },
        /**
         * Удалить все слои с карты
         * @returns {Gis.Maps.Base}
         */
        removeAllLayers: function () {
            var layerKey, tileLayer = this._tileLayer;
            if (tileLayer) {
                for (layerKey in tileLayer) {
                    if (tileLayer.hasOwnProperty(layerKey)) {
                        this.removeTileLayer(tileLayer[layerKey]);
                    }
                }
            }
            return this;
        },
        /**
         * вернет новый инстанс слоя лифлет по нашим данным
         * @param {Gis.TmsLayer | Gis.TmsLayer[]} layer если вернулсямассив, нужно удалить битый, когда корректный слой загрузится
         * @param options2
         */
        initLayer: function (layer, options2, second) {
            var crs = layer.getCrs(),
                op = layer.getOptions(),
                customCrs = Gis.Maps.Leaflet.LeafletProvider.getCustomCrs(crs.getCode(), crs.getProj4def(), crs.getProjectedBounds(), crs.getOptions()),
                options = Gis.Util.extend({
                    attribution: Gis.moduleName.ru,
                    tileSize: (op && op.dimension && op.dimension.x && parseInt(layer.getOptions().dimension.x, 10)) || 256,
                    maxZoom: layer.getMaxZoom(),
                    minZoom: layer.getMinZoom(),
                    errorTileUrl: !second ? (Gis.Config.image.ErrorTile || Gis.Config.image('ErrorTile')) : undefined
                }, layer.getOptions(), options2, {crs: customCrs}
                    ),
                url,
                resultLayer;
            if (Gis.config('no-wrap-layer')) {
                options.noWrap = true;
            }
            if (layer && Gis.Maps.Leaflet.TYPES[layer.getType()]) {
                resultLayer = Gis.Maps.Leaflet.TYPES[layer.getType()](layer, options);
            } else {
                url = layer.getURL();
                if (url[url.length - 1] === "?") {
                    resultLayer = [];
                    resultLayer[0] = L.tileLayer(url.substr(0, url.length - 1) + "png", options);
                    resultLayer[0].key = "jpg";
                    resultLayer[0].del = "png";
                    resultLayer[1] = L.tileLayer(url.substr(0, url.length - 1) + "jpg", options);
                    resultLayer[0].key = "png";
                    resultLayer[0].del = "jpg";
                } else {
                    resultLayer = L.tileLayer(url, options);
                }
            }
            return resultLayer;
        },
        /**
         *
         * @param {L.TileLayer | L.TileLayer[]} leafletLayer
         * @param {Boolean} [core=false] главный слой
         */
        _addTileLayer: function (leafletLayer, core) {
            var self = this;
            if (Gis.Util.isArray(leafletLayer)) {
                leafletLayer.forEach(function (val) {
                    self._addTileLayer(val);
                });
                return;
            }
            if (this._tileLayer.hasOwnProperty(leafletLayer.getURL()) && this.map.hasLayer(this._tileLayer[leafletLayer.getURL()])) {
                Gis.Logger.log("Слой " + leafletLayer.getURL() + " уже добавлен");
                return;
            }
            this._tileLayer[leafletLayer.getURL()] = leafletLayer;
            leafletLayer.on('tileloadok', this._tileLoad, this);
            this.map.addLayer(leafletLayer);
            this.map.setView(this.map.getCenter());
        },
        /**
         * Установить базовый слой. Удаляет предыдущие слои
         * @param {IF.MAP_DATA_PARAM} data
         * @returns {Gis.Maps.Base}
         * @override
         * **/
        setMapType: function (data) {
            var leafletLayer, layer = data.layer, i, len;
            if (this.map && layer) {
                this.removeAllLayers();
                this._zIndexCurrent = 100;
                leafletLayer = this.initLayer(layer, {zIndex: this._zIndexCurrent});
                if (Gis.Util.isArray(leafletLayer)) {
                    for (i = 0, len = leafletLayer.length; i < len; i += 1) {
                        leafletLayer[i].parentData = data;
                    }
                } else {
                    leafletLayer.parentData = data;
                }
                this._addTileLayer(leafletLayer, true);
                this.map.fire('baselayerchange', {layer: leafletLayer});
            }
            return this;
        },
        _extendProjectedBounds: function (data) {
            var crsLocal = data.layer.getCrs(), projectedBounds = data.layer.getCrs().getProjectedBounds(), maxBounds, crsLeaflet, pBounds, newsBounds, newBounds;
            if (this.maxBounds) {
                if (projectedBounds) {
                    newBounds = L.bounds(this._CRS.projectedBounds.slice(0, 2), this._CRS.projectedBounds.slice(2, 4));
                    newBounds.extend(projectedBounds.slice(0, 2));
                    newBounds.extend(projectedBounds.slice(2, 4));
                    this.maxBounds = L.latLngBounds(this._CRS.projection.unproject(newBounds.min), this._CRS.projection.unproject(newBounds.max));
                } else {
                    crsLeaflet = L.CRS[crsLocal.getCode().replace(':', '')];
                    maxBounds = crsLeaflet && crsLeaflet.projection.MAX_LATITUDE;
                    if (maxBounds) {
                        this.maxBounds.extend(L.latLng(maxBounds, 180));
                        this.maxBounds.extend(L.latLng(-maxBounds, -180));
                    }
                }
                this.setMaxBounds(this.maxBounds);
            }
        },
        /**
         * Добавить новую картоснову
         * @param {IF.MAP_DATA_PARAM} data
         * @param options
         * @returns {Gis.Maps.Base}
         */
        addMapTile: function (data, options) {
            var layer = data.layer, leafletLayer, i, len;
            this._lastLayer = data;
            this._zIndexCurrent += 1;
            if (this.map && layer) {
                leafletLayer = this.initLayer(layer, Gis.Util.extend(options, {zIndex: this._zIndexCurrent, maxNativeZoom: layer.getMaxZoom()}), true);
                if (Gis.Util.isArray(leafletLayer)) {
                    for (i = 0, len = leafletLayer.length; i < len; i += 1) {
                        leafletLayer[i].parentData = data;
                    }
                } else {
                    leafletLayer.parentData = data;
                }
                this._extendProjectedBounds(data);
                this._addTileLayer(leafletLayer);
            }
            return this;
        },
        /**
         * отображает карту на странице
         * */
        showMap: function () {
            this.map = this._getMap(this.options);
            this.setMapType(this.options);
            this.map.on('click', this._onMouseEvent, this);
            this.map.on('mousedown', this._onMouseEvent, this);
            this.map.on('mouseup', this._onMouseEvent, this);
            this.map.on('mousemove', this._onMouseEvent, this);
            this.map.on('mouseout', this._onMouseEvent, this);
            this.map.on('zoomstart', this._onZoomStart, this);
            this.map.on('zoomend', this._onZoomEnd, this);
            this.map.on('moveend', this._onMoveEnd, this);
            this.fire('mapattached');
            return this;
        },
        getPixelBounds: function () {
            return this.map.getPixelBounds();
        },
        _pointInAvailableBounds: function (point) {
            var bounds = this.map.options.maxCenterBounds || this.map.options.maxBounds;
            if (!bounds) {
                return true;
            }
            return this.map.getPixcelBounds(bounds).contains(point);
        },
        setCenter: function (center, noanim) {
            if (this.map && this._pointInAvailableBounds(this.map.project(L.latLng(center)))) {
                this.options.latlng = center instanceof Array ? Gis.latLng(center[0], center[1]) : center;
                if (noanim) {
                    this.map.setView(L.latLng(this.options.latlng.lat, this.options.latlng.lng), this.map.getZoom());
                } else {
                    this.map.panTo(L.latLng(this.options.latlng.lat, this.options.latlng.lng));
                }
            }
            return this;
        },
        setZoomAround: function (latlng,  zoom) {
            zoom = Gis.Util.isDefine(latlng) ? zoom : this.map.getZoom();
            if (this.map && this._pointInAvailableBounds(this.map.project(L.latLng(latlng)))) {
                this.map.setZoomAround(latlng, zoom);
            }
            return this;
        },
        latLngToLayerPoint: function (latlng) {
            latlng = Gis.latLng(latlng);
            var srcPoint = this.map.latLngToLayerPoint([latlng.lat, latlng.lng]);
            return Gis.point(srcPoint.x, srcPoint.y);
        },
        layerPointToLatLng: function (point) {
            point = Gis.point(point);
            var srcLatLng = this.map.layerPointToLatLng([point.x, point.y]);
            return Gis.latLng(srcLatLng.lat, srcLatLng.lng);
        },
        _onMouseEvent: function (event) {
            this.fire(event.type, Gis.Maps.Leaflet.EventConverter._mouseEvent(event));
        },
        /**
         * помещает объект в кэщ для быстрого создания
         * */
        pushToCache: function (layer) {
            var type = layer.getType();
            this._cachedObjects[type] = this._cachedObjects[type] || [];
            if (this._cachedObjects[type].length < this._maxInCache) {
                this._cachedObjects[type].push(layer.getLowLevelObject());
            }
        },
        /**
         *
         * @param type
         * @returns {* | null}
         */
        getFromCache: function (type) {
            if (this._cachedObjects[type] && this._cachedObjects[type].length) {
                return this._cachedObjects[type].pop();
            }
            return null;
        },
        /**
         * удаляет слой с карты
         * */
        removeLayer: function (layer) {
            var lowLevelObject,
                self = this;
            if (!layer) {
                return;
            }
            lowLevelObject = layer.getLowLevelObject ? layer.getLowLevelObject() : layer;
            if (layer.getType && layer.isCached()) {
                this.pushToCache(layer);
            }
            function removeLayers(object) {
                var id;
                if (object && typeof object === 'object') {
                    for (id in object) {
                        if (object.hasOwnProperty(id) && object[id] !== undefined) {
                            if (!object.inset) {
                                self.map.removeLayer(object[id]);
                                if (layer.events) {
                                    self.deleteEvents({context: layer, type: layer.events}, object[id]);
                                }
                            } else {
                                removeLayers(object[id]);
                            }
                        }
                    }
                }
            }

            removeLayers(lowLevelObject);
            if (lowLevelObject && layer.setLowLevelObject) {
                layer.setLowLevelObject();
            }
        },
        _mapAttached: function () {
            var self = this,
                key;

            this._laterAttach = false;
            for (key in this._laterAttach) {
                if (this._laterAttach.hasOwnProperty(key)) {
                    self.map.on(this._laterAttach[key].types, this._fireEventFromLowLevel, self);
                }
            }
        },
        layerRendered: function (e) {
            this.addEventToLayer(e.target, e.target[Gis.Core.Events.eventsKey]);
        }
    }
);
var crsCache = {};
Gis.Maps.Leaflet.LeafletProvider.getCustomCrs = function (projectionName, projectionString, projectedBounds, options) {
    var code = projectionName.replace(':', ''), crs;
    crs = crsCache[projectionName + projectionString + projectedBounds + options];
    if (crs)  {
        return crs;
    }
    if (L.CRS.hasOwnProperty(code) && !projectedBounds) {
        crs = L.CRS[code];
    } else if (projectionString || Gis.ProjectionDatuums.getDatum(projectionName)) {
        crs = L.customProjection(projectionName, projectionString || Gis.ProjectionDatuums.getDatum(projectionName), projectedBounds, options);
    } else {
        Gis.notify('Неизвестная проекция ' + projectionName, 'error');
        Gis.Logger.log('Неизвестная проекция ' + projectionName);
    }
    crsCache[projectionName + projectionString + projectedBounds + options] = crs;
    return crs;
};
Gis.Maps.Leaflet.TYPES = {
    getMapParams: function (options) {
        var id, data = "";
        if (options) {
            for (id in options) {
                if (options.hasOwnProperty(id)) {
                    data += "&" + encodeURIComponent(id) + "=" + encodeURIComponent(options[id]);
                }
            }
        }
        return data;
    },
    google: function (layer, options) {
        var mapData =  (options && options.mapData) || {};
        mapData = Gis.extend({v: '3.2', sensor: false}, mapData);
        return new L.DeferredLayer({
            name: "Google",
            js: [Gis.Config.relativePath + "libs/Google.js", "http://maps.google.com/maps/api/js?v=3.exp&callback=L.Google.asyncInitialize" + this.getMapParams(mapData)],
            init: function () {
                return new L.Google(layer.getMapType(), options);
            }
        });
    },
    tms: function (layer, options) {
        var crs = layer.getCrs(), noWrap = true, bounds, projectedBounds = crs.getProjectedBounds(),
            customLayers = layer.getActiveCustomLayersMask();
        if (projectedBounds && options.crs) {
            bounds = L.latLngBounds(options.crs.projection.unproject(L.point(projectedBounds.slice(0, 2))),
                options.crs.projection.unproject(L.point(projectedBounds.slice(2, 4))));
            noWrap = options.noWrap || Math.abs((bounds.getNorthEast().lng - bounds.getNorthWest().lng) - 360) > 0.00000001;
        }
        options.tms = true;
        return new L.TMSLayer(
            layer.getURL(),
            Gis.Maps.Leaflet.LeafletProvider.getCustomCrs(crs.getCode(), crs.getProj4def(), projectedBounds, crs.getOptions()),
            Gis.Util.extend({continuousWorld: false, noWrap: noWrap, getParams: (customLayers ? {layers: customLayers} : null)}, options)
        );
    },
    osm: function (layer, options) {
        return new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options);
    },
    cloudmade: function (layer, options) {
        return new L.TileLayer('http://{s}.tile.cloudmade.com/' + layer.getKey() + '/997/256/{z}/{x}/{y}.png', options);
    },
    yandex: function (layer, options) {
        var mapData =  (options && options.mapData) || {};
        mapData = Gis.extend({lang: 'ru-RU'}, mapData);
        return new L.DeferredLayer({
            name: "Yandex",
            js: [Gis.Config.relativePath + "libs/Yandex.js", "http://api-maps.yandex.ru/2.0/?load=package.map" + this.getMapParams(mapData)],
            init: function () {
                return new L.Yandex(layer.getMapType(), options);
            }
        });
    },
    bing: function (layer, options) {
        return new L.DeferredLayer({
            name: "Bing",
            js: [Gis.Config.relativePath + "libs/Bing.js"],
            init: function () {
                return new L.BingLayer(layer.getApiKey(), Gis.extend({}, options, {type: options.types[options.mapType]}));
            }
        });
    }
};
