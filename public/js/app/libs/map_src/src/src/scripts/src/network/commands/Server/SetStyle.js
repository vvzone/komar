(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Установить стиль //Серверная команда
     */
    Gis.Commands.setStyle = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.setStyle# */
        {
            options: {
                fromServer: true,
                name : undefined,
                style : undefined
            },
            execute: function () {
                this.options.gis.putStyle(this.options.style);
            }
        }
    );
}(Gis));
