/*
 * L.Handler.MarkerDrag is used internally by L.Label to make the label draggable.
 */
"use strict";
L.Handler.LabelDrag = L.Handler.extend({
    initialize: function (label) {
        this._label = label;
    },

    addHooks: function () {
        var container = this._label._container;
        if (!this._draggable) {
            this._draggable = new L.Draggable(container, container)
                .on('dragstart', this._onDragStart, this)
                .on('drag', this._onDrag, this)
                .on('dragend', this._onDragEnd, this);
        }
        this._draggable.enable();
    },

    removeHooks: function () {
        this._draggable.disable();
    },

    moved: function () {
        return this._draggable && this._draggable._moved;
    },

    _onDragStart: function () {
        this._label
            .fire('movestart')
            .fire('dragstart');
    },

    _onDrag: function () {
        var label = this._label,
            labelPosOrigin = L.DomUtil.getPosition(label._container),
            labelPos = labelPosOrigin.subtract(label._calculatedOffset),
            latlng = label._map.layerPointToLatLng(labelPos);

        label._latlng = latlng;

        label
            .fire('move', {latlng: latlng})
            .fire('drag', {latlng: latlng});
    },

    _onDragEnd: function () {
        this._label
            .fire('moveend')
            .fire('dragend');
    }
});
