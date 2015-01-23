/*
 * L.Handler.MarkerDrag is used internally by L.Label to make the svg draggable.
 */
"use strict";
L.DraggableCanvas = L.Draggable.extend({
    _updatePosition: function () {
        this.fire('predrag');
        this._canvas.setLayerPosition(this._newPos);
        this.fire('drag');
    },
    setElement: function (canvas) {
        this._canvas = canvas;
    },
    _onDown: function (e) {
        if (this._canvas.inImage(e)) {
            L.Draggable.prototype._onDown.call(this, e);
        }
    }
});
L.Handler.CanvasDrag = L.Handler.extend({
    initialize: function (canvas) {
        this._canvas = canvas;
    },

    addHooks: function () {
        var container = this._canvas._canvas;
        if (!this._draggable) {
            this._draggable = new L.DraggableCanvas(container, this._canvas._map._panes.overlayPane)
                .on('dragstart', this._onDragStart, this)
                .on('drag', this._onDrag, this)
                .on('dragend', this._onDragEnd, this);
            this._draggable.setElement(this._canvas);
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
        this._canvas
            .fire('movestart')
            .fire('dragstart');
    },

    _onDrag: function () {
        var canvasElement = this._canvas,
            canvasElementPosition = L.DomUtil.getPosition(canvasElement._canvas),
            latlng = canvasElement._map.layerPointToLatLng(canvasElementPosition);

        canvasElement._latlng = latlng;

        canvasElement
            .fire('move', {latlng: latlng})
            .fire('drag');
    },

    _onDragEnd: function () {
        this._canvas
            .fire('moveend')
            .fire('dragend');
    }
});
