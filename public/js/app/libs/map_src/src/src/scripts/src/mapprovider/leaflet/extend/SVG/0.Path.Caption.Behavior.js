/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
'use strict';
L.PathCaptionBehavior = L.extend({}, L.CaptionBehavior, {
    bindLabel: function (content, options) {
        if (!this._label) {
            options = options || {};
            options.position = 'centerright';
            options.offset = L.point(10, 0);
        }
        L.CaptionBehavior.bindLabel.call(this, content, options);
    },
    getLabelLatLng: function () {
        var lng;

        lng = this._originalPoints[0];
        this._originalPoints.forEach(function (value) {
            if (lng.y < value.y) {
                lng = value;
            }
        });
        return this._map.layerPointToLatLng(lng);
    }
});
