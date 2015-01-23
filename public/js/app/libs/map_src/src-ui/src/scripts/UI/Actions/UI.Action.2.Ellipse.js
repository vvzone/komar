/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Ellipse = G.UI.Action.extend({
        _type: 'ellipse',
        _selectType: 'ellipse',
        _classMapEllipse: "gis-map-ellipse",
        execute: function () {
            this._ui.getMap().clearSelectedOnClick(false);
            Gis.UI.disableTextSelection(this._ui.getMap().getMapContainer());
            this._ui.getMap().filterSelect(G.UI.Action.Ellipse.type);
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(false);
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapEllipse);
            this._widget = G.Widget.ellipseProperty({
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
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapEllipse);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.Ellipse.type = 'ellipse';
    G.UI.Action.ellipse = function (ui, data) {
        var ellipse = G.UI.ActionController.getAction('ellipse');
        if (ellipse) {
            ellipse.setData(data);
            return ellipse;
        }
        return new G.UI.Action.Ellipse(ui, data);
    };
}(Gis));