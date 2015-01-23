(function () {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * событие установки дополнительных действий
     */
    Gis.Commands.customActionEvent = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.customActionEvent# */
        {
            required: ['gis', 'connection', 'id', 'action'],
            options: {
                fromServer: false,
                type: 'customActionEvent',
                id: undefined,
                action: undefined
            },
            execute: function () {
                if (!this.options.fromServer) {
                    this.options.connection.sendMessage(JSON.stringify({
                        command: 'customActionEvent',
                        id: this.options.id,
                        action: this.options.action
                    }));
                }
            }
        }
    );
}());
