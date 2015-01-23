/**
 * Километровая сетка
 */
(function () {
    'use strict';

    function calculateZone(latLng) {
        return Gis.Util.getZoneFromLongitude(latLng.lng);
    }

    function prefix(number) {
        return (number >= 10 ? number : ('0' + number));
    }


    L.KilometrGrid = L.Grid.extend({
        includes: [L.Mixin.Events],
        _checkPoint: function (PROJ, geoBounds, step, min, max) {
            var center = geoBounds.getCenter();
            var m = this.fromGeoToPx(PROJ, [center.x, center.y]),
                m2 = this.fromGeoToPx(PROJ, [center.x + step * 1000, center.y]),
                distanceTo = m2.distanceTo(m);
            if (distanceTo >= min && distanceTo <= max) {
                return L.point(step * 1000, step * 1000);
            }
        },
        calculateLatLngStep: function (PROJ, geoBounds) {
            var steps = Gis.config('grid.grid_steps', L.Grid.DEFAULT_GRID_STEPS),
                i,
                len,
                max = document.body.offsetWidth / 3,
                checked,
                min = 100;
            for (i = 0, len = steps.length; i < len; i += 1) {
                if (i === len - 1) {
                    min = 50;
                }
                checked = this._checkPoint(PROJ, geoBounds, steps[i], min, max);
                if (checked) {
                    return checked;
                }
            }
            return this._checkPoint(PROJ, geoBounds, steps[0], min, document.body.offsetWidth / 2.5);
        },
        drawText: function (base, distance, drawSmall, startPointCurrent, toLeft, vertical) {
            var offset, t1, t2, TEXT_PADDING = 2, MARGING_SMALL_TEXT = 3, verticalOffset = (vertical && !toLeft) ? 0 : L.Grid.FONT_SIZE + TEXT_PADDING;
            if (drawSmall) {
                t1 = this._getFreeText();
                t1.position({x: startPointCurrent.x, y: startPointCurrent.y - verticalOffset});
                t1.fontSize(11);
                t1.offsetY(vertical && !toLeft ? -2 : 0);
                t1.text(base);
                offset = {x: vertical ? -t1.width() - MARGING_SMALL_TEXT : 0, y: !vertical ? t1.height() + MARGING_SMALL_TEXT * 4 : 0};
            } else {
                offset = {x: 0, y: 0};
            }
            t2 = this._getFreeText();
            t2.offsetY(vertical && !toLeft ? -2 : 0);
            t2.fontSize(L.Grid.FONT_SIZE);
            t2.position({x: startPointCurrent.x + offset.x, y: startPointCurrent.y - verticalOffset + offset.y});
            t2.text(prefix(distance - base * 100));
            if (toLeft || vertical) {
                if (t1) {
                    t1.x((t1.x() - t1.width() - TEXT_PADDING * 2 - MARGING_SMALL_TEXT) - (vertical ? 0 : 0));
                }
                t2.x(t2.x() - (vertical ? -MARGING_SMALL_TEXT : (t2.width())) - TEXT_PADDING * 2 - offset.x);
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
        _calculatePoints: function (PROJ, end, pointStart, pointEnd, step, buY, mapPxBounds) {
            var points = [], p, p1, i, segment;
            if (buY) {
                p1 =  this.fromGeoToPx(PROJ, [pointStart[0], pointStart[1]]);
                for (i = pointStart[0] + step.x; i <= pointEnd[0] + step.x * 2; i += step.x) {
                    p =  this.fromGeoToPx(PROJ, [i, pointStart[1]]);
                    segment = L.LineUtil.clipSegment(p1, p, mapPxBounds);
                    if (!segment) {
                        continue;
                    }
                    points.push(segment[0].x);
                    points.push(segment[0].y);
                    if ((segment[1] !== p)) {
                        points.push(segment[1].x);
                        points.push(segment[1].y);
                    }
                    p1 = p;
                    p = segment[0];
                }
            } else {
                p1 =  this.fromGeoToPx(PROJ, [pointStart[0], pointStart[1]]);
                for (i = pointStart[1] - step.y; i >= pointEnd[1] - step.y * 2; i -= step.y) {
                    p =  this.fromGeoToPx(PROJ, [pointStart[0], i]);
                    segment = L.LineUtil.clipSegment(p1, p, mapPxBounds);
                    if (!segment) {
                        continue;
                    }
                    points.push(segment[0].x);
                    points.push(segment[0].y);
                    if ((segment[1] !== p)) {
                        points.push(segment[1].x);
                        points.push(segment[1].y);
                    }
                    p1 = p;
                    p = segment[0];
                }
            }
            return points;
        },
        fromGeoToPx: function (PROJ, gausCoord) {
            var latLng = PROJ.inverse(gausCoord);
            latLng = L.latLng(latLng[1], latLng[0]);
            return this._map.latLngToLayerPoint(latLng)._subtract(this._map._kineticViewport.min);
        },
        _getBounds: function (PROJ, bounds, step) {
            var intersect,
                point,
                point2;
            if (!bounds) {
                var b = this._map.getPixelBounds();
                b.min._subtract(this._map.getPixelOrigin());
                b.max._subtract(this._map.getPixelOrigin());
                var pixelCrop = this._map.getPixelCrop();
                if (pixelCrop) {
                    b = b.getIntersect(pixelCrop);
                }
                point = this._map.layerPointToLatLng(b.min);
                point2 = this._map.layerPointToLatLng(b.max);
                intersect = L.bounds(
                    PROJ.forward([point.lng, point.lat]),
                    PROJ.forward([point2.lng, point2.lat])
                );
                point = this._map.layerPointToLatLng(L.point(b.min.x, b.max.y));
                intersect.extend(PROJ.forward([point.lng, point.lat]));
                point = this._map.layerPointToLatLng(L.point(b.max.x, b.min.y));
                intersect.extend(PROJ.forward([point.lng, point.lat]));
                var x = step ? step.x : 1000;
                var y = step ? step.y : 1000;
                intersect.min.x = Math.floor(intersect.min.x / x) * x;
                intersect.min.y = Math.floor(intersect.min.y / y) * y;
                intersect.max.x = Math.ceil(intersect.max.x / x) * x;
                intersect.max.y = Math.ceil(intersect.max.y / y) * y;
                return intersect;
            }
            intersect = L.bounds(
                PROJ.forward([bounds.getSouthWest().lng, bounds.getSouthWest().lat]),
                PROJ.forward([bounds.getNorthEast().lng, bounds.getNorthEast().lat])
            );
            intersect.extend(PROJ.forward([bounds.getNorthWest().lng, bounds.getNorthWest().lat]));
            intersect.extend(PROJ.forward([bounds.getSouthEast().lng, bounds.getSouthEast().lat]));
            return intersect;
        },
        getViewPort: function () {

        },
        drawLines: function () {
            var line,
                i,
                k,
                step,
                startPointCurrent,
                point,
                stopPoint,
                gausCoord,
                gaussCoordStop,
                distanceOld,
                distance = NaN,
                zone = calculateZone(this._map.getCenter()),
                oldBase = [],
                distanceBig,
                drawSmall = [],
                base = NaN,
                geoBounds,
                len,
                PROJ = proj4('EPSG:284' + prefix(zone)),
                mapPxBounds,
                mapPxBoundsForText,
                textForDraw = [],
                calculatePoints;
            geoBounds = this._getBounds(PROJ);
            step = this.calculateLatLngStep(PROJ, geoBounds);
            geoBounds = this._getBounds(PROJ, null, step);
            if (!step) {
                this._layer.hide();
                return;
            } else {
                this._layer.show();
            }
            this._drawWhite();
            mapPxBounds = L.bounds(L.point(L.Grid.OFFSET_TEXT_LEFT + L.Grid.OFFSET, L.Grid.OFFSET_TEXT_TOP), L.point(document.body.clientWidth - L.Grid.OFFSET_TEXT_RIGHT - L.Grid.OFFSET, document.body.clientHeight - L.Grid.OFFSET_TEXT_BOTTOM));
            mapPxBoundsForText = this.getVerticalBounds();
            var stepMultiple = step.multiplyBy(3);
            for (i = geoBounds.min.x; i <= geoBounds.max.x; i += step.x) {
                gausCoord = [i, geoBounds.max.y];
                gaussCoordStop = [i, geoBounds.min.y];
                startPointCurrent = this.fromGeoToPx(PROJ, gausCoord);
                stopPoint = this.fromGeoToPx(PROJ, gaussCoordStop);
                calculatePoints = this._calculatePoints(PROJ, stopPoint, gausCoord, gaussCoordStop, stepMultiple, null, mapPxBounds);
                if (calculatePoints.length) {
                    line = this._getFreeLine();
                    line.points(calculatePoints);
                    base = Math.floor(gausCoord[0] / 100000);
                    point = L.point(calculatePoints[0], calculatePoints[1]);
                    if (mapPxBoundsForText[0].contains(point) || mapPxBoundsForText[1].contains(point)) {
                        textForDraw.push({
                            base: base,
                            distance: Math.floor(gausCoord[0] / 1000),
                            drawSmall: base !== oldBase[0],
                            startPointCurrent: point,
                            toLeft: false,
                            vertical: true
                        });
                        oldBase[0] = base;
                    }
                    point = L.point(calculatePoints[calculatePoints.length - 2], calculatePoints[calculatePoints.length - 1]);
                    if (mapPxBoundsForText[0].contains(point) || mapPxBoundsForText[1].contains(point)) {
                        textForDraw.push({
                            base: base,
                            distance: Math.floor(gausCoord[0] / 1000),
                            drawSmall: base !== oldBase[1],
                            startPointCurrent: L.point(calculatePoints[calculatePoints.length - 2], calculatePoints[calculatePoints.length - 1]),
                            toLeft: true,
                            vertical: true
                        });
                        oldBase[1] = base;
                    }
                }
            }
            oldBase = [];
            drawSmall = [true, true];
            mapPxBounds = L.bounds(L.point(L.Grid.OFFSET_TEXT_LEFT, L.Grid.OFFSET_TEXT_TOP + L.Grid.OFFSET), L.point(document.body.clientWidth - L.Grid.OFFSET_TEXT_RIGHT, document.body.clientHeight - L.Grid.OFFSET_TEXT_BOTTOM - L.Grid.OFFSET));
            mapPxBoundsForText = this.getHorisontalBounds();
            for (k =  geoBounds.max.y; k >= geoBounds.min.y; k -= step.y) {
                gausCoord = [geoBounds.min.x, k];
                gaussCoordStop = [geoBounds.max.x, k];
                startPointCurrent = this.fromGeoToPx(PROJ, gausCoord);
                stopPoint = this.fromGeoToPx(PROJ, gaussCoordStop);
                distanceOld = distance;
                distance = Math.floor(gausCoord[1] / 1000);

                calculatePoints = this._calculatePoints(PROJ, stopPoint, gausCoord, gaussCoordStop, stepMultiple, true, mapPxBounds);
                if (calculatePoints.length) {
                    line = this._getFreeLine();
                    line.points(calculatePoints);

                    if (distanceOld) {
                        base = Math.floor(distance / 100);
                        point = L.point(calculatePoints[0], calculatePoints[1]);
                        distanceBig = Math.abs(Math.floor(distanceOld / 100) - base) >= 1;
                        if (mapPxBoundsForText[0].contains(point) || mapPxBoundsForText[1].contains(point)) {
                            textForDraw.push({
                                base: base,
                                distance: distance,
                                drawSmall: drawSmall[0] || distanceBig,
                                startPointCurrent: point
                            });
                            drawSmall[0] = false;
                        }
                        point = L.point(calculatePoints[calculatePoints.length - 2], calculatePoints[calculatePoints.length - 1]);
                        if (mapPxBoundsForText[0].contains(point) || mapPxBoundsForText[1].contains(point)) {
                            textForDraw.push({
                                base: base,
                                distance: distance,
                                drawSmall: drawSmall[1] || distanceBig,
                                startPointCurrent: point,
                                toLeft: true
                            });
                            drawSmall[1] = false;
                        }
                    }
                }
            }
            for (i = 0, len = textForDraw.length; i < len; i += 1) {
                line = textForDraw[i];
                this.drawText(line.base, line.distance, line.drawSmall, line.startPointCurrent, line.toLeft, line.vertical);
            }

            this._clearTextFrom();
            this._clearLinesFrom();
        },
        drawHeaders: function () {
        }
    });
    Gis.Map._GRID_TYPES_[Gis.Map.GRID_TYPES.KILOMETR] = L.KilometrGrid;
}());
