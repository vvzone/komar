(function () {
    "use strict";
    var visibilityMap,
        START_DRAG_POINT,
        names = {
        relative: 'Относительная',
        absolute: 'Абсолютная'
    },
        types = {
            visibility: 'Прямая видимость',
            ktr: 'Радиодоступность КТР',
            spk: 'Радиодоступность ШПК',
            custom: 'Радиодоступность настройка'
    },
        accuracy,
        instance,
        VISIBILITY_TYPE_KEY = 'visibility-type',
        keyParams = ['Pt', 'Pr', 'A', 'B', 'freq', 'gTr', 'gRec', 'h_a', 'd_k'],
        keyTitles = {'Pt': 'Мощность передатчика', 'Pr': 'Чувствительность приемника', 'A': 'Порог тени', 'B': 'Порог полутени', 'freq': 'Частота, МГц', 'gTr': 'КУ передающей антенны', 'gRec': 'КУ приемной антенны', 'h_a': 'Параметры близлежащей местности', 'd_k': 'Параметры близлежащей местности'},
        customParams = {
            ktr: {
                Pt:31,
                Pr:-180,
                A:10,
                B:5,
                freq:900,
                gTr:2,
                gRec:7,
                h_a:15,
                d_k:0.07
            },
            spk: {
                Pt:35,
                Pr:-90,
                A:8,
                B:5,
                freq:2350,
                gTr:2,
                gRec:20.5,
                h_a:9,
                d_k:0.09
            }
        };

    var classes = ['left', 'center', 'right'];
    function getCustomDataRow(key, index) {
        index = index || 0;
        return '<div class="additional-row visibility-' + classes[index] + '"><label>' + key + '</label>' + instance._HTMLRowInput(customParams.ktr[key], 'visibility-' + key, 'visibility-input', keyTitles[key]) + '</div>'
    }

    /**
     *
     * Параметры области видимости
     * @class
     * @extends Gis.Widget.Propertys
     */
    Gis.Widget.VisilibityProperty = Gis.Widget.Propertys.extend(
        /**
         * @lends Gis.Widget.VisilibityProperty.prototype
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

                this._revertTextData(this._$ALEAL_HEIGHTrow);
                this._revertTextData(this._$HEIGHTrow);
                this._revertTextData(this._$radiusRow);
                this._center = null;
                this.updateData();
                if (this.options.dataBinded) {
                    this._updateCircleFromWidget();
                }
            },
            getCenter: function () {
                return this._center || (this.options.dataBinded && this.options.dataBinded.getCenter());
            },
            /**
             *
             * @param {number} height
             * @param {number} center
             * @param {number} radius
             * @param {boolean} noFill
             * @private
             */
            _setData: function (height, center, radius, noFill) {
                var x, y, arealHeight, centerSaved;

                if (!noFill && this.options.dataBinded) {
                    this._list.setValueSelected(this.options.dataBinded.getOption('alt-type'));
                    this._list2.setValueSelected(this.options.dataBinded.getOption('areal-alt-type'));
                    this._list3.setValueSelected(this.options.dataBinded.getOption('accuracy'));
                    this._list4.setValueSelected(this.options.dataBinded.getOption(VISIBILITY_TYPE_KEY));
                    if (!this.isUiDrawed()) {
                        this.drawCircle();
                    }
                }
                center = this.coordinateToTemplate(this.getCenter());
                centerSaved = this.options.dataBinded && this.options.dataBinded.getCenter();
                centerSaved = (centerSaved && this.coordinateToTemplate(centerSaved)) || center;
                x = center.x || "";
                y = center.y || "";
                radius = radius || (this.options.dataBinded && this.options.dataBinded.getRadius()) || L.ReliefControlCircle.getInstance().getRadius();
                height = height || ((this.options.dataBinded && this.options.dataBinded.getHeight()) || this._$HEIGHTrow.val());
                arealHeight = ((this.options.dataBinded && this.options.dataBinded.getArealHeight()) || this._$ALEAL_HEIGHTrow.val());
                if (this.isUiDrawed() || this.options.dataBinded) {
                    this._setValue(this._$HEIGHTrow, height, !noFill ? height : this.options.dataBinded && this.options.dataBinded.getHeight());
                    this._setValue(this._$ALEAL_HEIGHTrow, arealHeight, !noFill ? arealHeight : this.options.dataBinded && this.options.dataBinded.getArealHeight());
                    this._setValue(this._$radiusRow, radius, !noFill ? radius : this.options.dataBinded && this.options.dataBinded.getRadius());
                }
                this.setHtmlPointSelectorWidgetData(
                    this._$CoordinateContainer,
                    Gis.UI.coordinate(x, y), !noFill ? Gis.UI.coordinate(x, y) : Gis.UI.coordinate(centerSaved.x, centerSaved.y)
                );
                keyParams.forEach(function (value) {
                    var $row = $('#visibility-' + value, instance._$additionalData);
                    var rowVal = (instance.options.dataBinded && instance.options.dataBinded.getOption(value)) || $row.val();
                    instance._setValue($row,
                        rowVal, rowVal);
                });
            },
            _hilightErrors: function () {
                return this.checkPoint(this._$CoordinateContainer) ||
                    this.checkNumeric(this._$HEIGHTrow) ||
                    this.checkNumeric(this._$ALEAL_HEIGHTrow) ||
                    this.checkNumeric(this._$radiusRow) ||
                    this.checkAdditionalOk();
            },

            updateData: function () {
                this._setData();
                this._updateState();
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
                this._$div.addClass(Gis.Widget.VisilibityProperty.CLASS_NAME);
                this._$CoordinateContainer = $('#center-selector', this._$div);
                this._$Xrow = $('#visibility-x', this._$div);
                this._$Yrow = $('#visibility-y', this._$div);
                this._$HEIGHTrow = $('#visibility-height', this._$div);
                this._$ALEAL_HEIGHTrow = $('#visibility-areal-height', this._$div);
                this._$radiusRow = $('#visibility-radius', this._$div);
                this._$additionalData = $('.visibility-additional-data', this._$div);
                this._initLists();
            },
            _updateTypeState: function () {
                this._$additionalData[this.isCustomType() ? 'addClass' : 'removeClass']('show');
                Gis.Widget.Propertys.prototype._updateTypeState.call(this);
            },
            _getRadioParams: function () {
                var predefineParams = customParams[this._list4.getValueSelected()], result = {}, $additional = this._$additionalData;
                if (predefineParams) {
                    return Gis.Util.extend(result, predefineParams);
                }
                keyParams.forEach(function (value) {
                    result[value] = $('#visibility-' + value, $additional).val();
                });
                return result;
            },
            _getTypeName: function (type) {
                return names[type];
            },
            _getListValues: function (values) {
                var data = [], key;
                for (key in values) {
                    if (values.hasOwnProperty(key)) {
                        data.push({
                            val: key,
                            name: values[key]
                        });
                    }
                }
                return data;
            },
            _getTypeValues: function () {
                return this._getListValues(names);
            },
            _getVisibilityTypeValues: function () {
                return this._getListValues(types);
            },
            _getAccuracyValues: function () {
                return this._getListValues(accuracy);
            },
            _initLists: function () {
                var self = this,
                    altType = (this.options.dataBinded && this.options.dataBinded.getOption('alt-type')) || self._altType || 'relative',
                    arealType = (this.options.dataBinded && this.options.dataBinded.getOption('areal-alt-type')) || self._arealType || 'relative',
                    visibilityType = (this.options.dataBinded && this.options.dataBinded.getOption(VISIBILITY_TYPE_KEY)) || self._visibilityType || 'visibility',
                    accuracyValue = (this.options.dataBinded && this.options.dataBinded.getOption('accuracy')) || self._accuracy || 0;
                this._list = Gis.HTML.listView({
                    data: this._getTypeValues(),
                    container: $('#type-alt-selector', this._$div)[0],
                    callback: function (type) {
                        self._altType = type;
                        self._updateState();
                    },
                    context: this,
                    defaultValue: {val: altType, name: this._getTypeName(altType)}
                });
                this._list2 = Gis.HTML.listView({
                    data: this._getTypeValues(),
                    container: $('#type-areal-alt-selector', this._$div)[0],
                    callback: function (type) {
                        self._arealType = type;
                        self._updateState();
                    },
                    context: this,
                    defaultValue: {val: arealType, name: this._getTypeName(arealType)}
                });
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
                this._list4 = Gis.HTML.listView({
                    data: this._getVisibilityTypeValues(),
                    container: $('#type-selector', this._$div)[0],
                    callback: function (type) {
                        self._visibilityType = type;
                        self._updateState();
                    },
                    context: this,
                    defaultValue: {val: visibilityType, name: types[visibilityType]}
                });
            },
            setBounds: function () {
//                var maxHeight, heightContainer;
//                heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
//                maxHeight = heightContainer  - Gis.Widget.Scheme.needHeight(heightContainer);
//                $('.scroller').css({
//                    maxHeight: maxHeight - $('.gis-widget-propertys-buttons-wraper', this._$div).outerHeight(true)
//                });
            },
            initDataBlock: function () {
                var center = (this.options.dataBinded && this.options.dataBinded.getLatLng()) || "",
                    centerTemplated = this.coordinateToTemplate(center),
                    centerX = centerTemplated.x || '',
                    centerY = centerTemplated.y || '';
                return "<div class='vis-wrapper'>" +
                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Область</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                    "<ul id='center-selector' class='inline-points'>\n" +
                    this._HTMLPointSelectorWidget({
                        tag: 'li',
                        tagClass: 'data-coll',
                        x: centerX,
                        y: centerY,
                        xID: 'visibility-x',
                        yID: 'visibility-y',
                        yClass: 'visibility-input',
                        xClass: 'visibility-input'
                    }) +
                    "</ul>\n" +

                    "<div>\n" +
                    "<ul>\n" +
                    "<li class='data-row'><span>Радиус:</span>" + this._HTMLRowInput("", 'visibility-radius', 'visibility-radius') + "</li>\n" +
                    "</ul>\n" +
                    "</div>\n" +


                    "</div>\n" +
                    "</div>\n" +


                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Тип</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +

                    "<div>\n" +
                    "<ul>\n" +
                    "<li class='data-row'><span id='type-selector'></span></li>\n" +
                    "</ul>\n" +
                    "</div>\n" +

                    "</div>\n" +
                    "</div>\n" +

                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Высота в центральной точке</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +

                    "<div>\n" +
                    "<ul>\n" +
                    "<li class='data-row visibility-h'><span id='type-alt-selector'></span>" + this._HTMLRowInput("0", 'visibility-height', 'visibility-input visibility-right') + "</li>\n" +
                    "</ul>\n" +
                    "</div>\n" +

                    "</div>\n" +
                    "</div>\n" +


                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Высота в расчетных точках</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +

                    "<div>\n" +
                    "<ul>\n" +
                    "<li class='data-row visibility-h'><span id='type-areal-alt-selector'></span>" + this._HTMLRowInput("0", 'visibility-areal-height', 'visibility-input') + "</li>\n" +
                    "</ul>\n" +
                    "</div>\n" +

                    "</div>\n" +
                    "</div>\n" +

                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Детальность</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +

                    "<div>\n" +
                    "<ul>\n" +
                    "<li class='data-row visibility-accuracy'><span id='accuracy-selector'></span></li>\n" +
                    "</ul>\n" +
                    "</div>\n" +

                    "</div>\n" +
                    "</div>\n" +

                    "</div>\n"+ //a vis-wrapper

                    "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + " visibility-additional-data'>\n" +
                    "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Параметры радиовидимости</div>\n" +
                    "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +

                    "<div>\n" +
                    "<ul>\n" +
                    "<li class='data-row visibility-data'>" +
                    getCustomDataRow('Pt', 0) +
                    getCustomDataRow('Pr', 1) +
                    getCustomDataRow('A', 2) +
                    "</li>\n" +
                    "<li class='data-row visibility-data'>" +
                    getCustomDataRow('freq', 0) +
                    getCustomDataRow('gTr', 1) +
                    getCustomDataRow('B', 2) +
                    "</li>\n" +
                    "<li class='data-row visibility-data'>" +
                    getCustomDataRow('h_a', 0) +
                    getCustomDataRow('gRec', 1) +
                    getCustomDataRow('d_k', 2) +
                    "</li>\n" +
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
            getSelectedType: function () {
                return $('.gis-image-type-button.selected', this._$div).data('type');
            },
            typeChanged: function () {
                return this.options.dataBinded && (this.options.dataBinded.getOption('alt-type') !== this._list.getValueSelected() ||
                    this.options.dataBinded.getOption('areal-alt-type') !== this._list2.getValueSelected());
            },
            accuracyChanged: function () {
                return this.options.dataBinded && this.options.dataBinded.getOption('accuracy') !== this._list3.getValueSelected();
            },
            visibilityTypeChanged: function () {
                var dataBinded = this.options.dataBinded;
                if (dataBinded) {
                    var typeChanged = dataBinded.getVisibilityType() !== this._list4.getValueSelected();
                    if (typeChanged) {
                        return true;
                    } else if (this.isCustomType()) {
                        for (var i = 0, len = keyParams.length; i < len; i += 1) {
                            if ($('#visibility-' + keyParams[i], this._$additionalData).val() !== dataBinded.getOption(keyParams[i])) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            isCustomType: function () {
                return this._list4.getValueSelected() === 'custom';
            },
            _isStateChanged: function () {
                var changed;
                changed = this._rowChanged(this._$Xrow)||
                    this._rowChanged(this._$Yrow) ||
                    this._rowChanged(this._$HEIGHTrow) ||
                    this._rowChanged(this._$radiusRow) ||
                    this._rowChanged(this._$ALEAL_HEIGHTrow) ||
                    this.typeChanged() ||
                    this.accuracyChanged() ||
                    this.visibilityTypeChanged();
                return changed;
            },
            checkAdditionalOk: function () {
                var dataBinded = this.options.dataBinded;
                if (dataBinded && this.isCustomType()) {
                    for (var i = 0, len = keyParams.length; i < len; i += 1) {
                        if (!Gis.Util.isNumeric($('#visibility-' + keyParams[i], this._$additionalData).val())) {
                            return true;
                        }
                    }
                }
                return false;
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
            _mouseDown: function (e) {
                if (instance.checkBaseLayer() && !instance.isUiDrawed()) {
                    this.setDraggableEnabled(false);
                    START_DRAG_POINT = e;
                    instance.drawCircle(e);
                    this.on('mousemove', instance._mouseMove, this);
                }
            },
            _mouseMove: function (e) {
                if (START_DRAG_POINT) {
                    instance.drawCircle(START_DRAG_POINT, e);
                    this.on('mouseup', instance._mouseUp, this);
                }
            },
            _mouseUp: function (e) {
                instance.drawCircle(START_DRAG_POINT, e);
                START_DRAG_POINT = null;
                this.setDraggableEnabled(true);
                this.off('mouseup', instance._mouseUp, this);
                this.off('mousemove', instance._mouseMove, this);
            },
            _saveData: function (x, y, text, radius, forceNew) {
                var arealHeight, projectedPoint = this.templateToCoordinate(this.getPointValue(this._$Xrow), this.getPointValue(this._$Yrow)), data;
                x = x || projectedPoint.x;
                y = y || projectedPoint.y;
                radius = radius || this._$radiusRow.val();
                text = text || this._$HEIGHTrow.val();
                arealHeight = this._$ALEAL_HEIGHTrow.val();
                if (Gis.Util.isNumeric(x) && Gis.Util.isNumeric(y) && Gis.Util.isNumeric(text) && Gis.Util.isNumeric(radius)) {
                    this.drawCircle();
                    data = {
                        alt: text,
                        'areal-alt': arealHeight,
                        'alt-type': this._list.getValueSelected(),
                        'areal-alt-type': this._list2.getValueSelected(),
                        'accuracy': this._list3.getValueSelected(),
                        radius: radius,
                        center: Gis.latLng(y, x)
                    };
                    Gis.Util.extend(data, this._getRadioParams());
                    data[VISIBILITY_TYPE_KEY] = this._list4.getValueSelected();
                    if (!visibilityMap) {
                        visibilityMap = Gis.visibilitymap(Gis.extend({id: Gis.Util.generateGUID(), selectable: true}, data));
                    } else {
                        visibilityMap.setData(data);
                    }
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
                this._center = L.ReliefControlCircle.getInstance().getCenter();
                this._radius = Math.round(L.ReliefControlCircle.getInstance().getRadius());
                this._setData(null, this._center, this._radius, true);
                this._updateState()
            },
            _deleteKeyFire: function (e) {
                Gis.UI.DeleteActions.visibility.call(this, e);
            },
            removeCircle: function () {
                Gis.Map.CURRENT_MAP.options.provider.map.removeLayer(L.ReliefControlCircle.getInstance());
            },
            onRemove: function () {
            this.removeCircle();
            Gis.Widget.Propertys.prototype.onRemove.call(this);
        },
            drawCircle: function (e, e2) {
                var self = this;
                e2 = e2 || e;
                Gis.Util.loadKinetic(function () {
                    L.ReliefControlCircle.getInstance(!self.options.dataBinded && e && e.latLng && {
                        center: L.latLng(e.latLng.latitude, e.latLng.longitude),
                        draggedPoint: L.latLng(e2.latLng.latitude, e2.latLng.longitude)
                    }).addTo(Gis.Map.CURRENT_MAP.options.provider.map);
                });
            }, _mapClicked: function (e) {
            if (!this.isUiDrawed()) {
                this.drawCircle(e);
            }
        },
            isUiDrawed: function () {
                return Gis.Map.CURRENT_MAP.options.provider.map.hasLayer(L.ReliefControlCircle.getInstance());
            },
            _deInitEvents: function () {
                L.ReliefControlCircle.getInstance().off('add', this.dragend, this);
                L.ReliefControlCircle.getInstance().off('dragend', this.dragend, this);
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
            _updateCircleFromWidget: function () {
                if (!this._hilightErrors()) {
                    var p = this.templateToCoordinate(this.getPointValue(this._$Xrow), this.getPointValue(this._$Yrow));
                    L.ReliefControlCircle.getInstance().setOptions({
                        center: L.latLng(p.y, p.x),
                        radius: this._$radiusRow.val()
                    }, true);
                }
            }, _initEvents: function () {
                var self = this;
                this.updateCircleFromWidget = function () {
                    self._updateCircleFromWidget();
                };
                L.ReliefControlCircle.getInstance().on('add', this.dragend, this);
                L.ReliefControlCircle.getInstance().on('dragend', this.dragend, this);
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

    Gis.UI.DeleteActions.visibility = function (e, dataBinded) {
        var self = this;
        if ((e.srcElement || e.target).type !== 'visibility') {
            this._deleteLayerConfirm({
                title: 'Вы действительно хотите удалить область видимости?',
                callback: function () {
                    self.removeLayerFromMap(dataBinded || self.options.dataBinded);
                },
                context: this,
                id: 'visibility-remove-dialog'
            }, dataBinded);
        }
    };
    Gis.Widget.VisilibityProperty.CLASS_NAME = "gis-widget-propertys-visibility";
    Gis.Widget.visilibityProperty = function (data) {
        return instance || new Gis.Widget.VisilibityProperty(data);
    };
}());