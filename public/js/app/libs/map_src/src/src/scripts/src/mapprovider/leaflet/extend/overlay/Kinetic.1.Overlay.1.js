(function () {
    "use strict";
    var PRELOAD_SIZE = L.point(400, 400),
        DRAGGED = 1,
        IDLE = 2;
    L.Overlay = L.Class.extend({
        includes: [L.Mixin.Events],
        _preloadSize: PRELOAD_SIZE,
        options: {
            className: '',
            clickable: true,
            opacity: 1
        },

        updateDraggedPosition: function (point) {
            this._draggedLatLng = this._map.layerPointToLatLng(this._map.latLngToLayerPoint(this._draggedLatLng || this._imageData.latlng)
                ._add(point || L.point(this._layer.x(), this._layer.y())));
        },
        initialize: function (layer, options) {
            var self = this, timedRedraw;
            this._layer = layer;
            this._delta = L.point(0, 0);
            L.setOptions(this, options);
            timedRedraw = function (e) {
                Gis.requestAnimationFrame(10)(function () {
                    self.redraw();
                });
                e.stopPropagation();
                e.preventDefault();
            };
            function updateAndStopEvent(e) {
                self.updateDraggedPosition();
                self.fire('dragend', {latLng: self._draggedLatLng});
                timedRedraw(e);
            }

            function updateCenter(srcWidth, srcHeight) {
                var pointStart = self._map.latLngToLayerPoint(self._draggedLatLng || self._imageData.latlng)._add(L.point(srcWidth / 2, srcHeight / 2));
                pointStart._subtract(L.point(self.getWidth(self._imageData) / 2, self.getHeight(self._imageData) / 2));
                self._draggedLatLng = self._map.layerPointToLatLng(pointStart);
            }

            function updateScale(scaleStep, e) {
                var w = self.getWidth(self._imageData),
                    h = self.getHeight(self._imageData),
                    scale = self.getScale() + scaleStep;
                if (scale > 0) {
                    self.setScale(scale);
                    updateCenter(w, h);
                    timedRedraw(e);
                    self.fire('resize', {
                        scale: self.getScale(),
                        rotation: self.getRotation(),
                        latlng: self._draggedLatLng
                    });
                }
            }

            function updateRotation(rotationStep, e) {
                self.setRotation(self.getRotation() + rotationStep);
                self.fire('rotate', {rotation: self.getRotation()});
                Gis.requestAnimationFrame(10)(function () {
                    self._layer.draw();
                });
                e.stopPropagation();
                e.preventDefault();
            }

            this._keyUp = function (e) {
                var pixelStep = e.shiftKey ? 10 : 1,
                    scaleStep = 4 / self._imageData.dWidth,
                    rotationStep = e.shiftKey ? 1 : 0.1;
                scaleStep = e.shiftKey ? scaleStep * 10 : scaleStep;
                switch (e.keyCode) {
                case 81://q
                    updateRotation(-rotationStep, e);
                    break;
                case 69: //e
                    updateRotation(rotationStep, e);
                    break;
                case 65: //a
                    self._layer.x(self._layer.x() - pixelStep);
                    updateAndStopEvent(e);
                    break;
                case 83: //s
                    self._layer.y(self._layer.y() + pixelStep);
                    updateAndStopEvent(e);
                    break;
                case 68: //d
                    self._layer.x(self._layer.x() + pixelStep);
                    updateAndStopEvent(e);
                    break;
                case 87: //w
                    self._layer.y(self._layer.y() - pixelStep);
                    updateAndStopEvent(e);
                    break;
                case 90: //z
                    updateScale(-scaleStep, e);
                    break;
                case 88: //x
                    updateScale(scaleStep, e);
                    break;
                }
            };
            this.dragFunc = function (p) {
                var point = self.doDragRotate(p) || self.doDragResize(p);
                if (point) {
                    self._notFireDragEnd = true;
                    return point.x ? point : this.getAbsolutePosition();
                }
                Gis.requestAnimationFrame(10)(function () {
                    self.fire('drag', {latlng: self._draggedLatLng});
                });
                self._drag = DRAGGED;
                return p;
            };
            this._dragStart = function (e) {
                if (!self.isResizing() && !self.isRotating()) {
                    self.fire('dragstart');
                }
            };
            this._dragEnd = function (e) {
                if (!self.isResizing() && !self.isRotating() && !self._notFireDragEnd) {
                    Gis.requestAnimationFrame(10)(function () {
                        self.updateDraggedPosition();
                        self.redraw();
                        self.fire('dragend', {latLng: self._draggedLatLng});
                    });
                }
                self._notFireDragEnd = false;
            };
            this._fireMouseEvent = function (e) {
                if (!self.hasEventListeners(e.type)) { return; }
                e.originalEvent = e.originalEvent || e;
                if (e.type === 'mousemove') {
                    if (!self._lastEntered) {
                        e.type = 'mouseover';
                        self.fire('mouseover', e);
                        self._lastEntered = true;
                        return;
                    }
                }
                self.fire(e.type, e);

                if (e.type === 'contextmenu') {
                    L.DomEvent.preventDefault(e);
                }
                if (e.type !== 'mousemove') {
                    L.DomEvent.stopPropagation(e);
                }
            };
            this._fireMouseEventMap = function (e) {
                if (e.type === 'click') {
                    var intersection = self._map._kineticStage.getIntersection({x: e.originalEvent.clientX + self._map.getSize().x * L.Map.KINETIC_PRELOAD, y: e.originalEvent.clientY + self._map.getSize().y * L.Map.KINETIC_PRELOAD});
                    if (intersection === self._kineticImage) {
                        self.fire(e.type, e);
                    }
                    L.DomEvent.preventDefault(e);
                }
            };
        },
        inImage: function (e) {
            return this.inImagePoint(L.point(e.pageX, e.pageY));
        },
        inImagePoint: function (p) {
            return this._imageBounds.contains(p.add(this._preloadSize));
        },
        initKeyboardActions: function (enable) {
            if (enable) {
                document.body.addEventListener('keydown', this._keyUp);
            } else {
                document.body.removeEventListener('keydown', this._keyUp);
            }
        },
        setSelected: function (selected) {
            var isSelectedChanged = this._selected !== selected, self = this;
            this._selected = selected;
            if (isSelectedChanged && this._map && this._kineticImage) {
                if (selected) {
                    this._kineticImage.stroke(L.Overlay.STROKE_COLOR);
                    this.setRotatorsVisible(true);
                    this.setResizersVisible(true);
                    this.setDraggable(this.options.draggable);
                    this.initKeyboardActions(true);
                    this._map.showTopKinetic(true);
                    Gis.requestAnimationFrame(10)(function () {
                        self._map._kineticStageTop.add(self._layer);
                    });
                } else {
                    this._kineticImage.stroke(L.Overlay.STROKE_TRANSPARENT);
                    this.setRotatorsVisible(false);
                    this.setResizersVisible(false);
                    this.setDraggable(false);
                    this.initKeyboardActions(false);
                    this._map.showTopKinetic(false);
                    Gis.requestAnimationFrame(10)(function () {
                        self._map._kineticStage.add(self._layer);
                    });
                }
                this._layer.draw();
            }
        },

        _initEvents: function () {
            var i, events;
            if (this.options.clickable) {
                L.DomUtil.addClass(this._layer.canvas._canvas, 'leaflet-clickable');
                events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover',
                    'mouseout', 'mousemove', 'contextmenu'];
                for (i = 0; i < events.length; i += 1) {
                    this._kineticImage.on(events[i], this._fireMouseEvent, this);
                }
                this._map.on('click', this._fireMouseEventMap, this);
            }
        },
        _deinitEvents: function () {
            var events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover',
                'mouseout', 'mousemove', 'contextmenu'], i;
            for (i = 0; i < events.length; i++) {
                this._kineticImage.off(events[i], this._fireMouseEvent, this);
            }
            this._map.off('click', this._fireMouseEventMap, this);
        },
        setLayerPosition: function (pos) {
//            this._imageData.latlng = this._map.layerPointToLatLng(pos.add(this._delta));
//            return this.redraw();
        },
        getWidth: function (data) {
            return data.dWidth * this.getScale();
        },
        getHeight: function (data) {
            return data.dHeight * this.getScale();
        },
        setImage: function (data, noUpdateOpacity) {
            if (data.clearDrag) {
                data.clearDrag = undefined;
                this._draggedLatLng = undefined;
            }
            var pointLatLng,
                imageLatLng = this._map.latLngToLayerPoint(this._draggedLatLng || data.latlng),
                sttartPoint,
                width,
                height,
                self = this;
            this._layer.show();
            this._layer.position({x: 0, y: 0});
            this._imageData = data;
            width = this.getWidth(data);
            height = this.getHeight(data);
            if (!width || !height) {
                this._layer.hide();
                return;
            }
            pointLatLng = this._map._kineticViewport.min;
            this._dataForZoom = this._map.getZoom();
            sttartPoint = L.point(imageLatLng.x - pointLatLng.x, imageLatLng.y - pointLatLng.y);
            this._imageBounds =  L.bounds(sttartPoint, sttartPoint.add(L.point(width, height)));
            var position = L.point(-width / 2, -height / 2);
            this._group.position(this._imageBounds.min.subtract(position));
            this._group.rotation(this.getRotation());
            if (!this._kineticImage) {
                this._kineticImage = new Kinetic.Image({
                    x: position.x,
                    y: position.y,
                    image: data.image,
                    width: width,
                    height: height,
                    stroke: this._selected ? L.Overlay.STROKE_COLOR : L.Overlay.STROKE_TRANSPARENT,
                    strokeWidth: 5
                });
                this._group.add(this._kineticImage);
                this._initEvents();
                this._map._kineticStage.add(this._layer);
                Gis.requestAnimationFrame(10)(function () {
                    self._layer.setZIndex(2);
                });
                this._createRotaters();
                this._createResizers();
                this.setRotatorsVisible(!!this._selected);
                this.setResizersVisible(!!this._selected);
            } else {
                this._kineticImage.setImage(data.image);
                this._kineticImage.position(position);
                this._kineticImage.width(width);
                this._kineticImage.height(height);
            }
            this._updateRotaters();
            this._updateResizers();
            this._layer.draw();
            return this;
        },


        predrag: function () {
            this._delta = this._map.latLngToLayerPoint(this._draggedLatLng || this._imageData.latlng).subtract(this._map._kineticViewport.min);
        },
        onAdd: function (map) {
            this._map = map;
            map.initKinetic();
            this._layer = this._layer || new Kinetic.Layer();
            this._group = new Kinetic.Group();
            this._layer.dragBoundFunc(this.dragFunc);
            this._layer.on('dragstart', this._dragStart);
            this._layer.on('dragend', this._dragEnd);
            this._layer.draggable(this.options.draggable && this._selected);
            this._layer.add(this._group);
            this.fire('add');
            L.DomUtil.addClass(this._layer.canvas._canvas, 'leaflet-canvas-overlay');
            L.DomUtil.addClass(this._layer.canvas._canvas, this.options.className);
            this.on("dragstart", this.predrag, this);
            map.on("moveend", this.moveEnd, this);
            map.on("dragend", this.moveEnd, this);
            map.on("zoomend", this._zoomEnd, this);
        },
        setOpacity: function (opacity) {
            this.options.opacity = parseFloat(opacity);
            if (this._kineticImage) {
                this._kineticImage.opacity(this.options.opacity);
                this._layer.draw();
            }
        },
        _zoomEnd: function () {
            this._imageData = null;
            this._layer.hide();
        },
        setDraggable: function (draggable) {
            var opts = this.options || this._options;
            opts.draggable = !!draggable;
            this._layer.draggable(draggable);
        },

        addTo: function (map) {
            map.addLayer(this);
            return this;
        },
        moveEnd: function () {
            clearTimeout(this.timer);
            this.timer = false;
            this.redraw();
        },
        _setPos: function (pos) {
    //        this._layer.position(pos);
        },
        getLatLng: function () {
            return L.latLng(this._imageData.latlng.lat, this._imageData.latlng.lng);
        },
        onRemove: function (map) {
            this._layer.remove();

            this._deinitEvents();
            // Need to fire remove event before we set _map to null as the event hooks might need the object
            this.fire('remove');
            this._layer.off('dragstart', this._dragStart);
            this._layer.off('dragend', this._dragEnd);
            map.off("moveend", this.moveEnd, this);
            map.off("dragend", this.moveEnd, this);
            map.off("zoomend", this._zoomEnd, this);
            this.off("dragstart", this.predrag, this);
            this.setDraggable(false);
            this._map = null;

            map.off({
                'viewreset': this.redraw
            }, this);
        },


        setStyle: function (style) {
            L.setOptions(this, style);
            return this;
        },

        redraw: function () {
            if (this._map && this._dataForZoom === this._map.getZoom() && this._imageData) {
                this.setImage(this._imageData, true);
            }
            return this;
        }
    });

    L.Overlay.STROKE_COLOR = 'rgb(75, 84, 255)';
    L.Overlay.STROKE_TRANSPARENT = 'transparent';
}());