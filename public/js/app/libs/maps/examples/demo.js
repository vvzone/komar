/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
var gisMap;
function showMap() {
    if (BrowserDetect.browser === 'Chrome' && BrowserDetect.version === 34) {
        L.HeatMap.SKIP_WW = true;
        L.HeatMap.SKIP_INTERSECT_CHECK = L.HeatMap.SKIP_WW;
    }
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
    Gis.setConfig('relativePath', 'deploy/');
    showMap();
}

startMapping();