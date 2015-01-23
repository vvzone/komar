/*
 *
 */

(function (L) {
    "use strict";
    L.DomUtil.setRotate = function (el, angle) {
        el.style[L.DomUtil.TRANSFORM] = el.style[L.DomUtil.TRANSFORM].replace(/rotate[3d]*\([0, 0, 1, ]*[\d+\.*\d*]+deg\)/g, '') + L.DomUtil.getRotateString(angle);
    };
    L.DomUtil.getRotateString = function (angle) {
        var is3d = L.Browser.webkit3d,
            open = 'rotate' + (is3d ? '3d' : '') + '(' + (is3d ? '0,0,1,' : '');

        return open + angle + 'deg)';
    };
}(L));
