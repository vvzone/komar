/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Measure = G.UI.Action.extend({
        _type: 'measure',
        _ui: undefined,
        _zoomBounds: undefined,
        _selectType: 'measurer',
        _classMapMeasure: "gis-map-measuring",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(false);
            this._ui.getMap().filterSelect(this._selectType);
            Gis.UI.enableTextSelection(this._ui.getMap().getMapContainer());
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapMeasure);
            this._widget = G.Widget.measureProperty();
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.removeWidget(this._widget);
            G.UI.Action.prototype._disable.call(this);
            Gis.UI.disableTextSelection(this._ui.getMap().getMapContainer());
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapMeasure);
        }
    });
    G.UI.Action.measure = function (ui, data) {
        var measure = G.UI.ActionController.getAction('measure');
        if (measure) {
            measure.setData(data);
            return measure;
        }
        return new G.UI.Action.Measure(ui, data);
    };
}(Gis));