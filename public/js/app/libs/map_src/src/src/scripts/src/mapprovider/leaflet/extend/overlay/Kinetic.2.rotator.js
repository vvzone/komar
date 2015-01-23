/**
 * Created by vkmar_000 on 27.08.14.
 */
(function () {
    'use strict';
    function racalculateAngle(vec1, vec2) {
        return Gis.Util.radToGrad(Math.atan2(vec1.x * vec2.y - vec1.y * vec2.x, vec1.x * vec2.x + vec1.y * vec2.y));
    }
    var CIRCLE_RESIZE_RADIUS = 3,
        CIRCLE_RESIZE_RADIUS_HOVER = 6,
        CIRLCE_DATA = {
            radius: CIRCLE_RESIZE_RADIUS,
            fill: 'white',
            stroke: L.Overlay.STROKE_COLOR,
            strokeWidth: 2
        },
        DELTA_POINT_ROTATOR = 10,
        kineticOverlayRotator = {
            isRotating: function () {
                return this._rotation;
            },
            getRotation: function () {
                return Gis.Util.isDefine(this._imageData.rotation) ? this._imageData.rotation : this._group.rotation();
            },
            setRotation: function (rotation) {
                this._imageData.rotation = rotation;
                this._group.rotation(rotation);
            },
            doDragRotate: function (p) {
                if (this.isRotating()) {
                    var pointDelta = L.point(p.x, p.y)._subtract(L.point(this._layer.x(), this._layer.y())),
                        newPoint,
                        angle;
                    newPoint = this._rotation.add(pointDelta);
                    angle = racalculateAngle(this._rotationSrc, newPoint);
                    this.setRotation(angle);
                    this.fire('rotate', {
                        rotation: this.getRotation()
                    });
                    return true;
                }
                return false;
            },
            _createEventListeners: function () {
                var self = this;
                this.rotatorMouseDown = function () {
                    var position = this.position();
                    self._rotationSrc = L.point(position.x, position.y);
                    self._rotation = Gis.Util.rotate(self._rotationSrc, -self.getRotation());
                };
                this._rotatorMouseUp = function () {
                    self._rotation = false;
                };
                this._layer.on('mouseup', this._rotatorMouseUp);
                this._layer.on('mouseleave', this._rotatorMouseUp);
            },
            _createRotaters: function () {
                this._createEventListeners();
                this._circles = [];
                var group = this._layer, i, mouseMove = function () {
                    this.radius(CIRCLE_RESIZE_RADIUS_HOVER);
                    this.setZIndex(2);
                    group.draw();
                }, mouseDown = function () {
                    document.body.style.cursor = '';
                    this.setZIndex(1);
                    this.radius(CIRCLE_RESIZE_RADIUS);
                    group.draw();
                };
                for (i = 0; i < 4; i += 1) {
                    this._circles[i] = new Kinetic.Circle(CIRLCE_DATA);
                    this._circles[i].on('mousedown', this.rotatorMouseDown);
                    this._circles[i].on('mousemove', mouseMove);
                    this._circles[i].on('mouseleave', mouseDown);
                    this._group.add(this._circles[i]);
                }
            },
            _updateRotaters: function () {
                var data = this._imageData, dWidth = this.getWidth(data), dHeight = this.getHeight(data), min = L.point(-dWidth / 2, -dHeight / 2);
                this._circles[0].position(min.subtract(L.point(DELTA_POINT_ROTATOR, DELTA_POINT_ROTATOR)));
                this._circles[1].position(min.add(L.point(dWidth, 0)).add(L.point(DELTA_POINT_ROTATOR, -DELTA_POINT_ROTATOR)));
                this._circles[2].position(min.add(L.point(dWidth, dHeight)).add(L.point(DELTA_POINT_ROTATOR, DELTA_POINT_ROTATOR)));
                this._circles[3].position(min.add(L.point(0, dHeight)).add(L.point(-DELTA_POINT_ROTATOR, DELTA_POINT_ROTATOR)));
            },
            setRotatorsVisible: function (visible) {
                var i, len;
                for (i = 0, len = this._circles.length; i < len; i += 1) {
                    this._circles[i].visible(visible);
                }
            }
        };
    L.Overlay.include(kineticOverlayRotator);
}());