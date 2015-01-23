/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Sector = G.UI.Action.extend({
        _type: 'sector',
        _selectType: 'sector',
        _classMapSector: "gis-map-sector",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(false);
            this._ui.getMap().clearSelectedOnClick(false);
            Gis.UI.disableTextSelection(this._ui.getMap().getMapContainer());
            this._ui.getMap().filterSelect(G.UI.Action.Sector.type);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapSector);
            this._widget = G.Widget.sectorProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.removeWidget(this._widget);
            Gis.UI.enableTextSelection(this._ui.getMap().getMapContainer());
            G.UI.Action.prototype._disable.call(this);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapSector);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.Sector.type = 'sector';
    G.UI.Action.sector = function (ui, data) {
        var sector = G.UI.ActionController.getAction('sector');
        if (sector) {
            sector.setData(data);
            return sector;
        }
        return new G.UI.Action.Sector(ui, data);
    };
}(Gis));