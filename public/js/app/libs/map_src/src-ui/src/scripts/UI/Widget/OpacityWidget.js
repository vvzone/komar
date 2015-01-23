/**
 * Created by Пользователь on 21.04.14.
 */
(function (global) {
    'use strict';

    Gis.opacityWidget = {
        OPACITY_CLASS: 'gis-widget-opacity',
        OPACITY_CLASS_TEXT: 'gis-widget-opacity-text',
        initialize: function (_super) {
            _super();
        },
        _HTMLSlider: function () {
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='opacity-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Непрозрачность</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-opacity-container'>" +
                '<div class="' + this.OPACITY_CLASS + '"></div>' +
                "</div>" +
                "</div>\n";
        },
        getOpacity: function () {
            return this._$slider.slider('value') / 100;
        },
        isChangedOpacity: function () {
            return this._slided;
        },
        resetOpacity: function () {
            this._slided = false;
        },
        setOpacity: function (value) {
            return this._$slider.slider('value', value * 100);
        },
        initSlider: function ($div) {
            var self = this,
                MAX = 100,
                MIN = 0;
            function slideChange (e, ui) {
                if (self._$number.html() !== ui.value) {
                    self._$number.html(ui.value);
                }
                self._slided = true;
                self._updateState();
                self._sliding(self.getOpacity());
            }
            this._$slider = $('.' + this.OPACITY_CLASS, $div).slider({
                max: MAX,
                min: MIN,
                step: 1,
                change: slideChange,
                slide: slideChange
            });
            this.resetOpacity();
            $('a', this._$slider).append('<span></span>');
            this._$number = $('a span', this._$slider);
        }
    };
}(this || self));