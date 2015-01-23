'use strict';
/**
 * Стиль
 * @class
 * @extends Gis.BaseClass
 */
Gis.Additional.Style = Gis.BaseClass.extend(
    /** @lends Gis.Additional.Style.prototype */
    {
        /**
         * Допустимые опции
         * @type {object}
         * @property {string} styleID
         * @property {string} styleName
         * @property {string[]} styleObjectTypes
         */
        options: {
            styleID: undefined,
            styleName: undefined,
            styleObjectTypes: undefined
        },
        containsObjectType: function (objectType) {
            return this.options.styleObjectTypes.indexOf(objectType) > -1;
        },
        getStyleProperty: function (key) {
            return (key !== 'styleID' && key !== 'styleName' && key !== 'styleObjectTypes' && this._styleData[key]) || null;
        },
        getStyleValues: function () {
            return this._styleData;
        },
        initialize: function (data) {
            var result = Gis.BaseClass.prototype.initialize.call(this, data);
            delete data.styleID;
            delete data.styleName;
            delete data.styleObjectTypes;
            this._styleData = data;
            return result;
        },
        getStyleId: function () {
            return this.options.styleID;
        },
        getStyleName: function () {
            return this.options.styleName;
        }
    }
);
Gis.Style = Gis.Additional.Style;
/**
 * Возвращает новый экземпляр стиля
 * @param options
 * @returns {*}
 */
Gis.style = function (options) {
    if (options && options.getStyleId) {
        return options;
    }
    return new Gis.Style(options);
};
