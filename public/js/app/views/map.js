define(
    'views/map',
    [
        'jquery',
        'underscore',
        'backbone',
        'react',
        'event_bus',
        'config',
        //'window'
        'leaflet',
        'proj4',
        //'map_main'
        //'map'


    ],function($, _, Backbone, React, EventBus, Config, leaflet, proj4, map_main
               ){ //Gis, Map , window
        /*
        var test = function (a) {
            var b, c;
            if ("function" == typeof define && define.amd)define(["leaflet", "proj4"], a);
            else if ("undefined" != typeof module)b = require("leaflet"), c = require("proj4"), module.exports = a(b, c);
            else {
                if ("undefined" == typeof window.L || "undefined" == typeof window.proj4)throw"Leaflet and proj4 must be loaded first";
                a(window.L, window.proj4)
            }
        }*/


        /*
        var b,c;
        b = require("leaflet");
        c = require("proj4");


        console.info(['leaflef', b]);
        console.info(['proj4', c]);
        */

        var req_L, req_proj4;
        req_L = require('leaflet');
        req_proj4 = require('proj4');

        console.info(['leaflef', leaflet]);
        console.info(['req_L', req_L]);
        console.info(['proj4', proj4]);
        console.info(['req_proj4', req_proj4]);

        window.proj4 = req_proj4;
        //module.exports = a(b, c);



        console.log('views/map loaded...');
        var debug = (Config['debug'] && Config['debug']['debug_map'])? 1:null;

        //require(['./js/app/libs/maps/deploy/scripts/gis.full.min.js']);

        //require(['deploy/scripts/gis.full.min.js']);
        //require(['./js/app/libs/maps/deploy/libs/ui/scripts/gis.ui.full.min.js']);

        //require(['deploy/libs/ui/scripts/gis.ui.full.min.js']);

        var initialize = function(){
            (debug)?console.info('MapComponent(view/map) initialization... '):null;


            //require('map_main');
            //require('map_main');


            require(['map_main'], function(MapMain){
                return;
            });




            /*
            require(['map'], function(Map){
                return;
            });*/



            console.info(['window', window]);
            $('#main_main').prepend('<div id="map"/>');
            //startMapping();
        };

        var showMap = function(){
            "use strict";
            var gisMap;

            function showMap() {
                /*
                 if (BrowserDetect.browser === 'Chrome' && BrowserDetect.version === 34) {
                 L.HeatMap.SKIP_WW = true;
                 L.HeatMap.SKIP_INTERSECT_CHECK = L.HeatMap.SKIP_WW;
                 }*/
                console.info(['window', window]);
                console.info(['window.Gis', window.Gis]);
                gisMap = window.Gis.map("map", {
                    latlng: [51.505, -0.09],
                    settings: {
                        "ui": window.Gis.UI.USERSET.FULL,
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
                (debug)?console.info('startMapping'):null;
                window.Gis.setConfig('relativePath', 'deploy/');
                showMap();
            }

            startMapping();
        }


        return {
            initialize: initialize,
            show: showMap
        }
    }
);
