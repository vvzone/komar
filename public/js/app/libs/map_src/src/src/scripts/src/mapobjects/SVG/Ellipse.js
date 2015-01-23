/**
 * Created with JetBrains PhpStorm.
 */
'use strict';
/**
 * @class
 * @classdesc
 * Элипс
 * @param {Object} options
 * @param {number} options.latitude широта
 * @param {number} options.longitude долгота
 * @param {number} options.alpha Радиус 1
 * @param {number} options.betta Радиус 2
 * @param {number} options.gamma Угол поворота (Град)
 * @param {string} [options.tacticObjectType='ellipse'] тип
 * @param {boolean} [options.draggable=false]
 * @param {Gis.Additional.LineStyle} [options.line=Gis.lineStyle({color: "#0033ff"})]
 * @param {Gis.Additional.FillStyle} [options.fill=Gis.fillStyle({color: "#0033ff"})]
 * @example
 * var a = Gis.ellipse({
     *      selectable: true,
     *      id: Gis.Util.generateGUID(),
     *      latitude: 59.96600,
     *      longitude: 29.92675,
     *      alpha: 50000,
     *      betta: 40000,
     *      gamma: 45,
     *      tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
     *      caption: "Example caption"
     * }).addTo(gisMap)
 * @extends Gis.Objects.Selectable
 */
Gis.Objects.Ellipse = Gis.Objects.Selectable.extend(
    /** @lends Gis.Objects.Ellipse# */
    {
        _isCached: true,
        events: Gis.Core.Events.availableDomEvents,
        required: ['id', 'latitude', 'longitude', 'alpha', 'betta', 'gamma'],
        options: {
            tacticObjectType: 'ellipse',
            id: undefined,
            latitude: 0,
            longitude: 0,
            draggable: undefined,
            line: undefined,
            fill: undefined,
            alpha: undefined,
            betta: undefined,
            gamma: undefined
        },
        optionsFire: [
            'tacticObjectType',
            'id',
            'latitude',
            'longitude',
            'tags',
            'draggable',
            'selectable',
            'line',
            'fill',
            'alpha',
            'betta',
            'gamma',
            'name',
            'caption',
            'customActions',
            'tooltip'
        ],
        /**
         *
         * @returns {boolean}
         */
        isDraggable: function () {
            return this.getOption('draggable');
        },
        /**
         *
         * @returns {number}
         */
        getAlpha: function () {
            return this.getOption('alpha');
        },
        /**
         *
         * @returns {number}
         */
        getBetta: function () {
            return this.getOption('betta');
        },
        /**
         *
         * @returns {number}
         */
        getGamma: function () {
            return this.getOption('gamma');
        },
        /**
         *
         * @returns {string}
         */
        getColor: function (original) {
            return Gis.fillStyle(original ? this.options.fill : this.getOption('fill')).getColor();
        },
        initialize: function (data) {
            Gis.Objects.Selectable.prototype.initialize.call(this, data);
            this.getOption.line = Gis.lineStyle(data.line || {
                color: '#0033ff'
            });
            this.options.fill = Gis.fillStyle(data.fill || {
                color: Gis.Color.DEFAULT
            });
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
        onAdd: function (map) {
            Gis.Objects.Selectable.prototype.onAdd.call(this, map);
            this.on('drag', this._onDrag, this);
            this.on('dragend', this._onDragEnd, this);
        },
        onDelete: function () {
            Gis.Objects.Selectable.prototype.onDelete.apply(this, arguments);
            this.off('drag', this._onDrag, this);
            this.off('dragend', this._onDragEnd, this);
        },
        draw: function (map) {
            var options;
            if (!map || !this.preDraw()) {
                return;
            }
            if (this.options.latitude && this.options.longitude) {
                options = this.getOptionsWithStyle();
                Gis.Objects.Selectable.prototype.draw.call(this, map);
                this._lowLevelObject = map.drawEllipse({
                    latlng: this.getLatLng(),
                    alpha: options.alpha,
                    betta: options.betta,
                    gamma: options.gamma,
                    line: this.getLineStyle(),
                    caption: options.caption,
                    tooltip: options.tooltip,
                    fill: Gis.fillStyle(options.fill),
                    selectable: options.selectable && this.isThisEventable(),
                    draggable: options.draggable && this.isThisEventable(),
                    events: {
                        type: this.events,
                        callback: this.fireEventsFromLowLevel,
                        context: this
                    }
                }, this._lowLevelObject);
            }

        },
        getLatLng: function () {
            return [parseFloat(this.getOption('latitude')), parseFloat(this.getOption('longitude'))];
        },
        getLatLngBounds: function () {
            var south, north, west, east, latlng = this.getLatLng(), radius = this.getOption('alpha');
            south = Gis.Projection.nextPointByLen(radius, latlng, 0);
            north = Gis.Projection.nextPointByLen(radius, latlng, 180);
            west = Gis.Projection.nextPointByLen(radius, latlng, -90);
            east = Gis.Projection.nextPointByLen(radius, latlng, 90);
            return Gis.latLngBounds(Gis.latLng(north[0], west[1]), Gis.latLng(south[0], east[1]));
        }
    }
);
/**
 * Возвращает новый объект эллипса
 * @param options
 * @returns {Gis.Objects.Ellipse}
 */
Gis.ellipse = function (options) {
    return new Gis.Objects.Ellipse(options);
};
Gis.ObjectFactory.list.ellipse = Gis.Objects.Ellipse;
