(function (G) {
    "use strict";
    var TIME_TO_WAIT_OBJECTS = 30000,
        OBJECTS_TO_REMEMBER = 20;

    /**
     *
     * @class
     * @classdesc Ответственнен за отризовку всех объектов
     * @param {Object} options
     * @param {Gis.Map} options.map
     * @extends Gis.BaseClass
     */
    Gis.ObjectController = G.BaseClass.extend(
        /** @lends Gis.ObjectController# */
        {
            options: {
                map: null
            },
            _visibilityController: undefined,
            toRender: [],
            _framesPerSecond: 25,
            _calculatedPerSecond: 0,
            _frameRequested: false,
            excluded: {id: [], type: []},
            _listToUpdate: {},
            _clearSelectedOnMapClick: true,
            _intervalTime: 300,
            selected: {},
            // Класс обертка вокруг поставщика данных
            _map: undefined,
            attachMap: function (map) {
                this._map = map;

                this._map.on('click', this._mapClicked, this);
                this._map.on('zoomstart', this._disableAnimation, this);
                this._map.on('zoomend', this._enableAnimation, this);
                this._map.on('change', this.draw, this);
            },
            clearLayer: function (layer) {
                layer.detachFromMap(this._map);
            },
            attachLayerToMap: function (layer) {
                layer.attachToMap(this._map);
            },
            pause: function () {
                this.stopDraw = true;
            },
            stop: function () {
                this.pause();
                this.list.each(this.clearLayer, this);
                this.listUncontrol.each(this.clearLayer, this);
            },
            start: function () {
                this.resume();
                this.list.each(this.attachLayerToMap, this);
                this.listUncontrol.each(this.attachLayerToMap, this);
                this.draw();
            },
            resume: function () {
                this.stopDraw = false;
            },
            detachMap: function (map) {
                this._map = false;
                map.off('click', this._mapClicked, this);
                map.off('zoomstart', this._disableAnimation, this);
                map.off('zoomend', this._enableAnimation, this);
                map.off('change', this.draw, this);
                map.closeMap();
            },
            requestFrame: function () {
                Gis.requestAnimationFrame(50)(this._animate);
            },
            calculateTime: function () {
                return 1000 / Math.min(this._calculatedPerSecond, this._framesPerSecond);
            },
            getIdealTimePerFrame: function () {
                return 1000 / this._framesPerSecond;
            },
            getAnimateTime: function () {
                var time = this.calculateTime();
                if ((this._lastFrameDrawed / time) > 0.2 && this._calculatedPerSecond > 1) {
                    this._calculatedPerSecond -= 1;
                    time = this.calculateTime();
                } else if (this._calculatedPerSecond < this._framesPerSecond) {
                    this._calculatedPerSecond += 1;
                    time = this.calculateTime();
                }
                return time;
            },
            initAnimation: function () {
                var self = this;
                this._animate = function () {
                    self.renderFrame();
                    setTimeout(function () {
                        self.initAnimation();
                    }, self.getAnimateTime());
                };
                this.requestFrame();
            },
            initialize: function (options) {
                var self = this;
                this._typeCount = {};
                this.options = G.Util.extend({}, this.options, options);
                if (!this.options.map || typeof this.options.map !== "object") {
                    throw new Error("need map object");
                }
                this.list = new HashList();
                /**
                 * Тут хранятся объекты, ожидающие появления другого объекта
                 * @type {HashArray}
                 * @private
                 */
                this._addAfterAdd = new HashArray(OBJECTS_TO_REMEMBER);
                /**
                 * Когда выполнен запрос объекта
                 * @private
                 */
                this._addAfterAddRequestedTime = {};
                setTimeout(function () {
                    var key, now = Date.now();
                    for (key in self._addAfterAddRequestedTime) {
                        if (self._addAfterAddRequestedTime.hasOwnProperty(key)) {
                            if (now - self._addAfterAddRequestedTime[key] > TIME_TO_WAIT_OBJECTS) {
                                self.clearWaitForObject(key);
                            }
                        }
                    }
                }, TIME_TO_WAIT_OBJECTS);
                this._drawAfterResume = new HashList();
                this.listUncontrol = new HashList();
                this.listNotForObjectProvider = new HashList();
                this.attachMap(this.options.map);
                this.initAnimation();
                this._visibilityController = new Gis.ObjectVisibilityController(this);
                this._visibilityController.on(Gis.ObjectVisibilityController.VISIBILITY_CHANGE_EVENT.TYPE, function () {
                    this.draw();
                }, this);
                delete this.options.map;
            },
            /**
             * Текущий объект, отвечающий за контроль видимости
             * @return {Gis.ObjectVisibilityController}
             */
            getVisibilityController: function () {
                return this._visibilityController;
            },
            _enableAnimation: function () {
                this.stopDraw = false;
                this.draw(this._drawAfterResume);
                this._drawAfterResume.clear();
            },
            _disableAnimation: function () {
                this.stopDraw = true;
            },
            _layerFireAutoUpdate: function (e) {
                this.addLayerToAutoUpdate(e.layer);
            },
            _layerNoNeedAutoUpdate: function (e) {
                this.removeLayerFromUpdate(e.layer);
            },
            addLayerToAutoUpdate: function (layer) {
                this.addToLaterDraw(layer, true);
            },
            removeLayerFromUpdate: function (layer) {
                var id = layer.getId();
                if (this._listToUpdate[id]) {
                    delete this._listToUpdate[id];
                }
            },
            _onCustomLayerEvent: function (event) {
                this.fire(event.type, event);
            },
            removeLayer: function (layer) {
                if (layer.isMetaData()) {
                    layer.clearMeta();
                }
                layer.off('change', this.layerChanged, this);
                layer.off(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE, this._redrawLayer, this);
                layer.off('customaction', this._onCustomLayerEvent, this);
                layer.off('needupdate', this._layerFireAutoUpdate, this);
                layer.off('noneedupdate', this._layerNoNeedAutoUpdate, this);
                this._incrementType(layer.getType(), -1);
                this.removeLayerFromUpdate(layer);
                if (layer.isControllable()) {
                    if (layer.isControllableByServer() !== Gis.FULL_LOCAL) {
                        this.list.remove(layer.getType(), layer.getId());
                    } else {
                        this.listUncontrol.remove(layer.getType(), layer.getId());
                    }
                } else {
                    this.listNotForObjectProvider.remove(layer.getType(), layer.getId());
                }
                this._drawAfterResume.remove(layer.getType(), layer.getId());
                if (layer.isSelectable) {
                    layer.off('select', this._layerSelect, this);
                }
                this.removeFromSelected(layer, true);
                this.clearWaitForObject(layer.getId());
                this._map.removeLayer(layer);
                layer.fire('remove', {from: this._map, target: layer});
                this.fire(Gis.ObjectController.LAYER_REMOVE_EVENT.TYPE, new Gis.ObjectController.LAYER_REMOVE_EVENT(layer));
            },

            isValidLayer: function (layer) {
                var functionsInLayer = ['getType'],
                    i,
                    len;
                if (!layer) {
                    return false;
                }
                for (i = 0, len = functionsInLayer.length; i < len; i += 1) {
                    if (!layer[functionsInLayer[i]]) {
                        return false;
                    }
                }
                return true;
            },

            getLayerIDs: function (includeNotControllable) {
                var ids = [];
                this.list.each(function (layer) {
                    ids.push(layer.getId());
                });
                if (includeNotControllable) {
                    this.listUncontrol.each(function (layer) {
                        ids.push(layer.getId());
                    });
                }
                return ids;
            },
            /**
             * Вернет все известные объекты
             * @returns {Array.<Gis.Objects.Base>}
             */
            getLayers: function () {
                var layers = [];
                this.list.each(function (layer) {
                    layers.push(layer);
                });
                this.listUncontrol.each(function (layer) {
                    layers.push(layer);
                });
                this.listNotForObjectProvider.each(function (layer) {
                    layers.push(layer);
                });
                return layers;
            },

            layerExist: function (layer) {
                return !!this.list.getObject(layer.getType(), layer.getId()) || !!this.listUncontrol.getObject(layer.getType(), layer.getId());
            },
            removeFromSelected: function (layer, notRender) {
                if (layer && layer.isSelectable && layer.isSelectable()) {
                    layer.setSelected(false);
                    this.fire('layerunselected', {layer: layer});
                    delete this.selected[layer.getId()];
                }
                if (!notRender) {
                    this.renderLayer(layer);
                }
                return this;
            },
            getSelected: function () {
                return G.Util.extend({}, this.selected);
            },
            isSelected: function (layer) {
                return !!this.selected[layer.getId()];
            },
            addSelected: function (layer, force) {
                if (layer.isSelectable && layer.isSelectable() && (this.isFilterable(layer.getType()) || force)) {
                    this.selected[layer.getId()] = layer;
                    layer.setSelected(true);
                    this.fire('layerselected', {layer: layer});
                    this.renderLayer(layer);
                }
            },
            clearSelectedOnClick: function (clear) {
                this._clearSelectedOnMapClick = clear;
            },
            isClearOnClick: function () {
                return this._clearSelectedOnMapClick;
            },
            _mapClicked: function () {
                if (this._clearSelectedOnMapClick) {
                    this.clearSelected();
                }
            },
            _layerSelect: function (event) {
                var target = event.target,
                    alreadySelected = this.isSelected(target);
                if (event.force || this.isFilterable(target.getType())) {
                    if (!event.addToSelection) {
                        this.clearSelected(target);
                    }
                    if (event.addToSelection && alreadySelected) {
                        this.removeFromSelected(target);
                    } else {
                        this.addSelected(target, event.force);
                    }
                }
            },
            layerChanged: function (event) {
                var layer = event.target;
                this.renderLayer(layer);
                this.fire(Gis.ObjectController.LAYER_CHANGED_EVENT.TYPE, new Gis.ObjectController.LAYER_CHANGED_EVENT(event));
            },
            _redrawLayer: function (event) {
                var layer = event.target;
                this.renderLayer(layer);
            },
            hideByType: function (layers) {
                this._hideLayersByHidingType('type', layers);
            },
            showByType: function (layers) {
                this._showLayersByHidingType('type', layers);
            },
            hideByIDs: function (layers) {
                this._hideLayersByHidingType('id', layers);
            },
            showByIDs: function (layers) {
                this._showLayersByHidingType('id', layers);
            },
            _showLayersByHidingType: function (type, elements) {
                var arrayToExclude = elements.split(' '), finalArray = [], excluded = this.excluded[type], i, len, isFound = false, isFoundCurrent, arrayToShow = [];
                for (i = 0, len = excluded.length; i < len; i += 1) {
                    isFoundCurrent = arrayToExclude.indexOf(excluded[i]) > -1;
                    isFound = isFound || isFoundCurrent;
                    if (!isFoundCurrent) {
                        finalArray.push(excluded[i]);
                    } else {
                        arrayToShow.push(excluded[i]);
                    }
                }
                if (isFound) {
                    this.excluded[type] = finalArray;
                    this._hideLayers(arrayToShow);
                    this.fire('layervisibilitychanged');
                    this.draw();
                }
            },
            _hideLayersByHidingType: function (type, elements) {
                var newElementsArray = this.excluded[type], tempArray = Gis.Util.isArray(elements) ? elements : elements.split(' '), newArray = [], i, len;
                for (i = 0, len = tempArray.length; i < len; i += 1) {
                    if (newArray.indexOf(tempArray[i]) === -1 && newElementsArray.indexOf(tempArray[i]) === -1) {
                        newArray.push(tempArray[i]);
                    }
                }
                if (!newArray.length) {
                    return this;
                }
                this.excluded[type] = this.excluded[type].concat(newArray);
                this._hideLayers(newArray);
                this.fire('layervisibilitychanged');
                this.draw();
            },
            clearSelected: function (typeExclude) {
                var selected, self = this, key, val;
                selected = this.selected;
                if (selected && Object.keys(selected).length) {
                    for (key in selected) {
                        if (selected.hasOwnProperty(key)) {
                            val = selected[key];
                            if (!typeExclude ||
                                    (val.getType() !== typeExclude && val !== typeExclude &&
                                    (!typeExclude.getParentId || typeExclude.getParentId() !== val.getId()))) {
                                self.removeFromSelected(val);
                            }
                        }
                    }
                    this.draw();
                }
            },
            /**
             *
             * @param type
             * @param [delta]
             * @private
             */
            _incrementType: function (type, delta) {
                delta = delta || 1;
                if (!Gis.Util.isDefine(this._typeCount[type])) {
                    this._typeCount[type] = 0;
                }
                this._typeCount[type] += delta;
            },
            /**
             * Известные типы объектов
             * @returns {Array.<String>}
             */
            getKnownTypes: function () {
                var key, result = [];
                for (key in this._typeCount) {
                    if (this._typeCount.hasOwnProperty(key)) {
                        if (this._typeCount[key] > 0) {
                            result.push(key);
                        }
                    }
                }
                return result;
            },
            /**
             *
             * @param layer
             * @param notFire
             * @fires Gis.ObjectController.LAYER_ADD_EVENT
             */
            addLayer: function (layer, notFire) {
                var awaitForObject;
                if (!this.isValidLayer(layer)) {
                    throw new Error("need valid layer object");
                }
                if (layer.isControllable()) {
                    if (!this.layerExist(layer)) {

                        if (layer.isControllableByServer() !== Gis.FULL_LOCAL) {
                            this.list.add(layer.getType(), layer.getId(), layer);
                        } else {
                            this.listUncontrol.add(layer.getType(), layer.getId(), layer);
                        }
                        this._incrementType(layer.getType());
                        layer.on('change', this.layerChanged, this);
                        layer.on(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE, this._redrawLayer, this);
                        layer.on('customaction', this._onCustomLayerEvent, this);
                        layer.on('needupdate', this._layerFireAutoUpdate, this);
                        layer.on('noneedupdate', this._layerNoNeedAutoUpdate, this);
                        if (layer.isSelectable && layer.isSelectable()) {
                            layer.on('select', this._layerSelect, this);
                        }
                        layer.fire('change', {isAdd: true, target: layer, notFireToServer: !layer.isControllableByServer() || notFire, realRows: Object.keys(layer.getParams()), rows: layer._getRowsChanged(layer.objectOfficialData())});
                        awaitForObject = this._addAfterAdd.getList(layer.getId());
                        if (awaitForObject && awaitForObject.length) {
                            Gis.Logger.log('Есть объекты, ожидающие ' + layer.getId() + ' (' + awaitForObject.length + '). Выполняется повторное добавление ожидающих объектов.');
                            this.clearWaitForObject(layer.getId());
                            setTimeout(function () {
                                var key, len;
                                for (key = 0, len = awaitForObject.length; key < len; key += 1) {
                                    Gis.Map.CURRENT_MAP.addLayer(awaitForObject[key]);
                                }
                            }, 50);
                        }
                    }
                } else {
                    this.listNotForObjectProvider.add(layer.getType(), layer.getId(), layer);
                }
                this.fire(Gis.ObjectController.LAYER_ADD_EVENT.TYPE, new Gis.ObjectController.LAYER_ADD_EVENT(layer));
            },
            getLayer: function (id) {
                return this.list.getObject(id) || this.listUncontrol.getObject(id);
            },
            addToLaterDraw: function (layer) {
                this.renderLayer(layer);
            },

            _realRenderLayer: function (layer) {
                layer._frame_requested = false;
                if (this.stopDraw) {
                    this._drawAfterResume.add(layer.getType(), layer.getId(), layer);
                    return;
                }
                var layerHided = this.isLayerHided(layer);
                if (this.layerExist(layer) && !layerHided) {
                    layer.draw(this._map, this._visibilityController);
                } else if (layerHided) {
                    this.hideLayer(layer);
                }
            },
            renderLayer: function (layer) {
                var self = this,
                    isHided = this.isLayerHided(layer),
                    idealTimePerFrame;
                if (!isHided && !layer._frame_requested) {
                    layer._frame_requested = true;
                    idealTimePerFrame = this.getIdealTimePerFrame();
                    setTimeout(function () {
                        Gis.requestAnimationFrame(100)(function () {
                            self._realRenderLayer(layer);
                        });
                    }, idealTimePerFrame);
                } else if (isHided) {
                    this.hideLayer(layer);
                }
            },
            renderChanged: function () {
                var i, len, layers = this.toRender, layer;
                this.toRender = [];
                for (i = 0, len = layers.length; i < len; i += 1) {
                    layer = layers[i];
                    this._realRenderLayer(layer);
                }
            },
            /**
             * Вызывается для всех слоев, которым нужна перерисовка
             */
            renderFrame: function () {
                this._lastFrameDrawed = Date.now();
                this.renderChanged();
                this._lastFrameDrawed = Date.now() - this._lastFrameDrawed;
            },
            isLayerHided: function (layer) {
                return layer && ((this.excluded.type.indexOf(layer.getType()) !== -1 || this.excluded.id.indexOf(layer.getId()) !== -1)
                    || (!this._visibilityController.isObjectVisible(layer) && !layer.getOption('forcePaint') && !layer.isMetaData()));
            },
            hideLayer: function (layer) {
                var layerDraw,
                    self,
                    key;
                if (this.isLayerHided(layer)) {
                    this._map.removeLayer(layer);
                    layer.fire('hided', {target: layer});
                } else if (layer.selfDraw()) {
                    layerDraw = layer.selfDraw();
                    self = this;
                    for (key in layerDraw) {
                        if (layerDraw.hasOwnProperty(key)) {
                            if (self.excluded.type.indexOf(key) !== -1) {
                                layer.disableDraw(key);
                            } else {
                                layer.enableDraw(key);
                            }
                        }
                    }
                    this.renderLayer(layer);
                }
            },
            /**
             * активировать фильтр выделения в зависимости от типа объекта
             * */
            filterSelect: function (type, noClear) {
                type = type || this._oldFilterSelected;
                var redraw = this._filterSelected !== type;
                this._oldFilterSelected = this._filterSelected;
                this._filterSelected = type;
                if (redraw && !noClear) {
                    this.clearSelected(type);
                } else {
                    this.draw();
                }
            },
            isFilterable: function (type) {
                return !this._filterSelected || this._filterSelected === G.ObjectController.FILTER_ALL || this._filterSelected === type;
            },
            getFilterSelect: function () {
                return this._filterSelected;
            },
            whenAdd: function (waitId, objectToAdd) {
                Gis.Logger.log('Ожидаем ' + waitId + ' для ' + objectToAdd.getType() + '=' + objectToAdd.getId() + ' в течение ' + (TIME_TO_WAIT_OBJECTS / 1000) + 'с.');
                this._addAfterAddRequestedTime[waitId] = this._addAfterAddRequestedTime[waitId] || Date.now();
                this._addAfterAdd.add(waitId, objectToAdd);
            },
            clearWaitForObject: function (id) {
                if (this._addAfterAdd.getList(id) && this._addAfterAdd.getList(id).length) {
                    Gis.Logger.log((!this.getLayer(id) ? ('Объект ' + id + ' не получен. ') : '') + 'Выполняется очистка ожидающих объектов.');
                }
                delete this._addAfterAddRequestedTime[id];
                this._addAfterAdd.clear(id);
            },
            /**
             * base draw function
             * @param {HashList} [elements]
             * */
            draw: function (elements) {
                if (elements && elements.each) {
                    elements.each(this.renderLayer, this);
                    return;
                }
                this.list.each(this.renderLayer, this);
                this.listUncontrol.each(this.renderLayer, this);
            },
            /**
             * base draw function
             * @private
             * @param {string[]} [layers] список слоев
             * */
            _hideLayers: function (layers) {
                var i, len;
                if (layers) {
                    for (i = 0, len = layers.length; i < len; i += 1) {
                        this.hideLayer(this.getLayer(layers[i]));
                    }
                    return;
                }
                this.list.each(this.hideLayer, this);
                this.listUncontrol.each(this.hideLayer, this);
            },
            /**
             * возвращает массив с минимальными и максимальными координатами объектов
             * @param {Array} list id объектов для анализа
             * @private
             * @returns {G.LatLngBounds}
             * */
            _getLatitudeBounds: function (list) {
                var i,
                    len,
                    result = {southWest: [], northEast: []},
                    laylng,
                    layer,
                    southWest,
                    northEast,
                    setted = false;
                for (i = 0, len = list.length; i < len; i += 1) {
                    layer = this.getLayer(list[i]);
                    laylng = layer && layer.getCurrentLatLngBounds();
                    if (laylng) {
                        southWest = laylng.getSouthWest();
                        northEast = laylng.getNorthEast();
                        result.southWest[0] = result.southWest[0] ? Math.min(result.southWest[0], southWest.lat) : southWest.lat;
                        result.southWest[1] = result.southWest[1] ? Math.max(result.southWest[1], southWest.lng) : southWest.lng;
                        result.northEast[0] = result.northEast[0] ? Math.max(result.northEast[0], northEast.lat) : northEast.lat;
                        result.northEast[1] = result.northEast[1] ? Math.min(result.northEast[1], northEast.lng) : northEast.lng;
                        setted = true;
                    }
                }
                return setted ? G.latLngBounds(result.southWest, result.northEast) : false;
            }
        }
    );
    G.ObjectController.FILTER_ALL = -2;
    G.ObjectController.FILTER_NOTHING = -1;
    /**
     * @class
     * @classdesc Событие изменения объекта
     * @event
     * @property {Gis.Objects.Base} target
     * @property {Array.<string>} rows
     * @property {string} type Gis.ObjectController.LAYER_CHANGED_EVENT.TYPE
     */
    Gis.ObjectController.LAYER_CHANGED_EVENT = function (layerChangeEvent) {
        if (!layerChangeEvent) {
            throw new Error("Need layer to bee set");
        }
        Gis.Util.extend(this, layerChangeEvent);
        this.type = Gis.ObjectController.LAYER_CHANGED_EVENT.TYPE;
    };
    /**
     * Тип события изменения объекта
     * @constant
     * @property {string}
     * @default
     */
    Gis.ObjectController.LAYER_CHANGED_EVENT.TYPE = 'layerchanged';
    /**
     * @class
     * @classdesc Событие удаления объекта
     * @event
     * @property {Gis.Objects.Base} target
     * @property {string} type Gis.ObjectController.LAYER_REMOVE_EVENT.TYPE
     */
    Gis.ObjectController.LAYER_REMOVE_EVENT = function (target) {
        if (!target) {
            throw new Error("Need target to bee set");
        }
        this.target = target;
        this.type = Gis.ObjectController.LAYER_REMOVE_EVENT.TYPE;
    };
    /**
     * Тип события удаления объекта
     * @constant
     * @type {string}
     * @default
     */
    Gis.ObjectController.LAYER_REMOVE_EVENT.TYPE = 'layerremove';
    /**
     * @class
     * @classdesc Событие добавления объекта
     * @event
     * @property {Gis.Objects.Base} target
     * @property {string} type Gis.ObjectController.LAYER_ADD_EVENT.TYPE
     */
    Gis.ObjectController.LAYER_ADD_EVENT = function (target) {
        if (!target) {
            throw new Error("Need target to bee set");
        }
        this.target = target;
        this.type = Gis.ObjectController.LAYER_ADD_EVENT.TYPE;
    };
    /**
     * Тип события добавления объекта
     * @constant
     * @type {string}
     * @default
     */
    Gis.ObjectController.LAYER_ADD_EVENT.TYPE = 'layeradd';
    G.Maps.renderer = function (options) {
        return new G.ObjectController(options);
    };
}(Gis));