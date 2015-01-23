/**
 * Created by Пользователь on 14.04.14.
 */
'use strict';
(function () {
    L.HeatMapWorker = {
        calculate: function (e, callback) {
            importScripts('deploy/scripts/gis.webwork.js');
            var heatMap, zoom, pixelOrigin, crs, _this = this;
            function getCustomCrs(projectionName, projectionString, projectedBounds, options) {
                var code = projectionName.replace(':', ''), crs;
                if (L.CRS.hasOwnProperty(code) && !projectedBounds) {
                    crs = L.CRS[code];
                } else if (projectionString) {
                    crs = new L.Proj.CRS.TMS(projectionName,
                        projectionString,
                        projectedBounds,
                        options
                        );
                }
                return crs;
            }
            function latLngToLayerPoint(latlng) {
                var projectedPoint = crs.latLngToPoint(L.latLng(latlng), zoom)._round();
                return projectedPoint.subtract(pixelOrigin);
            }
            function layerPointToLatLng(point) {
                var projectedPoint = L.point(point).add(pixelOrigin);
                return crs.pointToLatLng(projectedPoint, zoom);
            }
            function redraw(e) {
                var currentX, currentY, position,
                    myImageData, needBreak, startPoint, endPoint,
                    pointS = L.point(0, 0), boundsProjected, coord, nextPoint = L.point(0, 0),
                    width, height, step, i, len;
                position = e.position;
                step = 8;
                for (i = 0, len = e.boundsProjected.length; i < len; i += 1) {
                    boundsProjected = L.bounds(e.boundsProjected[i]);
                    startPoint = boundsProjected.min.subtract(e.pixelOrigin);
                    endPoint = boundsProjected.max.subtract(e.pixelOrigin);
                    startPoint.y = startPoint.y + (e.linePainted ? e.linePainted[0] : 0);
                    width = (endPoint.x - startPoint.x);
                    height = (endPoint.y - startPoint.y);
                    myImageData = new Uint8Array(width * height * 4);
                    needBreak = false;
                    for (currentY = startPoint.y; currentY < endPoint.y; currentY += e.delta) {
                        for (currentX = startPoint.x; currentX < endPoint.x; currentX += e.delta) {
                            pointS.x = currentX;
                            pointS.y = currentY;
                            if (e.delta === 1) {
                                coord = layerPointToLatLng(pointS);
                                if (heatMap.options.bounds.contains(coord)) {
                                    pointS = pointS.subtract(startPoint);
                                    pointS.z = heatMap.getPixcelColorByCoord(coord);
                                    heatMap.setPixelColor(pointS, position, width, myImageData);
                                    needBreak = 1;
                                }
                            } else {
                                nextPoint.x = currentX + step;
                                nextPoint.y = currentY + step;
                                needBreak = heatMap.interpolatePoints(pointS, nextPoint, position, width, height, myImageData, startPoint, layerPointToLatLng) || needBreak;
                            }
                        }
                    }
                    _this.fire('calc', {guid: e.guid, thisGUID: e.thisGUID, viewPort: e.pixelBounds[0], type: 'points', stamp: e.stamp, data: myImageData, width: width, height: height, start: startPoint.x - position.x, end: startPoint.y - position.y, isLastData: (i + 1) === len});
                }
                return {};
            }
            L.HeatMap.SKIP_INTERSECT_CHECK = e.SKIP_INTERSECT_CHECK;
            heatMap = new L.HeatMap(undefined, L.extend(e.heatMap, {skipWW: true, transparent: e.transparent}));
            crs = getCustomCrs(e.projectionName,
                e.projectionString,
                e.projectedBounds,
                e.options
                );
            pixelOrigin = e.pixelOrigin;
            zoom = e.zoom;
            return redraw(e);
        }
    };
}());