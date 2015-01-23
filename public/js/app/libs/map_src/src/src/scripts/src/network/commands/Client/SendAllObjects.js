(function (G) {
    "use strict";
    /**
     * @classdesc
     * отправить все объекты
     * @class
     * @extends Gis.Commands.Command
     */
    Gis.Commands.SendAllObjects = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.SendAllObjects# */
        {
            options: {
                type: 'sendAllObjects'
            },
            execute: function () {
                this.options.connection.sendMessage(JSON.stringify({
                    command: 'sendAllObjects',
                    objects: this.options.gis.getLayerIDs()
                }));
            }
        }
    );
    Gis.Commands.sendAllObjects = Gis.Commands.SendAllObjects;
}(Gis));
