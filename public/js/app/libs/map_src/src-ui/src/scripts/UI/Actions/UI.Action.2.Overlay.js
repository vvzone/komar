/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Overlay = G.UI.Action.extend({
        _type: 'overlay',
        _selectType: 'overlay',
        _classMapOverlay: "gis-map-overlay",
        execute: function () {
            this._ui.getMap().clearSelectedOnClick(false);
            Gis.UI.disableTextSelection(this._ui.getMap().getMapContainer());
            this._ui.getMap().filterSelect(G.UI.Action.Overlay.type);
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(false);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapOverlay);
            this._widget = G.Widget.overlayProperty({
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
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapOverlay);
            var firstSelection = this.getFirstSelection();
            if (firstSelection === this.options.dataBinded) {
                this._ui.getMap().clearSelected();
            }
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.Overlay.type = 'overlay';
    G.UI.Action['overlay'] = function (ui, data) {
        var overlay = G.UI.ActionController.getAction('overlay');
        if (overlay) {
            overlay.setData(data);
            return overlay;
        }
        return new G.UI.Action.Overlay(ui, data);
    };
}(Gis));