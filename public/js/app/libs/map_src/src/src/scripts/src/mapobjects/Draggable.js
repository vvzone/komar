(function (G) {
    "use strict";
    /**
     * Base class for all map objects
     */
    Gis.Objects.Draggable = {
        onAdd: function (e) {
            G.Objects.Base.prototype.onAdd.apply(this, arguments);
            this.on("drag", this._onDrag, this);
            this.on("dragend", this._onDragEnd, this);
        },
        onDelete: function (e) {
            G.Objects.Base.prototype.onDelete.apply(this, arguments);
            this.off("drag", this._onDrag, this);
            this.off("dragend", this._onDragEnd, this);
        },
        options: {
            draggable: false
        },
        isDraggable: function () {
            return this.options.draggable;
        }
    };
}(Gis));