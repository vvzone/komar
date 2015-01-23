"use strict";
/**
 *
 * @class
 * @extends Gis.Widget.Propertys
 */
Gis.Widget.SectorProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.SectorProperty.prototype
     */
    {
        _typeSelector: true,
        _type: 'sector',
        _history: [],
        _defaultStyle: {
            color: '#AF2D51',
            border: 'white',
            thickness: 2,
            selectedBorder: 'rgb(75, 84, 255)',
            angleLineColor: '#272727',
            angleLineBorder: 'white',
            angleLineThickness: 2
        },
        /**
         * Допустимые параметры
         * @type {object}
         * @property {string[]} [colors=["#FF3911", "#1632FF", "#808080", "#FFD800", "#0094FF"]]
         * @property {string[]} [types=[]]
         */
        options: {
            types: undefined,
            colors: undefined
        },
        initialize: function (data) {
            Gis.Widget.Propertys.prototype.initialize.call(this, data);
            this._createEventFunctions();
            this.options.types = this.options.types || [
            ];
            if (this.options.dataBinded) {
                this.options.dataBinded.on('change', this.updateData, this);
            }
        },
        _updateHistory: function () {
            this._updateState();
        },
        back: function () {
            if (this._isStateChanged()) {
                this._revertTextData(this._$Xrow);
                this._revertTextData(this._$Yrow);
                this._revertTextData(this._$RInnerRow);
                this._revertTextData(this._$ROutterRow);
                this._revertTextData(this._$Angle1Row);
                this._revertTextData(this._$Angle2Row);
                this._revertTextData(this._$DirectionRow);
                this._revertTextData(this._$SolutionRow);
                this._updateStyle();
            }
            this.updateData();
        },
        _getFinishAngle: function () {
            var angle = (this.options.dataBinded && (360 - (this.options.dataBinded.getStartAngle() || 360))) || 359;
            return (angle >= 0 ? angle : 360 + angle) % 360;
        },
        _getStartAngle: function () {
            var angle = (this.options.dataBinded && (this.options.dataBinded.getFinishAngle())) || 0;
            return angle >= 0 ? angle : 360 + angle;
        },
        _setData: function (text, center) {
            var r1 = (this.options.dataBinded && this.options.dataBinded.getRadius()) || 0,
                r2 = (this.options.dataBinded && this.options.dataBinded.getInnerRadius()) || 0,
                angle = this._getStartAngle() || 0,
                angle2 = this._getFinishAngle(),
                direction,
                solution,
                x,
                y;

            center = this.options.dataBinded && this.coordinateToTemplate(center || (this.options.dataBinded && this.options.dataBinded.getLatLng()));
            x = (center && center.x) || "";
            y = (center && center.y) || "";

            direction = this._calculateDirection(this.options.dataBinded);
            solution = this._calculateSolution(this.options.dataBinded);
            this.setHtmlPointSelectorWidgetData(this._$CoordinateContainer, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
            this._setValue(this._$RInnerRow, r2, r2);
            this._setValue(this._$ROutterRow, r1, r1);
            this._setValue(this._$Angle1Row, angle, angle);
            this._setValue(this._$Angle2Row, angle2, angle2);
            this._setValue(this._$DirectionRow, direction, direction);
            this._setValue(this._$SolutionRow, solution, solution);
        },
        _updateColor: function () {
            Gis.Widget.Propertys.prototype._updateColor.call(this, this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor(true)));
        },
        _hilightErrors: function () {
            var error = false;
            error = error || this.checkPoint(this._$CoordinateContainer);
            error = error || this.checkNumeric(this._$RInnerRow);
            error = error || this.checkNumeric(this._$Angle2Row);
            error = error || this.checkNumeric(this._$DirectionRow);
            error = error || this.checkNumeric(this._$SolutionRow);
            error = error || this.checkNumeric(this._$ROutterRow);
            error = error || this.checkNumeric(this._$Angle1Row);
            if (!$('.gis-color-button.selected', this._$div).data('color')) {
                error = true;
            }
            return error;
        },
        _updateCoordinatesState: function () {
            if (this.options.dataBinded && !this.options.dataBinded.isDraggable()) {
                this._$Xrow.attr('disabled', 'disabled');
                this._$Yrow.attr('disabled', 'disabled');
            } else {
                this._$Xrow.removeAttr('disabled');
                this._$Yrow.removeAttr('disabled');
            }
        },
        updateData: function () {
            this._setData();
            if (!this._pressed) {
                this._updateColor();
            }
            this._updateState();
        },
        _updateParamsState: function () {
            this.switchInputState(this.isDataEditable(), this._$ROutterRow, this._$RInnerRow, this._$Angle1Row, this._$Angle2Row, this._$DirectionRow, this._$SolutionRow);
        },
        draw: function () {
            Gis.Widget.Propertys.prototype.draw.call(this);
            var selected = this._containerController.getUIAttached().getMap().getSelected(),
                keys = Object.keys(selected);
            if (keys.length > 1) {
                this.options.dataBinded = undefined;
            } else if (keys.length && selected[keys[0]].getType() === 'sector') {
                this.options.dataBinded = selected[keys[0]];
            }
            this.updateData();
        },
        initHTML: function () {
            Gis.Widget.Propertys.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.SectorProperty.CLASS_NAME);
            this._$Xrow = $('#sector-x', this._$div);
            this._$CoordinateContainer = $('#center-selector', this._$div);
            this._$Yrow = $('#sector-y', this._$div);
            this._$ROutterRow = $('#sector-r1', this._$div);
            this._$RInnerRow = $('#sector-r2', this._$div);
            this._$Angle1Row = $('#sector-angle1', this._$div);
            this._$Angle2Row = $('#sector-angle2', this._$div);
            this._$DirectionRow = $('#sector-direction', this._$div);
            this._$SolutionRow = $('#sector-solution', this._$div);
            this._updateStyleList();
        },
        _getSolution: function () {
            return parseFloat(this._$SolutionRow.val()) % 360;
        },
        _getDirection: function () {
            return parseFloat(this._$DirectionRow.val()) % 360;
        },
        _anglesByDirection: function () {
            var direction, solution;
            direction = this._getDirection();
            solution = this._getSolution();
            return [(direction - solution / 2) % 360, (direction + solution / 2 % 360)];
        },
        _calculateDirection: function (dataBinded) {
            var startAngle;
            startAngle = dataBinded ? dataBinded.getStartAngle() : (parseFloat(this._$Angle1Row && this._$Angle1Row.val()) || 0);
            return (parseFloat(startAngle) + parseFloat(this._calculateSolution(dataBinded)) / 2) % 360;
        },
        _calculateSolution: function (dataBinded) {
            var startAngle, finishAngle, solution;
            startAngle = (dataBinded ? dataBinded.getStartAngle() : 360 - (parseFloat(this._$Angle2Row && this._$Angle2Row.val()) || 360));
            finishAngle = (dataBinded ? dataBinded.getFinishAngle() : (parseFloat(this._$Angle1Row && this._$Angle1Row.val()) || 359));
            solution = (finishAngle - startAngle) % 360;
            return solution >= 0 ? solution : 360 + solution;
        },
        initDataBlock: function () {
            var center = this.coordinateToTemplate((this.options.dataBinded && this.options.dataBinded.getLatLng()) || null),
                r1 = (this.options.dataBinded && this.options.dataBinded.getRadius()) || "",
                r2 = (this.options.dataBinded && this.options.dataBinded.getInnerRadius()) || "",
                angle = this._getStartAngle() || "",
                angle2 = this._getFinishAngle() || "",
                direction = this._calculateDirection(this.options.dataBinded),
                solution = this._calculateSolution(this.options.dataBinded),
                centerX = center.x || '',
                centerY = center.y || '';
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Параметры</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                "<ul id='center-selector' class='inline-points'>\n" +
                this._HTMLPointSelectorWidget({
                    tag: 'li',
                    tagClass: 'data-coll',
                    x: centerX,
                    y: centerY,
                    xID: 'sector-x',
                    yID: 'sector-y',
                    yClass: 'sector-input',
                    xClass: 'sector-input'
                }) +
                "</ul>\n" +
                "<div>\n" +
                "<ul>\n" +
                "<li class='data-row'><span>R внешний:</span>" +
                this._HTMLRowInput(r1, 'sector-r1', 'sector-input') +
                "</li>\n" +
                "<li class='data-row'><span>R внутренний:</span>" +
                this._HTMLRowInput(r2, 'sector-r2', 'sector-input') +
                "</li>\n" +
                "<li class='data-row'><span>Угол 1:</span>" +
                this._HTMLRowInput(angle, 'sector-angle1', 'sector-input') +
                "</li>\n" +
                "<li class='data-row'><span>Угол 2:</span>" +
                this._HTMLRowInput(angle2, 'sector-angle2', 'sector-input') +
                "</li>\n" +
                "<li class='data-row'><span>Направление:</span>" +
                this._HTMLRowInput(direction, 'sector-direction', 'sector-input') +
                "</li>\n" +
                "<li class='data-row'><span>Угол раствора:</span>" +
                this._HTMLRowInput(solution, 'sector-solution', 'sector-input') +
                "</li>\n" +
                "</ul>\n" +
                "</div>\n" +
                "</div>\n" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Вид</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
                this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor(true)) +
                this._HTMLstyleSelector('Предустановки') +
                "</div>" +
                "</div>\n" +
                "</div>\n";
        },
        _onMouseDown: function (e) {
            if (!this._anglePath && this.checkBaseLayer()) {
                this._cleared = true;
                this._pressed = true;
                if (this.options.dataBinded) {
                    this._cleared = false;
                    this._containerController.getUIAttached().getMap().unselectLayer(this.options.dataBinded);
                }
                this._startPoint = Gis.latLng(e.latLng.latitude, e.latLng.longitude);
            }
        },
        _cancelDrag: function () {
            if (!this._anglePath) {
                this._cleared = false;
                this._pressed = false;
                this._startPoint = null;
            }
        },
        _drawFromDrag: function () {
            var r1, r2;
            if (this._cleared && this._currentPoint && this._startPoint) {
                r1 = this._startPoint.distanceTo(Gis.latLng(this._startPoint.lat, this._currentPoint.lng));
                r2 = this._startPoint.distanceTo(Gis.latLng(this._currentPoint.lat, this._startPoint.lng));
                r1 = Math.max(r1, r2);
                this._saveData({
                    x: this._startPoint.lng,
                    y: this._startPoint.lat,
                    r1: r1,
                    r2: 0,
                    angle: this._$Angle1Row.val(),
                    angle2: this._$Angle2Row.val(),
                    notFireServerEvent: true
                });
            }
        },
        _updatePathAngle: function (latLng) {
            if (this._anglePath) {
                var dataToSet = {}, angle, latlngStart, map = this._containerController.getUIAttached().getMap();
                latlngStart = this.options.dataBinded.getLatLng();
                angle = Gis.Widget.SectorProperty._calculatePointAngle(map.latLngToLayerPoint(Gis.latLng(latlngStart[0], latlngStart[1])), map.latLngToLayerPoint(latLng));
//                angle = Gis.Projection.calculateLoxodromeAngle(Gis.latLng(latlngStart[0], latlngStart[1]), latLng);
                dataToSet[this._firstAngle ? 'finishAngle' : 'startAngle'] = angle % 360;
                this.options.dataBinded.setData(dataToSet, null, true);
                this._anglePath.setData({
                    points: [
                        {latitude: latlngStart[0], longitude: latlngStart[1]},
                        {latitude: latLng.lat, longitude: latLng.lng}
                    ]
                });
            }
        },
        _onMouseMove: function (e) {
            if (this._pressed && this._cleared && !this._anglePath) {
                this._moved = true;
                this._currentPoint = Gis.latLng(e.latLng.latitude, e.latLng.longitude);
                this._drawFromDrag();
            } else {
                this._updatePathAngle(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
            }
        },
        _finish: function () {
            this._deactivateAnglePath();
        },
        _deactivateAnglePath: function () {
            if (this._anglePath) {
                this.fireServerEvent(this._firstAngle ? 'finishAngle' : 'startAngle');
                this._containerController.getUIAttached().getMap().removeLayer(this._anglePath);
                this._anglePath = undefined;
            }
        },
        fireServerEvent: function (rows) {
            if (this.options.dataBinded) {
                this.options.dataBinded.fire('change', {
                    target: this.options.dataBinded,
                    rows: this.options.dataBinded._getRowsChanged(rows) || [
                        'innerRadius',
                        'radius',
                        'startAngle',
                        'finishAngle',
                        'latitude',
                        'longitude',
                        'fill'
                    ]
                });
            }
        },
        _startAngleMove: function (mouselatlng) {
            var latlng, style;
            if (this.options.dataBinded) {
                this._firstAngle = true;
                this._deactivateAnglePath();
                latlng = this.options.dataBinded.getLatLng();
                style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('sector'));
                this._anglePath = Gis.path({
                    id: Gis.Util.generateGUID(),
                    points: [
                        {latitude: latlng[0], longitude: latlng[1]},
                        {latitude: mouselatlng.lat, longitude: mouselatlng.lng}
                    ],
                    draggable: false,
                    line: {color: style.angleLineColor, border: style.angleLineBorder, thickness: style.angleLineThickness},
                    selectable: false
                });
                this._anglePath.setControllableByServer(false);
                this._anglePath.addTo(this._containerController.getUIAttached().getMap());
            }
        },
        _finishDrawFromDrag: function (latlng) {
            this._cleared = false;
            this._startPoint = undefined;
            this._currentPoint = undefined;
            this.fireServerEvent();
            if (!this._anglePath) {
                this._startAngleMove(latlng);
            }
        },
        _onMouseUp: function (e) {
            var movedAndPressed = this._moved && this._pressed;
            this._moved = false;
            this._pressed = false;
            if (this._anglePath) {
                if (this._firstAngle) {
                    this._firstAngle = false;
                    this.fireServerEvent('finishAngle');
                } else {
                    this._deactivateAnglePath();
                }
            } else if (movedAndPressed) {
                this._finishDrawFromDrag(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
            }
        },
        _onMouseOut: function () {
            if (this._moved && this._pressed) {
                this._finishDrawFromDrag();
            }
            this._moved = false;
            this._pressed = false;
        },
        initButtonsBlock: function () {
            return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
                "<ul class='gis-property-buttons-list'>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Новый', !this.options.dataBinded) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                "</ul>\n" +
                "</div>\n";
        },
        getSelectedType: function () {
            return $('.gis-image-type-button.selected', this._$div).data('type');
        },
        _isStateChanged: function () {
            var changed;
            changed = this._rowChanged(this._$Xrow) ||
                this._rowChanged(this._$Yrow) ||
                this._rowChanged(this._$RInnerRow) ||
                this._rowChanged(this._$ROutterRow) ||
                this._rowChanged(this._$Angle1Row) ||
                this._rowChanged(this._$Angle2Row) ||
                this._rowChanged(this._$DirectionRow) ||
                this._rowChanged(this._$SolutionRow) ||
                (this.options.dataBinded && (this.options.dataBinded.getColor(true) !== this.getSelectedColor()));
            changed = changed || (this.options.dataBinded && this.getSelectedStyle() !== this.options.dataBinded.getTag('style'));
            return changed;
        },
        _updateButtonState: function () {
            var buttonSaveText,
                isStateChanged = this._isStateChanged();
            this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
            this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
            this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
            this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
            buttonSaveText = this.options.dataBinded && isStateChanged ? "Подтвердить" : !this.options.dataBinded ? "Новый" : "Подтвердить";
            $('.gis-button-text', this._$buttonNew).html(buttonSaveText);
            var isDataEditable = this.isDataEditable();
            this.switchButtonState(this._$buttonNew, isDataEditable && (!this.options.dataBinded || isStateChanged) && !this._hilightErrors());
            this.switchButtonState(this._$buttonDeselect, this.options.dataBinded);
            this.switchButtonState(this._$buttonDelete, isDataEditable && this.options.dataBinded && this.options.dataBinded.isEditableByUser());
            this.switchButtonState(this._$buttonRevert, isDataEditable && isStateChanged);
        },
        _deinitDialogs: function () {
            this._$dialogRemove.dialog('destroy');
            $(document.body).remove(this._$dialogRemove);
            this._$dialogRemove = undefined;
        },
        _saveData: function (params) {
            function clearAngle(angle) {
                if (angle < 0) {
                    angle = 360 + angle % 360;
                }
                return angle;
            }

            var newLayer, data, fillStyle, lineStyle, directionalAngles, map, x, y, r1, r2, color, angle, angle2, style, projectedPoint;
            params = params || {};
            projectedPoint = this.templateToCoordinate(this.getPointValue(this._$Xrow), this.getPointValue(this._$Yrow));
            x = params.x || parseFloat(projectedPoint.x);
            y = params.y || parseFloat(projectedPoint.y);
            r2 = params.r2 || parseFloat((this._$RInnerRow.val()));
            r1 = params.r1 || parseFloat((this._$ROutterRow.val()));
            color = params.color || $('.gis-color-button.selected', this._$div).data('color') || (this.options.dataBinded && this.options.dataBinded.getColor(true));
            if (!params.angle && !params.angle2 && !this._rowChanged(this._$Angle1Row) && !this._rowChanged(this._$Angle2Row) &&
                (this._rowChanged(this._$DirectionRow) || this._rowChanged(this._$SolutionRow))) {
                directionalAngles = this._anglesByDirection();
                params.angle = directionalAngles[1];
                params.angle2 = -directionalAngles[0];
            }
            angle = params.angle !== undefined && $.isNumeric(params.angle) ? params.angle : parseFloat((this._$Angle1Row.val()));
            angle2 = -(params.angle2 !== undefined && $.isNumeric(params.angle2) ? params.angle2 : parseFloat((this._$Angle2Row.val())));

            angle2 = clearAngle(angle2);
            angle = clearAngle(angle);
            fillStyle = {color: this.getSelectedColor()};
            if (Gis.Util.isNumeric(x) && Gis.Util.isNumeric(y) && color && angle !== undefined && r1) {
                data = {
                    innerRadius: r2,
                    radius: r1,
                    startAngle: angle2,
                    finishAngle: angle,
                    latitude: y,
                    longitude: x,
                    fill: fillStyle,
                    tags: {style: this.getSelectedStyle()}
                };
                if (!params.forceNew && this.options.dataBinded) {
                    this.options.dataBinded.setData(data, null, params.notFireServerEvent);
                } else {
                    style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('sector'));
                    lineStyle = {color: style.color, border: style.border, thickness: style.thickness};
                    newLayer = Gis.sector(Gis.Util.extend({id: Gis.Util.generateGUID()}, data, {draggable: true, selectable: true, line: lineStyle}));
                    newLayer.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
                    map = this._containerController.getUIAttached().getMap();
                    newLayer.addTo(map);
                    map.selectLayer(newLayer);
                }
                this._update();
            } else {
                this._updateState();
            }
        },
        _deleteKeyFire: function (e) {
            Gis.UI.DeleteActions.sector.call(this, e);
        },
        _mapClicked: function (e) {
        },
        activate: function () {
            Gis.Widget.Propertys.prototype.activate.call(this);
        },
        deactivate: function () {
            Gis.Widget.Propertys.prototype.deactivate.call(this);
            this._cancelDrag();
        },
        _deInitEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
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
            $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).off({
                click: this._deselectFunction,
                keyup: this._KeyUpDeselectFunction
            });
            if (this.options.dataBinded) {
                this.options.dataBinded.off('change', this.updateData, this);
            }
            $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
                click: this._deleteFunction,
                keyup: this._KeyUpDeleteFunction
            });
            $(document.body).off('keyup', this._KeyUpEscFunction);
            map.off('mouseup', this._onMouseUp, this);
            map.off('mousedown', this._onMouseDown, this);
            map.off('mousemove', this._onMouseMove, this);
            map.off('mouseout', this._onMouseOut, this);
            map.off('stylechanged', this._updateStyleList, this);
            Gis.Widget.Propertys.prototype._deInitEvents.call(this);
        },
        _createEventFunctions: function () {
            var self = this;
            this._returnFunction = this._returnFunction || function (e) {
                if (self.isButtonEnable(this) && self.checkBaseLayer()) {
                    self._saveData(e);
                }
            };
            this._escFunction = this._escFunction || function (e) {
                self._finish(e);
            };
            this._deleteFunction = this._deleteFunction || function (e) {
                if (self.isButtonEnable(this)) {
                    self._deleteKeyFire(e);
                }
            };
            this._textRowChange = this._textRowChange || function (e) {
                self._updateState();
                e.stopPropagation();
            };
            this._textRowKeyPress = this._textRowKeyPress || function () {
                self._updateState();
            };
            this._revertFunction = this._revertFunction || function () {
                if (self.isButtonEnable(this)) {
                    self.back();
                }
            };
            this._deselectFunction = this._deselectFunction || function () {
                if (self.isButtonEnable(this)) {
                    self._containerController.getUIAttached().getMap().unselectLayer(self.options.dataBinded);
                }
            };
            this._KeyUpReturnFunction = this._KeyUpReturnFunction || this.generateEnteredFunction(self._deleteFunction);
            this._KeyUpEscFunction = this._KeyUpEscFunction || this.generateEskeyFunction(self._escFunction);
            this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || this.generateEnteredFunction(self._returnFunction);
            this._KeyUpDeselectFunction = this._KeyUpDeselectFunction || this.generateEnteredFunction(self._deselectFunction);
            this._KeyUpRevertFunction = this._KeyUpRevertFunction || this.generateEnteredFunction(self._revertFunction);
        },
        _initEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            $(document.body).on('keyup', this._KeyUpEscFunction);
            $('.data-coll input, .data-row input', this._$div).on({
                change: this._textRowChange,
                keyup: this._textRowChange,
                keydown: this.keyPressPreventDefault
            });
            $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
                click: this._returnFunction,
                keyup: this._KeyUpReturnFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
                click: this._revertFunction,
                keyup: this._KeyUpRevertFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).on({
                click: this._deselectFunction,
                keyup: this._KeyUpDeselectFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).on({
                click: this._deleteFunction,
                keyup: this._KeyUpDeleteFunction
            });
            map.on('mouseup', this._onMouseUp, this);
            map.on('mousedown', this._onMouseDown, this);
            map.on('mousemove', this._onMouseMove, this);
            map.on('mouseout', this._onMouseOut, this);
            map.on('stylechanged', this._updateStyleList, this);
            Gis.Widget.Propertys.prototype._initEvents.call(this);
        },
        _update: function () {
            this.updateData();
        },
        bindData: function (data) {
            $(':focus').blur();
            if (!data && !this._cleared) {
                this._cleared = true;
            }
            if (data !== this.options.dataBinded) {
                this._deactivateAnglePath();
                if (this.options.dataBinded) {
                    this.options.dataBinded.off('change', this.updateData, this);
                }
                if (data) {
                    data.on('change', this.updateData, this);
                }
                Gis.Widget.Propertys.prototype.bindData.call(this, data);
                this._updateStyleList();
                this.updateData();
            }
        }
    });

Gis.UI.DeleteActions.sector = function (e, dataBinded) {
    if ((e.srcElement || e.target).type !== 'text') {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить сектор?',
            callback: function () {
                this.removeLayerFromMap(dataBinded || this.options.dataBinded);
            },
            context: this,
            id: 'sector-remove-dialog'
        }, dataBinded);
    }
};
Gis.Widget.SectorProperty.CLASS_NAME = "gis-widget-propertys-sector";
Gis.Widget.SectorProperty._calculatePointAngle = function (Point1, Point2) {
    var x1 = Point1.x, y1 = Point1.y,
        x2 = Point2.x, y2 = Point2.y,
        A = Math.atan2(y1 - y2, x1 - x2) / Math.PI * 180;
    return ((A < 0) ? A + 360 : A) - 90;
};
Gis.Widget.sectorProperty = function (data) {
    return new Gis.Widget.SectorProperty(data);
};