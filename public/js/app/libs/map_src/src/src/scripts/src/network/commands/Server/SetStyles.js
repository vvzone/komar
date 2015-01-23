(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Установить стиль //Серверная команда
     */
    Gis.Commands.setStyles = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.setStyles# */
        {
            options: {
                fromServer: true,
                styles : undefined
            },
            execute: function () {
                var gis = this.options.gis;
                if (this.styles) {
                    gis.putStyle(this.styles);
                }
            }
        }
    );
}(Gis));
