(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * отправить смещение
     */
    Gis.Commands.sendOverlayDrag = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.sendOverlayDrag# */
        {
            required: ['gis', 'connection', 'id', 'shift_lat', 'shift_lon'],
            options: {
                type: 'sendImage',
                id: undefined,
                geoCoords: undefined,
                angle: undefined,
                scale: undefined,
                shift_lat: undefined,
                shift_lon: undefined
            },
            execute: function () {
                if (!this.options.fromServer) {
                    this.options.connection.sendMessage(JSON.stringify({
                        command: 'sendOverlayDrag',
                        id: this.options.id,
                        geoCoords: this.options.geoCoords,
                        angle: this.options.angle,
                        scale: this.options.scale,
                        shift_lat: this.options.shift_lat,
                        shift_lon: this.options.shift_lon
                    }));
                } else {
                    Gis.Logger.log('received sendOverlayDrag from server. Do nothing.');
                }
            }
        }
    );
}(Gis));
