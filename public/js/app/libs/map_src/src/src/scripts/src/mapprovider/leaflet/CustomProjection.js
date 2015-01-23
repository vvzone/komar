/**
 * Created with JetBrains PhpStorm.
 * Company: ООО Специальные Программные Решения
 */
'use strict';
L.customProjection = function (code, proj4def, projectedBounds, options) {
    return new L.Proj.CRS.TMS(code,
        proj4def,
        projectedBounds,
        options
    );
};