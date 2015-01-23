'use strict';
/**
 * @class
 * @classdesc
 * Сектор
 * @param {Object} options
 * @param {number} options.latitude широта
 * @param {number} options.longitude долгота
 * @param {number} options.startAngle
 * @param {number} options.finishAngle
 * @param {number} options.radius
 * @param {number} [options.innerRadius=0]
 * @param {string} [options.tacticObjectType='sector'] тип
 * @param {boolean} [options.draggable=false]
 * @param {Gis.Additional.LineStyle} [options.line=Gis.lineStyle({color: "#0033ff"})]
 * @param {Gis.Additional.FillStyle} [options.fill=Gis.fillStyle({color: "#0033ff"})]
 * @example
 * var a = Gis.sector({
     *      selectable: true,
     *      id: Gis.Util.generateGUID(),
     *      latitude: 59.96600,
     *      longitude: 29.92675,
     *      radius: 50000,
     *      innerRadius: 40000,
     *      startAngle: 45,
     *      finishAngle: 95,
     *      tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
     *      caption: "Example caption"
     * }).addTo(gisMap)
 * @extends Gis.Objects.Selectable
 */
Gis.Objects.Sector = Gis.Objects.Selectable.extend(
    /** @lends Gis.Objects.Sector.prototype */
    {
        _isCached: true,
        events: Gis.Core.Events.availableDomEvents,
        fixed: 'id tacticObjectType',
        required: ['id', 'latitude', 'longitude', 'startAngle', 'finishAngle', 'radius'],
        options: {
            tacticObjectType: 'sector',
            id: undefined,
            latitude: undefined,
            longitude: undefined,
            startAngle: undefined,
            finishAngle: undefined,
            radius: undefined,
            innerRadius: 0,
            line: undefined,
            fill: undefined,
            selectable: undefined,
            draggable: undefined
        },
        optionsFire: [
            'tacticObjectType',
            'id',
            'tags',
            'latitude',
            'longitude',
            'startAngle',
            'finishAngle',
            'radius',
            'innerRadius',
            'line',
            'fill',
            'selectable',
            'draggable',
            'name',
            'caption',
            'customActions',
            'tooltip'
        ],
        /**
         *
         * @return {boolean|undefined}
         */
        isDraggable: function () {
            return this.getOption('draggable');
        },
        /**
         *
         * @return {number}
         */
        getRadius: function () {
            return this.getOption('radius');
        },
        /**
         *
         * @param original
         * @return {string}
         */
        getColor: function (original) {
            return Gis.fillStyle(original ? this.options.fill : this.getOption('fill')).getColor();
        },
        /**
         *
         * @return {number}
         */
        getInnerRadius: function () {
            var options = this.getOptionsWithStyle();
            return options.innerRadius > options.radius ? options.radius - 1 : options.innerRadius;
        },
        /**
         *
         * @return {number}
         */
        getStartAngle: function () {
            return this.getOption('startAngle') % 360;
        },
        /**
         *
         * @return {number}
         */
        getFinishAngle: function () {
            var angle = this.getOption('finishAngle') % 360;
            return angle >= 0 ? angle : 360 + angle;
        },
        initialize: function (data) {
            Gis.Objects.Selectable.prototype.initialize.call(this, data);
            this.options.line = Gis.lineStyle(data.line || {
                color: '#0033ff'
            });
            this.options.fill = Gis.fillStyle(data.fill || {
                color: Gis.Color.DEFAULT
            });
        },
        onAdd: function (map) {
            Gis.Objects.Selectable.prototype.onAdd.call(this, map);
            this.on('drag', this._onDrag, this);
            this.on('dragend', this._onDragEnd, this);
        },
        onDelete: function (map) {
            Gis.Objects.Selectable.prototype.onDelete.call(this, map);
            this.off('drag', this._onDrag, this);
            this.off('dragend', this._onDragEnd, this);
        },
        draw: function (map) {
            if (!map || !this.preDraw()) {
                return;
            }
            var options = this.getOptionsWithStyle();
            if (options.latitude && options.longitude) {
                Gis.Objects.Selectable.prototype.draw.call(this, map);
                this._lowLevelObject = map.drawSector(
                    Gis.Util.extend({}, options, {
                        latlng: this.getLatLng(),
                        line: this.getLineStyle(),
                        fill: Gis.fillStyle(this.getOption('fill')),
                        startAngle: this.getStartAngle(),
                        finishAngle: this.getFinishAngle(),
                        draggable: options.draggable && this.isThisEventable(),
                        selectable: options.selectable && this.isThisEventable(),
                        //throw available events to top api
                        events: {
                            type: this.events,
                            callback: this.fireEventsFromLowLevel,
                            context: this
                        }
                    }),
                    this._lowLevelObject
                );
            }
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
        getLatLng: function () {
            return [parseFloat(this.getOption('latitude')), parseFloat(this.getOption('longitude'))];
        },
        /**
         *
         * @return {Gis.LatLngBounds}
         */
        getLatLngBounds: function () {
            var south, north, west, east, latlng = this.getLatLng(), radius = this.options.radius;
            south = Gis.Projection.nextPointByLen(radius, latlng, 0);
            north = Gis.Projection.nextPointByLen(radius, latlng, 180);
            west = Gis.Projection.nextPointByLen(radius, latlng, -90);
            east = Gis.Projection.nextPointByLen(radius, latlng, 90);
            return Gis.latLngBounds(Gis.latLng(north[0], west[1]), Gis.latLng(south[0], east[1]));
        }
    }
);
/**
 * Возвращает новый объект сектора
 * @param data
 * @returns {Gis.Objects.Sector}
 */
Gis.sector = function (data) {
    return new Gis.Objects.Sector(data);
};
Gis.ObjectFactory.list.sector = Gis.Objects.Sector;
