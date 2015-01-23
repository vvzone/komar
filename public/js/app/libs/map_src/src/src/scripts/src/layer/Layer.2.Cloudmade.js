(function (G) {
    "use strict";
    /**
     * @class
     * @extends Gis.TmsLayer
     */
    var Cloudmade = Gis.TmsLayer.extend({
        _title: 'Cloudmade',
        options: {url: 'cloudmade', title: 'Cloudmade'},
        initialize: function (key, data) {
            if (key) {
                G.TmsLayer.prototype.initialize.call(this, data);
                this._key = key;
                return this;
            }
            throw new Error('key needed');
        },
        getKey: function () {
            return this._key;
        }
    });
    /**
     *
     * @param {string} key
     * @param {Gis.TmsLayer.TmsDefaultData} data
     * @returns {Gis.TmsLayer}
     */
    Gis.TmsLayer.cloudmade = function (key, data) {
        return new Cloudmade(key, G.Util.extend(data || {}, {type: 'cloudmade'}));
    };
}(Gis));