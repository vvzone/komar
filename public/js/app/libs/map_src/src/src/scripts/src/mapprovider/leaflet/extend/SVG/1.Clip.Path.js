    /**
 * Created with JetBrains PhpStorm.
 */
(function (L) {
    "use strict";
    L.Bounds.prototype.inters = function (bound) {
        var minX = Math.max(bound.min.x, this.min.x),
            maxX = Math.min(bound.max.x, this.max.x),
            minY = Math.max(bound.min.y, this.min.y),
            maxY = Math.min(bound.max.y, this.max.y);
        return new L.Bounds([minX, minY], [maxX, maxY]);
    };
    L.ClipPath = {
        _clipPoints: function () {
            var points = this._originalPoints,
                len = points.length,
                i, k, segment;

            if (this.options.noClip) {
                this._parts = [points];
                return;
            }

            this._parts = [];

            var parts = this._parts,
                vp = this._map._pathViewport,
                lu = L.LineUtil;
            var pb = this._map.getPixcelBoundsLayer(this._map.getMaxBounds());
            if (pb && !window.L_DEBUG) {
                vp = vp.inters(pb);
            }

            for (i = 0, k = 0; i < len - 1; i++) {
                segment = lu.clipSegment(points[i], points[i + 1], vp, i);
                if (!segment) {
                    continue;
                }

                parts[k] = parts[k] || [];
                parts[k].push(segment[0]);

                // if segment goes out of screen, or it's the last one, it's the end of the line part
                if ((segment[1] !== points[i + 1]) || (i === len - 2)) {
                    parts[k].push(segment[1]);
                    k++;
                }
            }
        }
    };
//    L.Polygon.include(L.ClipPath);
    L.Polyline.include(L.ClipPath);
}(L));