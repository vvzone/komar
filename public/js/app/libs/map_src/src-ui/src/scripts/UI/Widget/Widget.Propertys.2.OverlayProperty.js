"use strict";
/**
* @extends Gis.Widget.Propertys
* @class
*/
Gis.Widget.OverlayProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.OverlayProperty.prototype
     */
    {
        _typeSelector: true,
        _type: Gis.Objects.Overlay.prototype.options.tacticObjectType,
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
            this.resetOpacityLocal();
            this.options.dataBinded.setTempOpacity(undefined);
            this.options.dataBinded.resetScale();
            this.options.dataBinded.resetAngle();
            if (this._isStateChanged()) {
                this.options.dataBinded.setTempLatlng(null);
            } else {
                this.options.dataBinded.redraw();
            }
            this.updateData();
        },
        resetOpacityLocal: function () {
            this.resetOpacity();
        },
        clean: function () {
            if (this.isRevertAvailable()) {
                this.resetOpacityLocal();
                this.options.dataBinded.setTempOpacity(undefined);
                this.options.dataBinded.resetScale(true);
                this.options.dataBinded.resetAngle(true);
                this.options.dataBinded.saveTempLatlng(false);
            }
            this.updateData();
        },
        _mapClicked: function (text, center) {
            //TODO
        },
        _setAngle: function () {
            this._$angleBlock.html(this.options.dataBinded ? this.round(this.options.dataBinded.getAngle(), 100) : 0)
        },
        round: function (n, e) {
            return Math.round(n * e) / e;
        },
        _setScale: function () {
            this._$scaleBlock.html(this.options.dataBinded ? this.round(this.options.dataBinded.getScale(), 1000) : 1)
        },
        _setData: function () {
            this._setPosition();
            this._setAngle();
            this._setScale();
            if (!this.isChangedOpacity()) {
                this.setOpacity(this.options.dataBinded ? this.options.dataBinded.getOpacity(true) : 0);
            }
        },
        _updateColor: function () {
            //TODO
        },
        _hilightErrors: function () {
            return false;
        },
        updateData: function () {
            this._setData();
            this._updateState();
        },
        draw: function () {
            Gis.Widget.Propertys.prototype.draw.call(this);
            var selected = this._containerController.getUIAttached().getMap().getSelected(),
                keys = Object.keys(selected);
            if (keys.length > 1) {
                this.options.dataBinded = undefined;
            } else if (keys.length && selected[keys[0]].getType() === Gis.Objects.Overlay.prototype.options.tacticObjectType) {
                this.options.dataBinded = selected[keys[0]];
            }
            this.updateData();
        },
        initHTML: function () {
            Gis.Widget.Propertys.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.OverlayProperty.CLASS_NAME);
            this._$dataBlock = $('.gis-color-container.' + Gis.Widget.Propertys.DATA_BLOCK_CLASS, this._$div);
            this._$angleBlock = $('.gis-angle-container.' + Gis.Widget.Propertys.DATA_BLOCK_CLASS, this._$div);
            this._$scaleBlock = $('.gis-scale-container.' + Gis.Widget.Propertys.DATA_BLOCK_CLASS, this._$div);
            this.initSlider(this._$div);
        },
        initDataBlock: function () {
            return "<div class='scroller'><div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Горячие клавиши</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-help-container'>" +
                "<p><span style='font-style: italic'>[W],[A],[S],[D]</span> - перемещение</p>" +
                "<p><span style='font-style: italic'>[Q],[E]</span> - вращение</p>" +
                "<p><span style='font-style: italic'>[Z],[X]</span> - масштабирование</p>" +
                "<p><span style='font-style: italic'>[R],[F]</span> - изменение прозрачности</p>" +
                "<p>При зажатой [Shift] увеличивается шаг операции</p>" +
                "</div>" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Позиция</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
                "</div>" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Угол</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-angle-container'>" +
                "</div>" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Масштаб</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-scale-container'>" +
                "</div>" +
                "</div>\n" +
                this._HTMLSlider() +
                "</div></div>\n";
        },
        _setPosition: function () {
            var pointSrc, pointNew, pointCurrent, geoConverter, newCenter, updatedCenter, isMetric, html = '<li class="gis-widget-info">Выберите объект</li>';
            if (this.options.dataBinded) {
                html = '<li class="gis-widget-info">В исходной позиции</li>';
                if (this.options.dataBinded.isMoved()) {
                    pointSrc = this.coordinateToTemplate(this.options.dataBinded.getOldCenter());
                    newCenter = this.options.dataBinded.getNewCenter();
                    if (newCenter) {
                        pointNew = this.coordinateToTemplate(newCenter);
                    }{
                        updatedCenter = this.options.dataBinded.getUpdatedCenter();
                        if (updatedCenter)
                            pointCurrent = this.coordinateToTemplate(updatedCenter);
                    }
                    geoConverter = this._containerController.getUIAttached().getGeoConverter();
                    isMetric = geoConverter.isMetric(geoConverter.getSelectedSystem());
                    if (!isMetric) {
                        html = '<li class="gis-widget-info">Исходная:</li>';
                        html += '<li class="gis-widget-info">' + this._HTMLRowName(true) + ': <span class="value-y">' + pointSrc.y + ' </span></span><span>' + this._HTMLRowName() + ': <span class="value-x">' + pointSrc.x + '</span></li>';
                        if (pointCurrent) {
                            html += '<li class="gis-widget-info">Текущая:</li>';
                            html += '<li class="gis-widget-info">' + this._HTMLRowName(true) + ': <span class="value-y">' + pointCurrent.y + ' </span></span><span>' + this._HTMLRowName() + ': <span class="value-x">' + pointCurrent.x + '</span></li>';
                        }
                        if (pointNew) {
                            html += '<li class="gis-widget-info">Новая:</li>';
                            html += '<li class="gis-widget-info">' + this._HTMLRowName(true) + ': <span class="value-y">' + pointNew.y + ' </span></span><span>' + this._HTMLRowName() + ': <span class="value-x">' + pointNew.x + '</span></li>';
                        }
                    } else {
                        html = '<li class="gis-widget-info">Исходная:</li>';
                        html += '<li class="gis-widget-info">' + this._HTMLRowName() + ': <span class="value-x">' + pointSrc.x + ' </span></span><span>' + this._HTMLRowName(true) + ': <span class="value-y">' + pointSrc.y + '</span></li>';
                        if (pointCurrent) {
                            html += '<li class="gis-widget-info">Текущая:</li>';
                            html += '<li class="gis-widget-info">' + this._HTMLRowName() + ': <span class="value-x">' + pointCurrent.x + ' </span></span><span>' + this._HTMLRowName(true) + ': <span class="value-y">' + pointCurrent.y + '</span></li>';
                        }
                        if (pointNew) {
                            html += '<li class="gis-widget-info">Новая:</li>';
                            html += '<li class="gis-widget-info">' + this._HTMLRowName() + ': <span class="value-x">' + pointNew.x + ' </span></span><span>' + this._HTMLRowName(true) + ': <span class="value-y">' + pointNew.y + '</span></li>';
                        }
                    }
                }
            } else {

            }
            this._$dataBlock.html('<ul class="gis-widget-info">' + html + '</ul>');
        },
        _skChanged: function () {
            this.updateData();
            Gis.Widget.Propertys.prototype._skChanged.call(this);
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
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, 'Подтвердить', !this.options.dataBinded) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.OverlayProperty.BUTTON_CLEAN_CLASS, 'Сброс', !this.options.dataBinded, 'Вернуть к исходным координатам', true) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                "</ul>\n" +
                "</div>\n";
        },

        setBounds: function () {
            var maxHeight, heightContainer, $wrapper, $wrParent, pointsHeight, infoPadding;
            heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
            maxHeight = heightContainer - Gis.Widget.Scheme.needHeight(heightContainer);
            $wrapper = $('.scroller', this._$div);
            $wrParent = $wrapper.parent();
            $('.gis-widget-propertys-buttons-wraper', this._$div)
                .each(function () {
                    maxHeight -= $(this).outerHeight(true);
                });
//            maxHeight -= $wrapper.outerHeight(true) - $wrapper.height() + $wrParent.outerHeight(true) - $wrParent.height() - this._$div.outerHeight(true) + this._$div.height();
            $wrapper.css({
                maxHeight: maxHeight
            });
        },
        _isStateChanged: function () {
            var data = this.options.dataBinded;
            return data && data.getTempLatlng();
        },
        _isAngleAndScaleChanged: function () {
            var data = this.options.dataBinded;
            return data && (data.isAngleChanged() || data.isScaleChanged());
        },
        _isOpacityChanged: function () {
            return (this.options.dataBinded && (this.options.dataBinded && this.options.dataBinded.getOpacity() !== this.getOpacity()));
        },
        isRevertAvailable: function () {
            return this.options.dataBinded && (this.options.dataBinded.isMoved() || this.options.dataBinded.isDeformed());
        },
        _updateButtonState: function () {
            var buttonSaveText,
                isStateChanged = this._isStateChanged() || this._isOpacityChanged() || this._isAngleAndScaleChanged(),
                isRevertable = this.isRevertAvailable();
            this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
            this._$buttonClean = this._$buttonClean || $('.' + Gis.Widget.OverlayProperty.BUTTON_CLEAN_CLASS, this._$div);
            this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
            this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
            this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
            buttonSaveText = 'Подтвердить';
            $('.gis-button-text', this._$buttonNew).html(buttonSaveText);
            var isDataEditable = this.isDataEditable();
            this.switchButtonState(this._$buttonNew, this.options.dataBinded && isStateChanged && !this._hilightErrors());
            this.switchButtonState(this._$buttonDeselect, this.options.dataBinded);
            this.switchButtonState(this._$buttonClean, this.options.dataBinded && isRevertable);
            this.switchButtonState(this._$buttonDelete, this.options.dataBinded);
            this.switchButtonState(this._$buttonRevert, this.options.dataBinded && isStateChanged);
        },
        _sliding: function (opacity) {
            if (this.options.dataBinded) {
                this.options.dataBinded.setTempOpacity(opacity);
            }
        },
        _saveData: function (params) {
            if (this.options.dataBinded) {
                var opacity = this.getOpacity(),
                    opacityChanged = this._isOpacityChanged(),
                    angleChanged = this._isAngleAndScaleChanged();
                this.options.dataBinded.saveScale();
                this.options.dataBinded.saveAngle();
                var stateChanged = this._isStateChanged();
                if (stateChanged || angleChanged) {
                    this.options.dataBinded.fullSave(true, opacityChanged);
                }
                if (opacityChanged) {
                    this.options.dataBinded.setOpacity(opacity);
                }
                this._updateState();
            }
            this.resetOpacity();
        },
        _deleteKeyFire: function (e) {
            Gis.UI.DeleteActions[Gis.Objects.Overlay.prototype.options.tacticObjectType].call(this, {srcEvent: e, srcElement: this.options.dataBinded}, this.options.dataBinded);
        },
        _deInitEvents: function () {
            this.resetOpacityLocal();
            var map = this._containerController.getUIAttached().getMap();
            this._$div.off({
                click: this._returnFunction,
                keyup: this._KeyUpReturnFunction
            }, '.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME);
            this._$div.off({
                click: this._cleanFuncion,
                keyup: this._KeyUpCleanFunction
            }, '.' + Gis.Widget.OverlayProperty.BUTTON_CLEAN_CLASS);
            this._$div.off({
                click: this._revertFunction,
                keyup: this._KeyUpRevertFunction
            }, '.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME);
            this._$div.off({
                click: this._deselectFunction,
                keyup: this._KeyUpDeselectFunction
            }, '.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME);
            this._$div.off({
                click: this._deleteFunction,
                keyup: this._KeyUpDeleteFunction
            }, '.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME);
            $(document.body).off('keyup', this._KeyUpEscFunction);
            $(document.body).on('keydown', this._bodyKeyUpFunction);
            map.off('mousedown', this._onMouseDown, this);
            map.off('mousemove', this._onMouseMove, this);
            map.off('mouseout', this._onMouseOut, this);
            this._deinitDataEvents();
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
            this._cleanFuncion = this._cleanFuncion || function () {
                if (self.isButtonEnable(this)) {
                    self.clean();
                }
            };
            this._deselectFunction = this._deselectFunction || function () {
                if (self.isButtonEnable(this)) {
                    self._containerController.getUIAttached().getMap().unselectLayer(self.options.dataBinded);
                }
            };
            this._bodyKeyUpFunction = this._bodyKeyUpFunction || function (e) {
                var opacityStep = e.shiftKey ? 0.1 : 0.01;
                switch (e.keyCode) {
                    case 82://к
                        opacityStep = -opacityStep;
                    case 70://а
                        Gis.requestAnimationFrame(50)(function () {
                            self._changeOpacity(opacityStep);
                        });
                        e.stopPropagation();
                        e.preventDefault();
                        break;
                }
            };
            this._KeyUpReturnFunction = this._KeyUpReturnFunction || this.generateEnteredFunction(self._deleteFunction);
            this._KeyUpEscFunction = this._KeyUpEscFunction || this.generateEskeyFunction(self._escFunction);
            this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || this.generateEnteredFunction(self._returnFunction);
            this._KeyUpDeselectFunction = this._KeyUpDeselectFunction || this.generateEnteredFunction(self._deselectFunction);
            this._KeyUpRevertFunction = this._KeyUpRevertFunction || this.generateEnteredFunction(self._revertFunction);
            this._KeyUpCleanFunction = this._KeyUpCleanFunction || this.generateEnteredFunction(self._cleanFuncion);
        },
        _changeOpacity: function (step) {
            if (this.options.dataBinded) {
                var opacity = this.options.dataBinded.getOpacity(true);
                opacity += step;
                opacity = opacity > 1 ? 1 : opacity < 0 ? 0 : opacity;
                this._slided = true;
                this._sliding(opacity);
                this.setOpacity(this.options.dataBinded.getOpacity(true));
                this._updateState();
            }
        },
        _initEvents: function () {
            var map = this._containerController.getUIAttached().getMap();
            $(document.body).on('keyup', this._KeyUpEscFunction);
            $(document.body).on('keydown', this._bodyKeyUpFunction);
            this._$div.on({
                click: this._returnFunction,
                keyup: this._KeyUpReturnFunction
            }, '.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME);
            this._$div.on({
                click: this._cleanFuncion,
                keyup: this._KeyUpCleanFunction
            }, '.' + Gis.Widget.OverlayProperty.BUTTON_CLEAN_CLASS);
            this._$div.on({
                click: this._revertFunction,
                keyup: this._KeyUpRevertFunction
            }, '.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME);
            this._$div.on({
                click: this._deselectFunction,
                keyup: this._KeyUpDeselectFunction
            }, '.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME);
            this._$div.on({
                click: this._deleteFunction,
                keyup: this._KeyUpDeleteFunction
            }, '.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME);
            map.on('mousedown', this._onMouseDown, this);
            map.on('mousemove', this._onMouseMove, this);
            map.on('mouseout', this._onMouseOut, this);
            this._initDataEvents();
            Gis.Widget.Propertys.prototype._initEvents.call(this);
        },
        _update: function () {
            this.updateData();
        },
        _deinitDataEvents: function () {
            if (this.options.dataBinded) {
                this.options.dataBinded.off('change localchange', this.updateData, this);
            }
        },
        _initDataEvents: function () {
            if (this.options.dataBinded) {
                this.options.dataBinded.on('change localchange', this.updateData, this);
            }
        },
        bindData: function (data) {
            $(':focus').blur();
            if (!data && !this._cleared) {
                this._cleared = true;
            }
            if (data !== this.options.dataBinded) {
                this.resetOpacityLocal();
                this._deinitDataEvents();
                Gis.Widget.Propertys.prototype.bindData.call(this, data);
                this.updateData();
                this._initDataEvents();
            }
        }
    });

Gis.UI.DeleteActions[Gis.Objects.Overlay.prototype.options.tacticObjectType] = function (e, dataBinded) {
    if ((dataBinded || this.options.dataBinded).getType() === Gis.Objects.Overlay.prototype.options.tacticObjectType) {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить оверлей?',
            callback: function () {
                this.removeLayerFromMap(dataBinded || this.options.dataBinded);
            },
            context: this,
            id: 'overlay-remove-dialog'
        }, dataBinded);
    }
};
Gis.Widget.OverlayProperty.CLASS_NAME = "gis-widget-propertys-overlay";
Gis.Widget.OverlayProperty.BUTTON_CLEAN_CLASS = "gis-propertys-button-clean-overlay";
Gis.Widget.OverlayProperty.include(Gis.opacityWidget);
Gis.Widget.overlayProperty = function (data) {
    return new Gis.Widget.OverlayProperty(data);
};