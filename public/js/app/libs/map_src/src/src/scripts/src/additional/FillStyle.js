"use strict";
/**
 * @classdesc
 * Стиль заливки
 * @class
 * @param {Object} options
 * @param {string} [options.color=Gis.Config.style.DefaultFill.color]
 * @param {string} [options.hatch=Gis.Config.style.DefaultFill.hatch]
 * @param {string} [options.hatchColor=Gis.Config.style.DefaultFill.hatchColor]
 * @extends Gis.BaseClass
 */
Gis.Additional.FillStyle = Gis.BaseClass.extend(
    /** @lends Gis.Additional.FillStyle# */
    {
        options: {
            color: undefined,
            hatch: undefined,
            hatchColor: undefined
        },
        optionsFire: [
            'color',
            'hatch',
            'hatchColor'
        ],
        getColor: function () {
            return this.options.color || Gis.Config.style.DefaultFill.color;
        },
        getHatch: function () {
            return this.options.hatch || Gis.Config.style.DefaultFill.hatch;
        },
        getHatchColor: function () {
            return this.options.hatchColor || Gis.Config.style.DefaultFill.hatchColor;
        }
    }
);
Gis.FillStyle = Gis.Additional.FillStyle;

/**
 * Создает новый объект стиля линии
 * @param data
 * @return {*}
 */
Gis.fillStyle = function (data) {
    if (data && data.getHatch) {
        return data;
    }
    return new Gis.FillStyle(data);
};