(function (G) {
    "use strict";
    var STATUS_CODE_ACCEPTED = 202,
        STATUS_CODE_SERVER_ERROR = 500;
    /**
     * @class
     * @classdesc long pool
     * @extends Gis.ConnectionBase
     */
    Gis.ConnectionComet = Gis.ConnectionBase.extend(
        /** @lends Gis.ConnectionComet# */
        {
            required: ['gis', 'domain', 'portSecond'],
            _messages: [],

            getPort: function () {
                return this.options.portSecond;
            },
            initialize: function (data) {
                G.BaseClass.prototype.initialize.call(this, data);
                var self = this;
                this._doSendConnect = this.sendConnect;
                this.sendConnect = function () {

                };
                this._onError = this._onError || function (error) {
                    if (error.statusText !== 'timeout' && error.statusText !== 'abort') {
                        self.onError(error);
                        self.startReconnectDelay();
                    }
                };
                function parseMessage(json) {
                    var response;
                    try {
                        if (json && (typeof json).toLowerCase() === 'string') {
                            response = json.replace(/\n|\r\n/g, '');
                            if (JSON.parse(response)) {
                                self.onMessage(response);
                            }
                        }
                    } catch (e) {
                        G.Logger.log('Не удается прочитать JSON', json, e.stack);
                    }
                }

                this.isAnswerOnConnect =  function () {
                    return self._sendedMessage && (JSON.parse(self._sendedMessage).command === Gis.Commands.connect.prototype.options.type);
                };

                this._onCompliteMessage = function (xhr) {
                    var statusCode = parseInt(xhr.status, 10), command;
                    self._sendConnection = undefined;
                    if (xhr.statusText.toLowerCase() === 'accepted' && statusCode === STATUS_CODE_ACCEPTED) {
                        command = self._sendedMessage && JSON.parse(self._sendedMessage);
                        self.fire('commandok', {command: command});
                        if (!self._listenConnection) {
                            if (!self._disconnect) {
                                self.setStatus(G.ConnectionBase.STATUS_CONNECTED);
                            }
                            self.startListen();
                        }
                        parseMessage(xhr.responseText);
                        self._sendedMessage = undefined;
                        if (self._messages.length) {
                            self.sendAjaxMessage();
                        }
                    } else {
                        if (statusCode !== STATUS_CODE_SERVER_ERROR) {
                            self._messages.unshift(self._sendedMessage);
                        }
                        self.startReconnectDelay();
                    }
                };

                this._onComplite = function (message) {
                    var statusCode = parseInt(message.status, 10);
                    if (statusCode === 200 || message.statusText === 'timeout' || message.statusText === 'abort') {
                        if (!self._disconnect) {
                            self.setStatus(G.ConnectionBase.STATUS_CONNECTED);
                        }
                        parseMessage(message.responseText);
                        self.startListen();
                    } else {
                        if (statusCode !== STATUS_CODE_SERVER_ERROR) {
                            self._messages.unshift(self._sendedMessage);
                        }
                        self.startReconnectDelay();
                    }
                };
            },
            /**
             *
             * @param [addId]
             * @returns {string}
             * @private
             */
            _generateUrl: function (addId) {
                return "http://" + this.options.domain + ":" + this.options.portSecond + (addId ? '/?id=' + G.ConnectionBase.GUID : '');
            },
            startListen: function () {
                if (!this._disconnect) {
                    this.stopInterval();
                    if (this._listenConnection) {
                        this._listenConnection.abort();
                    }
                    this._listenConnection = $.ajax({
                        url: this._generateUrl(false),
                        cache: false,
                        type: 'get',
                        dataType: 'json',
                        crossDomain: true,
                        timeout: 20000,
                        data: {id : G.ConnectionBase.GUID},
                        complete: this._onComplite
                    });
                }
            },
            disconnect: function () {
                this._disconnect = true;
                this.setStatus(G.ConnectionBase.STATUS_DISCONNECTED);
                if (this._listenConnection) {
                    this._listenConnection.abort();
                }
            },
            sendAjaxMessage: function (data, isFirstForce) {
                if (!this._disconnect) {
                    if (data) {
                        if (isFirstForce) {
                            this._messages.unshift(data);
                        } else {
                            this._messages.push(data);
                        }

                    }
                    if (this._sendConnection && this._sendConnection.readyState !== 4) {
                        return;
                    }
                    this._sendedMessage = this._messages.shift();
                    while (!this._sendedMessage && this._messages.length) {
                        this._sendedMessage = this._messages.shift();
                    }
                    if (this._sendedMessage) {
                        Gis.Logger.log("Message to " + this._generateUrl(), this._sendedMessage);
                        this._sendConnection = $.ajax({
                            url: this._generateUrl(true),
                            type: 'post',
                            dataType: 'text',
                            contentType: 'application/json',
                            crossDomain: true,
                            processData : false,
                            data: this._sendedMessage,
                            complete: this._onCompliteMessage
                        });
                    }
                }
            },
            stopInterval: function () {
                if (this._reconnectInterval) {
                    clearTimeout(this._reconnectInterval);
                    this._reconnectInterval = undefined;
                    this.fire('reconnectcleared');
                }
            },
            startReconnectDelay: function () {
                this._listenConnection = undefined;
                this.setStatus(G.ConnectionBase.STATUS_CONNECTING);
                var self = this;
                this.stopInterval();
                if (!this._disconnect) {
                    this._reconnectInterval = setTimeout(function () {
                        if (self.isAnswerOnConnect()) {
                            self.sendAjaxMessage();
                        } else {
                            self._doSendConnect();
                        }
                        G.Logger.log('Reconnect start');
                        self.fire('reconnectfired');
                    }, this.options.reconnectDelay || G.Config.connection.reconnectDelay);
                    G.Logger.log('Reconnect timeout start');
                    this.fire('reconnectdelaystarted');
                }
            },
            /**
             * start connection with the server
             * */
            connect: function () {
                this.setStatus(G.ConnectionBase.STATUS_CONNECTING);
                this._disconnect = false;
                var self = this;
                setTimeout(function () {
                    self._doSendConnect();
                }, 100);
            },
            sendMessage: function (jSon, isFirstForce) {
                this.sendAjaxMessage(jSon, isFirstForce);
            },
            onMessage: function (message) {
                var recievedData, cmd;
                try {
                    Gis.Logger.log('message from ' + this._generateUrl(false), message);
                    recievedData = JSON.parse(message);
                } catch (e) {
                    Gis.Logger.log('incorrect json', message, e);
                    return;
                }
                cmd = new Gis.Commands[recievedData.command](G.Util.extend({gis: this.options.gis, connection: this, fromServer: true}, recievedData));
                try {
                    cmd.execute();
                } catch (err) {
                    G.Logger.log('Error execute cmd.', message, err.stack);
                }
            },
            onOpen: function () {
                Gis.Logger.log("Connected to " + this._generateUrl());
            }
        }
    );

}(Gis));