"use strict";
/**
 * @class
 * @classdesc
 * Изображение оверлей
 * @param {Object} options
 * @param {string} [options.tacticObjectType='overlay'] тип
 * @param {Gis.Additional.Image} options.image
 * @param {Boolean} [options.draggable=false]
 * @param {number} [options.transparency=1] от 0 до 1.
 * @param {Array.<Array.<number>>} options.imageCoords точки привязки на изображении
 * @param {Array.<Array.<number>>} options.geoCoords точки привязки на карте
 * @example
 * var a = Gis.overlay({
     *      id: Gis.Util.generateGUID(),
     *      imageCoords: [[3209, 1266], [3669, 2794]],
     *      geoCoords: [[36, -5], [-35, 20]],
     *      image: {fullPath: 'http://www.tempstreet.com/wp-content/uploads/2014/03/', hash: 'world-map-4.jpg'}
     * }).addTo(gisMap);
 * @extends Gis.Objects.Base
 */
Gis.Objects.Overlay = Gis.Objects.Selectable.extend(
    /** @lends Gis.Objects.Overlay# */
    {
        events: 'contextmenu dragend click dblclick keydown keypress keyup resize rotate',
        required: ['id', 'image', 'imageCoords', 'geoCoords'],
        fixed: 'id tacticObjectType',
        _savedLatLng: undefined,
        _customOpacity: undefined,
        _opacity: 1,
        _currentOpacity: 1,
        _scale: 1,
        _rotation: 0,
        _baseScale: 1,
        _baseRotation: 0,
        _startScale: 1,
        _startRotation: 0,
        options: {
            tacticObjectType: 'overlay',
            id: undefined,
            image: undefined,
            imageCoords: undefined,
            draggable: undefined,
            transparency: undefined,
            geoCoords: undefined
        },
        optionsFire: [
            'tacticObjectType',
            'id',
            'image',
            'tags',
            'imageCoords',
            'name',
            'customActions',
            'draggable',
            'transparency',
            'geoCoords'
        ],
        isSelectable: function () {
            return this.options.draggable;
        },
        _drawOpacity: function (opacity) {
            if (this.getLowLevelObject()) {
                var overlay = this.getLowLevelObject().overlay;
                if (overlay.image) {
                    overlay.image.setOpacity(opacity);
                }
            }
        },
        /**
         * @fires Gis.Objects.Base.LOCAL_CHANGE_EVENT
         * @param opacity
         */
        setOpacity: function (opacity) {
            this._customOpacity = opacity;
            this.setTempOpacity(undefined);
            this._drawOpacity(opacity);
            this.fire(Gis.Objects.Base.LOCAL_CHANGE_EVENT.TYPE, new Gis.Objects.Base.LOCAL_CHANGE_EVENT(this));
        },
        /**
         * @fires Gis.Objects.Base.LOCAL_CHANGE_EVENT
         * @param opacity
         */
        setTempOpacity: function (opacity) {
            this._currentOpacity = opacity;
            if (Gis.Util.isDefine(this._currentOpacity)) {
                this._drawOpacity(opacity);
                this.fire(Gis.Objects.Base.LOCAL_CHANGE_EVENT.TYPE, new Gis.Objects.Base.LOCAL_CHANGE_EVENT(this));
            }
        },
        setData: function (data1, data2, notFireToServer) {
            this._changed = true;
            return Gis.Objects.Selectable.prototype.setData.call(this, data1, data2, notFireToServer);
        },
        /**
         *
         * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
         * @param uri
         * @private
         */
        _updateImage: function (uri) {
            var self = this;
            this._pic = this._pic || document.createElement("img");
            if (this._pic.src !== uri) {
                this._pic.onload = function () {
                    self.recalculateImage(true);
                    self.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE, {target: self});
                };
                this._pic.src = uri;
            } else {
                self.recalculateImage(true);
            }
        },
        /**
         * @param {Gis.Additional.Image} src
         * */
        setImageSrc: function (src) {
            src.setProjection(this._map.getProjection());
            this.options.image = src;
            this._updateImage(src.createImageUri());
            this.fire('change', {
                target: this,
                rows: ['image']
            });
        },
        initialize: function (data) {
            Gis.Objects.Selectable.prototype.initialize.call(this, data);
            this._lideStyle = Gis.lineStyle({
                color: "blue",
                dash: "dash"
            });
            var self = this;
            Gis.Util.loadKinetic(function () {
                self._layer = new Kinetic.Layer();
            });
        },
        getCanvas: function () {
            return this._layer;
        },
        getGeoPoint: function (index) {
            return this._map.getMapProvider().projectToZoom(Gis.latLng(this.options.geoCoords[index]), this._map.getMaxZoom());
        },
        calculateBaseZoomWidth: function () {
            var crs = this._map.getMapProvider().map.options.crs,
                p1 = this._map.getMapProvider().projectToZoom(Gis.latLng(this.options.geoCoords[0]), this._map.getMaxZoom()),
                p2 = this._map.getMapProvider().projectToZoom(Gis.latLng(this.options.geoCoords[1]), this._map.getMaxZoom()),
                imagePoint1 = (Gis.point(this.options.imageCoords[0])),
                imagePoint2 = (Gis.point(this.options.imageCoords[1]));
            this._baseCoeff = (p2.distanceTo(p1) / imagePoint1.distanceTo(imagePoint2)) / (crs.scale(this._map.getMaxZoom()));
        },
        _calculateCornerPoints: function () {

        },
        /**
         * вычисляет точки привязки
         * возможно запросить новый тайл
         * */
        recalculateImage: function (full) {
            var point1, point2, imagePoint1, imagePoint2, topLeftPoint, crs = this._map.getMapProvider().map.options.crs, rightBottomtPoint;
            if (full) {
                this.calculateBaseZoomWidth();
            }

            if (full) {
                this._sWidth = this._pic.width;
                this._sHeight = this._pic.height;
                point1 = this.getGeoPoint(0);
                point2 = this.getGeoPoint(1);
                imagePoint1 = (Gis.point(this.options.imageCoords[0]));
                imagePoint2 = (Gis.point(this.options.imageCoords[1]));
                imagePoint1 = imagePoint1.multiplyBy(point1.distanceTo(point2) / imagePoint1.distanceTo(imagePoint2));
                topLeftPoint = Gis.point(point1.x - imagePoint1.x, point1.y - imagePoint1.y);
                rightBottomtPoint = topLeftPoint.add(Gis.point(
                    this._sWidth * crs.scale(this._map.getMaxZoom()) * this._baseCoeff,
                    this._sHeight * crs.scale(this._map.getMaxZoom()) * this._baseCoeff
                ));
                this._latlng = imagePoint1.distanceTo(Gis.point(0, 0)) > 0 ? this._map.getMapProvider().unproject(topLeftPoint, this._map.getMaxZoom()) : Gis.latLng(this.options.geoCoords[0]);
                this._latlngBorromRight = imagePoint2.distanceTo(Gis.point(this._sWidth, this._sHeight)) > 0 ?
                    this._map.getMapProvider().unproject(rightBottomtPoint, this._map.getMaxZoom())
                    : Gis.latLng(this.options.geoCoords[1]);
                if (!this.isMoved()) {
                    this._latlngSrc = Gis.latLng(this._latlng.lat, this._latlng.lng);
                    this._latlngBorromRightSrc = Gis.latLng(this._latlngBorromRight.lat, this._latlngBorromRight.lng);
                }
            }
            topLeftPoint = this._map.getMapProvider().project(this._latlngSrc);
            rightBottomtPoint = this._map.getMapProvider().project(this._latlngBorromRightSrc);
            this._dWidth = Math.abs(topLeftPoint.x - rightBottomtPoint.x);
            this._dHeight = Math.abs(topLeftPoint.y - rightBottomtPoint.y);
            //Calculating bounds
        },
        _onNeedUpdateImage: function () {
            this.options.image.setProjection(this._map.getProjection());
            this._updateImage(this.options.image.createImageUri());
        },
        onAdd: function (map) {
            Gis.Objects.Selectable.prototype.onAdd.call(this, map);
            this.setImageSrc(Gis.image(this.getOption('image')));
            this.recalculateImage(true);
            map.on("zoomend", this._onZoomEnd, this);
            this.on("dragend", this._onDragEnd, this);
            this.on("resize", this._onResize, this);
            this.on("rotate", this._onRotate, this);
        },
        onDelete: function (e) {
            this._map.off("zoomend", this._onZoomEnd, this);
            this.off("dragend", this._onDragEnd, this);
            this.off("resize", this._onResize, this);
            this.off("rotate", this._onRotate, this);
            Gis.Objects.Selectable.prototype.onDelete.call(this, e);
        },
        /**
         * Масштаб
         * @returns {number}
         */
        getScale: function () {
            return this._scale;
        },
        /**
         * Угол поворота
         * @returns {number}
         */
        getAngle: function () {
            return this._rotation;
        },
        /**
         * Изображение искажено, относительно полученного от сервера (поворотом или растягиванием)
         * @returns {boolean}
         */
        isDeformed: function () {
            return this._scale !== this._startScale ||  this._rotation !== this._startRotation;
        },
        /**
         * Масштаб отличается от сохраненного
         * @returns {boolean}
         */
        isScaleChanged: function () {
            return this._scale !== this._baseScale;
        },
        /**
         * Текущий угол отличается от сохраненного
         * @returns {boolean}
         */
        isAngleChanged: function () {
            return this._rotation !== this._baseRotation;
        },
        /**
         * Сохранить угол
         * не вызывает перерисовки, для перерисовки вызвать [redraw()]{@link Gis.Objects.Overlay#redraw}
         */
        saveAngle: function () {
            this._baseRotation = this._rotation;
        },
        /**
         * Сохранить текущий масштам
         * не вызывает перерисовки, для перерисовки вызвать [redraw()]{@link Gis.Objects.Overlay#redraw}
         */
        saveScale: function () {
            this._baseScale = this._scale;
        },
        /**
         * Сбросить угол
         * не вызывает перерисовки, для перерисовки вызвать [redraw()]{@link Gis.Objects.Overlay#redraw}
         * @param {boolean} source к исходным или текущим сохраненным
         */
        resetAngle: function (source) {
            if (source) {
                this._baseRotation = this._startRotation;
            }
            this._rotation = this._baseRotation;
        },
        /**
         * Сбросить масштаб
         * не вызывает перерисовки, для перерисовки вызвать [redraw()]{@link Gis.Objects.Overlay#redraw}
         * @param {boolean} source к исходным или текущие сохраненные
         */
        resetScale: function (source) {
            if (source) {
                this._baseScale = this._startScale;
            }
            this._scale = this._baseScale;
        },
        _onResize: function (e) {
            this._scale = e.scale;
            this._rotation = e.rotation;
            if (e && e.latlng) {
                var latLng = e && Gis.latLng(e.latlng.lat, e.latlng.lng);
                this.setTempLatlng(latLng);
            }
            this.recalculateImage(true);
            this.fire(Gis.Objects.Base.LOCAL_CHANGE_EVENT.TYPE, new Gis.Objects.Base.LOCAL_CHANGE_EVENT(this));
        },
        _onRotate: function (e) {
            this._rotation = e.rotation;
            this.fire(Gis.Objects.Base.LOCAL_CHANGE_EVENT.TYPE, new Gis.Objects.Base.LOCAL_CHANGE_EVENT(this));
        },
        /**
         * @private
         */
        _onZoomEnd: function () {
            this.recalculateImage();
            this.redraw();
        },
        /**
         * Установить временную координату верхнего левого угла изображения
         * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
         * @param {Gis.LatLng} latLng
         */
        setTempLatlng: function (latLng) {
            this._temp_latlng = latLng;
            this.fire(Gis.Objects.Base.LOCAL_CHANGE_EVENT.TYPE, new Gis.Objects.Base.LOCAL_CHANGE_EVENT(this));
        },
        /**
         * Временная координата верхнего левого угла изображения
         * @return {*}
         */
        getTempLatlng: function () {
            return this._temp_latlng && Gis.latLng(this._temp_latlng.lat, this._temp_latlng.lng);
        },
        /**
         * Смещение центра от исходной позиции
         * @return {Gis.LatLng}
         */
        getLatLngDelta: function () {
            var newCenter, oldCenter;
            if (this._temp_latlng) {
                newCenter = this.getNewCenter();
                oldCenter = this.getOldCenter();
                return Gis.latLng(newCenter.lat - oldCenter.lat, newCenter.lng - oldCenter.lng);
            }
            return Gis.latLng(0, 0);
        },
        /**
         * Оверлей смещен пользователем
         * @return {*}
         */
        isMoved: function () {
            return this._temp_latlng || this._savedLatLng;
        },
        /**
         * Центр перемещенной позиции
         * @return {*}
         */
        getNewCenter: function () {
            var maxZoom, newBounds;
            if (this._temp_latlng) {
                newBounds = this.getNewBounds();
                if (newBounds) {
                    maxZoom = this._map.getMaxZoom();
                    return this._map.getMapProvider().unproject(Gis.bounds(newBounds[0], newBounds[1]).getCenter(), maxZoom);
                }
            }
            return null;
        },
        /**
         * Перемещенная позиция
         * @return {Array.<Gis.Point>}
         */
        getNewBounds: function () {
            var topLeftPoint, topLeftPointTemp, pixelDelta, one, two, maxZoom;
            if (this._temp_latlng) {
                maxZoom = this._map.getMaxZoom();
                topLeftPoint = this._map.getMapProvider().projectToZoom(this._latlngSrc, maxZoom);
                topLeftPointTemp = this._map.getMapProvider().projectToZoom(this._temp_latlng, maxZoom);
                pixelDelta = topLeftPointTemp.subtract(topLeftPoint);
                one = this._map.getMapProvider().projectToZoom(Gis.latLng(this.options.geoCoords[0]), maxZoom);
                two = this._map.getMapProvider().projectToZoom(Gis.latLng(this.options.geoCoords[1]), maxZoom);
                return [one.add(pixelDelta), two.add(pixelDelta)];
            }
            return null;
        },
        /**
         * Исходный центр
         * @return {Gis.LatLng}
         */
        getOldCenter: function () {
            var one, two, maxZoom;
            maxZoom = this._map.getMaxZoom();
            one = this._map.getMapProvider().projectToZoom(Gis.latLng(this.options.geoCoords[0]), maxZoom);
            two = this._map.getMapProvider().projectToZoom(Gis.latLng(this.options.geoCoords[1]), maxZoom);
            return this._map.getMapProvider().unproject(Gis.bounds(
                one,
                two
            ).getCenter(), maxZoom);
        },
        /**
         * Сохраненная новая позиция
         * @return {undefined|Gis.LatLng}
         */
        getUpdatedCenter: function () {
            if (this._savedLatLng) {
                var one, two, maxZoom;
                maxZoom = this._map.getMaxZoom();
                one = this._map.getMapProvider().projectToZoom(Gis.latLng(this._savedLatLng[0]), maxZoom);
                two = this._map.getMapProvider().projectToZoom(Gis.latLng(this._savedLatLng[1]), maxZoom);
                return this._map.getMapProvider().unproject(Gis.bounds(
                    one,
                    two
                ).getCenter(), maxZoom);
            }
        },
        /**
         * Сохранить все, и бросить событие
         * @param save
         * @param noFireRedraw
         * @fires Gis.Objects.Overlay.OVERLAY_CHANGED_EVENT
         */
        fullSave: function (save, noFireRedraw) {
            var deltaAngle = this.getTempLatlng() && this.saveTempLatlng(save, noFireRedraw);
            this.saveAngle();
            this.saveScale();
            this._currentOpacity = undefined;
            this._map.fire(Gis.Objects.Overlay.OVERLAY_CHANGED_EVENT.TYPE, new Gis.Objects.Overlay.OVERLAY_CHANGED_EVENT(this, deltaAngle, this.getAngle(), this.getScale()));
        },
        /**
         *
         * @fires Gis.Objects.Base.LOCAL_CHANGE_EVENT
         * @param save
         * @param noFireRedraw
         */
        saveTempLatlng: function (save, noFireRedraw) {
            var deltaAngle;
            if (save) {
                deltaAngle = this.getLatLngDelta();
                var newBounds = this.getNewBounds(), maxZoom;
                maxZoom = this._map.getMaxZoom();
                this._savedLatLng = [
                    this._map.getMapProvider().unproject(Gis.point(newBounds[0]), maxZoom),
                    this._map.getMapProvider().unproject(Gis.point(newBounds[1]), maxZoom)
                ];
                this._topLeftSaved = this._temp_latlng;
                this._temp_latlng = null;
            } else {
                this.setTempLatlng(null);
                this._savedLatLng = null;
                this._topLeftSaved = null;
                deltaAngle = this.getLatLngDelta();
            }
            this.recalculateImage(true);
            if (!noFireRedraw) {
                this.redraw();
                this.fire(Gis.Objects.Base.LOCAL_CHANGE_EVENT.TYPE, new Gis.Objects.Base.LOCAL_CHANGE_EVENT(this));
            }
            return deltaAngle;
        },
        _onDragEnd: function (e) {
            var latLng = e && Gis.latLng(e.latLng.latitude, e.latLng.longitude);
            this.setTempLatlng(latLng);
        },
        _getLocalPosiiton: function (pos, only) {
            pos = pos || (!only && this._temp_latlng);
            return pos && [pos.lat, pos.lng];
        },
        isCorrectOpacity: function (opacity) {
            return (Gis.Util.isNumeric(opacity) && opacity >= 0 && opacity <= 1);
        },
        getOpacity: function (current) {
            var opacity = this._customOpacity,
                opacityDefault = this.getOption('transparency');
            if (current && this.isCorrectOpacity(this._currentOpacity)) {
                return this._currentOpacity;
            }
            return this.isCorrectOpacity(opacity) ? opacity : this.isCorrectOpacity(opacityDefault) ? opacityDefault : this._opacity;
        },
        preDraw: function () {
            return Gis.Objects.Selectable.prototype.preDraw.call(this) && this._layer;
        },
        draw: function (map) {
            if (!this.preDraw()) {
                return;
            }
            if (this._changed) {
                this._changed = false;
                this._updateImage(Gis.image(this.getOption('image')).createImageUri());
                this.recalculateImage(true);
            }
            var current = [this._latlng.lat, this._latlng.lng],
                temp = this._getLocalPosiiton(),
                overlayPosition = temp || this._topLeftSaved || current;
            this._lowLevelObject = this._lowLevelObject || {inset: true};
            this._lowLevelObject.overlay = map.drawOverlay({
                opacity: this._currentOpacity || this.getOpacity(),
                layer: this._layer,
                selected: this._selected,
                draggable: this.getOption('draggable') && this._map.isFilterable(this.getType()),
                imageData: {
                    latlng: overlayPosition,
                    latlngBottomRight: overlayPosition,
                    image: this._pic,
                    sWidth: this._sWidth,
                    clearDrag: true,
                    rotation: this.getAngle(),
                    scale: this.getScale(),
                    sHeight: this._sHeight,
                    dWidth: this._dWidth,
                    dHeight: this._dHeight
                },
                //throw available events to top api
                events: {
                    type: this.events,
                    callback: this.fireEventsFromLowLevel,
                    context: this
                }
            }, this._lowLevelObject.overlay);
//            if (this.isMoved() && this._selected) {
//                this._lowLevelObject.line1 = map.drawPolyline(
//                    Gis.Util.extend({}, {
//                        latlng: [this._latlngSrc, Gis.latLng(this._latlngSrc.lat, this._latlngBorromRightSrc.lng),
//                            this._latlngBorromRightSrc,
//                            Gis.latLng(this._latlngBorromRightSrc.lat, this._latlngSrc.lng),
//                            this._latlngSrc, this._latlngBorromRightSrc],
//                        drawIcon: false,
//                        line: this._lideStyle
//                    }),
//                    this._lowLevelObject.line1
//                );
//                this._lowLevelObject.line2 = map.drawPolyline(
//                    Gis.Util.extend({}, {
//                        latlng: [Gis.latLng(this._latlngBorromRightSrc.lat, this._latlngSrc.lng), Gis.latLng(this._latlngSrc.lat, this._latlngBorromRightSrc.lng)],
//                        drawIcon: false,
//                        line: this._lideStyle
//                    }),
//                    this._lowLevelObject.line2
//                );
//            } else if(this._lowLevelObject.line1) {
//                map.removeLayer(this._lowLevelObject.line1);
//                map.removeLayer(this._lowLevelObject.line2);
//                this._lowLevelObject.line1 = undefined;
//                this._lowLevelObject.line2 = undefined;
//            }
        },
        getLatLng: function () {
            return this.getNewCenter() || this.getUpdatedCenter() || this.getOldCenter();
        },
        /**
         * @return {Gis.LatLngBounds}
         */
        getLatLngBounds: function () {
            return Gis.latLngBounds(this._latlng, this._latlngBorromRight);
        }
    }
);
Gis.Overlay = Gis.Objects.Overlay;
Gis.overlay = function (data) {
    return new Gis.Overlay(data);
};
/**
 * @class
 * @classdesc Событие изменения размера
 * @event
 * @property {string} type Gis.Objects.Overlay.RESIZE_EVENT.TYPE
 */
