"use strict";
/**
 * @class
 * @classdesc
 * Текстовая метка
 * @param {Object} options
 * @param {number} options.latitude широта
 * @param {number} options.longitude долгота
 * @param {string} [options.tacticObjectType='text'] тип
 * @param {GUID} [options.id] GUID
 * @param {boolean} [options.selectable=false]
 * @param {boolean} [options.draggable=false]
 * @param {string} [options.foreColor='#FFFFFF'] Цвет текста
 * @param {string} [options.backColor='#AB1D4A'] Цвет фона
 * @param {string} [options.className]
 * @param {boolean} [options.drawPoint=true] Рисовать точку
 * @param {string} [options.position='centerright'] смещение относительно точки [topleft, topcenter, topright, centerleft, center, centerright, bottomleft, bottomcenter, bottomright]
 * @example
 * var a = Gis.textLabel({
     *      selectable: true,
     *      id: Gis.Util.generateGUID(),
     *      latitude: 59.96600,
     *      longitude: 29.92675,
     *      icon: {type: 'plane', color: 'red'},
     *      tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
     *      caption: "Example caption"
     * }).addTo(gisMap)
 * @extends Gis.Objects.Selectable
 */
Gis.Objects.TextLabel = Gis.Objects.Selectable.extend(
    /** @lends Gis.Objects.TextLabel# */
    {
        events: Gis.Core.Events.availableDomEvents,
        required: ['id', 'latitude', 'longitude', 'caption'],
        fixed: 'id tacticObjectType',
        options: {
            tacticObjectType: 'text',
            id: undefined,
            latitude: undefined,
            longitude: undefined,
            selectable: undefined,
            draggable: undefined,
            foreColor: '#FFFFFF',
            backColor: '#AB1D4A',
            position: 'centerright',
            className: undefined,
            drawPoint: true
        },
        optionsFire: [
            'tacticObjectType',
            'id',
            'latitude',
            'longitude',
            'caption',
            'tags',
            'selectable',
            'draggable',
            'foreColor',
            'backColor',
            'name',
            'caption',
            'customActions',
            'tooltip'
        ],
        /**
         *
         * @return {string|undefined}
         */
        getText: function () {
            return this.getOption('caption');
        },
        /**
         *
         * @param original
         * @return {string}
         */
        getBackColor: function (original) {
            return original ? this.options.backColor : this.getOption('backColor');
        },
        /**
         *
         * @return {boolean|undefined}
         */
        isDraggable: function () {
            return this.getOption('draggable');
        },
        onAdd: function (map) {
            Gis.Objects.Selectable.prototype.onAdd.call(this, map);
            this.on("drag", this._onDrag, this);
            this.on("dragend", this._onDragEnd, this);
        },
        _removePoint: function () {
            if (this._point) {
                this._point.off('drag', this._pointDrag, this);
                this._point.off('dragend', this._pointDrag, this);
                if (this._map.getLayer(this._point.getId())) {
                    this._map.removeLayer(this._point);
                }
            }
        },
        onDelete: function (map) {
            this._removePoint();
            this.off("drag", this._onDrag, this);
            this.off("dragend", this._onDragEnd, this);
            Gis.Objects.Selectable.prototype.onDelete.call(this, map);
        },
        _dragCalculate: function (event, fireEvent) {
            this._dragged = true;
            this.options.latitude = event.latLng.latitude;
            this.options.longitude = event.latLng.longitude;
            this.fire('change', {
                target: this,
                rows: ['latitude', 'longitude'],
                notFireToServer: !fireEvent
            });
        },
        _onDrag: function (event) {
            this._dragCalculate(event, false);
        },
        _onDragEnd: function (event) {
            this._dragCalculate(event, true);
        },
        _pointDrag: function () {
            this.setData({
                latitude: this._point.getLatLng()[0],
                longitude: this._point.getLatLng()[1]
            });
        },
        _pointSelected: function (e) {
            var layer = e.layer;
            if (layer === this._point) {
                this._map.setSelected(this);
            }
        },
        _addPoint: function () {
            var options = Gis.Util.extend({}, this.options, this.getStyle());
            if (!this._point) {
                this._point = Gis.imageLabel({
                    id: Gis.Util.generateGUID(),
                    tacticObjectType: this.getType(),
                    latitude: options.latitude,
                    longitude: options.longitude,
                    draggable: options.draggable && this.isThisEventable(),
                    selectable: options.selectable && this.isThisEventable(),
                    icon: {type: 'circle', width: 10, color: this.getBackColor()}
                });
                this._point.setCountable(false);
                this._point.setControllableByServer(false);
                this._point.on('drag', this._pointDrag, this);
                this._point.on('dragend', this._pointDrag, this);
            } else {
                this._point.setData({
                    latitude: options.latitude,
                    longitude: options.longitude,
                    draggable: options.draggable && this.isThisEventable(),
                    selectable: false,
                    icon: {type: 'circle', width: 10, color: this.getBackColor()}
                });
            }
            if (!this._map.getLayer(this._point.getId())) {
                this._point.addTo(this._map);
            }
        },
        getName: function () {
            return Gis.Objects.Selectable.prototype.getName.call(this) || this.getOption('caption');
        },
        draw: function (map) {
            if (!this.preDraw()) {
                return;
            }
            if (Gis.Util.isNumeric(this.options.latitude) && Gis.Util.isNumeric(this.options.longitude)) {
                Gis.Objects.Selectable.prototype.draw.call(this, map);
                var options = this.getOptionsWithStyle();
                this._lowLevelObject = map.drawText(Gis.Util.extend({}, options, {
                    latlng: this.getLatLng(),
                    draggable: options.draggable && this.isThisEventable(),
                    selectable: options.selectable && this.isThisEventable(),
                    popup: options.tooltip,
                    selected: this._selected,
                    //throw available events to top api
                    events: {
                        type: this.events,
                        callback: this.fireEventsFromLowLevel,
                        context: this
                    }
                }), this._lowLevelObject);
                if (this.options.drawPoint) {
                    this._addPoint();
                } else {
                    this._removePoint();
                }
            }
        },
        /**
         *
         * @return {Gis.LatLngBounds|undefined}
         */
        getCurrentLatLngBounds: function () {
            return this._map.getObjectBounds(this._lowLevelObject.label);
        },
        /**
         *
         * @return {number[]}
         */
        getLatLng: function () {
            return [parseFloat(this.options.latitude), parseFloat(this.options.longitude)];
        }
    }
);
Gis.textLabel = function (data) {
    return new Gis.Objects.TextLabel(data);
};
Gis.ObjectFactory.list.text = Gis.Objects.TextLabel;
