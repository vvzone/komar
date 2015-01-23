(function (Gis) {
    /**
     * @class
     * @classdesc
     * Площадной рельеф
     * @extends Gis.Objects.HeatMap
     */
    Gis.Objects.ArealRelief = Gis.Objects.HeatMap.extend(
    /** @lends Gis.Objects.ArealRelief# */
        {
            events: Gis.Core.Events.availableDomEvents,
            options: {
                tacticObjectType: 'areal-relief',
                reset: true,
                name: 'Площадной рельеф',
                n: null,
                s: null,
                w: null,
                e: null,
                accuracy: null,
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
            getGradient: function () {
                var optionsWithStyle = this.getOptionsWithStyle();
                var gradient = (optionsWithStyle.matrix && optionsWithStyle.matrix.gradient) || Gis.config(Gis.Objects.ArealRelief.CONFIG_GRADIENT_KEY);
                return gradient && gradient.slice();
            },
            _requestMatrix: function () {
                var self = this;
                if (this._map && this._needRequest) {
                    this._needRequest = false;
                    this.options.matrix = null;
                    L.ReliefControlSquare.getInstance().showRadar(true);
                    if (this._$ajax) {
                        this._$ajax.abort();
                    }
                    this._$ajax = this._map.getHeightsAreal(this.getArealBounds(), this.getAccuracyCoefficient(), function (data) {
                        self._$ajax = null;
                        L.ReliefControlSquare.getInstance().showRadar(false);
                        var matrix = Gis.extend({
                            gradient: this._selectedGradient || self.getGradient(),
                            values: data,
                            n: self.getOption('n'),
                            s: self.getOption('s'),
                            w: self.getOption('w'),
                            e: self.getOption('e')
                        });
                        self.notifyIsNan(matrix.values);
                        Gis.Objects.HeatMap.prototype.setData.call(self, {matrix: matrix});
                    }, function () {
                        self._$ajax = null;
                        L.ReliefControlSquare.getInstance().showRadar(false);
                        self.fire('loaddataerror');
                    });
                }
            },
            _onSelect: function () {
                if (this._$ajax) {
                    L.ReliefControlCircle.getInstance().showRadar(true);
                }
            },
            getAccuracyCoefficient: function () {
                var accuracy = this.getOption('accuracy'), count = Gis.config('gis.area-relief.count') || 100;
                accuracy = accuracy && parseFloat(accuracy);
                return accuracy ? accuracy * count : count;
            },
            setData: function () {
                var setDataResult = Gis.Objects.HeatMap.prototype.setData.apply(this, arguments);
                if (setDataResult && (setDataResult.indexOf('accuracy') > -1 ||
                    setDataResult.indexOf('n') > -1 ||
                    setDataResult.indexOf('s') > -1 ||
                    setDataResult.indexOf('w') > -1 ||
                    setDataResult.indexOf('e') > -1)) {
                    this._needRequest = true;
                    this._requestMatrix();
                }
                return setDataResult;
            },
            initialize: function () {
                this._needRequest = true;
                return Gis.Objects.HeatMap.prototype.initialize.apply(this, arguments);
            },
            preDraw: function () {
                return this.options.matrix && Gis.Objects.HeatMap.prototype.preDraw.apply(this, arguments);
            },
            getCenter: function () {
                return this.getArealBounds().getCenter();
            },
            getLatLng: function () {
                return this.getCenter();
            },
            getNorthWest: function () {
                return Gis.latLng([this.getOption('n'), this.getOption('w')]);
            },
            getSouthEast: function () {
                return Gis.latLng([this.getOption('s'), this.getOption('e')]);
            },
            getArealBounds: function () {
                return Gis.latLngBounds(this.getNorthWest(), this.getSouthEast());
            }

        }
    );
    Gis.Objects.ArealRelief.CONFIG_GRADIENT_KEY = 'gis.areal-relief.gradient';
    Gis.setConfig(Gis.Objects.ArealRelief.CONFIG_GRADIENT_KEY, [
        {color: "black", percent: 0},
        {color: '#1300BE', percent: 0.2},
        {color: '#00C5FF', percent: 0.4},
        {color: '#24FF00', percent: 0.6},
        {color: '#EFFF00', percent: 0.7},
        {color: '#FF0000', percent: 0.9},
        {color: '#FF0AE9', percent: 1}
    ]);
    Gis.arealRelief = function (data) {
        return new Gis.Objects.ArealRelief(data);
    };
}(Gis));