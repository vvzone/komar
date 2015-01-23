/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Geo = G.UI.Action.extend({
        _type: 'geo',
        _selectType: 'geo',
        _classMapObject: "gis-map-geo",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(true);
            this._ui.getMap().filterSelect(this._selectType);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapObject);
            this._widget = G.Widget.geoProperty({
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
    G.UI.Action.geo = function (ui, data) {
        var object = G.UI.ActionController.getAction('geo');
        if (object) {
            object.setData(data);
            return object;
        }
        return new G.UI.Action.Geo(ui, data);
    };
}(Gis));