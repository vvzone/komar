"use strict";
/**
 *
 * @namespace
 */
Gis.Widget = Gis.Widget || {};
/**
 * Базовый класс для виджета
 * @requires jQuery
 * @class
 * @extends Gis.BaseClass
 */
Gis.Widget.Base = Gis.BaseClass.extend(
    /** @lends Gis.Widget.Base */
    {
        _dialogOptions: {
            dialogClass: "no-title-bar",
            autoOpen: false,
            modal: true,
            width: 340,
            closeOnEscape: true,
            minHeight: 10,
            draggable: true,
            resizable: false
        },
        _typePrefix: '', //Deprecated
        _type: undefined,
        options: {
            position: "TOP",
            enabled: true
        },
        /**
         * Занимаемый виджетом размер
         * @returns {Array} 1 элемент - ширина, второй элемент - высота
         */
        getNeedSize: function () {
            Gis.extendError();
        },
        _initDialogClose: function (data) {
            var $dialog, id, callback, context;
            id = data.id || 'gis-remove-dialog';
            callback = data.callback || function () {};
            context = data.context || this;
            $dialog = $('#' + id);
            if (!$dialog.length) {
                $dialog = $('<div id="' + id + '"/>');
                $dialog.appendTo($(document.body));
            }
            $dialog.dialog($.extend(this._dialogOptions, {
                buttons: [
                    {
                        text: 'Да',
                        click: function () {
                            callback.call(context);
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
            return $dialog;
        },
        _deleteLayerConfirm: function (data, layer) {
            layer = layer || this.options.dataBinded;
            if (layer) {
                this._$dialogRemove = this._initDialogClose(data);
                this._$dialogRemove.html((data.title || '') + ((!layer.isEditableByUser() && layer.isMetaData()) ? '<hr><span>Объект будет скрыт, т.к. недостаточно прав для его удаления</span>' : ''));
                this._$dialogRemove.dialog('open');
            }
        },
        initialize: function () {
            var self = this;
            Gis.BaseClass.prototype.initialize.apply(this, arguments);
            this._pointDirectionClicked = function () {
                if ($(this).hasClass('disabled') || (self.options.dataBinded && self.isDataEditable && (!self.isDataEditable() || !self.getValueFromData('isDraggable', true)))) {
                    return this;
                }
                var swap = ['СШ ЮШ', 'ВД ЗД'],
                    $this = $(this),
                    value = $this.html(),
                    val,
                    index,
                    newValue;
                if ($('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, $this.parent()).length) {
                    val = swap[0];
                } else {
                    val = swap[1];
                }
                val = val.split(' ');
                index = val.indexOf(value);
                newValue = (val.length > index + 1) ? val[index + 1] : val[0];
                $this.html(newValue);
                self.fire('change');
            };
            this._pointDirectionCopy = function (e) {
                e.originalEvent.clipboardData.setData("Text", self.getPointValue(self.getPointY($(this))) + ' ' + self.getPointValue(self.getPointX($(this))));
                self.fire('change');
                return false;
            };
            this._pointDirectionPaste = function (e) {
                var value = self._containerController.getUIAttached().
                    getGeoConverter().fromRandomTemplateToCurrent(
                        e.originalEvent.clipboardData.getData("Text"),
                        $(this).hasClass(Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED)
                    );
                if (value) {
                    if (Gis.Util.isArray(value)) {
                        value.forEach(function (val) {
                            self.setHtmlPointValue($(this), val);
                        });
                        if (value[0]) {
                            self.setHtmlPointValue(self.getPointY($(this)), value[0]);
                        }
                        if (value[1]) {
                            self.setHtmlPointValue(self.getPointX($(this)), value[1]);
                        }
                    } else {
                        self.setHtmlPointValue($(this), value);
                    }
                    self.fire('change');
                }
                return false;
            };
        },
        getModalPreloader: function () {
            var $modal = $('.modalPreloader');
            if (!$modal.length) {
                $modal = $('<div class="modalPreloader" style="display: none; text-align: center;">' +
                    '<div class="text"><h2 style="font-size: 16px;"></h2><div class="loader"></div></div>' +
                    '</div>').appendTo(document.body);
            }
            return $modal;
        },
        showModalPreloader: function (title) {
            var $modal = this.getModalPreloader();
            $('h2', $modal).html(title);
            $modal.show();
        },
        hideModalPreloader: function () {
            var $modal = this.getModalPreloader();
            $modal.hide();
        },
        getPointX: function ($textArea) {
            var $row = $textArea.parent().parent().parent().find('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED);
            if (!$row.length) {
                $row = $textArea.parent().parent().parent().parent().find('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED)
            }
            return $row;
        },
        getPointY: function ($textArea) {
            var $row = $textArea.parent().parent().parent().find('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED);
            if (!$row.length) {
                $row = $textArea.parent().parent().parent().parent().find('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED)
            }
            return $row;
        },
        isAttachedToUi: function () {
            return this._containerController && this._containerController.getUIAttached();
        },
        templateToCoordinate: function () {
            var converter = this._containerController.getUIAttached().getGeoConverter();
            return converter.toBase.apply(converter, arguments);
        },
        /**
         * выдать подпись координаты
         * @param [y] координата Y
         * @returns {*}
         */
        getCoordinateRowName: function (y) {
            var geoConverter = this._containerController.getUIAttached().getGeoConverter(),
                names = [{
                    x: 'X',
                    y: 'Y'
                },{
                    y: '&phi;',
                    x: '&lambda;'
                }];
            return names[geoConverter.isMetric() ? 0 : 1][y ? 'y' : 'x']
        },
        /**
         * Генерирует span подписи координаты
         * @param [y]
         * @returns {string}
         * @protected
         */
        _HTMLRowName: function (y) {
            return "<span class='gis-row-name " + (y ? 'y' : 'x') + "-name'>" + this.getCoordinateRowName(y) +"</span>";
        },
        _HTMLRowInput: function (value, id, className, title, placeholder) {
            return "<input type='text' title='" + (title || '') + "'  placeholder='" + (placeholder || '') + "' data-old-val='" + value + "' " + (id ? "id='" + id + "'" : '') + " class='" + (className || '') + "' value='" + value + "'/>";
        },
        _HTMLPointSelector: function (value, id, className, title) {
            var direction = '',
                converter = this._containerController.getUIAttached().getGeoConverter();
            if (value && value.match) {
                direction = value.match(Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES_REGEXP_FIND);
                direction = direction && direction.length ? direction[0] : '';
            }
            value = value.replace(Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES_REGEXP_REPLACE, '').trim();
            if (!direction  && converter.isTemplateDirectional()) {
                direction = (className.indexOf(Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED) >= 0) ? 'СШ' : 'ВД';
            }
            return "<span class='gis-point-selector " + (converter.isTemplateDirectional() ? 'gis-direction' : '') + "'><input type='text' data-is-point='true' title='" + (title || '') + "' data-old-val=\"" + value + "\" " + (id ? "id='" + id + "'" : '') + " class='" + (className || '') + "' value=\"" + value + "\"/><span class='point-direction' data-old-val='" + direction + "'>" + direction + "</span><span title='Используется фиксированная зона' class='point-attention'>!</span></span>";
        },
        _HTMLPointSelectorWidget: function (data) {
            var tag = data.tag || 'span',
                xClass = data.xClass || '',
                yClass = data.yClass || '',
                x = data.x || '',
                y = data.y || '',
                tagClass = data.tagClass || '',
                geoConverter = this._containerController.getUIAttached().getGeoConverter(),
                isMetric;

            isMetric = geoConverter.isMetric(geoConverter.getSelectedSystem());
            if (isMetric) {
                return "<" + tag + " class='" + tagClass + "'><div class='gis-point-wraper'>" + this._HTMLRowName() + this._HTMLPointSelector(x, data.xID, xClass + ' ' + Gis.Widget.Base.POSITION_VALUE_CLASS_X) +"</div></" + tag + ">\n" +
                    "<" + tag + " class='" + tagClass + "'><div class='gis-point-wraper'>" + this._HTMLRowName(true) + this._HTMLPointSelector(y, data.yID, yClass + ' ' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y) +"</div></" + tag + ">\n";
            } else {
                return "<" + tag + " class='" + tagClass + "'><div class='gis-point-wraper'>" + this._HTMLRowName(true) + this._HTMLPointSelector(y, data.yID, yClass + ' ' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y) +"</div></" + tag + ">\n" +
                    "<" + tag + " class='" + tagClass + "'><div class='gis-point-wraper'>" + this._HTMLRowName() + this._HTMLPointSelector(x, data.xID, xClass + ' ' + Gis.Widget.Base.POSITION_VALUE_CLASS_X) +"</div></" + tag + ">\n";
            }
        },
        /**
         * записать данные с координатами в виджет
         * @param {HTMLElement} $line контейнер точек
         * @param {Gis.UI.Coordinate} point данные точки
         * @param {Gis.UI.Coordinate} [pointData] если не указано data не модифицируется
         */
        setHtmlPointSelectorWidgetData: function ($line, point, pointData) {
            if (point && point.x != undefined) {
                this.setHtmlPointValue($('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, $line), point.x, pointData && pointData.x);
            }
            if (point && point.y != undefined) {
                var geoConverter = this._containerController.getUIAttached().getGeoConverter();
                var isInAutoZoneBounds = point.x &&
                    geoConverter.isNeedZone(geoConverter.getSelectedSystem()) &&
                    Gis.Util.isInFixedZoneBounds(this.templateToCoordinate(point).x);
                this.setHtmlPointValue($('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, $line), point.y, pointData && pointData.y, isInAutoZoneBounds);
            }
        },
        revertHtmlPointSelectorWidgetData: function ($line) {
            this.setHtmlPointSelectorWidgetData($line, this.getPointWidgetData($line, true));
        },
        getPointWidgetData: function ($line, data) {
            return Gis.UI.coordinate(this.getPointValue($('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, $line), data), this.getPointValue($('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, $line), data));
        },
        /**
         * Записывет данные в виджет координаты
         * @param $row
         * @param value
         * @param [dataValue]
         */
        setHtmlPointValue: function ($row, value, dataValue, attention) {
            var converter = this._containerController.getUIAttached().getGeoConverter(),
                isTemplateDirectional = converter.isTemplateDirectional(),
                $pointSelectorContainer,
                direction,
                directionData;
            $row = $($row);
            $row.data('is-point', true);
            $pointSelectorContainer = $row.parent();
            $pointSelectorContainer[isTemplateDirectional ? 'addClass' : 'removeClass']('gis-direction');

            value = value == undefined ? '' : value;
            function isYRow() {
                return $row.hasClass(Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED);
            }

            function getDirection(val) {
                var dirn = isTemplateDirectional ? isYRow() ? 'СШ' : 'ВД' : '';
                val = val + '';
                if (val && val.match && isTemplateDirectional) {
                    dirn = val.match(Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES_REGEXP_FIND);
                    dirn = (dirn && dirn.length) ? converter.getDirectionNameOutter(dirn[0]) : '';
                }
                return dirn;
            }
            if (attention) {
                $('.point-attention', $row.parent()).addClass(Gis.Widget.Base.POSITION_VALUE_CLASS_FIXED_ZONE);
            } else {
                $('.point-attention', $row.parent()).removeClass(Gis.Widget.Base.POSITION_VALUE_CLASS_FIXED_ZONE);
            }
            direction = getDirection(value);
            value = value + '';
            value = value.replace(Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES_REGEXP_REPLACE, '').trim();
            $('.point-direction', $pointSelectorContainer).html(direction);
            $row.val(value);
            if (dataValue != undefined) {
                directionData = getDirection(dataValue);
                dataValue = dataValue + '';
                dataValue = dataValue.replace(Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES_REGEXP_REPLACE, '').trim();
                $('.point-direction', $pointSelectorContainer).data('old-val', directionData);
                $row.data('old-val', dataValue);
            }
            return this;
        },
        /**
         * считывает данные из виджета координаты
         * @returns {string}
         */
        getPointValue: function ($row, data, sk, tmpl) {
            var isTemplateDirectional = this._containerController.getUIAttached().getGeoConverter().isTemplateDirectional(sk, tmpl), valBase;
            if (data) {
                valBase = $row.data('old-val');
                return valBase !== '' ? (valBase + ((isTemplateDirectional && $row.data('is-point')) ?
                    ' ' +  $('.point-direction', $row.parent()).data('old-val') : '')) : '';
            }
            valBase = $row.val();
            return valBase !== '' ? (valBase + ((isTemplateDirectional && $row.data('is-point')) ?
                ' ' +  $('.point-direction', $row.parent()).html() : '')) : '';
        },

        coordinateToTemplate: function (x, y, z) {
            if (Gis.Util.isArray(x)) {
                x = Gis.UI.coordinate([x[1], x[0], x[2]])
            }
            var converter = this._containerController.getUIAttached().getGeoConverter();
            return converter.fromBase.call(converter, x, y, z);
        },
        /**
         * @param {Gis.LatLng} latLng
         * @returns {string}
         */
        coordinateToText: function (latLng) {
            latLng = Gis.latLng(latLng);
            var converter = this._containerController.getUIAttached().getGeoConverter(),
                point = latLng && this.coordinateToTemplate(latLng.lng, latLng.lat),
                isMetric = converter.isMetric(converter.getSelectedSystem());
            return point && point.x && point.y ? isMetric ? point.x + ', ' + point.y : point.y + ', ' + point.x : 'Позиция не определена';
        },
        canFitTo: function (container) {
            return true;
        },
        onRemove: function () {
            this._deInitEvents();
            this._$div.remove();
        },
        onAdd: function (container) {
            this.container = container.getContainer();
            this._containerController = container;
            this.initHTML();
        },
        /**
         * Проверить доступность элемента
         * @param {string} [type]
         * @param {Gis.Map} [map]
         * @returns {boolean}
         */
        isControlAvailable: function (type, map) {
            var ui = !map && this._containerController.getUIAttached(),
                uiSettings = (map || (ui && this._containerController.getUIAttached().getMap())).getSetting('ui'),
                controls = uiSettings && uiSettings.indexOf(type || (this._typePrefix + this._type)) >= 0;
            return controls;
        },
        initHTML: function () {
            this._$div = $('<div class="' + Gis.Widget.Base.CLASS_NAME + '"/>');
        },
        /**
         * return type of the Widget
         * */
        getType: function () {
            return this._type;
        },
        /**
         * добавляет в выбранный контайнер
         * @param {Gis.Widget.Container} container
         * */
        addTo: function (container) {
            container.addChild(this);
        },

        /**
         * return position of the Widget
         * @return {string | Array} position of the Widget
         * */
        getPosition: function () {
            return this.options.position;
        },
        hide: function () {
            this._$div.addClass('hide');
        },
        show: function () {
            this._$div.removeClass('hide');
        },
        _deInitEvents: function () {
            this._containerController.getUIAttached().off('skchanged', this._skChanged, this);
            this._$div.off('click', '.point-direction', this._pointDirectionClicked);
            this._$div.off('copy', '.' + Gis.Widget.Base.POSITION_VALUE_CLASS, this._pointDirectionCopy);
            this._$div.off('paste', '.' + Gis.Widget.Base.POSITION_VALUE_CLASS, this._pointDirectionPaste);
        },
        /**
         * @protected
         */
        _initEvents: function () {
            this._containerController.getUIAttached().on('skchanged', this._skChanged, this);
            this._$div.on('click', '.point-direction', this._pointDirectionClicked);
            this._$div.on('copy', '.' + Gis.Widget.Base.POSITION_VALUE_CLASS, this._pointDirectionCopy);
            this._$div.on('paste', '.' + Gis.Widget.Base.POSITION_VALUE_CLASS, this._pointDirectionPaste);
        },


        _skChanged: function (e) {
            var xRowName = this._HTMLRowName(),
                yRowName = this._HTMLRowName(true);
            $('.x-name', this._$div).each(function () {
                $(this).replaceWith(xRowName);
            });
            $('.y-name', this._$div).each(function () {
                $(this).replaceWith(yRowName);
            });
        },
        /**
         *  после добавления вызывается рендер в html
         * */
        draw: function () {
            this.container.appendChild(this._$div[0]);
            this._initEvents();
        },
        getWidth: function () {
            return this._$div.width();
        },
        getHeight: function () {
            return this._$div.height();
        },
        isDataEditable: function (data) {
            data = data || this.options.dataBinded;
            return !data || data.isEditableByUser();
        },
        afterUpdate: function () {
            this.fire('updated', {target: this});
        },
        removeLayerFromMap: function (layer) {
            this._containerController.getUIAttached().getMap().clearMap(null, false, layer.getId());
        }
    }
);
Gis.UI.DeleteActions = {
    post: function (e, dataBinded) {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить ПОСТ?',
            callback: function () {
                this.removeLayerFromMap(dataBinded || this.options.dataBinded);
            },
            context: this,
            id: 'post-remove-dialog'
        }, dataBinded);
    },
    source: function (e, dataBinded) {
        this._deleteLayerConfirm({
            title: 'Вы действительно хотите удалить объект?',
            callback: function () {
                this.removeLayerFromMap(dataBinded || this.options.dataBinded);
            },
            context: this,
            id: 'source-remove-dialog'
        }, dataBinded);
    }
};
Gis.UI.DeleteActions[Gis.Objects.HeatMap.prototype.options.tacticObjectType] = function (e, dataBinded) {
    this._deleteLayerConfirm({
        title: 'Вы действительно хотите удалить объект?',
        callback: function () {
            this.removeLayerFromMap(dataBinded || this.options.dataBinded);
        },
        context: this,
        id: 'heat_map-remove-dialog'
    }, dataBinded);
};
Gis.Widget.Base.CLASS_NAME = 'gis-widget';
Gis.Widget.Base.TITLE_CLASS = 'gis-widget-title';
Gis.Widget.Base.REVERT_CLASS = 'gis-widget-revert';
Gis.Widget.Base.GO_CLASS = 'gis-widget-go';
Gis.Widget.TYPE = {};
Gis.Widget.Base.POSITION_VALUE_CLASS = 'position-value';
Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED = 'position-value-x';
Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED = 'position-value-y';
Gis.Widget.Base.POSITION_VALUE_CLASS_FIXED_ZONE = 'zone-fixed';
Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES = 'SNEWСЮШВЗДsnewсюшвзд';
Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES_REGEXP_REPLACE = new RegExp('[' + Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES + ']', 'g');
Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES_REGEXP_FIND = new RegExp('[' + Gis.Widget.Base.POSITION_VALUE_DIRECTION_NAMES + ']+');
Gis.Widget.Base.POSITION_VALUE_CLASS_X = Gis.Widget.Base.POSITION_VALUE_CLASS + ' ' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED;
Gis.Widget.Base.POSITION_VALUE_CLASS_Y = Gis.Widget.Base.POSITION_VALUE_CLASS + ' ' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED;
