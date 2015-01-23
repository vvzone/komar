/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
/**
 * @abstract
 * @class
 * @classdesc Базовый класс команды. все наследники должны переопределить метод [execute]{@link Gis.Commands.Command.execute}
 * @param {Object} options
 * @param {string} options.type имя команды
 * @param {boolean} options.fromServer пришла ли команда от сервера
 * @param {Gis.Map} options.gis карта родитель
 * @param {Gis.ConnectionBase} options.connection
 * @extends Gis.BaseClass
 */
Gis.Commands.Command = Gis.BaseClass.extend(
    /** @lends Gis.Commands.Command# */
    {
        required: ['gis', 'connection'],
        options: {
            type: null,
            fromServer: false,
            gis: undefined,
            connection: undefined
        },
        initialize: function (data) {
            Gis.BaseClass.prototype.initialize.call(this, data);
            this.options.connection = this.options.connection || this.options.gis.getConnection();
        },
        /**
         * @abstract
         */
        execute: function () {
            Gis.extendError();
        }
    }
);
