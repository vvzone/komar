/**
 * @typedef {Object}
 * @property {Gis.LatLng | number[]} latlng Координаты точки привязки
 * @property {string} [className]
 * @property {string} [gisClass]
 * @property {string} [popup]
 * @property {string} [position]
 * @property {string} [caption]
 * @property {string} [captionColor]
 * @property {string} [captionPosition='bottomcenter']
 * @property {string} [opacity=1]
 * @property {string} [angle=0]
 * @property {boolean} [selectable=false]
 * @property {boolean} [selected=false]
 * @property {boolean} [draggable=false]
 * @property {Gis.Additional.Icon} icon не обязательно если указан iconUrl
 * @property {string} [iconUrl]
 * @property {object} [events]
 */
IF.MarkerData = {};