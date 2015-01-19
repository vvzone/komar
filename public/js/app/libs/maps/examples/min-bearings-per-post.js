/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
var gisMap;
function showMap() {
    if (BrowserDetect.browser === 'Chrome' && BrowserDetect.version > 33) {
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

    var id1 = Gis.Util.generateGUID();
    var id2 = Gis.Util.generateGUID();
    var id3 = Gis.Util.generateGUID();
    var id9 = Gis.Util.generateGUID();

    setTimeout(function () {
        Gis.post({id: id1, icon: {type: 'static', color: 'black'}, name: 'post-1', caption: '<nobr>post-1</nobr>', courseStyle: {color: 'black', thickness: 1}, trackStyle: {color: 'black', thickness: 3, dash: 'dash'}, trackBehavior: {traceLengthMeters: 40000, traceLengthSeconds: 0}}).addTo(gisMap);
        Gis.post({id: id2, icon: {type: 'static', color: 'purple'}, name: 'post-2', caption: '<nobr>post-2</nobr>', courseStyle: {color: 'purple', thickness: 1}, trackStyle: {color: 'purple', thickness: 3, dash: Gis.Dash.dash}, trackBehavior: {traceLengthMeters: 0, traceLengthSeconds: 99999}}).addTo(gisMap);
        Gis.post({id: id3, icon: {type: 'static', color: 'green'}, name: 'post-3', caption: '<nobr>post-3</nobr>', courseStyle: {color: 'green', thickness: 1}, trackStyle: {color: 'purple', thickness: 3, dash: Gis.Dash.dash}, trackBehavior: {traceLengthMeters: 0, traceLengthSeconds: 99999}}).addTo(gisMap);
        Gis.position({parentId: id1, timeStamp: new Date().getTime() / 1000, latitude: 60, longitude: 30}).addTo(gisMap);
        Gis.position({parentId: id2, timeStamp: new Date().getTime() / 1000, latitude: 60.1, longitude: 30}).addTo(gisMap);
        Gis.position({parentId: id3, timeStamp: new Date().getTime() / 1000, latitude: 60.1, longitude: 30.2}).addTo(gisMap);

        Gis.source({id: id9, icon: {type: 'circle', color: 'red'}, name: 'source-1', caption: '<nobr>source-1</nobr>', bearingBehavior: {latestBearingCount: 6, bearingShowTimeSeconds: 60, minBearingsPerPost: 2}}).addTo(gisMap);
        Gis.position({parentId: id9, timeStamp: new Date().getTime() / 1000, latitude: 60.05, longitude: 30.1}).addTo(gisMap);
    }, 1000);

    var cx = 60;
    var cy = 30.2;
    var r = 0.1;
    var a = 0;
    setTimeout(sheduler1, 2000);
    setTimeout(sheduler2, 2000);
    setTimeout(sheduler3, 2000);

    function sheduler1()
    {
	var d = Math.random()*20-10;
        Gis.bearing({postId: id1, sourceId: id9, timeStamp: (new Date()).getTime() / 1000, latitude: 60, longitude: 30, bearing: 45 + d}).addTo(gisMap);
        setTimeout(sheduler1, Math.random()*500+5000);
    }

    function sheduler2()
    {
	var d = Math.random()*20-10;
        Gis.bearing({postId: id2, sourceId: id9, timeStamp: new Date().getTime() / 1000, latitude: 60.1, longitude: 30, bearing: 135 + d}).addTo(gisMap);
        setTimeout(sheduler2, Math.random()*500+5000);
    }

    function sheduler3()
    {
	var d = Math.random()*20-10;
        Gis.bearing({postId: id3, sourceId: id9, timeStamp: new Date().getTime() / 1000, latitude: 60.1, longitude: 30.2, bearing: 225 + d}).addTo(gisMap);
        setTimeout(sheduler3, Math.random()*100+100);
    }
}

function startMapping() {
    Gis.setConfig('relativePath', 'deploy/');
    showMap();
}
 
startMapping();