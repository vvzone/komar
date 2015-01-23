"use strict";
/**
 * @classdesc
 * Иконка
 * @class
 * @param {Object} options
 * @param {string} options.type тип - константа из [TYPE]{@link Gis.Additional.Icon.TYPE}
 * @param {string} options.color цвет rgb, rgba
 * @param {boolean} options.rotatable
 * @param {Gis.Additional.Image} options.image изображение, если type custom
 * @example отобразить иконки
 *  var i, cnvs, counter = 1;
    for (i in Gis.Additional.Icon.TYPE) {
        if (Gis.Additional.Icon.TYPE.hasOwnProperty(i) && Gis.Additional.Icon[Gis.Additional.Icon.TYPE[i]]) {
            cnvs = document.createElement('canvas');
            cnvs.width = 20;
            cnvs.height = 20;
            document.body.appendChild(cnvs);
            Gis.Additional.Icon[Gis.Additional.Icon.TYPE[i]]('blue', 20, cnvs);
            cnvs.style.position = 'fixed';
            cnvs.style.top = '25px';
            cnvs.style.left = counter * 50 + 'px';
            cnvs.style.zIndex = counter + 99;
            counter += 1;
        }
    }
 * @extends Gis.BaseClass
 */
Gis.Additional.Icon = Gis.BaseClass.extend(
    /** @lends Gis.Additional.Icon# */
    {
        required: ['type'],
        options: {
            //unoficial
            width: 15,
            type: undefined,
            color: undefined,
            rotatable: undefined,
            image: undefined
        },
        optionsFire: [
            'type',
            'color',
            'image'
        ],
        initialize: function (data) {
            if (data && data.type) {
                data.type = data.type.toLowerCase();
            }
            if (data.image) {
                this._fillOption(data, null, 'image', Gis.image);
            }
            if (!data.width && data.type) {
                if (Gis.Additional.Icon[data.type] && Gis.Additional.Icon[data.type].width) {
                    data.width = Gis.Additional.Icon[data.type].width;
                }
            }
            Gis.BaseClass.prototype.initialize.call(this, data);
            if (this.options.image && !this.options.image.createImageUri) {
                this.options.image = Gis.image(this.options.image);
            }
        },
        setData: function (data, val, noFire) {
            if (val && data === 'type') {
                val = val.toLowerCase();
            } else if (data && data.type) {
                data.type = data.type.toLowerCase();
            }
            if (data === 'image' || data.image) {
                val = this._fillOption(data, val, 'image', Gis.image);
            }
            return Gis.BaseClass.prototype.setData.call(this, data, val, noFire);
        },
        isRotatable: function () {
            return this.options.rotatable ||
                (this.options.rotatable !== false && (!window.FILTER_ROTATABLE_IMAGES || Gis.Additional.Icon.rotation[this.options.type]));
        },
        getType: function () {
            return this.options.type;
        },
        getColor: function () {
            return this.getOption('color');
        },
        getImage: function () {
            return this.getOption('image') && Gis.image(this.getOption('image'));
        },
        clone: function () {
            return Gis.icon(this.options);
        },
        /**
        * @returns {string|canvas} адрес изображения или объект канваса
        */
        getImageUrl: function () {
            var imageConfig = Gis.Config.image, configIsFunction = Gis.Util.isFunction(imageConfig);
            if (this._isPredefinedType()) {
                if (Gis.Additional.Icon[this.options.type]) {
                    this._canvas = Gis.Additional.Icon[this.options.type](this.getOption('color') || 'black', this.getOption('width') || 15, this._canvas);
                    return this._canvas;
                }
                return ((configIsFunction && imageConfig('path')) || imageConfig.path) + this.getType() + '_' + this.getColor() +
                    ((configIsFunction && imageConfig('extensions')) || imageConfig.extensions);

            }
            if (!this.getImage() || !this.getImage().createImageUri) {
                Gis.Logger.log("Could't create image", JSON.stringify(this.options));
                throw new Error('Error create image ' + JSON.stringify(this.options));
            }
            return this.getImage().createImageUri();
        },
        _isPredefinedType: function () {
            return Gis.Additional.Icon[this.options.type] !== undefined;
        },
        isPredefinedType: function () {
            return this._isPredefinedType() && Gis.Additional.Icon[this.options.type];
        }
    }
);
/**
 * Типы иконок
 * @readonly
 * @enum {string}
 */
Gis.Additional.Icon.TYPE = {
    /**
     * Автомобиль
     */
    CAR: 'car',
    /**
     * Окружность
     */
    CIRCLE: 'circle',
    /**
     * Опасность
     */
    ARROW: 'arrow',
    DANGER: 'danger',
    DIAMOND: 'diamond',
    HELICOPTER: 'helicopter',
    M: 'm',
    PLANE: 'plane',
    ROUTER: 'router',
    SENSOR: 'sensor',
    SIMPLE: 'simple',
    STATIC: 'static',
    STORM: 'storm',
    TARGET: 'target',
    TRIANGLE: 'triangle'
};
Gis.Additional.Icon.rotation = {
    'arrow': true,
    'car': true,
    'plane': true,
    'helicopter': true,
    'static': false,
    'custom': false
};
Gis.Additional.Icon.fixPositionCanvas = function (icoWidth, realIcoWidth, canvas) {
    var coefficient, delta;
    if (icoWidth && icoWidth !== realIcoWidth) {
        coefficient = (icoWidth / realIcoWidth);
        canvas.style[Modernizr.prefixed('transform')] = 'scale(' + coefficient + ')';
        delta = ((icoWidth - realIcoWidth) / 2) + 'px';
        canvas.style.marginLeft = delta;
        canvas.style.marginTop = delta;
    }
};
Gis.Icon = Gis.Additional.Icon;
/**
 * Возвращает новый экземпляр иконки
 * @param options
 * @returns {*}
 */
Gis.icon = function (options) {
    if (options && options.getImage) {
        return options;
    }
    return new Gis.Icon(options);
};
