"use strict";
/**
* @extends Gis.Widget.Propertys
* @class
*/
Gis.Widget.HeatMapProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.HeatMapProperty.prototype
     */
    {
        _typeSelector: true,
        _type: Gis.Objects.HeatMap.prototype.options.tacticObjectType,
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
                this._updateStyle();
            }
            this.updateData();
        },
        _mapClicked: function (text, center) {
            //TODO
        },
        _setData: function (text, center) {
            //TODO
        },
        _updateColor: function () {
            //TODO
        },
        _hilightErrors: function () {
            var error = false;
            if (!Gis.Util.isDefine($('.gis-color-button.selected', this._$div).data('index'))) {
                error = true;
            }
            return error;
        },
        updateData: function () {
            this._setData();
            this.initGradientList(this._$div, this.options.dataBinded);
            if (!this._pressed) {
                this._updateColor();
            }
            this._updateState();
        },
        draw: function () {
            Gis.Widget.Propertys.prototype.draw.call(this);
            var selected = this._containerController.getUIAttached().getMap().getSelected(),
                keys = Object.keys(selected);
            if (keys.length > 1) {
                this.options.dataBinded = undefined;
            } else if (keys.length && selected[keys[0]].getType() === Gis.Objects.HeatMap.prototype.options.tacticObjectType) {
                this.options.dataBinded = selected[keys[0]];
            }
            this.updateData();
        },
        initHTML: function () {
            Gis.Widget.Propertys.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.HeatMapProperty.CLASS_NAME);
            this.initGradientList(this._$div);
        },
        initDataBlock: function () {
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Вид</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
                this._HTMLgradientSelector(this.options.dataBinded) +
                "</div>" +
                "</div>\n" +
                "</div>\n";
        },
        _onMouseDown: function (e) {
            //todo
        },
        _onMouseMove: function (e) {
            //TODO
        },
        _onMouseOut: function () {
            //TODO
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
            return (this.options.dataBinded && (!this._equalsColor(this.options.dataBinded) ||
                (this.options.dataBinded && this.getSelectedStyle() !== this.options.dataBinded.getTag('style'))));
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
            this.switchButtonState(this._$buttonNew, this.options.dataBinded && isStateChanged && !this._hilightErrors());
            this.switchButtonState(this._$buttonDeselect, this.options.dataBinded);
            this.switchButtonState(this._$buttonDelete, this.options.dataBinded);
            this.switchButtonState(this._$buttonRevert, isStateChanged);
        },
        _saveData: function (params) {
            if (this.options.dataBinded) {
                var selectedColorList = this.getSelectedColorList();
                this.options.dataBinded.setUserSelectedGradient(selectedColorList && Gis.Objects.HeatMap.unParseColors(selectedColorList));
                this._updateState();
            }
        },
        _deleteKeyFire: function (e) {
            Gis.UI.DeleteActions[Gis.Objects.HeatMap.prototype.options.tacticObjectType].call(this, {srcEvent: e, srcElement: this.options.dataBinded});
        },
        _deInitEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
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
            map.off('mousedown', this._onMouseDown, this);
            map.off('mousemove', this._onMouseMove, this);
            map.off('mouseout', this._onMouseOut, this);
            map.off('stylechanged', this._updateStyleList, this);
            Gis.Widget.Propertys.prototype._deInitEvents.call(this);
        },
        _createEventFunctions: function () {
            var self = this;
            this._returnFunction = this._returnFunction || function (e) {
                if (self.isButtonEnable(this)) {
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

Gis.UI.DeleteActions[Gis.Objects.HeatMap.prototype.options.tacticObjectType] = function (e, dataBinded) {
    if ((dataBinded || this.options.dataBinded).getType() === Gis.Objects.HeatMap.prototype.options.tacticObjectType) {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить тепловую карту?',
            callback: function () {
                this.removeLayerFromMap(dataBinded || this.options.dataBinded);
            },
            context: this,
            id: 'heatmap-remove-dialog'
        }, dataBinded);
    }
};
Gis.Widget.HeatMapProperty.CLASS_NAME = "gis-widget-propertys-heatmap";
Gis.Widget.HeatMapProperty.include(Gis.gradientWidget);
Gis.Widget.heatMapProperty = function (data) {
    return new Gis.Widget.HeatMapProperty(data);
};