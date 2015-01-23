(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * отправить объект
     */
    Gis.Commands.sendZoom = Gis.Commands.Command.extend({
        /** @lends Gis.Commands.sendObject# */
        options: {
            type: 'sendZoom'
        },
        execute: function () {
            var provider = this.options.gis.getMapProvider();
            var mapCenter = this.options.gis.getCenter();
            this.options.connection.sendMessage(JSON.stringify(Gis.Util.extend(
                Gis.Commands.sendZoom.getBounds(provider),
                {
                    command: "sendZoom",
                    center: mapCenter && {
                        lat: mapCenter.lat,
                        lon: mapCenter.lng
                    }
                }
            )));
        }
    });
    Gis.Commands.sendZoom.getBounds = function (provider) {
        var mapPixelBounds = provider.getPixelBounds();
        var topRight = mapPixelBounds.getTopRight();
        var bottomLeft = mapPixelBounds.getBottomLeft();
        var topLeftLatLng = provider.unproject(Gis.point(bottomLeft.x, topRight.y));
        var bottomRightLatLng = provider.unproject(Gis.point(topRight.x, bottomLeft.y));
        var bottomLeftLatLng = provider.unproject(bottomLeft);
        var topRightLatLng = provider.unproject(topRight);
        return {
            topLeft: mapPixelBounds && {
                lat: topLeftLatLng.lat,
                lon: topLeftLatLng.lng
            },
            topRight: mapPixelBounds && {
                lat: topRightLatLng.lat,
                lon: topRightLatLng.lng
            },
            bottomLeft: mapPixelBounds && {
                lat: bottomLeftLatLng.lat,
                lon: bottomLeftLatLng.lng
            },
            bottomRight: mapPixelBounds && {
                lat: bottomRightLatLng.lat,
                lon: bottomRightLatLng.lng
            }
        };
    };
}(Gis));
