(function (L) {
    'use strict';
    var oldInvalidateSize = L.Map.prototype.invalidateSize,
        old_setZoomAround = L.Map.prototype.setZoomAround,
        pathBBox;
    if (L.DomUtil.TRANSITION) {

        L.Map.addInitHook(function () {
            // don't animate on browsers without hardware-accelerated transitions or old Android/Opera
            this._zoomAnimated = this.options.zoomAnimation && L.DomUtil.TRANSITION &&
                L.Browser.any3d && !L.Browser.android23 && !L.Browser.mobileOpera;

            // zoom transitions run with the same duration for all layers, so if one of transitionend events
            // happens after starting zoom animation (propagating to the map pane), we know that it ended globally
		if (!this._zoomAnimated) {
            L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
		}
        });
    }
    L.Map.include(
        /**
         * @lends L.Map#
         */
        {
        _mapMoved: function () {
            if (this.options.maxCenterBounds) {
                return this.setMaxCenterBounds(this.options.maxCenterBounds);
            }
            return this;
        },
        _animateZoom: function (center, zoom, origin, scale, delta, backwards) {

            this._animatingZoom = true;

            // put transform transition on all layers with leaflet-zoom-animated class
            L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');

            // remember what center/zoom to set after animation
            this._animateToCenter = center;
            this._animateToZoom = zoom;

            // disable any dragging during animation
            if (L.Draggable) {
                L.Draggable._disabled = true;
            }

            this.fire('zoomanim', {
                center: center,
                zoom: zoom,
                origin: origin,
                scale: scale,
                delta: delta,
                offset: this._getCenterOffset(center),
                backwards: backwards
            });
        },
        getMinZoom: function () {
            var z1 = this._layersMinZoom === undefined ? 0 : this._layersMinZoom,
                z2 = this._boundsMinZoom === undefined ? 0 : this._boundsMinZoom;
            return this.options.minZoom === undefined ? Math.max(z1, z2) : this.options.minZoom;
        },
        getPixcelBounds: function (latlngBounds) {
            return latlngBounds && new L.Bounds(this.project(latlngBounds.getNorthEast()),
                this.project(latlngBounds.getSouthWest()));
        },
        getPixcelBoundsLayer: function (latlngBounds) {
            return latlngBounds && new L.Bounds(this.latLngToLayerPoint(latlngBounds.getNorthEast()),
                this.latLngToLayerPoint(latlngBounds.getSouthWest()));
        },
        getMaxBounds: function () {
            var maxBounds = this.options.maxBounds;
            if (maxBounds) {
                return maxBounds;
            }
            maxBounds = this.options.maxCenterBounds;
            if (maxBounds) {
                return maxBounds;
            }
            return maxBounds;
        },
        getPixelCrop: function () {
            var bounds;
            if (this.getMaxBounds() && this._bbox) {
                bounds = L.bounds(this.latLngToLayerPoint(this._bbox[0]), this.latLngToLayerPoint(this._bbox[1]));
                bounds.extend(this.latLngToLayerPoint(this._bbox[2]));
                bounds.extend(this.latLngToLayerPoint(this._bbox[3]));
                return bounds;
            } else if (this.getBounds()) {
                return L.bounds(this.latLngToLayerPoint(this.getBounds().getNorthWest()), this.latLngToLayerPoint(this.getBounds().getSouthEast()));
            }
        },
        /**
         * Установить границы диапазона без зависимости от зума
         * @param bounds
         * @returns {*}
         */
        setMaxCenterBounds: function (bounds) {
            bounds = L.latLngBounds(bounds);
            var layerBounds;
            if (!this.options.maxCenterBounds && bounds) {
                this.on('moveend', this._mapMoved, this);
            } else if (!bounds) {
                this.off('moveend', this._mapMoved, this);
            }
            this.options.maxCenterBounds = bounds;
            if (!bounds) {
                if (!this._bbox && pathBBox) {
                    this.removeLayer(pathBBox);
                }
                return this;
            }
            if (window.L_DEBUG) {
                if (pathBBox) {
                    pathBBox.setLatLngs(this._bbox);
                } else {
                    pathBBox = L.polygon(this._bbox, {stroke: true, color: 'blue', fill: true, fillColor: 'blue', fillOpacity: 0.2});
                }
                pathBBox.addTo(this);
            }
            try {
                layerBounds = this.getPixcelBounds(bounds);
                var intersects = layerBounds.intersects(this.getPixelBounds());
                if (this._loaded && !intersects) {
                    if (this._lastCenter && !bounds.contains(this._lastCenter)) {
                        this._lastCenter = undefined;
                    }

                    this.panTo(this._lastCenter || bounds.getCenter());
                } else {
                    this._lastCenter = intersects ? this.getCenter() : null;
                }
            } catch (e) {
                console.log('error pan to bounds, may be no corretc projection');
            }

            return this;
        },
        setZoomAround: function (latlng, zoom, options) {
            if (this.getZoomScale(zoom)) {
                old_setZoomAround.call(this, latlng, zoom, options);
            }
        },
        invalidateSize: function (animate) {
            var returns = this;
            oldInvalidateSize.call(this, animate);
            if (this.options.maxCenterBounds) {
                returns = this.setMaxCenterBounds(this.options.maxCenterBounds);
            }

            return returns;
        },
        _updateSvgViewport: function () {

            if (this._pathZooming) {
                // Do not update SVGs while a zoom animation is going on otherwise the animation will break.
                // When the zoom animation ends we will be updated again anyway
                // This fixes the case where you do a momentum move and zoom while the move is still ongoing.
                return;
            }

            this._updatePathViewport();

            var vp = this._pathViewport,
                min = vp.min,
                max = vp.max,
                width = max.x - min.x,
                height = max.y - min.y,
                root = this._pathRoot,
                pane = this._panes.overlayPane;

            // Hack to make flicker on drag end on mobile webkit less irritating
            if (L.Browser.mobileWebkit) {
                pane.removeChild(root);
            }

            L.DomUtil.setPosition(root, min, navigator.userAgent.toLowerCase().indexOf('javafx') > -1);
            root.setAttribute('width', width);
            root.setAttribute('height', height);
            root.setAttribute('viewBox', [min.x, min.y, width, height].join(' '));

            if (L.Browser.mobileWebkit) {
                pane.appendChild(root);
            }
        },
        _initPathRoot: function () {
            if (!this._pathRoot) {
                this._pathRoot = L.Path.prototype._createElement('svg');
                this._panes.overlayPane.appendChild(this._pathRoot);

                if (this.options.zoomAnimation && L.Browser.any3d) {
                    L.DomUtil.addClass(this._pathRoot, 'leaflet-zoom-animated');

                    this.on({
                        'zoomanim': this._animatePathZoom,
                        'zoomend': this._endPathZoom
                    });
                } else {
                    L.DomUtil.addClass(this._pathRoot, 'leaflet-zoom-hide');
                }

                this.on('moveend', this._updateSvgViewport);
                this._updateSvgViewport();
            }
        }
    });
}(L));