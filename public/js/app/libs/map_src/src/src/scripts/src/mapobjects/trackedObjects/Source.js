"use strict";
/**
 * @class
 * @classdesc
 * ИРИ
 * @param {Object} options
 * @param {string} [options.tacticObjectType='source'] тип
 * @param {Gis.Additional.LineStyle} [options.bearingStyle] Стиль линии пеленга. Если не указано то цвета иконки толщиной 2, или синяя, если иконка кастомная без цвета
 * @param {Gis.Additional.BearingBehavior} [options.bearingBehavior=Gis.Config.SourceBearingBehavior] Поведение линии пеленга
 * @example Базовый
 * var a = Gis.source({
     *      id: Gis.Util.generateGUID(),
     *      icon: {type: 'plane', color: 'red'},
     *      tooltip: "post tooltip",
     *      caption: "Example caption",
     *      name: "Example name"
     * }).addTo(gisMap)
 * @extends Gis.Objects.TrackedBase
 */

Gis.Objects.Source = Gis.Objects.TrackedBase.extend(
    /** @lends Gis.Objects.Source# */
    {
        _selfDraw: {bearing: true, track: true},
        _className: 'gis-source',
        defaultSmoothFactor: '',
        options: {
            tacticObjectType: 'source',
            bearingStyle: undefined,
            bearingBehavior: undefined
        },
        optionsFire: [
            'tacticObjectType',
            'id',
            'name',
            'caption',
            'tooltip',
            'icon',
            'trackStyle',
            'tags',
            'trackBehavior',
            'bearingStyle',
            'customActions',
            'bearingBehavior'
        ],
        initialize: function (data) {
            var bearingStyle;
            bearingStyle = data.bearingStyle || (data.icon ? {color: data.icon.color, thickness: 2} : {color: 'blue', thickness: 2});
            data.bearingStyle = Gis.lineStyle(bearingStyle);
            this._fillOption(data, null, 'trackStyle', Gis.lineStyle);
            data.bearingBehavior = data.bearingBehavior ? Gis.bearingBehavior(data.bearingBehavior) : Gis.Config.SourceBearingBehavior;
            data.trackBehavior = data.trackBehavior ? Gis.trackBehavior(data.trackBehavior) : Gis.Config.SourceTrackBehavior;
            Gis.Objects.TrackedBase.prototype.initialize.call(this, data);
        },
        setData: function (data, val, notFire) {
            val = this._fillOption(data, val, 'bearingStyle', Gis.lineStyle);
            val = this._fillOption(data, val, 'bearingBehavior', Gis.bearingBehavior);
            val = this._fillOption(data, val, 'trackBehavior', Gis.trackBehavior);
            val = this._fillOption(data, val, 'trackStyle', Gis.lineStyle);
            val = this._fillOption(data, val, 'icon', Gis.icon);
            Gis.Objects.TrackedBase.prototype.setData.call(this, data, val, notFire);
        },
        _drawBearing: function (bearing, map) {
            bearing.draw(map);
        },
        clearMeta: function () {
            this._hideAllBearing();
            Gis.Objects.TrackedBase.prototype.clearMeta.call(this);
        },
        onAdd: function (gis) {
            Gis.Objects.TrackedBase.prototype.onAdd.call(this, gis);
            var self = this;
            this._zoomFunc = function () {
                //this = gis
                self.fire('zoomchanged');
                self.fire('change', {target: self});
            };
            gis.on('zoomend', this._zoomFunc);
        },
        onDelete: function (event) {
            this._map.off('zoomend', this._zoomFunc);
            delete this._zoomFunc;
            Gis.Objects.TrackedBase.prototype.onDelete.call(this, event);
        },
        _hideAllBearing: function () {
            var self = this;
            if (!this._points.bearing) {
                return;
            }
            this._points.bearing.getSortedPoints().forEach(function (val) {
                self._hideBearing(val);
            });
        },
        _hideBearing: function (bearing) {
            this._map.removeLayer(bearing);
        },
        /**
         *
         * @param {Gis.Maps.Base} map
         * @param {Gis.ObjectVisibilityController} visibilityController
         * @private
         */
        _drawBearingList: function (map, visibilityController) {
            var i, bearing, len, bearingBehavior;

            if (this._points.bearing) {
                bearing = this._points.bearing.getSortedPoints(Gis.bearingBehavior(this.getOption('bearingBehavior')));
                if (this._selfDraw.bearing) {
                    for (i = 0, len = bearing.length; i < len; i += 1) {
                        if (visibilityController.isObjectVisible(bearing[i])) {
                            this._drawBearing(bearing[i], map);
                        } else {
                            bearing[i].hide(map);
                        }
                    }
                }
            }
        },
        /**
         *
         * @param bearing
         * @param position
         * @public
         * @ignore
         * @returns {boolean}
         */
        isBearingVisible: function (bearing, position) {
            var bearingBehavior = Gis.bearingBehavior(this.getOption('bearingBehavior'));
            position = Gis.Util.isNumeric(position) ? position : this._points.bearing.searchPositionToInsert(bearing);
            var size = this._points.bearing.size();
            return !bearingBehavior || bearingBehavior.isBearingVisible(bearing, size ? size - position : 1);
        },
        /**
         *
         * @return {Gis.LineStyle}
         */
        getBearingStyle: function () {
            return Gis.lineStyle(this.getOption('bearingStyle'));
        },
        getOptionsWithStyle: function () {
            return Gis.Util.extend({
                trackBehavior: Gis.trackBehavior(Gis.Config.DefaultTrackBehavior),
                bearingBehavior: Gis.bearingBehavior(Gis.Config.DefaultBearingBehavior)
            }, Gis.Objects.TrackedBase.prototype.getOptionsWithStyle.apply(this, arguments));
        },
        draw: function (map, visibilityController) {
            if (!this.preDraw()) {
                return;
            }
            var path,
                marker,
                points,
                options,
                currentPosition,
                pathBehavior = this._pathBehavior;
            Gis.Objects.TrackedBase.prototype.draw.call(this, map);
            options = this.getOptionsWithStyle();
            points = this._recalculatePoints(options, visibilityController);
            currentPosition = pathBehavior.getCurrentPosition(visibilityController);
            this._drawBearingList(map, visibilityController);
            if (currentPosition) {
                marker = pathBehavior.drawMarker(map, options, visibilityController);
                path = pathBehavior.drawPath(options, map, visibilityController);
                this.initAutoUpdate(points.length, this._points.bearing && this._points.bearing.getSortedPoints().length);
                this._map.startCache();
                try {
                    this.drawArtifacts(map, visibilityController);
                } finally {
                    this._map.flush();
                }
                this._lowLevelObject = {
                    inset: true,
                    marker: marker,
                    path: path
                };
            } else {
                this.initAutoUpdate(0, this._points.bearing && this._points.bearing.getSortedPoints().length);
                map.removeLayer(this._lowLevelObject);
            }
        }
    }
);
/**
 * Возвращает новый экземпляр Gis.Objects.Source
 * @param data
 * @returns {Gis.Objects.Source}
 */
Gis.source = function (data) {
    return new Gis.Objects.Source(data);
};
Gis.ObjectFactory.list.source = Gis.Objects.Source;
