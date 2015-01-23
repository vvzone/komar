"use strict";
/**
 * @classdesc
 * событие изменения объекта
 * @class
 * @extends Gis.Commands.Command
 */
Gis.Commands.connect = Gis.Commands.Command.extend(
    /** @lends Gis.Commands.connect# */
    {
        _clientAvailable: 'client server dataSource',
        options: {
            fromServer: false,
            type: 'connect',
            clientType: undefined,
            name: undefined,
            projection: undefined
        },
        _checkDataCorrect: function () {
            return this._clientAvailable.indexOf(this.options.clientType) >= 0;
        },
        execute: function () {
            if (this._checkDataCorrect()) {
                if (!this.options.fromServer) {
                    this.options.connection.sendMessage(JSON.stringify({
                        command: 'connect',
                        clientType: this.options.clientType,
                        name: this.options.name,
                        projection: this.options.projection
                    }), true);
                } else {
                    this.options.gis.fire('connected', {
                        name: this.options.name,
                        projection: this.options.projection
                    });
                }
            }
        }
    }
);
