/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
(function (G) {
    "use strict";
    var topBottomPanelHeight = '40px',
        topBottomPanelWidth = '100%',
        panelBackground = 'gray';
    G.UI.CONTAINER_CLASSES = {
        TOP: 'gis-top-container',
        BOTTOM: 'gis-bottom-container',
        LEFT: 'gis-left-container',
        RIGHT: 'gis-right-container',
        LEFT_INNER: 'gis-left-inner-container',
        RIGHT_INNER: 'gis-right-inner-container'
    };
    var borderColor = window.GIS_RGBA_DISABLE ? "white" : 'rgba(255, 255, 255, 0.8',
        selectedBorderColor = window.GIS_RGBA_DISABLE ? 'rgb(75, 84, 255)' : 'rgba(75, 84, 255, 0.8)',
        lineColor = window.GIS_RGBA_DISABLE ? 'rgb(175, 45, 81)' : 'rgba(175, 45, 81, 0.8)';
    /**
     * Для частичного переопределения стилей использовать Gis.Util.extend(G.UI.DEFAULT_STYLE, {}/Свои стили/)
     * @type {{measure: {color: string, border: string, thickness: number, icon: {width: number, type: string}}, path: {border: string, thickness: number, selectedBorder: string, icon: {type: string, color: string}}, polygon: {color: string, border: string, selectedBorder: string, thickness: number, icon: {type: string, color: string}}, sector: {color: string, border: string, thickness: number, selectedBorder: string, angleLineColor: string, angleLineBorder: string, angleLineThickness: number}, ellipse: {color: string, border: string, thickness: number, selectedBorder: string}, marker: {foreColor: string, position: string, drawPoint: boolean}, zoom: {fill: {color: string}, line: {color: string, thickness: number}}}}
     */
    G.UI.DEFAULT_STYLE = {
        measure: {
            color: 'black',
            border: borderColor,
            thickness: 2,
            icon: {width: 10, type: 'circle'}
        },
        path: {
            border: borderColor,
            thickness: 2,
            selectedBorder: selectedBorderColor,
            icon: {type: 'm', color: lineColor, width: 15}
        },
        polygon: {
            color: lineColor,
            border: borderColor,
            selectedBorder: selectedBorderColor,
            thickness: 2,
            icon: {type: 'circle', color: lineColor, width: 15}
        },
        sector: {
            color: lineColor,
            border: borderColor,
            thickness: 2,
            selectedBorder: selectedBorderColor,
            angleLineColor: '#272727',
            angleLineBorder: borderColor,
            angleLineThickness: 2
        },
        ellipse: {
            color: lineColor,
            border: borderColor,
            thickness: 2,
            selectedBorder: selectedBorderColor
        },
        marker: {
            foreColor: '#ffffff',
            position: 'centerright',
            drawPoint: true
        },
        zoom: {
            fill: {color: 'rgba(0, 16, 235, 0.3)'},
            line: {color: 'rgba(0, 16, 235, 0.9)', thickness: 2}
        },
        predefinedColors: window.GIS_RGBA_DISABLE ? [
            "rgb(255, 57, 17)",
            "rgb(22, 50, 255)",
            "rgb(128, 128, 128)",
            "rgb(255, 216, 216)",
            "rgb(0, 148, 255)"
        ] : [
            "rgba(255, 57, 17, 0.8)",
            "rgba(22, 50, 255, 0.8)",
            "rgba(128, 128, 128, 0.8)",
            "rgba(255, 216, 216, 0.8)",
            "rgba(0, 148, 255, 0.8)"
        ]
    };
    G.UI.DEFAULT_STYLE[G.UI.CONTAINER_CLASSES.TOP] = {
        width: topBottomPanelWidth,
        height: topBottomPanelHeight,
        background: panelBackground
    };
    G.UI.DEFAULT_STYLE[G.UI.CONTAINER_CLASSES.BOTTOM] = {
        width: topBottomPanelWidth,
        height: topBottomPanelHeight,
        background: panelBackground
    };
    G.UI.DEFAULT_STYLE[G.UI.CONTAINER_CLASSES.LEFT] = {
        width: "40px",
        height: topBottomPanelHeight,
        background: panelBackground
    };
}(Gis));