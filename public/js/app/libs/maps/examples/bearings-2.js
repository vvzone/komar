/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
"use strict";
var gisMap, ivl;
var addBearings;
function showMap() {
    // L.HeatMap.DEBUG = true;
    Gis.setConfig('connection.port', 9797);
    Gis.setConfig('connection.host', 'localhost');
    // L.HeatMap.SKIP_WW = true;
    gisMap = Gis.map("map", {
        latlng: [51.505, -0.09],
        settings: {
//          "ui": Gis.UI.uiUsersetExclude(Gis.UI.USERSET.FULL, ["slidervertical", "sliderhorisontal"]),
            "ui": Gis.UI.USERSET.FULL,
            "maps": [
                "osm",
                "http://localhost/",
//            "http://gr-vm-tms/",
//            "http://172.20.10.10/",
                // "http://192.168.0.122:8182/",
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
    var id = Gis.Util.generateGUID(), idPost;

    var tags = {
        layers: ['beee']
    };
    tags[Gis.Objects.Base.CREATOR_TAG_NAME] = Gis.Util.generateGUID();
    gisMap.addLayer(Gis.sector({
        id: id,
        latitude: 55,
        longitude: 55,
        startAngle: 33,
        finishAngle: 83,
        radius: 69999,
        innerRadius: 9999,
        selectable: true,
        line: {color: 'rgba(0, 0, 0, .5)', thickness: 1, dash: 'dashDot'},
        fill: {color: 'rgba(55, 66, 77, .5)'},
        tags: tags
    }));
    id = Gis.Util.generateGUID();
    idPost = Gis.Util.generateGUID();
    var source = Gis.source({
        id: id,
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
        tags: tags
    }).addTo(gisMap);
    tags = {
        layers: ['sources']
    };
    tags[Gis.Objects.Base.CREATOR_TAG_NAME] = Gis.Util.generateGUID();
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
            border: "rgba(0, 0, 0, 128)"
        },
        tags: tags
    }).addTo(gisMap);
    addBearings = function () {
        var a = Gis.bearing({
            id: Gis.Util.generateGUID(),
            postId: post.getId(),
            sourceId: source.getId(),
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
            parentId: post.getId(),
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
            parentId: post.getId(),
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
            parentId: source.getId(),
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
            parentId: source.getId(),
            timeStamp: new Date().getTime() / 1000,
            latitude: 71.96600,
            longitude: 31.92675,
            course: Math.random() * 360,
            artifacts: [{"points":[{"id":"0263bf19-c66e-430d-a8c3-fb2b7b1f699b","latitude":59.96600,"longitude":89.92675,"tags":{"creator":"f84412c3-2703-44d2-a42d-69d5f0573844"},"tacticObjectType":"Point"},{"id":"e1f685c4-4870-4f14-8c34-b3a0d335e493","latitude":55.535837731658404,"longitude":36.910005648856476,"tags":{"creator":"f84412c3-2703-44d2-a42d-69d5f0573844"},"tacticObjectType":"Point"},{"id":"526a9f79-0d5f-4c7f-8eae-3ae96b317194","latitude":55.537469308404468,"longitude":36.908540278286118,"tags":{"creator":"f84412c3-2703-44d2-a42d-69d5f0573844"},"tacticObjectType":"Point"},{"id":"4b6c844f-0a42-40bc-91d1-a871c84009fa","latitude":55.538572905685918,"longitude":36.91255158244708,"tags":{"creator":"f84412c3-2703-44d2-a42d-69d5f0573844"},"tacticObjectType":"Point"}],"icon":null,"draggable":false,"selectable":false,"id":"fb143792-4a60-4417-8e7e-d85e7fd650a8", "caption": '<span style="white-space: nowrap;">sdf sdf sad fas f</span>',"tooltip":"<img style=\"max-width:600px\" src=\"http://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Example.svg/200px-Example.svg.png\"></src>","fill":{"color":"rgba(255,255,255,0)"},"line":{"dash":"solid","thickness":2,"color":"rgb(187,210,69)","border":"rgb(187,210,69)"},"tags":{"creator":"f84412c3-2703-44d2-a42d-69d5f0573844"},"tacticObjectType":"Polygon"}],
            tags: {
                layers: ['position', 'position source']
            }
        }).addTo(gisMap);
        var a = Gis.bearing({
            id: Gis.Util.generateGUID(),
            postId: post.getId(),
            sourceId: source.getId(),
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
            postId: post.getId(),
            sourceId: source.getId(),
            timeStamp: new Date().getTime() / 1000,
            latitude: 39.96600,
            longitude: -9.92675,
            course: Math.random() * 360,
            bearing: Math.random() * 360,
            tooltip: "<table><tr><th>h ffffff ead1</th><th>head2</th></tr><tr><td>ttt</td><td>ddd</td></tr></table>",
            caption: "With parent"
        }).addTo(gisMap);
    };
    ivl = setInterval(addBearings, 45);
}
function start () {
    ivl = setInterval(addBearings, 45);
}
function stop () {
    clearInterval(ivl);
}
function startMapping() {
    window.GIS_GENERATE_GUID = true;
    Gis.setConfig('relativePath', 'deploy/');
    Gis.Logger.logLevel = 1;
    showMap();
}

startMapping();