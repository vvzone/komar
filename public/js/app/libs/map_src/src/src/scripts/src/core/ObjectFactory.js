(function (G) {
    "use strict";
    var id, cached = {}, cachedSize = 1000;

    /**
     *
     * @param type
     * @returns {Array.<Object>|undefined}
     */
    function getCachedArray (type) {
        if (type) {
            if (!cached[type]) {
                cached[type] = [];
            }
            return cached[type];
        }
    }

    /**
     *
     * @param data
     * @returns {Gis.Objects.Base | undefined}
     */
    function getCachedLayer (data) {
        var cache = getCachedArray(data.tacticObjectType), layer;
        if (cache && cache.length) {
            layer = cache.shift();
            layer.initialize(data);
            return layer;
        }
    }
    G.ObjectFactory = {
        list: {},
        createObject: function (data) {
            if (data && data.tacticObjectType) {
                data.tacticObjectType = data.tacticObjectType.toLocaleLowerCase();
                return getCachedLayer(data) || new this.list[data.tacticObjectType](data);
            }
            throw new Error('Cannot create object');
        },
        cache: function (layer) {
            var cachedArray = getCachedArray(layer.getType());
            if (cachedArray && cachedArray.length < cachedSize) {
                cachedArray.push(layer);
            }
        }
    };
    for (id in G.Objects) {
        if (G.Objects.hasOwnProperty(id)) {
            G.ObjectFactory.list[G.Objects[id].getType()] = G.Objects[id];
        }
    }
}(Gis));