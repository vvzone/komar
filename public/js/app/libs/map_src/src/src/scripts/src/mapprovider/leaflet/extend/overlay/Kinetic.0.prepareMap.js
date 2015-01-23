/**
 * Created by vkmar_000 on 01.09.14.
 */
(function () {
    'use strict';
    L.Map.include({
        initKinetic: function () {
            this._initkineticRootTop();
            this.showTopKinetic(false);
            this._initkineticRoot();
        },
        _initkineticRoot: function () {
            if (this._kineticRootSrc) { return; }

            var root = this._kineticRootSrc = document.createElement('div');
            root.className = 'leaflet-kinetic-container';
            root.id = 'kinetic-objects-container';
            Gis.DomUtil.prepend(this._panes.overlayPane, root);
            this._kineticStage = new Kinetic.Stage({
                width: document.body.clientWidth,
                height: document.body.clientHeight,
                container: 'kinetic-objects-container'
            });
            this._kineticRoot = this._kineticStage.container();


            if (this.options.zoomAnimation && L.Browser.any3d) {
                L.DomUtil.addClass(this._kineticRoot, 'leaflet-zoom-animated');

                this.on({
                    'zoomanim': this._animateKineticZoom,
                    'zoomend': this._endKineticZoom
                });
            } else {
                L.DomUtil.addClass(this._kineticRoot, 'leaflet-zoom-hide');
            }

            this.on('moveend', this._updateKineticViewport);
            this._updateKineticViewport();
        },
        _initkineticRootTop: function () {
            if (this._kineticRootTopSrc) { return; }
            this._panes.topPane = this._panes.topPane || this._createPane('leaflet-top-pane');

            var root = this._kineticRootTopSrc = document.createElement('div');
            root.className = 'leaflet-kinetic-container-top';
            root.id = 'kinetic-objects-container-top';
            Gis.DomUtil.prepend(this._panes.topPane, root);
            this._kineticStageTop = new Kinetic.Stage({
                width: document.body.clientWidth,
                height: document.body.clientHeight,
                container: 'kinetic-objects-container-top'
            });
            this._kineticRootTop = this._kineticStageTop.container();


            if (this.options.zoomAnimation && L.Browser.any3d) {
                L.DomUtil.addClass(this._kineticRootTop, 'leaflet-zoom-animated');
            } else {
                L.DomUtil.addClass(this._kineticRootTop, 'leaflet-zoom-hide');
            }
        },
        showTopKinetic: function (show) {
            this._kineticRootTop.style.display = show ? 'block' : 'none';
        },
        _animateKineticZoom: function (e) {
            var scale = this.getZoomScale(e.zoom),
                offset = this._getCenterOffset(e.center)._multiplyBy(-scale)._add(this._kineticViewport.min);

            this._kineticRoot.style[L.DomUtil.TRANSFORM] =
                L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';
            this._kineticRootTop.style[L.DomUtil.TRANSFORM] =
                L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';

            this._kineticZooming = true;
        },

        _endKineticZoom: function () {
            this._kineticZooming = false;
        },
        _updateKineticViewport: function () {
            var p = L.Map.KINETIC_PRELOAD,
                size = this.getSize(),
                panePos = L.DomUtil.getPosition(this._mapPane),
                min = panePos.multiplyBy(-1)._subtract(size.multiplyBy(p)._round()),
                max = min.add(size.multiplyBy(1 + p * 2)._round());

            this._kineticViewport = new L.Bounds(min, max);
            var width = max.x - min.x,
                height = max.y - min.y,
                root = this._kineticRoot,
                pane = this._panes.overlayPane;

            // Hack to make flicker on drag end on mobile webkit less irritating
            if (L.Browser.mobileWebkit) {
                pane.removeChild(root);
            }
            L.DomUtil.setPosition(root, min);
            L.DomUtil.setPosition(this._kineticRootTop, min);
            this._kineticStage.width(width);
            this._kineticStage.height(height);
            this._kineticStageTop.width(width);
            this._kineticStageTop.height(height);

            if (L.Browser.mobileWebkit) {
                pane.appendChild(root);
            }
        }
    });
    L.Map.KINETIC_PRELOAD = 0;
    L.KineticFuncs = {
        zoomOutFunc: function (time, radius, layer) {
            return function () {
                var startRadius = this.radius(), node = this, delta = radius - startRadius;
                if (this._anim) {
                    this._anim.stop();
                }
                this._anim = new Kinetic.Animation(function(frame) {
                    var aRadius;
                    aRadius = startRadius + delta * (frame.time / time);
                    if (aRadius < radius) {
                        node._anim.stop();
                        aRadius = radius;
                    }
                    node.radius(aRadius);
                }, layer);
                Gis.Map.CURRENT_MAP.setDraggableEnabled(true);
                this._anim.start();
            };
        },
        zoomInFunc: function (time, radius, layer) {
            return function () {
                var startRadius = this.radius(), node = this, delta = radius - startRadius;
                if (this._anim) {
                    this._anim.stop();
                }
                this._anim = new Kinetic.Animation(function(frame) {
                    var aRadius;
                    aRadius = startRadius + delta * (frame.time / time);
                    if (aRadius > radius) {
                        node._anim.stop();
                        aRadius = radius;
                    }
                    node.radius(aRadius);
                }, layer);

                Gis.Map.CURRENT_MAP.setDraggableEnabled(false);
                this._anim.start();
            };
        },
        zoomOutFuncOpacity: function (time, opacity, layer) {
            return function () {
                var self = this, animator;
                if (!Gis.Util.isArray(self)) {
                    self = [self];
                }
                animator = self[0];
                var startOpacity = animator.opacity(), node = self, delta = opacity - startOpacity;
                if (animator._anim_o) {
                    animator._anim_o.stop();
                }
                animator._anim_o = new Kinetic.Animation(function(frame) {
                    var aOpacity;
                    aOpacity = startOpacity + delta * (frame.time / time);

                    if (aOpacity < opacity) {
                        node[0]._anim_o.stop();
                        aOpacity = opacity;
                    }
                    node.forEach(function (val) {
                        val.opacity(aOpacity);
                    });
                }, layer);

                Gis.Map.CURRENT_MAP.setDraggableEnabled(true);
                animator._anim_o.start();
            };
        },
        zoomInFuncOpacity: function (time, opacity, layer) {
            return function () {
                var self = this, animator;
                if (!Gis.Util.isArray(self)) {
                    self = [self];
                }
                animator = self[0];
                var startOpacity = animator.opacity(), node = self, delta = opacity - startOpacity;
                if (animator._anim_o) {
                    animator._anim_o.stop();
                }
                animator._anim_o = new Kinetic.Animation(function(frame) {
                    var aOpacity;
                    aOpacity = startOpacity + delta * (frame.time / time);
                    if (aOpacity > opacity) {
                        node[0]._anim_o.stop();
                        aOpacity = opacity;
                    }
                    node.forEach(function (val) {
                        val.opacity(aOpacity);
                    });
                }, layer);

                Gis.Map.CURRENT_MAP.setDraggableEnabled(false);
                animator._anim_o.start();
            };
        }
    };
}());