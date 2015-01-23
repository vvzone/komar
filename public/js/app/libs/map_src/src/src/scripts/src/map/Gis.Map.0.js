(function () {
    "use strict";
    var REMOVE_OPERATION = 'remove',
        ADD_OPERATION = 'add',
        cacheOperations = {};
    cacheOperations[REMOVE_OPERATION] = {};
    cacheOperations[ADD_OPERATION] = {};
    /**
     * @typedef {Object} Gis.Map.MapListElement
     * @property {string} key - ключ, по нему можно установить активную карты [смотри setMapType]{@link Gis.Map#setMapType}
     * @property {string} title - Описательное имя карты
     */
/**
 * @class
 * @classdesc Главный класс карты
 * @param {string} id - DOMid контейнера
 * @param {Object} options
 * @param {number[]|Gis.LatLng} [options.latlng=new Gis.LatLng(51.505, -0.09)] центр карты (не сработает, если пользователь уже открывал карту. тогда центр сохранен в сессии)
 * @param {Object|Gis.Settings} [options.settings=new Gis.Settings({})] настройки
 * @param {number} [options.maxZoom] Слои могут устанавливть свои ограничения. они всегда выше
 * @param {number} [options.minZoom] Слои могут устанавливть свои ограничения. они всегда выше
 * @param {number} [options.zoom=3]
 * @param {Gis.Maps.Base} [options.provider=new Gis.Maps.Leaflet.LeafletProvider()] пока больше провайдеров нет
 * @extends Gis.BaseClass
 * @example Полностью активный интерфейс пользователя
 * var gisMap = Gis.map("map", {
 *      latlng: [51.505, -0.09],
 *      settings: {
 *        "ui": Gis.UI.USERSET.FULL,
 *        "maps": [
 *          "osm",
 *          "googleSat",
 *          "googleHyb",
 *          "google",
 *          "yandexSat",
 *          "yandexHyb",
 *          "yandex"
 *        ]
 *      }
 *  }).show();
 * @example убрать горизонтальную и вертикальную прокрутки
 * var gisMap = Gis.map("map", {
 *      latlng: [51.505, -0.09],
 *      settings: {
 *        "ui": Gis.UI.uiUsersetExclude(Gis.UI.USERSET.FULL, ["slidervertical", "sliderhorisontal"]),
 *        "maps": [
 *          "osm",
 *          "googleSat",
 *          "googleHyb",
 *          "google",
 *          "yandexSat",
 *          "yandexHyb",
 *          "yandex"
 *        ]
 *      }
 *  }).show();
 * @example Только просмотр и измерения
 * var gisMap = Gis.map("map", {
 *      latlng: [51.505, -0.09],
 *      settings: {
 *        "ui": Gis.UI.USERSET.VIEW_ONLY,
 *        "maps": [
 *          "osm",
 *          "googleSat",
 *          "googleHyb",
 *          "google",
 *          "yandexSat",
 *          "yandexHyb",
 *          "yandex"
 *        ]
 *      }
 *  }).show();
 * @example без GUI
 * var gisMap = Gis.map("map", {
 *      latlng: [51.505, -0.09],
 *      settings: {
 *        "ui": Gis.UI.USERSET.NONE,
 *        "maps": [
 *          "osm",
 *          "googleSat",
 *          "googleHyb",
 *          "google",
 *          "yandexSat",
 *          "yandexHyb",
 *          "yandex"
 *        ]
 *      }
 *  }).show();
 * @example Перед созданием карты можно указать следующие настройки
 * Базовый градиент тепловой карты
 *      Gis.setConfig('heatmap.color',[{percent: 0, color: new RGBColor("black")}, {percent: 1, color: new RGBColor("white")}]);
 *
 * Градиенты тепловой карты, доступные для выбора в виджете
 * Gis.setConfig('heatmap.colors', [
 *      [{percent: 0, color: new RGBColor("black")}, {percent: 1, color: new RGBColor("white")}],
 *      [{percent: 0, color: new RGBColor("rgb(9,63,235)")}, {percent: 1, color: new RGBColor("rgb(8, 10, 0)")}],
 *      [{percent: 0, color: new RGBColor("rgb(181,194,32)")}, {percent: 1, color: new RGBColor("rgb(255, 2, 2)")}],
 *      [{percent: 0, color: new RGBColor("rgb(0,10,252)")}, {percent: 0.5, color: new RGBColor("rgb(34, 34, 32)")}, {percent: 1, color: new RGBColor("rgb(164, 170, 19)")}]
 *]);
 *
 * Порт соединения с тактическим сервером
 * Gis.setConfig('connection.port', 9797);
 * Хост тактического сервера
 * Gis.setConfig('connection.host', '192.168.1.104');
 * Порт соединения с тактическим сервером посредством comet
 * Gis.setConfig('connection.portSecond', 8080);
 * Таймаут переподключения (милисекунды)
 * Gis.setConfig('connection.reconnectDelay', 5000);
 *
 * Автоматически генерировать идентификаторы объектов, если не указаны. в противном случае будет бросаться исключение
 * window.GIS_GENERATE_GUID = true;
 *
 * @example
 * //Настройки прогрессбаров
 * Gis.setConfig(L.TileWithLoader.CONFIG_KEY, L.TileWithLoader.FULL_LOADER); //Прогрессбары на тайлах и в правом верхнем углу
 * Gis.setConfig(L.TileWithLoader.CONFIG_KEY, L.TileWithLoader.TILE_LOADER); //Прогрессбары на тайлах
 * Gis.setConfig(L.TileWithLoader.CONFIG_KEY, L.TileWithLoader.CORNER_LOADER); //Прогрессбар в углу
 * Gis.setConfig(L.TileWithLoader.CONFIG_KEY, L.TileWithLoader.NO_LOADER); //Без програссбаров
 * @version 0.9
 */
    Gis.Map = Gis.BaseClass.extend(
        /** @lends Gis.Map# */
        {
            includes: Gis.StyleContainerBehavior,
            _projection: Gis.Config.defaultProjection,
            _mapZoomKey: "MAP_ZOOM",
            _mapLatLngKey: "MAP_LAT_LNG",
            _mapKey: "MAP",
            options: {
                latlng: [51.505, -0.09],
                zoom: 3,
                maxZoom: null,
                minZoom: null,
                maps: null,
                provider: null,
                projection: null
            },
            _getInitLatLng: function () {
                return Gis.Preferences.getPreferenceData(this._mapLatLngKey) || this.options.latlng;
            },
            _getInitZoom: function () {
                return Gis.Preferences.getPreferenceData(this._mapZoomKey) || this.options.zoom;
            },
            _getInitSelectedMapKey: function () {
                return Gis.Preferences.getPreferenceData(this._mapKey);
            },
            /**
             * @fires providerloaded
             * @private
             */
            _initProvider: function () {
                this.options.provider.setData({
                    container: this._id,
                    latlng: this._getInitLatLng(),
                    zoom: this._getInitZoom(),
                    maxZoom: this.options.maxZoom,
                    minZoom: this.options.minZoom,
                    projection: this.options.projection
                });
                this.fire('providerloaded', {target: this, provider: this.options.provider});
            },
            /**
             * Вызывает [метод getSetting]{@link Gis.Settings#getSetting} объекта {@link Gis.Settings}.
             * @param {string} key
             * @returns {*}
             */
            getSetting: function (key) {
                return this._settings.getSetting(key);
            },
            /**
             * Сохранить в сессию текущую выбранную карту
             * @private
             */
            _saveInitMap: function () {
                Gis.Preferences.setPreferenceData(this._mapKey, this.getSelectedMapKey());
            },
            _saveMapPosition: function () {
                Gis.Preferences.setPreferenceData(this._mapZoomKey, this.getZoom());
                Gis.Preferences.setPreferenceData(this._mapLatLngKey, this.getCenter());
            },
            /**
             * Сохранить текущее состояние карты
             */
            saveMapState: function () {
                this._saveMapPosition();
                this._saveInitMap();
            },
            /**
             * Метод вызывается автоматически!!!!
             * @private
             * @param {String} id - DOMid контейнера
             * @param {IF.GIS_MAP_DATA} data - данные карты
             * */
            initialize: function (id, data) {
                Gis.Map.CURRENT_MAP = this;
                Gis.ProgressBarController.init();
                var settings = data && data.settings, styles = settings && settings.styles, self = this;
                this._settings = Gis.settings(settings);
                delete data.settings;
                this._settings.on(Gis.Map.MAP_LIST_CHANGED.TYPE, function () {
                    this.fire(Gis.Map.MAP_LIST_CHANGED.TYPE, new Gis.Map.MAP_LIST_CHANGED(this.getMapList()));
                }, this);
                this._settings.on(Gis.Map.TIME_MAP_DATA_CHANGED.TYPE, function (e) {
                    this.fire(Gis.Map.TIME_MAP_DATA_CHANGED.TYPE, e);
                    if (e.map === this.getSelectedMapKey()) {
                        this.setMapType(this.getSelectedMapKey());
                    }
                }, this);
                if (data.layer) {
                    this._settings.addToMaps(data.layer);
                }
                this._onunload = function () {
                    self.saveMapState();
                };
                Gis.BaseClass.prototype.initialize.call(this, data);
                this.initStyleContainer();
                this.options.provider = this.options.provider || new Gis.Maps.Leaflet.LeafletProvider();
                /**
                 *
                 * @type {Gis.ObjectController}
                 */
                this.renderer = Gis.Maps.renderer({map: this.options.provider});
                this.renderer.on('layerunselected layerselected layerchanged', this._layerEvent, this);
                this._id = id;
                this._initProvider();
                this._initEvents();
                //Загрузить данные TMS
                this.loadTileMapsData();
                this.putStyle(styles);
            },
            /**
             * Возвращает текущий объект, отвечающий за хранение и своевременное рисование объектов
             * @returns {Gis.ObjectController}
             */
            getRenderer: function () {
                return this.renderer;
            },
            /**
             *
             * @param e
             * @private
             */
            _closed: function (e) {
                this.fire('closed', e);
            },
            /**
             *
             * @param e
             * @private
             */
            _defaultProviderEvent: function (e) {
                this.fire(e.type, e);
            },
            /**
             * @private
             */
            _closeProviderEvents: function () {
                this.options.provider.off('closed', this._closed, this);
                this.options.provider.off('click', this._defaultProviderEvent, this);
                this.options.provider.off('maxboundschanged', this._defaultProviderEvent, this);
                this.options.provider.off('mousemove', this._defaultProviderEvent, this);
                this.options.provider.off('mousedown', this._defaultProviderEvent, this);
                this.options.provider.off('mouseup', this._defaultProviderEvent, this);
                this.options.provider.off('mouseout', this._defaultProviderEvent, this);
                this.options.provider.off('projectionchanged', this._defaultProviderEvent, this);
            },
            activateProvierEvents: function () {
                this.options.provider.on('closed', this._closed, this);
                this.options.provider.on('click', this._defaultProviderEvent, this);
                this.options.provider.on('maxboundschanged', this._defaultProviderEvent, this);
                this.options.provider.on('mousemove', this._defaultProviderEvent, this);
                this.options.provider.on('mousedown', this._defaultProviderEvent, this);
                this.options.provider.on('mouseup', this._defaultProviderEvent, this);
                this.options.provider.on('mouseout', this._defaultProviderEvent, this);
                this.options.provider.on('projectionchanged', this._defaultProviderEvent, this);
                this.off('providerloaded', this.activateProvierEvents, this);
            },
            /**
             *
             * @private
             */
            _initEvents: function () {
                if (this.options.provider) {
                    this.activateProvierEvents();
                } else {
                    this.on('providerloaded', this.activateProvierEvents, this);
                }
                window.onunload = this._onunload;
                return this;
            },
            /**
             *
             * @param e
             * @private
             */
            _layerEvent: function (e) {
                this.fire(e.type, e);
            },
            /**
             * Получить текущие границы объекта // Доступно не для всех объектов,
             * вместо этого метода лучше использовать @link Gis.Objects.Base.getCurrentLatLngBounds
             * @param object
             * @returns {Gis.LatLngBounds | undefined}
             */
            getObjectBounds: function (object) {
                return this.options.provider.getObjectBounds(object);
            },
            /**
             * Возвращает контейнер карты
             * @returns {HTMLElement}
             */
            getMapContainer: function () {
                return this.options.provider.getContainer();
            },
            /**
             *
             * @param {Gis.CustomSRS} crs
             * @returns {*}
             */
            setCrs: function (crs) {
                this.options.provider.setProjection(crs.getCode(), crs.getProj4def(), crs.getProjectedBounds(), crs.getOptions());
                return this;
            },
            _recoverMap: function () {
                this.setMapType(this._getInitSelectedMapKey(), false, true);
            },
            /**
             * Вызывается после загрузки данных по слою, если данные предварительно не были загружены
             * @param e
             */
            mapLoaded: function (e) {
                if (e.type === 'partialloaded') {
                    if (e.map.getType() === 'local') {
                        this._settings.setMap(e.map.getKey(), e.map);
                    }
                    if (this._mapShowed) {
                        if (e.map.getKey() === this._getInitSelectedMapKey()) {
                            if (!this.options.layer.getAdditionalLayers()) {
                                e.target.off('load partialloaded', this.mapLoaded, this);
                            }
                            this._recoverMap();
                            this.setZoom(this._getInitZoom());
                            this.setCenter(this._getInitLatLng());
                        } else {
                            if (this.options.layer) {
                                var additionalLayerInfo = this.options.layer.getAdditionalLayerInfo(e.map);
                                if (additionalLayerInfo) {
                                    this.addMapLayer(e.map, additionalLayerInfo);
                                }
                            }
                        }
                    }
                }
            },
            setZoomAround: function (center, zoom) {
                this.options.provider.setZoomAround(center, zoom);
                return this;
            },
            setMaxBounds: function (bounds) {
                this.options.provider.setMaxBounds(bounds);
                return this;
            },
            _isLayerTMS: function (evt) {
                evt.target.off('istms');
                if (evt.tms) {
                    this.setMapType(evt.tms ? evt.target : Gis.tmsLayer({url: evt.target.getURL()}));
                } else {
                    this.loadFromCache(evt.target.getURL());
                }
            },
            /**
             * Установить активную карт-основу по ключу
             * @param {string} key google, osm, [tms]|[tmskey]
             * @deprecated
             */
            setActiveTileLayer: function (key) {
                var varLayer = this.getTileLayerByKey(key);
                if (varLayer) {
                    if (varLayer.crs && !varLayer.tile) {
                        this.setCrs(varLayer.crs);
                    }
                    if (varLayer.tile) {
                        this.setMapType(varLayer.tile);
                    }
                }
            },
            getTileLayerByKey: function (key) {
                var keys = Gis.TileMapService.decodeKey(key), varLayer = keys && this._settings.getMap(keys[0]),
                    tile,
                    crs;
                if (varLayer) {
                    if (keys[1] && varLayer.getTileServer) {
                        tile = varLayer.getTileServer(keys[1]);
                        crs = varLayer.getCrs(keys[1]);
                    } else if (!varLayer.getTileServer) {
                        tile = varLayer;
                        crs = varLayer.getCrs();
                    }
                    return tile && crs && {tile: tile, crs: crs};
                }
            },
            /**
             * загрузка данных по картам
             */
            loadTileMapsData: function () {
                var maps = this._settings.getMaps(), idx;
                if (maps) {
                    for (idx in maps) {
                        if (maps.hasOwnProperty(idx)) {
                            this._loadLayer(idx, maps[idx]);
                        }
                    }
                }
                return this;
            },
            _loadLayer: function (key, type) {
                var objectType, layer, settings = this._settings;
                switch (typeof type) {
                case 'string':
                    //Предопределенный тип
                    if (Gis.TmsLayer[type]) {
                        settings.setMap(key, Gis.TmsLayer[type]());
                        //TMS слой
                    } else if (!Gis.TmsLayer._isTemplate(type)) {
                        layer = new Gis.TileMapService({url: type});
                        settings.setMap(key, layer);
                        layer.on('load partialloaded', this.mapLoaded, this);
                        layer.on('istms', this._isLayerTMS, this);
                        layer.checkIfTMS();
                        //URL является шаблоном
                    } else {
                        objectType = new Gis.LocalCache(type);
                        settings.setMap(key, objectType);
                    }
                    break;
                case 'object':
                    settings.setMap(key, type);
                    if (type.getType && type.getType() === 'tilemapservice') {
                        type.load();
                    }
                    break;
                }
                return this;
            },
            /**
             * Возвращает ключ текущего выбранного слоя карты
             * @returns {string}
             */
            getSelectedMapKey: function () {
                return this._selectedMapKey;
            },
            /**
             * Возаращает текущий выбранный слой карты по ключу
             * @param key
             * @returns {*|Gis.Map}
             */
            getSelectedMap: function (key) {
                return this._settings.getMap(key);
            },
            /**
             *
             * @param {string|Gis.TmsLayer} layer
             * @returns {*}
             */
            addTileLayer: function (layer) {
                this._settings.addToMaps(layer);
                return this;
            },
            /**
             * Удаление объектов с карты. Выполняется локально, данные на сервер не отсылаются
             * @param {Function} [filter] функция фильтр
             * @param {Boolean} [hide=false] скрыть вместо удаления
             * @param {Array.<string>|string} [ids] список id для удаление
             */
            clearMap: function (filter, hide, ids) {
                var length, index, layer, toHide = [];
                ids = ids || this.getLayerIDs(true);
                if (ids) {
                    if (!Gis.Util.isArray(ids)) {
                        ids = [ids];
                    }
                    for (index = 0, length = ids.length; index < length; index += 1) {
                        try {
                            layer = this.getLayer(ids[index]);
                            if (layer && (!filter || filter(layer))) {
                                if (hide) {
                                    toHide.push(ids[index]);
                                } else {
                                    this.removeLayer(layer);
                                }
                            }
                        } catch (e) {
                            Gis.Logger.log("Ошибка удаления слоя - " + ids[index] + " (" + e.message + ")", e.stack);
                        }
                    }
                    if (toHide.length) {
                        this.hideLayersByID(toHide);
                        this.clearSelected();
                    }
                    this.renderer.draw();
                }
            },
            /**
             * Попытаемся восстановить корректный уровень зума
             * @private
             * @param {Number[] | Gis.LatLng} [center]
             * @returns {Gis.Map} this
             */
            _recoverPosition: function (center) {
                if (this._mapBounds) {
                    this.options.provider.setMapBounds(this._mapBounds);
                    this._mapBounds = null;
                } else {
                    this.setCenter(center);
                }
                return this;
            },
            /**
             *
             * @returns {Gis.Map} this
             * @private
             */
            _saveBounds: function () {
                this._mapBounds = this.options.provider.getMapBounds();
                return this;
            },
            loadFromCache: function (type) {
                var objectType = new Gis.LocalCache(type);

                objectType.on('load partialloaded', this.mapLoaded, this);
                objectType.load();
            },
            stopRefresh: function () {
                if (this._autoRefreshInterval) {
                    clearInterval(this._autoRefreshInterval);
                }
            },
            /**
             * Проверяем, нужно ли обновлять тайлы автоматически
             */
            checkAutoRefresh: function () {
                var map = this.getSelectedMap(this._selectedMapKey), self = this;
                this.stopRefresh();
                if (map && map.getType() === "tms" && map.isAutoRefresh() && map.parentTms) {
                    this._autoRefreshInterval = setInterval(function () {
                        map.parentTms.loadTileData(Gis.TileMapService.decodeKey(self._selectedMapKey)[1]);
                    }, Gis.Config.tileUpdateDelay * 1000);
                }
            },
            setAdditionalLayers: function (layer) {
                var i, layers = layer.getAdditionalLayers(), additionalLayer, layerOpts;
                if (layers) {
                    for (i = layers.length - 1; i >= 0; i -= 1) {
                        layerOpts = layers[i];
                        additionalLayer = this.getMap(layerOpts.key);
                        if (additionalLayer && layerOpts.checked) {
                            this.addMapLayer(additionalLayer, Gis.Util.extend({}, layerOpts));
                        }
                    }
                }
            }, /**
             * динамически меняет тип карты. передает тип провайдеру карт
             * если предопределенный тип, брать готовый класс, если URL является шаблоном, брать базовый класс с шаблонным URL
             * в противном случае попытаться загрузить данные TMS
             * @param {String|Gis.TmsLayer} type
             * @param {Boolean} [forceSave] сохранить в хранилище
             * @param {Boolean} [nooNeedRecover]
             * @returns {Gis.Map}
             * */
            setMapType: function (type, forceSave, nooNeedRecover) {
                if (!type) {
                    return this;
                }
                var objectType, layer, center = this.getCenter(), current = this.getActiveLayer();
                this.renderer.pause();
                try {
                    layer = this._settings.getMap(type);
                    switch (typeof type) {
                    case 'string':
                        //Предопределенный тип
                        if (Gis.TmsLayer[type]) {
                            objectType = layer || Gis.TmsLayer[type]();
                            //TMS слой
                        } else if (this.getTileLayerByKey(type)) {
                            layer = this.getTileLayerByKey(type);
                            if (!layer || !layer.tile) {
                                Gis.Logger.log("Не удалось установить карту " + type);
                                return this;
                            }
                            objectType = layer.tile;
                        } else if (!Gis.TmsLayer._isTemplate(type)) {
                            layer = layer || new Gis.TileMapService({url: type});
                            layer.on('istms', this._isLayerTMS, this);
                            layer.checkIfTMS();
                            return this;
                            //URL является шаблоном
                        } else {
                            this.loadFromCache(type);
                            return this;
                        }
                        break;
                    case 'object':
                        layer = layer || type;
                        if (layer.getType && (layer.getType() === 'tilemapservice' || layer.getType() === 'local') && layer._state !== 'loaded') {
                            layer.on('load partialloaded', this.mapLoaded, this);
                            layer.load();
                            return this;
                        }
                        objectType = layer;
                        break;
                    }
                    if (!nooNeedRecover) {
                        this._saveBounds();
                    }
                    if (this.getZoom() > objectType.getMaxZoom()) {
                        this.setZoom(objectType.getMaxZoom(), false);
                    } else if (this.getZoom() < objectType.getMinZoom()) {
                        this.setZoom(objectType.getMinZoom(), false);
                    }
                    this._selectedMapKey = objectType.getKey();
                    this.setCrs(objectType.getCrs());
                    this.options.provider.setMapType({layer: objectType});
                    if (!nooNeedRecover && current !== objectType.getKey()) {
                        this._recoverPosition(center);
                    }
                    this.options.layer = objectType;
                    this.renderer.draw();
                    this.fire('tilelayerchanged');
                    this.setAdditionalLayers(objectType);
                    if ((window.opera || forceSave) && !this._noNeedSaveMapState) {
                        this.saveMapState();
                    }
                    this.checkAutoRefresh();
                } finally {
                    this.renderer.resume();
                }
                return this;
            },
            /**
             * Добавить слой к текущему
             * @param {String|Gis.TmsLayer} type
             * @param options
             * @returns {Gis.Map}
             */
            addMapLayer: function (type, options) {
                if (!type) {
                    return this;
                }
                if (!this.options.layer) {
                    return this.setMapType(type);
                }
                var objectType, layer;
                layer = this._settings.getMap(type);
                switch (typeof type) {
                case 'string':
                    //Предопределенный тип
                    if (Gis.TmsLayer[type]) {
                        objectType = layer || Gis.TmsLayer[type]();
                    //TMS слой
                    } else if (this.getTileLayerByKey(type)) {
                        layer = this.getTileLayerByKey(type);
                        if (!layer || !layer.tile) {
                            Gis.Logger.log("Не удалось установить карту " + type);
                            return this;
                        }
                        objectType = layer.tile;
                    } else if (!Gis.TmsLayer._isTemplate(type)) {
                        layer = layer || new Gis.TileMapService({url: type});
                        layer.on('istms', this._isLayerTMS, this);
                        layer.checkIfTMS();
                        return this;
                    //URL является шаблоном
                    } else {
                        this.loadFromCache(type);
                        return this;
                    }
                    break;
                case 'object':
                    layer = layer || type;
                    if (layer.getType && (layer.getType() === 'tilemapservice' || layer.getType() === 'local') && layer._state !== 'loaded') {
                        layer.on('load partialloaded', this.mapLoaded, this);
                        layer.load();
                        return this;
                    }
                    objectType = layer;
                    break;
                }
                if (objectType.getCrs().getCode() === this.options.layer.getCrs().getCode()) {
                    this.options.provider.addMapTile({layer: objectType}, options);
                    this.fire('tilelayeradd');
                } else {
                    Gis.notify('Проекции не совпадают ' + objectType.getCrs().getCode() + " != " + this.options.layer.getCrs().getCode(), 'error');
                    Gis.Logger.log('Проекции не совпадают ' + objectType.getCrs().getCode() + " != " + this.options.layer.getCrs().getCode() + ", current = " + this.getSelectedMapKey() + ", new " + objectType.getKey());
                }
                return this;
            },
            /**
             * Возвращает ассоциативный массив
             * @param {Gis.TmsLayer} [layer] найти слои, которые можно отобразить отновременно с данным
             * @returns {Array.<Gis.Map.MapListElement>}
             * */
            getMapList: function (layer) {
                return this._settings.getMapList(layer);
            },
            /**
             * @param {string} key
             * @returns {Gis.TmsLayer | undefined}
             */
            getMap: function (key) {
                return this._settings.getMap(key);
            },
            /**
             * возвращает текущие границы видимой области
             * @returns {Gis.LatLngBounds}
             */
            getMapBounds: function () {
                return this.options.provider.getMapBounds();
            },
            /**
             * Добавляет новый слой на карту, либо модифицирует, если слой с таким id уже на карте
             * можно добавить так же слой с картосновой
             * @param {Gis.Objects.Base} layer
             * @param {boolean} [notFire] не уведомлять сервер
             * @param {boolean} [needShow] показать слой если скрыт
             * @returns {Gis.Map}
             */
            addLayer: function (layer, notFire, needShow) {
                var existsLayer;
                //noinspection JSUnresolvedVariable
                if (layer && layer.isMapLayer) {
                    //noinspection JSValidateTypes
                    this.setMapType(layer);
                    return this;
                }
                if (Gis.Util.isString(layer)) {
                    return this.addLayer(this.getLayer(layer), notFire, needShow);
                }
                if (this.renderer.isValidLayer(layer)) {
                    if (this._cache) {
                        if (cacheOperations[REMOVE_OPERATION][layer.getId()]) {
                            delete cacheOperations[REMOVE_OPERATION][layer.getId()];
                        }
                        cacheOperations[ADD_OPERATION][layer.getId()] = layer;
                        return this;
                    }
                    existsLayer = this.getLayer(layer.getId());
                    if (existsLayer) {
                        if (existsLayer.getType() === layer.getType()) {
                            if (needShow) {
                                this.showLayersByID(existsLayer.getId());
                            }
                            existsLayer.setData(layer.options, null, notFire);
                        } else {
                            throw new Error('Layer ' + layer.getId() + ' exists and type not equal');
                        }
                    } else if (layer.preAdd(this)) {
                        layer.onAdd(this);
                        this.renderer.addLayer(layer, notFire);
                        this.fire('layeradded', {target: layer});
                    } else if (layer.isCachedGis()) {
                        layer.pushToCache();
                    }
                }
                return this;
            },
            /**
             * Начать кешировать удаления/добавления объектов
             * после выполнения всех операций, обязательно вызвать flush();
             */
            startCache: function () {
                this._cache = true;
            },
            /**
             * Применить все операции удаления/добавления после startCache
             */
            flush: function () {
                var id, operations;
                this._cache = false;
                operations = cacheOperations[REMOVE_OPERATION];
                cacheOperations[REMOVE_OPERATION] = {};
                for (id in operations) {
                    if (operations.hasOwnProperty(id) && operations[id]) {
                        this.removeLayer(operations[id]);
                    }
                }
                operations = cacheOperations[ADD_OPERATION];
                cacheOperations[ADD_OPERATION] = {};
                for (id in  operations) {
                    if (operations.hasOwnProperty(id) && operations[id]) {
                        this.addLayer(operations[id]);
                    }
                }
            },
            /**
             * Удаляет слой с карты
             * @param {Gis.Objects.Base | Gis.Objects.Base[] | string[] | GUID[]} layer слой, массив слоев или массив ID
             * @returns {Gis.Map}
             */
            removeLayer: function (layer) {
                var self = this;
                if (Gis.Util.isArray(layer)) {
                    layer.forEach(function (value) {
                        if (typeof value === 'string') {
                            self.removeLayer(typeof value === 'string' ? self.getLayer(value) : value);
                        }
                    });
                } else if (this.renderer.isValidLayer(layer)) {
                    if (this._cache) {
                        cacheOperations[REMOVE_OPERATION][layer.getId()] = layer;
                        if (cacheOperations[ADD_OPERATION][layer.getId()]) {
                            delete cacheOperations[ADD_OPERATION][layer.getId()];
                        }
                        return this;
                    }
                    this.renderer.removeLayer(layer);

                    this.fire('layerremoved', {target: layer});
                } else if (Gis.Util.isString(layer)) {
                    self.removeLayer(self.getLayer(layer));
                }
                return this;
            },
            /**
             * проверяет добавлен ли слой на карту
             * @param {Gis.Objects.Base} layer
             * @returns {Boolean}
             */
            hasLayer: function (layer) {
                return this.renderer.layerExist(layer);
            },
            /**
             * Получает слой по GUID
             * @param {string} id
             * @returns {Gis.Objects.Base}
             */
            getLayer: function (id) {
                return this.renderer.getLayer(id);
            },
            /**
             * Возвращает текущий уровень зума
             * @returns {number}
             */
            getZoom: function () {
                return this.options.provider.getZoom();
            },
            /**
             * устанавливает текущий масштаб карты
             * @param {number | IF.Zoom} zoom
             * @returns {Gis.Map}
             * */
            setZoom: function (zoom, animate) {
                if (Gis.Util.isNumeric(zoom) && zoom >= this.options.provider.getMinZoom() && zoom <= this.options.provider.getMaxZoom()) {
                    this.options.provider.setZoom(zoom, animate);
                } else if (zoom.ids || zoom.latitudes || zoom.longitudes) {
                    this.setMapBounds(zoom);
                } else {
                    Gis.Logger.log('Unexpected zoom', 'zoom = ' + zoom);
                }
                return this;
            },
            /**
             * Возвращает максимально возможный уровень зума
             * @returns {number}
             */
            getMaxZoom: function () {
                return isFinite(this.options.provider.getMaxZoom()) ? this.options.provider.getMaxZoom() : 18;
            },
            /**
             * Возвращает минимально возможный уровень зума
             * @returns {number}
             */
            getMinZoom: function () {
                return this.options.provider.getMinZoom() || 0;
            },
            /**
             * Увеличивает уровень зума на 1
             * @returns {Gis.Map}
             */
            zoomIn: function () {
                this.options.provider.zoomIn();
                return this;
            },
            /**
             * Уменьшает уровень зума на 1
             * @returns {Gis.Map}
             */
            zoomOut: function () {
                this.options.provider.zoomOut();
                return this;
            },
            /**
             * Установка центра карты
             * @param {Gis.LatLng | number[]} center
             * @param {boolean} [noanim] анимировать перемещение карты
             * @returns {Gis.Map}
             */
            setCenter: function (center, noanim) {
                this.options.provider.setCenter(center, noanim);
                return this;
            },
            /**
             * Запрос центра карты
             * @returns {Gis.LatLng}
             */
            getCenter: function () {
                return this.options.provider.getCenter();
            },
            /**
             * Запрос максимально возможных границ карты
             * @returns {Gis.LatLngBounds}
             */
            getMaxBounds: function () {
                return this.options.provider.getMaxBounds();
            },
            /**
             * Запрос списка идентификаторов слоев
             * @param {boolean} [includeNotControllable] вернуть так же список идентификаторов, неподконтрольных серверу
             * @returns {GUID[]}
             */
            getLayerIDs: function (includeNotControllable) {
                return this.renderer.getLayerIDs(includeNotControllable);
            },
            /**
             * Запрос списка выделенных объектов
             * @returns {Object} map выделенных объектов где ключ - GUID, значение - Gis.Objects.Base
             */
            getSelected: function () {
                return this.renderer.getSelected();
            },
            getDefauldLayer: function () {
                return this.options.layer || (this._settings && this._settings.getMap(0));
            }, /**
             * текущий установленный слой картосновы
             * @returns {G.TmsLayer}
             */
            getActiveLayer: function () {
                var varLayer = this.getTileLayerByKey(this._getInitSelectedMapKey());
                return (varLayer && this._getInitSelectedMapKey()) || this.getDefauldLayer();
            }, /**
             * Показать карту
             * @returns {Gis.Map}
             */
            show: function () {
                this.options.provider.showMap();
                this._mapShowed = true;
                this._noNeedSaveMapState = true;
                this.setMapType(this.getActiveLayer(), false, true);
                this._noNeedSaveMapState = false;
                //TODO abstract events
                this.options.provider.on('zoomstart', function (e) {
                    this.fire('zoomstart', e);
                }, this);
                this.options.provider.on('zoomend', function (e) {
                    this.fire('zoomend', e);
                    //opera не вызывает onunload
                    if (window.opera) {
                        this.saveMapState();
                    } else {
                        this._saveMapPosition();
                    }
                }, this);
                this.options.provider.on('moveend', function (e) {
                    this.fire('moveend', e);
                    //opera не вызывает onunload
                    if (window.opera) {
                        this.saveMapState();
                    } else {
                        this._saveMapPosition();
                    }
                }, this);
                if (this.getSetting('ui') && !this.ui) {
                    this.ui = new Gis.UI(this, {
                        userSet: this.getSetting('ui')
                    });
                }
                this.options.provider.getContainerReal()._gis_map_ = this;
                this.switchGridVisibility(null);
                return this;
            },
            /**
             * устанавливает видимую область
             * @param {IF.Zoom | Gis.LatLngBounds} data - объект с данными о зуммировании
             * @returns {Gis.Map}
             * */
            setMapBounds: function (data) {
                if (data) {
                    var latLngBounds = data.getSouthWest ? data : this._getLatLngBoundsToFit(data);
                    if (latLngBounds.lat) {
                        this.setCenter(latLngBounds);
                        return this;
                    }
                    if (latLngBounds) {
                        this.options.provider.setMapBounds(latLngBounds);
                    }
                }
                return this;
            },
            /**
             *
             * @param {IF.Zoom} data - объект с данными о зуммировании
             * @private
             * @returns {Gis.LatLngBounds | Gis.LatLng}
             */
            _getLatLngBoundsToFit: function (data) {
                var zoomObjects, northWest, southEast, isNumeric = Gis.Util.isNumeric, countOfPoints, latlngs = [], provider = this.options.provider,
                    latitudes, longitudes, isArray, i, pixelBounds;
                if (data) {
                    zoomObjects = data.ids && this.renderer._getLatitudeBounds(data.ids instanceof Array ? data.ids : [data.ids]);
                    northWest = zoomObjects && zoomObjects.getNorthWest();
                    southEast = zoomObjects && zoomObjects.getSouthEast();
                    latitudes = data.latitudes;
                    longitudes = data.longitudes;
                    isArray = Gis.Util.isArray;
                    if (isArray(latitudes) && isArray(longitudes)) {
                        countOfPoints = Math.min(latitudes.length, longitudes.length);
                        for (i = 0; i < countOfPoints; i += 1) {
                            latlngs[i] = Gis.latLng(latitudes[i], longitudes[i]);
                        }
                        northWest = northWest || latlngs[0];
                        southEast = southEast || latlngs[1];
                    }
                    try {
                        northWest = L.latLng((northWest && isNumeric(northWest.lat) ? northWest.lat : null),
                            (northWest && isNumeric(northWest.lng) ? northWest.lng : null));
                    } catch (e) {
                        Gis.Logger.log('incorrect northWest for set zoom', undefined, e);
                        northWest = false;
                    }
                    try {
                        southEast = L.latLng((southEast && isNumeric(southEast.lat) ? southEast.lat : null), (southEast && southEast.lng));
                    } catch (er) {
                        Gis.Logger.log('incorrect southEast for set zoom', undefined, er);
                        southEast = false;
                    }
                    if (northWest && southEast) {
                        pixelBounds = Gis.bounds(provider.latLngToLayerPoint(northWest), provider.latLngToLayerPoint(southEast));
                        if (isArray(latlngs)) {
                            latlngs.forEach(function (val) {
                                pixelBounds.extend(provider.project(val));
                            });
                        }
                        return this._getClosestLatLngBounds(pixelBounds);
                    }
                    return northWest || southEast;
                }
                return null;
            },

            _getClosestLatLngBounds: function (pixelBounds) {
                var provider = this.options.provider,
                    bottomLeftPixel = pixelBounds.getBottomLeft(),
                    topRightPixel = pixelBounds.getTopRight(),
                    bottomLeftLatlng = provider.layerPointToLatLng(bottomLeftPixel),
                    bottomRightLatlng = provider.layerPointToLatLng([topRightPixel.x, bottomLeftPixel.y]),
                    topRightLatlng = provider.layerPointToLatLng(topRightPixel),
                    topLeftLatlng = provider.layerPointToLatLng([bottomLeftPixel.x, topRightPixel.y]),
                    topRightPoint = Gis.latLng(
                        Math.min(topRightLatlng.lat, topLeftLatlng.lat),
                        Math.min(topRightLatlng.lng, bottomRightLatlng.lng)
                    ),
                    bottomLeftPoint = Gis.latLng(
                        Math.max(bottomRightLatlng.lat, bottomLeftLatlng.lat),
                        Math.max(bottomLeftLatlng.lng, topLeftLatlng.lng)
                    );
                return Gis.latLngBounds(topRightPoint, bottomLeftPoint);
            },
            /**
             * Запросить поставщика услуг кат, по умолчанию Leaflet
             * @returns {Gis.Maps.Base}
             */
            getMapProvider: function () {
                return this.options.provider;
            },
            /**
             * Запрос текущей проекции
             * @returns {*}
             */
            getProjection: function () {
                return this.options.provider.getProjectionCode();
            },
            /**
             * Координаты в пиксели
             * @param {Gis.LatLng} latlng
             * @returns {Gis.Point}
             */
            latLngToLayerPoint: function (latlng) {
                return this.options.provider.latLngToLayerPoint(latlng);
            },
            /**
             * Выбранная сетка
             * @returns {Gis.Map.GRID_TYPES}
             */
            getSelectedGrid: function () {
                return this._grid_type;
            },
            _getMapOffset: function () {
                return (this._grid_type === Gis.Map.GRID_TYPES.KILOMETR || this._grid_type === Gis.Map.GRID_TYPES.GRAD) ? L.Grid.OFFSET : 0;
            },
            /**
             * Переключить видимость схемы
             * @fires Gis.Map.GridVisibilityChanged
             * @param {Gis.Map.GRID_TYPES} TYPE
             * @example
             * gisMap.switchGridVisibility(Gis.Map.GRID_TYPES.GRAD);
             */
            switchGridVisibility: function (TYPE) {
                var self = this, oldGrid = this._grid_type;
                if (TYPE && !window.Kinetic) {
                    Gis.Util.loadKinetic(function () {
                        self.switchGridVisibility(TYPE);
                    });
                    return;
                }
                if (this._grid_type) {
                    this.options.provider.map.removeLayer(this._current_grid);
                }
                if (TYPE && this._grid_type !== TYPE) {
                    this._grid_type = TYPE;
                    this._current_grid = (new Gis.Map._GRID_TYPES_[TYPE]());
                    this._current_grid.addTo(this.options.provider.map);
                } else {
                    this._grid_type = null;
                }
                this.options.provider.gridVisibility(this._getMapOffset());
                this.fire(Gis.Map.GridVisibilityChanged.TYPE, new Gis.Map.GridVisibilityChanged(oldGrid, this._grid_type));
            },
            /**
             *
             * @param {Gis.Point} point
             * @returns {Gis.LatLng}
             */
            layerPointToLatLng: function (point) {
                return this.options.provider.layerPointToLatLng(point);
            },
            /**
             * Разрешить таскать карту
             * @param {boolean} enabled
             * @returns {Gis.Map}
             */
            setDraggableEnabled: function (enabled) {
                this.options.provider.setDraggable(enabled);
                return this;
            },
            /**
             * Можно ли таскать карту
             * @returns {boolean}
             */
            isDraggableEnabled: function () {
                return this.options.provider.isDraggableEnabled();
            },
            /**
             * Снять выделение со слоя
             * @param layer
             * @returns {Gis.Map}
             */
            unselectLayer: function (layer) {
                this.renderer.removeFromSelected(layer);
                return this;
            },
            /**
             * Выделить слой (снимает выделение с других слоев)
             * @param {Gis.Objects.Base} layer
             * @returns {Gis.Map}
             */
            selectLayer: function (layer) {
                this.renderer.addSelected(layer);
                return this;
            },
            /**
             * Снять выделение со всех слоев
             * @returns {Gis.Map}
             */
            clearSelected: function () {
                this.renderer.clearSelected();
                return this;
            },
            /**
             * Получить список типов слоев доступных для выделения
             * @returns {string} Gis.ObjectController.FILTER_ALL || undefined если не фильтруется
             */
            getFilterSelect: function () {
                return this.renderer.getFilterSelect();
            },
            /**
             * Установить тип слоев, допустимых для выделения
             * @param {string} type тип
             * @param {boolean} noClear не очищать ранее выделенные слои
             * @returns {Gis.Map}
             */
            filterSelect: function (type, noClear) {
                this.renderer.filterSelect(type, noClear);
                return this;
            },
            /**
             * Доступен ли тип слоя для выделения
             * @param {string} type
             * @returns {Boolean}
             */
            isFilterable: function (type) {
                return this.renderer.isFilterable(type);
            },
            /**
             * Снимать ли выделение со слоя при клике по карте
             * @param {boolean} clear
             * @returns {Gis.Map}
             */
            clearSelectedOnClick: function (clear) {
                this.renderer.clearSelectedOnClick(clear);
                return this;
            },
            /**
             * Выполняется ли очистка выделения при клике по карте
             * @returns {boolean}
             */
            isClearOnClick: function () {
                return this.renderer.isClearOnClick();
            },

            /**
             * скрывает объекты по типу
             * @param {String} type если нужно запретить несколько типов перечислить через пробел
             * @returns {Gis.Map}
             * */
            hideLayersByType: function (type) {
                this.renderer.hideByType(type);
                return this;
            },

            /**
             * показывает ранее скрытые объекты по типу //если объект скрыт так же по ID он не будет отображен
             * @param {string} type если нужно запретить несколько типов перечислить через пробел
             * @returns {Gis.Map}
             * */
            showLayersByType: function (type) {
                this.renderer.showByType(type);
                return this;
            },
            /**
             * скрывает объекты по id, но не удаляет
             * @param {GUID | String[] | GUID[]} id если нужно запретить несколько id перечислить через пробел
             * @returns {Gis.Map}
             * */
            hideLayersByID: function (id) {
                this.renderer.hideByIDs(id);
                return this;
            },

            /**
             * показывает ранее скрытые объекты по id
             * @param {GUID} id если нужно запретить несколько id перечислить через пробел
             * @returns {Gis.Map}
             * */
            showLayersByID: function (id) {
                this.renderer.showByIDs(id);
                return this;
            },
            /**
             * Показывает мир целиком в доступной области
             * @returns {Gis.Map}
             * */
            fitWorld: function () {
                this.options.provider.fitWorld();
                return this;
            },
            /**
             * Добавить объекты
             * @param {*} objects строка JSON или массив объектов
             * @returns {Gis.Map}
             */
            fillObjects: function (objects) {
                if (Gis.Util.isDefine(objects)) {
                    try {
                        if (Gis.Util.isString(objects)) {
                            objects = JSON.parse(objects);
                        }
                        Gis.Util.fillMapFromObject(this, objects);
                    } catch (e) {
                        Gis.Logger.log("Ошибка разбора json", objects + "");
                    }
                }
                return this;
            }
        }
    );

    /**
     *
     * @param {string} id идентификатор DOM элемента
     * @param {IF.GIS_MAP_DATA} options
     * @returns {Gis.Map}
     */
    Gis.map = function (id, options) {
        return new Gis.Map(id, options);
    };
    /**
     * @class
     * @classdesc Событие смены видимости сетки
     * @event
     * @property {number} oldGrid
     * @property {number} newGrid
     * @property {string} type Gis.Map.GridVisibilityChanged.TYPE
     */
    Gis.Map.GridVisibilityChanged = function (oldGrid, newGrid) {
        this.oldGrid = oldGrid;
        this.newGrid = newGrid;
        this.type = Gis.Map.GridVisibilityChanged.TYPE;
    };
    Gis.Map.GridVisibilityChanged.TYPE = 'gridvisibilitychanged';
    /**
     * @class
     * @classdesc Событие изменения списка доступных карт
     * @event
     * @property {Array.<Gis.Map.MapListElement>} maps новый список карт
     * @property {string} type Gis.Map.MAP_LIST_CHANGED.TYPE
     */
    Gis.Map.MAP_LIST_CHANGED = function (maps) {
        this.maps = maps;
        this.type = Gis.Map.MAP_LIST_CHANGED.TYPE;
    };
    Gis.Map.MAP_LIST_CHANGED.TYPE = 'maplistchanged';
    /**
     * @class
     * @classdesc Событие изменения карты, которая уже есть в списке (если запросили новый список с сервера)
     * @event
     * @property {string} map Ключ изменившейся карты
     * @property {string} type Gis.Map.TIME_MAP_DATA_CHANGED.TYPE
     */
    Gis.Map.TIME_MAP_DATA_CHANGED = function (map) {
        this.map = map;
        this.type = Gis.Map.TIME_MAP_DATA_CHANGED.TYPE;
    };
    Gis.Map.TIME_MAP_DATA_CHANGED.TYPE = 'tilamapdatachanged';
    /**
     * Типы сеток
     * @readonly
     * @enum {number}
     */
    Gis.Map.GRID_TYPES = {
        /**
         * Километровая
         */
        KILOMETR: 1,
        /**
         * Номенклатурная
         */
        NOMENCLATE: 2,
        /**
         * Градусная
         */
        GRAD: 3
    };
    Gis.Map._GRID_TYPES_ = {};
    Gis.EventBus = new Gis.BaseClass();
}());