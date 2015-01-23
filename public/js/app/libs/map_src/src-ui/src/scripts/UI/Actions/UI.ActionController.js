/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.ActionController = {
        _list: {},
        _listExecuted: [],
        pushAction: function (action) {
            var type = action.getType();
            if (!this._list[type]) {
                this._list[type] = action;
            }
        },
        _getByLayerType: function (type) {
            var index;
            for (index in this._list) {
                if (this._list.hasOwnProperty(index)) {
                    if (this._list[index]._selectType === type) {
                        return this._list[index];
                    }
                }
            }
        },
        getAction: function (type) {
            var element = this._list[type];
            return element || this._getByLayerType(type);
        },
        getFirstAction: function () {
            return this._list[Object.keys(this._list)[0]];
        },
        pushExecuted: function (action) {
            this._listExecuted.push(action);
        },
        popLastExecuted: function () {
            return this._listExecuted.pop();
        },
        getLastExecuted: function () {
            return this._listExecuted[this._listExecuted.length - 1];
        }
    };
}(Gis));