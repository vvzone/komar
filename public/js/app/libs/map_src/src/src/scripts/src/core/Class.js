"use strict";
/**
 * @classdesc
 * Базовый класс.
 * Добавляет возможность быстрого наследования
 * @abstract
 * @class
 * */
Gis.Class = Gis.Util.defineSubclass(
    function () {},
    {
    },
    /**
     * @lends Gis.Class#
     */
    {
        /**
         *
         * @param {object} props data for new object
         * @returns {Function}
         */
        extend: function (props) {
            return Gis.Util.defineSubclass(this, props || {}, this.prototype.constructor);
        }
    }
);
Gis.extendError = function () {
    throw new Error("need override error");
};
