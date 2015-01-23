/**
 * @typedef {Object}
 * @property {array[]} latlng координаты (Массив вида [[lat, lng], [lat2, lng2]])
 * @property {Gis.Additional.LineStyle | object} line
 * @property {Gis.Additional.FillStyle | object} fill
 * @property {boolean} [selectable=false]
 * @property {boolean} [draggable=false]
 * @property {Gis.Additional.Icon} [icon]
 * @property {object} [events]
 */
IF.PolygonData = {};