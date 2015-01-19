/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
var gisMap, overlay;
function showMap() {
    Gis.setConfig('connection.port', 9797);
    Gis.setConfig('connection.host', 'localhost');
    gisMap = Gis.map("map", {
        latlng: [51.505, -0.09],
        settings: {
            "ui": Gis.UI.USERSET.FULL,
            "maps": [
                "osm",
                "http://localhost/",
                "googleSat",
                "googleHyb",
                "google",
                "yandexSat",
                "yandexHyb",
                "yandex"
            ]
        }
    }).show();
    overlay = Gis.overlay({
        id: Gis.Util.generateGUID(),
        selectable: true,
        draggable: true,
        imageCoords: [[0, 0], [2320, 2564]],
        geoCoords: [[36, -5], [15, 20]],
        image: {fullPath: 'http://mapm35.narod.ru/map1', hash: 'M-35-049.JPG'}
    }).addTo(gisMap);
    overlay.addTo(gisMap);
}
function startMapping() {
    window.GIS_GENERATE_GUID = true;
    Gis.setConfig('relativePath', 'deploy/');
    Gis.Logger.logLevel = 0;
    showMap();
}

startMapping();