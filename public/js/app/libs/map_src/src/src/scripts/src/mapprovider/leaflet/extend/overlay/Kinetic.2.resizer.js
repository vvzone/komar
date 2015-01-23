/**
 * Created by vkmar_000 on 27.08.14.
 */
(function () {
    'use strict';
    var CIRCLE_RESIZE_RADIUS = 3,
        CIRCLE_RESIZE_RADIUS_HOVER = 6,
        CIRLCE_DATA_RESIZE = {
            radius: CIRCLE_RESIZE_RADIUS,
            fill: 'white',
            stroke: L.Overlay.STROKE_COLOR,
            strokeWidth: 2
        },
        kineticOverlayResizer = {
            _scale: 1,
            isResizing: function () {
                return this.resizer;
            },
            calculateRotated: function (pointDelta) {
                var angle = this._group.rotation();
                return Gis.Util.rotate(pointDelta, angle);
            },
            doDragResize: function (p) {
                if (this.isResizing()) {
                    var self = this,
                        data = this._imageData,
                        pointDelta = L.point(p.x, p.y)._subtract(L.point(this._layer.x(), this._layer.y())),
                        temp,
                        resizerPosition = this.resizer.position(),
                        sourceResizerPos = L.point(resizerPosition.x, resizerPosition.y),
                        latLng = this._draggedLatLng || data.latlng,
                        width = this.getWidth(data),
                        height = this.getHeight(data),
                        pointStart = this._map.latLngToLayerPoint(latLng)._add(L.point(width / 2, height / 2));
                    resizerPosition = Gis.Util.rotate(sourceResizerPos, -this._group.rotation());
                    pointDelta = this.calculateRotated(pointDelta.add(resizerPosition)).subtract(sourceResizerPos);
                    temp = pointDelta;
                    if (this.pointDeltaOld) {
                        pointDelta = pointDelta.subtract(this.pointDeltaOld);
                    }
                    pointDelta = pointDelta.multiplyBy(2);
                    if (this._circlesResize[0] === this.resizer) {
                        width -= pointDelta.x;
                        height -= pointDelta.y;
                    }
                    if (this._circlesResize[1] === this.resizer) {
                        height -= pointDelta.y;
                    }
                    if (this._circlesResize[2] === this.resizer) {
                        width += pointDelta.x;
                        height -= pointDelta.y;
                    }
                    if (this._circlesResize[3] === this.resizer) {
                        width += pointDelta.x;
                    }
                    if (this._circlesResize[4] === this.resizer) {
                        width += pointDelta.x;
                        height += pointDelta.y;
                    }
                    if (this._circlesResize[5] === this.resizer) {
                        height += pointDelta.y;
                    }
                    if (this._circlesResize[6] === this.resizer) {
                        height += pointDelta.y;
                        width -= pointDelta.x;
                    }
                    if (this._circlesResize[7] === this.resizer) {
                        width -= pointDelta.x;
                    }
                    if (width > 0 && height > 0) {
                        this.pointDeltaOld = temp;
                        if (Math.abs(width - this.getWidth(data)) > Math.abs(height - this.getHeight(data))) {
                            self.setScale(width / data.dWidth);
                        } else {
                            self.setScale(height / data.dHeight);
                        }
                        pointStart._subtract(L.point(this.getWidth(data) / 2, this.getHeight(data) / 2));
                        self._draggedLatLng = this._map.layerPointToLatLng(pointStart);
                        Gis.requestAnimationFrame(10)(function () {
                            self.redraw();
                            var event = {};
                            event.scale = self.getScale();
                            event.latlng = self._draggedLatLng;
                            event.rotation = self.getRotation();
                            self.fire('resize', event);
                        });
                    }
                    return true;
                }
                return false;
            },
            setScale: function (scale) {
                this._scale = scale;
                if (this._imageData) {
                    this._imageData.scale = scale;
                }
            },
            getScale: function () {
                if (this._imageData) {
                    return this._imageData.scale;
                }
                return this._scale;
            },
            _createResizers: function () {
                this._circlesResize = [];
                var self = this, group = this._layer, i, mouseDown = function () {
                    self.resizer = this;
                    self.pointDeltaOld = false;
                }, mouseMove = function () {
                    document.body.classList.add('gis-grab');
                    this.radius(CIRCLE_RESIZE_RADIUS_HOVER);
                    this.setZIndex(2);
                    group.draw();
                }, mouseLeave = function () {
                    document.body.classList.remove('gis-grab');
                    self.resizer = false;
                    this.setZIndex(1);
                    this.radius(CIRCLE_RESIZE_RADIUS);
                    group.draw();
                };
                for (i = 0; i < 8; i += 1) {
                    this._circlesResize[i] = new Kinetic.Circle(CIRLCE_DATA_RESIZE);
                    this._group.add(this._circlesResize[i]);
                    this._circlesResize[i].on('mousedown', mouseDown);
                    this._circlesResize[i].on('mousemove', mouseMove);
                    this._circlesResize[i].on('mouseleave', mouseLeave);
                }
//            this._circlesResize[0]._cursor = 'nwse-resize';
//            this._circlesResize[1]._cursor = 'ns-resize';
//            this._circlesResize[2]._cursor = 'nesw-resize';
//            this._circlesResize[3]._cursor = 'ew-resize';
//            this._circlesResize[4]._cursor = 'nwse-resize';
//            this._circlesResize[5]._cursor = 'ns-resize';
//            this._circlesResize[6]._cursor = 'nesw-resize';
//            this._circlesResize[7]._cursor = 'ew-resize';
            },
            _updateResizers: function () {
                var data = this._imageData, dWidth = this.getWidth(data),  height = this.getHeight(data), min = L.point(-dWidth / 2, -height / 2);
                this._circlesResize[0].position(min);
                this._circlesResize[1].position(min.add(L.point(dWidth / 2, 0)));
                this._circlesResize[2].position(min.add(L.point(dWidth, 0)));
                this._circlesResize[3].position(min.add(L.point(dWidth, height / 2)));
                this._circlesResize[4].position(min.add(L.point(dWidth, height)));
                this._circlesResize[5].position(min.add(L.point(dWidth / 2, height)));
                this._circlesResize[6].position(min.add(L.point(0, height)));
                this._circlesResize[7].position(min.add(L.point(0, height / 2)));
            },
            setResizersVisible: function (visible) {
                var i, len;
                for (i = 0, len = this._circlesResize.length; i < len; i += 1) {
                    this._circlesResize[i].visible(visible);
                }
            }
        };
    L.Overlay.include(kineticOverlayResizer);
}());