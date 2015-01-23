    /**
 * Created with JetBrains PhpStorm.
 */
(function (L) {
    "use strict";
    L.PolylinePopup = L.PopupBehavior;

    L.Polyline.include(L.PathCaptionBehavior);
    L.Polyline.include(L.ClickableSvg(L.Polyline.prototype));
    L.Polyline.include({
        setLatLngs: function (latlngs) {
            this._latlngs = this._convertLatLngs(latlngs);
            this.fire('move', {latlng: this._latlngs[0]});
            return this.redraw();
        },
        projectLatlngs: function () {
            var i, len;
            this._originalPoints = [];

            for (i = 0, len = this._latlngs.length; i < len; i += 1) {
                this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
            }
            if (this._container) {
                if (this._container._leaflet_pos) {
                    delete this._container._leaflet_pos;
                }
                this._container._leaflet_pos = this._originalPoints[0];
            }
        }
    });
    L.MultiPolyline.include({
        _initEvents: function () {
            L.MultiPolyline.prototype._initEvents.call(this);
            this.setDraggable(this.options.draggable);
        },
        projectLatlngs: function () {
            L.MultiPolyline.prototype._initEvents.call(this);

            if (this._container) {
                if (this._container._leaflet_pos) {
                    delete this._container._leaflet_pos;
                }
                this._container._leaflet_pos = this._map.latLngToLayerPoint(this._latlngs[0]);
            }
        }
    });
    L.Polyline.include(L.PolylineExtend);
    L.Polyline.include(L.PolylinePopup);
    L.Polygon.include(L.PolylinePopup);
    L.MultiPolyline.include(L.PolylineExtend);
    L.MultiPolyline.include(L.PolylinePopup);
}(L));