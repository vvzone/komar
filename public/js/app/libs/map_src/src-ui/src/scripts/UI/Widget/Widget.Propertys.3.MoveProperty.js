"use strict";
/**
 *
 * @class
 * @extends Gis.Widget.ZoomProperty
 */
Gis.Widget.MoveProperty = Gis.Widget.ZoomProperty.extend(
    /**
     * @lends Gis.Widget.MoveProperty.prototype
     */
    {
        _type: 'move'
    });
Gis.Widget.moveProperty = function (data) {
    return new Gis.Widget.MoveProperty(data);
};