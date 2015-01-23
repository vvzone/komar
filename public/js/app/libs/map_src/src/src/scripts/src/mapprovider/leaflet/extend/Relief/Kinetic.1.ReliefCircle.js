/**
 * Километровая сетка
 */
(function () {
    'use strict';
    var layer,
        loadingLine,
        pointWidth,
        pointCircle,
        pointHeight,
        radius;


    L.ReliefControlCircle = L.Class.extend({
        options: {
            radius: undefined,
            draggedPoint: undefined,
            center: undefined
        },
        includes: [L.Mixin.Events],
        initialize: function () {
            if (L.ReliefControlCircle.instance) {
                throw new Error('Already created');
            }
            var self = this;
            L.ReliefControlCircle.instance = this;
            this.drawRelief = function () {
                self.updatePointPositions();
                layer.draw();
            };
        },
        fillDraggedPointFromRadius: function (options) {
            if (options.radius) {
                var azimuth = (this.options.draggedPoint && Gis.Projection.calculateAsimuth(this.options.center, this.options.draggedPoint)) || 90;
                this.options.draggedPoint = L.latLng(Gis.Projection.nextPointByLen(options.radius, this.options.center, azimuth));
            }
        },
        setOptions: function (options, noFire) {
            L.Util.setOptions(this, options);
            this.fillDraggedPointFromRadius(options);
            if (!noFire) {
                this.fire('dragend');
            }
            this.draw();
        },
        getCenter: function () {
            return this.options.center;
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
            this.options.draggedPoint = this._map.layerPointToLatLng(pixelBounds.getCenter().add(L.point(pixelBounds.getSize().x / 4, 0))).wrap();
        },
        updateDraggedPointPosition: function () {
            this.options.center = this._map.layerPointToLatLng(L.point(radius.x(), radius.y()).add(this._map._kineticViewport.min));
            this.options.draggedPoint = this._map.layerPointToLatLng(L.point(pointWidth.x(), pointWidth.y()).add(this._map._kineticViewport.min));
        },
        moveDragWithCenter: function () {
            var oldCenter = this._map.latLngToLayerPoint(this.options.center).subtract(this._map._kineticViewport.min);
            var newCenter = L.point(radius.x(), radius.y());
            this.options.center = this._map.layerPointToLatLng(newCenter.add(this._map._kineticViewport.min));
            this.options.draggedPoint = this._map.layerPointToLatLng(L.point(pointWidth.x(), pointWidth.y()).add(newCenter.subtract(oldCenter)).add(this._map._kineticViewport.min));
        },
        moveDragWithCenterPoint: function () {
            var oldCenter = this._map.latLngToLayerPoint(this.options.center).subtract(this._map._kineticViewport.min);
            var newCenter = L.point(pointCircle.x(), pointCircle.y());
            this.options.center = this._map.layerPointToLatLng(newCenter.add(this._map._kineticViewport.min));
            this.options.draggedPoint = this._map.layerPointToLatLng(L.point(pointWidth.x(), pointWidth.y()).add(newCenter.subtract(oldCenter)).add(this._map._kineticViewport.min));
        },
        _fillOptions: function () {
            var pixelBounds = this.getAvailableBounds(),
                center = this._map.layerPointToLatLng(pixelBounds.getCenter()).wrap();

            this.fillDraggedPointFromRadius(this.options);
            if (this.options.draggedPoint == undefined) {
                this.recalculateDraggedPoint();
            }
            if (this.options.center == undefined) {
                this.options.center = center;
            }
            if (this.options.height == undefined) {
                this.options.height = 5000;
            }
        },
        getPixelRadius: function () {
            return this._map.latLngToLayerPoint(this.options.center).distanceTo(this._map.latLngToLayerPoint(this.options.draggedPoint));
        },
        getRadius: function () {
            return (this.options.center && this.options.draggedPoint && this.options.center.distanceTo(this.options.draggedPoint)) || 0;
        },
        updatePointPositions: function () {
            pointWidth.position(this.getPosition(this.options.draggedPoint));
            pointCircle.position(this.getPosition(this.options.center));
            loadingLine.position(this.getPosition(this.options.center));
            loadingLine.points(this.getRadarPoints());
            radius.position(this.getPosition(this.options.center));
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
                callAfterDragCenterPoint = function () {
                    self.moveDragWithCenterPoint();
                    self.drawRelief();
                },
                callAfterDragWidth = function () {
                    self.updateDraggedPointPosition();
                    radius.radius(self.getPixelRadius());
                    self.drawRelief();
                },
                dragend = function () {
                    self.fire('dragend');
                };
            radius.dragBoundFunc(function (pos) {
                Gis.requestAnimationFrame(50)(callAfterDragCenter);
                return pos;
            });
            pointCircle.dragBoundFunc(function (pos) {
                Gis.requestAnimationFrame(50)(callAfterDragCenterPoint);
                return pos;
            });
            pointWidth.dragBoundFunc(function (pos) {
                Gis.requestAnimationFrame(50)(callAfterDragWidth);
                return pos;
            });
            pointCircle.on('mouseover', L.KineticFuncs.zoomInFunc(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.BIG_POINT_RADIUS, layer));
            pointCircle.on('mouseout', L.KineticFuncs.zoomOutFunc(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.DEFAULT_POINT_RADIUS, layer));
            pointWidth.on('mouseover', L.KineticFuncs.zoomInFunc(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.BIG_POINT_RADIUS, layer));
            pointWidth.on('mouseout', L.KineticFuncs.zoomOutFunc(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.DEFAULT_POINT_RADIUS, layer));
            radius.on('mouseover', L.KineticFuncs.zoomInFuncOpacity(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.HOVERED_OPACITY, layer));
            radius.on('mouseout', L.KineticFuncs.zoomOutFuncOpacity(L.ReliefControl.TIME_TO_ANIMATE, L.ReliefControl.DEFAULT_OPACITY, layer));
            pointWidth.on('dragend', dragend);
            pointCircle.on('dragend', dragend);
            radius.on('dragend', dragend);
        },
        getRadarPoints: function () {
            var position = this.getPosition(this.options.center);
            var pointPosition = this.getPosition(this.options.draggedPoint).subtract(position);
            return [0, 0, pointPosition.x, pointPosition.y];
        },
        showRadar: function (show) {
            this._showRadar = show;
            if (loadingLine) {
                var startRotation = 0, node = loadingLine;
                var animationOpacityTIme = 1000;
                if (show) {
                    if (loadingLine._anim_s) {
                        loadingLine._anim_s.stop();
                    }
                    L.KineticFuncs.zoomInFuncOpacity(animationOpacityTIme, L.ReliefControl.HOVERED_OPACITY, layer).call(loadingLine);
                    loadingLine._anim_s = new Kinetic.Animation(function (frame) {
                        var aRotation;
                        aRotation = startRotation + 180 * (frame.time / 1000);
                        node.rotation(aRotation);
                    }, layer);

                    loadingLine._anim_s.start();
                } else {
                    L.KineticFuncs.zoomOutFuncOpacity(animationOpacityTIme * 2, 0, layer).call(loadingLine);
                    var anims = loadingLine._anim_s;
                    if (anims) {
                        setTimeout(function () {
                            anims.stop();
                        }, animationOpacityTIme * 2)
                        ;
                    }
                }
            }
        },
        initElements: function () {
            this._fillOptions();
            if (!layer) {
                layer = new Kinetic.Layer();
                var position = this.getPosition(this.options.center);
                var pointPosition = this.getPosition(this.options.draggedPoint);
                pointWidth = pointWidth || new Kinetic.Circle(Gis.extend({}, pointPosition, L.ReliefControl.DRAGGABLE_POINT_STYLE));
                loadingLine = loadingLine || new Kinetic.Line(L.extend({
                    x: position.x,
                    y: position.y,
                    opacity: 0,
                    points: this.getRadarPoints()
                }, L.ReliefControl.RADAR_LINE_POINT_STYLE));
                pointCircle = pointCircle || new Kinetic.Circle(Gis.extend({}, position, L.ReliefControl.DRAGGABLE_POINT_STYLE));
                pointHeight = pointHeight || new Kinetic.Circle(Gis.extend({}, L.ReliefControl.DRAGGABLE_POINT_STYLE));
                radius = radius || new Kinetic.Circle(L.extend({
                    radius: this.getPixelRadius(),
                    draggable: true
                }, position, L.ReliefControl.SHAPE_STYLE));
                layer.add(radius);
                layer.add(loadingLine);
                layer.add(pointCircle);
                layer.add(pointWidth);
                this.initPointsEvents();
            }
        },
        onAdd: function (map) {
            this._map = map;
            var self = this;
            map.initKinetic();
            this.initElements();
            this._map.showTopKinetic(true);
            this._map._kineticStageTop.add(layer);
            this.fire('add');
            this.initEvents();
            this.showRadar(this._showRadar);
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
        _zoomEnd: function () {
            this.draw();
        },
        draw: function () {
            if (this._map && this.options.draggedPoint && this.options.center) {
                pointWidth.position(this.getPosition(this.options.draggedPoint));
                pointCircle.position(this.getPosition(this.options.center));
                loadingLine.position(this.getPosition(this.options.center));
                loadingLine.points(this.getRadarPoints());
                radius.position(this.getPosition(this.options.center));
                radius.radius(this.getPixelRadius());
                Gis.requestAnimationFrame(10)(this.drawRelief);
            }
        }
    });
    L.ReliefControlCircle.getInstance = function (options) {
        if (L.ReliefControlCircle.instance) {
            if (options) {
                L.ReliefControlCircle.instance.setOptions(options);
            }
        } else {
            new L.ReliefControlCircle(options);
        }
        return L.ReliefControlCircle.instance;
    };
}());
