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
        transparent = {color: new RGBColor("rbga(0, 0, 0, 0)"), percent: NaN},
        _defaultColors = [{value: 0, color: new RGBColor("rgb(13,255,3)")}, {value: 1, color: new RGBColor("rgb(0, 10, 255)")}],
        latLngBoundsCache = L.latLngBounds(L.latLng(0, 0), L.latLng(1, 1)),
        current = L.point(0, 0),
        xy = L.point(0, 0),
        perTile = 256,
        threads = 8;
    function isDefine(value) {
        return value != undefined && value != null;
    }
    function getRbg(color, cache) {
        if (isDefine(color.r) && isDefine(color.g) && isDefine(color.b) && isDefine(color.a)) {
            return color;
        }
        if (cache) {
            cache.parseColor(color);
            return cache;
        }
        return new RGBColor(color);
    }

    function _getPercent(color, max, min) {
        return isDefine(color.percent) ? color.percent : (color.value - min) / max;
    }
    function gradedValue(beginColor, endColor, percent) {
        if (isNaN(beginColor.percent) || !(beginColor.percent - endColor.percent)) {
            return [beginColor.color.r, beginColor.color.g, beginColor.color.b, isDefine(beginColor.color.a) ? beginColor.color.a * 255 : 255];
        }
        percent = Math.min((percent - beginColor.percent) /  (endColor.percent - beginColor.percent), 1);
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

    L.HeatMap = L.Class.extend({
        includes: [L.Mixin.Events],
        _linePainted: undefined,
        _cache: {},
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
            skipWW: undefined
        },
        findMinMaxInColors: function (options) {
            var self = this;
            options.colors.forEach(function (color) {
                if (isDefine(color.value) && isDefine(color.percent)) {
                    if (Math.abs(color.percent - 1) < 0.001) {
                        self._max = color.value;
                    }
                    if (Math.abs(color.percent) < 0.001) {
                        self._min = color.value;
                    }
                }
            });
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
        isIntersects: function (coord, next) {
            latLngBoundsCache._northEast.lat = coord.lat;
            latLngBoundsCache._northEast.lng = next.lng;
            latLngBoundsCache._southWest.lat = next.lat;
            latLngBoundsCache._southWest.lng = coord.lng;
            return this.options.bounds.intersects(latLngBoundsCache);
        },
        isContainsPoint: function (coord) {
            return this.options.bounds.contains(coord);
        },
        interpolatePoints: function (pointS, nextPoint, position, cWidth, height, myImageData, delta,layerPointToLatLng ) {
            var coord = layerPointToLatLng(pointS),
                next = layerPointToLatLng(nextPoint),
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
        findByColors: function (options) {
            if (!isDefine(this._min) || !isDefine(this._max)) {
                var i, len, min = Infinity, max = -Infinity, value, percent, prevValue, prevPercent, perPercent, minPercent, minValue, maxPercent, maxValue;
                if (options && options.colors) {
                    for (i = 0, len = options.colors.length; i < len; i += 1) {
                        value = options.colors[i].value;
                        percent = options.colors[i].percent;
                        if (isDefine(value) && isDefine(percent)) {
                            if (isDefine(prevValue) && isDefine(prevPercent)) {
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
            for (i = 0, len =  points.length; i < len; i += 1) {
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
            var self = this;
            try {
                this.pointsToDraw = [];
                this._worker = cw(L.HeatMapWorker, threads);
            } catch (e) {
                console.log(e);
                this.redraw = this._localRedraw;
                self.redraw();
            }
        },
        initialize: function (canvas, options) {
            this._canvas = canvas;
            this._linePainted = undefined;
            this._boundsProjected = undefined;
            if (options.transparent) {
                transparent = {color: new RGBColor(options.transparent), percent: NaN, value: NaN};
            }
            options.bounds = L.latLngBounds(options.bounds);
            if (L.polyline) {
                this._selectedPath = L.polyline(this._pathPoints(options), {stroke: true, color: 'rgb(75, 84, 255)', weight: 5});
            }
            if (options.points) {
                this.findMax(options);
            }
            if (options.colors) {
                this.parseColors(options);
            }
            L.setOptions(this, options);
            this.checkDiff();
            if (!this.options.skipWW && Gis.Concurrency.isWebWorkers()) {
                this.redraw = this._webWorkerRedraw;
                this.initWebWorker();
            } else {
                this.redraw = this._localRedraw;
            }
        },
        setSelected: function (selected) {
            if (this._selected !== selected && this._map) {
                if (selected) {
                    this._selectedPath.addTo(this._map);
                } else {
                    this._map.removeLayer(this._selectedPath);
                }
            }
            this._selected = selected;
        },
        _fireMouseEvent: function (e) {
            if (!this.hasEventListeners(e.type)) { return; }

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
                L.DomUtil.addClass(this._canvas, 'leaflet-clickable');

                events = ['click', 'dblclick', 'mousedown', 'mouseover',
                    'mouseout', 'mousemove', 'contextmenu'];
                for (i = 0; i < events.length; i += 1) {
                    this._map.on(events[i], this._fireMouseEvent, this);
                }
            }
        },
        _deinitEvents: function () {
            var events = ['click', 'dblclick', 'mousedown', 'mouseover',
                'mouseout', 'mousemove', 'contextmenu'], i;
            for (i = 0; i < events.length; i += 1) {
                this._map.off(events[i], this._fireMouseEvent, this);
            }
        },
        onDelete: function () {
            this._deinitEvents();
        },
        onAdd: function (map) {
            this._map = map;
            map._initHeatMapRoot();

            this._canvas = this._canvas || document.createElement('canvas');
            this._map._heatMapRoot.appendChild(this._canvas);
            this._ctx = this._canvas.getContext('2d');

            this._initEvents();

            this.fire('add');
            L.DomUtil.addClass(this._canvas, this._leafletHeatMap);
            if (this.options.className) {
                L.DomUtil.addClass(this._canvas, this.options.className);
            }
            if (map.options.zoomAnimation && map.options.markerZoomAnimation) {
                L.DomUtil.addClass(this._canvas, 'leaflet-zoom-animated');
                map.on('zoomend', this._zoomEndHeatMap, this);
                map.on('zoomanim', this._animateZoomHeatmap, this);
            }
            map.on({
                'viewreset': this.resetForce,
                'moveend': this.reset,
                'move': this.stopDraw
            }, this);
            this._canvas.style.opacity = this.options.opacity;
            this._updateHeatMapViewport();
            this.redraw();
        },
        resetForce: function () {
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._redrawRequested = undefined;
            this._boundsProjected = undefined;
            this._updateHeatMapViewport();
            this.reset();
        },
        reset: function () {
            this._startPoint = undefined;
            this._endPoint = undefined;
            this.startDraw();
            this.redraw();
        },
        setOpacity: function (opacity, noRedraw) {
            if (isDefine(opacity)) {
                this.options.opacity = parseFloat(opacity);
                if (!noRedraw) {
                    this._canvas.style.opacity = this.options.opacity;
                    this.reset();
                }
            }
        },
        setBounds: function (bounds, noRedraw) {
            if (bounds) {
                this.options.bounds = L.latLngBounds(bounds);
                this.checkDiff();
                this._selectedPath.setLatLngs(this._pathPoints(this.options));
                if (!noRedraw) {
                    this.reset();
                }
            }
        },
        setPoints: function (points, noRedraw) {
            if (points) {
                this.options.points = points;
                if (this.options.points) {
                    this.findMax(this.options);
                }
                if (!noRedraw) {
                    this.reset();
                }
            }
        },
        setColors: function (colors, noRedraw) {
            if (colors) {
                this.options.colors = colors;
                this.findMax(this.options);
                this.parseColors(this.options);
                if (!noRedraw) {
                    this.reset();
                }
            }
        },

        addTo: function (map) {
            map.addLayer(this);
            return this;
        },

        onRemove: function (map) {
            this._worker._close();
            map._heatMapRoot.removeChild(this._canvas);

            // Need to fire remove event before we set _map to null as the event hooks might need the object
            this.fire('remove');
            this._map = null;

            map.off('zoomend', this._zoomEndHeatMap, this);
            map.off('zoomanim', this._animateZoomHeatmap, this);
            map.off({
                'viewreset': this.reset,
                'moveend': this.reset,
                'move': this.stopDraw
            }, this);
        },

        setStyle: function (style) {
            L.setOptions(this, style);

            return this;
        },
        drawPoint: function (x, y, color) {
            this._ctx.fillStyle = color;
            this._ctx.fillRect(x, y, 1, 1);
        },
        getInterpolatedValue: function (x, y, max, points) {
            var floorX,
                floorY,
                ceilY,
                ceilX,
                value,
                self = this;
            points = points || this.options.points;
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
            var value = this.getInterpolatedValue(x, y, this._max, this.options.points),
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
            return this.getInterpolatedValue(__ret.x, __ret.y, this._max, this.options.points);
        },
        getPixcelColorByCoord: function (coord) {
            var __ret = this.getXY(coord);
            return this.getPixcelColor(__ret.x, __ret.y);
        },
        setPixelColor: function (nextPoint, position, cWidth, height, myImageData) {
            var xReal = nextPoint.x, yReal = nextPoint.y, idx;
            if (xReal < cWidth && yReal < height) {
                idx = (xReal + yReal * cWidth) * 4;
                myImageData[idx] = nextPoint.z[0];
                myImageData[idx + 1] = nextPoint.z[1];
                myImageData[idx + 2] = nextPoint.z[2];
                myImageData[idx + 3] = nextPoint.z[3];
            }
        },
        _webWorkerRedraw: function () {
            var crs = this._map.options.crs,
                opt = L.extend({}, this.options),
                pBounds = this._map.getPixelBounds(),
                pOrigin = this._map.getPixelOrigin(),
                self = this;
            opt.canvas = undefined;
            opt.events = undefined;
            opt.bounds = [[opt.bounds.getNorthEast().lat, opt.bounds.getNorthEast().lng], [opt.bounds.getSouthWest().lat, opt.bounds.getSouthWest().lng]];
            opt.colors = opt.colors.map(function (val) {
                return {value: val.value, percent: val.percent, color: val.color.toRGBA()};
            });

            this._worker.calculate({
                type: 'calculate',
                pixelBounds: [pBounds.x, pBounds.y],
                heatMap: opt,
                projectionName: crs.code,
                projectionString: Gis.ProjectionDatuums.getDatum(crs.code),
                projectedBounds: crs.projectedBounds,
                options: L.extend({}, crs.options, {transformation: undefined}),
                pixelOrigin: [pOrigin.x, pOrigin.y]
            }).then(function (e) {
                var cWidth = self._canvas.width,
                    myImageData = self._ctx.getImageData(0, 0, cWidth, self._canvas.height);
                if (e.data) {
                    e.data.forEach(function (val, index) {
                        myImageData[index] = val;
                    });
                }
                self._ctx.putImageData(myImageData, 0, 0);
            }, function (e) {
                console.log(e);
            });
        },
        _localRedraw: function () {
            var startPoint2, endPoint2, currentX, currentY, position,
                myImageData, idx, pixcelColor, cWidth, xReal, yReal, needBreak, self = this,
                f = function () {
                    self.redraw();
                }, repaintPoints = this.options.maxPointsToCalculateOne, pointS = L.point(0, 0), coord, intersect, asOld;
            if (this._map && !this._noDraw) {
                this._startPoint = this._map.latLngToLayerPoint(this.options.bounds.getNorthWest()).add(this._map.getPixelOrigin());
                startPoint2 = this._map.latLngToLayerPoint(this.options.bounds.getSouthWest()).add(this._map.getPixelOrigin());
                this._endPoint = this._map.latLngToLayerPoint(this.options.bounds.getSouthEast()).add(this._map.getPixelOrigin());
                endPoint2 = this._map.latLngToLayerPoint(this.options.bounds.getNorthEast()).add(this._map.getPixelOrigin());
                this._startPoint.x = Math.min(this._startPoint.x, startPoint2.x);
                this._startPoint.y = Math.min(this._startPoint.y, endPoint2.y);
                this._endPoint.x = Math.max(this._endPoint.x, endPoint2.x);
                this._endPoint.y = Math.max(this._endPoint.y, startPoint2.y);
                intersect = this._map.getPixelBounds().getIntersect(L.bounds(this._startPoint, this._endPoint));
                if (!intersect) {
                    this._linePainted = undefined;
                    return;
                }
                if (!this._boundsProjected) {
                    this._linePainted = undefined;
                    this._updateHeatMapViewport();
                } else {
                    asOld = (this._boundsProjected.equals(intersect) || this._boundsProjected.contains(intersect));
                    if (asOld && !this._linePainted) {
                        return;
                    }
                    if (!asOld) {
                        this._linePainted = undefined;
                        this._redrawRequested = undefined;
                        this._updateHeatMapViewport();
                    }
                }
                this._boundsProjected = intersect;
                position = L.DomUtil.getPosition(this._canvas);
                this._startPoint = this._boundsProjected.min.subtract(this._map.getPixelOrigin());
                this._endPoint = this._boundsProjected.max.subtract(this._map.getPixelOrigin());

                this._startPoint.y = this._linePainted ? this._linePainted[1] : this._startPoint.y;
                cWidth = this._canvas.width;
                myImageData = (this._linePainted && this._redrawRequested) || this._ctx.getImageData(0, 0, cWidth, this._canvas.height);
                this._linePainted = undefined;
                this._redrawRequested = undefined;
                for (currentY = this._startPoint.y; currentY <= this._endPoint.y; currentY += 1) {
                    needBreak = false;
                    for (currentX = this._startPoint.x; currentX <= this._endPoint.x; currentX += 1) {
                        pointS.x = currentX;
                        pointS.y = currentY;
                        coord = this._map.layerPointToLatLng(pointS);
                        repaintPoints -= 1;
                        needBreak = repaintPoints < 0;
                        if (this.options.bounds.contains(coord)) {
                            xReal = currentX - position.x;
                            yReal = currentY - position.y;
                            idx = (xReal + yReal * cWidth) * 4;
                            pixcelColor = this.getPixcelColorByCoord(coord);
                            myImageData.data[idx] = pixcelColor[0];
                            myImageData.data[idx + 1] = pixcelColor[1];
                            myImageData.data[idx + 2] = pixcelColor[2];
                            myImageData.data[idx + 3] = pixcelColor[3];
                        }
                    }
                    if (needBreak) {
                        if (currentY < this._endPoint.y) {
                            this._linePainted = [currentX, currentY + 1];
                            this._redrawRequested = myImageData;
                            Gis.requestAnimationFrame(100)(f);
                        }
                        break;
                    }
                }
                this._ctx.putImageData(myImageData, 0, 0);
            }
            return this;
        },
        stopDraw: function () {
            this._noDraw = true;
        },
        _animateZoomHeatmap: function (e) {
            var scale = e.scale,
                offset = e.offset.multiplyBy(-scale)._add(this._heatMapViewport.min);

            this._canvas.style[L.DomUtil.TRANSFORM] =
                L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';
            this.stopDraw();
        },
        startDraw: function () {
            this._noDraw = false;
        },
        _zoomEndHeatMap: function () {
            this.startDraw();
            this._linePainted = undefined;
            this._boundsProjected = undefined;
            this.redraw();
        },
        _updateHeatMapViewport: function () {

            this.latlng = this._map.getBounds().getNorthWest();
            this._canvas.width = Math.min(this._map.getSize().x, document.body.clientWidth);
            this._canvas.height = Math.min(this._map.getSize().y, document.body.clientHeight);
            L.DomUtil.setPosition(this._canvas, this._map.latLngToLayerPoint(this.latlng));
            var size = this._map.getSize(),
                panePos = L.DomUtil.getPosition(this._map._mapPane),
                min = panePos.multiplyBy(-1),
                max = min.add(size._round());
            this._heatMapViewport = new L.Bounds(min, max);
        }
    });

    L.HeatMap.include(L.CaptionBehavior);
    L.HeatMap.include({
        getLabelLatLng: function () {
            return this.options.bounds.getCenter();
        }
    });
    L.HeatMap.include(L.PopupBehavior);
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
}(L));

