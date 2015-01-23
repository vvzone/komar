(function (L) {
    "use strict";
    var oldSetPos = L.Marker.prototype._setPos,
        oldClosePopup = L.Marker.prototype.closePopup,
        oldOpenPopup = L.Marker.prototype.openPopup;

    var oldOnRemove = L.Marker.prototype.onRemove,
        oldsetLatLng = L.Marker.prototype.setLatLng;
    L.Handler.MarkerDragGis = L.Handler.MarkerDrag.extend({
        _onDrag: function () {
            var marker = this._marker,
                shadow = marker._shadow,
                iconPos = L.DomUtil.getPosition(marker._icon).add(marker._calculateOffset()).round(),
                latlng = marker._map.layerPointToLatLng(iconPos);

            // update shadow position
            if (shadow) {
                L.DomUtil.setPosition(shadow, iconPos);
            }
            marker._latlng = latlng;

            marker
                .fire('move', {latlng: latlng})
                .fire('drag');
        }
    });
    L.MarkerGis = L.Marker.extend({});
    L.MarkerGis.include(L.CaptionBehavior);
    L.MarkerGis.include({
        options: {
            selectedClass: 'gis-selected',
            angle: 0,
            position: "topleft",
            labelPosition: "topleft"
        },
        setClickable: function (clickable) {
            if (this.options.clickable !== clickable) {
                this.options.clickable = clickable;
                if (this._map && clickable) {
                    this._initClickable();
                } else if (this._map) {
                    this._deInitClickable();
                }
            }
        },
        _initClickable: function () {
            if (!this.options.clickable) { return; }

            var icon = this._icon,
                events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'],
                i,
                len;

            if (this.options.icon.setClickable) {
                this.options.icon.setClickable(true);
            } else {
                L.DomUtil.addClass(icon, 'gis-clickable');
            }
            L.DomEvent.on(icon, 'click', this._onMouseClick, this);

            for (i = 0, len = events.length; i < len; i += 1) {
                L.DomEvent.on(icon, events[i], this._fireMouseEvent, this);
            }

        },
        _deInitClickable: function () {
            var icon = this._icon,
                events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'],
                i,
                len;


            if (this.options.icon.setClickable) {
                this.options.icon.setClickable(false);
            } else {
                L.DomUtil.removeClass(icon, 'gis-clickable');
            }
            L.DomEvent.off(icon, 'click', this._onMouseClick, this);

            for (i = 0, len = events.length; i < len; i += 1) {
                L.DomEvent.off(icon, events[i], this._fireMouseEvent, this);
            }
        },
        //добавлена обработка ситуации с svg
        _initIcon: function () {
            var options = this.options,
                map = this._map,
                animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
                classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide',
                needOpacityUpdate = false,
                panes;

            if (!this._icon) {
                this._icon = options.icon.createIcon();

                if (options.title) {
                    this._icon.title = options.title;
                }

                this._initInteraction();
                needOpacityUpdate = (this.options.opacity < 1);

                L.DomUtil.addClass(this._icon, classToAdd);

                if (options.riseOnHover) {
                    L.DomEvent
                        .on(this._icon, 'mouseover', this._bringToFront, this)
                        .on(this._icon, 'mouseout', this._resetZIndex, this);
                }
            }

            if (!this._shadow) {
                this._shadow = options.icon.createShadow();

                if (this._shadow) {
                    L.DomUtil.addClass(this._shadow, classToAdd);
                    needOpacityUpdate = (this.options.opacity < 1);
                }
            }

            if (needOpacityUpdate) {
                this._updateOpacity();
            }

            panes = this._map._panes;

            panes.markerPane.appendChild(this._icon);
            if (this._shadow) {
                panes.shadowPane.appendChild(this._shadow);
            }
            this.options.icon.on('load', this.update, this);
        },
        getContainerBounds: function () {
            var icon = this.options.icon,
                height = icon.getWidth() || 0,
                width = icon.getHeight() || 0,
                latLngTopLeft,
                latLngBottomRight,
                pos;
            pos = this._map.latLngToLayerPoint(this._latlng).subtract(this._calculateOffset()).round();

            latLngTopLeft = this._map.layerPointToLatLng(pos);
            latLngBottomRight = this._map.layerPointToLatLng(
                new L.Point(
                    pos.x + width,
                    pos.y + height
                )
            );
            return new L.LatLngBounds(latLngTopLeft, latLngBottomRight);
        },
        _removeIcon: function () {
            var panes = this._map._panes, pane;

            if (this.options.riseOnHover) {
                L.DomEvent
                    .off(this._icon, 'mouseover', this._bringToFront)
                    .off(this._icon, 'mouseout', this._resetZIndex);
            }

            pane = panes.markerPane;
            if (pane && this._icon) {
                pane.removeChild(this._icon);
            }

            if (this._shadow) {
                this._map._panes.shadowPane.removeChild(this._shadow);
            }

            this._deInitClickable();
            this._icon = this._shadow = null;
        },

        _initInteraction: function () {
            this._initClickable();
            this.setDraggable(this.options.draggable);
        },
        setDraggable: function (draggable) {
            if (L.Handler.MarkerDragGis) {
                if (this.dragging && this._oldIconDrag && this._oldIconDrag !== this._icon) {
                    this.dragging.disable();
                    this.dragging = new L.Handler.MarkerDragGis(this);
                }
                this._oldIconDrag = this._icon;
                this.dragging = this.dragging || new L.Handler.MarkerDragGis(this);


                this.options.draggable = draggable;
                if (this.options.draggable) {
                    this.dragging.enable();
                } else {
                    if (this.dragging) {
                        this.dragging.disable();
                    }
                }
            }
        },

        addClass: function (className) {
            this.options.icon.addClass(className);
        },
        setSelected: function (selected) {
            if (selected) {
                this.options.icon.addClass(this.options.selectedClass);
            } else {
                this.options.icon.removeClass(this.options.selectedClass);
            }
        },
        removeClass: function (className) {
            this.options.icon.removeClass(className);
        },

        getLabel: function () {
            return this._label;
        },
        _calculateLabelOffset: function () {
            return this._labelIconOffset().subtract(this._calculateOffset());
        },


        _labelIconOffset: function () {
            var icon = this.options.icon,
                width = icon.getWidth() || 0,
                height = icon.getHeight() || 0;
            return L.point(width, height);
        },
        setIcon: function (icon) {
            if (this.options.icon === icon) {
                return;
            }
            this._oldPosition = null;
            if (this._map) {
                this._removeIcon();
            }

            this.options.icon = icon;

            if (this._map) {
                this._initIcon();
                this.update();
            }

            return this;
        },

        updateLabelContent: function (content) {
            if (this._label) {
                this._label.setContent(content);
            }
        },

        getLabelLatLng: function () {
            return this._latlng;
        },
        update: function () {
            if (this._icon) {
                var pos = this._map.latLngToLayerPoint(this._latlng).subtract(this._calculateOffset()).round();
                this._setPos(pos);
            }
            if (this.options.icon) {
                if (this._label) {
                    this._label.setOffset(this._calculateLabelOffset());
                }
                if (this._popup) {
                    this._popup.setOffset(this._calculateLabelOffset().add([0, -this.options.icon.getHeight()]));
                }
            }
            return this;
        },
        _animateZoom: function (opt) {
            var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).subtract(this._calculateOffset());

            this._setPos(pos);
        },
        _calculateOffset: function () {
            if (this._oldIcon === this.options.icon && this._oldPosition && this.options.position === this._lastPosition && !isNaN(this._oldPosition.x) && !isNaN(this._oldPosition.y)) {
                return this._oldPosition;
            }
            this._oldIcon = this.options.icon;
            this._lastPosition = this.options.position;
            var icon = this.options.icon, result, width = icon.getWidth(), height = icon.getHeight(), position = this.options.position || 'bottomcenter';
            switch (position) {
            case "topright":
                result = L.point(width, 0);
                break;
            case "bottomright":
                result = L.point(width, height);
                break;
            case "bottomleft":
                result = L.point(0, height);
                break;
            case "bottomcenter":
                result = L.point(width / 2, height);
                break;
            case "topcenter":
                result = L.point(width / 2, 0);
                break;
            case "centerleft":
                result = L.point(0, height / 2);
                break;
            case "centerright":
                result = L.point(width, height / 2);
                break;
            case "center":
                result = L.point(width / 2, height / 2);
                break;
            default:
                result = L.point(0, 0);
            }
            if (!isNaN(result.x) && !isNaN(result.y) && width > 0 && height > 0) {
                this._oldPosition = result;
            }
            return result;
        },
        _setPos: function (pos) {
            var angle;
            oldSetPos.call(this, pos);
            if (this.options.angle) {
                angle = this.options.angle % 360;
                L.DomUtil.setRotate(this._icon, angle);

                if (this._shadow) {
                    L.DomUtil.setRotate(this._shadow, angle);
                }
            }
        },
        setAngle: function (angle) {
            this.options.angle = angle;
            this.update();
            return this;
        },
        setPosition: function (position) {
            this.options.position = position;
            this.update();
            return this;
        },

        //NEW POPUP
        bindPopup: function (content, options, hover) {
            var icon = this.options.icon,
                self = this,
                icoWidth = self.options.icon.getWidth(),
                anchor = L.point(icon.options.popupAnchor) || L.point(icoWidth / 2 || 0, 0);

            icon.on('load', function () {
                self._popup.setOffset(self._calculateLabelOffset().add([this.getWidth(), -this.getHeight()]));
                if (self._label) {
                    self._label.setIconOffset(self._labelIconOffset());
                }
            });
            anchor = anchor.add(L.PopupGis.prototype.options.offset);

            if (options && options.offset) {
                anchor = anchor.add(options.offset);
            }

            options = L.extend({offset: anchor}, options);

            if (!this._popup) {
                if (hover) {
                    this
                        .on('mouseover', this.openPopup, this)
                        .on('mouseout', this.closePopup, this);
                } else {
                    this
                        .on('click', this.openPopup, this)
                        .on('remove', this.closePopup, this);
                }
                this.on('move', this._movePopup, this);
            }

            this._popup = new L.PopupGis(options, this)
                .setContent(content);
            self._popup.setOffset(self._calculateLabelOffset().add([0, -icon.getHeight()]));
            return this;
        },
        openPopup: function () {
            if (this._timeout) {
                clearTimeout(this._timeout);
                this._timeout = undefined;
            } else {
                oldOpenPopup.call(this);
            }
            return this;
        },
        closePopup: function () {
            var self = this;
            clearTimeout(this._timeout);
            this._timeout = setTimeout(function () {
                self._timeout = undefined;
                oldClosePopup.call(self);
            }, 150);
            return this;
        },

        unbindPopup: function (hover) {
            if (this._popup) {
                this._popup = null;
                if (hover) {
                    this
                        .off('mouseover', this.openPopup)
                        .off('mouseout', this.closePopup);
                } else {
                    this
                        .off('click', this.openPopup)
                        .off('remove', this.closePopup);
                }
                this.off('move', this._movePopup);
            }
            return this;
        },

        _movePopup: function (e) {
            this._popup.setLatLng(e.latlng);
        },

        setLatLng: function (latlng) {
            L.LatLng.cache(this._latlng);
            return oldsetLatLng.call(this, latlng);
        },
        _deInitInteraction: function () {

            var icon = this._icon,
                events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'contextmenu'];

            if (icon) {
                L.DomEvent.off(icon, 'click', this._onMouseClick, this);
                L.DomEvent.off(icon, 'keypress', this._onKeyPress, this);

                for (var i = 0; i < events.length; i++) {
                    L.DomEvent.off(icon, events[i], this._fireMouseEvent, this);
                }
            }

            if (this.dragging) {
                this.dragging.disable();
            }
        },
//        _removeIcon: function () {
//            if (this.options.riseOnHover) {
//                L.DomEvent
//                    .off(this._icon, 'mouseover', this._bringToFront)
//                    .off(this._icon, 'mouseout', this._resetZIndex);
//            }
//
//            this._map._panes.markerPane.removeChild(this._icon);
//            this._deInitInteraction();
//            this._icon = null;
//        },
        onRemove: function (map) {
            if (this.getPosition && this.getPosition()) {
                L.Point.cache(this.getPosition());
            }
            L.LatLng.cache(this._latlng);
            oldOnRemove.call(this, map);
        }
    });

    L.markerGis = function (latlng, data) {
        return new L.MarkerGis(latlng, data);
    };
}(L));
