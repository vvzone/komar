(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * отправить объект
     */
    Gis.Commands.sendObject = Gis.Commands.Command.extend({
        /** @lends Gis.Commands.sendObject# */
        options: {
            type: 'sendObject',
            id: undefined
        },
        execute: function () {

            if (!this.options.fromServer) {
                this.options.connection.sendMessage(JSON.stringify({
                    command: 'sendObject',
                    object: this.options.gis.getLayer(this.options.id).objectData()
                }));
            } else {
                new Gis.Commands.add({gis: this.options.gis, connection: this.options.connection, object: this.options.object}).execute();
            }
        }
    });
}(Gis));
