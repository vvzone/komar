/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
L.HatchClass = L.Class.extend({
    options: {
        color: undefined,
        style: undefined
    },
    initialize: function (style, color) {
        this.options.color = color;
        this.options.style = style;
    },
    getColor: function () {
        return this.options.color;
    },
    getStyle: function () {
        return this.options.style;
    },
    compare: function (hatch) {
        if (this._compareStyle(hatch)) {
            if (!this._compareColor(hatch)) {
                return L.HatchClass.COLOR_CHANGED;
            }
            return L.HatchClass.NOTHING_CHANGED;
        }
        return L.HatchClass.CHANGED;

    },
    _compareStyle: function (hatch) {
        return this.options.style === hatch.getStyle();
    },
    _compareColor: function (hatch) {
        return this.options.style === hatch.getColor();
    },
    isHatch: function () {
        return this.options.style !== undefined && this.options.style !== false;
    }
});

L.HatchClass.COLOR_CHANGED = -1;
L.HatchClass.NOTHING_CHANGED = 0;
L.HatchClass.CHANGED = 1;