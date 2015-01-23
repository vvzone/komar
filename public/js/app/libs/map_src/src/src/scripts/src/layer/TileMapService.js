(function () {
    'use strict';
    function getCustomLayers(map) {
        var customLayers = map.querySelectorAll('CustomLayer'), layers, i, len;
        if (customLayers && customLayers.length) {
            layers = [];
            for (i = 0, len = customLayers.length; i < len; i += 1) {
                layers.push({
                    index: parseInt(customLayers[i].getAttribute('index'), 10),
                    name: customLayers[i].getAttribute('name')
                });
            }
        }
        return layers;
    }
    /**
     * TMS слой
     * @class
     * @extends Gis.BaseClass
     */
    Gis.TileMapService = Gis.BaseClass.extend(
        /**
         * @lends Gis.TileMapService#
         */
        {
            _type: 'tilemapservice',
            _maps: null,
            _state: 'prepare', //prepare loading loaded error
            _mapCountToLoad: 0,
            _profileData: {
                'global-geodetic' : {
                    SRS: 'EPSG:4326',
                    origin: [-180, -90],
                    boundingBox: [-180, -90, 180, 90],
                    getUpp: function (zoom) {
                        return 0.703125 / Math.pow(2, zoom);
                    }
                },
                'global-mercator' : {
                    SRS: 'EPSG:41001',
                    origin: [-20037508.34, -20037508.34],
                    getUpp: function (zoom) {
                        return 78271.516 / Math.pow(2, zoom);
                    },
                    boundingBox: [-20037508.34, -20037508.34, 20037508.34, 20037508.34]
                },
                'none': {
                    getUpp: function () {
                        return null;
                    }
                },
                'local': {
                    getUpp: function (zoom) {
                        return Math.pow(2, zoom);
                    }
                }
            },
            _mapServicesToLoad: 0,/**
         * Допустимые опции
         * @type {object}
         * @property {string} url источник данных
         */
        options: {
            url: null
        },
            getProfileParam: function (profile, key) {
                return this._profileData[profile] && this._profileData[profile][key];
            },
            getType: function () {
                return this._type;
            },
            getURL: function () {
                return this.options.url;
            },
            getBaseUrl: function (suffix) {
                if (this.keyUrl && this.keyUrl[suffix]) {
                    return this.keyUrl[suffix];
                }
                var host = this.options.url.replace('root.xml', '/');
                if (host.lastIndexOf('/') < (host.length - 1)) {
                    host += '/';
                }
                if (suffix) {
                    host += suffix;
                }
                return host;
            },
            getKey: function () {
                return this.options.url;
            },
            getTitle: function () {
                return this.options.title || this.getKey();
            },
            isLocalServer: function () {
                return this.options.url.indexOf('localhost') >= 0 || this.options.url.indexOf('127.0.0.1') >= 0;
            },
            getMapIndex: function (key) {
                var i, len;
                if (this._maps.hasOwnProperty(key)) {
                    return key;
                }
                for (i = 0, len = this._maps.length; i < len; i += 1) {
                    var key2 = (this._maps[i].key != undefined) ? this._maps[i].key : this._maps[i].title;
                    if (key2 === key) {
                        return i;
                    }
                }
            },
            getCrs: function (map) {
                map = map || 0;
                map = this.getMapIndex(map);
                if (!Gis.Util.isNumeric(map)) {
                    return;
                }
                if (this._crs[map]) {
                    var data = this._crs[map].setData({
                        projectedBounds: this._maps[map].boundingBox
                    });
                    if (data) {
                        this._crs[map] = Gis.customSRS(this._maps[map].srs, Gis.ProjectionDatuums.getDatum(this._maps[map].srs), this._maps[map].boundingBox, {
                            origin: this._maps[map].origin,
                            resolutions: this._maps[map].resolutions
                        }, true);
                    }
                } else {
                    this._crs[map] = this._crs[map] || Gis.customSRS(this._maps[map].srs, Gis.ProjectionDatuums.getDatum(this._maps[map].srs), this._maps[map].boundingBox, {
                        origin: this._maps[map].origin,
                        resolutions: this._maps[map].resolutions
                    }, true);
                }
                return this._crs[map];
            },
            onError: function () {
                this._state = 'error';
            },
            initialize: function() {
                this.on('error', this.onError, this);
                Gis.BaseClass.prototype.initialize.apply(this, arguments);
            },
            load: function (url) {
                var self = this;
                this._tileServers = [];
                this._crs = [];
                this._maps = [];
                url = url || this.options.url;
                try {
                    $.ajax({
                        url: url,
                        dataType: 'xml',
                        crossDomain: Gis.config('tiles.loadDataOtherOrigin'),
                        success: function () {
                            self._isTms = true;
                            self._loadTileMapService(url);
                            self.fire('istms', {tms: true, target: self});
                        },
                        error: function () {
                            if (url.indexOf('root.xml') === -1) {
                                var newUrl = self.options.url;
                                if (newUrl.lastIndexOf('/') < newUrl.length - 1) {
                                    newUrl = newUrl + '/';
                                }
                                newUrl = newUrl + 'root.xml';
                                self.load(newUrl);
                            } else {
                                this._state = "error";
                                self._isTms = false;
                                self.fire('istms', {tms: false, target: self});
                            }
                        }
                    });
                } catch (e) {
                    Gis.Logger.log("Error", e.message, e.stack);
                }
            },
            checkIfTMS: function (url) {
                var self = this;
                if (self.hasOwnProperty('_isTms')) {
                    self.fire('istms', {tms: self._isTms, target: self});
                    return this;
                }
                this.load(url);
                return this;
            },
            _loadTileMapService: function (url) {
                url = url || this.options.url;
                this._state = 'loading';
                var self = this;
                if (!this.ajax) {
                    this.ajax = $.ajax({
                        url: url,
                        dataType: 'xml',
                        crossDomain: Gis.config('tiles.loadDataOtherOrigin'),
                        success: function (xml) {
                            Gis.Logger.log('TMS loaded', url);
                            self._parseTMS(xml);
                            self.fire('tmsloaded');
                        },
                        error: function (e) {
                            this._state = "error";
                            Gis.Logger.log('Can not load tms', url, e);
                            self.fire('error', {type: 'tmsloaderror'});
                        },
                        complete: function () {
                            self.ajax = null;
                        }
                    });
                }
            },
            setUrl: function (key, url) {
                if (!this.keyUrl) {
                    this.keyUrl = {};
                }
                this.keyUrl[key] = url;
            },
            parseTileMaps: function (xmlDoc) {
                var i, len, maps, attribute, href, splitted, pos;
                maps = xmlDoc.querySelectorAll('TileMap');
                this._mapCountToLoad = maps.length;
                for (i = 0, len = maps.length; i < len; i += 1 ) {
                    href = maps[i].getAttribute('href');
                    attribute = Gis.Util.lastTrim(href, "/");
                    splitted = attribute.split('/');
                    pos = splitted[splitted.length - 1] === 'map.xml' ? 1 : 0;
                    this.setUrl(splitted[splitted.length - pos - 1], href);
                    this._loadTileMapData(splitted[splitted.length - pos - 1], splitted.length > 1);
                }
            },
            _loadTileMaps: function (href) {
                var self = this;
                this.ajax = $.ajax({
                    url: href,
                    dataType: 'xml',
                    crossDomain: Gis.config('tiles.loadDataOtherOrigin'),
                    success: function (xml) {
                        self._mapServicesToLoad -= 1;
                        self.ajax = null;

                        Gis.Logger.log('TileMaps loaded', href);
                        self.parseTileMaps(xml);
                        self.fire('tilemapsloaded');
                    },
                    error: function (e) {
                        this._state = "error";
                        Gis.Logger.log('Can not load TileMaps', href, e);
                        self.fire('error', {type: 'tilemapserror'});

                        self._mapServicesToLoad -= 1;
                        self.ajax = null;
                    }
                });
            },
            loadTileData: function (key) {
                this._mapCountToLoad += 1;
                this._setLoading();
                this._loadTileMapData(key, true);
            },
            /**
             * Загрузить данные по карте
             * @param {String} key ключ карты (относительно базового URL)
             * @param {Boolean} byKey грузится ли карта по ключу, иначе key это полный URL
             * @param {Boolean} addMapXml добавить в конце /map.xml - аякс запросы плохо работают с редиректами сервера
             */
            _loadTileMapData: function (key, byKey, addMapXml) {
                var self = this, href = byKey ? this.getBaseUrl(key + (addMapXml ? '/map.xml' : "")) : key;
                this.ajax = $.ajax({
                    url: href,
                    dataType: 'xml',
                    crossDomain: Gis.config('tiles.loadDataOtherOrigin'),
                    success: function (xml) {
                        self._mapCountToLoad -= 1;
                        self.ajax = null;

                        Gis.Logger.log('TileMap data loaded', href);
                        self.parseTileMapData(xml, key);
                        self.fire('tilemapdataloaded', {map: Gis.TileMapService.encodeKey(self.options.url, key)});

                    },
                    error: function (e) {
                        Gis.Logger.log('Can not load TileMap data', href, e);
                        if (!addMapXml) {
                            self._loadTileMapData(key, byKey, true);
                            return;
                        }
                        self.fire('error', {type: 'tilemapdataerror'});

                        self._mapCountToLoad -= 1;
                        self.ajax = null;
                        self.checkIfLoaded();
                    }
                });
            },
            _parseTMS: function (xmlDoc) {
                var i, len, services;
                services = xmlDoc.querySelectorAll('TileMapService');
                this._mapServicesToLoad += services.length;
                for (i = 0, len = services.length; i < len; i +=1 ) {
                    this._loadTileMaps(services[i].getAttribute('href'));
                }
            },
            _setLoadedOk: function () {
                this._loaded = true;
                this._state = 'loaded';
            },
            _setLoading: function () {
                this._loaded = false;
                this._state = 'loading';
            },
            checkIfLoaded: function () {
                if (!this._mapServicesToLoad && !this._mapCountToLoad) {
                    Gis.Logger.log(this._maps.length ? 'Все данные TMS загружены' : 'Не удалось загрузить данные TMS', this.options.url);
                    this._setLoadedOk();
                    this.fire(this._maps.length ? 'load': 'error');
                }
            },
            isLoaded: function () {
                return this._loaded;
            },
            profileCorrect: function (profile) {
                return !!this._profileData[profile];
            },
            _getAwaitResolution: function (profile, order) {
                return this._profileData[profile] && this._profileData[profile].getUpp && this._profileData[profile].getUpp(order);
            },
            _checkUppForZoom: function (profile, resolution, order) {
                var awaitResolution = this._getAwaitResolution(profile, order);
                return !awaitResolution || Math.abs(awaitResolution - resolution) < 0.00000001;
            },
            getExists: function (key) {
                for (var i = 0, len = this._maps.length; i < len; i += 1) {
                    if (this._maps[i].key === key) {
                        return i;
                    }
                }
            },
            checkChanged: function (exists, mapData) {
                return this._tileServers[exists].setData(this.getMapData(exists))
            },
            parseTileMapData: function (xmlDoc, key) {
                var lastTrim, customLayers, map, tileSets, profile, boundingBox, origin, tileFormat, tileSet, i, len, resolutions = [], urls = [], order, maxZoom, minZoom, autoRefresh;
                function toF (val) {
                    return parseFloat(val);
                }
                map = xmlDoc.querySelector('TileMap');
                tileSets = xmlDoc.querySelector('TileSets');
                profile = tileSets.getAttribute('profile');
                if (profile && !this.profileCorrect(profile)) {
                    throw new Error('Некорректный профиль ' + profile);
                }
                boundingBox = map.querySelector('BoundingBox');
                origin = map.querySelector('Origin');
                autoRefresh = (map.getAttribute('dynamic') === "true") && (Gis.Config.tileUpdateDelay * 1000);
                tileFormat = map.querySelector('TileFormat');
                tileFormat = {
                    extension: tileFormat.getAttribute('extension'),
                    mimeType: tileFormat.getAttribute('mime-type'),
                    height: tileFormat.getAttribute('height'),
                    width: tileFormat.getAttribute('width')
                };
                tileSet = map.querySelectorAll('TileSet');
                maxZoom = 0;
                minZoom = +Infinity;
                lastTrim = Gis.Util.lastTrim;
                for (i = 0, len = tileSet.length; i < len; i += 1) {
                    order = tileSet[i].getAttribute('order');
                    resolutions[order] = toF(tileSet[i].getAttribute('units-per-pixel'));
                    if (!this._checkUppForZoom(profile, resolutions[order], order)) {
                        throw new Error('Некорректный upp профиля "' + profile + '" - "' + resolutions + '" для уровня зума ' + order);
                    }
                    maxZoom = Math.max(maxZoom, order);
                    minZoom = Math.min(minZoom, order);
                    urls[order] = lastTrim(tileSet[i].getAttribute('href'), "/") + "/" + '{x}/{y}' + ((tileFormat.extension && ('.' + tileFormat.extension)) || '');
                }
                var childNodesTitle = map.querySelector('Title').childNodes;
                var nodeSRS = map.querySelector('SRS');
                var mapData = {
                    key: key,
                    title: (childNodesTitle && childNodesTitle[0] && childNodesTitle[0].nodeValue) || key,
                    srs: this.getProfileParam(profile, 'SRS') || (nodeSRS && nodeSRS.childNodes && nodeSRS.childNodes[0] && nodeSRS.childNodes[0].nodeValue),
                    resolutions: resolutions,
                    urls: urls,
                    origin: (origin && [
                        toF(origin.getAttribute('x')),
                        toF(origin.getAttribute('y'))
                    ]) || this.getProfileParam(profile, 'origin'),
                    tileFormat: tileFormat,
                    maxZoom: maxZoom,
                    customLayers: getCustomLayers(map),
                    minZoom: minZoom,
                    profile: profile,
                    autoRefresh: autoRefresh,
                    boundingBox: (boundingBox && [
                        toF(boundingBox.getAttribute('minx')),
                        toF(boundingBox.getAttribute('miny')),
                        toF(boundingBox.getAttribute('maxx')),
                        toF(boundingBox.getAttribute('maxy'))
                    ]) || this.getProfileParam(profile, 'boundingBox')
                };
                var existsIndex = this.getExists(mapData.key);
                if (!Gis.Util.isDefine(existsIndex)) {
                    this._maps.push(mapData);
                    existsIndex = this._maps.length - 1;
                } else {
                    this._maps[existsIndex] = mapData;
                    if (this.checkChanged(existsIndex, mapData)) {
                        this.fire(Gis.Map.TIME_MAP_DATA_CHANGED.TYPE, new Gis.Map.TIME_MAP_DATA_CHANGED(Gis.TileMapService.encodeKey(this.options.url, key)));
                    }
                }
                this.fire('partialloaded', {map : this.getTileServer(existsIndex)});
                this.checkIfLoaded();
            },
            removeMap: function (pos) {
                pos = this.getMapIndex(pos || 0);
                this._tileServers.splice(pos, 1);
                var removed = this._maps.splice(pos, 1);
                this.fire('mapremoved');
            },
            getMapData: function (pos) {
                return {
                    type: 'tms',
                    key: this.getURL() + '|' + this._maps[pos].key,
                    url: this._maps[pos].urls,
                    crs: this.getCrs(pos),
                    maxZoom: this.getMaxZoom(pos),
                    minZoom: this.getMinZoom(pos),
                    title: this._maps[pos].title,
                    customLayers: this._maps[pos].customLayers,
                    dimension: Gis.point(this._maps[pos].tileFormat.width, this._maps[pos].tileFormat.height),
                    autoRefresh: this._maps[pos].autoRefresh
                };
            }, getCachedTileServer: function (pos) {
            this._tileServers[pos] = this._tileServers[pos] || Gis.tmsLayer(this.getMapData(pos));
            this._tileServers[pos].parentTms = this;
            return this._tileServers[pos];
        },
            getTileServer: function (pos) {
                pos = this.getMapIndex(pos || 0);
                if (this._maps[pos]) {
                    return this.getCachedTileServer(pos);
                }
            },
            getMaxZoom: function(pos) {
                pos = pos || 0;
                pos = this.getMapIndex(pos || 0);
                if (this._maps[pos]) {
                    return this._maps[pos].maxZoom;
                }
            },
            getAvailableMaps: function () {
                return this._maps;
            },
            getMinZoom: function(pos) {
                pos = pos || 0;
                pos = this.getMapIndex(pos || 0);
                if (this._maps[pos]) {
                    return this._maps[pos].minZoom || 0;
                }
            }
        }
    );
    /**
     * Разобрать ключ карты, сформированый [Gis.TileMapService.encodeKey]{@link Gis.TileMapService.encodeKey}
     * @param {string} key
     * @returns {Array.<string>}
     */
    Gis.TileMapService.decodeKey = function (key) {
        if (key && key + "" !== undefined + "") {
            return key.split('|');
        }
        return key;
    };
    /**
     * Сформировать ключ карты
     * @param {string} base
     * @param {string} [second]
     * @returns {string}
     */
    Gis.TileMapService.encodeKey = function (base, second) {
        if (second) {
            return base + '|' + second;
        }
        return base;
    };
}());