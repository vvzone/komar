"use strict";
/**
 *
 * Параметры объекта
 * @class
 * @extends Gis.Widget.Propertys
 */
Gis.Widget.ObjectProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.ObjectProperty.prototype
     */
    {
        _history: [],
        /**
         * Допустимые параметры
         * @type {object}
         * @property {string[]} [colors=["#FF3911", "#1632FF", "#808080", "#FFD800", "#0094FF"]]
         * @property {string[]} [types=["target", "danger", "circle", "storm", "simple"]]
         */
        options: {
            types: undefined,
            colors: undefined
        },
        _type: 'object',
        initialize: function (data) {
            Gis.Widget.Propertys.prototype.initialize.call(this, data);
            var object = Gis.config(Gis.Widget.ObjectProperty.CONFIG_TYPES_KEY);
            this.options.types = this.options.types || (object && object.split(' ')) || ["target", "danger", "circle", "storm", "simple"];

            if (this.options.dataBinded) {
                this.options.dataBinded.on('change', this.updateData, this);
            }
        },
        _updateHistory: function () {
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
                this.revertHtmlPointSelectorWidgetData(this._$CoordinateContainer);
                this._$TEXTrow.val(this._$TEXTrow.data('old-val'));
                if (this.options.dataBinded) {
                    this._newColor = this.options.dataBinded.getImageColor();
                }
            }
            this.updateData();
        },
        _setData: function (text, center) {
            var x, y;
            center = this.coordinateToTemplate(center || (this.options.dataBinded && this.options.dataBinded.getLatLng()));
            text = (text || (this.options.dataBinded && this.options.dataBinded.getPopup())) || '';
            x = center.x || "";
            y = center.y || "";
            this.setHtmlPointSelectorWidgetData(this._$CoordinateContainer, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
//        this._setValue(this._$Xrow, x, x);
//        this._setValue(this._$Yrow, y, y);
            this._setValue(this._$TEXTrow, text, text);
        },
        _updateColor: function () {
            Gis.Widget.Propertys.prototype._updateColor.call(this, this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getImageColor()));
        },
        _updateType: function () {
            $('.gis-image-type-list', this._$div).replaceWith(this._HTMLtypeSelector(true, this.options.dataBinded && this.options.dataBinded.getImageType()));
            this._repaintIcons($('.gis-image-type-list', this._$div));
        },
        _hilightErrors: function () {
            var error = false;
            error = error || this.checkPoint(this._$CoordinateContainer);
            if (!$('.gis-color-button.selected', this._$div).data('color')) {
                error = true;
            }
            return error;
        },
        _updateCoordinatesState: function () {
            if (!this.isDataEditable() && this.options.dataBinded && !this.options.dataBinded.isDraggable()) {
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
            this._updateType();
            this._updateState();
        },
        draw: function () {
            Gis.Widget.Propertys.prototype.draw.call(this);
            var selected = this._containerController.getUIAttached().getMap().getSelected(),
                keys = Object.keys(selected);
            if (keys.length > 1) {
                this.options.dataBinded = undefined;
            } else if (keys.length && selected[keys[0]].getType() === 'text') {
                this.options.dataBinded = selected[keys[0]];
            }
            this.updateData();
        },
        initHTML: function () {
            Gis.Widget.Propertys.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.ObjectProperty.CLASS_NAME);
            this._$CoordinateContainer = $('#center-selector', this._$div);
            this._$Xrow = $('#object-x', this._$div);
            this._$Yrow = $('#object-y', this._$div);
            this._$TEXTrow = $('#object-text', this._$div);
        },
        initDataBlock: function () {
            var center = (this.options.dataBinded && this.options.dataBinded.getLatLng()) || "",
                text = (this.options.dataBinded && this.options.dataBinded.getPopup()) || "",
                centerTemplated = this.coordinateToTemplate(center),
                centerX = centerTemplated.x || '',
                centerY = centerTemplated.y || '';
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='center-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Объект</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                "<ul id='center-selector' class='inline-points'>\n" +
                this._HTMLPointSelectorWidget({
                    tag: 'li',
                    tagClass: 'data-coll',
                    x: centerX,
                    y: centerY,
                    xID: 'object-x',
                    yID: 'object-y',
                    yClass: 'object-input',
                    xClass: 'object-input'
                }) +
                "</ul>\n" +
                "<div>\n" +
                "<ul>\n" +
                "<li class='data-row data-title'><span>Комментарий:</span></li>\n" +
                "<li class='data-row'>" + this._HTMLRowInput(text, 'object-text', 'object-input') + "\n" +
                "</ul>\n" +
                "</div>\n" +
                "</div>\n" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Пиктограмма</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "  gis-color-container'>" +
                this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getImageColor()) +
                this._HTMLtypeSelector(true, this.options.dataBinded && this.options.dataBinded.getImageType()) +
                "</div>" +
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
        getSelectedType: function () {
            return $('.gis-image-type-button.selected', this._$div).data('type');
        },
        _isStateChanged: function () {
            var changed;
            changed = (this._rowChanged(this._$Xrow)) ||
                (this._rowChanged(this._$Yrow)) ||
                (this._rowChanged(this._$TEXTrow)) ||
                (this.options.dataBinded && (this.options.dataBinded.getImageColor() !== this.getSelectedColor() || this.options.dataBinded.getImageType() !== this.getSelectedType()));
            return changed;
        },
        _updateButtonState: function () {
            var buttonSaveText,
                isStateChanged = this._isStateChanged();
            this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
            this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
            this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
            this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
            buttonSaveText = this.options.dataBinded && isStateChanged ? "Подтвердить" : !this.options.dataBinded ? "Новая" : "Подтвердить";
            $('.gis-button-text', this._$buttonNew).html(buttonSaveText);
            var isDataEditable = this.isDataEditable();
            this.switchButtonState(this._$buttonNew, isDataEditable && (!this.options.dataBinded || isStateChanged) && !this._hilightErrors());
            this.switchButtonState(this._$buttonDeselect, this.options.dataBinded);
            this.switchButtonState(this._$buttonDelete, isDataEditable && this.options.dataBinded && this.options.dataBinded.isEditableByUser());
            this.switchButtonState(this._$buttonRevert, isDataEditable && isStateChanged);
            this._$div.tooltip('close');

        },
        _initDialogNew: function () {
            var self = this, $dialog;
            $dialog = $('#object-new-dialog');
            if (!$dialog.length) {
                $dialog = $('<div id="object-new-dialog"/>');
                $dialog.append("<div><span class='dialog-label'>Пиктограмма</span>" + this._HTMLtypeSelector(false, this.options.dataBinded && this.options.dataBinded.getImageType()) + "</div>");
                $dialog.append("<div><span class='dialog-label'>Цвет объекта</span>" + this._HTMLcolorSelector(false, this.options.dataBinded && this.options.dataBinded.getImageColor(), false) + "</div>");
                $dialog.append("<div><span class='dialog-label'>Комментарий</span>" +
                    "<input type='text' id='dialog-new-object-text'/>" +
                    "</div>");
                $dialog.appendTo($(document.body));
                this._activateColorPicker($dialog);
                $($dialog).on('click', '.gis-param-selector', function () {
                    var $this = $(this);
                    if (!$this.hasClass('selected')) {
                        $('.gis-param-selector.selected', $this.parent()).removeClass('selected');
                        $this.addClass('selected');
                    }
                });
                $($dialog).on('dialogclose', function () {
                    var $this = $(this);
                    $('#dialog-new-object-text', $this).val('');
                });
                $($dialog).on('dialogopen', function () {
                    var $this = $(this);
                    self._repaintIcons($('.gis-image-type-list', this));
                    $('.gis-param-selector.selected', $this).removeClass('selected');
                    $($('.gis-param-selector', $this)[0]).addClass('selected');
                    $('.gis-color-button.selected', $this).removeClass('selected');
                    $($('.gis-color-button', $this)[0]).addClass('selected');
                });
            }
            $dialog.dialog({
                dialogClass: "no-title-bar",
                autoOpen: false,
                closeOnEscape: true,
                minHeight: 10,
                minWidth: 210,
                draggable: true,
                resizable: false,
                modal: true,
                buttons: [
                    {
                        text: 'OK',
                        click: function () {
                            var color, text, type, $this;
                            $this = $(this);
                            color = $('.gis-color-button.selected', $this).data('color');
                            type = $('.gis-image-type-button.selected', $this).data('type');
                            text = $('#dialog-new-object-text', $this).val();
                            if (color && type) {
                                self._saveData($dialog.latlng.lng, $dialog.latlng.lat, text, color, type, true);
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
            });
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
        _saveData: function (x, y, text, color, type, forceNew) {
            var newLayer, projectedPoint = this.templateToCoordinate(this.getPointValue(this._$Xrow), this.getPointValue(this._$Yrow));;
            x = x || projectedPoint.x;
            y = y || projectedPoint.y;
            text = text || this._$TEXTrow.val();
            color = color || $('.gis-color-button.selected', this._$div).data('color') || this.options.dataBinded.getImageColor();
            type = type || $('.gis-image-type-button.selected', this._$div).data('type') || this.options.dataBinded.getImageType();
            if (Gis.Util.isNumeric(x) && Gis.Util.isNumeric(y) && color && type) {
                if (!forceNew && this.options.dataBinded) {
                    this.options.dataBinded.setData({
                        icon: Gis.icon({type: type, color: color}),
                        tooltip: text,
                        latitude: y,
                        longitude: x
                    });
                } else {
                    newLayer = Gis.imageLabel({id: Gis.Util.generateGUID(), tooltip: text, latitude: y, longitude: x,
                        icon: Gis.icon({type: type, color: color}), draggable: true, selectable: true});
                    newLayer.addTo(this._containerController.getUIAttached().getMap());
                    this._containerController.getUIAttached().getMap().selectLayer(newLayer);
                }
                this._update();
            } else {
                this._updateState();
            }
        },
        _deleteKeyFire: function (e) {
            Gis.UI.DeleteActions.object.call(this, e);
        },
        _mapClicked: function (e) {
            this._opedDialogNewLabel(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
        },
        _deInitEvents: function () {
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
            this._destroyColorPicker($('#object-new-dialog'));
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
                    data.on('change', this.updateData, this);
                }
                Gis.Widget.Propertys.prototype.bindData.call(this, data);
                this.updateData();
            }
        }
    });

Gis.UI.DeleteActions.object = function (e, dataBinded) {
    var self = this;
    if ((e.srcElement || e.target).type !== 'text') {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить объект?',
            callback: function () {
                self.removeLayerFromMap(dataBinded || self.options.dataBinded);
            },
            context: this,
            id: 'object-remove-dialog'
        }, dataBinded);
    }
};
Gis.Widget.ObjectProperty.CONFIG_TYPES_KEY = 'ui.object_types';
Gis.setConfig(Gis.Widget.ObjectProperty.CONFIG_TYPES_KEY, 'target danger circle storm simple');
Gis.UI.DeleteActions.image = Gis.UI.DeleteActions.object;
Gis.Widget.ObjectProperty.CLASS_NAME = "gis-widget-propertys-object";
Gis.Widget.ObjectProperty.CENTER_CHANGED = 1;
Gis.Widget.ObjectProperty.TEXT_CHANGED = 3;
Gis.Widget.ObjectProperty.BOTH_CHANGED = 2;
Gis.Widget.ObjectProperty.NOT_CHANGED = 0;
Gis.Widget.objectProperty = function (data) {
    return new Gis.Widget.ObjectProperty(data);
};