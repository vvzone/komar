"use strict";

Gis.Widget.ListPoints = {
    _skChanged: function (e) {
        var oldSk, oldTmpl, newSk, geoConverter, point, pointOld, $rows, self = this, srcLatLng, srcLatLngTemplated, isPointsAlighnChanged, isMetric, $listRow;
        if (e) {
            geoConverter = this._containerController.getUIAttached().getGeoConverter();
            oldTmpl = e.oldTemplate;
            oldSk = e.oldSk;
            newSk = geoConverter.getSelectedSystem();
            $rows = $('#points-selector li', this._$div);
            isMetric = geoConverter.isMetric(newSk);
            isPointsAlighnChanged = geoConverter.isMetric(oldSk) !== isMetric;
            $rows.each(function () {
                var $markerY = $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_Y_SEPARATED, $(this)), $markerX = $('.' + Gis.Widget.Base.POSITION_VALUE_CLASS_X_SEPARATED, $(this)), attachedPoint = self._getPoint($(this)), valuePoint, dataPoint;
                srcLatLng = attachedPoint && attachedPoint.getLatLng();
                srcLatLngTemplated = srcLatLng && self.coordinateToTemplate(srcLatLng);
                if (isPointsAlighnChanged) {
                    $listRow = $markerX.parents('.point-tag');
                    if (isMetric) {
                        $listRow.insertBefore($markerY.parents('.point-tag'));
                    } else {
                        $listRow.insertAfter($markerY.parents('.point-tag'));
                    }
                }
                point = geoConverter.convert(oldSk, newSk, self.getPointValue($markerX, null, oldSk, oldTmpl), self.getPointValue($markerY, null, oldSk, oldTmpl));
                pointOld = geoConverter.convert(oldSk, newSk, self.getPointValue($markerX, true, oldSk, oldTmpl), self.getPointValue($markerY, true, oldSk, oldTmpl));
                valuePoint = Gis.UI.coordinate(self._rowChanged($markerX) ? point.x : srcLatLngTemplated ? srcLatLngTemplated.x : point.x, self._rowChanged($markerY) ? point.y : srcLatLngTemplated ? srcLatLngTemplated.y : point.y);
                dataPoint = Gis.UI.coordinate(self._rowChanged($markerX) ? pointOld.x : srcLatLngTemplated ? srcLatLngTemplated.x : pointOld.x, self._rowChanged($markerY) ? pointOld.y : srcLatLngTemplated ? srcLatLngTemplated.y : pointOld.y);
                self.setHtmlPointSelectorWidgetData($(this), valuePoint, dataPoint);
            });
        }
        Gis.Widget.Propertys.prototype._skChanged.call(this);
    }
};
