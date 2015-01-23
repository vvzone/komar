(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * отправить изображение
     */
    Gis.Commands.sendImage = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.sendImage# */
        {
            required: ['gis', 'connection', 'queryId', 'image'],
            options: {
                type: 'sendImage',
                queryId: undefined,
                image: undefined
            },
            execute: function () {
                this.options.connection.sendMessage(JSON.stringify({
                    command: 'sendImage',
                    queryId: this.options.queryId,
                    image: this.options.image
                }));
            }
        }
    );
}(Gis));
