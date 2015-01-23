/*
 * L.Handler.MarkerDrag is used internally by L.Label to make the svg draggable.
 */
"use strict";
L.DraggableSvg = L.Draggable.extend({
    _updatePosition: function () {
        this.fire('predrag');
        this._svgElement.setLayerPosition(this._newPos);
        this.fire('drag');
    },
    setElement: function (ellipse) {
        this._svgElement = ellipse;
    }
});
L.Handler.SvgDrag = L.Handler.extend({
    initialize: function (element) {
        this._svgElement = element;
    },

    addHooks: function () {
        var container = this._svgElement._container;
        if (!this._draggable) {
            this._draggable = new L.DraggableSvg(container, container)
                .on('dragstart', this._onDragStart, this)
                .on('drag', this._onDrag, this)
                .on('dragend', this._onDragEnd, this);
            this._draggable.setElement(this._svgElement);
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
        this._svgElement
            .fire('movestart')
            .fire('dragstart');
    },

    _onDrag: function () {
        var svgElement = this._svgElement,
            svgElementPosition = L.DomUtil.getPosition(svgElement._container),
            latlng = svgElement._map.layerPointToLatLng(svgElementPosition);

        svgElement._latlng = latlng;

        svgElement
            .fire('move', {latlng: latlng})
            .fire('drag');
    },

    _onDragEnd: function () {
        this._svgElement
            .fire('moveend')
            .fire('dragend');
    }
});
