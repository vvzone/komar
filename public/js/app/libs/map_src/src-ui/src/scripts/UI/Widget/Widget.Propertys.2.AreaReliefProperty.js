(function () {
    "use strict";
    var visibilityMap,
        accuracy,
        instance,
        START_DRAG_POINT;
    /**
     *
     * Параметры области видимости
     * @class
     * @extends Gis.Widget.Propertys
     */
    Gis.Widget.AreaReliefProperty = Gis.Widget.Propertys.extend(
        /**
         * @lends Gis.Widget.AreaReliefProperty.prototype
         */
        {
            _history: [],
            /**
             * Допустимые параметры
             */
            options: {
                types: undefined,
                colors: undefined
            },
            _type: 'object',
            initialize: function (data) {
                instance = this;
                Gis.Widget.Propertys.prototype.initialize.call(this, data);
                accuracy = Gis.config('gis.ui.areal-accuracy-list') || {
                    0: 'Низкая',
                    2: 'Средняя',
                    4: 'Высокая'
                }
                if (this.options.dataBinded) {
                    this.options.dataBinded.on('change', this.updateData, this);
                }
            },
            _updateHistory: function () {
                this._updateState();
            },
            back: function () {
                if (!this._isStateChanged()) {
                } else {
                }
                if (!this.options.dataBinded) {
                    this.removeCircle();
                }
                this.revertHtmlPointSelectorWidgetData(this._$northWestContainer);
                this.revertHtmlPointSelectorWidgetData(this._$southEastContainer);
                this._southEast = null;
                this._northWest = null;
                this.updateData();
            },
            getNorthWest: function () {
                return this._northWest || (this.options.dataBinded && this.options.dataBinded.getNorthWest());
            },
            getSouthEast: function () {
                return this._southEast || (this.options.dataBinded && this.options.dataBinded.getSouthEast());
            },
            /**
             *
             * @param {number} height
             * @param {L.LatLng} northWest
             * @param {L.LatLng} southEast
             * @param {boolean} noFill
             * @private
             */
            _setData: function (northWest, southEast, noFill, noDrawSquare) {
                var x, y, coordSaved;
                if (!noFill && this.options.dataBinded) {
                    this._list3.setValueSelected(this.options.dataBinded.getOption('accuracy'));
                    if (!noDrawSquare) {
                        L.ReliefControlSquare.getInstance().setOptions({
                            bounds: this.options.dataBinded.getArealBounds()
                        });
                        this._drawSquare();
                    }
                }
                northWest = this.coordinateToTemplate(this.getNorthWest());
                coordSaved = this.options.dataBinded && this.options.dataBinded.getNorthWest();
                coordSaved = (coordSaved && this.coordinateToTemplate(coordSaved)) || northWest;
                x = northWest.x || "";
                y = northWest.y || "";
                this.setHtmlPointSelectorWidgetData(
                    this._$northWestContainer,
                    Gis.UI.coordinate(x, y), !noFill ? Gis.UI.coordinate(x, y) : null
                );
                southEast = this.coordinateToTemplate(this.getSouthEast());
                coordSaved = this.options.dataBinded && this.options.dataBinded.getSouthEast();
                coordSaved = (coordSaved && this.coordinateToTemplate(coordSaved)) || southEast;
                x = southEast.x || "";
                y = southEast.y || "";
                this.setHtmlPointSelectorWidgetData(
                    this._$southEastContainer,
                    Gis.UI.coordinate(x, y), !noFill ? Gis.UI.coordinate(x, y) : null
                );
            },
            _hilightErrors: function () {
                return this.checkPoint(this._$northWestContainer) ||
                    this.checkPoint(this._$southEastContainer);
            },

            updateData: function () {
                this._setData(null, null, !this.options.dataBinded);
                this.initGradientList(this._$div, this.options.dataBinded);
                if (!this._pressed) {
                    this._updateColor();
                }
                this._updateState();
            },
            _updateColor: function () {
                //TODO
            },
            draw: function () {
                Gis.Widget.Propertys.prototype.draw.call(this);
                var selected = Gis.Map.CURRENT_MAP.getSelected(),
                    keys = Object.keys(selected);
                if (keys.length > 1) {
                    this.options.dataBinded = undefined;
                } else if (keys.length && selected[keys[0]].getType() === 'text') {
                    this.options.dataBinded = selected[keys[0]];
                }
                this.updateData();
//                setTimeout(function () {
//                    if (visibilityMap) {
//                        if (!Gis.Map.CURRENT_MAP.hasLayer(visibilityMap)) {
//                            visibilityMap.addTo(Gis.Map.CURRENT_MAP);
//                        }
//                        Gis.Map.CURRENT_MAP.selectLayer(visibilityMap);
//                    }
//                });
            },
            initHTML: function () {
                Gis.Widget.Propertys.prototype.initHTML.call(this);
                this._$div.addClass(Gis.Widget.AreaReliefProperty.CLASS_NAME);
                this._$northWestContainer = $('#north-west-selector', this._$div);
                this._$southEastContainer = $('#south-east-selector', this._$div);
                this._initLists();
                this.initGradientList(this._$div);
            },
            _getTypeName: function (type) {
                return names[type];
            },
            _getTypeValues: function () {
                var data = [], key;
                for (key in names) {
                    if (names.hasOwnProperty(key)) {
                        data.push({
                            val: key,
                            name: names[key]
                        });
                    }
                }
                return data;
            },
            _getAccuracyValues: function () {
                var data = [], key;
                for (key in accuracy) {
                    if (accuracy.hasOwnProperty(key)) {
                        data.push({
                            val: key,
                            name: accuracy[key]
                        });
                    }
                }
                return data;
            },
            _initLists: function () {
                var self = this,
                    accuracyValue = (this.options.dataBinded && this.options.dataBinded.getOption('accuracy')) || self._accuracy || 0;
                this._list3 = Gis.HTML.listView({
                    data: this._getAccuracyValues(),
                    container: $('#accuracy-selector', this._$div)[0],
                    callback: function (type) {
                        self._accuracy = type;
                        self._updateState();
                    },
                    context: this,
                    defaultValue: {val: accuracyValue, name: accuracy[accuracyValue]}
                });
            },
            initDataBlock: function () {
                var center = (this.options.dataBinded && this.options.dataBinded.getLatLng()) || "",
                    centerTemplated = this.coordinateToTemplate(center),
                    centerX = centerTemplated.x || '',
                    centerY = centerTemplated.y || '';
                return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +

                    "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Вид</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
                    this._HTMLgradientSelector(this.options.dataBinded) +
                    "</div>" +
                    "</div>\n" +

                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Область</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                    "<ul id='north-west-selector' class='inline-points'>\n" +
                    this._HTMLPointSelectorWidget({
                        tag: 'li',
                        tagClass: 'data-coll',
                        x: centerX,
                        y: centerY,
                        xID: 'areal-x-1',
                        yID: 'areal-y-1',
                        yClass: 'areal-y',
                        xClass: 'areal-x'
                    }) +
                    "</ul>\n" +
                    "<ul id='south-east-selector' class='inline-points'>\n" +
                    this._HTMLPointSelectorWidget({
                        tag: 'li',
                        tagClass: 'data-coll',
                        x: centerX,
                        y: centerY,
                        xID: 'areal-x-2',
                        yID: 'areal-y-2',
                        yClass: 'areal-y',
                        xClass: 'areal-x'
                    }) +
                    "</ul>\n" +


                    "</div>\n" +
                    "</div>\n" +

                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Детальность</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +

                    "<div>\n" +
                    "<ul>\n" +
                    "<li class='data-row visibility-accuracy'><span id='accuracy-selector'></span>\n" +
                    "</ul>\n" +
                    "</div>\n" +

                    "</div>\n" +
                    "</div>\n";
            },
            initButtonsBlock: function () {
                return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
                    "<ul class='gis-property-buttons-list'>\n" +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Новая', !this.options.dataBinded) + "</li>\n" +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                    "</ul>\n" +
                    "</div>\n";
            },
            accuracyChanged: function () {
                return this.options.dataBinded && this.options.dataBinded.getOption('accuracy') !== this._list3.getValueSelected()
            },
            getXrow: function ($container) {
                return $('.areal-x', $container);
            },
            getYrow: function ($container) {
                return $('.areal-y', $container);
            },
            _isStateChanged: function () {
                var changed;
                changed = this._rowChanged(this.getXrow(this._$northWestContainer)) ||
                    this._rowChanged(this.getYrow(this._$northWestContainer)) ||
                    this._rowChanged(this.getXrow(this._$southEastContainer)) ||
                    this._rowChanged(this.getYrow(this._$southEastContainer)) ||
                    this.accuracyChanged() ||
                    (this.options.dataBinded && (!this._equalsColor(this.options.dataBinded) ||
                        (this.options.dataBinded && this.getSelectedStyle() !== this.options.dataBinded.getTag('style'))));
                return changed || (!this.options.dataBinded && this.isUiDrawed());
            },
            _updateButtonState: function () {
                var buttonSaveText,
                    isStateChanged = this._isStateChanged();
                this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
                this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
                this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
                buttonSaveText = this.options.dataBinded && isStateChanged ? "Подтвердить" : !this.options.dataBinded ? "Новая" : "Подтвердить";
                $('.gis-button-text', this._$buttonNew).html(buttonSaveText);
                var isDataEditable = this.isDataEditable();
                this.switchButtonState(this._$buttonNew, isDataEditable && !this._hilightErrors());
                this.switchButtonState(this._$buttonDelete, isDataEditable && this.options.dataBinded && this.options.dataBinded.isEditableByUser());
                this.switchButtonState(this._$buttonRevert, isDataEditable && isStateChanged);
                this._$div.tooltip('close');

            },
            _saveData: function (x, y, x2, y2, forceNew) {
                var projectedPoint = this.templateToCoordinate(this.getPointValue(this.getXrow(this._$northWestContainer)), this.getPointValue(this.getYrow(this._$northWestContainer))),
                    projectedPoint2 = this.templateToCoordinate(this.getPointValue(this.getXrow(this._$southEastContainer)), this.getPointValue(this.getYrow(this._$southEastContainer))),
                    data;
                x = x || projectedPoint.x;
                y = y || projectedPoint.y;
                x2 = x2 || projectedPoint2.x;
                y2 = y2 || projectedPoint2.y;
                if (Gis.Util.isNumeric(x) && Gis.Util.isNumeric(y) && Gis.Util.isNumeric(x2) && Gis.Util.isNumeric(y2)) {
                    this.drawSquare();
                    data = {
                        accuracy: this._list3.getValueSelected(),
                        n: y,
                        s: y2,
                        w: x,
                        e: x2
                    };
                    if (!visibilityMap) {
                        visibilityMap = Gis.arealRelief(Gis.extend({id: Gis.Util.generateGUID(), selectable: true}, data));
                    } else {
                        visibilityMap.setData(data);
                    }
                    var selectedColorList = this.getSelectedColorList();
                    visibilityMap.setUserSelectedGradient(selectedColorList && Gis.Objects.HeatMap.unParseColors(selectedColorList));
                    if (!Gis.Map.CURRENT_MAP.hasLayer(visibilityMap)) {
                        visibilityMap.addTo(Gis.Map.CURRENT_MAP);
                    }
                    Gis.Map.CURRENT_MAP.selectLayer(visibilityMap);
                    this._updateState();
                } else {
                    this._updateState();
                }
            },
            dragend: function (e) {
                this._northWest = L.ReliefControlSquare.getInstance().getNorthWest();
                this._southEast = L.ReliefControlSquare.getInstance().getSouthEast();
                this._setData(this._northWest, this._southEast, true, true);
                this._updateState()
            },
            _deleteKeyFire: function (e) {
                Gis.UI.DeleteActions[Gis.Objects.ArealRelief.prototype.options.tacticObjectType].call(this, e);
            },
            removeCircle: function () {
                Gis.Map.CURRENT_MAP.options.provider.map.removeLayer(L.ReliefControlSquare.getInstance());
            }, onRemove: function () {
            this.removeCircle();
            Gis.Widget.Propertys.prototype.onRemove.call(this);
        },
            _drawSquare: function (latLng, latLng2) {
                var self = this;
                Gis.Util.loadKinetic(function () {
                    L.ReliefControlSquare.getInstance(!self.options.dataBinded && latLng && latLng2 && {
                        bounds: L.latLngBounds(latLng, latLng2)
                    }).addTo(Gis.Map.CURRENT_MAP.options.provider.map);
                });
            }, drawSquare: function (e, e2) {
                var self = this;
                if (e && e.latLng) {
                    var latLng = L.latLng(e.latLng.latitude, e.latLng.longitude);
                    var latLng2 = L.latLng((e2 || e).latLng.latitude, (e2 || e).latLng.longitude);
                    self._drawSquare(latLng, latLng2);
                }
            },
            _mapClicked: function (e) {
                if (!instance.isUiDrawed()) {
                    this.drawSquare(e);
                }
            },
            _mouseDown: function (e) {
                if (instance.checkBaseLayer() && !instance.isUiDrawed()) {
                    this.setDraggableEnabled(false);
                    START_DRAG_POINT = e;
                    instance.drawSquare(e);
                    this.on('mousemove', instance._mouseMove, this);
                }
            },
            _mouseMove: function (e) {
                if (START_DRAG_POINT) {
                    instance.drawSquare(START_DRAG_POINT, e);
                }
                this.on('mouseup mouseleave', instance._mouseUp, this);
            },
            _mouseUp: function (e) {
                instance.drawSquare(START_DRAG_POINT, e);
                START_DRAG_POINT = null;
                this.setDraggableEnabled(true);
                this.off('mouseup', instance._mouseUp, this);
                this.off('mousemove', instance._mouseMove, this);
            },
            isUiDrawed: function () {
                return Gis.Map.CURRENT_MAP.options.provider.map.hasLayer(L.ReliefControlSquare.getInstance());
            },
            _deInitEvents: function () {
                L.ReliefControlSquare.getInstance().off('add', this.dragend, this);
                L.ReliefControlSquare.getInstance().off('dragend', this.dragend, this);
                this._$div.off('click', '.point-direction', this.updateCircleFromWidget);
                $('.data-row input', this._$div).off({
                    change: this._textRowChange,
                    keyup: this._textRowChange
                });
                $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
                    click: this._returnFunction,
                    keyup: this._KeyUpReturnFunction
                });
                $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
                    click: this._revertFunction,
                    keyup: this._KeyUpRevertFunction
                });
                if (this.options.dataBinded) {
                    this.options.dataBinded.off('change', this.updateData, this);
                }
                $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
                    click: this._deleteFunction,
                    keyup: this._KeyUpDeleteFunction
                });
                var map = this._containerController.getUIAttached().getMap();
                map.off('mousedown', this._mouseDown, map);
                Gis.Widget.Propertys.prototype._deInitEvents.call(this);
                this._destroyColorPicker($('#object-new-dialog'));
            },
            _updateSquareFromWidget: function () {
                if (!this._hilightErrors()) {

                    var projectedPoint = this.templateToCoordinate(this.getPointValue(this.getXrow(this._$northWestContainer)), this.getPointValue(this.getYrow(this._$northWestContainer))),
                        projectedPoint2 = this.templateToCoordinate(this.getPointValue(this.getXrow(this._$southEastContainer)), this.getPointValue(this.getYrow(this._$southEastContainer)));
                    this._drawSquare(L.latLng(projectedPoint.y, projectedPoint.x), L.latLng(projectedPoint2.y, projectedPoint2.x));
                }
            }, _initEvents: function () {
                var self = this;
                this.updateCircleFromWidget = function () {
                    self._updateSquareFromWidget();
                };
                L.ReliefControlSquare.getInstance().on('add', this.dragend, this);
                L.ReliefControlSquare.getInstance().on('dragend', this.dragend, this);
                function generateEnteredFunction(callback) {
                    return function (e) {
                        var returnKeyCode = 13;
                        if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                            callback();
                        }
                    };
                }
                this._returnFunction = this._returnFunction || function () {
                    if (self.isButtonEnable(this) && self.checkBaseLayer()) {
                        self._saveData();
                    }
                };
                this._deleteFunction = this._deleteFunction || function (e) {
                    if (self.isButtonEnable(this)) {
                        self._deleteKeyFire(e);
                    }
                };
                this._textRowChange = this._textRowChange || function (e) {
                    self._updateState();
                    e.stopPropagation();
                    self.updateCircleFromWidget();
                };
                this._textRowKeyPress = this._textRowKeyPress || function () {
                    self._updateState();
                };
                this._revertFunction = this._revertFunction || function () {
                    if (self.isButtonEnable(this)) {
                        self.back();
                    }
                };
                this._KeyUpReturnFunction = this._KeyUpReturnFunction || generateEnteredFunction(self._deleteFunction);
                this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || generateEnteredFunction(self._returnFunction);
                this._KeyUpRevertFunction = this._KeyUpRevertFunction || generateEnteredFunction(self._revertFunction);
                $('.data-coll input, .data-row input', this._$div).on({
                    change: this._textRowChange,
                    keyup: this._textRowChange,
                    keydown: this.keyPressPreventDefault
                });
                this._$div.on('click', '.point-direction', this.updateCircleFromWidget);
                $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
                    click: this._returnFunction,
                    keyup: this._KeyUpReturnFunction
                });
                $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
                    click: this._revertFunction,
                    keyup: this._KeyUpRevertFunction
                });
                $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).on({
                    click: this._deleteFunction,
                    keyup: this._KeyUpDeleteFunction
                });
            var map = this._containerController.getUIAttached().getMap();
            map.on('mousedown', this._mouseDown, map);
                Gis.Widget.Propertys.prototype._initEvents.call(this);
            },
            _update: function () {
                this.updateData();
            },
            bindData: function (data) {
                $(':focus').blur();
                if (data !== this.options.dataBinded) {
                    if (this.options.dataBinded) {
                        this.options.dataBinded.off('change', this.updateData, this);
                    }
                    if (data) {
                        data.on('change', this.updateData, this);
                    } else {
                        this.removeCircle();
                    }
                    Gis.Widget.Propertys.prototype.bindData.call(this, data);
                    this.updateData();
                }
            }
        });

    Gis.UI.DeleteActions[Gis.Objects.ArealRelief.prototype.options.tacticObjectType] = function (e, dataBinded) {
        var self = this;
        if ((e.srcElement || e.target).type !== 'visibility') {
            this._deleteLayerConfirm({
                title: 'Вы действительно хотите удалить рельеф?',
                callback: function () {
                    self.removeLayerFromMap(dataBinded || self.options.dataBinded);
                },
                context: this,
                id: 'visibility-remove-dialog'
            }, dataBinded);
        }
    };
    Gis.Widget.AreaReliefProperty.CLASS_NAME = "gis-widget-propertys-visibility";
    Gis.Widget.AreaReliefProperty.include(Gis.gradientWidget);
    Gis.Widget.areaReliefProperty = function (data) {
        if (instance) {
            if (data) {
                instance.setData(data);
            }
        } else {
            new Gis.Widget.AreaReliefProperty(data);
        }
        return instance;
    };
}());