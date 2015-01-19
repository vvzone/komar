/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
var gisMap, ivl;
var addBearings;
function showMap() {
    Gis.setConfig('connection.port', 9797);
    Gis.setConfig('connection.host', 'localhost');
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
    Gis.Config.style.DefaultCourseStyle = {color: 'blue'};
    var id, idPost, idSource;
    idSource = Gis.Util.generateGUID();
    idPost = Gis.Util.generateGUID();

    addBearings = function () {
        var a = Gis.bearing({
            id: Gis.Util.generateGUID(),
            postId: idPost,
            sourceId: idSource,
            timeStamp: new Date().getTime() / 1000,
            latitude: 59.96600,
            longitude: 89.92675,
            course: Math.random() * 360,
            bearing: Math.random() * 360,
            tooltip: "<table><tr><th>head1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
            caption: "Example caption",
            tags: {
                layers: ['bearing', 'bearing 1']
            }
        }).addTo(gisMap);
        Gis.position({
            id: Gis.Util.generateGUID(),
            parentId: idPost,
            timeStamp: new Date().getTime() / 1000,
            latitude: 59.96600,
            longitude: 29.92675,
            course: Math.random() * 360,
            tags: {
                layers: ['position', 'position post']
            }
        }).addTo(gisMap);
        Gis.position({
            id: Gis.Util.generateGUID(),
            parentId: idPost,
            timeStamp: new Date().getTime() / 1000,
            latitude: 51.96600,
            longitude: 21.92675,
            course: Math.random() * 360,
            tags: {
                layers: ['position', 'position post']
            }
        }).addTo(gisMap);
        Gis.position({
            id: Gis.Util.generateGUID(),
            parentId: idSource,
            timeStamp: new Date().getTime() / 1000,
            latitude: 79.96600,
            longitude: 39.92675,
            course: Math.random() * 360,
            tags: {
                layers: ['position', 'position source']
            }
        }).addTo(gisMap);
        Gis.position({
            id: Gis.Util.generateGUID(),
            parentId: idSource,
            timeStamp: new Date().getTime() / 1000,
            latitude: 71.96600,
            longitude: 31.92675,
            course: Math.random() * 360,
            tags: {
                layers: ['position', 'position source']
            }
        }).addTo(gisMap);
        var a = Gis.bearing({
            id: Gis.Util.generateGUID(),
            postId: idPost,
            sourceId: idSource,
            timeStamp: new Date().getTime() / 1000,
            latitude: 69.96600,
            longitude: 29.92675,
            course: Math.random() * 360,
            bearing: Math.random() * 360,
            tooltip: "<table><tr><th>h ffffff ead1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
            caption: "Examsad fsadf sdfple caption",
            tags: {
                layers: ['bearing', 'bearing 2']
            }
        }).addTo(gisMap);
        Gis.bearing({
            id: Gis.Util.generateGUID(),
            postId: idPost,
            sourceId: idSource,
            timeStamp: new Date().getTime() / 1000,
            latitude: 39.96600,
            longitude: -9.92675,
            course: Math.random() * 360,
            bearing: Math.random() * 360,
            tooltip: "<table><tr><th>h ffffff ead1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
            caption: "With parent"
        }).addTo(gisMap);
    };
    addBearings();
    var source = Gis.source({
        id: idSource,
        icon: {type: 'plane', color: 'black'},
        tooltip: "post tooltip",
        caption: "Example caption",
        name: "Example name",
        bearingBehavior: {
            latestBearingCount: 30,
            bearingShowTimeSeconds: 5
        },
        bearingStyle: {
            color: "yellow",
            thickness: 1,
            dash: Gis.Dash.solid,
            border: "rgba(0, 0, 0, 255)",
        },
        tags: {
            layers: ['sources']
        }
    }).addTo(gisMap);
    var post = Gis.post({
        selectable: true,
        id: idPost,
        icon: {type: 'static', color: 'red'},
        tooltip: "post tooltip",
        caption: "Example caption",
        name: "Example name",
        trackBehavior: {
            traceLengthSeconds: 5,
            traceLengthMeters: 200
        },
        trackStyle: {
            color: "rgba(255, 44, 44, 99)",
            thickness: 1,
            dash: Gis.Dash.dash,
            border: "rgba(255, 46, 44, 255)",
        },
        courseStyle: {
            color: "rgba(255, 255, 255, 128)",
            thickness: 1,
            dash: Gis.Dash.dashDotDot,
            border: "rgba(0, 0, 0, 128)",
        },
        tags: {
            layers: ['posts']
        }
    }).addTo(gisMap);
}
function startMapping() {
    window.GIS_GENERATE_GUID = true;
    Gis.setConfig('relativePath', 'deploy/');
    Gis.Logger.logLevel = 1;
    showMap();
}

startMapping();