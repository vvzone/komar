(function (G) {
    "use strict";
    var SAVE_PREFIX = 'LAYER_STATE', KEY_ADDITIONAL = 'key_additional', KEY_CUSTOM = 'key_custom';
    /**
     * Слой панорамы
     * @typedef {Object} Gis.TmsLayer.CustomLayer
     * @property {number} index - порядковый номер от 0 до N-1 (номер бита в битовой маске слоев)
     * @property {string} name - отображаемое название слоя
     */
    /**
     @typedef {Object} Gis.TmsLayer.TmsDefaultData
     @property {string} [title]
     @property {string} type
     @property {string} [key]
     @property {string} url
     @property {string} [mapType=map] terrain, map, hybrid
     @property {number} [maxZoom]
     @property {number} [minZoom]
     @property {Gis.CustomSRS} [crs=Gis.customSRS('EPSG:3857')]
     @property {object} [dimension]
     @property {number} [dimension.x]
     @property {number} [dimension.y]
     @property {Array.<string>} types
     @property {Object} [mapData]
     @property {boolean} [autoRefresh=false]
     */
    /**
     * @example
     * Gis.setConfig('no-wrap-layer', true); //не повторять тайлы через 360 градусов
     * @classdesc базовый слой карты
     * @class
     * @param {Gis.TmsLayer.TmsDefaultData} options
     * @extends Gis.BaseClass
     */
    Gis.TmsLayer = G.BaseClass.extend(
        /**
         * @lends Gis.TmsLayer#
         */
        {
            isMapLayer: true,
            opacity: 1,
            options: {
                title: null,
                types: undefined,
                autoRefresh: undefined,
                type: undefined, //map type google, osm, yandex etc
                key: undefined, //map key if required
                url: undefined, //map url if required
                maxZoom: undefined, //map key if required
                minZoom: undefined, //map url if required
                crs: undefined,
                dimension: undefined,
                customLayers: undefined,
                mapType: 'map', //image type [terrain, map, hybrid],
                mapData: {}
            },
            getOpacity: function () {
                return this.opacity;
            },
            setOpacity: function (opacity) {
                this.opacity = opacity;
            },
            isLoaded: function () {
                return true;
            },
            isLocal: function () {
                var i, len;
                if (Gis.Util.isArray(this.options.url)) {
                    for (i = 0, len = this.options.url.length; i < len; i += 1) {
                        if (this._isUrlLocal(this.options.url[i])) {
                            return true;
                        }
                    }
                    return false;
                }
                return this._isUrlLocal(this.options.url);
            },
            isLocalServer: function () {
                return this.isLocal();
            },
            _isUrlLocal: function (url) {
                return url && (url.indexOf('localhost') >= 0 || url.indexOf('127.0.0.1') >= 0);
            },
            initialize: function (data) {
                if (!data.crs && !this.options.crs) {
                    data.crs = Gis.customSRS('EPSG:3857');
                }
                G.BaseClass.prototype.initialize.call(this, data);
                this.recover();
            },
            getOptions: function () {
                var options = G.Util.extend({}, this.options);
                delete options.url;
                return options;
            },
            getType: function () {
                return this.options.type;
            },
            getMapType: function () {
                return this.options.types[this.options.mapType];
            },
            getTitle: function () {
                return this.options.title || this.getKey();
            },
            getTitleWidth: function () {
                return (this.options.dimension && this.options.dimension.x) || 256;
            },
            getTitleHeight: function () {
                return (this.options.dimension && this.options.dimension.y) || 256;
            },
            getURL: function () {
                return this.options.url;
            },
            getKey: function () {
                return this.options.key || this.options.url;
            },
            getCrs: function () {
                return this.options.crs;
            },
            getMaxZoom: function () {
                return this.options.maxZoom;
            },
            getMinZoom: function () {
                return this.options.minZoom;
            },
            /**
             * Автоматически обновлять тайлы по прошествии @link Gis.Config.tileUpdateDelay
             * @returns {*}
             */
            isAutoRefresh: function () {
                return Gis.Util.isNumeric(this.options.autoRefresh);
            },
            /**
             * @return {string}
             * @private
             */
            _getSaveKey: function () {
                return SAVE_PREFIX + this.getKey();
            },
            /**
             * Сохранить состояние слоя в localStorage
             */
            save: function () {
                Gis.Preferences.setPreferenceData(this._getSaveKey() + KEY_ADDITIONAL, this._additionalLayers);
                Gis.Preferences.setPreferenceData(this._getSaveKey() + KEY_CUSTOM, this._customLayers);
            },
            /**
             * Восстановить состояние слоя из localStorage
             */
            recover: function () {
                this._additionalLayers = Gis.Preferences.getPreferenceData(this._getSaveKey() + KEY_ADDITIONAL);
                this._customLayers = Gis.Preferences.getPreferenceData(this._getSaveKey() + KEY_CUSTOM);
            },
            /**
             * Установить связянные слои
             * @param {Array} layers
             */
            setAdditionalLayers: function (layers) {
                this._additionalLayers = layers && layers.slice();
                this.save();
            },
            /**
             * Список связынных карт
             * @return {Array}
             */
            getAdditionalLayers: function () {
                return this._additionalLayers && this._additionalLayers.slice();
            },
            getAdditionalLayerInfo: function (layer) {
                var i = 0, len, key = Gis.Util.isString(layer) ? layer : layer.getKey ? layer.getKey() : layer.key;
                if (this._additionalLayers) {
                    for (len = this._additionalLayers.length; i < len; i += 1) {
                        if (this._additionalLayers[i].key === key) {
                            return Gis.Util.extend({}, this._additionalLayers[i]);
                        }
                    }
                }
            },
            /**
             * Слои панорамы
             * @returns {Array.<Gis.TmsLayer.CustomLayer>|undefined}
             */
            getCustomLayers: function () {
                return this.options.customLayers && this.options.customLayers.slice();
            },
            /**
             * Установить активные слои панорамы
             * @param {Array.<number>} layers индексы слоев
             */
            setActiveCustomLayers: function (layers) {
                if (Gis.Util.isArray(layers)) {
                    this._customLayers = layers.slice();
                } else {
                    this._customLayers = undefined;
                }
                this.save();
            },
            /**
             * Массив текущих слоев
             * @returns {Array.<number>|undefined}
             */
            getActiveCustomLayers: function () {
                return this._customLayers && this._customLayers.slice();
            },
            /**
             * Активизирован ли слой
             * @param {Gis.TmsLayer.CustomLayer|number} layer индекс слоя или слой
             * @returns boolean
             */
            isCustomLayerActive: function (layer) {
                if (!this._customLayers || !this._customLayers.length) {
                    return false;
                }
                var key, current, i, len;
                if (Gis.Util.isNumeric(layer)) {
                    key = layer;
                } else if (Gis.Util.isNumeric(layer.index)) {
                    key = layer.index;
                }
                if (Gis.Util.isDefine(key)) {
                    current = this._customLayers[key];
                    if (current === key) {
                        return true;
                    }
                    for (i = 0, len = this._customLayers.length; i < len; i += 1) {
                        current = this._customLayers[i];
                        if (current === key) {
                            return true;
                        }
                    }
                }
            },
            /**
             * Выбраны все слои панорамы
             * @returns {boolean}
             */
            isAllCustomLayersSelected: function () {
                if (!Gis.Util.isArray(this._customLayers)) {
                    return true;
                }
                var customLayers = this.options.customLayers;
                for (var i = 0, len = customLayers.length; i < len; i += 1) {
                    if (!this.isCustomLayerActive(customLayers[i].index)) {
                        return false;
                    }
                }
                return true;
            },
            /**
             * Маска тайла
             * @returns {string}
             */
            getActiveCustomLayersMask: function () {
                var i, len, result, bitSet;
                if (!this.isAllCustomLayersSelected()) {
                    bitSet = new BitSet(256);
                    for (i = 0, len = this._customLayers.length; i < len; i += 1) {
                        bitSet.set(this._customLayers[i], 1);
                    }
                    result = bitSet[0].toString(16);
                    return '0x' + result;
                }
                return '';
            }
        }
    );
    Gis.TmsLayer._isTemplate = function (url) {
        return /\{\w\}/g.test(url);
    };
    /**
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @returns {Gis.TmsLayer}
     */
    Gis.tmsLayer = function (data) {
        return new G.TmsLayer(data);
    };
}(Gis));