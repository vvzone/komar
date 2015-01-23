"use strict";
/**
 *
 * @class
 * @extends Gis.Widget.PolylineProperty
 */
Gis.Widget.PolygonProperty = Gis.Widget.PolylineProperty.extend(
    /**
     * @lends Gis.Widget.PolygonProperty.prototype
     */
    {
        _typeSelector: true,
        _type: 'polygon',
        _minimalPoints: 3,

        _clearPolyline: function () {
            Gis.UI.DeleteActions.polygon.call(this);
        },
        _drawPolyline: function () {
            var lineStyle, fillStyle, style;
            style = Gis.Util.extend(this._defaultStyle, this._containerController.getUIAttached().getStyle('polygon'));
            lineStyle = {color: style.color, border: style.border, thickness: style.thickness};
            fillStyle = {color: this.getSelectedColor()};
            style.icon.color = this.getSelectedColor();
            if (!this.options.dataBinded) {
                this.options.dataBinded = Gis.polygon(Gis.Util.extend({id: Gis.Util.generateGUID(), fill: fillStyle, line: lineStyle, draggable: true, selectable: true, icon: style.icon, points: this._getPathPoints(), tags: {style: this.getSelectedStyle()}}));
                this.options.dataBinded.setSelectedStyle(Gis.Util.extend({}, lineStyle, {border: style.selectedBorder}));
            } else {
                this.options.dataBinded.setSelectedStyle(Gis.Util.extend({},
                    {color: this.options.dataBinded.getLineColor(), border: style.selectedBorder, thickness: lineStyle.thickness}));
                this.options.dataBinded.setData(Gis.Util.extend({}, {fill: fillStyle, icon: style.icon, points: this._getPathPoints(), tags: {style: this.getSelectedStyle()}}));
            }
            if (!this._containerController.getUIAttached().getMap().hasLayer(this.options.dataBinded)) {
                this.options.dataBinded.addTo(this._containerController.getUIAttached().getMap());
                this._containerController.getUIAttached().getMap().selectLayer(this.options.dataBinded);
            }
            this._initPolylineEvents();
        }
    });

Gis.UI.DeleteActions.polygon = function (e, dataBinded) {
    this._deleteLayerConfirm({
        title: 'Вы действительно хотите удалить полигон?',
        callback: function () {
            this.removeLayerFromMap(dataBinded || this.options.dataBinded);
        },
        context: this,
        id: 'polygon-remove-dialog'
    }, dataBinded);
};
Gis.Widget.polygonProperty = function (data) {
    return new Gis.Widget.PolygonProperty(data);
};