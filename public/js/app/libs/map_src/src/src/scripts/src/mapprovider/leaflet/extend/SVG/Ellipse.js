/**
 * Created with JetBrains PhpStorm.
 */
(function (L) {
    "use strict";
    var oldUpdatePath = L.Circle.prototype._updatePath;
    L.Circle.include(L.CaptionBehavior);
    if (L.Path.SVG) {
        L.Ellipse = L.Circle.extend({
            includes: L.PathFillExtend,
            getLabelLatLng: function () {
    //            var latlng,
    //                r = this._radius,
    //                ir = this._sRadius,
    //                p,
    //                min;
    //            p = [
    //                this.rotated(this._mAngle, r),
    //                this.rotated(this._mAngle, ir),
    //            ];
    //            min = p[0];
    //            p.forEach(function (value) {
    //                min = min.y > value.y ? min: value;
    //            });
    //            latlng = this._map.layerPointToLatLng(min);
    //            return latlng;
                //TODO рассчет точки
                return this._latlng;
            },
            initialize: function (latlng, radius, secondRadius, angle, options) {
                L.Path.prototype.initialize.call(this, options);

                this._latlng = L.latLng(latlng);
                this._mRadius = radius;
                this._mSecondRadius = secondRadius;
                this._mAngle = angle;
            },
            setDraggable: function (draggable) {
                this.options.draggable = !!draggable;
                if (L.Handler.SvgDrag) {
                    if (this.options.draggable) {
                        this.dragging = new L.Handler.SvgDrag(this);
                        this.dragging.enable();
                    } else if (this.dragging) {
                        this.dragging.disable();
                        this.dragging = undefined;
                    }
                }
            },
            setLayerPosition: function (pos) {
                this.setLatLng(this._map.layerPointToLatLng(pos));
                return this.redraw();
            },

            _getLngSRadius: function () {
                return this._getLatRadius(this._mSecondRadius) / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat);
            },
            _getLatRadius: function (radius) {
                return ((radius || this._mRadius) / 40075017) * 360;
            },
            _updatePath: function () {
                var p = this._point;
                oldUpdatePath.call(this);
                if (!this._checkIfEmpty()) {
                    this._path.setAttribute("transform", "rotate(" + this._mAngle + ", " + (p.x) + ", " + p.y + ")");
                }
            },
            projectLatlngs: function () {
                var lngRadius = this._getLngRadius(),
                    latlng2 = new L.LatLng(this._latlng.lat,
                        this._latlng.lng - lngRadius),
                    point2 = this._map.latLngToLayerPoint(latlng2);

                this._point = this._map.latLngToLayerPoint(this._latlng);
                this._radius = Math.max(Math.round(this._point.x - point2.x), 1);
                this._sRadius = Math.max(Math.round((this._radius / this._mRadius) * this._mSecondRadius), 1);
                if (this._container) {
                    if (typeof this._container._leaflet_pos === 'object') {
                        delete this._container._leaflet_pos;
                    }
                    this._container._leaflet_pos = this._map.latLngToLayerPoint(this._latlng);
                }
            },
            getPathString: function () {
                var p = this._point,
                    r = this._radius,
                    a = this._mAngle,
                    r2 = this._sRadius;

                if (this._checkIfEmpty()) {
                    return '';
                }

                if (L.Browser.svg) {
                    return "M" + p.x + "," + (p.y - r2) +
                        "A" + r + "," + r2 + ",0,1,1," +
                        (p.x - 0.1) + "," + (p.y - r2) + " z";
                }
                p._round();
                r = Math.round(r);
                return "AL " + p.x + "," + p.y + " " + r + "," + r2 + " 0," + (65535 * a);
            },
            setSecondRadius: function (radius) {
                this._mSecondRadius = radius;
                return this.redraw();
            },
            rotated: function (angle, r) {
                return this._point.add(
                    L.point(Math.cos(angle), Math.sin(angle)).multiplyBy(r)
                );
            },
            _updateStyle: function () {
                var fillColor,
                    oldFillColor,
                    fillOpacity,
                    oldFillOpacity;
                if (this.options.stroke) {
                    this._path.setAttribute('stroke', this.options.color);
                    this._path.setAttribute('stroke-fillOpacity', this.options.opacity);
                    this._path.setAttribute('stroke-width', this.options.weight);
                    if (this.options.dashArray) {
                        this._path.setAttribute('stroke-dasharray', this.options.dashArray);
                    } else {
                        this._path.removeAttribute('stroke-dasharray');
                    }
                } else {
                    this._path.setAttribute('stroke', 'none');
                }
                if (this.options.fill) {
                    fillColor = this.options.fillColor || this.options.color;
                    fillOpacity = this.options.fillOpacity + "";
                    oldFillColor = this._path.getAttribute('fill');
                    oldFillOpacity = this._path.getAttribute('fill-opacity');
                    if (oldFillColor !== fillColor) {
                        this._path.setAttribute('fill', fillColor);
                    }
                    if (fillOpacity !== oldFillOpacity) {
                        this._path.setAttribute('fill-opacity', fillOpacity);
                    }
                } else {
                    this._path.setAttribute('fill', 'none');
                }
            },
            setAngle: function (angle) {
                this._mAngle = angle;
                return this.redraw();
            }
        });

        L.Ellipse.include(L.PathFillExtend);
        L.Ellipse.include(L.ClickableSvg(L.Ellipse.prototype));
        L.Ellipse.include(L.PolylinePopup);
        L.ellipse = function (latlng, fRadius, sRadius, angle, options) {
            return new L.Ellipse(latlng, fRadius, sRadius, angle, options);
        };
    }
}(L));