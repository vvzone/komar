"use strict";
/**
 * @description
 * Базовый класс для всех объектов
 * @abstract
 * @class
 * @param {Object} options
 * @param {string} [options.id] GUID если не установлен флаг window.GIS_GENERATE_GUID = true;, параметр обязателен
 * @param {string[]} [options.tags] теги объекта
 * @extends Gis.Class Gis.Core.Events
 */
Gis.BaseClass = Gis.Class.extend(
    /** @lends Gis.BaseClass# */
    {
        includes: Gis.Core.Events,
        optionsFire: [],
        fixed: [],
        options: {
        },
        /**
         * Устанавливает опции из Map
         * @param {Object} data
         * @returns {string[]} изменились ли параметры
         * @ignore
         * @private
         */
        _fillDataFromObject: function (data) {
            var id, objectOptions = this.options, changed = false, changedRows = [];
            if (data.tags) {
                changed = this.fillTags(data.tags);
                if (changed) {
                    changedRows.push('tags');
                }
                delete data.tags;
            }
            data = this._clearFixed(data);
            for (id in data) {
                if (data.hasOwnProperty(id)) {
                    if (objectOptions.hasOwnProperty(id)) {
                        changed = false;
                        changed = this._fillDataFromString(id, data[id]);
                        if (changed) {
                            changedRows = changedRows.concat(changed);
                        }
                    }
                }
            }
            return changedRows.length && changedRows;
        },
        /**
         * Сравнивает два объекта
         * @public
         * @param {Gis.BaseClass} object
         * @returns {boolean}
         */
        equals: function (object) {
            var options = object &&  object.getParams && object.getParams(), key, equals = true;
            if (object === this) {
                return true;
            }
            if (options) {
                for (key in this.options) {
                    if (this.options.hasOwnProperty(key)) {
                        equals = equals && ((options[key] && options[key].equals && options[key].equals(this.options[key])) || this.options[key] === options[key]);
                        if (!equals) {
                            return false;
                        }
                    }
                }
                return equals;
            }
            return false;
        },
        /**
         * устанавливает значения опций из строки
         * @param {string} id ключь
         * @param {*} val значение
         * @returns {string[]} изменились ли параметры
         * @ignore
         * @private
         */
        _fillDataFromString: function (id, val) {
            var objectOptions = this.options, changed, changedRows = [];
            if (id === 'tags') {
                changed = this.fillTags(val);
                if (changed) {
                    changedRows.push('tags');
                }
                return changedRows.length && changedRows;
            }
            if (val && typeof val === 'object') {
                if (objectOptions[id] && objectOptions[id].setData) {
                    changed = objectOptions[id].setData(val.options || val);
                } else if (Gis.Util.isArray(val)) {
                    if (!Gis.Util.compareArrays(objectOptions[id], val)) {
                        objectOptions[id] = val;
                        changed = true;
                    }
                } else if (!objectOptions[id] || val !== objectOptions[id]) {
                    objectOptions[id] = val;
                    changed = true;
                }
            } else {
                if (objectOptions[id] !== val) {
                    objectOptions[id] = val;
                    changed = true;
                }
            }
            if (changed) {
                changedRows.push(id);
            }
            return changedRows.length && changedRows;
        },
        /**
         * Установить свойства объекта
         * @param {string | object} data объект с данными для установки параметров {param: value}
         * @param {object | string} [val] значение параметра (если data - строка)
         * @param {boolean} [notFireToServer] посылать ли уведомление на сервер
         * @returns {string[]} true если свойства поменялись
         * @public
         * */
        setData: function (data, val, notFireToServer) {
            var changed = [], rowsChanged;
            if (typeof data === "object") {
                changed = this._fillDataFromObject(data);
            } else if (typeof data === "string") {
                changed = this._fillDataFromString(data, val);
            }
            if (changed && changed.length) {
                rowsChanged = this._getRowsChanged(changed);
                this.fire('change', {
                    target: this,
                    notFireToServer: notFireToServer || !rowsChanged,
                    rows: rowsChanged,
                    realRows: typeof changed === 'object' ? Object.keys(changed) : changed
                });
            }
            return changed;
        },
        /**
         *
         * @param data
         * @param val
         * @param type
         * @param fabric
         * @returns {*}
         * @protected
         * @ignore
         */
        _fillOption: function (data, val, type, fabric) {
            if (typeof data === 'object' && data[type]) {
                data[type] = fabric(data[type]);
            }
            if (data === type) {
                val = fabric(val);
            }
            return val;
        },
        /**
         *
         * @param data
         * @returns {*}
         * @ignore
         * @private
         */
        _getRowsChanged: function (data) {
            var keys, self = this;
            if (typeof data === 'object') {
                keys = (Gis.Util.isArray(data) ? data : Object.keys(data)).filter(function (value) {
                    return self.optionsFire.indexOf(value) >= 0;

                });
                return keys.length && keys;
            }
            if (this.optionsFire.indexOf(data) >= 0) {
                return [data];
            }
            return null;

        },
        /**
         * Можно ли менять значение параметра
         * @param {string} row ключь
         * @returns {*|boolean}
         * @ignore
         * @private
         */
        _isFixed: function (row) {
            return this.fixed && this.fixed.indexOf(row) >= 0;
        },
        /**
         * Очистить Map от полей которые нельзя менять
         * @param {object} rows
         * @returns {object}
         * @ignore
         * @private
         */
        _clearFixed: function (rows) {
            var rowId, newRows = {};
            if (typeof rows === "object") {
                for (rowId in rows) {
                    if (rows.hasOwnProperty(rowId) && !this._isFixed(rowId)) {
                        newRows[rowId] = rows[rowId];
                    }
                }
            }
            return newRows;
        },
        /**
         * Запросить все параметры
         * @param {*} [object] если объект не указан вернет для самого объекта
         * @returns {object}
         * @public
         */
        getParams: function (object) {
            object = object || this;
            return object && Gis.Util.extend({}, object.options);
        },
        /**
         * Проверить наличие обязательных параметров
         * @param {object} data
         * @private
         */
        _checkRequired: function (data) {
            var i, len,
                propertyName;
            if (this.required) {
                if (!data) {
                    throw new TypeError('Не заполнены необходимые поля');
                }
                for (i = 0, len = this.required.length; i < len; i += 1) {
                    propertyName = this.required[i];
                    if (!data.hasOwnProperty(propertyName) || data[propertyName] == undefined) {
                        throw new TypeError("Параметр '" + propertyName + "' обязателен");
                    }
                }
            }
        },

        /**
         * @description первоначальная инициализация тегов
         * @param data
         * @private
         */
        _initTags: function (data) {
            if (this.setTag) {
                return;
            }
            var tags = (data && data.tags) || {},
                fixedTags = ['creator'];

            function fixedTag(key) {
                return tags.hasOwnProperty(key) && fixedTags.indexOf(key) > -1;
            }

            /**
             * установить тег
             * @param {string} key ключ тега
             * @param {*} val объект тега
             * @returns {boolean}
             * @fires tagchanged
             */
            this.setTag = function (key, val) {
                var oldVal = tags[key];
                if ((!tags[key] || !fixedTag(key)) && tags[key] != val) {
                    tags[key] = val;
                    this.fire('tagchanged', {key: key, oldVal: oldVal, newVal: val, target: this});
                    return true;
                }
                return false;
            };
            /**
             *  добавить теги
             * @param data ассоциативный массив тегов
             * @returns {boolean}
             * @public
             */
            this.fillTags = function (data) {
                var id, changed = false;
                for (id in data) {
                    if (data.hasOwnProperty(id)) {
                        changed = changed || this.setTag(id, data[id]);
                    }
                }
                return changed;
            };
            /**
             * Запросить тег по ключу
             * @param {string} key
             * @returns {*}
             * @public
             */
            this.getTag = function (key) {
                var tag = tags[key];
                return Gis.Util.isArray(tag) ? tag.slice() : tag;
            };
            /**
             * @public
             * @returns {*}
             */
            this.getTags = function () {
                return Gis.Util.extend({}, tags);
            };
            if (data && data.tags) {
                delete data.tags;
            }
        },
        /**
         * @ignore
         * @param data
         */
        initialize: function (data) {
            this._initTags(data);
            if (data && data.hasOwnProperty('tags')) {
                delete data.tags;
            }
            data = data || {};
            if (data.id) {
                if (!Gis.Util.checkGUID(data.id)) {
                    Gis.Logger.log(JSON.stringify(data.id) + " is incorrect GUID", this.options.tacticObjectType && this.options.tacticObjectType.toUpperCase());
                    throw new TypeError('Недопустимый GUID - ' + data.id);
                }
            } else if (window.GIS_GENERATE_GUID && this.options.hasOwnProperty('id')) {
                data.id = Gis.Util.generateGUID();
            }
            this._checkRequired(data);
            if (data) {
                this.options = Gis.Util.fill(Gis.Util.extend({}, this.options), data);
            }
        },
        /**
         * Запросить собственные опции объекта
         * используется для формирования JSON
         * Стили не применяются
         * @returns {object}
         * @public
         */
        objectData: function () {
            var result = {},
                id;
            for (id in this.options) {
                if (this.options.hasOwnProperty(id)) {
                    if (this.options[id] !== undefined && this.options[id] !== null) {
                        result[id] = (this.options[id] && this.options[id].options) ? this.options[id].options : this.options[id];
                    }
                }
            }
            return result;
        },
        /**
         * Запросить значение опции.
         * Сначала применятся стили, если в стилях свойство переопределено, его и используем
         * @example
         * var trackStyle = Gis.lineStyle({color: 'red'});
         * object.setData({trackStyle: trackStyle});
         * var trackStyle2 = object.getOption('trackStyle');
         * trackStyle2 === trackStyle //true
         * @example
         * var trackStyle = {color: 'red'};
         * object.setData({trackStyle: trackStyle});
         * var trackStyle2 = object.getOption('trackStyle');
         * trackStyle2 === trackStyle //false Объект trackStyle2 обернут в Gis.lineStyle
         * @public
         * @param key
         * @returns {*}
         */
        getOption: function (key) {
            return (this.getStyle() && this.getStyle().getStyleProperty(key)) || this.options[key];
        },
        /**
         * Проверим, вплючен ли параметр в официальный апи
         * нужно для отправки корректных данных на сервер
        * @param {string} param
         * @returns {boolean} Параметр включен в официальный API
         * @public
        */
        isOfficialParam: function (param) {
            return this.optionsFire.indexOf(param) > -1;
        },
        /**
         * Возвращает данные с учетом стилей
         * @public
         * @returns {*}
         */
        getOptionsWithStyle: function () {
            var style = this.getStyle();
            return Gis.Util.extend({}, this.options, style && style.getStyleValues());
        },
        /**
         * Запросить официальные собственные опции объекта
         * используется для формирования JSON
         * @returns {object}
         * @public
         */
        objectOfficialData: function () {
            var result = {},
                id;
            for (id in this.options) {
                if (this.options.hasOwnProperty(id) && this.isOfficialParam(id)) {
                    if (this.options[id] !== undefined && this.options[id] != null) {
                        result[id] = (this.options[id] && this.options[id].objectOfficialData) ? this.options[id].objectOfficialData() : this.options[id];
                    }
                }
            }
            var tags = this.getTags();
            if (tags && Object.keys(tags).length) {
                result.tags = tags;
            }
            return result;
        },
        /**
         * Получить стиль объекта
         * @public
         * @returns {*}
         */
        getStyle: function () {
            var style = this.getTag('style');
            return this._map && style && this._map.getStyle(style);
        },
        /**
         * Формирует JSON из параметров
         * @returns {*}
         * @override
         * @public
         */
        toString: function () {
            var result = this.objectData();
            return JSON.stringify(result);
        },
        /**
         * @public
         * @returns {Object}
         * @override
         */
        toJSON: function () {
            return this.objectOfficialData();
        }
    }
);
