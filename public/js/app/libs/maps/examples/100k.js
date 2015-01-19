/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
var gisMap, ivl, N, counter, nextPost;
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

    N = 2000;
    counter = 0;

    nextPost = function() {
        counter++;
        var postId = Gis.Util.generateGUID();
        var post = Gis.post({
            selectable: true,
            id: postId,
            icon: {type: 'plane', color: 'red'},
            caption: ""+counter,
            name: "Post #" + counter,
            trackBehavior: { traceLengthSeconds: 1, traceLengthMeters: 1 }
        }).addTo(gisMap);
        Gis.position({
            id: Gis.Util.generateGUID(),
            parentId: postId,
            timeStamp: new Date().getTime() / 1000,
//            latitude: -90 + Math.random() * 180,
//            longitude: -180 + Math.random() * 360,
            latitude: -90 + ((counter-1) % 45)*4,
            longitude: -180 + ((counter-1) / 45)*4,
            course: Math.random() * 360
        }).addTo(gisMap);
        if (counter == N)
            clearInterval(ivl);
    }
/*
    var N = 200;
    var postIds = new Array(N);
    for (var i = 0; i < N; i++) {
        postIds[i] = Gis.Util.generateGUID();
        var post = Gis.post({
            selectable: true,
            id: postIds[i],
            icon: {type: 'plane', color: 'red'},
//            caption: "Example caption",
            name: "Post",
            trackBehavior: { traceLengthSeconds: 1, traceLengthMeters: 1 }
        }).addTo(gisMap);
        Gis.position({
            id: Gis.Util.generateGUID(),
            parentId: postIds[i],
            timeStamp: new Date().getTime() / 1000,
            latitude: -90 + Math.random() * 180,
            longitude: -180 + Math.random() * 360,
            course: Math.random() * 360,
        }).addTo(gisMap);
    }
*/
    ivl = setInterval(nextPost, 25);
}

function startMapping() {
    window.GIS_GENERATE_GUID = true;
    Gis.setConfig('relativePath', 'deploy/');
    Gis.Logger.logLevel = 0;
    showMap();
}

startMapping();