var map;
var tileServerAddress;
var googleCachePath;
var center;

var mapInitializers = { "osm" : initOSM, "yandex" : initYandex, "google" : initGoogle, "tmts" : initTmts, "googlecache" : initGoogleCash };
var defaultMapInitializer = mapInitializers["tmts"];
var currentMapInitializer = defaultMapInitializer;

//epsg..4326

function loadMap() {
    var mapType = getQueryVariable("map");
    if (mapType) {
        console.log("Ready to load map of type " + mapType);
    } else {
        mapType = "tmts";
        console.log("Map type wasn't specified in params. Ready to load map of type " + mapType + " (default)");
    }

    tileServerAddress = getQueryVariable("serverAddress");
    googleCachePath = getQueryVariable("cachePath");
	
	tileServerAddress = "127.0.0.1";
	
    reloadMap(mapType);
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

function setTileServerAddress(serverAddress) {
    tileServerAddress = serverAddress;
}

function setGoogleCacheFolder(googleCacheFolder) {
    googleCachePath = googleCacheFolder;
}

function changeMapProvider(newMapType) {
    currentMapInitializer = mapInitializers[newMapType];
}
function reloadMap(newMapType) {
    window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
        console.error(errorMsg + " - " + url + " - " + lineNumber);
        return false;
    };

    var oldCoords;
    document.getElementById("map").innerHTML = "";

    var layerIDs;
    if (map) {
        oldCoords = map.getCenter();
        layerIDs = map.getLayerIDs();

        var layers = [];
        layerIDs.forEach(function (id) {
            var data = map.getLayer(id).objectData();
            layers[id] = Gis.ObjectFactory.createObject(data);
        });

        removeAllObjects();
    } else {
        oldCoords = center;
    }

    changeMapProvider(newMapType);
    showMap(currentMapInitializer);

    if (oldCoords) {
        setCenter(oldCoords.lat, oldCoords.lng);
    }

    if (layerIDs) {
        for (var id in layers) {
            if (layers.hasOwnProperty(id)) {
                var layer = layers[id];
                layer.id = id;
                layer.addTo(map);
            }
        }
    }
}

function initOSM() {
    return Gis.map("map", {
        latlng: [55.753575, 37.62104],
        zoom: 15,
        layer: Gis.TmsLayer.osm()
    });
}

function initTmts() {
    var tmtsMap = Gis.map("map", {
        latlng: [55.753575, 37.62104],
        zoom: 15,
        "settings": {
            "maps": [
                tileServerAddress
            ]
        }
    });

    tmtsMap.on('maplistchanged', function () {
        tmtsMap.setMapType(tmtsMap.getMapList()[0].key)
    }, this);

    return  tmtsMap;
}

function initYandex() {
    return Gis.map("map", {
        latlng: [55.753575, 37.62104],
        zoom: 15,
        layer: Gis.TmsLayer.yandex()
    });
}

function initGoogle() {
    return Gis.map("map", {
        latlng: [55.753575, 37.62104],
        zoom: 15,
        layer: Gis.TmsLayer.google()
    });
}

function initGoogleCash() {
    return Gis.map("map", {
        latlng: [55.753575, 37.62104],
        zoom: 15,
        settings: {
            maps: [
                Gis.tmsLayer({
                    url: "file:///" + googleCachePath + "/z{z}/{y}/{x}.png"
                })
            ]
        }
    });
}

function showMap(mapInitializer) {
    window.GIS_GENERATE_GUID = true;
    window.FILTER_ROTATABLE_IMAGES = false;
    Gis.Map.prototype.connect = function(){};

    Gis.Config.relativePath = 'js/';
    map = mapInitializer.call().show();

    map.disconnect();

    Gis.Objects.TextLabel.include({options: {
        foreColor: 'black',
        backColor: 'transparent',
        drawPoint: false
    }});

    Gis.Config.image.serverOverlayExtension = '.png';
    window.L_PREFER_CANVAS = true;
}

function setCenter(latitude, longitude) {
    if (map) {
        map.setCenter([latitude, longitude]);
    } else {
        center = Gis.LatLng(latitude, longitude);
    }
    return "";
}

function getCenter() {
    var center = map.getCenter();
    return center.lng + ',' + center.lat;
}

function setZoom(zoom) {
    if (zoom) {
        map.setZoom(zoom);
    }
    return "";
}

function getZoom() {
    return map.getZoom();
}

