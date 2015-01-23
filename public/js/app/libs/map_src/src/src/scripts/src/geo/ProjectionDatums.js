(function (Gis){
    'use strict';
    Gis.Util.extend(proj4.defs, {
        'EPSG:32629': '+proj=utm +zone=29 +ellps=WGS84 +datum=WGS84 +units=m +no_defs +over',
        'EPSG:4326': '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs +over',
        'EPSG:2399': '+proj=tmerc +lat_0=0 +lon_0=15 +k=1 +x_0=5500000 +y_0=0 +ellps=krass +towgs84=24,-123,-94,0.02,-0.25,-0.13,1.1 +units=m +no_defs +over',
        'EPSG:26916': '+proj=utm +zone=16 +ellps=GRS80 +datum=NAD83 +units=m +no_defs +over',
        'EPSG:3857': '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +nadgrids=@null +wktext +no_defs +over',
        'EPSG:3785': '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +nadgrids=@null +wktext +no_defs +over',
        'GOOGLE': "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs +over",
        'EPSG:3395': '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs +over +lon_wrap=360',
        'EPSG:41001': '+title=simple mercator EPSG:41001 +proj=merc +lat_ts=0 +lon_0=0 +k=1.000000 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +over'
    });
    var datuums = {};
    Gis.ProjectionDatuums = {
        getDatum: function (code) {
            code = code && code.replace(':', '');
            return code && datuums[code.toUpperCase()];
        }
    };
    proj4.defs["EPSG:900913"] = proj4.defs["GOOGLE"];
    //Гаус крюгер
    var key, i;

    for (i = 0; i <= 60; i += 1) {
        key = i < 10 ? '0' + i : i;
        proj4.defs['EPSG:284' + key] = '+proj=tmerc +lat_0=0 +lon_0=' + (i * 6 - 3) + ' +k=1 +x_0=' + i + '500000 +y_0=0 +ellps=krass +towgs84=24,-123,-94,-0.000000096963,0.000001212034,0.000000630258,1.0 +units=m +no_defs +over';
    }
    for (var id in proj4.defs) {
        if (proj4.defs.hasOwnProperty(id)) {
            datuums[id.replace(':', '')] = proj4.defs[id];
        }
    }
    for (i = 0; i <= 60; i += 1) {
        key = i < 10 ? '0' + i : i;
        proj4.defs('EPSG:284' + key, proj4.defs['EPSG:284' + key]);
    }
}(Gis));