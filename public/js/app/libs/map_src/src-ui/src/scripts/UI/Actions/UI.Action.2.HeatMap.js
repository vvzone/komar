/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.HeatMap = G.UI.Action.extend({
        _type: 'heatmap',
        _selectType: 'heatmap',
        _classMapHeatMap: "gis-map-heatmap",
        execute: function () {
            this._ui.getMap().clearSelectedOnClick(false);
            Gis.UI.disableTextSelection(this._ui.getMap().getMapContainer());
            this._ui.getMap().filterSelect(G.UI.Action.HeatMap.type);
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(false);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapHeatMap);
            this._widget = G.Widget.heatMapProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _update: function () {
        },
        _disable: function () {
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.removeWidget(this._widget);
            Gis.UI.enableTextSelection(this._ui.getMap().getMapContainer());
            G.UI.Action.prototype._disable.call(this);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapHeatMap);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.HeatMap.type = 'heatmap';
    G.UI.Action['heatmap'] = function (ui, data) {
        var heatmap = G.UI.ActionController.getAction('heatmap');
        if (heatmap) {
            heatmap.setData(data);
            return heatmap;
        }
        return new G.UI.Action.HeatMap(ui, data);
    };
}(Gis));