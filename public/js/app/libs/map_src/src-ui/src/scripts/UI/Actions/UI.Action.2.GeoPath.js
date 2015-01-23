/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.GeoPath = G.UI.Action.extend({
        _type: 'geo-path',
        _selectType: 'geo-path',
        _classMapObject: "gis-map-geo-path",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(true);
            this._ui.getMap().filterSelect(this._selectType);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapObject);
            this._widget = G.Widget.geoPathProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.removeWidget(this._widget);
            this._ui.getMap().clearSelectedOnClick(true);
            G.UI.Action.prototype._disable.call(this);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapObject);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action['geo-path'] = function (ui, data) {
        var object = G.UI.ActionController.getAction('geo-path');
        if (object) {
            object.setData(data);
            return object;
        }
        return new G.UI.Action.GeoPath(ui, data);
    };
}(Gis));