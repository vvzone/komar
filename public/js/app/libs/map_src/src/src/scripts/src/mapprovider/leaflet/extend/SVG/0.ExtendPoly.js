/**
 * Created with JetBrains PhpStorm.
 */
(function (L) {
    "use strict";
    L.PolylineExtend = {
        options: {
            className: undefined
        },
        _updateStyle: function () {
            L.Path.prototype._updateStyle.call(this);
        },
        setClassName: function (className) {
            this.removeClass(this.options.className);
            if (className) {
                this.addClass(className);
            }
            this.options.className = className;
        },
        addClass: function (className) {
            var classNameOld;
            if (L.Path.SVG && this._path) {
                classNameOld = this._path.getAttribute('class');
                if (classNameOld) {
                    return this._path.setAttribute('class', classNameOld.trim() + " " + className);
                }
                return this._path.setAttribute('class', className);
            }
        },
        removeClass: function (className) {
            if (this._path && this._path.getAttribute('class')) {
                return this._path && this._path.setAttribute('class', (this._path.getAttribute('class').replace(className, '')).trim());
            }
        },

        //опорная точка для фиксации веремещения
        getLatLng: function () {
            return this.getMiddleLatLng();
        },

        _diff: function (pos) {
            var latLng = this.getMiddleLatLng();
            return [pos.lat - latLng.lat, pos.lng - latLng.lng];
        },
        setLayerPosition: function (pos) {
            this.increaseLatLngs(this._diff(this._map.layerPointToLatLng(pos)));
            return this.redraw();
        },
        increaseLatLngs: function (diff) {
            var id,
                latlngs = this._latlngs,
                lat = diff[0],
                lng = diff[1];
            for (id in latlngs) {
                if (latlngs.hasOwnProperty(id)) {
                    latlngs[id].lat = latlngs[id].lat + lat;
                    latlngs[id].lng = latlngs[id].lng + lng;
                }
            }
        },
        getMiddleLatLng: function () {
//            var minMax;
//            minMax = this.getMinMaxLatLng();
//            return L.latLng((minMax.max.lat + minMax.min.lat) / 2, (minMax.max.lng + minMax.min.lng) / 2);
            return this._latlngs[0];
        },
        setDraggable: function (draggable) {
            if (L.Path.SVG) {
                var opts = this.options || this._options;
                opts.draggable = !!draggable;
                if (L.Handler.SvgDrag) {
                    if (opts.draggable) {
                        this.dragging = new L.Handler.SvgDrag(this);
                        this.dragging.enable();
                    } else if (this.dragging) {
                        this.dragging.disable();
                        this.dragging = undefined;
                    }
                }
            }
        }
    };
}(L));