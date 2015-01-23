"use strict";
/**
 * НЕ использовать напрямую!! дает функционал для path и polygon
 * @class
 * @abstract
 * @extends Gis.Widget.Propertys
 */
Gis.Widget.PolylineProperty = Gis.Widget.Propertys.extend(
    /**
     * @lends Gis.Widget.PolylineProperty.prototype
     */
    {
        _type: null,
        _typeSelector: false,
        includes: Gis.Widget.PointBehavior,
        _history: [],
        _historyValues: [],
        _minimalPoints: 2,
        /**
         * Допустимые параметры
         * @type {object}
         * @property {string[]} [colors=[rgba(255, 57, 17, 0.5),rgba(22, 50, 255, 0.5),rgba(128, 128, 128, 0.5),rgba(255, 216, 0.5),rgba(0, 148, 255, 0.5)]]
         */
        options: {
            colors: undefined
        },
        initialize: function (data) {
            Gis.Widget.Propertys.prototype.initialize.call(this, data);

            if (this.options.dataBinded) {
                this._initPolylineEvents();
            }
        },
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
        _updateHistory: function () {
            var $rows, self = this;
            this._history = [];
            this._historyValues = [];
            $rows = $('#points-selector li', this._$div);
            $rows.each(function () {
                self._history.push(this);
                self._historyValues.push({
                    x:  self.getPointValue($('.marker-x', $(this))),
                    y:  self.getPointValue($('.marker-y', $(this)))
                });
            });
        },

        _skChanged: Gis.Widget.ListPoints._skChanged,
        _updateColor: function () {
            Gis.Widget.Propertys.prototype._updateColor.call(this, this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor(true)));
        },
        back: function () {
            var self = this, x, y;
            if (this._isStateChanged()) {
                $('#points-selector li', this._$div).not(this._history).remove();
                this._history.forEach(function (row, index) {
                    $('#points-selector ol', self._$div).append($(row));
                    x = self._historyValues[index].x != undefined ? self._historyValues[index].x : '';
                    y = self._historyValues[index].y != undefined ? self._historyValues[index].y : '';
                    self.setHtmlPointSelectorWidgetData($(row), Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
                });
                this._updateColor();
                this._updateStyle();
            }
            this._updateState();
        },
        _clearInfo: function () {
            if (this._$infoContainer) {
                this._$infoContainer.remove();
                this._$infoContainer = undefined;
            }
        },
        _clearPolyline: function () {
            this._deleteLayerConfirm({
                title: 'Вы действительно хотите удалить маршрут?',
                callback: function () {
                    this.removeLayerFromMap(this.options.dataBinded);
                },
                context: this,
                id: 'polyline-remove-dialog'
            });
        },
        _setData: function () {
            this._updateDataFromPolyline();
//        this._calculatePolyline(true);
        },
        _hilightErrors: function () {
            var error = false, $rows, $Xrow, $Yrow, self = this;
            $rows = $('#points-selector li', this._$div);
            $rows.each(function () {
                $Xrow = $('.marker-x', $(this));
                $Yrow = $('.marker-y', $(this));
                error = error || self.checkPoint($(this));
            });
            error = error || !this.getSelectedColor();
            return error;
        },
        _updateCoordinatesState: function () {
            var $rows, func;
            if (!this.getValueFromData('isDraggable', true)) {
                func = function () {
                    $('.marker-x', $(this)).attr('disabled', 'disabled');
                    $('.marker-y', $(this)).attr('disabled', 'disabled');
                };
            } else {
                func = function () {
                    $('.marker-x', $(this)).removeAttr('disabled');
                    $('.marker-y', $(this)).removeAttr('disabled');
                };
            }
            if (this.isDataEditable()) {
                $('.gis-widget-ico', this._$div).show();
            } else {
                $('.gis-widget-ico', this._$div).hide();
            }
            $rows = $('#points-selector li', this._$div);
            $rows.each(func);
        },

        updateData: function () {
            this._setData();
            this._updateColor();
            this._updateState();
        },
        draw: function () {
            Gis.Widget.Propertys.prototype.draw.call(this);
            if (this.options.dataBinded) {
                this._initPolylineEvents();
            }
            this.updateData();
        },
        initHTML: function () {
            Gis.Widget.Propertys.prototype.initHTML.call(this);
            this._$div.addClass(Gis.Widget.PolylineProperty.CLASS_NAME);
            this._updateStyleList();
        },
        _xyRowHTML: function () {
            return "<li class='data-row'>\n" +
                '<div class="gis-point-in-list inline-points">' +
                this._HTMLPointSelectorWidget({
                    tag: 'span',
                    tagClass: 'point-tag',
                    yClass: 'marker-input marker-y',
                    xClass: 'marker-input marker-x'
                }) +
                '</div>' +
                "<span class='gis-widget-ico gis-widget-ico-up'></span>" +
                "<span class='gis-widget-ico gis-widget-ico-down'></span>" +
                "<span class='gis-widget-ico gis-widget-ico-remove'></span>" +
                "<span class='gis-widget-ico gis-widget-ico-add'></span>\n" +
                "</li>\n";
        },
        initDataBlock: function () {
            var rows = "", i = 0;
            for (i; i < this._minimalPoints; i += 1) {
                rows += this._xyRowHTML();
            }
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='points-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>ППМ</div>\n" +
                "<div id='points-selector' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                "<ol>\n" +
                rows +
                "</ol>\n" +
                "<div class='gis-widget-add-to-end'><span class='gis-widget-ico gis-widget-ico-add'></span></div>" +
                "</div>\n" +
                "</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='view-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Цвет</div>\n" +
                "<div class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + " gis-color-container'>" +
                this._HTMLcolorSelector(true, this.options.dataBinded && this.options.dataBinded.getColor(true)) +
                this._HTMLstyleSelector() +
                "</div>\n" +
                "</div>\n";
        },
        initButtonsBlock: function () {
            return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
                "<ul class='gis-property-buttons-list'>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this.options.dataBinded ? 'Подтвердить' : 'Новый') + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, '', this.options.dataBinded) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME) + "</li>\n" +
                "</ul>\n" +
                "</div>\n";
        },
        _isStateChanged: function () {
            var changed = false, $rows, self = this;

            $rows = $('#points-selector li', this._$div);
            if (self._history.length !== $rows.length) {
                return true;
            }
            $rows.each(function (index) {
                var $row = $(this), $markerX = $('.marker-x', $row), $markerY = $('.marker-y', $row);
                if (!self.options.dataBinded) {
                    changed = changed || self.getPointValue($markerX) !== "";
                }
                changed = changed || self._rowChanged($markerX) || self._rowChanged($markerY) || (self._history[index] && this !== self._history[index]);
            });
            if (this._typeSelector) {
                changed = changed || this.isStyleChanged();
            }
            var colorSelected = this.getValueFromData('getColor', null, true);
            changed = changed || (this.options.dataBinded && colorSelected != this.getSelectedColor());
            return changed;
        },
        _updateButtonState: function () {
            var isStateChanged = this._isStateChanged(),
                isDataEditable = this.isDataEditable(),
                isDraggable = this.getValueFromData('isDraggable', false);
            this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
            this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
            this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
            this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
            $('.gis-button-text', this._$buttonNew).html(this.options.dataBinded && isStateChanged ?
                "Подтвердить" :
                !this.options.dataBinded ? "Новый" : "Подтвердить");
            this.switchButtonState(this._$buttonNew, ((isDraggable || isDataEditable)) && isStateChanged && !this._hilightErrors());
            this.switchButtonState(this._$buttonDeselect, this.options.dataBinded);
            this.switchButtonState(this._$buttonDelete, isDataEditable && this.options.dataBinded && this._containerController.getUIAttached().getMap().getLayer(this.options.dataBinded.getId()));
            this.switchButtonState(this._$buttonRevert, (isDraggable || isDataEditable) && isStateChanged);

        },
        _newRowXY: function () {
            var $clearRow = $(this._xyRowHTML());
            $('#points-selector ol', this._$div).append($clearRow);
            this._maskInput();
            return $clearRow;
        },
        _getLastClearPoint: function () {
            var $rows, i, $x, $y, $clearRow;
            var selectedRow = this._getSelectedRow();
            if (selectedRow) {
                if ($clearRow = this.checkRowForClean(selectedRow.next())) {
                    return $clearRow;
                }
                return this.insertRowAfter(selectedRow, true);
            }
            $rows = $('#points-selector li', this._$div);
            for (i = $rows.length - 1; i >= 0; i -= 1) {
                var $row = $rows[i];
                $x = $('.marker-x', $row);
                $y = $('.marker-y', $row);
                if ($x.val() !== '' || $y.val() !== '') {
                    break;
                } else if ($x.val() === '' && $y.val() === '') {
                    $clearRow = $row;
                }
            }
            if (!$clearRow) {
                $clearRow = this._newRowXY();
            }
            return $clearRow;
        },
        checkRowForClean: function (row) {
            var $x, $y, $clearRow;
            var $row = $(row);
            if ($row.length > 0) {
                $x = $('.marker-x', $row);
                $y = $('.marker-y', $row);
                if ($x.val() === '' && $y.val() === '') {
                    $clearRow = $row;
                }
            }
            return $clearRow;
        },
        _insertNewPoint: function (latLng, select) {
            var point = this.coordinateToTemplate(latLng), x, y;
            this._lastRow = this._getLastClearPoint();
            if (select) {
                this._selectRowInList($(this._lastRow));
            }
            x = point.x || '';
            y = point.y || '';
            this.setHtmlPointSelectorWidgetData(this._lastRow, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
        },
        _mapClicked: function (e) {
            if (this.options.dataBinded && (!this.options.dataBinded.isDraggable() || !this.isDataEditable())) {
                return;
            }
            this._insertNewPoint(Gis.latLng(e.latLng.latitude, e.latLng.longitude), true);
            if (this.options.dataBinded && this.options.dataBinded.getColor(true) === this.getSelectedColor()) {
                this._calculatePolyline(
                    this._history.length === $('#points-selector li', this._$div).length &&
                        this._containerController.getUIAttached().getMap().hasLayer(this.options.dataBinded));
                this.options.dataBinded.setSelectedPoint($('#points-selector li', this._$div).index(this._lastRow), true);
            } else {
                this._updateState();
            }
        },
        _calculatePointData: function (row1) {
            var point1, projectedPoint;
            if (row1) {
                projectedPoint = this.templateToCoordinate(this.getPointValue($('.marker-x', $(row1))), this.getPointValue($('.marker-y', $(row1))));
                point1 = Gis.latLng(projectedPoint.y, projectedPoint.x);
                this._pointsLatlng.push(point1);
            }
        },
        _informationHTML: function () {
            var htmlRows;
            this._distanceCalculated = this._distanceCalculated || 0;
            this._moving = this._moving || 0;
            htmlRows = "<li class='gis-widget-info-row gis-widget-polyline-info-row'>" +
                "<span class='title'>Путь :</span><span class='value'>" + this._distanceCalculated.toFixed(2) + "</span></li>" +
                "<li class='gis-widget-info-row gis-widget-polyline-info-row'>" +
                "<span class='title'>Перемещение:</span><span class='value'>" + this._moving.toFixed(2) + "</span></li>";
            return htmlRows && "<ul class='gis-widget-info  gis-widget-polyline-info'>" +
                htmlRows +
                "</ul>";
        },
        _infoContainerHTML: function (htmlRows) {
            return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                "<div id='info-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Информация</div>\n" +
                "<div id='info-data' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                htmlRows +
                "</div>\n" +
                "</div>\n";
        },
        _drawResultCalculation: function () {
            var $infoContainer, htmlRows;
            htmlRows = this._informationHTML();
            if (htmlRows) {
                $infoContainer = $('.gis-widget-polyline-info', this._$div);
                if ($infoContainer.length) {
                    $infoContainer.replaceWith($(htmlRows));
                } else {
                    this._$infoContainer = $(this._infoContainerHTML(htmlRows));
                    this._$infoContainer.insertAfter($('.' + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS, this._$div));
                }
            }
        },
        _updateDataFromPolyline: function () {
            var points = this.options.dataBinded && this.options.dataBinded.getPoints(),
                callback,
                $rows,
                self = this,
                count = 0,
                i,
                len;
            $rows = $('#points-selector li', this._$div);
            if (points) {
                callback = function (value, index) {
                    var $row = $($rows[index]), point = self.coordinateToTemplate(value.getLatLng()), x, y;
                    if (!$row.length) {
                        $row = self._newRowXY();
                    }
                    y = point.y || '';
                    x = point.x || '';
                    self.setHtmlPointSelectorWidgetData($row, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
                    self._attachPointDataToRow($row, value, true);
                    count = index;
                };
                points.forEach(callback);
                if ($rows[count + 1]) {
                    for (i = count + 1, len = $rows.length; i < len; i += 1) {
                        this._removeRow($($rows[i]));
                    }
                }
                this._calculatePolyline(true);
            } else {
                $rows.each(function (idx) {
                    if (idx < self._minimalPoints) {
                        self.setHtmlPointSelectorWidgetData($(this), Gis.UI.coordinate('', ''), Gis.UI.coordinate('', ''));
                        self._detachPointDataFromRow($(this));
                    } else {
                        self._removeRow($(this));
                    }
                });
            }
            this._updateHistory();
        },
        _initPolylineEvents: function () {
            if (this.options.dataBinded && !this.options.dataBindedEventsInitialized) {
                this.options.dataBindedEventsInitialized = true;
                this.options.dataBinded.on('change', this._updateDataFromPolyline, this);
                this.options.dataBinded.on('selected', this._layerSelected, this);
                this.options.dataBinded.on('unselected', this._layerUnSelected, this);
            }
        },
        _deInitPolylineEvents: function () {
            if (this.options.dataBinded && this.options.dataBindedEventsInitialized) {
                this.options.dataBindedEventsInitialized = false;
                this.options.dataBinded.off('change', this._updateDataFromPolyline, this);
                this.options.dataBinded.off('selected', this._layerSelected, this);
                this.options.dataBinded.off('unselected', this._layerUnSelected, this);
            }
        },
        _getPathPoints: function () {
            return this.options.dataBindedPoints.points;
        },
        _drawPolyline: function () {
            Gis.extendError();
        },
        _calculatePolyline: function (skipPolylineRedraw) {
            var $rows, self, x, y;
            self = this;
            if (!this._hilightErrors()) {
                $rows = $('#points-selector li', this._$div);
                this._distanceCalculated = 0;
                this._pointsLatlng = [];
                this.options.dataBindedPoints = {points: []};
                $rows.each(function (position) {
                    var $row = $(this), $nextRow, $markerY, $markerX, projectedCoordinate;
                    $markerY = $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, $row);
                    $markerX = $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, $row);
                    $nextRow = $rows[position + 1];
                    y = self.getPointValue($markerY);
                    x = self.getPointValue($markerX);
                    if (x !== '' && y !== '') {
                        projectedCoordinate = self.templateToCoordinate(x, y);
                        self.setHtmlPointSelectorWidgetData($row, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
                        if (!skipPolylineRedraw) {
                            self._attachPointDataToRow($row, {latitude: projectedCoordinate.y, longitude: projectedCoordinate.x});
                        }
                        self.options.dataBindedPoints.points.push(Gis.Util.extend(self._getPoint($row).objectData(), {latitude: projectedCoordinate.y, longitude: projectedCoordinate.x}));
                        self._calculatePointData($row, $nextRow);
                    }
                });
                self._moving = self._calculatePointData($($rows[0]), $($rows[$rows.length - 1]), true);
                if (!skipPolylineRedraw) {
                    this._drawPolyline();
                }
                this._updateHistory();
            } else {
                self._distanceCalculated = 0;
                self._moving = 0;
            }
            this._updateState();
        },
        _selectRowInList: function (row) {
            var $rows;
            $rows = $('#points-selector .data-row', this._$div);
            $rows.not(row).removeClass('selected');
            if (row) {
                $(row).addClass('selected');
            }
            return $rows;
        },
        _getSelectedRow: function() {
            var $points = $('#points-selector .data-row.selected', this._$div);
            if ($points.length > 0) {
                return $points;
            }
        },
        _layerSelected: function (e) {
            var markerKey = e.additional && e.additional.markerKey,
                row,
                $rows;
            if (markerKey !== undefined) {
                $rows = $('#points-selector .data-row', this._$div);
                row = $rows[markerKey];
                $(':focus').blur();
                this._selectRowInList(row);
            }
        },
        _layerUnSelected: function () {
            var $rows;
            $rows = $('#points-selector .data-row', this._$div);
            $rows.removeClass('selected');
        },
        _deInitEvents: function () {
            this._deInitPolylineEvents();
            var map = this._containerController.getUIAttached().getMap();
            map.off('layerselected', this._layerSelected, this);
            map.off('layerunselected', this._layerUnSelected, this);
            map.off('stylechanged', this._updateStyleList, this);
            this._$div.off('click', '.gis-widget-ico-up', this._icoUpClick);
            this._$div.off('click', '.gis-widget-ico-down', this._icoDownClick);
            this._$div.off('click', '.gis-widget-ico-remove', this._icoDeleteClick);
            this._$div.off('click', '.gis-widget-ico-add', this._icoPlusClick);

            this._$div.off('change', '.data-row input, .data-row input', this._textRowChange);
            this._$div.off('keyup', '.data-row input, .data-row input', this._textRowChange);
            this._$div.off('focus', '.data-row input, .data-row input', this._textRowFocus);
            $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
                click: this._returnFunction,
                keyup: this._KeyUpReturnFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).off({
                click: this._deselectFunction,
                keyup: this._KeyUpDeselectFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).off({
                click: this._revertFunction,
                keyup: this._KeyUpRevertFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
                click: this._deleteFunction,
                keyup: this._KeyUpDeleteFunction
            });
            Gis.Widget.Propertys.prototype._deInitEvents.call(this);
        },
        _removeRow: function ($row) {
            var $list = $row.parent();
            if ($('.data-row', $list).length > this._minimalPoints) {
                $row.remove();
            }
        },

        _deleteKeyFire: function (e) {
            if ($('#points-selector .data-row.selected', this._$div).length) {
                if ((e.srcElement || e.target).type !== 'text') {
                    this._removeRow($('#points-selector .data-row.selected', this._$div));
                    this._updateState();
                    e.preventDefault();
                    return false;
                }
            }
            return true;
        },
        _initEvents: function () {
            var self = this, map;
            this._initPolylineEvents();
            map = this._containerController.getUIAttached().getMap();
            map.on('layerselected', this._layerSelected, this);
            map.on('layerunselected', this._layerUnSelected, this);
            map.on('stylechanged', this._updateStyleList, this);

            this._returnFunction = this._returnFunction || function () {
                if (self.isButtonEnable(this) && self.checkBaseLayer()) {
                    self._calculatePolyline();
                }
            };
            this._icoUpClick = this._icoUpClick || function () {
                if (self.isDataEditable()) {
                    var $listRow = $(this).parent(), $prev;
                    $prev = $listRow.prev();
                    if ($prev.length) {
                        $listRow.insertBefore($prev);
                    }
                    self._updateState();
                }
            };
            this._icoDownClick = this._icoDownClick || function () {
                if (self.isDataEditable()) {
                    var $listRow = $(this).parent(), $next;
                    $next = $listRow.next();
                    if ($next.length) {
                        $next.insertBefore($listRow);
                    }
                    self._updateState();
                }
            };
            this._icoDeleteClick = this._icoDeleteClick || function () {
                if (self.isDataEditable()) {
                    var $row = $(this).parent();
                    self._removeRow($row);
                    self._updateState();
                }
            };
            this.insertRowAfter = function($listRow, after) {
                var $row = $(self._xyRowHTML());
                if ($listRow[0].tagName.toLowerCase() === 'li') {
                    //noinspection JSCheckFunctionSignatures
                    if (after) {
                        $row.insertAfter($listRow);
                    } else {
                        $row.insertBefore($listRow);
                    }
                } else {
                    $row.appendTo($('ol', $listRow.parent()));
                }
                self._maskInput();
                self._updateState();
                return $row;
            };

            this._icoPlusClick = this._icoPlusClick || function () {
                if (self.isDataEditable()) {
                    var $listRow = $(this).parent();
                    self.insertRowAfter($listRow);
                }
            };
            this._deleteFunction = this._deleteFunction || function () {
                if (self.isButtonEnable(this)) {
                    self._clearPolyline();
                }
            };
            this._textRowChange = this._textRowChange || function () {
                self._updateState();
            };
            this._textRowFocus = this._textRowFocus || function () {
                if (self.options.dataBinded) {
                    var $parentRow = $(this).parent();
                    self._selectRowInList($parentRow);
                    self.options.dataBinded.setSelectedPoint($('#points-selector li', this._$div).index($parentRow), true);
                }
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
                    self._containerController.getUIAttached().getMap().clearSelected();
                }
            };
            this._KeyUpReturnFunction = this._KeyUpReturnFunction || this.generateEnteredFunction(self._deleteFunction);
            this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || this.generateEnteredFunction(self._returnFunction);
            this._KeyUpRevertFunction = this._KeyUpRevertFunction || this.generateEnteredFunction(self._revertFunction);

            this._$div.on('click', '.gis-widget-ico-up', this._icoUpClick);
            this._$div.on('click', '.gis-widget-ico-down', this._icoDownClick);
            this._$div.on('click', '.gis-widget-ico-remove', this._icoDeleteClick);
            this._$div.on('click', '.gis-widget-ico-add', this._icoPlusClick);
            this._$div.on('change', '.data-row input, .data-row input', this._textRowChange);
            this._$div.on('focus', '.data-row input, .data-row input', this._textRowFocus);
            this._$div.on('keyup', '.data-row input, .data-row input', this._textRowChange);
            $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div).on({
                click: this._deselectFunction,
                keyup: this._KeyUpDeselectFunction
            });
            $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).on({
                click: this._returnFunction,
                keyup: this._KeyUpReturnFunction,
                keydown: this.keyPressPreventDefault
            });
            $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div).on({
                click: this._revertFunction,
                keyup: this._KeyUpRevertFunction
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
        /**
         * подключитьс к объекту
         * @private
         */
        _initPolyline: function () {
            this._initPolylineEvents();
        },
        /**
         * Отключиться от линии
         * @private
         */
        _deInitPolyline: function () {
            this._detachPointDataFromAllRows();
            this._deInitPolylineEvents();
            this._clearInfo();
        },
        bindData: function (data) {
            if (data !== this.options.dataBinded) {
                if (this.options.dataBinded) {
                    this._deInitPolyline();
                }
                Gis.Widget.Propertys.prototype.bindData.call(this, data);
                this._initPolyline();
                this._updateStyleList();
                this.updateData();
            }
        }
    });

Gis.Widget.PolylineProperty.CLASS_NAME = "gis-widget-propertys-polyline";
Gis.Widget.PolylineProperty.CENTER_CHANGED = 1;
Gis.Widget.PolylineProperty.TEXT_CHANGED = 3;
Gis.Widget.PolylineProperty.BOTH_CHANGED = 2;
Gis.Widget.PolylineProperty.NOT_CHANGED = 0;