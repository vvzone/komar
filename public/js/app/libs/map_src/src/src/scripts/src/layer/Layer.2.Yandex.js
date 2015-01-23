(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.TmsLayer
     */
    var Yandex = Gis.TmsLayer.extend(
            /**
             * @lends Yandex#
             */
            {
                options: {url: 'yandex', title: 'Яndex.Карты', crs: Gis.customSRS('EPSG:3395')}
            }
        ),
        type = 'yandex', typeSat = 'yandexSat', typeSatHyb = 'yandexHyb';
    /**
     * @name Gis.TmsLayer.yandex
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @param {string} [data.url=yandex]
     * @param {string} [data.type=yandex]
     * @param {string} [data.title=Яndex.Карты]
     * @param {string} [data.mapType=terrain]
     * @method
     * @returns {Gis.TmsLayer}
     */
    Gis.TmsLayer[type] = function (data) {
        return new Yandex(G.Util.extend(data || {}, {type: type, types: {map: 'map', terrain: 'satellite', hybrid: 'hybrid'}, maxZoom: 18, minZoom: 0}));
    };
    /**
     * @name Gis.TmsLayer.yandexSat
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @param {string} [data.url=yandexSat]
     * @param {string} [data.type=yandexSat]
     * @param {string} [data.title=Яndex.Спутник]
     * @param {string} [data.mapType=terrain]
     * @method
     * @returns {Gis.TmsLayer}
     */
    Gis.TmsLayer[typeSat] = function (data) {
        return G.TmsLayer.yandex(Gis.Util.extend(data || {}, {mapType: 'terrain', title: 'Яndex.Спутник', type: typeSat, url: typeSat}));
    };
    /**
     * @name Gis.TmsLayer.yandexHyb
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @param {string} [data.url=yandexHyb]
     * @param {string} [data.type=yandexHyb]
     * @param {string} [data.title=Яndex.Гибрид]
     * @param {string} [data.mapType=hybrid]
     * @method
     * @returns {Gis.TmsLayer}
     */
    Gis.TmsLayer[typeSatHyb] = function (data) {
        return G.TmsLayer.yandex(Gis.Util.extend(data || {}, {mapType: 'hybrid', title: 'Яndex.Гибрид', type: typeSatHyb, url: typeSatHyb}));
    };
}(Gis));