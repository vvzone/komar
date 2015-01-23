(function (G) {
    "use strict";
    /**
     * @class
     * @extends is.TmsLayer
     */
    var Bing = Gis.TmsLayer.extend( /**@lends Bing#*/
        {
            _title: 'Bing',
            options: {url: 'bing', title: 'Bing.Карты'},
            initialize: function (key, data) {
                G.TmsLayer.prototype.initialize.call(this, data);
                this._key = key || Gis.config('tiles.bingKey');
                return this;
            },
            getApiKey: function () {
                return this._key;
            }
        }
    ),
        type = 'bing', typeSat = 'bingSat', typeSatHyb = 'bingHyb';

    Gis.TmsLayer[type] = function (key, data) {
        return new Bing(key, G.Util.extend(data || {}, {type: type, types: {map: 'Road', terrain: 'Aerial', hybrid: 'AerialWithLabels'}, maxZoom: 18, minZoom: 0}));
    };
    Gis.TmsLayer[typeSat] = function (key, data) {
        return Gis.TmsLayer.bing(key, Gis.Util.extend(data || {}, {mapType: 'terrain', title: 'Bing.AЭРО', type: typeSat, url: typeSat}));
    };
    Gis.TmsLayer[typeSatHyb] = function (key, data) {
        return Gis.TmsLayer.bing(key, Gis.Util.extend(data || {}, {mapType: 'hybrid', title: 'Bing.Комбинированная', type: typeSatHyb, url: typeSatHyb}));
    };
    /**
     *
     * @param {string} key
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @static
     * @returns {Bing}
     */
//    Gis.TmsLayer.bing = function (key, data) {
//        return new Bing(key, G.Util.extend(data || {}, {type: 'bing'}));
//    };
}(Gis));