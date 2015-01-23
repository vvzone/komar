'use strict';
/**
 * @description
 * Company: ООО Специальные Программные Решения
 * @class
 * @extends Gis.BaseClass
 */
Gis.CustomSRS = Gis.BaseClass.extend(
    /** @lends Gis.CustomSRS.prototype */{
    options: {
        code: undefined,
        proj4def: undefined,
        projectedBounds: undefined,
        options: undefined
    },
    processTMS: function () {
        if (this.options.projectedBounds && this.options.projectedBounds.indexOf('merc') >= 0) {
//            Proj4js.transform('');
        }
    },
    initialize: function(code, proj4def, projectedBounds, options, tms) {
        this.options.code = code;
        this.options.proj4def = proj4def;
        this.options.projectedBounds = projectedBounds;
        this.options.options = options;
        Gis.BaseClass.prototype.initialize.call(this);
        if (tms) {
            this.processTMS();
        }
    },
    getCode: function () {
        return this.options.code;
    },
    getProj4def: function () {
        return this.options.proj4def;
    },
    getProjectedBounds: function () {
        return this.options.projectedBounds;
    },
    getOptions: function () {
        return this.options.options;
    }
});
Gis.customSRS = function (code, proj4def, projectedBounds, options) {
    return new Gis.CustomSRS(code, proj4def, projectedBounds, options);
};