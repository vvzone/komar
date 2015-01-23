'use strict';
/**
 * @class
 * @classdesc
 * Маршрут
 * @param {Object} options
 * @param {string} [options.tacticObjectType='path'] тип
 * @param {boolean} [options.isCycle=false] закмнутый маршрут
 * @param {boolean} [options.orthodrome=false] ребра-ортодромии
 * @example
 * var a = Gis.path({
     *      selectable: true,
     *      id: Gis.Util.generateGUID(),
     *      points: [{latitude: 59.96600, longitude: 29.92675}, {latitude: 58.96600, longitude: 29.95675}, {latitude: 58.36600, longitude: 30.12675}],
     *      tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
     *      caption: "Example caption"
     * }).addTo(gisMap)
 * @example Ортодромии на ребрах
 * var a = Gis.path({
     *      selectable: true,
     *      id: Gis.Util.generateGUID(),
     *      points: [{latitude: 59.96600, longitude: 29.92675}, {latitude: 58.96600, longitude: 29.95675}, {latitude: 58.36600, longitude: 30.12675}],
     *      tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
     *      caption: "Example caption",
     *      orthodrome: true,
     *      line: {color: "white"}
     * }).addTo(gisMap)
 * @extends Gis.Objects.Polyline
 */
Gis.Objects.Path = Gis.Objects.Polyline.extend(
    /** @lends Gis.Objects.Path# */
    {
        _isCached: true,
        events: Gis.Core.Events.availableDomEvents,
        fixed: 'id tacticObjectType',
        required: ['id', 'points'],
        options: {
            tacticObjectType: 'path',
            id: undefined,
            isCycle: false,
            //Unoficial
            orthodrome: undefined
        },

        optionsFire: [
            'tacticObjectType',
            'id',
            'points',
            'line',
            'isCycle',
            'tags',
            'icon',
            'selectable',
            'draggable',
            'name',
            'caption',
            'customActions',
            'tooltip'
        ],
        /**
         * Цвет линии
         * @param {boolean} [original=false] минуя стили
         * @return {*|string}
         */
        getColor: function (original) {
            return Gis.lineStyle(original ? this.options.line : this.getOption('line')).getColor();
        },
        /**
         * @override
         * @param idx
         */
        _drawPointMarker: function (idx) {
            var oldSelected, changed, marker, data;
            marker = this.getMarkersArray()[idx];
            if (marker) {
                oldSelected = marker.isSelected();
                data = {
                    draggable: this._iconDraggable && this.isThisEventable() && marker.isDraggable(),
                    selectable: this._iconSelectable && this.isThisEventable()
                };
                marker.setSelected(this._selected && this._selectedAdditional && this._selectedAdditional.markerKey === idx);
                changed = marker.setData(data);

                if (!this._map.hasLayer(marker)) {
                    marker.addTo(this._map);
                    marker.on(this._markerEvents, this._markerEvent, marker);
                } else if (!changed && oldSelected !== marker.isSelected()) {
                    marker.fire('change');
                }
            }
        },
        getOrthodromeArray: function (step) {
            return this._getLatLngArray(
                this.getLatitudes(),
                this.getLongitudes(),
                this.getOptionsWithStyle().orthodrome,
                step
            );
        },
        draw: function (map) {
            var options;
            if (!map || !this.preDraw()) {
                return;
            }
            this._latLngDraw = undefined;
            if (this.getOption('points') && this.getOption('points').length) {
                this._lowLevelObject = this._lowLevelObject || {inset: true};
                options = this.getOptionsWithStyle();
                this._lowLevelObject.line = map.drawPolyline(
                    Gis.Util.extend({}, options, {
                        latlng: this.getOrthodromeArray(),
                        drawIcon: false,
                        line: this.getLineStyle(),
                        draggable: options.draggable && this.isThisEventable(),
                        selectable: options.selectable && this.isThisEventable(),
                        //throw available events to top api

                        events: {
                            type: this.events,
                            callback: this.fireEventsFromLowLevel,
                            context: this
                        }
                    }),
                    this._lowLevelObject && this._lowLevelObject.line
                );
                Gis.Objects.Polyline.prototype.draw.call(this, map);
            } else if (this._lowLevelObject) {
                map.removeLayer(this._lowLevelObject);
            }
        }
    }
);
Gis.Objects.Path.CoordinateTypeFull = 1;
Gis.Objects.Path.CoordinateTypeLatitudes = 2;
Gis.Objects.Path.CoordinateTypeLongitudes = 3;
/**
 * Возвращает новый объект маршрута
 * @param data
 * @returns {Gis.Objects.Path}
 */
Gis.path = function (data) {
    return new Gis.Objects.Path(data);
};
Gis.ObjectFactory.list.path = Gis.Objects.Path;
