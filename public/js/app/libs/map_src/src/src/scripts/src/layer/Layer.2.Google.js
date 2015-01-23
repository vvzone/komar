(function (G) {
    "use strict";
    /**
     *
     * @class
     * @extends Gis.TmsLayer
     */
    var Google = Gis.TmsLayer.extend(
            /**
             * @lends Google#
             */
            {
                options: {url: 'google', title: 'Google.Карты'}
            }
        ),
        type = 'google', typeSat = 'googleSat', typeSatHyb = 'googleHyb';
    /**
     * @name Gis.TmsLayer.google
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @param {string} [data.type=google]
     * @param {string} [data.url=google]
     * @param {string} [data.title=Google.Карты]
     * @method
     * @static
     * @returns {Gis.TmsLayer}
     */
    Gis.TmsLayer[type] = function (data) {
        return new Google(G.Util.extend(data || {}, {type: type, types: {map: 'ROADMAP', terrain: 'SATELLITE', hybrid: 'HYBRID'}, maxZoom: 18, minZoom: 0}));
    };
    /**
     * @name Gis.TmsLayer.googleSat
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @param {string} [data.url=googleSat]
     * @param {string} [data.type=googleSat]
     * @param {string} [data.title=Google.Спутник]
     * @param {string} [data.mapType=terrain]
     * @method
     * @static
     * @returns {Gis.TmsLayer}
     */
    Gis.TmsLayer[typeSat] = function (data) {
        return G.TmsLayer.google(Gis.Util.extend(data || {}, {mapType: 'terrain', title: 'Google.Спутник', type: typeSat, url: typeSat}));
    };
    /**
     * @name Gis.TmsLayer.googleHyb
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @param {string} [data.url=googleHyb]
     * @param {string} [data.type=googleHyb]
     * @param {string} [data.title=Google.Гибрид]
     * @param {string} [data.mapType=hybrid]
     * @method
     * @static
     * @returns {Gis.TmsLayer}
     */
    Gis.TmsLayer[typeSatHyb] = function (data) {
        return G.TmsLayer.google(Gis.Util.extend(data || {}, {mapType: 'hybrid', title: 'Google.Гибрид', type: typeSatHyb, url: typeSatHyb}));
    };
}(Gis));