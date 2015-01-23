/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
/*
 * Vector rendering for all browsers that support canvas.
 */
if (window.Kinetic && false) {
    (function () {
        'use strict';

        L.Path = L.Path.extend({
            statics: {
                //CLIP_PADDING: 0.02, // not sure if there's a need to set it to a small value
                CANVAS: true,
                SVG: false
            },
            initialize: function () {
                var self = this;
                this._onClick = function (e) {
                    self.fire('click', e);
                };

                this._onMouseMove = function (e) {
                    if (!self._map || this._map._animatingZoom) { return; }

                    // TODO don't do on each move
//                    this._ctx.canvas.style.cursor = 'pointer';
                    if (!self._mouseInside) {
                        self._mouseInside = true;
                        self.fire('mouseover', e);
                    } else if (this._mouseInside) {
//                    this._ctx.canvas.style.cursor = '';
                        self._mouseInside = false;
                        self.fire('mouseout', e);
                    }
                };
                L.Path.prototype.initialize.apply(this);
            },

            redraw: function () {
                if (this._map) {
                    this.projectLatlngs();
                    this._requestUpdate();
                }
                return this;
            },

            setStyle: function (style) {
                L.setOptions(this, style);

                if (this._map) {
                    this._updateStyle();
                    this._requestUpdate();
                }
                return this;
            },

            onRemove: function (map) {
                map
                    .off('viewreset', this.projectLatlngs, this)
                    .off('moveend', this._updatePath, this);

                if (this.options.clickable) {
                    this._path.off('click', this._onClick);
                    this._path.off('mousemove', this._onMouseMove);
                }

                this._requestUpdate();

                this._map = null;
            },

            _requestUpdate: function () {
                if (this._map && !L.Path._updateRequest) {
                    L.Path._updateRequest = L.Util.requestAnimFrame(this._fireMapMoveEnd, this._map);
                }
            },

            _fireMapMoveEnd: function () {
                L.Path._updateRequest = null;
                this.fire('moveend');
            },

            _initElements: function () {
                this._map._initPathRoot();
                if (!this._path) {
                    if (this instanceof L.Polygon) {
                        this._path = Kinetic.Polygon();
                    } else {
                        this._path = Kinetic.Path();
                    }
                    this._map._kineticLayer.add(this._path);
                }
            },

            _updateStyle: function () {
                var options = this.options;
                this._path.setStrokeWidth(options.stroke && options.weight);
                this._path.setStroke(options.stroke && options.color);
                this._path.setFill(options.fill && (options.fillColor || options.color));
            },

            _drawPath: function () {
                var i,len;
                for (i = 0, len = this._parts.length; i < len; i++) {
                    this._path.setPoints(this._parts[i]);
                    // TODO refactor ugly hack
                    if (this instanceof L.Polygon) {
                        this._ctx.closePath();
                    }
                }
            },

            _checkIfEmpty: function () {
                return !this._parts.length;
            },

            _updatePath: function () {
                if (this._checkIfEmpty()) { return; }
                var options = this.options;
                this._drawPath();
                this._updateStyle();

                this._path.setOpacity((options.stroke && options.opacity) || 1);
                // TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
            },

            _initEvents: function () {
                if (this.options.clickable) {
                    // TODO dblclick
                    this._path.on('mousemove', this._onMouseMove, this);
                    this._path.on('click', this._onClick, this);
                }
            }

        });
        L.Map.include({
            _updateZoomKinetic: function () {

            },
            _initPathRoot: function () {
                var root = this._pathRoot;

                if (!root) {
                    root = this._pathRoot = document.createElement('div');
                    root.id = 'leaflet-kinetic';


                    this.getContainer().appendChild(root);
                    this._kineticStage = new Kinetic.Stage({
                        container: 'leaflet-kinetic',
                        width: document.body.offsetWidth,
                        height: document.body.offsetHeight
                    });
                    this._kineticLayer = new Kinetic.Layer();
                    this._kineticStage.add(this._kineticLayer);
                    this.on('moveend', this._updateCanvasViewport);
//                    this.on('zoomend', this._updateZoomKinetic);
                    this._updateCanvasViewport();
                }
            },

            _updateCanvasViewport: function () {
                if (this._pathZooming) { return; }
                this._updatePathViewport();

                var vp = this._pathViewport,
                    min = vp.min,
                    size = vp.max.subtract(min),
                    stage = this._kineticStage;

                stage.setOffset(-min.x, -min.y);
                stage.setSize(size.x, size.y);
                stage.draw();
            }
        });
    }());
}
