(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Запросить объект //Серверная команда
     */
    Gis.Commands.getObject = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.getObject# */
        {
            options: {
                fromServer: true,
                id: undefined
            },
            execute: function () {

                if (!this.options.fromServer) {
                    this.options.connection.sendMessage(JSON.stringify({
                        command: 'getObject',
                        id: this.options.id
                    }));
                } else {
                    var cmd = new Gis.Commands.sendObject({gis: this.options.gis, connection: this.options.connection, id: this.options.id});
                    cmd.execute();
                }
            }
        }
    );
}(Gis));
