/**
 * Километровая сетка
 */
(function () {
    'use strict';
    var layer,
        pointTopLeft,
        DELTA_PERCENT = 0,
        loadingLine,
        loadingLineVertical,
        pointTopRight,
        pointBottomLeft,
        pointBottomRight,
        square,
        instance;


    L.ReliefControlSquare = L.Class.extend({
        options: {
            bounds: undefined
        },
        includes: [L.Mixin.Events],
        initialize: function () {
            instance = this;
            this.drawRelief = function () {
                instance.updatePointPositions();
                layer.draw();
            };
        },
        getCenter: function () {
            return this.options.bounds.getCenter();
        },
        getNorthWest: function () {
            return this.options.bounds.getNorthWest();
        },
        getSouthEast: function () {
            return this.options.bounds.getSouthEast();
        },
        getAvailableBounds: function () {
            var pixelBounds = this._map.getPixelBounds();
            var pixelCrop = this._map.getPixelCrop();
            if (pixelCrop) {
                pixelBounds.min._subtract(this._map.getPixelOrigin());
                pixelBounds.max._subtract(this._map.getPixelOrigin());
                pixelBounds = pixelBounds.getIntersect(pixelCrop);
            }
            return pixelBounds;
        },
        addTo: function (map) {
            map.addLayer(this);
            return this;
        },
        recalculateDraggedPoint: function () {
            var pixelBounds = this.getAvailableBounds();
            this.options.bounds = L.latLngBounds(
                this._map.layerPointToLatLng(pixelBounds.getCenter().subtract(pixelBounds.getSize().divideBy(4))).wrap(),
                this._map.layerPointToLatLng(pixelBounds.getCenter().add(pixelBounds.getSize().divideBy(4))).wrap()
            );
        },
        updateDraggedPointPosition: function (delta) {
            if (!delta) {
                this.options.bounds = L.latLngBounds(
                    this._map.layerPointToLatLng(L.point(pointTopLeft.x(), pointTopLeft.y()).add(this._map._kineticViewport.min)),
                    this._map.layerPointToLatLng(L.point(pointBottomRight.x(), pointBottomRight.y()).add(this._map._kineticViewport.min))
                );
                this.options.bounds.extend(this._map.layerPointToLatLng(L.point(pointTopRight.x(), pointTopRight.y()).add(this._map._kineticViewport.min)));
                this.options.bounds.extend(this._map.layerPointToLatLng(L.point(pointBottomLeft.x(), pointBottomLeft.y()).add(this._map._kineticViewport.min)));
            } else {
                this.options.bounds = L.latLngBounds(
                    this._map.layerPointToLatLng(L.point(pointTopLeft.x(), pointTopLeft.y()).add(delta).add(this._map._kineticViewport.min)),
                    this._map.layerPointToLatLng(L.point(pointBottomRight.x(), pointBottomRight.y()).add(delta).add(this._map._kineticViewport.min))
                );
                this.options.bounds.extend(this._map.layerPointToLatLng(L.point(pointTopRight.x(), pointTopRight.y()).add(delta).add(this._map._kineticViewport.min)));
                this.options.bounds.extend(this._map.layerPointToLatLng(L.point(pointBottomLeft.x(), pointBottomLeft.y()).add(delta).add(this._map._kineticViewport.min)));
            }
        },
        moveDragWithCenter: function () {
            var oldCenter = this._oldCenter || L.point(0, 0);
            var newCenter = L.point(square.x(), square.y());
            this._oldCenter = newCenter;
            this.updateDraggedPointPosition(newCenter.subtract(oldCenter));
        },
        _fillOptions: function () {
            var pixelBounds = this.getAvailableBounds();
            if (this.options.bounds == undefined) {
                var size = pixelBounds.getSize().divideBy(4);
                this.options.bounds = L.latLngBounds(
                    this._map.layerPointToLatLng(pixelBounds.getCenter().subtract(size)),
                    this._map.layerPointToLatLng(pixelBounds.getCenter().add(size))
                );
            }
        },
        updateSquarePoints: function () {
            var x = square.x(),
                y = square.y();
            square.points([pointTopLeft.x() - x, pointTopLeft.y() - y,
                pointTopRight.x() - x, pointTopRight.y() - y,
                pointBottomRight.x() - x, pointBottomRight.y() - y,
                pointBottomLeft.x() - x, pointBottomLeft.y() - y]);
        },
        updatePointPositions: function () {
            pointTopLeft.position(this.getPosition(this.options.bounds.getNorthWest()));
            pointTopRight.position(this.getPosition(this.options.bounds.getNorthEast()));
            pointBottomLeft.position(this.getPosition(this.options.bounds.getSouthWest()));
            pointBottomRight.position(this.getPosition(this.options.bounds.getSouthEast()));
            loadingLine.points(this.getRadarPoints());
            loadingLineVertical.points(this.getRadarPointsVertical());
            this.updateSquarePoints();
        },
        getPosition: function (latLng) {
            return this._map.latLngToLayerPoint(latLng)._subtract(this._map._kineticViewport.min);
        },
        initPointsEvents: function () {
            var self = this,
                callAfterDragCenter = function () {
                    self.moveDragWithCenter();
                    self.drawRelief();
                },
                callAfterDragWidth = function () {
                    var latlng = self._map.layerPointToLatLng(L.point(this.x(), this.y()).add(self._map._kineticViewport.min));
                    if (this === pointTopLeft) {
                        self.options.bounds._northEast.lat = latlng.lat;
                        self.options.bounds._southWest.lng = latlng.lng;
                    } else if (this === pointTopRight) {
                        self.options.bounds._northEast.lat = latlng.lat;
                        self.options.bounds._northEast.lng = latlng.lng;
                    } else if (this === pointBottomRight) {
                        self.options.bounds._southWest.lat = latlng.lat;
                        self.options.bounds._northEast.lng = latlng.lng;
                    } else if (this === pointBottomLeft) {
                        self.options.bounds._southWest.lat = latlng.lat;
                        self.options.bounds._southWest.lng = latlng.lng;
                    }
                    self.drawRelief();
                },
                dragend = function () {
                    self.fire('dragend');
                };
            function registerEvent(point, dragCallback) {
                point.on('mouseover', L.KineticFuncs.zoomInFunc(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.BIG_POINT_RADIUS, layer));
                point.on('mouseout', L.KineticFuncs.zoomOutFunc(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.DEFAULT_POINT_RADIUS, layer));
                point.on('dragend', dragend);
                var callback = function () {
                    dragCallback.call(point);
                };
                point.dragBoundFunc(function (pos) {
                    Gis.requestAnimationFrame(50)(callback);
                    return pos;
                });
            }
            registerEvent(pointBottomLeft, callAfterDragWidth);
            registerEvent(pointBottomRight, callAfterDragWidth);
            registerEvent(pointTopLeft, callAfterDragWidth);
            registerEvent(pointTopRight, callAfterDragWidth);
            square.on('mouseover', L.KineticFuncs.zoomInFuncOpacity(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.HOVERED_OPACITY, layer));
            square.on('mouseout', L.KineticFuncs.zoomOutFuncOpacity(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.DEFAULT_OPACITY, layer));
            square.on('dragend', dragend);
            square.dragBoundFunc(function (pos) {
                Gis.requestAnimationFrame(50)(callAfterDragCenter);
                return pos;
            });
        },
        getRadarPoints: function () {
            var positionTopLeft = this.getPosition(this.options.bounds.getNorthWest());
            var positionTopRight = this.getPosition(this.options.bounds.getNorthEast());
            var positionBottomLeft = this.getPosition(this.options.bounds.getSouthWest());
            var positionBottomRight = this.getPosition(this.options.bounds.getSouthEast());
            var deltaXLeft = (positionBottomLeft.x - positionTopLeft.x) * DELTA_PERCENT;
            var deltaXRigth = (positionBottomRight.x - positionTopRight.x) * DELTA_PERCENT;
            var deltaYTop = (positionBottomLeft.y - positionTopLeft.y) * DELTA_PERCENT;
            return [positionTopLeft.x + deltaXLeft,
                positionTopLeft.y + deltaYTop,
                positionTopRight.x + deltaXRigth,
                positionTopRight.y - positionTopRight.subtract(positionBottomRight).y * DELTA_PERCENT];
        },
        getRadarPointsVertical: function () {
            var positionTopLeft = this.getPosition(this.options.bounds.getNorthWest());
            var positionTopRight = this.getPosition(this.options.bounds.getNorthEast());
            var positionBottomLeft = this.getPosition(this.options.bounds.getSouthWest());
            var positionBottomRight = this.getPosition(this.options.bounds.getSouthEast());
            var deltaXTop = (positionTopRight.x - positionTopLeft.x) * DELTA_PERCENT;
            var deltaXBottom = (positionBottomRight.x - positionBottomLeft.x) * DELTA_PERCENT;
            var deltaYTop = (positionTopRight.y - positionTopLeft.y) * DELTA_PERCENT;
            return [positionTopLeft.x + deltaXTop,
                positionTopLeft.y + deltaYTop,
                positionBottomLeft.x + deltaXBottom,
                positionBottomLeft.y - positionBottomLeft.subtract(positionBottomRight).y * DELTA_PERCENT];
        },
        onAdd: function (map) {
            this._map = map;
            var self = this;
            this._fillOptions();
            map.initKinetic();
            if (!layer) {
                layer = new Kinetic.Layer();
                square = square || new Kinetic.Line(L.extend({
                    closed: true,
                    draggable: true
                }, L.ReliefControl.SHAPE_STYLE));
                layer.add(square);

                var positionTopLeft = this.getPosition(this.options.bounds.getNorthWest());
                var positionTopRight = this.getPosition(this.options.bounds.getNorthEast());
                loadingLine = loadingLine || new Kinetic.Line(L.extend({
                    x: 0,
                    y: 0,
                    opacity: 0,
                    points: this.getRadarPoints()
                }, L.ReliefControl.RADAR_LINE_POINT_STYLE));
                loadingLineVertical = loadingLineVertical || new Kinetic.Line(L.extend({
                    x: 0,
                    y: 0,
                    opacity: 0,
                    points: this.getRadarPointsVertical()
                }, L.ReliefControl.RADAR_LINE_POINT_STYLE));
                pointTopLeft = new Kinetic.Circle(Gis.extend(positionTopLeft, L.ReliefControl.DRAGGABLE_POINT_STYLE));
                pointTopRight = new Kinetic.Circle(Gis.extend(positionTopRight, L.ReliefControl.DRAGGABLE_POINT_STYLE));
                pointBottomLeft = new Kinetic.Circle(Gis.extend(this.getPosition(this.options.bounds.getSouthWest()), L.ReliefControl.DRAGGABLE_POINT_STYLE));
                pointBottomRight = new Kinetic.Circle(Gis.extend(this.getPosition(this.options.bounds.getSouthEast()), L.ReliefControl.DRAGGABLE_POINT_STYLE));
                this.updateSquarePoints();
                layer.add(loadingLine);
                layer.add(loadingLineVertical);
                layer.add(pointTopLeft);
                layer.add(pointTopRight);
                layer.add(pointBottomLeft);
                layer.add(pointBottomRight);
                this.initPointsEvents();
            }
            this._map.showTopKinetic(true);
            this._map._kineticStageTop.add(layer);
            this.fire('add');
            this.initEvents();
            Gis.requestAnimationFrame(10)(function () {
                self.draw();
                Gis.requestAnimationFrame(10)(function () {
                    layer.setZIndex(1);
                });
            });

        },
        onRemove: function (map) {
            this._map.showTopKinetic(false);
            this.deInitEvents();
            layer.remove();
        },
        initEvents: function () {
            this._map.on("moveend", this.moveEnd, this);
            this._map.on("movestart", this.moveStart, this);
            Gis.EventBus.on("skchanged", this.draw, this);
            this._map.on("zoomend", this._zoomEnd, this);
        },
        deInitEvents: function () {
            this._map.off("moveend", this.moveEnd, this);
            this._map.off("movestart", this.moveStart, this);
            Gis.EventBus.off("skchanged", this.draw, this);
            this._map.off("zoomend", this._zoomEnd, this);
        },
        moveEnd: function () {
            this.draw();
        },
        moveStart: function () {

        },
        showRadar: function (show) {
            this._showRadar = show;
            if (loadingLine) {
                var animationOpacityTIme = 1000;
                if (show) {
                    var navigation = 1;
                    DELTA_PERCENT = 0;
                    if (loadingLine._anim_s) {
                        loadingLine._anim_s.stop();
                    }
                    L.KineticFuncs.zoomInFuncOpacity(animationOpacityTIme, L.ReliefControl.HOVERED_OPACITY, layer).call([loadingLine, loadingLineVertical]);
                    loadingLine._anim_s = new Kinetic.Animation(function (frame) {
                        var number = (frame.timeDiff / 2000) * navigation;
                        var tempDelta = DELTA_PERCENT + number;
                        if (tempDelta > 1 || tempDelta < 0) {
                            navigation = -navigation;
                            DELTA_PERCENT = Math.round(DELTA_PERCENT);
                        } else {
                            DELTA_PERCENT = tempDelta;
                        }
                        loadingLine.points(instance.getRadarPoints());
                        loadingLineVertical.points(instance.getRadarPointsVertical());
                    }, layer);

                    loadingLine._anim_s.start();
                } else {
                    L.KineticFuncs.zoomOutFuncOpacity(animationOpacityTIme, 0, layer).call([loadingLine, loadingLineVertical]);
                    var anims = loadingLine._anim_s;
                    if (anims) {
                        setTimeout(function () {
                            anims.stop();
                            DELTA_PERCENT = 0;
                        }, animationOpacityTIme)
                        ;
                    }
                }
            }
        },
        _zoomEnd: function () {
            this.draw();
        },
        setOptions: function (options) {
            L.Util.setOptions(this, options);
            this.fire('dragend');
            if (this._map) {
                this.draw();
            }
        },
        draw: function () {
            Gis.requestAnimationFrame(10)(this.drawRelief);
        }
    });

    L.ReliefControlSquare.getInstance = function (options) {
        if (instance) {
            if (options) {
                instance.setOptions(options);
            }
        } else {
            new L.ReliefControlSquare(options);
        }
        return instance;
    };
}());
