(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Запросить изображение //Серверная команда
     */
    Gis.Commands.getImage = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.getImage# */
        {
            required: ['gis', 'connection', 'queryId', 'ids'],
            options: {
                fromServer: true,
                queryId : undefined,
                ids : undefined,
                latitudes : undefined,
                longitudes : undefined,
                width : undefined,
                height : undefined
            },
            execute: function () {
    //            this.options.gis.getScreenshot({
    //                latitudes: this.options.latitudes,
    //                longitudes: this.options.longitudes,
    //                ids: this.options.ids,
    //                width: this.options.width,
    //                height: this.options.height
    //            }, function (imageData) {
    //                var cmd = new Gis.Commands.sendImage({gis: this.options.gis, connection: this.options.connection, queryId: this.options.queryId, image: JSON.stringify(imageData)});
    //                cmd.execute();
    //            }, this);
                console.log('NOT IMPLEMENTED');
            }
        }
    );
}(Gis));
