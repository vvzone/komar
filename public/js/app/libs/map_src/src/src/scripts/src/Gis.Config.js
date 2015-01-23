"use strict";
/**
 * Глобальные настройки
 * @namespace
 */
Gis.Config = {
    /**
     * @property
     * @default
     */
    deltaPixcel: 2,
    /**
     * @property
     * @default
     */
    needUserNotify: true,
    //CSS classes
    /**
     * @property
     * @default
     */
    overlayClass: 'gis-overlays',
    /**
     * @property
     * @default
     */
    heatMapClass: 'gis-heat-map',
    /**
     * @property
     * @default
     */
    popupClass: 'gis-popup',
    /**
     * @static
     * @default
     */
    captionClass: 'gis-caption',
    /**
     * @static
     * @default
     */
    textLabelClass: 'gis-label',
    /**
     * @static
     * @default
     */
    imageLabelClass: 'gis-image-label',
    /**
     * @static
     * @default
     */
    gisSelectedClass: 'gis-selected',
    /**
     * @static
     * @default
     */


    defaultProjection: 'EPSG3857',
    /**
     * @static
     * @default
     */

    relativePath: '',
    /**
     * @static
     * @default
     */

    DefaultHatchColor: 'black',
    /**
     * @static
     * @default
     */

    maxInCache: 15,
    /**
     * @property
     * @type {object}
     */
    DefaultBearingBehavior: {
        /**
         * @type {number}
         * @property
         * @default
         * @description Число видимых пеленгов
         */
        latestBearingCount: 1
    },
    /**
     * @property
     * @default
     */
    'style': {
        DefaultTempLine: {color: 'gray', border: 'white', thickness: 3, dash: "dot"},
        DefaultCourseStyle: null,
        DefaultLine: {color: '#0033ff', thickness: 1, dash: 'solid', border: undefined},
        DefaultTrackStyle: null,
        /**
         * @property
         */
        DefaultFill: {
            color: "#0033ff",
            hatch: undefined,
            hatchColor: undefined
        },
        /**
         * @property
         */
        DefaultTrackBehavior: {
            traceLengthSeconds: 0,
            traceLengthMeters: 10000
        },
        /**
         * @property
         */
        DefaultBearingBehavior: {
            latestBearingCount: 1
        },
        /**
         * @property
         */
        DefaultTextLabel: {
            latitude: undefined,
            longitude: undefined,
            selectable: undefined,
            draggable: undefined,
            foreColor: '#FFFFFF',
            backColor: '#AB1D4A',
            position: 'centerright',
            className: undefined,
            drawPoint: true
        }
    },
    REST: {
        port: undefined
    },
    /**
     * @property
     */
    connection: {
        host: "localhost",
        port: "9797",
        portSecond: "8080",
        reconnectDelay: 5000
    },
    /**
     * @property
     */
    heatmap: {
        opacity: 0.6,
        color: [{percent: 0, color: "rgb(13,255,3)"}, {percent: 1, color: "rgb(170,19,19)"}]
    },
    /**
     * Конфигурация тайлов (кешь, предопределенные, тайлсервер)
     * @property
     */
    tiles: {
        bingKey: 'AlJxQ0XPAmp2briEr8BrKXferQDjH7GXYd-yT4M-HT_37eSREOfCF_zAnk6gii7V',
        /**
         * если не тмс и предопределенное, всегда считать кешем
         * @type {boolean}
         */
        otherAsLocal: true,
        /**
         * разрешить работать без конфига локального кеша
         * @type {boolean}
         */
        workWithoutCacheConfig: true,
        /**
         * Если указать, то клиент не будет пытаться определить расширение файла.
         * Не имеет смысле если кешь имеет конфиг
         */
        forceCacheExtension: null,
        /**
         * Позволить грузить данные от тмс или локальный кешь из другого домена
         * @type {boolean}
         */
        loadDataOtherOrigin: true,
        /**
         * @type {string}
         */
        cacheConfigFile: 'tmc_map_config.js'
    }
};
Gis.Config.image = function (type) {
    var imageConfig = Gis.Config.image,
        config = {
            path: (imageConfig && imageConfig.path) || Gis.Config.relativePath + 'images/',
            ErrorTile: (imageConfig && imageConfig.ErrorTile) || Gis.Config.relativePath + 'images/no_image.gif',
            rotationIcon: (imageConfig && imageConfig.ErrorTile) || Gis.Config.relativePath + 'images/rotate.gif',
            extensions: (imageConfig && imageConfig.extensions) || '.png',
            serverOverlayExtension: (imageConfig && imageConfig.serverOverlayExtension) || '',
            defaultHost: (imageConfig && imageConfig.defaultHost) || 'gis',
            defaultProtocol: (imageConfig && imageConfig.defaultProtocol) || 'http',
            defaultPort: (imageConfig && imageConfig.defaultPort) || '80'
        };
    return config[type];
};
/**
 * Запросить конфиг по ключу
 * @param key
 * @param [defaultValue]
 * @returns {Object}
 */
Gis.config = function (key, defaultValue) {
    var i, len, response, keys;
    defaultValue = Gis.Util.isDefine(defaultValue) ? defaultValue : null;
    if (!key) {
        return defaultValue;
    }
    keys = key.split(".");
    if (!keys) {
        return defaultValue;
    }
    response = Gis.Config;
    for (i = 0, len = keys.length; i < len; i += 1) {
        response = response[keys[i]];
        if (!Gis.Util.isDefine(response)) {
            return defaultValue;
        }
    }
    return response;
};
/**
 * Установить конфиг по пути
 * @param key
 * @param value
 * @returns {null}
 */
Gis.setConfig = function (key, value) {
    var i, len, response, keys, lastResponse;
    if (!key) {
        return null;
    }
    keys = key.split(".");
    if (!keys) {
        return null;
    }
    response = Gis.Config;
    for (i = 0, len = keys.length - 1; i < len; i += 1) {
        lastResponse = response[keys[i]];
        if (!Gis.Util.isDefine(lastResponse)) {
            lastResponse = {};
            response[keys[i]] = lastResponse;
        }
        response = lastResponse;
    }
    response[keys[i]] = value;
};
/**
 * Отключить поддержку rgba
 * @type {boolean}
 */
window.GIS_RGBA_DISABLE = false;
/**
 * генерировать ли GUID автоматически
 * @type {boolean}
 */
window.GIS_GENERATE_GUID = false;