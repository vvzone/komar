(function () {
    'use strict';
    var controller,
        currentLayers,
        invisibleLayers,
        PREFERENCES_KEY = 'OBJECTVISIBILITYCONTROLLER',
        namespace,
        NamespaceClass,
        DELAY_LAYER_RECALCULATE = 5000;

    function _getTags(object) {
        var tag = object.getLayers();
        if (tag && Gis.Util.isString(tag)) {
            tag = [tag];
        } else if (tag) {
            tag = tag.slice();
        }
        return (tag && tag.length) ? tag : [Gis.ObjectVisibilityController.BASE_LAYER_KEY];
    }
    /**
     * тут хранятся приватные члены
     * @param {Gis.ObjectVisibilityController} visibilityController
     * @class
     */
    NamespaceClass = function (visibilityController) {
        /**
         * @param {Gis.ObjectController.LAYER_CHANGED_EVENT} event
         */
        this.layerChanged = function (event) {
            if (event.target.isCountable() && event.rows && event.rows.indexOf('tags') > -1) {
                visibilityController.calculateLayersDelayed();
            }
        };
        /**
         * @param {Gis.ObjectController.LAYER_REMOVE_EVENT} event
         */
        this.layerRemoved = function (event) {
            if (event.target.isCountable()) {
                visibilityController.calculateLayersDelayed();
            }
        };
        /**
         * @param {Gis.ObjectController.LAYER_ADD_EVENT} event
         * @fires Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT
         */
        this.layerAdded = function (event) {
            var tags, added;
            if (event.target.isCountable()) {
                tags = _getTags(event.target);
                if (tags.length > 0) {
                    added = visibilityController.addLayersFromObject(event.target);
                    if (added.length) {
                        this.fire(Gis.ObjectVisibilityController.LIST_CHANGE_EVENT.TYPE, new Gis.ObjectVisibilityController.LIST_CHANGE_EVENT(added));
                    }
                }
            }
        };
    };



    /**
     *
     * @class
     * @classdesc Контролирует видимость слоев
     * @param {Gis.ObjectController} objectController
     * @param {Object} options
     * @version 1.0
     * @extends Gis.Class
     */
    Gis.ObjectVisibilityController = Gis.Class.extend(
        /**
         * @lends Gis.ObjectVisibilityController#
         */
        {
            /**
             * @lends Gis.ObjectVisibilityController#
             */
            includes: Gis.Core.Events,
            initialize: function (objectController) {
                controller = objectController;
                namespace = new NamespaceClass(this);
                this.recoverFromStorage();
                currentLayers = [];
                controller.on(Gis.ObjectController.LAYER_CHANGED_EVENT.TYPE, namespace.layerChanged, this);
                controller.on(Gis.ObjectController.LAYER_REMOVE_EVENT.TYPE, namespace.layerRemoved, this);
                controller.on(Gis.ObjectController.LAYER_ADD_EVENT.TYPE, namespace.layerAdded, this);
                this.on(Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT.TYPE, this.saveToStorage, this);
            },
            /**
             * Запросить текущие слои объекта
             * @param {Gis.Objects.Base} object
             * @return {Array.<string>|undefined}
             */
            getLayersFromObject: function (object) {
                return object && _getTags(object);
            },
            /**
             * Запросить слои объектов
             * @returns {Array.<string>}
             */
            getLayers: function () {
                return currentLayers.slice();
            },
            /**
             * видим ли объект
             * @param {Gis.BaseClass|string} object объект или GUID
             * @returns {boolean}
             */
            isObjectVisible: function (object) {
                if (!invisibleLayers.length) {
                    return true;
                }
                var layers = this.getLayersFromObject(Gis.Util.isString(object) ? controller.getLayer(object) : object), i, len;
                if (layers) {
                    for (i = 0, len = layers.length; i < len; i += 1) {
                        if (this.isLayerVisible(layers[i])) {
                            return true;
                        }
                    }
                }
                return false;
            },
            /**
             * Информация о текущих слоях
             * @returns {Array.<Gis.ObjectVisibilityController.VisibilityData>}
             */
            getLayersInfo: function () {
                var layer, aLayers = [], i, len;
                for (i = 0, len = currentLayers.length; i < len; i += 1) {
                    layer = currentLayers[i];
                    aLayers.push(new Gis.ObjectVisibilityController.VisibilityData(layer, this.isLayerVisible(layer)));
                }
                return aLayers;
            },
            /**
             * Установить видимость слоя
             * @param {string} layer
             * @param {boolean} visibility
             * @param {boolean} [notFire=false] не бросать событие изменения видимости
             * @returns {Gis.ObjectVisibilityController.VisibilityData | undefined} если состояние поменялось, вернет [VisibilityData]{@link Gis.ObjectVisibilityController.VisibilityData}
             * @fires Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT
             */
            setLayerVisible: function (layer, visibility, notFire) {
                if (!Gis.Util.isDefine(layer)) {
                    layer = Gis.ObjectVisibilityController.BASE_LAYER_KEY;
                }
                var index = invisibleLayers.indexOf(layer);
                if (visibility && index > -1) {
                    invisibleLayers.splice(index, 1);
                    if (!notFire) {
                        this.fire(Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT.TYPE, new Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT(layer, visibility));
                    }
                    return new Gis.ObjectVisibilityController.VisibilityData(layer, visibility);
                }
                if (!visibility && index === -1) {
                    invisibleLayers.push(layer);
                    if (!notFire) {
                        this.fire(Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT.TYPE, new Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT(layer, visibility));
                    }
                    return new Gis.ObjectVisibilityController.VisibilityData(layer, visibility);
                }
            },
            /**
             * Пакетная установки визимости. См. [setLayerVisible]{@link Gis.ObjectVisibilityController#setLayerVisible}
             * @param {Array.<Gis.ObjectVisibilityController.VisibilityData>} layers
             * @fires Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT
             */
            setLayersVisible: function (layers) {
                var i, len, aLayer, changed = [];
                if (layers) {
                    for (i = 0, len = layers.length; i < len; i += 1) {
                        aLayer = layers[i];
                        if (this.setLayerVisible(aLayer.layer, aLayer.visibility, true)) {
                            changed.push(aLayer);
                        }
                    }
                    this.fire(Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT.TYPE, new Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT(changed));
                }
                return changed;
            },
            /**
             * Все невидимые слои
             * @returns {Array.<string>}
             */
            getInvisibleLayers: function () {
                return invisibleLayers.slice();
            },
            /**
             * Видим ли слой объектов
             * @param {string} layer
             * @returns {boolean}
             */
            isLayerVisible: function (layer) {
                if (!Gis.Util.isDefine(layer)) {
                    layer = Gis.ObjectVisibilityController.BASE_LAYER_KEY;
                }
                var visibleLayers = this.getInvisibleLayers();
                return visibleLayers && visibleLayers.indexOf(layer) === -1;
            },
            /**
             * Добавить слои из объекта, если нужно
             * @param {Gis.Objects.Base | string} layer сам объект или его идентификатор
             * @param {Array.<string>} [list] какой список изменять. если не указано, изменяется текущий
             * @returns {Array.<string>} добавленные поля
             */
            addLayersFromObject: function (layer, list) {
                var obj = Gis.Util.isString(layer) ? controller.getLayer(layer) : layer,
                    layers = obj && obj.isCountable() && this.getLayersFromObject(obj),
                    i,
                    len,
                    changed = [];
                list = list || currentLayers;
                if (layers) {
                    for (i = 0, len = layers.length; i < len; i += 1) {
                        if (list.indexOf(layers[i]) === -1) {
                            list.push(layers[i]);
                            changed.push(layers[i]);
                        }
                    }
                }
                return changed;
            },
            calculateLayersDelayed: function () {
                var self = this;
                if (!this._timeoutCalculate) {
                    this._timeoutCalculate = setTimeout(function () {
                        self.calculateLayers();
                        self._timeoutCalculate = null;
                    }, DELAY_LAYER_RECALCULATE);
                }
            },
            /**
             * Обновляет список слоев
             * @fires Gis.ObjectVisibilityController.LIST_CHANGE_EVENT
             */
            calculateLayers: function () {
                var layerIDs = controller.getLayerIDs(), i, len, self = this, added = [], newLayers = [], removed = [];
                if (layerIDs) {
                    for (i = 0, len = layerIDs.length; i < len; i += 1) {
                        this.addLayersFromObject(layerIDs[i], newLayers);
                    }
                }
                if (controller.listNotForObjectProvider) {
                    controller.listNotForObjectProvider.each(function (object) {
                        self.addLayersFromObject(object, newLayers);
                    });
                }
                for (i = 0, len = currentLayers.length; i < len; i += 1) {
                    if (newLayers.indexOf(currentLayers[i]) === -1) {
                        removed.push(currentLayers[i]);
                    }
                }
                for (i = 0, len = newLayers.length; i < len; i += 1) {
                    if (currentLayers.indexOf(newLayers[i]) === -1) {
                        added.push(newLayers[i]);
                    }
                }
                if (added.length || removed.length) {
                    currentLayers = newLayers;
                    this.fire(Gis.ObjectVisibilityController.LIST_CHANGE_EVENT.TYPE, new Gis.ObjectVisibilityController.LIST_CHANGE_EVENT(added, removed));
                }
            },
            /**
             * @private
             */
            recoverFromStorage: function () {
                invisibleLayers = Gis.Preferences.getPreferenceData(PREFERENCES_KEY) || [];
            },
            /**
             * @private
             */
            saveToStorage: function () {
                Gis.Preferences.setPreferenceData(PREFERENCES_KEY, invisibleLayers);
            }
        }
    );
    /**
     * @description Событие смены видимости одного или нескольких слоев
     * @event
     * @property {string | Array.<Gis.ObjectVisibilityController.VisibilityData>} layers
     * @property {boolean} [visibility] если Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT#layers массив, то не указывается
     * @property {string} type Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT.TYPE
     */
    Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT = function (layers, visibility) {
        visibility = Gis.Util.isDefine(visibility) ? visibility : undefined;
        this.layers = layers;
        this.visibility = visibility;
        this.type = Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT.TYPE;
    };
    /**
     * @constant
     * @type {string}
     * @default
     */
    Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT.TYPE = 'layervisibilitychanged';
    /**
     * @description Событие смены списка слоев
     * @event
     * @property {Array.<string> | undefined} [added] список добавленых полей
     * @property {Array.<string> | undefined} [removed] список удаленных полей
     * @property {string} type Gis.ObjectVisibilityController.LIST_CHANGE_EVENT.TYPE
     */
    Gis.ObjectVisibilityController.LIST_CHANGE_EVENT = function (added, removed) {
        added = added || undefined;
        removed = removed || undefined;
        this.added = added;
        this.removed = removed;
        this.type = Gis.ObjectVisibilityController.LIST_CHANGE_EVENT.TYPE;
    };
    /**
     * @constant
     * @type {string}
     * @default
     */
    Gis.ObjectVisibilityController.LIST_CHANGE_EVENT.TYPE = 'layerlistchanged';
    Gis.ObjectVisibilityController.BASE_LAYER_KEY = '';
    Gis.ObjectVisibilityController.BASE_LAYER_NAME = 'Базовый слой';

    /**
     * Вспомогательный объект с данными о карте
     * @param {string} layer Слой
     * @param {boolean} visibility Видимость слоя
     * @class
     */
    Gis.ObjectVisibilityController.VisibilityData = function (layer, visibility) {
        /**
         * Ключ слоя
         * @type {string}
         */
        this.layer = layer;
        /**
         * Видимость слоя
         * @type {boolean}
         */
        this.visibility = visibility;
    };
}());