Gis.Objects.Overlay.RESIZE_EVENT = function () {
    this.type = Gis.Objects.Overlay.RESIZE_EVENT.TYPE;
};
Gis.Objects.Overlay.RESIZE_EVENT.TYPE = 'resize';
/**
 @typedef Gis.Objects.Overlay.GeoCordSimple
 @type {object}
 @property {number} lat Широта
 @property {number} lon Долгота
 */
/**
 @typedef Gis.Objects.Overlay.GeoCordDelta
 @type {object}
 @property {Gis.Objects.Overlay.GeoCordSimple} old старая позиция
 @property {Gis.Objects.Overlay.GeoCordSimple} new новая позиция
 */
/**
 * @class
 * @classdesc Событие изменения оверлея
 * @event
 * @property {Gis.Objects.Overlay} overlay
 * @property {Gis.LatLng} deltaAngle может быть undefined
 * @property {number} angle поворот по часовой стрелке
 * @property {number} scale масштаб от центра
 * @property {Gis.LatLngBounds} srcBounds исходные границы изображения
 * @property {Gis.LatLng} topLeftTarget искаженная точка 1
 * @property {Gis.LatLng} topRightTarget искаженная точка 2
 * @property {Gis.LatLng} bottomRightTarget искаженная точка 3
 * @property {Gis.LatLng} bottomLeftTarget искаженная точка 4
 * @property {Array.<Gis.Objects.Overlay.GeoCordDelta>} geoCoords искажения
 * @property {string} type Gis.Objects.Overlay.ROTATE_EVENT.TYPE
 */
