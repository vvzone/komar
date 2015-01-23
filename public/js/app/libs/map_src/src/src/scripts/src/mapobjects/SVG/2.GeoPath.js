(function () {
    'use strict';
    /**
     * @class
     * @classdesc
     * Маршрут
     * @extends Gis.Objects.Path
     */
    Gis.Objects.GeoPath = Gis.Objects.Path.extend(
        /** @lends Gis.Objects.GeoPath# */
        {
            _isControllableByServer: Gis.NETWORK_LOCAL,
            required: ['id'],
            options: {
                routing: null,
                path: null,
                tacticObjectType: 'geo-path'
            },
            initialize: function () {
                Gis.Objects.Path.prototype.initialize.apply(this, arguments);
                if (this.options.path) {
                    if (this.options.path._current_route && this.options.path._current_route.route) {
                        this.options.path._current_route.route.on('click', function (e) {
                            this.fire('click', e);
                        }, this);
                    }
                    this.options.path.saved = true;
                    this.options.path.route = this.options.routing;
                }
            },
            /**
             * @returns {Array.<Gis.LatLng>}
             */
            getLatLngArray: function () {
                var result;
                if (this.options.routing) {
                    result = [];
                    for (var i = 0, len = this.options.routing.length; i < len; i += 1) {
                        result.push(Gis.latLng(this.options.routing[i].lat, this.options.routing[i].lng));
                    }
                }
                return result;
            },
            setData: function () {
                Gis.Objects.Path.prototype.setData.apply(this, arguments);
                if (this.options.path) {
                    this.options.path.route = this.options.routing;
                }
            },
            draw: function () {

            },
            getColor: function () {
                return this.options.path._current_route_style.color;
            },
            onDelete: function () {
                this.options.path.reset();
                Gis.Objects.Path.prototype.onDelete.apply(this, arguments);

            },
            /**
             *
             * @returns {Gis.LatLng}
             */
            getCenter: function () {
                var center = this.getLatLngBounds().getCenter();
                return Gis.latLng(center.lat, center.lng);
            },
            getRouting: function () {
                return this.options.routing.slice();
            },
            getPath: function () {
                return this.options.path;
            },
            /**
             *
             * @return {Gis.LatLngBounds}
             */
            getLatLngBounds: function () {
                var latBounds = Gis.latLngBounds(this.options.routing[0], this.options.routing[1]);
                for (var i = 2, len = this.options.routing.length; i < len; i += 1) {
                    latBounds.extend(this.options.routing[i]);
                }
                return latBounds;
            }
        }
    );
    /**
     * Возвращает новый объект маршрута
     * @param data
     * @returns {Gis.Objects.GeoPath}
     */
    Gis.geoPath = function (data) {
        return new Gis.Objects.GeoPath(data);
    };
    Gis.ObjectFactory.list.geoPath = Gis.Objects.GeoPath;
    Gis.ObjectFactory.list['geo-path'] = Gis.Objects.GeoPath;
}());
