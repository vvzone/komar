/*
 * L.HeatMap
 */
(function (L) {
    "use strict";
    //Закешируем нужное нам количество поинтов. создавать тучу нехорошо
    var p1 = L.point(0, 0),
        p2 = L.point(0, 0),
        p3 = L.point(0, 0),
        p4 = L.point(0, 0),
        p5 = L.point(0, 0),
        c1 = new RGBColor("white"),
        c2 = new RGBColor("black"),
        transparent = {color: new RGBColor("rbga(0, 0, 0, 0)"), percent: NaN, value: NaN},
        _defaultColors = Gis.config('heatmap.color'),
        current = L.point(0, 0),
        xy = L.point(0, 0),
        _worker,
        added = 0,
        selfs = {};
    var perTile = 256;
    var PER_THREAD = 6;
    var threads = 4;

    function isDefine(value) {
        return value != undefined && value != null;
    }

    function getRbg(color, cache) {
        if (isDefine(color.r) && isDefine(color.g) && isDefine(color.b)) {
            return color;
        }
        if (cache) {
            cache.parseColor(color);
            return cache;
        }
        return new RGBColor(color);
    }

    function _getPercent(color, max, min) {
        return !isNaN(color.percent) ? color.percent : (isNaN(max) || isNaN(max)) ? null : ((color.value - min) / (max - min));
    }

    function gradedValue(beginColor, endColor, percent) {
        if (isNaN(beginColor.percent) || !(beginColor.percent - endColor.percent)) {
            return [beginColor.color.r, beginColor.color.g, beginColor.color.b, isDefine(beginColor.color.a) ? beginColor.color.a * 255 : 255];
        }
        percent = Math.min((percent - beginColor.percent) / (endColor.percent - beginColor.percent), 1);
        var color1 = getRbg(beginColor.color, c1),
            color2 = getRbg(endColor.color, c2),
            a1 = isDefine(color1.a) ? color1.a * 255 : 255,
            a2 = isDefine(color2.a) ? color2.a * 255 : 255,
            red = color1.r + (percent * (color2.r - color1.r)),
            blue = color1.b + (percent * (color2.b - color1.b)),
            green = color1.g + (percent * (color2.g - color1.g)),
            alpha = a1 + (percent * (a2 - a1));
        return [red, green, blue, alpha];
    }

    function interpolate(point, point1, point2, f) {
        var difider = ((point2.x - point1.x) * (point2.y - point1.y)),
            y2miny = (point2.y - point.y),
            yminy1 = (point.y - point1.y),
            xminusx1 = (point.x - point1.x),
            x2minusx = (point2.x - point.x);
        p4.x = point2.x;
        p4.y = point1.y;
        p5.x = point1.x;
        p5.y = point2.y;
        var f2 = f(point1);
        var f3 = f(p4);
        var f4 = f(p5);
        var f5 = f(point2);
        if (isNaN(f2) || isNaN(f3) || isNaN(f4) || isNaN(f5)) {
            return NaN;
        }
        return difider !== 0 ? ((f2 * x2minusx * y2miny) / difider)
            + ((f3 * xminusx1 * y2miny) / difider)
            + ((f4 * x2minusx * yminy1) / difider)
            + ((f5 * xminusx1 * yminy1) / difider) : difider;
    }

    function getColors(colors, value) {
        var i, len, color;
        if (!colors) {
            return _defaultColors;
        }
        if (isNaN(value)) {
            return [transparent, transparent];
        }
        for (i = 0, len = colors.length; i < len; i += 1) {
            color = colors[i];
            if (color.percent > value) {
                if (i === 0) {
                    return [color, color];
                }
                return [colors[i - 1], color];
            }
        }
        return [color, color];
    }

    function updateNaNColor() {
        transparent = {color: new RGBColor(Gis.config(Gis.Objects.HeatMap.NAN_COLOR_CONGIG_KEY, "rbga(0, 0, 0, 0)")), percent: NaN, value: NaN};
    }

    function _thenPromiseEvent(container, callback) {
        return function (e) {
            callback.call(container, e);
        };
    }

    L.HeatMap = L.Class.extend({
        includes: [L.Mixin.Events],
        _linePainted: undefined,
        _leafletHeatMap: 'l-heat-map',
        _selectedPath: undefined,
        options: {
            maxPointsToCalculateOne: perTile * perTile,
            className: '',
            bounds: undefined,
            preloadSize: L.point(400, 400),
            clickable: true,
            opacity: 1,
            colors: _defaultColors,
            points: undefined,
            skipWW: undefined,
            drawPath: true
        },
        findMinMaxInColors: function (options) {
            var _max = -Infinity;
            var _min = Infinity;
            options.colors.forEach(function (color) {
                if (isDefine(color.value) && !isNaN(color.value)) {
                    _max = Math.max(_max, color.value);
                    _min = Math.min(_min, color.value);
                }
            });
            if (isFinite(_max) && isFinite(_min)) {
                this._max = _max;
                this._min = _min;
            }
        },
        parseColors: function (options) {
            var max, min;
            max = this._max;
            min = this._min;
            options.colors = options.colors.map(function (color) {
                var newColor = {value: color.value, percent: _getPercent(color, max, min)};
                newColor.color = getRbg(color.color);
                return newColor;
            });
            options.colors = options.colors.sort(function (color1, color2) {
                var col1 = isDefine(color1.percent) ? color1.percent : (color1.value - min) / max,
                    col2 = isDefine(color2.percent) ? color2.percent : (color2.value - min) / max;
                return col1 - col2;
            });
        },
        findByColors: function (options) {
            if (!isDefine(this._min) || !isDefine(this._max)) {
                var i, len, min = Infinity, max = -Infinity, value, percent, prevValue, prevPercent, perPercent, minPercent, minValue, maxPercent, maxValue;
                if (options && options.colors) {
                    for (i = 0, len = options.colors.length; i < len; i += 1) {
                        value = options.colors[i].value;
                        percent = options.colors[i].percent;
                        if (!isNaN(value) && isDefine(value) && isDefine(percent)) {
                            if (!isNaN(prevValue) && isDefine(prevValue) && isDefine(prevPercent)) {
                                minPercent = Math.min(prevPercent, percent);
                                maxPercent = Math.max(prevPercent, percent);
                                minValue = Math.min(prevValue, value);
                                maxValue = Math.max(prevValue, value);
                                perPercent = (maxValue - minValue) / ((maxPercent - minPercent));
                                this._min = Math.abs(minPercent) < 0.001 ? minValue : minValue - (minPercent * perPercent);
                                this._max = Math.abs(maxPercent - 1) < 0.001 ? maxValue : maxValue + ((1 - maxPercent) * perPercent);
                            }
                            prevValue = value;
                            prevPercent = percent;
                        }
                    }
                }
            }
        },
        doParseFloat: function (points) {
            var i, i2, len, len2;
            for (i = 0, len = points.length; i < len; i += 1) {
                for (i2 = 0, len2 = points[i].length; i2 < len2; i2 += 1) {
                    if (!isNaN(points[i][i2])) {
                        points[i][i2] = parseFloat(points[i][i2]);
                    }
                }
            }
        },
        findMax: function (options) {
            this._min = undefined;
            this._max = undefined;
            this.doParseFloat(options.points);
            this.findMinMaxInColors(options);
            this.findByColors(options);
            if (!isDefine(this._min) || !isDefine(this._max)) {
                var i, len = options.points.length, max = -Infinity, min = Infinity, len2, i2;
                for (i = 0; i < len; i += 1) {
                    for (i2 = 0, len2 = options.points[i].length; i2 < len2; i2 += 1) {
                        if (!isNaN(options.points[i][i2])) {
                            if (!this._max) {
                                max = Math.max(options.points[i][i2], max);
                            }
                            if (!this._min) {
                                min = Math.min(options.points[i][i2], min);
                            }
                        }
                    }
                }
                this._max = max;
                this._min = min;
            }
        },
        checkDiff: function () {
            var startLn = this.options.bounds.getNorthWest().lng,
                diffx = Math.abs(startLn - this.options.bounds.getNorthEast().lng),
                startLat = this.options.bounds.getNorthWest().lat,
                diffY = Math.abs(startLat - this.options.bounds.getSouthWest().lat);
            this._diffX = diffx;
            this._diffY = diffY;
            this._startLn = this.options.bounds.getSouthWest().lng;
            this._startLat = this.options.bounds.getNorthEast().lat;
            this._xWidth = this.options.points.length - 1;
            this._yWidth = this.options.points[0].length - 1;
        },
        _pathPoints: function (options) {
            return [options.bounds.getSouthEast(), options.bounds.getSouthWest(), options.bounds.getNorthWest(), options.bounds.getNorthEast(), options.bounds.getSouthEast()];
        },
        initWebWorker: function () {
            try {
                if (!_worker) {
                    _worker = cw(L.HeatMapWorker, L.HeatMap.threads);
                    _worker.on('calc', _thenPromiseEvent(this, this._thenPromiseEvent));
                }
            } catch (e) {
                console.error(e);
                this.redraw = this._localRedraw;
                this.redraw();
            }
        },
        initialize: function (canvas, options) {
            this._requestFrame = 0;
            this._currentDrawPosition = 0;
            this.GUID = Date.now();
            this._guid = Date.now();
            updateNaNColor();
            this._latLngBoundsCache = L.latLngBounds(L.latLng(0, 0), L.latLng(1, 1));
            this._linePainted = undefined;
            this._threads = threads;
            this._boundsProjected = undefined;
            if (!options || !options.maxPointsToCalculateOne) {
                this.options.maxPointsToCalculateOne = L.HeatMap.perTile * L.HeatMap.perTile;
            }
            this._selectedPath = L.polyline(this._pathPoints(options), {stroke: true, color: 'rgb(75, 84, 255)', weight: 5});
            if (options.points || options.colors) {
                this.findMax(options);
            }
            if (options.colors) {
                this.parseColors(options);
            }
            L.setOptions(this, options);
            this.checkDiff();
            if (!L.HeatMap.SKIP_WW && !this.options.skipWW && Gis.Concurrency.isWebWorkers()) {
                this.redraw = this._wwRedraw2;
                this.initWebWorker();
            } else {
                this.redraw = this._localRedraw;
            }
        },
        _thenPromiseEvent: function (e) {
            var self = selfs[e.thisGUID];
            if (e.guid === self._guid) {
                self._frameRequested = true;
                setTimeout(function () {
                    Gis.requestAnimationFrame(100)(function () {
                        if (!self._noDraw) {
                            self._updateFromThread(e);
                        }
                        if (e.isLastData) {
                            if (!self.isNeedDrawFrame() && Gis.Util.isDefine(self._drawAfterTo)) {
                                self._currentDrawPosition = self._drawAfterTo;
                                self._drawAfterTo = undefined;
                            }
                            if (self.isNeedDrawFrame()) {
                                self.redraw();
                            }
                        }
                    });
                }, 40);
            }
        },
        _thenPromiseError: function (e) {
            this._requestFrame -= 1;
            if (!this.isNeedDrawFrame() && Gis.Util.isDefine(this._drawAfterTo)) {
                this._currentDrawPosition = this._drawAfterTo;
                this._drawAfterTo = undefined;
            }
            if (this.isNeedDrawFrame()) {
                this.redraw();
            }
            console.error(e);
        },
        _thenPromiseOk: function (e) {
            this._requestFrame -= 1;
            if (!this.isNeedDrawFrame() && Gis.Util.isDefine(this._drawAfterTo)) {
                this._currentDrawPosition = this._drawAfterTo;
                this._drawAfterTo = undefined;
            }
            if (this.isNeedDrawFrame()) {
                this.redraw();
            }
        },
        setSelected: function (selected) {
            if (this.options.drawPath) {
                if (this._selected !== selected && this._map) {
                    if (selected) {
                        this._selectedPath.addTo(this._map);
                    } else {
                        this._map.removeLayer(this._selectedPath);
                    }
                }
            }
            this._selected = selected;
        },
        _fireMouseEvent: function (e) {
            if (!this.hasEventListeners(e.type)) {
                return;
            }

            if (!this.options.bounds.contains(e.latlng)) {
                if (e.type === 'mousemove') {
                    if (this._lastEntered) {
                        e.type = 'mouseout';
                        this.fire('mouseout', e);
                    }
                }
                this._lastEntered = false;
                return;
            }
            if (e.type === 'mousemove') {
                if (!this._lastEntered) {
                    e.type = 'mouseover';
                    this.fire('mouseover', e);
                    this._lastEntered = true;
                    return;
                }
            }
            this.fire(e.type, e);

            if (e.type === 'contextmenu') {
                L.DomEvent.preventDefault(e);
            }
            if (e.type !== 'mousemove') {
                L.DomEvent.stopPropagation(e);
            }
        },

        _initEvents: function () {
            var i, events;
            if (this.options.clickable) {
                L.DomUtil.addClass(this.canvas, 'leaflet-clickable');

                events = ['click', 'dblclick', 'mousedown', 'mouseover',
                    'mouseout', 'mousemove', 'contextmenu'];
                for (i = 0; i < events.length; i += 1) {
                    this._map.on(events[i], this._fireMouseEvent, this);
                }
            }
        },
        _deinitEvents: function () {
            var events = ['click', 'dblclick', 'mousedown', 'mouseover',
                'mouseout', 'mousemove', 'contextmenu'], i, len;
            for (i = 0, len = events.length; i < len; i++) {
                this._map.off(events[i], this._fireMouseEvent, this);
            }
        },
        onDelete: function () {
            this._deinitEvents();
        },
        onAdd: function (map) {
            this._map = map;
            map._initHeatMapRoot();
            added += 1;
            this.canvas = this.canvas || document.createElement('canvas');
            selfs[this.GUID] = this;
            if (!this.canvas.parentNode) {
                this._map._heatMapRoot.appendChild(this.canvas);
            }
            this._initEvents();

            this.fire('add');
            L.DomUtil.addClass(this.canvas, this._leafletHeatMap);
            if (this.options.className) {
                L.DomUtil.addClass(this.canvas, this.options.className);
            }
            if (map.options.zoomAnimation && map.options.markerZoomAnimation) {
                L.DomUtil.addClass(this.canvas, 'leaflet-zoom-animated');
                map.on('zoomanim', this._animateZoomHeatmap, this);
            }
            map.on('zoomstart', this._zoomStart, this);
            map.on({
                'redraw_heatmap': this.onViewreset,
                'viewreset': this.onViewreset,
                'moveend': this.onMoveEnd
            }, this);
            this.canvas.style.opacity = this.options.opacity;
            this._updateHeatMapViewport();
            this.redraw();
        },
        onMoveEnd: function () {
            this._updateHeatMapViewport();
            this.reset();
        },
        onViewreset: function () {
            this._updateHeatMapViewport();
            this.startDraw();
            this._linePainted = undefined;
            this.resetForce(false, true);
        },
        resetForce: function (noClear, noReset) {
            if (!noClear) {
                this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
                this._currentDrawPosition = 0;
                this._redrawRequestedBounds = undefined;
            } else {
                this._toClean = true;
            }
            this._redrawRequested = undefined;
            this._boundsProjected = undefined;
            if (!noReset) {
                this.reset();
            }
        },
        _zoomStart: function () {
//            this._requestFrame = 0;
            this._guid = Date.now();
        },
        reset: function () {
            updateNaNColor();
            this._startPoint = undefined;
            this._endPoint = undefined;
            if (this.isNeedDrawFrame()) {
                this._drawAfterTo = this._currentDrawPosition || undefined;
            } else {
                this._redrawRequestedBounds = undefined;
                this._currentDrawPosition = 0;
            }
            this.startDraw();
            this.redraw();
        },
        setOpacity: function (opacity, noRedraw) {
            if (isDefine(opacity)) {
                this.options.opacity = parseFloat(opacity);
                if (!noRedraw) {
                    this.canvas.style.opacity = this.options.opacity;
                    this.resetForce(true);
                }
            }
        },
        setBounds: function (bounds, noRedraw) {
            if (bounds) {
                this.options.bounds = L.latLngBounds(bounds);
                this.checkDiff();
                this._selectedPath.setLatLngs(this._pathPoints(this.options));
                if (!noRedraw) {
                    this.resetForce();
                }
            }
        },
        setPoints: function (points, noRedraw) {
            if (points) {
                this.options.points = points;
                if (!noRedraw) {
                    if (this.options.points) {
                        this.findMax(this.options);
                    }
                    this.resetForce(true);
                }
            }
        },
        _checkIsMinMaxCorrect: function () {
            if (isNaN(this._min) || isNaN(this._max)) {
                this._min = undefined;
                this._max = undefined;
                this.findMax(this.options);
            }
        },
        setColors: function (colors, noRedraw) {
            if (colors) {
                this.options.colors = colors;
                this.findMinMaxInColors(this.options);
                this._checkIsMinMaxCorrect();
                this.parseColors(this.options);
                this.findMax(this.options);
                if (!noRedraw) {
                    this.resetForce(true);
                }
            }
        },

        addTo: function (map) {
            map.addLayer(this);
            return this;
        },

        onRemove: function (map) {
            if (_worker) {
//                _worker._close();
            }
            added -= 1;
            delete selfs[this.GUID];
//            this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
            map._heatMapRoot.removeChild(this.canvas);
            this._map.removeLayer(this._selectedPath);

            // Need to fire remove event before we set _map to null as the event hooks might need the object
            this.fire('remove');
            this._map = null;
            map.off('zoomanim', this._animateZoomHeatmap, this);
            map.off('zoomstart', this._zoomStart, this);
            map.off({
                'redraw_heatmap': this.onViewreset,
                'viewreset': this.onViewreset,
                'moveend': this.onMoveEnd
            }, this);
//            map.fire('redraw_heatmap');
        },

        setStyle: function (style) {
            L.setOptions(this, style);

            return this;
        },
        drawPoint: function (x, y, color) {
            var context = this.canvas.getContext('2d');
            context.fillStyle = color;
            context.fillRect(x, y, 1, 1);
        },
        getInterpolatedValue: function (x, y, max) {
            var points = this.options.points,
                floorX,
                floorY,
                ceilY,
                ceilX,
                value,
                self = this;
            floorX = Math.floor(x);
            floorY = Math.floor(y);
            ceilX = Math.ceil(x);
            ceilY = Math.ceil(y);
            if (ceilX === floorX) {
                if (ceilX > 0) {
                    floorX -= 1;
                } else {
                    ceilX += 1;
                }
            }
            if (ceilY === floorY) {
                if (ceilY > 0) {
                    floorY -= 1;
                } else {
                    ceilY += 1;
                }
            }
            p1.x = x;
            p1.y = y;
            p2.x = floorX;
            p2.y = floorY;
            p3.x = ceilX;
            p3.y = ceilY;
            value = interpolate(p1, p2, p3, function (point) {
                if (!isDefine(points[point.x])) {
                    return NaN;
                }
                if (!isDefine(points[point.x][point.y])) {
                    return NaN;
                }
                if (isNaN(points[point.x][point.y])) {
                    return points[point.x][point.y];
                }
                return (points[point.x][point.y] - self._min) / (max - self._min);
            });
            return value;
        },
        getPixcelColor: function (x, y) {
            var value = this.getInterpolatedValue(x, y, this._max),
                colors = getColors(this.options.colors, value);
            return gradedValue(colors[0], colors[colors.length - 1], value);
        },
        getBounds: function (extend) {
            var bounds = this._map.getPixelBounds(),
                sw,
                ne;
            bounds.min._subtract(extend);
            bounds.max._add(extend);
            sw = this._map.unproject(bounds.getBottomLeft());
            ne = this._map.unproject(bounds.getTopRight());
            return new L.LatLngBounds(sw, ne);
        },
        getXY: function (coord) {
            xy.x = (Math.abs(coord.lng - this._startLn) / this._diffX) * this._xWidth;
            xy.y = (Math.abs(coord.lat - this._startLat) / this._diffY) * this._yWidth;
            return xy;
        },
//        getToolTip: function (lat) {
//            return (this._min + this.getValue(lat) * (this._max - this._min) ) + "";
//        },
        getValue: function (coord) {
            var __ret = this.getXY(coord);
            return this.getInterpolatedValue(__ret.x, __ret.y, this._max);
        },
        getPixcelColorByCoord: function (coord) {
            var __ret = this.getXY(coord);
            return this.getPixcelColor(__ret.x, __ret.y);
        },
        _renderPoints: function () {
            var startX = this.options.bounds.getSouthWest().lng,
                startY = this.options.bounds.getSouthWest().lat,
                stopY = this.options.bounds.getNorthEast().lat,
                stopX = this.options.bounds.getNorthEast().lng,
                deltaX = (stopX - startX) / (this.options.points.length - 1),
                deltaY = (stopY - startY) / (this.options.points[0].length - 1),
                y,
                point,
                i,
                i2 = 0;
            var context = this.canvas.getContext('2d');
            for (i = 0; i < this.options.points.length; i += 1) {
                i2 = this.options.points[0].length - 1;
                for (y = startY; (y - stopY) < deltaY; y += deltaY) {
                    context.beginPath();
                    point = this._map.latLngToLayerPoint(L.latLng(y, startX)).subtract(this._heatMapViewport.min);
//                    point = this._map.latLngToLayerPoint(L.latLng(startY, startX)).subtract(this._heatMapViewport.min);
                    context.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                    context.fillStyle = 'white';
                    context.fill();
                    context.lineWidth = 2;
                    context.strokeStyle = 'black';
                    context.stroke();
                    context.fillStyle = "white";
                    context.font = "18px Verdana";
                    context.shadowBlur = 3;
                    context.shadowColor = "black";
                    context.fillText(this.options.points[i][i2], point.x, point.y);
                    i2 -= 1;
                }
                startX += deltaX;
            }
        },
        _updateFromThread: function (e) {
            if (!this._map) {
                return;
            }
            var shift = this._heatMapViewport.min.subtract(L.point(e.viewPort));
            var context = this.canvas.getContext('2d');
            var imageData = context.getImageData(e.start - shift.x, e.end - shift.y, e.width, e.height);
            for (var i = 0, len = e.data.length; i < len; i += 1) {
                imageData.data[i] = e.data[i];
            }
            this._redrawRequested = true;
            context.putImageData(imageData, e.start - shift.x, e.end - shift.y);
            if (L.HeatMap.DEBUG) {
                this._renderPoints();
            }
        },
        getCalculatePixelPerLine: function () {
            return Math.max(this.canvas.width, this.options.maxPointsToCalculateOne);
        },
        isNeedDrawFrame: function () {
            return !this._redrawRequestedBounds || this._redrawRequestedBounds.length > this._currentDrawPosition;
        },
        _startCalculate: function (boundsProjected, opt, i, height, crs, pOrigin, delta) {
            this._requestFrame += 1;
            _worker.calculate({
                pixelBounds: [
                    [this._heatMapViewport.min.x, this._heatMapViewport.min.y],
                    [this._heatMapViewport.max.x, this._heatMapViewport.max.y]
                ],
                boundsProjected: [
                    [boundsProjected.min.x, boundsProjected.min.y],
                    [boundsProjected.max.x, boundsProjected.max.y]
                ],
                heatMap: opt,
                linePainted: [i],
                maxPointsToCalculateOne: this.getCalculatePixelPerLine(),
                width: this.canvas.width,
                SKIP_INTERSECT_CHECK: L.HeatMap.SKIP_INTERSECT_CHECK,
                height: height,
                delta: delta,
                position: L.DomUtil.getPosition(this.canvas),
                zoom: this._map.getZoom(),
                projectionName: crs.code,
                projectionString: Gis.ProjectionDatuums.getDatum(crs.code),
                projectedBounds: crs.projectedBounds,
                options: L.extend({}, crs.options, {transformation: undefined}),
                pixelOrigin: [pOrigin.x, pOrigin.y]
            }).then(undefined, _thenPromiseError(this, this._thenPromiseError));
        },
        _startCalculate2: function (boundsProjectedArray, opt, i, height, crs, pOrigin, delta) {
            var bp, z, len, threadsNeeded = Math.ceil(boundsProjectedArray.length / PER_THREAD), k, l, index, prefix, calculatePixelPerLine = this.getCalculatePixelPerLine(),
                datum = Gis.ProjectionDatuums.getDatum(crs.code),
                position = L.DomUtil.getPosition(this.canvas),
                options = L.extend({}, crs.options, {transformation: undefined}),
                pixelBounds = [
                    [this._heatMapViewport.min.x, this._heatMapViewport.min.y],
                    [this._heatMapViewport.max.x, this._heatMapViewport.max.y]
                ];
            for (k = 0, l = threadsNeeded; k < l; k += 1) {
                bp = [];
                prefix = k * PER_THREAD;
                for (z = 0, len = PER_THREAD; z < len; z += 1) {
                    index = prefix + z;
                    if (boundsProjectedArray.length > index) {
                        bp.push([
                            [boundsProjectedArray[index].min.x, boundsProjectedArray[index].min.y],
                            [boundsProjectedArray[index].max.x, boundsProjectedArray[index].max.y]
                        ]);
                    } else {
                        break;
                    }
                }
                this._requestFrame += 1;
                _worker.batch.calculate([
                    {
                        thisGUID: this.GUID,
                        pixelBounds: pixelBounds,
                        boundsProjected: bp,
                        heatMap: opt,
                        guid: this._guid,
                        linePainted: [i],
                        maxPointsToCalculateOne: calculatePixelPerLine,
                        width: this.canvas.width,
                        SKIP_INTERSECT_CHECK: L.HeatMap.SKIP_INTERSECT_CHECK,
                        height: height,
                        transparent: Gis.config(Gis.Objects.HeatMap.NAN_COLOR_CONGIG_KEY, "rbga(0, 0, 0, 0)"),
                        delta: delta,
                        position: position,
                        zoom: this._map.getZoom(),
                        projectionName: crs.code,
                        projectionString: datum,
                        projectedBounds: crs.projectedBounds,
                        options: options,
                        pixelOrigin: [pOrigin.x, pOrigin.y]
                    }
                ]).then(_thenPromiseEvent(this, this._thenPromiseOk), _thenPromiseEvent(this, this._thenPromiseError));
            }
        },
        getQueue: function (boundsProjected) {
            var center = boundsProjected.getCenter(), queue = [], i, maxx, maxy;
            for (var j = boundsProjected.min.y; j <= boundsProjected.max.y; j += L.HeatMap.perTile) {
                maxy = Math.min(j + L.HeatMap.perTile, boundsProjected.max.y);
                for (i = boundsProjected.min.x; i <= boundsProjected.max.x; i += L.HeatMap.perTile) {
                    maxx = Math.min(i + L.HeatMap.perTile, boundsProjected.max.x);
                    queue.push(L.bounds(L.point(i, j), L.point(maxx, maxy)));
                }
            }
            queue.sort(function (a, b) {
                return a.getCenter().distanceTo(center) - b.getCenter().distanceTo(center);
            });
            return queue;
        },
        _checkIntersects: function () {
            var startPoint2, endPoint2, intersect, asOld;
            if (!this._startPoint || !this._endPoint || !this._boundsProjected) {
                this._startPoint = this._map.latLngToLayerPoint(this.options.bounds.getNorthWest()).add(this._map.getPixelOrigin());
                startPoint2 = this._map.latLngToLayerPoint(this.options.bounds.getSouthWest()).add(this._map.getPixelOrigin());
                this._endPoint = this._map.latLngToLayerPoint(this.options.bounds.getSouthEast()).add(this._map.getPixelOrigin());
                endPoint2 = this._map.latLngToLayerPoint(this.options.bounds.getNorthEast()).add(this._map.getPixelOrigin());
                this._startPoint.x = Math.min(this._startPoint.x, startPoint2.x, this._endPoint.x, endPoint2.x);
                this._startPoint.y = Math.min(this._startPoint.y, endPoint2.y, this._endPoint.y, startPoint2.y);
                this._endPoint.x = Math.max(this._startPoint.x, startPoint2.x, this._endPoint.x, endPoint2.x);
                this._endPoint.y = Math.max(this._startPoint.y, endPoint2.y, this._endPoint.y, startPoint2.y);
                var pixelBounds = this._map.getPixelBounds();
                pixelBounds.min._subtract(this.options.preloadSize);
                pixelBounds.max._add(this.options.preloadSize);
                intersect = pixelBounds.getIntersect(L.bounds(this._startPoint, this._endPoint));
                if (!intersect) {
                    this._linePainted = undefined;
                    return false;
                }
                if (!this._boundsProjected) {
                    this._linePainted = undefined;
                } else {
                    asOld = (this._boundsProjected.equals(intersect) || this._laetPixelBounds.contains(this._map.getPixelBounds()));
                    if (asOld && !this._linePainted) {
                        return false;
                    } else if (!asOld) {
                        this._linePainted = undefined;
                        this._redrawRequested = undefined;
                        this._updateHeatMapViewport();
                    }
                }
            } else {
                return false;
            }
//            this._drawAfterTo = 0;
            this._laetPixelBounds = intersect;
            return intersect;
        },
        setPixelColor: function (nextPoint, position, cWidth, height, myImageData) {
            var xReal = nextPoint.x;
            var yReal = nextPoint.y;
            if (xReal < cWidth && yReal < height) {
                var idx = (xReal + yReal * cWidth) * 4;
                myImageData[idx] = nextPoint.z[0];
                myImageData[idx + 1] = nextPoint.z[1];
                myImageData[idx + 2] = nextPoint.z[2];
                myImageData[idx + 3] = nextPoint.z[3];
            }
        },
        isIntersects: function (coord, next) {
            this._latLngBoundsCache._northEast.lat = coord.lat;
            this._latLngBoundsCache._northEast.lng = next.lng;
            this._latLngBoundsCache._southWest.lat = next.lat;
            this._latLngBoundsCache._southWest.lng = coord.lng;
            return this.options.bounds.intersects(this._latLngBoundsCache);
        },
        isContainsPoint: function (coord) {
            return this.options.bounds.contains(coord);
        },
        interpolatePoints: function (pointS, nextPoint, position, cWidth, height, myImageData, delta, f) {
            var coord = f.layerPointToLatLng(pointS),
                next = f.layerPointToLatLng(nextPoint),
                ok = true,
                xdelta = (next.lng - coord.lng) / (nextPoint.x - pointS.x),
                ydelta = (next.lat - coord.lat) / (nextPoint.y - pointS.y),
                startLng = coord.lng,
                i,
                j;
            for (i = pointS.y; i < nextPoint.y; i += 1) {
                coord.lng = startLng;
                current.y = i - delta.y;
                for (j = pointS.x; j < nextPoint.x; j += 1) {
                    current.x = j - delta.x;
                    if (L.HeatMap.SKIP_INTERSECT_CHECK || this.isContainsPoint(coord)) {
                        current.z = this.getPixcelColorByCoord(coord);
                        this.setPixelColor(current, position, cWidth, height, myImageData);
                    }
                    coord.lng = coord.lng + xdelta;
                }
                coord.lat = coord.lat + ydelta;
            }
            return ok;
        },
        _wwRedraw2: function () {
            var i, crs = this._map.options.crs, pOrigin = this._map.getPixelOrigin(), length, boundsProjected;
            if (this._map && !this._noDraw && this._requestFrame < this._threads) {
                if (true) {
                    boundsProjected = this._checkIntersects();
                    this._boundsProjected = this._laetPixelBounds;
                    if (!this._boundsProjected) {
                        return;
                    }

                    if (!this._redrawRequestedBounds || !this.isNeedDrawFrame() || !this._currentDrawPosition) {
                        this._redrawRequestedBounds = this.getQueue(this._boundsProjected);
                    }
                    var bound = this._redrawRequestedBounds[0];
                    if (!bound) {
                        return;
                    }
                    var height = this._boundsProjected.max.y - this._boundsProjected.min.y;
                    var opt = L.extend({}, this.options);
                    opt.canvas = undefined;
                    opt.relativePath = Gis.config('relativePath');
                    opt.events = undefined;
                    opt.bounds = [
                        [opt.bounds.getNorthEast().lat, opt.bounds.getNorthEast().lng],
                        [opt.bounds.getSouthWest().lat, opt.bounds.getSouthWest().lng]
                    ];
                    opt.colors = opt.colors.map(function (val) {
                        return {value: val.value, percent: val.percent, color: val.color.toRGBA()};
                    });
                    var points = [];
                    for (i = 0, length = (L.HeatMap.threads - this._requestFrame) * PER_THREAD; i < length; i += 1) {
                        if (!this.isNeedDrawFrame()) {
                            break;
                        }
                        points.push(this._redrawRequestedBounds[this._currentDrawPosition++]);
                    }
                    if (points.length) {
                        this._startCalculate2(points, opt, 0, height, crs, pOrigin, L.HeatMap.DELTA);
                    }
                }
            }
            return this;
        },
        _localRedraw: function () {
            var currentX, currentY, position,
                myImageData, nextPoint, needBreak, self = this,
                f = function () {
                    self.redraw();
                }, pointS = L.point(0, 0), nextPoint = L.point(0, 0);
            if (this._map && !this._noDraw) {
                if (true) {
                    this._checkIntersects();
                    this._boundsProjected = this._laetPixelBounds;
                    if (!this._boundsProjected) {
                        return;
                    }
                    position = this._heatMapViewport.min;
                    var pixelOrigin = this._map.getPixelOrigin();

                    if (!this.isNeedDrawFrame() || !this._currentDrawPosition) {
                        this._redrawRequestedBounds = this.getQueue(this._boundsProjected);
                    }
                    var bound = this._redrawRequestedBounds[this._currentDrawPosition++];
                    if (!bound) {
                        this._currentDrawPosition = 0;
                        return;
                    }
                    var startPoint = bound.min.subtract(pixelOrigin);
                    var endPoint = bound.max.subtract(pixelOrigin);
                    var width = (endPoint.x - startPoint.x);
                    var heigt = (endPoint.y - startPoint.y);
                    var step = 8;
                    var deltaX = startPoint.x - position.x;
                    var deltaY = startPoint.y - position.y;
                    var context = this.canvas.getContext('2d');
                    myImageData = context.getImageData(deltaX, deltaY, width, heigt);
                    needBreak = false;
                    for (currentY = startPoint.y; currentY < endPoint.y; currentY += step) {
                        for (currentX = startPoint.x; currentX < endPoint.x; currentX += step) {
                            pointS.x = currentX;
                            pointS.y = currentY;
                            nextPoint.x = currentX + step;
                            nextPoint.y = currentY + step;
                            needBreak = this.interpolatePoints(pointS, nextPoint, position, width, heigt, myImageData.data, startPoint, this._map) || needBreak;
                        }
                    }
                    if (needBreak) {
                        context.putImageData(myImageData, deltaX, deltaY);
                        if (L.HeatMap.DEBUG) {
                            this._renderPoints();
                        }
                    }
                    if (this.isNeedDrawFrame()) {
                        Gis.requestAnimationFrame(100)(f);
                    } else {
                        if (Gis.Util.isDefine(this._drawAfterTo)) {
                            this._currentDrawPosition = this._drawAfterTo;
                            this._drawAfterTo = undefined;
                        }
                    }
                }
            }
            return this;
        },
        stopDraw: function () {
            this._noDraw = true;
        },
        _animateZoomHeatmap: function (e) {
            var scale = e.scale,
                offset = e.offset.multiplyBy(-scale)._add(this._heatMapViewport.min);

            this.canvas.style[L.DomUtil.TRANSFORM] =
                L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';
            this.stopDraw();
        },
        startDraw: function () {
            this._noDraw = false;
        },
        _updateHeatMapViewport: function () {
            if (!this._map) {
                return;
            }
            this.latlng = this._map.getBounds().getNorthWest();
            var width = Math.min(this._map.getSize().x, document.body.clientWidth) + this.options.preloadSize.x * 2, imageData, context;
            if (width !== this.canvas.width) {
                this.canvas.width = width;
            }
            var height = Math.min(this._map.getSize().y, document.body.clientHeight) + this.options.preloadSize.y * 2;
            if (height !== this.canvas.height) {
                this.canvas.height = height;
            }
            var size = this._map.getSize(),
                panePos = L.DomUtil.getPosition(this._map._mapPane),
                min = panePos.multiplyBy(-1).subtract(this.options.preloadSize),
                max = min.add(size._round()).add(this.options.preloadSize.multiplyBy(2));
            this._heatMapViewport = new L.Bounds(min, max);
            var shift = L.DomUtil.getPosition(this.canvas);
            if (shift) {
                shift = min.subtract(shift);
                context = this.canvas.getContext('2d');
                imageData = context.getImageData(0, 0, width, height);
                context.clearRect(0, 0, width, height);
            }
            L.DomUtil.setPosition(this.canvas, this._heatMapViewport.min);
            if (imageData) {
                context.putImageData(imageData, -shift.x, -shift.y);
            }
        }
    });

    L.HeatMap.include(L.CaptionBehavior);
    L.HeatMap.include({
        getLabelLatLng: function () {
            return this.options.bounds.getCenter();
        }
    });
    L.HeatMap.include(L.PopupBehavior);
    L.HeatMap.SKIP_INTERSECT_CHECK = true;
    L.HeatMap.SKIP_WW = false;
    if (L.Map) {
        L.Map.include({
            _initHeatMapRoot: function () {
                if (this._heatMapRoot) {
                    return;
                }

                var root = this._heatMapRoot = document.createElement('div');
                root.className = 'leaflet-heatmap-container';
                Gis.DomUtil.prepend(this._panes.overlayPane, root);
            }
        });
    }
    L.HeatMap.perTile = perTile;
    L.HeatMap.threads = threads;
    L.HeatMap.DELTA = 6;
}(L));

