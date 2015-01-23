/*
 * Extends L.Circle with Canvas-specific code.
 */
"use strict";
if (L.Path.CANVAS) {
    L.Circle.include(L.CaptionBehavior);
    L.Ellipse = L.Circle.extend({
        includes: L.PathFillExtend,
        getLabelLatLng: function () {
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
        projectLatlngs: function () {
            var lngRadius = this._getLngRadius(),
                latlng2 = new L.LatLng(this._latlng.lat,
                    this._latlng.lng - lngRadius),
                point2 = this._map.latLngToLayerPoint(latlng2);

            this._point = this._map.latLngToLayerPoint(this._latlng);
            this._radius = Math.max(Math.round(this._point.x - point2.x), 1);
            this._sRadius = Math.max(Math.round((this._radius / this._mRadius) * this._mSecondRadius), 1);
            if (this._container && typeof this._container._leaflet_pos === 'object') {
                if (typeof this._container._leaflet_pos === 'object') {
                    delete this._container._leaflet_pos;
                }
                this._container._leaflet_pos = this._map.latLngToLayerPoint(this._latlng);
            }
        },
        _drawPath: function () {
            function ellipse(context, cx, cy, rx, ry, angle){
                context.save(); // save state
                context.beginPath();
                angle = angle || 0;
                context.translate(cx, cy);
                context.rotate(angle);
                context.translate(-rx, -ry);
                context.scale(rx, ry);
                context.arc(1, 1, 1, 0, 2 * Math.PI, false);

                context.restore(); // restore to original state
            }
            var p = this._point,
                r = this._radius,
                a = this._mAngle,
                r2 = this._sRadius;

            if (this._checkIfEmpty()) {
                return '';
            }
            ellipse(this._ctx, p.x, p.y, r, r2, Gis.Util.gradToRad(a));
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
        setAngle: function (angle) {
            this._mAngle = angle;
            return this.redraw();
        },
        _containsPoint: function (p) {
            var center = this._point,
                w2 = this.options.stroke ? this.options.weight / 2 : 0,
                distanceTo = p.distanceTo(center);

            return  (distanceTo <= this._radius + w2);
        }
    });

    L.Ellipse.include(L.PolylineExtend);
    L.Ellipse.include(L.ClickableSvg(L.Circle.prototype));
    L.Ellipse.include(L.PolylinePopup);
    L.ellipse = function (latlng, fRadius, sRadius, angle, options) {
        return new L.Ellipse(latlng, fRadius, sRadius, angle, options);
    };
}
