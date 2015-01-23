(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Запросить все объекты //Серверная команда
     */
    Gis.Commands.getAllObjects = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.getAllObjects# */
        {
            options: {
                fromServer: true
            },
            execute: function () {
                var cmd = new Gis.Commands.sendAllObjects({gis: this.options.gis, connection: this.options.connection});
                cmd.execute();
            }
        }
    );
}(Gis));
