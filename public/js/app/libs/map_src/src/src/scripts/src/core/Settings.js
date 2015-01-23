"use strict";
/**
 * @description
 * Класс чтения настроек
 * @class
 * {Object} options
 * @param {number} [options.creator=null] количество всегда показываемых пеленгов
 * @param {string} [options.tacticMapServer=undefined] сколько времени показываеть пеленг
 * @param {string[]} [options.ui=undefined] массив элементов интерфейса пользователя
 * @param {string[]} [options.maps=undefined] доступные карты
 * @extends Gis.BaseClass
 */
Gis.Settings = Gis.BaseClass.extend(
    /** @lends Gis.Settings.prototype */
    {
        _maps: null,
        /**
         * @lends Gis.BaseClass#options
         * @property {number} [creator=null] количество всегда показываемых пеленгов
         * @property {number} [tacticMapServer=undefined] сколько времени показываеть пеленг
         */
        options: {
            creator: null,
            tacticMapServer: null
        },
        /**
         * @ignore
         */
        initialize: function (options) {
            this._maps = {};
            options = options || {};
            options.creator = options.creator || Gis.Util.generateGUID();
            var maps = this._maps;
            if (options.maps) {
                options.maps.forEach(function (map) {
                    switch (typeof map) {
                    case 'string':
                        maps[map] = map;
                        break;
                    case 'object':
                        maps[map.getURL()] = map;
                        break;
                    }
                });
                delete options.maps;
            }
            this.options = Gis.Util.extend({}, options);
//            Gis.BaseClass.prototype.initialize.call(this, options);
        },
        /**
         * Запросить настройки по ключу
         * вообще вызывать напрямую не нужно. вызывается из [Gis.Map.getSetting]{@link Gis.Map#getSetting}
         * @example
         * Запросить настройки пользовательсткого интерфейса
         * передаются при создании объекта карты "ui": Gis.UI.USERSET.FULL,
         * settings.getSetting('ui');
         * @param {string} key
         * @returns {*}
         */
        getSetting: function (key) {
            return this.options[key];
        },
        _sameCrsCode: function (currentMap, crsCode) {
            return (currentMap && currentMap.getCrs() && currentMap.getCrs().getCode()) === crsCode;
        },
        /**
         *  Возвращает список карт-основ, указанных при создании карты
         * @returns {Object.<string, Gis.TmsLayer>} ассоциативный массив. Ключом является key карты, значение {@link Gis.TmsLayer}
         */
        getMaps: function () {
            var maps = {}, key, currentMap;
            for (key in this._maps) {
                if (this._maps.hasOwnProperty(key)) {
                    currentMap = this._maps[key];
                    maps[key] = currentMap;
                }
            }
            return maps;
        },
        /**
         * Получить объект из доступных карт по ключу
         * @param {string} idx Ключ карты
         * @returns {Gis.TmsLayer | undefined}
         */
        getMap: function (idx) {
            var index = (typeof idx !== 'undefined' && (typeof idx === 'string' ? idx : (idx.getKey && idx.getKey()))) || idx, map;
            index = index != undefined ? index + '' : index;
            index = index && index.split('|');
            if (index && Gis.Util.isNumeric(index[0]) && !this._maps[index[0]]) {
                map = this._maps[Object.keys(this._maps)[idx]];
            } else {
                map = index && this._maps[index[0]];
            }
            if (index && index[1] && map && map.getType() === 'tilemapservice') {
                map = map.getTileServer(index[1]);
            }
            return map;
        },
        filterByCrs: function (parentLayer, currentLayer) {
            return !parentLayer || (parentLayer.getKey() !== currentLayer.getKey() && this._sameCrsCode(currentLayer, parentLayer.getCrs().getCode()));
        },
        /**
         * получить ассоциативный массив доступных для выбора карт
         * @param {Gis.TmsLayer} [layer] карта фильтр. вернуть карты совместимые с этой картой (одна проекция)
         * @return {Array.<Gis.Settings.MapData>}
         */
        getMapList: function (layer) {
            var maps = this.getMaps(), mapsAvail, idx, mapKeys = [], map, self = this,
                callbackInnerLayers = function (value, key) {
                    var key2 = map.getURL() + '|' + (value.key || value.title);
                    if (self.filterByCrs(layer, self.getMap(key2))) {
                        mapKeys.push({
                            key: key2,
                            title: value.title
                        });
                    }
                };
            for (idx in maps) {
                if (maps.hasOwnProperty(idx)) {
                    map = maps[idx];
                    if (map.getAvailableMaps && (mapsAvail = map.getAvailableMaps())) {
                        mapsAvail.forEach(callbackInnerLayers);
                    } else {
                        if (this.filterByCrs(layer, map)) {
                            mapKeys.push({
                                key: Gis.Util.isString(map) ? map : map.getKey(),
                                title: Gis.Util.isString(map) ? map : map.getTitle()
                            });
                        }
                    }
                }
            }
            return mapKeys;
        },
        /**
         * Добавить карту к списку известных к картам
         * @param {string|Gis.TmsLayer} map
         */
        addToMaps: function (map) {
            var idx = map && (typeof map === 'string' ? map : (map.getKey && map.getKey()));
            this.setMap(idx, map);
        },
        _tmsLoaded: function (e) {
            this.fire(Gis.Map.MAP_LIST_CHANGED.TYPE);
        },
        _tmsDataChanged: function (e) {
            this.fire(Gis.Map.TIME_MAP_DATA_CHANGED.TYPE, e);
        },
        /**
         * Установить карту, ассоциированую с ключом
         * @param {string} idx
         * @param {Gis.TmsLayer} map
         */
        setMap: function (idx, map) {
            if (this._maps[idx] && this._maps[idx].load) {
                this._maps[idx].off('load tilemapdataloaded mapremoved', this._tmsLoaded, this);
                this._maps[idx].off(Gis.Map.TIME_MAP_DATA_CHANGED.TYPE, this._tmsDataChanged, this);
            }
            this._maps[idx] = map;
            if (this._maps[idx].load) {
                this._maps[idx].on('load tilemapdataloaded mapremoved', this._tmsLoaded, this);
                this._maps[idx].on(Gis.Map.TIME_MAP_DATA_CHANGED.TYPE, this._tmsDataChanged, this);
            }
            this.fire('maplistchanged');
        },
        /**
         * Возвращает текущий сервер dataSource
         * @return {Array} где первый элемент - хост сервера, второй - порт, третий - порт для commet
         */
        getServer: function () {
            return (this.options.tacticMapServer && this.options.tacticMapServer.slice()) || (
                Gis.Config.connection.host && Gis.Config.connection.port && [
                    Gis.Config.connection.host,
                    Gis.Config.connection.port,
                    Gis.Config.connection.portSecond
                ]
            );
        }
    }
);
/**
 * Вспомогательный объект с данными о карте
 * @param {string} key Ключ карты
 * @param {string} title Заголовок карты
 * @class
 */
Gis.Settings.MapData = function (key, title) {
    /**
     * Ключ карты
     * @type {string}
     */
    this.key = key;
    /**
     * Заголовок карты
     * @type {string}
     */
    this.title = title;
};
Gis.settings = function (data) {
    if (data && data.getServer) {
        return data;
    }
    return new Gis.Settings(data);
};
