/**
 * Created by vkmar_000 on 05.11.14.
 */
Gis.OSRM = {
    getMapZoom: function () {
        var lMap = Gis.Map.CURRENT_MAP.options.provider.map,
            bounds = lMap.getBounds();

        var zoom = -1,
            maxZoom = 18,
            size = lMap.getSize(),

            nw = bounds.getNorthWest(),
            se = bounds.getSouthEast(),

            zoomNotFound = true,
            boundsSize;


        do {
            zoom++;
            boundsSize = L.CRS.EPSG3857.latLngToPoint(se, zoom).subtract(L.CRS.EPSG3857.latLngToPoint(nw, zoom));
            zoomNotFound = size.contains(boundsSize);

        } while (zoomNotFound && zoom <= maxZoom);

        return zoom - 1;
    }
};
Gis.OSRM.TYPE_FORWARD = 'forward';
Gis.OSRM.TYPE_BACKWARD = 'backward';