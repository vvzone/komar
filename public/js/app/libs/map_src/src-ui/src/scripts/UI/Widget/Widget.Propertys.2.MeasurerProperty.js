(function () {
    "use strict";
    var instance, added, cycled, R = Gis.Projection.R / 1000,
        DISTANCE_PRECISION = 5,
        ANGLE_PRECISION = 2;

    function findIntersections (pointsCalculated) {
        var pointsCalculated2 = [], intersections = {},
            i, len = pointsCalculated.length, startPoint = pointsCalculated[0], point2, point3,
            indexPrev, indexNext, indexPrev2, indexNext2;
        for (i = 0; i < len; i += 1) {
            indexPrev = (i - 1) >= 0 ?  i - 1 : len - 1;
            startPoint = pointsCalculated[indexPrev];
            point2 = pointsCalculated[i];
            pointsCalculated2.push(point2);
            for (var k = 0; k < len; k += 1) {
                if (i === k || startPoint === pointsCalculated[k]) {
                    continue;
                }
                point3 = (pointsCalculated[k - 1] || pointsCalculated[pointsCalculated.length - 1]);
                if (point3 !== startPoint && point3 !== point2) {
                    intersections[indexPrev ]
                    var calculateIntersectionOfOrtho = Gis.Projection.calculateIntersectionOfOrtho(
                        startPoint.point,
                        point2.point,
                        (pointsCalculated[k - 1] || pointsCalculated[pointsCalculated.length - 1]).point,
                        pointsCalculated[k].point
                    );
                    if (calculateIntersectionOfOrtho) {

                    }
                }
                point3 = (pointsCalculated[k + 1] || pointsCalculated[0]);
                if (point3 !== startPoint && point3 !== point2) {
                    Gis.Projection.calculateIntersectionOfOrtho(
                        startPoint.point,
                        point2.point,
                        (pointsCalculated[k + 1] || pointsCalculated[0]).point,
                        pointsCalculated[k].point
                    );
                }
            }
            indexNext = (i + 1) < len ?  i + 1 : 0;
            startPoint = pointsCalculated[indexNext];

            for (var k = 0; k < len; k += 1) {
                if (i === k || startPoint === pointsCalculated[k]) {
                    continue;
                }
                point3 = (pointsCalculated[k - 1] || pointsCalculated[pointsCalculated.length - 1]);
                if (point3 !== startPoint && point3 !== point2) {
                    Gis.Projection.calculateIntersectionOfOrtho(
                        point2.point,
                        startPoint.point,
                        (pointsCalculated[k - 1] || pointsCalculated[pointsCalculated.length - 1]).point,
                        pointsCalculated[k].point
                    );
                }
                point3 = (pointsCalculated[k + 1] || pointsCalculated[0]);
                if (point3 !== startPoint && point3 !== point2) {
                    Gis.Projection.calculateIntersectionOfOrtho(
                        point2.point,
                        startPoint.point,
                        (pointsCalculated[k + 1] || pointsCalculated[0]).point,
                        pointsCalculated[k].point
                    );
                }
            }
        }
        return intersections;
    }

    function getAreal(pointsCalculated) {
        /**
         * http://mathworld.wolfram.com/SphericalTriangle.html
         */
        pointsCalculated = pointsCalculated.slice();
        var pointsCalculated2 = [], intersections = {};
        var allSquare = 0, i, len = pointsCalculated.length - 1, startPoint = pointsCalculated[0], triangle, point2, point3;
        intersections = findIntersections(pointsCalculated);
        for (i = 0; pointsCalculated.length > 2; i += 1) {
            if (i >= pointsCalculated.length) {
                i = 0;
            }
            startPoint = (pointsCalculated[i - 1] || pointsCalculated[pointsCalculated.length - 1]);
            point2 = pointsCalculated[i];
            point3 = (pointsCalculated[i + 1] || pointsCalculated[0]);
            triangle = new Triangle(startPoint.point, point2.point, point3.point);
            if (pointsCalculated.length === 3 || triangle.correctInPolygon(pointsCalculated)) {
                allSquare += Math.pow(R, 2) * getE(
                    startPoint.point.angle(point2.point),
                    point2.point.angle(point3.point),
                    startPoint.point.angle(point3.point)
                );

                pointsCalculated = pointsCalculated.splice(i + 1);
                i -= 1;
            }
        }
        return allSquare;
    }
    function sign (p1, p2, p3)
    {
        return (p1.lng - p3.lng) * (p2.lat - p3.lat) - (p2.lng - p3.lng) * (p1.lat - p3.lat);
    }
    function Triangle (p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
    Triangle.prototype.correctInPolygon = function (points) {
        return !this.contains(points);
    };
    Triangle.prototype.containsArray = function (points) {
        var i, len;
        for (i = 0, len = points.length; i < len; i += 1) {
            if (this.contains(points[i].point)) {
                return true;
            }
        }
    };
    Triangle.prototype.contains = function (points) {
        if (Gis.Util.isArray(points)) {
            return this.containsArray(points);
        }
        var isCorner = this.p1 === points || this.p2 === points || this.p3 === points;
        if (!isCorner) {
            var b1, b2, b3;

            b1 = sign(points, this.p1, this.p2) < 0.0;
            b2 = sign(points, this.p2, this.p3) < 0.0;
            b3 = sign(points, this.p3, this.p1) < 0.0;

            return ((b1 == b2) && (b2 == b3));
        }
        return false;
    };
    function getE(a, b, c) {
        var s = (a + b + c)/2;
        return Math.atan(Math.sqrt(
              Math.tan(s/2)
            * Math.tan(Math.abs((s-a)/2))
            * Math.tan(Math.abs((s-b)/2))
            * Math.tan(Math.abs((s-c)/2))
        )) * 4;
    }

    /**
     * @extends Gis.Widget.Propertys
     * @class
     */
    Gis.Widget.MeasureProperty = Gis.Widget.Propertys.extend(
        /**
         * @lends Gis.Widget.MeasureProperty.prototype
         */
        {
            includes: Gis.Widget.PointBehavior,
            _history: [],
            _type: 'measure',
            _historyValues: [],
            _path: undefined,
            _defaultStyle: {
                color: 'black',
                border: 'white',
                thickness: 'white',
                icon: {width: 10, type: 'circle'}
            },
            options: {
                needCheckLayers: false,
                colors: undefined
            },
            initialize: function () {
                instance = this;
                Gis.Widget.Propertys.prototype.initialize.apply(this, arguments);
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
            back: function () {
                var self = this, x, y;
                if (this._isStateChanged()) {
                    if (!this._history || this._history.length < 2) {
                        $('#points-selector li', this._$div).filter(function (index) {
                            if (index < 2) {
                                x = self._historyValues[index] ? self._historyValues[index].x : '';
                                y = self._historyValues[index] ? self._historyValues[index].y : '';
                                self.setHtmlPointSelectorWidgetData($(this), Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
                                return false;
                            }
                            return true;
                        }).remove();
                    } else {
                        $('#points-selector li', this._$div).not(this._history).remove();
                        this._history.forEach(function (row, index) {
                            $('#points-selector ol', self._$div).append($(row));
                            x = self._historyValues[index] ? self._historyValues[index].x : '';
                            y = self._historyValues[index] ? self._historyValues[index].y : '';
                            self.setHtmlPointSelectorWidgetData($(row), Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
                        });
                    }
                }
                this._updateState();
            },
            _clearInfo: function () {
                this._$infoContainer.remove();
                this._$infoContainer = undefined;
            },
            _clearMeasure: function () {
                var self = this;
                this._containerController.getUIAttached().getMap().removeLayer(this._path);
                this._deInitPathEvents();
                $('#points-selector li', this._$div).not(function (i) {
                    var $row = $(this);
                    if (i < 2) {
                        self.setHtmlPointSelectorWidgetData($row, Gis.UI.coordinate('', ''), Gis.UI.coordinate('', ''));
//                    self._setValue($('.marker-x', $row), "", "");
//                    self._setValue($('.marker-y', $row), "", "");
                        self._detachPointDataFromRow($row);
                        return this;
                    }
                    return false;
                }).remove();
                this._updateHistory();
                this._clearInfo();
                this._updateState();
                this._path = undefined;
            },
            _setData: function (text, center, color) {
                //todo reset data
            },
            _hilightErrors: function () {
                var error = false, $rows, $Xrow, $Yrow, self = this;
                $rows = $('#points-selector li', this._$div);
                this._pointsCalculated = [];
                $rows.each(function () {
                    $Xrow = $('.marker-x', $(this));
                    $Yrow = $('.marker-y', $(this));
                    error = error || self.checkPoint($(this));
                });
                return error;
            },
            updateData: function () {
                this._setData();
                this._updateState();
            },
            draw: function () {
                Gis.Widget.Propertys.prototype.draw.call(this);
                this.updateData();
            },
            onAdd: function () {
                added = true;
                Gis.Widget.Propertys.prototype.onAdd.apply(this, arguments);
                this._calculateMeasuring();
            },
            initHTML: function () {
                Gis.Widget.Propertys.prototype.initHTML.call(this);
                this._$div.addClass(Gis.Widget.MeasureProperty.CLASS_NAME);
            },
            setBounds: function () {
                var maxHeight, heightContainer, $wrapper, $wrParent, $info, pointsHeight, infoPadding;
                heightContainer = this._containerController.getUIAttached().getAvailableContainerBounds(this.options.position).height;
                maxHeight = heightContainer - Gis.Widget.Scheme.needHeight(heightContainer);
                $wrapper = $('#points-selector', this._$div);
                $info = $('#info-data', this._$div);
                $wrParent = $wrapper.parent();
                $('.gis-widget-propertys-buttons-wraper', this._$div)
                    .each(function () {
                        maxHeight -= $(this).outerHeight(true);
                    });
                maxHeight -= $wrapper.outerHeight(true) - $wrapper.height() + $wrParent.outerHeight(true) - $wrParent.height() + $('.gis-widget-propertys-title', $wrParent).outerHeight(true) - this._$div.outerHeight(true) + this._$div.height();
                infoPadding = $info.parent().outerHeight(true) - $info.height();
                pointsHeight = ((maxHeight / 2 - infoPadding));
                $wrapper.css({
                    maxHeight: Math.max(pointsHeight, 40)
                });
                $info.css({
                    maxHeight: maxHeight - $wrapper.height() - infoPadding
                });
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
            _objectRowHTML: function (object) {
                return "<li class='data-row object-row " +
                    object.getId() +
                    "'>\n" +
                    '<div class="gis-point-in-list inline-points">' +
                    '<span class="row-name" data-id="' +
                    object.getId() +
                    '">' +
                    Gis.UI.TitleGenerators.generateRowNameText(object) +
                    '</span>' +
                    '</div>' +
                    "<span class='gis-widget-ico gis-widget-ico-up'></span>" +
                    "<span class='gis-widget-ico gis-widget-ico-down'></span>" +
                    "<span class='gis-widget-ico gis-widget-ico-remove'></span>" +
                    "<span class='gis-widget-ico gis-widget-ico-add'></span>\n" +
                    "</li>\n";
            },
            _getObjectFromRow: function (row) {
                var object = $(row).data('object');
                if (object) {
                    return object;
                }
                object = Gis.Map.CURRENT_MAP.getLayer($(row).data('id'));
                $(row).data('object', object);
                return object;
            },
            _getObjects: function () {
                var $row = $('.row-name', this._$div), objects = [], self = this;
                $row.each(function () {
                    var items = self._getObjectFromRow(this);
                    if (items) {
                        objects.push(items);
                    }
                });
                return objects;
            },
            /**
             * Объект уже прикреплен
             * @param object
             * @returns {boolean}
             */
            hasObjectObject: function (object) {
                var $row = $('.row-name', this._$div);
                for (var i = 0, len = $row.length; i < len; i += 1) {
                    var objectFromRow = this._getObjectFromRow($row[i]);
                    if (objectFromRow && objectFromRow.getId() === object.getId()) {
                        return true;
                    }
                }
                return false;
            },
            initDataBlock: function () {
                return "<div class='" + Gis.Widget.Propertys.DATA_WRAPER_CLASS + "'>\n" +
                    "<div id='points-title' class='" + Gis.Widget.Propertys.DATA_TITLE_CLASS + "'>Точки</div>\n" +
                    "<div id='points-selector' class='" + Gis.Widget.Propertys.DATA_BLOCK_CLASS + "'>" +
                    "<ol>\n" +
                    this._xyRowHTML() +
                    this._xyRowHTML() +
                    "</ol>\n" +
                    "<div class='gis-widget-add-to-end'><span class='gis-widget-ico gis-widget-ico-add'></span></div>" +
                    "</div>\n" +
                    "</div>\n";
            },
            initButtonsBlock: function () {
                return "<div class='" + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS + "'>\n" +
                    "<ul class='gis-property-buttons-list'>\n" +
                    '<li class="checkbox-cycle button-checkbox"><span class="checkbox"></span><span class="name">Зациклить</span></li>' +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME) + "</li>\n" +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME) + "</li>\n" +
                    "<li>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME) + "</li>\n" +
                    "</ul>\n" +
                    "</div>\n";
            },
            _isStateChanged: function () {
                var changed = false, $rows, self = this;

                $rows = $('#points-selector li', this._$div);
                if (self._history.length && self._history.length !== $rows.length) {
                    return true;
                }
                $rows.each(function (index) {
                    var $row = $(this), $markerX = $('.marker-x', $row), $markerY = $('.marker-y', $row);
                    changed = changed || self._rowChanged($markerX) || self._rowChanged($markerY) || (self._history[index] && this !== self._history[index]);
                });
                return changed;
            },
            _updateButtonState: function () {
                var isStateChanged = this._isStateChanged();
                this._$buttonNew = this._$buttonNew || $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div);
                this._$buttonDeselect = this._$buttonDeselect || $('.' + Gis.Widget.Propertys.BUTTON_DESELECT_CLASS_NAME, this._$div);
                this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.Propertys.BUTTON_REVERT_CLASS_NAME, this._$div);
                this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
                $('.checkbox-cycle .checkbox', this._$div)[cycled ? 'addClass' : 'removeClass']('checked');
                this.switchButtonState(this._$buttonNew, isStateChanged && !this._hilightErrors());
                this.switchButtonState(this._$buttonDeselect, isStateChanged);
                this.switchButtonState(this._$buttonDelete, this._path && this._containerController.getUIAttached().getMap().getLayer(this._path.getId()));
                this.switchButtonState(this._$buttonRevert, isStateChanged);
            },
            _getLastClearPoint: function () {
                var $rows, i, $x, $y, $clearRow;
                $rows = $('#points-selector li', this._$div).not('.object-row');
                for (i = $rows.length - 1; i >= 0; i -= 1) {
                    $x = $('.marker-x', $rows[i]);
                    $y = $('.marker-y', $rows[i]);
                    if ($x.val() !== '' || $y.val() !== '') {
                        break;
                    } else if ($x.val() === '' && $y.val() === '') {
                        $clearRow = $rows[i];
                    }
                }
                if (!$clearRow) {
                    $clearRow = $(this._xyRowHTML());
                    $('#points-selector ol', this._$div).append($clearRow);
                    this._maskInput();
                }
                return $clearRow;
            },
            /**
             *
             * @param {Gis.Objects.Base|Gis.LatLng} point
             * @private
             */
            _insertNewPoint: function (point) {
                var $row, x, y;
                if (!point.getType) {
                    /*
                     * Обычная точка
                     */
                    $row = this._getLastClearPoint();
                    point = this.coordinateToTemplate(point);
                    x = point.x || '';
                    y = point.y || '';
                    this.setHtmlPointSelectorWidgetData($row, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
                } else {
                    //Объект
                    var $clearRow = $(this._objectRowHTML(point));
                    $('.row-name', $clearRow).data('object', point);
                    $('#points-selector ol', this._$div).append($clearRow);
                }
            },
            /**
             * добавить объект
             * @param {Gis.Objects.Base} object
             */
            addObjectToPoints: function (object) {
                Gis.UI.Action.measure()._executeFunction();
                if (!this.hasObjectObject(object)) {
                    this._insertNewPoint(object);
                    this._subscribeOnObject(object);
                    this._calculateMeasuring();
                    this._updateState();
                }
            },
            /**
             * зациклить
             * @param aCycled
             */
            setCycled: function (aCycled) {
                if (cycled !== aCycled) {
                    cycled = aCycled;
                    this._calculateMeasuring();
                }
            },
            _mapClicked: function (e) {
                this._insertNewPoint(Gis.latLng(e.latLng.latitude, e.latLng.longitude));
                this._calculateMeasuring(this._history.length === $('#points-selector li', this._$div).length && this._path && this._containerController.getUIAttached().getMap().hasLayer(this._path));
                this._updateState();
            },
            _calculatePointData: function (row1, row2) {
                var point1, point2, pointProjected1, pointProjected2;
                if (row1 && row2) {
                    pointProjected1 = this._getLatLngFromRow(row1);
                    pointProjected2 = this._getLatLngFromRow(row2);
                    point1 = Gis.latLng(pointProjected1.y, pointProjected1.x);
                    point2 = Gis.latLng(pointProjected2.y, pointProjected2.x);
                    return {
                        point: point1,
                        distance: point1.distanceTo(point2),
                        angle: Gis.Projection.calculateAsimuth(point1, point2)
                    };
                }
            },
            _informationHTML: function () {
                var htmlRows = "", allLength = 0, i, len, val;
                if (this._pointsCalculated && this._pointsCalculated.length) {
                    for (i = 0, (len = cycled ? this._pointsCalculated.length : this._pointsCalculated.length - 1); i < len; i += 1) {
                        val = this._pointsCalculated[i];
                        allLength += val.distance;
                        var prevPoint = this._pointsCalculated[i - 1] || this._pointsCalculated[len - 1];
                        var nextPoint = this._pointsCalculated[i + 1] || this._pointsCalculated[0];
                        var angle2 = Gis.Projection.calculateAngleBetwet3Points(prevPoint.point, val.point, nextPoint.point);
                        htmlRows += "<tr class='gis-widget-info-row gis-widget-measure-info-row'>" +
                            "<td>" + (i + 1) + "</td>" +
                            "<td>" + (val.distance / 1000).toFixed(DISTANCE_PRECISION) + "</td>" +
                            "<td>" + val.angle.toFixed(ANGLE_PRECISION) + "</td>" +
                            "<td>" + ((!i && !cycled) ? '-' : angle2.toFixed(ANGLE_PRECISION)) + "</td>" +
                            "</tr>";
                    }
                }
               var head = !cycled ? "<div class='head'><span class='title'>Длина:</span><span class='value'>" + (allLength / 1000).toFixed(DISTANCE_PRECISION) + " км.</span></div>" :
                   ("<div class='head'><span class='title'>Площадь:</span><span class='value'>" + (getAreal(this._pointsCalculated)).toFixed(DISTANCE_PRECISION) + " км<sup>2</sup>.</span><br>" +
                       "<span class='title'>Периметр:</span><span class='value'>" + (allLength / 1000).toFixed(DISTANCE_PRECISION) + " км.</span><br></div>");
                return '<div class="gis-widget-measure-info">' + head + (htmlRows && "<table class='gis-widget-info '>" +
                    "<thead><tr><th>№</th><th>Длина(км)</th><th>Направление</th><th>Угол</th></tr></thead>" +
                    htmlRows +
                    "</table>") + '</div>';
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
                    $infoContainer = $('.gis-widget-measure-info', this._$div);
                    if ($infoContainer.length) {
                        $infoContainer.replaceWith($(htmlRows));
                    } else {
                        this._$infoContainer = $(this._infoContainerHTML(htmlRows));
                        this._$infoContainer.insertAfter($('.' + Gis.Widget.Propertys.BUTTONS_WRAPER_CLASS, this._$div));
                    }
//                this.setBounds();
                }
            },
            _updateDataFromPath: function () {
                var latlngs = this._path.getPoints(),
                    callback,
                    $rows,
                    self = this,
                    point,
                    $row,
                    x,
                    y;
                if (latlngs) {
                    $rows = $('#points-selector li', this._$div);
                    callback = function (value, index) {
                        point = self.coordinateToTemplate(value.getLatLng());
                        $row = $($rows[index]);
                        if ($row) {
                            y = point.y || '';
                            x = point.x || '';
                            self.setHtmlPointSelectorWidgetData($row, Gis.UI.coordinate(x, y), Gis.UI.coordinate(x, y));
                            self._attachPointDataToRow($row, value, true);
                        }
                    };
                    latlngs.forEach(callback);
                    this._calculateMeasuring(true);
                }
            },
            _initPathEvents: function () {
                if (this._path && !this._pathEventsInitialized) {
                    this._pathEventsInitialized = true;
                    this._path.on('change', this._updateDataFromPath, this);
                    this._path.on('selected', this._layerSelected, this);
                    this._path.on('unselected', this._layerUnSelected, this);
                }
            },
            _deInitPathEvents: function () {
                if (this._path && this._pathEventsInitialized) {
                    this._pathEventsInitialized = false;
                    this._path.off('change', this._updateDataFromPath, this);
                    this._path.off('selected', this._layerSelected, this);
                    this._path.off('unselected', this._layerUnSelected, this);
                }
            },

            _getPathPoints: function () {
                return this._pathPoints.points;
            },
            _drawPath: function () {
                var lineStyle, style;
                if (!this._path) {
                    style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('measure'));
                    lineStyle = {color: style.color, border: style.border, thickness: style.thickness};
                    this._path = Gis.path(Gis.Util.extend({id: Gis.Util.generateGUID(), isCycle: cycled, forcePaint: true, tacticObjectType: 'measurer', line: lineStyle, draggable: !this._getObjects().length, selectable: true, className: 'gis-measure-marker', orthodrome: true, icon: style.icon, points: this._getPathPoints()}));
                    this._path.setControllableByServer(false);
                    this._path.setSelectedStyle(undefined);
                } else {
                    this._path.setData({draggable: !this._getObjects().length, isCycle: cycled, points: this._getPathPoints()});
                }
                if (!this._containerController.getUIAttached().getMap().hasLayer(this._path)) {
                    this._path.addTo(this._containerController.getUIAttached().getMap());
                }
                this._initPathEvents();
            },
            _getLatLngFromRow: function (row) {
                row = $(row);
                var $markerY = $('.marker-y', row), $markerX = $('.marker-x', row), $markerObject = $('.row-name', row), point;
                if ($markerObject.length) {
                    var center = this._getObjectFromRow($markerObject).getCenter();
                    var coordinate = Gis.UI.coordinate(center[1], center[0]);
                    coordinate.isObject = true;
                    return coordinate;
                }
                if ($markerY.val() !== '' && $markerX.val() !== '') {
                    point = this.getPointWidgetData(row);
                    return this.templateToCoordinate(point.x, point.y);
                }
            },
            _calculateMeasuring: function (skipPathRedraw) {
                if (!this._calculating) {
                    var $rows, self;
                    self = this;
                    this._calculating = true;
                    if (!this._hilightErrors() && added) {
                        $rows = $('#points-selector li', this._$div);
                        this._pointsCalculated = [];
                        this._pathPoints = {points: []};
                        $rows.each(function (position) {
                            var $this = $(this), $nextRow, convertedPoint;
                            $nextRow = $rows[position + 1];
                            if (!$nextRow) {
                                $nextRow = $rows[0];
                            }
                            convertedPoint = self._getLatLngFromRow($this);
                            if (convertedPoint) {
    //                            point = self.getPointWidgetData($this);
    //                            self.setHtmlPointSelectorWidgetData($this, point, point);
                                self._attachPointDataToRow($this, {latitude: convertedPoint.y, longitude: convertedPoint.x, draggable: !convertedPoint.isObject, simplify: true});
                                self._pathPoints.points.push(Gis.Util.extend(self._getPoint($this).objectData(), {draggable: !convertedPoint.isObject, latitude: convertedPoint.y, longitude: convertedPoint.x}));
                                if ($nextRow) {
                                    self._pointsCalculated.push(self._calculatePointData($this, $nextRow));
                                }
                            }
                        });
                        if (!skipPathRedraw && self._pathPoints.points.length >= 2) {
                            this._drawPath();
                        }
                        if (self._pathPoints.points.length >= 2) {
                            this._drawResultCalculation();
                        }
                        this._updateHistory();
                    }
                    this._updateState();
                    this._calculating = false;
                }
            },

            _skChanged: Gis.Widget.ListPoints._skChanged,
            _layerSelected: function (e) {
                var markerKey = e.additional && e.additional.markerKey,
                    row,
                    $rows;
                if (markerKey !== undefined) {
                    $rows = $('#points-selector .data-row', this._$div);
                    row = $rows[markerKey];
                    $(':focus').blur();
                    $rows.not(row).removeClass('selected');
                    if (row) {
                        $(row).addClass('selected');
                    }
                }
            },
            _layerUnSelected: function () {
                var $rows;
                $rows = $('#points-selector .data-row', this._$div);
                $rows.removeClass('selected');
            },
            onRemove: function () {
                added = false;
                Gis.Widget.Propertys.prototype.onRemove.call(this);
                this._containerController.getUIAttached().getMap().removeLayer(this._path);
            },
            _deInitEvents: function () {
                var self = this;
                this._deInitPathEvents();
                this._$div.off('click', '.gis-widget-ico-up', this._icoUpClick);
                this._$div.off('click', '.gis-widget-ico-down', this._icoDownClick);
                this._$div.off('click', '.gis-widget-ico-remove', this._icoDeleteClick);
                this._$div.off('click', '.gis-widget-ico-add', this._icoPlusClick);
                this._$div.off('click', '.checkbox-cycle', this._checkBoxClick);

                this._$div.off('change', '.data-row input, .data-row input', this._textRowChange);
                this._$div.off('keyup', '.data-row input, .data-row input', this._textRowChange);
                $('.' + Gis.Widget.Propertys.BUTTON_RETURN_CLASS_NAME, this._$div).off({
                    click: this._returnFunction,
                    keyup: this._KeyUpReturnFunction
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
//                this._getObjects().forEach(function (val) {
//                    self._unSubscribeObject(val);
//                });
            },
            _removeRow: function ($row) {
                var $list = $row.parent();
                if ($('.data-row', $list).length > 2) {
                    $row.remove();
                }
            },
            _deleteKeyFire: function (e) {
                if ((e.srcElement || e.target).type !== 'text') {
                    if ($('#points-selector .data-row.selected', this._$div).length) {
                        this._removeRow($('#points-selector .data-row.selected', this._$div));
                        this._updateState();
                        e.preventDefault();
                        return false;
                    }
                }
            },
            _removeObject: function () {
                instance._removeRow($('#points-selector .' + this.getId(), instance._$div));
                instance._updateState();
                instance._unSubscribeObject(this);
            },
            _objectChanged: function () {
                instance._calculateMeasuring();
            },
            _subscribeOnObject: function (object) {
                object.on('change', this._objectChanged, this);
                object.on('remove', this._removeObject, object);
            },
            _unSubscribeObject: function (object) {
                object.off('change', this._objectChanged, this);
                object.off('remove', this._removeObject, object);
            },
            _initEvents: function () {
                var self = this;
                this._initPathEvents();
                this._containerController.getUIAttached().getMap().on('layerselected', this._layerSelected, this);
                this._containerController.getUIAttached().getMap().on('layerunselected', this._layerUnSelected, this);
                function generateEnteredFunction(callback) {
                    return function (e) {
                        var returnKeyCode = 13;
                        if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                            callback();
                        }
                        e.stopPropagation();
                    };
                }
                this._returnFunction = this._returnFunction || function () {
                    if (self.isButtonEnable(this)) {
                        self._calculateMeasuring();
                    }
                };
                this._icoUpClick = this._icoUpClick || function () {
                    var $listRow = $(this).parent(), $prev;
                    $prev = $listRow.prev();
                    if ($prev.length) {
                        $listRow.insertBefore($prev);
                    }
                    self._updateState();
                };
                this._icoDownClick = this._icoDownClick || function () {
                    var $listRow = $(this).parent(), $next;
                    $next = $listRow.next();
                    if ($next.length) {
                        $next.insertBefore($listRow);
                    }
                    self._updateState();
                };
                this._icoDeleteClick = this._icoDeleteClick || function () {
                    var $row = $(this).parent();
                    self._removeRow($row);
                    self._updateState();
                };
                this._icoPlusClick = this._icoPlusClick || function () {
                    var $listRow = $(this).parent();
                    if ($listRow[0].tagName.toLowerCase() === 'li') {
                        $(self._xyRowHTML()).insertBefore($listRow);
                    } else {
                        $(self._xyRowHTML()).appendTo($('ol', $listRow.parent()));
                    }
                    self._maskInput();
                    self._updateState();
                };
                this._checkBoxClick = this._checkBoxClick || function () {
                    instance.setCycled(!cycled);
                    return false;
                };
                this._deleteFunction = this._deleteFunction || function () {
                    if (self.isButtonEnable(this)) {
                        self._clearMeasure();
                    }
                };
                this._textRowChange = this._textRowChange || function () {
                    self._updateState();
                };
                this._textRowKeyPress = this._textRowKeyPress || function () {
                    self._updateState();
                };
                this._revertFunction = this._revertFunction || function () {
                    if (self.isButtonEnable(this)) {
                        self.back();
                    }
                };
                this._KeyUpReturnFunction = this._KeyUpReturnFunction || generateEnteredFunction(self._returnFunction);
                this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || generateEnteredFunction(self._deleteFunction);
                this._KeyUpRevertFunction = this._KeyUpRevertFunction || generateEnteredFunction(self._revertFunction);

                this._$div.on('click', '.gis-widget-ico-up', this._icoUpClick);
                this._$div.on('click', '.gis-widget-ico-down', this._icoDownClick);
                this._$div.on('click', '.gis-widget-ico-remove', this._icoDeleteClick);
                this._$div.on('click', '.gis-widget-ico-add', this._icoPlusClick);
                this._$div.on('click', '.checkbox-cycle', this._checkBoxClick);
                this._$div.on('change', '.data-row input, .data-row input', this._textRowChange);
                this._$div.on('keyup', '.data-row input, .data-row input', this._textRowChange);
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
//                this._getObjects().forEach(function (val) {
//                    self._subscribeOnObject(val);
//                });
            },
            _update: function () {
                this.updateData();
                //Хак для файрфокса
                $($('button', this._$div).not('[disabled=disabled]')[0]).focus();
            },
            bindData: function (data) {
            }
        });

    Gis.Widget.MeasureProperty.CLASS_NAME = "gis-widget-propertys-measure";
    Gis.Widget.MeasureProperty.CENTER_CHANGED = 1;
    Gis.Widget.MeasureProperty.TEXT_CHANGED = 3;
    Gis.Widget.MeasureProperty.BOTH_CHANGED = 2;
    Gis.Widget.MeasureProperty.NOT_CHANGED = 0;
    Gis.Widget.measureProperty = function (data) {
        if (instance) {
            return instance;
        }
        return new Gis.Widget.MeasureProperty(data);
    };
    var MEASURER_ACTION = 'to-measurer';
    Gis.Objects.Base.addGlobalContextMenuElement('Связать с измерителем', MEASURER_ACTION);
    Gis.EventBus.on('contextmenu', function (e) {
        if (e.action === MEASURER_ACTION) {
            Gis.Widget.measureProperty().addObjectToPoints(e.target);
        }
    });
}());