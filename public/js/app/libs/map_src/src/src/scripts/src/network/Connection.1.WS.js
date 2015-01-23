(function (G) {
    "use strict";
    Gis.WS_DISABLE = false;
    /**
     * @class
     * @classdesc web socket
     * @extends Gis.ConnectionBase
     */
    Gis.ConnectionWs = Gis.ConnectionBase.extend(
        /** @lends Gis.ConnectionWs# */
        {
            _needConnect: true,
            required: ['gis', 'domain', 'port'],
            getPort: function () {
                return this.options.port;
            },
            isConnected: function () {
                return this._connection && this._connection.readyState === WebSocket.OPEN;
            },
            isConnecting: function () {
                return this._connection && this._connection.readyState === WebSocket.CONNECTING;
            },
            disconnect: function () {
                this._needConnect = false;
                this.stopInterval();
                if (this.isConnected()) {
                    this._connection.close();
                }
                this.stopInterval();
                this.setStatus(G.ConnectionBase.STATUS_DISCONNECTED);
            },
            /**
             * start connection with the server
             * */
            connect: function () {
                this._needConnect = true;
                this.setStatus(G.ConnectionBase.STATUS_CONNECTING);
                this.stopInterval();
                if (this.isConnected() || this.isConnecting()) {
                    return;
                }
                var self = this;
                if (!WebSocket) {
                    throw new Error("Your browser not support webSocket");
                }
                this._connection = new WebSocket("ws://" + this.options.domain + ":" + this.options.port);
                this._connection.onopen = function (e) {
                    if (self._needConnect) {
                        self.setStatus(G.ConnectionBase.STATUS_CONNECTED);
                        self.onOpen(e);
                    } else {
                        this.close();
                    }
                };
                this._connection.onmessage = function (message) {
                    Gis.Logger.log("Message from " + (message.currentTarget.URL || message.currentTarget.url), message.data);
                    self.onMessage(message);
                };
                this._connection.onclose = function (event) {
                    self.setStatus(G.ConnectionBase.STATUS_DISCONNECTED);
                    self.onClose(event);
                };
                this._connection.onerror = function (error) {
                    self.setStatus(G.ConnectionBase.STATUS_DISCONNECTED);
                    self.onError(error);
                };
            },
            sendMessage: function (jSon) {
                if (this.isConnected()) {
                    Gis.Logger.log("Message to " + (this._connection.URL || this._connection.url), jSon);
                    this._connection.send(jSon);
                    this.fire('commandok', {command: jSon.command});
                } else {
                    Gis.Logger.log("Not connected to " + (this._connection.URL || this._connection.url) + ". Message not sended.");
                }
            },
            onOpen: function (e) {
                Gis.Logger.log("Connected to " + (e.target.URL || e.target.url));
            },
            stopInterval: function () {
                if (this._reconnectInterval) {
                    clearTimeout(this._reconnectInterval);
                    this._reconnectInterval = undefined;
                    this.fire('reconnectcleared');
                }
            },
            startReconnectDelay: function () {
                this.setStatus(G.ConnectionBase.STATUS_CONNECTING);
                var self = this;
                this.stopInterval();
                this._reconnectInterval = setTimeout(function () {
                    self.connect();
                    G.Logger.log('Reconnect start');
                    self.fire('reconnectfired');
                }, this.options.reconnectDelay || G.Config.connection.reconnectDelay);
                G.Logger.log('Reconnect timeout start');
                this.fire('reconnectdelaystarted');
            },
            onClose: function (event) {
                var message, reconnect = false;
                if (event.wasClean) {
                    message = 'Соединение закрыто чисто';
                } else {
                    message = 'Обрыв соединения';
                    reconnect = true;
                }
                Gis.Logger.log(message, 'Код: ' + event.code + ' причина: ' + event.reason);
                if (reconnect && this._needConnect) {
                    this.startReconnectDelay();
                }
            },
            onMessage: function (message) {
                var recievedData, cmd;
                try {
                    recievedData = JSON.parse(message.data);
                } catch (e) {
                    Gis.Logger.log('incorrect json', message.data, e);
                    return;
                }
                cmd = new Gis.Commands[recievedData.command](G.Util.extend({gis: this.options.gis, connection: this, fromServer: true}, recievedData));
                Gis.requestAnimationFrame(50)(function () {
                    try {
                        cmd.execute();
                    } catch (err) {
                        G.Logger.log('Error execute cmd.', message.data, err.stack);
                    }
                });
            }
        }
    );

}(Gis));