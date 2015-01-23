"use strict";
(function () {
    var BOTTOM_BUTTONS_HEIGHT = 70,
        NO_DATA = Gis.config('relief.no-data', NaN),
        PADDING = 0,
        KOEFF = 1,
        HEIGHT_COEFF = 0.5,
        PADDING_RELIEF_V = 50,
        PADDING_RELIEF_H = 100,
        R_MAJOR = 6378137,
        CURRENT_HEIGHTS = [0, 0],
        MAX_HEIGHT,
        lineHeight,
        centerY,
        centerX,
        oceanRadius,
        outerRadius,
        PATH_POINTS,
        TEST_POINT_1,
        TEST_POINT_2,
        IMMEDIATELY = false,
        FILL_COLOR = 'rgba(229, 169, 62, 0.8)',
        BUTTON_ROUND_BORDER = 'white',
        MAX_LENGTH = 500000,
        /**
         * @type {Object}
         * @property {Array.<number>} heights
         * @property {Array.<Object>} coords
         */
            DATA,
        LINE_ANGLE = 0,
        PADDING_CURRENT_POINT = 2,
        LEFT_OFFSET_CURRENT_POINT = 4,
        ANGLE,
        MIDDLE_ICON_COLOR = 'blue',
        START_ICON_COLOR = 'red',
        END_ICON_COLOR = 'green',
        ICON_RADIUS = 5,
        pattern = document.createElement('canvas'),
        IMG_PATTERN,
        pctx,
        NEED_POINTS_ON_MAP = 'Укажите точки на карте',
        TEXT_WRAP_STROKE = 2;

    pattern.width = 40;
    pattern.height = 40;
    pctx = pattern.getContext('2d');
    pctx.fillStyle = "rgba(60, 60, 60, 0.51)";
    pctx.fillRect(0, 0, 20, 20);
    pctx.fillRect(20, 20, 20, 20);
    IMG_PATTERN = new Image();
    IMG_PATTERN.onload = function () {
    };
    IMG_PATTERN.src = pattern.toDataURL();
    var initCursorPointer = function () {
        document.body.style.cursor = 'pointer';
    };
    var initCursorDefault = function () {
        document.body.style.cursor = 'default';
    };
    var initCursorREsize = function () {
        document.body.style.cursor = 'n-resize';
    };

    /**
     * @param {Gis.LatLng} h1
     * @param {Gis.LatLng} h2
     * @param {number} [h]
     * @returns {number}
     */
    function calculateDeltaBetweenPoints(h1, h2, h) {
        return h1.distanceTo(h2, h);
    }

    var fn = function () {
        IMMEDIATELY = true;
    };

    function isNoData(h) {
        if(isNaN(NO_DATA)) {
            return isNaN(h);
        }
        return h === NO_DATA;
    }

    function getMaxHeight(noCurrent) {
        var max = getMinHeight() + 500;
        if (DATA && DATA.heights) {
            for (var i = 0, len = DATA.heights.length; i < len; i += 1) {
                if (isNoData(DATA.heights[i])) {
                    continue;
                }
                max = Math.max(max, DATA.heights[i]);
            }
        }
        if (max === -Infinity) {
            max = 1000;
        }
        return noCurrent ? max : Math.max(max, CURRENT_HEIGHTS[0], CURRENT_HEIGHTS[1]);
    }

    function getMinHeight() {
        var min = Infinity;
        if (DATA && DATA.heights) {
            for (var i = 0, len = DATA.heights.length; i < len; i += 1) {
                if (isNoData(DATA.heights[i])) {
                    continue;
                }
                min = Math.min(min, DATA.heights[i]);
            }
        }
        if (min === Infinity) {
            min = 0;
        }
        return Math.min(0, Math.round(min));
    }

    function recalculateCoefficient(outerRadius, hAvail) {
        MAX_HEIGHT = getMaxHeight();
        var topPointInMetres = (hAvail * 0.8) * R_MAJOR / outerRadius;
        KOEFF = topPointInMetres / (MAX_HEIGHT - getMinHeight());
    }

    function getCurrentHeight(angle, LINE_ANGLE) {
        var dataLenght = DATA.heights.length - 1, pos;
        pos = Math.round(dataLenght * (angle / 2 + LINE_ANGLE) / angle);
        return DATA.heights[pos];
    }

    function getCurrentCoord(angle, LINE_ANGLE) {
        var dataLenght = DATA.coords.length - 1, pos;
        pos = Math.round(dataLenght * (angle / 2 + LINE_ANGLE) / angle);
        return Gis.latLng(DATA.coords[pos]);
    }

    function checkLineAngle(angle) {
        if (LINE_ANGLE < -0.5) {
            LINE_ANGLE = -0.5;
        }
        if (LINE_ANGLE > 0.5) {
            LINE_ANGLE = 0.5;
        }
    }

    function calculateStartAndDeltaLines(height) {
        var epsilon = Math.floor(Math.log(height * (R_MAJOR / oceanRadius) / KOEFF) / Math.log(10));
        var delta = Math.pow(10, epsilon);
        delta = Math.round((getMaxHeight() - getMinHeight()) / ( delta)) * Math.pow(10, epsilon - 1);
        var newDelta = delta * KOEFF * oceanRadius / R_MAJOR;
        if (newDelta > 30 && !(delta % 2)) {
            delta /= 2;
            newDelta = delta * KOEFF * oceanRadius / R_MAJOR;
        }
        if (newDelta < 15) {
            delta *= 2;
            newDelta = delta * KOEFF * oceanRadius / R_MAJOR;
        }
        var start = Math.round(getMinHeight() / delta);
        delta = newDelta;
        start = start * delta;
        return {delta: delta, start: start};
    }

    /**
     * @extends Gis.Widget.Propertys
     * @class
     */
    Gis.Widget.ReliefProperty = Gis.Widget.Propertys.extend(
        /**
         * @lends Gis.Widget.ReliefProperty.prototype
         */
        {
            options: {
                position: "bottom",
                needCheckLayers: false
            },
            _defaultStyle: {
                color: 'black',
                border: 'white',
                thickness: 2,
                icon: {width: 10, type: 'circle'}
            },
            _type: 'relief',
            getAllHeight: function () {
                return $(document).height();
            }, resetContainerHeight: function (container) {
            container._$container.parent().css('height', this.getAllHeight() * HEIGHT_COEFF);
        }, onAdd: function (container) {
            ANGLE = undefined;
            this._oldHeight = container._$container.parent().css('height');
            this.resetContainerHeight(container);
            Gis.Widget.Propertys.prototype.onAdd.apply(this, arguments);
            if (TEST_POINT_1 && TEST_POINT_2) {
                if (TEST_POINT_1.distanceTo(TEST_POINT_2) <= Gis.config('relief.maxLength', MAX_LENGTH)) {
                    this.doRequest();
                } else {
                    this.showMessage(this.getMessageLength());
                }
            }
            this._updateButtonState();
            this.fillPoints();
        },
            onRemove: function () {
                Gis.Widget.Propertys.prototype.onRemove.call(this);
                if (this._path) {
                    this._containerController.getUIAttached().getMap().removeLayer(this._path);
                    this._path.off('dragend', this._dragEnd, this);
                }
                if (this._midleIcon) {
                    this._containerController.getUIAttached().getMap().removeLayer(this._midleIcon);
                }
                this._containerController._$container.parent().css({
                    'height': this._oldHeight
                });
            },
            /**
             * Обновить данные в текстовых полях
             */
            fillPoints: function () {
                var pointTemplated;

                pointTemplated = TEST_POINT_1 ? this.coordinateToTemplate(TEST_POINT_1) :
                    Gis.UI.coordinate('', '', '');
                this.setHtmlPointSelectorWidgetData(this._$firstPoint, pointTemplated, pointTemplated);
                if (Gis.Util.isDefine(CURRENT_HEIGHTS[0])) {
                    $('.height input', this._$firstPoint).val(Math.round(CURRENT_HEIGHTS[0]));
                }
                pointTemplated = TEST_POINT_2 ? this.coordinateToTemplate(TEST_POINT_2) :
                    Gis.UI.coordinate('', '', '');
                this.setHtmlPointSelectorWidgetData(this._$secondPoint, pointTemplated, pointTemplated);
                if (Gis.Util.isDefine(CURRENT_HEIGHTS[1])) {
                    $('.height input', this._$secondPoint).val(Math.round(CURRENT_HEIGHTS[1]));
                }
                this._maskInput();
            },
            doRequest: function () {
                if (TEST_POINT_1 && TEST_POINT_2) {
                    var self = this;
                    this._shodLoader(true);
                    this._containerController.getUIAttached().getMap().getHeights(TEST_POINT_1, TEST_POINT_2, this._$div.width(), function (data) {
                        DATA = data;
                        CURRENT_HEIGHTS[0] = self.wrapHeight(CURRENT_HEIGHTS[0]);
                        CURRENT_HEIGHTS[1] = self.wrapHeight(CURRENT_HEIGHTS[1]);
                        self._shodLoader(false);
                        if (window.Kinetic) {
                            self.paint(window.Kinetic);
                        }
                    }, function () {
                        self._shodLoader(false);
                        self.showMessage('Данные не получены');
                    });
                }
            },
            _dragEnd: function (e) {
                if (window.Kinetic && (IMMEDIATELY || (e.rows && e.rows.indexOf('points') > -1))) {
                    this._drawMiddleIcon();
                    if (this._timeout) {
                        clearTimeout(this._timeout);
                    }
                    var points = this._path.getPoints(), self = this;
                    TEST_POINT_1 = Gis.latLng(points[0].getLatLng()).wrap();
                    TEST_POINT_2 = Gis.latLng(points[1].getLatLng()).wrap();
                    this.fillPoints();
                    this.getPointsFromInput();
                    PATH_POINTS = undefined;
                    var pointsOk = TEST_POINT_1.distanceTo(TEST_POINT_2) <= Gis.config('relief.maxLength', MAX_LENGTH);
                    this._shodLoader(pointsOk);
                    if (pointsOk) {
                        this.showMessage(false);
                        this._timeout = setTimeout(function () {
                            self.doRequest();
                            self._timeout = null;
                        }, IMMEDIATELY ? 0 : 1000);
                    } else {
                        this.showMessage(this.getMessageLength());
                    }
                }
                IMMEDIATELY = false;
            },
            _drawMiddleIcon: function () {
                var midlePoint;
                if (Gis.Util.isDefine(ANGLE) && this._path) {
                    midlePoint = this.getCurrentPosAndDataFromPath(ANGLE);
                }
                if (midlePoint && TEST_POINT_1 && TEST_POINT_2) {
                    if (!this._midleIcon) {
                        this._midleIcon = Gis.imageLabel({
                            forcePaint: true,
                            selectable: false,
                            draggable: false,
                            id: Gis.Util.generateGUID(),
                            latitude: midlePoint.lat,
                            longitude: midlePoint.lng,
                            caption: 'C',
                            icon: this.getIcon(MIDDLE_ICON_COLOR),
                            angle: 45
                        });
                        this._midleIcon.setControllableByServer(false);
                    } else {
                        this._midleIcon.setData({
                            latitude: midlePoint.lat,
                            longitude: midlePoint.lng
                        })
                    }
                    if (this._midleIcon && !this._containerController.getUIAttached().getMap().hasLayer(this._midleIcon)) {
                        this._containerController.getUIAttached().getMap().addLayer(this._midleIcon);
                    }
                    this._paintLengths();
                } else {
                    if (this._midleIcon && this._containerController.getUIAttached().getMap().hasLayer(this._midleIcon)) {
                        this._containerController.getUIAttached().getMap().removeLayer(this._midleIcon);
                    }
                }
            },
            getIcon: function (END_ICON_COLOR) {
                var style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('relief'));
                return Gis.Util.extend({}, style.icon, {color: END_ICON_COLOR, width: ICON_RADIUS * 3});
            },
            getPoints: function () {
                if (!this._pathPoint1) {
                    this._pathPoint1 = Gis.pathPoint({id: Gis.Util.generateGUID(), forcePaint: true, selectable: false, latitude: TEST_POINT_1.lat, longitude: TEST_POINT_1.lng, caption: 'A', icon: this.getIcon(START_ICON_COLOR)});
                    this._pathPoint1.on('dragend', fn, this)
                } else {
                    this._pathPoint1.setData({latitude: TEST_POINT_1.lat, longitude: TEST_POINT_1.lng});
                }
                if (!this._pathPoint2) {
                    this._pathPoint2 = Gis.pathPoint({id: Gis.Util.generateGUID(), forcePaint: true, selectable: false, latitude: TEST_POINT_2.lat, longitude: TEST_POINT_2.lng, caption: 'B', icon: this.getIcon(END_ICON_COLOR)});
                    this._pathPoint2.on('dragend', fn, this)
                } else {
                    this._pathPoint2.setData({latitude: TEST_POINT_2.lat, longitude: TEST_POINT_2.lng});
                }
                return [this._pathPoint1, this._pathPoint2];
            },
            _drawPath: function () {
                if (TEST_POINT_1 && TEST_POINT_2) {
                    var lineStyle, style;
                    var points = this.getPoints();
                    if (!this._path) {
                        style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('relief'));
                        lineStyle = {color: style.color, border: style.border, thickness: style.thickness};
                        this._path = Gis.path(Gis.Util.extend({id: Gis.Util.generateGUID(), forcePaint: true, tacticObjectType: 'relief', orthodrome: true, line: lineStyle, draggable: true, selectable: false, className: 'gis-relief-marker', icon: style.icon, points: points}));
                        this._path.setControllableByServer(true);
                        this._path.setSelectedStyle(undefined);
                        this._path.on('change', this._dragEnd, this);
                    } else {
                        this._path.setData({points: points});
                    }
                    if (!this._containerController.getUIAttached().getMap().hasLayer(this._path)) {
                        this._containerController.getUIAttached().getMap().addLayer(this._path);
                        this._pathPoint1.off('dragend');
                        this._pathPoint1 = null;
                        this._pathPoint2.off('dragend');
                        this._pathPoint2 = null;
                    }
                } else {
                    if (this._path && this._containerController.getUIAttached().getMap().hasLayer(this._path)) {
                        this._containerController.getUIAttached().getMap().removeLayer(this._path);
                    }
                }
                this._drawMiddleIcon();
            },
            _setData: function (text, center, color) {
                //todo reset data
            },
            deactivate: function () {
            },
            activate: function () {
            },
            updateData: function () {
            },
            rotate: function (point, angle) {
                var angleDeg = -angle * Math.PI / 180;
                return {
                    x: point.x * Math.cos(angleDeg) - point.y * Math.sin(angleDeg),
                    y: point.x * Math.sin(angleDeg) + point.y * Math.cos(angleDeg)
                };
            },
            initDragPoint: function (point, height, angle, draggCallback) {
                var self = this;
                var andgeOne = angle * Math.PI / 360;
                point.dragBoundFunc(function (pos) {
                    var apoint = this;
                    if ((this._startPos.y - pos.y) > (height - PADDING_RELIEF_V * 2)) {
                        pos.y = this._startPos.y - height + PADDING_RELIEF_V * 2;
                    }
                    if ((this._startPos.y - pos.y) < 0) {
                        pos.y = this._startPos.y;
                    }
                    var newPos = {
                        x: this._startPos.x - (Math.tan(andgeOne) * (this._startPos.y - pos.y)),
                        y: pos.y
                    };
                    if (draggCallback) {
                        setTimeout(function () {
                            draggCallback(newPos, apoint);
                        }, 50);
                    }
                    return newPos;
                });
                point.on('mouseover', initCursorPointer);
                point.on('mouseout', initCursorDefault);
                point.on('dragstart', initCursorREsize);
                point.on('dragend', function () {
                    initCursorDefault();
                    if (MAX_HEIGHT !== getMaxHeight()) {
                        Gis.requestAnimationFrame(50)(function () {
                            self.paint(Kinetic);
                        });
                    }
                });
                if (draggCallback) {
                    point.on('drag', function () {
                        draggCallback(null, this);
                    });
                }
                var mouseOut = function () {
                    this.off('mouseleave.mouseOut mouseout.mouseOut mouseup.mouseOut');
                    this.on('mousedown.mouseOut', mouseDown);
                };
                var mouseDown = function () {
                    this.on('mouseleave.mouseOut mouseout.mouseOut mouseup.mouseOut', mouseOut);
                    this.off('mousedown.mouseOut');
                };
                point.on('mousedown.mouseOut', mouseDown);
            },
            _drawGraph: function (angle, outerRadius) {
                var i, len, deltaAngle, point, points, self = this, pointsNoData, pointStartNoData, height, errorLength;
                if (DATA && DATA.heights) {
                    len = DATA.heights.length;
                    points = [];
                    pointsNoData = [];
                    pointStartNoData = undefined;
                    deltaAngle = angle / (len - 1);
                    var scale = KOEFF * oceanRadius / R_MAJOR;
                    for (i = 0; i < len; i += 1) {
                        height = DATA.heights[i];
                        if (isNoData(height)) {
                            height = -R_MAJOR;
                            pointStartNoData = pointStartNoData || {from: i - 1};
                        } else if (pointStartNoData) {
                            pointStartNoData.to = i;
                            pointsNoData.push(pointStartNoData);
                            pointStartNoData = undefined;
                        }
                        point = this.rotate({x: 0, y: -oceanRadius - height * scale}, -deltaAngle * i);
                        points.push(point.x);
                        points.push(point.y);
                    }
                    if (pointStartNoData) {
                        pointStartNoData.to = len - 1;
                        pointsNoData.push(pointStartNoData);
                    }
                    errorLength = pointsNoData.length;
                    if (errorLength) {
                        var delta = angle / len, aPoint;
                        for (i = 0; i < errorLength; i += 1) {
                            aPoint = pointsNoData[i];
                            this._textLayer.add(new Kinetic.Arc({
                                outerRadius: oceanRadius,
                                x: 0,
                                y: 0,
                                fillPatternImage: IMG_PATTERN,
                                strokeWidth: 1,
                                angle: delta * (aPoint.to - Math.max(0, aPoint.from)),
                                draggable: false,
                                rotationDeg: -90 + delta * Math.max(0, aPoint.from)
                            }))
                        }
                    }
                    this._textLayer.add(new Kinetic.Shape({
                        sceneFunc: function (context) {
                            context.beginPath();
                            var startP = {x: 0, y: -outerRadius};
                            var endP = self.rotate({x: 0, y: -outerRadius}, -angle);
                            context.moveTo(0, 0);
                            context.lineTo(startP.x, startP.y);
                            context.lineTo(points[0], points[1]);
                            for (var i = 2, len = points.length; i < len; i += 2) {
                                context.lineTo(points[i], points[i + 1]);
                            }
                            context.lineTo(endP.x, endP.y);
                            context.closePath();
                            // KineticJS specific context method
                            context.fillStrokeShape(this);
                        },
                        x: 0,
                        y: 0,
                        points: points,
                        stroke: '#52441A',
                        fillRadialGradientStartRadius: outerRadius,
                        fillRadialGradientEndRadius: oceanRadius + getMaxHeight(true) * scale,
                        fillRadialGradientColorStops: [0, FILL_COLOR, 0.2, 'rgba(18, 153, 0, 0.8)', 0.6, 'rgba(223, 223, 0, 0.8)', 1, 'rgba(223, 0, 0, 0.8)'],
                        strokeWidth: 2,
                        width: 6
                    }));
                }
            },
            getCurrentPosAndData: function (angle) {
                var currentHeight = getCurrentHeight(angle, ANGLE * LINE_ANGLE);
                var currentCoord = getCurrentCoord(angle, ANGLE * LINE_ANGLE);
                var scale = KOEFF * outerRadius / (R_MAJOR - getMinHeight());
                var pointPosition = this.rotate({x: 0, y: -outerRadius - (currentHeight - getMinHeight()) * scale}, -ANGLE * LINE_ANGLE);
                return {currentHeight: Math.round(currentHeight), pointPosition: pointPosition, coord: currentCoord};
            },
            getCurrentPosAndDataFromPath: function (angle) {
                if (TEST_POINT_1 && TEST_POINT_2) {
                    PATH_POINTS = PATH_POINTS || this._path.getOrthodromeArray(TEST_POINT_1.distanceTo(TEST_POINT_2) / this._$div.width());
                    var dataLenght = PATH_POINTS.length - 1,
                        pos;
                    pos = Math.round(dataLenght * (angle / 2 + ANGLE * LINE_ANGLE) / angle);
                    return Gis.latLng(PATH_POINTS[pos]);
                }
            },
            _drawBottomControl: function () {
                checkLineAngle(ANGLE);
                var radius = oceanRadius,
                    point,
                    self = this,
                    __ret = this.getCurrentPosAndData(ANGLE),
                    currentHeight = __ret.currentHeight,
                    pointPosition = __ret.pointPosition,
                    textPoint = new Kinetic.Text({
                        x: pointPosition.x + PADDING_CURRENT_POINT + LEFT_OFFSET_CURRENT_POINT,
                        y: pointPosition.y + PADDING_CURRENT_POINT + centerY,
                        text: currentHeight + ' м',
                        strokeWidth: 1,
                        fontSize: 14,
                        fontFamily: 'Arial',
                        fill: 'black'
                    });

                var offsetY = textPoint.height() + PADDING_CURRENT_POINT * 2 + TEXT_WRAP_STROKE * 2;
                textPoint.offsetY(offsetY);
                var textPointWrap = new Kinetic.Rect({
                    x: pointPosition.x + LEFT_OFFSET_CURRENT_POINT,
                    y: pointPosition.y + centerY,
                    width: textPoint.width() + PADDING_CURRENT_POINT * 2,
                    height: textPoint.height() + PADDING_CURRENT_POINT * 2,
                    fill: 'rgba(255, 255, 255, 0.7)',
                    stroke: 'black',
                    strokeWidth: TEXT_WRAP_STROKE,
                    cornerRadius: 2
                });
                if (__ret.coord) {
                    var pointTemplated = self.coordinateToTemplate(__ret.coord);
                    self.setHtmlPointSelectorWidgetData(self._$middlePoint, pointTemplated, pointTemplated);
                }
                textPointWrap.offsetY(offsetY);
                if (LINE_ANGLE > 0.5) {
                    LINE_ANGLE = 0.5;
                }
                point = this.rotate({x: 0, y: -radius}, -LINE_ANGLE * ANGLE);
                var pointBottom = new Kinetic.Circle({
                    x: point.x,
                    y: (point.y + centerY),
                    radius: ICON_RADIUS,
                    fill: MIDDLE_ICON_COLOR,
                    stroke: BUTTON_ROUND_BORDER,
                    strokeWidth: 2,
                    draggable: true
                });

                this._drawMiddleIcon();

                function racalculateAngle(pos) {
                    if (pos) {
                        var position = {
                            x: pos.x - centerX,
                            y: pos.y - centerY
                        };
                        LINE_ANGLE = (-Math.atan(position.x / position.y) * 180 / Math.PI) / ANGLE;
                    }
                }

                /**
                 *
                 * @param [pos]
                 */
                function updateLineAngle(pos) {
                    racalculateAngle(pos);
                    checkLineAngle(ANGLE);
                    var lineCenterPoint1 = self.rotate({x: 0, y:  radius + lineHeight}, LINE_ANGLE * ANGLE);
                    var lineCenterPoint2 = self.rotate({x: 0, y:  outerRadius}, LINE_ANGLE * ANGLE);
                    lineCenter.points([lineCenterPoint1.x, centerY - lineCenterPoint1.y, lineCenterPoint2.x, centerY - lineCenterPoint2.y]);

                    var __ret = self.getCurrentPosAndData(ANGLE);
                    textPoint.text(__ret.currentHeight + ' м');
                    textPoint.position({
                        x: __ret.pointPosition.x + PADDING_CURRENT_POINT + LEFT_OFFSET_CURRENT_POINT,
                        y: __ret.pointPosition.y + PADDING_CURRENT_POINT + centerY
                    });
                    textPointWrap.position({
                        x: __ret.pointPosition.x + LEFT_OFFSET_CURRENT_POINT,
                        y: __ret.pointPosition.y + centerY
                    });
                    textPointWrap.width(textPoint.width() + PADDING_CURRENT_POINT * 2);

                    if (__ret.coord) {
                        var pointTemplated = self.coordinateToTemplate(__ret.coord);
                        self.setHtmlPointSelectorWidgetData(self._$middlePoint, pointTemplated, pointTemplated);
                    }
                    setTimeout(function () {
                        Gis.requestAnimationFrame(50)(function () {
                            self._drawMiddleIcon();
//                            self._layerControls.batchDraw();
                        });
                    }, 50);
                }

                pointBottom.dragBoundFunc(function (pos) {
                    updateLineAngle(pos);
                    var p = self.rotate({x: 0, y: radius}, -ANGLE * LINE_ANGLE);
                    pos = {
                        x: centerX - p.x,
                        y: centerY - p.y
                    };
                    return pos;
                });

                pointBottom.on('mouseover', initCursorPointer);
                pointBottom.on('mouseout', initCursorDefault);
                pointBottom.on('dragstart', function () {
                    document.body.style.cursor = 'e-resize';
                });
                pointBottom.on('dragend', function () {
                    initCursorDefault();
                });
                var lineCenterPoint1 = this.rotate({x: 0, y:  radius + lineHeight}, LINE_ANGLE * ANGLE);
                var lineCenterPoint2 = this.rotate({x: 0, y:  outerRadius}, LINE_ANGLE * ANGLE);
                var lineCenter = new Kinetic.Line({
                    x: 0,
                    y: 0,
                    points: [lineCenterPoint1.x, centerY - lineCenterPoint1.y, lineCenterPoint2.x, centerY - lineCenterPoint2.y],
                    stroke: 'black',
                    fill: 'white',
                    dash: [10, 2],
                    strokeWidth: 1,
                    width: 6,
                    draggable: false
                });
                this._layerControlsDraggable.add(lineCenter);
                this._layerControlsDraggable.add(textPointWrap);
                this._layerControlsDraggable.add(textPoint);
                this._layerControlsDraggable.add(pointBottom);
            },
            showMessage: function (message) {
                var $help = $('.help', this._$div);
                if (message) {
                    $(' > div', $help).html(message);
                }
                $help[!message ? 'addClass' : 'removeClass']('hide')

            },
            getMessageLength: function () {
                return 'Расстояние между точками не должно превышать ' + (Gis.config('relief.maxLength', MAX_LENGTH) / 1000) + ' километров';
            },
            _paintLengths: function () {
                var midlePoint;
                if (Gis.Util.isDefine(ANGLE) && this._path) {
                    midlePoint = this.getCurrentPosAndDataFromPath(ANGLE);
                }
                if (!midlePoint) {
                    return;
                }
                this._textLeft = this.setTextLength(this._textLeft,
                    0.5-LINE_ANGLE,
                    Math.round(midlePoint.distanceTo(TEST_POINT_1)) + ' м',
                    -1
                );
                this._textRight = this.setTextLength(this._textRight,
                    -0.5-LINE_ANGLE,
                    Math.round(midlePoint.distanceTo(TEST_POINT_2)) + ' м',
                    -1
                );
            },
            setTextLength: function (point, a, data, offset) {
                var aAngle = a * ANGLE / 2;
                var p = this.rotate({x: 0, y: -oceanRadius}, aAngle);
                p.y += centerY;
                if (!point) {
                    point = new Kinetic.Text({
                        x: p.x,
                        y: p.y,
                        text: data,
                        fontSize: 14,
                        fontFamily: 'Arial',
                        fill: 'black'
                    });
                    var TEXT_OFFSET_Y = -10;
                    point.offsetY(TEXT_OFFSET_Y);
                    point.wrapper = new Kinetic.Rect({
                        x: p.x,
                        y: p.y,
                        width: point.width() + PADDING_CURRENT_POINT * 2,
                        height: point.height() + PADDING_CURRENT_POINT * 2,
                        fill: 'rgba(255, 255, 255, 0.9)',
                        stroke: 'black',
                        strokeWidth: TEXT_WRAP_STROKE,
                        cornerRadius: 2
                    });
                    point.wrapper.offsetY(TEXT_OFFSET_Y + PADDING_CURRENT_POINT);
                } else {
                    point.y(p.y);
                    point.x(p.x);
                    point.text(data);
                    point.wrapper.y(p.y);
                    point.wrapper.x(p.x);
                }
                point.offsetX(-point.width() / 2 * (offset || 1));
                point.wrapper.width(point.width() + PADDING_CURRENT_POINT * 2);
                point.wrapper.offsetX((-point.width() / 2) * (offset || 1) + PADDING_CURRENT_POINT);
                point.rotation(-aAngle);
                point.wrapper.rotation(-aAngle);
                this._layerControlsDraggable.add(point.wrapper);
                this._layerControlsDraggable.add(point);
                return point;
            },
            _doRealPaint: function (Kinetic) {
                try {
                    this.fillPoints();
                    if (!DATA || !TEST_POINT_1 || !TEST_POINT_2) {
                        this._needPoints();
                        return;
                    }
                    if (TEST_POINT_1.distanceTo(TEST_POINT_2) > Gis.config('relief.maxLength', MAX_LENGTH)) {
                        this.showMessage(this.getMessageLength());
                        return;
                    }
                    this.showMessage(false);
                    var width = this._$div.width(),
                        height = this._$div.height() - BOTTOM_BUTTONS_HEIGHT - PADDING,
                        self = this;
                    if (this._stage) {
                        this._stage.removeChildren();
                        this._stage.width(width);
                        this._stage.height(height);
                    } else {
                        this._stage = new Kinetic.Stage({
                            container: 'container-visibility',
                            width: width,
                            height: height
                        });
                    }
                    this._layer = new Kinetic.Layer({
                        height: height
                    });
                    var linearGradPentagon = new Kinetic.Rect({
                        x: PADDING,
                        y: PADDING,
                        cornerRadius: 2,
                        width: width - PADDING * 2,
                        height: height,
                        fill: '#F0F0F0',
                        draggable: false
                    });
                    this._layer.add(linearGradPentagon);
                    var startRadius = R_MAJOR - getMinHeight();
                    var length = calculateDeltaBetweenPoints(TEST_POINT_1, TEST_POINT_2, startRadius);
                    ANGLE = (length * 180) / (Math.PI * startRadius);
                    var availWidth = (width - PADDING_RELIEF_H * 2);
                    outerRadius = availWidth / Math.sqrt(2 - 2 * Math.cos(Math.PI * ANGLE / 180));
                    lineHeight = height - PADDING_RELIEF_V * 2;
                    recalculateCoefficient(outerRadius, lineHeight);
                    var deltaRadius = Math.sqrt(outerRadius * outerRadius - availWidth * availWidth / 4);
                    centerY = height + deltaRadius - PADDING_RELIEF_V;
                    centerX = width / 2;
                    oceanRadius = outerRadius - getMinHeight() * KOEFF * outerRadius / (R_MAJOR - getMinHeight());
                    this._arc = new Kinetic.Arc({
                        outerRadius: oceanRadius,
                        stroke: 'black',
                        x: 0,
                        y: 0,
                        strokeWidth: 2,
                        angle: ANGLE,
                        dash: [10, 10],
                        draggable: false,
                        rotationDeg: -90 - ANGLE / 2
                    });
                    this._line1 = new Kinetic.Line({
                        x: centerX,
                        y: centerY,
                        points: [0, -outerRadius - lineHeight, 0, 0],
                        stroke: 'black',
                        fill: 'white',
                        strokeWidth: 2,
                        width: 6
                    });
                    this._line2 = new Kinetic.Line({
                        x: centerX,
                        y: centerY,
                        points: [0, -outerRadius - lineHeight, 0, 0],
                        stroke: 'black',
                        strokeWidth: 2,
                        width: 6
                    });
                    var pSecondCoord = self.rotate({x: 0, y: -oceanRadius - (CURRENT_HEIGHTS[0] * KOEFF * oceanRadius / R_MAJOR)}, ANGLE / 2);
                    var pFirstCoord = self.rotate({x: 0, y: -oceanRadius - (CURRENT_HEIGHTS[1] * KOEFF * oceanRadius / R_MAJOR)}, -ANGLE / 2);
                    var pointLeft = new Kinetic.Circle({
                        x: pSecondCoord.x,
                        y: pSecondCoord.y + centerY,
                        radius: ICON_RADIUS,
                        fill: START_ICON_COLOR,
                        stroke: BUTTON_ROUND_BORDER,
                        strokeWidth: 2,
                        draggable: true
                    });
                    var pointRight = new Kinetic.Circle({
                        x: pFirstCoord.x,
                        y: pFirstCoord.y + centerY,
                        radius: ICON_RADIUS,
                        fill: END_ICON_COLOR,
                        stroke: BUTTON_ROUND_BORDER,
                        //                    shadow: BUTTON_ROUND_SHADOW_COLOR,
                        //                    shadowOffsetY: 1,
                        //                    shadowBlur: SHADOW_BLUR,
                        strokeWidth: 2,
                        draggable: true
                    });
                    var line;
                    var drawVisibility = function (pos, object) {
                        var isFirst = object && object === pointLeft;
                        var isSecond = object && object === pointRight;
                        var point = {x: pointLeft.x(), y: pointLeft.y()};
                        var xy1 = self.rotate({x: point.x, y: point.y - centerY }, -ANGLE / 2);
                        var point2 = {x: pointRight.x(), y: pointRight.y()};
                        var xy2 = self.rotate({x: point2.x, y: point2.y - centerY }, ANGLE / 2);
                        var points = [point.x, point.y - pointLeft.offsetY() , point2.x, point2.y - pointRight.offsetY()];
                        if (isFirst) {
                            CURRENT_HEIGHTS[0] = Math.round(-(xy1.y + oceanRadius) * (R_MAJOR / oceanRadius) / KOEFF);
                        } else if (isSecond) {
                            CURRENT_HEIGHTS[1] = Math.round(-(xy2.y + oceanRadius) * (R_MAJOR / oceanRadius) / KOEFF);
                        }
                        if (!line) {
                            line = new Kinetic.Line({
                                x: 0,
                                y: 0,
                                points: points,
                                stroke: 'black',
                                strokeWidth: 2,
                                tension: 1
                            });
                            self._layerControlsDraggable.add(line);
                        } else {
                            line.points(points);
                        }
                        self.fillPoints();
                    };
                    this.initDragPoint(pointLeft, height, ANGLE, drawVisibility);
                    this.initDragPoint(pointRight, height, -ANGLE, drawVisibility);

                    this._layerControls = new Kinetic.Layer({
                        height: height,
                        x: centerX,
                        y: centerY
                    });
                    this._layerControlsDraggable = new Kinetic.Layer({
                        height: height,
                        x: centerX,
                        y: 0
                    });
                    this._layerControls.add(this._arc);
                    this._line1.rotateDeg(-ANGLE / 2);
                    this._line2.rotateDeg(ANGLE / 2);
                    var __ret = calculateStartAndDeltaLines(height);
                    var delta = __ret.delta;
                    var start = __ret.start;
                    var currentProcessintR, text;
                    this._textLayer = new Kinetic.Layer({
                        height: height,
                        x: centerX,
                        y: centerY
                    });
                    this._textLayer2 = new Kinetic.Layer({
                        height: height,
                        x: centerX,
                        y: centerY
                    });
                    while (start < (lineHeight + (outerRadius - oceanRadius))) {
                        currentProcessintR = oceanRadius + start;
                        this._layer.add(new Kinetic.Arc({
                            outerRadius: currentProcessintR,
                            stroke: '#000000',
                            opacity: 0.5,
                            x: centerX,
                            y: centerY,
                            strokeWidth: 1,
                            angle: ANGLE,
                            draggable: false,
                            rotationDeg: -90 - ANGLE / 2
                        }));
                        text = new Kinetic.Text({
                            x: 0,
                            y: -currentProcessintR,
                            text: Math.round((start / KOEFF) * (R_MAJOR / oceanRadius)),
                            fontSize: 14,
                            fontFamily: 'Arial',
                            fill: 'black'
                        });
                        text.offsetX(text.getWidth() + 4);
                        text.offsetY(text.getHeight() / 2);
                        this._textLayer.add(text);
                        text = new Kinetic.Text({
                            x: 0,
                            y: -currentProcessintR,
                            text: Math.round((start / KOEFF) * (R_MAJOR / oceanRadius)),
                            fontSize: 14,
                            fontFamily: 'Arial',
                            fill: 'black'
                        });
                        text.offsetX(-4);
                        text.offsetY(text.getHeight() / 2);
                        this._textLayer2.add(text);
                        start += delta;
                    }
                    this._textLayer.rotate(-ANGLE / 2);
                    this._textLayer2.rotate(ANGLE / 2);
                    this._layer.add(this._line1);
                    this._layer.add(this._line2);
                    drawVisibility();
                    if (DATA) {
                        this._drawGraph(ANGLE, outerRadius);
                    }
                    this._drawBottomControl();
                    this._paintLengths();
                    this._layerControlsDraggable.add(pointLeft);
                    this._layerControlsDraggable.add(pointRight);
                    this._stage.add(this._layer);
                    this._stage.add(this._textLayer);
                    this._stage.add(this._textLayer2);
                    this._stage.add(this._layerControls);
                    this._stage.add(this._layerControlsDraggable);
                    pSecondCoord = self.rotate({x: 0, y: -outerRadius}, ANGLE / 2);
                    pFirstCoord = self.rotate({x: 0, y: -outerRadius}, -ANGLE / 2);
                    pointRight._startPos = {x: centerX + pFirstCoord.x, y: centerY + pFirstCoord.y};
                    pointLeft._startPos = {x: centerX + pSecondCoord.x, y: centerY + pSecondCoord.y};
                } catch (e) {
                    Gis.Logger.log("Ошибка отрисовки кадра", e);
                }
            },
            paint: function (Kinetic) {
                var self = this;
                setTimeout(function () {
                    Gis.requestAnimationFrame(50)(function () {
                        self._doRealPaint(Kinetic);
                    });
                }, 1000 / 25)
            },
            _rowPointHtml: function (noAppendHeight) {
                return this._HTMLPointSelectorWidget({
                    tag: 'div',
                    yClass: 'relief-input relief-y',
                    xClass: 'relief-input relief-x'
                }) + (!noAppendHeight ? '<div class="height"><span class="gis-row-name h-name">H</span><input type="number"></div>' : '');
            },
            _shodLoader: function (show) {
                if (this._$loader) {
                    this._$loader[show ? 'addClass' : 'removeClass']('show');
                }
            },
            updateWrapperHeight: function () {
                if (this._needWithtForPoints > this._$config.width() * 0.34) {
                    this._$config.addClass('large');
                    BOTTOM_BUTTONS_HEIGHT =  this._needHeightForPointsVertical;
                } else {
                    BOTTOM_BUTTONS_HEIGHT =  this._needHeightForPointsHorusontal;
                    this._$config.removeClass('large');
                }
                $('.a-wrapper', this._$div).css('height', this._$div.height() - BOTTOM_BUTTONS_HEIGHT - PADDING);
            },
            draw: function () {
                var self = this;
                Gis.Widget.Base.prototype.draw.call(this);
                this._$div.append('<div class="a-wrapper"><div id="container-visibility"></div><div class="help"><div>' + NEED_POINTS_ON_MAP + '</div></div>' + Gis.HTML.LOADER_HTML + '</div>');
                this._$div.addClass(Gis.Widget.Propertys.CLASS_NAME);
                this._$loader = $('.windows8', this._$div);

                this._$config = $('<div id="config">' +
                    '<div class="a-points">' +
                    '<div class="left">' + this._rowPointHtml() + '</div>' +
                    '<div class="center">' + this._rowPointHtml(true) + '</div>' +
                    '<div class="right">' + this._rowPointHtml() + '</div>' +
                    '</div>' +
                    '</div>');
                this._$div.append(this._$config);
                this._$firstPoint = $('.a-points .left', this._$config);
                this._$secondPoint = $('.a-points .right', this._$config);
                this._$middlePoint = $('.a-points .center', this._$config);
                this._needWithtForPoints = 0;
                var $rowsInput = $('>div', this._$firstPoint);
                var PADDING_BOTTOM = 6;
                this._needHeightForPointsVertical = $rowsInput.outerHeight(true) * 3 + PADDING_BOTTOM;
                this._needHeightForPointsHorusontal = $rowsInput.outerHeight(true) + PADDING_BOTTOM;
                $rowsInput.each(function () {
                    self._needWithtForPoints += $(this).outerWidth(true);
                });
                $('input', this._$middlePoint).attr('disabled', 'disabled');
                $('.point-direction', this._$middlePoint).addClass('disabled');
                this._shodLoader(!window.Kinetic);
                this.updateData();
                this.setBounds();
                this._drawPath();
                Gis.Util.loadKinetic(function (Kinetic) {
                    Gis.requestAnimationFrame(100)(function () {
                        self._shodLoader(false);
                        self.paint(Kinetic);
                    });
                }, function () {
                    self.showMessage('Не удалось загрузить kinetic.js. Убедитесь что файл "scripts/kinetic.min.js" существует');
                    self._shodLoader(false);
                });
            },
            initHTML: function () {
                Gis.Widget.Propertys.prototype.initHTML.call(this);
                this._$div.addClass(Gis.Widget.ReliefProperty.CLASS_NAME);
            },
            getNeedSize: function () {
                return [this._$div.outerWidth(true), 200];
            },
            preCalculateSize: function () {
                var height = 0;
                this.resetContainerHeight(this._containerController);
                $('>div', this._containerController._$container).not(this._$div).each(function () {
                    height += $(this).outerHeight(true);
                });
                this._$div.css({
                    height: this._containerController._$container.parent().height() - height - 8
                });
                this.updateWrapperHeight();
            },
            setBounds: function () {
                var self = this;
                this.preCalculateSize();
                if (window.Kinetic && this._$div.parent().length) {
                    if (this._drawTimeout) {
                        clearTimeout(this._drawTimeout);
                    }
                    this._drawTimeout = setTimeout(function () {
                        Gis.requestAnimationFrame(100)(function () {
                            self.paint(window.Kinetic);
                        });
                    }, 100);
                }
                $('.dragger', this._containerController._$container.parent()).draggable('option', 'containment', [0, 200, this._$div.width(), this.getAllHeight() - 300]);
            },
            _mapClicked: function (e) {
                var setted = false;
                if (!TEST_POINT_1) {
                    TEST_POINT_1 = Gis.latLng(e.latLng.latitude, e.latLng.longitude).wrap();
                    setted = true;
                } else if (!TEST_POINT_2) {
                    TEST_POINT_2 = Gis.latLng(e.latLng.latitude, e.latLng.longitude).wrap();
                    setted = true;
                }
                this.fillPoints();
                this.getPointsFromInput();
                if (setted) {
                    PATH_POINTS = undefined;
                    IMMEDIATELY = true;
                    this._updateButtonState();
                    this._drawPath();
                }
            },
            _isDataCorrect: function () {
                var pointProjected1 = this.templateToCoordinate(this.getPointValue($('.relief-x', this._$firstPoint)), this.getPointValue($('.relief-y', this._$firstPoint))),
                    pointProjected2 = this.templateToCoordinate(this.getPointValue($('.relief-x', this._$secondPoint)), this.getPointValue($('.relief-y', this._$secondPoint)));
                pointProjected1 = pointProjected1.y !== '' && pointProjected1.x !== '' && Gis.latLng(pointProjected1.y, pointProjected1.x);
                pointProjected2 = pointProjected2.y !== '' && pointProjected2.x !== '' && Gis.latLng(pointProjected2.y, pointProjected2.x);
                return pointProjected1 && pointProjected2 && pointProjected1.lat && pointProjected2.lat && pointProjected1.lng && pointProjected2.lng;
            },
            _isBigDistance: function (latLng, pointProjected) {
                return (latLng && pointProjected && (Math.abs(latLng.lat - pointProjected.lat) > 1e-8 || Math.abs(latLng.lng - pointProjected.lng) > 1e-8 ));
            },
            _isStateChanged: function () {
                var pointProjected1 = this.templateToCoordinate(this.getPointValue($('.relief-x', this._$firstPoint)), this.getPointValue($('.relief-y', this._$firstPoint))),
                    pointProjected2 = this.templateToCoordinate(this.getPointValue($('.relief-x', this._$secondPoint)), this.getPointValue($('.relief-y', this._$secondPoint))),
                    latLng1 = Gis.latLng(TEST_POINT_1),
                    latLng2 = Gis.latLng(TEST_POINT_2);
                pointProjected1 = pointProjected1.y !== '' && pointProjected1.x !== '' && Gis.latLng(pointProjected1.y, pointProjected1.x);
                pointProjected2 = pointProjected2.y !== '' && pointProjected2.x !== '' && Gis.latLng(pointProjected2.y, pointProjected2.x);
                return (TEST_POINT_1 && TEST_POINT_2 && (this._isBigDistance(latLng1, pointProjected1) || this._isBigDistance(latLng2, pointProjected2) ||
                    this.wrapHeight(parseInt($('.height input', this._$firstPoint).val(), 10), true) !== CURRENT_HEIGHTS[0] ||
                    this.wrapHeight(parseInt($('.height input', this._$secondPoint).val(), 10), true) !== CURRENT_HEIGHTS[1])) ||
                    ((!TEST_POINT_1 || !TEST_POINT_2) && pointProjected1 && pointProjected2);
            },
            _updateButtonState: function () {
                this._$buttonRevert = this._$buttonRevert || $('.' + Gis.Widget.ReliefProperty.CLEAN_CLASS_NAME, this._$div);
                this._$buttonDelete = this._$buttonDelete || $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div);
                this.switchButtonState(this._$buttonRevert, TEST_POINT_1 || TEST_POINT_2);
            },
            initButtonsBlock: function () {
                return "<ul class='gis-property-buttons-list'>\n" +
                    "<li class='revert'>" + this._buttonHTML(Gis.Widget.ReliefProperty.CLEAN_CLASS_NAME, 'Очистить', true, null, true) + "</li>\n" +
                    "<li class='delete'>" + this._buttonHTML(Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, undefined, true, 'Закрыть') + "</li>\n" +
                    "</ul>\n";
            },
            _deInitEvents: function () {
                Gis.Widget.Propertys.prototype._deInitEvents.call(this);
                this._$div.off('change', 'input', this._returnFunction2);
                this._$div.off('blur', 'input', this._returnFunction);
                this._$div.off('click', '.point-direction', this._returnFunction);
                this._$div.off('keyup', 'input', this._KeyUpReturnFunction);

                $('.' + Gis.Widget.ReliefProperty.CLEAN_CLASS_NAME, this._$div).off({
                    click: this._revertFunction,
                    keyup: this._KeyUpRevertFunction
                });
                $('.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._$div).off({
                    click: this._deleteFunction,
                    keyup: this._KeyUpDeleteFunction
                });
                var $dragger = $('.dragger', this._containerController._$container.parent());
                $dragger.removeClass('show');
                $dragger.draggable('destroy');
                this._containerController.getUIAttached().off('presizerecalculated', this.preCalculateSize, this);
            },
            wrapHeight: function (height, onlyMin) {
                if (!onlyMin) {
                    if (height > getMaxHeight()) {
                        height = getMaxHeight();
                    }
                }
                if (height < getMinHeight()) {
                    height = getMinHeight();
                }
                return height;
            },
            getPointsFromInput: function () {
                var pointProjected1, pointProjected2,
                    changed;
                pointProjected1 = this.templateToCoordinate(this.getPointValue($('.relief-x', this._$firstPoint)), this.getPointValue($('.relief-y', this._$firstPoint)));
                pointProjected2 = this.templateToCoordinate(this.getPointValue($('.relief-x', this._$secondPoint)), this.getPointValue($('.relief-y', this._$secondPoint)));
                if (pointProjected1.x !== '' && pointProjected1.y !== '') {
                    changed = !TEST_POINT_1 || TEST_POINT_1.distanceTo(Gis.latLng(pointProjected1.y, pointProjected1.x)) > 1e-8;
                    TEST_POINT_1 = Gis.latLng(pointProjected1.y, pointProjected1.x).wrap();
                }
                if (pointProjected2.x !== '' && pointProjected2.y !== '') {
                    changed = changed || !TEST_POINT_2 || TEST_POINT_2.distanceTo(Gis.latLng(pointProjected2.y, pointProjected2.x)) > 1e-8;
                    TEST_POINT_2 = Gis.latLng(pointProjected2.y, pointProjected2.x).wrap();
                }
                PATH_POINTS = undefined;
                return changed;
            },
            _needPoints: function () {
                if (this._stage) {
                    this._stage.removeChildren();
                }
                this.showMessage(NEED_POINTS_ON_MAP);
            },
            _initEvents: function () {
                var self = this;
                Gis.Widget.Propertys.prototype._initEvents.call(this);
                function generateEnteredFunction(callback) {
                    return function (e) {
                        var returnKeyCode = 13;
                        if (e.keyCode === returnKeyCode || e.charCode === (returnKeyCode + "")) {
                            callback();
                        }
                        e.stopPropagation();
                    };
                }

                this._returnFunction = this._returnFunction || function (e) {
                    if (!e || self.isButtonEnable(this)) {
                        var changed = self.getPointsFromInput();
                        CURRENT_HEIGHTS[0] = self.wrapHeight(parseInt($('.height input', self._$firstPoint).val(), 10), true);
                        CURRENT_HEIGHTS[1] = self.wrapHeight(parseInt($('.height input', self._$secondPoint).val(), 10), true);
                        IMMEDIATELY = true;
                        if (changed) {
                            self._drawPath();
                        } else {
                            self.paint(Kinetic);
                        }
                        self._updateButtonState();
                    }
                };
                this._returnFunction2 = function () {
                    if (self._saveTimeout) {
                        clearTimeout(self._saveTimeout);
                    }
                    self._saveTimeout = setTimeout(function () {
                        self._returnFunction();
                    }, 300);
                };
                this._deleteFunction = this._deleteFunction || function (e) {
                    if (!e || self.isButtonEnable(this)) {
                        Gis.UI.ActionController.getAction('relief').closeAction();
                        Gis.UI.ActionController.getAction('select').execute();
                    }
                };
                this._revertFunction = this._revertFunction || function (e) {
                    if (!e || self.isButtonEnable(this)) {
                        TEST_POINT_1 = undefined;
                        TEST_POINT_2 = undefined;
                        PATH_POINTS = undefined;
                        self._needPoints();
                        self.fillPoints();
                        self._drawPath();
                        self._updateButtonState();
                    }
                };
                var $dragger = $('.dragger', this._containerController._$container.parent());
                $dragger.addClass('show');
                $dragger.draggable({
                    handle: 'div',
                    cursor: 'n-resize',
                    axis: "y",
                    containment: [0, 200, this._$div.width(), this.getAllHeight() - 300],
                    start: function( event, ui ) {
                        self._dragStarted = ui;
                    },
                    stop: function( event, ui ) {
                        var height = self._containerController._$container.parent().height();
                        HEIGHT_COEFF *= (height + (self._dragStarted.offset.top - ui.offset.top)) / height;
                        self._dragStarted = undefined;
                        $(this).css('top', 0);
                        self._containerController.getUIAttached()._recalculateContainerStyles();
                    }
                });
                this._KeyUpReturnFunction = this._KeyUpReturnFunction || generateEnteredFunction(self._returnFunction);
                this._KeyUpDeleteFunction = this._KeyUpDeleteFunction || generateEnteredFunction(self._deleteFunction);
                this._KeyUpRevertFunction = this._KeyUpRevertFunction || generateEnteredFunction(self._revertFunction);
                this._$div.on('change', 'input', this._returnFunction2);
                this._$div.on('blur', 'input', this._returnFunction);
                this._$div.on('click', '.point-direction', this._returnFunction);
                this._$div.on('keyup', 'input', this._KeyUpReturnFunction);
                $('.' + Gis.Widget.ReliefProperty.CLEAN_CLASS_NAME, this._$div).on({
                    click: this._revertFunction,
                    keyup: this._KeyUpRevertFunction
                });
                this._$div.on('click', '.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._deleteFunction);
                this._$div.on('keyup', '.' + Gis.Widget.Propertys.BUTTON_DELETE_CLASS_NAME, this._KeyUpDeleteFunction);
                this._containerController.getUIAttached().on('presizerecalculated', this.preCalculateSize, this);
            },
            _update: function () {
                this.updateData();
                //Хак для файрфокса
                $($('button', this._$div).not('[disabled=disabled]')[0]).focus();
            },
            bindData: function (data) {
            },

            _skChanged: function (e) {
                this.fillPoints();
                var currentPosAndData = this.getCurrentPosAndData(ANGLE);
                if (currentPosAndData && currentPosAndData.coord) {
                    var pointTemplated = this.coordinateToTemplate(currentPosAndData.coord);
                    this.setHtmlPointSelectorWidgetData(this._$middlePoint, pointTemplated, pointTemplated);
                }
                Gis.Widget.Propertys.prototype._skChanged.call(this);
            }
        });

    Gis.Widget.ReliefProperty.CLASS_NAME = "gis-widget-propertys-relief";
    Gis.Widget.ReliefProperty.CLEAN_CLASS_NAME = "clean";
    Gis.Widget.reliefProperty = function (data) {
        return new Gis.Widget.ReliefProperty(data);
    };
}());