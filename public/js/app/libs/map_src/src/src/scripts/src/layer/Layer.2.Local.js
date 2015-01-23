(function (global) {
    'use strict';
    var defaultCrs = Gis.customSRS('EPSG:3857'),
        preferencesKey = "tilesaved";
    /**
     * @fires startloadconfig localcacheready loadconfig
     * @class
     * @extends Gis.TmsLayer
     */
    Gis.LocalCache = Gis.TmsLayer.extend(
        /**
         * @lends Gis.LocalCache#
         */
        {
            _ajaxRequest: null,
            _fileExt: null,
            _state: 'prepare', //prepare loading loaded error
            local: true,
            options: {
                title: null,
                type: 'local', //map type google, osm, yandex etc
                key: undefined, //map key if required
                url: undefined, //map url if required
                crs: undefined,
                mapType: 'map', //image type [terrain, map, hybrid],
                mapData: {}
            },
            initialize: function (url, options) {
                this._url = url;
                this.options.key = url;
                Gis.TmsLayer.prototype.initialize.call(this, Gis.Util.extend({url: url}, options));
            },
            isLocal: function () {
                return true;
            },
            _getConfigUrl: function () {
                return Gis.Util.lastTrim(this._url, "/") + '/' + Gis.config('tiles.cacheConfigFile', 'tmc_map_config.js');
            },
            getTitle: function () {
                return this.options.title || this._generateAutoTitle() || Gis.TmsLayer.prototype.getTitle.call(this);
            },
            /**
             * Главный метод, его вызываем для запуска всех проверок
             */
            load: function () {
                if (this._state === 'loading') {
                    return this;
                }
                var self = this;
                this.fire('startloadconfig');
                try {
                    requirejs([this._getConfigUrl()], function (data) {
                        self._key = self.options.key;
                        self.fire('loadconfig', {loaded: true, target: self});
                        self._load(data);
                    }, function () {
                        self._state = 'error';
                        self.fire('loadconfig', {loaded: false, target: self});
                        self._load();
                    });
                } catch (e) {
                    Gis.Logger.log("Error", e.message, e.stack);
                }
            },
            _generateAutoTitle: function () {
                var url = this._url, urlArray;
                if (!url) {
                    throw new Error("Некорректный url");
                }
                url.trim();
                url = Gis.Util.lastTrim(url, "/");
                urlArray = url.split("/");
                return urlArray[urlArray.length - 1];
            },
            _fillConfig: function (data) {
                var ImageType, SRS, Title;
                if (data) {
                    Title = data.Title || data.TITLE || data.title;
                    SRS = data.SRS || data.srs || data.Srs;
                    ImageType = data.ImageType || data.IMAGETYPE || data.imagetype || data.Imagetype || data.imageType;
                    this.options.title = Title ? Title : this._generateAutoTitle();
                    this.options.crs = SRS ? Gis.customSRS(SRS) : defaultCrs;
                    this._fileExt = ImageType ? ImageType : Gis.config("tiles.forceCacheExtension");
                } else {
                    this.options.title = this._generateAutoTitle();
                    this.options.crs = defaultCrs;
                    this._fileExt = Gis.config("tiles.forceCacheExtension");
                }
            },
            /**
             * Сгенерировать пути для лифлет
             * @private
             */
            _generateUrl: function () {
                var ext = this._fileExt || this._getSavedUrl() || "?", url;
                url = Gis.Util.lastTrim(this._url, "/") + "/z{z}/{y}/{x}." + ext;
                this.options.url = url;
            },
            _load: function (data) {
                if (Gis.Util.isDefine(data) || Gis.config('tiles.workWithoutCacheConfig')) {
                    this._isCache = true;
                    this._fillConfig(data);
                    this._generateUrl();
                    this._state = 'loaded';
                    this.fire("partialloaded", {map: this});
                    this.fire("load");
                } else {
                    this._isCache = false;
                    this._state = 'error';
                    this.fire("error");
                    throw new Error('Не удалось загрузить локальный кеш');
                }
            },
            /**
             * Готов ли локальный кешь передать мне данные для отрисовки
             * @returns {boolean}
             */
            isReady: function () {
                return this._state === 'loaded';
            },
            _localStorageKey: function () {
                return preferencesKey + '.' + this._url;
            },
            /**
             * МОжет расширение урл сохранен в локальном хранилище
             * @private
             * @returns {String | undefined}
             */
            _getSavedUrl: function () {
                return Gis.Preferences.getPreferenceData(this._localStorageKey());
            },
            /**
             * ура, мы знаем что это точно кешь, сохраняе мв локальное хранилище
             * @param {String} local тип файла для локального хранилища, можно передать "?" если пока не знаем расширение, но уже известно что это кешь
             */
            saveIsLocal: function (local) {
                Gis.Preferences.setPreferenceData(this._localStorageKey(), local);
            }
        }
    );
}(this));