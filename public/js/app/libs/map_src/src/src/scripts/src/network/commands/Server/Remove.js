(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Удалить объект //Серверная команда
     */
    Gis.Commands.remove = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.remove# */
        {
            options: {
                fromServer: true,
                ids: undefined
            },
            execute: function () {
                if (this.options.fromServer) {
                    if (this.options.ids.length) {
                        this.options.gis.removeLayer(this.options.ids);
                    } else {
                        throw new Error('layers with id=' + JSON.stringify(this.options.ids) + ' not exist');
                    }
                } else {
                    this.options.connection.sendMessage(JSON.stringify({
                        command: 'remove',
                        ids: this.options.ids
                    }));
                }
            }
        }
    );
}(Gis));
