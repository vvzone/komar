"use strict";
/**
 * @class
 * @classdesc Стиль линии
 * @param {Object} options
 * @param {string} [options.color=Gis.Config.style.DefaultLine.color] цвет
 * @param {number} [options.thickness=Gis.Config.style.DefaultLine.thickness] толщина
 * @param {string} [options.dash=Gis.Config.style.DefaultLine.dash] стиль линии
 * @param {string} [options.border=Gis.Config.style.DefaultLine.border] цвет границы
 * @extends Gis.BaseClass
 */
Gis.Additional.LineStyle = Gis.BaseClass.extend(
    /** @lends Gis.Additional.LineStyle# */
    {
        _smoothFactor: 1.0,
        options: {
            color: Gis.Config.style.DefaultLine.color,
            thickness: Gis.Config.style.DefaultLine.thickness,
            dash: Gis.Config.style.DefaultLine.dash,
            border: Gis.Config.style.DefaultLine.border
        },
        optionsFire: [
            'thickness',
            'dash',
            'border',
            'color'
        ],
        getSmoothFactor: function () {
            return this._smoothFactor;
        },
        initialize: function (data) {
            data = Gis.Util.extend({}, data);
            Gis.BaseClass.prototype.initialize.call(this, data);
        },
        setData: function (data, val, notFireToServer) {
            if (typeof data === "object") {
                data = Gis.Util.extend({}, data);
//                if (data.dash && !parseInt(data.dash, 10)) {
//                    data.dash = Gis.Additional.Dash[data.dash];
//                }
            } else if (typeof data === "string" && val !== undefined && !this._isFixed(data)) {
//                if (data === 'dash' && !parseInt(data.dash, 10)) {
//                    val = Gis.Additional.Dash[val];
//                }
            }
            return Gis.BaseClass.prototype.setData.call(this, data, val, notFireToServer);
        },
        getColor: function () {
            return this.options.color || Gis.Config.style.DefaultLine.color;
        },
        getThickness: function () {
            return this.options.thickness || Gis.Config.style.DefaultLine.thickness;
        },
        getDash: function () {
            var srcDash = Gis.Additional.Dash[this.options.dash || Gis.Config.style.DefaultLine.dash],
                dash,
                i = 0,
                len,
                increase;

            if (srcDash) {
                dash = [];
                increase = this.getThickness() + (this.getBorder() ? 1 : 0);
                srcDash = srcDash.split(',');
                len = srcDash.length;
                for (i = 0; i < len; i += 1) {
                    dash[i] = parseInt(srcDash[i], 10) + (i % 2) * increase;
                }
                dash = dash.join(', ');
            }
            return dash;
        },
        getBorder: function () {
            return this.options.border || Gis.Config.style.DefaultLine.border;
        }
    }
);
Gis.LineStyle = Gis.Additional.LineStyle;

Gis.lineStyle = function (data) {
    if (data && data.getDash) {
        return data;
    }
    return new Gis.LineStyle(data);
};