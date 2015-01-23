/**
 * Created with JetBrains PhpStorm.
 */
(function (G) {
    "use strict";
    G.UI.Action.Zoom = G.UI.Action.extend({
        _type: 'zoom',
        _ui: undefined,
        options: {
            zoomOut: false
        },
        _zoomOut: undefined,
        _zoomBounds: undefined,
        _classMapZoom: "gis-map-zooming",
        _classMapZoomOut: "gis-map-zooming-out",
        initialize: function (data) {
            var self = this;
            G.UI.Action.prototype.initialize.call(this, data);
            this._onKeyPress = this._onKeyPress || function (e) {
                var altCode = 18;
                if (e.keyCode === altCode || e.charCode === (altCode + "")) {
                    self._InitZoomOut();
                    return false;
                }
            };
            this._onKeyUp = this._onKeyUp || function (e) {
                self._deInitZoomOut();
            };
        },
        execute: function () {
            if (!this._executed) {
                G.UI.Action.prototype.execute.call(this);
                this._oldClearOnClick = this._ui.getMap().isClearOnClick();
                this._ui.getMap().clearSelectedOnClick(false);
                this._ui.getMap().setDraggableEnabled(false);
                this._ui.getMap().filterSelect(G.ObjectController.FILTER_NOTHING, this.options.noUI);
                Gis.UI.disableTextSelection(this._ui.getMap().getMapContainer());
                $(this._ui.getMap().getMapContainer()).addClass(this._classMapZoom);
                if (this.options.zoomOut) {
                    this._InitZoomOut();
                }
                if (!this.options.noUI) {
                    this._widget = G.Widget.zoomProperty();
                    this._ui.addWidget(this._widget);
                }
            }
        },
        initEvents: function () {
            G.UI.Action.prototype.initEvents.call(this);
            var map = this._ui.getMap();
//            map.on('mousemove', this._onMouseMove, this);
            document.body.addEventListener('keydown', this._onKeyPress);
            document.body.addEventListener('keyup', this._onKeyUp);
            this._ui.getMap().getMapContainer().addEventListener('keydown', this._onKeyPress);
            this._ui.getMap().getMapContainer().addEventListener('keyup', this._onKeyUp);
            map.on('mousedown', this._onMouseDown, this);
//            map.on('mouseup', this._onMouseUp, this);
//            map.on('mouseout', this._onMouseUp, this);
        },
        deInitEvents: function () {
            G.UI.Action.prototype.deInitEvents.call(this);
            var map = this._ui.getMap();
//            map.off('mousemove', this._onMouseMove, this);
            map.off('mousedown', this._onMouseDown, this);
            document.body.removeEventListener('keydown', this._onKeyPress);
            document.body.removeEventListener('keyup', this._onKeyUp);
            this._ui.getMap().getMapContainer().removeEventListener('keydown', this._onKeyPress);
            this._ui.getMap().getMapContainer().removeEventListener('keyup', this._onKeyUp);
//            map.off('mouseup', this._onMouseUp, this);
//            map.off('mouseout', this._onMouseUp, this);
        },
        _InitZoomOut: function () {
            this._zoomOut = true;
            $(this._ui.getMap().getMapContainer()).addClass(this._classMapZoomOut);
        },
        _deInitZoomOut: function () {
            $(this._ui.getMap().getMapContainer()).removeClass(this._classMapZoomOut);
            this._zoomOut = false;
        },
        _onMouseMove: function (e) {
            var style, originalEvent;
            if (this._mouseDown) {
                originalEvent = e.originalEvent;
                if (!this._moved && L.point(originalEvent.clientX, originalEvent.clientY).distanceTo(L.point(this._startEvent.clientX, this._startEvent.clientY)) < 5) {
                    return;
                }
                style = this._ui.getStyle('zoom');
//                if (this._polygon) {
//                    this._polygon.setData(G.Util.extend({}, style, {points: G.Objects.Polygon.generateSquareLatLng(this._latlngStart, e.latLng, this._polygon.getPoints())}));
//                } else {
//                    this._polygon = G.polygon(G.Util.extend({}, style, {points: G.Objects.Polygon.generateSquareLatLng(this._latlngStart, e.latLng)}));
//                    this._polygon.setControllableByServer(false);
//                    this._polygon.addTo(this._ui.getMap());
//                }
                if (this._divZoom) {
                    this._divZoom.style.width = (Math.max(this._startEvent.clientX, originalEvent.clientX) - Math.min(this._startEvent.clientX, originalEvent.clientX)) + 'px';
                    this._divZoom.style.height = (Math.max(this._startEvent.clientY, originalEvent.clientY) - Math.min(this._startEvent.clientY, originalEvent.clientY)) + 'px';
                    this._divZoom.style[Gis.DomUtil.prefixes('transform')] = Gis.DomUtil.isCssTransform3d() ?
                        'translate3d(' + Math.min(this._startEvent.clientX, originalEvent.clientX) + 'px, ' + Math.min(this._startEvent.clientY, originalEvent.clientY) + 'px,0)':
                        'translate(' + Math.min(this._startEvent.clientX, originalEvent.clientX) + 'px, ' + Math.min(this._startEvent.clientY, originalEvent.clientY) + 'px)';
                } else {
                    this._divZoom = document.createElement('div');
                    this._divZoom.classList.add('gis-ui-zoom-div');
                    this._divZoom.style.backgroundColor = style.fill.color;
                    this._divZoom.style.borderColor = style.line.color;
                    this._ui.getMap().getMapContainer().appendChild(this._divZoom);
                }
                this._moved = true;
            }
        },
        _onMouseDown: function (e) {
            var map = this._ui.getMap();
            map.on('mousemove', this._onMouseMove, this);
            map.on('mouseup', this._onMouseUp, this);
            map.on('mouseout', this._onMouseUp, this);
            this._ui.getMap().setDraggableEnabled(false);
            this._latlngStart = e.latLng;
            this._startEvent = e.originalEvent;
            this._moved = false;
            this._mouseDown = true;
        },
        _disableMove: function () {
            if (this._divZoom) {
//                this._ui.getMap().removeLayer(this._polygon);
//                delete this._polygon;
                this._ui.getMap().getMapContainer().removeChild(this._divZoom);
                delete this._divZoom;
            }
            this._moved = false;
            this._mouseDown = false;
        },
        _onMouseUp: function (e) {
            var map, zoom;
            if (this._mouseDown) {
                map = this._ui.getMap();
                map.off('mousemove', this._onMouseMove, this);
                map.off('mouseup', this._onMouseUp, this);
                map.off('mouseout', this._onMouseUp, this);
                if (this._moved) {
                    map.setZoom(G.Objects.Polygon.generateSquareLatLng(this._latlngStart, e.latLng, null, true));
                } else {
                    zoom = map.getZoom();
                    if (this._zoomOut || e.originalEvent.altKey) {
                        zoom -= 1;
                    } else {
                        zoom += 1;
                    }
                    map.setZoomAround([e.latLng.latitude, e.latLng.longitude], zoom);
                }
            }
            this._disableMove();
        },
        _disable: function () {
            if (this._executed) {
                this._deInitZoomOut();
                if (!this.options.noUI) {
                    this._ui.removeWidget(this._widget);
                }
                this._ui.getMap().clearSelectedOnClick(this._oldClearOnClick);
                G.UI.Action.prototype._disable.call(this);
                this._ui.getMap().filterSelect(undefined, this.options.noUI);
                this._disableMove();
                this.options.zoomOut = false;
                Gis.UI.enableTextSelection(this._ui.getMap().getMapContainer());
                $(this._ui.getMap().getMapContainer()).removeClass(this._classMapZoom);
            }
        }
    });
    G.UI.Action.zoom = function (ui, data) {
        var zoom = G.UI.ActionController.getAction('zoom');
        if (zoom) {
            zoom.setData(data);
            return zoom;
        }
        return new G.UI.Action.Zoom(ui, data);
    };
}(Gis));