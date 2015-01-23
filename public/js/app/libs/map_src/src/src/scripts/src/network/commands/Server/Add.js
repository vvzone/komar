(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.Commands.Command
     * @classdesc
     * Добавить объект //Серверная команда
     */
    Gis.Commands.add = Gis.Commands.Command.extend(
        /** @lends Gis.Commands.add# */
        {
            options: {
                fromServer: true,
                object: undefined
            },
            execute: function () {
                if (!this.options.fromServer) {
                    this._toServerExecute();
                } else {
                    this._fromServerExecute();
                }
            },
            _toServerExecute: function () {
                if (this.options.object.isControllableByServer() > Gis.FULL_LOCAL) {
                    this.options.connection.sendMessage(JSON.stringify({
                        command: 'add',
                        object: this.options.object.objectOfficialData()
                    }));
                }
            },
            _fromServerExecute: function () {
                var map = this.options.gis,
                    existsLayer = map.getLayer(this.options.object.id);
                if (existsLayer && existsLayer.getType() === this.options.object.tacticObjectType) {
                    map.showLayersByID(existsLayer.getId());
                    existsLayer.setData(this.options.object, undefined, true);
                    G.Logger.log('Object updated ' + existsLayer.getId(), existsLayer);
                } else {
                    map.addLayer(G.ObjectFactory.createObject(this.options.object), true, true);
                    if (this.options.object.tacticObjectType === Gis.Objects.Overlay.prototype.options.tacticObjectType) {
                        new Gis.Commands.getObject({fromServer: false, gis: this.options.gis, connection: this.options.connection, id: this.options.object.id}).execute();
                    }
                }
            }
        }
    );
}(Gis));
