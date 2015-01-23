/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Select = G.UI.Action.extend({
        _type: 'select',
        _classMapSelecting: "gis-map-selecting",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.getMap().setDraggableEnabled(true);
            Gis.UI.enableTextSelection(this._ui.getMap().getMapContainer());
            this._ui.getMap().filterSelect(G.ObjectController.FILTER_ALL, true);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapSelecting);
        },
        _disable: function () {
            G.UI.Action.prototype._disable.call(this);
            this._ui.getMap().filterSelect(G.ObjectController.FILTER_NOTHING, true);
            Gis.UI.disableTextSelection(this._ui.getMap().getMapContainer());
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapSelecting);
        }
    });
    G.UI.Action.select = function (ui, data) {
        var select = G.UI.ActionController.getAction('select');
        if (select) {
            select.setData(data);
            return select;
        }
        return new G.UI.Action.Select(ui, data);
    };
}(Gis));