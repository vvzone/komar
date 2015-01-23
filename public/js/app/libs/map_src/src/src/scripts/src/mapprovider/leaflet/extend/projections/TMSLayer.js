'use strict';
(function (L) {
    var oldInitProj = L.Proj.CRS.TMS.prototype.initialize;

    function round(x) {
        return parseInt(x * 1000000, 10) / 1000000;
    }

    L.Proj.CRS.TMS.include({
        _minMaxBounds: null,
        initialize: function (a, b, c, d) {
            var one, two;
            this._minMaxBounds = {};
            this._originCoordinate = {};
            this._origin = (d && d.origin.slice()) || [c[2], c[3]];
            this._originPoint = L.point(this._origin);
            if (d && d.origin) {
                d.origin = d.origin.slice();
            }
            oldInitProj.apply(this, arguments);
            if ((b.projName && b.projName !== 'merc') || (b.indexOf && !b.indexOf('+proj=merc'))) {
                this._originLat = this.projection.unproject(L.point(round(this._origin[0]), this._origin[1]));
            } else {
                this._originLat = this.projection.unproject(L.point(this._origin));
            }
            one = this.projection.unproject(L.point(c[0], c[3]));
            two = this.projection.unproject(L.point(c[2], c[3]));

            this._topLeftLatLng = one.lng > two.lng ? two : one;
            this._bbox = [
                this.projection.unproject(L.point(c.slice(0, 2))),
                this.projection.unproject(L.point(c[0], c[3])),
                this.projection.unproject(L.point(c.slice(2, 4))),
                this.projection.unproject(L.point(c[2], c[1]))
            ];
            this._bboxOrigin = [
                L.point(c.slice(0, 2)),
                L.point(c[0], c[3]),
                L.point(c.slice(2, 4)),
                L.point(c[2], c[1])
            ];
        },
        getOriginPoint: function (zoom) {
            if (!this._originCoordinate[zoom]) {
                this._originCoordinate[zoom] = this.srcPointToPoint(this._originPoint.clone(), zoom)._round();
            }
            return this._originCoordinate[zoom].clone();
        },
        srcPointToPoint: function (latlng, zoom) { // (LatLng, Number) -> Point
            var scale = this.scale(zoom);

            return this.transformation._transform(L.point(latlng), scale);
        },
        getMinMaxBounds: function (zoom) {
            if (!this._minMaxBounds[zoom]) {
                var point,
                    yMax,
                    yMin,
                    xMax,
                    xMin,
                    length = this._bboxOrigin.length;
                for (var i = 0; i < length; i += 1) {
                    point = this.srcPointToPoint(this._bboxOrigin[i].clone(), zoom);
                    if (yMax === undefined) {
                        yMax = point.y;
                        yMin = point.y;
                    }
                    if (xMax === undefined) {
                        xMax = point.x;
                        xMin = point.x;
                    }
                    yMax = Math.max(yMax, point.y);
                    yMin = Math.min(yMin, point.y);

                    xMax = Math.max(xMax, point.x);
                    xMin = Math.min(xMin, point.x);
                }
                this._minMaxBounds[zoom] = L.bounds(L.point(xMax, yMax, true), L.point(xMin, yMin, true));
            }
            return L.bounds(this._minMaxBounds[zoom].max.clone(),
                this._minMaxBounds[zoom].min.clone());
        }
    });
    L.TMSLayer = L.TileLayer.extend({
        initialize: function (urlTemplate, crs, options) {
            L.TileLayer.prototype.initialize.call(this, urlTemplate, options);
            this.crs = crs;
            this._sizes = {};
            this._delta = {};
            this._posiotion = {};
        },
        getUrlZoom: function (zoom) {
            return L.Util.isArray(this._url) ? this._url[zoom] : this._url;
        },
        getMinMaxBounds: function (crs, z) {
            if (z == undefined) {
                z = crs;
                crs = this.options.crs;
            }
            if (crs.getMinMaxBounds) {
                return crs.getMinMaxBounds(z);
            }
            return L.bounds(crs.latLngToPoint(L.latLng(L.Projection.Mercator.MAX_LATITUDE, -180), z).clone(),
                crs.latLngToPoint(L.latLng(-L.Projection.Mercator.MAX_LATITUDE, 180), z).clone());
        },
        getOriginPoint: function (crs, z) {
            if (crs.getOriginPoint) {
                return crs.getOriginPoint(z);
            }
            return crs.latLngToPoint(L.latLng(L.Projection.Mercator.MAX_LATITUDE, -180));
        },
        getLayerSize: function (z) {
            if (!this._sizes[z]) {
                var crs = this.options.crs || this._map.options.crs,
                    minMax = this.getMinMaxBounds(crs, z),
                    originPoint = this.getOriginPoint(crs, z);
                this._sizes[z] = L.point(minMax.min.x - originPoint.x, minMax.min.y - originPoint.y);
            }
            return this._sizes[z].clone();
        },
        _getDelta: function (z, noScale) {
            noScale = noScale || !this.isAdditionalLayer();
            var key = (this._map.getZoom() + ':' + z + ":" + noScale);
            if (!this._delta[ key]) {
                var tileSize = this._getTileSize(z),
                    size,
                    tilesCount,
                    realSize;
                size = this.getLayerSize(z);
                if (!noScale) {
                    size._multiplyBy(this._mapScale(this._map.options.crs, this._map.getZoom()) / this._mapScale(this.options.crs, z));
                } else {
                    tileSize = this.options.tileSize;
                }
                try {
                    tilesCount = this._getWrapTileNum(z);
                } catch (e) {
                    return;
                }
                realSize = tilesCount.multiplyBy(tileSize);
                realSize.x = 0;
                this._delta[key] = realSize.add(size);
            }
            return this._delta[key] && this._delta[key].clone();
        },
        _getTilePos: function (tilePoint, noDiff) {
            var origin = this._map.getPixelOrigin(),
                tileSize = this._getTileSize(),
                pos = tilePoint.multiplyBy(tileSize).subtract(origin),
                point = this._getDelta(this.getLayerZoom());
            if (this.isAdditionalLayer()) {
                pos._add(this.getGlobalLayerPosition(this._map.getZoom()));
            }
            return point && !noDiff ? pos.subtract(point) : pos;
        },

        _adjustTilePoint: function (tilePoint, zoom) {

            zoom =  zoom !== undefined ? zoom : tilePoint.z !== undefined ? tilePoint.z : this.getLayerZoom();
            var limit = this._getWrapTileNum(zoom), delta, originPoint, y;


            if (this.options.tms) {
                originPoint = (this.options.crs || this._map.options.crs).getOriginPoint(zoom);
                y = limit.y;
                if (originPoint) {
                    delta = this._getDelta(zoom, true);
                    if (delta) {
//                        delta._multiplyBy(this._map.options.crs.scale(this._map.getZoom()) / this.options.crs.scale(zoom));
                        y = originPoint.add(delta).divideBy(this.options.tileSize).floor().y;
                    }
                }
                tilePoint.y = y - tilePoint.y - 1;
            }

            // wrap tile coordinates
            if (!this.options.continuousWorld && !this.options.noWrap) {
                tilePoint.x = ((tilePoint.x % limit.x) + limit.x) % limit.x;
            }
            tilePoint.z = zoom !== undefined ? zoom : this._getZoomForUrl();
        },

        _update: function () {

            if (!this._map) {
                return;
            }

            var map = this._map,
                zoom = this.getLayerZoom(),
                delta = this._getDelta(zoom),
                bounds = map.getPixelBounds(),
                tileSize = this._getTileSize();
            if (tileSize) {
                if (delta) {
                    bounds.min = bounds.min.add(delta);
                    bounds.max = bounds.max.add(delta);
                }
                if (this.isAdditionalLayer()) {
                    var mm,  point = this.getGlobalLayerPosition(this._map.getZoom());
                    bounds.min = bounds.min.subtract(point);
                    bounds.max = bounds.max.subtract(point);
                    mm = this.getMinMaxBounds(zoom);
                    mm.max._multiplyBy(this._mapScale(map.options.crs, map.getZoom()) / this._mapScale(this.options.crs, this.getLayerZoom()));
                    bounds = bounds.getIntersect(mm);
                }
                if (zoom > this.options.maxZoom || zoom < this.options.minZoom || !bounds) {
                    return;
                }

                var tileBounds = L.bounds(
                    bounds.min.divideBy(tileSize)._floor(),
                    bounds.max.divideBy(tileSize)._floor());

                this._addTilesFromCenterOut(tileBounds);

                if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
                    this._removeOtherTiles(tileBounds);
                }
            }

        },

        getGlobalLayerPosition: function (zoom) {
            var latLng, layerSize;
            zoom = zoom !== undefined ? zoom : this._map.getZoom();
            if (!this._posiotion[zoom]) {
//                layerSize = this.getLayerSize(this.getLayerZoom()).multiplyBy(this.options.crs.scale(this.getLayerZoom()) / this._map.options.crs.scale(zoom));
                latLng = (this.options.crs && this.options.crs._topLeftLatLng) || L.latLng(L.Projection.Mercator.MAX_LATITUDE, -180);
                this._posiotion[zoom] = this._map.project(latLng, zoom);
            }
            return this._posiotion[zoom].clone();
        },
        getTileUrl: function (tilePoint, zoom) {
            zoom = zoom !== undefined ? zoom : this._getZoomForUrl();

            var template = this.options.errorTileUrl;
            try {
                template = L.Util.template(this.getUrlZoom(zoom), L.extend({
                    s: this._getSubdomain(tilePoint),
                    z: zoom,
                    x: Math.ceil(tilePoint.x),
                    y: Math.ceil(tilePoint.y)
                }, this.options));
                if ((zoom - Math.floor(zoom)) > 0) {
                    if (this._map && this._map.getZoom() % 1 > 0) {
                        this._map.setZoom(Math.floor(this._map.getZoom()));
                    }
                }
            } catch (e) {
                if (this._map && this._map.getZoom() % 1 > 0) {
                    this._map.setZoom(Math.floor(this._map.getZoom()));
                }
                Gis.Logger.log("getTileUrl", e, e.stack);
            }

            if (this.options.autoRefresh) {
                template = this._appendIndex(template);
            }
            if (this.options.getParams) {
                var delimeter = this.getDelimeter(template);
                for (var key in this.options.getParams) {
                    if (this.options.getParams.hasOwnProperty(key)) {
                        template += delimeter + key + '=' + this.options.getParams[key];
                    }
                }
            }

            return  template;
        },
        _tileShouldBeLoaded: function (tilePoint) {
            if ((tilePoint.x + ':' + tilePoint.y) in this._tiles) {
                return false; // already loaded
            }

            var options = this.options, limit, bounds, min, max, z, delta, crs, tileSize = this._getTileSize();

            if (!options.continuousWorld) {
                limit = this._getWrapTileNum();
                z = this.getLayerZoom();
                crs = this.options.crs || this._map.options.crs;
                if (crs.getMinMaxBounds && (bounds = crs.getMinMaxBounds(this.getLayerZoom()))) {
                    delta = this._getDelta(z);
                    min = bounds.min.add(delta).divideBy(tileSize).floor();
                    max = bounds.max.add(delta).divideBy(tileSize).ceil();
                    if ((options.noWrap && (tilePoint.x < min.x || tilePoint.x >= max.x)) ||
                        tilePoint.y < min.y || tilePoint.y >= max.y) { return false; }
                } else {
                    // don't load if exceeds world bounds
                    if ((options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit.x)) ||
                        tilePoint.y < 0 || tilePoint.y >= limit.y) { return false; }
                }

            }

            if (options.bounds) {
                var nwPoint = tilePoint.multiplyBy(tileSize),
                    sePoint = nwPoint.add([tileSize, tileSize]),
                    nw = this._map.unproject(nwPoint),
                    se = this._map.unproject(sePoint);

                if (!options.continuousWorld && !options.noWrap) {
                    nw = nw.wrap();
                    se = se.wrap();
                }

                if (!options.bounds.intersects([nw, se])) { return false; }
            }

            return true;
        },
        _getWrapTileNum: function (zoom) {
            zoom = zoom !== undefined ? zoom : this.getLayerZoom();
            var crs = this.options.crs || this._map.options.crs,
                size = crs.getMinMaxBounds(zoom);
            return size.max.subtract(size.min).divideBy(this.options.tileSize).ceil();
        }
    });
}(L));