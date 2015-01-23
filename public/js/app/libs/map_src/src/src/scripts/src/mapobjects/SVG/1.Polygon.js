'use strict';
/**
 * @class
 * @classdesc
 * Полигон
 * @param {Object} options
 * @param {boolean} [options.orthodrome=false] ребра-ортодромии
 * @param {string} [options.tacticObjectType='polygon'] тип
 * @param {Gis.Additional.FillStyle} [options.fill=Gis.fillStyle({color: "#0033ff"})]
 * @example
 * var a = Gis.polygon({
     *      selectable: true,
     *      id: Gis.Util.generateGUID(),
     *      points: [{latitude: 59.96600, longitude: 29.92675}, {latitude: 58.96600, longitude: 29.95675}, {latitude: 58.36600, longitude: 30.12675}],
     *      tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
     *      caption: "Example caption"
     * }).addTo(gisMap)
 * @example Ортодромии на ребрах
 * var a = Gis.polygon({
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
Gis.Objects.Polygon = Gis.Objects.Polyline.extend(
    /** @lends Gis.Objects.Polygon.prototype */
    {
        _isCached: true,
        events: Gis.Core.Events.availableDomEvents,
        fixed: 'id tacticObjectType',
        required: ['id', 'points'],
        _cycled: true,
        options: {
            tacticObjectType: 'polygon',
            id: undefined,
            fill: undefined
        },
        optionsFire: [
            'tacticObjectType',
            'id',
            'points',
            'icon',
            'fill',
            'line',
            'selectable',
            'tags',
            'name',
            'caption',
            'tooltip',
            'customActions',
            'draggable'
        ],
        /**
         * Цвет заливки
         * @param {boolean} [original=false] минуя стили
         * @return {*|string}
         */
        getColor: function (original) {
            return Gis.fillStyle(original ? this.options.fill : this.getOption('fill')).getColor();
        },
        /**
         * Цвет линии
         * @param {boolean} [original=false] минуя стили
         * @return {*|string}
         */
        getLineColor: function (original) {
            return Gis.lineStyle(original ? this.options.line : this.getOption('line')).getColor();
        },
        setData: function (data, val, dontFire) {
            val = this._fillOption(data, val, 'fill', Gis.fillStyle);
            return Gis.Objects.Polyline.prototype.setData.call(this, data, val, dontFire);
        },
        initialize: function (data) {
            this._fillOption(data, null, 'icon', Gis.icon);
            data.fill = Gis.fillStyle(data.fill || {
                color: Gis.Color.DEFAULT
            });
            Gis.Objects.Polyline.prototype.initialize.call(this, data);
        },
        draw: function (map) {
            var options;
            if (!map || !this.preDraw()) {
                return;
            }
            this._latLngDraw = undefined;
            options = this.getOptionsWithStyle();
            if (options.points && options.points.length) {
                this._lowLevelObject = this._lowLevelObject || {inset: true};
                this._lowLevelObject.line = map.drawPolygon(
                    Gis.Util.extend({}, options, {
                        latlng: this._getLatLngArray(),
                        line: this.getLineStyle(),
                        fill: Gis.fillStyle(this.getOption('fill')),
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
/**
 * Возвращает новый объект полигона
 * @param data
 * @returns {Gis.Objects.Polygon}
 */
Gis.polygon = function (data) {
    return new Gis.Objects.Polygon(data);
};
Gis.ObjectFactory.list.polygon = Gis.Objects.Polygon;
/**
 * Генерирует координаты квадрата по начальной и конечной точке
 * @param start
 * @param end
 * @param points
 * @param oldScool получить массив координат
 * @returns {Gis.Objects.PathPoint[] | {latitudes: Array, longitudes: Array}}
 */
Gis.Objects.Polygon.generateSquareLatLng = function (start, end, points, oldScool) {
    var params, id, newPoints = [];
    if (oldScool) {
        return {
            latitudes: [start.latitude, end.latitude, end.latitude, start.latitude],
            longitudes: [start.longitude, start.longitude, end.longitude, end.longitude]
        };
    }
    points = points || [];
    function setPoint(point, latlng) {
        id = (point && point.getParams().id) || null;
        return Gis.pathPoint(Gis.extend({}, (id && {id: id}) || {}, latlng));
    }
    newPoints[0] = setPoint(points[0], start);
    newPoints[1] = setPoint(points[1], {latitude: start.latitude, longitude: end.longitude});
    newPoints[2] = setPoint(points[2], end);
    newPoints[3] = setPoint(points[3], {latitude: end.latitude, longitude: start.longitude});
    return newPoints;
};
