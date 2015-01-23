/**
 * @typedef {Object}
 * @property {Gis.LatLng | number[]} latlng Координаты центра
 * @property {Gis.Additional.LineStyle | object} line Стиль линии
 * @property {Gis.Additional.FillStyle | object} fill Стиль заливки
 * @property {number} alpha Радиус 1
 * @property {number} betta Радиус 2
 * @property {number} gamma Угол наклона
 * @property {boolean} selectable=false
 * @property {boolean} draggable=false
 * @property {Object} events
 */
IF.EllipseData = {};