/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Polyton = G.UI.Action.extend({
        _type: 'polygon',
        _selectType: 'polygon',
        _ui: undefined,
        _zoomBounds: undefined,
        _classMapPolyton: "gis-map-polygon",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(false);
            this._ui.getMap().filterSelect(this._selectType);
            Gis.UI.enableTextSelection(this._ui.getMap().getMapContainer());
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapPolyton);
            this._widget = G.Widget.polygonProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.removeWidget(this._widget);
            G.UI.Action.prototype._disable.call(this);
            Gis.UI.disableTextSelection(this._ui.getMap().getMapContainer());
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapPolyton);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.polygon = function (ui, data) {
        var polygon = G.UI.ActionController.getAction('polygon');
        if (polygon) {
            polygon.setData(data);
            return polygon;
        }
        return new G.UI.Action.Polyton(ui, data);
    };
}(Gis));