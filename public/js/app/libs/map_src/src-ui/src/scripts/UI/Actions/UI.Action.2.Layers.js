/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    Gis.UI.Action.Layers = G.UI.Action.extend({
        _type: 'layers',
        _ui: undefined,
        _zoomBounds: undefined,
        _selectType: 'layers',
        _classMapLayers: "gis-map-layers",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(true);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapLayers);
            this._widget = G.Widget.layersProperty();
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.removeWidget(this._widget);
            G.UI.Action.prototype._disable.call(this);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapLayers);
        }
    });
    Gis.UI.Action.layers = function (ui, data) {
        var layers = G.UI.ActionController.getAction('layers');
        if (layers) {
            layers.setData(data);
            return layers;
        }
        return new Gis.UI.Action.Layers(ui, data);
    };
}(Gis));