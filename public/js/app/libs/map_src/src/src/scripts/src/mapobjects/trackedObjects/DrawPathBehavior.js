(function () {
    'use strict';
    /**
     * @classdesc методы рисования пути для поста и источника
     * @class
     * @param {Gis.Objects.TrackedBase} object
     * @extends Gis.Class
     */
    Gis.DrawPathBehavior = Gis.Class.extend(/**@lends Gis.DrawPathBehavior#*/
        {
            initialize: function (object) {
                /**
                 * @type {Gis.Objects.TrackedBase}
                 * @private
                 */
                this._object = object;
            },
            checkPointsVisible: function (sorted, visibilityController) {
                var parent = this._object,
                    /**
                     *
                     * @type {Gis.PathData}
                     */
                    position = parent._points.position,
                    i,
                    len,
                    newArray = [];
                if (sorted) {
                    for (i = 0, len = sorted.length; i < len; i += 1) {
                        if (visibilityController.isObjectVisible(position.getPoint(i))) {
                            newArray.push(sorted[i]);
                        }
                    }
                }
                return newArray;
            },
            /**
             *
             * @param options
             * @param {Gis.ObjectVisibilityController} visibilityController
             * @returns {Array}
             */
            getPathPoints: function (options, visibilityController) {
                return this.checkPointsVisible(this._object._points.position.getSorted(Gis.trackBehavior(this._object._selfDraw.track ? options.trackBehavior : {traceLengthMeters: 0.1})),
                    visibilityController);
            },
            /**
             * Рисуем маркер последней точки
             * @param map
             * @param options
             * @param {Gis.ObjectVisibilityController} [visibilityController]
             * @returns {*}
             */
            drawMarker: function (map, options, visibilityController) {
                var parent = this._object,
                    currentPosition = this.getCurrentPosition(visibilityController),
                    caption = currentPosition.getCaption() || options.caption,
                    tooltip = currentPosition.getToolTip() || options.tooltip,
                    marker;
                if (!visibilityController || visibilityController.isObjectVisible(currentPosition)) {
                    marker = map.drawMarker(Gis.Util.extend({}, options, {
                        latlng: currentPosition.getLatLng(),
                        caption: caption,
                        popup: tooltip,
                        draggable: false,
                        selectable: false,
                        position: parent._position,
                        angle: parent.getAngle(),
                        className: parent._className,
                        events: {
                            type: parent.events,
                            callback: parent.fireEventsFromLowLevel,
                            context: parent
                        }
                    }), parent._lowLevelObject && parent._lowLevelObject.marker);
                } else if (parent._lowLevelObject && parent._lowLevelObject.marker) {
                    map.removeLayer(parent._lowLevelObject.marker);
                }
                return marker;
            },
            /**
             * @param {Gis.ObjectVisibilityController} visibilityController
             * @returns {Gis.Objects.Position | undefined}
             */
            getCurrentPosition: function (visibilityController) {
                var parent = this._object,
                    /**
                     * @type {Gis.PathData}
                     */
                    position = parent._points.position,
                    i,
                    processingPoint;
                if (parent._currentPosition && visibilityController.isObjectVisible(parent._currentPosition)) {
                    return parent._currentPosition;
                }
                if (this._lastPoints) {
                    for (i = parent._lastPoints.length; i--;) {
                        processingPoint = position.getPoint(i);
                        if (visibilityController.isObjectVisible(position.getPoint(i))) {
                            return processingPoint;
                        }
                    }
                }
            },
            /**
             *
             * @param options
             * @param map
             * @param {Gis.ObjectVisibilityController} visibilityController
             * @returns {*}
             */
            drawPath: function (options, map, visibilityController) {
                var parent = this._object,
                    path;
                if (options.trackStyle) {
                    path = map.drawPolyline(Gis.Util.extend({}, {
                        latlng: parent._lastPoints,
                        line: options.trackStyle,
                        smoothFactor: (options.trackStyle && options.trackStyle.getSmoothFactor()) || parent.defaultSmoothFactor,
                        icon: null
                    }), parent._lowLevelObject && parent._lowLevelObject.path);
                } else if (parent._lowLevelObject && parent._lowLevelObject.path) {
                    map.removeLayer(parent._lowLevelObject.path);
                }
                return path;
            }
        }
    );
}());