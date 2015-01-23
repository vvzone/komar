/*
 * Расширяет L.Marker возможностью вращать
 */

(function (L) {
    "use strict";
    L.ImageOverlay.include({
        setBounds: function (bounds) {
            this._bounds = L.latLngBounds(bounds);
            this._reset();
        },
        setUrl: function (url) {
            this._url = url;
            this._reset();
        }
    });
}(L));
