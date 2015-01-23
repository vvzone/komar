(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Запросить объект //Серверная команда
     */
    Gis.Commands.getZoom = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.getObject# */
        {
            options: {
                fromServer: true
            },
            execute: function () {
                var cmd = new Gis.Commands.sendZoom({
                    gis: this.options.gis,
                    connection: this.options.connection
                });
                cmd.execute();
            }
        }
    );
}(Gis));
