"use strict";
/**
 * @namespace
 */
Gis.Maps = Gis.Maps || {};
/**
 * Интерфейс провайдера
 * @abstract
 * @class
 * @extends Gis.BaseClass
 */
Gis.Maps.Base = Gis.BaseClass.extend(
    /** @lends Gis.Maps.Base.prototype */
    {
        includes: Gis.Core.Events,
        /**
         * @param {Array | Gis.LatLng} center sets center of the map
         * */
        setCenter: function (center) {
            Gis.extendError();
        },
        gridVisibility: function (grid) {
            Gis.extendError();
        },
        /**
         * возвращает DOM контейнер карты
         * */
        getContainer: function () {
            Gis.extendError();
        },
        setDraggable: function () {
            Gis.extendError();
        },
        setZoomAround: function (latlng,  zoom) {
            Gis.extendError();
        },
        /**
         * устанавливает границы видимой области
         * @param {Gis.LatLngBounds} bounds
         * */
        setMapBounds: function (bounds, panInside) {
            Gis.extendError();
        },
        /**
         * Возвращает текущее разрешение
         * @param [zoom] уровень зума
         * @return {Number}
         */
        getCurrentScale: function (zoom) {
            Gis.extendError();
            return 0;
        },
        getProjectionCode: function () {
            Gis.extendError();
        },
        getMaxBounds: function () {
            Gis.extendError();
        },
        getPixelBounds: function () {
            Gis.extendError();
        },
        setMapType: function () {
            Gis.extendError();
        },

        _setOptionsConverter: function (converter) {
            this._converter = converter;
        },
        _getOptionsConverter: function () {
            return this._converter;
        },

        /**
         * @returns {Gis.LatLng} current center of the map
         * */
        getCenter: function () {
            Gis.extendError();
        },

        closeMap: function () {
            Gis.extendError();
        },
        fitWorld: function () {
            Gis.extendError();
        },

        /**
         * @returns {int} current zoom of the map
         * */
        getZoom: function () {
            Gis.extendError();
        },

        /**
         * @returns {int} current min zoom of the map
         * */
        getMinZoom: function () {
            Gis.extendError();
        },

        /**
         * @returns {int} current max zoom of the map
         * */
        getMaxZoom: function () {
            Gis.extendError();
        },

        //function draw
        /**
         * draws polygon
         * */
        drawPolygon: function () {
            Gis.extendError();
        },
        /**
         * draws polyline
         * */
        drawPolyline: function () {
            Gis.extendError();
        },
        /**
         * draws overlay
         * */
        drawOverlay: function () {
            Gis.extendError();
        },
        /**
         * draws drawMultiPolyline
         * */
        drawMultiPolyline: function () {
            Gis.extendError();
        },
        /*
         * draw rectangle on the map
         * @param {object} options data for create rectangle
         * */
        drawRectangle: function (options) {
            Gis.extendError();
        },
        /**
         * draws cycle
         * */
        drawCycle: function () {
            Gis.extendError();
        },
        /**
         * draws ellipse
         * */
        drawEllipse: function () {
            Gis.extendError();
        },
        /**
         * draws text
         * */
        drawText: function () {
            Gis.extendError();
        },
        /**
         * draws popup
         * */
        drawPopup: function () {
            Gis.extendError();
        },
        showMap: function () {
            Gis.extendError();
        },

        /** methods for modify map state **/

        /**
         * increase zoom by 1
         * */
        zoomIn: function () {
            Gis.extendError();
        },
        /**
         * decrease zoom by 1
         * */
        zoomOut: function () {
            Gis.extendError();
        },

        /**
         * set zoom
         * @param {int} zoom
         * */
        setZoom: function (zoom) {
            Gis.extendError();
        },

        /**
         * set max bounds of map
         * */
        setMaxBounds: function (bounds) {
            Gis.extendError();
        },

        removeLayer: function () {
        },

        latLngToLayerPoint: function () {
            Gis.extendError();
        },

        layerPointToLatLng: function () {
            Gis.extendError();
        }
    }
);