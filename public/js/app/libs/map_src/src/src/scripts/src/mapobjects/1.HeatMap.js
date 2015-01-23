/**
 * Created by Пользователь on 07.04.14.
 */
(function (Gis) {
    "use strict";

    function _getPercent(color, max, min) {
        return Gis.Util.isDefine(color.percent) ? color.percent : (color.value - min) / max;
    }

    /**
     * @typedef {Object} Gis.Objects.HeatMap.GradientValue
     * @property {number} value - значение высоты/температуры (взаимозаменяемо с percent, использовать одно из)
     * @property {number} percent - проценты высоты/температуры (взаимозаменяемо с value, использовать одно из)
     * @property {string} color - цвет в этой точке
     */
    /**
     * @class
     * @classdesc
     * Тепловая карта / карта высот
     * @param {Object} options
     * @param {string} [options.tacticObjectType='heatmap'] тип
     * @param {string} options.id Guid
     * @param {boolean} options.reset Перерисовывать при получении новых данных
     * @param {Object} options.matrix Матрица с данными
     * @param {Number} options.matrix.n Север
     * @param {Number} options.matrix.s Юг
     * @param {Number} options.matrix.w Запад
     * @param {Number} options.matrix.e Восток
     * @param {Number} [options.matrix.width=values.length] число точек по широте
     * @param {Number} [options.matrix.height=values[0].length] число точек по долготе
     * @param {Array.<Array.<number>>} options.matrix.values Значения высот
     * @param {Array.<Gis.Objects.HeatMap.GradientValue>} options.matrix.gradient Значения цветов
     * @example
     * var a = Gis.heat_map({
     *      id: Gis.Util.generateGUID(),
     *      selectable: true,
     *      tooltip: "tooltip",
     *      matrix: {
     *          n: 59.96600, w: 29.92675, s: 59.43390, e:  30.77271,
     *          values: [[0, 0, 0, 0, 0], [0, 100, 130, 100, 0], [0, 0, 150, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
     *          gradient: [{color: "rgba(0, 0, 0, 0)", percent: 0}, {color: 'rgba(242, 14, 14, 256)', percent: 0.5}, {color: 'black', percent: 1}]
     *      }
     * }).addTo(gisMap)
     * //Для принудительного откючения фоновых потоков
     * L.HeatMap.SKIP_WW = true;
     * //Отключить контроль выхода пикселей за границы координатной области, несколько ускорит вычисление
     * L.HeatMap.SKIP_INTERSECT_CHECK = true;
     *
     * //Установка цвета пикселей, для которых нет данных
     * Gis.setConfig(Gis.Objects.HeatMap.NAN_COLOR_CONGIG_KEY, "rbga(0, 0, 0, 0)");
     *
     * //Градиенты тепловой карты, доступные для выбора в виджете
     * Gis.setConfig('heatmap.colors', [
     *      [{percent: 0, color: new RGBColor("black")}, {percent: 1, color: new RGBColor("white")}],
     *      [{percent: 0, color: new RGBColor("rgb(9,63,235)")}, {percent: 1, color: new RGBColor("rgb(8, 10, 0)")}],
     *      [{percent: 0, color: new RGBColor("rgb(181,194,32)")}, {percent: 1, color: new RGBColor("rgb(255, 2, 2)")}],
     *      [{percent: 0, color: new RGBColor("rgb(0,10,252)")}, {percent: 0.5, color: new RGBColor("rgb(34, 34, 32)")}, {percent: 1, color: new RGBColor("rgb(164, 170, 19)")}]
     *]);
     * @extends Gis.Objects.Selectable
     */
    Gis.Objects.HeatMap = Gis.Objects.Selectable.extend(
    /** @lends Gis.Objects.HeatMap# */
        {
            events: Gis.Core.Events.availableDomEvents,
            options: {
                tacticObjectType: 'heatmap',
                id: undefined,
                drawPath: true,
                reset: false,
                matrix: undefined
//                n: undefined,
//                s: undefined,
//                w: undefined,
//                e: undefined,
//                width: undefined,
//                height: undefined,
//                values: undefined,
//                gradient: undefined
            },
            optionsFire: [
                'tacticObjectType',
                'id',
                'tags',
                'name',
                'caption',
                'customActions',
                'tooltip',
                'matrix'
            ],
            /**
             * Установить прозрачность
             * @param {number} opacity 0-1
             */
            setOpacity: function (opacity) {
                this._opacity = opacity;
                this.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE);
            },
            setData: function () {
                var apply = Gis.Objects.Selectable.prototype.setData.apply(this, arguments);
                this._changed = this._changed || this._isChanged(apply);
                return apply;
            },
            initialize: function (data) {
                this._changed = ['matrix'];
                Gis.Objects.Selectable.prototype.initialize.call(this, data);
                this._opacity = Gis.config('heatmap.opacity', 0.6);
            },
            onAdd: function (map) {
                Gis.Objects.Selectable.prototype.onAdd.call(this, map);
            },
            /**
             * В массиве есть данные отличные от NaN
             * @param {Array.<number|NaN>} data
             */
            isHasCorrectData: function (data) {
                var i, k, len, len2, middle1, middle2;
                if (data && Gis.Util.isArray(data)) {
                    len = data.length;
                    middle1 = Math.floor(len / 2);
                    middle2 = Math.floor(data[0] / 2);
                    for (i = 0; i < len; i += 1) {
                        len2 = data[i].length;
                        for (k = 0; k < len2; k += 1) {
                            if (!isNaN(data[i][k]) && i !== middle1 && k !== middle2) {
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            notifyIsNan: function (data) {
                if (!this.isHasCorrectData(data)) {
                    Gis.notify('На сервере нет данных для выбранной области', 'warning');
                }
            },
            /**
             * @fires Gis.Objects.Base.NEED_REDRAW_EVENT
             * Установить пользовательский градиент
             * @param {Array.<{ value : number, percent : number, color : string }>} gradient
             */
            setUserSelectedGradient: function (gradient) {
                this._selectedGradient = gradient;
                this._changed = true;
                this.fire(Gis.Objects.Base.NEED_REDRAW_EVENT.TYPE, {target: this});
            },
            /**
             *
             * @return {Array.<{value: number, percent: number, color: string}>|undefined}
             */
            getSelectedGradient: function () {
                return this._selectedGradient;
            },
            onDelete: function (e) {
                Gis.Objects.Selectable.prototype.onDelete.call(this, e);
            },
            preDraw: function () {
                return Gis.Objects.Selectable.prototype.preDraw.apply(this, arguments);
            },
            _isChanged: function (array) {
                return array && (array.indexOf('matrix') > -1);
            },
            draw: function (map) {
                if (!this.preDraw()) {
                    return;
                }
                var changed = this._changed,
                    options = this.getOptionsWithStyle();
                this._lowLevelObject = map.drawHeatMap({
                    opacity: this._opacity,
                    colors: this._selectedGradient || options.matrix.gradient,
                    changed: changed,
                    drawPath: options.drawPath,
                    points: options.matrix.values,
                    caption: options.caption,
                    width: options.matrix.width,
                    reset: options.reset,
                    height: options.matrix.height,
                    selected: this.isSelected(),
                    tooltip: options.tooltip,
                    bounds: L.latLngBounds(L.latLng(options.matrix.n, options.matrix.w), L.latLng(options.matrix.s, options.matrix.e)),
                    //throw available events to top api
                    events: {
                        type: this.events,
                        callback: this.fireEventsFromLowLevel,
                        context: this
                    }
                }, this._lowLevelObject);
                this._changed = false;
                Gis.Objects.Selectable.prototype.draw.call(this, map);
            },
            getGradient: function () {
                var optionsWithStyle = this.getOptionsWithStyle();
                return optionsWithStyle.matrix && optionsWithStyle.matrix.gradient.slice();
            },
            getLatLng: function () {
                var options = this.getOptionsWithStyle();
                return [options.matrix.s + (options.matrix.n - options.matrix.s) / 2, options.matrix.w + (options.matrix.e - options.matrix.w) / 2];
            },
            getLatLngBounds: function () {
                var options = this.getOptionsWithStyle();
                return Gis.latLngBounds(Gis.latLng(options.matrix.n, options.matrix.w), Gis.latLng(options.matrix.s, options.matrix.e));
            }
        }
    );
    Gis.heat_map = function (data) {
        return new Gis.Objects.HeatMap(data);
    };
    Gis.heatmap = Gis.heat_map;
    Gis.ObjectFactory.list.heatmap = Gis.Objects.HeatMap;
    Gis.ObjectFactory.list['heat-map'] = Gis.Objects.HeatMap;
    Gis.Objects.HeatMap.parseColors = function (colors) {
        var max, min;
        this._foundMaxMin(colors);
        max = this._max;
        min = this._min;
        colors = colors.map(function (color) {
            var newColor = {value: color.value, percent: _getPercent(color, max, min)};
            newColor.color = Gis.Objects.HeatMap.getRbg(color.color);
            return newColor;
        });
        colors = colors.sort(function (color1, color2) {
            var col1 = Gis.Util.isDefine(color1.percent) ? color1.percent : (color1.value - min) / max,
                col2 = Gis.Util.isDefine(color2.percent) ? color2.percent : (color2.value - min) / max;
            return col1 - col2;
        });
        return colors;
    };
    Gis.Objects.HeatMap.unParseColors = function (colors) {
        var max, min;
        this._foundMaxMin(colors);
        max = this._max;
        min = this._min;
        colors = colors.map(function (color) {
            var newColor = {value: color.value, percent: _getPercent(color, max, min)};
            newColor.color = Gis.Objects.HeatMap.getRbg(color.color).toRGBA();
            return newColor;
        });
        colors = colors.sort(function (color1, color2) {
            var col1 = Gis.Util.isDefine(color1.percent) ? color1.percent : (color1.value - min) / max,
                col2 = Gis.Util.isDefine(color2.percent) ? color2.percent : (color2.value - min) / max;
            return col1 - col2;
        });
        return colors;
    };
    Gis.Objects.HeatMap._foundMaxMin = function (colors) {
        var i, len, value;
        this._max = -Infinity;
        this._min = Infinity;
        for (i = 0, len = colors.length; i < len; i += 1) {
            value = colors[i].value;
            if (Gis.Util.isDefine(value) && !isNaN(value)) {
                this._max = Math.max(this._max, value);
                this._min = Math.min(this._min, value);
            }
        }
    };

    Gis.Objects.HeatMap.getRbg = function (color, cache) {
        if (Gis.Util.isDefine(color.r) && Gis.Util.isDefine(color.g) && Gis.Util.isDefine(color.b)) {
            return color;
        }
        if (cache) {
            cache.parseColor(color);
            return cache;
        }
        return new RGBColor(color);
    };

    Gis.Objects.HeatMap.NAN_COLOR_CONGIG_KEY = 'heatmap.nan_color';
}(Gis));