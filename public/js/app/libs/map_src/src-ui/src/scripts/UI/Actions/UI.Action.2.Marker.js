/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Marker = G.UI.Action.extend({
        _type: 'marker',
        _selectType: 'text',
        _classMapMarker: "gis-map-marker",
        execute: function () {
            if (!this._executed) {
                this._ui.getMap().filterSelect(G.UI.Action.Marker.type);
                G.UI.Action.prototype.execute.call(this);
                this._ui.getMap().setDraggableEnabled(false);
                $(this._ui.getMap().getMapContainer()).addClass(this._classMapMarker);
                this._widget = G.Widget.markerProperty({
                    dataBinded: this.options.dataBinded
                });
                this._ui.addWidget(this._widget);
            }
        },
        _disable: function () {
            if (this._executed) {
                this._ui.removeWidget(this._widget);
                G.UI.Action.prototype._disable.call(this);
                $(this._ui.getMap().getMapContainer()).removeClass(this._classMapMarker);
                this.options.dataBinded = undefined;
            }
        }
    });
    G.UI.Action.Marker.type = 'text';
    G.UI.Action.marker = function (ui, data) {
        var marker = G.UI.ActionController.getAction('marker');
        if (marker) {
            marker.setData(data);
            return marker;
        }
        return new G.UI.Action.Marker(ui, data);
    };
}(Gis));