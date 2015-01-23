/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Custom = G.UI.Action.extend({
        options: {
            useCache: false,
            className: undefined
        },
        _type: 'custom',
        _selectType: 'custom',
        execute: function () {
            G.UI.Action.prototype.execute.call(this);
            this._ui.getMap().setDraggableEnabled(true);
            if (this.options.className) {
                $(this._ui.getMap().getMapContainer()).addClass(this.options.className);
            }
            this.fire('executed');
        },
        _update: function () {
        },
        _disable: function () {
            G.UI.Action.prototype._disable.call(this);
            if (this.options.className) {
                $(this._ui.getMap().getMapContainer()).removeClass(this.options.className);
            }
            this.fire('disabled');
            this.options.dataBinded = undefined;
        }
    });
    G.UI.Action.Custom.type = 'custom';
    G.UI.Action.custom = function (ui, data) {
        return new G.UI.Action.Custom(ui, data);
    };
}(Gis));