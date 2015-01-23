/**
 * За основу взят плагин https://github.com/Leaflet/Leaflet.label
 * добавлены следующие возможности:
 *      отображать несколько меток на карте (без привязки к метке)
 *      перемещение текстовой метки
 *      выбор текстовой метки
 *      указание цвета текста и фона
 *      блок центрируется по горизонтали (вместо смещения вправо)
 * */
"use strict";
(function () {
    var MAX_LABELS_IN_CACHE = 256;
    L.PopupGis = L.Popup.extend({
        options: {
            autoPan: false
        },
        _update: function () {
            if (!this._map) { return; }

            this._container.style.visibility = 'hidden';

            this._updateContent();
            this._updateLayout();
            this._updatePosition();

            this._container.style.visibility = '';

            this._adjustPan();
        },
        _updateLayout: function () {
            var container = this._contentNode,
                style = container.style;

    //        style.width = '';
            style.whiteSpace = 'nowrap';

            var width = $(container).width();
            width = Math.min(width, this.options.maxWidth);
            width = Math.max(width, this.options.minWidth);

            if (this.options.minWidth || this.options.minWidth) {
                style.width = (width + 1) + 'px';
            }
            style.whiteSpace = '';

            style.height = '';

            var height = container.offsetHeight,
                maxHeight = this.options.maxHeight,
                scrolledClass = 'leaflet-popup-scrolled';

            if (maxHeight && height > maxHeight) {
                style.height = maxHeight + 'px';
                L.DomUtil.addClass(container, scrolledClass);
            } else {
                L.DomUtil.removeClass(container, scrolledClass);
            }

            this._containerWidth = this._container.offsetWidth;
        },
        _updateContent: function () {
            if (!this._content) { return; }

            if (typeof this._content === 'string') {
                this._contentNode.innerHTML = this._content;
            } else {
                while (this._contentNode.hasChildNodes()) {
                    this._contentNode.removeChild(this._contentNode.firstChild);
                }
                this._contentNode.appendChild(this._content);
            }
            this.fire('contentupdate');
        },
        setContent: function (content) {
            if (this._content !== content) {
                this._content = content;
                this._update();
            }
            return this;
        },
        _updatePosition: function () {
            if (!this._map) { return; }

            var pos = this._map.latLngToLayerPoint(this._latlng),
                is3d = L.Browser.any3d,
                offset = this.options.offset;

            if (is3d) {
                L.DomUtil.setPosition(this._container, pos);
            }

            this._containerBottom = -offset.y - (is3d ? 0 : pos.y);
            this._containerLeft =  offset.x + (is3d ? 0 : pos.x);

            //Bottom position the popup in case the height of the popup changes (images loading etc)
            this._container.style.bottom = this._containerBottom + 'px';
            this._container.style.left = this._containerLeft + 'px';
        },
        getContainerBounds: function () {
            var containerHeight = this._container.clientHeight,
                containerWidth = this._container.clientWidth,
                latLngTopLeft,
                latLngBottomRight;
            if (!this._containerLeft) {
                this._updatePosition();
            }
            latLngTopLeft = L.latLng(this._map.layerPointToLatLng(new L.Point(this._containerLeft, this._containerBottom + containerHeight)));
            latLngBottomRight = L.latLng(this._map.layerPointToLatLng(
                new L.Point(
                    this._containerLeft + containerWidth,
                    this._containerBottom
                )
            ));
            return new L.LatLngBounds(latLngTopLeft, latLngBottomRight);
        },
        setOffset: function (offset) {
            offset = L.point(offset);
            if (this.options.offset) {
                if (L.point(this.options.offset).distanceTo(offset) < 1) {
                    return;
                }
                L.Point.cache(this.options.offset);
            }
            this.options.offset = offset;
            this._update();
        }
    });

    L.PopupGis.mergeOptions({
        closeButton: false,
        minWidth: null,
        maxWidth: null
    });
    L.Label = L.PopupGis.extend({
        includes: [L.Mixin.Events],
        selected: false,
        options: {
            maxWidth: 600,
            autoPan: false,
            className: 'gis-caption',
            classClickable: 'gis-clickable',
            selectedClass: undefined,
            closePopupOnClick: false,
            position: 'centerleft',
            clickable: false,
            draggable: false,
            color: "#111",
            bgColor: undefined,
            noHide: false,
            offset: L.point(0, 0)
        },
        setPosition: function (position) {
            this.options.position = position;
            this._update();
        },
        onRemove: function (map) {
            if (this.options.position) {
                L.Point.cache(this.options.position);
            }
            if (this.options.position) {
                L.Point.cache(this.options.offset);
            }
            if (this._iconOffset) {
                L.Point.cache(this._iconOffset);
            }
            if (this._latlng) {
                L.LatLng.cache(this._latlng);
            }
            L.PopupGis.prototype.onRemove.call(this, map);
            this.off('mousemove', this.bringToFront, this);
        },
        onAdd: function (map) {
            this._map = map;

            if (!this._container) {
                this._initLayout();
                this._initEvents();
            }
            this._updateContent();

            var animFade = map.options.fadeAnimation;

            if (animFade) {
                L.DomUtil.setOpacity(this._container, 0);
            }
            map._panes.popupPane.appendChild(this._container);
            this.fire('appended');

            map.on('viewreset', this._updatePosition, this);

            if (L.Browser.any3d) {
                map.on('zoomanim', this._zoomAnimation, this);
            }
            this.on('mousemove', this.bringToFront, this);
            this._update();

            if (animFade) {
                L.DomUtil.setOpacity(this._container, 1);
            }
        },
        bringToFront: function () {
            if (this._container) {
                this._map._panes.popupPane.appendChild(this._container);
            }
            return this;
        },

        bringToBack: function () {
            var pane = this._map._panes.popupPane;
            if (this._container) {
                pane.insertBefore(this._container, pane.firstChild);
            }
            return this;
        },
        setIconOffset: function (offset) {
            this._iconOffset = offset;
            this._updatePosition();
        },
        getDimension: function () {
            var inCacheDimension = L.PopupGis.CACHE_DIMENSION[this.options.text], width, height;
            if (!inCacheDimension) {
                width = (this._container && this._container.offsetWidth) || 0;
                height = (this._container && this._container.offsetHeight) || 0;
                inCacheDimension = {width: width, height: height};
                if (width && height) {
                    if (Object.keys(L.PopupGis.CACHE_DIMENSION).length > MAX_LABELS_IN_CACHE) {
                        L.PopupGis.CACHE_DIMENSION = {};
                    }
                    L.PopupGis.CACHE_DIMENSION[this.options.text] = inCacheDimension;
                }
            }
            return inCacheDimension;
        },
        calculateLabelOffset: function () {
            if (this._oldText === this.options.text && this._oldContent === this._content && this._oldPosition && this.options.position === this._lastPosition && this._lastIcoOffset === this._iconOffset) {
                return this._oldPosition;
            }
            this._oldText = this.options.text;
            this._oldContent = this._content;
            this._lastPosition = this.options.position;
            this._lastIcoOffset = this._iconOffset;
            var result,
                width,
                height,
                offsetX,
                offsetY,
                pos = this.options.position || 'centerright',
                dimension = this.getDimension();
            width = dimension.width;
            height = dimension.height;
            offsetX = (this._iconOffset && this._iconOffset.x) || 0;
            offsetY = (this._iconOffset && this._iconOffset.y) || 0;
            switch (pos) {
            case "topright":
                result = L.point(0, -height - offsetY);
                break;
            case "topleft":
                result = L.point(-width - offsetX, -height - offsetY);
                break;
            case "topcenter":
                result = L.point(-width / 2 - offsetX / 2, -height - offsetY);
                break;
            case "bottomright":
                result = L.point(0, 0);
                break;
            case "bottomleft":
                result = L.point(-width - offsetX, 0);
                break;
            case "bottomcenter":
                result = L.point(-width / 2 - offsetX / 2, 0);
                break;
            case "centerleft":
                result = L.point(-width - offsetX, -height / 2 - offsetY / 2);
                break;
            case "centerright":
                result = L.point(0, -height / 2 - offsetY / 2);
                break;
            case "center":
                result = L.point(-width / 2 - offsetX / 2, -height / 2 - offsetY / 2);
                break;
            default:
                result = L.point(0, 0);
            }
            if (!isNaN(result.x) && !isNaN(result.y) && width > 0 && height > 0) {
                this._oldPosition = result;
            }
            return result;
        },
        _initEvents: function () {
            if (this.options.clickable) {
                L.DomUtil.addClass(this._container, this.options.classClickable);
                L.DomEvent.on(this._container, 'click', this._onMouseClick, this);

                var events = ['dblclick', 'mousedown', 'mouseover',
                    'mouseout', 'mousemove', 'contextmenu'], i;
                for (i = 0; i < events.length; i += 1) {
                    L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this);
                }
            }
            if (L.Handler.LabelDrag) {
                this.dragging = new L.Handler.LabelDrag(this);

                if (this.options.draggable) {
                    this.dragging.enable();
                }
            }
        },

        setColor: function (color) {
            this.options.color = color;
            this._update();
            return this;
        },
        _updateClickable: function () {
            if (this._container && this.options.clickable) {
                this._container.classList.add(this.options.classClickable);
            } else {
                this._container.classList.remove(this.options.classClickable);
            }
        },
        setClickable: function (clickable) {
            var oldClickable = this.options.clickable;
            this.options.clickable = clickable;
            if (oldClickable !== clickable) {
                this._updateClickable();
            }
            this._update();
            return this;
        },
        setSelected: function (selected) {
            this.selected = selected;
            if (!this._container) {
                return this;
            }
            if (selected) {
                L.DomUtil.addClass(this._container, this.options.selectedClass);
            } else {
                L.DomUtil.removeClass(this._container, this.options.selectedClass);
            }
            return this;
        },
        getLatLngBounds: function () {

        },
        setDraggable: function (draggable) {
            this.options.draggable = draggable;
            if (draggable) {
                if (!this.dragging) {
                    if (L.Handler.LabelDrag) {
                        this.dragging = new L.Handler.LabelDrag(this);
                    } else {
                        return this;
                    }
                }
                this.dragging.enable();
            } else {
                if (this.dragging) {
                    this.dragging.disable();
                }
            }
            this._update();
            return this;
        },

        setBgColor: function (color) {
            this.options.bgColor = color;
            this._update();
            return this;
        },

        _onMouseClick: function (e) {
            if (this._map.dragging && this._map.dragging.moved()) { return; }

            this._fireMouseEvent(e);
        },

        _fireMouseEvent: function (e) {
            if (!this.hasEventListeners(e.type)) { return; }

            var map = this._map,
                containerPoint = map.mouseEventToContainerPoint(e),
                layerPoint = map.containerPointToLayerPoint(containerPoint),
                latlng = map.layerPointToLatLng(layerPoint);

            this.fire(e.type, {
                latlng: latlng,
                layerPoint: layerPoint,
                containerPoint: containerPoint,
                originalEvent: e
            });

            if (e.type === 'contextmenu') {
                L.DomEvent.preventDefault(e);
            }
            if (e.type !== 'mousemove') {
                L.DomEvent.stopPropagation(e);
            }
        },

        close: function () {
            var map = this._map;

            if (map) {
                map._label = null;

                map.removeLayer(this);
            }
        },

        _initLayout: function () {
            var selectedClass = this.selected ? " " + this.options.selectedClass : '';
            this._container = L.DomUtil.create('div', 'leaflet-label ' + this.options.className + selectedClass + ' leaflet-zoom-animated');
        },

        _updateContent: function () {
            if (!this._content) { return; }

            if (typeof this._content === 'string') {
                if (this._oldHtml !== this._content) {
                    this._oldHtml = this._content;
                    this._container.innerHTML = this._content;
                }
                if (this._calculatedOffset) {
                    L.Point.cache(this._calculatedOffset);
                }
                this._calculatedOffset = this.options.offset.add(this.calculateLabelOffset());
            }
        },
        openOn: function (map) {
            map.showLabel(this);
            return this;
        },
        _updateLayout: function () {
            var container = this._container,
                style = container.style,
                width;

            style.width = '';
            style.whiteSpace = 'nowrap';
            width = this.getDimension().width;
            width = Math.min(width, this.options.maxWidth);
            width = Math.max(width, this.options.minWidth);

            style.width = (width + 1) + 'px';
            style.whiteSpace = '';

            style.height = '';
            this._container.style.color = this.options.color;
            this._container.style.background = this.options.bgColor;
        },

        _updatePosition: function () {
            if (this._map) {
                var pos = this._map.latLngToLayerPoint(this._latlng);
                this._setPosition(pos);
            }
        },

        _setPosition: function (pos) {
            this._calculatedOffset = this._calculatedOffset || this.options.offset.add(this.calculateLabelOffset());
            pos = pos.add(this._calculatedOffset);
            this._containerBottom = pos.y;
            this._containerLeft =  pos.x;

            L.DomUtil.setPosition(this._container, pos);
        },

        _zoomAnimation: function (opt) {
            var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);

            this._setPosition(pos);
        },
        setOffset: function (offset) {
            offset = L.point(offset);
            if (this.options.offset) {
                if (L.point(this.options.offset).distanceTo(offset) < 1) {
                    return;
                }
                L.Point.cache(this.options.offset);
            }
            delete this.options.offset;
            this.options.offset = offset;
            this._update();
        },
        getLatLng: function () {
            return this._latlng;
        },
        //NEW POPUP
        openPopup: function (e) {
            if (this._popup && this._map) {
                this._popup.setLatLng(e.latlng);
                this._map.openPopup(this._popup);
            }

            return this;
        },

        closePopup: function () {
            if (this._popup) {
                this._popup._close();
            }
            return this;
        },

        bindPopup: function (content, options) {
            var anchor = L.point(0, -10);

            anchor = anchor.add(L.PopupGis.prototype.options.offset);

            if (options && options.offset) {
                anchor = anchor.add(options.offset);
            }

            options = L.extend({offset: anchor}, options);

            if (!this._popup) {
                this
                    .on('mouseover', this.openPopup, this)
                    .on('mouseout', this.closePopup, this)
                    .on('move', this._movePopup, this);
            }

            this._popup = new L.PopupGis(options, this)
                .setContent(content);

            return this;
        },

        unbindPopup: function () {
            if (this._popup) {
                this._popup = null;
                this
                    .off('mouseover', this.openPopup)
                    .off('mouseout', this.closePopup)
                    .off('move', this._movePopup);
            }
            return this;
        },

        _movePopup: function (e) {
            this._popup.setLatLng(e.latlng);
        }
    });
    L.PopupGis.CACHE_DIMENSION = {};
}());