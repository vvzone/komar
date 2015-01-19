/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
var gisMap, ivl;
function showMap() {
    if (BrowserDetect.browser === 'Chrome' && BrowserDetect.version > 33) {
        L.HeatMap.SKIP_WW = true;
        L.HeatMap.SKIP_INTERSECT_CHECK = L.HeatMap.SKIP_WW;
    }
    Gis.setConfig(Gis.Widget.ObjectProperty.CONFIG_TYPES_KEY, 'target danger circle storm simple car plane triangle diamond');
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
}
function startMapping() {
    window.GIS_GENERATE_GUID = true;
    Gis.setConfig('relativePath', 'deploy/');
    Gis.Logger.logLevel = 0;
    showMap();
}

startMapping();