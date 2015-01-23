(function (L) {
    'use strict';
    var oldInit = L.TileLayer.prototype.initialize,
        oldonAdd = L.TileLayer.prototype.onAdd,
        oldonReset = L.TileLayer.prototype._reset,
        oldonRemove = L.TileLayer.prototype.onRemove,
        oldAnimateZoom = L.TileLayer.prototype._animateZoom,
        oldGetTilePos = L.TileLayer.prototype._getTilePos,
        oldEndZoomAnim = L.TileLayer.prototype._endZoomAnim,
        SCALE_DELTA = 0.00001;
    L.TileLayer.mergeOptions({
        autoRefresh: undefined,
        errorTileUrl: "data:image/png;base64,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"
    });
    L.TileLayer.include(
        /**
         * @lends L.TileLayer#
         */
        {
            overZoom: true,
            overZoomLevel: 8,

            _createTile: function () {
                var tile = L.tileWithLoader(this.options.tileSize);
                tile.setStyle({width: this._getTileSize() + 'px'});
                tile.setData('galleryimg', 'no');
                tile.setData('onselectstart', L.Util.falseFn);
                tile.setData('onmousemove', L.Util.falseFn);

                if (L.Browser.ielt9 && this.options.opacity !== undefined) {
                    tile.setOpacity(this.options.opacity);
                }
                // without this hack, tiles disappear after zoom on Chrome for Android
                // https://github.com/Leaflet/Leaflet/issues/2078
                if (L.Browser.mobileWebkit3d) {
                    tile.setStyle('WebkitBackfaceVisibility', 'hidden');
                }
                return tile;
            },
            initialize: function () {
                this._posiotion = {};
                this._zooms = {};
                this._tileSizes = {};
                oldInit.apply(this, arguments);
                this._origin = (this.options.crs && this.options.crs._originLat) ||
                    L.latLng((this.options.crs && this.options.crs.projection.MAX_LATITUDE) || L.Projection.SphericalMercator.MAX_LATITUDE, -180);
            },
            refreshTile: function (index) {
                var currentTile;
                if (this._tiles.hasOwnProperty(index)) {
                    currentTile = this._tiles[index];
                    if (this._isTileLoaded(currentTile)) {
                        currentTile.src = this._appendIndex(currentTile.realSrc || currentTile.src);
                    }
                }
                return currentTile;
            },
            _getTileSize: function (z) {
                var map,
                    zoom = (z !== undefined ? z : this.getLayerZoom()) + this.options.zoomOffset,
                    zoomN,
                    tileSize,
                    scaleThis,
                    scaleMap,
                    key;

                map = this._map;
                key = map.getZoom() + ':' + zoom;
                if (!this._tileSizes[key]) {
                    zoomN = this.options.maxNativeZoom;
                    tileSize = this.options.tileSize;
                    if (zoomN && zoom > zoomN) {
                        tileSize = Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * tileSize);
                    }
                    if (this.isAdditionalLayer()) {
                        scaleThis = this._mapScale(this.options.crs, zoom);
                        scaleMap = this._mapScale(map.options.crs, map.getZoom());
                        if (Math.abs(1 - scaleThis / scaleMap) > SCALE_DELTA) {
                            tileSize = Math.round((scaleMap / scaleThis) * tileSize);
                        }
                    }
                    this._tileSizes[key] = tileSize;
                }

                return this._tileSizes[key];
            },
            _getZoomForUrl: function () {

                var options = this.options,
                    zoom = this.getLayerZoom();

                if (options.zoomReverse) {
                    zoom = options.maxZoom - zoom;
                }

                zoom += options.zoomOffset;

                return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
            },
            getURL: function () {
                return this._url;
            },
            getLayerZoom: function () {
                var scaleThis,
                    scaleMap,
                    mapZoom,
                    map = this._map,
                    z;

                mapZoom = map.getZoom();

                if (this.isAdditionalLayer()) {
                    if (!Gis.Util.isDefine(this._zooms[mapZoom])) {
                        scaleThis = this._mapScale(this.options.crs, mapZoom);
                        scaleMap = this._mapScale(map.options.crs, mapZoom);
                        if (scaleThis !== undefined && Math.abs(1 - scaleThis / scaleMap) < SCALE_DELTA) {
                            this._zooms[mapZoom] = mapZoom;
                        }
                        if (!Gis.Util.isDefine(this._zooms[mapZoom])) {
                            var minZoom = this.getMinZoom();
                            var maxZoom = this.getMaxZoom();
                            for (z = minZoom; z <= maxZoom; z += 1) {
                                scaleThis = this._mapScale(this.options.crs, z);
                                if (scaleThis >= scaleMap) {
                                    this._zooms[mapZoom] = z;
                                    break;
                                }
                            }
                            if (!Gis.Util.isDefine(this._zooms[mapZoom])) {
                                this._zooms[mapZoom] = maxZoom;
                            }
                        }
                    }
                    return this._zooms[mapZoom];
                }
                return mapZoom;
            },
            _getTilePos: function (tilePoint) {
                var point = oldGetTilePos.call(this, tilePoint);
                if (this.isAdditionalLayer()) {
                    point._add(this.getGlobalLayerPosition(this._map.getZoom()));
                }
                return point;
            },
            _isTileLoaded: function (currentTile) {
                return currentTile.classList.contains("leaflet-tile-loaded");
            },
            _reset: function () {
                var tile;
                for (var key in this._tiles) {
                    if (this._tiles.hasOwnProperty(key)) {
                        tile = this._tiles[key];
                        if (tile.removeEventListener) {
                            tile.removeEventListener('error', this._tileOnError);
                            tile.removeEventListener('load', this._tileOnLoad);
                        }
                    }
                }
                oldonReset.call(this);
                this._updateTileLayerPosition();
            },
            refreshAllVisibleTiles: function () {
                var index, tiles = this._tiles;
                for (index in tiles) {
                    if (tiles.hasOwnProperty(index)) {
                        this.refreshTile(index);
                    }
                }
            },
            _updateTileLayerPosition: function () {

            },
            getMaxZoom: function () {
                return Gis.Util.isDefine(this.options.maxZoom) ? this.options.maxZoom : this._map && this._map.getMaxZoom();
            },
            getMinZoom: function () {
                return Gis.Util.isDefine(this.options.minZoom) ? this.options.minZoom : this._map && this._map.getMinZoom();
            },
            _update: function () {

                if (!this._map) { return; }

                var map = this._map,
                    bounds = map.getPixelBounds(),
                    zoom = this.getLayerZoom(),
                    tileSize = this._getTileSize(),
                    tileBounds,
                    point;

                if (zoom > this.getMaxZoom() || zoom < this.getMinZoom()) {
                    return;
                }

                if (this.isAdditionalLayer()) {
                    point = this.getGlobalLayerPosition(this._map.getZoom());
                    bounds.min = bounds.min.subtract(point);
                    bounds.max = bounds.max.subtract(point);
                }
                tileBounds = L.bounds(
                    bounds.min.divideBy(tileSize)._floor(),
                    bounds.max.divideBy(tileSize)._floor()
                );

                this._addTilesFromCenterOut(tileBounds);

                if (this.options.unloadInvisibleTiles || this.options.reuseTiles) {
                    this._removeOtherTiles(tileBounds);
                }
                this._updateTileLayerPosition();
            },
            getDelimeter: function (src) {
                return src.indexOf('?') < 0 ? '?' : '&';
            },
            _appendIndex: function (src) {
                var delimeter = this.getDelimeter(src);
                if (src.indexOf('ctime=') < 0) {
                    return src + delimeter + 'ctime=' + new Date().getTime();
                }
                return src.replace(/ctime=[\d]+/g, 'ctime=' + new Date().getTime());
            },
            getGlobalLayerPosition: function (zoom) {
                zoom = zoom !== undefined ? zoom : this._map.getZoom();
                if (!this._posiotion[zoom]) {
                    this._posiotion[zoom] = this._map.project(this._origin);
                }
                return this._posiotion[zoom].clone();
            },
            isAdditionalLayer: function () {
                return this.options.crs && this._map.options.crs !== this.options.crs;
            },
            loading: function () {
                if (!this._loading) {
                    this._loading = true;
                    Gis.EventBus.fire('tilesloading');
                }
            },
            loadEnd: function () {
                if (this._loading) {
                    this._loading = false;
                    Gis.EventBus.fire('tilesloaded');
                }
            },
            onAdd: function () {
                oldonAdd.apply(this, arguments);
                this.on('tileloadstart', this.loading, this);
                this.on('load', this.loadEnd, this);
                if (this.options.autoRefresh) {
                    this.tileUpdater = new L.TileUpdater(this);
                }
            },
            onRemove: function () {
                oldonRemove.apply(this, arguments);
                this.loadEnd();
                this.off('tileloadstart', this.loading, this);
                this.off('load', this.loadEnd, this);
                if (this.tileUpdater) {
                    this.tileUpdater.stop();
                }
            },
            _animateZoom: function () {
                oldAnimateZoom.apply(this, arguments);
                if (this.tileUpdater) {
                    this.tileUpdater.stop();
                }
            },
            _endZoomAnim: function () {
                oldEndZoomAnim.apply(this, arguments);
                if (this.tileUpdater) {
                    this.tileUpdater.run();
                }
            },
            _addTile: function (tilePoint, container, tileData) {
                tileData = tileData || {};

                var tilePos = this._getTilePos(tilePoint),
                    tile = this._getTile();
                tile.setData('lastUpdate', new Date().toUTCString());
                tile = L.extend(tile, tileData);
                tile.key = tile.key || (tilePoint.x + ':' + tilePoint.y);
                if (this._tiles[tile.key]) {
                    return;
                }
                tile.setPosition(tilePos, L.Browser.chrome);

                this._tiles[tile.key] = tile;

                this._loadTile(tile, tilePoint);

                if (tile.notChildOf(this._tileContainer)) {
                    tile.appendTo(container);
                }
            },

            calculateLeftCornerLatlng: function (tile, tilePoint) {
                var lng = tile.latlng, delta, point, crs = this.options.crs || this._map.options.crs;
                if (!lng) {
                    point = L.point(tilePoint.x * this._getTileSize(), tilePoint.y * this._getTileSize());
                    if (this._getDelta) {
                        delta = this._getDelta(this.getLayerZoom());
                        if (delta) {
                            point = point.subtract(delta);
                        }
                    }
                    lng = crs.pointToLatLng(point, this.getLayerZoom());
                }
                return lng;
            },
            _loadTile: function (tile, tilePoint) {
                tile._layer  = this;
                tile.countError = tile.countError || 0;
                tile.tilePoint  = tile.tilePoint || tilePoint;
                tile.latlng = this.calculateLeftCornerLatlng(tile, tilePoint);

                tile.zoom  = tile.zoom !== undefined ? tile.zoom : this.getLayerZoom();
                tile.replaceTilePoint = this.calculateReplaceTilePoint(tile);
                tile.addEventListener('error', this._tileOnError);
                tile.addEventListener('load', this._tileOnLoad);
                tile.src = this._getZoomedTileUrl(tilePoint, tile);
                tile.realSrc = tile.realSrc || tile.src;
                this.fire('tileloadstart', {
                    tile: tile.tile,
                    url: tile.src
                });
            },
            _getZoomedTileUrl: function (tilePoint, tile) {
                var pointForTile = this._getPointForTile(tilePoint, tile);
                this._adjustTilePoint(pointForTile, tile.zoom);
                return this.getTileUrl(pointForTile, tile.zoom);
            },
            _getPointForTile: function (tilePoint, tile) {
                return tile.replaceTilePoint || tilePoint;
            },
            zoomedTileName: function (point, zoom) {
                zoom = zoom || 0;
                return 'z-' + zoom + '-p-x-' + point.x + '-p-y-' + point.y;
            },
            isAfterReplaceTile: function (layer) {
                return layer.countError && !layer.afterError && this._map && layer.zoom !== this.getLayerZoom() && layer.src.indexOf(this.options.errorTileUrl) < 0;
            },
            _positionReplacedTile: function () {
                var container = this.container, layer = container._layer, tileSize, zoom, zoomedTileName, replaceTPLNG, map, replaceRealPoint, delta, crs;
                map = layer._map;
                crs = layer.options.crs || map.options.crs;
                zoom = layer._mapScale(map.options.crs, map.getZoom()) / layer._mapScale(crs, container.zoom);
                layer._adjustTilePoint(container.replaceTilePoint, container.zoom);
                if (!layer._tileAlreadyLoaded(container)) {
                    tileSize = layer.options.tileSize;
                    zoomedTileName = layer.zoomedTileName(container.replaceTilePoint || container.tilePoint, container.zoom);
                    replaceTPLNG = crs.pointToLatLng(container.replaceTilePoint.multiplyBy(tileSize), container.zoom);
                    replaceRealPoint = map.project(replaceTPLNG);
                    container.addClass(zoomedTileName);
                    container.setStyle({
                        height: tileSize * zoom + 'px',
                        width: tileSize * zoom + 'px'
                    });
                    replaceRealPoint = replaceRealPoint.subtract(layer._map.getPixelOrigin());
                    if (layer._getDelta) {
                        delta = layer._getDelta(container.zoom, true);
                        if (delta) {
                            replaceRealPoint = replaceRealPoint.subtract(delta.floor().multiplyBy(zoom));
                        }
                    }
                    container.setPosition(replaceRealPoint, L.Browser.chrome);
                } else {
                    layer._removeTile(container.key);
                }
            },
            _tileOnLoad: function () {
                try {
                    var container = this.container, layer = container._layer;
                    //Only if we are loading an actual image
                    if (this.src !== L.Util.emptyImageUrl) {
                        container.showImg();
                        if (layer.isAfterReplaceTile(container)) {
                            layer._positionReplacedTile.call(this);
                        } else if (this.src.indexOf(layer.options.errorTileUrl)  > -1) {
                            container.zoom = 1;
                        }
                        container.setStyle({
                            zIndex: container.zoom
                        });
                        layer.fire('tileload', {
                            tile: this,
                            url: this.src
                        });
                        if (this.src.indexOf(layer.options.errorTileUrl) < 0) {
                            layer.fire('tileloadok', {
                                tile: this,
                                url: this.src
                            });
                        }
                    }

                    layer._tileLoaded();
                } catch (e) {
                    console.log("Ошибка во время отрисовки тайла");
                    console.log(e.message);
                    console.log(e.stack);
                }
            },
            _tileAlreadyLoaded: function (tile) {
                return tile && tile.parentNode && tile.parentNode.querySelector('.' + this.zoomedTileName(tile.replaceTilePoint, Math.floor(tile.zoom)));
            },
            _removeTile: function (key, noFromTiles) {
                var tile = this._tiles[key];

                this.fire('tileunload', {tile: tile.tile, url: tile.src});

                if (this.options.reuseTiles) {
                    tile.removeClass('leaflet-tile-loaded');
                    this._unusedTiles.push(tile);

                } else if (tile.parentNode === this._tileContainer) {
                    tile.removeFrom(this._tileContainer);
                }

                // for https://github.com/CloudMade/Leaflet/issues/137
                if (!L.Browser.android) {
                    if (tile.removeEventListener) {
                        tile.removeEventListener('error', this._tileOnError);
                        tile.removeEventListener('load', this._tileOnLoad);
                    }
                    tile.src = L.Util.emptyImageUrl;
                }

                if (!noFromTiles) {
                    delete this._tiles[key];
                } else {
                    this._tiles[key] = true;
                }
            },
            /**
             * Разрешен ли оверзум
             * @returns {boolean}
             */
            isOverZoom: function () {
                return this.overZoom;
            },
            /**
             * Scale для карты
             * @param crs
             * @param z
             * @return {*}
             * @private
             */
            _mapScale: function (crs, z) {
                /** Для leaflet проекций scale считается в градусах, что нам не подходит - у нас все в метрах
                 *  потому тут маленькая хитрость, на нулевом уровне L.CRS scale всегда 256 :) так мы его и определим
                 *
                 *  156543.03392804097 это наш scale на нулевом зуме в метрах
                 */
                if (crs.scale(0) === 256) {
                    return Math.pow(2, z) / 156543.03392804097;
                }
                return crs.scale(z);
            },
            calculateReplaceTilePoint: function (layer) {
                var point, replaceTilePoint, proj, crs = this.options.crs || this._map.options.crs;
                if (layer.countError) {
                    point = crs.latLngToPoint(layer.latlng, layer.zoom);
                    if (this._getDelta) {
                        proj = this._getDelta(layer.zoom, true);
                        if (proj) {
                            proj.x = 0;
                            point = point.add(proj);
                        }
                    }
                    point.x += 1;
                    point.y += 1;
                    replaceTilePoint = L.point(Math.floor(point.x / this.options.tileSize), Math.floor(point.y / this.options.tileSize));
                    replaceTilePoint.z = layer.zoom;
                }
                return replaceTilePoint;
            },
            _tileOnError: function () {
                var container = this.container, layer = container._layer, nodeHas, newUrl, minZoom;
                try {
                    container.countError += 1;
                    if (layer._map) {
                        minZoom = layer.getMinZoom();
                        if (layer.isOverZoom() && layer.overZoomLevel > (layer.getLayerZoom() - container.zoom) && container.zoom > minZoom) {
                            container.zoom -= 1;
                            container.replaceTilePoint = layer.calculateReplaceTilePoint(container);
                            nodeHas = layer._tileAlreadyLoaded(container);
                            if (layer._tileContainer === container.parentNode && !nodeHas) {
                                //Обратное преобразование
                                layer._adjustTilePoint(container.tilePoint);
                                layer._removeTile(container.key);
                                layer._addTile(container.tilePoint, layer._tileContainer, {
                                    key: container.key,
                                    countError: container.countError,
                                    realSrc: container.realSrc,
                                    latlng: container.latlng,
                                    zoom: container.zoom
                                });
                            } else if (nodeHas) {
                                layer._removeTile(container.key, true);
                                layer._tileLoaded();
                            }
                            return;
                        }
                    }
                    container.showImg();
                    container.afterError = true;
                    layer.fire('tileerror', {
                        tile: this,
                        url: this.src
                    });
                } catch (e) {
                    console.log(e);
                    console.log(e.stack);
                }

                newUrl = layer.options.errorTileUrl;
                if (newUrl) {
                    this.src = newUrl;
                }

                layer._tileLoaded();
            },

            getTileUrl: function (tilePoint, zoom) {
                zoom = zoom !== undefined ? zoom : this._getZoomForUrl();
                var template = L.Util.template(this._url, L.extend({
                    s: this._getSubdomain(tilePoint),
                    z: zoom,
                    x: tilePoint.x,
                    y: tilePoint.y
                }, this.options));
                if (this.options.autoRefresh) {
                    template = this._appendIndex(template);
                }
                return template;
            },
            _adjustTilePoint: function (tilePoint, zoom) {
                zoom = zoom !== undefined ? zoom : tilePoint.z;
                var limit = this._getWrapTileNum(zoom);

                // wrap tile coordinates
                if (!this.options.continuousWorld && !this.options.noWrap) {
                    tilePoint.x = ((tilePoint.x % limit.x) + limit.x) % limit.x;
                }

                if (this.options.tms) {
                    tilePoint.y = limit.y - tilePoint.y - 1;
                }

                tilePoint.z = zoom !== undefined ? zoom : this._getZoomForUrl();
            },
            _getWrapTileNum: function (zoom) {
                zoom = zoom !== undefined ? zoom : this.getLayerZoom();
                var crs = this.options.crs || this._map.options.crs,
                    size = crs.getSize(zoom);
                return size.divideBy(this._getTileSize()).ceil();
            }
        });
}(L));