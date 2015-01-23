/**
 * Created with JetBrains PhpStorm.
 * Company: ОСП Брянск
 */
(function (G) {
    "use strict";
    G.Maps.Leaflet = G.Maps.Leaflet || {};
    G.Maps.Leaflet.OptionsConverter = Gis.BaseClass.extend({
        ellipse: function (options) {
            var optionsMap = {
                    latlng: "latlng",
                    alpha: "alpha",
                    betta: "betta",
                    gamma: "gamma",
                    stroke: "stroke",
                    color: "color",
                    weight: "weight",
                    opacity: "opacity",
                    fill: "fill",
                    fillColor: "fillColor",
                    fillOpacity: "fillOpacity",
                    dashArray: "dashArray",
                    caption: "caption",
                    tooltip: "tooltip",
                    selectable: "clickable",
                    draggable: "draggable"
                };
            return this._checkOptions(optionsMap, options);
        },
        sector: function (options) {
            var optionsMap = {
                    latlng: "latlng",
                    startAngle: "startAngle",
                    finishAngle: "stopAngle",
                    radius: "radius",
                    innerRadius: "innerRadius",
                    stroke: "stroke",
                    color: "color",
                    weight: "weight",
                    opacity: "opacity",
                    caption: "caption",
                    tooltip: "tooltip",
                    fill: "fill",
                    fillColor: "fillColor",
                    fillOpacity: "fillOpacity",
                    dashArray: "dashArray",
                    selectable: "clickable",
                    draggable: "draggable"
                };
            return this._checkOptions(optionsMap, options);
        },
        path: function (options) {
            var optionsMap = {
                    latlng: "latlng",
                    stroke: "stroke",
                    color: "color",
                    noClip: "noClip",
                    weight: "weight",
                    smoothFactor: "smoothFactor",
                    opacity: "opacity",
                    caption: "caption",
                    tooltip: "tooltip",
                    dashArray: "dashArray",
                    selectable: "clickable",
                    className: "className",
                    draggable: "draggable"
                };
            return this._checkOptions(optionsMap, options);
        },
        marker: function (options) {
            var optionsMap = {
                    latlng: "latlng",
                    className: "className",
                    icon: "icon",
                    popup: "popup",
                    position: "position",
                    caption: "caption",
                    opacity: "opacity",
                    dashArray: "dashArray",
                    angle: "angle",
                    selectable: "selectable",
                    selected: "selected",
                    clickable: "clickable",
                    captionPosition: "labelPosition",
                    draggable: "draggable"
                };
            return this._checkOptions(optionsMap, options);
        },
        _checkOptions: function (map, options) {
            var result = {},
                optionId;
            for (optionId in options) {
                if (options.hasOwnProperty(optionId) && map.hasOwnProperty(optionId)) {
                    result[map[optionId]] = options[optionId];
                }
            }
            return result;
        },
        ellipseSetters: function () {
            return {
                latlng: "setLatLng",
                alpha: "setRadius",
                betta: "setSecondRadius",
                draggable: "setDraggable",
                hatch: "setFillHatch",
                clickable: "setClickable",
                gamma: "setAngle"
            };
        },
        polygonSetters: function () {
            return {
                latlng: "setLatLngs",
                draggable: "setDraggable",
                clickable: "setClickable",
                hatch: "setFillHatch"
            };
        },
        polylineSetters: function () {
            return {
                latlng: "setLatLngs",
                draggable: "setDraggable",
                clickable: "setClickable",
                className: "setClassName"
            };
        },
        overlaySetters: function () {
            return {
                imageData: "setImage",
                draggable: 'setDraggable',
                selected: 'setSelected',
                opacity: "setOpacity"
            };
        },
        sectorSetters: function () {
            return G.Util.extend(this.ellipseSetters(), {
                latlng: 'setLatLng',
                radius: 'setRadius',
                startAngle: 'setStartAngle',
                stopAngle: 'setStopAngle',
                clickable: 'setClickable',
                hatch: "setFillHatch",
                innerRadius: 'setInnerRadius'
            });
        },
        markerSetters: function () {
            return {
                icon: 'setIcon',
                opacity: 'setOpacity',
                position: 'setPosition',
                angle: 'setAngle',
                latlng: 'setLatLng',
                clickable: 'setClickable',
                selected: 'setSelected',
                draggable: 'setDraggable'
            };
        },
        textSetters: function () {
            return {
                text: 'setContent',
                color: 'setColor',
                bgColor: 'setBgColor',
                latlng: 'setLatLng',
                position: 'setPosition',
                clickable: 'setClickable',
                selected: 'setSelected'
            };
        },
        textLabel: function (options) {
            var optionsMap = {
                latlng: "latlng",
                text: "text",
                backColor: "bgColor",
                foreColor: "color",
                position: 'position',
                selected: 'selected',
                clickable: "clickable",
                draggable: "draggable"
            };
            return this._checkOptions(optionsMap, options);
        },

        setOptions: function (setters, data, oldObject) {
            var row;
            for (row in setters) {
                if (setters.hasOwnProperty(row) && data.hasOwnProperty(row)) {
                    oldObject[setters[row]](data[row]);
                }
            }
        }
    });
    G.Maps.Leaflet.optionsConverter = function () {
        return new G.Maps.Leaflet.OptionsConverter();
    };
}(Gis));