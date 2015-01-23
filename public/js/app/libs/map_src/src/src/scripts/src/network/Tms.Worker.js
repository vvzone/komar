(function (G) {
    "use strict";
    var cmdList = {
        add: 'q=-ma' + encodeURIComponent(' ') + 'Path={{path}}' + encodeURIComponent(' ') + 'Title="{{title}}"',
        remove: 'q=-mr' + encodeURIComponent(' ') + '{{id}}',
        list: 'q=-ml'
    },
        mapTitleSended = [],
        preferencesKey = 'my_owned_maps',
        errorCodes = {
            0: false,
            1: 'неизвестная ошибка',
            2: 'сервис недоступен',
            100: 'ошибка в синтаксисе',
            101: 'неизвестный параметр',
            102: 'карта не найдена',
            103: 'неизвестный EPSG-код',
            104: 'карта не поддерживается, либо не указан MapType',
            105: 'карта уже существует',
            106: 'Path не передан',
            107: 'Title не передан',
            108: 'ID не передан',
            109: 'TileSize не является числом'
        };

    function getAdditionalGetParams(radioParams) {
        var result = '';
        for (var key in radioParams) {
            if (radioParams.hasOwnProperty(key)) {
                result += '&' + key + '=' + radioParams[key];
            }
        }
        return result;
    }

    /**
     * @lends Gis.Map#
     */
    Gis.TmsWorker = {
        options: {
            tmsConsolePort: 8109,
            tmsConsoleHost: 'localhost'
        },
        getCmd: function (cmdType, data) {
            var cmd = cmdList[cmdType], idx;
            if (cmd) {
                if (data) {
                    for (idx in data) {
                        if (data.hasOwnProperty(idx)) {
                            cmd = cmd.replace('{{' + idx + '}}', data[idx]);
                        }
                    }
                }
                return cmd;
            }
        },
        isLayerTileMapService: function (current) {
            return current.getType() === 'tilemapservice';
        },
        isLocalTms: function (current) {
            return current && current.isLocalServer() && this.isLayerTileMapService(current);
        },
        getLocalTMS: function () {
            var settings = this._settings, self = this, maps = settings.getMaps(), tmsList = [], current, id;
            for (id in maps) {
                if (maps.hasOwnProperty(id)) {
                    current = maps[id];
                    if (self.isLocalTms(current)) {
                        tmsList.push(current);
                    }
                }
            }
            return tmsList.length ? tmsList : null;
        },
        getFirstTMS: function () {
            var settings = this._settings, self = this, maps = settings.getMaps(), tmsList = [], current, id;
            for (id in maps) {
                if (maps.hasOwnProperty(id)) {
                    current = maps[id];
                    if (self.isLayerTileMapService(current)) {
                        return current;
                    }
                }
            }
            return null;
        },
        getSelectedTms: function () {
            var selectedMapKey = this.getSelectedMapKey(),
                decodedKey = Gis.TileMapService.decodeKey(selectedMapKey),
                map;
            if (decodedKey && decodedKey[0]) {
                map = this._settings.getMaps()[decodedKey[0]];
                if (map._isTms) {
                    return map;
                }
            }
        },
        /**
         *
         * @param title
         */
        rememberMyMap: function (title) {
            var maps = Gis.Preferences.getPreferenceData(preferencesKey) || [];
            if (maps.indexOf(title) < 0) {
                maps.push(title);
                Gis.Preferences.setPreferenceData(preferencesKey, maps);
            }
        },
        /**
         *
         * @param title
         */
        forgetMyMap: function (title) {
            var maps = Gis.Preferences.getPreferenceData(preferencesKey) || [], indexOf = maps.indexOf(title);
            if (indexOf < 0) {
                maps.splice(indexOf, 1);
                Gis.Preferences.setPreferenceData(preferencesKey, maps);
            }
        },
        /**
         * Запущен ли тмс сервер на нашей машинеы
         * @param key
         * @returns {boolean}
         */
        isMeOwnerOfTms: function (key) {
            var maps = Gis.Preferences.getPreferenceData(preferencesKey) || [];
            return (maps.indexOf(key) >= 0);
        },
        /**
         * Добавление карты на сервер
         * @param {Gis.TileMapService} tms
         * @param {object} dataToPush
         */
        pushTileToServer: function (tms, dataToPush) {
            var self = this;
            if (tms && dataToPush && dataToPush.path && dataToPush.title && this.isLocalTms(tms)) {
                $.ajax({
                    processData: false,
                    url: 'http://' + this.options.tmsConsoleHost + ':' + this.options.tmsConsolePort,
                    data: this.getCmd('add', Gis.Util.extend({}, dataToPush, {title: encodeURIComponent(dataToPush.title)})),
                    success: function (data, code, xhr) {
                        var message;
                        if (xhr.status === 200) {
                            message = data.length < 4 && errorCodes[data];
                            if (!message) {
                                self.getMapListFromTMS(tms);
//                                tms.loadTileData(dataToPush.title);
                                mapTitleSended.push(dataToPush.title);
                                Gis.Logger.log('Данные успешно отправлены на сервер на сервер', dataToPush);
                                return;
                            }
                        }
                        self.fire('tilesenderror', {tms: tms, data: dataToPush});
                        Gis.Logger.log(message || 'Не получено подтверждение от сервера', dataToPush);
                        Gis.notify(message || 'Не получено подтверждение от сервера', 'error');
                    },
                    error: function () {
                        self.fire('tilesenderror', {tms: tms, data: dataToPush});
                        Gis.Logger.log('Не удалось отправить карту на сервер', dataToPush);
                        Gis.notify('Не удалось активировать карту', 'error');
                    }
                });
                return;
            }
            self.fire('notcorrecttile', {tms: tms, data: dataToPush});
            Gis.Logger.log('Вы пытаетесь отправить некорректные данные', dataToPush);
            Gis.notify('Вы пытаетесь отправить некорректные данные', 'error');
        },
        /**
         * Запросить список карт
         * @param {Gis.TileMapService} tms
         * @param {object} dataToPush
         */
        getMapListFromTMS: function (tms, dataToPush) {
            var self = this;
            if (tms && this.isLocalTms(tms)) {
                $.ajax({
                    processData: false,
                    url: 'http://' + this.options.tmsConsoleHost + ':' + this.options.tmsConsolePort,
                    data: this.getCmd('list'),
                    success: function (data, code, xhr) {
                        var message;
                        if (xhr.status === 200) {
                            message = data.length < 3 && errorCodes[data];
                            if (!message) {
                                data = data.trim().split('\n');
                                if (data.length > 0) {
                                    data.forEach(function (value) {
                                        if (value !== "" && !self.getTileLayerByKey(Gis.TileMapService.encodeKey(tms.getURL(), value))) {
                                            tms.loadTileData(value);
                                        }
                                    });
                                }
                                return;
                            }
                        }
                        self.fire('tilelistloaderror', {tms: tms, data: dataToPush});
                        Gis.Logger.log(message || 'Не получено подтверждение от сервера', dataToPush);
                        Gis.notify(message || 'Не получено подтверждение от сервера', 'error');
                    },
                    error: function () {
                        self.fire('tilelistloaderror', {tms: tms, data: dataToPush});
                        Gis.Logger.log('Сервер не вернул список карт', dataToPush);
                        Gis.notify('Сервер не вернул обновленный список карт', 'error');
                    }
                });
                return;
            }
            self.fire('notcorrecttile', {tms: tms, data: dataToPush});
            Gis.Logger.log('Вы пытаетесь отправить некорректные данные', dataToPush);
            Gis.notify('Вы пытаетесь отправить некорректные данные', 'error');
        },
        getRestUrl: function () {
            var url = Gis.Util.lastTrim(this.getFirstTMS().getURL(), "/");
            if (Gis.config('REST.port')) {
                if (url.search(/:[\d]+/g) > -1) {
                    url = url.replace(/:[\d]+/g, ':' + Gis.config('REST.port'));
                } else {
                    url += ':' + Gis.config('REST.port');
                }
            }
            return url;
        }, /**
         * Запросить данные высот
         * @param {Gis.LatLng} latLng1
         * @param {Gis.LatLng} latLng2
         * @param {number} count
         * @param {Function} callback
         * @param {Function} errorCallback
         */
        getHeights: function (latLng1, latLng2, count, callback, errorCallback) {
            var url = this.getRestUrl();
            $.ajax({
                url: url +  '/relief/linear?lat=' + latLng1.lat + '&lon=' + latLng1.lng + '&lat2=' + latLng2.lat + '&lon2=' + latLng2.lng + '&coords=true&count=' + count,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    if (callback) {
                        callback(data);
                    }
                },
                error: function () {
                    Gis.notify('Не удалось запросить данные', 'error');
                    if (errorCallback) {
                        errorCallback();
                    }
                }
            });
        },/**
         * Запросить данные высот
         * @param {Gis.LatLngBounds} latlngBounts
         * @param {number} count
         * @param {Function} callback
         * @param {Function} errorCallback
         */
        getHeightsAreal: function (latlngBounts, count, callback, errorCallback) {
            var url = this.getRestUrl();
            $.ajax({
                url: url +  '/relief/areal?n=' + latlngBounts.getNorthEast().lat + '&e=' + latlngBounts.getNorthEast().lng + '&s=' + latlngBounts.getSouthWest().lat + '&w=' + latlngBounts.getSouthWest().lng + '&coords=true&count=' + count,
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    if (callback) {
                        callback(data);
                    }
                },
                error: function () {
                    Gis.notify('Не удалось запросить данные', 'error');
                    if (errorCallback) {
                        errorCallback();
                    }
                }
            });
        },
        /**
         * Запросить видимость
         * @param {Gis.LatLng} center
         * @param {number} radius  обязательный, радиус зоны, м (строится такая матрица, чтобы она описывала
         заданную зону);
         * @param {Function} callback
         * @param {Function} errorCallback
         * @param {number} [alt]  высота в центре области (высота наблюдателя), м; по умолчанию 0
         * @param {number} [altType] тип высоты (“absolute” или “relative”); по умолчанию относительная
         * @param {number} [arealAlt] высота над рельефом во всех расчетных точках, м; по умолчанию 0;
         * @param {number} [arealAltType] тип высоты (“absolute” или “relative”); по умолчанию относительная;
         * @param {number} [count]  количество точек по каждой оси, по умолчанию 100.
         */
        getVisibility: function (center, radius, callback, errorCallback, alt, arealAlt, altType, arealAltType, count, radioParams) {
            var url = this.getRestUrl();
            alt = alt || 0;
            arealAlt = arealAlt || 0;
            count = count || Gis.config('gis.region-of-sight.count') || 100;
            altType = altType || 'relative';
            arealAltType = arealAltType || 'relative';
            var method = radioParams ? 'radiovisibility' : 'region-of-sight';
            return $.ajax({
                url: url +  '/relief/' + method + '?lat=' + center.lat + '&lon=' + center.lng + '&radius=' + radius + '&alt=' + alt + '&alt-type=' + altType + '&areal-alt=' + arealAlt + '&areal-alt-type=' + arealAltType + '&count=' + count + getAdditionalGetParams(radioParams),
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    if (callback) {
                        callback(data);
                    }
                },
                error: function (xhr, type) {
                    if (type !== 'abort') {
                        Gis.notify('Не удалось запросить данные', 'error');
                        if (errorCallback) {
                            errorCallback();
                        }
                    }
                }
            });
        },
        getUrlTms: function () {
            return 'http://' + this.options.tmsConsoleHost + ':' + this.options.tmsConsolePort;
        },
        /**
         * Вызывается после загрузки данных по слою, если данные предварительно не были загружены
         * @param e
         */
        mapLoaded: function (e) {
            var self = this, indexOfMap, decodeKey, additionalLayerInfo;
            if (e.type ==='load') {
                if (mapTitleSended.length) {
                    mapTitleSended.forEach(function (value) {
                        Gis.notify('Команда активации карты ' + value + " отправлена серверу, но она отсутствует в списке карт. Попробуйте обновить страницу.", 'warn');
                        self.fire('tilesenderror', {tms: e.target, data: {path: value, title: value}});
                    });
                    mapTitleSended = [];
                }
            } else if (e.type === 'partialloaded') {
                if (e.map.getType() === 'local') {
                    this._settings.setMap(e.map.getKey(), e.map);
                }
                indexOfMap = mapTitleSended.indexOf(e.map.getTitle());
                if (indexOfMap > -1) {
                    decodeKey = Gis.TileMapService.decodeKey(e.map.getKey());
                    if (decodeKey && decodeKey.length && decodeKey.length > 1) {
                        this.rememberMyMap(decodeKey[1]);
                        mapTitleSended.splice(indexOfMap, 1);
                        this.fire('tilesendok', {tms: e.target, data: {path: decodeKey[1], title: e.map.getTitle()}});
                        Gis.notify('Карта ' + e.map.getTitle() + " успешно активирована.", 'success');
                    }
                }
                if (this._mapShowed && e.map.getKey() === this._getInitSelectedMapKey() && !this._recovered) {
                    this._recovered = true;
                    e.target.off('load partialloaded', this.mapLoaded, this);
                    this._recoverMap();
                    this.setZoom(this._getInitZoom());
                    this.setCenter(this._getInitLatLng());
                }
                if (this._mapShowed && this.options.layer) {
                    additionalLayerInfo = this.options.layer.getAdditionalLayerInfo(e.map);
                    if (additionalLayerInfo && additionalLayerInfo.checked) {
                        this.addMapLayer(e.map, additionalLayerInfo);
                    }
                }
            }
        },
        /**
         * Удаление карты
         * @param {Gis.TileMapService} tms
         * @param {string} mapId
         */
        removeMap: function (tms, mapId) {
            var self = this;
            if (tms && mapId && this.isLocalTms(tms)) {
                $.ajax({
                    processData: false,
                    url: this.getUrlTms(),
                    data: this.getCmd('remove', {id: encodeURIComponent(mapId)}),
                    success: function (data, code, xhr) {
                        var message;
                        if (xhr.status === 200) {
                            message = errorCodes[data];
                            if (!message) {
                                self.fire('tileremoveok', {tms: tms, data: mapId});
                                tms.removeMap(mapId);
                                if (self.getSelectedMapKey() === Gis.TileMapService.encodeKey(tms.getURL(), mapId)) {
                                    self.setMapType((self._settings && self._settings.getMap(0)));
                                }
                                Gis.Logger.log('Карта удалена', mapId);
                                Gis.notify('Карта удалена', 'success');
                                return;
                            }
                        }
                        self.fire('tilesenderror', {tms: tms, data: mapId});
                        Gis.Logger.log(message || 'Не получено подтверждение удаления карты от сервера', mapId);
                        Gis.notify(message || 'Не получено подтверждение удаления карты от сервера', 'warn');
                    },
                    error: function () {
                        self.fire('tileremoveerror', {tms: tms, data: mapId});
                        Gis.Logger.log('Не удалось удалить карту', mapId);
                        Gis.notify('Не удалось удалить карту', 'error');
                    }
                });
            }
        }
    };

    G.Map.include(G.TmsWorker);
}(Gis));