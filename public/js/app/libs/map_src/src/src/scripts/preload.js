/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
(function () {
    'use strict';
    var webkit = navigator.userAgent.match(/AppleWebKit\/(\d+\.\d+)/);
    if (webkit && webkit[1] === '535.22') {
        window.L_DISABLE_3D = true;
    }
}());