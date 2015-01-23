"use strict";
/**
 * Свойства маркера
 * @class
 * @extedns Gis.Widget.Propertys
 */
Gis.Widget.MarkerProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.MarkerProperty.prototype
     */
    {
        _history: [],
        _type: 'marker',
        _defaultStyle: {
            foreColor: '#ffffff',
            position: 'centerright',
            drawPoint: true
        },
        options: {
            colors: undefined
        },
        initialize: function (data) {
            Gis.Widget.Propertys.prototype.initialize.call(this, data);

            if (this.options.dataBinded) {
                this.options.dataBinded.on('change', this.updateData, this);
            }
        },
        _updateHistory: function (data) {
            this._updateState();
        },
        back: function () {
            var dataHistory, pointData;
            if (!this._isStateChanged()) {
                dataHistory = this._history.pop();
                if (dataHistory) {
                    this._setData(dataHistory.text, dataHistory.center, dataHistory.color);
                }
            } else {
                pointData = this.getPointWidgetData(this._$CoordinateContainer, true);
                this.setHtmlPointSelectorWidgetData(this._$CoordinateContainer, pointData.x, pointData.y);
                this._$TEXTrow.val(this._$TEXTrow.data('old-val'));
                if (this.options.dataBinded) {
                    this._newColor = this.options.dataBinded.getBackColor();
                }
                this._updateStyle();
            }
            this.updateData();
        },
        _setData: function (text, center, color) {
            var centerTemplated, x, y;
            center = center || (this.options.dataBinded && this.options.dataBinded.getLatLng());
            text = (text || (this.options.dataBinded && this.options.dataBinded.getText())) || '';
            centerTemplated = this.coordinateToTemplate(center);

            this.setHtmlPointSelectorWidgetData(this._$CoordinateContainer, centerTemplated, centerTemplated);
            this._setValue(this._$TEXTrow, text, text);
        },
        _updateColor: function () {
            Gis.Widget.Propertys.prototype._updateColor.call(this, this._HTMLcolorSelector(true));
        },
        _hilightErrors: function () {
            var error = false;
            error = error || this.checkPoint(this._$CoordinateContainer);
            if (this._$TEXTrow.val() === '') {
                error = true;
                this._$TEXTrow.addClass('error');
            } else {
                this._$TEXTrow.removeClass('error');
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
            this.switchInputState(this.isDataEditable(), this._$TEXTrow);
        },
        updateData: function () {
            this._setData();
            this._updateColor();
            this._updateState();
        },
        draw: function () {
            Gis.Widget.Propertys.prototype.draw.call(this);
            var selected = this._containerController.getUIAttached().getMap().getSelected(),
                keys = Object.keys(selected);
            if (keys.length > 1) {
                this.options.dataBinded = undefined;
            } else if (keys.length && selected[keys[0]].getType() === Gis.UI.Action.Marker.type) {
                this.options.dataBinded = selected[keys[0]];
            }
            this.updateData();
        },
        initHTML: function () {
            Gis.Widget.Propertys.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.MarkerProperty.CLASS_NAME);
            this._$CoordinateContainer = $('#center-selector', this._$div);
            this._$Xrow = $('#marker-x', this._$div);
            this._$Yrow = $('#marker-y', this._$div);
            this._$TEXTrow = $('#marker-text', this._$div);
        },
        initDataBlock: function () {
            var center = (this.options.dataBinded && this.options.dataBinded.getLatLng()) || "",
                text = (this.options.dataBinded && this.options.dataBinded.getText()) || "",
                centerTemplated = this.coordinateToTemplate(center),
                centerX = centerTemplated.x || '',
                centerY = centerTemplated.y || '';
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Метка</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                "<ul id='center-selector' class='inline-points'>\n" +
                this._HTMLPointSelectorWidget({
                    tag: 'li',
                    tagClass: 'data-coll',
                    x: centerX,
                    y: centerY,
                    xID: 'marker-x',
                    yID: 'marker-y',
                    yClass: 'marker-input',
                    xClass: 'marker-input'
                }) +
                "</ul>\n" +
                "<div>\n" +
                "<ul>\n" +
                "<li class='data-row data-title'><span>Текст:</span></li>\n" +
                "<li class='data-row'><input type='text' data-old-val='" + text + "' id='marker-text' class='marker-input' value='" + text + "'/></li>\n" +
                "</ul>\n" +
                "</div>\n" +
                "</div>\n" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Вид</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
                this._HTMLcolorSelector(true) +
                "</div>\n" +
                "</div>\n" +
                "</div>\n";
        },
        initButtonsBlock: function () {
            return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
                "<ul class='gis-property-buttons-list'>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Новая', !this.options.dataBinded) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                "</ul>\n" +
                "</div>\n";
        },
        _isStateChanged: function () {
            var changed;
            changed = this._rowChanged(this._$Xrow) ||
                this._rowChanged(this._$Yrow) ||
                this._rowChanged(this._$TEXTrow) ||
                (this.getSelectedColor() && this.options.dataBinded && (this.options.dataBinded.getBackColor(true) !== this.getSelectedColor()));
            return changed;
        },
        _updateButtonState: function () {
            var buttonSaveText, isStateChanged;
            this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
            this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
            this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
            this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
            isStateChanged = this._isStateChanged();
            buttonSaveText = this.options.dataBinded && isStateChanged ? "Подтвердить" : !this.options.dataBinded ? "Новая" : "Подтвердить";
            $('.gis-button-text', this._$buttonNew).html(buttonSaveText);
            var isDataEditable = this.isDataEditable();
            this.switchButtonState(this._$buttonNew, isDataEditable && (!this.options.dataBinded || isStateChanged) && !this._hilightErrors());
            this.switchButtonState(this._$buttonDeselect, this.options.dataBinded);
            this.switchButtonState(this._$buttonDelete, isDataEditable && this.options.dataBinded && this.options.dataBinded.isEditableByUser());
            this.switchButtonState(this._$buttonRevert, isDataEditable && isStateChanged);
        },
        _initDialogClose: function () {
            var self = this, $dialog;
            $dialog = $('#marker-remove-dialog');
            if (!$dialog.length) {
                $dialog = $('<div id="marker-remove-dialog"/>');
                $dialog.appendTo($(document.body));
            }
            $dialog.dialog($.extend(this._dialogOptions, {
                buttons: [
                    {
                        text: 'OK',
                        click: function () {
                            self.removeLayerFromMap(self.options.dataBinded);
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: 'Отменить',
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            }));
            return $dialog;
        },
        _initDialogNew: function () {
            var self = this, $dialog;
            $dialog = $('#marker-new-dialog');
            if (!$dialog.length) {
                $dialog = $('<div id="marker-new-dialog"/>');
                $dialog.append("<div><span class='dialog-label'>Цвет метки</span>" + this._HTMLcolorSelector(false, null, false) + "</div>");
                $dialog.append("<div><span class='dialog-label'>Текст метки</span>" +
                    "<div class='input-wraper'><input type='text' id='dialog-new-marker-text'/></div>" +
                    "</div>");
                $dialog.appendTo($(document.body));
                this._activateColorPicker($dialog);
                $($dialog).on('click', '.gis-color-button', function () {
                    var $this = $(this);
                    if (!$this.hasClass('selected')) {
                        $('.gis-color-button.selected', $dialog).removeClass('selected');
                        $this.addClass('selected');
                    }
                });
                $($dialog).on('dialogclose', function () {
                    var $this = $(this);
                    $('.gis-color-button.selected', $this).removeClass('selected');
                    $($('.gis-color-button', $this)[0]).addClass('selected');
                    $('#dialog-new-marker-text', $this).val('');
                });
            }
            $dialog.dialog($.extend(this._dialogOptions, {
                buttons: [
                    {
                        text: 'OK',
                        click: function () {
                            var color, text, $this;
                            $this = $(this);
                            color = $('.gis-color-button.selected', $this).data('color');
                            text = $('#dialog-new-marker-text', $this).val();
                            if (color && text !== '') {
                                self._saveData($dialog.latlng.lng, $dialog.latlng.lat, text, color, true);
                                $(this).dialog("close");
                            }
                        }
                    },
                    {
                        text: 'Отменить',
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            }));
            return $dialog;
        },
        _deinitDialogs: function () {
            this._$dialogRemove.dialog('destroy');
            $(document.body).remove(this._$dialogRemove);
            this._$dialogRemove = undefined;
        },
        _opedDialogNewLabel: function (latlng) {
            this._$dialogNew = this._$dialogNew || this._initDialogNew();
            this._$dialogNew.latlng = latlng;
            this._$dialogNew.dialog('open');
        },
        _saveData: function (x, y, text, color, forceNew) {
            var newLayer, style, convertedPoint = this.templateToCoordinate(this.getPointValue(this._$Xrow), this.getPointValue(this._$Yrow));
            x = x || convertedPoint.x;
            y = y || convertedPoint.y;
            text = text || this._$TEXTrow.val();
            if (Gis.Util.isNumeric(x) && Gis.Util.isNumeric(y) && text !== '') {
                color = color || this.getSelectedColor() || this.options.dataBinded.getBackColor();
                if (!forceNew && this.options.dataBinded) {
                    this.options.dataBinded.setData({
                        backColor: color,
                        caption: text,
                        latitude: y,
                        longitude: x
                    });
                } else {
                    style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('marker'));
                    newLayer = Gis.textLabel({id: Gis.Util.generateGUID(), className: 'gis-ui-marker', foreColor: style.foreColor, position: style.position,drawPoint: style.drawPoint, caption: text, latitude: y, longitude: x,
                        backColor: color, draggable: true, selectable: true});
                    newLayer.addTo(this._containerController.getUIAttached().getMap());
                    this._containerController.getUIAttached().getMap().selectLayer(newLayer);
                }
                this._update();
            } else {
                this._updateState();
            }
        },
        _mapClicked: function (e) {
            this._opedDialogNewLabel(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
        },
        _deleteKeyFire: function (e) {
            Gis.UI.DeleteActions.marker.call(this, e, this.options.dataBinded);
        },
        _deInitEvents: function () {
            $(this._$div).off('click', '.gis-color-button', this._colorClickFunction);
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
            Gis.Widget.Propertys.prototype._deInitEvents.call(this);
            this._destroyColorPicker($('#marker-new-dialog'));
        },
        _initEvents: function () {
            var self = this;
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
            this._KeyUpReturnFunction = this._KeyUpReturnFunction || generateEnteredFunction(self._deleteFunction);
            this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || generateEnteredFunction(self._returnFunction);
            this._KeyUpDeselectFunction = this._KeyUpDeselectFunction || generateEnteredFunction(self._deselectFunction);
            this._KeyUpRevertFunction = this._KeyUpRevertFunction || generateEnteredFunction(self._revertFunction);
            this._colorClickFunction = this._colorClickFunction || function () {
                var $this = $(this);
                if (!$this.hasClass('selected')) {
                    $('.gis-color-button.selected', self._$div).removeClass('selected');
                    $this.addClass('selected');
                    self._newColor = $this.data('color');
                    self._updateState();
                }
            };
            this._$div.on('click', '.gis-color-button', this._colorClickFunction);
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
            Gis.Widget.Propertys.prototype._initEvents.call(this);
        },
        _update: function () {
            this.updateData();
        },
        bindData: function (data) {
            $(':focus').blur();
            if (data !== this.options.dataBinded) {
                this._newColor = undefined;
                if (this.options.dataBinded) {
                    this.options.dataBinded.off('change', this.updateData, this);
                }
                if (data) {
                    this._newColor = data.getBackColor();
                    data.on('change', this.updateData, this);
                }
                Gis.Widget.Propertys.prototype.bindData.call(this, data);
                this.updateData();
            }
        }
    });

Gis.UI.DeleteActions.marker = function (e, dataBinded) {
    if ((e.srcElement || e.target).type !== 'text') {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить метку?',
            callback: function () {
                this._containerController.getUIAttached().getMap().removeLayer(dataBinded || this.options.dataBinded);
            },
            context: this,
            id: 'marker-remove-dialog'
        }, dataBinded);
    }
};
Gis.UI.DeleteActions.text = Gis.UI.DeleteActions.marker;
Gis.Widget.MarkerProperty.CLASS_NAME = "gis-widget-propertys-marker";
Gis.Widget.MarkerProperty.CENTER_CHANGED = 1;
Gis.Widget.MarkerProperty.TEXT_CHANGED = 3;
Gis.Widget.MarkerProperty.BOTH_CHANGED = 2;
Gis.Widget.MarkerProperty.NOT_CHANGED = 0;
Gis.Widget.markerProperty = function (data) {
    return new Gis.Widget.MarkerProperty(data);
};