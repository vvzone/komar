/**
 * Created with JetBrains PhpStorm.
 */
(function (L) {
    "use strict";
    var oldProjectLatlngs = L.Polygon.prototype.projectLatlngs;
    L.Polygon.include(L.PolylineExtend);
    L.Polygon.include(L.PathFillExtend);
    L.Polygon.include(L.ClickableSvg(L.Path.prototype));
    L.Polygon.include(L.PathCaptionBehavior);
    L.Polygon.include({
        projectLatlngs: function () {
            oldProjectLatlngs.call(this);
            if (L.Path.SVG) {
                if (this._container._leaflet_pos) {
                    delete this._container._leaflet_pos;
                }
                this._container._leaflet_pos = this._map.latLngToLayerPoint(this.getMiddleLatLng());
            }
        }
//        getMinMaxLatLng: function () {
//            var latitudeMax = 0, latitudeMin = this._latlngs[0].lat, longitudeMax = 0, longitudeMin = this._latlngs[0].lng;
//            $.each(this._latlngs, function (index, value) {
//                latitudeMax = Math.max(latitudeMax, value.lat);
//                latitudeMin = Math.min(latitudeMin, value.lat);
//                longitudeMax = Math.max(longitudeMax, value.lng);
//                longitudeMin = Math.min(longitudeMax, value.lng);
//            });
//            console.log(L.latLng((latitudeMax + latitudeMin) / 2, (longitudeMax + longitudeMin) / 2));
//            return {min: L.latLng(latitudeMin, longitudeMin), max: L.latLng(latitudeMax, longitudeMax)};
////            return this._latlngs[0];
//        }
    });
}(L));