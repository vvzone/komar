(function (Gis) {
    'use strict';
    var keyParams = ['Pt', 'Pr', 'A', 'B', 'freq', 'gTr', 'gRec', 'h_a', 'd_k'];
    /**
     * @class
     * @classdesc
     * Тепловая карта / карта высот
     * @param {Object} options
     * @param {string} [options.tacticObjectType='heatmap'] тип
     * @param {string} options.id Guid
     * @param {Gis.LatLng} options.center
     * @param {number} options.radius метры
     * @param {number} [options.alt]  высота в центре области (высота наблюдателя), м; по умолчанию 0
     * @param {number} [options.alt-type] тип высоты (“absolute” или “relative”); по умолчанию относительная
     * @param {number} [options.areal-alt] высота над рельефом во всех расчетных точках, м; по умолчанию 0;
     * @param {number} [options.areal-alt-type] тип высоты (“absolute” или “relative”); по умолчанию относительная;
     * @param {Array.<Array.<number>>} options.matrix.values Значения высот
     * @param {Array.<Gis.Objects.HeatMap.GradientValue>} options.matrix.gradient Значения цветов
     * @example
     * // установка гридиентов
     * Gis.setConfig(Gis.Objects.VisibilityMap.CONFIG_GRADIENT_KEY, [{color: "rgba(0, 0, 0, 255)", value: 1}, {color: 'rgba(255, 255, 255, 128)', value: 0}]);
     * @extends Gis.Objects.HeatMap
     */
    Gis.Objects.VisibilityMap = Gis.Objects.HeatMap.extend(
    /** @lends Gis.Objects.VisibilityMap# */
        {
            events: Gis.Core.Events.availableDomEvents,
            options: {
                tacticObjectType: 'visibility',
                reset: true,
                center: null,
                radius: null,
                name: 'Область видимости',
                alt: null,
                'accuracy': null,
                'areal-alt': null,
                'alt-type': 'relative',
                'areal-alt-type': 'relative',
                'visibility-type': 'visibility',
                Pt:null,
                Pr:null,
                A:null,
                B:null,
                freq:null,
                gTr:null,
                gRec:null,
                h_a:null,
                d_k:null,
                drawPath: false,
                count: 0
            },
            onAdd: function () {
                var onAddResult = Gis.Objects.HeatMap.prototype.onAdd.apply(this, arguments);
                this._changed = false;
                this._requestMatrix();
                this.on('select', this._onSelect);
                return onAddResult;
            },
            onDelete: function () {
                var onAddResult = Gis.Objects.HeatMap.prototype.onDelete.apply(this, arguments);
                this.on('off', this._onSelect);
                this._lowLevelObject = null;
                this.options.matrix = null;
                return onAddResult;
            },
            getAdditionalRequestParams: function () {
                var result = {}, self = this;
                keyParams.forEach(function (value) {
                    result[value] = self.getOption(value);
                });
                result.phi = this.getCenter().lat;
                result.freq *= 1e6;
                return result;
            },
            _requestMatrix: function () {
                var self = this;
                if (this._map) {
                    L.ReliefControlCircle.getInstance().showRadar(true);
                    if (this._$ajax) {
                        this._$ajax.abort();
                    }
                    this._$ajax = this._map.getVisibility(this.getCenter(), this.getRadius(), function (data) {
                        self._$ajax = null;
                        L.ReliefControlCircle.getInstance().showRadar(false);
                        var matrix = Gis.extend({
                            gradient: Gis.config(Gis.Objects.VisibilityMap.CONFIG_GRADIENT_KEY)
                        }, data);
                        self.notifyIsNan(matrix.values);
                        Gis.Objects.HeatMap.prototype.setData.call(self, {matrix: matrix});
                    }, function () {
                        self._$ajax = null;
                        L.ReliefControlCircle.getInstance().showRadar(false);
                        self.fire('loaddataerror');
                    }, this.getHeight(), this.getArealHeight(), this.getOption('alt-type'), this.getOption('areal-alt-type'), this.getAccuracyCoefficient(),
                        this.options['visibility-type'] !== 'visibility' ? this.getAdditionalRequestParams() : undefined);
                }
            },
            _onSelect: function () {
                if (this._$ajax) {
                    L.ReliefControlCircle.getInstance().showRadar(true);
                }
            },
            getAccuracyCoefficient: function () {
                var accuracy = this.getOption('accuracy'), count = Gis.config('gis.region-of-sight.count') || 100;
                return accuracy ? accuracy * count : count;
            },
            setData: function () {
                var setDataResult = Gis.Objects.HeatMap.prototype.setData.apply(this, arguments);
                this._requestMatrix();
                return  setDataResult;
            },
            preDraw: function () {
                return this.options.matrix && Gis.Objects.HeatMap.prototype.preDraw.apply(this, arguments);
            },
            getCenter: function () {
                return this.getOption('center');
            },
            getLatLng: function () {
                return this.getCenter();
            },
            getRadius: function () {
                return this.getOption('radius');
            },
            getHeight: function () {
                return this.getOption('alt');
            },
            getArealHeight: function () {
                return this.getOption('areal-alt');
            },
            getVisibilityType: function () {
                return this.getOption('visibility-type');
            }
        }
    );
    Gis.Objects.VisibilityMap.CONFIG_GRADIENT_KEY = 'gis.visibilitymap.gradient';
    Gis.setConfig(Gis.Objects.VisibilityMap.CONFIG_GRADIENT_KEY, [{color: "rgba(0, 0, 0, 1)", value: 1}, {color: 'rgba(255, 255, 255, 0.5)', value: 0}]);
    Gis.visibilitymap = function (data) {
        return new Gis.Objects.VisibilityMap(data);
    };
}(Gis));