(function (G) {
    "use strict";
    /**
     * @abstract
     * @class
     * @classdesc Базовый класс для соединения с серверов
     * @extends Gis.BaseClass
     */
    Gis.ConnectionBase = Gis.BaseClass.extend(
        /** @lends Gis.ConnectionBase# */
        {
            _messages: [],
            _listenConnection: undefined,
            _sendConnection: undefined,
            options: {
                gis: undefined,
                domain: undefined,
                port: undefined,
                portSecond: undefined,
                reconnectDelay: undefined
            },
            layerChanged: function (event) {
                if (event.rows && event.rows.length && event.target && event.target.isControllableByServer() > Gis.FULL_LOCAL && !event.notFireToServer) {
                    var cmd;
                    if (event.isAdd) {
                        cmd = new Gis.Commands.add({
                            gis: this.options.gis,
                            connection: this,
                            object: event.target,
                            fromServer: false
                        });
                    } else {
                        cmd = new Gis.Commands.changed({
                            gis: this.options.gis,
                            connection: this,
                            object: event.target,
                            fromServer: false,
                            fieldNames: event.rows
                        });
                    }
                    cmd.execute();
                }
            },
            layerRemoved: function (event) {
                if (event.target && event.target.isEditableByUser() && event.target.isControllableByServer() > Gis.FULL_LOCAL && !event.notFireToServer && Gis.Util.checkGUID(event.target.getId())) {
                    var cmd = new Gis.Commands.remove({
                        gis: this.options.gis,
                        connection: this,
                        fromServer: false,
                        ids: [event.target.getId()]
                    });
                    cmd.execute();
                }
            },
            _onCustomAction: function (event) {
                if (event.action && event.target && event.target.isControllableByServer() > Gis.FULL_LOCAL) {
                    var cmd = new Gis.Commands.customActionEvent({
                        gis: this.options.gis,
                        connection: this,
                        id: event.target.getId(),
                        action: event.action,
                        fromServer: false
                    });
                    cmd.execute();
                }
            },
            _onOverlayChanged: function (event) {
                if (event.target && event.target.isControllableByServer() > Gis.FULL_LOCAL) {
                    var latLngDelta = event.delta,
                        cmd = new Gis.Commands.sendOverlayDrag({
                            gis: this.options.gis,
                            connection: this,
                            id: event.target.getId(),
                            geoCoords: event.geoCoords,
                            angle: event.angle,
                            scale: event.scale,
                            shift_lat: (latLngDelta && latLngDelta.lat) || 0,
                            shift_lon: (latLngDelta && latLngDelta.lng) || 0
                        });
                    cmd.execute();
                }
            },
            /**
             * @abstract
             * @param message
             */
            onMessage: function (message) {
                G.extendError();
            },
            /**
             * @abstract
             */
            sendMessage: function () {
                G.extendError();
            },
            /**
             * @abstract
             */
            connect: function () {
                G.extendError();
            },
            getDomain: function () {
                return this.options.domain;
            },
            getPort: function () {
                G.extendError();
            },
            setStatus: function (status) {
                if (status !== this._status) {
                    if (status === Gis.ConnectionBase.STATUS_CONNECTED) {
                        this.sendConnect();
                    }
                    this._status = status;
                    this.fire('statuschanged', {target: this});
                }
            },
            sendConnect: function () {
                var cmd = new Gis.Commands.connect({
                    gis: this.options.gis,
                    connection: this,
                    clientType: 'client',
                    projection: this.options.gis.getProjection(),
                    name: this.options.gis.getSetting('creator')
                });
                cmd.execute();
            },
            getStatus: function () {
                return this._status;
            },
            isConnected: function () {
                return this._status === Gis.ConnectionBase.STATUS_CONNECTED;
            },
            isConnecting: function () {
                return this._status === Gis.ConnectionBase.STATUS_CONNECTING;
            },
            /**
             * @abstract
             */
            disconnect: function () {
                G.extendError();
            },
            onError: function (error) {
                Gis.Logger.log('Error connection ', error.message);
            }
        }
    );
    G.ConnectionBase.GUID = G.Util.generateGUID();
    G.ConnectionBase.STATUS_CONNECTED = 1;
    G.ConnectionBase.STATUS_DISCONNECTED = 0;
    G.ConnectionBase.STATUS_CONNECTING = 2;

}(Gis));