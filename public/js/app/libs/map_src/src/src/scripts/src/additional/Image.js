"use strict";
/**
 * Изображение для иконки или overlay
 * @class
 * @param {Object} options
 * @param {string} options.hash хэшь объекта
 * @param {string} options.projection=null Не проработано
 * @param {string} options.fullPath путь к директории с изображением, где лежит файл {hash}.png Не проработано
 * @extends Gis.BaseClass
 */
Gis.Additional.Image = Gis.BaseClass.extend(
    /** @lends Gis.Additional.Image# */
    {
        options: {
            hash: undefined,
            projection: null,
            fullPath: undefined
        },
        optionsFire: [
            'hash',
            'fullPath'
        ],
        initialize: function (data) {
            var imageConfig = Gis.Config.image, configIsFunction = Gis.Util.isFunction(imageConfig);
            Gis.BaseClass.prototype.initialize.call(this, data);
            this._host = (configIsFunction && imageConfig('defaultHost')) || imageConfig.defaultHost;
            this._port = (configIsFunction && imageConfig('defaultPort')) || imageConfig.defaultPort;
            this._protocol = (configIsFunction && imageConfig('defaultProtocol')) || imageConfig.defaultProtocol;
            this._extension = (configIsFunction && imageConfig('serverOverlayExtension')) || imageConfig.serverOverlayExtension || '';
            this._processData();
        },
        setData: function (data, val, noFire) {
            var changed = Gis.BaseClass.prototype.setData.call(this, data, val, noFire);
            if (changed) {
                this._processData();
            }
            return changed;
        },
        setProjection: function (projection) {
            this.options.projection = projection;
            this._processData();
        },
        setHost: function (host) {
            this._host = host;
        },
        _isBlobData: function () {
            return this.options.hash && this.options.hash.substr(0, 11) === 'data:image/';
        },
        _processBlobData: function () {
            this._uri = this.options.hash;
        },
        _processUriData: function () {
            var imageName = this.options.hash && (this.options.hash + this._extension);
            if (!this.options.fullPath) {
                this._uri = this._protocol + "://" + this._host + ':' + this._port + "/image/" + imageName;
            } else {
                this._uri = this.options.fullPath + (imageName ? "/" + imageName : "");
            }
        },
        _processData: function () {
            if (this._isBlobData()) {
                return this._processBlobData();
            }
            return this._processUriData();
        },
        /**
         * Получить URI изображения
         * @returns {string | HTMLCanvasElement} для предопределенных иконок возвращает @link HTMLCanvasElement
         */
        createImageUri: function () {
            this._processData();
            return this._uri;
        }
    }
);
Gis.Image = Gis.Additional.Image;
/**
 * Возвращает новый экземпляр изображения
 * @param options
 * @returns {Gis.Additional.Image}
 */
Gis.image = function (options) {
    if (options && options.createImageUri) {
        return options;
    }
    return new Gis.Additional.Image(options);
};