Gis.Objects.Overlay.OVERLAY_CHANGED_EVENT = function (overlay, deltaAngle, angle, scale) {
    var topLeftLat = overlay._topLeftSaved || overlay._latlngSrc,
        width = overlay._dWidth * scale,
        height = overlay._dHeight * scale,
        map = Gis.Map.CURRENT_MAP,
        centerPx = map.latLngToLayerPoint(topLeftLat).add(Gis.point(width / 2, height / 2));
    Gis.Util.extend(this, {target: overlay, delta: deltaAngle, angle: angle, scale: scale});
    this.srcBounds = Gis.latLngBounds(overlay._latlngSrc, overlay._latlngBorromRightSrc);
    this.topLeftTarget = map.layerPointToLatLng(centerPx.add(Gis.Util.rotate(Gis.point(-width / 2, -height / 2), -angle)));
    this.topRightTarget = map.layerPointToLatLng(centerPx.add(Gis.Util.rotate(Gis.point(width / 2, -height / 2), -angle)));
    this.bottomRightTarget = map.layerPointToLatLng(centerPx.add(Gis.Util.rotate(Gis.point(width / 2, height / 2), -angle)));
    this.bottomLeftTarget = map.layerPointToLatLng(centerPx.add(Gis.Util.rotate(Gis.point(-width / 2, height / 2), -angle)));
    this.geoCoords = [
        {old: {lat: this.srcBounds.getNorthWest().lat, lon: this.srcBounds.getNorthWest().lng}, 'new': {lat: this.topLeftTarget.lat, lon: this.topLeftTarget.lng}},
        {old: {lat: this.srcBounds.getNorthEast().lat, lon: this.srcBounds.getNorthEast().lng}, 'new': {lat: this.topRightTarget.lat, lon: this.topRightTarget.lng}},
        {old: {lat: this.srcBounds.getSouthEast().lat, lon: this.srcBounds.getSouthEast().lng}, 'new': {lat: this.bottomRightTarget.lat, lon: this.bottomRightTarget.lng}},
        {old: {lat: this.srcBounds.getSouthWest().lat, lon: this.srcBounds.getSouthWest().lng}, 'new': {lat: this.bottomLeftTarget.lat, lon: this.bottomLeftTarget.lng}}
    ];
//    Gis.Logger.log(this.srcBounds.getNorthWest());
//    Gis.Logger.log(this.srcBounds.getNorthEast());
//    Gis.Logger.log(this.srcBounds.getSouthEast());
//    Gis.Logger.log(this.srcBounds.getSouthWest());
//
//    Gis.Logger.log(this.topLeftTarget);
//    Gis.Logger.log(this.topRightTarget);
//    Gis.Logger.log(this.bottomRightTarget);
//    Gis.Logger.log(this.bottomLeftTarget);
//    console.log('----');
    this.type = Gis.Objects.Overlay.OVERLAY_CHANGED_EVENT.TYPE;
};
Gis.Objects.Overlay.OVERLAY_CHANGED_EVENT.TYPE = 'overlaychanged';
/**
 * @class
 * @classdesc Событие поворота
 * @event
 * @property {string} type Gis.Objects.Overlay.ROTATE_EVENT.TYPE
 */
Gis.Objects.Overlay.ROTATE_EVENT = function () {
    this.type = Gis.Objects.Overlay.ROTATE_EVENT.TYPE;
};
Gis.Objects.Overlay.ROTATE_EVENT.TYPE = 'rotate';
Gis.ObjectFactory.list.overlay = Gis.Objects.Overlay;
