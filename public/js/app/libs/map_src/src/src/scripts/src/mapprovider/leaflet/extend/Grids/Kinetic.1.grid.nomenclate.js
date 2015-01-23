/**
 * Километровая сетка
 */
(function () {
    'use strict';
    var LAT = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        SUFFIXES_500000,
        SUFFIXES_200000 = {COEFF_QUATTRO: 1, NAME_FUNC: function (X, Y, double, quattro) {
            if (quattro) {
                return this[X + ',' + Y] + ',' + this[(X + 1) + ',' + Y] + ',' + this[(X + 2) + ',' + Y];
            }
            if (double) {
                return this[X + ',' + Y] + ',' + this[(X + 1) + ',' + Y];
            }
            return this[X + ',' + Y];
        }},
        SUFFIXES_100000 = {},
        SUFFIXES_50000 = {},
        DOUBLE_ZONE_LATITUDE = 60,
        QUATTRO_ZONE_LATITUDE = 76,
        SECTOR_ZONE_LATITUDE = 88,
        fillSuffixes,
        TEXT_BG_COLOR = 'rgba(255, 255, 255, 0.7)';
    var NAME_FUNC = function (X, Y, double, quattro) {
        if (double) {
            return this[X + ',' + Y] + ',' + this[(X + 1) + ',' + Y];
        } else {
            return this[X + ',' + Y];
        }
    };
    SUFFIXES_500000 = {
        DOUBLE: true,
        COEFF_QUATTRO: 2,
        NAME_FUNC: NAME_FUNC,
        '0,0': 'А',
        '1,0': 'Б',
        '0,1': 'В',
        '1,1': 'Г'
    };
    fillSuffixes = function (SUFFIXES, count, func) {
        if (!SUFFIXES.COEFF_QUATTRO) {
            SUFFIXES.COEFF_QUATTRO = 2;
        }
        if (!SUFFIXES.NAME_FUNC) {
            SUFFIXES.NAME_FUNC = NAME_FUNC;
        }
        func = func || function (index) {
            return index + 1;
        }
        for(var d = 0; d < count; d += 1) {
            for(var v = 0; v < count; v += 1) {
                SUFFIXES[v + ',' + d] = func(d * count + v, v, d);
            }
        }
    };
    function prefix(number) {
        return number >= 100 ? number :
            (number >= 10 ? ('0' + number) : ('00' + number));
    }
    fillSuffixes(SUFFIXES_200000, L.Grid.STEP_200_000);
    fillSuffixes(SUFFIXES_100000, L.Grid.STEP_100_000, function (index) {
        return prefix(index + 1);
    });
    fillSuffixes(SUFFIXES_50000, L.Grid.STEP_50_000, function (index, x, y) {
        return SUFFIXES_500000[(x % 2) + ',' + (y % 2)];
    });

    L.NomenclateGrid = L.Grid.extend({
        includes: [L.Mixin.Events],
        _checkPoint: function (geoBounds, step, min, max, latNull) {
            var latLng = this._map.layerPointToLatLng(geoBounds.getCenter()).wrap(),
                distanceTo = this._map.latLngToLayerPoint(latLng).distanceTo(this._map.latLngToLayerPoint(L.latLng(latLng.lat, latLng.lng + 6 / step)));
            if (distanceTo >= min && distanceTo <= max) {
                return {
                    original: L.latLng(4 /step, 6 / step),
                    step: L.latLng(latNull ? 0 : 4 /step, 6 / step)
                };
            }
        },
        calculateLatLngStep: function (geoBounds) {
            var steps = Gis.config('grid.grid_steps_nomen', L.Grid.DEFAULT_GRID_STEPS_NOMEN),
                i,
                len,
                max = document.body.offsetWidth / 3,
                checked,
                min = 100,
                last;
            for (i = 0, len = steps.length; i < len; i += 1) {
                last = i === len - 1;
                if (last) {
                    min = 30;
                }
                checked = this._checkPoint(geoBounds, steps[i], min, max, last);
                if (checked) {
                    return checked;
                }
            }
            return this._checkPoint(geoBounds, steps[0], min, document.body.offsetWidth / 2.5);
        },
        drawText: function (base, startPointCurrent) {
            var t1, r1, padding = 2;
            r1 = this._getFreeRect(undefined, this._groupLines);
            t1 = this._getFreeText();
            t1.fontSize(12);
            t1.fill('black');
            t1.shadowColor('white');
            r1.fill(TEXT_BG_COLOR);
            t1.position({x: startPointCurrent.x, y: startPointCurrent.y});
            r1.position({x: startPointCurrent.x - padding, y: startPointCurrent.y - padding});
            t1.text(base);
            t1.offsetX(t1.width() / 2);
            r1.offsetX(t1.width() / 2);
            r1.width(t1.width() + padding * 2);
            r1.height(t1.height() + padding * 2);
            r1.cornerRadius(padding);
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
                for (i = pointStart.lat + step.lat; i < (pointEnd.lat + step.lat * 0.00001); i += step.lat) {
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
                    }
                    p1 = segment[1];
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
                    }
                    p1 = segment[1];
                    p = segment[0];
                }
            }
            if (points.length) {
                result.push(points);
            }
            return result;
        },
        _getBounds: function (bounds, step) {
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
                intersect._southWest.lat = Math.floor(intersect._southWest.lat / lat) * lat;
                intersect._southWest.lng = Math.floor(intersect._southWest.lng / lng) * lng;
                intersect._northEast.lat = Math.ceil(intersect._northEast.lat / lat) * lat;
                intersect._northEast.lng = Math.ceil(intersect._northEast.lng / lng) * lng;
            }
//            if (maxBounds) {
//                intersect = intersect.getIntersect(maxBounds);
//            }
            return intersect;
        },
        getViewPort: function () {

        },
        fromGeoToPx: function (latLng) {
            return this._map.latLngToLayerPoint(latLng)._subtract(this._map._kineticViewport.min);
        },
        getZoneName: function (zoneStartLatLng, step) {
            var south = (zoneStartLatLng.lat < 0 ? ' (Ю. П.)' : '');
            if (step.lng === 6) {
                return this._getMillionName(zoneStartLatLng.wrap(), true, true) + south;
            }
            if (step.lng === (6 / L.Grid.STEP_500_000)) {
                return this._get500000Name(zoneStartLatLng.wrap(), step) + south;
            }
            if (step.lng === (6 / L.Grid.STEP_200_000)) {
                return this._get200000Name(zoneStartLatLng.wrap(), step) + south;
            }
            if (step.lng === (6 / L.Grid.STEP_100_000)) {
                return this._get100000Name(zoneStartLatLng.wrap(), step) + south;
            }
            if (step.lng === (6 / L.Grid.STEP_50_000)) {
                return this._get50000Name(zoneStartLatLng.wrap(), step) + south;
            }
            return this._getMillionName(zoneStartLatLng.wrap(), true, true) + south;
        },
        _zoneIndex: function (lanlng) {
            return Math.ceil((lanlng.lng + 180) % 360 / 6);
        },
        _zoneLongitude: function (lanlng) {
            return this._zoneIndex(lanlng) * 6 - 180;
        },
        _getMillionName: function (lanlng, double, quattro) {
            var absLat = Math.abs(lanlng.lat);
            var name = LAT[Math.floor(absLat / 4)],
                index = this._zoneIndex(lanlng);
            if (double && quattro && absLat > SECTOR_ZONE_LATITUDE) {
                return name;
            }
            name += '-' + index;
            if (double && absLat > DOUBLE_ZONE_LATITUDE) {
                name += ',' + (index + 1);
                if (quattro && absLat > QUATTRO_ZONE_LATITUDE) {
                    name += ',' + (index + 2) + ',' + (index + 3);
                }
            }
            return name;
        },
        getLatLngDelta: function (lanlng, step, perLine) {
            var lat = Math.abs(lanlng.lat),
                isMirror = lanlng.lat < 0,
                coefficient = isMirror ? -1 : 1;
            return L.latLng(Math.abs(coefficient * Math.ceil(lat / (step.lat * perLine)) * step.lat * perLine - coefficient * lat),  lanlng.lng - Math.floor(lanlng.lng / (step.lng * perLine)) * step.lng * perLine);
        },
        _getName: function (lanlng, step, suffixes, perLine, noDouble) {
            return this._getMillionName(lanlng, suffixes.DOUBLE && lanlng.lat > QUATTRO_ZONE_LATITUDE, suffixes.QUATTRO) + '-' + this._realName(lanlng, step, suffixes, perLine, noDouble);
        },
        _realName: function (lanlng, step, suffixes, perLine, noDouble) {
            var name = '',
                delta = this.getLatLngDelta(lanlng, step, perLine),
                double = Math.abs(lanlng.lat) > DOUBLE_ZONE_LATITUDE && !noDouble,
                quattro = Math.abs(lanlng.lat) > QUATTRO_ZONE_LATITUDE && !noDouble;
            var Y = Math.floor(delta.lat / step.lat);
            var X = Math.floor(delta.lng / (step.lng * (quattro ? suffixes.COEFF_QUATTRO : 1)));
            name += suffixes.NAME_FUNC(X, Y, double, quattro);
            return name;
        },
        _get500000Name: function (lanlng, step) {
            return this._getName(lanlng, step, SUFFIXES_500000, L.Grid.STEP_500_000);
        },
        _get200000Name: function (lanlng, step) {
            return this._getName(lanlng, step, SUFFIXES_200000, L.Grid.STEP_200_000);
        },
        _get100000Name: function (lanlng, step, noDouble) {
            return this._getName(lanlng, step, SUFFIXES_100000, L.Grid.STEP_100_000, noDouble);
        },
        _get50000Name: function (lanlng, step) {
            return this._get100000Name(lanlng, L.latLng(step.lat * 2, step.lng * 2), true) + '-' + this._realName(lanlng, step, SUFFIXES_50000, L.Grid.STEP_50_000);
        },
        drawMeridians: function (geoBounds, step, stepMultiple, mapPxBounds, sourceStep) {
            var k, j, z, drawedTex = {}, coord, coordStop, startPointCurrent, stopPoint, calculatePoints, line, latLngCenter = L.latLng(0, 0), fromGeoToPx, endLat = (geoBounds.getNorthWest().lat + (step.lat ? 0 : 4));
            for (k = geoBounds.getNorthWest().lng; k <= geoBounds.getNorthEast().lng; k += step.lng) {
                coord = L.latLng(geoBounds.getSouthWest().lat, k);
                coordStop = L.latLng(endLat, k);
                startPointCurrent = this.fromGeoToPx(coord);
                stopPoint = this.fromGeoToPx(coordStop);
                calculatePoints = this._calculatePoints(stopPoint, coord, coordStop, stepMultiple, true, mapPxBounds);
                if (calculatePoints.length) {
                    for (z = 0; z < calculatePoints.length; z += 1) {
                        line = this._getFreeLine();
                        line.points(calculatePoints[z]);
                    }
                }
                if (step.lat) {
                    for (j = geoBounds.getNorthWest().lat; j >= geoBounds.getSouthWest().lat; j -= step.lat) {
                        latLngCenter.lat = j - step.lat / 2;
                        latLngCenter.lng = k + step.lng / 2;
                        if (geoBounds.contains(latLngCenter)) {
                            fromGeoToPx = this.fromGeoToPx(latLngCenter);
                            if (mapPxBounds.contains(fromGeoToPx) && !drawedTex[fromGeoToPx.x + '-' + fromGeoToPx.y]) {
                                drawedTex[fromGeoToPx.x + '-' + fromGeoToPx.y] = fromGeoToPx;
                                this.drawText(this.getZoneName(L.latLng(j - step.lat / 4, k + step.lng / 4), sourceStep), fromGeoToPx);
                            }
                        }
                    }
                } else {
                    latLngCenter.lat = Math.abs(coord.lat - coordStop.lat) / 2 + coord.lat;
                    latLngCenter.lng = k + step.lng / 2;
                    if (geoBounds.contains(latLngCenter)) {
                        fromGeoToPx = this.fromGeoToPx(latLngCenter);
                        if (mapPxBounds.contains(fromGeoToPx)) {
                            this.drawText(Gis.Util.getZoneFromLongitude(latLngCenter.lng), fromGeoToPx);
                        }
                    }
                }
            }
        },
        drawLines: function () {
            var line,
                i,
                step,
                startPointCurrent,
                stopPoint,
                coord,
                coordStop,
                geoBounds,
                mapPxBounds,
                calculatePoints,
                stepMultiple,
                z;
            var pixelBounds = this._map.getPixelBounds();
            var pixelCrop = this._map.getPixelCrop();
            if (pixelCrop) {
                pixelBounds.min._subtract(this._map.getPixelOrigin());
                pixelBounds.max._subtract(this._map.getPixelOrigin());
                pixelBounds = pixelBounds.getIntersect(pixelCrop);
            }
            step = pixelBounds && this.calculateLatLngStep(pixelBounds);
            geoBounds = step && this._getBounds(null, step.original);
            if (!step || !geoBounds) {
                this._layer.hide();
                return;
            } else {
                this._layer.show();
            }
            stepMultiple = step.original;
            step = step.step;
            var self = this;
            function drMeridian(lat, coeff, aLat, shift) {
                shift = shift || 0;
                if (aLat > lat) {
                    self.drawMeridians(L.latLngBounds(
                        L.latLng(aLat, Math.floor(geoBounds.getNorthWest().lng / (step.lng * coeff)) * step.lng * coeff + shift),
                        L.latLng(Math.max(lat, startLat), Math.ceil(geoBounds.getNorthEast().lng / (step.lng * coeff)) * step.lng * coeff)
                    ), L.latLng(step.lat, step.lng * coeff), stepMultiple, mapPxBounds, step);
                    aLat = lat;
                } else if (lat < 0 && aLat < lat) {
                    self.drawMeridians(L.latLngBounds(
                        L.latLng(aLat, Math.floor(geoBounds.getNorthWest().lng / (step.lng * coeff)) * step.lng * coeff + shift),
                        L.latLng(Math.max(lat, startLat), Math.ceil(geoBounds.getNorthEast().lng / (step.lng * coeff)) * step.lng * coeff)
                    ), L.latLng(step.lat, step.lng * coeff), stepMultiple, mapPxBounds, step);
                    aLat = lat;
                }
                return aLat;
            }
            mapPxBounds = L.bounds(L.point(0, 0), L.point(document.body.clientWidth, document.body.clientHeight));
            if (pixelCrop) {
                pixelCrop.min._subtract(this._map._kineticViewport.min);
                pixelCrop.max._subtract(this._map._kineticViewport.min);
                mapPxBounds = mapPxBounds.getIntersect(pixelCrop);
            }
            var startLat = geoBounds.getSouthWest().lat - step.lat;
            var endLat = geoBounds.getNorthWest().lat + step.lat*2;
            if (step.lat) {
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
                    }
                }
                if (endLat > SECTOR_ZONE_LATITUDE) {
                    endLat = SECTOR_ZONE_LATITUDE;
                }
                var QUATTRO_COEFF = (step.lng === (6 / L.Grid.STEP_200_000)) ? 3 : 4;
                endLat = drMeridian(QUATTRO_ZONE_LATITUDE, QUATTRO_COEFF, endLat, -12);
                endLat = drMeridian(DOUBLE_ZONE_LATITUDE, 2, endLat);
                startLat = drMeridian(-QUATTRO_ZONE_LATITUDE, QUATTRO_COEFF, startLat, -12);
                startLat = drMeridian(-DOUBLE_ZONE_LATITUDE, 2, startLat);
            }
            if (startLat < endLat) {
                this.drawMeridians(L.latLngBounds(
                    L.latLng(startLat, geoBounds.getNorthWest().lng),
                    L.latLng(endLat, geoBounds.getNorthEast().lng)
                ), step, stepMultiple, mapPxBounds, step);
            }

            this._clearTextFrom();
            this._clearLinesFrom();
            this._clearRectsFrom();
        },
        drawHeaders: function () {
        }
    });
    Gis.Map._GRID_TYPES_[Gis.Map.GRID_TYPES.NOMENCLATE] = L.NomenclateGrid;
}());
