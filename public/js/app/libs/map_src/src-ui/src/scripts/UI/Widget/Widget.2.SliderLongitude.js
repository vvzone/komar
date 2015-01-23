"use strict";
/**
 * слайдер долготы
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.SliderHorisontal = Gis.Widget.SliderBase.extend(
    /**
     * @lends Gis.Widget.SliderHorisontal.prototype
     */
    {
        _type: 'sliderhorisontal',
        /**
         * Допустимые параметры
         * @type {object}
         * @property {number} [step=0.01] щаг
         * @property {string} [position='bottom'] пока не стоит менять
         */
        options: {
            step: 0.01,
            position: "bottom",
            enabled: true
        },
        initialize: function (data) {
            var self = this;
            Gis.Widget.SliderBase.prototype.initialize.call(this, data);
            this._increase = function (koeff) {
                koeff = (Gis.Util.isNumeric(koeff) && koeff) || -1;
                var center, map = self._containerController.getUIAttached().getMap(), mapProvider;
                center = map.getCenter();
                mapProvider = map.getMapProvider();
                map.setCenter(mapProvider.unproject(Gis.point(self.getSliderValue() -self.getStep() * koeff, mapProvider.project(center).y)));
            };
        },
        getSliderValue: function() {
            return parseFloat(this._slider.slider('value'));
        },
        onAdd: function (container) {
            Gis.Widget.Base.prototype.onAdd.call(this, container);
            var map = this._containerController.getUIAttached().getMap(), self = this, layerBounds, provider = map.getMapProvider();
            layerBounds = this.getMapPixelBounds();
            if (true) {
                this.draw();
                this.setBounds();
                this._slider = $("#scroll-bar-h").slider({
                    orientation: "horizontal",
                    step: this.getCalculatedStep(),
                    start: function () {
                        var center = map.getCenter();
                        self._y = provider.project(center).y;
                        self._slided = true;
                    },
                    stop: function () {
                        self._slided = false;
                        self._y = null;
                    },
                    min: layerBounds.getBottomLeft().x,
                    max: layerBounds.getTopRight().x,
                    value: provider.project(map.getCenter()).x,
                    slide: function (event, ui) {
                        var center = map.getCenter();
                        map.setCenter(provider.unproject(Gis.point(ui.value, self._y || provider.project(center).y)), true);
                    }
                });
            }
            this._init = true;
        },
        getCalculatedStep: function () {
            var layerBounds = this.getMapPixelBounds();
            return (layerBounds.getTopRight().x - layerBounds.getBottomLeft().x) / (100 * this._containerController.getUIAttached().getMap().getZoom() + 1);
        },
        _setMaximum: function () {
            var map = this._containerController.getUIAttached().getMap(),
                provider = map.getMapProvider(),
                layerBounds = this.getMapPixelBounds();
            if (this._init) {
                $("#scroll-bar-h", this._$div).slider("option", {
                    min: layerBounds.getBottomLeft().x,
                    max: layerBounds.getTopRight().x,
                    value: provider.project(map.getCenter()).x,
                    step: this.getCalculatedStep() || this.options.step
                });
            }
        },
        initHTML: function () {
            Gis.Widget.Base.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.SliderHorisontal.CLASS_NAME);
            this._$div.append("<div><div class='gis-widget-button gis-longitude-previous'></div><div id='scroll-bar-h'></div><div class='gis-widget-button gis-longitude-next'></div></div>");
        },
        _setValue: function () {
            if (!this._slided && this._init) {
                var map = this._containerController.getUIAttached().getMap(),
                    provider = map.getMapProvider();
                $("#scroll-bar-h", this._$div).slider('value',  provider.project(map.getCenter()).x);
            }
        },
        setBounds: function () {
//            var width;
//            width = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).width;
//            this._$div.css({
//                width: width
//            });
        },
        _deInitEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            map.off('moveend zoomend', this._setValue, this);
            map.off('maxboundschanged zoomend sizerecalculated projectionchanged', this._setMaximum, this);
            this._$div.off('click', '.gis-longitude-previous', this._decrease);
            this._$div.off('click', '.gis-longitude-next', this._increase);
            this._containerController.getUIAttached().off('sizerecalculated', this.setBounds, this);
        },
        _initEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            this._$div.on('click', '.gis-longitude-previous', this._decrease);
            this._$div.on('click', '.gis-longitude-next', this._increase);
            map.on('moveend zoomend', this._setValue, this);
            map.on('maxboundschanged zoomend sizerecalculated projectionchanged', this._setMaximum, this);
            this._containerController.getUIAttached().on('sizerecalculated', this.setBounds, this);
        }
    });

Gis.Widget.SliderHorisontal.CLASS_NAME = "gis-widget-sliderHorisontal-container";
Gis.Widget.sliderHorisontal = function (data) {
    return new Gis.Widget.SliderHorisontal(data);
};
Gis.Widget.sliderhorisontal = Gis.Widget.sliderHorisontal;
