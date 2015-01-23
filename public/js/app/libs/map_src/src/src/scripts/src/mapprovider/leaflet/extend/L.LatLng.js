/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
(function (L) {
    'use strict';
    L.LatLng.prototype.abs = function () {
        return L.latLng(Math.abs(this.lat), Math.abs(this.lng));
    };
}(L));