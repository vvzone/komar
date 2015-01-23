(function (G) {
    "use strict";
    /**
     * @class
     * @classdesc  отправить изображение
     * @extends Gis.Commands.Command
     */
    Gis.Commands.getStyles = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.getStyles# */
        {
            required: ['gis', 'connection'],
            options: {
                type: 'getStyles'
            },
            execute: function () {
                this.options.connection.sendMessage(JSON.stringify({
                    command: 'getStyles'
                }));
            }
        }
    );
}(Gis));
