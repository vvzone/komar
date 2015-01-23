(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Удалить объект //Серверная команда
     */
    Gis.Commands.removeByCreator = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.remove# */
        {
            options: {
                fromServer: true,
                creator: undefined
            },
            execute: function () {
                var ids = this.options.gis.getLayerIDs(),
                    self = this,
                    creator = self.options.creator;
                if (ids.length) {
                    ids.forEach(function (val) {
                        if (val.getTag(Gis.Objects.Base.CREATOR_TAG_NAME) === creator) {
                            self.removeLayer(val);
                        }
                    });
                }
            }
        }
    );
}(Gis));
