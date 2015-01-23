(function (L) {
    'use strict';
    L.TileUpdater =  L.Class.extend({
        run: function () {
            var self = this;
            if (this.tileLayer.refreshTile) {
                this.timeout = setTimeout(function () {
                    Gis.requestAnimationFrame(0)(function () {
                        self._updateFunction();
                    });
                }, this.tileLayer.options.autoRefresh);
            }
        },
        stopAllRequests: function () {
            var obj;
            for (obj in this._processing) {
                if (this._processing.hasOwnProperty(obj)) {
                    if (this._processing[obj]) {
                        this._processing[obj].abort();
                        this._processing[obj] = undefined;
                    }
                }
            }
        },
        stop: function () {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.stopAllRequests();
            }
        },
        initialize: function (layer) {
            this.tileLayer = layer;
            this._processing = {};
            this.run();
        },
        checkLayerUpdate: function (index, currentTile) {
            var self = this, localProcessing;
            if (!self._processing[index] && this.tileLayer._isTileLoaded(currentTile)) {
                if (!currentTile.lastUpdate) {
                    currentTile.lastUpdate = new Date().toUTCString();
                }
                localProcessing = $.ajax({
                    url: currentTile.realSrc,
                    headers: {
                        "If-Modified-Since": currentTile.lastUpdate
                    },
                    statusCode: {
                        200: function () {
                            self.tileLayer.refreshTile(index);
                            currentTile.lastUpdate = new Date().toUTCString();
                        }
                    },
                    beforeSend: function () {
                        self._processing[index] = localProcessing;
                    },
                    complete: function () {
                        self._processing[index] = undefined;
                    }
                });
            }
        },
        _updateFunction: function () {
            var index, tiles = this.tileLayer._tiles, currentTile;
            for (index in tiles) {
                if (tiles.hasOwnProperty(index)) {
                    currentTile = tiles[index];
                    this.checkLayerUpdate(index, currentTile);
                }
            }
            if (this.timeout) {
                this.run();
            }
        }
    });
}(L));