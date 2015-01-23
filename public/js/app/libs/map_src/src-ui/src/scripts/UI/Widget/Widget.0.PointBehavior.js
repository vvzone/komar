"use strict";
Gis.Widget.PointBehavior = {
    _attachPointDataToRow: function ($row, data, force) {
        if (data) {
            if (!$row.data('point') || force) {
                if (!data.getId) {
                    Gis.Util.extend(data, {id: Gis.Util.generateGUID()});
                }
                $row.data('point', Gis.pathPoint(Gis.Util.extend(data, {forcePaint: true})));
            }
        } else {
            $row.data('point', null);
        }
    },
    _detachPointDataFromRow: function ($row) {
        this._attachPointDataToRow($row, null)
    },
    _detachPointDataFromAllRows: function () {
        var self = this;
        $('#points-selector li', this._$div).each(function () {
            self._detachPointDataFromRow($(this));
        });
    },
    _getPoint: function ($row) {
        return $row.data('point');
    }
};