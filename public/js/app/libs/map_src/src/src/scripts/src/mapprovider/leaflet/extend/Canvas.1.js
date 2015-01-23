///*
// * L.Overlay
// */
//"use strict";
//L.Overlay = L.Class.extend({
//    includes: [L.Mixin.Events],
//    _preloadSize: L.point(400, 400),
//    options: {
//        className: '',
//        clickable: true,
//        opacity: 1
//    },
//
//
//    initialize: function (canvas, options) {
//        this._canvas = canvas;
//        this._delta = L.point(0, 0);
//        L.setOptions(this, options);
//    },
//    inImage: function (e) {
//        return this.inImagePoint(L.point(e.pageX, e.pageY));
//    },
//    inImagePoint: function (p) {
//        return this._imageBounds.contains(p.add(this._preloadSize));
//    },
//    setSelected: function (selected) {
//        var isSelectedChanged = this._selected !== selected;
//        this._selected = selected;
//        if (isSelectedChanged && this._map) {
//            if (selected) {
//                this._selectedPath.addTo(this._map);
//                this.setDraggable(this.options.draggable);
//                this._canvas.style.zIndex = 2;
//            } else {
//                this._map.removeLayer(this._selectedPath);
//                this.setDraggable(false);
//                this._canvas.style.zIndex = 'auto';
//            }
//        }
//    },
//    _fireMouseEvent: function (e) {
//        if (!this.hasEventListeners(e.type)) { return; }
//        e.originalEvent = e.originalEvent || e;
//        if (!this.inImage(e.originalEvent)) {
//            if (e.type === 'mousemove') {
//                if (this._lastEntered) {
//                    e.type = 'mouseout';
//                    this.fire('mouseout', e);
//                }
//            }
//            this._lastEntered = false;
//            return;
//        }
//        if (e.type === 'mousemove') {
//            if (!this._lastEntered) {
//                e.type = 'mouseover';
//                this.fire('mouseover', e);
//                this._lastEntered = true;
//                return;
//            }
//        }
//        this.fire(e.type, e);
//
//        if (e.type === 'contextmenu') {
//            L.DomEvent.preventDefault(e);
//        }
//        if (e.type !== 'mousemove') {
//            L.DomEvent.stopPropagation(e);
//        }
//    },
//
//    _initEvents: function () {
//        var i, events;
//        if (this.options.clickable) {
//            L.DomUtil.addClass(this._canvas, 'leaflet-clickable');
//
//            events = ['click', 'dblclick', 'mousedown', 'mouseover',
//                'mouseout', 'mousemove', 'contextmenu'];
//            for (i = 0; i < events.length; i += 1) {
//
//                this._map.on(events[i], this._fireMouseEvent, this);
//            }
//        }
//    },
//    _deinitEvents: function () {
//        var events = ['click', 'dblclick', 'mousedown', 'mouseover',
//            'mouseout', 'mousemove', 'contextmenu'];
//        for (var i = 0; i < events.length; i++) {
//            this._map.off(events[i], this._fireMouseEvent, this);
//        }
//    },
//    setLayerPosition: function (pos) {
//        this._imageData.latlng = this._map.layerPointToLatLng(pos.add(this._delta));
//        return this.redraw();
//    },
//    _initSelectedPath: function () {
//        var min = this._map.layerPointToLatLng(this._imageBounds.min.add(this._overlayViewport.min)),
//            max = this._map.layerPointToLatLng(this._imageBounds.max.add(this._overlayViewport.min)),
//            latlngs = [min,
//            L.latLng(max.lat, min.lng),
//            max,
//            L.latLng(min.lat, max.lng),
//                min
//        ];
//        if (!this._selectedPath) {
//            this._selectedPath = L.polyline(latlngs, {stroke: true, color: 'rgb(75, 84, 255)', weight: 5});
//        } else {
//            this._selectedPath.setLatLngs(latlngs)
//        }
//    },
//    setImage: function (data) {
//        var pointLatLng,
//            imageLatLng = this._map.latLngToLayerPoint(data.latlng),
//            sttartPoint;
//        this._updateViewport();
//        pointLatLng = this._overlayViewport.min;
//        this._dataForZoom = this._map.getZoom();
//        sttartPoint = L.point(imageLatLng.x - pointLatLng.x, imageLatLng.y - pointLatLng.y);
//        this._imageBounds =  L.bounds(sttartPoint, sttartPoint.add(L.point(data.dWidth, data.dHeight)));
//        this._initSelectedPath();
//        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
//        this._ctx.drawImage(data.image, 0, 0, data.sWidth, data.sHeight, this._imageBounds.min.x, this._imageBounds.min.y, data.dWidth, data.dHeight);
//        this._imageData = data;
//        return this;
//    },
//
//
//    predrag: function () {
//        this._delta = this._map.latLngToLayerPoint(this._imageData.latlng).subtract(this._overlayViewport.min);
//    },
//    onAdd: function (map) {
//        this._map = map;
//        map._initCanvasRoot();
//
//        this._canvas = this._canvas || document.createElement('canvas');
//        this._ctx = this._canvas.getContext('2d');
//        this._map._canvasRoot.appendChild(this._canvas);
//        L.DomUtil.setOpacity(this._canvas, this.options.opacity);
//        if (this.options.draggable) {
//            this.setDraggable(this.options.draggable && this._selected);
//        }
//        this._updateViewport();
//        this.fire('add');
//        if (map.options.zoomAnimation && map.options.markerZoomAnimation) {
//            L.DomUtil.addClass(this._canvas, 'leaflet-zoom-animated');
//            L.DomUtil.addClass(this._canvas, 'leaflet-canvas-overlay');
//            L.DomUtil.addClass(this._canvas, this.options.className);
//            map.on('zoomanim', this._animateZoom, this);
//        }
//        this._initEvents();
//        this.on("dragstart", this.predrag, this);
//        map.on("moveend", this.moveEnd, this);
//        map.on("dragend", this.moveEnd, this);
//        map.on('zoomend', this._zoomEnd, this);
//    },
//    setOpacity: function (opacity) {
//        this.options.opacity = parseFloat(opacity);
//        L.DomUtil.setOpacity(this._canvas, this.options.opacity);
//    },
//    _animateZoom: function (e) {
//        var scale = e.scale,
//            offset = e.offset.multiplyBy(-scale)._add(this._overlayViewport.min);
//
//        this._canvas.style[L.DomUtil.TRANSFORM] =
//            L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';
//    },
//    _zoomEnd: function () {
////        var style;
////        style = this.options.canvas.style;
////        style[L.DomUtil.TRANSFORM] = "";
////        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
////        this.redraw();
//    },
//    setDraggable: function (draggable) {
//        var opts = this.options || this._options;
//        opts.draggable = !!draggable;
//        if (L.Handler.CanvasDrag) {
//            if (opts.draggable && this._selected) {
//                this.dragging = new L.Handler.CanvasDrag(this);
//                this.dragging.enable();
//            } else if (this.dragging) {
//                this.dragging.disable();
//                this.dragging = undefined;
//            }
//        }
//    },
//
//    addTo: function (map) {
//        map.addLayer(this);
//        return this;
//    },
//    moveEnd: function () {
//        clearTimeout(this.timer);
//        this.timer = false;
//        this.redraw();
//    },
//    _setPos: function (pos) {
//        L.DomUtil.setPosition(this._canvas, pos);
//    },
//    getLatLng: function () {
//        return L.latLng(this._imageData.latlng.lat, this._imageData.latlng.lng);
//    },
//    onRemove: function (map) {
//        map._canvasRoot.removeChild(this._canvas);
//
//        this._deinitEvents();
//        this._map.removeLayer(this._selectedPath);
//        // Need to fire remove event before we set _map to null as the event hooks might need the object
//        this.fire('remove');
//        map.off("moveend", this.moveEnd, this);
//        map.off("dragend", this.moveEnd, this);
//        map.off('zoomend', this._zoomEnd, this);
//        map.off('zoomanim', this._animateZoom, this);
//        this.off("dragstart", this.predrag, this);
//        this.setDraggable(false);
//        this._map = null;
//
//        map.off({
//            'viewreset': this.redraw
//        }, this);
//    },
//
//
//    setStyle: function (style) {
//        L.setOptions(this, style);
//        return this;
//    },
//
//    redraw: function () {
//        if (this._map && this._dataForZoom === this._map.getZoom()) {
//            this.setImage(this._imageData);
//        }
//        return this;
//    },
//    _updateViewport: function () {
//        this.latlng = this._map.getBounds().getNorthWest();
//        this._canvas.width = Math.min(this._map.getSize().x, document.body.clientWidth) + this._preloadSize.x * 2;
//        this._canvas.height = Math.min(this._map.getSize().y, document.body.clientHeight) + this._preloadSize.y * 2;
//        var size = this._map.getSize(),
//            panePos = L.DomUtil.getPosition(this._map._mapPane),
//            min = panePos.multiplyBy(-1).subtract(this._preloadSize),
//            max = min.add(size._round()).add(this._preloadSize.multiplyBy(2));
//        this._overlayViewport = new L.Bounds(min, max);
//        L.DomUtil.setPosition(this._canvas, this._overlayViewport.min);
//    }
//});
//
//L.Map.include({
//    _initCanvasRoot: function () {
//        if (this._canvasRoot) { return; }
//
//        var root = this._canvasRoot = document.createElement('div');
//        root.className = 'leaflet-canvas-container';
//        Gis.DomUtil.prepend(this._panes.overlayPane, root);
//    }
//});
//
