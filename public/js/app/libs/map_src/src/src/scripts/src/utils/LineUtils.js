/**
 * Created with JetBrains PhpStorm.
 * used from LEAFLET
 */
(function (G) {
    "use strict";
    G.LineUtil = {

        simplify: function (points, tolerance) {
            if (!tolerance || !points.length) {
                return points.slice();
            }

            var sqTolerance = tolerance * tolerance;

            // stage 1: vertex reduction
            points = this._reducePoints(points, sqTolerance);

            // stage 2: Douglas-Peucker simplification
            points = this._simplifyDP(points, sqTolerance);

            return points;
        },
        // reduce points that are too close to each other to a single point
        _reducePoints: function (points, sqTolerance) {
            var reducedPoints = [points[0]], i, prev, len;

            for (i = 1, prev = 0, len = points.length; i < len; i += 1) {
                if (G.Projection.distanceTo(points[i], points[prev]) > sqTolerance) {
                    reducedPoints.push(points[i]);
                    prev = i;
                }
            }
            if (prev < len - 1) {
                reducedPoints.push(points[len - 1]);
            }
            return reducedPoints;
        },
        // Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
        _simplifyDP: function (points, sqTolerance) {

            var len = points.length,
                ArrayConstructor = typeof Int32Array !== undefined + '' ? Int32Array : Array,
                markers = new ArrayConstructor(len),
                i,
                newPoints;

            markers[0] = markers[len - 1] = 1;

            this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

            newPoints = [];

            for (i = 0; i < len; i += 1) {
                if (markers[i]) {
                    newPoints.push(points[i]);
                }
            }

            return newPoints;
        },

        _simplifyDPStep: function (points, markers, sqTolerance, first, last) {

            var maxSqDist = 0, index, i, sqDist;

            for (i = first + 1; i <= last - 1; i += 1) {
                sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);

                if (sqDist > maxSqDist) {
                    index = i;
                    maxSqDist = sqDist;
                }
            }

            if (maxSqDist > sqTolerance) {
                markers[index] = 1;

                this._simplifyDPStep(points, markers, sqTolerance, first, index);
                this._simplifyDPStep(points, markers, sqTolerance, index, last);
            }
        },
        // square distance (to avoid unnecessary Math.sqrt calls)
        _sqDist: function (p1, p2) {
            var dx = p2.lng - p1.lng,
                dy = p2.lat - p1.lat;
            return dx * dx + dy * dy;
        },

        // return closest point on segment or distance to that point
        _sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
            var x = p1.lng,
                y = p1.lat,
                dx = p2.lng - x,
                dy = p2.lat - y,
                dot = dx * dx + dy * dy,
                t;

            if (dot > 0) {
                t = ((p.lng - x) * dx + (p.lat - y) * dy) / dot;

                if (t > 1) {
                    x = p2.lng;
                    y = p2.lat;
                } else if (t > 0) {
                    x += dx * t;
                    y += dy * t;
                }
            }

            dx = p.lng - x;
            dy = p.lat - y;

            return sqDist ? dx * dx + dy * dy : new G.latLng(y, x);
        }
    };
}(Gis));