function getBounds() {
    var bounds = map.options.provider.map.getBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();
    return sw.lng + ',' + sw.lat + ',' + ne.lng + ',' + ne.lat;
}

function drawPoint(id, latitude, longitude, image, angle, align, zIndex) {
    var point = map.getLayer(id);
    align = align || 'center';
    if (!point) {
        Gis.imageLabel({id: id, latitude: latitude, longitude: longitude, angle: (180 + angle), position: align, zIndex: zIndex, icon: Gis.icon({type: 'custom', image: Gis.image({fullPath: './images', hash: image})})}).addTo(map);
        map.showLayersByID(id);
    } else {
        point.setData({id: id, latitude: latitude, longitude: longitude, angle: (180 + angle), position: align, zIndex: zIndex, icon: Gis.icon({type: 'custom', image: Gis.image({fullPath: './images', hash: image})})});
    }
    return id;
}

function drawText(id, latitude, longitude, text, color, align) {
    color = color || 'black';
    align = align || 'topright';
    Gis.textLabel({id: id, latitude: latitude, longitude: longitude, caption: text, position: align, foreColor: color, backColor: 'transparent', selectable: false, draggable: false}).addTo(map);
    map.showLayersByID(id);
    return id;
}

function drawCircle(id, latitude, longitude, radius, color, dashed, filled) {
    if (!color) {
        color = "blue";
    }
    if (!dashed) {
        dashed = false;
    }

    if (filled) {
        var fillStyle = dashed ? Gis.fillStyle({color: color, hatch: 3, hatchColor: color}) : Gis.fillStyle({color: color});
        Gis.ellipse({id: id, latitude: latitude, longitude: longitude, alpha: radius, betta: radius, gamma: 0, draggable: false, fill: fillStyle}).addTo(map);
    } else {
        Gis.ellipse({id: id, latitude: latitude, longitude: longitude, alpha: radius, betta: radius, gamma: 0, draggable: false, fill: Gis.fillStyle({color: 'rgba(0,0,0,0)', hatchColor: 'rgba(0,0,0,0)'}), line: Gis.lineStyle({color: color, thickness: 5})}).addTo(map);
    }
    return id;
}

function drawPolyline(id, points, color, dashed, thickness, showDirections, courseIcon) {
    if (dashed == undefined || dashed == null) {
        dashed = false;
    }

    if (showDirections == undefined || showDirections == null) {
        showDirections = false;
    }

    thickness = thickness || 1;
    var pts = [];
    for (var i = 0; i < points.length; ++i) {
        pts.push(Gis.pathPoint({latitude: points[i].latitude, longitude: points[i].longitude}));
    }

    var dash = dashed ? "dash" : "solid";
    var polilyne = map.getLayer(id);
    if (!polilyne) {
        var path = Gis.path({id: id, points: pts, line: {color: color, thickness: thickness, dash: dash}, draggable: false, selectable: false});

        path.setCourseEnable(showDirections);
        if (showDirections) {
            path.setCoursePointPosition('end');
            path.setCourseIcon(Gis.icon({type: 'custom', image: Gis.image({fullPath: './images', hash: courseIcon})}));
        }

        path.addTo(map);
        map.showLayersByID(id);
    } else {
        polilyne.setData({id: id, points: pts, line: {color: color, thickness: thickness, dash: dash}, draggable: false, selectable: false});
    }

    return id;
}

function removeObject(id) {
    map.removeLayer(map.getLayer(id));
    return id;
}

function drawArrow(id, latitude, longitude, angle, selected) {
    var hash_image = !selected ? 'direction_line' : 'direction_line_selected';
    Gis.imageLabel({id: id, latitude: latitude, longitude: longitude, angle: (180 + angle), icon: Gis.icon({type: 'custom', image: Gis.image({fullPath: './images', hash: hash_image})})}).addTo(map);
    map.showLayersByID(id);
    return id;
}

function removeAllObjects() {
    if (map) {
        map.clearMap();
    }
}

function isIntersectsControl(id, latitude, longitude) {
    var control = map.getLayer(id);
    if (!control) {
        return false;
    }
    var bounds = control.getCurrentLatLngBounds();
    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    return ne.lat >= latitude && sw.lat <= latitude && ne.lng >= longitude && sw.lng <= longitude;
}

function zoomIn() {
    map.zoomIn();
}

function zoomOut() {
    map.zoomOut();
}

