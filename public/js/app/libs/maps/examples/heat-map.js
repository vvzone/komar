/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
var gisMap, heatmap, ivl;
function showMap() {
    Gis.setConfig('heatmap.colors', [
        Gis.config('heatmap.color'),
        [{percent: 0, color: new RGBColor("black")}, {percent: 1, color: new RGBColor("white")}],
        [{percent: 0, color: new RGBColor("rgb(9,63,235)")}, {percent: 1, color: new RGBColor("rgb(8, 10, 0)")}],
        [{percent: 0, color: new RGBColor("rgb(181,194,32)")}, {percent: 1, color: new RGBColor("rgb(255, 2, 2)")}],
        [{percent: 0, color: new RGBColor("rgb(0,10,252)")}, {percent: 0.5, color: new RGBColor("rgb(34, 34, 32)")}, {percent: 1, color: new RGBColor("rgb(164, 170, 19)")}]
    ]);
    Gis.setConfig('connection.port', 9797);
    Gis.setConfig('connection.host', 'localhost');
    if (BrowserDetect.browser === 'Chrome' && BrowserDetect.version === 34) {
        L.HeatMap.SKIP_WW = true;
    }
    L.HeatMap.SKIP_INTERSECT_CHECK = L.HeatMap.SKIP_WW;
    gisMap = Gis.map("map", {
        latlng: [59.72317, 30.29067],
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
    var values = [];
    for (var i = 0; i < 300; i += 1) {
        values[i] = [];
        for (var i2 = 0; i2 < 300; i2 += 1) {
            values[i][i2] = Math.random() * 50;
        }
    }
    var z = 0, p = 0, stepz = 1, stepp = 1, max = 200;

    function generateValues() {
        var values = [], vz, vp;
        for (var i = 0; i < max; i += 1) {
            values[i] = [];
            for (var i2 = 0; i2 < max; i2 += 1) {
                vz = i2 + max;
                if (z == i2) {
                    vz = max * 2;
                }
                vp = i + max;
                if (p == i) {
                    vp = max * 2;
                }
                values[i][i2] = vz * vp * 50;
            }
        }
        return values;
    }

    ivl = setInterval(function () {
        heatmap.setData({matrix: {
            n: 60.022, w: 29.60, s: 59.40, e: 31.17271,
            values: generateValues(),
            gradient: [
                {color: "rgba(0, 0, 0, 0)", percent: 0},
                {color: "rgba(0, 0, 0, 0)", percent: 0.4},
                {color: 'rgba(242, 14, 14, 256)', percent: 0.5},
                {color: 'black', percent: 0.7},
                {color: 'rgba(0, 0, 0, 0)', percent: 0.81}
            ]
        }});
        z += stepz;
        p += stepp;
        if (z >= max || z <= 0) {
            stepz = -stepz;
            z += stepz;
        }
        if (p >= max || p <= 0) {
            stepp = -stepp;
            p += stepp;
        }
    }, 2000);

    heatmap = Gis.heat_map({
        id: Gis.Util.generateGUID(),
        selectable: true,
        tooltip: "tooltip",
        matrix: {
            n: 60.022, w: 29.60, s: 59.40, e: 31.17271,
            values: generateValues(),
            gradient: [
                {color: "rgba(0, 0, 0, 0)", percent: 0},
                {color: "rgba(0, 0, 0, 0)", percent: 0.4},
                {color: 'rgba(242, 14, 14, 256)', percent: 0.5},
                {color: 'black', percent: 0.7},
                {color: 'rgba(0, 0, 0, 0)', percent: 0.81}
            ]
        }
    });
    heatmap.addTo(gisMap);
}
function startMapping() {
    window.GIS_GENERATE_GUID = true;
    Gis.setConfig('relativePath', 'deploy/');
    Gis.Logger.logLevel = 0;
    showMap();
}

startMapping();