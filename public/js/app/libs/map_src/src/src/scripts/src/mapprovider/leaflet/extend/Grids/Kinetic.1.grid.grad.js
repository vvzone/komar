/**
 * Километровая сетка
 */
(function () {
    'use strict';
    var LONGITUDE_BASE_STEP = 30,
        maxLat,
        minLat;

    L.GradGrid = L.Grid.extend({
        includes: [L.Mixin.Events],
        _checkPoint: function (geoBounds, step, min, max, latNull) {
            var latLng = this._map.layerPointToLatLng(geoBounds.getCenter()).wrap(),
                distanceTo = this._map.latLngToLayerPoint(latLng).distanceTo(this._map.latLngToLayerPoint(L.latLng(latLng.lat, latLng.lng + step)));
            if (distanceTo >= min && distanceTo <= max) {
                return {
                    original: L.latLng(step, step),
                    step: L.latLng(latNull ? 0 : step, step)
                };
            }
        },
        calculateLatLngStep: function (geoBounds) {
            var steps = Gis.config('grid.grid_steps_nomen', L.Grid.DEFAULT_GRID_STEPS_GRAD),
                i,
                len,
                max = document.body.offsetWidth / 3,
                checked,
                min = 100;
            if (!geoBounds) {
                return;
            }
            for (i = steps.length - 1; i >= 0; i -= 1) {
                if (i === 0) {
                    min = 30;
                }
                checked = this._checkPoint(geoBounds, steps[i], min, max);
                if (checked) {
                    return checked;
                }
            }
            return this._checkPoint(geoBounds, steps[0], min, document.body.offsetWidth / 2.5);
        },
        drawText: function (base, startPointCurrent, toLeft, vertical, under) {
            var t1, t2;
            t1 = this._getFreeText();
            t1.position({x: startPointCurrent.x, y: startPointCurrent.y});
            t1.text(Math.abs(base));
            t1.fontSize(11);
            var offset = L.Grid.OFFSET - 2;
            t1.offsetY((vertical && toLeft) ? offset : -2);
            t1.offsetX((toLeft && !vertical) ? offset : -2);
            if(!vertical) {
                t1.offsetY(t1.getHeight());
            } else {
                t1.offsetX(t1.getWidth() / 2);
            }
            t2 = this._getFreeText();
            t2.text(under);
            t2.fontSize(11);
            t2.fill('#CCCCCC');
            t2.offset(t1.offset());
            if (!vertical) {
                t2.position({x: t1.x(), y: t1.y() + t1.height() + 2});
            } else {
                t2.position({x: t1.x() + t1.width() + 2, y: t1.y()});
            }
        },
        /**
         *
         * @param end
         * @param [buY]
         * @returns Array.<Array.<number>
         * @private
         * @param pointStart
         * @param pointEnd
         * @param step
         * @param PROJ
         */
        _calculatePoints: function (end, pointStart, pointEnd, step, buY, mapPxBounds) {
            var points = [], p, p1, i, segment, result = [];
            if (buY) {
                p1 =  this.fromGeoToPx(L.latLng(pointStart.lat, pointStart.lng));
                var endPoint = (pointEnd.lat + step.lat * 0.00001);
                for (i = pointStart.lat + step.lat; i < endPoint; i += step.lat) {
                    if (i < endPoint && step.lat + i > endPoint) {
                        i = pointEnd.lat;
                    }
                    p =  this.fromGeoToPx(L.latLng(i, pointStart.lng));
                    segment = L.LineUtil.clipSegment(p1, p, mapPxBounds);
                    if (!segment) {
                        if (points.length) {
                            result.push(points);
                            points = [];
                        }
                        p1 = p;
                        continue;
                    }
                    points.push(segment[0].x);
                    points.push(segment[0].y);
                    if ((segment[1] !== p) || i + step.lat > pointEnd.lat ) {
                        points.push(segment[1].x);
                        points.push(segment[1].y);
                        p1 = p;
                    } else {
                        p1 = segment[1];
                    }
                    p = segment[0];
                }
            } else {
                p1 =  this.fromGeoToPx(L.latLng(pointStart.lat, pointStart.lng));
                for (i = pointStart.lng + step.lng; i <= pointEnd.lng; i += step.lng) {
                    p =  this.fromGeoToPx(L.latLng(pointStart.lat, i));
                    segment = L.LineUtil.clipSegment(p1, p, mapPxBounds);
                    if (!segment) {
                        if (points.length) {
                            result.push(points);
                            points = [];
                        }
                        p1 = p;
                        continue;
                    }
                    points.push(segment[0].x);
                    points.push(segment[0].y);
                    if ((segment[1] !== p)) {
                        points.push(segment[1].x);
                        points.push(segment[1].y);
                        p1 = p;
                    } else {
                        p1 = segment[1];
                    }
                    p = segment[0];
                }
            }
            if (points.length) {
                result.push(points);
            }
            return result;
        },
        _getBounds: function (bounds, step, noWrapped) {
            var intersect = bounds,
                point,
                point2;
            if (!bounds) {
                var b = this._map.getPixelBounds();
                b.min._subtract(this._map.getPixelOrigin());
                b.max._subtract(this._map.getPixelOrigin());
                var pixelCrop = this._map.getPixelCrop();
                if (pixelCrop) {
                    b = b.getIntersect(pixelCrop);
                    if (!b) {
                        return;
                    }
                }
                point = this._map.layerPointToLatLng(b.min);
                point2 = this._map.layerPointToLatLng(b.max);
                intersect = L.latLngBounds(
                    point,
                    point2
                );
                point = this._map.layerPointToLatLng(L.point(b.min.x, b.max.y));
                intersect.extend(point);
                point = this._map.layerPointToLatLng(L.point(b.max.x, b.min.y));
                intersect.extend(point);
                point = this._map.layerPointToLatLng(L.point(b.min.x + (b.max.x - b.min.x) / 2, b.max.y));
                intersect.extend(point);
                point = this._map.layerPointToLatLng(L.point(b.min.x + (b.max.x - b.min.x) / 2, b.min.y));
                intersect.extend(point);
                var lat = step ? step.lat : 1;
                var lng = step ? step.lng : 1;
                lat = lat ? lat : lng;
                if (!noWrapped) {
                    intersect._southWest.lat = Math.ceil(intersect._southWest.lat / lat) * lat;
                    intersect._southWest.lng = Math.floor(intersect._southWest.lng / lng) * lng;
                    intersect._northEast.lat = Math.floor(intersect._northEast.lat / lat) * lat;
                    intersect._northEast.lng = Math.ceil(intersect._northEast.lng / lng) * lng;
                }
            }
            return intersect;
        },
        getViewPort: function () {

        },
        fromGeoToPx: function (latLng) {
            return this._map.latLngToLayerPoint(latLng)._subtract(this._map._kineticViewport.min);
        },
        _zoneIndex: function (lanlng) {
            return Math.ceil((lanlng.lng + 180) % 360 / 6);
        },
        _zoneLongitude: function (lanlng) {
            return this._zoneIndex(lanlng) * LONGITUDE_BASE_STEP - 180;
        },
        getLatLngDelta: function (lanlng, step, perLine) {
            return L.latLng(Math.ceil(lanlng.lat / (step.lat * perLine)) * step.lat * perLine - lanlng.lat,  lanlng.lng - Math.floor(lanlng.lng / (step.lng * perLine)) * step.lng * perLine);
        },
        drawMeridians: function (geoBounds, step, stepMultiple, mapPxBounds, sourceStep, textForDraw) {
            var k, j, z, coord, coordStop, startPointCurrent, stopPoint, calculatePoints, line, conains2, point, mapPxBoundsForText, under;
            mapPxBoundsForText = this.getVerticalBounds(mapPxBounds);
            for (k = geoBounds.getNorthWest().lng; k <= geoBounds.getNorthEast().lng; k += step.lng) {
                coord = L.latLng(minLat, k);
                coordStop = L.latLng(maxLat, k);
                startPointCurrent = this.fromGeoToPx(coord);
                stopPoint = this.fromGeoToPx(coordStop);
                calculatePoints = this._calculatePoints(stopPoint, coord, coordStop, stepMultiple, true, mapPxBounds);
                if (calculatePoints.length) {
                    for (z = 0; z < calculatePoints.length; z += 1) {
                        line = this._getFreeLine();
                        line.points(calculatePoints[z]);
                    }
                    point = L.point(calculatePoints[0][0], calculatePoints[0][1]);
                    conains2 = mapPxBoundsForText[1].contains(point);
                    under = k > 0 ? 'В' : (k ? 'З' : '');
                    if (mapPxBoundsForText[0].contains(point) || conains2) {
                        textForDraw.push({
                            base: k,
                            under: under,
                            startPointCurrent: point,
                            toLeft: !conains2,
                            vertical: true
                        });
                    }
                    var calculatePoint = calculatePoints[calculatePoints.length - 1];
                    point = L.point(calculatePoint[calculatePoint.length - 2], calculatePoint[calculatePoint.length - 1]);
                    conains2 = mapPxBoundsForText[1].contains(point);
                    if (mapPxBoundsForText[0].contains(point) || conains2) {
                        textForDraw.push({
                            base: k,
                            under: under,
                            startPointCurrent: point,
                            toLeft: !conains2,
                            vertical: true
                        });
                    }
                }
            }
        },
        drawLines: function () {
            var step,
                textForDraw = [],
                line,
                startPointCurrent,
                stopPoint,
                coord,
                coordStop,
                geoBounds,
                /**
                 * Не округленные, для линий
                 */
                geoBounds2,
                mapPxBounds,
                calculatePoints,
                stepMultiple,
                z,
                len,
                i,
                mapPxBoundsForText,
                point,
                contains2,
                under;
            var pixelBounds = this._map.getPixelBounds();
            var pixelCrop = this._map.getPixelCrop();
            if (pixelCrop) {
                pixelBounds.min._subtract(this._map.getPixelOrigin());
                pixelBounds.max._subtract(this._map.getPixelOrigin());
                pixelBounds = pixelBounds.getIntersect(pixelCrop);
            }
            step = this.calculateLatLngStep(pixelBounds);
            geoBounds = step && this._getBounds(null, step.original);
            if (!step || !geoBounds) {
                this._layer.hide();
                return;
            } else {
                this._layer.show();
            }
            stepMultiple = step.original;
            step = step.step;
            mapPxBounds = L.bounds(L.point(L.Grid.OFFSET_TEXT_LEFT, L.Grid.OFFSET_TEXT_TOP), L.point(document.body.clientWidth - L.Grid.OFFSET_TEXT_RIGHT, document.body.clientHeight - L.Grid.OFFSET_TEXT_BOTTOM));
            if (pixelCrop) {
                pixelCrop.min._subtract(this._map._kineticViewport.min);
                pixelCrop.max._subtract(this._map._kineticViewport.min);
                mapPxBounds = mapPxBounds.getIntersect(pixelCrop);
            }
            this._drawWhite(mapPxBounds);
            mapPxBounds.min._add(L.point(L.Grid.OFFSET, L.Grid.OFFSET));
            mapPxBounds.max._subtract(L.point(L.Grid.OFFSET, L.Grid.OFFSET));
            geoBounds2 = step && this._getBounds(null, step.original, true);
            maxLat = geoBounds2.getNorthWest().lat;
            minLat = geoBounds2.getSouthEast().lat;
            var startLat = geoBounds.getSouthWest().lat - step.lat;
            var endLat = geoBounds.getNorthWest().lat + step.lat*2;

            if (step.lat) {
                mapPxBoundsForText = this.getHorisontalBounds(mapPxBounds);
                for (i = startLat; i <= endLat; i += step.lat) {
                    coord = L.latLng(i, geoBounds.getNorthWest().lng);
                    coordStop = L.latLng(i, geoBounds.getNorthEast().lng);
                    startPointCurrent = this.fromGeoToPx(coord);
                    stopPoint = this.fromGeoToPx(coordStop);
                    calculatePoints = this._calculatePoints(stopPoint, coord, coordStop, stepMultiple, null, mapPxBounds);
                    if (calculatePoints.length) {
                        for (z = 0; z < calculatePoints.length; z += 1) {
                            line = this._getFreeLine();
                            line.points(calculatePoints[z]);
                        }

                        point = L.point(calculatePoints[0][0], calculatePoints[0][1]);
                        contains2 = mapPxBoundsForText[1].contains(point);
                        under = i > 0 ? 'С' : (i ? 'Ю' : '');
                        if (mapPxBoundsForText[0].contains(point) || contains2) {
                            textForDraw.push({
                                base: i,
                                under: under,
                                startPointCurrent: point,
                                toLeft: !contains2,
                                vertical: false
                            });
                        }
                        var calculatePoint = calculatePoints[calculatePoints.length - 1];
                        point = L.point(calculatePoint[calculatePoint.length - 2], calculatePoint[calculatePoint.length - 1]);
                        contains2 = mapPxBoundsForText[1].contains(point);
                        if (mapPxBoundsForText[0].contains(point) || contains2) {
                            textForDraw.push({
                                base: i,
                                under: under,
                                startPointCurrent: point,
                                toLeft: !contains2,
                                vertical: false
                            });
                        }
                    }
                }
            }
            if (startLat < endLat) {
                mapPxBounds = L.bounds(L.point(L.Grid.OFFSET_TEXT_LEFT, L.Grid.OFFSET_TEXT_TOP), L.point(document.body.clientWidth - L.Grid.OFFSET_TEXT_RIGHT, document.body.clientHeight - L.Grid.OFFSET_TEXT_BOTTOM));
                if (pixelCrop) {
                    mapPxBounds = mapPxBounds.getIntersect(pixelCrop);
                }
                mapPxBounds.min._add(L.point(L.Grid.OFFSET, L.Grid.OFFSET));
                mapPxBounds.max._subtract(L.point(L.Grid.OFFSET, L.Grid.OFFSET));
                this.drawMeridians(L.latLngBounds(
                    L.latLng(startLat, geoBounds.getNorthWest().lng),
                    L.latLng(endLat, geoBounds.getNorthEast().lng)
                ), step, stepMultiple, mapPxBounds, step, textForDraw);
            }

            for (i = 0, len = textForDraw.length; i < len; i += 1) {
                line = textForDraw[i];
                this.drawText(line.base, line.startPointCurrent, line.toLeft, line.vertical, line.under);
            }
            this._clearTextFrom();
            this._clearLinesFrom();
        },
        drawHeaders: function () {
        }
    });
    Gis.Map._GRID_TYPES_[Gis.Map.GRID_TYPES.GRAD] = L.GradGrid;
}());
