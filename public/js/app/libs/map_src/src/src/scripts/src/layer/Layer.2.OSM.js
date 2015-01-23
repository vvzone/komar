(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.TmsLayer
     */
    var Osm = Gis.TmsLayer.extend(
        /**
         * @lends Osm#
         */
        {
            options: {url: 'osm', title: 'OpenStreetMap'}
        }
    );
    /**
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @static
     * @returns {Gis.TmsLayer}
     */
    Gis.TmsLayer.osm = function (data) {
        return new Osm(G.Util.extend(data || {}, {type: 'osm', types: {map: 'ROADMAP', terrain: 'SATELLITE'}, maxZoom: 18, minZoom: 0}));
    };
}(Gis));