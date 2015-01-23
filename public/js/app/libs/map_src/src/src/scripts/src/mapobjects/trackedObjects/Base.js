"use strict";
/**
 * @class
 * @classdesc
 * Базовый класс дя поста и ИРИ
 * @param {Object} options
 * @param {{}|Gis.Additional.Icon} options.icon
 * @param {string} options.name
 * @param {{}|Gis.Additional.LineStyle} [options.trackStyle=new Gis.LineStyle()] стиль линии пути
 * @param {{}|Gis.Additional.TrackBehavior} [options.trackBehavior=new Gis.TrackBehavior()] поведение линии пути
 * @extends Gis.Objects.Base
 */
Gis.Objects.TrackedBase = Gis.Objects.Base.extend(
    /** @lends Gis.Objects.TrackedBase */
    {
        events: 'contextmenu',
        intervalTime: 500,
        _fullPath: false,
        _isMetaData: true,
        _points: undefined,
        required: ['id', 'name', 'icon'],
        fixed: "id tacticObjectType",
        _position: 'center',
        options: {
            id: undefined,
            icon: undefined,
            trackStyle: undefined,
            trackBehavior: undefined
        },
        initialize: function (data) {
            /**
             * @type {Gis.DrawPathBehavior}
             * @private
             */
            this._pathBehavior = new Gis.DrawPathBehavior(this);
            this._fillOption(data, null, 'icon', Gis.icon);
            this._fillOption(data, null, 'trackStyle', Gis.lineStyle);
            if (data) {
                data.trackBehavior = Gis.trackBehavior(data.trackBehavior || {});
            }
            this._points = {
                position: new Gis.Objects.PathData(),
                bearing: new Gis.Objects.PathData()
            };
            Gis.Objects.Base.prototype.initialize.call(this, data);
        },
        /**
         * Угол поворота иконки в текущей позиции
         * @return {number}
         */
        getAngle: function () {
            return (this.options.icon && this.options.icon.isRotatable() && this._currentPosition.getCourse()) || 0;
        },
        clearMeta: function () {
            this._hideArtifact();
            this._currentPosition = null;
            this.clearPoints();
            this.fire('clearmeta');
            return this;
        },
        /**
         * Почистить позиции и пеленги
         */
        clearPoints: function () {
            var map = this._map, self = this, pts,
                func = function (point) {
                    this.remove(point);
                    if (map) {
                        map.removeLayer(point);
                    }
                    if (self._mapRender) {
                        self._mapRender.removeLayer(point);
                    }
                };
            for (var point in this._points){
                if (this._points.hasOwnProperty(point)) {
                    pts = this._points[point];
                    pts.each(func, pts);
                }
            }
        },
        _recalculatePoints: function (options, visibilityController) {
            this._lastPoints = this._pathBehavior.getPathPoints(options, visibilityController);
            return this._lastPoints;
        },
        _hideArtifact: function (map) {
            if (this._pointForDraw) {
                this._pointForDraw.closeArtifacts(map);
            }
        },
        /**
         *
         * @param map
         * @param {Gis.ObjectVisibilityController} visibilityController
         */
        drawArtifacts: function (map, visibilityController) {
            var currentPosition = this._pathBehavior.getCurrentPosition(visibilityController);
            if (this._pointForDraw !== currentPosition) {
                this._hideArtifact(map);
                if (currentPosition) {
                    this._pointForDraw = currentPosition;
                    this._pointForDraw.drawArtifacts(map);
                }
            }
        },
        initAutoUpdate: function (pointsLength, bearingLength) {
            var bearingBehavior = Gis.bearingBehavior(this.getOption('bearingBehavior')),
                isBearingBehaviorTimeSeted = bearingLength && !!bearingBehavior.gerBearingShowTimeSeconds();
            if ((pointsLength > 1 && !!Gis.trackBehavior(this.getOption('trackBehavior')).getTraceLengthSeconds()) ||
                (bearingLength && (bearingLength > Gis.Additional.BearingBehavior.ALWAYS_SHOW_COUNT && isBearingBehaviorTimeSeted))) {
                this.fire('needupdate', {layer: this});
            } else {
                this.fire('noneedupdate', {layer: this});
            }
        },
        onAdd: function (map) {
            Gis.Objects.Base.prototype.onAdd.call(this, map);
            this.on("attach", this._attached, this);
            this.on("hided", this.clearMeta, this);
        },
        onDelete: function (event) {
            Gis.Objects.Base.prototype.onDelete.call(this, event);
            this.off('attach', this._attached, this);
            this.off("hided", this.clearMeta, this);
        },
        _attached: function (event) {
            var to = event.to,
                points;

            if (!to || !to.getLatLng) {
                throw new Error("Not correct child");
            }
            points = this._points[to.getType()];
            points.add(to);
            if (to.getType() === 'position') {
                if (!this._currentPosition || this._currentPosition.getTimeStamp() <= to.getTimeStamp()) {
                    this._currentPosition = to;
                }
            }
            this.fire('change', {target: this});
        },
        getLatLng: function () {
            if (this._currentPosition) {
                return this._currentPosition.getLatLng();
            }
        }
    }
);
