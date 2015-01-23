/**
 * Километровая сетка
 */
(function () {
    'use strict';
    var DEFAULT_POINT_RADIUS = 5,
        BORDER_COLOR = '#5C7EE7',
        DEFAULT_OPACITY = 0.8;
    L.ReliefControl = {
        TIME_TO_ANIMATE: 300,
        BORDER_COLOR: BORDER_COLOR,
        DEFAULT_POINT_RADIUS: DEFAULT_POINT_RADIUS,
        BIG_POINT_RADIUS: 10,
        DEFAULT_OPACITY: DEFAULT_OPACITY,
        HOVERED_OPACITY: 1,
        DRAGGABLE_POINT_STYLE: {
            radius: DEFAULT_POINT_RADIUS,
            fill: 'white',
            stroke: BORDER_COLOR,
            strokeWidth: 2,
            draggable: true
        },
        RADAR_LINE_POINT_STYLE: {
            fill: BORDER_COLOR,
            stroke: BORDER_COLOR,
            strokeWidth: 2
        },
        SHAPE_STYLE: {
            stroke: BORDER_COLOR,
            fill: 'rgba(92, 126, 231, 0.49)',
            strokeWidth: 2,
            opacity: DEFAULT_OPACITY
        }
    };
}());
