define(
    'views/map',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'event_bus',
        'config'
/*
        'map_main',
        'map'
*/

    ],function($, _, Backbone, React, EventBus, Config
        ){ //Gis, Map


        console.log('views/map loaded...');
        var debug = (Config['debug'] && Config['debug']['debug_map'])? 1:null;

        var initialize = function(){
            (debug)?console.info('MapComponent(view/map) initialization... '):null;

            var Gis = require(['./js/app/libs/maps/deploy/scripts/gis.full.min.js']);
            console.info(['GIS', Gis]);
            var L = require(['./js/app/libs/maps/deploy/libs/ui/scripts/gis.ui.full.min.js']);

            $('#main_main').prepend('<div id="map"/>');

            "use strict";
            var gisMap;
            
            function showMap() {
                /*
                if (BrowserDetect.browser === 'Chrome' && BrowserDetect.version === 34) {
                    L.HeatMap.SKIP_WW = true;
                    L.HeatMap.SKIP_INTERSECT_CHECK = L.HeatMap.SKIP_WW;
                }*/
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
        };

        return {
            initialize: initialize
        }
    }
);
