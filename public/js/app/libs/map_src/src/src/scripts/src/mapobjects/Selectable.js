"use strict";
/**
 * @class
 * @classdesc
 * Базовый класс для выделяемых объектов
 * @param {Object} options
 * @param {boolean} [options.selectable=false] можно ли выделять
 * @extends Gis.Objects.Base
 */
Gis.Objects.Selectable = Gis.Objects.Base.extend(
    /** @lends Gis.Objects.Selectable# */
    {
        _selectedAdditional: undefined,
        options: {
            selectable: undefined
        },
        isSelected: function () {
            return this._selected;
        },
        initialize: function (data) {
            Gis.Objects.Base.prototype.initialize.call(this, data);
            this._selectedLine = Gis.lineStyle({
                color: "red",
                border: 'rgb(75, 84, 255)'
            });
        },
        /**
         * @param {Gis.Additional.LineStyle} lineStyle
         * */
        setSelectedStyle: function (lineStyle) {
            this._selectedLine = lineStyle && Gis.lineStyle(lineStyle);
        },
        setSelected: function (selected) {
            var additional;
            this._selected = selected;
            if (selected) {
                this.fire('selected', {additional: this._selectedAdditional});
            } else {
                additional = this._selectedAdditional;
                this._selectedAdditional = undefined;
                this.fire('unselected', {additional: additional});
            }
        },
        getLineStyle: function () {
            var lineStyle = Gis.lineStyle(this.getOption('line'));
            return (this._selected && this._selectedLine) ?
                Gis.lineStyle(Gis.Util.extend({}, {
                    color: lineStyle.getColor(),
                    border: this._selectedLine.getBorder(),
                    thickness: lineStyle.getThickness()
                })) : lineStyle;
        },
        _onClick: function (event) {
            if (this.isSelectable()) {
                if (!this._dragged) {
                    this.fire('select', Gis.Util.extend(event, {target: this, addToSelection: event.originalEvent.ctrlKey}));
                }
            }
            this._dragged = false;
        },
        onAdd: function (map) {
            Gis.Objects.Base.prototype.onAdd.call(this, map);
            this.on("click", this._onClick, this);
        },
        onDelete: function () {
            Gis.Objects.Base.prototype.onDelete.apply(this, arguments);
            this.off('click', this._onClick, this);
        },
        isSelectable: function () {
            return this.options.selectable;
        }
    }
);
