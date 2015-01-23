"use strict";
/**
 * @class
 * @classdesc событие изменения объекта
 * @memberof Gis.Commands
 * @extends Gis.Commands.Command
 */
Gis.Commands.changed = Gis.Commands.Command.extend(
    /** @lends Gis.Commands.changed# */
    {
        options: {
            type: 'changed',
            object: undefined,
            fieldNames: undefined
        },
        execute: function () {
            if (!this.options.fromServer) {
                if (this.options.object.isControllableByServer() > Gis.FULL_LOCAL) {
                    this.options.connection.sendMessage(JSON.stringify({
                        command: 'changed',
                        object: this.options.object.objectOfficialData(),
                        fieldNames: this.options.fieldNames
                    }));
                }
            } else {
                new Gis.Commands.add({gis: this.options.gis, connection: this.options.connection, object: this.options.object}).execute();
            }
        }
    }
);
