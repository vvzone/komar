"use strict";
L.Map.include({
    _labels: {},
    showLabel: function (label) {

        var layerId = L.stamp(label);
        this._labels[layerId] = label;

        return this
            .addLayer(label)
            .fire('layerOpen', {popup: label});
    },

    closeLabel: function (label) {
        var layerId = L.stamp(label);
        if (this._labels[layerId]) {
            this._labels[layerId]._close();
            this.removeLayer(label);
            delete this._labels[layerId];
        }
        return this;
    }
});