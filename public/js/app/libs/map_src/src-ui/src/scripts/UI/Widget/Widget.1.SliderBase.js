"use strict";
/**
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.SliderBase = Gis.Widget.Base.extend(
    /**
     * @lends Gis.Widget.SliderVertical.prototype
     */
    {
        _type: null,
        /**
         * Допустимые параметры
         * @type {object}
         * @property {number} [step=0.01] щаг
         * @property {string} [position='right'] пока не стоит менять
         */
        options: {
            step: 0.01,
            position: null,
            enabled: true
        },
        getNeedSize: function () {
            return [50, this._$div.outerHeight(true)];
        },
        initialize: function (data) {
            var self = this;
            Gis.Widget.Base.prototype.initialize.call(this, data);
            this._decrease = function () {
                self._increase(1);
            };
        },
        _increase: function (koeff) {
            Gis.extendError();
        },
        getSliderValue: function() {
            return -parseFloat(this._slider.slider('value'));
        },
        getStep: function() {
            return parseFloat(this._slider.slider('option', 'step'));
        },
        getMapPixelBounds: function () {
            var map = this._containerController.getUIAttached().getMap(), provider = map.getMapProvider(), bounds, southWest, northEast;
            bounds = map.getMaxBounds();
            southWest = (bounds && bounds.getSouthWest()) || Gis.latLng(-90, -180);
            northEast = (bounds && bounds.getNorthEast()) || Gis.latLng(85, 180);
            return new Gis.Bounds(provider.project(northEast),
                provider.project(southWest));
        },
        getCalculatedStep: function () {
            Gis.extendError();
        },
        setBounds: function () {
            Gis.extendError();
        },
        _setValue: function () {
            Gis.extendError();
        },
        _setMaximum: function () {
            Gis.extendError();
        },
        _deInitEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            map.off('moveend zoomend', this._setValue, this);
            map.off('maxboundschanged zoomend sizerecalculated projectionchanged', this._setMaximum, this);
            this._$div.off('click', '.gis-latitude-previous', this._increase);
            this._$div.off('click', '.gis-latitude-next', this._decrease);
            this._containerController.getUIAttached().off('sizerecalculated', this.setBounds, this);
        },
        _initEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            this._$div.on('click', '.gis-latitude-previous', this._increase);
            this._$div.on('click', '.gis-latitude-next', this._decrease);
            map.on('moveend zoomend', this._setValue, this);
            map.on('maxboundschanged zoomend sizerecalculated projectionchanged', this._setMaximum, this);
            this._containerController.getUIAttached().on('sizerecalculated', this.setBounds, this);
        }
    });

