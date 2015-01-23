/**
 * Semicircle extension for L.Circle.
 * Jan Pieter Waagmeester <jieter@jieter.nl>
 * Расширено
 */

/*jshint browser:true, strict:false, globalstrict:false, indent:4, white:true, smarttabs:true*/
/*global L:true*/

(function (L) {
    "use strict";
    var original_getPathString = L.Circle.prototype.getPathString;

    L.Circle.include(L.CaptionBehavior);
    L.Sector = L.Circle.extend({
        options: {
            startAngle: 0,
            innerRadius: 0,
            stopAngle: 359.9999
        },
        getLabelLatLng: function () {
            var latlng,
                r = this._radius,
                ir = this._sRadius,
                p,
                min;
            p = [
                this.rotated(this.startAngle(), r),
                this.rotated(this.stopAngle(), r),
                this.rotated(this.startAngle(), ir),
                this.rotated(this.stopAngle(), ir)
            ];
            min = p[0];
            p.forEach(function (value) {
                min = min.y > value.y ? min : value;
            });
            //Нижняя точка дуги
            if ((180 > this.options.startAngle && 180 < this.options.stopAngle) ||
                    (this.options.startAngle > this.options.stopAngle && (180 < this.options.stopAngle || 180 > this.options.startAngle))) {
                latlng = this._map.layerPointToLatLng(L.point(this._point.x, this._point.y + r));
            } else {
                latlng = this._map.layerPointToLatLng(min);
            }
            return ((ir || latlng.lat < this._latlng.lat) && latlng) || latlng;
        },
        setDraggable: function (draggable) {
            this.options.draggable = !!draggable;
            if (L.Path.SVG && L.Handler.SvgDrag) {
                if (this.options.draggable) {
                    this.dragging = new L.Handler.SvgDrag(this);
                    this.dragging.enable();
                } else if (this.dragging) {
                    this.dragging.disable();
                    this.dragging = undefined;
                }
            }
        },

        // make sure 0 degrees is up (North) and convert to radians.
        _fixAngle: function (angle) {
            return (angle % 360 - 90) * L.LatLng.DEG_TO_RAD;
        },
        startAngle: function () {
            return this._fixAngle(this.options.startAngle);
        },
        stopAngle: function () {
            return this._fixAngle(this.options.stopAngle);
        },
        setLayerPosition: function (pos) {
            this.setLatLng(this._map.layerPointToLatLng(pos));
            return this.redraw();
        },

        rotated: function (angle, r) {
            return this._point.add(
                L.point(Math.cos(angle), Math.sin(angle)).multiplyBy(r)
            );
        },


        projectLatlngs: function () {
            var lngRadius = this._getLngRadius(),
                latlng2 = new L.LatLng(this._latlng.lat, this._latlng.lng - lngRadius),
                point2 = this._map.latLngToLayerPoint(latlng2);

            this._point = this._map.latLngToLayerPoint(this._latlng);
            this._radius = Math.max(Math.round(this._point.x - point2.x), 1);
            this._sRadius =  Math.max(Math.round((this._radius / this._mRadius) * this.options.innerRadius), 1);
//            delete this._container._leaflet_pos;
            if (L.Path.SVG) {
                this._container._leaflet_pos = this._map.latLngToLayerPoint(this._latlng);
            }
        },

//        _drawPath: function () {
//            var center = this._point,
//                r = this._radius,
//                ir = this._sRadius,
//                startOuter,
//                endOuter,
//                startInner,
//                endInner,
//                ret,
//                largeArc;
//            function ellipse(context, cx, cy, rx, ry){
//                context.save(); // save state
//                context.beginPath();
//                context.translate(cx - rx, cy - ry);
//                context.translate(-rx, -ry);
//                context.scale(rx, ry);
//                context.arc(1, 1, 1, 0, 2 * Math.PI, false);
//
//                context.restore(); // restore to original state
//            }
//            // If we want a circle, we use the original function
//            if (this.options.startAngle === 0 && this.options.stopAngle > 359 && !ir) {
//                return original_getPathString.call(this);
//            }
//            if (this._checkIfEmpty()) {
//                return '';
//            }
//            ellipse(this._ctx, p.x, p.y, r, r2, Gis.Util.gradToRad(a));
        isLargeArc: function () {
            return ((this.options.stopAngle - this.options.startAngle >= 180 && this.options.stopAngle - this.options.startAngle < 360) ||
                ((this.options.startAngle - this.options.stopAngle) < 180 && (this.options.startAngle - this.options.stopAngle) > 0));
        },
//        },
        getPathString: function () {
            var center = this._point,
                r = this._radius,
                ir = this._sRadius,
                startOuter,
                endOuter,
                startInner,
                endInner,
                ret,
                largeArc;

            // If we want a circle, we use the original function
            if (this.options.startAngle === 0 && this.options.stopAngle > 359 && !ir) {
                return original_getPathString.call(this);
            }
//            this._calculateBorderPoints();

            startOuter = this.rotated(this.startAngle(), r);
            endOuter = this.rotated(this.stopAngle(), r);
            startInner = this.rotated(this.startAngle(), ir);
            endInner = this.rotated(this.stopAngle(), ir);
            if (this._checkIfEmpty()) {
                return '';
            }

            if (L.Path.SVG) {
                largeArc = this.isLargeArc() ? '1' : '0';
                //move to center
                ret = "M" + startInner.x + "," + startInner.y;
                //make circle from point startOuter - endOuter:
                ret += "A " + ir + "," + ir + ",0," + largeArc + ",1," + (endInner.x - 0.001) + "," + endInner.y;
                //lineTo point on circle startangle from center
                ret += "L " + endOuter.x + "," + endOuter.y;
                ret += "A " + r + "," + r + ",0," + largeArc + ",0," + (startOuter.x - 0.001) + "," + startOuter.y + " z";

                return ret;
            }

            center._round();
            r = Math.round(r);
            return "A " + center.x + "," + center.y + " " + r + "," + r + " 0," + (65535 * 360);
        },
        setStartAngle: function (angle) {
            this.options.startAngle = angle;
            return this.redraw();
        },
        setInnerRadius: function (radius) {
            this.options.innerRadius = radius;
            return this.redraw();
        },
        setStopAngle: function (angle) {
            this.options.stopAngle = angle;
            return this.redraw();
        },
        setDirection: function (direction, degrees) {
            if (degrees === undefined) {
                degrees = 10;
            }
            this.options.startAngle = direction - (degrees / 2);
            this.options.stopAngle = direction + (degrees / 2);

            return this.redraw();
        }
    });

    L.Sector.include(L.PathFillExtend);
    //todo in canvas
    L.Sector.include(!L.Path.CANVAS ? {} : {
        _drawPath: function () {
            var center = this._point,
                r = this._radius,
                ir = this._sRadius,
                startOuter,
                endOuter,
                startInner,
                endInner;

            // If we want a circle, we use the original function
            if (this.options.startAngle === 0 && this.options.stopAngle > 359 && !ir) {
                return original_getPathString.call(this);
            }
//            this._calculateBorderPoints();

            startOuter = this.rotated(this.startAngle(), r);
            endOuter = this.rotated(this.stopAngle(), r);
            startInner = ir > 1 ? this.rotated(this.startAngle(), ir) : center;
            endInner = ir > 1 ? this.rotated(this.stopAngle(), ir) : center;
            this._ctx.beginPath();
            this._ctx.moveTo(startInner.x, startInner.y);
            this._ctx.lineTo(startOuter.x, startOuter.y);

            this._ctx.arc(center.x, center.y, r,
                this.startAngle(), this.stopAngle(), false);
            this._ctx.lineTo(endInner.x, endInner.y);
            if (ir > 1) {
                this._ctx.arc(center.x, center.y, ir,
                    this.stopAngle(), this.startAngle(),  true);
            }
        },

        _containsPoint: function (p) {
            var center = this._point,
                vectorAngle = Math.atan((p.y - center.y) / (p.x - center.x)),
                w2 = this.options.stroke ? this.options.weight / 2 : 0,
                distanceTo = p.distanceTo(center),
                startAngle = this.startAngle(),
                stopAngle = this.stopAngle(),
                inAngle;
            if (startAngle < 0) {
                startAngle = Math.PI * 2 + startAngle;
            }
            if (stopAngle < 0) {
                stopAngle = Math.PI * 2 + stopAngle;
            }
            if (p.x < center.x) {
                vectorAngle += Math.PI;
            } else if (p.y < center.y) {
                vectorAngle += Math.PI * 2;
            }
            inAngle = (startAngle < stopAngle && (vectorAngle >= startAngle) && (vectorAngle <= stopAngle)) ||
                (startAngle > stopAngle && (vectorAngle >= startAngle) && (vectorAngle >= stopAngle)) ||
                (this.isLargeArc() && startAngle > stopAngle && (vectorAngle <= startAngle) && (vectorAngle <= stopAngle));

            return (distanceTo <= this._radius + w2) && (distanceTo >= this._sRadius - w2) &&
                inAngle;
        }
    });
    L.Sector.include(L.ClickableSvg(L.Polygon.prototype));
    L.Sector.include(L.PolylinePopup);
    L.Sector.squareTriangle = function square(ax1, ay1, ax2, ay2, ax3, ay3) {
        return Math.abs(ax2 * ay3 - ax3 * ay2 - ax1 * ay3 + ax3 * ay1 + ax1 * ay2 - ax2 * ay1);
    };
    L.Sector.isPointInTriangle = function (point1, point2, point3, point) {
        var s = L.Sector.squareTriangle,
            diff = 0.000001,
            square1 = s(point1.x, point1.y, point2.x, point2.y, point.x, point.y),
            square2 = s(point1.x, point1.y, point3.x, point3.y, point.x, point.y),
            square3 = s(point2.x, point2.y, point3.x, point3.y, point.x, point.y);
        console.log(Math.abs(s(point1.x, point1.y, point2.x, point2.y, point3.x, point3.y) - (square1 + square2 + square3)));
        return Math.abs(s(point1.x, point1.y, point2.x, point2.y, point3.x, point3.y) - (square1 + square2 + square3)) <= diff;
    };
    L.sector = function (latlng, radius, options) {
        return new L.Sector(latlng, radius, options);
    };
}(L));
