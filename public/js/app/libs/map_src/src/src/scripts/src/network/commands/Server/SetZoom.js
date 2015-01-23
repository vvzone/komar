(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Установить зум //Серверная команда
     */
    Gis.Commands.setZoom = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.setZoom# */
        {
            options: {
                fromServer: true,
                ids : undefined,
                coords : undefined,
                latitudes : undefined,
                longitudes : undefined
            },
            execute: function () {
                var latitudes, longitudes, i, len, coords = this.options.coords;
                if (coords) {
                    latitudes = [];
                    longitudes = [];
                    for (i = 0, len = coords.length; i < len; i += 1 ) {
                        latitudes.push(coords[i].lat);
                        longitudes.push(coords[i].lon);
                    }
                } else {
                    latitudes = this.options.latitudes;
                    longitudes = this.options.longitudes;
                }
                //TODO refactor setMapBounds
                this.options.gis.setMapBounds({
                    ids: this.options.ids,
                    latitudes: latitudes,
                    longitudes: longitudes
                });
            }
        }
    );
}(Gis));
