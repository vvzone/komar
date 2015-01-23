"use strict";
/**
 *
 * @class
 * @extends Gis.Widget.PolylineProperty
 */
Gis.Widget.PathProperty = Gis.Widget.PolylineProperty.extend(
    /**
     * @lends Gis.Widget.PathProperty.prototype
     */
    {
        _type: 'path',
        _removePolyline: function (e) {
            var layer = e.target;
            layer.off('remove', this._removePolyline, this);
        },

        _clearPolyline: function () {
            Gis.UI.DeleteActions.path.call(this, {srcElement: {}}, this.options.dataBinded);
        },
        _calculatePointData: function (row1, row2) {
            var point1, point2, distance = 0, projectedPoint1, projectedPoint2;
            if (row1) {
                projectedPoint1 = this.templateToCoordinate(this.getPointValue($('.marker-x', $(row1))), this.getPointValue($('.marker-y', $(row1))));
                point1 = Gis.latLng(projectedPoint1.y, projectedPoint1.x);
                this._pointsLatlng.push(point1);
                if (row2) {
                    projectedPoint2 = this.templateToCoordinate(this.getPointValue($('.marker-x', $(row2))), this.getPointValue($('.marker-y', $(row2))));
                    point2 = Gis.latLng(projectedPoint2.y, projectedPoint2.x);
                    distance = point1.distanceTo(point2);
                }
            }
            return distance;
        },
        _drawPolyline: function () {
            var lineStyle, style;
            style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('path'));
            lineStyle = {color: this.getSelectedColor()};
            style.icon.color = this.getSelectedColor();
            if (!this.options.dataBinded) {
                lineStyle.thickness = style.thickness;
                lineStyle.border = style.border;
                this.options.dataBinded = Gis.path(Gis.Util.extend({id: Gis.Util.generateGUID(), line: lineStyle, draggable: true, selectable: true, icon: style.icon, points: this._getPathPoints()}));
                this.options.dataBinded.setCourseEnable(true);
                this.options.dataBinded.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
            } else {
                lineStyle = Gis.Util.extend({}, this.options.dataBinded.getOption('line').options, lineStyle);
                this.options.dataBinded.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
                this.options.dataBinded.setData(Gis.Util.extend({}, {line: lineStyle, icon: style.icon, points: this._getPathPoints()}));
            }
            if (!this._containerController.getUIAttached().getMap().hasLayer(this.options.dataBinded)) {
                this.options.dataBinded.addTo(this._containerController.getUIAttached().getMap());
                this._containerController.getUIAttached().getMap().selectLayer(this.options.dataBinded);
            }
            this._initPolylineEvents();
        },
        _calculatePolyline: function (skipPolylineRedraw) {
            var $rows, self, $nextRow, $markerY, $markerX, projectedPoint, pointValueX, pointValueY;
            self = this;
            if (!this._hilightErrors()) {
                $rows = $('#points-selector li', this._$div);
                this._distanceCalculated = 0;
                this._pointsLatlng = [];
                this.options.dataBindedPoints = {points: []};
                $rows.each(function (position) {
                    $markerY = $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, $(this));
                    $markerX = $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, $(this));
                    pointValueX = self.getPointValue($markerX);
                    pointValueY = self.getPointValue($markerY);
                    projectedPoint = self.templateToCoordinate(pointValueX, pointValueY);
                    $nextRow = $rows[position + 1];
                    self._attachPointDataToRow($(this), {latitude: projectedPoint.y, longitude: projectedPoint.x});
                    self.options.dataBindedPoints.points.push(Gis.Util.extend(self._getPoint($(this)).objectData(), {latitude: projectedPoint.y, longitude: projectedPoint.x}));
                    self._distanceCalculated += self._calculatePointData($(this), $nextRow);
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
            this._drawResultCalculation();
            this._updateState();
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
            if (points && points.length) {
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
        _deInitEvents: function () {
            Gis.Widget.PolylineProperty.prototype._deInitEvents.call(this);
            if (this.options.dataBinded) {
                this.options.dataBinded.on('remove', this._removePolyline, this);
            }
        },
        _initEvents: function () {
            if (this.options.dataBinded) {
                this.options.dataBinded.off('remove', this._removePolyline, this);
            }
            Gis.Widget.PolylineProperty.prototype._initEvents.call(this);
        }
    });

Gis.UI.DeleteActions.path = function (e, dataBinded) {
    this._deleteLayerConfirm({
        title: 'Вы действительно хотите удалить маршрут?',
        callback: function () {
            this.removeLayerFromMap(dataBinded || this.options.dataBinded, dataBinded || this.options.dataBinded);
        },
        context: this,
        id: 'path-remove-dialog'
    }, dataBinded);
};
Gis.Widget.pathProperty = function (data) {
    return new Gis.Widget.PathProperty(data);
};