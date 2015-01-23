"use strict";
/**
 * СЛайдер широт
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.SliderVertical = Gis.Widget.SliderBase.extend(
    /**
     * @lends Gis.Widget.SliderVertical.prototype
     */
    {
        _type: 'slidervertical',
        /**
         * Допустимые параметры
         * @type {object}
         * @property {number} [step=0.01] щаг
         * @property {string} [position='right'] пока не стоит менять
         */
        options: {
            step: 0.01,
            position: "right",
            enabled: true
        },
        getNeedSize: function () {
            return [this._$div.outerWidth(true), 50];
        },
        initialize: function (data) {
            var self = this;
            Gis.Widget.SliderBase.prototype.initialize.call(this, data);
            this._increase = function (koeff) {
                koeff = (Gis.Util.isNumeric(koeff) && koeff) || -1;
                var center, map = self._containerController.getUIAttached().getMap(), mapProvider;
                center = map.getCenter();
                mapProvider = map.getMapProvider();
                map.setCenter(mapProvider.unproject(Gis.point(mapProvider.project(center).x, self.getSliderValue() + self.getStep() * koeff)));
            };
        },
        onAdd: function (container) {
            Gis.Widget.Base.prototype.onAdd.call(this, container);
            var map = this._containerController.getUIAttached().getMap(), provider = map.getMapProvider(), self = this, layerBounds;
            layerBounds = this.getMapPixelBounds();
            if (true) {
                this.draw();
                this.setBounds();
                this._slider = $("#scroll-bar", this._$div).slider({
                    orientation: "vertical",
                    step: this.getCalculatedStep(),
                    start: function () {
                        var center = map.getCenter();
                        self._x = provider.project(center).x;
                        self._slided = true;
                    },
                    stop: function () {
                        self._slided = false;
                        self._x = null;
                    },
                    min: -layerBounds.getBottomLeft().y,
                    max: -layerBounds.getTopRight().y,
                    value: -provider.project(map.getCenter()).y,
                    slide: function (event, ui) {
                        var center = map.getCenter();
                        map.setCenter(provider.unproject(Gis.point(self._x || provider.project(center).x, -ui.value)), true);
                    }
                });
                this._init = true;
            }
        },
        initHTML: function () {
            Gis.Widget.Base.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.SliderVertical.CLASS_NAME);
            this._$div.append("<div><div class='gis-widget-button gis-latitude-previous'></div><div id='scroll-bar'></div><div class='gis-widget-button gis-latitude-next'></div></div>");
        },
        setBounds: function () {
            var heightContainer;
            heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
            this._$div.css({
                height: heightContainer
            });
            $('#scroll-bar', this._$div).css({
                height: this._$div.height() - ($('>div', this._$div).outerHeight(true) - $('>div', this._$div).height())
            });
        },
        getCalculatedStep: function () {
            var layerBounds = this.getMapPixelBounds();
            return (layerBounds.getBottomLeft().y - layerBounds.getTopRight().y) / (100 * this._containerController.getUIAttached().getMap().getZoom() + 1);
        },
        _setValue: function () {
            if (!this._slided && this._init) {
                var map = this._containerController.getUIAttached().getMap(),
                    provider = map.getMapProvider();
                $("#scroll-bar", this._$div).slider('value', -provider.project(map.getCenter()).y);
            }
        },
        _setMaximum: function () {
            var map = this._containerController.getUIAttached().getMap(),
                provider = map.getMapProvider(),
                layerBounds;
            layerBounds = this.getMapPixelBounds();
            if (this._init) {
                $("#scroll-bar", this._$div).slider("option", {
                    min: -layerBounds.getBottomLeft().y,
                    max: -layerBounds.getTopRight().y,
                    step: this.getCalculatedStep() || this.options.step,
                    value: -provider.project(map.getCenter()).y
                });
            }
        }
    });

Gis.Widget.SliderVertical.CLASS_NAME = "gis-widget-sliderVertical-container";
Gis.Widget.sliderVertical = function (data) {
    return new Gis.Widget.SliderVertical(data);
};
Gis.Widget.slidervertical = Gis.Widget.sliderVertical;
