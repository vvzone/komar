"use strict";
/**
 * @class
 * @classdesc
 * Пост
 * @param {Object} options
 * @param {string} [options.tacticObjectType='post'] тип
 * @param {Gis.Additional.LineStyle} [options.courseStyle=Gis.Config.PostTrackBehavior] Стиль линии курса
 * @example Базовый
 * var a = Gis.post({
     *      selectable: true,
     *      id: Gis.Util.generateGUID(),
     *      icon: {type: 'plane', color: 'red'},
     *      tooltip: "post tooltip",
     *      caption: "Example caption",
     *      name: "Example name"
     * }).addTo(gisMap)
 * @example Настроеное поведение
 * var a = Gis.post({
     *      selectable: true,
     *      id: Gis.Util.generateGUID(),
     *      icon: {type: 'plane', color: 'red'},
     *      tooltip: "post tooltip",
     *      caption: "Example caption",
     *      name: "Example name",
     *      trackBehavior: {
     *          traceLengthSeconds: 5,
     *          traceLengthMeters: 20000
     *      },
     *      trackStyle: {
     *          color: "rgba(255, 44, 44, 99)",
     *          thickness: 1,
     *          dash: Gis.Dash.dash,
     *          border: "rgba(255, 46, 44, 255)",
     *      },
     *      courseStyle: {
     *          color: "rgba(123, 55, 44, 128)",
     *          thickness: 4,
     *          dash: Gis.Dash.dashDotDot,
     *          border: "rgba(255, 255, 44, 128)",
     *      }
     * }).addTo(gisMap)
 * @extends Gis.Objects.TrackedBase
 */
Gis.Objects.Post = Gis.Objects.TrackedBase.extend(
    /** @lends Gis.Objects.Post# */
    {
        _selfDraw: {track: true, course: true},
        _className: 'gis-post',
        defaultSmoothFactor: 1.0,
        includes: Gis.Course,
        options: {
            tacticObjectType: 'post',
            courseStyle: undefined
        },
        optionsFire: [
            'tacticObjectType',
            'id',
            'name',
            'caption',
            'tooltip',
            'icon',
            'tags',
            'trackStyle',
            'trackBehavior',
            'customActions',
            'courseStyle'
        ],
        initialize: function (data) {
            this._fillOption(data, null, 'courseStyle', Gis.lineStyle);
            data.trackBehavior = data.trackBehavior ? Gis.trackBehavior(data.trackBehavior) : Gis.Config.PostTrackBehavior;
            data.icon = (data.icon && Gis.icon(data.icon));
            Gis.Objects.TrackedBase.prototype.initialize.call(this, data);
        },
        setData: function (data, val, notFire) {
            val = this._fillOption(data, val, 'courseStyle', Gis.lineStyle);
            val = this._fillOption(data, val, 'trackStyle', Gis.lineStyle);
            val = this._fillOption(data, val, 'trackBehavior', Gis.trackBehavior);
            val = this._fillOption(data, val, 'icon', Gis.icon);
            Gis.Objects.TrackedBase.prototype.setData.call(this, data, val, notFire);
        },
        _attached: function (event) {
            if (event.to.getType() === 'position') {
                Gis.Objects.TrackedBase.prototype._attached.call(this, event);
            }
        },
        getOptionsWithStyle: function () {
            var style = Gis.Objects.TrackedBase.prototype.getOptionsWithStyle.apply(this, arguments);
            return Gis.Util.extend({
                trackBehavior: style.trackBehavior || Gis.trackBehavior(Gis.Config.style.DefaultTrackBehavior),
                trackStyle: style.trackStyle || (Gis.Config.style.DefaultTrackStyle && Gis.lineStyle(Gis.Config.style.DefaultTrackStyle)),
                courseStyle: style.courseStyle || (Gis.Config.style.DefaultCourseStyle && Gis.lineStyle(Gis.Config.style.DefaultCourseStyle))
            },
                style
                );
        },
        draw: function (map, visibilityController) {
            if (!this.preDraw()) {
                return;
            }
            var path,
                marker,
                course,
                options,
                currentPosition,
                pathBehavior = this._pathBehavior;
            Gis.Objects.TrackedBase.prototype.draw.call(this, map);
            options = this.getOptionsWithStyle();
            this._recalculatePoints(options, visibilityController);
            currentPosition = pathBehavior.getCurrentPosition(visibilityController);
            if (currentPosition && this.options.icon) {
                marker = pathBehavior.drawMarker(map, options, visibilityController);
                path = pathBehavior.drawPath(options, map, visibilityController);
                if (this.needDrawCourse() && currentPosition) {
                    course = this.drawCourse(map, this._lowLevelObject && this._lowLevelObject.course, currentPosition.getCourse(), currentPosition.getLatLng());
                } else if (this._lowLevelObject && this._lowLevelObject.course) {
                    map.removeLayer(this._lowLevelObject.course);
                }
                this.initAutoUpdate(this._lastPoints.length);
                this._map.startCache();
                try {
                    this.drawArtifacts(map, visibilityController);
                } finally {
                    this._map.flush();
                }
                this._lowLevelObject = {
                    inset: true,
                    marker: marker,
                    path: path,
                    course: course
                };
            } else {
                map.removeLayer(this._lowLevelObject);
            }
        }
    }
);
/**
 * Возвращает новый экземпляр Gis.Objects.Post
 * @param data
 * @returns {Gis.Objects.Post}
 */
Gis.post = function (data) {
    return new Gis.Objects.Post(data);
};
Gis.ObjectFactory.list.post = Gis.Objects.Post;