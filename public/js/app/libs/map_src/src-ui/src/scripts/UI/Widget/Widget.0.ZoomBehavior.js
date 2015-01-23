/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.Widget.ZoomBehavior = {
        getConvertedZoom: function () {
            return this._containerController.getUIAttached().getMap().getZoom();
        },
        _getZoomValues: function () {
            var data = [],
                map = this._containerController.getUIAttached().getMap(),
                min = map.getMinZoom(),
                max = map.getMaxZoom(),
                current;
            for (current = max; current >= min; current -= 1) {
                data.push({
                    val: current,
                    name: current
                });
            }
            return data;
        }
    };

}(Gis));