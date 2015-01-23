/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.AreaRelief = G.UI.Action.extend({
        _type: 'areal-relief',
        _selectType: 'areal-relief',
        _classMapObject: "gis-map-areal-relief",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().filterSelect(this._selectType);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapObject);
            this._widget = G.Widget.areaReliefProperty({
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
    G.UI.Action['areal-relief'] = function (ui, data) {
        var object = G.UI.ActionController.getAction('areal-relief');
        if (object) {
            object.setData(data);
            return object;
        }
        return new G.UI.Action.AreaRelief(ui, data);
    };
}(Gis));