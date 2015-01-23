"use strict";

/**
 * Базовый класс виджета настроек
 * @requires jQuery
 * @class
 * @extends Gis.Widget.Base
 */
Gis.Widget.Propertys = Gis.Widget.Base.extend(
    /** @lends Gis.Widget.Propertys.prototype */
    {
//        _typePrefix: 'property',
        _type: 'propertys',
        _defaultColor: '#FFFFFF',
        _defaultStyle: {
            color: '#AF2D51',
            border: 'white',
            selectedBorder: 'rgb(75, 84, 255)',
            thickness: 2,
            icon: {type: 'circle', color: '#AF2D51', width: 15}
        },
        options: {
            position: "right_inner",
            enabled: true,
            needCheckLayers: true,
            dataBinded: undefined
        },
        checkNumeric: function ($row) {
            var error = false;
            if (!$.isNumeric(this.getPointValue($row))) {
                error = true;
                $row.addClass('error');
            } else {
                $row.removeClass('error');
            }
            return error;
        },

        getNeedSize: function () {
            return [this._$div.outerWidth(true), 200];
        },
        checkCoordinate: function ($row) {
            var error = false;
            if ($row.val() === '' || !$.isNumeric(this._containerController.getUIAttached().getGeoConverter().coordinateFromTeplate(this.getPointValue($row)))) {
                error = true;
                $row.addClass('error');
            } else {
                $row.removeClass('error');
            }
            return error;
        },
        checkPoint: function ($pointContainer) {
            var error = false, point = this.getPointWidgetData($pointContainer);
            if (point.x === '') {
                error = true;
                $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, $pointContainer).addClass('error');
            } else if (point.y === '') {
                error = true;
                $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, $pointContainer).addClass('error');
            } else {
                $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS, $pointContainer).removeClass('error');
            }
            return error;
        },
        _maskInput: function (unmask) {
            var converter = this._containerController.getUIAttached().getGeoConverter(),
                currentMaskX = converter.getCurrentMask(),
                currentMaskY = converter.getCurrentMask(true),
                funcComplited = function () {
                    //TODO проработать дублирование
                    var $container = $(this).parent().parent(), $next = $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, $container);
                    if (!$next.length) {
                        $next = $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, $container.parent());
                    }
                    $next.focus();
                },
                funcComplitedX = function () {
                    //TODO проработать дублирование
                    var $container = $(this).parent().parent().parent(), $next = $container.next();
                    if ($next.length) {
                        $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, $next).focus();
                    }
                };
            if (!unmask && currentMaskX) {
                $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, this._$div).each(function () {
                    $(this).mask(currentMaskX, {completed: funcComplitedX, replacement: '0'});
                });
            } else {
                $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, this._$div).unmask();
            }
            if (!unmask && currentMaskX) {
                $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, this._$div).mask(currentMaskY, {completed: funcComplited, replacement: '0'});
            } else {
                $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, this._$div).unmask();
            }
        },
        _rowChanged: function (row) {
            row = $(row);
            return this.getPointValue(row) !== this.getPointValue(row, true);
        },
        /**
         *
         * @param $row jQuery обертка над объектом HTMLInputElement
         * @param {string} val видимое пользователю значение
         * @param {string} [dataVal] данные сохраненные в поле
         * @private
         */
        _setValue: function ($row, val, dataVal) {
            if ($row.data('is-point')) {
                return this.setHtmlPointValue($row, val, dataVal);
            }
            $row = $($row);
            val = val == undefined ? '' : val;
            $row.val(val);
            if (dataVal != undefined) {
                $row.data('old-val', dataVal);
            }
            return this;
        },
        bindData: function (data) {
            if (this.options.dataBinded !== data) {
                this.options.dataBinded = data;
                this._update();
            }
        },
        _hilightErrors: function () {
        },
        _generateKeyPressFunction: function (returnKeyCode, callback) {
            return function (e) {
                if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                    callback();
                }
                e.stopPropagation();
            };
        },
        generateEskeyFunction: function (callback) {
            var escKeyKode = 27;
            return this._generateKeyPressFunction(escKeyKode, callback);
        },
        generateEnteredFunction: function (callback) {
            var returnKeyCode = 13;
            return this._generateKeyPressFunction(returnKeyCode, callback);
        },
        _updateState: function () {
            this._updateButtonState();
            this._updateCoordinatesState();
            this._updateColorState();
            this._updateTypeState();
            this._updateParamsState();
            this._hilightErrors();
        },
        isStyleChanged: function () {
            return this.getSelectedStyle() != this.getValueFromData('getTag', null, 'style');
        },
        /**
         * Запросить данные из прикрепленного объекта
         * все параметра после defaultValue будут передаты в getter
         * @param {string} getter имя функции геттера
         * @param {*} defaultValue значение по умолчанию
         * @returns {*}
         */
        getValueFromData: function (getter, defaultValue) {
            return (this.options.dataBinded && this.options.dataBinded[getter]) ?
                this.options.dataBinded[getter].apply(this.options.dataBinded, Array.prototype.slice.call(arguments, 2, arguments.length)) : defaultValue;
        },
        initialize: function (data) {
            var self = this;
            Gis.Widget.Base.prototype.initialize.call(this, data);
            this._paramClickFunction = this._paramClickFunction || function () {
                var $this = $(this);
                if (!$this.hasClass('selected') && self.isDataEditable()) {
                    $('.gis-param-selector.selected', $this.parent()).not($this).removeClass('selected');
                    $this.addClass('selected');
                    self.fire('color-change');
                    self.fire('change');
                }
            };
            this._CustomColorChangedFunc = function ($parent) {
                return function (hsb, hex, rgb, el) {
                    var $this = (el && $(el)) || $('.gis-color-custom', $parent), bg = 'rgba(' + rgb.r + ', ' + rgb.g + ',' + rgb.b + ', ' + rgb.a  / 100 + ')';
                    $('.gis-param-selector.selected', $this.parent()).not($this).removeClass('selected');
                    $this.addClass('selected');
                    $this.data('color', bg);
                    $('span', $this).css('background', bg);
                    self.fire('color-change');
                    self.fire('change');
                }
            }
        },
        initHTML: function () {
            if (!this._$div) {
                Gis.Widget.Base.prototype.initHTML.call(this);
                this._$div.addClass(Gis.Widget.Propertys.CLASS_NAME);
                this._$div.append(this.initDataBlock());
                this._$div.append(this.initButtonsBlock());
            }
        },
        onRemove: function () {
            Gis.Widget.Base.prototype.onRemove.call(this);
        },
        onAdd: function (container) {
            if (this.options.hasOwnProperty('colors')) {
                this.options.colors = this.options.colors || container.getUIAttached().getStyle('predefinedColors');
            }
            Gis.Widget.Base.prototype.onAdd.call(this, container);
            this.draw();
            this.setBounds();
        },
        initDataBlock: function () {
        },
        initButtonsBlock: function () {
        },
        _initDialogBaseLayer: function () {
            var self = this, $dialog;
            $dialog = $('#base-layer-dialog');
            if (!$dialog.length) {
                $dialog = $('<div id="base-layer-dialog"><h2>Для продолжения необходимо включить отображение базового слоя. Сделать это сейчас?</h2></div>');
                $dialog.appendTo($(document.body));
                $dialog.dialog($.extend(this._dialogOptions, {
                    buttons: [
                        {
                            text: 'Да',
                            click: function () {
                                self._containerController.getUIAttached().getMap().getRenderer().getVisibilityController().setLayerVisible(Gis.ObjectVisibilityController.BASE_LAYER_KEY, true)
                                $(this).dialog("close");
                            }
                        },
                        {
                            text: 'Нет',
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    ]
                }));
            }
            return $dialog;
        },
        checkBaseLayer: function () {
            if (!this.options.needCheckLayers || this._containerController.getUIAttached().getMap().getRenderer().getVisibilityController().isLayerVisible(Gis.ObjectVisibilityController.BASE_LAYER_KEY)) {
                return true;
            } else {
                this._initDialogBaseLayer().dialog('open');
                return false;
            }
        },
        _mapClickedWithCheck: function (e) {
            if (this.checkBaseLayer()) {
                this._mapClicked(e);
            } else {

            }
        },
        _mapClicked: function (e) {
        },
        /**
         * Обновить данные виджета из привязанного объекта
         * потомки должны переопределить
         */
        updateData: function () {
        },
        /**
         * Применить изменения
         * потомки должны переопределить
         * @private
         */
        _saveData: function () {
        },
        /**
         * Пишет данные из объекта в поля виджета
         * потомки должны переопределить
         * @private
         */
        _setData: function () {
        },
        isButtonEnable: function (button) {
            return !Gis.HTML.hasClass(button, 'disabled');
        },
        switchButtonState: function (button, enable) {
            if (enable) {
                button.removeClass('disabled');
            } else {
                button.addClass('disabled');
            }
        },
        switchInputState: function (enable) {
            var rows = Array.prototype.slice.call(arguments, 1);
            if (enable) {
                rows.forEach(function (val) {
                    val.removeAttr('disabled');
                });
            } else {
                rows.forEach(function (val) {
                    val.attr('disabled', 'disabled');
                });
            }
        },

        _HTMLstyleSelector: function (title) {
            var result = '', styles;
            styles = this._containerController.getUIAttached().getMap().getStylesByObjectType(this._type);
            if (this._typeSelector && styles && styles.length) {
                result = '<div><p class="data-title">' + (title || 'Тип') + '</p><div id="gis-ui-style-selector"></div></div>';
            }
            return result;
        },
        styleSelected: function () {
            this._updateState();
        },
        onBeforeStyleOpen: function (connainer) {
            return !$('>.disabled', connainer).length;
        },
        getSelectedColor: function () {
            return $('.gis-color-button.selected', this._$div).data('color');
        },
        _updateParamsState: function () {

        },
        /**
         * Для скрытия выбора цвета если выбран стиль.
         * Думаю не нужно
         * @param hide
         * @private
         */
        _updateColorState: function () {
            this.switchButtonState($('.gis-color-button', this._$div), this.isDataEditable());
        },
        _updateCoordinatesState: function () {
            this.switchButtonState($('.gis-color-button', this._$div), this.isDataEditable());
        },
        _updateTypeState: function () {
            this.switchButtonState($('.html-select-view-container', this._$div), this.isDataEditable());
        },
        _updateStyle: function () {
            if (this._styleList) {
                this._styleList.setValueSelected((this.options.dataBinded && this.options.dataBinded.getTag('style')) || 'deffaultValue')
            }
        },
        getSelectedStyle: function () {
            var selected = this._styleList && this._styleList.getValueSelected();
            return  selected !== 'deffaultValue' ? selected : null;
        },
        _getStyleValues: function () {
            var data = [],
                map = this._containerController.getUIAttached().getMap(),
                styles = map.getStylesByObjectType(this._type),
                i,
                len = styles.length;
            data.push({
                val: 'deffaultValue',
                name: 'Стиль'
            });
            for (i = 0; i < len; i += 1) {
                data.push({
                    val: styles[i],
                    name: map.getStyle(styles[i]).getStyleName()
                });
            }
            return data;
        },
        /**
         * Обновление списка выбора стилей/типов
         * @private
         */
        _updateStyleList: function () {
            var style = (this.options.dataBinded && this.options.dataBinded.getStyle());
            this._styleList = Gis.HTML.listView({
                data: this._getStyleValues(),
                container: $('#gis-ui-style-selector', this._$div)[0],
                callback: this.styleSelected,
                onBeforeOpen: this.onBeforeStyleOpen,
                context: this,
                defaultValue: {val: (style && style.getStyleId()) || 'deffaultValue', name: (style && style.getStyleName()) || 'Стиль полигона'}
            });
        },
        _HTMLcolorSelector: function (drawSelected, currentColor, skipPicker) {
            var li, ul, notNeedAddCurrentColor = false;
            li = "";
            currentColor = currentColor || (this.options.dataBinded && this.options.dataBinded.getBackColor && this.options.dataBinded.getBackColor());
            this.options.colors.forEach(function (color, index) {
                notNeedAddCurrentColor = notNeedAddCurrentColor || color === currentColor;
                li += "<li class='gis-propertys-button gis-color-button" + (((drawSelected && color === currentColor) || (!currentColor && !index)) ? " selected" : '') + " gis-param-selector' data-color='" + color + "'>" +
                    "<span style='background: " + color + ";'></span></li>";
            });
            if (drawSelected && !notNeedAddCurrentColor && currentColor) {
                li += "<li class='gis-propertys-button gis-color-button gis-param-selector selected " + ($(document.body).ColorPicker ? "gis-color-custom" : "") + "' data-color='" + currentColor + "'><span style='background: " + currentColor + ";'></span></li>";
            } else if (!skipPicker && $(document.body).ColorPicker) {
                li += "<li class='gis-propertys-button gis-color-button gis-param-selector gis-color-custom' data-color='" + this._defaultColor + "' value='" + this._defaultColor + "'><span style='background: " + this._defaultColor + ";'></span></li>";
            }
            return "<ul class='gis-color-list '>" + li + "</ul>";
        },
        _repaintIcons: function ($parent) {
            $('.gis-image-type-button', $parent).each(function () {
                var $canvas = $('canvas', this);
                var cnvs = $canvas.length ? $canvas[0] : document.createElement('canvas');
                if (!$canvas.length) {
                    cnvs.width = 12;
                    cnvs.height = 12;
                    $('span', this).append(cnvs);
                }
                Gis.Additional.Icon[$(this).data('type')]('#FFFFFF', 12, cnvs, "#828282");
            });
        },
        _HTMLtypeSelector: function (drawSelected, currentType) {
            var li, ul, notNeedAddCurrentType = false;
            li = "";
            currentType = currentType || (this.options.dataBinded && this.options.dataBinded.getImageType && this.options.dataBinded.getImageType());
            this.options.types.forEach(function (type) {
                if (type && Gis.Additional.Icon[type]) {
                    notNeedAddCurrentType = notNeedAddCurrentType || type === currentType;
                    li += "<li title='" + type + "' class='gis-propertys-button gis-image-type-button" + (drawSelected && type === currentType ? " selected" : '') + " gis-param-selector' data-type='" + type + "'>" +
                        "<span></span></li>";
                }
            });
            if (drawSelected && !notNeedAddCurrentType && currentType) {
                li += "<li title='" + currentType + "' class='gis-propertys-button gis-image-type-button gis-param-selector selected' data-type='" + currentType + " ' ><span></span></li>";
            }
            return "<ul class='gis-image-type-list '>" + li + "</ul>";
        },
        /**
         * Нажата клавиша delete
         * изначально не переопределяет действие браузера по умолчанию
         * @private
         */
        _deleteKeyFire: function () {
        },
        /**
         * Сбросить изменения текстового поля
         * @param {HTMLInputElement} row
         * @private
         */
        _revertTextData: function (row) {
            row = $(row);
            if (row.data('is-point')) {
                this.setHtmlPointValue(row, this.getPointValue(row, true));
                return this;
            }
            row.val(row.data('old-val'));
            return this;
        },
        /**
         * Изменение размера виджета при ресайзе
         */
        setBounds: function () {
            var maxHeight, heightContainer, $wrapper, $wrParent;
            heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
            maxHeight = heightContainer - Gis.Widget.Scheme.needHeight(heightContainer);
            $wrapper = $('#points-selector', this._$div);
            $wrParent = $wrapper.parent();
            $('.gis-widget-propertys-wraper, .gis-widget-propertys-buttons-wraper', this._$div)
                .not($wrParent)
                .each(function () {
                    maxHeight -= $(this).outerHeight(true);
                });
            maxHeight -= $wrapper.outerHeight(true) - $wrapper.height() + $wrParent.outerHeight(true) - $wrParent.height() + $('.gis-widget-propertys-title', $wrParent).outerHeight(true) - this._$div.outerHeight(true) + this._$div.height();
            $wrapper.css({
                maxHeight: Math.max(maxHeight, 40)
            });
        },
        /**
         * Вызывается после инициализации и вставки HTML
         * @protected
         */
        _initEvents: function () {
            var self = this;
            Gis.Widget.Base.prototype._initEvents.call(this);
            this._mapKeyUp = this._mapKeyUp || function (e) {
                var backSpaceCode = 8,
                    deleteCode = 46,
                    keyCode = e.keyCode || parseInt(e.charCode, 10);
                if (keyCode === backSpaceCode || keyCode === deleteCode) {
                    self._deleteKeyFire(e);
                }
            };
            this._mapKeyPress = this._mapKeyPress || function (e) {
                var backSpaceCode = 8,
                    keyCode = e.keyCode || parseInt(e.charCode, 10);
                if ((e.srcElement || e.target).type !== 'text' && keyCode === backSpaceCode) {
                    e.preventDefault();
                    return false;
                }
            };
            this._containerController.getUIAttached().getMap().on('click', this._mapClickedWithCheck, this);
            document.body.addEventListener('keydown', this._mapKeyPress);
            document.body.addEventListener('keyup', this._mapKeyUp);
            $(this._$div).on('click', '.gis-param-selector', this._paramClickFunction);
            this.on('change', this._updateState, this);
            this._containerController.getUIAttached().on('sizerecalculated', this.setBounds, this);
            this._activateColorPicker();
            this._$div.tooltip({track: true});
            this._maskInput();
        },

        _destroyColorPicker: function ($parent) {
            $parent = $parent || this._$div;
            if ($(document.body).ColorPickerDestroy && $('.gis-color-custom', $parent).length) {
                $('.gis-color-custom', this._$div).ColorPickerDestroy();
            }
        },
        _activateColorPicker: function ($parent) {
            $parent = $parent || this._$div;
            if ($(document.body).ColorPicker && $('.gis-color-custom', $parent).length && this.isDataEditable()) {
                var colorstring = $('.gis-color-custom span', $parent).css('background-color');
                $('.gis-color-custom', $parent).ColorPicker({
                    color: (colorstring && new RGBColor(colorstring)) || this._defaultColor,
                    onSubmit: this._CustomColorChangedFunc($parent),
                    onChange: this._CustomColorChangedFunc($parent)
                });
            }
        }, _updateColor: function (html) {
        this._destroyColorPicker();
        $('.gis-color-list', this._$div).replaceWith(html || this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor()));
        this._activateColorPicker();
    },
        _skChanged: function (e) {
            var oldSk, newSk, oldTmpl, geoConverter, point, pointOld, srcCenter, srcCenterTemplated, valuePoint, dataPoint, selectedSystem, $listRow;
            if (e && this._$Xrow && this._$Yrow) {
                geoConverter = this._containerController.getUIAttached().getGeoConverter();
                oldSk = e.oldSk;
                oldTmpl = e.oldTemplate;
                selectedSystem = geoConverter.getSelectedSystem();
                if (geoConverter.isMetric(oldSk) !== geoConverter.isMetric(selectedSystem)) {
                    $listRow = this._$Xrow.parent().parent().parent();
                    if (geoConverter.isMetric(selectedSystem)) {
                        $listRow.insertBefore(this._$Yrow.parent().parent().parent());
                    } else {
                        $listRow.insertAfter(this._$Yrow.parent().parent().parent());
                    }
                }
                newSk = selectedSystem;
                srcCenter = this.options.dataBinded && this.options.dataBinded.getLatLng();
                srcCenterTemplated = srcCenter && this.coordinateToTemplate(srcCenter);
                point = geoConverter.convert(oldSk, newSk, this.getPointValue(this._$Xrow, null, oldSk, oldTmpl), this.getPointValue(this._$Yrow, null, oldSk, oldTmpl));
                pointOld = geoConverter.convert(oldSk, newSk, this.getPointValue(this._$Xrow, true, oldSk, oldTmpl), this.getPointValue(this._$Yrow, true, oldSk, oldTmpl));
                valuePoint = Gis.UI.coordinate(this._rowChanged(this._$Xrow) ? point.x : srcCenterTemplated ? srcCenterTemplated.x : point.x, this._rowChanged(this._$Yrow) ? point.y : srcCenterTemplated ? srcCenterTemplated.y : point.y);
                dataPoint = Gis.UI.coordinate(this._rowChanged(this._$Xrow) ? pointOld.x : srcCenterTemplated ? srcCenterTemplated.x : pointOld.x, this._rowChanged(this._$Yrow) ? pointOld.y : srcCenterTemplated ? srcCenterTemplated.y : pointOld.y);
                this.setHtmlPointSelectorWidgetData(this._$CoordinateContainer, valuePoint, dataPoint);
            }
            Gis.Widget.Base.prototype._skChanged.call(this);
            this._maskInput();
        },
        _deInitEvents: function () {
            Gis.Widget.Base.prototype._deInitEvents.call(this);
            this.off('change', this._updateState, this);
            this._containerController.getUIAttached().getMap().off('click', this._mapClickedWithCheck, this);
            document.body.removeEventListener('keydown', this._mapKeyPress);
            document.body.removeEventListener('keyup', this._mapKeyUp);
            this._containerController.getUIAttached().off('sizerecalculated', this.setBounds, this);
            $(this._$div).off('click', '.gis-param-selector', this._paramClickFunction);
            try {
                this._$div.tooltip('destroy');
            } catch (e) {
                Gis.Logger.log(e.message);
            }
            this._destroyColorPicker();
            this._maskInput(true);
        },
        activate: function () {
            this._initEvents();
        },
        deactivate: function () {
            this._deInitEvents();
        },
        draw: function () {
            $(this.container).prepend(this._$div);
            this._initEvents();
        },
        _update: function () {
        },
        keyPressPreventDefault: function (e) {
            e.stopPropagation();
        },
        _buttonHTML: function (className, text, enabled, title, noIcon) {
            text = text || "";
            title = title || Gis.Widget.Propertys.titles[className] || "";
            return "<button title='" + title + "' class='widget-control " + Gis.Widget.Propertys.BUTTON_CLASS_NAME + " " + (!enabled ? "disabled" : "") + " " + className + (text ? ' gis-button-with-text' : '') + "'>" +
                (noIcon ? '' : "<span class='gis-button-icon'></span>") +
                "<span class='gis-button-text'>" + text + "</span></button>";
        }
    }
);

Gis.Widget.Propertys.CLASS_NAME = 'gis-widget-propertys';
Gis.Widget.Propertys.DATA_WRAPER_CLASS = 'gis-widget-propertys-wraper';
Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS = 'gis-widget-propertys-buttons-wraper';
Gis.Widget.Propertys.DATA_BLOCK_CLASS = 'gis-widget-propertys-data';
Gis.Widget.Propertys.DATA_TITLE_CLASS = 'gis-widget-propertys-title';
Gis.Widget.Propertys.BUTTON_CLASS_NAME = 'gis-propertys-button';
Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME = 'gis-propertys-button-delete';
Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME = 'gis-propertys-button-deselect';
Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME = 'gis-propertys-button-return';
Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME = 'gis-propertys-button-revert';
Gis.Widget.Propertys.titles = {};
Gis.Widget.Propertys.titles[Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME] = 'Удалить';
Gis.Widget.Propertys.titles[Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME] = 'Снять выделение';
Gis.Widget.Propertys.titles[Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME] = 'Отменить изменения';
Gis.Widget.propertys = function (data) {
    return new Gis.Widget.Propertys(data);
};
