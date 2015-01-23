/**
 * Километровая сетка
 */
(function () {
    'use strict';
    L.Grid = L.Class.extend({
        includes: [L.Mixin.Events],
        initialize: function () {
            var self = this;
            this._countRect = 0;
            this._countLine = 0;
            this._textCount = 0;
            this._texts = [];
            this._rects = [];
            this._lines = [];
            this.drawGrid = function () {
                self.drawLines();
                self.drawHeaders();
                self._layer.draw();
            };
        },
        addTo: function (map) {
            map.addLayer(this);
            return this;
        },
        onAdd: function (map) {
            this._map = map;
            var self = this;
            map.initKinetic();
            this._layer = new Kinetic.Layer();
            this._groupLines = new Kinetic.Group();
            this._groupWhite = new Kinetic.Group();
            this._layer.add(this._groupWhite);
            this._layer.add(this._groupLines);
            this._map._kineticStage.add(this._layer);
            this.fire('add');
            this.initEvents();
            Gis.requestAnimationFrame(10)(function () {
                self.draw();
                Gis.requestAnimationFrame(10)(function () {
                    self._layer.setZIndex(1);
                });
            });

        },
        onRemove: function (map) {
            this.deInitEvents();
            this._layer.remove();
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
            if (this._groupWhite) {
                this._groupWhite.hide();
                this._layer.draw();
            }
        },
        _zoomEnd: function () {
            this.draw();
        },
        _getFreeLine: function () {
            var i = this._countLine++,
                line = this._lines[i];
            if (!line) {
                line = new Kinetic.Line({
                    x: 0,
                    y: 0,
                    points: [0, 0, 200, 200],
                    strokeWidth: 2,
                    stroke: Gis.config('grid.line_color', L.Grid.DEFAULT_GRID_COLOR)
                });
                this._lines[i] = line;
            }
            this._groupLines.add(line);
            return line;
        },
        _getFreeRect: function (i, group) {
            i = Gis.Util.isDefine(i) ? i : this._countRect++;
            var rect = this._rects[i],
                groupWhite = group || this._groupWhite;
            if (!rect) {
                rect = new Kinetic.Rect({
                    width: 100,
                    height: 50,
                    fill: 'rgba(0, 0, 0, 0.3)'
                });
                this._rects[i] = rect;
            }
            groupWhite.add(rect);
            return rect;
        },
        _clearTextFrom: function () {
            var index = this._textCount, len;
            for (len = this._texts.length; index < len; index += 1) {
                this._texts[index].remove();
            }
            this._textCount = 0;
        },
        _clearLinesFrom: function () {
            var index = this._countLine, len;
            for (len = this._lines.length; index < len; index += 1) {
                this._lines[index].remove();
            }
            this._countLine = 0;
        },
        _clearRectsFrom: function () {
            var index = this._countRect, len;
            for (len = this._rects.length; index < len; index += 1) {
                this._rects[index].remove();
            }
            this._countRect = 0;
        },
        _getFreeText: function () {
            var i = this._textCount++, text = this._texts[i];
            if (!text) {
                text = new Kinetic.Text({
                    x: 10,
                    y: 15,
                    offsetX: -3,
                    text: '',
                    fontSize: L.Grid.FONT_SIZE,
                    shadowColor: 'black',
                    fill: 'white',
                    shadowBlur: 2
                });
                this._texts[i] = text;
            }
            this._groupLines.add(text);
            return text;
        },
        getViewLatLng: function () {
            return this._map.getBounds();
        },
        getViewPort: function () {
            var bounds;
            bounds = this._map.getPixcelBoundsLayer(this.getViewLatLng());
            return bounds && this._map._kineticViewport.inters(bounds);
        },
        getDimension: function (zone) {
            var kineticViewport = (zone && this.getViewPort(zone)) || this._map._kineticViewport;
            return L.point(kineticViewport.max.x - kineticViewport.min.x, kineticViewport.max.y - kineticViewport.min.y);
        },
        draw: function () {
            Gis.requestAnimationFrame(10)(this.drawGrid);
        },
        _drawSingleRect: function (freeRect, x, y, w, h) {
            freeRect.x(x);
            freeRect.y(y);
            freeRect.width(w);
            freeRect.height(h);
        },
        _drawWhite: function (mapPxBounds) {
            var freeRect,
                width = mapPxBounds ? mapPxBounds.getSize().x: document.body.clientWidth,
                heigth = mapPxBounds ? mapPxBounds.getSize().y: document.body.clientHeight,
                otX = mapPxBounds ? 0 : L.Grid.OFFSET_TEXT_LEFT,
                otY = mapPxBounds ? 0 : L.Grid.OFFSET_TEXT_TOP,
                otsX = mapPxBounds ? 0 : L.Grid.OFFSET_TEXT_RIGHT,
                otsY = mapPxBounds ? 0 : L.Grid.OFFSET_TEXT_BOTTOM,
                sizeBigX = L.Grid.OFFSET + otX,
                sizeBigY = L.Grid.OFFSET + otY,
                sizeSmallX = L.Grid.OFFSET + otsX,
                sizeSmallY = L.Grid.OFFSET + otsY,
                x = mapPxBounds ? mapPxBounds.min.x: 0,
                y = mapPxBounds ? mapPxBounds.min.y: 0;
            this._drawSingleRect(this._getFreeRect(0), x, y, width, sizeBigY);
            this._drawSingleRect(this._getFreeRect(1), x + width - sizeSmallX, y + sizeBigY, sizeSmallX, heigth - sizeBigY - sizeSmallY);
            this._drawSingleRect(this._getFreeRect(2), x, y + sizeBigY, sizeBigX, heigth - sizeSmallY);
            this._drawSingleRect(this._getFreeRect(3), x + sizeBigX, y + heigth - sizeSmallY, width - sizeSmallX, sizeSmallY);
            freeRect = this._getFreeRect(4, this._groupLines);
            freeRect.fill('transparent');
            freeRect.stroke(Gis.config('grid.line_color', L.Grid.DEFAULT_GRID_COLOR));
            freeRect.strokeWidth(2);
            freeRect.x(sizeBigX + x);
            freeRect.y(sizeBigY + y);
            freeRect.width(width - sizeSmallX - sizeBigX);
            freeRect.height(heigth - sizeSmallY - sizeBigY);

            freeRect = this._getFreeRect(5, this._groupLines);
            freeRect.fill('transparent');
            freeRect.stroke(Gis.config('grid.line_color', L.Grid.DEFAULT_GRID_COLOR));
            freeRect.strokeWidth(2);
            freeRect.x(otX + x);
            freeRect.y(otY + y);
            freeRect.width(width - otX - otsX);
            freeRect.height(heigth - otY - otsY);
            this._groupWhite.show();
        },
        getVerticalBounds: function (mapPxBounds) {
            if (mapPxBounds) {
                return [L.bounds(L.point(mapPxBounds.min.x + L.Grid.TEXT_HIDE, mapPxBounds.min.y), L.point(mapPxBounds.max.x - L.Grid.TEXT_HIDE, mapPxBounds.min.y + L.Grid.TEXT_SHOW_IN_BOUNDS)),
                    L.bounds(L.point(mapPxBounds.min.x + L.Grid.TEXT_HIDE, mapPxBounds.max.y), L.point(mapPxBounds.max.x - L.Grid.TEXT_HIDE, mapPxBounds.max.y - L.Grid.TEXT_SHOW_IN_BOUNDS))];
            }
            return [L.bounds(L.point(L.Grid.OFFSET_TEXT_LEFT + L.Grid.OFFSET + L.Grid.TEXT_HIDE, L.Grid.OFFSET_TEXT_TOP), L.point(document.body.clientWidth - L.Grid.OFFSET_TEXT_RIGHT - L.Grid.OFFSET - L.Grid.TEXT_HIDE, L.Grid.OFFSET_TEXT_TOP + L.Grid.TEXT_SHOW_IN_BOUNDS)),
                L.bounds(L.point(L.Grid.OFFSET_TEXT_LEFT + L.Grid.OFFSET + L.Grid.TEXT_HIDE, document.body.clientHeight - L.Grid.OFFSET_TEXT_BOTTOM - L.Grid.TEXT_HIDE), L.point(document.body.clientWidth - L.Grid.OFFSET_TEXT_RIGHT - L.Grid.OFFSET - L.Grid.TEXT_HIDE, document.body.clientHeight - L.Grid.TEXT_SHOW_IN_BOUNDS))];
        },
        getHorisontalBounds: function (mapPxBounds) {
            if (mapPxBounds) {
                return [L.bounds(L.point(mapPxBounds.min.x, mapPxBounds.min.y + L.Grid.OFFSET + L.Grid.TEXT_HIDE), L.point(mapPxBounds.min.x + L.Grid.TEXT_SHOW_IN_BOUNDS,  mapPxBounds.max.y - L.Grid.OFFSET - L.Grid.TEXT_HIDE)),
                    L.bounds(L.point(mapPxBounds.max.x, mapPxBounds.min.y + L.Grid.OFFSET + L.Grid.TEXT_HIDE), L.point(mapPxBounds.max.x - L.Grid.TEXT_SHOW_IN_BOUNDS,  mapPxBounds.max.y - L.Grid.OFFSET - L.Grid.TEXT_HIDE))];
            }
            return [L.bounds(L.point(L.Grid.OFFSET_TEXT_LEFT, L.Grid.OFFSET_TEXT_LEFT + L.Grid.OFFSET + L.Grid.TEXT_HIDE), L.point(L.Grid.OFFSET_TEXT_LEFT + L.Grid.TEXT_SHOW_IN_BOUNDS,  document.body.clientHeight - L.Grid.OFFSET_TEXT_BOTTOM - L.Grid.OFFSET - L.Grid.TEXT_HIDE)),
                L.bounds(L.point(document.body.clientWidth - L.Grid.OFFSET_TEXT_RIGHT, L.Grid.OFFSET_TEXT_TOP + L.Grid.OFFSET + L.Grid.TEXT_HIDE), L.point(document.body.clientWidth - L.Grid.OFFSET_TEXT_RIGHT - L.Grid.TEXT_SHOW_IN_BOUNDS,  document.body.clientHeight - L.Grid.OFFSET_TEXT_BOTTOM - L.Grid.OFFSET - L.Grid.TEXT_HIDE))];
        }
    });
    L.Grid.OFFSET_TEXT_TOP = 0;
    L.Grid.OFFSET_TEXT_LEFT = 0;
    L.Grid.OFFSET_TEXT_RIGHT = 0;
    L.Grid.OFFSET_TEXT_BOTTOM = 0;
    L.Grid.OFFSET = 20;
    L.Grid.TEXT_SHOW_IN_BOUNDS = 2;
    L.Grid.TEXT_HIDE = 15;
    L.Grid.DEFAULT_GRID_STEP = 100;
    /**
     * Шаг километровой сетки
     * @type {number[]}
     */
    L.Grid.DEFAULT_GRID_STEPS = [1, 2, 4];
    L.Grid.STEP_500_000 = 2;
    L.Grid.STEP_200_000 = 6;
    L.Grid.STEP_100_000 = 12;
    L.Grid.STEP_50_000 = 24;
    L.Grid.DEFAULT_GRID_STEPS_NOMEN = [L.Grid.STEP_50_000, L.Grid.STEP_100_000, L.Grid.STEP_200_000, L.Grid.STEP_500_000, 1, 1];
    L.Grid.DEFAULT_GRID_STEPS_GRAD = [30, 15, 10, 6, 5, 3, 2, 1];
    L.Grid.DEFAULT_GRID_COLOR = 'rgb(0, 0, 0)';
    L.Grid.FONT_SIZE = 14;
}());
