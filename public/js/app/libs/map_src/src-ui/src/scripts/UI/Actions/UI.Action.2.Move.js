/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Move = G.UI.Action.extend({
        _type: 'move',
        _classMapMove: "gis-map-moving",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._oldClearOnClick = this._ui.getMap().isClearOnClick();
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(true);
            this._ui.getMap().filterSelect(G.ObjectController.FILTER_NOTHING, this.options.noUI);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapMove);
            if (!this.options.noUI) {
                this._widget = G.Widget.moveProperty();
                this._ui.addWidget(this._widget);
            }
        },
        _update: function () {
        },
        _disable: function () {
            if (!this.options.noUI) {
                this._ui.removeWidget(this._widget);
            }
            G.UI.Action.prototype._disable.call(this);
            this._ui.getMap().clearSelectedOnClick(this._oldClearOnClick);
            this._ui.getMap().filterSelect(undefined, this.options.noUI);
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapMove);
        }
    });
    G.UI.Action.move = function (ui, data) {
        var move = G.UI.ActionController.getAction('move');
        if (move) {
            move.setData(data);
            return move;
        }
        return new G.UI.Action.Move(ui, data);
    };
}(Gis));