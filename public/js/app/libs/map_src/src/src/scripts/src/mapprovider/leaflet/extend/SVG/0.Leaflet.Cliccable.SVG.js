/**
 * Created with JetBrains PhpStorm.
 */
(function (L) {
    "use strict";
    L.ClickableSvg = function (proto) {
        var oldInit;
        if (proto && proto._initEvents) {
            oldInit = proto._initEvents;
        }
        return {
            _initEvents: function () {
                if (oldInit) {
                    oldInit.apply(this, arguments);
                }
                this._initClickable();
                this.setDraggable(this.options.draggable);
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
                if (L.Path.SVG) {
                    if (!this.options.clickable) {
                        return;
                    }

                    if (L.Path.SVG) {
                        this._path.setAttribute('class', 'leaflet-clickable gis-clickable');
                    }

                    L.DomEvent.on(this._container, 'click', this._onMouseClick, this);

                    var events = ['dblclick', 'mousedown', 'mouseover',
                        'mouseout', 'mousemove', 'contextmenu'], i, len;
                    for (i = 0, len = events.length; i < len; i += 1) {
                        L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this);
                    }
                }

            },
            _deInitClickable: function () {
                if (L.Path.SVG) {
                    if (this.options.clickable) {
                        return;
                    }

                    if (L.Path.SVG) {
                        this._path.setAttribute('class', '');
                    } else if (!L.Browser.svg && L.Browser.canvas) {

                    }

                    L.DomEvent.off(this._container, 'click', this._onMouseClick, this);

                    var events = ['dblclick', 'mousedown', 'mouseover',
                        'mouseout', 'mousemove', 'contextmenu'], i, len;
                    for (i = 0, len = events.length; i < events.length; i += 1) {
                        L.DomEvent.off(this._container, events[i], this._fireMouseEvent, this);
                    }
                }
            }
        };
    };
}(L));