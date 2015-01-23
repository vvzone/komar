/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    Gis.UI.Action.Relief = G.UI.Action.extend({
        _type: 'relief',
        _ui: undefined,
        _zoomBounds: undefined,
        _selectType: 'relief',
        _classMapRelief: "gis-map-relief",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(true);
            this._ui.getMap().filterSelect(this._selectType);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapRelief);
            this._widget = G.Widget.reliefProperty();
            this._ui.addWidget(this._widget);
            this._ui.hideAll(this._widget);
        },
        _disable: function () {
            this._ui.removeWidget(this._widget);
            G.UI.Action.prototype._disable.call(this);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapRelief);
            this._ui.showAll();
        }
    });
    Gis.UI.Action.relief = function (ui, data) {
        var relief = G.UI.ActionController.getAction('relief');
        if (relief) {
            relief.setData(data);
            return relief;
        }
        return new Gis.UI.Action.Relief(ui, data);
    };
}(Gis));