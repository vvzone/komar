/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
(function (G) {
    'use strict';
    Gis.ConnectionWorker = {
        CONFIG_REQUEST_UNKNOWN_KEY: 'request.unknown.key',
        initialize: function (_super) {
            _super();
            this._initConnection();
        },
        _initConnection: function () {
            if (this._settings.getServer()) {
                this.connect.apply(this, this._settings.getServer());
            }
        },
        /**
         * Запросить объект с указанным ID у сервера
         * @param id
         * @param {Gis.Objects.Base} object кто запросил
         * @param {boolean} [noRegisterForWait=false]
         */
        requestObject: function (id, object, noRegisterForWait) {
            if (this._connection && Gis.config(this.CONFIG_REQUEST_UNKNOWN_KEY, true)) {
                Gis.Logger.log('Объект ' + id + ' для ' + object.getType() + '=' + object.getId() + ' не обнаружен, запрашиваем у сервера');
                var cmd = new Gis.Commands.getObject({
                    gis: this,
                    connection: this._connection,
                    fromServer: false,
                    id: id
                });
                cmd.execute();
                if (!noRegisterForWait) {
                    this.renderer.whenAdd(id, object);
                }
            }
        },
        /**
         * Возвращает текущий объект соединения
         * @returns {Gis.ConnectionBase}
         */
        getConnection: function () {
            return this._connection;
        },
        _connectionStatusChanged: function (e) {
            this.fire(e.type, e);
        },
        /**
         * Соединиться с сервером
         * @param {String} domain домен для соединения
         * @param {number} port порт для соединения
         * @param {number} portSecond альтернативный порт для соединения
         * @returns {Gis.Map}
         * **/
        connect: function (domain, port, portSecond) {
            port = port && parseInt(port, 10);
            if (!domain || typeof domain !== 'string') {
                Gis.Logger.log('Not correct domain', domain);
                throw new Error('Not correct domain');
            }
            if (!port) {
                Gis.Logger.log('Not correct port', port);
                throw new Error('Not correct port');
            }
            port = port || Gis.Config.connection.port;
            portSecond = portSecond || Gis.Config.connection.portSecond;
            this.disconnect();
            this._connection = Gis.connection({gis: this, domain: domain, port: port, portSecond: portSecond});
            this.renderer.on(Gis.ObjectController.LAYER_CHANGED_EVENT.TYPE, this._connection.layerChanged, this._connection);
            this.renderer.on(Gis.ObjectController.LAYER_REMOVE_EVENT.TYPE, this._connection.layerRemoved, this._connection);
            this.renderer.on('customaction', this._connection._onCustomAction, this._connection);
            this.on(Gis.Objects.Overlay.OVERLAY_CHANGED_EVENT.TYPE, this._connection._onOverlayChanged, this._connection);
            this.on('projectionchanged', this._connection.sendConnect, this._connection);
            this._connection.on('statuschanged', this._connectionStatusChanged, this);
            this._connection.on('commandok', this._connectionCommandOk, this);
            this._connection.connect();
            return this;
        },
        /**
         * Отключиться от сервера
         * @returns {Gis.Map}
         */
        disconnect: function () {
            if (this._connection) {
                this.renderer.off('layerchanged', this._connection.layerChanged, this._connection);
                this.renderer.off('customaction', this._connection._onCustomAction, this._connection);
                this.off(Gis.Objects.Overlay.OVERLAY_CHANGED_EVENT.TYPE, this._connection._onOverlayChanged, this._connection);
                this._connection.off('commandok', this._connectionCommandOk, this);
                this._connection.off('statuschanged', this._connectionStatusChanged, this);
                this.off('projectionchanged', this._connection.sendConnect, this._connection);
                this._connection.disconnect();
            }
            return this;
        },
        _connectionCommandOk: function (e) {
            this.fire(e.type, e);
        }
    };
    Gis.Map.include(Gis.ConnectionWorker);
}(Gis));