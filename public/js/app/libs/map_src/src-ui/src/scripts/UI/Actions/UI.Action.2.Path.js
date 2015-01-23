/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Path = G.UI.Action.extend({
        _type: 'path',
        _selectType: 'path',
        _ui: undefined,
        _zoomBounds: undefined,
        _classMapPath: "gis-map-path",
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().clearSelectedOnClick(false);
            this._ui.getMap().setDraggableEnabled(false);
            this._ui.getMap().filterSelect(this._selectType);
            Gis.UI.enableTextSelection(this._ui.getMap().getMapContainer());
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapPath);
            this._widget = G.Widget.pathProperty({
                dataBinded: this.options.dataBinded
            });
            this._ui.addWidget(this._widget);
        },
        _disable: function () {
            this._ui.getMap().clearSelectedOnClick(true);
            this._ui.removeWidget(this._widget);
            G.UI.Action.prototype._disable.call(this);
            Gis.UI.disableTextSelection(this._ui.getMap().getMapContainer());
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapPath);
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.path = function (ui, data) {
        var path = G.UI.ActionController.getAction('path');
        if (path) {
            path.setData(data);
            return path;
        }
        return new G.UI.Action.Path(ui, data);
    };
}(Gis));