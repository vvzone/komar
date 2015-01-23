/**
 * Created by Пользователь on 21.04.14.
 */
(function (global) {
    'use strict';
    var cache = new RGBColor("black"), getRgb = Gis.Objects.HeatMap.getRbg;
    Gis.setConfig('heatmap.colors', [
        Gis.config('heatmap.color'),
        [{percent: 0, color: new RGBColor("black")}, {percent: 1, color: new RGBColor("white")}],
        [{percent: 0, color: new RGBColor("yellow")}, {percent: 0.5, color: new RGBColor("brown")}, {percent: 1, color: new RGBColor("red")}],
        [{percent: 0, color: new RGBColor("rgb(0,10,252)")}, {percent: 0.5, color: new RGBColor("rgb(34, 34, 32)")}, {percent: 1, color: new RGBColor("rgb(164, 170, 19)")}]
    ]);
    Gis.gradientWidget = {
        initialize: function (_super) {
            _super();
            this._colors = Gis.config('heatmap.colors');
        },
        _HTMLgradientSelector: function (data) {
            var html = "<ul class='gradient-colors gis-color-list'>", i = 0, len = this._colors.length;
            for (i = 0; i <= len; i += 1) {
                html += "<li class='gradient gis-propertys-button gis-color-button gis-param-selector' data-index='" + i + "'><canvas/></li>";
            }
            html += "</ul>";
            return html;
        },
        getSelectedColorList: function (defaultGradient) {
            var $gradient = $('.gradient', this._$div);
            return this._colors[$gradient.index($gradient.filter('.selected'))] || defaultGradient;
        },
        _equalsColor: function (data, colorList) {
            var gradient = data && (data.getSelectedGradient() || data.getGradient()), equals = true, i, len, color1, color2;
            if (!gradient) {
                return false;
            } else {
                if (!colorList) {
                    colorList = this.getSelectedColorList(data.getGradient());
                }
                if (!colorList) {
                    return true;
                }
                if (gradient.length != colorList.length) {
                    return false;
                }
                for (i = 0, len = gradient.length; i < len; i += 1) {
                    color1 = getRgb(gradient[i].color, cache).toRGB();
                    color2 = getRgb(colorList[i].color, cache).toRGB();
                    equals = equals && color1 === color2;
                    if (!equals) {
                        return false;
                    }
                }
            }
            return equals;
        },
        initGradientList: function ($div, data) {
            var $gradientParents = $('.gradient', $div),
                $gradient = $('.gradient canvas', $div), _this, i, len, ctx, grd, colorList;
            $gradientParents.removeClass('selected');
            for (i = 0, len = $gradient.length; i < len; i += 1) {
                _this = $gradient[i];
                _this.width = 16;
                _this.height = 60;
                colorList = this._colors[i];
                if(!colorList) {
                    if (data) {
                        colorList = data.getGradient()
                    }
                }
                if (colorList) {
                    if (this._equalsColor(data, colorList)) {
                        _this.parentElement.classList.add('selected');
                    } else {
                        _this.parentElement.classList.remove('selected');
                    }
                    colorList = Gis.Objects.HeatMap.parseColors(colorList);
                    _this.parentNode.style.display = 'inline-block';
                    ctx = _this.getContext('2d');
                    grd = ctx.createLinearGradient(0,_this.offsetHeight, 0,0);
                    colorList.forEach(function (color) {
                        grd.addColorStop(color.percent,color.color.toRGBA());
                    });
                    ctx.fillStyle = grd;
                    ctx.fillRect(0,0,_this.width,_this.height);
                } else {
                    _this.parentNode.style.display = 'none';
                }
            }
        }
    };
}(this || self));