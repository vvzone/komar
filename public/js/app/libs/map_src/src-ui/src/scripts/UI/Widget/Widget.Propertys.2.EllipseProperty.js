"use strict";
/**
 * Настройки эллипса
 * @requires jQuery
 * @class
 * @extends Gis.Widget.Propertys
 */
Gis.Widget.EllipseProperty = Gis.Widget.Propertys.extend(
    /** @lends Gis.Widget.EllipseProperty.prototype */
    {
        _typeSelector: true,
        _type: 'ellipse',
        _history: [],
        /**
         * Допустимые опции
         * @type {object}
         * @property {string[]} [types=[]]
         * @property {string[]} [colors=["#FF3911","#1632FF","#808080","#FFD800","#0094FF"]]
         * @property {string} [position='right_inner']
         * @property {boolean} [enabled=true]
         * @property {Gis.Objects.Ellipse} [dataBinded=undefined]
         */
        options: {
            types: undefined,
            colors: undefined
        },
        initialize: function (data) {
            Gis.Widget.Propertys.prototype.initialize.call(this, data);
            this.options.types = this.options.types || [
            ];
            if (this.options.dataBinded) {
                this.options.dataBinded.on('change', this.updateData, this);
            }
        },
        _updateHistory: function (data) {
            this._updateState();
        },
        back: function () {
            var dataHistory;
            if (!this._isStateChanged()) {
                dataHistory = this._history.pop();
                if (dataHistory) {
                    this._setData(dataHistory.text, dataHistory.center, dataHistory.color);
                }
            } else {
                this._revertTextData(this._$Xrow);
                this._revertTextData(this._$Yrow);
                this._revertTextData(this._$R1row);
                this._revertTextData(this._$R2row);
                this._revertTextData(this._$AngleRow);
                if (this.options.dataBinded) {
                    this._updateStyle();
                }
            }
            this.updateData();
        },
        _setData: function (text, center) {
            var r1 = this.getValueFromData('getAlpha', ""),
                r2 = this.getValueFromData('getBetta', ""),
                angle = this.getValueFromData('getGamma', 0),
                centerTemplated;
            center = center || this.getValueFromData('getLatLng', null);
            centerTemplated = (this.options.dataBinded && this.coordinateToTemplate(center)) || Gis.UI.coordinate('', '');
            this.setHtmlPointSelectorWidgetData(this._$CoordinateContainer, centerTemplated, centerTemplated);
            this._setValue(this._$R1row, r1, r1);
            this._setValue(this._$R2row, r2, r2);
            this._setValue(this._$AngleRow, angle, angle);
        },
        _updateColor: function () {
            Gis.Widget.Propertys.prototype._updateColor.call(this, this._HTMLcolorSelector(true, this.getValueFromData('getColor', "", true)));
        },
        _hilightErrors: function () {
            var error = false;
            error = error || this.checkPoint(this._$CoordinateContainer);
            error = error || this.checkNumeric(this._$R1row);
            error = error || this.checkNumeric(this._$R2row);
            error = error || this.checkNumeric(this._$AngleRow);
            if (!$('.gis-color-button.selected', this._$div).data('color')) {
                error = true;
            }
            return error;
        },
        _updateCoordinatesState: function () {
            if (!this.isDataEditable() || !this.getValueFromData('isDraggable', true)) {
                this._$Xrow.attr('disabled', 'disabled');
                this._$Yrow.attr('disabled', 'disabled');
            } else {
                this._$Xrow.removeAttr('disabled');
                this._$Yrow.removeAttr('disabled');
            }
        },
        _updateParamsState: function () {
            this.switchInputState(this.isDataEditable(), this._$R1row, this._$R2row, this._$AngleRow);
        },
        updateData: function () {
            this._setData();
            if (!this._pressed) {
                this._updateColor();
            }
            this._updateState();
            this.afterUpdate();
        },
        draw: function () {
            Gis.Widget.Propertys.prototype.draw.call(this);
            this.updateData();
        },
        initHTML: function () {
            Gis.Widget.Propertys.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.EllipseProperty.CLASS_NAME);
            this._$Xrow = $('#ellipse-x', this._$div);
            this._$CoordinateContainer = $('#center-selector', this._$div);
            this._$Yrow = $('#ellipse-y', this._$div);
            this._$R1row = $('#ellipse-r1', this._$div);
            this._$R2row = $('#ellipse-r2', this._$div);
            this._$AngleRow = $('#ellipse-angle', this._$div);
            this._updateStyleList();
        },
        initDataBlock: function () {
            var center = this.getValueFromData('getLatLng', null),
                r1 = this.getValueFromData('getAlpha', ''),
                r2 = this.getValueFromData('getBetta', ''),
                angle = this.getValueFromData('getGamma', ''),
                centerTemplated = this.coordinateToTemplate(center),
                centerX = centerTemplated.x || '',
                centerY = centerTemplated.y || '';
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Координаты</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                "<ul id='center-selector' class='inline-points'>\n" +
                this._HTMLPointSelectorWidget({
                    tag: 'li',
                    tagClass: 'data-coll',
                    x: centerX,
                    y: centerY,
                    xID: 'ellipse-x',
                    yID: 'ellipse-y',
                    yClass: 'ellipse-input',
                    xClass: 'ellipse-input'
                }) +
                "</ul>\n" +
                "<div>\n" +
                "<ul>\n" +
                "<li class='data-row'><span>Радиус 1:</span>" +
                this._HTMLRowInput(r1, 'ellipse-r1', 'ellipse-input', 'Радиус по оси горизонтали') +
                "</li>\n" +
                "<li class='data-row'><span>Радиус 2:</span>" +
                this._HTMLRowInput(r2, 'ellipse-r2', 'ellipse-input', 'Радиус по оси вертикали') +
                "</li>\n" +
                "<li class='data-row'><span>Угол поворота:</span>" +
                this._HTMLRowInput(angle, 'ellipse-angle', 'ellipse-input', 'Угол поворота по часовой стрелке относительно вертикальной оси') +
                "</li>\n" +
                "</ul>\n" +
                "</div>\n" +
                "</div>\n" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Вид</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor(true)) +
                this._HTMLstyleSelector('Предустановки') +
                "</div>" +
                "</div>\n" +
                "</div>\n";
        },
        _onMouseDown: function (e) {
            if (this.checkBaseLayer()) {
                this._cleared = true;
                this._pressed = true;
                if (this.options.dataBinded) {
                    this._cleared = false;
                    this._containerController.getUIAttached().getMap().unselectLayer(this.options.dataBinded);
                }
                this._startPoint = Gis.latLng(e.latLng.latitude, e.latLng.longitude);
            }
        },
        _drawFromDrag: function (circle, skipServerMessage) {
            var r1, r2;
            if (this._cleared && this._currentPoint && this._startPoint) {
                r1 = this._startPoint.distanceTo(Gis.latLng(this._startPoint.lat,  this._currentPoint.lng));
                r2 = this._startPoint.distanceTo(Gis.latLng(this._currentPoint.lat,  this._startPoint.lng));
                if (circle) {
                    r1 = r2 = Math.max(r1, r2);
                }
                this._saveData({x: this._startPoint.lng, y: this._startPoint.lat, r1: r1, r2: r2, angle: 0, skipServerMessage: skipServerMessage});
                this.updateData();
            }
        },
        _onMouseMove: function (e) {
            if (this._pressed && this._cleared) {
                this._moved = true;
                this._currentPoint = Gis.latLng(e.latLng.latitude, e.latLng.longitude);
                this._drawFromDrag(e.originalEvent.shiftKey, true);
            }
        },
        _finishDrawFromDrag: function () {
            this._cleared = false;
            this._startPoint = undefined;
            this._currentPoint = undefined;
        },
        fireServerEvent: function () {
            if (this.options.dataBinded) {
                this.options.dataBinded.fire('change', {
                    target: this.options.dataBinded,
                    rows: ['alpha', 'betta', 'gamma', 'latitude', 'longitude', 'fill']
                });
            }
        },
        _onMouseUp: function (e) {
            if (this._pressed && this._cleared) {
                this.fireServerEvent();
            }
            this._moved = false;
            this._pressed = false;
            this._finishDrawFromDrag();
        },
        _onMouseOut: function () {
            this._moved = false;
            this._pressed = false;
            this._finishDrawFromDrag();
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
                this._rowChanged(this._$R1row) ||
                this._rowChanged(this._$R2row) ||
                this._rowChanged(this._$AngleRow) ||
                (this.options.dataBinded && (this.options.dataBinded.getColor(true) !== this.getSelectedColor()));
            changed = changed || (this.options.dataBinded && this.getSelectedStyle() !== this.options.dataBinded.getTag('style'));
            return changed;
        },
        _updateButtonState: function () {
            var buttonSaveText, isStateChanged;
            this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
            this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
            this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
            this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
            isStateChanged = this._isStateChanged();
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
        /**
         * @param {Object} params {x, y, r1, r2, color, angle, forceNew, skipServerMessage}
         * */
        _saveData: function (params) {
            var newLayer, data, fillStyle, lineStyle, x, y, r1, r2, color, angle, style,
                convertedCoordinate = this.templateToCoordinate(this.getPointValue(this._$Xrow), this.getPointValue(this._$Yrow));
            params = params || {};
            x = params.x || convertedCoordinate.x;
            y = params.y || convertedCoordinate.y;
            r1 = params.r1 || this._$R1row.val();
            r2 = params.r2 || this._$R2row.val();
            color = params.color || $('.gis-color-button.selected', this._$div).data('color') || (this.options.dataBinded && this.options.dataBinded.getColor(true));
            angle = params.angle !== undefined && $.isNumeric(params.angle) ? params.angle : this._$AngleRow.val();
            fillStyle = {color: this.getSelectedColor()};
            if (Gis.Util.isNumeric(x) && Gis.Util.isNumeric(y) && color && Gis.Util.isNumeric(angle) && r2 && r1) {
                data = {
                    alpha: r1,
                    betta: r2,
                    gamma: angle,
                    latitude: y,
                    longitude: x,
                    fill: fillStyle,
                    tags: {style: this.getSelectedStyle()}
                };
                if (!params.forceNew && this.options.dataBinded) {
                    this.options.dataBinded.setData(data, null, params.skipServerMessage);
                } else {
                    style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('ellipse'));
                    lineStyle = {color: style.color, border: style.border, thickness: style.thickness};
                    newLayer = Gis.ellipse(Gis.Util.extend({id: Gis.Util.generateGUID()}, data, {draggable: true, selectable: true, line: lineStyle}));
                    newLayer.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
                    newLayer.addTo(this._containerController.getUIAttached().getMap());
                    this._containerController.getUIAttached().getMap().selectLayer(newLayer);
                }
                this._update();
            } else {
                this._updateState();
            }
        },
        _deleteKeyFire: function (e) {
            Gis.UI.DeleteActions.ellipse.call(this, e);
        },
        _mapClicked: function (e) {
        },
        _deInitEvents: function () {
            var map;
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
            map = this._containerController.getUIAttached().getMap();
            map.off('mouseup', this._onMouseUp, this);
            map.off('mousedown', this._onMouseDown, this);
            map.off('mousemove', this._onMouseMove, this);
            map.off('mouseout', this._onMouseOut, this);
            map.off('stylechanged', this._updateStyleList, this);
            Gis.Widget.Propertys.prototype._deInitEvents.call(this);
        },

        _initEvents: function () {
            var self = this, map;
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
                self.fire('change');
                e.stopPropagation();
            };
            this._textRowKeyPress = this._textRowKeyPress || function () {
                self.fire('change');
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
            this._KeyUpReturnFunction = this._KeyUpReturnFunction || generateEnteredFunction(self._deleteFunction);
            this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || generateEnteredFunction(self._returnFunction);
            this._KeyUpDeselectFunction = this._KeyUpDeselectFunction || generateEnteredFunction(self._deselectFunction);
            this._KeyUpRevertFunction = this._KeyUpRevertFunction || generateEnteredFunction(self._revertFunction);
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
            map = this._containerController.getUIAttached().getMap();
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
                this._newColor = undefined;
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
    }
);
Gis.UI.DeleteActions.ellipse = function (e, dataBinded) {
    var self = this;
    if ((e.srcElement || e.target).type !== 'text') {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить эллипс?',
            callback: function () {
                self.removeLayerFromMap(dataBinded || self.options.dataBinded);
            },
            context: this,
            id: 'ellipse-remove-dialog'
        }, dataBinded);
    }
};
Gis.Widget.EllipseProperty.CLASS_NAME = "gis-widget-propertys-ellipse";
Gis.Widget.EllipseProperty.CENTER_CHANGED = 1;
Gis.Widget.EllipseProperty.TEXT_CHANGED = 3;
Gis.Widget.EllipseProperty.BOTH_CHANGED = 2;
Gis.Widget.EllipseProperty.NOT_CHANGED = 0;
Gis.Widget.ellipseProperty = function (data) {
    return new Gis.Widget.EllipseProperty(data);
};
