/**
 * @typedef {Object}
 * @property {Gis.LatLng | number[]} [latlng] Координаты центра
 * @property {number} [zoom]
 * @property {Gis.TmsLayer} [layer=Gis.TmsLayer.osm()]
 * @property {number} [maxZoom=18]
 * @property {number} [minZoom=0]
 * @property {IF_MAP_ELEMENT_DATA[] | IF_MAP_ELEMENT_DATA} [maps]
 * @property {G.Maps.Base} [provider=new Gis.Maps.Leaflet.LeafletProvider()]
 */
IF.GIS_MAP_DATA = {};